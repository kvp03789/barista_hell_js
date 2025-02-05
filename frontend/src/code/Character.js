import { Spritesheet, AnimatedSprite } from "pixi.js";
import { playerSpritesheetData, characterIdleData, charcterRunRightData, charcterRunLeftData, characterRunDownData, characterRunUpData } from "../json/character/characterSpriteData";
import { spritesAreColliding } from "../utils";
import { Inventory, Equipment, QuickBar } from "./ItemsInventoryEquipment.js";
import { ANIMATION_SPEED, NPC_DIALOGUE_DISTANCE, PLAYER_SETTINGS } from "../settings.js";
import { DropShadowFilter } from "pixi-filters";


export default class Character{
    constructor(app, keysObject, spritesheetAssets, weaponAssets, iconAssets){
        this.app = app
        this.keysObject = keysObject
        this.spritesheetAssets = spritesheetAssets
        this.weaponAssets = weaponAssets
        this.iconAssets = iconAssets

        //stats
        this.maxHealth = PLAYER_SETTINGS.MAX_HEALTH
        this.currentHealth = this.maxHealth

        //movement
        this.speed = PLAYER_SETTINGS.BASE_SPEED

        this.stairSpeed = this.speed - 2 
        
        //movement vector
        this.movement = { x: 0, y: 0 };

        this.currentAnimation = null

        this.mousePos = {x: 0, y: 0}

        this.keyboardCooldown = 0

        //if inCraftingPosition and player presses E, set to true and open
        //crafting window
        this.crafting = false

        //whether character is in position to craft or not
        this.inCraftingPosition = false

        //whether or not player is next to NPC
        this.inDialoguePosition = false

        //whether or not player is next to an "activatable" item
        this.inActivatePosition = false

        //inTooltipPosition gets set to true in handler function if
        //player is in crafting, dialogue, or activate positions
        this.inTooltipPosition = false

        //bool used for checking if player is already in dialogue, crafting, etc.
        this.busy = false  
        
        //used to stop movement when player is teleporting
        this.teleporting = false

        //bool to use for stairs to adjust speed
        this.isOnStairs = false
    }

    addSpriteToGroups = (group) => {
        group.addChild(this.sprite)
    }

    init = async (group, particleManager, playerSpawnPoint, obstacleSprites, bulletManager, inventory, equipment, quickBar) => {
        this.obstacleSprites = obstacleSprites
        this.bulletManager = bulletManager
        this.particleManager = particleManager
        
        //generateAnimations populates parts of characterData json-esque object
        const generateAnimations = playerSpritesheetData.generateAnimations.bind(playerSpritesheetData);
        generateAnimations(this.spritesheetAssets.PlayerSpritesheet);

        this.mainSpritesheet = new Spritesheet(this.spritesheetAssets.PlayerSpritesheet, playerSpritesheetData)
        await this.mainSpritesheet.parse()
        
        this.sprite = new AnimatedSprite(this.mainSpritesheet.animations.run_down)
        this.sprite.animationSpeed = ANIMATION_SPEED

        if(playerSpawnPoint){
            this.sprite.x = playerSpawnPoint.x 
            this.sprite.y = playerSpawnPoint.y 
        }
        else{
            this.sprite.x = this.x_pos
            this.sprite.y = this.y_pos
        }

        this.sprite.label = 'Character'
        this.sprite.hitboxWidth = this.sprite.width
        this.sprite.hitboxHeight = this.sprite.height - 10
        this.rect = this.sprite.getBounds()
        //initialize mousePos to prevent error
        this.mousePos = {x: this.sprite.x, y: this.sprite.y}

        // //initialize player inventory
        // this.inventory = new Inventory(this.app, this, this.weaponAssets, this.iconAssets)
        // //initialize player equipment, along with weaponSlots and equipmentSlots
        // this.equipment = new Equipment(this.app, this, this.weaponAssets, this.iconAssets)
        // //initialize player quick bar
        // this.quickBar = new QuickBar(this.app, this, this.weaponAssets)

        this.inventory = inventory
        console.log('ITS IN MY HAAAEEEAD', this.inventory)
        this.equipment = equipment
        this.quickBar = quickBar
        //test populates called here because they rely on char sprite position
        if(!this.inventory.testPopulateComplete)this.inventory.testPopulate()
        if(!this.equipment.testPopulateComplete)this.equipment.testPopulate()

        this.weaponSlots = this.equipment.weaponSlots
        this.equipmentSlots = this.equipment.equipmentSlots
        //set active weapon index
        this.activeWeaponIndex = 0
        this.activeWeapon = this.weaponSlots[this.activeWeaponIndex].item

        this.sprite.filters = [new DropShadowFilter({offset: {x: 5, y: 10}, alpha: 1 })]
        
        // //add character sprite to visible sprite group
        this.addSpriteToGroups(group)

        //add active weapon sprite to stage as child of character
        this.sprite.addChild(this.activeWeapon.sprite)
        //
        // this.app.stage.on('pointerdown', this.mouseDown)
        this.sprite.play()
    }

    mouseDown = () => {
        if(this.activeWeapon){
            // this.activeWeapon.fire()
            this.bulletManager.fireWeapon(this.activeWeapon, this.angle, this.sprite.x, this.sprite.y)
        }
    }

    //returns bool if a non movement key is pressed
    isKeyPressed = () => {
        if(
            // this.keysObject[69] || //e key
            this.keysObject[16] || //left shift key
            this.keysObject[81] //q key
        ){
            return true
        }
        else return false
    }

    handleActionKeyPress = () => {
        
        if(this.keysObject[16]){
            console.log("LSHIFT key pressed!")
        }
        else if(this.keysObject[81])
            console.log("Q key pressed!")
            this.setActiveWeaponIndex()
    }

    setActiveWeaponIndex = () => {
        //first change the activeWeaponIndex
        this.activeWeaponIndex == 0 ? this.activeWeaponIndex = 1 : this.activeWeaponIndex = 0
        //remove old weapon sprite from character sprite
        this.sprite.removeChild(this.activeWeapon.sprite)
        //set new active weapon
        this.activeWeapon = this.weaponSlots[this.activeWeaponIndex].item
        //add active weapon to stage as child of character sprite
        this.sprite.addChild(this.activeWeapon.sprite)
    }

    handleDirection = (angle) => {
        let newTextures = null;
    
        // determine direction based on angle
        //DOWN
        if (angle >= 45 && angle <= 135) {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.sprite.stop()
                newTextures = this.mainSpritesheet.animations.idle_down;
                this.sprite.play()
            }else newTextures = this.mainSpritesheet.animations.run_down;        
        } 
        //LEFT
        else if (angle >= 135 || angle <= -135) {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.sprite.stop()
                newTextures = this.mainSpritesheet.animations.idle_left;
                this.sprite.play()
            }else newTextures = this.mainSpritesheet.animations.run_left;
        } 
        //UP
        else if (angle >= -135 && angle <= -45) {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.sprite.stop()
                newTextures = this.mainSpritesheet.animations.idle_up;
                this.sprite.play()
            }else newTextures = this.mainSpritesheet.animations.run_up;
        } 
        //RIGHT
        else {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.sprite.stop()
                newTextures = this.mainSpritesheet.animations.idle_right;
                this.sprite.play()
            }else newTextures = this.mainSpritesheet.animations.run_right;
        }

        // update animation based on movement
            // play the current movement animation
        if (this.sprite.textures !== newTextures) {
            this.sprite.textures = newTextures;
            this.sprite.play();
        }
    }    

    handleMovement = (angle) => {
        this.movement.x = 0;
        this.movement.y = 0;
        
    
        // If keys are pressed, update movement
        if (this.keysObject[87]) { // W key
            this.movement.y = -1;
        }
        if (this.keysObject[65]) { // A key
            this.movement.x = -1;
        }
        if (this.keysObject[83]) { // S key
            this.movement.y = 1;
        }
        if (this.keysObject[68]) { // D key
            this.movement.x = 1;
        }
    
        // Normalize movement vector if moving diagonally
        if (this.movement.x !== 0 && this.movement.y !== 0) {
            const length = Math.sqrt(this.movement.x ** 2 + this.movement.y ** 2);
            this.movement.x /= length;
            this.movement.y /= length;
        }
    
        // Update character position
        this.sprite.x += this.movement.x * this.speed;
        this.checkCollision('horizontal');
        this.sprite.y += this.movement.y * this.speed;
        this.checkCollision('vertical');
    };
    
    checkCollision = (direction) => {
        //the hitbox of the char sprite
        const spriteBounds = {
            x: this.sprite.x,
            y: this.sprite.y,
            width: this.sprite.hitboxWidth,
            height: this.sprite.hitboxHeight 
        }
    
        if (direction === 'horizontal') {
            this.obstacleSprites.children.forEach(obstacle => {
                const obstacleHitboxBounds = {
                    x: (obstacle.x) ,
                    y: (obstacle.y) ,
                    width: obstacle.width ,
                    height: obstacle.height - 10 
                }
    
                if (spritesAreColliding(spriteBounds, obstacleHitboxBounds)) {
                    if (this.movement.x > 0) { // moving right
                        this.sprite.x = obstacleHitboxBounds.x - spriteBounds.width; // snap to the left of the obstacle
                    } else if (this.movement.x < 0) { // moving left
                        this.sprite.x = obstacleHitboxBounds.x + obstacleHitboxBounds.width; // snap to the right of the obstacle
                    }
                    this.movement.x = 0; // stop horizontal movement on collision
                }
            });
        } 
    
        if (direction === 'vertical') {
            this.obstacleSprites.children.forEach(obstacle => {
                const obstacleHitboxBounds = {
                    x: (obstacle.x) ,
                    y: (obstacle.y) ,
                    width: obstacle.width ,
                    height: obstacle.height - 10 
                }
    
                if (spritesAreColliding(spriteBounds, obstacleHitboxBounds)) {
                    if (this.movement.y > 0) { // moving down
                        this.sprite.y = obstacleHitboxBounds.y - spriteBounds.height; // snap to the top of obstacle
                    } else if (this.movement.y < 0) { // moving up
                        this.sprite.y = obstacleHitboxBounds.y + obstacleHitboxBounds.height; // snap to the bottom of obstacle
                    }
                    this.movement.y = 0; // stop horizontal movement on collision
                }
            });
        }
    }

    //function to check whether or not player is in crafting, dialogue, or activate 
    //positions. used for key press tooltips in UIManager.tooltipManager class
    handleSetInTooltipPosition = () => {
        if(this.inCraftingPosition || this.inDialoguePosition || this.inActivatePosition)this.inTooltipPosition = true
        else this.inTooltipPosition = false 
    }

    setAnimation(animationKey) {
        console.log('setting animation......')
        const newTextures = this.mainSpritesheet.animations[animationKey];
        if (newTextures && this.sprite.textures !== newTextures) {
            this.sprite.textures = newTextures;
            this.sprite.play();
        }
    }

    takeDamage = (enemy) => {
        this.currentHealth -= enemy.attackDamage
        console.log("took damage!")
    }


    run = (angle) => {
        //angle passed in from level class
        this.angle = angle
        this.activeWeapon.run(angle)

        //check for in tooltip position
        this.handleSetInTooltipPosition()

        //stairs check to slow movement
        if(this.isOnStairs)this.speed = this.stairSpeed
        else this.speed = PLAYER_SETTINGS.BASE_SPEED

        if(!this.teleporting){
            this.sprite.loop = true
            this.handleMovement(angle)
            this.handleDirection(angle)
        }
        else{
            this.sprite.loop = false
        }
          
        
        //cooldowns for key presses
        if(this.isKeyPressed() && this.keyboardCooldown == 0){
            this.handleActionKeyPress()
            this.keyboardCooldown = 20
        }
        if(this.keyboardCooldown !== 0){
            this.keyboardCooldown -= 1
        }
        this.keyboardCooldown

        //run the inventory, equipment, and quickBar
        //this keeps them up to date
        this.inventory.run()
    }
}
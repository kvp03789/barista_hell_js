import { Spritesheet, AnimatedSprite } from "pixi.js";
import { playerSpritesheetData, characterIdleData, charcterRunRightData, charcterRunLeftData, characterRunDownData, characterRunUpData } from "../json/character/characterSpriteData";
import { spritesAreColliding } from "../utils";
import { Inventory, Equipment, QuickBar } from "./ItemsInventoryEquipment.js";
import { ANIMATION_SPEED, NPC_DIALOGUE_DISTANCE } from "../settings.js";


export default class Character{
    constructor(app, keysObject, spritesheetAssets, itemAssets, x_pos, y_pos, obstacleSprites, bulletManager, particleManager, iconAssets, npcList){
        this.app = app
        this.keysObject = keysObject
        this.spritesheetAssets = spritesheetAssets
        this.itemAssets = itemAssets
        this.iconAssets = iconAssets

        this.bulletManager = bulletManager
        this.particleManager = particleManager
        

        this.x_pos = x_pos
        this.y_pos = y_pos

        //movement
        this.speed = 7
        
        //movement vector
        this.movement = { x: 0, y: 0 };

        this.currentAnimation = null

        this.obstacleSprites = obstacleSprites

        this.mousePos = {x: 0, y: 0}

        this.keyboardCooldown = 0

        //character is in position to craft or not
        this.inCraftingPosition = false
        //if inCraftingPosition and player presses E, set to true and open
        //crafting window
        this.crafting = false

        //bool based on if player is within dialogue distance to npc
        this.touchingNPC = false        
    }

    addSpriteToGroups = (group) => {
        group.addChild(this.sprite)
    }

    init = async (group, particleManager) => {
        //generateAnimations populates parts of characterData json-esque object
        const generateAnimations = playerSpritesheetData.generateAnimations.bind(playerSpritesheetData);
        generateAnimations(this.spritesheetAssets.PlayerSpritesheet);

        this.mainSpritesheet = new Spritesheet(this.spritesheetAssets.PlayerSpritesheet, playerSpritesheetData)
        await this.mainSpritesheet.parse()
        
        this.sprite = new AnimatedSprite(this.mainSpritesheet.animations.run_down)
        console.log("a wild debug appeared: ", this.sprite)
        this.sprite.animationSpeed = ANIMATION_SPEED;
        this.sprite.x = this.x_pos
        this.sprite.y = this.y_pos
        this.sprite.label = 'Character'
        this.sprite.hitboxWidth = this.sprite.width
        this.sprite.hitboxHeight = this.sprite.height - 10
        this.rect = this.sprite.getBounds()
        //initialize mousePos to prevent error
        this.mousePos = {x: this.sprite.x, y: this.sprite.y}
        //initialize player inventory
        this.inventory = new Inventory(this.app, this, this.itemAssets, this.iconAssets)
        //initialize player equipment, along with weaponSlots and equipmentSlots
        this.equipment = new Equipment(this.app, this, this.itemAssets, this.iconAssets)
        //initialize player quick bar
        this.quickBar = new QuickBar(this.app, this, this.itemAssets)
        this.weaponSlots = this.equipment.weaponSlots
        this.equipmentSlots = this.equipment.equipmentSlots
        //set active weapon index
        this.activeWeaponIndex = 0
        this.activeWeapon = this.weaponSlots[this.activeWeaponIndex].item
        
        //add character sprite to visible sprite group
        this.addSpriteToGroups(group)

        //add active weapon sprite to stage as child of character
        this.sprite.addChild(this.activeWeapon.sprite)
        //
        this.app.stage.on('pointerdown', this.mouseDown)
        this.sprite.play()

        console.log("heres the player inventory", this.inventory)
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
        // if(this.keysObject[69]){
        //     console.log("E key pressed!")
        //     if(this.inCraftingPosition){
        //         this.crafting = true
        //         console.log("opening crafting window...")
        //     }
        // }
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

    run = (angle) => {
        //angle passed in from level class
        this.angle = angle
        this.activeWeapon.run(angle)
        this.handleMovement(angle)
        this.handleDirection(angle)  
        
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
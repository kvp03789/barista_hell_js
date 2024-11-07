import { Spritesheet, AnimatedSprite } from "pixi.js";
import { characterIdleData, charcterRunRightData, charcterRunLeftData, characterRunDownData, characterRunUpData } from "../json/character/characterSpriteData";
import { spritesAreColliding } from "../utils";
import { Inventory, Equipment, QuickBar } from "./ItemsInventoryEquipment.js";

export default class Character{
    constructor(app, keysObject, spritesheetAssets, itemAssets, x_pos, y_pos, obstacleSprites, bulletManager, particleManager){
        this.app = app
        this.keysObject = keysObject
        this.spritesheetAssets = spritesheetAssets
        this.itemAssets = itemAssets
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
    }

    addSpriteToGroups = (group) => {
        group.addChild(this.sprite)
    }

    initIdleSpriteSheet = async () => {
        this.idle_spritesheet = new Spritesheet(
            this.spritesheetAssets.character_idle,
            characterIdleData
        )
        await this.idle_spritesheet.parse()
    }

    initIdleUpSpriteSheet = async () => {
        this.idle_up_spritesheet = new Spritesheet(
            this.spritesheetAssets.character_idle_up,
            characterIdleData
        )
        await this.idle_up_spritesheet.parse()
    }

    initIdleRightSpriteSheet = async () => {
        this.idle_right_spritesheet = new Spritesheet(
            this.spritesheetAssets.character_idle_right,
            characterIdleData
        )
        await this.idle_right_spritesheet.parse()
    }

    initIdleLeftSpriteSheet = async () => {
        this.idle_left_spritesheet = new Spritesheet(
            this.spritesheetAssets.character_idle_left,
            characterIdleData
        )
        await this.idle_left_spritesheet.parse()
    }

    initRunRightSpriteSheet = async () => {
        this.run_right_spritesheet = new Spritesheet(
            this.spritesheetAssets.character_run_right,
            charcterRunRightData
        )
        await this.run_right_spritesheet.parse()
    }

    initRunLeftSpriteSheet = async () => {
        this.run_left_spritesheet = new Spritesheet(
            this.spritesheetAssets.character_run_left,
            charcterRunLeftData
        )
        await this.run_left_spritesheet.parse()
    }

    initRunDownSpriteSheet = async () => {
        this.run_down_spritesheet = new Spritesheet(
            this.spritesheetAssets.character_run_down,
            characterRunDownData
        )
        await this.run_down_spritesheet.parse()
    }

    initRunUpSpriteSheet = async () => {
        this.run_up_spritesheet = new Spritesheet(
            this.spritesheetAssets.character_run_up,
            characterRunUpData
        )
        await this.run_up_spritesheet.parse()
    }

    init = async (group, particleManager) => {
        
        await this.initIdleSpriteSheet()
        await this.initIdleUpSpriteSheet()
        await this.initIdleRightSpriteSheet()
        await this.initIdleLeftSpriteSheet()
        await this.initRunRightSpriteSheet()
        await this.initRunLeftSpriteSheet()
        await this.initRunDownSpriteSheet()
        await this.initRunUpSpriteSheet()

        this.sprite = new AnimatedSprite(this.idle_spritesheet.animations.main)
        this.sprite.animationSpeed = 0.1666;
        this.sprite.x = this.x_pos
        this.sprite.y = this.y_pos
        this.sprite.label = 'Character'
        this.sprite.hitboxWidth = this.sprite.width
        this.sprite.hitboxHeight = this.sprite.height - 10
        this.rect = this.sprite.getBounds()
        //initialize mousePos to prevent error
        this.mousePos = {x: this.sprite.x, y: this.sprite.y}
        //initialize player inventory
        this.inventory = new Inventory(this.app, this, this.itemAssets)
        //initialize player equipment, along with weaponSlots and equipmentSlots
        this.equipment = new Equipment(this.app, this, this.itemAssets)
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
            this.keysObject[69] || //e key
            this.keysObject[16]    //left shift key
        ){
            return true
        }
        else return false
    }

    handleActionKeyPress = () => {
        if(this.keysObject[69]){
            console.log("E key pressed!")
            this.setActiveWeaponIndex()
        }
        else if(this.keysObject[16]){
            console.log("LSHIFT key pressed!")
        }
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
        //S KEY
        if (angle >= 45 && angle <= 135) {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.sprite.stop()
                newTextures = this.idle_spritesheet.animations.main;
                this.sprite.play()
            }else newTextures = this.run_down_spritesheet.animations.main;        
        } 
        //A KEY
        else if (angle >= 135 || angle <= -135) {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.sprite.stop()
                newTextures = this.idle_left_spritesheet.animations.main;
                this.sprite.play()
            }else newTextures = this.run_left_spritesheet.animations.main;
        } 
        //W KEY
        else if (angle >= -135 && angle <= -45) {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.sprite.stop()
                newTextures = this.idle_up_spritesheet.animations.main;
                this.sprite.play()
            }else newTextures = this.run_up_spritesheet.animations.main;
        } 
        //D KEY
        else {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.sprite.stop()
                newTextures = this.idle_right_spritesheet.animations.main;
                this.sprite.play()
            }else newTextures = this.run_right_spritesheet.animations.main;
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
    }
}
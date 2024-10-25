import { Spritesheet, AnimatedSprite } from "pixi.js";
import { characterIdleData, charcterRunRightData, charcterRunLeftData, characterRunDownData, characterRunUpData } from "../json/character/characterSpriteData";
import { spritesAreColliding } from "../utils";
import { Inventory, Equipment } from "./ItemsInventoryEquipment.js";

export default class Character{
    constructor(app, keysObject, spritesheetAssets, itemAssets, x_pos, y_pos, obstacleSprites, mousePos){
        this.app = app
        this.keysObject = keysObject
        this.spritesheetAssets = spritesheetAssets
        this.itemAssets = itemAssets

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

    init = async (group) => {
        
        await this.initIdleSpriteSheet()
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
        this.weaponSlots = this.equipment.weaponSlots
        this.equipmentSlots = this.equipment.equipmentSlots
        //set active weapon index
        this.activeWeaponIndex = 0
        this.activeWeapon = this.weaponSlots[this.activeWeaponIndex].item
        
        //add character sprite to visible sprite group
        this.addSpriteToGroups(group)

        //add active weapon sprite to stage as child of character
        this.sprite.addChild(this.activeWeapon.sprite)

        this.sprite.play()
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

    handleMovement = () => {
        this.movement.x = 0
        this.movement.y = 0
        let newAnimation = null

        //W key
        if(this.keysObject[87]){
            newAnimation = this.run_up_spritesheet.animations.main
            this.movement.y = -1
        }
        //A key
        if(this.keysObject[65]){
            newAnimation = this.run_left_spritesheet.animations.main
            this.movement.x = -1
        }
        //S key
        if(this.keysObject[83]){
            newAnimation = this.run_down_spritesheet.animations.main
            this.movement.y = 1
        }
        //D key
        if(this.keysObject[68]){
            newAnimation = this.run_right_spritesheet.animations.main
            this.movement.x = 1
        }

        //back to idle animation
        if(!this.keysObject[68] && !this.keysObject[83] && !this.keysObject[65] && !this.keysObject[87]){
            newAnimation = this.idle_spritesheet.animations.main
            this.movement.x = 0
            this.movement.y = 0    
        }

        //normalize the vector
        if(this.movement.x !== 0 && this.movement.y !== 0){
            let length = Math.sqrt(this.movement.x * this.movement.x + this.movement.y * this.movement.y)
            this.movement.x /= length
            this.movement.y /= length
        }

        //apply direction to speed while checking for collisions
        this.sprite.x += this.movement.x * this.speed
        this.checkCollision('horizontal')
        this.sprite.y += this.movement.y * this.speed
        this.checkCollision('vertical')

        //only change texture if different from currentAnimation
        if(newAnimation && this.currentAnimation !== newAnimation){
            this.sprite.textures = newAnimation
            this.sprite.play()
            this.currentAnimation = newAnimation
        }
    }
    
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
    
    getAngle = (mousePos) => {
        if(mousePos.x && mousePos.y){
            const dx = mousePos.x - this.sprite.x
            const dy = mousePos.y - this.sprite.y
            //calculate angle and convert from rads to degrees
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI
            return angle
        }
    }

    run = (mousePos) => {
        this.handleMovement()

        //update mousePos
        this.mousePos = mousePos    
        
        //cooldowns for key presses
        if(this.isKeyPressed() && this.keyboardCooldown == 0){
            this.handleActionKeyPress()
            this.keyboardCooldown = 20
        }
        if(this.keyboardCooldown !== 0){
            this.keyboardCooldown -= 1
        }
        this.keyboardCooldown

        //get angle for weapon sprite and char sprite rotation
        let angle = this.getAngle(mousePos)
        this.activeWeapon.run(angle)
    }
}
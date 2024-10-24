import { Spritesheet, AnimatedSprite, Texture, Assets, Application } from "pixi.js";
import { characterIdleData, charcterRunRightData, charcterRunLeftData, characterRunDownData, characterRunUpData } from "../json/character/characterSpriteData";
import { spritesAreColliding } from "../utils";
import { settings } from '../settings'

export default class Character{
    constructor(app, keysObject, spritesheetAssets, x_pos, y_pos, obstacleSprites){
        this.app = app
        this.keysObject = keysObject
        this.spritesheetAssets = spritesheetAssets

        this.x_pos = x_pos
        this.y_pos = y_pos

        //movement
        this.speed = 7
        this.dx = 0
        this.dy = 0
        
        //movement vector
        this.movement = { x: 0, y: 0 };

        this.currentAnimation = null

        this.obstacleSprites = obstacleSprites

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
        console.log('Character Sprite:', this.sprite);
        // this.sprite.scale.set(1.5, 1.5)
        // this.sprite.anchor.set(0.5)
        this.rect = this.sprite.getBounds()

        //add character sprite to visible sprite group
        this.addSpriteToGroups(group)

        this.sprite.play()
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

  
    // checkCollision = (direction) => {
    //     if (direction === 'horizontal') {
    //         // Check horizontal collision
    //         this.obstacleSprites.children.forEach(obstacle => {
    //             const obstacleBounds = obstacle.getBounds();
    //             // Adjust obstacle bounds based on camera offset
    //             obstacleBounds.x += this.obstacleSprites.offset.x;
    //             obstacleBounds.y += this.obstacleSprites.offset.y;
    
    //             const spriteBounds = this.sprite.getBounds();
    
    //             if (spritesAreColliding(spriteBounds, obstacleBounds)) {
    //                 console.log('DEBUG 1: ', this.sprite.x, this.sprite.y, obstacleBounds)
    //                 if (this.movement.x > 0) { // Moving right
    //                     this.sprite.x = obstacleBounds.x - spriteBounds.width; // prevent moving past the obstacle
    //                     this.movement.x = 0
    //                     this.movement.y = 0
    //                 }
    //                 if (this.movement.x < 0) { // Moving left
    //                     this.sprite.x = obstacleBounds.x + obstacleBounds.width; // prevent moving past the obstacle
    //                     this.movement.x = 0
    //                     this.movement.y = 0
    //                 }
    //                 console.log('DEBUG 2: ', this.sprite.x, this.sprite.y, obstacleBounds)
    //             }
    //         });
    //     } 

    //     if (direction === 'vertical') {
    //         // Check vertical collision
    //         this.obstacleSprites.children.forEach(obstacle => {
    //             const obstacleBounds = obstacle.getBounds();
    //             // Adjust obstacle bounds based on camera offset
    //             obstacleBounds.x += this.obstacleSprites.offset.x;
    //             obstacleBounds.y += this.obstacleSprites.offset.y;
    
    //             const spriteBounds = this.sprite.getBounds();
    //             if (spritesAreColliding(spriteBounds, obstacleBounds)) {
    //                 console.log('DEBUG 1: ', this.sprite.x, this.sprite.y, obstacleBounds)
    //                 if (this.movement.y > 0) { // Moving down
    //                     this.sprite.y = obstacleBounds.y - spriteBounds.height; // Prevent moving past the obstacle
    //                     this.movement.x = 0
    //                     this.movement.y = 0
    //                 }
    //                 if (this.movement.y < 0) { // Moving up
    //                     this.sprite.y = obstacleBounds.y + obstacleBounds.height; // Prevent moving past the obstacle
    //                     this.movement.x = 0
    //                     this.movement.y = 0
    //                 }
    //                 console.log('DEBUG 2: ', this.sprite.x, this.sprite.y, obstacleBounds)
    //             }
    //         });
    //     }
    // }
    
    checkCollision = (direction) => {
        const spriteBounds = {
            x: this.sprite.x ,
            y: this.sprite.y ,
            width: this.sprite.width ,
            height: this.sprite.height 
        }
    
        if (direction === 'horizontal') {
            this.obstacleSprites.children.forEach(obstacle => {
                const obstacleBounds = {
                    x: (obstacle.x) ,
                    y: (obstacle.y) ,
                    width: obstacle.width ,
                    height: obstacle.height 
                }
    
                if (spritesAreColliding(spriteBounds, obstacleBounds)) {
                    if (this.movement.x > 0) { // moving right
                        this.sprite.x = obstacleBounds.x - spriteBounds.width; // snap to the left of the obstacle
                    } else if (this.movement.x < 0) { // moving left
                        this.sprite.x = obstacleBounds.x + obstacleBounds.width; // snap to the right of the obstacle
                    }
                    this.movement.x = 0; // stop horizontal movement on collision
                }
            });
        } 
    
        if (direction === 'vertical') {
            this.obstacleSprites.children.forEach(obstacle => {
                const obstacleBounds = {
                    x: (obstacle.x) ,
                    y: (obstacle.y) ,
                    width: obstacle.width ,
                    height: obstacle.height 
                }
    
                if (spritesAreColliding(spriteBounds, obstacleBounds)) {
                    if (this.movement.y > 0) { // moving down
                        this.sprite.y = obstacleBounds.y - spriteBounds.height; // snap to the top of obstacle
                    } else if (this.movement.y < 0) { // moving up
                        this.sprite.y = obstacleBounds.y + obstacleBounds.height; // snap to the bottom of obstacle
                    }
                    this.movement.y = 0; // stop horizontal movement on collision
                }
            });
        }
    }
    

    run = () => {
        this.handleMovement()
    }
}
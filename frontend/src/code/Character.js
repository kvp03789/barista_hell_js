import { Spritesheet, AnimatedSprite, Texture, Assets, Application } from "pixi.js";
import { characterIdleData, charcterRunRightData, characterRunDownData, characterRunUpData } from "../json/character/characterSpriteData";

export default class Character{
    constructor(app, keysObject, spritesheetAssets, x_pos, y_pos){
        this.app = app
        this.keysObject = keysObject
        this.spritesheetAssets = spritesheetAssets

        this.x_pos = x_pos
        this.y_pos = y_pos

        //movement
        this.speed = 5
        this.dx = 0
        this.dy = 0

        this.currentAnimation = null
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

    init = async () => {
        
        await this.initIdleSpriteSheet()
        await this.initRunRightSpriteSheet()
        await this.initRunDownSpriteSheet()
        await this.initRunUpSpriteSheet()

        this.sprite = new AnimatedSprite(this.idle_spritesheet.animations.main)
        this.sprite.animationSpeed = 0.1666;
        this.sprite.anchor.set(0.5)
        this.sprite.x = this.x_pos
        this.sprite.y = this.y_pos
        this.sprite.scale.set(1.5, 1.5)
        this.sprite.anchor.set(0.5)

        this.rect = this.sprite.getBounds()

        this.app.stage.addChild(this.sprite)
        this.sprite.play()

        this.app.ticker.add(this.run)
        
    }

    run = () => {
        this.handleMovement()
    }

    handleMovement = () => {
        let newAnimation = null

        //W key
        if(this.keysObject[87]){
            newAnimation = this.run_up_spritesheet.animations.main
            this.sprite.scale.x = 1.5
            this.dy = -1
        }
        //A key
        if(this.keysObject[65]){
            newAnimation = this.run_right_spritesheet.animations.main
            this.sprite.scale.x = -1.5
            this.dx = -1
        }
        //S key
        if(this.keysObject[83]){
            newAnimation = this.run_down_spritesheet.animations.main
            this.sprite.scale.x = 1.5
            this.dy = 1
        }
        //D key
        if(this.keysObject[68]){
            newAnimation = this.run_right_spritesheet.animations.main
            this.sprite.scale.x = 1.5
            this.dx = 1
        }

        //back to idle animation
        if(!this.keysObject[68] && !this.keysObject[83] && !this.keysObject[65] && !this.keysObject[87]){
            newAnimation = this.idle_spritesheet.animations.main
            this.sprite.scale.x = 1.5
            this.dx = 0
            this.dy = 0    
        }

        //normalize the vector
        if(this.dx || this.dy){
            let length = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
            this.dx /= length
            this.dy /= length
        }

        //apply direction to speed
        this.sprite.x += this.dx * this.speed
        this.sprite.y += this.dy * this.speed
        
        //only change texture if different from currentAnimation
        if(newAnimation && this.currentAnimation !== newAnimation){
            this.sprite.textures = newAnimation
            this.sprite.play()
            this.currentAnimation = newAnimation
        }
        
    }
}
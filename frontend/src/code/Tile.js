import { Sprite, AnimatedSprite, Graphics, Point, Ellipse, ObservablePoint } from 'pixi.js'
import { ZOOM_FACTOR } from '../settings'
import { isPlayerInEllipse, spritesAreColliding } from '../utils'

export default class Tile extends Sprite{
    constructor(app, x_pos, y_pos, texture, label, group, bulletsPassThrough){
        super(texture)
        this.app = app
        this.x_pos = x_pos //initial x
        this.y_pos = y_pos //initial y
        this.label = label
        this.position.set(this.x_pos, this.y_pos)
        this.bulletsPassThrough = bulletsPassThrough
        this.addSpriteToGroup(group)
    }

    addSpriteToGroup = (group) => {
        if(group !== null)group.addChild(this)
    }
}

export class AnimatedTile extends AnimatedSprite{
    constructor(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters){
        super(texture)
        this.app = app
        this.x_pos = x_pos //initial x
        this.y_pos = y_pos //initial y
        this.label = label
        this.filters = filters
        this.group = group
        this.position.set(this.x_pos, this.y_pos)
        this.scale.set(scale)
        this.loop = true
        this.alpha = alpha
        this.animationSpeed = animationSpeed
        this.label = label
        this.play()
        //boolean to represent if tile has associated particle effect
        this.isParticleTile = isParticleTile
        this.addSpriteToGroup(group)

    }

    addSpriteToGroup = (group) => {
        if(group !== null)group.addChild(this)
        
    }
}

export class HellPortalObject extends AnimatedTile{
    constructor(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters, setState, spritesheet, collisionObject){
        super(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters)
        this.glowPulse = 0.01
        this.spritesheet = spritesheet

        this.isActivated = false
        this.activationStatus = 'idle'  //either 'idle' or 'activated'
        this.currentFrame = 0
        
        this.setState = setState

        //this is the object from tiled that represents where "collision box" of 
        // the portal is, aka where the player has to be to activate
        this.collisionObject = collisionObject
        this.collisionObject.center = {x: this.collisionObject.x + this.collisionObject.width / 2, y: this.collisionObject.y + this.collisionObject.height / 2}
        
        this.collisionObjectPolygon = new Graphics()
        this.group.addChild(this.collisionObjectPolygon)        

        this.collisionObjectPolygon.ellipse(
            0,
            0,
            this.collisionObject.width,
            this.collisionObject.height
        )
        this.collisionObjectPolygon.position.set(this.collisionObject.x*ZOOM_FACTOR + 195, this.collisionObject.y*ZOOM_FACTOR + 95)
        this.collisionObjectPolygon.fill(0xde3249)
        this.collisionObjectPolygon.label = "hell_collision_circle"
        //this alpha for debugging. should be 0
        this.collisionObjectPolygon.alpha = 0   
    }

    run(player) {
        const polygonX = this.collisionObjectPolygon.x
        const polygonY = this.collisionObjectPolygon.y

        // check if the player is inside the ellipse
        const playerIsInside = isPlayerInEllipse(player.sprite.x, player.sprite.y, polygonX, polygonY, this.collisionObjectPolygon.width / 2, this.collisionObjectPolygon.height / 2)
        
        if (playerIsInside) {
            console.log("player in portal!")
            this.isActivated = true
            this.activatePortal()  // activate the portal and change animation
        } else {
            this.isActivated = false
            this.deactivatePortal() // revert animation if player is not inside
        }
    }
    
    activatePortal = () => {
        if (!this.isActivated) return // prevent re-activating if already activated
        
        if(this.activationStatus == 'idle'){ //check if current animation is the idle one
            
            this.stop() // stop current animations
            this.textures = this.spritesheet.animations.activate // set the "activated" animation
            this.activationStatus = 'activated'
            this.play() // play the "activated" animation
            // this.setState("hell_overworld") new game state
        }
        
    }

    deactivatePortal = () => {
        if (this.isActivated) return // Prevent re-deactivating if already deactivated

        if(this.activationStatus == 'activated'){
            this.stop() // Stop any current animations

            // To reverse the animation:
            const currentFrameIndex = this.textures.findIndex(texture => texture === this.textures[this.currentFrame]);

            if (currentFrameIndex !== -1) {
                // Reverse the animation frames starting from the current frame
                const reversedFrames = this.textures.slice(0, currentFrameIndex + 1).reverse();
                this.textures = reversedFrames;  // Apply the reversed frames
                this.currentFrame = reversedFrames.length - 1;  // Track the current frame in the reversed sequence
                this.play() // Play the reversed animation
                this.onComplete = () => {
                    // Set back to the "idle" animation once reversed playback is done
                    this.textures = this.spritesheet.animations.idle; 
                    this.play(); // Play the "idle" animation
                    this.activationStatus = 'idle'
                    this.stop()
                }
            }
        }
    }
}

export class EspressoMachine extends AnimatedTile{
    constructor(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters){
        super(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters)

    }
}

export class Stairs extends Tile{
    constructor(app, x_pos, y_pos, texture, label, group, bulletsPassThrough){
        super(app, x_pos, y_pos, texture, label, group, bulletsPassThrough)

    }

    run = (player) => {
        if(spritesAreColliding(player.sprite, this)){
            player.isOnStairs = true
        }else player.isOnStairs = false
    }
}

export class PolygonCollisionShape extends Graphics {
    constructor(app, x, y, shapeWidth, shapeHeight, label, group, bulletsPassThrough) {
        super()
        this.app = app
        this.bulletsPassThrough = bulletsPassThrough
        // this.pivot.x = this.shapeWidth/2
        // this.pivot.y = this.shapeHeight/2
        this.xPos = x  
        this.yPos = y 
        this.shapeHeight = shapeHeight  * ZOOM_FACTOR
        this.shapeWidth = shapeWidth * ZOOM_FACTOR
        

        this.label = label
        this.group = group
        this.init()
    }

    init = () => {
    
        this.rect(this.xPos*ZOOM_FACTOR, this.yPos*ZOOM_FACTOR, this.shapeWidth, this.shapeHeight)
        this.fill(0x00ff00)
        // this.scale.set(ZOOM_FACTOR)
        this.group.addChild(this)
    }

    checkCollision(player) {
        // Use a library like SAT.js for polygon collisions or write your own
        return false // Placeholder
    }

    run = (offset) => {
        
    }
}

    

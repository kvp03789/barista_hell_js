import { Sprite, AnimatedSprite, Graphics, Point, Ellipse, ObservablePoint, Spritesheet, DisplacementFilter, Rectangle } from 'pixi.js'
import { ZOOM_FACTOR } from '../settings'
import { isPlayerInEllipse, spritesAreColliding } from '../utils'
import { AdvancedBloomFilter, BulgePinchFilter, GlowFilter, ReflectionFilter, ShockwaveFilter, TiltShiftFilter, TwistFilter, ZoomBlurFilter } from 'pixi-filters'
import { greenPortalSpriteData } from '../json/objects/objectsSpriteData'

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

export class PatrolTile extends Tile{
    constructor(app, x_pos, y_pos, texture, label, group, bulletsPassThrough, npcKey){
        super(app, x_pos, y_pos, texture, label, group, bulletsPassThrough)
        this.worldPosition = {x: x_pos, y: y_pos}
        this.npcKey = npcKey
        this.anchor.set(.5)
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

export class Torch extends AnimatedTile{
    constructor(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters, flameSpritesheet){
        super(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters)
        this.flameSpritesheet = flameSpritesheet
        this.torchFlame = new AnimatedSprite(this.flameSpritesheet.animations.main)
        this.torchFlame.label = "torch_flame"
        this.torchFlame.position.set(-3,0)
        this.addChild(this.torchFlame)
        this.torchFlame.animationSpeed = animationSpeed
        this.torchFlame.play()
        
        this.glowFilterSettings = {
            distance: 40,
            quality: 1,
            alpha: .3,
            outerStrength: 20,
            color: 0xbea85b,
        }
        this.glowFilter = new GlowFilter(this.glowFilterSettings)

        this.torchFlame.filters = [this.glowFilter, new ZoomBlurFilter({strength: 0.1, radius: 291, innerRadius: 5}), new TiltShiftFilter({ blur: 7, gradientBlur: 0})]
    }
}

export class HellPortalObject extends AnimatedTile {
    constructor(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters, setState, spritesheet, collisionObject) {
        super(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters)
        
        this.glowPulse = 0.01
        this.spritesheet = spritesheet

        this.isActivated = false
        this.activationStatus = 'idle' // 'idle' or 'activated'

        this.setState = setState

        this.collisionObject = collisionObject
        this.collisionObject.center = {
            x: this.collisionObject.x + this.collisionObject.width / 2,
            y: this.collisionObject.y + this.collisionObject.height / 2,
        }

        this.collisionObjectPolygon = new Graphics()
        this.group.addChild(this.collisionObjectPolygon)

        this.collisionObjectPolygon.ellipse(
            0,
            0,
            this.collisionObject.width,
            this.collisionObject.height
        )
        this.collisionObjectPolygon.position.set(this.collisionObject.x * ZOOM_FACTOR + 195, this.collisionObject.y * ZOOM_FACTOR + 95)
        this.collisionObjectPolygon.fill(0xde3249)
        this.collisionObjectPolygon.label = "hell_collision_circle"
        this.collisionObjectPolygon.alpha = 0 // Debugging alpha, should be 0.
    }

    run(player) {
        if(this.activationStatus == 'activated'){
            this.loop = false
        }
        else this.loop = true
        const polygonX = this.collisionObjectPolygon.x
        const polygonY = this.collisionObjectPolygon.y

        // Check if the player is inside the ellipse
        const playerIsInside = isPlayerInEllipse(
            player.sprite.x,
            player.sprite.y,
            polygonX,
            polygonY,
            this.collisionObjectPolygon.width / 2,
            this.collisionObjectPolygon.height / 2
        )

        if (playerIsInside && !this.isActivated) {
            this.isActivated = true
            this.activatePortal(player)
        } else if (!playerIsInside && this.isActivated) {
            this.isActivated = false
            this.deactivatePortal()
        }
    }

    activatePortal(player) {
        if (this.activationStatus === 'idle') {
            this.stop() // Stop current animation
            this.textures = this.spritesheet.animations.activate // Set "activated" animation
            this.activationStatus = 'activated'
            this.play()
    
            this.onComplete = () => {
                this.off('complete')
                console.log("TELEPORTING!!!")
                this.glowFilterSettings = {distance: 20, quality: 1, alpha: .4}
                this.glowFilter = new ZoomBlurFilter() //add glow filter to portal
                this.filters = [this.glowFilter]
                player.setAnimation('teleport') // trigger player's teleport animation
                player.sprite.onComplete = () => {
                    player.sprite.off('complete')
                    player.setAnimation('idle_down') // return to idle_down after teleport
                    player.teleporting = false // allow movement again
                    //change state
                    this.setState("hell_overworld") // state transition
                }
                player.teleporting = true
            }
        }
    }

    deactivatePortal() {
        if (this.activationStatus === 'activated') {
            this.stop() 
    
            // reverse the animation starting from the current frame
            const currentFrameIndex = this.textures.findIndex(
                texture => texture === this.textures[this.currentFrame]
            )
            const reversedFrames = this.textures.slice(0, currentFrameIndex + 1).reverse()
    
            this.textures = reversedFrames // change to reversed frames
            this.loop = false //shouldn't  loop reversed frames
            this.play()
    
            // listen for when reversed animation complete
            this.onComplete = () => {
                this.off('complete') // remove the listener to avoid duplicates
                // switch back to the idle animation
                this.textures = this.spritesheet.animations.idle // set to idle animation
                this.activationStatus = 'idle'
                this.loop = true // idle animation loops
                this.play()
            }
        }
    }
}

export class EspressoMachine extends AnimatedTile{
    constructor(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters){
        super(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters)

    }
}

class SirenPortal extends AnimatedSprite{
    constructor(texture){
        super(texture)
        this.animationSpeed = .2
        this.loop = false
        this.portalActivated = false
        this.filters = [new AdvancedBloomFilter(), new TwistFilter({radius: -100, angle: -1.75, offsetX: -50, offsetY: -10}), new GlowFilter({distance: 20, quality: 1, alpha: .3}), new ReflectionFilter()]
        
    }

    run = (player) => {
        //maintain portal scale so that not changed by YSortCameraSpriteGroup
        this.scale = 3
        if(spritesAreColliding(player.sprite, this))console.log("FUCK MAN")

    }
}

export class SirenStatue extends Tile{
    constructor(app, x_pos, y_pos, texture, label, group, bulletsPassThrough, portalSpritesheet, setState, keysObject){
        super(app, x_pos, y_pos, texture, label, group, bulletsPassThrough)
        this.portalSpritesheet = portalSpritesheet
        //setState function to change state
        this.setState = setState
        //keysObject for activating portal with keypress
        this.keysObject = keysObject
    }

    init = async () => {
        //generateAnimations populates parts of sprite data object
        const generateAnimations = greenPortalSpriteData.generateAnimations.bind(greenPortalSpriteData);
        generateAnimations(this.portalSpritesheet)
        //init portal's sprite
        this.greenPortalSpritesheet = new Spritesheet(this.portalSpritesheet,
            greenPortalSpriteData)
        await this.greenPortalSpritesheet.parse()

        this.portal = new SirenPortal(this.greenPortalSpritesheet.animations.activate)
        this.portal.label = 'siren_portal'
    }

    run = (player) => {
        this.portal.run(player)

        if(!this.portal.portalActivated){
            //set player activatable position for key tooltip
            if(spritesAreColliding(player.sprite, this)) player.inActivatePosition = true
            else player.inActivatePosition = false
            if(this.keysObject[69]){
                //activate portal when player touches statue
                if(spritesAreColliding(player.sprite, this) ){
                    this.addChild(this.portal)
                    this.portal.position.set(0, 100)
                    this.portal.loop = false
                    this.portal.play()
                    this.portal.onComplete = () => {
                        this.portal.textures = this.greenPortalSpritesheet.animations.on
                        this.portal.play()
                        this.portal.loop = true
                        this.portal.portalActivated = true
                    }  
                }
                
            }
        } else if(this.portal.portalActivated){
            player.inActivatePosition = false
            //teleport functionality
            if(spritesAreColliding(player.sprite, this.portal.getBounds()) ){
                this.setState("cafe_intro")
            }
        }
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

    

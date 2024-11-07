import { Sprite, AnimatedSprite, DisplacementFilter } from 'pixi.js'
import { ZOOM_FACTOR } from '../settings'
import { ReflectionFilter } from 'pixi-filters'

export default class Tile extends Sprite{
    constructor(app, x_pos, y_pos, texture, label, group){
        super(texture)
        this.app = app
        this.x_pos = x_pos //initial x
        this.y_pos = y_pos //initial y
        this.label = label
        this.position.set(this.x_pos, this.y_pos)
        this.addSpriteToGroup(group)
    }

    addSpriteToGroup = (group) => {
        group.addChild(this)
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
        this.position.set(this.x_pos, this.y_pos)
        this.scale.set(scale)
        this.loop = true
        this.alpha = alpha
        this.animationSpeed = animationSpeed;
        this.label = label
        console.log(`${this.label} filter: `, this.scale)
        this.play()
        //boolean to represent if tile has associated particle effect
        this.isParticleTile = isParticleTile
        this.addSpriteToGroup(group)

    }

    addSpriteToGroup = (group) => {
        group.addChild(this)
    }
}

export class HellPortalObject extends AnimatedTile{
    constructor(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters){
        super(app, x_pos, y_pos, texture, label, group, isParticleTile, animationSpeed, scale, alpha, filters)
        this.glowPulse = 0.01
        // this.displacementFilter = new ReflectionFilter()
        // this.filters.push(this.displacementFilter)
    }

    run = () => {
        //TO DO: ANIMATED GLOW FILTER ALPHA

        // console.log("pulse: ", this.glowPulse)
        // if(this.glowPulse < .50 ){
        //     this.glowPulse += .01
        // }
        // else this.glowPulse -= .01
        // this.filters[0].alpha = this.glowPulse
    }
}
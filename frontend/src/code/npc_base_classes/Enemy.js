import { NPC } from "./NPC"
import { ENEMY_SETTINGS, ZOOM_FACTOR } from "../../settings"
import { Graphics } from "pixi.js"

export class Enemy extends NPC {
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles, stateLabel, enemyKey) {
        super(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles, stateLabel)
        
        //all enemy stats come from ENEMY_SETTINGS in settings
        this.enemyKey = enemyKey
        this.animationSpeed = ENEMY_SETTINGS[this.enemyKey].animationSpeed
        this.maxHealth = ENEMY_SETTINGS[this.enemyKey].maxHealth
        //init enemy currentHeal to maxHealth
        this.currentHealth = this.maxHealth
        this.attackDamage = ENEMY_SETTINGS[this.enemyKey].attackDamage
        this.speed = ENEMY_SETTINGS[this.enemyKey].speed

        this.isAggroed = false
        this.targetPlayeer = false

        this.visionRadius = ENEMY_SETTINGS[this.enemyKey].visionRadius
        //circle representation of visionRadius for debugging aggro system
        this.visionRadiusCircle = new Graphics()
        this.visionRadiusCircle.label = "enemy_vision_radius"
        //dividing by zoom factor so that the debug circle size reflects real visionRadius
        this.visionRadiusCircle.circle(0 , 0, this.visionRadius / ZOOM_FACTOR) 
        this.visionRadiusCircle.stroke(0x0000ff)
        this.visionRadiusCircle.position.set(this.width / 2, this.height /2)
        this.visionRadiusCircle.visible = true
        this.addChild(this.visionRadiusCircle)

        
    }

    attack = (target) => {
        // Attack the player or another target
    }

    takeDamage = (amount) => {
        this.health -= amount
        if (this.health <= 0) {
            this.die()
        }
    }

    die = () => {
        // change textures array to despawn/die animation
        this.textures = this.spritesheet.animations.death
        this.loop = false
        this.play()
        this.onComplete = () => {
            this.destroy({ children: true })
            console.log("ENEMY DIED!!")
        }
    }

    onAggro = () => {
        console.log("YOU AGGROD AN ENEMY!")
    }

    onDisengage = () => {
        console.log("enemy disengaging....")
    }

    run = () => {
        this.handleMovement()
        this.handleAnimationChange()
    }

}
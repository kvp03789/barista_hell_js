import { NPC } from "./NPC"
import { ENEMY_SETTINGS } from "../../settings"
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

        this.visionRadius = ENEMY_SETTINGS[this.enemyKey].visionRadius
        //circle for debuggings
        this.visionRadiusCircle = new Graphics()
        this.visionRadiusCircle.label = "enemy_vision_radius"
        this.visionRadiusCircle.circle(0 , 0, this.visionRadius) 
        this.visionRadiusCircle.stroke(0x0000ff)
        this.visionRadiusCircle.position.set(this.width / 2, this.height /2)
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
        this.onComplete = this.destroy()
        console.log("ENEMY DIED!!")
    }
}
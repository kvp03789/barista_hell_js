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
        //init enemy currentHealth to maxHealth
        this.currentHealth = this.maxHealth
        this.attackDamage = ENEMY_SETTINGS[this.enemyKey].attackDamage
        this.speed = ENEMY_SETTINGS[this.enemyKey].speed
        this.attackSpeed = ENEMY_SETTINGS[this.enemyKey].attackSpeed
        this.attackRange = ENEMY_SETTINGS[this.enemyKey].attackRange

        this.canAttack = true
        this.attackCooldown = 1000 / this.attackSpeed //cooldown in ms

        this.isAggroed = false
        this.targetPlayer = false

        //whether or not the enemy's attack animation is playing
        this.isAttacking = false
        //same as isAttacking but for damage animation
        this.isTakingDamage = false

        this.visionRadius = ENEMY_SETTINGS[this.enemyKey].visionRadius
        //circle representation of visionRadius for debugging aggro system
        this.visionRadiusCircle = new Graphics()
        this.visionRadiusCircle.label = "enemy_vision_radius"
        //dividing by zoom factor so that the debug circle size reflects real visionRadius
        this.visionRadiusCircle.circle(0 , 0, this.visionRadius / ZOOM_FACTOR) 
        this.visionRadiusCircle.stroke(0x0000ff)
        this.visionRadiusCircle.position.set(this.width / 2, this.height /2)
        this.visionRadiusCircle.visible = true
        //for debugging only
        // this.addChild(this.visionRadiusCircle)
        
    }

    handleCooldowns = () => {
        if(!this.canAttack){
            if(this.attackCooldown > 0){
                this.attackCooldown -= 1
            }else {
                this.attackCooldown = 1000 / this.attackSpeed
                this.canAttack = true
            }
        }
    }

    attack = (player) => {
        if (!this.canAttack) return;
    
        const dx = player.sprite.x - this.x;
        const dy = player.sprite.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance <= this.attackRange) {
            this.canAttack = false
            this.isAttacking = true
            player.takeDamage(this)
            this.stop() // ensure animation resets
            this.textures = this.spritesheet.animations.attack
            this.loop = false
            this.gotoAndPlay(0) // start from first frame
    
            this.once("complete", () => {
                console.log("Attack animation finished")
                this.isAttacking = false
                this.textures = this.spritesheet.animations.idle
                this.loop = true
                this.gotoAndPlay(0)
            });
        }
        else if(distance > this.attackRange){
            this.loop = true
            this.canAttack = true
        }
    };
    

    takeDamage = (amount) => {
        console.log("u hit an enemy!")
        //to do --- change texture
        this.isTakingDamage = true
        this.stop() // ensure animation resets
        this.textures = this.spritesheet.animations.damage
        this.loop = false
        this.gotoAndPlay(0) // start from first frame

        this.once("complete", () => {
            console.log("damage animation finished")
            this.isTakingDamage = false
            this.textures = this.spritesheet.animations.idle_down
            this.loop = true
            this.gotoAndPlay(0)
        })

        //reduce health
        this.currentHealth -= amount
        if (this.currentHealth <= 0) {
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
        this.isAttacking = false
        this.isTakingDamage = false
        this.canAttack = false
        this.loop = true
        console.log("enemy disengaging....")
    }

    run = (player, deltaTime) => {
        this.deltaTime = deltaTime
        
        this.handleCooldowns()
        this.handleMovement()
        if(!this.isAttacking)this.handleAnimationChange()
        
        if(this.isAggroed) this.attack(player)
    }

}
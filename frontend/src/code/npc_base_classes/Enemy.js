import { NPC } from "./NPC"

export class Enemy extends NPC {
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles, stateLabel) {
        super(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles, stateLabel)
        //animation speed comes form settins
        this.animationSpeed = .2
        this.health = 100
        this.attackDamage = 10
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
        // Handle logic for the enemy's death
    }
}
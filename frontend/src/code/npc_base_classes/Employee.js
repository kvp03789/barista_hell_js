import { randomNumber } from "../../utils"
import { NPC } from "./NPC"

export class Employee extends NPC{
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles, stateLabel){
        super(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles, stateLabel)
    }
}

export class Robert extends Employee{

}

export class Sarah extends Employee {
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles){
        super(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles)
        this.patrols = true
        this.patrolling = false
        this.patrolTimer = 600
        this.randomAmountOfFrames = null
        this.tileToMoveTo = null
        this.tileIndex = 0

        this.isInDialogue = false

        //movement
        this.speed = 2
    }

    patrol = () => {
        if(!this.patrolling){
            if(!this.randomAmountOfFrames){
                this.randomAmountOfFrames = randomNumber(180, 400)
            }
            else {
                if(this.patrolTimer !== this.randomAmountOfFrames){
                    this.patrolTimer--

                }
                else if(this.patrolTimer === this.randomAmountOfFrames){
                    this.patrolling = true
                }
            }
        }

        else{
            if(!this.tileToMoveTo){
                //pick a tile to move to
                let randomTileIndex;
                do {
                    randomTileIndex = randomNumber(0, this.patrolTiles.length - 1);
                } while (randomTileIndex === this.tileIndex);
                this.tileIndex = randomTileIndex;
                this.tileToMoveTo = this.patrolTiles[this.tileIndex];
            }
            else if(this.tileToMoveTo){ 
                const adjustedTilePosition = { 
                    x: this.tileToMoveTo.x, 
                    y: this.tileToMoveTo.y 
                };
                
                if(!this.isCloseEnough(this.x, adjustedTilePosition.x)){
                    if(this.x < adjustedTilePosition.x){
                        //if sarah x less than tileX, increase sarah x
                        this.movement.x = 1
                    }
                    else if(this.x > adjustedTilePosition.x){
                        //else decrease sarah x
                        this.movement.x = -1
                    }
                }
                else if(!this.isCloseEnough(this.y, adjustedTilePosition.y)){
                    if(this.y < adjustedTilePosition.y){
                        //if sarah y less than tileY, increase sarah y
                        this.movement.y = 1
                    }
                    else if(this.y > adjustedTilePosition.y){
                        //else decrease sarah x
                        this.movement.y = -1
                    }
                }

                else if(this.isCloseEnough(this.x, adjustedTilePosition.x) && this.isCloseEnough(this.y, adjustedTilePosition.y)){
                    //reset everything
                    this.reset()
                }
            }
            
        }
    }

    reset = () => {
        this.movement.x = 0
        this.movement.y = 0
        this.patrolling = false
        this.patrolTimer = 600
        this.randomAmountOfFrames = null
        this.tileToMoveTo = null
    }

    //helper function to see if sarah npc is on tile
    isCloseEnough = (a, b, tolerance = 2) => {
        return Math.abs(a-b) <= tolerance
    }


    run = (player) => {
        if(!this.isInDialogue){
            this.patrol()
        }
        
        this.handleMovement()
        this.handleAnimationChange()
    }
}
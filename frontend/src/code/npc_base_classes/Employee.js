import { randomNumber } from "../../utils"
import { NPC } from "./NPC"

export class Employee extends NPC{
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, stateLabel){
        super(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, stateLabel)
        this.isInDialogue = false
        this.touchingPlayer = false
    }

    handleBeginDialogue = () => {
        this.isInDialogue = true
        console.log('debug!!! begin')
    }

    handleEndDialogue = () => {
        this.isInDialogue = false
        if(this.reset)this.reset()
    }

    run = (player) => {
        // if(!this.isInDialogue){
        //     this.patrol()
        // }
        
        // this.handleMovement()
        // this.handleAnimationChange()
        if(this.touchingPlayer){
            // console.log(this.touchingPlayer)
        }
    }
}

export class Robert extends Employee{

}

export class PatrollingEmployee extends Employee{
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, stateLabel, patrolTiles){
        super(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, stateLabel)
        this.patrols = true
        this.patrolling = false
        this.patrolTimer = 600
        this.randomAmountOfFrames = null
        this.tileToMoveTo = null
        this.tileIndex = 0

        this.isInDialogue = false

        //movement
        this.speed = 2

        //patrolTiles is an array of tiles where the npc will patrol
        this.patrolTiles = patrolTiles
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
                        //if employee x less than tileX, increase employee x
                        this.movement.x = 1
                    }
                    else if(this.x > adjustedTilePosition.x){
                        //else decrease employee x
                        this.movement.x = -1
                    }
                }
                else if(!this.isCloseEnough(this.y, adjustedTilePosition.y)){
                    if(this.y < adjustedTilePosition.y){
                        //if employee y less than tileY, increase employee y
                        this.movement.y = 1
                    }
                    else if(this.y > adjustedTilePosition.y){
                        //else decrease employee x
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

    //helper function to see if employee is on tile
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

export class Sarah extends PatrollingEmployee {
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles){
        super(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles)
        
    }

    
}
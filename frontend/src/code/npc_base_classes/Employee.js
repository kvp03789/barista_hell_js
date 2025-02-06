import { ZOOM_FACTOR } from "../../settings"
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
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, stateLabel, patrolPointsArray){
        super(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, stateLabel)
        this.patrols = true
        this.patrolling = false
        this.patrolTimer = 600
        this.randomAmountOfFrames = null
        this.pointToMoveTo = null

        //this is the index of the current point the npc is moving
        //towards
        this.pointIndex = null

        //dx is what the pointIndex is incremented by when deermining 
        // next poin. when npc reaches last point this.dx becomes -1
        //to make the npc move backwards through the points
        this.dx = 1

        this.isInDialogue = false

        //movement
        this.speed = 2

        //patrolPointsArray is an array of tiles where the npc will patrol
        this.patrolPointsArray = patrolPointsArray
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
            if(!this.pointToMoveTo){
                console.log("ipcking point to move to.....")
                //pick a point to move to
                //on very first move npc moves from its spawn
                //to first point
                if(this.pointIndex === null){
                    this.pointIndex = 0
                    this.pointToMoveTo = this.patrolPointsArray[this.pointIndex]
                }
                //first check if npc is at last point in patrolPointsArray
                else if(this.pointIndex >= this.patrolPointsArray.length - 1 && this.dx === 1){
                    this.dx = -1
                    //update pointIndex
                    this.pointIndex += this.dx
                    this.pointToMoveTo = this.patrolPointsArray[this.pointIndex]
                }
                else if(this.pointIndex === 0 && this.dx === -1){
                    this.dx = 1
                    //update pointIndex
                    this.pointIndex += this.dx
                    this.pointToMoveTo = this.patrolPointsArray[this.pointIndex]
                }
                else{
                    this.pointIndex += this.dx
                    this.pointToMoveTo = this.patrolPointsArray[this.pointIndex]
                }
                console.log("point picked!", this.pointToMoveTo)
            }
            //once a point is picked, begin patrol
            else if(this.pointToMoveTo){ 
                console.log("MOVING!")

                //adjust point  position to account for zoom
                const adjustedTilePosition = { 
                    x: this.patrolPointsArray[this.pointIndex].x, 
                    y: this.patrolPointsArray[this.pointIndex].y 
                }
                
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
        this.pointToMoveTo = null
    }

    //helper function to see if employee is on tile
    isCloseEnough = (a, b, tolerance = 2) => {
        return Math.abs(a-b) <= tolerance
    }

    run = (player) => {
        if(!this.isInDialogue){
            this.patrol()
            this.handleMovement()
            this.handleAnimationChange()
        }
        
    }
}

export class Sarah extends PatrollingEmployee {
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles){
        super(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles)
        
    }

    
}
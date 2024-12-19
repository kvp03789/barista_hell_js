import { AnimatedSprite, Spritesheet } from "pixi.js"
import { robertSpriteData, sarahSpriteData } from '../json/npc/npcSpriteData'
import { ANIMATION_SPEED, TILE_WIDTH, TILE_HEIGHT, ZOOM_FACTOR, NPC_DIALOGUE_DISTANCE } from "../settings"
import { randomNumber } from "../utils"

class NPC extends AnimatedSprite{
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles){
        super(initialTexture)
        this.app = app
        this.player = player
        this.spritesheet = spritesheet
        this.visibleSprites = visibleSprites
        this.obstacleSprites = obstacleSprites
        //patrolTiles is an optional array of tiles where the npc will patrol if
        //not stationary npc
        this.patrolTiles = patrolTiles

        this.isInDialogue = false
        
        //movement vector
        this.movement = { x: 0, y: 0 };

        this.currentAnimation = null


        this.label = label
        this.position.set(xPos, yPos)
        //animation speed comes form settins
        this.animationSpeed = ANIMATION_SPEED

        this.visibleSprites.addChild(this)
        this.play()

    }

    handleMovement = () => {
        // Normalize movement vector if moving diagonally
        if (this.movement.x !== 0 && this.movement.y !== 0) {
            const length = Math.sqrt(this.movement.x ** 2 + this.movement.y ** 2);
            if(length > 0){
                this.movement.x /= length;
                this.movement.y /= length;
            }
            
        }
    
        // Update character position
        this.x += this.movement.x * this.speed;
        // this.checkCollision('horizontal');
        this.y += this.movement.y * this.speed;
        // this.checkCollision('vertical');
    }

    handleAnimationChange = (angle) => {
        let newTextures = null;
    
        // determine direction based on angle
        //DOWN
        if (this.movement.y > 1) {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.stop()
                newTextures = this.spritesheet.animations.idle_down;
                this.play()
            }else newTextures = this.spritesheet.animations.run_down;        
        } 
        //LEFT
        else if (this.movement.x === -1) {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.stop()
                newTextures = this.spritesheet.animations.idle_left;
                this.play()
            }else newTextures = this.spritesheet.animations.run_left;
        } 
        //UP
        else if (this.movement.y < 0) {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.stop()
                newTextures = this.spritesheet.animations.idle_up;
                this.play()
            }else newTextures = this.spritesheet.animations.run_up;
        } 
        //RIGHT
        else {
            //check if idle
            if(this.movement.x == 0 && this.movement.y == 0){
                this.stop()
                newTextures = this.spritesheet.animations.idle_right;
                this.play()
            }else newTextures = this.spritesheet.animations.run_right;
        }

        // update animation based on movement
            // play the current movement animation
        if (this.textures !== newTextures) {
            this.textures = newTextures;
            this.play();
        }
    }    

    checkCollision = (direction) => {
        
    }

    handleBeginDialogue = () => {
        console.log("handle dialogue", this.label)
        this.isInDialogue = true
    }

    handleEndDialogue = () => {
        this.isInDialogue = false
        this.reset()
    }
}

class RobertNPC extends NPC{

}

class SarahNPC extends NPC {
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles){
        super(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles)
        this.patrols = true
        this.patrolling = false
        this.patrolTimer = 600
        this.randomAmountOfFrames = null
        this.tileToMoveTo = null
        this.tileIndex = 0

        //movement
        this.speed = 2
        console.log("SARAH DEBUG: patrol tiles: ", this.patrolTiles)
    }

    patrol = () => {
        if(!this.patrolling){
            if(!this.randomAmountOfFrames){
                this.randomAmountOfFrames = randomNumber(180, 400)
                // console.log(`SARAH DEBUG: randomAMountOfFrames generated: ${this.randomAmountOfFrames}`)
            }
            else {
                if(this.patrolTimer !== this.randomAmountOfFrames){
                    this.patrolTimer--
                    // console.log(`SARAH DEBUG: randomAMountOfFrames generated: ${this.randomAmountOfFrames} vs ${this.patrolTimer}`)

                }
                else if(this.patrolTimer === this.randomAmountOfFrames){
                    this.patrolling = true
                    console.log(' SARAH DEBUG: BEGINNING PATROL!!')
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
                console.log(`SARAH DEBUG: OK PICKED A TILE TO MOVE TO: ${this.tileToMoveTo.x}, ${this.tileToMoveTo.y}`)
            }
            else if(this.tileToMoveTo){ 
                const adjustedTilePosition = { 
                    x: this.tileToMoveTo.x, 
                    y: this.tileToMoveTo.y 
                };
                // console.log(`SARAH DEBUG: MOVING TOWARDS TILE: sarah position: ${this.x},${this.y} -- tile psition:  ${adjustedTilePosition.x},${adjustedTilePosition.y}, ${this.movement.x}, ${this.movement.y}`)
                
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
                    console.log("SARAH DEBUG: DESTINATION REACHED! RESETTING...")
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


export class NPCManager{
    constructor(app, npcSpritesheets, visibleSprites,  obstacleSprites){
        this.app = app
        // this.player = player
        this.visibleSprites = visibleSprites
        this.obstacleSprites = obstacleSprites

        this.npcSpritesheets = npcSpritesheets
        this.parsedAssetsObject = {}
        this.parseAssets()

        //list of all npc lists
        this.npcList = []
    }

    parseAssets = () => {
        for(let key in this.npcSpritesheets){
            if(key.startsWith("NPCSpritesheet_")){
                this.parsedAssetsObject[key.replace("NPCSpritesheet_", "")] = this.npcSpritesheets[key]
            }
        }
        console.log("SARAH DEBUG: ASSETS: ", this.parsedAssetsObject)
    }

    initRobertNPC = async () => {
        this.robertNPCSpritesheet = new Spritesheet(this.parsedAssetsObject.RobertSpritesheet,
            robertSpriteData)
        await this.robertNPCSpritesheet.parse()

        this.robertNPC = new AnimatedSprite(this.robertNPCSpritesheet.animations.idle)
        //add Robert npc to npc list
        this.npcList.push(this.robertNPC)
        this.robertNPC.position.set(1000, 600)
        this.visibleSprites.addChild(this.robertNPC)
        this.robertNPC.label = "robert_npc"
        this.robertNPC.scale.set(2)
        this.robertNPC.width = 170
        this.robertNPC.height = 125
        this.robertNPC.animationSpeed = ANIMATION_SPEED
        this.robertNPC.play()
    }

    initSarahNPC = async (sarahNPCTiles) => {
        //generateAnimations populates parts of characterData json-esque object
        const generateAnimations = sarahSpriteData.generateAnimations.bind(sarahSpriteData);
        generateAnimations(this.npcSpritesheets.SarahSpritesheet);

        //init sarah's sprite
        const sarahNPCSpritesheet = new Spritesheet(this.parsedAssetsObject.SarahSpritesheet,
            sarahSpriteData)
        await sarahNPCSpritesheet.parse()

        const xPos = sarahNPCTiles[2].x_pos
        const yPos = sarahNPCTiles[2].y_pos
        this.sarahNPC = new SarahNPC(this.app, this.player, this.visibleSprites,  this.obstacleSprites, sarahNPCSpritesheet, sarahNPCSpritesheet.animations.idle_down,xPos, yPos, "sarah_npc", sarahNPCTiles)
        //add sarah npc to npc list
        this.npcList.push(this.sarahNPC)
    }

    //this checks to see if player is close enough
    //with npc to begin dialogue. if so, player.touchingNPC set to true
    checkPlayerNPCCollision = (player, npc, tolerance = NPC_DIALOGUE_DISTANCE) => {
        return Math.abs(npc.x - player.sprite.x) <= tolerance && Math.abs(npc.y - player.sprite.y) <= tolerance
    }

    run = (player) => {
        this.npcList.forEach(child => {
            //execute all the npc's run functions
            if(child.run){
                child.run(player)
            }

            //run collision check with player for dialogue handling
            if(this.checkPlayerNPCCollision(player, child)){
                child.touchingPlayer = true
            }
            else{
                child.touchingPlayer = false
            }

        })
    }
}
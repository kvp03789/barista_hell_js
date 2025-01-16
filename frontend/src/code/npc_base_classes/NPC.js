import { AnimatedSprite } from "pixi.js"
import { ANIMATION_SPEED } from "../../settings"

//base class for all NPC types
//handles common behavior such as movement, animation changes, 
//and interaction mechanics like dialogue.
export class NPC extends AnimatedSprite{
    constructor(app, player, visibleSprites, obstacleSprites, spritesheet, initialTexture, xPos, yPos, label, patrolTiles, stateLabel){
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

        //this is for getting dialogue n stuff
        this.stateLabel = stateLabel
        
        //counter to determine which dialogue option the player should see
        this.dialogueOptionCounter = 0

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
        this.isInDialogue = true
    }

    handleEndDialogue = () => {
        this.isInDialogue = false
        this.reset()
    }
}
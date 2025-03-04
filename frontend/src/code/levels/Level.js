import Character from '../Character'
import YSortCameraSpriteGroup from '../YSortCameraSpriteGroup'
import ObstacleSpriteGroup from '../ObstacleSpriteGroup'
import Tile from '../Tile'
import NPCTilesGroup from '../NPCTilesGroup'
import { ClickEventManager } from '../ClickEventManager'
import { Container } from 'pixi.js'

export default class Level{
    constructor(app, keysObject, stateLabel, setState){
            this.app = app
            this.app.stage.interactive = true

            //delta time updated in run function
            this.deltaTime = 0

            //used for npc dialogue and other settings that must
            //change depending on game state
            this.stateLabel = stateLabel            
            
            //display height and width
            this.display_width = this.app.view.width
            this.display_height = this.app.view.height
            //"controller" object that manages keydown and up events
            this.keysObject = keysObject
            //sprite group/container
            
            
            
    
            //used when calculating angle of player
            this.offset = {x: 0, y:0}

            this.angle = null
        }
    
        // initMasterLevelContainer = () => {
        //     this.app.stage.addChild(this.levelMasterContainer)
        // }

        handleKeyDown = (e) => {
            this.keysObject[e.keyCode] = true
            //create walking particle
            if(this.character){
                if(this.character.movement.x !== 0 || this.character.movement.y !== 0){
                    this.particleManager.createAnimatedParticle(this.character.sprite.x, this.character.sprite.y, "CharacterWalkingParticle")
            }}
        }
    
        handleKeyUp = (e) => {
            this.keysObject[e.keyCode] = false
        }

        onMouseMove = (e) => {
            this.mousePos = e.data.global
        }

        setUpKeyEvents = () => {
            window.addEventListener("keydown", e => this.handleKeyDown(e))
            window.addEventListener("keyup", e => this.handleKeyUp(e))
            console.log(`key events set up: ${this.stateLabel}`)

        }

        removeKeyEvents = () => {
            window.removeEventListener("keydown", this.handleKeyDown);
            window.removeEventListener("keyup", this.handleKeyUp);
            console.log(`key events removed: ${this.stateLabel}`)
        }

        getPlayerAngle = (mousePos) => {
            if(mousePos.x && mousePos.y){
                
                this.offset.x = this.character.sprite.x + (this.character.sprite.width / 2) - (this.display_width / 2)
                this.offset.y = this.character.sprite.y + (this.character.sprite.height / 2) - (this.display_width / 2)
                const dx = mousePos.x - this.character.sprite.x - (this.character.sprite.width / 2)
                const dy = mousePos.y - this.character.sprite.y - (this.character.sprite.height / 2)
                
                //calculate angle and convert from rads to degrees
                const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    
                return angle
            }
        }
}
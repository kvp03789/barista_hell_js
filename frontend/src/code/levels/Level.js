import Character from '../Character'
import YSortCameraSpriteGroup from '../YSortCameraSpriteGroup'
import ObstacleSpriteGroup from '../ObstacleSpriteGroup'
import Tile from '../Tile'
import NPCTilesGroup from '../NPCTilesGroup'
import { ClickEventManager } from '../ClickEventManager'

export default class Level{
    constructor(app, keysObject, stateLabel, setState){
            this.app = app
            this.app.stage.interactive = true
            this.app.stage.on('mousemove', this.onMouseMove)
    
            //used for npc dialogue and other settings that must
            //change depending on game state
            this.stateLabel = stateLabel            
            
            //display height and width
            this.display_width = this.app.view.width
            this.display_height = this.app.view.height
            //"controller" object that manages keydown and up events
            this.keysObject = keysObject
            //sprite group/container
            this.visibleSprites = new YSortCameraSpriteGroup(this.app)
            this.obstacleSprites = new ObstacleSpriteGroup(this.app)
            this.npcTiles = new NPCTilesGroup(this.app)
            
            this.clickEventManager = new ClickEventManager(this.app, this.visibleSprites)
    
            //used when calculating angle of player
            this.offset = {x: 0, y:0}

        }
    
        handleKeyDown = (e) => {
            this.keysObject[e.keyCode] = true
            //create walking particle
            if(this.character.movement.x !== 0 || this.character.movement.y !== 0){
                this.particleManager.createAnimatedParticle(this.character.sprite.x, this.character.sprite.y, "CharacterWalkingParticle")
            }
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
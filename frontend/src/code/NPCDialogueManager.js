import { Container, Sprite } from "pixi.js"
import { NPC_DIALOGUE_DISTANCE, SCREEN_HEIGHT } from "../settings"

export default class NPCDialogueManaer{
    constructor(app, player, UIAssetsObject, uiContainer, npcList, stateLabel){
        this.app = app
        this.player = player
        this.UIAssetsObject = UIAssetsObject
        this.uiContainer = uiContainer
        //list of all npc's in current level. passed from NPCManager class
        this.npcList  = npcList
        //each level has a stateLabel for getting dialogue from settings
        this.stateLabel = stateLabel

        this.playerCanDialogue = {status: false, npc: null }

        //~UI STUFF~
        //the master container for npc dialogue. this is what is appended
        //to the uiContainer and holds all the text
        this.dialogueContainer = new Container()
        this.dialogueContainer.label = "Dialogue_Container"

        this.dialogueBackground = new Sprite(this.UIAssetsObject.UI_Dialogue_BG)
        this.dialogueBackground.position.set(0,0)
        this.dialogueBackground.label = "Dialogue_BG"

        this.dialogueContainer.addChild(this.dialogueBackground)
        this.dialogueContainer.position.set(0,300)
    }

    //this checks to see if player is close enough
    //with npc to begin dialogue. if so, player.touchingNPC set to true
    checkPlayerNPCCollision = (npc, tolerance = NPC_DIALOGUE_DISTANCE) => {
        return Math.abs(npc.x - this.player.sprite.x) <= tolerance && Math.abs(npc.y - this.player.sprite.y) <= tolerance
    }

    run = () => {
        //check npc collisions for handling dialogue
        this.npcList.forEach(npc => {
            if(this.checkPlayerNPCCollision(npc)){
                console.log("player touching npc: ")
                this.playerCanDialogue = {status: true, npc }
            }
            else{
                this.playerCanDialogue = {status: false, npc: null }
            }
        })
    }
}
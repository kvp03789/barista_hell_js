import { Container, Sprite, Text, TextStyle } from "pixi.js"
import { NPC_DIALOGUE, NPC_DIALOGUE_DISTANCE, NPC_DIALOGUE_SECTION_LENGTH, SCREEN_HEIGHT } from "../settings"

export default class NPCDialogueManager{
    constructor(app, player, UIAssetsObject, fonts, uiContainer, npcList, stateLabel){
        this.app = app
        this.player = player
        this.UIAssetsObject = UIAssetsObject
        this.fonts = fonts

        this.uiContainer = uiContainer
        //list of all npc's in current level. passed from NPCManager class
        this.npcList  = npcList
        //each level has a stateLabel for getting dialogue from settings
        this.stateLabel = stateLabel

        //the current dialogue text being displayed, unparsed. if none, set to null
        this.currentDialogueText = null
        this.parsedDialogue = null
        //which array index of parsed Dialogue to display
        //should be reset to 0
        this.currentDialogueCounter = 0

        this.playerCanDialogue = {status: false, npc: null }

        //~UI STUFF~
        //the master container for npc dialogue. this is what is appended
        //to the uiContainer and holds all the text
        this.dialogueContainer = new Container()
        this.dialogueContainer.label = "Dialogue_Container"

        this.dialogueBackground = new Sprite(this.UIAssetsObject.UI_Dialogue_BG)
        this.dialogueBackground.position.set(0,0)
        this.dialogueBackground.label = "Dialogue_BG"

        console.log('DEBUUUUUUUUUUUUUUUG JEEEEENKINSSS', this.fonts.DialogueFont)

        this.dialogueTextStyle = new TextStyle({
            // fontFamily: 'roboto',
            fontFamily: "Font_AdvancedPixel7",
            // dropShadow: {
            //     alpha: 0.5,
            //     angle: 2.1,
            //     blur: 4,
            //     color: '#cae0dd',
            //     distance: 10,
            // },
            fill: '#ffffff',
            stroke: { color: '#1d1f1e', width: 7, join: 'round' },
            fontSize: 18,
            fontWeight: 'lighter',
            alpha: 1
        })

        this.dialogueText = new Text("", this.dialogueTextStyle);
        this.dialogueText.position.set(20, 20); // Adjust for padding inside the box

        this.dialogueContainer.addChild(this.dialogueBackground, this.dialogueText)
        this.dialogueContainer.position.set(0,300)

        //whether or not dialogue is currently being show in the UI
        this.dialogueIsDisplaying = false

        //these are used for displaying dialogue 1 character at a time
        this.dialogueIsDisplaying = false;
        this.isTyping = false;
        this.typingInterval = null;
    }

    //this checks to see if player is close enough
    //with npc to begin dialogue. if so, player.touchingNPC set to true
    checkPlayerNPCCollision = (npc, tolerance = NPC_DIALOGUE_DISTANCE) => {
        return Math.abs(npc.x - this.player.sprite.x) <= tolerance && Math.abs(npc.y - this.player.sprite.y) <= tolerance
    }

    //helper function to parse dialogue. divides dialogue up into same length 
    //sections in an array
    parseDialogue = (dialogue, sectionLength = NPC_DIALOGUE_SECTION_LENGTH) => {
        if (typeof dialogue !== "string" || typeof sectionLength !== "number" || sectionLength <= 0) {
            throw new Error("Invalid input: dialogue must be a string and sectionLength a positive number.");
        }
    
        const words = dialogue.split(" ");
        const result = [];
        let currentSection = "";
    
        for (const word of words) {
            // check if adding the next word would exceed section length
            if ((currentSection + word).length + 1 > sectionLength) {
                result.push(currentSection.trim());
                currentSection = word + " ";
            } else {
                currentSection += word + " ";
            }
        }
    
        // push the last section if leftover content
        if (currentSection.trim()) {
            result.push(currentSection.trim());
        }
    
        return result;
    }

    displayLineCharacterByCharacter = () => {
        if (this.typingInterval) clearInterval(this.typingInterval);

        const line = this.parsedDialogue[this.currentDialogueCounter];
        this.dialogueText.text = "";
        let charIndex = 0;

        this.isTyping = true;
        this.typingInterval = setInterval(() => {
            if (charIndex < line.length) {
                this.dialogueText.text += line[charIndex];
                charIndex++;
            } else {
                clearInterval(this.typingInterval);
                this.isTyping = false;
            }
        }, 50); // Adjust speed here
    };

    handleBeginDialogue = (npc) => {
        this.dialogueIsDisplaying = true
        //this variable being true stops the player from moving
        this.player.isInDialogue = true

        //this function handles stopping the npc and is
        //called on the NPC class via the npcDialogueManager
        npc.handleBeginDialogue()

        //add the dialogue box to uiContainer
        this.uiContainer.addChild(this.dialogueContainer)

        //first check if there are any new dialogues left to show
        if(npc.dialogueOptionCounter < NPC_DIALOGUE[this.stateLabel][npc.label].DIALOGUE_TOTAL){
            npc.dialogueOptionCounter++
        }

        this.currentDialogueText = NPC_DIALOGUE[this.stateLabel][npc.label][npc.dialogueOptionCounter].text
     
        this.parsedDialogue = this.parseDialogue(this.currentDialogueText)
        
        console.log(this.parsedDialogue[this.currentDialogueCounter])

        this.displayLineCharacterByCharacter();
    }

    //this function helps to scroll through dialogue
    // handleDialogueContinue =  (npc) => {
    //     const maxDialogueIndex = this.parsedDialogue.length - 1
    //     if(this.currentDialogueCounter < maxDialogueIndex){
    //         this.currentDialogueCounter++
    //         console.log(this.parsedDialogue[this.currentDialogueCounter])
    //     }else this.handleEndDialogue(npc)

        
    // }

    handleDialogueContinue = (npc) => {
        if (this.isTyping) {
            clearInterval(this.typingInterval);
            this.dialogueText.text = this.parsedDialogue[this.currentDialogueCounter];
            this.isTyping = false;
        } else {
            const maxDialogueIndex = this.parsedDialogue.length - 1;
            if (this.currentDialogueCounter < maxDialogueIndex) {
                this.currentDialogueCounter++;
                this.displayLineCharacterByCharacter();
            } else {
                this.handleEndDialogue(npc);
            }
        }
    };

    handleEndDialogue = (npc) => {
        this.dialogueIsDisplaying = false
        this.player.isInDialogue = false
        this.currentDialogueText = null
        this.parsedDialogue = null
        this.currentDialogueCounter = 0
        npc.handleEndDialogue()
        this.uiContainer.removeChild(this.dialogueContainer)
    }

    run = () => {
        //check npc collisions for handling dialogue
        this.npcList.forEach(npc => {
            if(this.checkPlayerNPCCollision(npc)){
                this.playerCanDialogue = {status: true, npc }
            }
            else{
                this.playerCanDialogue = {status: false, npc: null }
            }
        })
    }
}
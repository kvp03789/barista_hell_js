import { AnimatedSprite, Container, Graphics, Sprite, Spritesheet, Text, TextStyle } from "pixi.js";
import { SCREEN_HEIGHT, SCREEN_WIDTH, UI_CLICK_COOLDOWN, UI_SETTINGS } from "../settings";
import { ipadTurnOnData } from "../json/ui/uiData";
import { AdjustmentFilter, CRTFilter, GlitchFilter, GlowFilter } from "pixi-filters";
import { ItemSlot } from "./ItemsInventoryEquipment";

export default class UIManager{
    constructor(app, player, uiAssets, keysObject){
        this.app = app
        this.player = player
        //raw assets that are loaded in assetsManifest 
        this.uiAssets = uiAssets
        this.keysObject = keysObject

        //things to do with click cooldown
        this.clicking = false
        this.clickCooldownTimer = UI_CLICK_COOLDOWN

        //things for keyboard cooldown
        this.keyboardCooldown = 20

        //display properties
        this.characterSheetDisplaying = false
        
        //object to hold parsed assets 
        this.assetsObject = {}

        this.uiContainer = new Container()
        this.uiContainer.zIndex = 100
        this.uiContainer.label = "ui_container"
    }

    handleClickCooldown = () => {
        if (this.clicking){
            if (this.clickCooldownTimer != 0){
                this.clickCooldownTimer -= 1
            }else if(this.clickCooldownTimer == 0) {
                this.clickCooldownTimer = UI_CLICK_COOLDOWN
                this.clicking = false
            }   
        }       
    }

    init = async () => {
        for(let key in this.uiAssets){
            if(key.startsWith("UI")){
                this.assetsObject[key] = this.uiAssets[key]
            }
        }
        
        //init health bar
        this.healthBar = new HealthBar(this.app, this.assetsObject.UI_HUDFullBG, this.player,  55, SCREEN_HEIGHT - this.assetsObject.UI_HUDHealthBar.height, this.uiContainer)

        //ipad/character sheet
        this.characterSheet = new CharacterSheet(this.app, this.clickCooldownTimer, this.clicking, this.assetsObject,this.uiContainer, this.player)

         //character inventory, items, and equipment slots
         this.quickBar = new QuickBarUI(this.app, this.player.quickBar.itemSlots, this.clickCooldown, this.clicking, this.assetsObject.UI_EmptyItemSlot, this.uiContainer)

    }     

    //returns bool if a non movement key is pressed
    isKeyPressed = () => {
        if(
            this.keysObject[67] || //c key
            this.keysObject[84]    //t key
        ){
            return true
        }
        else return false
    }

    handleKeyPress = () => {
        console.log("key pressed!!")
        if(this.keysObject[67]){
            this.characterSheetDisplaying = !this.characterSheetDisplaying
            if(this.characterSheetDisplaying){
                this.uiContainer.addChild(this.characterSheet)
            }
            else this.uiContainer.removeChild(this.characterSheet)
        }
    }

    run = () => {
        //cooldowns for key presses
        if(this.isKeyPressed() && this.keyboardCooldown == 0){
            this.handleKeyPress()
            this.keyboardCooldown = 20
        }
        if(this.keyboardCooldown !== 0){
            this.keyboardCooldown -= 1
        }

        this.characterSheet.run()
    }

}

class ItemSlot_UI extends Sprite{
    constructor(texture, xPos, yPos, index, item){
        super(texture)
        this.x = xPos
        this.y = yPos
        this.index = index
        this.item = item
        this.scale.set(1.5)
        this.interactive = true
        this.on("click", this.onClick)

        this.textStyle = new TextStyle({
            fontFamily: 'roboto',
            dropShadow: {
                alpha: 0.5,
                angle: 2.1,
                blur: 4,
                color: '#cae0dd',
                distance: 10,
            },
            fill: '#ffffff',
            stroke: { color: '#1d1f1e', width: 10, join: 'round' },
            fontSize: 10,
            fontWeight: 'lighter',
        })
        this.textContent = `${this.index + 1}`
        this.slotNumberText = new Text({style: this.textStyle, text: this.textContent})
        this.slotNumberText.x = -5
        this.slotNumberText.y = -5
        this.addChild(this.slotNumberText)
    }

    onClick = () => {
        console.log(`you clicked quick bar slot ${this.index}`)
    }
}

class QuickBarUI extends Container{
    constructor(app, playerQuickBarItemSlots, clickCooldown, clicking, emptySlotTexture, uiContainer){
        super()
        this.app = app  
        this.playerQuickBarItemSlots = playerQuickBarItemSlots
        this.emptySlotTexture = emptySlotTexture

        this.clickCooldown = clickCooldown
        this.clicking = clicking

        this.uiContainer = uiContainer

        this.init()
        this.uiContainer.addChild(this)
    }

    init = () => {
        this.playerQuickBarItemSlots.forEach((itemSlot, i) => {
            //if item slot empty, add empty slot sprite
            if(!itemSlot.item){
                const offset = 350
                const emptySlotSprite = new ItemSlot_UI(this.emptySlotTexture, offset + (i * (this.emptySlotTexture.width * 1.5 + UI_SETTINGS.PADDING)) , 517, i, itemSlot.item)
                console.log("this debug ", this )
                this.addChild(emptySlotSprite)
            }
            
        })
    }
}

class CharacterSheetNavButton extends Sprite{
    constructor(texture, x, y, direction, characterSheet){
        super(texture)
        this.x = x
        this.y = y
        this.direction = direction
        this.interactive = true
        this.characterSheet = characterSheet

        this.on("click", this.onClick)
        this.on("mouseover", this.mouseOver)
        this.on("mouseout", this.mouseOut)
    }

    onClick = () => {
        if(this.direction == 'left'){
            this.characterSheet.currentSceneIndex == 0 ? this.characterSheet.currentSceneIndex = this.characterSheet.scenes.length - 1 : this.characterSheet.currentSceneIndex -= 1  
        }
        else if (this.direction == 'right'){
            this.characterSheet.currentSceneIndex < this.characterSheet.scenes.length - 1 ? this.characterSheet.currentSceneIndex++ : this.characterSheet.currentSceneIndex = 0
        }
        //remove whats on the screen
        this.characterSheet.screenContents.removeChildren()
        //add new scene
        this.characterSheet.screenContents.addChild(this.characterSheet.scenes[this.characterSheet.currentSceneIndex])
    }

    mouseOver = () => {
        this.filters = [new GlowFilter({alpha: 0.6, color: '#95c6db'})]
    }

    mouseOut = () => {
        this.filters = []
    }
}

class CharacterSheet extends Container{
    constructor(app, clickCooldown, clicking, uiAssets, uiContainer, player){
        super()
        this.app = app
        this.uiAssets = uiAssets
        this.player = player

        this.clickCooldown = clickCooldown,
        this.clicking = clicking
        this.label = "character_sheet"
        this.scale.set(.75)

        //holds everything except the frame, for applying filters
        this.screenContents = new Container()

        this.frame = new Sprite(this.uiAssets.UI_IpadFrame)
        this.frame.x = (SCREEN_WIDTH / 2) - (this.frame.width / 2)
        this.frame.y = 50
        this.frame.label = "ipad_frame"

        //this is the screen of the ipad
        this.equipmentBG = new CharacterSheet_EquipmentScreen(this.uiAssets.UI_IpadEquipmentBG, 150, 67, this.player, this.uiAssets)
        this.statsBG = new CharacterSheet_StatsScreen(this.uiAssets.UI_IpadStatsBG, 150, 67, this.player, this.uiAssets)

        //filters for screenContents container
        this.CRTFilterTime = 0
        this.CRTFilter = new CRTFilter({animating: true, curvature: 0, seed: .38, vignettingAlpha: 0, lineWidth: 2.5, time: this.CRTFilterTime})

        this.glitchFilter = new GlitchFilter({
            animating: true,
            seed: 0.5,
            offset: -17,
            slices: 20,
        });
        this.screenContents.filters = [this.glitchFilter, this.CRTFilter];

        this.glitchCooldownTimer = this.getRandomCooldown(); // initialize the timer
        this.glitchActive = false; // track whether glitch is active

        this.uiContainer = uiContainer

        //for changing ipad scenes
        this.currentSceneIndex = 0
        this.scenes = [this.equipmentBG, this.statsBG]

        //nav arrows
        this.leftNavButton = new CharacterSheetNavButton(this.uiAssets.UI_IpadNavLeft, 150, 530, "left", this, this.player)
        this.rightNavButton = new CharacterSheetNavButton(this.uiAssets.UI_IpadNavRight, 550, 530, "right", this, this.player)

        //holds the nav arrows
        this.navContainer = new Container()
        this.navAdjustFilter = new AdjustmentFilter({gamma: 1.5, contrast: 0, green: 0.5, blue: 3, alpha: 0.6})
        this.navContainer.filters = [this.navAdjustFilter]

        this.navContainer.addChild(this.leftNavButton, this.rightNavButton)
        this.screenContents.addChild(this.equipmentBG)
        this.addChild(this.screenContents, this.frame, this.navContainer)
    }

    getRandomCooldown() {
        // get a random cooldown time between 5 to 10 seconds (in frames)
        return Math.floor(300 + Math.random() * 300) // 300 frames = 5 seconds at 60 fps
    }

    run = () => {
        // if the glitch is active, animate it briefly
        if (this.glitchActive) {
            this.glitchFilter.seed = Math.random();
            this.glitchFilter.offset = -5 + (Math.random() * 10 - 5);
            this.glitchFilter.slices = 20 + Math.floor(Math.random() * 3 - 1);
            
            // End the glitch after a short period
            if (this.glitchCooldownTimer <= 0) {
                this.glitchActive = false;
                this.glitchCooldownTimer = this.getRandomCooldown(); // Reset cooldown timer
            } else {
                this.glitchCooldownTimer -= 1; // Decrement timer
            }
        } else {
            // Countdown to the next glitch activation
            if (this.glitchCooldownTimer <= 0) {
                this.glitchActive = true;
                this.glitchCooldownTimer = Math.floor(30 + Math.random() * 30); // Glitch lasts for 0.5 to 1 second
            } else {
                this.glitchCooldownTimer -= 1;
            }
        }

        //animate CRT Filter
        this.CRTFilter.time < 20 ? this.CRTFilter.time +=.01 : this.CRTFilter.time = 0.00

        //animate nav arrows
    }
}

class CharacterSheet_StatsScreen extends Container {
    constructor(backgroundTexture, x, y, player, uiAssets){
        super()
        this.background = new Sprite(backgroundTexture)
        this.background.position.set(x, y)
        this.addChild(this.background)

        this.uiAssets = uiAssets
        this.player = player

        this.x = 0
        this.y = 0
        this.label = "stats_character_sheet_screen"
    }
}

class CharacterSheet_EquipmentScreen extends Container {
    constructor(backgroundTexture, x, y, player, uiAssets){
        super()
        this.background = new Sprite(backgroundTexture)
        this.background.position.set(x, y)
        this.addChild(this.background)
        
        this.uiAssets = uiAssets
        console.log("uuuuuuuuuuuiiiii", this.uiAssets)
        this.player = player

        this.x = 0
        this.y = 0
        this.label = "equipment_character_sheet_screen"
        this.init()
    }

    init = () => {
        // this.player.equipment.itemSlots.forEach((itemSlot, i) => {
        //     //if item slot empty, add empty slot sprite
        //     if(!itemSlot.item){
        //         const offset = 350
        //         const blankSlotTexture = this.uiAssets.UI_IpadEmptyCharacterSheetSlot
        //         const emptySlotSprite = new ItemSlot_UI(blankSlotTexture, offset + (i * (blankSlotTexture.width * 1.5 + UI_SETTINGS.PADDING)) , 517, i, itemSlot.item)
        //         this.addChild(emptySlotSprite)
        //     }
        // })
        const blankSlotTexture = this.uiAssets.UI_IpadEmptyCharacterSheetSlot

        const handsSlot = new ItemSlot_UI(blankSlotTexture, 509, 406, 0, null)
        const feetSlot = new ItemSlot_UI(blankSlotTexture, 529, 496, 1, null)
        const legsSlot = new ItemSlot_UI(blankSlotTexture, 272, 529, 2, null)
        const chestSlot = new ItemSlot_UI(blankSlotTexture, 257, 426, 3, null)
        const headSlot = new ItemSlot_UI(blankSlotTexture, 537, 171, 4, null)
        this.addChild(handsSlot, feetSlot, legsSlot, chestSlot, headSlot)
    }
}

class HealthBar extends Sprite{
    constructor(app, texture, player, xPos, yPos, uiContainer){
        super(texture)
        this.app = app
        this.player = player
        this.label = "health_bar"
        this.uiContainer = uiContainer

        this.x = xPos
        this.y = yPos

        
        //red circle that shows hp
        this.healthFill = new Graphics().circle( 157, 528, 51).fill('#8a0101')
        this.healthFill.label = "health_fill"

        this.uiContainer.addChild(this.healthFill, this)
    }
}
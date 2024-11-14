import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { SCREEN_HEIGHT, SCREEN_WIDTH, UI_CLICK_COOLDOWN, UI_SETTINGS } from "../settings";
import { AdjustmentFilter, CRTFilter, GlitchFilter, GlowFilter } from "pixi-filters";


export default class UIManager{
    constructor(app, player, uiAssets, keysObject, iconAssets, clickEventManager){
        this.app = app
        this.player = player

        this.clickEventManager = clickEventManager

        //raw assets that are loaded in assetsManifest 
        this.uiAssets = uiAssets
        this.iconAssets = iconAssets
        this.keysObject = keysObject

        //things to do with click cooldown
        this.clicking = false
        this.clickCooldownTimer = UI_CLICK_COOLDOWN

        //things for keyboard cooldown
        this.keyboardCooldown = 20

        //display properties
        this.characterSheetDisplaying = false
        this.inventoryDisplaying = false
        
        //object to hold parsed ui assets 
        this.UIAssetsObject = {}
        this.iconAssetsObject = {}

        this.uiContainer = new Container()
        // this.uiContainer.zIndex = 100
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
                this.UIAssetsObject[key] = this.uiAssets[key]
            }
        }
        for(let key in this.iconAssets){
            if(key.startsWith("Icon")){
                this.iconAssetsObject[key] = this.iconAssets[key]
            }
        }

        //--init all of the components of the UI--//
        //health bar
        this.healthBar = new HealthBar(this.app, this.UIAssetsObject.UI_HUDFullBG, this.player,  55, SCREEN_HEIGHT - this.UIAssetsObject.UI_HUDHealthBar.height, this.uiContainer)

        //ipad/character sheet
        this.characterSheet = new CharacterSheet(this.app, this.clickCooldownTimer, this.clicking, this.UIAssetsObject, this.uiContainer, this.player, this.clickEventManager, this.iconAssetsObject)

         //character inventory, items, and equipment slots
        this.quickBar = new QuickBarUI(this.app, this.player, this.player.quickBar.itemSlots, this.clickCooldown, this.clicking, this.iconAssetsObject.Icon_EmptyItemSlot, this.uiContainer, this.iconAssetsObject, this.clickEventManager)

         //inventory
        this.inventory = new InventoryUI(this.app, this.player, this.player.inventory.itemSlots, this.clickCooldown, this.clicking, this.UIAssetsObject, this.uiContainer, SCREEN_WIDTH - (this.UIAssetsObject.UI_InventoryBG.width + 20), 50, this.iconAssetsObject, this.clickEventManager)
         
    }     

    //returns bool if a non movement key is pressed
    isKeyPressed = () => {
        if(
            this.keysObject[67] || //c key
            this.keysObject[84] || //t key
            this.keysObject[73]    //i key
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

        if(this.keysObject[73]){
            this.inventoryDisplaying = !this.inventoryDisplaying
            if(this.inventoryDisplaying){
                this.uiContainer.addChild(this.inventory)
            }
            else this.uiContainer.removeChild(this.inventory)
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

        this.characterSheet.run(this.player)
        this.inventory.run(this.player)
        this.quickBar.run(this.player)
    }
    
}

class ItemSlot_UI extends Sprite{
    constructor(texture, emptyTexture, player, type, xPos, yPos, slotIndex, item, clickEventManager){
        super(texture)
        this.emptyTexture = emptyTexture
        
        this.player = player
        this.clickEventManager = clickEventManager
        //slotType refers to whether item slot is for inventory, quickBar, or equipment
        this.slotType = type
        this.x = xPos
        this.y = yPos
        this.slotIndex = slotIndex
        this.item = item
        this.quantity = 0
        this.scale.set(1.5)
        this.interactive = true
        this.on("click", this.onClick)

        this.quantityTextStyle = new TextStyle({
            fontFamily: 'roboto',
            dropShadow: {
                alpha: 0.5,
                angle: 2.1,
                blur: 4,
                color: '#cae0dd',
                distance: 10,
            },
            fill: '#ffffff',
            stroke: { color: '#1d1f1e', width: 7, join: 'round' },
            fontSize: 10,
            fontWeight: 'lighter',
            alpha: .5
        })
        this.quantityTextContent = `${this.quantity}`
        
        this.init()
        
    }

    init = () => {
        if(this.slotType === "quickBar"){
            this.slotNumberTextStyle = new TextStyle({
                fontFamily: 'roboto',
                dropShadow: {
                    alpha: 0.5,
                    angle: 2.1,
                    blur: 4,
                    color: '#cae0dd',
                    distance: 10,
                },
                fill: '#ffffff',
                stroke: { color: '#1d1f1e', width: 7, join: 'round' },
                fontSize: 7,
                fontWeight: 'lighter',
                alpha: .5
            })
            this.slotNumberTextContent = `${this.slotIndex + 1}`
            this.slotNumberText = new Text({style: this.slotNumberTextStyle, text: this.slotNumberTextContent})
            this.slotNumberText.x = -5
            this.slotNumberText.y = -5
            this.addChild(this.slotNumberText)
        }

        
        this.quantityText = new Text({style: this.quantityTextStyle, text: this.quantityTextContent})
        if(this.item){
            this.addChild(this.quantityText)
        }
    }

    onClick = () => {
        // if(!this.item){
        //     //if no item and no event in queue nothing happens
        //     if(!this.clickEventManager.currentEvent){
        //         return
        //     }
        //     //if no item and there is event in queue player is dropping item
        //     else if(this.clickEventManager.currentEvent){
        //         this.clickEventManager.handleDropClick(this)
        //     }
        // }
        // else {
        //     //if item in slot but there no current event player is picking up item
        //     if(!this.clickEventManager.currentEvent){
        //         this.clickEventManager.handlePickupClick(this)
        //     }
        //     //if item in slot and there IS current event player
        //     //is either swapping items or stacking
        //     else this.clickEventManager.handleStacksAndSwaps(this)
        // }
        this.clickEventManager.handleSlotClick(this)
        console.log("DEBUG player inventory: ", this.player.inventory.itemSlots)
    }

    run = () => {
        //keep contents of actual player inventory, equip, and char screen  
        //in sync with ui counterparts
        this.item = this.player[this.slotType].itemSlots[this.slotIndex].item
        this.quantity =  this.player[this.slotType].itemSlots[this.slotIndex].quantity

        //update textures 
        if(this.item){
            this.texture = this.item.texture
            //update the quantity text
            this.quantityText.text = `${this.quantity}`
            if(this.children.length === 0){
                this.addChild(this.quantityText)
            }
        }
        //remove quantity text if item becomes !item or quantity below 1
        else if((!this.item && this.children.length > 0) || this.quantity < 1){
            this.texture = this.emptyTexture
            this.removeChild(this.quantityText)
        }
    }
}

class InventoryUI extends Container{
    constructor(app, player, playerInventoryItemSlots, clickCooldown, clicking, UIAssetsObject, uiContainer, xPos, yPos, iconsAssetsObject, clickEventManager){
        super()
        this.app = app
        this.player = player
        this.playerInventoryItemSlots = playerInventoryItemSlots
        this.clickEventManager = clickEventManager
        this.clickCooldown = clickCooldown
        this.clicking = clicking

        this.UIAssetsObject = UIAssetsObject
        this.iconsAssetsObject = iconsAssetsObject
        this.uiContainer = uiContainer

        this.emptySlotTexture = this.iconsAssetsObject.Icon_EmptyItemSlot
        
        this.background = new Sprite(this.UIAssetsObject.UI_InventoryBG)
        this.background.x = 0
        this.background.y = 0
        this.addChild(this.background)

        this.label = "inventory_ui"
        this.x = xPos
        this.y = yPos

        this.init()
    }

    init = () => {
        this.playerInventoryItemSlots.forEach((itemSlot, i) => {
            const columns = 8
            const xPos = 30 + i % columns * (this.emptySlotTexture.width * 1.5 + UI_SETTINGS.PADDING) 
                const yPos = 20 + Math.floor(i / columns) * (this.emptySlotTexture.height * 1.5 + 10)
            //if item slot empty, add empty slot sprite
            if(!itemSlot.item){
                const slotSprite = new ItemSlot_UI(this.emptySlotTexture, this.emptySlotTexture, this.player, "inventory", xPos, yPos, i, itemSlot.item, this.clickEventManager)
                this.addChild(slotSprite)
            }else{
                const textureIdentifier = `Icon_${itemSlot.item.itemName}`
                const texture = this.iconsAssetsObject[textureIdentifier]
                const slotSprite = new ItemSlot_UI(texture, this.emptySlotTexture, this.player, "inventory", xPos, yPos, i, itemSlot.item, this.clickEventManager)
                this.addChild(slotSprite)
            }
        })
    }

    run = (player) => {
        this.children.forEach(child => {
            if(child.run){child.run(player)}
        })
    }
}

class QuickBarUI extends Container{
    constructor(app, player, playerQuickBarItemSlots, clickCooldown, clicking, emptySlotTexture, uiContainer, iconsAssetsObject, clickEventManager){
        super()
        this.app = app  
        this.player = player
        this.playerQuickBarItemSlots = playerQuickBarItemSlots
        this.clickEventManager = clickEventManager

        this.iconsAssetsObject = iconsAssetsObject
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
                const emptySlotSprite = new ItemSlot_UI(this.emptySlotTexture, this.emptySlotTexture, this.player, "quickBar", offset + (i * (this.emptySlotTexture.width * 1.5 + UI_SETTINGS.PADDING)) , 517, i, itemSlot.item, this.clickEventManager)
                this.addChild(emptySlotSprite)
            }
            
        })
    }

    run = (player) => {
        this.children.forEach(child => {
            if(child.run){child.run(player)}
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
    constructor(app, clickCooldown, clicking, uiAssets, uiContainer, player, clickEventManager, iconAssets){
        super()
        this.app = app
        this.uiAssets = uiAssets
        this.iconAssets = iconAssets
        this.player = player
        this.clickEventManager = clickEventManager

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
        this.equipmentBG = new CharacterSheet_EquipmentScreen(this.uiAssets.UI_IpadEquipmentBG, 150, 67, this.player, this.uiAssets, this.iconAssets)
        this.statsBG = new CharacterSheet_StatsScreen(this.uiAssets.UI_IpadStatsBG, 150, 67, this.player, this.uiAssets, this.iconAssets)

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

    run = (player) => {
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
    constructor(backgroundTexture, x, y, player, uiAssets, iconAssets){
        super()
        this.background = new Sprite(backgroundTexture)
        this.background.position.set(x, y)
        this.addChild(this.background)
        
        this.uiAssets = uiAssets
        this.iconAssets = iconAssets
        this.player = player

        this.x = 0
        this.y = 0
        this.label = "equipment_character_sheet_screen"
        this.init()
    }

    init = () => {
        const blankSlotTexture = this.iconAssets.Icon_EmptyCharacterSheetSlot

        const handsSlot = new ItemSlot_UI(blankSlotTexture, blankSlotTexture, this.player, "equipment", 509, 406, 0, null, this.clickEventManager)
        const feetSlot = new ItemSlot_UI(blankSlotTexture, blankSlotTexture, this.player, "equipment", 529, 496, 1, null, this.clickEventManager)
        const legsSlot = new ItemSlot_UI(blankSlotTexture, blankSlotTexture, this.player, "equipment", 272, 529, 2, null, this.clickEventManager)
        const chestSlot = new ItemSlot_UI(blankSlotTexture, blankSlotTexture, this.player, "equipment", 257, 426, 3, null, this.clickEventManager)
        const headSlot = new ItemSlot_UI(blankSlotTexture, blankSlotTexture, this.player, "equipment", 537, 171, 4, null, this.clickEventManager)
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
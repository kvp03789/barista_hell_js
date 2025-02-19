import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { SCREEN_HEIGHT, SCREEN_WIDTH, UI_CLICK_COOLDOWN, UI_SETTINGS, DRINK_RECIPES, ICON_SCALING } from "../settings";
import { AdjustmentFilter, CRTFilter, GlitchFilter, GlowFilter } from "pixi-filters";
import { Beans, CorruptedBlood, Ice, LargeFang, Milk, Syrup, WhippedCream } from "./item_classes/Materials";
import { TooltipManager } from "./TooltipManager";
import NPCDialogueManager from "./NPCDialogueManager";
import { ItemSlot } from "./ItemsInventoryEquipment";
import { Coffee, FelCoffee, FelFrappe, FelIcedCoffee, FelLatte, Frappe, IcedCoffee, Latte } from "./item_classes/Consumables";
import { getMillisecondsToSeconds } from "../utils";

export default class UIManager{
    constructor(app, player, uiAssets, fonts, keysObject, iconAssets, clickEventManager, mousePos, employees, stateLabel, enemyList, buffManager){
        this.app = app
        this.player = player

        this.app.stage.on('mousemove', this.onMouseMove)

        this.clickEventManager = clickEventManager

        //buff manager needed here for consumables that are inited in crafting
        this.buffManager = buffManager

        //raw assets that are loaded in assetsManifest 
        this.uiAssets = uiAssets
        this.iconAssets = iconAssets
        this.keysObject = keysObject

        this.fonts = fonts

        //things to do with click cooldown
        this.clicking = false
        this.clickCooldownTimer = UI_CLICK_COOLDOWN

        //things for keyboard cooldown
        this.keyboardCooldown = 20

        //display properties
        this.characterSheetDisplaying = false
        this.inventoryDisplaying = false
        this.craftingIsDisplaying = false
        this.dialogueIsDisplaying = false
        
        //object to hold parsed ui assets 
        this.UIAssetsObject = {}
        this.iconAssetsObject = {}

        this.uiContainer = new Container()
        // this.uiContainer.zIndex = 100
        this.uiContainer.label = "ui_container"

        this.mousePos = mousePos

        this.tooltipContainer = new Container()
        this.tooltipContainer.label = "tooltip_container"

        this.employees = employees

        this.enemyList = enemyList

        this.stateLabel = stateLabel
    }

    onMouseMove = (e) => {
        //keep mouse position updated
        this.mousePos = e.data.global
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
            if(key.includes("Icon_")){
                this.iconAssetsObject[key] = this.iconAssets[key]
            }
        }

        //--init all of the components of the UI--//
        
        //tooltip manager
        this.tooltipManager = new TooltipManager(this.app, this.UIAssetsObject.UI_Tooltip_BG_Texture, this.uiContainer, this.tooltipContainer, this.mousePos, this.UIAssetsObject)

        //health bar
        this.healthBar = new HealthBar(this.app, this.UIAssetsObject.UI_HUDFullBG, this.player,  55, SCREEN_HEIGHT - this.UIAssetsObject.UI_HUDHealthBar.height, this.uiContainer, this.tooltipManager)

        //ipad/character sheet
        this.characterSheet = new CharacterSheet(this.app, this.clickCooldownTimer, this.clicking, this.UIAssetsObject, this.uiContainer, this.player, this.clickEventManager, this.iconAssetsObject, this.uiManager, this.tooltipManager)

         //character inventory, items, and equipment slots
        this.quickBar = new QuickBarUI(this.app, this.player, this.player.quickBar.itemSlots, this.clickCooldown, this.clicking, this.iconAssetsObject.Icon_EmptyItemSlot, this.uiContainer, this.iconAssetsObject, this.clickEventManager, this.uiManager, this.tooltipManager)

         //inventory
        this.inventory = new InventoryUI(this.app, this.player, this.player.inventory.itemSlots, this.clickCooldown, this.clicking, this.UIAssetsObject, this.uiContainer, SCREEN_WIDTH - (this.UIAssetsObject.UI_InventoryBG.width + 20), 50, this.iconAssetsObject, this.clickEventManager, this.uiManager, this.tooltipManager)
        
        //crafting window
        this.craftingWindow = new CraftingWindowUI(this.app, this.player, this.clickCooldown, this.clicking, this.UIAssetsObject, this.uiContainer, SCREEN_WIDTH - (this.UIAssetsObject.UI_InventoryBG.width + 20), 50, this.iconAssetsObject, this.clickEventManager, this, this.tooltipManager, this.buffManager)

        //npc dialogue manager
        this.npcDialogueManager = new NPCDialogueManager(this.app, this.player, this.UIAssetsObject, this.fonts, this.uiContainer, this.employees, this.stateLabel)

        //enemy health bars
        this.enemyHealthBarManager = new EnemyHealthBarManager(this.app, this.enemyList, this.uiContainer, this.UIAssetsObject)

        //buff ui
        this.buffUIContainer = new Buff_UI_Container(this.app, this.player, 500, 0 + UI_SETTINGS.PADDING, this.uiContainer, this.tooltipManager)
    }     

    //returns bool if a non movement key is pressed
    isKeyPressed = () => {
        if(
            this.keysObject[67] || //c key
            this.keysObject[84] || //t key
            this.keysObject[73] || //i key
            this.keysObject[69]    //e key
        ){
            return true
        }
        else return false
    }

    handleKeyPress = () => {
        //c key
        if(this.keysObject[67]){
            this.characterSheetDisplaying = !this.characterSheetDisplaying
            if(this.characterSheetDisplaying){
                this.uiContainer.addChild(this.characterSheet)
            }
            else {
                //close window
                this.uiContainer.removeChild(this.characterSheet)
                //remove any tooltips just in case!
                this.tooltipManager.removeTooltip()
            }
        }
        //i key
        if(this.keysObject[73]){
            this.inventoryDisplaying = !this.inventoryDisplaying
            if(this.inventoryDisplaying){
                this.uiContainer.addChild(this.inventory)
            }
            else {
                //close inventory window
                this.uiContainer.removeChild(this.inventory)
                //remove any tooltips just in case!
                this.tooltipManager.removeTooltip()
            }
        }

        //e key
        if(this.keysObject[69]){
            //crafting
            if(this.player.inCraftingPosition){
                this.craftingIsDisplaying = !this.craftingIsDisplaying
                if(this.craftingIsDisplaying){
                    this.uiContainer.addChild(this.craftingWindow)
                }
                else {
                    //close window
                    this.uiContainer.removeChild(this.craftingWindow)
                    //remove any tooltips just in case
                    //remove any tooltips just in case!
                    this.tooltipManager.removeTooltip()
                }
            }

            //npc dialogue
            //~~npcDialogueManager.playerCanDialogue is an object with a property called status,  
            //a bool that is set based on player colliding with npc, and an npc property
            //that gets set to the NPC the player is near~~

            else if(this.npcDialogueManager.dialogueStatus.status){
                const npc = this.npcDialogueManager.dialogueStatus.npc
                console.log('HEY DONT TOUCH ME', npc)
                if(!this.npcDialogueManager.dialogueIsDisplaying){
                    //function on the NPCDialogueManager to handle begining dialogue
                    this.npcDialogueManager.handleBeginDialogue(npc)
                }
                else{
                    //if dialogue IS currently being displayed, pass control over
                    //to NpcDialogueManager to continue scrolling through dialogue or
                    //to close the window
                    this.npcDialogueManager.handleDialogueContinue(npc)
                }  
            }
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

        //automatically close crafting window if player walks away
        if(!this.player.inCraftingPosition){
            this.craftingIsDisplaying = false
            this.uiContainer.removeChild(this.craftingWindow)
        }

        //automatically close dialogue if player walks away from npc
        if(!this.npcDialogueManager.dialogueStatus.status){
            this.dialogueIsDisplaying = false
            if(this.dialogueIsDisplaying){
                this.uiContainer.removeChild(this.npcDialogueManager.dialogueContainer)
            }
        }

        this.craftingWindow.run()
        this.characterSheet.run(this.player)
        this.inventory.run(this.player)
        this.quickBar.run(this.player)
        this.tooltipManager.run(this.mousePos, this.player)
        this.npcDialogueManager.run(this.player)
        this.enemyHealthBarManager.run()
        this.healthBar.run()
        this.buffUIContainer.run()
    }
    
}

//item slot classes here represent the ui element only -
//each one corresponds to its "real" version on the player 
class ItemSlot_UI extends Sprite{
    constructor(texture, emptyTexture, player, type, xPos, yPos, slotIndex, item, clickEventManager, uiManager, tooltipManager){
        super(texture)

        this.emptyTexture = emptyTexture
        
        this.player = player
        this.clickEventManager = clickEventManager
        this.uiManager = uiManager
        this.tooltipManager = tooltipManager
        
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
        this.on("mouseenter", this.handleMouseEnter)
        this.on("mouseleave", this.handleMouseLeave)
        this.on("rightclick", this.handleRightClick)

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
        this.quantityText.position.set(20, 15)
        if(this.item){
            this.addChild(this.quantityText)
        }

        
    }

    handleMouseEnter = () => {
        if(this.item){
            this.tooltipManager.displayTooltip(this.item.itemName, this.item.texture)
        }
    }

    handleMouseLeave = () => {
        this.tooltipManager.removeTooltip()
    }

    //right clicking items to use or "consume" them
    handleRightClick = () =>  {
        //find non-ui version of item and itemSlot 
        const correspondingRealItemSlot = this.player[this.slotType].itemSlots[this.slotIndex]
        const correspondingRealItem = this.player[this.slotType].itemSlots[this.slotIndex].item
        //if item and if item is a consumable use item's handleConsumeItem func
        if(correspondingRealItem && correspondingRealItem.handleConsumeItem){
            correspondingRealItem.handleConsumeItem(this.player)
            correspondingRealItemSlot.quantity--
        }
    }

    onClick = (e) => {
        if(this.slotType === 'crafting_material'){
            this.clickEventManager.handleMaterialSlotClick(this, this.schemaItem, e)
        }
        //clicks get handled by click event manager because clicking an 
        //item slot picks up or puts down items. all of this kind of logic 
        // handle there
        else this.clickEventManager.handleSlotClick(this, e)
        
    }

    run = () => {
        //keep contents of actual player inventory, equip, and char screen  
        //in sync with ui counterparts. only do this if not a crafting material slot
        if(this.slotType !== "crafting_material"){
            this.item = this.player[this.slotType].itemSlots[this.slotIndex].item
            this.quantity =  this.player[this.slotType].itemSlots[this.slotIndex].quantity
        }

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

class Material_ItemSlot_UI extends ItemSlot_UI{
    constructor(texture, emptyTexture, player, type, xPos, yPos, slotIndex, item, clickEventManager, uiManager, tooltipManager, schemaItem){
        super(texture, emptyTexture, player, type, xPos, yPos, slotIndex, item, clickEventManager, uiManager, tooltipManager)

        //this is the item that is required in this slot by the drink recipe
        this.schemaItem = schemaItem

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
        this.quantityTextContent = `1`

        this.init()
    }

    init = () => {
        this.quantityText.text = this.quantityTextContent
        this.quantityText = new Text({style: this.quantityTextStyle, text: this.quantityTextContent})
        this.quantityText.position.set(20, 15)
        this.addChild(this.quantityText)

        this.alpha = .5
        
    }

    run = () => {
        //if item is in the corresponing non ui slot, keep ui item slots in crafting 
        // manager up to date and in step with non ui itemSlots
        if(this.uiManager.craftingWindow.itemSlots[this.slotIndex].item !== null){
            
            this.item = this.uiManager.craftingWindow.itemSlots[this.slotIndex].item

            this.quantity =  this.uiManager.craftingWindow.itemSlots[this.slotIndex].quantity

            this.texture = this.item.texture
            this.alpha = 1
            //update the quantity text
            this.quantityText.text = `${this.quantity}`
            if(this.children.length === 0){
                this.addChild(this.quantityText)
            }
        }
        
        else{
            this.item = null
            this.quantity =  0
            this.quantityText.text = '1'
            this.schemaItem ? this.texture = this.schemaItem.sprite.texture : this.emptyTexture
            this.alpha = .5
        }

        // //remove quantity text if item becomes !item or quantity below 1
        // else if((!this.item && this.children.length > 0) || this.quantity < 1){
        //     this.texture = this.emptyTexture
        //     this.removeChild(this.quantityText)
        // }
    }
}

class CraftingResultsBox extends ItemSlot_UI{
    constructor(texture, emptyTexture, player, type, xPos, yPos, slotIndex, item, clickEventManager, uiManager, tooltipManager, currentRecipe, craftingWindow){
        super(texture, emptyTexture, player, type, xPos, yPos, slotIndex, item, clickEventManager, uiManager, tooltipManager,)
    // constructor(currentRecipe, emptyTexture, texture, itemSlots, craftingWindow, clickEventManager){
        // super(texture)
        this.scale.set(1.5)
        this.position.set(xPos, yPos)
        this.label = "crafting_results_button"
        this.currentRecipe = currentRecipe
        this.emptyTexture = emptyTexture
        this.craftingWindow = craftingWindow
        this.clickEventManager = clickEventManager

        //the non-ui itemSlots from crafting window 
        this.itemSlots = this.craftingWindow.itemSlots

        //item this "slot" contains
        this.item = null
        this.off("click", this.handleClick)
        this.on("click", this.handleResultsClick)
    }

    handleResultsClick = () => {
        this.clickEventManager.handleResultsBoxClick(this)
    }

    run = () => {
        if(this.item === null || this.quantity === 0){
            this.texture = this.emptyTexture
            if(this.quantity === null || this.quantity === 0){
                this.removeChild(this.quantityText)}
            return
        }
        //check if ready to craft
        if(this.craftingWindow.readyToCraft && this.item === null){
            //update texture to greyed out item
            this.texture = this.craftingWindow.currentItemToBeCrafted.sprite.texture
            this.alpha = .5
        }
        else this.texture = this.emptyTexture

        //if item is not null alpha should be 1
        if(this.item){
            this.texture = this.item.texture
            this.alpha = 1
            //update quantity text if there is an item
            if(this.quantity !== null)this.quantityText.text = `${this.quantity}`

            if(this.children.length === 0 && (this.quantity > 0)){
                this.addChild(this.quantityText)
            }
            else if(this.quantity === null || this.quantity === 0){
                this.removeChild(this.quantityText)
            }
        }
        
    }
}

class CraftingSelectionButton extends Sprite{
    constructor(texture, selectedTexture, x, y, craftingWindow, label, index, tooltipManager, item){
        super(texture)
        //selected texture is green box that signifies when a recipe is selected
        this.selectedBox = new Sprite(selectedTexture)
        this.selectedBox.position.set(0)
        this.selectedBox.label = "selected_box"
        this.tooltipManager = tooltipManager

        //the acutal item this icon represents
        this.item = item

        this.scale.set(1.5)
        this.label = label
        this.x = x
        this.y = y
        this.craftingWindow = craftingWindow
        this.index = index

        this.glowFilter = new GlowFilter()
        this.filters = []

        this.interactive = true
        this.on("click", this.handleClick)
        this.on("mouseenter", this.handleMouseEnter)
        this.on("mouseleave", this.handleMouseLeave)

        this.init()
    }

    init = () => {
        //set selection box to first one initially
        if(this.index === 0){
            this.addChild(this.selectedBox)
        }
    }

    handleMouseEnter = () => {
        this.filters = [this.glowFilter]
    }

    handleMouseLeave = () => {
        //remove glow filter
        this.filters = []
    }

    handleClick = () => {
        //remove any other selection boxes
        this.craftingWindow.children.forEach((child) => {
            if(child.label.includes("button")){
                child.removeChildren()
            }
        })

        //set item being crafted in craftingWindow
        this.craftingWindow.currentItemToBeCrafted = this.item
        
        this.craftingWindow.recipeIndex = this.index
        //change current recipe in crafting window and craft button
        this.craftingWindow.currentRecipe = DRINK_RECIPES[this.index]
        this.craftingWindow.craftButton.currentRecipe = DRINK_RECIPES[this.index]
        this.craftingWindow.handleChangeRecipes()
        this.addChild(this.selectedBox)

    }
}

class CraftButton extends Sprite{
    constructor(xPos, yPos, texture, handleCraftButtonClick, craftingWindow){
        super(texture)
        this.x = xPos
        this.y = yPos

        this.craftingWindow = craftingWindow

        this.handleCraftButtonClick = handleCraftButtonClick

        this.label = "craft_button"
        this.scale.set(1.5)
        this.alpha = .5

        //bool based on whether or not material slots
        //are correctly filled
        this.readyToCraft = this.craftingWindow.readyToCraft

        this.glowFilter = new GlowFilter()
        this.filters = []

        this.interactive = true
        this.on("click", this.handleClick)
        this.on("mouseenter", this.handleMouseEnter)
        this.on("mouseleave", this.handleMouseLeave)

    }

    handleClick = () => {
        //TO DO TO DO TO DO:
            //determine quantity here and pass to handleCraftButtonClick
        const quantity = 1
        this.handleCraftButtonClick(quantity)
    }

    handleMouseEnter = () => {
        if(this.readyToCraft)this.filters = [this.glowFilter]
    }

    handleMouseLeave = () => {
        //remove glow filter
        if(this.filters.length > 0)this.filters = []
    }

    run = () => {
        //keep this classes readyToCraft bool matching with crtaftingWindow's
        this.readyToCraft = this.craftingWindow.readyToCraft
        if(this.readyToCraft && this.alpha !== 1)this.alpha = 1
        else if(!this.readyToCraft && this.alpha === 1)this.alpha = .5

        //check if each itemSlot in craftingWindow is filed appropriately
        const canCraft = this.craftingWindow.itemSlots.every((itemSlot, index) => {
            if(itemSlot.item !== null)return itemSlot.item.itemName == this.craftingWindow.currentRecipe[index]
            else return itemSlot.item == this.craftingWindow.currentRecipe[index]
        })
        this.craftingWindow.readyToCraft = canCraft
    }
}

class CraftingWindowUI extends Container{
    constructor(app, player, clickCooldown, clicking, UIAssetsObject, uiContainer, xPos, yPos, iconsAssetsObject, clickEventManager, uiManager, tooltipManager, buffManager){
        super()
        this.app = app
        this.player = player
        this.uiManager = uiManager
        this.clickEventManager = clickEventManager
        this.tooltipManager = tooltipManager
        //this class needs access to the buff manager because consumable 
        // items are inited here and THEY need access to it
        this.buffManager = buffManager 

        this.UIAssetsObject = UIAssetsObject
        this.iconAssets = iconsAssetsObject
        this.uiContainer = uiContainer

        this.xPos = xPos
        this.yPos = yPos

        this.clickCooldown = clickCooldown
        this.clicking = clicking

        this.background = new Sprite(UIAssetsObject.UI_CraftingBG)
        //container to hold material slots
        this.craftingSlotsContainer = new Container()
        this.craftingSlotsContainer.label = "crafting_slots_container"
        this.addChild(this.background, this.craftingSlotsContainer)

        this.label = "crafting_ui"
        this.position.set(xPos, yPos)

        this.emptySlotTexture = this.iconAssets.Icon_EmptyItemSlot

        //what is the selected recipe
        this.recipeIndex = 0
        this.currentRecipe = DRINK_RECIPES[this.recipeIndex]

        this.itemSlots = []

        //an instance of the item being crafted currently. inited to null
        //but set to a value during init
        this.currentItemToBeCrafted = null

        //bool based on whether or not material slots
        //are correctly filled
        this.readyToCraft = false

        this.init()
    }

    handleCraftButtonClick = (quantity) => {
        console.log("clicked craft button")
        console.log(this.currentRecipe)
        //set quantity and item of results box
        console.log(this.currentItemToBeCrafted, "CURRENT ITEM TO BE CRAFTED")
        this.resultSlot.item = this.currentItemToBeCrafted
        this.resultSlot.quantity = quantity

        //clear material slots
        this.craftingSlotsContainer.removeChildren()
        //reset itemSlots
        this.itemSlots = []
        //repopulate
        this.initMaterialsSlots()

    }

    resetItemSlots = () => {
        //decrement each itemSlot's quantity by 1
        this.itemSlots.forEach()
    }

    init = () => {
        this.initCraftingSelectionButton()
        this.initMaterialsSlots()
        this.initResultSlot()
        this.initCraftButton()
    }

    initCraftButton = () => {
        const craftButtonTexture = this.iconAssets.Icon_CraftButton
        const xPos = 172
        const yPos = 144
        this.craftButton = new CraftButton(xPos, yPos, craftButtonTexture, this.handleCraftButtonClick, this)
        this.addChild(this.craftButton)
    }

    initCraftingSelectionButton = ()=> {
        const buttonWidth = 30 * 1.5
        const interval = this.background.width / 4
        const margin = (interval - buttonWidth) / 2
        const firstRowY = 15
        const frappeIcon = new CraftingSelectionButton(this.iconAssets.Icon_Frappe, this.iconAssets.Icon_CraftingSelected, margin, firstRowY, this, "frappe_button", 0, this.tooltipManager, new Frappe(this.app, this.iconAssets, this.player, this.buffManager))
        const latteIcon = new CraftingSelectionButton(this.iconAssets.Icon_Latte, this.iconAssets.Icon_CraftingSelected, interval + margin, firstRowY, this, "latte_button", 1, this.tooltipManager, new Latte(this.app, this.iconAssets, this.player, this.buffManager))
        const icedCoffeeIcon = new CraftingSelectionButton(this.iconAssets.Icon_IcedCoffee, this.iconAssets.Icon_CraftingSelected, interval * 2 + margin, firstRowY, this, "iced_coffee_button", 2, this.tooltipManager, new IcedCoffee(this.app, this.iconAssets, this.player, this.buffManager))
        const coffeeIcon = new CraftingSelectionButton(this.iconAssets.Icon_Coffee, this.iconAssets.Icon_CraftingSelected, interval * 3 + margin, firstRowY, this, "coffee_button", 3, this.tooltipManager, new Coffee(this.app, this.iconAssets, this.player, this.buffManager))

        const felFrappeIcon = new CraftingSelectionButton(this.iconAssets.Icon_FelFrappe, this.iconAssets.Icon_CraftingSelected, margin, firstRowY*5, this, "frappe_button", 4, this.tooltipManager, new FelFrappe(this.app, this.iconAssets, this.player, this.buffManager))
        const felLatteIcon = new CraftingSelectionButton(this.iconAssets.Icon_FelLatte, this.iconAssets.Icon_CraftingSelected, interval + margin, firstRowY*5, this, "latte_button", 5, this.tooltipManager, new FelLatte(this.app, this.iconAssets, this.player, this.buffManager))
        const felIcedCoffeeIcon = new CraftingSelectionButton(this.iconAssets.Icon_FelIcedCoffee, this.iconAssets.Icon_CraftingSelected, interval * 2 + margin, firstRowY*5, this, "iced_coffee_button", 6, this.tooltipManager, new FelIcedCoffee(this.app, this.iconAssets, this.player, this.buffManager))
        const felCoffeeIcon = new CraftingSelectionButton(this.iconAssets.Icon_FelCoffee, this.iconAssets.Icon_CraftingSelected, interval * 3 + margin, firstRowY*5, this, "coffee_button", 7, this.tooltipManager, new FelCoffee(this.app, this.iconAssets, this.player, this.buffManager))
        this.addChild(frappeIcon, latteIcon, icedCoffeeIcon, coffeeIcon, felFrappeIcon, felLatteIcon, felIcedCoffeeIcon, felCoffeeIcon)

        this.currentItemToBeCrafted = frappeIcon.item
        console.log('DEBUG FIRST ITEM TO BE CRAFTED: ', this.currentItemToBeCrafted)
    }

    initMaterialsSlots = () => {
        const slotSize = 30 * 1.5 
        for(let i = 0; i < DRINK_RECIPES[this.recipeIndex].length; i++){
            let item = null
            switch(DRINK_RECIPES[this.recipeIndex][i]) {
                case "WhippedCream":
                    item = new WhippedCream(this.app, this.iconAssets)
                    break;
                case "Syrup":
                    item = new Syrup(this.app, this.iconAssets)
                    break;
                case "Milk":
                    item = new Milk(this.app, this.iconAssets)
                    break;
                case "Beans":
                    item = new Beans(this.app, this.iconAssets)
                    break;
                case "Ice":
                    item = new Ice(this.app, this.iconAssets)
                default:
                    break;
            }
            const slot = new Material_ItemSlot_UI(
                item === null ? this.iconAssets.Icon_EmptyItemSlot : item.texture,
                this.iconAssets.Icon_EmptyItemSlot, 
                this.player, "crafting_material", 
                i % 2 * slotSize, 
                i % 3 * slotSize, 
                i, null, this.clickEventManager, this.uiManager, 
                this.tooltipManager, item)
            this.craftingSlotsContainer.addChild(slot)

            const itemSlot = new ItemSlot(this.app, this.player, "material", i)
            this.itemSlots.push(itemSlot)
        }
        
        this.craftingSlotsContainer.position.set(50, this.background.height / 2)
    }

    initResultSlot = () => {
        
       this.resultSlot = new CraftingResultsBox(this.emptySlotTexture,  this.emptySlotTexture, this.player, "results_box", 170, 236, 0, null, this.clickEventManager, this.uiManager, this.tooltipManager, this.currentRecipe, this)
        this.addChild(this.resultSlot)
    }

    populateMaterials = () => {
        this.craftingSlotsContainer.children.forEach((slot, i) => {
            slot.item = DRINK_RECIPES[this.recipeIndex][i]
        })
    }

    handleChangeRecipes = () => {
        //clear all material slots in craftingSlotsContainer
        this.craftingSlotsContainer.removeChildren()
        const slotSize = 30 * 1.5
        //repopulate with new recipe
        console.log("RECIPE INDEX: ", this.recipeIndex)
        DRINK_RECIPES[this.recipeIndex].forEach((recipeString, index) => {
            let item = null
            switch(recipeString) {
                case "WhippedCream":
                    item = new WhippedCream(this.app, this.iconAssets)
                    break;
                case "Syrup":
                    item = new Syrup(this.app, this.iconAssets)
                    break;
                case "Milk":
                    item = new Milk(this.app, this.iconAssets)
                    break;
                case "Beans":
                    item = new Beans(this.app, this.iconAssets)
                    break;
                case "Ice":
                    item = new Ice(this.app, this.iconAssets)
                    break;
                case "LargeFang":
                    item = new LargeFang(this.app, this.iconAssets)
                    break;
                case "CorruptedBlood":
                    item = new CorruptedBlood(this.app, this.iconAssets)
                    break;
                default:
                    break;
            }
            const slot = new Material_ItemSlot_UI(
                item == null ? this.iconAssets.Icon_EmptyItemSlot : item.sprite.texture,
                this.iconAssets.Icon_EmptyItemSlot, 
                this.player, "crafting_material", 
                index % 2 * slotSize, 
                index % 3 * slotSize, 
                index, null, this.clickEventManager, this.uiManager, this.tooltipManager, item)

            this.craftingSlotsContainer.addChild(slot)
        })
    }

    run = () => {
        //results slot run method
        this.resultSlot.run()

        //craft button run method
        this.craftButton.run()

        this.craftingSlotsContainer.children.forEach(child => {
            if(child.run)child.run()
        })

        if(this.uiManager.inventoryDisplaying){
            this.x = 50
        }
        else{
            this.x = this.xPos
        }
    }
}

class InventoryUI extends Container{
    constructor(app, player, playerInventoryItemSlots, clickCooldown, clicking, UIAssetsObject, uiContainer, xPos, yPos, iconsAssetsObject, clickEventManager, uiManager, tooltipManager){
        super()
        this.app = app
        this.player = player
        this.playerInventoryItemSlots = playerInventoryItemSlots
        this.clickEventManager = clickEventManager
        this.tooltipManager = tooltipManager

        this.clickCooldown = clickCooldown
        this.clicking = clicking

        this.UIAssetsObject = UIAssetsObject
        this.iconsAssetsObject = iconsAssetsObject
        this.uiContainer = uiContainer
        this.uiManager = uiManager

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
                const slotSprite = new ItemSlot_UI(this.emptySlotTexture, this.emptySlotTexture, this.player, "inventory", xPos, yPos, i, itemSlot.item, this.clickEventManager, this.uiManager, this.tooltipManager)
                this.addChild(slotSprite)
            }else{
                const textureIdentifier = `Icon_${itemSlot.item.itemName}`
                const texture = this.iconsAssetsObject[textureIdentifier]
                const slotSprite = new ItemSlot_UI(texture, this.emptySlotTexture, this.player, "inventory", xPos, yPos, i, itemSlot.item, this.clickEventManager, this.uiManager, this.tooltipManager)
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
    constructor(app, player, playerQuickBarItemSlots, clickCooldown, clicking, emptySlotTexture, uiContainer, iconsAssetsObject, clickEventManager, uiManager, tooltipManager){
        super()
        this.app = app  
        this.player = player
        this.playerQuickBarItemSlots = playerQuickBarItemSlots
        this.clickEventManager = clickEventManager
        this.uiManager = uiManager
        this.tooltipManager = tooltipManager

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
                const emptySlotSprite = new ItemSlot_UI(this.emptySlotTexture, this.emptySlotTexture, this.player, "quickBar", offset + (i * (this.emptySlotTexture.width * 1.5 + UI_SETTINGS.PADDING)) , 517, i, itemSlot.item, this.clickEventManager, this.uiManager, this.tooltipManager)
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
    constructor(app, clickCooldown, clicking, uiAssets, uiContainer, player, clickEventManager, iconAssets, uiManager, tooltipManager){
        super()
        this.app = app
        this.uiAssets = uiAssets
        this.iconAssets = iconAssets
        this.player = player
        this.clickEventManager = clickEventManager
        this.uiManager = uiManager
        this.tooltipManager = tooltipManager

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
        this.equipmentBG = new CharacterSheet_EquipmentScreen(this.uiAssets.UI_IpadEquipmentBG, 150, 67, this.player, this.uiAssets, this.iconAssets, this.uiManager, this.tooltipManager)
        this.statsBG = new CharacterSheet_StatsScreen(this.uiAssets.UI_IpadStatsBG, 150, 67, this.player, this.uiAssets, this.iconAssets, this.uiManager)

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
    constructor(backgroundTexture, x, y, player, uiAssets, uiManager){
        super()
        this.background = new Sprite(backgroundTexture)
        this.background.position.set(x, y)
        this.addChild(this.background)

        this.uiAssets = uiAssets
        this.player = player
        this.uiManager = uiManager

        this.x = 0
        this.y = 0
        this.label = "stats_character_sheet_screen"
    }
}

class CharacterSheet_EquipmentScreen extends Container {
    constructor(backgroundTexture, x, y, player, uiAssets, iconAssets, uiManager, tooltipManager){
        super()
        this.background = new Sprite(backgroundTexture)
        this.background.position.set(x, y)
        this.addChild(this.background)
        
        this.uiAssets = uiAssets
        this.iconAssets = iconAssets
        this.player = player
        this.uiManager = uiManager
        this.tooltipManager = tooltipManager

        this.x = 0
        this.y = 0
        this.label = "equipment_character_sheet_screen"
        this.init()
    }

    init = () => {
        const blankSlotTexture = this.iconAssets.Icon_EmptyCharacterSheetSlot

        const handsSlot = new ItemSlot_UI(blankSlotTexture, blankSlotTexture, this.player, "equipment", 509, 406, 0, null, this.clickEventManager, this.uiManager, this.tooltipManager)
        const feetSlot = new ItemSlot_UI(blankSlotTexture, blankSlotTexture, this.player, "equipment", 529, 496, 1, null, this.clickEventManager, this.uiManager, this.tooltipManager)
        const legsSlot = new ItemSlot_UI(blankSlotTexture, blankSlotTexture, this.player, "equipment", 272, 529, 2, null, this.clickEventManager, this.uiManager, this.tooltipManager)
        const chestSlot = new ItemSlot_UI(blankSlotTexture, blankSlotTexture, this.player, "equipment", 257, 426, 3, null, this.clickEventManager, this.uiManager, this.tooltipManager)
        const headSlot = new ItemSlot_UI(blankSlotTexture, blankSlotTexture, this.player, "equipment", 537, 171, 4, null, this.clickEventManager, this.uiManager, this.tooltipManager)
        this.addChild(handsSlot, feetSlot, legsSlot, chestSlot, headSlot)
    }
}

class HealthBar extends Sprite{
    constructor(app, texture, player, xPos, yPos, uiContainer, tooltipManager){
        super(texture)
        this.app = app
        this.player = player
        this.label = "health_bar"
        this.uiContainer = uiContainer
        this.tooltipManager = tooltipManager

        this.x = xPos
        this.y = yPos

        
        //red circle that shows hp
        this.healthFill = new Graphics().circle( 157, 528, 51).fill('#8a0101')
        this.healthFill.label = "health_fill"

        this.healthTextStyle = new TextStyle({
            fontFamily: 'roboto',
            dropShadow: {
                alpha: 0.5,
                angle: 2.1,
                blur: 4,
                color: '#cae0dd',
                distance: 10,
            },
            fill: '#000000',
            stroke: { color: '#ffffff', width: 2, join: 'round' },
            fontSize: 20,
            fontWeight: 'lighter',
            alpha: 1
        })
        this.healthText = new Text({style: this.healthTextStyle, text: `${this.player.maxHealth} / ${this.player.currentHealth}`})
        this.healthText.position.set(this.x + 70, this.y + this.height / 2)
        this.uiContainer.addChild(this.healthFill, this, this.healthText)
    }

    run = () => {
        //keep text up to date
        this.healthText.text = `${this.player.currentHealth} / ${this.player.maxHealth}`
    }
}

class EnemyHealthBar extends Container{
    constructor(enemy) {
        super()
        this.enemy = enemy
        this.barWidth = 40
        this.barHeight = 10

        this.backgroundColor = UI_SETTINGS.ENEMY_HEALTH_BAR.BACKGROUND_COLOR  
        this.foregroundColor = UI_SETTINGS.ENEMY_HEALTH_BAR.FOREGROUND_COLOR  
    
        // create background rectangle
        this.backgroundBar = new Graphics()
        this.backgroundBar.stroke({ width: 2, color: 0xffffff })
        this.backgroundBar.rect(0, 0, this.barWidth, this.barHeight)
        this.backgroundBar.fill(this.backgroundColor)
        

        // create the foreground rectangle (actual health)
        this.foregroundBar = new Graphics()
        this.foregroundBar.rect(0, 0, this.barWidth, this.barHeight)
        this.foregroundBar.fill(this.foregroundColor)

        // add both to a container for positioning
        this.addChild(this.backgroundBar)
        this.addChild(this.foregroundBar)

        this.backgroundBar.position.set(0,0)
        this.foregroundBar.position.set(0,0)
    
        //position the health bar above enemy sprite
        this.position.set(enemy.x, enemy.y - 10)
    }
  
    //update the health bar based on enemy current health
    update = () => {
      const healthPercentage = this.enemy.currentHealth / this.enemy.maxHealth
      this.foregroundBar.width = this.width * healthPercentage
  
      //destroy health bar if associated enemy is killed
      if(this.enemy.currentHealth < 0){
        this.destroy({ children: true })
      }
      else{
        //keep the health bar positioned above the enemy
        this.position.set(this.enemy.x + 20, this.enemy.y)
      }
      
    }
  }

class EnemyHealthBarManager extends Container{
    constructor(app, enemyList, uiContainer, uiAssetsObject){
        super()
        this.app = app
        this.enemyList = enemyList
        this.uiAssetsObject = uiAssetsObject
        this.uiContainer = uiContainer

        this.init()
        this.uiContainer.addChild(this)
    }

    init = () => {
        this.enemyList.forEach(enemy => {
          const healthBar = new EnemyHealthBar(enemy)
          this.addChild(healthBar)
        })
      }

    run = () => {
        this.children.forEach(healthBar => {
            if (healthBar.update){
                healthBar.update()
            }
        })
    }
}

class UI_Buff extends Sprite{
    constructor(buff, texture, xPos, yPos, buffUIContainer){
        super(texture)
        this.buff = buff

        this.buffUIContainer = buffUIContainer

        this.parsedDuration = getMillisecondsToSeconds(this.buff.duration)

        this.x = xPos
        this.y = yPos
        this.label = this.buff.name.replace(" ", "_")
        this.scale.set(ICON_SCALING)

        this.interactive = true
        this.on("mouseovercapture", this.handleMouseOver)
        this.on("mouseoutcapture", this.handleMouseOut)

        this.timerTextOptions = new TextStyle({
            fontFamily: 'roboto',
            fill: '#ffffff',
            stroke: { color: '#1d1f1e', width: 3, join: 'round' },
            fontSize: 10,
            fontWeight: 'lighter',
            alpha: .5
        })
        this.timerText = new Text({text: `${this.parsedDuration.seconds}`, style: this.timerTextOptions})
        this.timerText.position.set(0, 30)
        this.addChild(this.timerText)
    }

    handleMouseOver = () => {
        this.buffUIContainer.handleMouseOver(this.buff, this.texture)
    }

    handleMouseOut = () => {
        this.buffUIContainer.handleMouseOut()
    }
}

class Buff_UI_Container extends Container{
    constructor(app, player, xPos, yPos, uiContainer, tooltipManager){
        super()
        this.app = app
        this.player = player
        this.x = xPos
        this.y = yPos
        this.uiContainer = uiContainer
        this.tooltipManager = tooltipManager

        this.label = "buffs_container"

        this.uiContainer.addChild(this)
    }

    //mouse in and out display tooltips
    handleMouseOver = (buff, texture) => {
        console.log("buff mouse over: ", buff, texture)
        this.tooltipManager.displayTooltipBuff(buff, texture)
    }

    handleMouseOut = () => {
        this.tooltipManager.removeTooltip()
    }

    run = () => {
        // remove buffs that are no longer active if not removed already
        this.children.forEach(child => {
            //check if buff has been removed
            if (!this.player.activeBuffs.includes(child.buff)) {
                this.removeChild(child)
            }
        })

        // display active buffs if not displayed already
        this.player.activeBuffs.forEach((buff, index) => {
            // check if the bufff is already displayed
            if (!this.children.some(child => child.buff === buff)) {
                const buffSprite = new UI_Buff(buff, buff.texture, index * 40, 0, this);
                this.addChild(buffSprite)
            }
        })
    }
}
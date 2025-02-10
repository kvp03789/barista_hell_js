import { Sprite, Container, Text } from "pixi.js"

export class ClickEvent extends Sprite{
    constructor(clickEventManager, itemSlot, quantity){
        super(itemSlot.texture)
        this.scale.set(1.5)
        this.clickEventManager = clickEventManager
        //this.slotType is which ui region did click originate from
        //corresponds to itemSlot slotType: equipment, inventory, or quickBar
        this.slotType = itemSlot.slotType
        this.item = itemSlot.item
        this.slotIndex = itemSlot.slotIndex
        this.quantity = quantity
        this.itemName = itemSlot.itemName

        this.quantityText = new Text({style: itemSlot.quantityTextStyle, text: `${this.quantity}`})
        // this.quantityText.position.set()
        this.addChild(this.quantityText)
        //add clickEvent sprite to this.currentEvent
        this.clickEventManager.addChild(this)
    }

    update = () => {
        //update the quantityText
        this.quantityText.text = `${this.quantity}`
        if(this.quantity < 1){
            this.item = null
            this.clickEventManager.cleanUp()
        }
    }
}

export class ClickEventManager extends Container{
    constructor(app, visibleSpritesGroup){
        super()
        this.app = app
        this.app.stage.on('mousemove', this.handleMouse)
        this.visibleSpritesGroup = visibleSpritesGroup
        // this.visibleSpritesGroup.on("click", this.handleOffClick)
        //every click on ui item slots registers a ClickEvent and stores it
        //in this.currentEvent
        this.lastEvent = null
        this.currentEvent = null
    }

    init = (player, uiManager, craftingManager, keysObject) => {
        this.player = player
        this.uiManager = uiManager
        this.craftingManager = craftingManager
        console.log("crafting window from clickeven manager: ", this.craftingManager)
        this.keysObject = keysObject
        
        this.playerInventory = this.player.inventory
        this.playerEquipment = this.player.equipment
        this.playerQuickBar = this.player.quickBar
    }

    handleSlotClick = (itemSlot, e) => {
        const slotIsOccupied = this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].item !== null

        //is there already a currentEvent
        if(!this.currentEvent){
            
            if(this.isShiftPressed()){
                //pick up individuals
                this.currentEvent = new ClickEvent(this, itemSlot, 1)
                //update player
                this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].quantity -= 1
            }
            else{
                //pick up full stacks
                this.currentEvent = new ClickEvent(this, itemSlot, itemSlot.quantity)
                //corresponding player itemSlot item and quantity should be null and 0
                this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].item = null
                this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].quantity = 0
            } 
        }
        else if(this.currentEvent){
            if(slotIsOccupied){
                //stack items if itemSlot.item same as currentEvent.item
                if(itemSlot.item.itemName === this.currentEvent.item.itemName){
                    if(this.isShiftPressed()){
                        this.currentEvent.quantity--
                        this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].quantity++
                    }
                    else {
                        //by whole stack otherwise
                        this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].quantity += this.currentEvent.quantity
                        this.cleanUp()
                    }
                }
                //swap items places if items not same
                else{
                    this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].item = itemSlot.item
                    this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].quantity = itemSlot.quantity
                    
                    this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].item = this.currentEvent.item
                    this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].quantity = this.currentEvent.quantity

                    this.cleanUp()
                }
            }
            else{
                //drop items in empty slots 
                if(this.isShiftPressed()){
                    //by ones if shift is held
                    this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].item = this.currentEvent.item
                    this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].quantity = 1
                    
                    this.currentEvent.quantity--
                }
                else{
                    //else by full stacks
                    const item = this.currentEvent.item
                    const quantity = this.currentEvent.quantity  
                    this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].item = item
                    this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].quantity = quantity
                    this.cleanUp()
                }
            } 
        }
    }

    handleMaterialSlotClick = (itemSlot, schemaItem, e) => {
        console.log("ITEM SLOT", itemSlot)
        const slotIsOccupied = this.craftingManager.itemSlots[itemSlot.slotIndex].item !== null
        
        //is there already a currentEvent
        if(!this.currentEvent){
            if(!slotIsOccupied){
                return
            }

            else{
                if(this.isShiftPressed()){
                    //pick up individuals
                    this.currentEvent = new ClickEvent(this, itemSlot, 1)
                    //update player
                    this.craftingManager.itemSlots[itemSlot.slotIndex].quantity -= 1
                }
                else{
                    //pick up full stacks
                    this.currentEvent = new ClickEvent(this, itemSlot, itemSlot.quantity)
                    //corresponding player itemSlot item and quantity should be null and 0
                    this.craftingManager.itemSlots[this.currentEvent.slotIndex].item = null
                    this.craftingManager.itemSlots[this.currentEvent.slotIndex].quantity = 0
                } 
            }
        }
        else if(this.currentEvent){
            if(slotIsOccupied){
                //stack items if itemSlot.item same as currentEvent.item
                if(itemSlot.item.itemName === this.currentEvent.item.itemName){
                    if(this.isShiftPressed()){
                        this.currentEvent.quantity--
                        this.craftingManager.itemSlots[itemSlot.slotIndex].quantity++
                    }
                    else {
                        //by whole stack otherwise
                        this.craftingManager.itemSlots[itemSlot.slotIndex].quantity += this.currentEvent.quantity
                        this.cleanUp()
                    }
                }
                //swap items places if items not same
                else{
                    return
                }
            }
            else if(!slotIsOccupied){
                if(this.currentEvent.item.itemName === schemaItem.itemName){    
                    //drop items in empty slots 
                    if(this.isShiftPressed()){
                        //by ones if shift is held
                        this.craftingManager.itemSlots[itemSlot.slotIndex].item = this.currentEvent.item
                        this.craftingManager.itemSlots[itemSlot.slotIndex].quantity = 1
                        
                        this.currentEvent.quantity--

                        console.log("dropped one in material slot", this.craftingManager)
                    }
                    else{
                        //else by full stacks
                        const item = this.currentEvent.item
                        const quantity = this.currentEvent.quantity  
                        this.craftingManager.itemSlots[itemSlot.slotIndex].item = item
                        this.craftingManager.itemSlots[itemSlot.slotIndex].quantity = quantity
                        this.cleanUp()
                    }}
                else{
                    console.log("items have to match here!")
                }
            } 
        }
    }

    handleResultsBoxClick = (itemSlot) => {
        
        if(this.currentEvent)return
        else{
            this.currentEvent = new ClickEvent(this, itemSlot, itemSlot.quantity)
            itemSlot.quantity -= itemSlot.quantity
        }
        console.log("clicked results box", itemSlot)
    }

    handleOffClick = () => {
        if(this.currentEvent){
            //put items back
            if(this.player[this.currentEvent.slotType].itemSlots[this.slotIndex].item === null){
                this.player[this.currentEvent.slotType].itemSlots[this.slotIndex].item = this.currentEvent.item
                this.player[this.currentEvent.slotType].itemSlots[this.slotIndex].quantity = this.currentEvent.quantity                
            }else{
                this.player[this.currentEvent.slotType].itemSlots[this.slotIndex].quantity += this.currentEvent.quantity
            } 
        }
        
    }

    handleMouse = (e) => {
        //keep track of player mouse coords
        this.mousePos = e.data.global
    }

    cleanUp = () => {
        this.lastEvent = null
        this.currentEvent = null
        this.removeChildren()
    }

    isShiftPressed = () => {
        return this.keysObject[16]
    }
    
    run = () => {
        //keep sprite of current event on mouse pointer
        if(this.currentEvent){
            this.currentEvent.x = this.mousePos.x + 1
            this.currentEvent.y = this.mousePos.y + 1
            this.currentEvent.update()
        }
        else if(!this.currentEvent && this.children.length > 0){
            this.removeChildren()
        }
    }
}
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
    }
}

export class ClickEventManager extends Container{
    constructor(app){
        super()
        this.app = app
        this.app.stage.on('mousemove', this.handleMouse)
        //every click on ui item slots registers a ClickEvent and stores it
        //in this.currentEvent
        this.lastEvent = null
        this.currentEvent = null
    }

    init = (player, uiManager, keysObject) => {
        this.player = player
        this.uiManager = uiManager
        this.keysObject = keysObject
        
        this.playerInventory = this.player.inventory
        this.playerEquipment = this.player.equipment
        this.playerQuickBar = this.player.quickBar
    }

    handleDropClick = (itemSlot) => {
        //when clicking an empty slot with currentEvent

        if(this.keysObject[16]){
            this.handleDropSingleClick(itemSlot)
        }
        else this.handleDropStackClick(itemSlot)
    }

    handleDropStackClick = (itemSlot) => {
        //drop the whole stack that is being held
        this.lastEvent = this.currentEvent
        this.currentEvent = new ClickEvent(this, itemSlot.texture, itemSlot.item, itemSlot.slotType, itemSlot.slotIndex, itemSlot.quantity, itemSlot.quantityTextStyle, null, itemSlot.slotType)
        
        if(this.lastEvent.itemQuantity === 1){

        }
        else{
        //update slot where item came from
        this.player[this.lastEvent.source].itemSlots[this.lastEvent.slotIndex].item = this.lastEvent.payload
        this.player[this.lastEvent.source].itemSlots[this.lastEvent.slotIndex].quantity -= this.lastEvent.itemQuantity
        //update slot where item dropped
        this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].item = this.lastEvent.payload
        this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].quantity = this.lastEvent.itemQuantity
        }
        

        // clean up
        this.cleanUp()
    }

    handleDropSingleClick = (itemSlot) => {
        //drop one at a time when shift is held

        if(this.currentEvent.itemQuantity < 1){
            this.cleanUp()
        }else if(this.currentEvent.itemQuantity === 1){
            return
        }
        else {
            //decrement quantity being held
            this.currentEvent.itemQuantity -=1
            //update the quantityText
            this.currentEvent.update()
            //update item slot
            this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].item = this.currentEvent.payload
            //increment quantity of clicked slot
            this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].quantity += 1
        }
        
        
    }

    handlePickupClick = (itemSlot) => {
        //when clicking occupied slot with no currentEvent 
        this.lastEvent = this.currentEvent
        this.currentEvent = new ClickEvent(this, itemSlot.texture, itemSlot.item, itemSlot.slotType, itemSlot.slotIndex, itemSlot.quantity, itemSlot.quantityTextStyle, itemSlot.item.itemName, itemSlot.slotType)
        //update slot where item came from
        this.player[this.currentEvent.source].itemSlots[this.currentEvent.slotIndex].item = this.currentEvent.payload
        this.player[this.currentEvent.source].itemSlots[this.currentEvent.slotIndex].quantity -= this.currentEvent.itemQuantity
    }

    handleStacksAndSwaps = (itemSlot) => {
        this.lastEvent = this.currentEvent
        //stacking items
        if(this.currentEvent.itemName === this.lastEvent.itemName){
            //check if player is trying to split sticks by holding shift     
            if(this.keysObject[16]){
                //check if player is clicking empty slot or not
                if(itemSlot.item === null){
                    //if slot is empty player trying to drop individuals from stack
                    this.handleSplitStacksDropClick()
                }
                    //if slot !empty player trying to pick up individuals from stack
                else this.handleSplitStacksPickupClick()
            } 
            else {
                //the source/the item being held
                this.lastEvent = this.currentEvent
                //the destination/the slot being clicked on
                this.currentEvent = new ClickEvent(this, itemSlot.texture, itemSlot.item, itemSlot.slotType, itemSlot.slotIndex, itemSlot.quantity, itemSlot.quantityTextStyle, itemSlot.item.itemName, itemSlot.slotType)
                this.handleStackItemsClick()
            }
        }
        else {
            //the source/the item being held
            this.lastEvent = this.currentEvent
            //the destination/the slot being clicked on
            this.currentEvent = new ClickEvent(this, itemSlot.texture, itemSlot.item, itemSlot.slotType, itemSlot.slotIndex, itemSlot.quantity, itemSlot.quantityTextStyle, itemSlot.item.itemName, itemSlot.slotType)
            this.handleSwapItemsClick()
        }

    }

    handleSwapItemsClick = (itemSlot) => {
        console.log("handleSwapItemsClick")
        //update slot that was clicked
        this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].item = this.lastEvent.payload
        this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].quantity = this.lastEvent.itemQuantity
        //update slot where last clicked
        this.player[this.lastEvent.source].itemSlots[this.lastEvent.slotIndex].item = this.currentEvent.payload
        this.player[this.lastEvent.source].itemSlots[this.lastEvent.slotIndex].quantity = this.currentEvent.itemQuantity

        
        //clean up
        this.cleanUp()
    }

    handleStackItemsClick = (itemSlot) => {    
        console.log("handleStackItemsClick")  
        //update slot where item dropped
        this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].item = this.currentEvent.payload
        this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].quantity += this.lastEvent.itemQuantity
        //update slot where item came from
        this.player[this.lastEvent.source].itemSlots[this.lastEvent.slotIndex].item = this.lastEvent.payload
        this.player[this.lastEvent.source].itemSlots[this.lastEvent.slotIndex].quantity -= this.lastEvent.itemQuantity

        
        //clean up
        this.cleanUp()
    }

    handleSplitStacksDropClick = (itemSlot) => {
        //when player wants to shift+click to split stacks of items
        //and drop one at a time onto already full spot of same item
        //update slot where item dropped
        // this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].item = this.currentEvent.payload
        this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].quantity += 1
        //update item being held in event manager
        this.currentEvent.quantity -= 1
        
    }

    handleSplitStacksPickupClick = (itemSlot) => { 
        //when player wants to shift+click to split stacks of items
        //and pick up one at a time from stack
    }

    handleSlotClick = (itemSlot) => {
        const slotIsOccupied = this.player[itemSlot.slotType].itemSlots[itemSlot.slotIndex].item !== null
        console.log("DEBUG: slotIsOccupied: ", slotIsOccupied, this.currentEvent)
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
                        this.currentEvent.quantity++
                        this.player[this.currentEvent.slotType].itemSlots[this.currentEvent.slotIndex].quantity--
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
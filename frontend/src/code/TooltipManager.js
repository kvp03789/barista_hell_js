import { Container, Sprite, TextStyle, Rectangle, Texture, Text } from "pixi.js"
import { BUFF_DATA, ITEM_DESCRIPTIONS, ZOOM_FACTOR } from "../settings"

export class TooltipManager{
    constructor(app, tooltipBackgroundTexture, uiContainer, tooltipContainer, mousePos, UIAssetsObject){
        this.app = app
        this.tooltipBackgroundTexture = tooltipBackgroundTexture
        this.uiContainer = uiContainer
        this.tooltipContainer = tooltipContainer
        this.mousePos = mousePos
        this.UIAssetsObject = UIAssetsObject

        this.currentTooltip = new Container()
        this.currentTooltip.interactive = false
        this.tooltipBG = new Sprite(tooltipBackgroundTexture) 
        
        this.mouseOverTimer = 0
        this.mouseOutTimer = 0
        this.isTooltipDisplaying = false
        
        this.uiContainer.addChild(this.currentTooltip)

        this.itemTextStyle = new TextStyle({
            fontFamily: 'roboto',
            fill: '#ffffff',
            stroke: { color: '#1d1f1e', width: 7, join: 'round' },
            fontSize: 20,
            fontWeight: 'lighter',
            alpha: .5
        })

        this.itemTypeTextStyle = new TextStyle({
            fontFamily: 'roboto',
            stroke: { color: '#1d1f1e', width: 7, join: 'round' },
            fontSize: 14,
            fontWeight: '300',
            alpha: .5
        })

        this.descriptionTextStyle = new TextStyle({
            fontFamily: 'roboto',
            fill: '#ffffff',
            stroke: { color: '#1d1f1e', width: 7, join: 'round' },
            fontSize: 14,
            fontWeight: 'lighter',
            alpha: .5
        })

        this.itemNameText = new Text({text: '', style: this.itemTextStyle})
        this.itemTypeText = new Text({text: '', style: this.itemTypeTextStyle})
        this.descriptionText = new Text({text: '', style: this.descriptionTextStyle})

        //key tooltip
        this.keyTooltip = new Sprite(this.UIAssetsObject.UI_KeyPressTooltip)
        this.keyTooltip.label = "key_tooltip"
        this.keyTooltip.scale.set(ZOOM_FACTOR)
        this.keyTooltip.alpha = 1
    }

    displayTooltip = (itemName, iconTexture) => {
        const parsedItemName = itemName.split(/(?=[A-Z])/).join(" ")

        //determine the fill color of the itemTypeText based on the item type
        let itemTypeFillColor
        switch (ITEM_DESCRIPTIONS[itemName].type) {
            case "Material":
                itemTypeFillColor = '#f54242'
                break;
            case "Equipment":
                itemTypeFillColor = '#152eeb'
                break;
            case "Consumable":
                itemTypeFillColor = '#39eb15'
                break;
            default:
                break;
        }
        this.itemTypeTextStyle.fill = itemTypeFillColor
        //name of the item
        this.itemNameText.text = parsedItemName
        this.itemNameText.position.set(20, 15)
        //the item type ie material, equipemtn, etc
        this.itemTypeText.text = ITEM_DESCRIPTIONS[itemName].type
        this.itemTypeText.position.set(20, 45)
        //a brief item description that comes from te settings file
        this.descriptionText.text = ITEM_DESCRIPTIONS[itemName].description
        this.descriptionText.position.set(20, 75)
        //the items icon
        this.tooltipItemIcon = new Sprite(iconTexture)
        this.tooltipItemIcon.position.set(170, 15)
        this.tooltipItemIcon.scale.set(ZOOM_FACTOR)

        this.currentTooltip.addChild(this.tooltipBG, this.itemNameText, this.itemTypeText, this.descriptionText, this.tooltipItemIcon)
        this.tooltipContainer.addChild(this.currentTooltip)   
    }

    displayTooltipBuff = (buff, iconTexture) => {
        console.log(buff)
        //determine the fill color of the itemTypeText based on the item type
        let buffTypeFillColor
        switch (BUFF_DATA[buff.buffKey].type) {
            case "buff":
                buffTypeFillColor = '#f54242'
                break;
            case "debuff":
                buffTypeFillColor = '#152eeb'
                break;
            default:
                break;
        }
        this.itemTypeTextStyle.fill = buffTypeFillColor
        //name of the item
        this.itemNameText.text = buff.name
        this.itemNameText.position.set(20, 15)
        //the item type ie material, equipemtn, etc
        this.itemTypeText.text = buff.type
        this.itemTypeText.position.set(20, 45)
        //a brief item description that comes from te settings file
        this.descriptionText.text = buff.description
        this.descriptionText.position.set(20, 75)
        //the items icon
        this.tooltipItemIcon = new Sprite(iconTexture)
        this.tooltipItemIcon.position.set(170, 15)
        this.tooltipItemIcon.scale.set(ZOOM_FACTOR)

        this.currentTooltip.addChild(this.tooltipBG, this.itemNameText, this.itemTypeText, this.descriptionText, this.tooltipItemIcon)
        this.tooltipContainer.addChild(this.currentTooltip)   
    }

    removeTooltip = () => {
        this.currentTooltip.removeChildren()
    }

    run = (mousePos, player) => {
        this.mousePos = mousePos
        // this.currentTooltip.position = this.mousePos
        this.currentTooltip.position.set(this.mousePos.x + 10, this.mousePos.y+ 10)

        //if player in tooltip position display key tooltip
        if(player.inTooltipPosition ){
            this.keyTooltip.x = player.sprite.x
            this.keyTooltip.y = player.sprite.y - 40
            this.uiContainer.addChild(this.keyTooltip)
        }
        else this.uiContainer.removeChild(this.keyTooltip)

        //remove key tooltip if player opens crafting window
        if(this.uiContainer.children.some(child => child.label === 'crafting_ui')
        && this.uiContainer.children.includes(this.keyTooltip)){
            this.uiContainer.removeChild(this.keyTooltip)
        }
    }
}
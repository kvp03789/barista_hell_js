import { Sprite } from "pixi.js"
import { PLAYER_SETTINGS, WEAPON_SETTINGS } from "../settings"
import { BattleRifle, Shotgun } from "./item_classes/Weapons"

export class Item{
    constructor(type, texture){
        this.texture = texture
        this.sprite = new Sprite(texture) 
        this.sprite.label = type
    }
}

export class Inventory{
    constructor(app, player, weaponAssets){
        this.app = app
        this.player = player
        this.weaponAssets = weaponAssets
        //this array is populated with ItemSlot instances during init call
        this.itemSlots = []
        this.init()
    }

    init = () => {
        for(let i = 0; i < PLAYER_SETTINGS.INVENTORY_SLOTS_AMOUNT; i++){
            const itemSlot = new ItemSlot(this.app, this.player, 'item', i) //all slots type of item
            this.itemSlots.push(itemSlot)
        }
    }
}

export class Equipment{
    constructor(app, player, weaponAssets){
        this.app = app
        this.player = player
        this.weaponAssets = weaponAssets

        this.itemSlots = []
        this.weaponSlots = []
        this.equipmentSlots = []
        
        this.init()
    }

    init = () => {

        //init all of the item slots with ItemSlot instances
        PLAYER_SETTINGS.EQUIPMENT_SLOTS.forEach((slot, i) =>{
                const itemSlot = new ItemSlot(this.app, this.player, slot, i)
                this.itemSlots.push(itemSlot)
            }
        )

        //init the weapon slots and equipment slots
        this.itemSlots.forEach((slot, i) => {
            if(i < 2){
                this.weaponSlots.push(slot)
            }
            else{
                this.equipmentSlots.push(slot)
            }
        })

        //populate the inventory with items for testing/dev purposes
        this.testPopulate()
    }

    //parseWeaponAssets is helper function to parse the weaponAssets array
    //into an object. facilitates passing textures to weapon classes
    parseWeaponAssets = () => {
        const texturesObject = {}
        for(let key1 in WEAPON_SETTINGS){
            texturesObject[key1] = {}
            for (let key2 in this.weaponAssets){
                if(key2.startsWith(key1)){
                    texturesObject[key1][key2] = this.weaponAssets[key2]
                }
            }
        }
        return texturesObject
    }

    testPopulate = () => {
        const texturesObject = this.parseWeaponAssets()
        const battleRifle = new BattleRifle(this.app, texturesObject.BattleRifle, this.player, this.weaponAssets.BattleRifleLeft)
        const shotgun = new Shotgun(this.app, texturesObject.Shotgun, this.player)
        // const weaponsArray = [battleRifle, shotgun]
        // weaponsArray.forEach(weapon => {
        //     this.itemSlots.forEach(slot => {
        //         if(slot.slotType == 'weapon'){
        //             const removedWeapon = weaponsArray.pop()
        //             slot.item = removedWeapon
        //         }
        //     })
        // })
        this.itemSlots[0].item = battleRifle
        this.itemSlots[1].item = shotgun
    }

    run = () => {
        
    }
}

export class ItemSlot{
    constructor(app, player, slotType, slotIndex){
        this.app = app
        this.player = player
        //type is either "item" or "equipment"
        this.slotType = slotType
        this.slotIndex = slotIndex
        this.item = null
    }
}

export class QuickBar{
    constructor(app, player, itemAssets){
        this.app = app
        this.player = player
        this.itemAssets = itemAssets
        //this array is populated with ItemSlot instances during init call
        this.itemSlots = []
        this.init()
    }

    init = () => {
        for(let i = 0; i < PLAYER_SETTINGS.QUICK_BAR_SLOTS_AMOUNT; i++){
            const itemSlot = new ItemSlot(this.app, this.player, 'item', i) //all slots type of item
            this.itemSlots.push(itemSlot)
        }
    }
}
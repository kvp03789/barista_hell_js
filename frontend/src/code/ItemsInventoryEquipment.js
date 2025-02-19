import { Sprite } from "pixi.js"
import { PLAYER_SETTINGS, WEAPON_SETTINGS } from "../settings"
import { BattleRifle, Shotgun } from "./item_classes/Weapons"
import { Beans, CorruptedBlood, Ice, LargeFang, Milk } from "./item_classes/Materials"
import { Coffee } from "./item_classes/Consumables"

export class ItemSlot{
    constructor(app, player, slotType, slotIndex){
        this.app = app
        this.player = player
        //type is either 
            //1) armor slot (ie hands, feet, chest etc)
            //2) weapon 
            //3) consumable 
            //4) material
        this.slotType = slotType
        this.slotIndex = slotIndex
        this.item = null
        this.quantity = 0
    }

    run = () => {
        if(this.quantity < 1){
            this.item = null
        }
    }
}

export class Inventory{
    constructor(app, player, weaponAssets, iconAssets, buffManager){
        this.app = app
        this.player = player
        this.weaponAssets = weaponAssets
        this.iconAssets = iconAssets
        //buff manager needed here for initing consumables
        this.buffManager = buffManager
        //this array is populated with ItemSlot instances during init call
        this.itemSlots = []
        this.init()
        this.parseAssets()
        // this.testPopulate()
        this.testPopulateComplete = false
    }

    init = () => {
        for(let i = 0; i < PLAYER_SETTINGS.INVENTORY_SLOTS_AMOUNT; i++){
            const itemSlot = new ItemSlot(this.app, this.player, 'item', i) //all slots type of item
            this.itemSlots.push(itemSlot)
        }
    }

    parseAssets = () => {
        //parse the icons assets
        this.parsedIconsTextures = {}
        for(let key in this.iconAssets){
            if(key.startsWith("Icon") || key.startsWith("Buff")){
                this.parsedIconsTextures[key] = this.iconAssets[key]
            }
        }
    }

    testPopulate = () => {
        //populate some test materials
        const someIce = new Ice(this.app, this.parsedIconsTextures, this.player)
        this.itemSlots[0].item = someIce
        this.itemSlots[0].quantity = 10
        const someBeans = new Beans(this.app, this.parsedIconsTextures, this.player)
        this.itemSlots[1].item = someBeans
        this.itemSlots[1].quantity = 25
        const someMoreBeans = new Beans(this.app, this.parsedIconsTextures, this.player)
        this.itemSlots[2].item = someMoreBeans
        this.itemSlots[2].quantity = 15
        const someMilk = new Milk(this.app, this.parsedIconsTextures, this.player)
        this.itemSlots[3].item = someMilk
        this.itemSlots[3].quantity = 7
        const someCorruptedBlood = new CorruptedBlood(this.app, this.parsedIconsTextures, this.player)
        this.itemSlots[4].item = someCorruptedBlood
        this.itemSlots[4].quantity = 17
        const someLargeFangs = new LargeFang(this.app, this.parsedIconsTextures, this.player)
        this.itemSlots[5].item = someLargeFangs
        this.itemSlots[5].quantity = 4

        //aaaand test consumables
        const aConsumableItem = new Coffee(this.app, this.parsedIconsTextures, this.player, this.buffManager)
        this.itemSlots[6].item = aConsumableItem
        this.itemSlots[6].quantity = 2
        this.testPopulateComplete = true
    }

    run = () => {
        this.itemSlots.forEach(slot => {
            slot.run()
        })
    }
}

export class Equipment{
    constructor(app, player, weaponAssets, iconAssets){
        this.app = app
        this.player = player
        this.weaponAssets = weaponAssets
        this.iconAssets = iconAssets

        this.itemSlots = []
        this.weaponSlots = []
        this.equipmentSlots = []
        
        this.parseAssets()
        this.init()
        this.testPopulateComplete = false
        // this.testPopulate()
    }

    init = () => {

        //init all of the equipment slots with ItemSlot instances
        PLAYER_SETTINGS.EQUIPMENT_SLOTS.forEach((slot, i) =>{
                const itemSlot = new ItemSlot(this.app, this.player, slot, i)
                this.equipmentSlots.push(itemSlot)
            }
        )
        //init primary and secondary weapon slots
        const primaryWeaponSlot = new ItemSlot(this.app, this.player, "weapon", 0)
        const secondaryWeaponSlot = new ItemSlot(this.app, this.player, "weapon", 1)
        this.weaponSlots = [primaryWeaponSlot, secondaryWeaponSlot]
    }

    //helper function to parse the assets arrays
    //into objects. facilitates passing textures to classes
    parseAssets = () => {
        console.log("debug icon assets: ", this.iconAssets)
        //parse the raw weapon assets object
        this.parsedWeaponTexturesObject = {}
        for(let key1 in WEAPON_SETTINGS){
            this.parsedWeaponTexturesObject[key1] = {}
            for (let key2 in this.weaponAssets){
                if(key2.startsWith(key1)){
                    this.parsedWeaponTexturesObject[key1][key2] = this.weaponAssets[key2]
                }
            }
        }
        //parse the icons assets
        this.parsedIconsTextures = {}
        for(let key in this.iconAssets){
            if(key.startsWith("Icon")){
                this.parsedIconsTextures[key] = this.iconAssets[key]
            }
        }
    }

    testPopulate = () => {

        //populate some test weapons
        const battleRifle = new BattleRifle(this.app, this.parsedWeaponTexturesObject.BattleRifle, this.player, this.weaponAssets.BattleRifleLeft)
        const shotgun = new Shotgun(this.app, this.parsedWeaponTexturesObject.Shotgun, this.player)

        this.weaponSlots[0].item = battleRifle
        this.weaponSlots[1].item = shotgun

        this.testPopulateComplete = true
    }

    run = () => {
        
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
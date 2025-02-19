import { Sprite } from "pixi.js";
import Item from "./Item";
import { BUFF_DATA, ITEM_DESCRIPTIONS } from "../../settings";
import { Buff } from "../BuffManager";

class Consumable extends Item{
    constructor(app, iconAssets, player, buffManager){
        super(app, "consumable", player)
        this.iconAssets = iconAssets
        this.player = player
        //consumable items get access to buff manager so that buffs
        //can be added to it and their durations n stuff updated there
        this.buffManager = buffManager
    }

    handleConsumeItem = (player) => {
        const buffData = BUFF_DATA[this.buffKey]
        const { name, description, duration, type, applyEffect, removeEffect } = buffData
        const buff = new Buff(this.buffKey, name, description, duration, type,  applyEffect, removeEffect, this.iconAssets[`Buff_Icon_${this.buffKey}`])
        //add buff to buff manager (where it also gets added to player activeBuffs)
        this.buffManager.addBuff(buff)
    }
}

export class Frappe extends Consumable{
    constructor(app, iconAssets, player, buffManager){
        super(app, iconAssets, player, buffManager)
        this.itemName = "Frappe"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
        this.buffKey = ITEM_DESCRIPTIONS[this.itemName].effects.buff
    }
}

export class Latte extends Consumable{
    constructor(app, iconAssets, player, buffManager){
        super(app, iconAssets, player, buffManager)
        this.itemName = "Latte"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
        this.buffKey = ITEM_DESCRIPTIONS[this.itemName].effects.buff
    }
}

export class Coffee extends Consumable{
    constructor(app, iconAssets, player, buffManager){
        super(app, iconAssets, player, buffManager)
        this.itemName = "Coffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
        this.buffKey = ITEM_DESCRIPTIONS[this.itemName].effects.buff
    }
}

export class IcedCoffee extends Consumable{
    constructor(app, iconAssets, player, buffManager){
        super(app, iconAssets, player, buffManager)
        this.itemName = "IcedCoffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
        this.buffKey = ITEM_DESCRIPTIONS[this.itemName].effects.buff
    }
}

export class FelFrappe extends Consumable{
    constructor(app, iconAssets, player, buffManager){
        super(app, iconAssets, player, buffManager)
        this.itemName = "Frappe"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
        this.buffKey = ITEM_DESCRIPTIONS[this.itemName].effects.buff
    }
}

export class FelLatte extends Consumable{
    constructor(app, iconAssets, player, buffManager){
        super(app, iconAssets, player, buffManager)
        this.itemName = "Latte"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
        this.buffKey = ITEM_DESCRIPTIONS[this.itemName].effects.buff
    }
}

export class FelCoffee extends Consumable{
    constructor(app, iconAssets, player, buffManager){
        super(app, iconAssets, player, buffManager)
        this.itemName = "Coffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
        this.buffKey = ITEM_DESCRIPTIONS[this.itemName].effects.buff
    }
}

export class FelIcedCoffee extends Consumable{
    constructor(app, iconAssets, player, buffManager){
        super(app, iconAssets, player, buffManager)
        this.itemName = "IcedCoffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
        this.buffKey = ITEM_DESCRIPTIONS[this.itemName].effects.buff
    }
}
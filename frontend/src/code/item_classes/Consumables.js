import { Sprite } from "pixi.js";
import Item from "./Item";

class Consumable extends Item{
    constructor(app, iconAssets, player){
        super(app, "consumable", player)
        this.iconAssets = iconAssets
        this.player = player
    }

    handleConsumeItem = () => {
        console.log(`consumed a ${this.itemName}`)
    }
}

export class Frappe extends Consumable{
    constructor(app, iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "Frappe"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class Latte extends Consumable{
    constructor(app, iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "Latte"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class Coffee extends Consumable{
    constructor(app, iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "Coffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class IcedCoffee extends Consumable{
    constructor(app, iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "IcedCoffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class FelFrappe extends Consumable{
    constructor(app, iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "Frappe"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class FelLatte extends Consumable{
    constructor(app, iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "Latte"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class FelCoffee extends Consumable{
    constructor(app, iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "Coffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class FelIcedCoffee extends Consumable{
    constructor(app, iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "IcedCoffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}
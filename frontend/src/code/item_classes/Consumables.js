import { Sprite } from "pixi.js";
import Item from "./Item";

class Consumable extends Item{
    constructor(app, iconAssets){
        super(app, "consumable")
        this.iconAssets = iconAssets
    }
}

export class Frappe extends Consumable{
    constructor(app, iconAssets){
        super(app, iconAssets)
        this.itemName = "Frappe"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class Latte extends Consumable{
    constructor(app, iconAssets){
        super(app, iconAssets)
        this.itemName = "Latte"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class Coffee extends Consumable{
    constructor(app, iconAssets){
        super(app, iconAssets)
        this.itemName = "Coffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class IcedCoffee extends Consumable{
    constructor(app, iconAssets){
        super(app, iconAssets)
        this.itemName = "IcedCoffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class FelFrappe extends Consumable{
    constructor(app, iconAssets){
        super(app, iconAssets)
        this.itemName = "Frappe"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class FelLatte extends Consumable{
    constructor(app, iconAssets){
        super(app, iconAssets)
        this.itemName = "Latte"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class FelCoffee extends Consumable{
    constructor(app, iconAssets){
        super(app, iconAssets)
        this.itemName = "Coffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class FelIcedCoffee extends Consumable{
    constructor(app, iconAssets){
        super(app, iconAssets)
        this.itemName = "IcedCoffee"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}
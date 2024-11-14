import { Sprite } from "pixi.js";
import Item from "./Item";

class Material extends Item{
    constructor(app, player, iconAssets){
        super(app, "material", player)
        this.iconAssets = iconAssets
    }
}

export class Beans extends Material{
    constructor(app, player, iconAssets){
        super(app, player, iconAssets)
        this.itemName = "Beans"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class Milk extends Material{
    constructor(app, player, iconAssets){
        super(app, player, iconAssets)
        this.itemName = "Milk"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class Syrup extends Material{
    constructor(app, player, iconAssets){
        super(app, player, iconAssets)
        this.itemName = "Syrup"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class WhippedCream extends Material{
    constructor(app, player, iconAssets){
        super(app, player, iconAssets)
        this.itemName = "WhippedCream"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)    
    }
}

export class Ice extends Material{
    constructor(app, player, iconAssets){
        super(app, player, iconAssets)
        this.itemName = "Ice"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)
    }
}
import { Sprite } from "pixi.js";
import Item from "./Item";

class Material extends Item{
    constructor(app, iconAssets, player){
        super(app, "material", player)
        this.iconAssets = iconAssets
    }
}

export class Beans extends Material{
    constructor(app, iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "Beans"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class Milk extends Material{
    constructor(app,iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "Milk"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class Syrup extends Material{
    constructor(app,iconAssets, player){
        super(app,iconAssets, player)
        this.itemName = "Syrup"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)  
    }
}

export class WhippedCream extends Material{
    constructor(app,iconAssets, player){
        super(app,iconAssets, player)
        this.itemName = "WhippedCream"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)    
    }
}

export class Ice extends Material{
    constructor(app,iconAssets, player){
        super(app,iconAssets, player)
        this.itemName = "Ice"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)
    }
}

export class CorruptedBlood extends Material{
    constructor(app,iconAssets, player){
        super(app,iconAssets, player)
        this.itemName = "CorruptedBlood"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)
    }
}

export class LargeFang extends Material{
    constructor(app, iconAssets, player){
        super(app, iconAssets, player)
        this.itemName = "LargeFang"
        this.texture = this.iconAssets[`Icon_${this.itemName}`]
        this.sprite = new Sprite(this.texture)
    }
}
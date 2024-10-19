import * as PIXI from 'pixi.js'

export default class Cafe{
    constructor(app){
        this.app = app
        
        //display height and width
        this.display_width = this.app.view.width
        this.display_height = this.app.view.height
        //character always a property of level
        this.character = new Character(this.app, this.keysObject, this.spritesheetAssets, WIDTH / 2, HEIGHT / 2)

    }

    initMap = async () => {
        await this.character.init()
        this.cafeAssets = await PIXI.Assets.loadBundle('cafe_assets');
        this.cafeBaseMap = PIXI.Sprite.from(this.cafeAssets.CafeBaseMap)
        this.app.stage.addChild(this.cafeBaseMap)
    }

    run = () => {
        console.log('cafe state running....')
    }
}
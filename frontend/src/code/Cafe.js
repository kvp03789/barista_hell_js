import * as PIXI from 'pixi.js'
import { settings } from '../settings'
import { parseMapData } from '../utils'
import { cafeMapData } from '../map_data/cafeMapData'
import Character from './Character'
import YSortCameraSpriteGroup from './YSortCameraSpriteGroup'
import ObstacleSpriteGroup from './ObstacleSpriteGroup'
import Tile from './Tile'

export default class Cafe{
    constructor(app, keysObject){
        this.app = app
        
        //display height and width
        this.display_width = this.app.view.width
        this.display_height = this.app.view.height
        //"controller" object that manages keydown and up events
        this.keysObject = keysObject
        //sprite group/container
        this.visibleSprites = new YSortCameraSpriteGroup(this.app)
        this.obstacleSprites = new ObstacleSpriteGroup(this.app)

    }

    initMap = async () => {
        //initialize assets used in this level
        this.cafeAssets = await PIXI.Assets.loadBundle('cafe_assets');
        this.spritesheetAssets = await PIXI.Assets.loadBundle('character_spritesheets');
        
        //parse collision blocks...
        this.parsedMapObject = parseMapData(cafeMapData)
        //then add them to map
        this.parsedMapObject.collision.forEach((row, i) => {
            row.forEach((col, j) =>{
                if(col !== 0){
                    //offset is to adjust for fact that bg png and tiles don't line up
                    const x_pos = ((j) * settings.TILE_WIDTH) * settings.ZOOM_FACTOR
                    const y_pos = ((i) * settings.TILE_HEIGHT) * settings.ZOOM_FACTOR
                    let x = 690
                    let y = 510
                    let w = settings.TILE_WIDTH
                    let h = settings.TILE_HEIGHT
                    const sliceRect = new PIXI.Rectangle(x, y, w, h);
                    const texture = new PIXI.Texture({source: this.cafeAssets.CafeTilesetPng, frame: sliceRect})
                    const tile = new Tile(this.app, x_pos, y_pos, texture, 'boundary', this.obstacleSprites)
                }
            })
        })
        //make obstacle sprites invisible
        // this.obstacleSprites.alpha = 0

        ////ORDER MATTERS HERE/////
        //add level bg to stage first 
        this.cafeBaseMap = PIXI.Sprite.from(this.cafeAssets.CafeBaseMap)
        this.visibleSprites.addChild(this.cafeBaseMap)

        //add obstacle sprites to stage
        this.app.stage.addChild(this.obstacleSprites)

        //add custom camera group to stage
        this.app.stage.addChild(this.visibleSprites)

        //add character as property of level and init, adding to visibleSprites and to stage
        this.character = new Character(this.app, this.keysObject, this.spritesheetAssets, this.display_width / 2, this.display_height / 2, this.obstacleSprites)
        await this.character.init(this.visibleSprites)
        // await this.character.init()
        
        // this.visibleSprites.addChild(this.cafeBaseMap, this.character.sprite)
        // this.visibleSprites.addChild(this.character.sprite)

    }

    //the level's run method is added to the stage by the Application class
    run = () => {
        //this.character.sprite is passed to run methods of sprite groups
        //for calculating offset, keeping character centered
        //ORDER MATTERS HERE
        this.character.run()
        this.obstacleSprites.run(this.character.sprite)
        this.visibleSprites.run(this.character.sprite)
        
    }
}
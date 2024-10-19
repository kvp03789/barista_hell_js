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

    // parseMapData = () => {
    //     //parse the map data into a 2d array 
    //     this.parsedMapObject = {}
    //     cafeMapData.layers.forEach(layer => {
    //         this.parsedMapObject[layer.name] = []
    //         for(let i = 0; i < layer.data.length; i += layer.width){
    //             this.parsedMapObject[layer.name].push(layer.data.slice(i, layer.width + i))
    //         }
    //     })
    // }

    initMap = async () => {
        //initialize assets used in this level
        this.cafeAssets = await PIXI.Assets.loadBundle('cafe_assets');
        this.spritesheetAssets = await PIXI.Assets.loadBundle('character_spritesheets');

        //add level bg to stage first 
        this.cafeBaseMap = PIXI.Sprite.from(this.cafeAssets.CafeBaseMap)
        this.app.stage.addChild(this.cafeBaseMap)
        //parse collision blocks...
        this.parsedMapObject = parseMapData(cafeMapData)
        //then add them to map
        this.parsedMapObject.collision.forEach((row, i) => {
            row.forEach((col, j) =>{
                if(col !== 0){
                    //offset is to adjust for fact that bg png and tiles don't line up
                    const offsetX = 3 
                    const offsetY = 2 
                    const x_pos = (j) * settings.TILE_WIDTH  
                    const y_pos = (i) * settings.TILE_HEIGHT
                    let x = 690
                    let y = 510
                    let w = settings.TILE_WIDTH
                    let h = settings.TILE_HEIGHT
                    const sliceRect = new PIXI.Rectangle(x, y, w, h);
                    const texture = new PIXI.Texture({source: this.cafeAssets.CafeTilesetPng, frame: sliceRect})
                    console.log('x, y w, h: ', texture)
                    const tile = new Tile(this.app, x_pos, y_pos, texture, 'boundary', [this.obstacleSprites])
                }
            })
        })
        this.app.stage.addChild(this.obstacleSprites)

        //add character as property of level and render
        this.character = new Character(this.app, this.keysObject, this.spritesheetAssets, this.display_width / 2, this.display_height / 2)
        await this.character.init()

        //add custom camera group to stage
        this.app.stage.addChild(this.visibleSprites)
    }

    run = () => {
        console.log('cafe state running....')
    }
}
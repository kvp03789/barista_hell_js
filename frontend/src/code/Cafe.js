import * as PIXI from 'pixi.js'
import { TILE_HEIGHT, TILE_WIDTH, ZOOM_FACTOR }from '../settings'
import { parseMapData, getXYSlice } from '../utils'
import { cafeMapData } from '../map_data/cafeMapData'
import Character from './Character'
import YSortCameraSpriteGroup from './YSortCameraSpriteGroup'
import ObstacleSpriteGroup from './ObstacleSpriteGroup'
import Tile from './Tile'
import { AnimatedTile, HellPortalObject } from './Tile'
import ParticleManager from './Particles'
import BulletManager from './BulletManager'
import { tileSpriteData, hellCircleInactiveData, trashPileData } from '../json/tiles/tileSpriteData'
import { GlowFilter, ReflectionFilter, ShockwaveFilter } from 'pixi-filters'
import UIManager from './UI'
import { ClickEventManager } from './ClickEventManager'

export default class Cafe{
    constructor(app, keysObject){
        this.app = app
        this.app.stage.interactive = true
        this.app.stage.on('mousemove', this.onMouseMove)
        
        //display height and width
        this.display_width = this.app.view.width
        this.display_height = this.app.view.height
        //"controller" object that manages keydown and up events
        this.keysObject = keysObject
        //sprite group/container
        this.visibleSprites = new YSortCameraSpriteGroup(this.app)
        this.obstacleSprites = new ObstacleSpriteGroup(this.app)

        this.clickEventManager = new ClickEventManager(this.app)

        //used when calculating angle of player
        this.offset = {x: 0, y:0}
        
        //key events
        window.addEventListener("keydown", e => this.handleKeyDown(e))
        window.addEventListener("keyup", e => this.handleKeyUp(e))
    }

    handleKeyDown = (e) => {
        this.keysObject[e.keyCode] = true
        //create walking particle
        if(this.character.movement.x !== 0 || this.character.movement.y !== 0){
            this.particleManager.createParticle(this.character.sprite.x, this.character.sprite.y, "character_walking", "Character", "CharacterWalkingParticle")
        }
    }

    handleKeyUp = (e) => {
        this.keysObject[e.keyCode] = false
    }

    onMouseMove = (e) => {
        this.mousePos = e.data.global
    }

    initMap = async () => {
        //initialize assets used in this level
        this.cafeAssets = await PIXI.Assets.loadBundle('cafe_assets');
        this.spritesheetAssets = await PIXI.Assets.loadBundle('character_spritesheets');
        this.weaponAssets = await PIXI.Assets.loadBundle('weapon_assets')
        this.particleAssets = await PIXI.Assets.loadBundle('particle_spritesheets')
        this.bulletAssets = await PIXI.Assets.loadBundle('bullet_assets')
        this.animatedTileAssets = await PIXI.Assets.loadBundle('tile_spritesheets')
        this.uiAssets = await PIXI.Assets.loadBundle('ui_assets')
        this.iconAssets = await PIXI.Assets.loadBundle("icons")

        //parse map data...
        this.parsedMapObject = parseMapData(cafeMapData)

        //init the particleManager
        this.particleManager = new ParticleManager(this.app, this.particleAssets)
        await this.particleManager.init()

        //init bulletManager
        this.bulletManager = new BulletManager(this.app, this.bulletAssets, this.obstacleSprites, this.particleManager)
        ////ORDER MATTERS HERE/////
        
        //add collision blocks to map
        this.parsedMapObject.collision.forEach((row, i) => {
            row.forEach((col, j) =>{
                if(col !== 0){
                    //offset is to adjust for fact that bg png and tiles don't line up
                    const x_pos = ((j) * TILE_WIDTH) * ZOOM_FACTOR
                    const y_pos = ((i) * TILE_HEIGHT) * ZOOM_FACTOR
                    let x = 690
                    let y = 510
                    let w = TILE_WIDTH
                    let h = TILE_HEIGHT
                    const sliceRect = new PIXI.Rectangle(x, y, w, h);
                    const texture = new PIXI.Texture({source: this.cafeAssets.CafeTilesetPng, frame: sliceRect})
                    const tile = new Tile(this.app, x_pos, y_pos, texture, 'boundary', this.obstacleSprites)
                }
            })
        })

        //add level bg to stage first 
        this.cafeBaseMap = PIXI.Sprite.from(this.cafeAssets.CafeBaseMap)
        this.visibleSprites.addChild(this.cafeBaseMap)

        //add character as property of level and init, adding to visibleSprites and to stage
        this.character = new Character(this.app, this.keysObject, this.spritesheetAssets, this.weaponAssets, this.display_width / 2, this.display_height / 2, this.obstacleSprites, this.bulletManager, this.particleManager, this.iconAssets)
        await this.character.init(this.visibleSprites, this.particleManager)
        this.mousePos = {x: this.character.sprite.x, y: this.character.sprite.y}
        //add foreground blocks to map
        //these are NOT obstacle sprites, just decoration
        this.parsedMapObject.foreground.forEach((row, i) => {
            row.forEach((col, j) => {
                if(col !== 0){
                    const x_pos = ((j) * TILE_WIDTH) * ZOOM_FACTOR
                    const y_pos = ((i) * TILE_HEIGHT) * ZOOM_FACTOR
                    // let x = (Math.floor(col / 28) * TILE_WIDTH) + (col % 28 * TILE_WIDTH)
                    // let y = (Math.floor(col / 28) * TILE_HEIGHT)
                    let { x, y } = getXYSlice(col, 28)
                    let w = TILE_WIDTH
                    let h = TILE_HEIGHT
                    const sliceRect = new PIXI.Rectangle(x, y, w, h);
                    const texture = new PIXI.Texture({source: this.cafeAssets.CafeTilesetPng, frame: sliceRect})
                    const tile = new Tile(this.app, x_pos, y_pos, texture, 'tile', this.visibleSprites)
                }
            })
        })

        this.uiManager = new UIManager(this.app, this.character, this.uiAssets, this.keysObject, this.iconAssets, this.clickEventManager)
        await this.uiManager.init()
        
        

        //add obstacle sprites to stage
        this.app.stage.addChild(this.obstacleSprites)

        //add custom camera group to stage
        this.app.stage.addChild(this.visibleSprites)  

        //add animated tiles
        this.initializeAnimatedTiles()

        //add bullet manager group to stage
        this.app.stage.addChild(this.bulletManager)

        //addparticle manager group to stage
        this.app.stage.addChild(this.particleManager)

        //append ui to stage
        this.app.stage.addChild(this.uiManager.uiContainer)

        //init and add clickEventManager to stage, for rendering click event icons
        this.clickEventManager.init(this.character, this.uiManager, this.keysObject)
        this.app.stage.addChild(this.clickEventManager)
    }

    initializeAnimatedTiles = async () => {
        await this.createPuddleTile()
        await this.createHellCircleTile()
        await this.createTrashPile()
    }

    createPuddleTile = async () => {
        //create puddle with drips
        const spritesheet = new PIXI.Spritesheet(this.animatedTileAssets.PuddleTile,
            tileSpriteData)
        await spritesheet.parse()

        const x_pos = 400 * ZOOM_FACTOR
        const y_pos = 400 * ZOOM_FACTOR
        const label = "animated_tile_puddle"
        const isParticleTile = true
        const animationSpeed = .5
        const scale = 1.7
        const alpha = .6
        const animatedTile = new AnimatedTile(this.app, x_pos, y_pos, spritesheet.animations.main, label, this.visibleSprites, isParticleTile, animationSpeed, scale, alpha)
    }

    createHellCircleTile = async () => {
        //create hell portal
        const spritesheet = new PIXI.Spritesheet(this.animatedTileAssets.HellCircleInactive,
            hellCircleInactiveData)
        await spritesheet.parse()
        
        const x_pos = 600 * ZOOM_FACTOR
        const y_pos = 500 * ZOOM_FACTOR
        const label = "animated_tile_hell_circle"
        const isParticleTile = false
        const animationSpeed = .25
        const scale = 1
        const alpha = 1
        //some animated tiles have their own bespoke class
        //hell portal is assigned as object proerty so values can be animated in run
        this.animatedTile = new HellPortalObject(this.app, x_pos, y_pos, spritesheet.animations.main, label, this.visibleSprites, isParticleTile, animationSpeed, scale, alpha, new GlowFilter({alpha: 0.4, distance: 20}))
    }

    createTrashPile = async () => {
        //create hell portal
        const spritesheet = new PIXI.Spritesheet(this.animatedTileAssets.TrashPile,
           trashPileData)
        await spritesheet.parse()
        
        const x_pos = 415
        const y_pos = 120
        const label = "animated_tile_trash_pile"
        const isParticleTile = false
        const animationSpeed = .25
        const scale = 1.5
        const alpha = 1
        const animatedTile = new AnimatedTile(this.app, x_pos, y_pos, spritesheet.animations.main, label, this.visibleSprites, isParticleTile, animationSpeed, scale, alpha)
    }

    getPlayerAngle = (mousePos) => {
        if(mousePos.x && mousePos.y){
            
            this.offset.x = this.character.sprite.x + (this.character.sprite.width / 2) - (this.display_width / 2)
            this.offset.y = this.character.sprite.y + (this.character.sprite.height / 2) - (this.display_width / 2)
            const dx = mousePos.x - this.character.sprite.x - (this.character.sprite.width / 2)
            const dy = mousePos.y - this.character.sprite.y - (this.character.sprite.height / 2)
            
            //calculate angle and convert from rads to degrees
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI

            return angle
        }
    }

    //the level's run method is added to the stage by the Application class
    run = () => {
        //run the click event manager
        this.clickEventManager.run()
        //this.character.sprite is passed to run methods of sprite groups
        //for calculating offset, keeping character centered

        //ORDER MATTERS HERE
        let angle = this.getPlayerAngle(this.mousePos)
        this.character.run(angle)
        this.particleManager.run(this.character.sprite)
        this.obstacleSprites.run(this.character.sprite)
        this.visibleSprites.run(this.character.sprite)
        this.bulletManager.run(this.character.sprite)
        this.uiManager.run()
    }
}
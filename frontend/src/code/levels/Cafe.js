import * as PIXI from 'pixi.js'
import { TILE_HEIGHT, TILE_WIDTH, ZOOM_FACTOR }from '../../settings'
import { parseMapData, getXYSlice, spritesAreColliding } from '../../utils'
import { cafeMapData } from '../../map_data/cafeMapData'
import Character from '../Character'
import Tile, { PatrolTile } from '../Tile'
import { AnimatedTile, HellPortalObject } from '../Tile'
import ParticleManager from '../Particles'
import BulletManager from '../BulletManager'
import { tileSpriteData, hellCircleData, trashPileData } from '../../json/tiles/tileSpriteData'
import UIManager from '../UI'
import { NPCManager } from '../NPCManager'
import Level from './Level'
import { GodrayFilter, MotionBlurFilter } from 'pixi-filters'

export default class Cafe extends Level{
    constructor(app, keysObject, stateLabel, setState){
        super(app, keysObject, stateLabel)

        //a function from teh state manager to change states
        this.setState = setState

    }

    
    initMap = async (gameState) => {
        //initialized the level's master container. this is the
        //container that holds all other containers and the one
        //that is 'cleaned up' in each level's destroy method
        // this.initMasterLevelContainer()

        //sets up even listener used by keysObject to handle key events
        //HAS TO BE CALLED HERE...cant be called in constructor
        this.setUpKeyEvents()
        
        this.app.stage.on('mousemove', this.onMouseMove)

        //initialize assets used in this level
        this.cafeAssets = await PIXI.Assets.loadBundle('cafe_assets')
        this.spritesheetAssets = await PIXI.Assets.loadBundle('character_spritesheets')
        this.weaponAssets = await PIXI.Assets.loadBundle('weapon_assets')
        this.particleAssets = await PIXI.Assets.loadBundle('particle_spritesheets')
        this.bulletAssets = await PIXI.Assets.loadBundle('bullet_assets')
        this.animatedTileAssets = await PIXI.Assets.loadBundle('tile_spritesheets')
        this.uiAssets = await PIXI.Assets.loadBundle('ui_assets')
        this.iconAssets = await PIXI.Assets.loadBundle("icons")
        this.cafeObjectsAssets = await PIXI.Assets.loadBundle("overworld_objects")
        this.npcSpritesheets = await PIXI.Assets.loadBundle('npc_spritesheets')
        this.fonts = await PIXI.Assets.loadBundle("fonts")

        //parse map data...
        this.parsedMapObject = parseMapData(cafeMapData)
        
        //width of entire map in tiles, set in Tiled program and obtained from parsedMapObject
        this.levelRowWidth = this.parsedMapObject.width
        this.levelRowHeight = this.parsedMapObject.height

        //init the particleManager
        this.particleManager = new ParticleManager(this.app, this.particleAssets)
        await this.particleManager.init()

        ////ORDER MATTERS HERE/////

        const tilesetPngWidth = this.cafeAssets.CafeTilesetPng.width / TILE_WIDTH
        const tilesetPngHeight = this.cafeAssets.CafeTilesetPng.height / TILE_HEIGHT
        
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
                    const sliceRect = new PIXI.Rectangle(x, y, w, h)
                    const texture = new PIXI.Texture({source: this.cafeAssets.CafeTilesetPng, frame: sliceRect})
                    const tile = new Tile(this.app, x_pos, y_pos, texture, 'boundary', this.obstacleSprites)
                }
            })
        })

        //event tile. this is for crafting area
        this.parsedMapObject.event.forEach((row, i) => {
            row.forEach((col, j) =>{
                if(col !== 0){
                    //offset is to adjust for fact that bg png and tiles don't line up
                    const x_pos = ((j) * TILE_WIDTH) * ZOOM_FACTOR
                    const y_pos = ((i) * TILE_HEIGHT) * ZOOM_FACTOR
                    let { x, y } = getXYSlice(col - 1, tilesetPngWidth)
                    let w = TILE_WIDTH
                    let h = TILE_HEIGHT
                    const sliceRect = new PIXI.Rectangle(x, y, w, h)
                    const texture = new PIXI.Texture({source: this.cafeAssets.CafeTilesetPng, frame: sliceRect})
                    const tile = new Tile(this.app, x_pos, y_pos, texture, 'tile', this.visibleSprites)
                    this.craftingTile = new PIXI.Sprite(texture)
                    this.craftingTile.alpha = 0
                    this.craftingTile.x = x_pos
                    this.craftingTile.y = y_pos
                    this.craftingTile.width = w
                    this.craftingTile.height = h
                    this.visibleSprites.addChild(this.craftingTile)
                }
            })
        })

        //add level bg to stage first 
        this.cafeBaseMap = PIXI.Sprite.from(this.cafeAssets.CafeBaseMap)
        this.visibleSprites.addChild(this.cafeBaseMap)

        this.npcManager = new NPCManager(this.app, this.stateLabel, this.npcSpritesheets, null, this.visibleSprites, this.obstacleSprites)
        //init bulletManager
        this.bulletManager = new BulletManager(this.app, this.bulletAssets, this.obstacleSprites, this.particleManager, this.npcManager.enemies)
        
        // this.character = new Character(this.app, this.keysObject, this.spritesheetAssets, this.weaponAssets, this.display_width / 2, this.display_height / 2)
        this.character = gameState.character
        
        this.mousePos = {x: 0, y: 0}
        //add foreground blocks to map
        //these are NOT obstacle sprites, just decoration
        this.parsedMapObject.foreground.forEach((row, i) => {
            row.forEach((col, j) => {
                if(col !== 0){
                    const x_pos = ((j) * TILE_WIDTH) * ZOOM_FACTOR
                    const y_pos = ((i) * TILE_HEIGHT) * ZOOM_FACTOR
                    // let x = (Math.floor(col / levelRowWidth) * TILE_WIDTH) + (col % levelRowWidth * TILE_WIDTH)
                    // let y = (Math.floor(col / levelRowWidth) * TILE_HEIGHT)
                    let { x, y } = getXYSlice(col - 1, tilesetPngWidth)
                    let w = TILE_WIDTH
                    let h = TILE_HEIGHT
                    const sliceRect = new PIXI.Rectangle(x, y, w, h)
                    const texture = new PIXI.Texture({source: this.cafeAssets.CafeTilesetPng, frame: sliceRect})
                    const tile = new Tile(this.app, x_pos, y_pos, texture, 'tile', this.visibleSprites)
                }
            })
        })

        //parse and handle npc patrol points object layer
        this.npcPatrolPoints = {}
        this.parsedMapObject.object_npc_patrol_points.forEach((point, i) => {
            const pointNpcKey = point.properties.find(prop => prop.name === "npcKey").value
            const xPos = point.x * ZOOM_FACTOR
            const yPos = point.y * ZOOM_FACTOR
            let x = 690
            let y = 510
            let w = TILE_WIDTH
            let h = TILE_HEIGHT
            const sliceRect = new PIXI.Rectangle(x, y, w, h)
            const texture = new PIXI.Texture({source: this.cafeAssets.CafeTilesetPng, frame: sliceRect})
            const newPatrolPointTile = new PatrolTile(this.app, xPos, yPos, texture, 'patrol_tile', this.npcTiles, true, pointNpcKey)
            if(!this.npcPatrolPoints[pointNpcKey]){
                this.npcPatrolPoints[pointNpcKey] = []
                this.npcPatrolPoints[pointNpcKey].push(newPatrolPointTile)
            }
            else{
                this.npcPatrolPoints[pointNpcKey].push(newPatrolPointTile)
            }
        })
        console.log("just checking...", this.npcPatrolPoints)
           
        //parse and handle object spawn points layer. these are spawn
        //points for any npc's or complex objects
        this.parsedMapObject.object_spawn_points.forEach(async (object) => {
            //hell portal
            if(object.name.startsWith("hell_circle")){
                await this.createHellCircleTile(object)      
            }
            //player spawn
            else if(object.name.startsWith("player_spawn")){
                this.playerSpawnPoint = {x: object.x * ZOOM_FACTOR, y: object.y * ZOOM_FACTOR}
            }
            //npc spawn points
            else if(object.name.startsWith("npc")){
                const npcKey = object.properties.find(prop => prop.name === 'npcKey').value
                const isPatrollingNpc = object.properties.find(prop => prop.name === 'isPatrolling').value
                const spawnPosition = {x: object.x * ZOOM_FACTOR, y: object.y * ZOOM_FACTOR}
                const patrolPointsArray = this.npcPatrolPoints[npcKey]

                await this.npcManager.initEmployee(npcKey, spawnPosition, isPatrollingNpc, isPatrollingNpc ? patrolPointsArray : null, this.stateLabel)
            }
        })

        await this.character.init(this.visibleSprites, this.particleManager, this.playerSpawnPoint, this.obstacleSprites, this.bulletManager, gameState.inventory, gameState.equipment, gameState.quickBar)

        this.uiManager = new UIManager(this.app, this.character, this.uiAssets, this.fonts, this.keysObject, this.iconAssets, this.clickEventManager, this.mousePos, this.npcManager.employees, this.stateLabel, this.npcManager.enemies)
        await this.uiManager.init()

        //add obstacle sprites to stage
        this.app.stage.addChild(this.obstacleSprites)

        //add custom camera group to stage
        this.app.stage.addChild(this.visibleSprites)  

        //add npc tiles to stage
        this.app.stage.addChild(this.npcTiles)

        //add animated tiles
        this.initializeAnimatedTiles()

        //add bullet manager group to stage
        this.app.stage.addChild(this.bulletManager)

        //addparticle manager group to stage
        this.app.stage.addChild(this.particleManager)

        //append ui to stage
        this.app.stage.addChild(this.uiManager.uiContainer)
        this.app.stage.addChild(this.uiManager.tooltipContainer)

        //init and add clickEventManager to stage, for rendering click event icons
        this.clickEventManager.init(this.character, this.uiManager, this.uiManager.craftingWindow, this.keysObject)
        this.app.stage.addChild(this.clickEventManager)

        //weapon fire event
        this.app.stage.on('pointerdown', this.handleMouseDown)

        const filters = [new MotionBlurFilter({velocity: {x: 0, y: 40}}), new GodrayFilter()]
        this.particleManager.createAnimatedParticle(this.character.sprite.x + (this.character.sprite.width * 4), this.character.sprite.y + this.character.sprite.height, 'Teleport_Beam', filters)
    }

    handleMouseDown = () => {
        if(this.character.activeWeapon){
            // this.activeWeapon.fire()
            this.bulletManager.fireWeapon(this.character.activeWeapon, this.angle, this.character.sprite.x, this.character.sprite.y)
        }
    }

    initializeAnimatedTiles = async () => {
        await this.createPuddleTile()
        await this.createTrashPile()
        await this.createEspressoMachine()
    }

    createEspressoMachine = async () => {
        const texture = this.cafeObjectsAssets.EspressoMachineActive
        // const espressoMachine = new EspressoMachine(this.app, 200, 200, texture, "espresso_machine", this.visibleSprites, true, .25, 1, 1, [])
        const espressoMachine = new Tile(this.app, 374, 289, texture, "espresso_machine", this.visibleSprites)
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

    createHellCircleTile = async (object) => {
        
        //generateAnimations populates parts of characterData json-esque object
        const generateAnimations = hellCircleData.generateAnimations.bind(hellCircleData)
        generateAnimations(this.animatedTileAssets.HellCircle)
        //create hell portal
        const spritesheet = new PIXI.Spritesheet(this.animatedTileAssets.HellCircle,
            hellCircleData)
        await spritesheet.parse()
        const label = "animated_tile_hell_circle"
        const isParticleTile = false
        const animationSpeed = .3
        const scale = ZOOM_FACTOR
        const alpha = 1
        //some animated tiles have their own bespoke class
        //hell portal is assigned as object proerty so values can be animated in run
        this.hellPortal = new HellPortalObject(this.app, (object.x * ZOOM_FACTOR) - object.width, (object.y * ZOOM_FACTOR) - object.height, spritesheet.animations.idle, label, this.visibleSprites, isParticleTile, animationSpeed, scale, alpha, null, this.setState, spritesheet, object)
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

    //cleanup function
    destroy() {
        // stop animations/tickers
        this.app.ticker.remove(this.run)

        //remove weapon fire event
        this.app.stage.off('pointerdown', this.handleMouseDown)

        if(this.hellPortal)this.hellPortal.destroy({children: true})

        //remove keyDown and keyUp events
        this.removeKeyEvents()

        this.visibleSprites.removeChildren()
        this.obstacleSprites.removeChildren()

        if(this.character){
            this.character.sprite.destroy()
            this.character = null
        }

        // remove all containers 
        while (this.app.stage.children.length > 0) {
            const child = this.app.stage.children[0]
            console.log('DESTORYED A THING', child)
            this.app.stage.removeChild(child)
            child.destroy({ children: true })
        }
    }

    //the level's run method is added to the stage by the Application class
    run = () => {
        //run the click event manager
        this.clickEventManager.run()
        //this.character.sprite is passed to run methods of sprite groups
        //for calculating offset, keeping character centered

        //ORDER MATTERS HERE
        this.angle = this.getPlayerAngle(this.mousePos)
        this.character.run(this.angle)
        this.npcManager.run(this.character)
        this.particleManager.run(this.character.sprite)
        this.obstacleSprites.run(this.character.sprite)
        this.npcTiles.run(this.character.sprite)
        this.visibleSprites.run(this.character.sprite)
        this.bulletManager.run(this.character.sprite)
        
        
        this.uiManager.run()
        this.hellPortal.run(this.character)

        if(spritesAreColliding(this.character.sprite, this.craftingTile)){
            this.character.inCraftingPosition = true
            
        }else this.character.inCraftingPosition = false
    }
}
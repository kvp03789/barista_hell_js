import Level from './Level'
import Character from '../Character'
import Tile, { AnimatedTile, HellPortalObject, PolygonCollisionShape, SirenStatue, Stairs, Torch } from '../Tile'
import ParticleManager from '../Particles'
import BulletManager from '../BulletManager'
import { Assets, Sprite, Rectangle, Texture, Spritesheet, Container, Graphics } from 'pixi.js'
import { NPCManager } from '../NPCManager'
import { TILE_HEIGHT, TILE_WIDTH, ZOOM_FACTOR }from '../../settings'
import { parseMapData, getXYSlice, spritesAreColliding, randomNumber, createSATPolygonFromPoints } from '../../utils'
import { hellOverworldMapData } from '../../map_data/hellOverworldMapData'
import UIManager from '../UI'
import ParallaxBackgroundManager from '../ParallaxBackgroundManager'
import { torchPoleData } from '../../json/tiles/tileSpriteData'
import { GodrayFilter, MotionBlurFilter } from 'pixi-filters'
// import ForegroundSprites from '../ForegroundSprites'
import { DropsManager } from '../DropsManager'
import YSortCameraSpriteGroup from '../YSortCameraSpriteGroup'
import ObstacleSpriteGroup from '../ObstacleSpriteGroup'
import NPCTilesGroup from '../NPCTilesGroup'
import { ClickEventManager } from '../ClickEventManager'

export default class HellOverWorld extends Level{
    constructor(app, keysObject, stateLabel, setState){
        super(app, keysObject, stateLabel)
        // this.foregroundSpriteGroup = new ForegroundSprites(app)

        //a function from teh state manager to change states
        this.setState = setState
        }

        initMap = async (gameState) => {
            this.visibleSprites = new YSortCameraSpriteGroup(this.app)
            this.obstacleSprites = new ObstacleSpriteGroup(this.app)
            this.npcTiles = new NPCTilesGroup(this.app)
            this.clickEventManager = new ClickEventManager(this.app, this.visibleSprites)
            
            //initialized the level's master container. this is the
            //container that holds all other containers and the one
            //that is 'cleaned up' in each level's destroy method
            //HAS TO BE CALLED HERE...cant be called in constructor
            // this.initMasterLevelContainer()

            //sets up even listener used by keysObject to handle key events
            //HAS TO BE CALLED HERE...cant be called in constructor
            this.setUpKeyEvents()

            this.app.stage.on('mousemove', this.onMouseMove)

            //initialize assets used in this level
            this.hellOverworldAssets = await Assets.loadBundle('hell_overworld_assets');
            this.spritesheetAssets = await Assets.loadBundle('character_spritesheets');
            this.weaponAssets = await Assets.loadBundle('weapon_assets')
            this.particleAssets = await Assets.loadBundle('particle_spritesheets')
            this.bulletAssets = await Assets.loadBundle('bullet_assets')
            this.animatedTileAssets = await Assets.loadBundle('tile_spritesheets')
            this.uiAssets = await Assets.loadBundle('ui_assets')
            this.iconAssets = await Assets.loadBundle("icons")
            this.hellObjectsAssets = await Assets.loadBundle("overworld_objects")
            this.npcSpritesheets = await Assets.loadBundle('npc_spritesheets')
            this.enemySpritesheets = await Assets.loadBundle('enemy_spritesheets')
            this.fonts = await Assets.loadBundle("fonts")
            this.parallaxBackgroundAssets = await Assets.loadBundle("hell_parallax_background_assets")
            this.dropsAssets = await Assets.loadBundle("drops")
    
            //parse map data...
            this.parsedMapObject = parseMapData(hellOverworldMapData)

            //width of entire map in tiles, set in Tiled program
            this.levelRowWidth = this.parsedMapObject.width
            this.levelRowHeight = this.parsedMapObject.height
    
            //init the particleManager
            this.particleManager = new ParticleManager(this.app, this.particleAssets)
            await this.particleManager.init()
            this.particleManager.initializeAshParticles()
    
           
            ////ORDER MATTERS HERE/////
            
            const tilesetPngWidth = this.hellOverworldAssets.HellOverworldTilesetPng.width / TILE_WIDTH
            const tilesetPngHeight = this.hellOverworldAssets.HellOverworldTilesetPng.height / TILE_HEIGHT

            //add collision blocks to map
                    this.parsedMapObject.obstacles.forEach((row, i) => {
                        row.forEach((col, j) =>{
                            if(col !== 0){
                                const x_pos = ((j) * TILE_WIDTH) * ZOOM_FACTOR
                                const y_pos = ((i) * TILE_HEIGHT) * ZOOM_FACTOR
                                // let x = 450
                                // let y = 330
                                let { x, y } = getXYSlice(col - 1, tilesetPngWidth)
                                // let x = 450
                                // let y = 330
                                let w = TILE_WIDTH
                                let h = TILE_HEIGHT
                                const sliceRect = new Rectangle(x, y, w, h);
                                const texture = new Texture({source: this.hellOverworldAssets.HellOverworldTilesetPng, frame: sliceRect})
                                const tile = new Tile(this.app, x_pos, y_pos, texture, 'boundary', this.obstacleSprites, col == 312 ? false : true)
                            }
                        })
                    })
    
            //add level bg to stage first 
            this.hellOverWorldBaseMap = Sprite.from(this.hellOverworldAssets.HellOverworldBaseMap)
            this.hellOverWorldBaseMap.label = "hell_overworld_base_map"
            this.visibleSprites.addChild(this.hellOverWorldBaseMap)
    
            //add character as property of level and init, adding to visibleSprites and to stage
            this.character = gameState.character

            this.dropsManager = new DropsManager(this.app, this.visibleSprites, this.dropsAssets, this.iconAssets, this.character)

            this.npcManager = new NPCManager(this.app, this.stateLabel, this.npcSpritesheets, this.enemySpritesheets, this.visibleSprites, this.obstacleSprites, this.dropsManager)

            //init bulletManager
            this.bulletManager = new BulletManager(this.app, this.bulletAssets, this.obstacleSprites, this.particleManager, this.npcManager.enemies)
            
            this.mousePos = {x: 0, y: 0}

            this.parallaxBackgroundManager = new ParallaxBackgroundManager(this.app, this.character, this.parallaxBackgroundAssets)

            //object layer
            this.parsedMapObject.objects.forEach(async (object, i) => {
                //collision polygon objects
                if(object.name.startsWith("collision_polygon")){
                    const x = object.x 
                    const y = object.y
                    const polygon = new PolygonCollisionShape(this.app, x, y, object.width, object.height, object.name, this.obstacleSprites, false)
                }
                //enemy spawn points
                else if(object.name === 'enemy_spawn'){
                    const x = object.x * ZOOM_FACTOR
                    const y = object.y * ZOOM_FACTOR
                    const enemyKey = object.properties.find(element => element.name === 'enemy').value
                    await this.npcManager.initEnemy(enemyKey, x, y)
                }
                else{
                    const texture = this.hellOverworldAssets[object.name]
                    const x = object.x * ZOOM_FACTOR
                    const y = object.y - ((object.height * ZOOM_FACTOR) / 2)
                    if(object.name === "Stairs"){
                        this.stairs = new Stairs(this.app, x, y, texture, `object_${object.name}`, this.visibleSprites)
                    }
                    else if(object.name === "SirenStatue"){
                        this.sirenStatue = new SirenStatue(this.app, x, y, texture, `object_${object.name}`, this.visibleSprites, false, this.hellOverworldAssets.SirenPortal, this.setState, this.keysObject)
                        await this.sirenStatue.init()
                    }
                    else if(object.name === 'player_spawn'){
                        this.playerSpawnPoint = {x: object.x * ZOOM_FACTOR, y: object.y * ZOOM_FACTOR}
                    }
                    else{
                        const objectTile = new Tile(this.app, x, y, texture, `object_${object.name}`, this.visibleSprites, false)
                    }
                    
                }
            })
            
            // await this.character.init(this.visibleSprites, this.particleManager, this.playerSpawnPoint)
            await this.character.init(this.visibleSprites, this.particleManager, this.playerSpawnPoint, this.obstacleSprites, this.bulletManager, gameState.inventory, gameState.equipment, gameState.quickBar)

            //init the buff manager which is born in top level (index.js)
            this.buffManager = gameState.buffManager
            
            //animatedTiles
            this.parsedMapObject.animatedTiles.forEach((row, i) => {
                row.forEach((col, j) => {
                    if(col !== 0){
                        
                        const xPos = ((j) * TILE_WIDTH) * ZOOM_FACTOR
                        const yPos = ((i) * TILE_HEIGHT) * ZOOM_FACTOR
                        if(col === 311){
                            this.initTorchTile(xPos, yPos)
                        }
                        else if(col === 310){
                            //THIS NEEDS FIXING
                            // this.initHellCircleTile(xPos, yPos)
                        }
                        
                    }
                })
            })
    
            this.uiManager = new UIManager(this.app, this.character, this.uiAssets, this.fonts, this.keysObject, this.iconAssets, this.clickEventManager, this.mousePos, this.npcManager.npcList, this.stateLabel, this.npcManager.enemies, this.buffManager)
            await this.uiManager.init()

            //then give buff manager access to uiManager
            if(!this.buffManager.hasBeenInited)this.buffManager.init(this.uiManager)
    
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

            //foreground sprites
            // this.app.stage.addChild(this.foregroundSpriteGroup)
    
            //append ui to stage
            this.app.stage.addChild(this.uiManager.uiContainer)
            this.app.stage.addChild(this.uiManager.tooltipContainer)
    
            //init and add clickEventManager to stage, for rendering click event icons
            this.clickEventManager.init(this.character, this.uiManager, this.keysObject)
            this.app.stage.addChild(this.clickEventManager)
            // this.initHellArch()

            //weapon fire event
            this.app.stage.on('pointerdown', this.handleMouseDown)

            const filters = [new MotionBlurFilter({velocity: {x: 0, y: 40}}), new GodrayFilter()]
            this.particleManager.createAnimatedParticle(this.character.sprite.x + (this.character.sprite.width * 4), this.character.sprite.y + this.character.sprite.height, 'Teleport_Beam', filters)

            console.log('HERES THE BUFF MANAGER JUST IN CASE', this.buffManager)
        }

        handleMouseDown = () => {
            if (this.character && this.character.sprite) {
                if (this.character.activeWeapon) {
                    this.bulletManager.fireWeapon(
                        this.character.activeWeapon,
                        this.angle,
                        this.character.sprite.x,
                        this.character.sprite.y
                    );
                }
            } else {
                console.warn('Character or character sprite is not available during handleMouseDown.');
            }
        }

        initializeAnimatedTiles = () => {
            //TO DO//
            //torch tile!!!
            // this.initTorchTile()
            // this.initHellCircleTile()
            this.initHellArch
        }

        // initHellArch = () => {
        //     const hellArch = new Sprite(this.hellObjectsAssets.HellArch)
        //     hellArch.position.set(0, -200)
        //     this.foregroundSpriteGroup.addChild(hellArch)
        // }

        // initHellCircleTile = async (x, y) => {
        //         //create hell portal
        //         const spritesheet = new Spritesheet(this.animatedTileAssets.HellCircleInactive,
        //             hellCircleInactiveData)
        //         await spritesheet.parse()
        //         const label = "animated_tile_hell_circle"
        //         const isParticleTile = false
        //         const animationSpeed = .25
        //         const scale = 1
        //         const alpha = 1
        //         //some animated tiles have their own bespoke class
        //         //hell portal is assigned as object proerty so values can be animated in run
        //         this.animatedTile = new HellPortalObject(this.app, x, y, spritesheet.animations.main, label, this.visibleSprites, isParticleTile, animationSpeed, scale, alpha, new GlowFilter({alpha: 0.4, distance: 20}))
        //     }

        initTorchTile = async(x, y) => {
            //create animated torches
            const poleSpritesheet = new Spritesheet(this.animatedTileAssets.Torch_Pole,
                torchPoleData)
            await poleSpritesheet.parse()

            const flameSpritesheet = new Spritesheet(this.animatedTileAssets.Torch_Flame,
                torchPoleData)
            await flameSpritesheet.parse()

            const label = "animated_torch"
            const isParticleTile = false
            const animationSpeed = .16
            const scale = 2
            const alpha = 1
            const torch = new Torch(this.app, x, y, poleSpritesheet.animations.main, label, this.visibleSprites, isParticleTile, animationSpeed, scale, alpha, null, flameSpritesheet)
        }

        //cleanup function
        destroy = () => {
            // stop animations/tickers
            this.app.ticker.remove(this.run)
    
            //remove weapon fire event
            this.app.stage.off('pointerdown', this.handleMouseDown)
            this.hellOverWorldBaseMap.destroy()

            this.visibleSprites.destroy({ children: true })
            this.obstacleSprites.destroy({ children: true })
            // this.bulletManager.destroy({ children: true })
            // this.buffManager.destroy({ children: true })
            // this.dropsManager.destroy({ children: true })
            // this.npcTiles.destroy({ children: true })
            this.npcManager.destroy()

            //remove keyDown and keyUp events
            this.removeKeyEvents()
    
            if(this.character){
                this.character.sprite.destroy()
                this.character = null
            }
    
            // remove all containers 
            while (this.app.stage.children.length > 0) {
                const child = this.app.stage.children[0]
                console.log('DESTORYED A FUUUCKIN THING', child)
                this.app.stage.removeChild(child)
                child.destroy({ children: true })
            }

            this.sirenStatue.destroy()
            this.stairs.destroy()
        }

        run = (ticker) => {
            //update levels delta time
            this.deltaTime = ticker.deltaTime

            //run the click event manager
            this.clickEventManager.run()
            //this.character.sprite is passed to run methods of sprite groups
            //for calculating offset, keeping character centered
    
            //ORDER MATTERS HERE
            this.angle = this.getPlayerAngle(this.mousePos)
            this.character.run(this.deltaTime, this.angle)
            this.parallaxBackgroundManager.run(this.character)
            this.particleManager.run(this.character.sprite)
            this.obstacleSprites.run(this.character.sprite)
            this.npcTiles.run(this.character.sprite)
            
            this.visibleSprites.run(this.character.sprite)
            this.bulletManager.run(this.character.sprite, this.deltaTime)
            this.buffManager.run(ticker)
            this.uiManager.run()
            this.npcManager.run(this.character, this.deltaTime)
            // this.foregroundSpriteGroup.run(this.character)
            this.dropsManager.run(this.character)

            //objects
            this.stairs.run(this.character)
            this.sirenStatue.run(this.character)
        }
}

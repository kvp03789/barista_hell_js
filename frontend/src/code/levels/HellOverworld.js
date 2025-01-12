import Level from './Level'
import Character from '../Character'
import Tile, { AnimatedTile, HellPortalObject, PolygonCollisionShape, Stairs } from '../Tile'
import ParticleManager from '../Particles'
import BulletManager from '../BulletManager'
import { Assets, Sprite, Rectangle, Texture, Spritesheet, Container, Graphics } from 'pixi.js'
import { NPCManager } from '../NPCManager'
import { TILE_HEIGHT, TILE_WIDTH, ZOOM_FACTOR }from '../../settings'
import { parseMapData, getXYSlice, spritesAreColliding, randomNumber, createSATPolygonFromPoints } from '../../utils'
import { hellOverworldMapData } from '../../map_data/hellOverworldMapData'
import UIManager from '../UI'
import ParallaxBackgroundManager from '../ParallaxBackgroundManager'
import { torchData, hellCircleData } from '../../json/tiles/tileSpriteData'
import { GlowFilter } from 'pixi-filters'
import ForegroundSprites from '../ForegroundSprites'

export default class HellOverWorld extends Level{
    constructor(app, keysObject, stateLabel, setState){
        super(app, keysObject, stateLabel)
        this.foregroundSpriteGroup = new ForegroundSprites(app)

        //a function from teh state manager to change states
        this.setState = setState
        }

        initMap = async () => {
            //sets up even listener used by keysObject to handle key events
            //HAS TO BE CALLED HERE...cant be called in constructor
            this.setUpKeyEvents()

            //initialize assets used in this level
            this.hellOverworldAssets = await Assets.loadBundle('hell_overworld_assets');
            console.log("hell overworld assets: ", this.hellOverworldAssets)
            this.spritesheetAssets = await Assets.loadBundle('character_spritesheets');
            this.weaponAssets = await Assets.loadBundle('weapon_assets')
            this.particleAssets = await Assets.loadBundle('particle_spritesheets')
            this.bulletAssets = await Assets.loadBundle('bullet_assets')
            this.animatedTileAssets = await Assets.loadBundle('tile_spritesheets')
            this.uiAssets = await Assets.loadBundle('ui_assets')
            this.iconAssets = await Assets.loadBundle("icons")
            this.hellObjectsAssets = await Assets.loadBundle("overworld_objects")
            this.npcSpritesheets = await Assets.loadBundle('npc_spritesheets')
            this.fonts = await Assets.loadBundle("fonts")
            this.parallaxBackgroundAssets = await Assets.loadBundle("hell_parallax_background_assets")
    
            //parse map data...
            this.parsedMapObject = parseMapData(hellOverworldMapData)
            console.log("DEBUG: parsedMapObject", this.parsedMapObject)
            //width of entire map in tiles, set in Tiled program
            this.levelRowWidth = this.parsedMapObject.width
            this.levelRowHeight = this.parsedMapObject.height
    
            //init the particleManager
            this.particleManager = new ParticleManager(this.app, this.particleAssets)
            await this.particleManager.init()
            this.particleManager.initializeAshParticles()
    
            //init bulletManager
            this.bulletManager = new BulletManager(this.app, this.bulletAssets, this.obstacleSprites, this.particleManager)
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
    
            this.npcManager = new NPCManager(this.app, this.npcSpritesheets, this.visibleSprites, this.obstacleSprites)
    
            //add character as property of level and init, adding to visibleSprites and to stage
            this.character = new Character(this.app, this.keysObject, this.spritesheetAssets, this.weaponAssets, this.display_width / 2, this.display_height / 2, this.obstacleSprites, this.bulletManager, this.particleManager, this.iconAssets, this.npcManager.npcList)
            await this.character.init(this.visibleSprites, this.particleManager)
            this.mousePos = {x: this.character.sprite.x, y: this.character.sprite.y}

            this.parallaxBackgroundManager = new ParallaxBackgroundManager(this.app, this.character, this.parallaxBackgroundAssets)

            //these are NOT obstacle sprites, just decoration
            // this.parsedMapObject.facade.forEach((row, i) => {
            //     row.forEach((col, j) => {
            //         if(col !== 0){
            //             const x_pos = ((j) * TILE_WIDTH) * ZOOM_FACTOR
            //             const y_pos = ((i) * TILE_HEIGHT) * ZOOM_FACTOR
            //             // let x = (Math.floor(col / 28) * TILE_WIDTH) + (col % 28 * TILE_WIDTH)
            //             // let y = (Math.floor(col / 28) * TILE_HEIGHT)
            //             let { x, y } = getXYSlice(col - 1, tilesetPngWidth)
            //             let w = TILE_WIDTH
            //             let h = TILE_HEIGHT
            //             const sliceRect = new Rectangle(x, y, w, h);
            //             const texture = new Texture({source: this.hellOverworldAssets.HellOverworldTilesetPng, frame: sliceRect})
            //             const tile = new Tile(this.app, x_pos, y_pos, texture, 'tile', this.visibleSprites)
            //         }, bulletsPassThrough
            //     })
            // })

            //debug only, non-scaled container
            this.debugContainer = new DebugContainer(this.app)
            this.debugContainer.label = "debug_container"
            this.debugContainer.label = "debug_POLYGON"
            //end debug only

            //object layer
            this.parsedMapObject.objects.forEach((object, i) => {
                if(object.name.startsWith("collision_polygon")){
                    //collision polygon objects
                    console.log(object)
                    const x = object.x 
                    const y = object.y
                    const polygon = new PolygonCollisionShape(this.app, x, y, object.width, object.height, object.name, this.obstacleSprites, false)
                }
                else{
                    const texture = this.hellOverworldAssets[object.name]
                    const x = object.x * ZOOM_FACTOR
                    const y = object.y - ((object.height * ZOOM_FACTOR) / 2)
                    if(object.name === "Stairs"){
                        this.stairs = new Stairs(this.app, x, y, texture, `object_${object.name}`, this.visibleSprites)
                    }else{
                        const objectTile = new Tile(this.app, x, y, texture, `object_${object.name}`, this.visibleSprites, false)
                    }
                    
                }
            })

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
    
            this.uiManager = new UIManager(this.app, this.character, this.uiAssets, this.fonts, this.keysObject, this.iconAssets, this.clickEventManager, this.mousePos, this.npcManager.npcList, this.stateLabel)
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

            //foreground sprites
            this.app.stage.addChild(this.foregroundSpriteGroup)
    
            //append ui to stage
            this.app.stage.addChild(this.uiManager.uiContainer)
            this.app.stage.addChild(this.uiManager.tooltipContainer)
    
            //init and add clickEventManager to stage, for rendering click event icons
            this.clickEventManager.init(this.character, this.uiManager, this.keysObject)
            this.app.stage.addChild(this.clickEventManager)
            this.initHellArch()


            //debug only
            // this.app.stage.addChild(this.debugContainer)
            //end debug only
        }

        initializeAnimatedTiles = () => {
            //TO DO//
            //torch tile!!!
            // this.initTorchTile()
            // this.initHellCircleTile()
            this.initHellArch
        }

        initHellArch = () => {
            const hellArch = new Sprite(this.hellObjectsAssets.HellArch)
            hellArch.position.set(0, -200)
            this.foregroundSpriteGroup.addChild(hellArch)
        }

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
            //create puddle with drips
            const spritesheet = new Spritesheet(this.animatedTileAssets.Torch,
                torchData)
            await spritesheet.parse()
            const label = "animated_torch"
            const isParticleTile = false
            const animationSpeed = .2
            const scale = 2
            const alpha = 1
            const animatedTile = new AnimatedTile(this.app, x, y, spritesheet.animations.main, label, this.visibleSprites, isParticleTile, animationSpeed, scale, alpha)
        }

        run = () => {
            //run the click event manager
            this.clickEventManager.run()
            //this.character.sprite is passed to run methods of sprite groups
            //for calculating offset, keeping character centered
    
            //ORDER MATTERS HERE
            let angle = this.getPlayerAngle(this.mousePos)
            this.character.run(angle)
            this.parallaxBackgroundManager.run(this.character)
            this.particleManager.run(this.character.sprite)
            this.obstacleSprites.run(this.character.sprite)
            this.npcTiles.run(this.character.sprite)
            //debug only
            // this.debugContainer.run(this.character.sprite)
            //end debug only
            this.visibleSprites.run(this.character.sprite)
            this.bulletManager.run(this.character.sprite)
            this.uiManager.run()
            this.npcManager.run(this.character)
            this.foregroundSpriteGroup.run(this.character)

            this.stairs.run(this.character)

            console.log("STAIRS BABY", this.character.isOnStairs)
        }
}

class DebugContainer extends Container{
    constructor(app){
        super()
        this.app = app
        this.half_width = this.app.view.width / 2
        this.half_height = this.app.view.height / 2
        this.label = "Obstacle_Sprite_Group"
        this.position.set(0,0)

        this.offset = {x: 0, y: 0}
    }

    run = (player) => {
        // calculate offsets based on player's position. its basically the difference
        // in the center of the player and the center of the screen
        this.offset.x = player.x + (player.width / 2) - this.half_width
        this.offset.y = player.y + (player.height / 2) - this.half_height
        
        // update position of each child sprite based oncalculated offset
        this.children.forEach(sprite => {
            
            if(!sprite.label.startsWith("collision_polygon")){
                sprite.x -= this.offset.x * ZOOM_FACTOR
                sprite.y -= this.offset.y * ZOOM_FACTOR
                sprite.scale.set(ZOOM_FACTOR)

                //reduce alpha for obstacles:
                sprite.alpha = 1
            }
            else{
                sprite.x -= this.offset.x * ZOOM_FACTOR
                sprite.y -= this.offset.y * ZOOM_FACTOR
                sprite.scale.set(ZOOM_FACTOR)

                //reduce alpha for obstacles:
                sprite.alpha = 0
                //collision polygons have a run method that updates their sat coords
                //with the offset calculated here
                
            }
        })
    }
}
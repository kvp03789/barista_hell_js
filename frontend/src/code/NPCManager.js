import { AnimatedSprite, Container, Spritesheet } from "pixi.js"
import { robertSpriteData, sarahSpriteData } from '../json/npc/npcSpriteData'
import { ANIMATION_SPEED, NPC_DIALOGUE_DISTANCE } from "../settings"
import { SarahNPC, RobertNPC, Sarah } from "./npc_base_classes/Employee"
import { enemySpriteData } from "../json/enemy/enemySpriteData"
import { Enemy } from "./npc_base_classes/Enemy"

export class NPCManager{
    constructor(app, stateLabel, npcSpritesheets, enemySpritesheets, visibleSprites,  obstacleSprites){
        this.app = app
        this.stateLabel = stateLabel
        // this.player = player
        this.visibleSprites = visibleSprites
        this.obstacleSprites = obstacleSprites

        this.npcSpritesheets = npcSpritesheets
        this.enemySpritesheets = enemySpritesheets
        this.parsedAssetsObject = {}
        this.parseAssets()

        this.customers = []
        this.employees = []
        this.enemies = []

        //list of all npc lists
        this.npcList = []
    }

    parseAssets = () => {
        //npc spritesheets
        for(let key in this.npcSpritesheets){
            if(key.startsWith("NPCSpritesheet_")){
                this.parsedAssetsObject[key.replace("NPCSpritesheet_", "")] = this.npcSpritesheets[key]
            }
        }

        //enemy spritesheets
        for(let key in this.enemySpritesheets){
            if(key.startsWith("EnemySpritesheet_")){
                this.parsedAssetsObject[key.replace("EnemySpritesheet_", "")] = this.enemySpritesheets[key]
            }
        }      
    }

    initRobertNPC = async () => {
        this.robertNPCSpritesheet = new Spritesheet(this.parsedAssetsObject.RobertSpritesheet,
            robertSpriteData)
        await this.robertNPCSpritesheet.parse()

        this.robertNPC = new AnimatedSprite(this.robertNPCSpritesheet.animations.idle)
        //add Robert npc to npc list
        this.npcList.push(this.robertNPC)
        this.robertNPC.position.set(1000, 600)
        this.visibleSprites.addChild(this.robertNPC)
        this.robertNPC.label = "robert_npc"
        this.robertNPC.scale.set(2)
        this.robertNPC.width = 170
        this.robertNPC.height = 125
        this.robertNPC.animationSpeed = ANIMATION_SPEED
        this.robertNPC.play()
    }

    initSarahNPC = async (sarahNPCTiles) => {
        //generateAnimations populates parts of characterData json-esque object
        const generateAnimations = sarahSpriteData.generateAnimations.bind(sarahSpriteData);
        generateAnimations(this.npcSpritesheets.SarahSpritesheet);

        //init sarah's sprite
        const sarahNPCSpritesheet = new Spritesheet(this.parsedAssetsObject.SarahSpritesheet,
            sarahSpriteData)
        await sarahNPCSpritesheet.parse()

        const xPos = sarahNPCTiles[2].x_pos
        const yPos = sarahNPCTiles[2].y_pos
        this.sarahNPC = new Sarah(this.app, this.player, this.visibleSprites,  this.obstacleSprites, sarahNPCSpritesheet, sarahNPCSpritesheet.animations.idle_down,xPos, yPos, "sarah_npc", sarahNPCTiles)
        //add sarah npc to npc list
        this.npcList.push(this.sarahNPC)
    }

    //the enemyKey should be capitalized so that it lines up with references
    //in enemy json file as well as assetManifest
    initEnemey = async (enemyKey, x, y) => {
         
        //generateAnimations populates parts of characterData json-esque object
        const generateAnimations = enemySpriteData[enemyKey].generateAnimations.bind(enemySpriteData[enemyKey]);
        generateAnimations(this.enemySpritesheets[`EnemySpritesheet_${enemyKey}`])
        console.log("ENEMY KEY", enemySpriteData)
        //init enemy's sprite
        const enemySpritesheet = new Spritesheet(this.parsedAssetsObject[enemyKey],
            enemySpriteData[enemyKey])
        await enemySpritesheet.parse()

        const newEnemy = new Enemy(this.app, this.player, this.visibleSprites,  this.obstacleSprites, enemySpritesheet, enemySpritesheet.animations.idle, x, y, `enemy_${enemyKey}`, null, this.stateLabel, enemyKey)
        //add sarah npc to npc list
        this.enemies.push(newEnemy)
        this.npcList.push(newEnemy)
    }

    //this checks to see if player is close enough
    //with npc to begin dialogue. if so, player.touchingNPC set to true
    checkPlayerNPCCollision = (player, npc, tolerance = NPC_DIALOGUE_DISTANCE) => {
        return Math.abs(npc.x - player.sprite.x) <= tolerance && Math.abs(npc.y - player.sprite.y) <= tolerance
    }

    run = (player) => {
        this.npcList.forEach(child => {
            //execute all the npc's run functions
            if(child.run){
                child.run(player)
            }

            //run collision check with player for dialogue handling
            if(this.checkPlayerNPCCollision(player, child)){
                child.touchingPlayer = true
            }
            else{
                child.touchingPlayer = false
            }
        })
    }
}
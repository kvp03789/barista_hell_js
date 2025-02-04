import { AnimatedSprite, Container, Spritesheet } from "pixi.js"
import { npcSpriteData} from '../json/npc/npcSpriteData'
import { ANIMATION_SPEED, NPC_DIALOGUE_DISTANCE } from "../settings"
import { Employee, PatrollingEmployee } from "./npc_base_classes/Employee"
import { enemySpriteData } from "../json/enemy/enemySpriteData"
import { Enemy } from "./npc_base_classes/Enemy"
import { isPointInCircle } from "../utils"

export class NPCManager{
    constructor(app, stateLabel, npcSpritesheets, enemySpritesheets, visibleSprites,  obstacleSprites, dropsManager){
        this.app = app
        this.stateLabel = stateLabel
        // this.player = player
        this.visibleSprites = visibleSprites
        this.obstacleSprites = obstacleSprites
        this.dropsManager = dropsManager

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

    // initRobertNPC = async () => {
    //     this.robertNPCSpritesheet = new Spritesheet(this.parsedAssetsObject.RobertSpritesheet,
    //         robertSpriteData)
    //     await this.robertNPCSpritesheet.parse()

    //     this.robertNPC = new AnimatedSprite(this.robertNPCSpritesheet.animations.idle)
    //     //add Robert npc to npc list
    //     this.npcList.push(this.robertNPC)
    //     this.robertNPC.position.set(1000, 600)
    //     this.visibleSprites.addChild(this.robertNPC)
    //     this.robertNPC.label = "robert_npc"
    //     this.robertNPC.scale.set(2)
    //     this.robertNPC.width = 170
    //     this.robertNPC.height = 125
    //     this.robertNPC.animationSpeed = ANIMATION_SPEED
    //     this.robertNPC.play()
    // }

    // initSarahNPC = async (sarahNPCTiles) => {
    //     //generateAnimations populates parts of characterData json-esque object
    //     const generateAnimations = sarahSpriteData.generateAnimations.bind(sarahSpriteData);
    //     generateAnimations(this.npcSpritesheets.SarahSpritesheet);

    //     //init sarah's sprite
    //     const sarahNPCSpritesheet = new Spritesheet(this.parsedAssetsObject.SarahSpritesheet,
    //         sarahSpriteData)
    //     await sarahNPCSpritesheet.parse()

    //     const xPos = sarahNPCTiles[2].x_pos
    //     const yPos = sarahNPCTiles[2].y_pos
    //     this.sarahNPC = new Sarah(this.app, this.player, this.visibleSprites,  this.obstacleSprites, sarahNPCSpritesheet, sarahNPCSpritesheet.animations.idle_down,xPos, yPos, "sarah_npc", sarahNPCTiles)
    //     //add sarah npc to npc list
    //     this.npcList.push(this.sarahNPC)
    // }

    initEmployee = async (npcKey, position, isPatrollingNpc, patrolTiles, stateLabel) => {
        //generateAnimations populates parts of characterData json-esque object
        const generateAnimations = npcSpriteData[npcKey].generateAnimations.bind(npcSpriteData[npcKey]);
        generateAnimations(this.npcSpritesheets[`${npcKey}Spritesheet`]);

        //init spritesheet
        const npcSpritesheet = new Spritesheet(this.parsedAssetsObject[`${npcKey}Spritesheet`],
            npcSpriteData[npcKey])
        await npcSpritesheet.parse()
        let xPos
        let yPos
        if(patrolTiles){
            xPos = patrolTiles[2].x_pos
            yPos = patrolTiles[2].y_pos
        }
        else{
            xPos = position.x
            yPos = position.y
        }
        //init a patrolling npc if the npc is a patrolling one
        if(isPatrollingNpc){
            this[`${npcKey}_npc`] = new PatrollingEmployee(this.app, this.player, this.visibleSprites,  this.obstacleSprites, npcSpritesheet, npcSpritesheet.animations.idle_down, xPos, yPos, `${npcKey}_npc`, stateLabel, patrolTiles)

        }
        else this[`${npcKey}_npc`] = new Employee(this.app, this.player, this.visibleSprites,  this.obstacleSprites, npcSpritesheet, npcSpritesheet.animations.idle_down, xPos, yPos, `${npcKey}_npc`, stateLabel)

        //add employee to employees array
        this.employees.push(this[`${npcKey}_npc`])
        console.log('DEBUGGING EMPLOYEES LIST: ', this.employees)
    }

    //the enemyKey should be capitalized so that it lines up with references
    //in enemy json file as well as assetManifest
    initEnemy = async (enemyKey, x, y) => {
         
        //generateAnimations populates parts of characterData json-esque object
        const generateAnimations = enemySpriteData[enemyKey].generateAnimations.bind(enemySpriteData[enemyKey]);
        generateAnimations(this.enemySpritesheets[`EnemySpritesheet_${enemyKey}`])
        //init enemy's sprite
        const enemySpritesheet = new Spritesheet(this.parsedAssetsObject[enemyKey],
            enemySpriteData[enemyKey])
        await enemySpritesheet.parse()
        const newEnemy = new Enemy(this.app, this.player, this.visibleSprites,  this.obstacleSprites, enemySpritesheet, enemySpritesheet.animations.idle_down, x, y, `enemy_${enemyKey}`, null, this.stateLabel, enemyKey)
        //add sarah npc to npc list
        this.enemies.push(newEnemy)
    }

    //this checks to see if player is close enough
    //with npc to begin dialogue. if so, player.touchingNPC set to true
    checkPlayerNPCCollision = (player, npc, tolerance = NPC_DIALOGUE_DISTANCE) => {
        return Math.abs(npc.x - player.sprite.x) <= tolerance && Math.abs(npc.y - player.sprite.y) <= tolerance
    }

    handleEnemyAggro(player, enemy) {
        if (isPointInCircle(player.sprite.x, player.sprite.y, enemy.x + enemy.width / 2, enemy.y + enemy.height /2, enemy.visionRadius)) {
            // iif within aggro radius, start targeting the player
            if (!enemy.isAggroed) {
                enemy.isAggroed = true
                enemy.targetPlayer = true
                enemy.onAggro() // trigger aggro logic on enemy
            }

            // update movement direction towards the player
            enemy.movement.x = Math.sign(player.sprite.x - enemy.x)
            enemy.movement.y = Math.sign(player.sprite.y - enemy.y)
        } else if (enemy.isAggroed) {
            // if out of range, reset aggro state
            enemy.isAggroed = false
            enemy.targetPlayer = false
            // handle what happens when the enemy disengages
            enemy.onDisengage() 
            enemy.movement.x = 0
            enemy.movement.y = 0
        }
    }

    run = (player) => {

        //execute all the employees's run functions
        this.employees.forEach(employee => {
            if(employee.run){
                employee.run(player)
            }
            
            
        })

        //execute all the enemy run functions
        this.enemies.forEach((enemySprite, index) => {
            //clear dead enemies first
            if (enemySprite.currentHealth <= 0){
                //remove sprite from enemies list
                this.enemies.splice(index, 1)
                this.dropsManager.generateDrops(enemySprite.enemyKey, enemySprite.x, enemySprite.y)
                enemySprite.die()
            }
            else{
                enemySprite.run(player)
                this.handleEnemyAggro(player, enemySprite)
            }
            
        })
    }
}
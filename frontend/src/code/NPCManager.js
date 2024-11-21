import { AnimatedSprite, Spritesheet } from "pixi.js"
import { robertSpriteData } from '../json/npc/robertSpriteData'
import { ANIMATION_SPEED } from "../settings"

export class NPCManager{
    constructor(app, player, npcSpritesheets, visibleSprites){
        this.app = app
        this.player = player
        this.visibleSprites = visibleSprites

        this.npcSpritesheets = npcSpritesheets
        this.parsedAssetsObject = {}
        this.parseAssets()
    }

    parseAssets = () => {
        for(let key in this.npcSpritesheets){
            if(key.startsWith("NPCSpritesheet_")){
                this.parsedAssetsObject[key.replace("NPCSpritesheet_", "")] = this.npcSpritesheets[key]
            }
        }
    }

    initRobertNPC = async () => {
        this.robertNPCSpritesheet = new Spritesheet(this.parsedAssetsObject.RobertSpritesheet,
            robertSpriteData)
        await this.robertNPCSpritesheet.parse()

        this.robertNPC = new AnimatedSprite(this.robertNPCSpritesheet.animations.idle)
        this.robertNPC.position.set(1000, 600)
        this.visibleSprites.addChild(this.robertNPC)
        this.robertNPC.label = "robert_npc"
        this.robertNPC.scale.set(2)
        this.robertNPC.width = 170
        this.robertNPC.height = 125
        this.robertNPC.animationSpeed = ANIMATION_SPEED
        this.robertNPC.play()
    }
}
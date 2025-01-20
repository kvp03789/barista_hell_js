import { AnimatedSprite, Sprite, Spritesheet } from "pixi.js"
import { ENEMY_SETTINGS, ZOOM_FACTOR } from "../settings"
import { generateSeed, getRandomDrop, getRandomSign, randomNumber, spritesAreColliding } from "../utils"
import { sparkleParticleData } from "../json/particles/particleSpriteData"
import { GlowFilter, ShockwaveFilter, ZoomBlurFilter } from "pixi-filters"
import { Beans, Milk, Syrup, WhippedCream } from "./item_classes/Materials"

class Drop extends Sprite{
    constructor(itemKey, texture, x, y, sparkleSpritesheet, item){
        super(texture)
        this.seed = generateSeed()
        this.itemKey = itemKey
        this.label = `drops_${itemKey}`

        //the actual item the drop is "holding"
        this.item = item

        this.speed = 5 * this.seed
        this.x = x + 5 * this.seed
        this.y = y + 5 * this.seed
        this.distanceX = 20 * this.seed
        this.distanceY = 20 * this.seed
        this.movement = {x: getRandomSign(), y: getRandomSign()}
        this.velocity = {x: this.movement.x * this.speed, y: this.movement.y * this.speed}
        this.friction = .95
        //gravity aka constant downward force
        this.gravity = 0.3
        this.bounceFactor = .6
        //simulated ground level
        this.ground = Math.floor(this.y + 20 * this.seed)

        this.sparkleAnimation = new AnimatedSprite(sparkleSpritesheet.animations.main)
        this.sparkleAnimation.position.set(0,-21)
        this.sparkleAnimation.loop = true
        this.sparkleAnimation.play()
        this.sparkleAnimation.animationSpeed = .2 - this.seed / 15
        this.sparkleAnimation.alpha = .8 * this.seed
        this.sparkleAnimation.filters = [new GlowFilter()]
        this.addChild(this.sparkleAnimation)
    }

    run = (player) => {
        //scale of drops should be less than other assets
        this.scale = 1.2
        this.sparkleAnimation.scale = 1.5

        if(Math.abs(this.velocity.x) > .1 || Math.abs(this.velocity.y) > .1 ){

            //apply gravity
            this.velocity.y += this.gravity
        
            //adjust x and y position by velocity
            this.x += this.velocity.x
            this.y += this.velocity.y
            
            //ground collision
            if(this.y >= this.ground){
                //reverse direction
                this.velocity.y = -this.velocity.y * this.bounceFactor

                //aply friction to slow
                this.velocity.x *= this.friction

                //stop the drop's movement if slow enough
                if(Math.abs(this.velocity.x) < .1) this.velocity.x = 0
                if(Math.abs(this.velocity.y) < .1) this.velocity.y = 0
            }

            if(this.y === this.ground){
                //aply friction to slow
                this.velocity.x *= this.friction
            }
        }
    }
}

export class DropsManager{
    constructor(app, visibleSprites, dropsAssets, iconAssets){
        this.app = app
        this.iconAssets = iconAssets

        this.half_width = this.app.view.width / 2
        this.half_height = this.app.view.height / 2
        this.visibleSprites = visibleSprites
        this.dropsAssets = dropsAssets
        this.parsedDropsAssets = {}
        this.parseAssets()
        this.dropsList = []
    }

    parseAssets = async () => {
        for(let key in this.dropsAssets){
            if(key.startsWith("Drops_")){
                this.parsedDropsAssets[key.replace("Drops_", "")] = this.dropsAssets[key]
            }
        }

        const spritesheet = new Spritesheet(this.dropsAssets.Drops_Sparkle, sparkleParticleData)
        this.parsedDropsAssets.Drops_Sparkle = spritesheet
        await this.parsedDropsAssets.Drops_Sparkle.parse()
    }

    generateDrops = (enemyKey, enemyX, enemyY) => {
        const generatedDropsList = []
        
        //calculate which item based on enemy's drop chances in settings
        const numberOfDrops = randomNumber(ENEMY_SETTINGS[enemyKey].items.min, ENEMY_SETTINGS[enemyKey].items.max)
        for(let i = 0; i < numberOfDrops; i++){
            const itemKey = getRandomDrop(ENEMY_SETTINGS[enemyKey].items.drops).name
            // const itemKey = ENEMY_SETTINGS[enemyKey].items.drops[1].name
            generatedDropsList.push(itemKey)
            console.log("HERES THE LIST OF DROPS", generatedDropsList)
        }

        generatedDropsList.forEach(itemKey => {
            let item
            switch(itemKey){
                case "Milk":
                    item = new Milk(this.app, this.iconAssets)
                    break;
                case "Beans":
                    item = new Beans(this.app, this.iconAssets)
                    break;
                case "Syrup":
                    item = new Syrup(this.app, this.iconAssets)
                    break;
                case "WhippedCream":
                    item = new WhippedCream(this.app, this.iconAssets)
                    break;
            }
            const newDrop = new Drop(itemKey, this.parsedDropsAssets[itemKey], enemyX, enemyY, this.parsedDropsAssets.Drops_Sparkle, item)
            //make sparkle animation
            
            this.visibleSprites.addChild(newDrop)
            this.dropsList.push(newDrop)
        })   
    }

    handleDropPickup = (player) => {

    }

    run = (player) => {
        this.dropsList.forEach((drop, index) => {
            if(spritesAreColliding(player.sprite, drop)){
                //handle pick up
                this.handleDropPickup(player)
                drop.destroy()
                //remove from drop list
                this.dropsList.splice(index, 1)
                return
            }
            drop.run(player)
        })
    }
}
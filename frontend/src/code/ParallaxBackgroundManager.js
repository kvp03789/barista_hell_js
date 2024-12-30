import { BlurFilter, Container, Sprite } from "pixi.js"
import { ZOOM_FACTOR } from "../settings"
import { BackdropBlurFilter } from "pixi-filters"

export default class ParallaxBackgroundManager{
    constructor(app, player, rawBackgroundAssets){
        this.app = app
        this.player = player

        this.displayWidth = this.app.view.width
        this.displayHeight = this.app.view.height

        this.rawBackgroundAssets = rawBackgroundAssets
        this.parsedBackgroundAssets = {}

        this.parallaxContainer = new Container()
        this.parallaxContainer.label = "Parallax_Container"
        this.app.stage.addChild(this.parallaxContainer)

        this.parallaxFactors = [.10, .20, .30, .40, .50, .60, .70, .80]
        
        this.parseAssets()
    }

    parseAssets = () => {
        let counter = 0
        for(let key in this.rawBackgroundAssets){
            if(key.startsWith("HellParallax")){
                this.parsedBackgroundAssets[key] = {}
                this.parsedBackgroundAssets[key].number = counter
                //back drop blur on farthest away layer
                if(counter = 1){
                    this.parsedBackgroundAssets[key].filters = [new BlurFilter()]
                }
                this.parsedBackgroundAssets[key].parallaxFactor = this.parallaxFactors[counter]
                this.parsedBackgroundAssets[key].movement = false

                this.parsedBackgroundAssets[key].sprite = Sprite.from(this.rawBackgroundAssets[key])
                this.parsedBackgroundAssets[key].sprite.scale.set(2.25)
                this.parsedBackgroundAssets[key].sprite.y = -200
                this.parallaxContainer.addChild(this.parsedBackgroundAssets[key].sprite)
                counter++
            }

            //the fog assets are separate because they are animated/always moving
            else if(key.startsWith("Fog")){
                this.parsedBackgroundAssets[key] = {}
                this.parsedBackgroundAssets[key].number = counter
                this.parsedBackgroundAssets[key].parallaxFactor = this.parallaxFactors[counter]
                this.parsedBackgroundAssets[key].movement = .05

                this.parsedBackgroundAssets[key].sprite = Sprite.from(this.rawBackgroundAssets[key])
                this.parsedBackgroundAssets[key].sprite.scale.set(2)
                this.parsedBackgroundAssets[key].sprite.y = -200
                this.parsedBackgroundAssets[key].sprite.filters = [new BlurFilter()]
                this.parallaxContainer.addChild(this.parsedBackgroundAssets[key].sprite)
            }
            
            
        }
    }

    init = () => {

    }

    run = (player) => {
        // this.parallaxContainer.children.forEach((bg, index) => {

        // })
        const playerX = player.movement.x

        for(let key in this.parsedBackgroundAssets){
            const parallaxFactor = this.parsedBackgroundAssets[key].parallaxFactor
            this.parsedBackgroundAssets[key].sprite.x += -playerX * parallaxFactor

            // if  layerhas movement (like the fog), add movement animation
            if (this.parsedBackgroundAssets[key].movement) {
                this.parsedBackgroundAssets[key].sprite.x += this.parsedBackgroundAssets[key].movement;
            }
        }
    }

    
}
import { Container } from "pixi.js"
import { ZOOM_FACTOR } from "../settings"

export default class NPCTilesGroup extends Container {
    constructor(app){
        super()
        this.app = app
        this.half_width = this.app.view.width / 2
        this.half_height = this.app.view.height / 2
        this.label = "NPC_Tiles_Group"

        this.offset = {x: 0, y:0 }
    }

    run = (player) => {
            // calculate offsets based on player's position. its basically the difference
            // in the center of the player and the center of the screen
            this.offset.x = player.x + (player.width / 2) - this.half_width
            this.offset.y = player.y + (player.height / 2) - this.half_height
            
            // update position of each child sprite based oncalculated offset
            this.children.forEach(sprite => {
            
                sprite.x -= this.offset.x * ZOOM_FACTOR
                sprite.y -= this.offset.y * ZOOM_FACTOR
                if(!sprite.label.startsWith("animated")){
                    sprite.scale.set(ZOOM_FACTOR)
                }
                sprite.scale.set(ZOOM_FACTOR)
                //these tiles shouldnt be displayed
                sprite.alpha = 0
                //this is to handle any interactivity
                if(sprite.run){
                    sprite.run()
                }

            })
        }
}
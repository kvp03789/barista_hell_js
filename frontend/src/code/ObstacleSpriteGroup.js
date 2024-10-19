import { Container } from "pixi.js";

export default class ObstacleSpriteGroup extends Container{
    constructor(app){
        super()
        this.app = app
        this.label = "Obstacle_Sprite_Group"
    }
}
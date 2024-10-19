import { Container } from "pixi.js";

export default class YSortCameraSpriteGroup extends Container{
    constructor(app){
        super()
        this.app = app
        this.label = "Camera_Sprite_Group"
    }
}
import { Sprite } from 'pixi.js'

export default class Tile extends Sprite{
    constructor(app, x_pos, y_pos, texture, label, group){
        super(texture)
        this.app = app
        this.x_pos = x_pos //initial x
        this.y_pos = y_pos //initial y
        this.label = label
        this.position.set(this.x_pos, this.y_pos)
        this.addSpriteToGroup(group)
    }

    addSpriteToGroup = (group) => {
        group.addChild(this)
    }
}
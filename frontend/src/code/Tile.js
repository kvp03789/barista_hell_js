import { Sprite } from 'pixi.js'

export default class Tile{
    constructor(app, x_pos, y_pos, texture, label, [groups]){
        this.x_pos = x_pos
        this.y_pos = y_pos
        this.sprite = new Sprite(texture)
        this.sprite.label = label
        this.sprite.position.set(this.x_pos, this.y_pos)
        this.addSpriteToGroups([groups])
        this.rect = this.sprite.getBounds()
    }

    addSpriteToGroups = (groups) => {
        groups.forEach(group => group.addChild(this.sprite))
    }
}
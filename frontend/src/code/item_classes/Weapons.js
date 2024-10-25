import { Sprite } from "pixi.js"

class Weapon{
    constructor(app, texturesObject, player){
        this.app = app
        this.texturesObject = texturesObject
        this.player = player
        this.itemType = 'weapon'
    }
}

export class BattleRifle extends Weapon{
    constructor(app, texturesObject, player){
        super(app, texturesObject, player)

        this.itemName = "BattleRifle"

        this.sprite = new Sprite(this.texturesObject[this.itemName + 'Right'])
        this.sprite.x = this.player.sprite.x
        this.sprite.y = this.player.sprite.y
        this.sprite.anchor.set(.5)
        this.sprite.x = this.player.sprite.width / 2 + 20
        this.sprite.y = this.player.sprite.height / 2 + 10
    }

    run = (angle) => {
        console.log('BattleRifle is running')
        // if(this.player.movement.x = 1){
        //     this.handleWeaponDirection('Right')
        // }
        // else if(this.player.movement.x = -1){
        //     this.handleWeaponDirection('Left')
        // }
        this.sprite.angle = angle
    }

    handleWeaponDirection = (direction) => {
        this.sprite.texture = this.texturesObject[this.itemName + direction]
    }
}

export class Shotgun extends Weapon{
    constructor(app, texturesObject, player){
        super(app, texturesObject, player)

        this.itemName = "Shotgun"

        this.sprite = new Sprite(this.texturesObject[this.itemName + 'Right'])
        this.sprite.label = `${this.itemType}_${this.itemName}`
        this.sprite.anchor.set(.5)
        this.sprite.x = this.player.sprite.width / 2 + 20
        this.sprite.y = this.player.sprite.height / 2 + 10
    }

    run = (angle) => {
        console.log('Shotgun is running')
        this.sprite.angle = angle
    }
}
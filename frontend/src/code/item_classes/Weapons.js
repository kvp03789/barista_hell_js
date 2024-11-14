import { Sprite } from "pixi.js"
import { WEAPON_SETTINGS } from "../../settings"
import Item from "./Item"


class Weapon extends Item{
    constructor(app, texturesObject, player, itemType){
        super(app, "weapon", player)
        //textures object is all textures for this particular weapon
        this.texturesObject = texturesObject
    }
}

export class BattleRifle extends Weapon{
    constructor(app, texturesObject, player){
        super(app, texturesObject, player)

        this.itemName = "BattleRifle"

        this.fireRate = WEAPON_SETTINGS[this.itemName].fireRate
        this.clipSize = WEAPON_SETTINGS[this.itemName].clipSize
        this.damage = WEAPON_SETTINGS[this.itemName].damage

        this.sprite = new Sprite(this.texturesObject[this.itemName + 'Right'])
        this.sprite.x = this.player.sprite.x
        this.sprite.y = this.player.sprite.y
        this.sprite.anchor.set(0)
        this.sprite.x = this.player.sprite.width - 15
        this.sprite.y = this.player.sprite.height - 15
        this.sprite.label = this.itemNamewa
    }

    run = (angle) => {
        this.sprite.angle = angle
    }

    //change weapon texture depending on angle
    handleWeaponDirection = (angle) => {
        this.sprite.texture = this.texturesObject[this.itemName + direction]
    }

    fire = () => {
        console.log(`${this.itemName} is firing!`)
    }
}

export class Shotgun extends Weapon{
    constructor(app, texturesObject, player){
        super(app, texturesObject, player)

        this.itemName = "Shotgun"

        this.fireRate = WEAPON_SETTINGS[this.itemName].fireRate
        this.clipSize = WEAPON_SETTINGS[this.itemName].clipSize
        this.damage = WEAPON_SETTINGS[this.itemName].damage

        this.sprite = new Sprite(this.texturesObject[this.itemName + 'Right'])
        this.sprite.label = `${this.itemType}_${this.itemName}`
        this.sprite.anchor.set(0)
        this.sprite.x = this.player.sprite.width
        this.sprite.y = this.player.sprite.height
    }

    run = (angle) => {
        console.log('Shotgun is running')
        this.sprite.angle = angle
    }

    fire = () => {
        console.log(`${this.itemName} is firing!`)
    }
}
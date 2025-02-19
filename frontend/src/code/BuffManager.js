import { Container, Sprite } from "pixi.js"

export class Buff extends Sprite{
    constructor(buffKey, name, description, duration, type, applyEffect, removeEffect, iconTexture) {
        super(iconTexture)
        this.buffKey = buffKey
        //all of these get filled in from the settings file
        this.name = name
        this.description = description
        //duration is in ms
        this.duration = duration 
        this.type = type
        this.applyEffect = applyEffect 
        this.removeEffect = removeEffect 
        this.timeRemaining = duration

        this.iconTexture = iconTexture
    }

    apply(target) {
        if (this.applyEffect) this.applyEffect(target)
    }

    remove(target) {
        if (this.removeEffect) this.removeEffect(target)
    }

    //updates the timer for this buff
    update() {
        
    }
}

export class BuffManager extends Container{
    constructor(app, player, iconAssets){
        super()
        this.app = app 
        this.player = player
        this.iconAssets = iconAssets
        
        this.parsedBuffAssets = {}
        //parses icon assets to populate parsedBuffAssets with only buff assets
        this.parseAssets()
    }

    init = (uiManager) => {
        //uiManager which is necessary for this class unavailable at instantiation
        this.uiManager = uiManager
        this.tooltipManager = this.uiManager.tooltipManager
    }

    parseAssets = () => {
        for(let key in this.iconAssets){
            if(key.startsWith("Buff_")){
                this.parsedBuffAssets[key.replace("Buff_Icon_", "")] = this.iconAssets[key]
            }
        }
    }

    //addBuff adds a buff to the buff manager as well as to player active buffs
    addBuff = (buff) => {
        //add buff to buff manager as child
        this.addChild(buff)
        //add buff to player active buffs
        this.player.activeBuffs.push(buff)
    }

    removeBuff = () => {

    }

    run = () => {
        this.children.forEach(buff => {
            if (buff.update)buff.update()
        })
    }
}
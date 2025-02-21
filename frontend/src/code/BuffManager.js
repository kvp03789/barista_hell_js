import { Container, Sprite } from "pixi.js"

export class Buff extends Sprite{
    constructor(buffKey, name, description, duration, type, applyEffect, removeEffect, particleKey, iconTexture) {
        super(iconTexture)
        this.buffKey = buffKey
        //all of these get filled in from the settings file
        this.name = name
        this.description = description
        //duration is in milliseconds
        this.duration = duration 
        this.type = type
        this.applyEffect = applyEffect 
        this.removeEffect = removeEffect 
        this.particleKey = particleKey

        //timer is the one that actually gets decremented
        this.timer = duration

        this.iconTexture = iconTexture
    }

    apply(target) {
        if (this.applyEffect) this.applyEffect(target)
    }

    remove(target) {
        if (this.removeEffect) this.removeEffect(target)
    }

    //updates the timer for this buff
    update(elapsedTime) {
        //elapsedTime is deltaMS * deltaTime (which is a vlue in)
        this.timer -= elapsedTime

        if (this.timer <= 0) {
            this.expire();
        }
    }

    //handle buff expiration
    expire() {
        console.log('BUFF EXPIRED')
        if (this.parent) {
            this.parent.removeBuff(this);
        }
    }
}

export class BuffManager extends Container{
    constructor(app, player, iconAssets){
        super()
        this.app = app 
        this.player = player
        this.iconAssets = iconAssets
        this.hasBeenInited = false
        
        this.parsedBuffAssets = {}
        //parses icon assets to populate parsedBuffAssets with only buff assets
        this.parseAssets()
    }

    init = (uiManager) => {
        //uiManager which is necessary for this class unavailable at instantiation
        this.uiManager = uiManager
        this.tooltipManager = this.uiManager.tooltipManager
        //add players active buffs if 
        if(this.children.length === 0 && this.player.activeBuffs.length !== 0){
            this.player.activeBuffs.forEach(buff => this.addChild(buff))
        }
        this.hasBeenInited = true
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
        this.player.applyBuff(buff)
    }

    removeBuff = (buff) => {
        //remove buff to buff manager as child
        this.removeChild(buff)
        //remove buff to player active buffs
        this.player.removeBuff(buff)
    }

    run = (ticker) => {
        this.children.forEach(buff => {
            if (buff.update)buff.update(ticker.deltaTime * ticker.deltaMS)
        })
    }
}
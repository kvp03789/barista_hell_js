import { Container, Spritesheet } from 'pixi.js'
import { bulletExplodeParticleData } from '../json/particles/particleSpriteData.js'

class ParticleManager extends Container{
    constructor(app, particleAssets){
        super()
        this.app = app
        this.particleAssets = particleAssets
        this.particleDictionary = {
            BulletExplodeParticleSmoke: {}
        },
        //parse particleAssets so that during init the particleDictionary 
        //can be easily populated
        this.parseWeaponAssets()
    }

    parseWeaponAssets = () => {
        for(let key1 in this.particleDictionary){
            for (let key2 in this.particleAssets){
                if(key2.startsWith(key1)){
                    this.particleDictionary[key1].texture = this.particleAssets[key2]
                }
            }
        }
    }

    init = async () => {
        for(let key in this.particleDictionary){
            this.particleDictionary[key].spritesheet = new Spritesheet(
                this.particleDictionary[key].texture,
                bulletExplodeParticleData
            )
            await this.particleDictionary[key].spritesheet.parse()
        }

    }

    run = () => {
        
    }


}

export default ParticleManager
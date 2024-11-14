import { AnimatedSprite, Container, Spritesheet } from 'pixi.js'
import { bulletExplodeParticleData } from '../json/particles/particleSpriteData.js'
import { ZOOM_FACTOR } from '../settings.js'


class Particle extends AnimatedSprite{
    constructor(spritesheet, x, y, animationLength, type){
        super(spritesheet)
        this.x = x
        this.y = y
        this.type = type
        this.anchor.set(.5)
        this.animationLength = animationLength
        this.scale.set(ZOOM_FACTOR)
        // this.currentFrame = 0
        this.animationSpeed = 0.166
        this.loop = false
        this.shouldDestroy = false;

        // set an event listener to flag the particle for destruction on animation completion
        this.onComplete = () => {
            this.shouldDestroy = true;
        };
        this.alpha = .6
        
        //play the animation
        this.play()

    }
}

class ParticleManager extends Container{
    constructor(app, particleAssets){
        super()
        this.app = app
        this.half_width = this.app.view.width / 2
        this.half_height = this.app.view.height / 2
        this.particleAssets = particleAssets
        this.particleDictionary = {
            BulletWall: {}, Character: {}
        },
        
        //parse particleAssets so that during init the particleDictionary 
        //can be easily populated
        this.parseParticleAssets()

        this.offset = {x: 0, y: 0}
    }

    parseParticleAssets = () => {
        for(let obj in this.particleDictionary){
                for (let key2 in this.particleAssets){
                    if(key2.startsWith(obj)){
                        this.particleDictionary[obj][key2] = {texture: null, spritesheet: null}
                        this.particleDictionary[obj][key2].texture = this.particleAssets[key2]
                    }
                }
            }
    }


    init = async () => {
        for (let obj in this.particleDictionary) {
            for (let key in this.particleDictionary[obj]) {
                this.particleDictionary[obj][key].spritesheet = new Spritesheet(
                    this.particleDictionary[obj][key].texture,
                    bulletExplodeParticleData
                )
                await this.particleDictionary[obj][key].spritesheet.parse();
            }
        }
    }

    createParticle = (particleX, particleY, type, category, subCategory) => {
        let animationLength = this.particleDictionary.BulletWall.BulletWallExplodeParticleSmoke.spritesheet.animations.main.length
        const animatedParticle = new Particle(this.particleDictionary[category][subCategory].spritesheet.animations.main, particleX - this.offset.x * ZOOM_FACTOR, particleY - this.offset.y * ZOOM_FACTOR, animationLength, type)
        this.addChild(animatedParticle)
    }
    

    run = (player) => {
        this.offset.x = player.x + (player.width / 2) - this.half_width;
        this.offset.y = player.y + (player.height / 2) - this.half_height;

        this.children.forEach((particle, i) => {
            // check if the particles animation is complete and destroy it if so
            if (particle.shouldDestroy) {
                particle.destroy();
                this.removeChild(particle);
                return
            }

            particle.x -= this.offset.x * ZOOM_FACTOR
            particle.y -= this.offset.y * ZOOM_FACTOR

            //set scale for different particle types
            switch(particle.type){
                case "bullet_impact":
                    return particle.scale.set(3)
                case "character_walking":
                    return particle.scale.set(3)
                default: particle.scale.set(1.5)
            }

            
        });
    };
}

export default ParticleManager
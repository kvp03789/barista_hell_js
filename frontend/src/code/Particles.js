import { AnimatedSprite, Container, Rectangle, Sprite, Spritesheet, Texture } from 'pixi.js'
import { bloodSplatterParticleData, bulletExplodeParticleData, teleportBeamData, walkingParticleData } from '../json/particles/particleSpriteData.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH, ZOOM_FACTOR, PARTICLE_ANIMATION_SETTINGS } from '../settings.js'
import { generateSeed, randomNumber } from '../utils.js'
import { GlowFilter, RGBSplitFilter } from 'pixi-filters'

class StaticParticle extends Sprite{
    constructor(texture, x, y, label, type){
        super(texture)
        this.isAnimatedParticle = false
        this.x = x
        this.y = y
        this.label = label
        this.type = type

        this.anchor.set(.5)
        this.scale.set(ZOOM_FACTOR)
    }
}

class Ash extends StaticParticle{
    constructor(texture, x, y, label, type){
        super(texture, x, y, label, type)
        this.seed = generateSeed()
        this.ashSpeed = .02 * this.seed
        this.ashDriftSpeed = generateSeed(-.05, 0.05) * this.seed
        this.dieY = randomNumber(700, 1000)
    }
}

class AnimatedParticle extends AnimatedSprite{
    constructor(spritesheet, x, y, animationLength, type, animationSpeed, anchor, alpha, scale, hasRandomness, filters){
        super(spritesheet)
        this.isAnimatedParticle = true
        this.seed = generateSeed()
        this.x = x
        this.y = y
        this.type = type
        this.anchor.set(anchor)
        this.animationLength = animationLength
        this.filters = filters
        // this.currentFrame = 0
        this.animationSpeed = animationSpeed
        this.alpha = alpha
        this.hasRandomness = hasRandomness

        hasRandomness ? this.scale.set(scale * this.seed) : this.scale.set(scale)

        this.loop = false
        this.shouldDestroy = false;

        // set an event listener to flag the particle for destruction on animation completion
        this.onComplete = () => {
            this.shouldDestroy = true;
        };

        
        //play the animation
        this.play()

    }
}

class AshParticleSubContainer extends Container{
    constructor(){
        super()
        this.alpha = .8
    }

    run = () => {
        this.children.forEach((ash) => {
            ash.scale.set(.7 * ash.seed)
            ash.y += (ash.ashSpeed * ash.seed)
            ash.x += ash.ashDriftSpeed
            //if at die point, kill particle
            if(ash.y >= ash.dieY){
                this.removeChild(ash)
            }
        })
    }
}

class ParticleManager extends Container{
    constructor(app, particleAssets){
        super()
        this.app = app
        this.half_width = this.app.view.width / 2
        this.half_height = this.app.view.height / 2
        this.particleAssets = particleAssets
        this.particleDictionary = {},

        //bespoke container for ash particles to make filter more efficient
        this.ashParticleSubContainer = new AshParticleSubContainer()
        this.ashParticleSubContainer.label = "ash_particle_sub_container"
        this.ashParticleSubContainer.filters=[new GlowFilter({alpha: 0.37}), new RGBSplitFilter({red: {x: -1, y: 0}, blue: {x: 0, y: 0}, green:{x: 0, y: 1}})]
        this.addChild(this.ashParticleSubContainer)
        
        this.offset = {x: 0, y: 0}
    }

    //parsed raw assets into organized list of unique values
    parseAnimatedParticleAssets = async () => {
        for(let key in this.particleAssets){
            if(key.startsWith('Particle_')){
                //bullet smoke
                if(key.includes('Bullet')){
                    const spritesheet = new Spritesheet(this.particleAssets[key], bulletExplodeParticleData)
                    this.particleDictionary[key] = spritesheet
                    await this.particleDictionary[key].parse()
                }
                //teleport beam in hell
                else if(key.includes('Teleport')){
                    const spritesheet = new Spritesheet(this.particleAssets[key], teleportBeamData)
                    this.particleDictionary[key] = spritesheet
                    await this.particleDictionary[key].parse()
                }
                //character walking particles
                else if(key.includes('Walking')){
                    const spritesheet = new Spritesheet(this.particleAssets[key], walkingParticleData)
                    this.particleDictionary[key] = spritesheet
                    await this.particleDictionary[key].parse()
                }

                else if(key.includes("Blood_Splatter")){
                    const spritesheet = new Spritesheet(this.particleAssets[key], bloodSplatterParticleData)
                    this.particleDictionary[key] = spritesheet
                    await this.particleDictionary[key].parse()
                }
            }
        }

        console.log("Particleeeeeee ", this.particleDictionary)
    }

    init = async () => {
        await this.parseAnimatedParticleAssets()
    }

    //init some falling ash particles unique to the hell level
    initializeAshParticles = () => {
        const numberOfParticles = 5000
        const particleSize = 5
        for(let i = 0; i < numberOfParticles; i++){
            const randomXSlice = randomNumber(0, 2)
            const randomYSlice = randomNumber(0, 1)           
            const sliceRect = new Rectangle(randomXSlice * particleSize, randomYSlice * particleSize, particleSize, particleSize)
            const randomXPos = randomNumber(-200, SCREEN_WIDTH + 700)
            const randomYPos = randomNumber(-720, SCREEN_HEIGHT - 20)
            const texture = new Texture({source: this.particleAssets.Particle_AshParticle, frame: sliceRect})
            const ashParticle = new Ash(texture, randomXPos, randomYPos, 'ash_particle', 'AshParticle')
            this.ashParticleSubContainer.addChild(ashParticle)
            
        }
    }

    createAnimatedParticle = (particleX, particleY, type) => {
        let animationLength = this.particleDictionary[`Particle_${type}`].animations.main.length
        
        const animationSpeed = PARTICLE_ANIMATION_SETTINGS[type].animationSpeed
        const anchor = PARTICLE_ANIMATION_SETTINGS[type].anchor
        const alpha = PARTICLE_ANIMATION_SETTINGS[type].alpha
        const scale = PARTICLE_ANIMATION_SETTINGS[type].scale
        const hasRandomness = PARTICLE_ANIMATION_SETTINGS[type].hasRandomness

        const animatedParticle = new AnimatedParticle(this.particleDictionary[`Particle_${type}`].animations.main, particleX - this.offset.x * ZOOM_FACTOR, particleY - this.offset.y * ZOOM_FACTOR, animationLength, type, animationSpeed, anchor, alpha, scale, hasRandomness)
        this.addChild(animatedParticle)
    }
    
    createStaticParticle = (x, y, texture) => {

    }

    run = (player) => {
        this.offset.x = player.x + (player.width / 2) - this.half_width;
        this.offset.y = player.y + (player.height / 2) - this.half_height;

        this.children.forEach((particle, i) => {
            // this is for animated sprites atm
            // check if the particles animation is complete and destroy it if so
            if (particle.shouldDestroy) {
                particle.destroy();
                console.log("DESTROYED  A PARTICLE ")
                this.removeChild(particle);
                return
            }

            particle.x -= this.offset.x * ZOOM_FACTOR
            particle.y -= this.offset.y * ZOOM_FACTOR

            //set scale for different particle types
            switch(particle.type){
                case "BulletWallExplodeParticleSmoke":
                    return particle.scale.set(3)
                case "CharacterWalkingParticle":
                    return particle.scale.set(3)
                default: particle.scale.set(3)
            }

            
        });

        this.ashParticleSubContainer.run()
    };
}

export default ParticleManager
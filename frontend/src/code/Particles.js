import { AnimatedSprite, Container, Graphics, Rectangle, Sprite, Spritesheet, Texture } from 'pixi.js'
import { bloodSplatterParticleData, bulletExplodeParticleData, teleportBeamData, walkingParticleData } from '../json/particles/particleSpriteData.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH, ZOOM_FACTOR, PARTICLE_ANIMATION_SETTINGS, GEOMETRY_PARTICLE_SETTINGS } from '../settings.js'
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

class GeometryParticle extends Graphics {
    constructor(x, y, directionX, directionY, type, options) {
        super()
        this.label = "geometry_particle"
        this.isGeometryParticle = true
        this.hasMovement = options.hasMovement ?? true

        this.seed = generateSeed(0.95, 1.05)

        this.alpha = options.alpha ?? 0.7

        // lifespan in frames
        this.life = options.life ?? 50 

        //offset start position to trail behind player
        //has to be different depending on player mvmnt direction
        //so is set later
        let spawnOffsetX
        let spawnOffsetY

        // Calculate angle of movement
        if(this.hasMovement){
            const angle = Math.atan2(directionY, directionX)
            this.rotation = angle
            this.pivot.set(0.5)
        }
        
        switch (type) {
            case 'speedLines':
                this.rect(0, 0, 80, 3)
                //set directionX & Y for this particle
                if(directionX < 0){
                    spawnOffsetX = 75
                } else spawnOffsetX = 25
                     
                if(directionY < 0){
                    spawnOffsetY = 75
                } else spawnOffsetY = 25
                break;

            case 'shield':
                this.circle(0, 0, options.radius ?? 5)
                .stroke({ color: 0xffffff, width: 4, alignment: 0 })
                spawnOffsetX = 0
                spawnOffsetY = 0
                break;

            case 'triangle':
                this.poly([
                    x, y,
                    options.size ?? 5, options.size ?? 10,
                    -(options.size ?? 5), options.size ?? 10
                ]);
                this.rotation = angle;
                break;

            case 'square':
                this.rect(-options.size / 2 ?? -5, -options.size / 2 ?? -5, options.size ?? 10, options.size ?? 10);
                break;

            default:
                console.warn(`Unknown particle type: ${type}`);
        }

        this.fill(options.fillColor ?? 0xffffff)

        // set movement direction (opposite to player movement)
        const speed = 14
        this.vx = -directionX * speed
        this.vy = -directionY * speed

        this.position.set(
            (x - directionX * spawnOffsetX) * this.seed, 
            (y - directionY * spawnOffsetY) * this.seed
        )
    }

    run() {
        if(this.hasMovement){
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.04; // Gradual fade-out
        }
        
        this.life--;
        if (this.life < 0) this.destroy();
    }
}

class GeometryParticleSubContainer extends Container{
    constructor(){
        super()
        this.position.set(0,0)
    }

    run = () => {
        this.children.forEach(geometryParticle => {
            if(geometryParticle.run){geometryParticle.run()}
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

        //and another one for geometry particles!
        this.geometryParticleSubContainer = new GeometryParticleSubContainer()
        this.geometryParticleSubContainer.label = "geometry_particle_sub_container"
        this.addChild(this.geometryParticleSubContainer)

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

    createGeometryParticle(x, y, directionX, directionY, type) {
        const particle = new GeometryParticle(x, y, directionX, directionY, type, GEOMETRY_PARTICLE_SETTINGS[type]);
        // this.geometryParticleSubContainer.addChild(particle)
        this.addChild(particle)
    }   

    run = (player) => {
        this.offset.x = player.x + (player.width / 2) - this.half_width;
        this.offset.y = player.y + (player.height / 2) - this.half_height;

        this.children.forEach((particle, i) => {
            if(particle.run)particle.run()
            // this is for animated sprites atm
            // check if the particles animation is complete and destroy it if so
            if (particle.shouldDestroy) {
                particle.destroy();
                this.removeChild(particle);
                return
            }

            if(!particle.isGeometryParticle){
                //only do the following on non geometry particles

                //adjust by offset bc of sprites that are in sprite groups
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
        }
        })

        // this.geometryParticleSubContainer.run()

        this.ashParticleSubContainer.run()
    };
}

export default ParticleManager
import { Container, Sprite } from "pixi.js"
import { SCREEN_HEIGHT, SCREEN_WIDTH, WEAPON_SETTINGS, ZOOM_FACTOR } from "../settings"
import { checkPolygonCollision, createSATPolygonFromPoints, createSATPolygonFromSprite, getSpriteVertices, randomNumber, spritesAreColliding } from '../utils'
import { MotionBlurFilter } from 'pixi-filters'
import SAT from 'sat'

class Bullet extends Sprite{
    constructor(texture, angle, speed, playerX, playerY, damage){
        super(texture)
        //angle converted to radians already
        this.angle = angle
        this.speed = speed
        //damage ccomes from currentWeapon when creating bullet
        this.damage = damage

        this.anchor.set(.5)
        this.rotation = angle

        this.x = playerX + 15
        this.y = playerY + 15

        this.vx = null
        this.vy = null

        this.blurFilter = new MotionBlurFilter()
        this.filters = [this.blurFilter]
    }
}

class BulletManager extends Container{
    constructor(app, bulletAssets, obstacleSprites, particleManager, enemyList){
        super()
        this.app = app
        this.particleManager = particleManager
        this.half_width = this.app.view.width / 2
        this.half_height = this.app.view.height / 2
        this.offset = {x: 0, y: 0}
        this.bulletAssets = bulletAssets
        this.bulletDictionary = {}
        //obstacleSprites container for checking bullet/wall collisions
        this.obstacleSprites = obstacleSprites
        //enemyList from NPCManager class, for checking collisions with enemies
        this.enemyList = enemyList
        this.parseBulletAssets()
    }

    parseBulletAssets = () => {
        Object.keys(WEAPON_SETTINGS).forEach(weapon => {
            this.bulletDictionary[weapon] = []
            for(let key in this.bulletAssets){
                if(key.startsWith(weapon)){
                    this.bulletDictionary[weapon].push(this.bulletAssets[key])
                }
            }
        })
    }

    fireWeapon = (currentWeapon, angle, playerX, playerY) => {
        const normalizedAngle = (angle + 360) % 360
        const angleInRads = normalizedAngle * (Math.PI / 180)
        
        const speed = WEAPON_SETTINGS[currentWeapon.itemName].bulletSpeed
        const randomNum = randomNumber(0, this.bulletDictionary[currentWeapon.itemName].length) - 1
        const damage = currentWeapon.damage
        
        const bullet = new Bullet(this.bulletDictionary[currentWeapon.itemName][randomNum], angleInRads, speed, playerX, playerY, damage)
        this.addChild(bullet)
    }

    checkBulletCollision = () => {
        //wall block/obstacle collision
        this.obstacleSprites.children.forEach((obstacle, i) => {
            this.children.forEach((bullet, j) => {
                if(spritesAreColliding(bullet, obstacle.getBounds())){
                    if(!obstacle.bulletsPassThrough){
                        this.particleManager.createAnimatedParticle(bullet.x, bullet.y, "BulletWallExplodeParticleSmoke")
                        this.removeChild(bullet)
                        bullet.destroy()
                    }
                }
            })
        })

        //check bullet collision on enemies
        this.enemyList.forEach(enemySprite => {
            this.children.forEach((bullet, j) => {
                if(spritesAreColliding(bullet, enemySprite.hitbox.getBounds())){
                    console.log("HIT AN ENEMY!")
                    enemySprite.currentHealth -= bullet.damage
                    this.particleManager.createAnimatedParticle(bullet.x, bullet.y, "Blood_Splatter")
                    this.removeChild(bullet)
                    bullet.destroy()
                }
            })
        })
    }

    bulletCleanUp = () => {
        this.children.forEach(bullet => {
            
        })
    }

    run = (player) => {
        // calculate offsets based on player's position. its basically the difference
        // in the center of the player and the center of the screen
        
        this.offset.x = player.x + (player.width / 2) - this.half_width
        this.offset.y = player.y + (player.height / 2) - this.half_height

        //check collisions
        this.checkBulletCollision()

        this.children.forEach((bullet, i) => {
            bullet.vx = Math.cos(bullet.rotation) * bullet.speed;
            bullet.vy = Math.sin(bullet.rotation) * bullet.speed;

            bullet.x += bullet.vx;
            bullet.y += bullet.vy;      

            bullet.scale.set(ZOOM_FACTOR)

            

            // remove bullets that are out off screen
            if(bullet.x >= SCREEN_WIDTH || bullet.x <= 0 || bullet.y > SCREEN_HEIGHT || bullet.y < 0){
                this.removeChild(bullet)
                bullet.destroy()
            }
        })
    }
}

export default BulletManager
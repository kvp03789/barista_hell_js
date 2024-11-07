import { Container, Sprite } from "pixi.js"
import { WEAPON_SETTINGS, ZOOM_FACTOR } from "../settings"
import { randomNumber, spritesAreColliding } from '../utils'
import { MotionBlurFilter } from 'pixi-filters'

class Bullet extends Sprite{
    constructor(texture, angle, speed, playerX, playerY){
        super(texture)
        //angle converted to radians already
        this.angle = angle
        this.speed = speed

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
    constructor(app, bulletAssets, obstacleSprites, particleManager){
        super()
        this.app = app
        this.particleManager = particleManager
        this.half_width = this.app.view.width / 2
        this.half_height = this.app.view.height / 2
        this.offset = {x: 0, y: 0}
        this.bulletAssets = bulletAssets
        this.bulletDictionary = {}
        this.obstacleSprites = obstacleSprites
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
        let normalizedAngle = (angle + 360) % 360
        let angleInRads = normalizedAngle * (Math.PI / 180)
        
        let speed = WEAPON_SETTINGS[currentWeapon.itemName].bulletSpeed
        let randomNum = randomNumber(0, this.bulletDictionary[currentWeapon.itemName].length) - 1
        
        let bullet = new Bullet(this.bulletDictionary[currentWeapon.itemName][randomNum], angleInRads, speed, playerX, playerY)
        this.addChild(bullet)
    }

    checkBulletCollision = () => {
        //wall block/obstacle collision
        this.obstacleSprites.children.forEach((obstacle, i) => {
            this.children.forEach((bullet, j) => {
                if(spritesAreColliding(bullet, obstacle)){
                    this.particleManager.createParticle(bullet.x, bullet.y, "bullet_impact", "BulletWall", "BulletWallExplodeParticleSmoke")
                    this.removeChild(bullet)
                    bullet.destroy()
                    console.log("bullet collided!")
                }
            })
        })
    }

    run = (player) => {
        // calculate offsets based on player's position. its basically the difference
        // in the center of the player and the center of the screen
        
        this.offset.x = player.x + (player.width / 2) - this.half_width
        this.offset.y = player.y + (player.height / 2) - this.half_height

        this.children.forEach((bullet, i) => {
            bullet.vx = Math.cos(bullet.rotation) * bullet.speed;
            bullet.vy = Math.sin(bullet.rotation) * bullet.speed;

            bullet.x += bullet.vx;
            bullet.y += bullet.vy;      

            bullet.scale.set(ZOOM_FACTOR)

            //check collisions
            this.checkBulletCollision()

            // remove bullets that are out off screen
            // if (bullet.x < 0 || bullet.x > this.app.view.width || bullet.y < 0 || bullet.y > this.app.view.height) {
            //     this.removeChild(bullet)
            //     bullet.destroy()
            // }
        })
    }
}

export default BulletManager
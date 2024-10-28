import { Container, Sprite } from "pixi.js"
import { WEAPON_SETTINGS, ZOOM_FACTOR } from "../settings"
import { randomNumber } from '../utils'

class Bullet extends Sprite{
    constructor(texture, angle, speed, playerX, playerY){
        super(texture)
        //angle converted to radians already
        this.angle = angle
        this.speed = speed
        this.initialized = false

        this.anchor.set(.5)
        this.rotation = angle

        this.x = playerX
        this.y = playerY
    }
}

class BulletManager extends Container{
    constructor(app, bulletAssets){
        super()
        this.app = app
        this.half_width = this.app.view.width / 2
        this.half_height = this.app.view.height / 2
        this.offset = {x: 0, y: 0}
        this.bulletAssets = bulletAssets
        this.bulletDictionary = {}
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
        let angleInRads = angle * (Math.PI / 180)
        let speed = WEAPON_SETTINGS[currentWeapon.itemName].bulletSpeed
        let randomNum = randomNumber(0, this.bulletDictionary[currentWeapon.itemName].length) - 1
        
        let bullet = new Bullet(this.bulletDictionary[currentWeapon.itemName][randomNum], angleInRads, speed, playerX, playerY)
        this.addChild(bullet)
        console.log("bullet spawned! ", angle)
    }

    run = (player) => {
        // calculate offsets based on player's position. its basically the difference
        // in the center of the player and the center of the screen
        // this.offset.x = player.x + (player.width / 2) - this.half_width
        // this.offset.y = player.y + (player.height / 2) - this.half_height

        this.children.forEach((bullet, i) => {
            const vx = Math.cos(bullet.angle) * bullet.speed;
            const vy = Math.sin(bullet.angle) * bullet.speed;

            // if (!bullet.initialized) {
            //     bullet.x += this.offset.x;
            //     bullet.y += this.offset.y;
            //     bullet.initialized = true; //mark bullet as offset-applied
            // }

            bullet.x += vx;
            bullet.y += vy;

            bullet.scale.set(ZOOM_FACTOR)

            // remove bullets that are out off screen
            if (bullet.x < 0 || bullet.x > this.app.view.width || bullet.y < 0 || bullet.y > this.app.view.height) {
                this.removeChild(bullet);
                bullet.destroy();
            }
        })
    }
}

export default BulletManager
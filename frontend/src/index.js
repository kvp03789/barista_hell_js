import * as PIXI from 'pixi.js'
import { assetsManifest } from './assetsManifest'
import Character from './code/Character'
import Cafe from './code/Cafe'
import './styles/main.css'

//global constants
const WIDTH = 800
const HEIGHT = 600
const body = document.querySelector('body')

class Application{
    constructor(){
        this.app = new PIXI.Application()
        this.ticker = new PIXI.Ticker()

        //object for storing keys currently being pressed
        this.keysObject = {}

        //this is for te pixij debugger
        globalThis.__PIXI_APP__ = this.app;

        this.state_manager = new State_Manager('cafe')

        
    }

    async init(){
        await this.app.init({width: WIDTH, height: HEIGHT, preference: 'webgl'})
        body.append(this.app.canvas)
        await PIXI.Assets.init({manifest: assetsManifest})
        this.spritesheetAssets = await PIXI.Assets.loadBundle('character_spritesheets');

        this.cafe = new Cafe(this.app)
        this.statesObject = {
            'cafe': this.cafesad
        }
        await this.statesObject[this.state_manager.currentState].initMap()
        this.app.ticker.add(this.statesObject[this.state_manager.currentState].run)
        
        

        //key events
        window.addEventListener("keydown", e => this.handleKeyDown(e))
        window.addEventListener("keyup", e => this.handleKeyUp(e))
    }

    handleKeyDown = (e) => {
        this.keysObject[e.keyCode] = true
    }

    handleKeyUp = (e) => {
        this.keysObject[e.keyCode] = false
    }
}

class State_Manager{
    constructor(currentState){
        this.previousState = currentState
        this.currentState = currentState
    }

    setState = (newState) => {
        this.previousState = this.currentState
        this.currentState = newState
    }

    getState = () => {
        return this.currentState
    }
}

const app = new Application
app.init()
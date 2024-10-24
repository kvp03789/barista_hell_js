import * as PIXI from 'pixi.js'
import { settings } from './settings'
import { assetsManifest } from './assetsManifest'
import Character from './code/Character'
import Cafe from './code/Cafe'
import './styles/main.css'


const body = document.querySelector('body')

class Application{
    constructor(){
        this.app = new PIXI.Application()
        this.ticker = new PIXI.Ticker()
        // this.app.stage.scale.set(1.5)
        //object for storing keys currently being pressed
        this.keysObject = {}

        //this is for te pixij debugger
        globalThis.__PIXI_APP__ = this.app;

        this.state_manager = new State_Manager('cafe')
    }

    async init(){
        await this.app.init({width: settings.SCREEN_WIDTH, height: settings.SCREEN_HEIGHT, preference: 'webgl'})
        body.append(this.app.canvas)
        await PIXI.Assets.init({manifest: assetsManifest})

        this.cafe = new Cafe(this.app, this.keysObject)
        this.statesObject = {
            'cafe': this.cafe
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
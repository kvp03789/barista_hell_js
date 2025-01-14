import * as PIXI from 'pixi.js'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './settings'
import { assetsManifest } from './assetsManifest'
import Character from './code/Character'
import Cafe from './code/levels/Cafe'
import './styles/main.css'
import HellOverWorld from './code/levels/HellOverworld'


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

        this.state_manager = new State_Manager('cafe_intro', this.app)
    }

    async init(){
        await this.app.init({width: SCREEN_WIDTH, height: SCREEN_HEIGHT, preference: 'webgl'})
        body.append(this.app.canvas)
        await PIXI.Assets.init({manifest: assetsManifest})
        this.cafe = new Cafe(this.app, this.keysObject, 'cafe_intro', this.state_manager.setState)
        this.hellOverworld = new HellOverWorld(this.app, this.keysObject, 'hell_overworld', this.state_manager.setState)

        this.statesObject = {
            'cafe_intro': this.cafe,
            'hell_overworld': this.hellOverworld
        }
        await this.statesObject[this.state_manager.currentState].initMap()
        this.app.ticker.add(this.statesObject[this.state_manager.currentState].run)
        
        // //key events
        // window.addEventListener("keydown", e => this.handleKeyDown(e))
        // window.addEventListener("keyup", e => this.handleKeyUp(e))
    }

    // handleKeyDown = (e) => {
    //     this.keysObject[e.keyCode] = true
    // }

    // handleKeyUp = (e) => {
    //     this.keysObject[e.keyCode] = false
    // }
}

class State_Manager{
    constructor(currentState, app){
        this.app = app
        this.previousState = currentState
        this.currentState = currentState
    }

    setState = (newState) => {
        this.previousState = this.currentState
        this.currentState = newState

        this.app.ticker.remove(this.previousState.run)
        this.app.ticker.add(this.currentState.run)

    }

    getState = () => {
        return this.currentState
    }
}

const app = new Application
app.init()
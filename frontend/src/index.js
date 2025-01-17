import * as PIXI from 'pixi.js'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './settings'
import { assetsManifest } from './assetsManifest'
import Character from './code/Character'
import Cafe from './code/levels/Cafe'
import './styles/main.css'
import HellOverWorld from './code/levels/HellOverworld'


const body = document.querySelector('body')

// class Application{
//     constructor(){
//         this.app = new PIXI.Application()
//         this.ticker = new PIXI.Ticker()
        
//         // this.app.stage.scale.set(1.5)
//         //object for storing keys currently being pressed
//         this.keysObject = {}

//         //this is for te pixij debugger
//         globalThis.__PIXI_APP__ = this.app;

//         this.state_manager = new State_Manager('cafe_intro', this.app)
//     }

//     async init(){
//         await this.app.init({width: SCREEN_WIDTH, height: SCREEN_HEIGHT, preference: 'webgl'})
//         body.append(this.app.canvas)
//         await PIXI.Assets.init({manifest: assetsManifest})
//         this.cafe = new Cafe(this.app, this.keysObject, 'cafe_intro', this.state_manager.setState)
//         this.hellOverworld = new HellOverWorld(this.app, this.keysObject, 'hell_overworld', this.state_manager.setState)

//         this.statesObject = {
//             'cafe_intro': this.cafe,
//             'hell_overworld': this.hellOverworld
//         }
//         await this.statesObject[this.state_manager.currentState].initMap()
//         this.app.ticker.add(this.statesObject[this.state_manager.currentState].run)
//     }
// }

class Application {
    constructor() {
        this.app = new PIXI.Application()
        this.ticker = new PIXI.Ticker()
        this.keysObject = {}

        globalThis.__PIXI_APP__ = this.app

        // initialize state manager with an empty statesObject for now
        this.state_manager = new State_Manager('hell_overworld', {}, this.app);
    }

    async init() {
        await this.app.init({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, preference: 'webgl' });
        body.append(this.app.canvas);
        await PIXI.Assets.init({ manifest: assetsManifest });

        // instantiate states
        const cafe = new Cafe(this.app, this.keysObject, 'cafe_intro', this.state_manager.setState);
        const hellOverworld = new HellOverWorld(this.app, this.keysObject, 'hell_overworld', this.state_manager.setState);

        // update statesObject in State_Manager
        this.state_manager.statesObject = {
            cafe_intro: cafe,
            hell_overworld: hellOverworld,
        }

        // init the starting state
        await this.state_manager.setState(this.state_manager.currentState);
    }
}

class State_Manager{
    constructor(currentState, statesObject, app) {
        this.app = app;
        this.statesObject = statesObject;
        this.previousState = null;
        this.currentState = currentState;
    }

    setState = async (newState) => {
        // if (this.currentState === newState) return;

        // cleanup current state and remove its run method fromticker
        if (this.statesObject[this.currentState].destroy) {
            this.statesObject[this.currentState].destroy();
        }
        this.app.ticker.remove(this.statesObject[this.currentState].run);

        this.previousState = this.currentState;
        this.currentState = newState;
        console.log('debug', this.currentState)
        // Initialize new state
        const nextState = this.statesObject[this.currentState];
        if (nextState.initMap) {
            await nextState.initMap();
        }
        this.app.ticker.add(nextState.run);
    }

    getState = () => {
        return this.currentState
    }
}

const app = new Application
app.init()
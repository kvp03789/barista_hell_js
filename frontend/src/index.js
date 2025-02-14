import * as PIXI from 'pixi.js'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './settings'
import { assetsManifest } from './assetsManifest'
import Character from './code/Character'
import Cafe from './code/levels/Cafe'
import './styles/main.css'
import HellOverWorld from './code/levels/HellOverworld'
import { Equipment, Inventory, QuickBar } from './code/ItemsInventoryEquipment'
import { TitleScreen } from './code/levels/TitleScreen'


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
    }

    async init() {
        await this.app.init({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, preference: 'webgl' });
        body.append(this.app.canvas);
        await PIXI.Assets.init({ manifest: assetsManifest })

        //these assets have to be loaded before the rest. all other assets
        //are loaded in each level class as needed
        this.spritesheetAssets = await PIXI.Assets.loadBundle('character_spritesheets')
        this.uiAssets = await PIXI.Assets.loadBundle('ui_assets')
        this.iconAssets = await PIXI.Assets.loadBundle("icons")
        this.weaponAssets = await PIXI.Assets.loadBundle('weapon_assets')

        //init GameState
        this.game_state = new GameState(this.app, this.keysObject, this.weaponAssets, this.iconAssets, this.spritesheetAssets)
        
        // initialize state manager with an empty statesObject for now
        this.state_manager = new State_Manager('title_screen', {}, this.app, this.game_state)

        // instantiate states for use in statesObject
        const titleScreen = new TitleScreen(this.app, this.keysObject, 'title_screen', this.state_manager.setState)
        const cafe = new Cafe(this.app, this.keysObject, 'cafe_intro', this.state_manager.setState);
        const hellOverworld = new HellOverWorld(this.app, this.keysObject, 'hell_overworld', this.state_manager.setState);

        // update statesObject in State_Manager
        this.state_manager.statesObject = {
            title_screen: titleScreen,
            cafe_intro: cafe,
            hell_overworld: hellOverworld,
        }

        // init the starting state
        await this.state_manager.setState(this.state_manager.currentState);
    }
}

class State_Manager{
    constructor(currentState, statesObject, app, gameState) {
        this.app = app
        this.statesObject = statesObject
        this.previousState = null
        this.currentState = currentState
        this.gameState = gameState
    }

    setState = async (newState) => {
        // if (this.currentState === newState) return;

        // cleanup current state and remove its run method fromticker
        if (this.statesObject[this.currentState]) {
            this.statesObject[this.currentState].destroy()
        }
        this.app.ticker.remove(this.statesObject[this.currentState].run)

        this.previousState = this.currentState
        this.currentState = newState
        
        // initialize new state
        const nextState = this.statesObject[this.currentState]

        // update game state before switching
        this.gameState.currentLevel = this.currentState;
        this.gameState.saveProgress();

        if (nextState.initMap) {
            await nextState.initMap(this.gameState)
        }
        this.app.ticker.add(nextState.run)
    }

    getState = () => {
        return this.currentState
    }
}

class GameState {
    constructor(app, keysObject, weaponAssets, iconAssets, spritesheetAssets) {
        this.app = app
        //init the player
        this.character = new Character(this.app, keysObject, spritesheetAssets, weaponAssets, iconAssets)

        //init player inventory
        this.inventory = new Inventory(this.app, this.character, weaponAssets, iconAssets)
        //init player equipment, along with weaponSlots and equipmentSlots
        this.equipment = new Equipment(this.app, this.character, weaponAssets, iconAssets)
        //init player quick bar
        this.quickBar = new QuickBar(this.app, this.character, weaponAssets)

        // any game-wide stats
        this.stats = {                    
            playTime: 0,
            totalEnemiesDefeated: 0,
        }
        this.currentLevel = 'cafe_intro'
        this.flags = {}                  // for tracking game events (e.g., quests, interactions)
    }

    saveProgress() {
        // could serialize this data to localStorage or a backend for save/load
        console.log("Game progress saved.")
    }

    loadProgress() {
        // TODO----logic to load game data
        console.log("Game progress loaded.")
    }
}

const app = new Application
app.init()
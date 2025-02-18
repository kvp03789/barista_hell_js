import { Container, Assets, Sprite, Texture } from "pixi.js"
import Level from "./Level"

export class TitleScreen extends Level{
    constructor(app, keysObject, stateLabel, setState){
        super(app, keysObject, stateLabel, setState)
        this.app = app
        this.keysObject = keysObject
        this.stateLabel = stateLabel
        this.setState = setState

        this.backgroundImage = null
        this.characterSprite = null
        this.bonfireAnimatedSprite = null
        this.titleSprite = null

        //the main container of this level to which 
        // all assets get added
        this.mainContainer  = new Container()

        this.menuPadding = 10

        this.menuOptionsContainer = new Container
        this.menuOptionsContainer.label = "menu_options_container"
        this.menuOptionsContainer.position.set(500, 300)
        
        //populated during initMap call
        this.menuItemDictionary = {}

        //which TitleMenuOption is selected
        this.optionSelected = null

        this.app.stage.addChild(this.mainContainer)
    }

    handleKeyDown = (e) => {
        this.keysObject[e.keyCode] = true
    }

    handleKeyUp = (e) => {
        this.keysObject[e.keyCode] = false
    }

    initTitleText = () => {
        //title text looping video
        const videoTexture = this.titleScreenAssets.TitleTextVideo
        this.titleTextVideo = new Sprite(videoTexture);
        this.titleTextVideo.position.set(332, 92)

        // get the actual HTML video element
        const video = videoTexture.baseTexture.resource

        // enable looping
        video.loop = true
        video.muted = true
        video.autoplay = true
        video.play()

        // this.videoSprite.scale.set(.75)
        this.mainContainer.addChild(this.titleTextVideo)
    }

    initFire = () => {
        //title text looping video
        const fireVideoTexture = this.titleScreenAssets.FireVideo

        // get the actual HTML video element
        const fireVideo = fireVideoTexture.baseTexture.resource

        // Ensure video is ready
        fireVideo.addEventListener("loadeddata", () => {
            fireVideo.loop = true;
            fireVideo.muted = true;
            fireVideo.play();

            this.fireVideoSprite = new Sprite(fireVideoTexture)
            this.fireVideoSprite.label = "fire"
            this.fireVideoSprite.position.set(285, 245)
            this.fireVideoSprite.scale.set(.75)
            this.mainContainer.addChild(this.fireVideoSprite);
        });

        fireVideo.load(); // Force the video to start loading
    }

    initSnow = () => {
        //title text looping video
        const snowVideoTexture = this.titleScreenAssets.SnowVideo

        // get the actual HTML video element
        const snowVideo = snowVideoTexture.baseTexture.resource

        // Ensure video is ready
        snowVideo.addEventListener("loadeddata", () => {
            snowVideo.loop = true;
            snowVideo.muted = true;
            snowVideo.play();

            this.snowVideoSprite = new Sprite(snowVideoTexture)
            this.snowVideoSprite.label = "snow"
            this.snowVideoSprite.position.set(650, -75)
            this.snowVideoSprite.scale.set(2)
            this.mainContainer.addChild(this.snowVideoSprite);
        });

        snowVideo.load(); // Force the video to start loading
        
    }

    initCharacter = () => {
        //title text looping video
        const characterVideoTexture = this.titleScreenAssets.CharacterVideo
        this.characterVideoSprite = new Sprite(characterVideoTexture);

        // get the actual HTML video element
        const charVideo = characterVideoTexture.baseTexture.resource

        // Ensure video is ready
        charVideo.addEventListener("loadeddata", () => {
            charVideo.loop = true;
            charVideo.muted = true;
            charVideo.play();

            this.characterVideoSprite = new Sprite(characterVideoTexture);
            this.mainContainer.addChild(this.characterVideoSprite);
        });

        charVideo.load(); // Force the video to start loading

    }

    initFoliage = () => {
        //title text looping video
        const foliageVideoTexture = this.titleScreenAssets.FoliageVideo
        

        // get the actual HTML video element
        const foliageVideo = foliageVideoTexture.baseTexture.resource

        // Ensure video is ready
        foliageVideo.addEventListener("loadeddata", () => {
            foliageVideo.loop = true;
            foliageVideo.muted = true;
            foliageVideo.play();

            this.foliageVideoSprite = new Sprite(foliageVideoTexture)
            this.foliageVideoSprite.label = "foliage"
            this.foliageVideoSprite.position.set(0, 461)
            this.mainContainer.addChild(this.foliageVideoSprite)
        })

        foliageVideo.load(); // Force the video to start loading

    }

    initBackgroundLayers = () => {

        //cropped view through arch
        this.firstBackgroundLayer = new Sprite(this.titleScreenAssets.Background2)
        this.firstBackgroundLayer.position.set(630, 0)
        this.mainContainer.addChild(this.firstBackgroundLayer)

        //snow goes in between two background layers
        this.initSnow()

        //background layer
        this.secondBackgroundLayer = new Sprite(this.titleScreenAssets.Background1)
        this.mainContainer.addChild(this.secondBackgroundLayer)
    }

    initMenu = () => {
        this.menuItemDictionary = {
            newGame: new TitleMenuOption(this.titleScreenAssets.NewMenu, "new_game", (0, 0), this.setState, this.menuItemDictionary, false, this.titleScreenAssets.Selector, 'cafe_intro', this),
            loadGame: new TitleMenuOption(this.titleScreenAssets.LoadMenu, "load_game", (0, 40), this.setState, this.menuItemDictionary, false, this.titleScreenAssets.Selector, 'hell_overworld', this),
            options: new TitleMenuOption(this.titleScreenAssets.OptionsMenu, "options", (0, 80), this.setState, this.menuItemDictionary, false, this.titleScreenAssets.Selector, 'options', this),
            exitGame: new TitleMenuOption(this.titleScreenAssets.ExitMenu, "exit_game", (0, 120), this.setState, this.menuItemDictionary, false, this.titleScreenAssets.Selector, 'exit', this),
        }

        this.menuOptionsContainer.addChild(this.menuItemDictionary.newGame, this.menuItemDictionary.loadGame, this.menuItemDictionary.options, this.menuItemDictionary.exitGame)
        this.mainContainer.addChild(this.menuOptionsContainer)
    }

    initMap = async (gameState) => {
        //sets up even listener used by keysObject to handle key events
        //HAS TO BE CALLED HERE...cant be called in super constructor
        this.setUpKeyEvents()

        //load assets
        this.titleScreenAssets = await Assets.loadBundle('title_screen')
        this.particleAssets = await Assets.loadBundle('particle_spritesheets')
        this.character = gameState.character

        //init snow but dont add
        // this.initSnow()

        //init both background layers
        this.initBackgroundLayers()

        //init title text
        this.initTitleText()

        //init character
        this.initCharacter()

        //init foliage
        this.initFoliage()

        //init fire
        this.initFire()

        //init menu
        this.initMenu()
                
    }

    handleEnterPress = () =>  {
        if(this.optionSelected){
            //change state
            this.destroy()
            this.setState(this.optionSelected.stateLabel)
        }
    }

    run = () => {
        this.menuOptionsContainer.children.forEach(child => {
            child.run()
        })

        //handle enter key press
        if(this.keysObject[13]){
            this.handleEnterPress()
        }
    }
    
    //cleanup function
    destroy = () => {
        // stop animations/tickers
        this.app.ticker.remove(this.run)

        //remove weapon fire event
        this.app.stage.off('pointerdown', this.handleMouseDown)

        //remove keyDown and keyUp events
        this.removeKeyEvents()

        // remove all containers 
        while (this.app.stage.children.length > 0) {
            const child = this.app.stage.children[0]
            console.log('DESTORYED A FUUUCKIN THING', child)
            this.app.stage.removeChild(child)
            child.destroy({ children: true })
        }
    }
}

class TitleMenuOption extends Sprite{
    constructor(texture, label, pos, setState, menuItemsDictionary, initSelected, selectorTexture, stateLabel, titleMenu){
        super(texture)
        this.label = label
        this.position.set(pos)
        this.setState = setState
        this.menuItemDictionary = menuItemsDictionary

        this.selected = initSelected

        this.selector = new Sprite(selectorTexture)
        this.selector.label = "selector"
        this.selector.position.set(-30, 6)

        //the actual TitleMenu class
        this.titleMenu = titleMenu
        console.log(this.titleMenu, "debugging title menu")

        //which state is called when option is selected
        this.stateLabel = stateLabel

        this.interactive = true
        this.on("click", this.handleClick)
        this.on("mouseenter", this.handleMouseIn)
        this.on("mouseleave", this.handleMouseLeave)
    }

    handleClick = () => {
        console.log(`clicked ${this.label}`)
    }

    handleMouseIn = () => {
        console.log(`mouse in debug`)
        //set selected for this individual menu option
        if(!this.selected)this.selected = true

        //set selected in the title menu class
        if(!this.titleMenu.optionSelected){
            this.titleMenu.optionSelected = this
            console.log(`option selected changed: ${this.titleMenu.optionSelected.label}`)
        }
        if(this.titleMenu.optionSelected && this.titleMenu.optionSelected.label != this.label){
            this.titleMenu.optionSelected = this
            console.log(`option selected changed: ${this.titleMenu.optionSelected.label}`)
        }
    }

    handleMouseLeave = () => {
        //set selected for this individual menu option
        if(this.selected)this.selected = false

        //set selected in the title menu class
        if(this.titleMenu.optionSelected.label == this.label){
            this.titleMenu.optionSelected = null
        }
    }

    run = () => {
        if(this.selected && this.children.length === 0)this.addChild(this.selector)
        else if(!this.selected && this.children.length > 0)this.removeChild(this.selector)
    }
}
import { Container, Assets, Sprite, Texture } from "pixi.js"
import ParticleManager from "../Particles"
import { GodrayFilter, MotionBlurFilter } from "pixi-filters"

export class TitleScreen extends Container{
    constructor(app, keysObject, stateLabel, setStateFunc){
        super()
        this.app = app
        this.keysObject = keysObject
        this.stateLabel = stateLabel
        this.setStateFunc = setStateFunc

        this.backgroundImage = null
        this.characterSprite = null
        this.bonfireAnimatedSprite = null
        this.titleSprite = null

        this.menuPadding = 10

        this.menuOptionsContainer = new Container
        this.menuOptionsContainer.label = "menu_options_container"
        this.menuOptionsContainer.position.set(500, 300)
        

        this.app.stage.addChild(this)
        
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
        this.addChild(this.titleTextVideo)
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
            this.addChild(this.fireVideoSprite);
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
            this.addChild(this.snowVideoSprite);
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
            this.addChild(this.characterVideoSprite);
        });

        charVideo.load(); // Force the video to start loading

        // this.videoSprite.scale.set(.75)
        this.addChild(this.characterVideoSprite)
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
            this.addChild(this.foliageVideoSprite)
        });

        foliageVideo.load(); // Force the video to start loading

        // this.videoSprite.scale.set(.75)
        this.addChild(this.characterVideoSprite)
    }

    initBackgroundLayers = () => {

        //cropped view through arch
        this.firstBackgroundLayer = new Sprite(this.titleScreenAssets.Background2)
        this.firstBackgroundLayer.position.set(630, 0)
        this.addChild(this.firstBackgroundLayer)

        this.initSnow()

        //background layer
        this.secondBackgroundLayer = new Sprite(this.titleScreenAssets.Background1)
        this.addChild(this.secondBackgroundLayer)
    }

    initMenu = () => {
        this.newMenu = new Sprite(this.titleScreenAssets.NewMenu)
        this.newMenu.position.set(0, 0)
        this.loadMenu = new Sprite(this.titleScreenAssets.LoadMenu)
        this.loadMenu.position.set(0, 40)
        this.optionsMenu = new Sprite(this.titleScreenAssets.OptionsMenu)
        this.optionsMenu.position.set(0, 80)
        this.exitMenu = new Sprite(this.titleScreenAssets.ExitMenu)
        this.exitMenu.position.set(0, 120)

        this.menuOptionsContainer.addChild(this.newMenu, this.loadMenu, this.optionsMenu, this.exitMenu)
        this.addChild(this.menuOptionsContainer)
    }

    initMap = async (gameState) => {
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

    run = () => {
        
    }
    
    destroy = () => {

    }
}
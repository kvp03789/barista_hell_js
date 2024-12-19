import { Beans, CorruptedBlood, Ice, Milk, Syrup, WhippedCream } from "./code/item_classes/Materials"

export const settings = {
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 600, 
    ANIMATION_SPEED: 0.1666,
    TILE_HEIGHT: 30,
    TILE_WIDTH: 30,
    ZOOM_FACTOR: 1.8,
    UI_CLICK_COOLDOWN: 20,
    UI_SETTINGS: {PADDING: 12},
    PLAYER_SETTINGS: {
        INVENTORY_SLOTS_AMOUNT: 40,
        EQUIPMENT_SLOTS: ["hands", "feet", "chest", "legs", "head"],
        QUICK_BAR_SLOTS_AMOUNT: 8
    },
    WEAPON_SETTINGS: {
        BattleRifle:{
            type: 'BattleRifle',
            fireRate: 5,
            fireType: 'automatic',
            clipSize: 80,
            damage: 2,
            bulletSpeed: 45
        },
        Shotgun:{ 
            type: 'BattleRifle',
            fireRate: 20,
            fireType: 'single-spread',
            clipSize: 12,
            damage: 10,
            bulletSpeed: 10
        },
    },
    TESTING_ITEMS:{
        TESTING_INVENTORY: [],
        TESTING_QUICKBAR: [],
        TESTING_EQUIPMENT: {}
    },
    DRINK_RECIPES: [
        ["WhippedCream" ,"WhippedCream" ,"Ice" ,"Syrup" ,"Milk" ,"Beans"], //frappe
        [null, null, "Milk" ,"Milk" ,"Beans" ,"Beans"],  //latte
        ["Milk" ,"Milk" ,"Ice" ,"Milk" ,"Beans" ,"Beans"], //iced coffee
        [null, null, "Beans" ,"Beans" ,"Beans" ,"Beans"],   //coffee
        ["WhippedCream" ,"CorruptedBlood" ,"Ice" ,"CorruptedBlood" ,"Milk" ,"Beans"], //fel frappe
        [null, null, "Milk" ,"CorruptedBlood" ,"LargeFang" ,"Beans"],  //fel latte
        ["CorruptedBlood" ,"CorruptedBlood" ,"Ice" ,"Milk" ,"Beans" ,"Beans"], //fel iced coffee
        [null, null, "LargeFang" ,"Beans" ,"Beans" ,"Beans"],   //fel coffee
    ],
    ITEM_DESCRIPTIONS: {
        Beans: {type: "Material", description: "A description of the item."},
        Syrup: {type: "Material", description: "A description of the item."},
        Milk: {type: "Material", description: "A description of the item."},
        Ice: {type: "Material", description: "A description of the item."},
        Beans: {type: "Material", description: "A description of the item."},
        WhippedCream: {type: "Material", description: "A description of the item."},
        LargeFang: {type: "Material", description: "A description of the item."},
        CorruptedBlood: {type: "Material", description: "A description of the item."}

    },
    NPC_DIALOGUE_DISTANCE: 50,
    NPC_DIALOGUE: {
        cafe_intro:{
            sarah_npc:{
                1: 'Yo dude....',
                2: 'Yea this portal to hell is really spiking my anxiety. Did you clock in?'
            },
            robert_npc:{
                1: `Oh hey PLAYER NAME...didn't see you walk in.`,
                2: 'Yea looks like a portal to hell opened up right in the cafe earlier. \
                I\'m looking it up now. Always something, huh?'
            }
        }
        
    }
    
};

export const { SCREEN_WIDTH, SCREEN_HEIGHT, ANIMATION_SPEED, TILE_HEIGHT, TILE_WIDTH, ZOOM_FACTOR, UI_CLICK_COOLDOWN, UI_SETTINGS, PLAYER_SETTINGS,  WEAPON_SETTINGS, TESTING_ITEMS, DRINK_RECIPES, ITEM_DESCRIPTIONS, NPC_DIALOGUE_DISTANCE } = settings;



import { Beans, CorruptedBlood, Ice, Milk, Syrup, WhippedCream } from "./code/item_classes/Materials"

export const settings = {
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 600, 
    ANIMATION_SPEED: 0.1666,
    TILE_HEIGHT: 30,
    TILE_WIDTH: 30,
    ZOOM_FACTOR: 1.8,
    ICON_SCALING: 1.5, 
    UI_CLICK_COOLDOWN: 20,
    UI_SETTINGS: {PADDING: 12, ENEMY_HEALTH_BAR: {WIDTH: 50, HEIGHT: 7, BACKGROUND_COLOR: 0x444444, FOREGROUND_COLOR: 0xff0000}},
    PLAYER_SETTINGS: {
        BASE_SPEED: 8,
        INVENTORY_SLOTS_AMOUNT: 40,
        INVENTORY_STACKS: {"material": 100, "consumable": 10, "weapon": 1},
        EQUIPMENT_SLOTS: ["hands", "feet", "chest", "legs", "head"],
        QUICK_BAR_SLOTS_AMOUNT: 8,
        MAX_HEALTH: 50
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
        //materials
        Beans: {name: "Beans", type: "Material", description: "A description of the item."},
        Syrup: {name: "Syrup", type: "Material", description: "A description of the item."},
        Milk: {name: "Milk", type: "Material", description: "A description of the item."},
        Ice: {name: "Ice", type: "Material", description: "A description of the item."},
        Beans: {name: "Beans", type: "Material", description: "A description of the item."},
        WhippedCream: {name: "Whipped Cream", type: "Material", description: "A description of the item."},
        LargeFang: {name: "Large Fang", type: "Material", description: "A description of the item."},
        CorruptedBlood: {name: "Corrupted Blood", type: "Material", description: "A description of the item."},
        //consumables
        Frappe: {name: "Frappe", type: "Consumable", description: "A description of the item.",
            effects: {buff: "CaffeineRush"}
        },
        Latte: {name: "Latte", type: "Consumable", description: "A description of the item.",
            effects: {buff: "EspressoAegis"}
        },
        Coffee: {name: "Coffee", type: "Consumable", description: "A description of the item.",
            effects: {buff: "CaffeineRush"}
        },
        IcedCoffee: {name: "Iced Coffee", type: "Consumable", description: "A description of the item.",
            effects: {buff: "CaffeineRush"}
        },
        FelFrappe: {name: "Fel Frappe", type: "Consumable", description: "A description of the item.",
            effects: {buff: "CaffeineRush"}
        },
        FelLatte: {name: "Fel Latte", type: "Consumable", description: "A description of the item.",
            effects: {buff: "CaffeineRush"}
        },
        FelCoffee: {name: "Fel Coffee", type: "Consumable", description: "A description of the item.",
            effects: {buff: "CaffeineRush"}
        },
        FelIcedCoffee: {name: "Fel Iced Coffee", type: "Consumable", description: "A description of the item.",
            effects: {buff: "CaffeineRush"}
        },

    },
    BUFF_DATA: {
        "CaffeineRush": {
            "name": "Caffeine Rush",
            //atm type is buff or debuff 
            "type": "buff",
            //buff type is only if type is Buff. buffTypes can be:
            //damage, shield, speed, stat, or other
            "buffType": "speed",
            "duration": 15000, // miliseconds
            "applyEffect": (target) => {
                console.log("speed buff being applied...", target.speed)
                target.speed *= 1.5
                console.log("speed buff applied!", target.speed)
            },
            "removeEffect": (target) => {
                target.speed /= 1.5
                console.log("speed buff being removed...", target.speed)
            },
            "description": "A description of the buff goes here",
            //particleKey is which geometry particle associated with this buff
            "particleKey": "speedLines"
        },
        "EspressoAegis": {
            "name": "Espresso Aegis",
            //atm type is buff or debuff 
            "type": "buff",
            //buff type is only if type is Buff. buffTypes can be:
            //damage, shield, speed, stat, or other
            "buffType": "shield",
            "duration": 5000, // miliseconds
            "applyEffect": (target) => target.speed *= 1.5,
            "removeEffect": (target) => target.speed /= 1.5,
            "description": "A description of the buff goes here",
            //particleKey is which geometry particle associated with this buff
            "particleKey": "shield"
        }
    },
    //boons given by npcs, buffs from items
    BOON_DATA:{},
    NPC_DIALOGUE_DISTANCE: 50,
    NPC_DIALOGUE_SECTION_LENGTH: 100,
    NPC_DIALOGUE: {
        //dialogue options that have a repsonse should have 'hasResponse' boolean
        //dialogue that is with a vendor/trainer should have 'isStore' boolean
        //see first sarah_npc example 
        cafe_intro:{
            Sarah_npc:{
                DIALOGUE_TOTAL: 3,
                1: {text: 'Yo dude....', hasResponse: false, isStore: false},
                2: {text:  'Yea this portal to hell is really spiking my anxiety. Did you clock in?'},
                3: {text: 'This is just a really long dialogue section to test multiple pages of dialogue on an NPC. Just need a bunch of filler here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
            },
            Robert_npc:{
                DIALOGUE_TOTAL: 2,
                1: {text: `Oh hey PLAYER NAME...didn't see you walk in.`},
                2: {text: 'Yea looks like a portal to hell opened up right in the cafe earlier. ' +
                'I\'m looking it up now. Always something around here, huh?'}
            }
        }
    },
    PARTICLE_ANIMATION_SETTINGS: {
        Teleport_Beam: {animationSpeed: 0.3, anchor: (1, 1), alpha: 1, scale: 1.8, hasRandomness: 0},
        BulletWallExplodeParticleSmoke: {animationSpeed: 0.166, anchor: (.5), alpha: .6, scale: 1.8, hasRandomness: 1},
        CharacterWalkingParticle: {animationSpeed: 0.5, anchor: (.5), alpha: .5, scale: 1.8, hasRandomness: 1},
        Blood_Splatter: {animationSpeed: 0.3, anchor: (.5), alpha: 1, scale: 1.8, hasRandomness: 1},
        Sparkle: {animationSpeed: 0.3, anchor: (.5), alpha: 1, scale: 1.5, hasRandomness: 1},

    },
    GEOMETRY_PARTICLE_SETTINGS: {
        speedLines: {
            alpha: .6,
            fillColor: 0xFFFFFF, 
            alpha: 0.6, 
            speed: 15, // speed of the particle movement
            length: 50, // how long the lines last
            life: 70,
            hasMovement: true
        },
        shield: {
            alpha: .01,
            fillColor: 0x34C9EB, 
            radius: 75,
            speed: 15, // speed of the particle movement
            length: 50, // how long the lines last
            life: 70,
            hasMovement: false
        },
        explosionRing: {
            lineWidth: 5,
            lineColor: 0xFF4500, // orange color for explosion
            opacity: 1,
            radius: 100, // radius of the explosion ring
            expansionSpeed: 30, // how fast the ring expands
            lifeSpan: 500, // time in ms before the ring fades out
        },
        trailEffect: {
            trailLength: 20, // how long the trail is
            trailColor: 0x00FFFF, // cyan color
            fadeRate: 0.1, // rate at which the trail fades out
            startSize: 5, // initial size of the trail particles
            endSize: 0.5, // final size of the trail particles
            speed: 10, // how fast the trail moves
        },
        burst: {
            particleCount: 30, // how many particles in the burst
            size: 10, // size of the burst particles
            color: 0xFF6347, // tomato red
            speed: 20, // speed of the particles in the burst
            randomness: 0.5, // how much randomness there is to the particle movement
            lifetime: 300, // how long each particle lasts
        }
    },
    ENEMY_SETTINGS: {
        Slime:{maxHealth: 15, speed: 5, attackSpeed: 20, attackRange: 20,
            attackDamage: 2, animationSpeed: 0.2, visionRadius: 220,
            items: { drops:[{name: "Beans", Chance: 20}, {name: "Syrup", Chance: 20}, {name: "Milk", Chance: 60}, {name: "WhippedCream", Chance: 20}], min: 4, max: 8}
        }
    }
}

export const { SCREEN_WIDTH, SCREEN_HEIGHT, ANIMATION_SPEED, TILE_HEIGHT, TILE_WIDTH, ZOOM_FACTOR, ICON_SCALING, UI_CLICK_COOLDOWN, UI_SETTINGS, PLAYER_SETTINGS,  WEAPON_SETTINGS, TESTING_ITEMS, DRINK_RECIPES, ITEM_DESCRIPTIONS, BUFF_DATA, BOON_DATA, NPC_DIALOGUE_DISTANCE, NPC_DIALOGUE_SECTION_LENGTH, NPC_DIALOGUE, PARTICLE_ANIMATION_SETTINGS, GEOMETRY_PARTICLE_SETTINGS, ENEMY_SETTINGS } = settings;



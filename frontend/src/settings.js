
export const settings = {
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 600, 
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
    }
    
};

export const { SCREEN_WIDTH, SCREEN_HEIGHT, TILE_HEIGHT, TILE_WIDTH, ZOOM_FACTOR, UI_CLICK_COOLDOWN, UI_SETTINGS, PLAYER_SETTINGS,  WEAPON_SETTINGS, TESTING_ITEMS } = settings;




export const settings = {
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 600, 
    TILE_HEIGHT: 30,
    TILE_WIDTH: 30,
    ZOOM_FACTOR: 1.8,
    PLAYER_SETTINGS: {
        INVENTORY_SLOTS_AMOUNT: 16,
        EQUIPMENT_SLOTS: ['weapon', 'weapon', 'hat', 'apron', 'shoes', 'trinket']
    },
    WEAPON_SETTINGS: {
        BattleRifle:{
            type: 'BattleRifle',
            fireRate: 5,
            fireType: 'automatic',
            clipSize: 80,
            damage: 2,
            bulletSpeed: 25
        },
        Shotgun:{ 
            type: 'BattleRifle',
            fireRate: 20,
            fireType: 'single-spread',
            clipSize: 12,
            damage: 10,
            bulletSpeed: 10
        },
    }
};

export const { SCREEN_WIDTH, SCREEN_HEIGHT, TILE_HEIGHT, TILE_WIDTH, ZOOM_FACTOR, PLAYER_SETTINGS,  WEAPON_SETTINGS } = settings;



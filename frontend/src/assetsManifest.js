import CharacterIdleSpritesheet from './img/spritesheets/character/idle_spritesheet.png'
import CharacterRunRightSpritesheet from './img/spritesheets/character/run_right_spritesheet.png'
import CharacterRunLeftSpritesheet from './img/spritesheets/character/run_left_spritesheet.png'
import CharacterRunDownSpritesheet from './img/spritesheets/character/run_down_spritesheet.png'
import CharacterRunUpSpritesheet from './img/spritesheets/character/run_up_spritesheet.png'
import CafeBaseMap from './img/map_pngs/cafe_base_map.png'
import CafeTilesetPng from './img/tileset_pngs/cafe_tileset_1.png'
import BattleRifleLeft from './img/weapons/battle_rifle/br_left.png'
import BattleRifleRight from './img/weapons/battle_rifle/br_right.png'
import BattleRifleUp from './img/weapons/battle_rifle/br_up.png'
import BattleRifleDown from './img/weapons/battle_rifle/br_down.png'
import ShotgunLeft from './img/weapons/shotgun/shotgun_left.png'
import ShotgunRight from './img/weapons/shotgun/shotgun_right.png'
import ShotgunUp from './img/weapons/shotgun/shotgun_up.png'
import ShotgunDown from './img/weapons/shotgun/shotgun_down.png'

export const assetsManifest = {
    "bundles":[
       {
          "name":"character_spritesheets",
          "assets":[
             {
                "alias":"character_idle",
                "src":CharacterIdleSpritesheet
             },
             {
               "alias":"character_run_right",
               "src":CharacterRunRightSpritesheet
            },
            {
               "alias":"character_run_down",
               "src":CharacterRunDownSpritesheet
            },
            {
               "alias":"character_run_up",
               "src":CharacterRunUpSpritesheet
            },
            
            {
               "alias":"character_run_left",
               "src":CharacterRunLeftSpritesheet
            },
          ]
       },
      {
         "name": "cafe_assets",
         "assets":[
            {
               "alias": "CafeBaseMap",
               "src": CafeBaseMap
            },
            {
               "alias": "CafeTilesetPng",
               "src": CafeTilesetPng
            }
         ]
      },
      {
         "name": "weapon_assets",
         "assets":[
            {
               "alias": "BattleRifleLeft",
               "src": BattleRifleLeft
            },
            {
               "alias": "BattleRifleRight",
               "src": BattleRifleRight
            },
            {
               "alias": "BattleRifleUp",
               "src": BattleRifleUp
            },
            {
               "alias": "BattleRifleDown",
               "src": BattleRifleDown
            },
            {
               "alias": "ShotgunLeft",
               "src": ShotgunLeft
            },
            {
               "alias": "ShotgunRight",
               "src": ShotgunRight
            },
            {
               "alias": "ShotgunUp",
               "src": ShotgunUp
            },
            {
               "alias": "ShotgunDown",
               "src": ShotgunDown
            }
         ]
      }
    ]
 }


import CharacterIdleSpritesheet from './img/spritesheets/character/idle_spritesheet.png'
import CharacterRunRightSpritesheet from './img/spritesheets/character/run_right_spritesheet.png'
import CharacterRunLeftSpritesheet from './img/spritesheets/character/run_left_spritesheet.png'
import CharacterRunDownSpritesheet from './img/spritesheets/character/run_down_spritesheet.png'
import CharacterRunUpSpritesheet from './img/spritesheets/character/run_up_spritesheet.png'
import CafeBaseMap from './img/map_pngs/cafe_base_map.png'
import CafeTilesetPng from './img/tileset_pngs/cafe_tileset_1.png'


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
      }
    ]
 }


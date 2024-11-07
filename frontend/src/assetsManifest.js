//character
import CharacterIdleSpritesheet from './img/spritesheets/character/idle_spritesheet.png'
import CharacterIdleUpSpritesheet from './img/spritesheets/character/idle_up_spritesheet.png'
import CharacterIdleRightSpritesheet from './img/spritesheets/character/idle_right_spritesheet.png'
import CharacterIdleLeftSpritesheet from './img/spritesheets/character/idle_left_spritesheet.png'
import CharacterRunRightSpritesheet from './img/spritesheets/character/run_right_spritesheet.png'
import CharacterRunLeftSpritesheet from './img/spritesheets/character/run_left_spritesheet.png'
import CharacterRunDownSpritesheet from './img/spritesheets/character/run_down_spritesheet.png'
import CharacterRunUpSpritesheet from './img/spritesheets/character/run_up_spritesheet.png'

//ui
import UI_IpadTurnOnSpritesheet from './img/spritesheets/ipad/ipad_turn_on.png'
import UI_HUDHealthBar from './img/ui/health_bar.png'
import UI_IpadFrame from './img/ui/ipad_frame.png'
import UI_IpadEquipmentBG from './img/ui/ipad_equipment_bg.png'
import UI_IpadStatsBG from './img/ui/ipad_stats_bg.png'
import UI_HUDFullBG from './img/ui/full_ui_bg.png'
import UI_EmptyItemSlot from './img/ui/empty_item_slot.png'
import UI_IpadNavRight from './img/ui/ipad_nav_right.png'
import UI_IpadNavLeft from './img/ui/ipad_nav_left.png'
import UI_IpadEmptyCharacterSheetSlot from './img/ui/empty_character_sheet_item.png'

//particles
import BulletWallExplodeParticleSmoke from './img/spritesheets/particles/bullet_explode_particle_smoke.png'
import CharacterWalkingParticle from './img/spritesheets/particles/walking_particle_spritesheet.png'

//tiles
import PuddleTile from './img/spritesheets/tiles/puddle_spritesheet.png'
import HellCircleInactive from './img/spritesheets/tiles/hell_circle_inactive_spritesheet.png'
import TrashPile from './img/spritesheets/tiles/trash_pile_spritesheet.png'

//guns
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
//bullets
import BattleRifle1 from './img/weapons/battle_rifle/bullet1.png'
import BattleRifle2 from './img/weapons/battle_rifle/bullet2.png'
import BattleRifle3 from './img/weapons/battle_rifle/bullet3.png'


export const assetsManifest = {
    "bundles":[
      {
         "name": "ui_assets",
         "assets":[
            {
               "alias": "UI_IpadTurnOnSpritesheet",
               "src": UI_IpadTurnOnSpritesheet
            },
            {
               "alias": "UI_HUDHealthBar",
               "src": UI_HUDHealthBar
            },
            {
               "alias": "UI_IpadFrame",
               "src": UI_IpadFrame
            },
            {
               "alias": "UI_IpadEquipmentBG",
               "src": UI_IpadEquipmentBG
            },
            {
               "alias": "UI_IpadStatsBG",
               "src": UI_IpadStatsBG
            },
            {
               "alias" :"UI_HUDFullBG",
               "src": UI_HUDFullBG
            },
            {
               "alias" :"UI_EmptyItemSlot",
               "src": UI_EmptyItemSlot
            },
            {
               "alias" :"UI_IpadNavRight",
               "src": UI_IpadNavRight
            },
            {
               "alias" :"UI_IpadNavLeft",
               "src": UI_IpadNavLeft
            },
            {
               "alias": "UI_IpadEmptyCharacterSheetSlot",
               "src": UI_IpadEmptyCharacterSheetSlot
            }

         ]
      },
       {
          "name":"character_spritesheets",
          "assets":[
             {
                "alias":"character_idle",
                "src":CharacterIdleSpritesheet
             },
             {
               "alias":"character_idle_up",
               "src":CharacterIdleUpSpritesheet
            },
            {
               "alias":"character_idle_right",
               "src":CharacterIdleRightSpritesheet
            },
            {
               "alias":"character_idle_left",
               "src":CharacterIdleLeftSpritesheet
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
            "name": "particle_spritesheets",
            "assets": [
               {
                  "alias": "BulletWallExplodeParticleSmoke",
                  "src": BulletWallExplodeParticleSmoke
               },
               {
                  "alias": "CharacterWalkingParticle",
                  "src": CharacterWalkingParticle
               }
         ]
       },
       {
         "name": "tile_spritesheets",
         "assets": [
            {
               "alias": "PuddleTile",
               "src": PuddleTile
            },
            {
               "alias": "HellCircleInactive",
               "src": HellCircleInactive
            },
            {
               "alias": "TrashPile",
               "src": TrashPile
            }
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
      },
      {
         "name": "bullet_assets",
         "assets":[
            {
               "alias": "BattleRifle1",
               "src": BattleRifle1
            },
            {
               "alias": "BattleRifle2",
               "src": BattleRifle2
            },
            {
               "alias": "BattleRifle3",
               "src": BattleRifle3
            }
         ]
      }
    ]
 }


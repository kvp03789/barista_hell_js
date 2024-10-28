//character
import CharacterIdleSpritesheet from './img/spritesheets/character/idle_spritesheet.png'
import CharacterIdleUpSpritesheet from './img/spritesheets/character/idle_up_spritesheet.png'
import CharacterIdleRightSpritesheet from './img/spritesheets/character/idle_right_spritesheet.png'
import CharacterIdleLeftSpritesheet from './img/spritesheets/character/idle_left_spritesheet.png'
import CharacterRunRightSpritesheet from './img/spritesheets/character/run_right_spritesheet.png'
import CharacterRunLeftSpritesheet from './img/spritesheets/character/run_left_spritesheet.png'
import CharacterRunDownSpritesheet from './img/spritesheets/character/run_down_spritesheet.png'
import CharacterRunUpSpritesheet from './img/spritesheets/character/run_up_spritesheet.png'
//particles
import BulletExplodeParticleSmoke from './img/spritesheets/particles/bullet_explode_particle_smoke.png'
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
                  "alias": "BulletExplodeParticleSmoke",
                  "src": BulletExplodeParticleSmoke
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


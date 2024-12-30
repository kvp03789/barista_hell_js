//character spritesheet
import PlayerSpritesheet from './img/spritesheets/character/player_animations_combined.png'

//npc spritesheets
import NPCSpritesheet_RobertSpritesheet from './img/spritesheets/npc/robert.png'
import NPCSpritesheet_SarahSpritesheet from './img/spritesheets/npc/sarah.png'

//ui
import UI_IpadTurnOnSpritesheet from './img/spritesheets/ipad/ipad_turn_on.png'
import UI_HUDHealthBar from './img/ui/health_bar.png'
import UI_IpadFrame from './img/ui/ipad_frame.png'
import UI_IpadEquipmentBG from './img/ui/ipad_equipment_bg.png'
import UI_IpadStatsBG from './img/ui/ipad_stats_bg.png'
import UI_HUDFullBG from './img/ui/full_ui_bg.png'
import UI_IpadNavRight from './img/ui/ipad_nav_right.png'
import UI_IpadNavLeft from './img/ui/ipad_nav_left.png'
import UI_InventoryBG from './img/ui/inventory_bg.png'
import UI_CraftingBG from './img/ui/crafting_bg.png'
import UI_Tooltip_BG_Texture from './img/ui/tooltip_bg_texture.png'
import UI_Dialogue_BG from './img/ui/dialogue_bg.png'

//particles
import Particle_BulletWallExplodeParticleSmoke from './img/spritesheets/particles/bullet_explode_particle_smoke.png'
import Particle_CharacterWalkingParticle from './img/spritesheets/particles/walking_particle_spritesheet.png'
import Particle_AshParticle from './img/spritesheets/particles/ash_particle_spritesheet.png'

//tiles
import PuddleTile from './img/spritesheets/tiles/puddle_spritesheet.png'
import HellCircleInactive from './img/spritesheets/tiles/hell_circle_inactive_spritesheet.png'
import TrashPile from './img/spritesheets/tiles/trash_pile_spritesheet.png'
import Torch from './img/spritesheets/tiles/torch_spritesheet.png'

//cafe map assets
import CafeBaseMap from './img/map_pngs/cafe_base_map.png'
import CafeTilesetPng from './img/tileset_pngs/cafe_tileset_1.png'

//hell overworld map assets
import HellOverworldBaseMap from './img/map_pngs/hell_overworld_base_map.png'
import HellOverworldTilesetPng from './img/tileset_pngs/hell_overworld_tileset_1.png'

//guns
import BattleRifleLeft from './img/weapons/battle_rifle/br_left.png'
import BattleRifleRight from './img/weapons/battle_rifle/br_right.png'
import BattleRifleUp from './img/weapons/battle_rifle/br_up.png'
import BattleRifleDown from './img/weapons/battle_rifle/br_down.png'
import ShotgunLeft from './img/weapons/shotgun/shotgun_left.png'
import ShotgunRight from './img/weapons/shotgun/shotgun_right.png'
import ShotgunUp from './img/weapons/shotgun/shotgun_up.png'
import ShotgunDown from './img/weapons/shotgun/shotgun_down.png'

//icons
//materials
import Icon_Beans from './img/materials/beans.png'
import Icon_Ice from './img/materials/ice.png'
import Icon_WhippedCream from './img/materials/whipped_cream.png'
import Icon_Syrup from './img/materials/syrup.png'
import Icon_Milk from './img/materials/milk.png'
import Icon_LargeFang from './img/materials/large_fang.png'
import Icon_CorruptedBlood from './img/materials/corrupted_blood.png'
//equipment

//consumables
import Icon_Frappe from './img/consumables/frappe.png'
import Icon_Coffee from './img/consumables/coffee.png'
import Icon_Latte from './img/consumables/latte.png'
import Icon_IcedCoffee from './img/consumables/iced_coffee.png'
import Icon_FelFrappe from './img/consumables/demonic_frappe.png'
import Icon_FelCoffee from './img/consumables/demonic_coffee.png'
import Icon_FelLatte from './img/consumables/demonic_latte.png'
import Icon_FelIcedCoffee from './img/consumables/demonic_iced_coffee.png'
import Icon_CraftingSelected from './img/consumables/selected.png'
//empty icons
import Icon_EmptyItemSlot from './img/ui/empty_item_slot.png'
import Icon_EmptyCharacterSheetSlot from './img/ui/empty_character_sheet_item.png'

//bullets
import BattleRifle1 from './img/weapons/battle_rifle/bullet1.png'
import BattleRifle2 from './img/weapons/battle_rifle/bullet2.png'
import BattleRifle3 from './img/weapons/battle_rifle/bullet3.png'

//objects
import EspressoMachineActive from './img/objects/espresso_machine_active.png'
import EspressoMachineInactive from './img/objects/espresso_machine_inactive.png'
import HellArch from './img/objects/hell_arch.png'

//parallax background
import HellParallax1 from './img/map_pngs/hell_bg/hell_bg_1.png'
import HellParallax2 from './img/map_pngs/hell_bg/hell_bg_2.png'
import HellParallax3 from './img/map_pngs/hell_bg/hell_bg_3.png'
import HellParallax4 from './img/map_pngs/hell_bg/hell_bg_4.png'
import HellParallax5 from './img/map_pngs/hell_bg/hell_bg_5.png'
import HellParallax6 from './img/map_pngs/hell_bg/hell_bg_6.png'

import FogHellParallax1 from './img/map_pngs/hell_bg/hell_bg_fog_1.png'
import FogHellParallax2 from './img/map_pngs/hell_bg/hell_bg_fog_2.png'


//fonts
import Font_AdvancedPixel7 from './fonts/advanced_pixel-7.ttf'

export const assetsManifest = {
    "bundles":[
      //npc
      {
         "name": "npc_spritesheets",
         "assets": [
            {
               "alias": "NPCSpritesheet_RobertSpritesheet",
               "src": NPCSpritesheet_RobertSpritesheet
            },
            {
               "alias": "NPCSpritesheet_SarahSpritesheet",
               "src": NPCSpritesheet_SarahSpritesheet
            }
         ]
      },
      //overworld objects
      {
         "name": "overworld_objects",
         "assets": [
            {
               "alias": "EspressoMachineActive",
               "src": EspressoMachineActive
            },
            {
               "alias": "EspressoMachineInactive",
               "src": EspressoMachineInactive
            },
            {
               "alias": "HellArch",
               "src": HellArch
            }
         ]
      },
      //icons
      {
         "name": "icons",
         "assets":[
            {
               "alias": "Icon_Beans", 
               "src": Icon_Beans
            },
            {
               "alias": "Icon_Ice", 
               "src": Icon_Ice
            },
            {
               "alias": "Icon_Syrup", 
               "src": Icon_Syrup
            },
            {
               "alias": "Icon_WhippedCream", 
               "src": Icon_WhippedCream
            },
            {
               "alias": "Icon_Milk", 
               "src": Icon_Milk
            },
            {
               "alias": "Icon_LargeFang", 
               "src": Icon_LargeFang
            },
            {
               "alias": "Icon_CorruptedBlood", 
               "src": Icon_CorruptedBlood
            },
            {
               "alias" :"Icon_EmptyItemSlot",
               "src": Icon_EmptyItemSlot
            },
            {
               "alias": "Icon_EmptyCharacterSheetSlot",
               "src": Icon_EmptyCharacterSheetSlot
            },
            {
               "alias": "Icon_Coffee",
               "src": Icon_Coffee
            },
            {
               "alias": "Icon_Frappe",
               "src": Icon_Frappe
            },
            {
               "alias": "Icon_Latte",
               "src": Icon_Latte
            },
            {
               "alias": "Icon_IcedCoffee",
               "src": Icon_IcedCoffee
            },
            {
               "alias": "Icon_FelCoffee",
               "src": Icon_FelCoffee
            },
            {
               "alias": "Icon_FelFrappe",
               "src": Icon_FelFrappe
            },
            {
               "alias": "Icon_FelLatte",
               "src": Icon_FelLatte
            },
            {
               "alias": "Icon_FelIcedCoffee",
               "src": Icon_FelIcedCoffee
            },
            {
               "alias": "Icon_CraftingSelected",
               "src": Icon_CraftingSelected
            }
         ]
      },
      //ui assets
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
               "alias" :"UI_IpadNavRight",
               "src": UI_IpadNavRight
            },
            {
               "alias" :"UI_IpadNavLeft",
               "src": UI_IpadNavLeft
            },
            {
               "alias": "UI_InventoryBG",
               "src": UI_InventoryBG
            },
            {
               "alias": "UI_CraftingBG",
               "src": UI_CraftingBG
            }, 
            {
               "alias": "UI_Tooltip_BG_Texture",
               "src": UI_Tooltip_BG_Texture
            },
            {
               "alias": "UI_Dialogue_BG",
               "src": UI_Dialogue_BG
            }
         ]
       },
       //character spritesheet
       {
          "name":"character_spritesheets",
          "assets":[
            {
               "alias":"PlayerSpritesheet",
               "src":PlayerSpritesheet
            }
          ]
       },
       //particles
       {
            "name": "particle_spritesheets",
            "assets": [
               {
                  "alias": "Particle_BulletWallExplodeParticleSmoke",
                  "src": Particle_BulletWallExplodeParticleSmoke
               },
               {
                  "alias": "Particle_CharacterWalkingParticle",
                  "src": Particle_CharacterWalkingParticle
               },
               {
                  "alias": "Particle_AshParticle",
                  "src": Particle_AshParticle
               }
         ],
         
       },
       //animated tile spritesheets
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
            },
            {
               "alias": "Torch",
               "src": Torch
            }
      ]
       },
       //cafe map assets
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
       //hell overworld map assets
       {
         "name": "hell_overworld_assets",
         "assets":[
            {
               "alias": "HellOverworldBaseMap",
               "src": HellOverworldBaseMap
            },
            {
               "alias": "HellOverworldTilesetPng",
               "src": HellOverworldTilesetPng
            }
         ]
       },
       //weapon_assets
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
       //bullet assets
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
       },
       //hell parallax bg
       {
         "name": "hell_parallax_background_assets",
         "assets":[
            {
               "alias": "HellParallax1",
               "src": HellParallax1
            },
            {
               "alias": "HellParallax2",
               "src": HellParallax2
            },
            {
               "alias": "HellParallax3",
               "src": HellParallax3
            },
            {
               "alias": "HellParallax4",
               "src": HellParallax4
            },
            {
               "alias": "HellParallax5",
               "src": HellParallax5
            },
            {
               "alias": "HellParallax6",
               "src": HellParallax6
            },
            {
               "alias": "FogHellParallax1",
               "src": FogHellParallax1
            },
            {
               "alias": "FogHellParallax2",
               "src": FogHellParallax2
            },
         ]
       },
       //fonts
       {
         "name": "fonts",
         "assets":[
            {
               "alias": "Font_AdvancedPixel7",
               "src": Font_AdvancedPixel7
            },
         ]
       }
    ]
 }


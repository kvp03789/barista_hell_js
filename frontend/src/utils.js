import parse from "parse-svg-path"
import { TILE_WIDTH, TILE_HEIGHT } from "./settings"

//parse map data from 1d array into 2d array 
export function parseMapData(mapData) {
    const parsedMapObject = {height: mapData.height, width: mapData.width}
    mapData.layers.forEach(layer => {
        parsedMapObject[layer.name] = []
        for(let i = 0; i < layer.data.length; i += layer.width){
            parsedMapObject[layer.name].push(layer.data.slice(i, layer.width + i))
        }
    })
    return parsedMapObject
}

//check if two sprites are colliding
export function spritesAreColliding(rect1, rect2){
    // const rect1 = sprite1.getBounds()
    // const rect2 = sprite2.getBounds()
    let rect1Right = rect1.x + rect1.width
    let rect1Bottom = rect1.y + rect1.height
    let rect2Right = rect2.x + rect2.width
    let rect2Bottom = rect2.y + rect2.height
    return  rect1Right > rect2.x &&     // rect1's right edge is past rect2's left edge
            rect1.x < rect2Right &&     // rect1's left edge is before rect2's right edge
            rect1Bottom > rect2.y &&    // rect1's bottom edge is below rect2's top edge
            rect1.y < rect2Bottom;      // rect1's top edge is above rect2's bottom edge
}

//derive x and y for slicing tilemap png tiles
export function getXYSlice(tileId, rowWidth) {
    //rowWidth is the width of the tilesetPng that will be sliced from
    return {
        x: (tileId % rowWidth) * TILE_WIDTH, 
        y: Math.floor(tileId / rowWidth) * TILE_HEIGHT // Row index determines y
    };
}

//generate random number between min and max
export function randomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//generate seed for randomness
export function generateSeed(min = 0.5, max = 1.5) {
    // Generate a random decimal number between min and max
    return Math.random() * (max - min) + min;
}
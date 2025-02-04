import parse from "parse-svg-path"
import SAT from 'sat';
import { Point } from "pixi.js";
import { TILE_WIDTH, TILE_HEIGHT } from "./settings"


//parse map data from 1d array into 2d array 
export function parseMapData(mapData) {
    const parsedMapObject = {height: mapData.height, width: mapData.width}
    mapData.layers.forEach(layer => {
        if(layer.name != "objects"){
            parsedMapObject[layer.name] = []
            for(let i = 0; i < layer.data.length; i += layer.width){
                parsedMapObject[layer.name].push(layer.data.slice(i, layer.width + i))
            }
        }

        else if(layer.name === "npc_tiles"){
            parsedMapObject[layer.name] = []
            for(let i = 0; i < layer.data.length; i += layer.width){
                parsedMapObject[layer.name].push(layer.data.slice(i, layer.width + i))
            }
        }
        //every layer should have objects in an object layer called "objects"
        else{
            parsedMapObject.objects = []
            layer.objects.forEach(obj => {
                parsedMapObject.objects.push(obj)
            })
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

//generate either -1 or 1
export function getRandomSign() {
    return Math.random() < 0.5 ? -1 : 1;
}

//generate seed for randomness (holds up spork)
export function generateSeed(min = 0.5, max = 1.5) {
    // Generate a random decimal number between min and max
    return Math.random() * (max - min) + min;
}

/**
 * Checks if a point (playerX, playerY) is within an ellipse.
 * 
 * @param {number} playerX - X-coordinate of the player's position.
 * @param {number} playerY - Y-coordinate of the player's position.
 * @param {number} ellipseX - X-coordinate of the center of the ellipse.
 * @param {number} ellipseY - Y-coordinate of the center of the ellipse.
 * @param {number} ellipseRadiusX - Horizontal radius of the ellipse.
 * @param {number} ellipseRadiusY - Vertical radius of the ellipse.
 * @returns {boolean} True if the player is inside the ellipse, false otherwise.
 */
export function isPlayerInEllipse(playerX, playerY, ellipseX, ellipseY, ellipseRadiusX, ellipseRadiusY) {
    // console.log("DEBUGGING: ", playerX, playerY, ellipseX, ellipseY, )
    // Calculate the normalized position of the player relative to the ellipse
    const normX = (playerX - ellipseX) / ellipseRadiusX;
    const normY = (playerY - ellipseY) / ellipseRadiusY;

    // Check if the normalized distance is less than or equal to 1
    return (normX ** 2 + normY ** 2) <= 1;
}

/**
 * Checks if point is in circle. used for enemy vision radius/aggro system
 * 
 * @param {number} pointX - X coordinate of point to check
 * @param {number} pointY - Y coordinate of point to check
 * @param {number} centerX - X coordinate of circle center
 * @param {number} centerY - Y coordinate of circle center
 * @param {number} radius - radius of circle
 * @returns {boolean} true if point inside circle, false otherwise 
 */
export function isPointInCircle (pointX, pointY, centerX, centerY, radius){
    return (pointX - centerX) ** 2 + (pointY - centerY) ** 2 < (radius * radius)
}

export function getRandomDrop (enemyDrops){
    // Calculate total weight
    const totalChance = enemyDrops.reduce((sum, drop) => sum + drop.Chance, 0);

    // Generate a random number between 0 and totalChance
    const randomValue = Math.random() * totalChance;

    // Find the corresponding drop
    let cumulativeChance = 0;
    for (const drop of enemyDrops) {
        cumulativeChance += drop.Chance;
        if (randomValue <= cumulativeChance) {
            return drop;
        }
    }

    return null; // In case something goes wrong
};
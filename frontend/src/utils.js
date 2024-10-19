import parse from "parse-svg-path"
import { settings } from "./settings"

//parse map data from 1d array into 2d array 
export function parseMapData(mapData) {
    const parsedMapObject = {}
    mapData.layers.forEach(layer => {
        parsedMapObject[layer.name] = []
        for(let i = 0; i < layer.data.length; i += layer.width){
            parsedMapObject[layer.name].push(layer.data.slice(i, layer.width + i))
        }
    })
    return parsedMapObject
}
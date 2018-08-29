import {always} from './utils.js'

const tileSet = [
    {type: 'floor', solid: true},     // 0 -- key into TileMap.tiles
    {type: 'wall', solid: true},      // 1
    {type: 'backwall', solid: false}  // 2
]

const TileMap = (w, h, tSize, defaultTile=2) => ({
    w, h, tSize,
    tiles: Array.from({length: w * h}, always(defaultTile))
})

const get = (x, y, map) => {
    const t = tileSet[map.tiles[(y * map.w) + x]]
    if (typeof t === 'undefined')
        return {solid: true}
    return t
}

const set = (x, y, tile, map) => {
    map.tiles[(y * map.w) + x] = tile
}

const render = (tileMap, stage) => {
    for (let j = 0; j < tileMap.h; j++) {
        for (let i = 0; i < tileMap.w; i++) {
            const t = get(i, j, tileMap)
            switch (true) {
            case t.type === 'floor':
                stage.fillStyle = 'green'
                break;
            case t.type === 'wall':
                stage.fillStyle = 'red'
                break;
            case t.type === 'backwall':
                stage.fillStyle = 'blue'
                break;
            default:
                stage.fillStyle = 'pink'
                break;
            }
            stage.fillRect(i * tileMap.tSize, j * tileMap.tSize,
                           tileMap.tSize, tileMap.tSize)
        }
    }
}

export default {
    TileMap, get, set, render
}

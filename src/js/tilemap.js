import {always} from './utils.js'

const tileSet = [
    {type: 'floor', passable: false},   // 0 -- key into TileMap.tiles
    {type: 'wall', passable: false},    // 1
    {type: 'backwall', passable: true}  // 2
]

const TileMap = (w, h, tSize, defaultTile=2) => ({
    w, h, tSize,
    tiles: Array.from({length: w * h}, always(defaultTile))
})

const get = (x, y, map) => tileSet[map.tiles[y * map.h + x]]

const set = (x, y, tile, map) => {
    map.tiles[y * map.h + x] = tile
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
            }
            stage.fillRect(i * tileMap.tSize, j * tileMap.tSize,
                           tileMap.tSize, tileMap.tSize)
        }
    }
}

export default {
    TileMap, get, set, render
}

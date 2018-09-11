import {always} from './utils'

const tileSet = [
    {type: 'floor', solid: true},     // 0 -- key into TileMap.tiles
    {type: 'wall', solid: true},      // 1
    {type: 'backwall', solid: false}  // 2
]

const TileMap = (w, h, tSize, img, defaultTile=2) => ({
    w, h, tSize, img,
    tiles: Array.from({length: w * h}, always(defaultTile))
})

const get = (map, x, y) => {
    const t = tileSet[map.tiles[(y * map.w) + x]]
    if (typeof t === 'undefined')
        return {solid: true}
    return t
}

const set = (x, y, tile, map) => {
    map.tiles[(y * map.w) + x] = tile
}

const render = (tileMap, stage, camera) => {
    for (let j = 0; j < tileMap.h; j++) {
        for (let i = 0; i < tileMap.w; i++) {
            const t = get(tileMap, i, j)
            let sx = -1
            , sy = -1
            , tileX = (i * tileMap.tSize) - camera.x
            , tileY = (j * tileMap.tSize) - camera.y

            if (tileX < -tileMap.tSize ||
                tileY < -tileMap.tSize ||
                tileX > 200 ||
                tileY > 105)
                continue

            switch (true) {
            case t.type === 'floor':
                sx = 0
                sy = 1
                break;
            case t.type === 'wall':
                sx = 2
                sy = 1
                break;
            case t.type === 'backwall':
                sx = 1
                sy = 1
                break;
            default:
                sx = 1
                sy = 3
                break;
            }
            stage.drawImage(tileMap.img,
                            sx * tileMap.tSize,
                            sy * tileMap.tSize,
                            tileMap.tSize, tileMap.tSize,
                            tileX, tileY,
                            tileMap.tSize, tileMap.tSize)
        }
    }
}

export default {
    TileMap, get, set, render
}

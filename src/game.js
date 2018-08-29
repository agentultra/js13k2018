import {btn} from './js/controls.js'
import {loadLevel} from './js/loaders/level.js'
import {Player} from './js/player.js'
import tilemap from './js/tilemap.js'

const canvas = document.getElementById('stage')
, stage = canvas.getContext('2d')
, stageW = 800
, stageH = 420

canvas.width = stageW
canvas.height = stageH

let currentTime = 0
, lastTime = (new Date()).getTime()
, dt = 0
, fps = 60
, interval = fps / 1000
, state = {}

const clr = () => {
    stage.fillStyle = 'black'
    stage.fillRect(0, 0, stageW, stageH)
}

const initTileMap = tmap => {
    const m = tilemap.TileMap(tmap.w, tmap.h, tmap.tSize, 99)
    for (const bg of tmap.backgrounds) {
        for (let i = bg.x1; i <= bg.x2; i++) {
            for (let j = bg.y1; j <= bg.y2; j++) {
                tilemap.set(i, j, bg.type, m)
            }
        }
    }
    for (const w of tmap.walls) {
        for (let i = w.x1; i <= w.x2; i++) {
            for (let j = w.y1; j <= w.y2; j++) {
                tilemap.set(i, j, w.type, m)
            }
        }
    }
    return m
}

const init = initialLevel => Object.assign(state, {
    gravity: 0.3,
    plyr: Player(stageW / 2, stageH / 2, 0, 2),
    tileMap: initTileMap(initialLevel.tilemap),
    velLimit: {x: 2, y: 16}
})

const update = dt => {
    const {plyr, gravity, tileMap, velLimit} = state

    // update the player
    plyr.dx =
        btn('Left')
        ? -plyr.moveSpeed.x
        : btn('Right')
        ? plyr.moveSpeed.x
        : 0

    if (btn('Up') && plyr.canJump) {
        plyr.dy = -plyr.moveSpeed.y
        plyr.canJump = false
    }

    // move the player
    const testX  = plyr.x + plyr.dx
    ,     testY  = plyr.y + plyr.dy
    ,     offset = Math.round((tileMap.tSize / 2) - 1)
    ,     tile   = tilemap.get(
        Math.round(plyr.x / tileMap.tSize),
        Math.round(plyr.y / tileMap.tSize),
        tileMap
    )

    plyr.dy += gravity

    const testYTop    = Math.floor(testY / tileMap.tSize)
    ,     testYBottom = Math.ceil(testY / tileMap.tSize)
    ,     yNear1      = Math.round((plyr.y - offset) / tileMap.tSize)
    ,     yNear2      = Math.round((plyr.y + offset) / tileMap.tSize)
    ,     testXLeft   = Math.floor((testX / tileMap.tSize))
    ,     testXRight  = Math.ceil((testX / tileMap.tSize))
    ,     xNear1      = Math.round((plyr.x - offset) / tileMap.tSize)
    ,     xNear2      = Math.round((plyr.x + offset) / tileMap.tSize)
    ,     top1Tile    = tilemap.get(xNear1, testYTop, tileMap)
    ,     top2Tile    = tilemap.get(xNear2, testYTop, tileMap)
    ,     bottom1Tile = tilemap.get(xNear1, testYBottom, tileMap)
    ,     bottom2Tile = tilemap.get(xNear2, testYBottom, tileMap)
    ,     left1Tile   = tilemap.get(testXLeft, yNear1, tileMap)
    ,     left2Tile   = tilemap.get(testXLeft, yNear2, tileMap)
    ,     right1Tile  = tilemap.get(testXRight, yNear1, tileMap)
    ,     right2Tile  = tilemap.get(testXRight, yNear2, tileMap)

    plyr.dx = Math.min(Math.max(plyr.dx, -velLimit.x), velLimit.x)
    plyr.dy = Math.min(Math.max(plyr.dy, -velLimit.y), velLimit.y)
    plyr.x += plyr.dx
    plyr.y += plyr.dy
    plyr.dx *= 0.7

    if (left1Tile.solid || left2Tile.solid || right1Tile.solid || right2Tile.solid) {
        while (tilemap.get(Math.floor(plyr.x / tileMap.tSize), yNear1, tileMap).solid ||
               tilemap.get(Math.floor(plyr.x / tileMap.tSize), yNear2, tileMap).solid)
            plyr.x += 0.1

        while (tilemap.get(Math.ceil(plyr.x / tileMap.tSize), yNear1, tileMap).solid ||
               tilemap.get(Math.ceil(plyr.x / tileMap.tSize), yNear2, tileMap).solid)
            plyr.x -= 0.1

        plyr.dx = 0
    }

    if (top1Tile.solid || top2Tile.solid || bottom1Tile.solid || bottom2Tile.solid) {
        while (tilemap.get(xNear1, Math.floor(plyr.y / tileMap.tSize), tileMap).solid ||
               tilemap.get(xNear2, Math.floor(plyr.y / tileMap.tSize), tileMap).solid)
            plyr.y += 0.1

        while (tilemap.get(xNear1, Math.ceil(plyr.y / tileMap.tSize), tileMap).solid ||
               tilemap.get(xNear2, Math.ceil(plyr.y / tileMap.tSize), tileMap).solid)
            plyr.y -= 0.1

        plyr.dy = 0

        if (bottom1Tile.solid || bottom2Tile.solid) {
            plyr.onFloor = true
            plyr.canJump = true
        } else {
            plyr.onFloor = false
            plyr.canJump = false
        }
    }
}

const render = () => {
    const {plyr, tileMap} = state
    tilemap.render(tileMap, stage)
    stage.fillStyle = 'white'
    stage.fillRect(plyr.x, plyr.y, plyr.w, plyr.h)
}

const loop = dt => {
    window.requestAnimationFrame(loop)
    currentTime = (new Date()).getTime()
    dt = currentTime - lastTime
    update(dt)

    if (dt > interval) {
        clr()
        render()
        lastTime = currentTime - (dt % interval)
    }
}

Promise.all([
    loadLevel('1-1')
]).then(([lvl]) => {
    init(lvl)
    window.requestAnimationFrame(loop)
})

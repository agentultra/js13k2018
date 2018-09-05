import {btn, btnh, pumpEvents, getButtons} from './js/controls.js'
import {loadLevel} from './js/loaders/level.js'
import {Player} from './js/player.js'
import tilemap from './js/tilemap.js'

const canvas = document.getElementById('stage')
, stage = canvas.getContext('2d')
, stageW = 800
, stageH = 420
, states = {
    TITLE: 0,
    LEVEL_TITLE: 1,
    LEVEL: 2
}

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

const init = level => Object.assign(state, {
    gameState: states.TITLE,
    ticks: 0,
    gravity: 0.4,
    plyr: Player(level.start[0] * level.tilemap.tSize,
                 level.start[1] * level.tilemap.tSize,
                 0, 2),
    tileMap: initTileMap(level.tilemap),
    velLimit: {x: 2, y: 8}
})

const startLevel = level => Object.assign(state, {
    gameState: states.LEVEL_TITLE,
    plyr: Player(level.start[0] * level.tilemap.tSize,
                 level.start[1] * level.tilemap.tSize,
                 0, 2),
    tileMap: initTileMap(level.tilemap)
})

const update = dt => {
    const {gameState} = state
    if (gameState === states.LEVEL) {
        updateLevel(dt)
    } else if (gameState === states.LEVEL_TITLE) {
        updateLevelTitle(dt)
    } else if (gameState === states.TITLE) {
        updateTitle(dt)
    }
    state.ticks++
}

const updateLevel = dt => {
        const {plyr, gravity, tileMap, velLimit, gameState} = state

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
        tileMap,
        Math.round(plyr.x / tileMap.tSize),
        Math.round(plyr.y / tileMap.tSize)
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
    ,     top1Tile    = tilemap.get(tileMap, xNear1, testYTop)
    ,     top2Tile    = tilemap.get(tileMap, xNear2, testYTop)
    ,     bottom1Tile = tilemap.get(tileMap, xNear1, testYBottom)
    ,     bottom2Tile = tilemap.get(tileMap, xNear2, testYBottom)
    ,     left1Tile   = tilemap.get(tileMap, testXLeft, yNear1)
    ,     left2Tile   = tilemap.get(tileMap, testXLeft, yNear2)
    ,     right1Tile  = tilemap.get(tileMap, testXRight, yNear1)
    ,     right2Tile  = tilemap.get(tileMap, testXRight, yNear2)

    plyr.dx = Math.min(Math.max(plyr.dx, -velLimit.x), velLimit.x)
    plyr.dy = Math.min(Math.max(plyr.dy, -velLimit.y), velLimit.y)
    plyr.x += plyr.dx
    plyr.y += plyr.dy
    plyr.dx *= 0.7

    if (left1Tile.solid || left2Tile.solid || right1Tile.solid || right2Tile.solid) {
        while (tilemap.get(tileMap, Math.floor(plyr.x / tileMap.tSize), yNear1).solid ||
               tilemap.get(tileMap, Math.floor(plyr.x / tileMap.tSize), yNear2).solid)
            plyr.x += 0.1

        while (tilemap.get(tileMap, Math.ceil(plyr.x / tileMap.tSize), yNear1).solid ||
               tilemap.get(tileMap, Math.ceil(plyr.x / tileMap.tSize), yNear2).solid)
            plyr.x -= 0.1

        plyr.dx = 0
    }

    if (top1Tile.solid || top2Tile.solid || bottom1Tile.solid || bottom2Tile.solid) {
        while (tilemap.get(tileMap, xNear1, Math.floor(plyr.y / tileMap.tSize)).solid ||
               tilemap.get(tileMap, xNear2, Math.floor(plyr.y / tileMap.tSize)).solid)
            plyr.y += 0.1

        while (tilemap.get(tileMap, xNear1, Math.ceil(plyr.y / tileMap.tSize)).solid ||
               tilemap.get(tileMap, xNear2, Math.ceil(plyr.y / tileMap.tSize)).solid)
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
    if (btn('Action')) {
        state.gameState = states.TITLE
    }
}

const updateLevelTitle = dt => {
    if (btnh('Action', 100))
        state.gameState = states.LEVEL
}

const updateTitle = dt => {
    if (btnh('Action', 3))
        state.gameState = states.LEVEL_TITLE
}

const render = () => {
    const {plyr, tileMap, gameState} = state
    if (gameState === states.LEVEL) {
        renderLevel()
    } else if (gameState === states.LEVEL_TITLE) {
        renderLevelTitle()
    } else if (gameState === states.TITLE) {
        renderTitle()
    }

    const btns = getButtons()
    , bs = Object.values(btns)
    stage.fillStyle = 'white'
    for (let i = 0; i < Object.keys(btns).length; i++) {
        stage.fillText(JSON.stringify(bs[i]), 10, 70 + (i * 12))
    }
}

const renderLevel = () => {
    const {plyr, tileMap} = state
    tilemap.render(tileMap, stage)
    stage.fillStyle = 'white'
    stage.fillRect(plyr.x, plyr.y, plyr.w, plyr.h)
}

const renderLevelTitle = () => {
    stage.fillStyle = 'white'
    stage.fillText('Hello', 10, 50)
}

const renderTitle = () => {
    stage.fillStyle = 'white'
    stage.fillText('Offline', 10, 50)
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

    pumpEvents()
}

Promise.all([
    loadLevel('1-1'),
    loadLevel('1-2')
]).then(lvls => {
    init(lvls[0])
    state.levels = lvls
    window.requestAnimationFrame(loop)
})

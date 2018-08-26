import {Player} from './js/player.js'

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

const init = () => Object.assign(state, {
    gravity: 0.3,
    plyr: Player(stageW / 2, stageH / 2, 2, 2)
})

const update = dt => {
    const {plyr, gravity} = state
    plyr.dy += gravity

    if (((plyr.y + plyr.h * 2) >= stageH) || plyr.y <= 0)
        plyr.dy = 0

    plyr.x += plyr.dx
    plyr.y += plyr.dy
}

const render = () => {
    const {plyr} = state
    stage.fillStyle = 'white'
    stage.fillRect(plyr.x, plyr.y, plyr.w, plyr.h)
}

const loop = () => {
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

init()
window.requestAnimationFrame(loop)

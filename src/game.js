import {btn} from './js/controls.js'
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
    plyr: Player(stageW / 2, stageH / 2, 0, 2)
})

const update = dt => {
    const {plyr, gravity} = state
    plyr.dy += gravity

    if ((Math.round(plyr.y + plyr.dy + plyr.h) >= stageH) || plyr.y <= 0) {
        plyr.dy = 0
        plyr.canJump = true
    }

    if (btn('Left')) {
        plyr.dx = -plyr.moveSpeed.x
    } else if (btn('Right')) {
        plyr.dx = plyr.moveSpeed.x
    } else {
        plyr.dx *= 0.7
    }

    if (btn('Up')) {
        if (plyr.canJump) {
            plyr.dy = -plyr.moveSpeed.y
            plyr.canJump = false
        }
    }
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

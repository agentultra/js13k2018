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
    ball: {x: stageW / 2, y: stageH / 2, dx: 1, dy: 1}
})

const update = dt => {
    const {ball} = state
    ball.x += ball.dx
    ball.y += ball.dy

    if (ball.x < 0 || ball.x > stageW)
        ball.dx = -ball.dx

    if (ball.y < 0 || ball.y > stageH)
        ball.dy = -ball.dy
}

const render = () => {
    const {ball} = state
    stage.fillStyle = 'white'
    stage.fillRect(0, 0, 10, 10)
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

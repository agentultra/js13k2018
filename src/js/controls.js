const buttons = {
    Up: {held: 0, frames: 0},
    Down: {held: 0, frames: 0},
    Left: {held: 0, frames: 0},
    Right: {held: 0, frames: 0},
    Action: {held: 0, frames: 0}
}

export const btn = name => buttons.hasOwnProperty(name) && buttons[name].held
export const btnh = (name, frames) =>
    buttons.hasOwnProperty(name) &&
    buttons[name].held &&
    buttons[name].frames >= frames
export const getButtons = () => buttons

export const pumpEvents = () => {
    for (let b of Object.values(buttons)) {
        if (b.held) b.frames++
//        b.frames = 0
    }
}

document.addEventListener('keydown', ev => {
    if (ev.key === 'w') {
        buttons.Up.held = 1
    } else if (ev.key === 's') {
        buttons.Down.held = 1
    } else if (ev.key === 'a') {
        buttons.Left.held = 1
    } else if (ev.key === 'd') {
        buttons.Right.held = 1
    } else if (ev.key === ' ') {
        buttons.Action.held = 1
    }
})

document.addEventListener('keyup', ev => {
    if (ev.key === 'w') {
        buttons.Up.held = 0
        buttons.Up.frames = 0
    } else if (ev.key === 's') {
        buttons.Down.held = 0
        buttons.Down.frames = 0
    } else if (ev.key === 'a') {
        buttons.Left.held = 0
        buttons.Left.frames = 0
    } else if (ev.key === 'd') {
        buttons.Right.held = 0
        buttons.Right.frames = 0
    } else if (ev.key === ' ') {
        buttons.Action.held = 0
        buttons.Action.frames = 0
    }
})

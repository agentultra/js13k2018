const buttons = {
    Up: 0,
    Down: 0,
    Left: 0,
    Right: 0,
    Action: 0
}

export const btn = name => buttons.hasOwnProperty(name) && buttons[name]

document.addEventListener('keydown', ev => {
    if (ev.key === 'w') {
        buttons.Up = 1
    } else if (ev.key === 's') {
        buttons.Down = 1
    } else if (ev.key === 'a') {
        buttons.Left = 1
    } else if (ev.key === 'd') {
        buttons.Right = 1
    } else if (ev.key === ' ') {
        buttons.Action = 1
    }
})

document.addEventListener('keyup', ev => {
    if (ev.key === 'w') {
        buttons.Up = 0
    } else if (ev.key === 's') {
        buttons.Down = 0
    } else if (ev.key === 'a') {
        buttons.Left = 0
    } else if (ev.key === 'd') {
        buttons.Right = 0
    } else if (ev.key === ' ') {
        buttons.Action = 0
    }
})

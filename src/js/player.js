export const Player = (x, y, dx=0, dy=0) => ({
    x, y, dx, dy,
    w: 16, h: 16,
    anims: {
        walking: [1, 2, 3, 3],
        standing: [0]
    },
    moveSpeed: {x: 2, y: 10},
    onFloor: false,
    canJump: false
})

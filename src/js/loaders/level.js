export const loadLevel = name =>
    fetch(`assets/levels/${name}.json`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())

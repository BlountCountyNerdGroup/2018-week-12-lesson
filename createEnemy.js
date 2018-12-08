var enemyShipBody = {
    color: '#ff0000',

    // relative to ship's position
    shape: [
        Point(0, 0),
        Point(0, 30),
        Point(30, 15)
    ]
}

// this is the player's ship
var enemy = getShip(mainShipBody);

function enemyLoop() {
    enemy.accelerate();

    enemy.move();
}
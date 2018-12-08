var shootPattern = [];

function getBullet(x, y, angle) {
    var bullet = {
        position: {
            x: x,
            y: y
        },
        velocity: 500,
        angle: angle,
        physicsLoop() {
            ctx.fillStyle = "green";
            ctx.fillRect(this.position.x, this.position.y, 10, 10);
        }
    }

    return bullet;
}

function addToShootPattern(x, y, angle) {
    shootPattern.push({
        x, y, angle
    });
}

function shoot(shootPattern) {
    for (var bullet of shootPattern) {
        launch(getBullet(bullet.x, bullet.y, bullet.angle));
    }
}

addEventListener('keydown', function(e) {
    if (e.keyCode == 32) {
        shoot(shootPattern);
    }
});

addToShootPattern(0, 0, 30);
addToShootPattern(0, 0, -30);
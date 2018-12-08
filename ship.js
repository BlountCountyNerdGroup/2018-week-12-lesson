var keysDown = [];

var keys = {
    up: 38,
    down: 40,
    left: 37,
    right: 39
}

function getShip(shipBody) {
    if (isValidShipBody(shipBody)) {
        var ship = {
            x: 50,
            y: 50,
            vx: 0,
            vy: 0,
            ax: 0,
            ay: 0,
            angle: 0, // completely horizontal, in degrees
            body: shipBody,
            hasNotReceivedAbsPos: true,
            health: initialHealth,

            /** @returns `Point[]` */
            getBody() { // defines black triangle
                var radianAngle = getRelativeRadAngle(this.angle);

                // translates bodyShape according to current ship x and y
                var bodyShapeTranslation = this.body.shape.map((pt) => Point(pt.x + this.x, pt.y + this.y));

                // gets avg x and avg y
                var origin = averagePts(bodyShapeTranslation);

                // transform initial points based on angle
                bodyShape = rotatePoints(origin, bodyShapeTranslation, radianAngle);

                return bodyShape;
            },
            move() {
                var translatedBody = this.getBody();
                fillShape(translatedBody, this.body.color);
            },
            accelerate() {
                var angle = getRelativeRadAngle(this.angle);

                ship.ax = SHIP_ACCELERATION * Math.cos(angle);
                ship.ay = SHIP_ACCELERATION * -Math.sin(angle);
            },
            deccelerate() {
                var angle = getRelativeRadAngle(this.angle);

                ship.ax = -SHIP_ACCELERATION * Math.cos(angle);
                ship.ay = -SHIP_ACCELERATION * -Math.sin(angle);
            }
        }

        return ship;
    } else {
        console.error('shipBody is not valid. Does shipBody have a color and shape?');

        return undefined;
    }
}

/** argument ship needs two properties: "color" and "shape" (an array of points) */
function isValidShipBody(ship) {
    var hasColor = ship.hasOwnProperty('color');
    var hasBodyShape = ship.hasOwnProperty('shape');

    return hasColor && hasBodyShape;
}

function updateShip() {
    // update acceleration
    if (keysDown.indexOf(keys.down) == -1 && keysDown.indexOf(keys.up) == -1) {
        ship.ax = 0;
        ship.ay = 0;
    }

    for (var keyCode of keysDown) {
        if (keyCode == keys.up) { 
            ship.accelerate();
        } 
        
        // if you want to add backwards thrust, uncomment
        if (ALLOW_BACKWARDS_MOVEMENT) {
            if (keyCode == keys.down) {
                ship.deccelerate();
            }
        }
        
        if (keyCode == keys.right) {  
            ship.angle += 3;
        } else if (keyCode == keys.left) {
            ship.angle -= 3;
        }
    }

    ship.vy += -ship.ay; // negative to invert javascript's positive down direction
    ship.vx += ship.ax;
    
    ship.x += ship.vx;
    ship.y += ship.vy;

    // move ship to other side of screen of ship goes off one side of screen
    var outOfBounds = isOutOfBounds(ship.x, ship.y, canvas.width, canvas.height)

    if (outOfBounds.x) {
        ship.x = window.innerWidth - ship.x;
    }
    if (outOfBounds.y) {
        ship.y = window.innerHeight - ship.y;
    }

    // don't want decimals because harder to process
    ship.x = Math.floor(ship.x);
    ship.y = Math.floor(ship.y);

    ship.move();
}

// add keys not already in keysDown to keysDown when pressed
addEventListener('keydown', function(e) {
    var index = keysDown.indexOf(e.keyCode);
    var notAlreadyInArray = index == -1;

    if (notAlreadyInArray) {
        if (e.keyCode == keys.left || e.keyCode == keys.right || e.keyCode == keys.up || e.keyCode == keys.down) {
            keysDown.push(e.keyCode);
        }
    }
});

// remove key from keysDown on keyup
addEventListener('keyup', function(e) {
    var index = keysDown.indexOf(e.keyCode);

    if (index != -1) {
        keysDown.splice(index, 1);
    }
})
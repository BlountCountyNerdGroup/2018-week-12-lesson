function isLaunchableObject(launchableObject) {
    var hasPosition = launchableObject.hasOwnProperty('position');

    if (hasPosition) {
        var position = launchableObject.position;
        if (!(position.hasOwnProperty('x') && position.hasOwnProperty('y'))) {
            console.error("Oops! Your position object doesn't have x and y properties");
        }
    }

    var hasVelocity = launchableObject.hasOwnProperty('velocity');
    var hasAngle = launchableObject.hasOwnProperty('angle');
    var hasPhysicsLoop = launchableObject.hasOwnProperty('physicsLoop');

    return hasPosition && hasVelocity && hasAngle && hasPhysicsLoop;
}

function launch(launchableObject) {
    if (isLaunchableObject(launchableObject)) {
        launchableObject.hasNotBeenGivenAbsPos = true;
        launchableObjects.push(launchableObject);
    } else {
        console.error('Your object does not have all the necessary properties of a launchable object (position, velocity, angle, physicsLoop).');
    }
}

function updateLaunchableObjects(launchableObjects, deltaTime) {
    // we don't want to change the length of launchableObjects in the loops, so we'll splice them after the for loop
    var toSplice = [];
    
    for (var i = 0; i < launchableObjects.length; i++) {
        var radians = getRelativeRadAngle(launchableObjects[i].angle);
        var vx = launchableObjects[i].velocity * Math.cos(radians);
        var vy = launchableObjects[i].velocity * -Math.sin(radians);

        vx *= deltaTime;
        vy *= deltaTime;

        // give launchable object absolute position based on the relative position to the ship it gave us
        if (launchableObjects[i].hasNotBeenGivenAbsPos) giveLaunchableObjectAbsPos(launchableObjects[i], ship);

        var offScreen = isOutOfBounds(launchableObjects[i].position.x, launchableObjects[i].position.y, canvas.width, canvas.height, 50, 50);

        if (offScreen.x || offScreen.y) {
            toSplice.push(i);
        } else {
            updatePhysics(launchableObjects[i], vx, vy);
        }

        // clear drawing queue to relieve lag
        ctx.beginPath();
    }

    // counts down because we want to splice from the end of the array first to not mess up the indicies
    for (var i = toSplice.length; i > 0; i--) {
        launchableObjects.splice(toSplice[i], 1);
    }
}

function giveLaunchableObjectAbsPos(launchableObject, ship) {    
    launchableObject.hasNotBeenGivenAbsPos = false;

    launchableObject.position.x += ship.x;
    launchableObject.position.y += ship.y;
}

function updatePhysics(launchableObject, vx, vy) {
    launchableObject.position.x += vx;
    launchableObject.position.y += vy;
    
    launchableObject.physicsLoop();
}

function getLaunchableObjects() {
    return launchableObjects;
}

var launchableObjects = [];
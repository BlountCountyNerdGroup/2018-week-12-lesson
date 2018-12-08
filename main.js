var then = Date.now();
var now;
var FPS_INTERVAL_MILLIS = 1000 / FPS;

function animate() {
    now = Date.now();
    elapsedMillis = now - then;

    if (elapsedMillis > FPS_INTERVAL_MILLIS) {
        then = now;
        var deltaTime = elapsedMillis / 1000;
        // console.log("FPS: " + (1000 / elapsedMillis));

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw background
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // do all blob related processing/drawing
        processBlobs(blobs, deltaTime);

        // do all launchable object (only rockets as of now) processing/drawing 
        updateLaunchableObjects(getLaunchableObjects(), deltaTime, ship);

        // move ship with keyboard input
        updateShip();

        // update health bar
        healthLoop();

        // make sure the past function doesn't interfere with the next
        ctx.beginPath();

        moveHealthPowerup();
    } 

    // call this function again ASAP
    requestAnimationFrame(animate);
}

animate();
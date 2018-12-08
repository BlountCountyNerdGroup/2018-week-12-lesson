var blobs = [];

for (var i = 0; i < NUM_OF_BLOBS; i++) {
    blobs.push(getNewBlob());
}

function getRandomRect() {
    return {
        type: 'rect',
        width: getRandInt(15, 30),
        height: getRandInt(15, 30),
        relativeX: getRandInt(-20, 20),
        relativeY: getRandInt(-20, 20)
    }
}

function getRandomCircle() {
    return {
        type: 'circle',
        radius: getRandInt(15, 30),
        relativeX: getRandInt(-20, 20),
        relativeY: getRandInt(-20, 20)
    }
}

// returns new random blob object
function getNewBlob() {
    var blob = {
        centerX: getRandInt(0, canvas.width),
        centerY: getRandInt(0, canvas.height),
        vx: getRandInt(-3, 3) * 50,
        vy: getRandInt(-3, 3) * 50,
        data: [],
        // returns index of shape that was hit or -1 if not hit
        getIndexOfHitShape(bulletPos) {
            for (var i = 0; i < this.data.length; i++) {
                var shape = this.data[i];
                var absoluteX = this.centerX + shape.relativeX;
                var absoluteY = this.centerY + shape.relativeY;

                if (shape.type == 'circle') {
                    if (getDistBetween(bulletPos, {x: absoluteX, y: absoluteY}) <= shape.radius) {
                        return i;
                    }
                } 
                if (shape.type == 'rect') {
                    // check x
                    if (bulletPos.x > absoluteX && bulletPos.x < absoluteX + shape.width) {
                        // check y
                        if (bulletPos.y > absoluteY && bulletPos.y < absoluteY + shape.height) {
                            return i;
                        }
                    }
                }
            }

            return -1;
        }
    };

    var numOfShapesPerBlob = getRandInt(3, 8)
    for (let i = 0; i < numOfShapesPerBlob; i++) {
        if (Math.random() > .5) blob.data.push(getRandomRect());
        else blob.data.push(getRandomCircle());
    }

    return blob;
}

function drawBlob(blob) {
    ctx.fillStyle = ASTEROID_COLOR;
    
    for (var i=0; i < blob.data.length; i++) {
        ctx.beginPath();

        var absoluteX = blob.centerX + blob.data[i].relativeX;
        var absoluteY = blob.centerY + blob.data[i].relativeY;

        var currentBlob = blob.data[i];

        if (currentBlob.type == 'rect') {
            ctx.rect(absoluteX, absoluteY, currentBlob.width, currentBlob.height);
        } else if (currentBlob.type == 'circle') {
            ctx.arc(absoluteX, absoluteY, currentBlob.radius, 0, Math.PI * 2)
        }

        ctx.fill();
    }
}

// deletes individual shape of an asteroid "blob"
function deleteBlobIfHit(blob, bulletPos) {
    var indexOfHitShape = blob.getIndexOfHitShape(bulletPos);

    if (indexOfHitShape != -1) {
        if (blob.data.length == 1) blobs.splice(i, 1);
        else blob.data.splice(indexOfHitShape, 1);
    }

    // now see if lower right is hitting
    indexOfHitShape = blob.getIndexOfHitShape({x: bulletPos.x + 50, y: bulletPos.y + 50});

    if (indexOfHitShape != -1) {
        if (blob.data.length == 1) blobs.splice(i, 1);
        else blob.data.splice(indexOfHitShape, 1);
    }
}

/** @returns boolean `shipHit` */
function checkIfShipHitBlob(blob, indexWithinBlobs) {
    var shipHit = false;
    var shipShape = ship.getBody();

    // checks each vertex of our ship for collision. Not efficient or super accurate, but it works
    for (var i = 0; i < shipShape.length; i++) {
        var shipVertex = Point(shipShape[i].x, shipShape[i].y);
        var indexOfHitShape = blob.getIndexOfHitShape(shipVertex);

        if (indexOfHitShape != -1) {
            shipHit = true;

            // delete blob
            if (blob.data.length == 1) blobs.splice(indexWithinBlobs, 1);
            else blob.data.splice(indexOfHitShape, 1);

            break;
        }
    }

    return shipHit;
}

function updateBlobMovement(blob, deltaTime) {
    blob.centerX += blob.vx * deltaTime;
    blob.centerY += blob.vy * deltaTime;

    blob.centerX = Math.floor(blob.centerX);
    blob.centerY = Math.floor(blob.centerY);

    var outOfBounds = isOutOfBounds(blob.centerX, blob.centerY, canvas.width, canvas.height, 50, 50);

    if (outOfBounds.x) {
        blob.centerX = window.innerWidth - blob.centerX;
    }

    if (outOfBounds.y) {
        blob.centerY = window.innerHeight - blob.centerY;
    }
}

function processBlobs(blobs, deltaTime) {
    for (var i = 0; i < blobs.length; i++) {
        var blob = blobs[i];

        updateBlobMovement(blob, deltaTime);

        if (checkIfShipHitBlob(blob, i)) {
            ship.health -= ASTEROID_DAMAGE;
        }

        var launchableObjects = getLaunchableObjects(); // breaks the game here
        for (var j = 0; j < launchableObjects.length; j++) {
            var bulletPos = launchableObjects[j].position;
            deleteBlobIfHit(blob, bulletPos);
        }

        drawBlob(blob);
    }
}
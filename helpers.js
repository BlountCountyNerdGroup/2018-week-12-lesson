// min [inclusive], max [inclusive]
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDistBetween(pt1, pt2) {
    var dist = Math.sqrt((pt1.x - pt2.x)**2 + (pt1.y - pt2.y)**2);
    return dist;
}

function isOutOfBounds(x, y, width, height, extraX = 0, extraY = 0) {
    var offLeft = x <= (0 - extraX);
    var offRight = x >= (width + extraX);
    var offTop = y <= (0 - extraY);
    var offBottom = y >= (height + extraY);

    return {
        x: offLeft || offRight,
        y: offTop || offBottom
    }
}

function rotatePoints(origin, pts, radianAngle) {
    for (var prop in pts) {
        var angledX = origin.x + (Math.cos(radianAngle) * (pts[prop].x - origin.x) - Math.sin(radianAngle) * (pts[prop].y - origin.y));
        var angledY = origin.y + (Math.cos(radianAngle) * (pts[prop].y - origin.y) + Math.sin(radianAngle) * (pts[prop].x - origin.x));

        pts[prop] = Point(angledX, angledY);
    }

    return pts;
}

function Point(x, y) {
    return {
        x: x,
        y: y
    }
}

function getRelativeRadAngle(degrees) {
    // keep angle within range [0, 360]
    var relativeAngle = degrees % 360;

    // redefine in terms of degrees
    var radianAngle = relativeAngle * (Math.PI / 180);

    return radianAngle;
}

function fillShape(bodyShape, color='#000000') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(bodyShape[0].x, bodyShape[0].y);

    for (var i = 0; i < bodyShape.length; i++) {
        ctx.lineTo(bodyShape[i].x, bodyShape[i].y);
    }

    ctx.fill();
    ctx.fillStyle = '#000000';
}

// get avg x and avg y of n points
function averagePts(points) {
    var xSum = 0;
    var ySum = 0;

    for (var i = 0; i < points.length; i++) {
        xSum += points[i].x;
        ySum += points[i].y;
    }

    var xAvg = xSum / points.length;
    var yAvg = ySum / points.length;

    return Point(xAvg, yAvg);
}
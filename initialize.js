var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var FPS = 40;

var BACKGROUND_COLOR = '#000000';
var ASTEROID_COLOR = '#b9c0cc';

var NUM_OF_BLOBS = 20;

var SHIP_ACCELERATION = .2; // pixels per second
var ALLOW_BACKWARDS_MOVEMENT = false;

var initialHealth = 100;
var ASTEROID_DAMAGE = 5;
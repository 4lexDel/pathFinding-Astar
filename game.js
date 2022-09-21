import { PathFinding } from "./lib/PathFinding.js";
import { TileMap } from "./TileMap.js";
import { getHeight, getWidth } from "/utils.js";

var canvas = document.getElementById('gameCanvas');

var MOUSE_X = 0;
var MOUSE_Y = 0;

var WIDTH = 9 * getWidth() / 10;
var HEIGHT = 9 * getHeight() / 10;

canvas.width = WIDTH;
canvas.height = HEIGHT;

function resizeWindow() {
    WIDTH = 9 * getWidth() / 10;
    HEIGHT = 9 * getHeight() / 10;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}

console.log("WIDTH : " + canvas.clientWidth + " - HEIGHT : " + canvas.clientHeight);


/**------------------------------------------------------------------------------------------ */

var ctx = canvas.getContext("2d");

/**------------------------------------------------------------------------------------------ */

var map = new TileMap(50, WIDTH, HEIGHT);
var mapDecoration = new TileMap(50, WIDTH, HEIGHT, 1000);

var start = {
    x: 0,
    y: 0
}


var finish = {
    x: map.nbSquareX - 1,
    y: map.nbSquareY - 1
}

var brushId = true; //ID AJOUTE A LA MAP

mapDecoration.writeSpecialPoint(start.x, start.y, 10);
mapDecoration.writeSpecialPoint(finish.x, finish.y, 20);

test();
draw();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    map.display(ctx);
    mapDecoration.display(ctx);

    window.requestAnimationFrame(draw);
}

function test() {
    let pathfinding = new PathFinding(start, finish, map.grid);

    let result = pathfinding.process();
    if (result != null) {
        result.pathList.shift();
        //console.log(path);
        mapDecoration.writelist(result.openList, -3);
        mapDecoration.writelist(result.closeList, -4);
        mapDecoration.writelist(result.pathList, -2);
    }
}

/**------------------------------------------------------------------- */

canvas.onclick = (e) => { //MOUSE CLICK
    var mouse = getMousePos(canvas, e);

    let val = -1;
    if (!brushId) val = 1;

    if (e.which == 1) map.updateGrid(mouse, val);
    else map.updateGrid(mouse, 0);
    test();
}

canvas.addEventListener("mousemove", (e) => {
    let topPosY = canvas.offsetTop;
    let leftPosX = canvas.offsetLeft;

    var mouse = {
            x: e.clientX - leftPosX,
            y: e.clientY - topPosY
        }
        //console.log("x : " + mouse.x + " y : " + mouse.y);

    MOUSE_X = mouse.x;
    MOUSE_Y = mouse.y;
})

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var startDrag = false;

canvas.onmousedown = (e) => {
    var mouse = getMousePos(canvas, e);
    startDrag = true;

    // console.log("A");
    // console.log(e.which);
}

canvas.onmousemove = (e) => {
    if (startDrag) {
        var mouse = getMousePos(canvas, e);

        let val = -1;
        if (!brushId) val = 1;

        if (e.which == 1) map.updateGrid(mouse, val);
        else map.updateGrid(mouse, 0);
        test();
    }
}

canvas.onmouseup = (e) => {
    if (startDrag) {
        startDrag = false;
        var mouse = getMousePos(canvas, EventSource);

        //console.log("x : " + mouse.x + " y : " + mouse.y);
        // console.log("C");
        // console.log(e.which);
    }
}

document.addEventListener("keyup", function(e) { //KEYBOARD EVENT
    // console.log(e.key);

    switch (e.key) {
        case "Enter":
            test();
            break;

        case "r":
            map.resetGrid();
            mapDecoration.resetGridById(-2);
            mapDecoration.resetGridById(-3);
            mapDecoration.resetGridById(-4);
            break;

        case "a":
            let xa = parseInt(MOUSE_X / map.dx);
            let ya = parseInt(MOUSE_Y / map.dy);

            mapDecoration.writeSpecialPoint(xa, ya, 10);

            start = {
                x: xa,
                y: ya
            }

            test();

            break;

        case "b":
            let xb = parseInt(MOUSE_X / map.dx);
            let yb = parseInt(MOUSE_Y / map.dy);

            mapDecoration.writeSpecialPoint(xb, yb, 20);

            finish = {
                x: xb,
                y: yb
            }

            test();

            break;

        case "c":
            brushId = !brushId;

            break;

        case "m":
            console.log(map.grid);

            break;
    }

    //map.
})

document.addEventListener("keydown", function(e) { //KEYBOARD EVENT
    // console.log(e.key);
})

window.onresize = (e) => {
    resizeWindow();
};

/**
 * 
    // ctx.fillStyle = "red";
    // ctx.fillRect(50 + x, 50, 50, 50);

        // ctx.fillStyle = "black";
        // ctx.lineWidth = 5;
        // ctx.strokeRect(50 + x, 50, 50, 50);

    // x += 1;
 */
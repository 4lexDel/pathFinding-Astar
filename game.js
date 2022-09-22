import { PathFinding } from "./lib/PathFinding.js";
import { TileMap } from "./TileMap.js";
import { getMousePos, getTouchPos } from "./utils.js";
import { getHeight, getWidth } from "/utils.js";

/**-------------------------------INIT GLOBAL VAR----------------------------------------------------------- */

var canvas = document.getElementById('gameCanvas');

var MOUSE_X = 0;
var MOUSE_Y = 0;

var WIDTH;
var HEIGHT;

resizeCanvas();

function resizeCanvas() {
    WIDTH = 10 * getWidth() / 10;
    HEIGHT = 10 * getHeight() / 10;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}

console.log("WIDTH : " + canvas.clientWidth + " - HEIGHT : " + canvas.clientHeight);


/**-------------------------------INIT CTX----------------------------------------------------------- */

var ctx = canvas.getContext("2d");



/**----------------------------------MAP INIT--------------------------------------------------------- */

function generateMaps(size) {
    return {
        editMap: new TileMap(size, WIDTH, HEIGHT),
        decorationMap: new TileMap(size, WIDTH, HEIGHT, TileMap.VOID)
    }
}

/**--------------------------------------------------------------------------------------------------- */

let size = 20;

let allMap = generateMaps(size);

var map = allMap.editMap;
var decorationMap = allMap.decorationMap;

var start = {
    x: 0,
    y: 0
}

var finish = {
    x: map.nbSquareX - 1,
    y: map.nbSquareY - 2
}

var brush = TileMap.OBSTACLE;

decorationMap.writeSpecialPoint(start.x, start.y, TileMap.START);
decorationMap.writeSpecialPoint(finish.x, finish.y, TileMap.FINISH);

test();
draw();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    map.display(ctx);
    decorationMap.display(ctx);

    //window.requestAnimationFrame(draw);
}

function test() {
    let pathfinding = new PathFinding(start, finish, map.grid);
    decorationMap.resetGrid();

    let result = pathfinding.process();
    if (result != null) {
        result.pathList.shift();
        //console.log(path);
        decorationMap.writelist(result.closeList, TileMap.CLOSE_LIST);
        decorationMap.writelist(result.openList, TileMap.OPEN_LIST);
        decorationMap.writelist(result.pathList, TileMap.PATH_LIST);
    }
    draw();
}

/**-------------------------------POP UP----------------------------------------------------------- */


function generateNewMaps() {
    resizeCanvas();

    let size = document.getElementById("numberCell").value;
    console.log(size);

    allMap = generateMaps(size);

    map = allMap.editMap;
    decorationMap = allMap.decorationMap;

    finish = {
        x: map.nbSquareX - 1,
        y: map.nbSquareY - 2
    }

    decorationMap.writeSpecialPoint(finish.x, finish.y, TileMap.FINISH);

    test();
}

function changeBrush() {
    let select = document.getElementById("typeBrush");
    let value = select.options[select.selectedIndex].value;
    console.log(value);

    switch (value) {
        case "obstacle":
            brush = TileMap.OBSTACLE;
            break;

        case "ground":
            brush = TileMap.NORMAL;
            break;

        case "water":
            brush = TileMap.WATER;
            break;
    }
}


document.getElementById("generateMap").addEventListener("click", generateNewMaps);
document.getElementById("resetMap").addEventListener("click", function() {
    map.resetGrid();
    decorationMap.resetGrid();
    test();
});

document.getElementById("getBrush").addEventListener("click", changeBrush);


/**------------------------------------------------------------------- */

// canvas.onclick = (e) => { //MOUSE CLICK
//     var mouse = getMousePos(canvas, e);

//     let val = -1;
//     if (!brushId) val = 1;

//     if (e.which == 1) map.updateGrid(mouse, val);
//     else map.updateGrid(mouse, 0);
//     test();
// }

canvas.addEventListener("mousemove", (e) => { //UPDATE GLOBAL MOUSE VARIABLE
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


var startDrag = false;

function mouseInteraction(e) {
    var mouse = getMousePos(canvas, e);

    if (e.which == 1) map.updateGrid(mouse, brush);
    else map.updateGrid(mouse, TileMap.NORMAL);
    test();
}

function touchInteraction(e) {
    var touch = getTouchPos(canvas, e);
    console.log(touch);

    map.updateGrid(touch, brush);

    test();
}

/*-------------------------------------------------*/

canvas.onmousedown = (e) => {
    startDrag = true;

    mouseInteraction(e);
}

canvas.onmousemove = (e) => {
    if (startDrag) {

        mouseInteraction(e);
    }
}

canvas.onmouseup = (e) => {
    if (startDrag) {
        startDrag = false;

        mouseInteraction(e);
    }
}

/*-------------------------------------------------*/


canvas.addEventListener('touchstart', function(e) {
    startDrag = true;

    touchInteraction(e);
}, false);

canvas.addEventListener('touchmove', function(e) {
    if (startDrag) {
        touchInteraction(e);
    }

}, false);

canvas.addEventListener('touchend', function(e) {
    startDrag = false;

    touchInteraction(e);
}, false);



/*-------------------------------------------------*/


document.addEventListener("keyup", function(e) { //KEYBOARD EVENT
    // console.log(e.key);

    switch (e.key) {
        case "Enter":
            test();
            break;

        case "r":
            map.resetGrid();
            decorationMap.resetGrid();
            test();
            break;

        case "a":
            let xa = parseInt(MOUSE_X / map.dx);
            let ya = parseInt(MOUSE_Y / map.dy);

            decorationMap.writeSpecialPoint(xa, ya, TileMap.START);

            start = {
                x: xa,
                y: ya
            }

            test();

            break;

        case "b":
            let xb = parseInt(MOUSE_X / map.dx);
            let yb = parseInt(MOUSE_Y / map.dy);

            decorationMap.writeSpecialPoint(xb, yb, TileMap.FINISH);

            finish = {
                x: xb,
                y: yb
            }

            test();

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
    resizeCanvas();
};
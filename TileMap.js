class TileMap {
    static CLOSE_LIST = -4;
    static OPEN_LIST = -3;
    static PATH_LIST = -2;
    static OBSTACLE = -1;
    static NORMAL = 0;
    static WATER = 1;
    static START = 10;
    static FINISH = 20;
    static VOID = 100;

    constructor(nbSquareX, canvasWidth, canvasHeight, defaultFill = 0) {
        this.nbSquareX = parseInt(nbSquareX);

        this.defaultFill = defaultFill;

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.dx = canvasWidth / nbSquareX;
        this.dy = this.dx;

        this.nbSquareY = parseInt(canvasHeight / this.dx) + 1;

        this.grid = new Array(this.nbSquareX);
        for (var x = 0; x < this.grid.length; x++) {
            this.grid[x] = new Array(this.nbSquareY);
        }
        this.resetGrid();
    }

    display(ctx) {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                switch (this.grid[x][y]) {
                    case TileMap.NORMAL:
                        ctx.fillStyle = "white";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.WATER:
                        ctx.fillStyle = "cyan";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.PATH_LIST:
                        ctx.fillStyle = "purple"; //"violet";      //PATH
                        ctx.globalAlpha = 0.6;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.OPEN_LIST:
                        ctx.fillStyle = "green"; //"orange";      //OpenList
                        ctx.globalAlpha = 0.1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.CLOSE_LIST:
                        ctx.fillStyle = "red"; //"orange";      //closeList
                        ctx.globalAlpha = 0.1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.START:
                        ctx.fillStyle = "blue";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.FINISH:
                        ctx.fillStyle = "red";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.OBSTACLE:
                        ctx.fillStyle = "black";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;
                }

                ctx.strokeStyle = "rgb(200,200,200)";
                ctx.lineWidth = 0.1;
                ctx.strokeRect(x * this.dx, y * this.dy, this.dx, this.dy);
            }
        }
    }

    writelist(list, val) {
        this.resetGridById(val);
        list.forEach(node => {
            //console.log("X : " + node.x + " | Y : " + node.y);
            if (this.grid[node.x][node.y] != TileMap.START && this.grid[node.x][node.y] != TileMap.FINISH)
                this.grid[node.x][node.y] = val;
        });
        //console.log(this.grid);
    }

    writeSpecialPoint(x, y, id) {
        this.resetGridById(id);
        //this.resetGridById(TileMap.PATH_LIST);

        this.grid[x][y] = id;
    }

    resetGridById(id) {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                if (this.grid[x][y] == id) this.grid[x][y] = this.defaultFill;
            }
        }
    }

    resetGrid() {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                this.grid[x][y] = this.defaultFill;
            }
        }
    }

    updateGrid(coords, id) {
        this.resetGridById(-2);
        if (coords.x >= 0 && coords.y >= 0 && coords.x <= this.canvasWidth && coords.y <= this.canvasHeight) {
            let x = parseInt(coords.x / this.dx);
            let y = parseInt(coords.y / this.dy);

            this.grid[x][y] = id;
        }
    }
}

export { TileMap };
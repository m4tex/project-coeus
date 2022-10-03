class MineGrid {
    #grid = []
    width; height;

    constructor(width, height, mines) {
        this.width = width;
        this.height = height;

        for (let i = 0; i < height; i++) {
            this.#grid.push([]);
            for (let j = 0; j < width; j++) {
                this.#grid[i].push(false);
            }
        }

        if (mines > width*height) mines = width*height;

        //populate with mines
        for (let k = 0; k < mines; k++) {
            let mineX, mineY;

            do {
                mineX = Math.floor(Math.random()*width);
                mineY = Math.floor(Math.random()*height)
            } while(this.#grid[mineY][mineX]) //True if it's a mine

            this.#grid[mineY][mineX] = true;
        }
    }

    countMines(x,y) {
        let mines = 0;

        const transform = tile => tile
    }

    debugGrid() {
        console.log(this.#grid);
    }

    draw(canvas) {
        const tileSizeX = canvas.width/this.width;
        const tileSizeY = canvas.height/this.height;

        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'

        //horizontal lines
        for (let i = 1; i < this.height; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i*tileSizeY);
            ctx.lineTo(canvas.width, i*tileSizeY);
            ctx.stroke();
        }

        //vertical lines
        for (let i = 1; i < this.width; i++) {
            ctx.beginPath();
            ctx.moveTo( i*tileSizeX, 0);
            ctx.lineTo(i*tileSizeX, canvas.height);
            ctx.stroke();
        }

        // for(let i = 0; i < )
    }
}
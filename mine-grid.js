"use strict";

class MineGrid {
    #grid;
    #flags = [];
    width; height;

    constructor(width, height, mines) {
        this.width = width;
        this.height = height;

        this.#grid = new Array(height);
        this.#grid.fill(new Array(width));

        if (mines > width*height) mines = width*height;

        //populate with mines
        for (let i = 0; i < mines; i++) {
            let mineX, mineY;

            do {
                mineX = Math.floor(Math.random()*width);
                mineY = Math.floor(Math.random()*height)
            } while (this.#grid[mineY][mineX] === -1) //True if it's a mine

            this.#grid[mineY][mineX] = -1;
        }

        alert('teataet')
        // Calculate tile numbers
        this.#grid.forEach((row, i) => row.forEach((val, j) => {
            if (val === -1) return;
            this.#grid[i][j] = this.countMines(j, i);
        }));

    }

    //Reveals the tile and returns the revealed number of mines nearby or -1 for a mine
    revealTile(x,y) {
        if(x > 0 && y > 0 && x < this.height && y < this.width) return;
        if(this.#flags.includes(`${x}|${y}`)) return;

        let value = this.#grid[y][x];

        if(value === 0) {
            let neighbors = this.#neighboringValues(x,y,false);

            if(neighbors[0] === 0) this.revealTile(x, y+1);
            if(neighbors[1] === 0) this.revealTile(x+1, y);
            if(neighbors[2] === 0) this.revealTile(x, y-1);
            if(neighbors[3] === 0) this.revealTile(x-1, y);
        }

        return value;
    }

    toggleFlag(x,y) {
        if (typeof this.#grid[y][x] !== 'boolean') return;

        let i = this.#flags.indexOf(`${x}|${y}`);
        if(i === -1) this.#flags.push(`${x}|${y}`);
        else this.#flags.splice(i, 1);
    }

    countMines(x,y) {
        let values = this.#neighboringValues(x,y);
        let converted = values.map(value => +(value === -1));
        return converted.reduce((prev, current) => prev+current);
    }

    //Returns the values in counter-clockwise order
    #neighboringValues(x, y, diagonal = true) {
        let values = [];

        if(diagonal) {
            values.push(this.#grid[y+1]?.at(x-1));
            values.push(this.#grid[y]?.at(x-1));
            values.push(this.#grid[y-1]?.at(x-1));

            values.push(this.#grid[y-1]?.at(x));
            values.push(this.#grid[y-1]?.at(x+1));

            values.push(this.#grid[y]?.at(x+1));
            values.push(this.#grid[y+1]?.at(x+1));
            values.push(this.#grid[y+1]?.at(x));
        } else {
            values.push(this.#grid[y+1]?.at(x));
            values.push(this.#grid[y]?.at(x+1));
            values.push(this.#grid[y-1]?.at(x));
            values.push(this.#grid[y]?.at(x-1));
        }

        values.map(val => val === undefined ? -5 : val);
        return values;
    }

    mouseToTile(mouseX, mouseY, canvas) {
        const tileWidth = canvas.width/this.width;
        const tileHeight = canvas.height/this.height;
        return [ Math.floor(mouseX/tileWidth), Math.floor(mouseY/tileHeight) ]
    }

    draw(canvas) {
        const tileWidth = canvas.width/this.width;
        const tileHeight = canvas.height/this.height;

        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'

        //horizontal lines
        for (let i = 1; i < this.height; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i*tileHeight);
            ctx.lineTo(canvas.width, i*tileHeight);
            ctx.stroke();
        }

        //vertical lines
        for (let i = 1; i < this.width; i++) {
            ctx.beginPath();
            ctx.moveTo( i*tileWidth, 0);
            ctx.lineTo(i*tileWidth, canvas.height);
            ctx.stroke();
        }

        //Draw tiles
        this.#grid.forEach((row, i) => row.forEach((value, j) => {
            const rect = ctx => ctx.fillRect(j*tileWidth, i*tileHeight, tileWidth, tileHeight);

            switch(value) {
                case true:
                case false:
                    ctx.fillStyle = 'gray';
                    rect(ctx);
                    break;
                case -1: //A mine
                    ctx.fillStyle = 'darkred';
                    rect(ctx);
                    break;

                default: //Mines nearby, from 1 to 8
                    if(typeof value !== 'number' || value < 0 || value > 9) throw new Error("Unhandled tile type.");
                    if (value === 0) return; //if no mine

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                    ctx.font = '24px arial';
                    ctx.fillText(this.#grid[i][j], j*tileWidth + tileWidth/2 - 6, i*tileHeight + tileHeight/2 + 7);

                    break;
            }
        }));

        ctx.fillStyle = 'darkgreen';
        this.#flags.forEach(flag => {
            const [x, y] = flag.split("|").map(num => parseInt(num));
            ctx.fillRect(x*tileWidth + 4, y*tileHeight + 4, tileWidth - 8, tileHeight - 8);
        });
    }
}
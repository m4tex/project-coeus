"use strict";

/**
 *     I know it could be done in a much cleaner way. Don't mob me (pretty please)
 *     ----------------------------------------------------------------------------
 *     **Grid values**
 *     ----------------------------------------------------------------------------
 *
 *     undefined = Grid border
 *
 *     -2 Flag
 *     -1 = Mine
 *     1-8 = Tile mine neighbor count
 *
 *     9 = Exposed mine (-1 + 10)
 *     10-18 = Exposed tiles (Tile number + 10)
 *
 *     19 = Flagged mine (-1 + 20)
 *     20-28 = Flagged tiles (Tile number + 20)
 */


class MineGrid {
    #grid;
    width;
    height;
    mines;

    constructor(width, height, mines) {
        this.width = width;
        this.height = height;
        this.mines = mines;

        this.#grid = Array(height).emptyMap(() => Array(width).fill(0));

        if (mines > width * height) this.mines = width * height;

            //populate with mines
        for (let i = 0; i < this.mines; i++) {
            let mineX, mineY;

            do {
                mineX = Math.floor(Math.random() * width);
                mineY = Math.floor(Math.random() * height);
            } while (this.#grid[mineY][mineX] === -1) //True if it's a mine

            this.#grid[mineY][mineX] = -1;
        }

        // Calculate tile numbers
        this.#grid.forEach((row, i) => row.forEach((val, j) => {
            if (val === -1) return;
            this.#grid[i][j] = this.countMines(j, i);
        }));
    }

    //Reveals the tile and returns the revealed number of mines nearby or -1 for a mine
    revealTile(x, y) {
        let value = this.#grid[y][x];

        if (!this.coordinatesInBounds(x, y) || value > 8) return;

        this.#grid[y][x] = value + 10;

        if (value === 0) {
            for (let i = 0; i < 8; i++) {
                const angle = i * (Math.PI/4);
                const yOffset = Math.round(Math.sin(angle));
                const xOffset = Math.round(Math.cos(angle));

                if (!this.coordinatesInBounds(x + xOffset, y + yOffset)) continue;

                this.revealTile(xOffset + x, yOffset + y);
            }
        }

        return value;
    }

    toggleFlag(x, y) {
        const value = this.#grid[y][x];
        if (value >= 9 && value < 19) return;

        if (value >= 19) {
            this.#grid[y][x] -= 20;
        }
        else this.#grid[y][x] += 20;
    }

    countMines(x, y) {
        const values = this.#neighboringValues(x, y);
        return values.reduce((prev, current) => prev + +(current === -1), 0);
    }

    //Returns the values in counter-clockwise order
    #neighboringValues(x, y, diagonal = true) {
        let values = [];

        const angleStep = diagonal ? (Math.PI/4) : (Math.PI/2);
        const stepCount = diagonal ? 8 : 4;

        //Trigonometry time 😎
        for (let i = 0; i < stepCount; i++) {
            const angle = i * angleStep;
            const yOffset = Math.round(Math.sin(angle));
            const xOffset = Math.round(Math.cos(angle));

            if (!this.coordinatesInBounds(x + xOffset, y + yOffset))
                values.push(undefined);
            else values.push(this.#grid[y + yOffset]?.at(x + xOffset));
        }

        return values;
    }

    mouseToTile(mouseX, mouseY, canvas) {
        const tileWidth = canvas.width / this.width;
        const tileHeight = canvas.height / this.height;
        return [Math.floor(mouseX / tileWidth), Math.floor(mouseY / tileHeight)]
    }

    coordinatesInBounds(x, y) {
        return (x >= 0 && y >= 0 && x < this.width && y < this.height);
    }
    
    draw(canvas) {
        const tileWidth = canvas.width / this.width;
        const tileHeight = canvas.height / this.height;

        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'

        //horizontal lines
        for (let i = 1; i < this.height; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * tileHeight);
            ctx.lineTo(canvas.width, i * tileHeight);
            ctx.stroke();
        }

        //vertical lines
        for (let i = 1; i < this.width; i++) {
            ctx.beginPath();
            ctx.moveTo(i * tileWidth, 0);
            ctx.lineTo(i * tileWidth, canvas.height);
            ctx.stroke();
        }

        //Draw tiles
        this.#grid.forEach((row, i) => row.forEach((value, j) => {
            const rect = ctx => ctx.fillRect(j * tileWidth, i * tileHeight, tileWidth, tileHeight);

            if (value === 10) return;

            if (value === 9) { //Exposed mine
                ctx.fillStyle = 'darkred';
                rect(ctx);
            } else if (value > 10 && value < 19) { //Exposed number tiles
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.font = '24px arial';
                ctx.fillText((value - 10).toString(), j * tileWidth + tileWidth / 2 - 6, i * tileHeight + tileHeight / 2 + 7);
            } else if (value >= 19 && value <= 28) {
                ctx.fillStyle = 'darkgreen';
                rect(ctx);
            } else {
                ctx.fillStyle = 'gray';
                rect(ctx);
            }
        }));

        ctx.fillStyle = 'darkgreen';

        this.#grid.map((row, i) => row.map((value, j) => {
            if (value >= 19) {
                ctx.fillRect(j * tileWidth + 4, i * tileHeight + 4, tileWidth - 8, tileHeight - 8);
            }
        }));
    }
}
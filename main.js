const gridWidth = 30, gridHeight = 15;
const mineCount = 200;

let grid;

window.addEventListener('load', () => {
    const canvas = document.getElementById('grid-canvas');
    canvas.width = canvas.offsetWidth*window.devicePixelRatio;
    canvas.height = canvas.offsetHeight*window.devicePixelRatio;

    grid = new MineGrid(gridWidth, gridHeight, mineCount);

    grid.draw(canvas);
});
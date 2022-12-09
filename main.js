const gridWidth = 6, gridHeight = 5;
const mineCount = 6;

let grid;

window.addEventListener('load', () => {
    const canvas = document.getElementById('grid-canvas');
    canvas.width = canvas.getBoundingClientRect().width*window.devicePixelRatio;
    canvas.height = canvas.getBoundingClientRect().height*window.devicePixelRatio;

    grid = new MineGrid(gridWidth, gridHeight, mineCount);
    grid.draw(canvas);
    console.log(grid);

    canvas.addEventListener('click', ev => {
        grid.revealTile(...grid.mouseToTile(ev.offsetX, ev.offsetY, canvas));
        grid.draw(canvas);
    });

    canvas.addEventListener('contextmenu', ev => {
        ev.preventDefault();
        grid.toggleFlag(...grid.mouseToTile(ev.offsetX, ev.offsetY, canvas));
        grid.draw(canvas);
    });
});
const gridWidth = 45, gridHeight = 30;
const mineCount = 250;

let grid;

window.addEventListener('load', () => {
    const canvas = document.getElementById('grid-canvas');
    canvas.width = canvas.getBoundingClientRect().width*window.devicePixelRatio;
    canvas.height = canvas.getBoundingClientRect().height*window.devicePixelRatio;

    NewGame();

    canvas.addEventListener('click', ev => {
        const tileNum = grid.revealTile(...grid.mouseToTile(ev.offsetX, ev.offsetY, canvas));
        if (tileNum === -1) {
            Loss();
        } else if (grid.revealed + grid.mines === grid.width * grid.height) {
            Win();
        }

        grid.draw(canvas);
    });

    canvas.addEventListener('contextmenu', ev => {
        ev.preventDefault();
        grid.toggleFlag(...grid.mouseToTile(ev.offsetX, ev.offsetY, canvas));
        grid.draw(canvas);
    });
});

function NewGame() {
    //Generate a new grid and reveal a random tile until it reveals at least 12 tiles without a mine
    let revealX, revealY;

    do {
        grid = new MineGrid(gridWidth, gridHeight, mineCount);
        revealX = Math.floor(Math.random() * grid.width);
        revealY = Math.floor(Math.random() * grid.height);
        grid.revealTile(revealX, revealY);
    } while (grid.revealed < 12)

    grid.draw(document.getElementById('grid-canvas'));
}
const gameModal = document.getElementById('game-modal');
const gameModalMessage = gameModal.getElementsByTagName('p')[0];

window.addEventListener('load', () => {
    gameModal.getElementsByTagName('button')[0].
    addEventListener('click', () => {
        CloseModal();
    })
});

function CloseModal() {
    gameModal.style.display = 'none';
    NewGame();
}

function Loss() {
    console.log('You loose :<');
    gameModal.style.display = 'block';
    gameModalMessage.innerText = 'You lost. Better luck next time!';
}

function Win() {
    console.log('You win qB)');
    gameModal.style.display = 'block';
    gameModalMessage.innerText = 'Congratulations! You won.';
}
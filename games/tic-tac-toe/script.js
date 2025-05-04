let paulieScore = 0;
let vinnieScore = 0;

const paulieScoreDisplay = document.getElementById('paulie-score');
const vinnieScoreDisplay = document.getElementById('vinnie-score');

const board = Array(9).fill(null);
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');

const PAULIE_IMG = '/paulie-streams/assets/transparent.png';
const VINNIE_IMG = '/paulie-streams/assets/Vinnie.png';

let gameOver = false;
let currentPlayer = 'X'; // 'X' = Paulie, 'O' = Vinnie

const winCombos = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
];

function handleCellClick(e) {
    const index = parseInt(e.target.getAttribute('data-index'));
    if (board[index] || gameOver) return;

    makeMove(index, currentPlayer);

    if (checkWin(currentPlayer)) {
        const winnerName = currentPlayer === 'X' ? 'Paulie' : 'Vinnie';
        endGame(`${winnerName} wins!`);
        return;
    }

    if (board.every(cell => cell !== null)) {
        endGame('Draw!');
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `${currentPlayer === 'X' ? 'Paulie' : 'Vinnie'}'s Turn`;
}

function makeMove(index, player) {
    board[index] = player;
    const img = document.createElement('img');
    img.src = player === 'X' ? PAULIE_IMG : VINNIE_IMG;
    cells[index].appendChild(img);
}

function checkWin(player) {
    return winCombos.some(combo =>
        combo.every(index => board[index] === player)
    );
}

function endGame(message) {
    status.textContent = message;
    gameOver = true;

    if (message === 'Paulie wins!') {
        paulieScore++;
        paulieScoreDisplay.textContent = paulieScore;
    } else if (message === 'Vinnie wins!') {
        vinnieScore++;
        vinnieScoreDisplay.textContent = vinnieScore;
    }
}

restartBtn.addEventListener('click', () => {
    board.fill(null);
    cells.forEach(cell => cell.innerHTML = '');
    gameOver = false;
    currentPlayer = 'X';
    status.textContent = "Paulie's Turn";
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

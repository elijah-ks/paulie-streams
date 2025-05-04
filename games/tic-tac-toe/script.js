const board = Array(9).fill(null);
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');

const PAULIE_IMG = '/paulie-streams/assets/logo.png';
const VINNIE_IMG = '/paulie-streams/assets/vinnie.png';


let gameOver = false;

// Winning combinations (indices)
const winCombos = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6]          // diagonals
];

// Handle player move
function handleCellClick(e) {
    const index = parseInt(e.target.getAttribute('data-index'));

    if (board[index] || gameOver) return;

    makeMove(index, 'X');
    if (checkWin('X')) {
        status.textContent = 'Paulie wins!';
        gameOver = true;
        return;
    }
    if (board.every(cell => cell)) {
        status.textContent = 'Draw!';
        gameOver = true;
        return;
    }

    setTimeout(() => {
        computerMove();
    }, 400); // slight delay for realism
}

// Computer move (random)
function computerMove() {
    const emptyIndexes = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
    if (emptyIndexes.length === 0 || gameOver) return;

    const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    makeMove(randomIndex, 'O');

    if (checkWin('O')) {
        status.textContent = 'Vinnie wins!';
        gameOver = true;
    } else if (board.every(cell => cell)) {
        status.textContent = 'Draw!';
        gameOver = true;
    }
}

// Place image in cell
function makeMove(index, player) {
    board[index] = player;
    const img = document.createElement('img');
    img.src = player === 'X' ? PAULIE_IMG : VINNIE_IMG;
    cells[index].appendChild(img);
}

// Check for win
function checkWin(player) {
    return winCombos.some(combo =>
        combo.every(index => board[index] === player)
    );
}

// Reset game
restartBtn.addEventListener('click', () => {
    board.fill(null);
    cells.forEach(cell => cell.innerHTML = '');
    status.textContent = '';
    gameOver = false;
});

// Set up listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

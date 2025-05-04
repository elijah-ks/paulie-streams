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

function computerMove() {
    if (gameOver) return;

    // Try to win or block
    const emptyIndexes = board.map((val, i) => val === null ? i : null).filter(i => i !== null);

    // Check for winning move
    for (let i of emptyIndexes) {
        board[i] = 'O';
        if (checkWin('O')) {
            makeMove(i, 'O');
            return endGame('Vinnie wins!');
        }
        board[i] = null;
    }

    // Block Paulie from winning
    for (let i of emptyIndexes) {
        board[i] = 'X';
        if (checkWin('X')) {
            board[i] = 'O';
            makeMove(i, 'O');
            return endGame('Vinnie wins!');
        }
        board[i] = null;
    }
    
    // Take center, then corners, then random
    const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    const move = preferred.find(i => board[i] === null);
    if (move !== undefined) {
        makeMove(move, 'O');
        if (checkWin('O')) return endGame('Vinnie wins!');
    }

    if (board.every(cell => cell)) endGame('Draw!');
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



// Reset game
restartBtn.addEventListener('click', () => {
    board.fill(null);
    cells.forEach(cell => cell.innerHTML = '');
    status.textContent = '';
    gameOver = false;
});

// Set up listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));



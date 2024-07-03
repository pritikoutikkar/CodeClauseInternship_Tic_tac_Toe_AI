const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    if (board[cellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(cell, cellIndex);
    checkResult();
    if (gameActive) {
        aiMove();
    }
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.textContent = `Player ${currentPlayer === 'X' ? 'O' : 'X'} has won!`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        message.textContent = 'Game ended in a draw!';
        gameActive = false;
    }
}

function aiMove() {
    const bestMove = minimax(board, 'O').index;
    const aiCell = document.querySelector(`.cell[data-index='${bestMove}']`);
    updateCell(aiCell, bestMove);
    checkResult();
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
    message.textContent = '';
}

function minimax(newBoard, player) {
    const emptyCells = newBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    if (checkWin(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWin(newBoard, 'O')) {
        return { score: 10 };
    } else if (emptyCells.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < emptyCells.length; i++) {
        const index = emptyCells[i];
        const move = {};
        move.index = index;
        newBoard[index] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[index] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
}

function checkWin(board, player) {
    return winningConditions.some(condition => 
        condition.every(index => board[index] === player)
    );
}

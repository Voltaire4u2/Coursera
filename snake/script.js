const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const rows = 10;
const cols = 10;
const minesCount = 20;
let board = [];
let revealedCount = 0;

function startGame() {
    gameBoard.innerHTML = '';
    board = createBoard(rows, cols, minesCount);
    revealedCount = 0;
    renderBoard(board);
}

function createBoard(rows, cols, minesCount) {
    const board = Array.from({ length: rows }, () => Array(cols).fill({ mine: false, revealed: false, flagged: false, adjacentMines: 0 }));

    // Place mines randomly
    let placedMines = 0;
    while (placedMines < minesCount) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            placedMines++;
        }
    }

    // Calculate adjacent mines
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!board[row][col].mine) {
                let count = 0;
                for (let r = -1; r <= 1; r++) {
                    for (let c = -1; c <= 1; c++) {
                        if (row + r >= 0 && row + r < rows && col + c >= 0 && col + c < cols && board[row + r][col + c].mine) {
                            count++;
                        }
                    }
                }
                board[row][col].adjacentMines = count;
            }
        }
    }
    return board;
}

function renderBoard(board) {
    board.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.row = rIdx;
            cellElement.dataset.col = cIdx;
            cellElement.addEventListener('click', revealCell);
            cellElement.addEventListener('contextmenu', flagCell);
            gameBoard.appendChild(cellElement);
        });
    });
}

function revealCell(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (board[row][col].revealed || board[row][col].flagged) return;
    board[row][col].revealed = true;
    revealedCount++;
    event.target.classList.add('revealed');
    if (board[row][col].mine) {
        event.target.classList.add('mine');
        alert('Game Over! You hit a mine.');
        startGame();
    } else {
        event.target.textContent = board[row][col].adjacentMines > 0 ? board[row][col].adjacentMines : '';
        if (board[row][col].adjacentMines === 0) {
            revealAdjacentCells(row, col);
        }
        if (revealedCount === rows * cols - minesCount) {
            alert('Congratulations! You cleared the board.');
            startGame();
        }
    }
}

function revealAdjacentCells(row, col) {
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            if (row + r >= 0 && row + r < rows && col + c >= 0 && col + c < cols && !board[row + r][col + c].revealed) {
                revealCell({ target: gameBoard.children[(row + r) * cols + (col + c)] });
            }
        }
    }
}

function flagCell(event) {
    event.preventDefault();
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (board[row][col].revealed) return;
    board[row][col].flagged = !board[row][col].flagged;
    event.target.classList.toggle('flagged');
}

restartBtn.addEventListener('click', startGame);

startGame();

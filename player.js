const board = document.getElementById('board');
const cells = [];
let currentPlayer = 'X';
let gameOver = false;
let playerXWins = 0;
let playerOWins = 0;

// Create the Tic Tac Toe board
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 6; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener('click', handleCellClick);
        cells.push(cell);
        board.appendChild(cell);
    }
}

// Modified winning conditions for a 5x6 board
let winConditions = [
    [0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17], [18, 19, 20, 21, 22, 23], [24, 25, 26, 27, 28, 29],
    [0, 6, 12, 18, 24], [1, 7, 13, 19, 25], [2, 8, 14, 20, 26], [3, 9, 15, 21, 27], [4, 10, 16, 22, 28], [5, 11, 17, 23, 29],
    [1, 6], [2, 7, 12], [3, 8, 13, 18], [4, 9, 14, 19, 24], [5, 10, 15, 20, 25], [11, 16, 21, 26], [17, 22, 27], [23, 28],
    [4, 11], [3, 10, 17], [2, 9, 16, 23], [1, 8, 15, 22, 29], [0, 7, 14, 21, 28], [6, 13, 20, 27], [12, 19, 26], [18, 25]
];

// Get the player X and O input elements
const playerXInput = document.getElementById("player-x");
const playerOInput = document.getElementById("player-o");

// Get the player name elements in the scoreboard
const playerXnameSpan = document.querySelector("#player-x-name");
const playerOnameSpan = document.querySelector("#player-o-name")

// Store the player names in variables
let playerXName = "";
let playerOName = "";

playerXInput.addEventListener("input", function(event) {
    playerXName = event.target.value.substring(0, 20); // Limit the name to a maximum of 20 characters
    playerXnameSpan.textContent = playerXName;
});

playerOInput.addEventListener("input", function(event) {
    playerOName = event.target.value.substring(0, 20); // Limit the name to a maximum of 20 characters
    playerOnameSpan.textContent = playerOName;
});

function handleCellClick() {
    if (gameOver || this.textContent !== '') return;

    this.textContent = currentPlayer;
    Turns();
    if (checkWinner()) {
        highlightWinner();
        setTimeout(() => {
            alert(`Player ${currentPlayer} wins!`);
            gameOver = true;
        }, 500);
    } else if (isBoardFull()) {
        alert('It\'s a draw!')
        resetBoard();
        gameOver = true;
    }
}

function checkWinner() {
    for (const condition of winConditions) {
        const line = condition.map(index => cells[index].textContent);
        const XCount = line.filter(symbol => symbol === 'X').length;
        const OCount = line.filter(symbol => symbol === 'O').length;

        // Check for player win
        if (XCount === line.length) {
            playerXWins++;
            document.querySelector("#player-x-count").innerHTML = playerXWins;
            if (playerXWins === 5) {
                alert('Player X wins the game!');
                resetScoreboard();
            } else {
                highlightWinner(condition, 'X');
                setTimeout(resetBoard, 3000);
            }
            return true;
        }

        // Check for AI win
        if (OCount === line.length) {
            playerOWins++;
            document.querySelector("#player-o-count").innerHTML = playerOWins;
            if (playerOWins === 5) {
                alert('Player O wins the game!')
                resetScoreboard();
            } else {
                highlightWinner(condition, 'O');
                setTimeout(resetBoard, 3000);
            }
            return true;
        }
    }

    return false;
}

// Check if the board is full
function isBoardFull() {
    return cells.every(cell => cell.textContent !== '');
}

function highlightWinner(condition, winner) {
    condition.forEach(index => cells[index].classList.add('winner'));
    setTimeout(() => {
        gameOver = true;
    }, 1000);
}

function Turns() {
    if (currentPlayer === "X") {
        currentPlayer = "O";
        document.querySelector(".bg").style.left = "150px";
    } else {
        currentPlayer = "X";
        document.querySelector(".bg").style.left = "0";
    }
}

function resetBoard() {
    // Clear cell content and remove winner class
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });

    // Reset game state variables
    currentPlayer = 'X';
    gameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
}

function resetScoreboard() {
    playerXWins = 0;
    playerOWins = 0;
    document.querySelector("#player-x-count").innerHTML = playerXWins;
    document.querySelector("#player-o-count").innerHTML = playerOWins;
    resetBoard();
}

document.querySelector("#play-again").addEventListener("click", resetBoard);
document.querySelector("#quit").addEventListener("click", () => {
    window.location.href = "index.html";
});

document.addEventListener('DOMContentLoaded', function() {
    // Find the back button element
    const backButton = document.querySelector('.back i');

    // Add a click event listener to the back button
    backButton.addEventListener('click', function() {
        // Navigate to the previous page in the browser's history
        window.history.back();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let boxes = document.querySelectorAll(".box");
    const board = document.getElementById('board');
    const cells = [];
    let currentPlayer = 'X';
    let isGameOver = false;
    let playerXWins = 0;
    let playerOWins = 0;
    let difficulty = "";
    let aiIsThinking = false; // Added variable to track if AI is thinking





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
    // Diagonal winning conditions
    // Add more custom winning conditions as needed
];

// Handle cell click event
function handleCellClick() {
    if (gameOver || aiIsThinking || this.textContent !== '') return;

    this.textContent = currentPlayer;
    if (checkWinner()) {
        highlightWinner();
        setTimeout(() => {
            alert(`Player ${currentPlayer} wins!`);
            gameOver = true;
        }, 500);
    } else if (isBoardFull()) {
        alert('It\'s a draw!');
        gameOver = true;
    } else {
        currentPlayer = 'X'; // Ensure player is always X after their move

        // Disable player's ability to click during AI's turn
        disablePlayerClick();

        // Call AI function based on difficulty
        if (currentPlayer === 'X') {
            difficultAI();
        }
    }
}

// Function to disable player's ability to click during AI's turn
function disablePlayerClick() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
    });
}

// Function to re-enable player's ability to click after AI's turn
function enablePlayerClick() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

// Easy AI: Makes a random move
function easyAI() {
    aiIsThinking = true;
    setTimeout(() => {
        makeAIMove(getRandomEmptyCell());
        aiIsThinking = false;
        enablePlayerClick();
    }, 500);
}




// Function to check if all corner moves are blocked
function areAllCornerMovesBlocked() {
    const player = 'X'; // Player symbol

    const cornerWinConditions = [
        [1, 6],
        [4, 11],
        [18, 25],
        [23, 28],
    ];

    for (const cornerCondition of cornerWinConditions) {
        const line = cornerCondition.map(index => cells[index].textContent);
        const playerCount = line.filter(symbol => symbol === player).length;
        const emptyCount = line.filter(symbol => symbol === '').length;

        if (playerCount === 1 && emptyCount === 1) {
            return false; // At least one corner move is available to block
        }
    }

    return true; // All corner moves are blocked
}

// Expert AI: Make a move considering all winning conditions and blocking player
function difficultAI() {
    // Check if all corner moves are blocked, then focus on winning moves
    const cornerMovesBlocked = areAllCornerMovesBlocked();

    if (cornerMovesBlocked) {
        console.log("All corner moves are blocked. Focusing on winning moves.");

        const winningMove = getWinningMove('O');

        if (winningMove) {
            console.log("Found winning move.");
            makeAIMove(winningMove);
        } else {
            console.log("No winning move found. Making a random move.");
            // If no winning move, use a random empty cell
            const randomMove = getRandomEmptyCell();

            if (randomMove) {
                makeAIMove(randomMove);
            }
        }
    } else {
        console.log("Not all corner moves are blocked. Continuing to block moves.");
        // If not all corners are blocked, continue blocking
        const cornerBlockingMove = getBlockingMove(true);

        if (cornerBlockingMove) {
            console.log("Found blocking move.");
            makeAIMove(cornerBlockingMove);
        } else {
            console.log("No blocking move found. Making a random move.");
            // If no corner move to block, use a random empty cell
            const randomMove = getRandomEmptyCell();

            if (randomMove) {
                makeAIMove(randomMove);
            }
        }
    }
}



// Expert AI: Make a move considering all winning conditions and blocking player
function expertAI() {
    const emptyCells = cells.filter(cell => cell.textContent === '');

    // Check for a winning move for the AI
    const winningMove = getWinningMove('O');

    if (winningMove) {
        makeAIMove(winningMove);
    } else {
        // If no winning move, block the player
        const blockingMove = getBlockingMove();

        if (blockingMove) {
            makeAIMove(blockingMove);
        } else {
            // If no winning move or block, use a random empty cell
            const randomMove = getRandomEmptyCell();
            
            if (randomMove) {
                makeAIMove(randomMove);
            }
        }
    }
}

// Function to get a winning move for the specified player with lower priority
function getWinningMove(player) {
    // Check if there are blocking moves available
    const blockingMove = getBlockingMove();
    if (blockingMove !== null) {
        return null;  // Return null to prioritize blocking moves
    }

    // Continue with the original logic to find winning moves
    for (const condition of winConditions) {
        const line = condition.map(index => cells[index].textContent);

        if (line.filter(symbol => symbol === player).length >= 2 && line.includes('')) {
            const emptyIndex = line.findIndex(symbol => symbol === '');
            return cells[condition[emptyIndex]];
        }
    }

    return null;
}


// Function to get a blocking move to prevent the player from winning
function getBlockingMove() {
    const player = 'X'; // Player symbol

    // Prioritize blocking player wins in corners
    const cornerWinConditions = [
        [1, 6],
        [4, 11],
        [18, 25],
        [23, 28],
    ];

    // First, check if the AI can block the player's win in the corners
    for (const cornerCondition of cornerWinConditions) {
        const line = cornerCondition.map(index => cells[index].textContent);
        const playerCount = line.filter(symbol => symbol === player).length;
        const emptyCount = line.filter(symbol => symbol === '').length;

        if (playerCount === 1 && emptyCount === 1 && line.includes('')) {
            const emptyIndex = line.findIndex(symbol => symbol === '');
            return cells[cornerCondition[emptyIndex]];
        }
    }

    // Next, prioritize blocking player potential wins in the next move
    for (const condition of winConditions) {
        const line = condition.map(index => cells[index].textContent);
        const playerCount = line.filter(symbol => symbol === player).length;
        const aiCount = line.filter(symbol => symbol === 'O').length;
        const emptyCount = line.filter(symbol => symbol === '').length;

        if (playerCount === 2 && emptyCount === 1 && aiCount === 0) {
            const emptyIndex = line.findIndex(symbol => symbol === '');
            return cells[condition[emptyIndex]];
        }
    }

    // If all else fails, prioritize blocking player's potential wins
    for (const condition of winConditions) {
        const line = condition.map(index => cells[index].textContent);
        const playerCount = line.filter(symbol => symbol === player).length;
        const aiCount = line.filter(symbol => symbol === 'O').length;
        const emptyCount = line.filter(symbol => symbol === '').length;

        if (emptyCount === 1 && aiCount === 0) {
            const emptyIndex = line.findIndex(symbol => symbol === '');
            return cells[condition[emptyIndex]];
        }
    }

    return null;
}






// Function to make AI move
function makeAIMove(cell) {
    aiIsThinking = true; // Set the flag to indicate AI is thinking

    setTimeout(() => {
        if (cell) {
            cell.textContent = 'O'; // Make sure AI is always 'O'

            if (checkWinner()) {
                highlightWinner();
                setTimeout(() => {
                    alert('Player X wins!');
                    gameOver = true;
                }, 500);
            } else if (isBoardFull()) {
                alert('It\'s a draw!');
                gameOver = true;
            }
        }

        currentPlayer = 'X'; // Switch back to player X after AI move
        aiIsThinking = false; // Reset the flag after AI finishes its move

        // Re-enable player's ability to click after AI's turn
        enablePlayerClick();
    }, 500);
}


// Function to get a random empty cell
function getRandomEmptyCell() {
    const emptyCells = cells.filter(cell => cell.textContent === '');
    return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
}

// Function to check if there is a winner
function checkWinner() {
    for (const condition of winConditions) {
        const line = condition.map(index => cells[index].textContent);
        const playerCount = line.filter(symbol => symbol === 'X').length;
        const aiCount = line.filter(symbol => symbol === 'O').length;

        // Check for player win
        if (playerCount === line.length && aiCount === 0 && currentPlayer === 'X') {
            highlightWinner(condition);
            return true;
        }

        // Check for AI win
        if (aiCount === line.length && playerCount === 0 && currentPlayer === 'O') {
            highlightWinner(condition);
            return true;
        }
    }

    return false;
}

// Check if the board is full
function isBoardFull() {
    return cells.every(cell => cell.textContent !== '');
}

// Function to highlight the winning combination
function highlightWinner() {
    for (const condition of winConditions) {
        const line = condition.map(index => cells[index].textContent);

        if (line.every(cell => cell === 'X')) {
            condition.forEach(index => cells[index].classList.add('winner'));
            setTimeout(() => {
                alert('Player X wins!');
                gameOver = true;
            }, 500);
            return;
        } else if (line.every(cell => cell === 'O')) {
            condition.forEach(index => cells[index].classList.add('winner'));
            setTimeout(() => {
                alert('Player O wins!');
                gameOver = true;
            }, 500);
            return;
        }
    }

    if (isBoardFull()) {
        alert('It\'s a draw!');
        gameOver = true;
    }
}

    function resetGame() {
        isGameOver = false;
        boxes.forEach(box => {
            box.innerHTML = "";
            box.style.backgroundColor = "";
            box.style.color = "";
        });
        document.querySelector(".bg").style.left = "0";
        document.querySelector("#results").innerHTML = "";
    	document.querySelector(".turn-container").style.display = "grid";
    	document.querySelector(".scoreboard").style.display = "flex";
    	document.querySelector(".buttons").style.display = "none";
        Turns();
    }

    // Event listeners for game interactions
    document.querySelector("#play-again").addEventListener("click", resetGame);
    document.querySelector("#quit").addEventListener("click", () => {
        window.location.href = "opponent.html";
    });
});
    });
});

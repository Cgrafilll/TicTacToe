document.addEventListener("DOMContentLoaded", function () {
    let boxes = document.querySelectorAll(".box");
    let turn = "X";
    let isGameOver = false;
    let playerXWins = 0;
    let playerOWins = 0;
    let difficulty = "";
    let aiIsThinking = false; // Added variable to track if AI is thinking

    // Define win conditions
    let winConditions = [
        [0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17], [18, 19, 20, 21, 22, 23], [24, 25, 26, 27, 28, 29],
        [0, 6, 12, 18, 24], [1, 7, 13, 19, 25], [2, 8, 14, 20, 26], [3, 9, 15, 21, 27], [4, 10, 16, 22, 28], [5, 11, 17, 23, 29],
        [1, 6], [2, 7, 12], [3, 8, 13, 18], [4, 9, 14, 19, 24], [5, 10, 15, 20, 25], [11, 16, 21, 26], [17, 22, 27], [23, 28],
        [4, 11], [3, 10, 17], [2, 9, 16, 23], [1, 8, 15, 22, 29], [0, 7, 14, 21, 28], [6, 13, 20, 27], [12, 19, 26], [18, 25]
    ];

    // Handle cell click event
function handleCellClick() {
    if (isGameOver || aiIsThinking || this.textContent !== '') return;

    this.textContent = turn;
    if (checkWinner()) {
        highlightWinner();
        setTimeout(() => {
            alert(`Player ${turn} wins!`);
            isGameOver = true;
        }, 500);
    } else if (isBoardFull()) {
        alert('It\'s a draw!');
        isGameOver = true;
    } else {
        currentPlayer = 'X'; // Ensure player is always X after their move

        // Disable player's ability to click during AI's turn
        disablePlayerClick();

        // Call AI function based on difficulty after a short delay
        setTimeout(() => {
            if (turn === 'X') {
                if (difficulty === 'easy') {
                    easyAIMove();
                } else if (difficulty === 'difficult') {
                    difficultAI();
                } else if (difficulty === 'expert') {
                    expertAI();
                }
            }
        }, 200);
    }
}

    function easyAIMove() {
        aiIsThinking = true; // Set the flag to indicate AI is thinking

        setTimeout(() => {
            const emptyBoxes = Array.from(boxes).filter(box => box.innerHTML === "");
            if (emptyBoxes.length > 0) {
                const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
                emptyBoxes[randomIndex].innerHTML = "O";
            }

            aiIsThinking = false; // Reset the flag after AI finishes its move

            // Re-enable player's ability to click after AI's turn
            enablePlayerClick();
        }, 500);
    }

    function difficultAI() {
        aiIsThinking = true; // Set the flag to indicate AI is thinking

        setTimeout(() => {
            const emptyBoxes = Array.from(boxes).filter(box => box.innerHTML === "");
            if (emptyBoxes.length > 0) {
                const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
                emptyBoxes[randomIndex].innerHTML = "O";
            }

            aiIsThinking = false; // Reset the flag after AI finishes its move

            // Re-enable player's ability to click after AI's turn
            enablePlayerClick();
        }, 500);
    }

    function expertAI() {
        aiIsThinking = true; // Set the flag to indicate AI is thinking

        setTimeout(() => {
    const emptyCells = cells.filter(cell => cell.textContent === '');
		 aiIsThinking = false; // Reset the flag after AI finishes its move

            // Re-enable player's ability to click after AI's turn
            enablePlayerClick();
        }, 500);
    }


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
    console.log('AI is thinking...');

    setTimeout(() => {
        if (cell) {
            cell.textContent = 'O'; // Make sure AI is always 'O'
            console.log('AI made a move!');
            console.log('Checking winner after AI move...');
            console.log('Is the board full?', isBoardFull());

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

    function Draw() {
        if (!isGameOver) {
            let isDraw = true;
            boxes.forEach(e => {
                if (e.innerHTML === "") isDraw = false;
            });

            if (isDraw) {
                hide();
		document.querySelector(".buttons").style.display = "flex";
                document.querySelector("#results").innerHTML = "Draw";
            }
        }
    }

    function Win() {
        for (let i = 0; i < winConditions.length; i++) {
            let values = winConditions[i].map(index => boxes[index].innerHTML);
            let isWin = values.every(value => value !== "" && value === values[0]);

            if (isWin) {
                hide();
		document.querySelector(".buttons").style.display = "flex";
                document.querySelector("#results").innerHTML = "Player " + turn + " wins!";


                // Update the scores
                if (turn === "X") {
                    playerXWins++;
                    document.querySelector("#player-x-count").innerHTML = playerXWins;
                } else {
                    playerOWins++;
                    document.querySelector("#player-o-count").innerHTML = playerOWins;
                }

                winConditions[i].forEach(index => {
                    boxes[index].style.backgroundColor = "#08D9D6";
                    boxes[index].style.color = "#000";
                });

                // Check if a player has won five games
                if (playerXWins === 5 || playerOWins === 5) {
                    document.querySelector("#results").innerHTML =
                    	playerXWins === 5 ? "Player X wins the game!" : "Player O wins the game!";
		    document.querySelector(".scoreboard").style.display = "none";
                    document.querySelector(".buttons").style.display = "flex";
		    document.querySelector(".buttons").style.marginTop = "10px";
                    document.querySelector("#play-again").innerHTML = "Play Again";

                    // Reset the scoreboard when the game is won
                    playerXWins = 0;
                    playerOWins = 0;
                    document.querySelector("#player-x-count").innerHTML = "0";
                    document.querySelector("#player-o-count").innerHTML = "0";
                }
            }
        }
    }

    function Turns() {
        if (turn === "X") {
            turn = "O";
            document.querySelector(".bg").style.left = "150px";
        } else {
            turn = "X";
            document.querySelector(".bg").style.left = "0";
        }
    }

    function hide() {
        isGameOver = true;
        document.querySelector(".turn-container").style.display = "none";
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

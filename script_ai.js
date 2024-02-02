document.addEventListener("DOMContentLoaded", function () {
    let boxes = document.querySelectorAll(".box");
    let turn = "X";
    let isGameOver = false;
    let playerXWins = 0;
    let playerOWins = 0;
    let difficulty = "";

// Initialize empty game board (5x6)
let board = ['', '', '', '', '',
             '', '', '', '', '',
             '', '', '', '', '',
             '', '', '', '', '',
             '', '', '', '', ''];

// Define win conditions for a 5x6 grid
let winConditions = [
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], [25, 26, 27, 28, 29], // Rows
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], [5, 10, 15, 20, 25], [6, 11, 16, 21, 26], [7, 12, 17, 22, 27], [8, 13, 18, 23, 28], [9, 14, 19, 24, 29], // Columns
    [0, 6], [1, 7, 12], [2, 8, 13, 18], [3, 9, 14, 19, 24], [4, 10, 15, 20, 25], [5, 11, 16, 21, 26], [11, 17, 22, 27], [17, 23, 28], // Diagonals
    [4, 11], [3, 10, 17], [2, 9, 16, 23], [1, 8, 15, 22, 29], [0, 7, 14, 21, 28], [6, 13, 20, 27], [12, 19, 26], [18, 25] // Other conditions
];
    const urlParams = new URLSearchParams(window.location.search);
    difficulty = urlParams.get('difficulty');

    if (!difficulty) {
        difficulty = "easy";
    }

    boxes.forEach(e => {
        e.innerHTML = "";
        e.addEventListener("click", () => {
            if (!isGameOver && e.innerHTML === "") {
                e.innerHTML = turn;
                Win();
                Draw();
                Turns();
                if (!isGameOver && turn !== "X") {
                    setTimeout(aiMove, 800);
                }
            }
        });
    });

    function aiMove() {
        if (!isGameOver) {
            switch (difficulty) {
                case "easy":
                    easyAIMove();
                    break;
                case "difficult":
                    difficultAIMove();
                    break;
                case "expert":
                    expertAIMove();
                    break;
                default:
                    break;
            }
            Win();
            Draw();
            Turns();
        }
    }

    function easyAIMove() {
        let emptyIndices = [];
        // Find empty positions on the board
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                emptyIndices.push(i);
            }
        }
        // Choose a random empty position
        let randomIndex = Math.floor(Math.random() * emptyIndices.length);
        let moveIndex = emptyIndices[randomIndex];
        board[moveIndex] = 'O';
    }
    

    function difficult_ai_move() {
    let button_index = null;
    let button_id = null;
    let ai_button = null;

    // Check if AI can win in the next move
    for (let i = 0; i < winCombos.length; i++) {
        const combo = winCombos[i];
        const symbols = combo.map(index => button_states[index]);

        if (symbols.filter(symbol => symbol === "O").length === symbols.length - 1 && symbols.includes("unclicked")) {
            button_index = combo.find(index => button_states[index] === "unclicked");
            break;
        }
    }

    // If no winning move, check if opponent can win and block
    if (button_index === null) {
        for (let i = 0; i < winCombos.length; i++) {
            const combo = winCombos[i];
            const symbols = combo.map(index => button_states[index]);

            if (symbols.filter(symbol => symbol === "X").length === symbols.length - 1 && symbols.includes("unclicked")) {
                button_index = combo.find(index => button_states[index] === "unclicked");
                break;
            }
        }
    }

    // If no winning or blocking moves, choose a random unclicked position
    if (button_index === null) {
        let unclicked_indices = winCombos.flat().filter(index => button_states[index] === "unclicked");
        button_index = unclicked_indices[Math.floor(Math.random() * unclicked_indices.length)];
    }

    button_id = "but" + button_index;
    ai_button = document.getElementById(button_id);

    if (button_states[button_index] === "unclicked") {
        ai_button.innerHTML = turn;
        button_states[button_index] = "O";
    }
}

function expert_ai_move() {
    let button_index = null;
    let button_id = null;
    let ai_button = null;

    // Check if AI can win in the next move
    for (let i = 0; i < winCombos.length; i++) {
        const combo = winCombos[i];
        const symbols = combo.map(index => button_states[index]);

        if (symbols.filter(symbol => symbol === "O").length === symbols.length - 1 && symbols.includes("unclicked")) {
            button_index = combo.find(index => button_states[index] === "unclicked");
            break;
        }
    }

    // If no winning move, check if opponent can win and block
    if (button_index === null) {
        for (let i = 0; i < winCombos.length; i++) {
            const combo = winCombos[i];
            const symbols = combo.map(index => button_states[index]);

            if (symbols.filter(symbol => symbol === "X").length === symbols.length - 1 && symbols.includes("unclicked")) {
                button_index = combo.find(index => button_states[index] === "unclicked");
                break;
            }
        }
    }

    // If no winning or blocking moves, prioritize center and corners
    if (button_index === null) {
        const centerAndCorners = [14, 12, 16, 10, 18];
        const availableCenterAndCorners = centerAndCorners.filter(index => button_states[index] === "unclicked");

        if (availableCenterAndCorners.length > 0) {
            button_index = availableCenterAndCorners[0];
        }
    }

    // If none of the above, choose a random unclicked position
    if (button_index === null) {
        let unclicked_indices = winCombos.flat().filter(index => button_states[index] === "unclicked");
        button_index = unclicked_indices[Math.floor(Math.random() * unclicked_indices.length)];
    }

    button_id = "but" + button_index;
    ai_button = document.getElementById(button_id);

    if (button_states[button_index] === "unclicked") {
        ai_button.innerHTML = turn;
        button_states[button_index] = "O";
    }
}


    function findWinningMove(player) {
        for (let i = 0; i < winConditions.length; i++) {
            let values = winConditions[i].map(index => boxes[index].innerHTML);
            let emptyIndex = winConditions[i].find(index => boxes[index].innerHTML === "");

            if (values.filter(value => value === player).length === 2 && emptyIndex !== undefined) {
                return emptyIndex;
            }
        }
        return -1;
    }

    function findBlockingMove(player) {
        let opponent = player === "X" ? "O" : "X";
        return findWinningMove(opponent);
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
        }
    }
}

)

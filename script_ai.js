document.addEventListener("DOMContentLoaded", function () {
    let boxes = document.querySelectorAll(".box");
    let turn = "X";
    let isGameOver = false;
    let playerXWins = 0;
    let playerOWins = 0;

    // Define win conditions
    let winConditions = [
        [0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17], [18, 19, 20, 21, 22, 23], [24, 25, 26, 27, 28, 29],
        [0, 6, 12, 18, 24], [1, 7, 13, 19, 25], [2, 8, 14, 20, 26], [3, 9, 15, 21, 27], [4, 10, 16, 22, 28], [5, 11, 17, 23, 29],
        [1, 6], [2, 7, 12], [3, 8, 13, 18], [4, 9, 14, 19, 24], [5, 10, 15, 20, 25], [11, 16, 21, 26], [17, 22, 27], [23, 28],
        [4, 11], [3, 10, 17], [2, 9, 16, 23], [1, 8, 15, 22, 29], [0, 7, 14, 21, 28], [6, 13, 20, 27], [12, 19, 26], [18, 25]
    ];

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
            let bestMove = minimax(0, "O");
            boxes[bestMove.index].innerHTML = "O";
            Win();
            Draw();
            Turns();
        }
    }

    function minimax(depth, player) {
        let emptyBoxes = getEmptyBoxes();
        if (checkWin("X")) {
            return { score: -1 };
        } else if (checkWin("O")) {
            return { score: 1 };
        } else if (emptyBoxes.length === 0) {
            return { score: 0 };
        }

        let moves = [];

        for (let i = 0; i < emptyBoxes.length; i++) {
            let move = {};
            move.index = emptyBoxes[i];

            boxes[emptyBoxes[i]].innerHTML = player;

            if (player === "O") {
                let result = minimax(depth + 1, "X");
                move.score = result.score;
            } else {
                let result = minimax(depth + 1, "O");
                move.score = result.score;
            }

            boxes[emptyBoxes[i]].innerHTML = "";

            moves.push(move);
        }

        let bestMove;
        if (player === "O") {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function getEmptyBoxes() {
        return Array.from(boxes).filter(box => box.innerHTML === "").map(box => parseInt(box.dataset.index));
    }

    function checkWin(player) {
        for (let i = 0; i < winConditions.length; i++) {
            let values = winConditions[i].map(index => boxes[index].innerHTML);
            if (values.every(value => value === player)) {
                return true;
            }
        }
        return false;
    }

    function Draw() {
        if (!isGameOver) {
            let isDraw = Array.from(boxes).every(box => box.innerHTML !== "");
            if (isDraw) {
                endGame("Draw");
            }
        }
    }

    function Win() {
        for (let i = 0; i < winConditions.length; i++) {
            let values = winConditions[i].map(index => boxes[index].innerHTML);
            if (values.every(value => value !== "" && value === values[0])) {
                endGame("Player " + turn + " wins!");

                // Update the scores
                if (turn === "X") {
                    playerXWins++;
                } else {
                    playerOWins++;
                }

                // Check if a player has won five games
                if (playerXWins === 5 || playerOWins === 5) {
                    endGame(playerXWins === 5 ? "Player X wins the game!" : "Player O wins the game!");
                    resetScoreboard();
                }

                return;
            }
        }
    }

    function Turns() {
        turn = turn === "X" ? "O" : "X";
    }

    function endGame(message) {
        isGameOver = true;
        alert(message);
        resetGame();
    }

    function resetGame() {
        isGameOver = false;
        boxes.forEach(box => {
            box.innerHTML = "";
        });
        Turns();
        if (turn !== "X") {
            setTimeout(aiMove, 800);
        }
    }

    function resetScoreboard() {
        playerXWins = 0;
        playerOWins = 0;
    }
});

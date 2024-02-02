document.addEventListener("DOMContentLoaded", function () {
    let boxes = document.querySelectorAll(".box");
    let turn = "X";
    let isGameOver = false;
    let playerXWins = 0;
    let playerOWins = 0;
    let difficulty = "";

    // Define win conditions
    let winConditions = [
        [0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17], [18, 19, 20, 21, 22, 23], [24, 25, 26, 27, 28, 29],
        [0, 6, 12, 18, 24], [1, 7, 13, 19, 25], [2, 8, 14, 20, 26], [3, 9, 15, 21, 27], [4, 10, 16, 22, 28], [5, 11, 17, 23, 29],
        [1, 6], [2, 7, 12], [3, 8, 13, 18], [4, 9, 14, 19, 24], [5, 10, 15, 20, 25], [11, 16, 21, 26], [17, 22, 27], [23, 28],
        [4, 11], [3, 10, 17], [2, 9, 16, 23], [1, 8, 15, 22, 29], [0, 7, 14, 21, 28], [6, 13, 20, 27], [12, 19, 26], [18, 25]
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
        let emptyBoxes = Array.from(boxes).filter(box => box.innerHTML === "");
        if (emptyBoxes.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyBoxes.length);
            emptyBoxes[randomIndex].innerHTML = "O";
        }
    }

    function difficultAIMove() {
        let opponentTurn = turn === "X" ? "O" : "X";
        let blockIndex = findBlockingMove(opponentTurn);

        if (blockIndex !== -1) {
            boxes[blockIndex].innerHTML = "O";
        } else {
            easyAIMove();
        }
    }

    function expertAIMove() {
        let winIndex = findWinningMove(turn);
        let blockIndex = findBlockingMove(turn);

        if (winIndex !== -1) {
            boxes[winIndex].innerHTML = turn;
        } else if (blockIndex !== -1) {
            boxes[blockIndex].innerHTML = turn;
        } else {
            easyAIMove();
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
});

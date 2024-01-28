let boxes = document.querySelectorAll(".box");
let turn = "X";
let GameOver = false;

boxes.forEach(e => {
  e.innerHTML = "";
  e.addEventListener("click", () => {
    if (!GameOver && e.innerHTML === "") {
      e.innerHTML = turn;
      gameplay();
    }
  });
});

document.querySelector("#play").style.display = "none";

function gameplay() {
  if (turn === "X") {
    turn = "O";
    document.querySelector(".bg").style.left = "85px";
  } else {
    turn = "X";
    document.querySelector(".bg").style.left = "0";
  }

  let winningConditions = [
    [0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17], [18, 19, 20, 21, 22, 23], [24, 25, 26, 27, 28, 29],
    [0, 6, 12, 18, 24], [1, 7, 13, 19, 25], [2, 8, 14, 20, 26], [3, 9, 15, 21, 27], [4, 10, 16, 22, 28], [5, 11, 17, 23, 29],
    [1, 6], [2, 7, 12], [3, 8, 13, 18], [4, 9, 14, 19, 24], [5, 10, 15, 20, 25], [11, 16, 21, 26], [17, 22, 27], [23, 28],
    [4, 11], [3, 10, 17], [2, 9, 16, 23], [1, 8, 15, 22, 29], [0, 7, 14, 21, 28], [6, 13, 20, 27], [12, 19, 26], [18, 25]
  ];

  for (let i = 0; i < winningConditions.length; i++) {
    let isWin = true;

    for (let j = 0; j < winningConditions[i].length; j++) {
      let index = winningConditions[i][j];
      if (boxes[index].innerHTML !== turn) {
        isWin = false;
      }
    }

    if (isWin) {
      GameOver = true;
      document.querySelector("#results").innerHTML = turn + " Wins";
      document.querySelector("#play").style.display = "inline";

      for (let j = 0; j < winningConditions[i].length; j++) {
        let index = winningConditions[i][j];
        boxes[index].style.backgroundColor = "#08D9D6";
        boxes[index].style.color = "#000";
      }
      return; // Exit the function if a winning condition is met
    }
  }

  if (!GameOver) {
    let isDraw = true;
    boxes.forEach(e => {
      if (e.innerHTML === "") isDraw = false;
    });

    if (isDraw) {
      GameOver = true;
      document.querySelector("#results").innerHTML = "Draw";
      document.querySelector("#play").style.display = "inline";
    }
  }
}

document.querySelector("#play").addEventListener("click", () => {
  GameOver = false;
  turn = "X";
  document.querySelector(".bg").style.left = "0";
  document.querySelector("#results").innerHTML = "";
  document.querySelector("#play").style.display = "none";

  boxes.forEach(e => {
    e.innerHTML = "";
    e.style.removeProperty("background-color");
    e.style.color = "#fff";
  });
});

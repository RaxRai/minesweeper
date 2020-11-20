let startgameinner = document.getElementById("startgame");
let gamecontainerInner = document.getElementById("gamecontainer");
let boardSize = 9;
let gameover = false;
let count = 0;
let board = [];

const generateBoard = () => {
   for (let i = 0; i < boardSize; i++) {
      let arr = [];
      for (let j = 0; j < boardSize; j++) {
         arr.push(1);
      }
      board.push(arr);
   }
   //console.log(board);
};

const restartGame = () => {
   let restartInner = document.getElementById("restart");
   restartInner.classList.remove("hide");
   if (count >= 71) {
      gamecontainerInner.innerText = "you win";
   }
   restartInner.addEventListener("click", () => {
      window.location.reload();
   });
};
const startTimer = () => {
   let mins = 0;
   let secs = 0;
   let minsInner = document.getElementById("mins");
   let secsInner = document.getElementById("secs");
   let intID = setInterval(() => {
      if (gameover || count >= 71) {
         clearInterval(intID);
         return;
      }
      minsInner.innerText = ("00" + mins).substr(-2);
      secsInner.innerText = ("00" + secs).substr(-2);
      secs++;
      if (secs >= 59) {
         secs = 0;
         mins++;
      }
      if (mins >= 59) {
         mins = 0;
      }
   }, 1000);
};

const addBomb = () => {
   let bombCount = 10;
   while (bombCount > 0) {
      let i = Math.floor(Math.random() * 9);
      let j = Math.floor(Math.random() * 9);
      if (board[i][j] === 0) {
         continue;
      }
      board[i][j] = 0;
      bombCount--;
   }
   //console.log(board);
};
const getId = (i, j) => {
   return i.toString() + j.toString();
};

const gameOverBoard = () => {
   document.getElementById("emoji1").classList.add("emoji");
   document.getElementById("emoji1").innerHTML = "☠️";
   for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
         if (board[i][j] === 0) {
            let el = document.getElementById(getId(i, j));
            // el.classList.add("red");
            el.innerText = "💣";
         }
      }
   }
};
const getBombCount = (i, j) => {
   let count = 0;
   //check north
   if (i > 0 && board[i - 1][j] === 0) count++;
   //check south
   if (i < boardSize - 1 && board[i + 1][j] === 0) count++;
   //check west
   if (j > 0 && board[i][j - 1] === 0) count++;
   //check east
   if (j < boardSize - 1 && board[i][j + 1] === 0) count++;
   //check north-east
   if (i > 0 && j < boardSize - 1 && board[i - 1][j + 1] === 0) count++;
   //check south-east
   if (i < boardSize - 1 && j < boardSize - 1 && board[i + 1][j + 1] === 0)
      count++;
   //check north-west
   if (i > 0 && j < boardSize && board[i - 1][j - 1] === 0) count++;
   //check south-west
   if (i < boardSize - 1 && j < boardSize && board[i + 1][j - 1] === 0) count++;

   return count;
};

const handleClick = (event, el, i, j) => {
   //console.log(i + " " + j);
   if (gameover) {
      return;
   }
   if (event.button === 2) {
      //console.log("right click");
      if (board[i][j] === "clicked") {
         return;
      }
      el.innerText = "🚩";
   } else {
      if (board[i][j] === 0) {
         //console.log("you die");
         gameOverBoard();
         gameover = true;
         restartGame();
      } else {
         if (board[i][j] === "clicked") {
            return;
         }
         el.removeEventListener("mousedown", () => handleClick());
         //console.log("you get to have another chance");
         let elBombCount = getBombCount(i, j);
         if (elBombCount > 0) {
            el.innerText = elBombCount;
         } else {
            el.innerText = "";
         }
         el.classList.add("green");
         count++;
         board[i][j] = "clicked";

         if (count >= 71) {
            restartGame();
         }
      }
      document.getElementById("bombcount").innerText = count;
   }
};

const renderBoard = () => {
   for (let i = 0; i < boardSize; i++) {
      let row = document.createElement("div");
      row.classList.add("row");
      for (let j = 0; j < boardSize; j++) {
         let col = document.createElement("div");
         col.className = "cell center";
         col.id = i + "" + j;
         //col.innerText = i + "" + j;
         col.addEventListener("mousedown", (event) =>
            handleClick(event, col, i, j)
         );
         row.appendChild(col);
      }
      gamecontainerInner.appendChild(row);
   }
};

const startGame = () => {
   startgameinner.classList.add("hide");
   gamecontainerInner.classList.remove("hide");
   generateBoard();
   renderBoard();
   addBomb();
   startTimer();
};

startgameinner.addEventListener("click", startGame);

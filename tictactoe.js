let playerO = "O";
let playerX = "X";
let currPlayer = playerO;

//               0   1   2   3   4   5   6   7   8
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameCells;  //array of div cells with indices 0-8

let winningConditions = [
    [0, 1, 2], //horizontal row 1
    [3, 4, 5], //horizontal row 2
    [6, 7, 8], //horizontal row 3
    [0, 3, 6], //vertical column 1
    [1, 4, 7], //vertical column 2
    [2, 5, 8], //vertical column 3
    [0, 4, 8], //diagonal
    [2, 4, 6]  //anti-diagonal
];

let restartGameButton;
let gameOver = false;


function placeCell() {
    if (gameOver || !gameStarted) {
        return;
    }

    const index = parseInt(this.getAttribute("data-cell-index"));
    if (gameBoard[index] !== "") {
        return;
    }

    gameBoard[index] = currPlayer; //mark the board
    this.innerText = currPlayer;   //mark the board on html    

    //change players
    currPlayer = (currPlayer == playerO) ? playerX : playerO;

    //check winner
    checkWinner();
}

function checkWinner() {
    for (let winCondition of winningConditions) {
        let a = gameBoard[winCondition[0]];
        let b = gameBoard[winCondition[1]];
        let c = gameBoard[winCondition[2]];

        if (a == b && b == c && a != "") {
            //update styling for winning cells
            for (let i = 0; i < gameBoard.length; i++) {
                if (winCondition.includes(i)) {
                    gameCells[i].classList.add("winning-game-cell");
                }
            }
            gameOver = true;
            return;
        }
    }
}

function restartGame() {
    gameOver = false;
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    for (let cell of gameCells) {
        cell.innerText = "";
        cell.classList.remove("winning-game-cell");
    }
}   

let startButton;
let scoreO = 0;
let scoreX = 0;
let gameStarted = false;

// START BUTTON
window.onload = function () {
    gameCells = document.getElementsByClassName("game-cell");

    for (let cell of gameCells) {
        cell.addEventListener("click", placeCell);
    }

    console.log("Game loaded");

    restartGameButton = document.getElementById("game-restart-button");
    restartGameButton.addEventListener("click", restartGame);

    startButton = document.getElementById("start-button");
    console.log("Start button:", startButton);
    
    
    toggleBoard(false);

    startButton.onclick = function () {
        console.log("START CLICKED");
        gameStarted = true; 
        toggleBoard(true); 
    };
    
    updateTurnDisplay();
};

// enable / disable board
function toggleBoard(state) {
    if (!gameCells) return;

    for (let i = 0; i < gameCells.length; i++) {
        gameCells[i].style.pointerEvents = state ? "auto" : "none";
        gameCells[i].style.opacity = state ? "1" : "0.5";
    }
}

// TURN DISPLAY
function updateTurnDisplay() {
    document.getElementById("player-turn").innerText = "Current Turn: " + currPlayer;
}

// UPDATE SCORE
function updateScore(winner) {
    if (winner === playerO) {
        scoreO++;
        document.getElementById("scoreO").innerText = scoreO;
    } else if (winner === playerX) {
        scoreX++;
        document.getElementById("scoreX").innerText = scoreX;
    }
}

// HOOK placeCell 
let originalPlaceCell = placeCell;
placeCell = function () {
    originalPlaceCell.call(this); 

    if (!gameOver) {
        updateTurnDisplay();
    }

    checkDraw();
};

// DRAW DETECTION
function checkDraw() {
    if (gameOver) return;

    let isDraw = gameBoard.every(cell => cell !== "");

    if (isDraw) {
        document.getElementById("player-turn").innerText = "Draw!";
        gameOver = true;
    }
}

// HOOK checkWinner 
let originalCheckWinner = checkWinner;
checkWinner = function () {
    originalCheckWinner();

    for (let condition of winningConditions) {
        let a = gameBoard[condition[0]];
        let b = gameBoard[condition[1]];
        let c = gameBoard[condition[2]];

        if (a === b && b === c && a !== "") {
            updateScore(a);
            document.getElementById("player-turn").innerText = "Winner: " + a;
            break;
        }
    }
};

// HOOK restartGame 
let originalRestartGame = restartGame;
restartGame = function () {
    originalRestartGame();
    currPlayer = playerO;
    
    gameStarted = true; 
    toggleBoard(truegit); 
    
    updateTurnDisplay();
};
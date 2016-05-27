var session = new QiSession();

var grid = new Array();
var gameOver = 0;
var difficulty = 0;

var playerCharacter = 'X';
var aiCharacter = 'O';
var aiThinking = 0;

function init(){
  initGame();

  session.service("ALMemory").done(function (ALMemory) {
    ALMemory.subscriber("TicTacToe/MakeMove").done(function(subscriber) {
      subscriber.signal.connect(makeAIMove);
    });

    ALMemory.subscriber("TicTacToe/RestartGame").done(function(subscriber) {
      subscriber.signal.connect(initGame);
    });
  });


  // Test ajax
  $.ajax({
        url: "http://localhost:8888/index.php",
        type: "GET",
        // data: dataQuery,
        dataType: "json",
        success: function(responseData) {
            console.log(responseData);
            console.table(responseData);
            // companySelectHandler(responseData);
        },
        error: function(xhr,status,error) {
          console.log("ERROR");
          console.table([xhr, status, error]);
          console.log(xhr);
          console.log(status);
          console.log(error);
        }
    });
}

function initGame(){
  resetGrid();

  document.getElementById("modal").style.display = "none";

  gameOver = 0;

  console.log("new game");
}

function raiseEvent(event, value = 1){
	session.service("ALMemory").done(function (ALMemory) {
		ALMemory.raiseEvent('TicTacToe/' + event, value);
	});
}

function pepperThinking() {
  aiThinking = 1;
	raiseEvent('AIThinking');
}

function youWin(){
  $('#gameover-result').html('You win!');
  raiseEvent('GameEnd', 'WIN');
  endGame();
}

function youLose(){
  $('#gameover-result').html('You lose!');
  raiseEvent('GameEnd', 'LOSE');
  endGame();
}

function drawGame(){
  $('#gameover-result').html('Draw game!');
  raiseEvent('GameEnd', 'DRAW');
  endGame();
}

function fillCell(move, cellNumber){
  cellType = (move == 'X') ? 'cross' : 'circle';
  document.getElementById("cell"+cellNumber).className = "button " + cellType;
  grid[cellNumber] = move;

  if(checkWin(playerCharacter)) {
    youWin();
  } else if(checkWin(aiCharacter)){
    youLose();
  } else if(checkDraw()){
    drawGame();
  } else if (move == playerCharacter) {
    pepperThinking();
  }
}

function playerClickCell(cellNumber){
  if(gameOver == 0 && aiThinking == 0 && grid[cellNumber] == "") {
    fillCell(playerCharacter, cellNumber);
  }
}

function checkWin(move){
  if ((grid[0] == move && grid[1] == move && grid[2] == move) ||
      (grid[0] == move && grid[4] == move && grid[8] == move) ||
      (grid[0] == move && grid[3] == move && grid[6] == move) ||
      (grid[1] == move && grid[4] == move && grid[7] == move) ||
      (grid[3] == move && grid[4] == move && grid[5] == move) ||
      (grid[2] == move && grid[4] == move && grid[6] == move) ||
      (grid[2] == move && grid[5] == move && grid[8] == move) ||
      (grid[6] == move && grid[7] == move && grid[8] == move) ) {
    return true;
  }
}

function checkDraw(){
  if (grid[0] != "" &&
    grid[1] != "" &&
    grid[2] != "" &&
    grid[3] != "" &&
    grid[4] != "" &&
    grid[5] != "" &&
    grid[6] != "" &&
    grid[7] != "" &&
    grid[8] != "") {
    return true;
  }
}

function makeAIMove(){
  console.log("make ai move");
  if (difficulty == 0) {
    fillCell(aiCharacter, getRandomEmptyCell());
    aiThinking = 0;
  }
}

function resetGrid(){
  for(i = 0 ; i < 9; i++){
    document.getElementById("cell"+i).className = "button";
    grid[i] = '';
  }
}

function endGame(){
  gameOver = 1;
  document.getElementById("modal").style.display = "flex";
}

function getRandomEmptyCell(){
  var emptyCells = [];

  for(i = 0 ; i < 9; i++){
    if(grid[i] == "") {
      emptyCells.push(i);
    }
  }

  return emptyCells.randomElement();
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}
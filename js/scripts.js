//Business Logic for Game
function PigDiceGame() {
  this.players = [];
  this.scoreToWin = 100;
  this.playerTurn = 1;
};

PigDiceGame.prototype.addPlayer = function(player){
  this.players.push(player);
};

PigDiceGame.prototype.playerTurnChange = function(){
  if (this.playerTurn === 1){
    this.playerTurn = 2;
  } else {
    this.playerTurn = 1;
  };
};

PigDiceGame.prototype.playerRoll = function(){
  let roll = getRandomInt(1, 6);
  
  switch(this.playerTurn){
  case 1:
    if (roll === 1){
      this.playerTurnChange();
      this.players[0].currentScore = 0;
      return roll;
    } else { 
      this.players[0].currentScore += roll;
      return roll;
    };
  case 2:
    if (roll === 1){
      this.playerTurnChange();
      this.players[1].currentScore = 0;
      return roll;
    } else { 
      this.players[1].currentScore += roll;
      return roll;
    };
  };
};

PigDiceGame.prototype.playerHold = function(){
  switch(this.playerTurn){
  case 1:
    this.players[0].totalScore += this.players[0].currentScore;
    this.players[0].currentScore = 0;
    this.playerTurnChange();
    break;
  case 2:
    this.players[1].totalScore += this.players[1].currentScore;
    this.players[1].currentScore = 0;
    this.playerTurnChange();
    break;
  };
};

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
  
//Business logic for Player
function Player(){
  this.currentScore = 0;
  this.totalScore = 0;
};

Player.prototype.roll = function(pigDiceGame){
  let roll = getRandomInt(1, 6);
  if (roll === 1){
    pigDiceGame.playerTurnChange();
    this.currentScore = 0;
  } else { 
    this.currentScore += roll;
  };
}

Player.prototype.hold = function(pigDiceGame){
  this.totalScore += this.currentScore;
  this.currentScore = 0;
  pigDiceGame.playerTurnChange();
}

// checks game state and rolls or holds for AI
Player.prototype.aiRoll = function(pigDiceGame){
  return new Promise((resolve) => {
    while (pigDiceGame.playerTurn === 2) {
      if (this.currentScore + this.totalScore >= 100){
        this.hold(pigDiceGame)
      } else if (pigDiceGame.players[0].totalScore > this.totalScore){
        if (this.currentScore + this.totalScore >= pigDiceGame.players[0].totalScore){
          this.hold(pigDiceGame)
        } else {
          this.roll(pigDiceGame)
        }
      } else if (pigDiceGame.players[0].totalScore <= this.totalScore) {
        if (this.currentScore < 20){
          this.roll(pigDiceGame)
        } else {
          this.hold(pigDiceGame)
        };
      };
    };
    resolve();
  });
};

//User Interface Logic
//Dice Roll display
function showDice(roll) {
  return new Promise((resolve) => {
    switch (roll){
    case 1:
      $("#diceTwo, #diceThree, #diceFour, #diceFive, #diceSix").hide();
      $("#diceOne").show();
      break;
    case 2:
      $("#diceOne, #diceThree, #diceFour, #diceFive, #diceSix").hide();
      $("#diceTwo").show();
      break;
    case 3:
      $("#diceOne, #diceTwo, #diceFour, #diceFive, #diceSix").hide();
      $("#diceThree").show();
      break;
    case 4:
      $("#diceOne, #diceTwo, #diceThree, #diceFive, #diceSix").hide();
      $("#diceFour").show();
      break;
    case 5:
      $("#diceOne, #diceTwo, #diceThree, #diceFour, #diceSix").hide();
      $("#diceFive").show();
      break;
    case 6:
      $("#diceOne, #diceTwo, #diceThree, #diceFour, #diceFive").hide();
      $("#diceSix").show();
      break;
    default:
      alert("Something has gone horribly wrong.");
    }
    resolve();
  })
};

//Checks if there is a Winner
function isWinner(pigDice, playerOne, playerTwo){
  if (playerOne.totalScore >= pigDice.scoreToWin){
    $("#rollPlayer, #holdPlayer, #holdAI, #rollAI").hide();
    $("#startOver").show();
    return "PLAYER ONE WINS";
  } else if (playerTwo.totalScore >= pigDice.scoreToWin){
    $("#rollPlayer, #holdPlayer, #holdAI, #rollAI").hide();
    $("#startOver").show();
    return "PLAYER TWO WINS";
  };
};

//dice rolling animation
function cycleDiceImgs() {
  for (i = 0; i <= 10; i++) {
    setTimeout(function(){showDice(getRandomInt(1, 6))}, 100 * i)
  }
  return new Promise(resolve => {setTimeout (function() {resolve()}, 1000)});
};

//Updates scoreboard
function displayScore(p1, p2) {
  $("#p1-current-score").text(p1.currentScore);
  $("#p2-current-score").text(p2.currentScore);
  $("#p1-total-score").text(p1.totalScore);
  $("#p2-total-score").text(p2.totalScore);
};

$(document).ready(function() {
  let pigDice = new PigDiceGame();
  let playerOne = new Player();
  let playerTwo = new Player();
  pigDice.addPlayer(playerOne);
  pigDice.addPlayer(playerTwo);
  $("#player-turn").text(pigDice.playerTurn);

  $("#playVsPlayer").submit(async function() {
    event.preventDefault();
    $("div.gameBoard").show()
    $("div.playerSelect").hide()
    $("#rollAI").hide()
    $("#holdAI").hide()
  });

  $("#playVsComputer").submit(async function() {
    event.preventDefault();
    $("div.gameBoard").show()
    $("div.playerSelect").hide()
    $("#rollPlayer").hide()
    $("#holdPlayer").hide()
  });

  $("#rollPlayer").submit(async function() {
    event.preventDefault();
    await cycleDiceImgs()
    await showDice(pigDice.playerRoll());
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#holdPlayer").submit(async function() {
    event.preventDefault();
    pigDice.playerHold();
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#rollAI").submit(async function() {
    event.preventDefault();
    await cycleDiceImgs()
    await showDice(pigDice.playerRoll());
    await playerTwo.aiRoll(pigDice)
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#holdAI").submit(async function() {
    event.preventDefault();
    pigDice.playerHold();
    await playerTwo.aiRoll(pigDice)
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#startOver").click(function() {
    location.reload();
  });
});
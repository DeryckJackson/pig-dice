//Business Logic for Game
function PigDiceGame() {
  this.players = [];
  this.turnNumber = 0;
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

//PigDiceGame.prototype.onRoll = function(player){
//  let roll = getRandomInt(1, 6);
//
//  if (roll === 1){
//    this.playerTurnChange();
//    player.currentScore = 0;
//    return roll;
//  } else { 
//    player.currentScore += roll;
//    return roll;
//  };
//};

PigDiceGame.prototype.Roll = function() {

}

PigDiceGame.prototype.onHold = function(player){
  player.totalScore += player.currentScore;
  player.currentScore = 0;
  this.playerTurnChange();
};

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Business logic for AI
function Ai(){
  this.currentScore = 0
  this.totalScore = 0
  // This might be redunant
  this.isTurn = false
}

Ai.prototype.rollDice = function(pigDiceGame) {
  let roll = getRandomInt(1, 6);

  if (roll === 1){
    pigDiceGame.playerTurnChange();
    this.currentScore = 0;
    return roll;
  } else { 
    this.currentScore += roll;
    return roll;
  };

}

// -move to UI logic- checks if AI turn, rolls until current score 20
function aiRollCheck(pigDiceGame, aiPlayer){
  return new Promise((resolve) => {
    while (pigDiceGame.playerTurn === 2) {
      if (aiPlayer.currentScore + aiPlayer.TotalScore >= 100 || aiPlayer.currentScore > 20){
        pigDiceGame.onHold(aiPlayer)
      } else {
        aiPlayer.rollDice(pigDiceGame)
      }
    }
    resolve();
  })
}
  
//Business logic for Player
function Player(){
  this.currentScore = 0;
  this.totalScore = 0;
};

Player.prototype.addCurrentToTotal = function() {
  this.totalScore += this.currentScore;
};

function playerHold(pigDice, playerOne, playerTwo){
  if (pigDice.playerTurn === 1) {
    pigDice.onHold(playerOne);
  } else {
    pigDice.onHold(playerTwo);
  };
};

function playerRoll(pigDice, playerOne, playerTwo){
  let roll = getRandomInt(1, 6);
  
  switch(pigDice.playerTurn){
  case 1:
    if (roll === 1){
      pigDice.playerTurnChange();
      playerOne.currentScore = 0;
      return roll;
    } else { 
      playerOne.currentScore += roll;
      return roll;
    };
  case 2:
    if (roll === 1){
      pigDice.playerTurnChange();
      playerTwo.currentScore = 0;
      return roll;
    } else { 
      playerTwo.currentScore += roll;
      return roll;
    };
  };
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
    $("#roll, #hold").hide();
    $("#startOver").show();
    return "PLAYER ONE WINS";
  } else if (playerTwo.totalScore >= pigDice.scoreToWin){
    $("#roll, #hold").hide();
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
  let playerTwo
  pigDice.addPlayer(playerOne);
  pigDice.addPlayer(playerTwo);
  $("#player-turn").text(pigDice.playerTurn);
  

  $("#playVsPlayer").submit(async function() {
    event.preventDefault();
    playerTwo = new Player();
    $("div.gameBoard").show()
    $("div.playerSelect").hide()
    $("#rollAI").hide()
    $("#holdAI").hide()
  });

  $("#playVsComputer").submit(async function() {
    event.preventDefault();
    playerTwo = new Ai();
    $("div.gameBoard").show()
    $("div.playerSelect").hide()
    $("#rollPlayer").hide()
    $("#holdPlayer").hide()
  });

  $("#rollPlayer").submit(async function() {
    event.preventDefault();
    await cycleDiceImgs()
    await showDice(playerRoll(pigDice, playerOne, playerTwo));
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#holdPlayer").submit(async function() {
    event.preventDefault();
    playerHold(pigDice, playerOne, playerTwo);
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#rollAI").submit(async function() {
    event.preventDefault();
    await cycleDiceImgs()
    await showDice(playerRoll(pigDice, playerOne, playerTwo));
    await aiRollCheck(pigDice, playerTwo)
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#holdAI").submit(async function() {
    event.preventDefault();
    playerHold(pigDice, playerOne, playerTwo);
    await aiRollCheck(pigDice, playerTwo)
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#startOver").click(function() {
    location.reload();
  });
});
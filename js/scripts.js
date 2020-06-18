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

PigDiceGame.prototype.Roll = function() {

}

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Business logic for AI
//function Ai(){
//  this.currentScore = 0
//  this.totalScore = 0
//}

// -move to UI logic- checks if AI turn, rolls until current score 20
Player.prototype.aiRollCheck = function(pigDiceGame){
  return new Promise((resolve) => {
    while (pigDiceGame.playerTurn === 2) {
      if (this.currentScore + this.TotalScore >= 100 || this.currentScore > 20){
        this.totalScore += this.currentScore;
        this.currentScore = 0;
        pigDiceGame.playerTurnChange();
      } else {
        let roll = getRandomInt(1, 6);
        if (roll === 1){
          pigDiceGame.playerTurnChange();
          this.currentScore = 0;
        } else { 
          this.currentScore += roll;
        };
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
    //playerTwo = new Player();
    $("div.gameBoard").show()
    $("div.playerSelect").hide()
    $("#rollAI").hide()
    $("#holdAI").hide()
  });

  $("#playVsComputer").submit(async function() {
    event.preventDefault();
    //playerTwo = new Ai();
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
    pigDice.playerHold();
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#rollAI").submit(async function() {
    event.preventDefault();
    await cycleDiceImgs()
    await showDice(playerRoll(pigDice, playerOne, playerTwo));
    await playerTwo.aiRollCheck(pigDice)
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#holdAI").submit(async function() {
    event.preventDefault();
    pigDice.playerHold();
    await playerTwo.aiRollCheck(pigDice)
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#startOver").click(function() {
    location.reload();
  });
});
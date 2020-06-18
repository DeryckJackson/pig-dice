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

PigDiceGame.prototype.onRoll = function(player){
  let roll = getRandomInt(1, 6);

  if (roll === 1){
    this.playerTurnChange();
    player.currentScore = 0;
    return roll;
  } else { 
    player.currentScore += roll;
    return roll;
  };
};

PigDiceGame.prototype.onHold = function(player){
  player.totalScore += player.currentScore;
  player.currentScore = 0;
  this.playerTurnChange();
};

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
  if (pigDice.playerTurn === 1) {
    return pigDice.onRoll(playerOne);
  } else {
    return pigDice.onRoll(playerTwo);
  };
};


//User Interface Logic
function showDice(roll) {
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
  };
};

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

function cycleDiceImgs() {
  for (i = 0; i <= 10; i++) {
    setTimeout(function(){showDice(getRandomInt(1, 6))}, 100 * i)
  }
  return new Promise(resolve => {setTimeout (function() {resolve()}, 1000)});
};

function displayScore(p1, p2) {
  $("#p1-current-score").text(p1.currentScore);
  $("#p2-current-score").text(p2.currentScore);
  $("#p1-total-score").text(p1.totalScore);
  $("#p2-total-score").text(p2.totalScore);
};

//async function animationAwaitOutput(pigDice, playerOne, playerTwo){
//  await cycleDiceImgs()
//  showDice(playerRoll(pigDice, playerOne, playerTwo));
//  displayScore(playerOne, playerTwo)
//  $("#player-turn").text(pigDice.playerTurn);
//};

$(document).ready(function() {
  let pigDice = new PigDiceGame();
  let playerOne = new Player();
  let playerTwo = new Player();
  pigDice.addPlayer(playerOne);
  pigDice.addPlayer(playerTwo);
  $("#player-turn").text(pigDice.playerTurn);
  
  $("#roll").submit(async function() {
    event.preventDefault();
    await cycleDiceImgs()
    showDice(playerRoll(pigDice, playerOne, playerTwo));
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
  });

  $("#hold").submit(function() {
    event.preventDefault();
    playerHold(pigDice, playerOne, playerTwo);
    displayScore(playerOne, playerTwo)
    $("#player-turn").text(pigDice.playerTurn);
    $("div.winner").children("h3").append(isWinner(pigDice, playerOne, playerTwo));
  });

  $("#startOver").click(function() {
    location.reload();
  });
});
//Business Logic for Game
function PigDiceGame() {
  this.players = [];
  this.turnNumber = 0;
  this.scoreToWin = 100
  this.playerTurn = 1
}

PigDiceGame.prototype.addPlayer = function(player){
  this.players.push(player)
}

PigDiceGame.prototype.playerTurnChange = function(){
  if (this.playerTurn === 1){
    this.playerTurn = 2
  } else {
    this.playerTurn = 1
  }
}

PigDiceGame.prototype.onRoll = function(player){
  let roll = getRandomInt(1, 6)

  if (roll === 1){
    this.playerTurnChange()
    return roll
  } else { 
    player.currentScore += roll
    return roll
  }
}

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


//Business logic for Player
function Player(){
  this.currentScore = 0
  this.totalScore = 0
}

Player.prototype.addCurrentToTotal = function() {
  this.totalScore += this.currentScore
}


//User Interface Logic
function playerRoll(pigDice, playerOne, playerTwo){
  if (pigDice.playerTurn === 1) {
    return pigDice.onRoll(playerOne)
  } else {
    return pigDice.onRoll(playerTwo)
  }
}

$(document).ready(function() {
  //event.preventDefault()
  let pigDice = new PigDiceGame();
  let playerOne = new Player();
  let playerTwo = new Player();
  pigDice.addPlayer(playerOne);
  pigDice.addPlayer(playerTwo);
  $("#player-turn").text(pigDice.playerTurn)
  
  $("#roll").submit(function() {
    event.preventDefault()
    $("div.dice").text(playerRoll(pigDice, playerOne, playerTwo))


    $("#p1-current-score").text(playerOne.currentScore)
    $("#p2-current-score").text(playerTwo.currentScore)
    $("#player-turn").text(pigDice.playerTurn)
  })

  $("#hold").submit(function() {
    event.preventDefault()
    $("#player-turn").text(pigDice.playerTurn)
  })
})
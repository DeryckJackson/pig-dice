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

PigDiceGame.prototype.onRoll = function(roll, player){
  if (roll === 1){
    this.playerTurnChange()
    return false
  } else { 
    player.currentScore += roll
    return true
  }
}

//Business logic for Player
function Player(){
  this.currentScore = 0
  this.totalScore = 0
}

Player.prototype.addCurrentToTotal = function() {
  this.totalScore += this.currentScore
}




$(document).ready(function() {
  event.preventDefault()
  let pigDice = new PigDiceGame();
  let playerOne = new Player();
  let playerTwo = new Player();
  pigDice.addPlayer(playerOne);
  pigDice.addPlayer(playerTwo);
  $("#player-turn").text(pigDice.playerTurn)
  
  $("#roll").submit(function() {
    
    $("#player-turn").text(pigDice.playerTurn)
  })

  $("#hold").submit(function() {
    
    $("#player-turn").text(pigDice.playerTurn)
  })

  //User Interface
})
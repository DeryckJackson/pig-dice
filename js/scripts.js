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
    player.currentScore = 0
    return roll
  } else { 
    player.currentScore += roll
    return roll
  }
}

PigDiceGame.prototype.onHold = function(player){
  player.totalScore += player.currentScore
  player.currentScore = 0
  this.playerTurnChange()
}

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
0

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

function playerHold(pigDice, playerOne, playerTwo){
  if (pigDice.playerTurn === 1){
    pigDice.onHold(playerOne)
  } else{
    pigDice.onHold(playerTwo)
  }
}

function isWinner(playerOne, playerTwo){
  if (playerOne.totalScore >= 10){
    $("#roll").toggle()
    $("#hold").toggle()
    $("#startOver").show()
    return "PLAYER ONE WINS"
  } else if (playerTwo.totalScore >= 10){
    $("#roll").toggle()
    $("#hold").toggle()
    $("#startOver").show()
    return "PLAYER TWO WINS"
  } 
}

$(document).ready(function() {
  let pigDice = new PigDiceGame();
  let playerOne = new Player();
  let playerTwo = new Player();
  pigDice.addPlayer(playerOne);
  pigDice.addPlayer(playerTwo);
  $("#player-turn").text(pigDice.playerTurn);
  
  $("#roll").submit(function() {
    event.preventDefault()
    $("div.dice").text(playerRoll(pigDice, playerOne, playerTwo))
    $("#p1-current-score").text(playerOne.currentScore)
    $("#p2-current-score").text(playerTwo.currentScore)
    $("#player-turn").text(pigDice.playerTurn)
  })

  $("#hold").submit(function() {
    event.preventDefault()
    playerHold(pigDice, playerOne, playerTwo)
    $("#p1-current-score").text(playerOne.currentScore)
    $("#p2-current-score").text(playerTwo.currentScore)
    $("#p1-total-score").text(playerOne.totalScore)
    $("#p2-total-score").text(playerTwo.totalScore)
    $("#player-turn").text(pigDice.playerTurn)
    $("div.dice").text(isWinner(playerOne, playerTwo))
  })

  $("#startOver").click(function() {
    location.reload()
  })
})
var EightBallGame = function () {
  this.numberedBallsOnTable = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  this.turn = 'player1';
  this.sides = {
    'player1': '?',
    'player2': '?'
  };

  this.pocketingOccurred = false;

  this.state = 'notstarted';

  this.ticker = undefined;

  gui.setupGameHud();
  setTimeout(this.startTurn, 2000);
}

EightBallGame.prototype.startTurn = function () {
  if (eightballgame.state == 'gameover') {
    return;
  }
  // enable movement
  eightballgame.timer = 30;
  eightballgame.state = 'turn';
  gui.updateTurn(eightballgame.turn);
  gui.updateBalls(eightballgame.numberedBallsOnTable, eightballgame.sides.player1, eightballgame.sides.player2);

  eightballgame.tickTimer();
}

EightBallGame.prototype.whiteBallEnteredHole = function () {
  gui.log("White ball pocketed by " + eightballgame.turn + "!");
}

EightBallGame.prototype.coloredBallEnteredHole = function (name) {
  if (typeof name === 'undefined') return;
  var ballno = 0;
  for (var i = 0; i < eightballgame.numberedBallsOnTable.length; i++) {
    if (name == eightballgame.numberedBallsOnTable[i] + 'ball') {
      ballno = eightballgame.numberedBallsOnTable[i];
      eightballgame.numberedBallsOnTable.splice(i, 1);
      break;
    }
  }
  if (ballno == 0) {
    return;
  }

  if (ballno == 8) {
    const predicate = eightballgame.sides[eightballgame.turn] === 'solid' ? (x => x < 8) : (x => x > 8);
    let message, winner;
    if (eightballgame.numberedBallsOnTable.filter(predicate).length > 1) {
      winner = eightballgame.turn == 'player1' ? 'Player2' : 'Player1';
      message = "Game over! 8 ball pocketed too early by " + this.turn;
    }else{
      winner = eightballgame.turn == 'player1' ? 'Player1' : 'Player2';
      message = `Game over! ${winner} pocketed the 8 ball!`;
    }

    eightballgame.state = 'gameover';
    eightballgame.pocketingOccurred = true;
    clearTimeout(eightballgame.ticker);

    gui.showEndGame(winner, message);
  } else {
    if (eightballgame.sides.player1 == '?' || eightballgame.sides.player2 == '?') {
      eightballgame.sides[eightballgame.turn] = ballno < 8 ? 'solid' : 'striped';
      eightballgame.sides[eightballgame.turn == 'player1' ? 'player2' : 'player1'] = ballno > 8 ? 'solid' : 'striped';
      eightballgame.pocketingOccurred = true;
    } else {
      if ((eightballgame.sides[eightballgame.turn] == 'solid' && ballno < 8) || (eightballgame.sides[eightballgame.turn] == 'striped' && ballno > 8)) {
        // another turn
        eightballgame.pocketingOccurred = true;
      } else {
        eightballgame.pocketingOccurred = false;
        gui.log(eightballgame.turn + " pocketed opponent's ball!");
      }
    }
  }
}

EightBallGame.prototype.tickTimer = function () {
  gui.updateTimer(eightballgame.timer);
  if (eightballgame.timer == 0) {
    gui.log(eightballgame.turn + " ran out of time");
    eightballgame.state = "outoftime";
    eightballgame.switchSides();
  } else {
    eightballgame.timer--;
    eightballgame.ticker = setTimeout(eightballgame.tickTimer, 1000);
  }
}

EightBallGame.prototype.switchSides = function () {
  eightballgame.turn = eightballgame.turn == 'player1' ? 'player2' : 'player1';

  setTimeout(eightballgame.startTurn, 1000);
}

EightBallGame.prototype.hitButtonClicked = function (strength) {
  if (game.balls[0].rigidBody.sleepState == CANNON.Body.SLEEPING && eightballgame.state == 'turn') {
    game.ballHit(strength);
    clearTimeout(eightballgame.ticker);
    eightballgame.state = 'turnwaiting';
    setTimeout(() => {
      var x = setInterval(function () {
        if (game.balls[0].rigidBody.sleepState != CANNON.Body.SLEEPING) return;
        for (var i = 1; i < game.balls.length; i++) {
          if (game.balls[i].rigidBody.sleepState != CANNON.Body.SLEEPING && eightballgame.numberedBallsOnTable.indexOf(Number(game.balls[i].name.split('ball')[0])) > -1) {
            return;
          }
        }
  
        if (eightballgame.pocketingOccurred) {
          setTimeout(eightballgame.startTurn, 1000);
        } else {
          eightballgame.switchSides();
        }
  
        eightballgame.pocketingOccurred = false;
  
        clearInterval(x);
      }, 30);
    }, 1000);
  }
}
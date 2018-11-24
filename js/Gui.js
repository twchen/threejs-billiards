class GameGui {
  constructor() {
    var hitBtn = document.getElementById('hitBtn');
    hitBtn.onclick = function () {
      eightballgame.hitButtonClicked(Number(document.getElementById('range_strength').value));
    };
    if (debug) document.getElementById('fps_stats_container').appendChild(stats.domElement);
  }

  setupGameHud() {
    this.hide(document.getElementById('mainMenu'));
    this.show(document.getElementById('controlsHud'));
  }

  show(node) {
    GameGui.removeClass(node, 'hide');
  }

  hide(node) {
    GameGui.addClass(node, 'hide');
  }

  play8BallClicked() {
    eightballgame = new EightBallGame();
  }

  updateTimer(timerVal) {
    document.getElementsByClassName('timer')[0].textContent = timerVal;
  }

  log(str) {
    var node = document.createElement('li');
    node.textContent = str;
    document.getElementsByClassName('gamelog')[0].appendChild(node);
  }

  updateTurn(str) {
    GameGui.removeClass(document.getElementsByClassName('player1')[0], 'active');
    GameGui.removeClass(document.getElementsByClassName('player2')[0], 'active');
    GameGui.addClass(document.getElementsByClassName(str)[0], 'active');
  }

  updateBalls(ballArr, p1side, p2side) {
    p1side = p1side == '?' ? 'unknown' : p1side;
    p2side = p2side == '?' ? 'unknown' : p2side;

    GameGui.removeClass(document.getElementsByClassName('player1')[0], 'solid');
    GameGui.removeClass(document.getElementsByClassName('player2')[0], 'solid');
    GameGui.removeClass(document.getElementsByClassName('player1')[0], 'striped');
    GameGui.removeClass(document.getElementsByClassName('player2')[0], 'striped');
    GameGui.removeClass(document.getElementsByClassName('player1')[0], 'unknown');
    GameGui.removeClass(document.getElementsByClassName('player2')[0], 'unknown');
    GameGui.addClass(document.getElementsByClassName('player1')[0], p1side);
    GameGui.addClass(document.getElementsByClassName('player2')[0], p2side);

    if (p1side == 'unknown') {
      return;
    }

    var elem = document.createElement('ul');
    for (var i = 1; i < 8; i++) {
      var el = document.createElement('li');
      el.textContent = i;
      if (ballArr.indexOf(i) > -1) {

      } else {
        GameGui.addClass(el, 'pocketed');
      }

      elem.appendChild(el);
    }
    document.getElementsByClassName(p1side == 'solid' ? 'player1' : 'player2')[0].replaceChild(elem, document.getElementsByClassName(p1side == 'solid' ? 'player1' : 'player2')[0].children[1]);
    elem = document.createElement('ul');
    for (var i = 9; i < 16; i++) {
      var el = document.createElement('li');
      el.textContent = i;
      if (ballArr.indexOf(i) > -1) {

      } else {
        GameGui.addClass(el, 'pocketed');
      }

      elem.appendChild(el);
    }
    document.getElementsByClassName(p1side == 'striped' ? 'player1' : 'player2')[0].replaceChild(elem, document.getElementsByClassName(p1side == 'striped' ? 'player1' : 'player2')[0].children[1]);
  }

  showEndGame(winner, message) {
    document.getElementById("gameover").children[0].innerHTML = `${message}<br>${winner} won!`
    this.show(document.getElementById('gameover'));
  }
}

GameGui.addClass = function (el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
};

GameGui.removeClass = function (el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};
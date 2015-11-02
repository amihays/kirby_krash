(function () {
  window.BB = window.BB || {};

  var GameView = BB.GameView = function(ctx) {
    this.game = new BB.Game(this.lost.bind(this));
    this.ctx = ctx;
    this.intervalID;
  }

  GameView.prototype.newGame = function () {
    clearInterval(this.intervalID);
    this.game = new BB.Game(this.lost.bind(this));
    this.intervalID = setInterval(function(){
      this.game.step(this.ctx);
    }.bind(this), 10);
  }

  GameView.prototype.lost = function () {
    this.newGame();
  }

  GameView.prototype.bindKeyHandlers = function () {
    var gameView = this;
    key("space", function(){ gameView.game.togglePaused(); return false; });
    key("p", function(){ gameView.newGame(); return false; });
  }

  GameView.prototype.start = function(){
    this.bindKeyHandlers();
    this.intervalID = setInterval(function(){
      this.game.step(this.ctx, this.secondGame);
    }.bind(this), 10);
  }
})();

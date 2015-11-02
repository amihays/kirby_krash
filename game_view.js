(function () {
  window.BB = window.BB || {};

  var GameView = BB.GameView = function(ctx) {
    this.game = new BB.Game();
    this.ctx = ctx;
    this.intervalID;
  }

  GameView.prototype.start = function(){
    var gameView = this;
    this.intervalID = setInterval(function(){
      gameView.game.step(gameView.ctx, this.end.bind(this));
    }.bind(this), 10);
  }

  GameView.prototype.end = function () {
    clearInterval(this.intervalID);
  }
})();

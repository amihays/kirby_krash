(function () {
  window.BB = window.BB || {};

  var GameView = BB.GameView = function(ctx) {
    this.game = new BB.Game();
    this.ctx = ctx;
    this.intervalID;
  }

  GameView.prototype.bindKeyHandlers = function () {
    var gameView = this;
    key("space", function(){ gameView.game.togglePaused(); return false; });
  }

  GameView.prototype.start = function(){
    this.bindKeyHandlers();
    this.intervalID = setInterval(function(){
      this.game.step(this.ctx);
    }.bind(this), 10);
  }
})();

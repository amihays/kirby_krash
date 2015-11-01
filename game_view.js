(function () {
  window.BB = window.BB || {};

  var GameView = BB.GameView = function(ctx) {
    this.game = new BB.Game();
    this.ctx = ctx;
  }

  GameView.prototype.start = function(){
    var gameView = this;
    setInterval(function(){
      gameView.game.step(gameView.ctx);
    }, 10);
  }

  var lastTime;
  GameView.prototype.main = function () {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
  };
})();

(function () {
  window.BB = window.BB || {};

  var GameView = BB.GameView = function(ctx) {
    this.game = new BB.Game();
    this.ctx = ctx;
  }

  GameView.prototype.start = function(){
    var gameView = this;
    // this.bindKeyHandlers();
    setInterval(function(){
      gameView.game.step(gameView.ctx);
    }, 20);
  }
  
  //
  // GameView.prototype.bindKeyHandlers = function(){
  //   var gameView = this;
  //   key("up", function(){ gameView.game.ship.power([0,-1]); return false; });
  //   key("down", function(){ gameView.game.ship.power([0,1]); return false; });
  //   key("left", function(){ gameView.game.ship.power([-1,0]); return false; });
  //   key("right", function(){ gameView.game.ship.power([1,0]); return false; });
  //   key("space", function(){ gameView.game.ship.fireBullet(); return false; });
  // }
})();

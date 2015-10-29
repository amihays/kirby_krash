(function () {
  window.BB = window.BB || {};

  var Game = BB.Game = function () {
    this.bodies = [Game.bodyBuilder()];
    this.dt = .1;
  }

  canvas = document.getElementById("game-canvas");
  Game.DIM_X = window.innerWidth;
  Game.DIM_Y = window.innerHeight;

  Game.bodyBuilder = function () {
    var position = new BB.Vector(300, 300);
    var velocity = new BB.Vector(0, 0);
    var force = new BB.Vector(0, 0);
    var angVel = 0.01;
    var torque = 0;
    var vertices = [
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(-50, 0), 100),
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(50, 0), 50),
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(0, -100), 80)
    ]
    return new BB.Body(position, velocity, force, angVel, torque, vertices);
  }

  Game.prototype.draw = function(ctx){
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(function(object){
      object.draw(ctx);
    });
  }

  Game.prototype.allObjects = function () {
    return this.bodies;
  }

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (object) {
      object.move(this.dt);
    }.bind(this))
  }

  Game.prototype.step = function(ctx){
    this.moveObjects();
    this.draw(ctx);
    // this.checkCollisions();
    // this.applyGravity();
  }
}())

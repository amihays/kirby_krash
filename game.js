(function () {
  window.BB = window.BB || {};

  var Game = BB.Game = function () {
    this.bodies = [Game.bodyBuilder()];
    this.dt = .2;
    this.gravity = new BB.Vector(0, 1)
    this.spring = new BB.Spring()

    // var drawing = new Image()
    // drawing.src = "spring_sprite.png"
    // this.sprite = new BB.Sprite(drawing,
    //                          [200, 200],
    //                          [750 / 6, 250 / 2],
    //                          .2,
    //                          [0, 1, 2, 3, 4, 5, 0])
  }

  canvas = document.getElementById("game-canvas");
  Game.DIM_X = window.innerWidth;
  Game.DIM_Y = window.innerHeight;

  Game.bodyBuilder = function () {
    var position = new BB.Vector(300, 300);
    var velocity = new BB.Vector(0, 0);
    var force = new BB.Vector(0, 0);
    var angVel = 0;
    var torque = 0;
    var vertices = [
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(8, -38), 15), //top of head
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(-5, -30), 15), //left top of head
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(26, -37), 15), //right top of head
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(43, -15), 15), //right armpit
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(-10, 0), 15), //left armpit
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(53, 10), 15), //right foot
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(30, 13), 15), //crotch
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(10, 28), 15), //left foot
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(-22, -15), 15), //left arm
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(50, -32), 15), //right arm
      new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(10, 8), 100) //center
    ]
    return new BB.Body(position, velocity, force, angVel, torque, vertices);
  }

  Game.prototype.draw = function(ctx){
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(function(body){
      body.draw(ctx);
    });
    // this.sprite.draw(ctx);
  }

  Game.prototype.allObjects = function () {
    return this.bodies.concat([this.spring])
  }

  Game.prototype.moveObjects = function () {
    this.bodies.forEach(function (body) {
      body.move(this.dt, this.gravity);
    }.bind(this))
    // this.sprite.update()
  }



  Game.prototype.step = function(ctx){
    this.draw(ctx);
    this.moveObjects();
    // this.checkCollisions();
    // this.applyGravity();
  }
}())

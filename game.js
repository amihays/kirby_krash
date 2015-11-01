(function () {
  window.BB = window.BB || {};

  var Game = BB.Game = function () {
    this.bodies = [Game.bodyBuilder()];
    this.dt = .1;
    this.gravity = new BB.Vector(0, 0)
    this.spring = new BB.Spring()
    this.bricks = this.brickBuilder();
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
    var position = new BB.Vector(300, 100);
    var velocity = new BB.Vector(0, 50);
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

  Game.prototype.brickBuilder = function () {
    // var bricks = [new BB.Brick(new BB.Vector(100, 100), 10000, this.handleBrickCollision.bind(this))];
    var bricks = [];
    XPos = 100;
    while (XPos < Game.DIM_X - 600) {
      YPos = 100;
      while (YPos < 200) {
        bricks.push(new BB.Brick(new BB.Vector(XPos, YPos), 10000, this.handleBrickCollision.bind(this)));
        YPos += 40;
      }
      XPos += 70;
    }
    return bricks;
  }

  Game.prototype.draw = function(ctx){
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(function(body){
      body.draw(ctx);
    });
    // this.sprite.draw(ctx);
  }

  Game.prototype.allObjects = function () {
    return this.bodies.concat([this.spring]).concat(this.bricks);
  }

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (body) {
      body.move(this.dt, this.gravity);
    }.bind(this))
    // this.sprite.update()
  }
  //
  // Game.prototype.allBoxes = function (ctx) {
  //   var boxes = [];
  //   // this.allObjects().forEach(function(object) {
  //   //   if (object.box) {
  //   //     boxes.push(object.box)
  //   //   }
  //   // })
  //   return boxes;
  // }

  Game.prototype.handleBrickCollision = function (brick) {
    var brickIdx = this.bricks.indexOf(brick);
    this.bricks.splice(brickIdx, 1);
  }

  Game.prototype.vertices = function () {
    var vertices = [];
    this.bodies.forEach(function (body) {
      vertices = vertices.concat(body.vertices)
    }.bind(this))
    return vertices;
  }

  Game.prototype.handleCollisions = function () {
    this.spring.applyCollisionForce(this.vertices(), this.bodies[0]);
    this.bricks.forEach(function (brick) {
      brick.applyCollisionForce(this.vertices(), this.bodies[0])
    }.bind(this))
  }

  Game.prototype.step = function(ctx){
    this.draw(ctx);
    this.moveObjects();
    this.handleCollisions();
    // this.applyGravity();
  }
}())

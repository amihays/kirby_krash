(function () {
  window.BB = window.BB || {};

  var Game = BB.Game = function () {
    this.body = Game.bodyBuilder();
    this.dt = .1;
    this.gravity = new BB.Vector(0, 0)
    this.spring = new BB.Spring()
    this.bricks = this.brickBuilder();
    this.backgroundImage = new Image();
    this.backgroundImage.src = "kirby-dreamland.png";
    this.paused = true;
  }

  canvas = document.getElementById("game-canvas");
  Game.DIM_X = window.innerWidth;
  Game.DIM_Y = window.innerHeight;

  Game.bodyBuilder = function () {
    var position = new BB.Vector(BB.Game.DIM_X / 2 + 67, BB.Game.DIM_Y - 125);
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
    XPos = 200;
    while (XPos < Game.DIM_X - 250) {
      YPos = 150;
      while (YPos < 250) {
        bricks.push(new BB.Brick(new BB.Vector(XPos, YPos), 15000, this.handleBrickCollision.bind(this), 3));
        YPos += 22;
      }
      XPos += 62;
    }
    return bricks;
  }

  Game.prototype.draw = function(ctx){
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    var scalar = 0.125;
    ctx.drawImage(this.backgroundImage, 0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(function(body){
      body.draw(ctx);
    });
    if (this.paused) {
      ctx.fillStyle = "black";
      ctx.font = "48px serif";
      // ctx.textAlign = "center";
      // ctx.textBaseline = "hanging";
      ctx.fillText("Hello world", Game.DIM_X / 2, Game.DIM_Y / 2);
    }
    // this.sprite.draw(ctx);
  }

  Game.prototype.allObjects = function () {
    return [this.body].concat([this.spring]).concat(this.bricks);
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
    if (brickIdx >= 0) {
      this.bricks.splice(brickIdx, 1);
    }
  }

  Game.prototype.vertices = function () {
    return this.body.vertices;
  }

  Game.prototype.handleCollisions = function () {
    this.spring.applyCollisionForce(this.vertices(), this.body);
    this.bricks.forEach(function (brick) {
      brick.applyCollisionForce(this.vertices(), this.body)
    }.bind(this))
  }

  Game.prototype.isLost = function () { //checks if game is lost
    return this.body.isBelowScreen();
  }

  Game.prototype.step = function(ctx){
    this.draw(ctx);
    if (!this.paused) {
      this.handleCollisions();
      this.moveObjects();
      if (this.isLost()) {
        this.lost();
      }
    }
  }

  Game.prototype.togglePaused = function () {
    this.paused = !this.paused;
  }

  Game.prototype.lost = function () {
    clearInterval(this.intervalID);
    this.paused = true;
  }

}())

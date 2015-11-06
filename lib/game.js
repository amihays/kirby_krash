(function () {
  window.BB = window.BB || {};

  var Game = BB.Game = function () {
    this.body = Game.kirbyBodyBuilder();
    this.bricks = this.brickBuilder();
    this.spring = new BB.Spring();
    this.dt = .1;
    this.paused = true;
    this.lives = 3;
    this.score = 0;
    this.lost = false;
    this.won = false;
    this.loadImages();
  }

  Game.DIM_X = window.innerWidth;
  Game.DIM_Y = window.innerHeight;

  Game.kirbyBodyBuilder = function () {
    var position = new BB.Vector(BB.Game.DIM_X / 2 + 67, BB.Game.DIM_Y - 150);
    var velocity = new BB.Vector(0, 50);
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
    return new BB.Body(position, velocity, angVel, torque, vertices);
  }

  Game.prototype.loadImages = function () {
    this.backgroundImage = new Image();
    this.backgroundImage.src = "images/kirby-dreamland.png";
    this.pauseImage = new Image();
    this.pauseImage.src = "images/kirby_pause_modal.png";
    this.wonImage = new Image();
    this.wonImage.src = "images/kirby_win_screen.png";
    this.lostImage = new Image();
    this.lostImage.src = "images/lose_screen.png";
  }

  Game.prototype.brickBuilder = function () {
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

  Game.prototype.checkInBounds = function () {
    if (this.body.isBelowScreen()) {
      this.lives -= 1;
      this.body = Game.kirbyBodyBuilder();
      var x_pos = Game.DIM_X / 2;
      var y_pos = Game.DIM_Y - 125 * this.spring.sizeScalar;
      this.spring.position = new BB.Vector(x_pos, y_pos);
    }
  }

  Game.prototype.draw = function(ctx){
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.drawImage(this.backgroundImage, 0, 0, Game.DIM_X, Game.DIM_Y);

    this.drawScore(ctx);

    this.allObjects().forEach(function(body){
      body.draw(ctx);
    });

    if (this.lost) {
      this.drawModal(this.lostImage);
    } else if (this.won) {
      this.drawModal(this.wonImage);
    } else if (this.paused) {
      this.drawModal(this.pauseImage);
    }
  }

  Game.prototype.drawScore = function(ctx) {
    ctx.fillStyle = "black";
    ctx.font = "36px serif";
    ctx.fillText("score: " + this.score.toString(), 10, 40);
    ctx.fillText("lives left: " + this.lives.toString(), 10, 90);
  }

  Game.prototype.drawModal = function (image) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.globalAlpha = 1;
    ctx.drawImage(image, 0, 0, Game.DIM_X, this.pauseImage.height * (Game.DIM_X / this.pauseImage.width))
  }

  Game.prototype.allObjects = function () {
    return [this.body].concat([this.spring]).concat(this.bricks);
  }

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (body) {
      body.move(this.dt);
    }.bind(this))
  }

  Game.prototype.handleBrickCollision = function (brick) {
    var brickIdx = this.bricks.indexOf(brick);
    if (brickIdx >= 0) {
      this.bricks.splice(brickIdx, 1);
      this.score += 10;
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
    return this.lives <= 0;
  }

  Game.prototype.isWon = function () {
    return (this.bricks.length <= 0)
  }

  Game.prototype.step = function(ctx){
    this.draw(ctx);
    if (!this.paused && !this.lost && !this.won) {
      this.handleCollisions();
      this.moveObjects();
      this.checkInBounds();
      if (this.isLost()) {
        this.lost = true;
      } else if (this.isWon()) {
        this.won = true;
      }
    }
  }

  Game.prototype.togglePaused = function () {
    this.paused = !this.paused;
    this.spring.paused = !this.spring.paused;
  }
}())

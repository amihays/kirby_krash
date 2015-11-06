(function () {
  window.BB = window.BB || {};
  var spritePositions = [[0, 0], [125, 0], [250, 0], [375, 0],
                         [500, 0], [625, 0], [0, 125], [125, 125],
                         [250, 125], [375, 125], [500, 125], [625, 125]]
  var boxYOffset = [75, [125, 0], [250, 0], [375, 0],
                 [500, 0], [625, 0], [0, 125], [125, 125],
                 [250, 125], [375, 125], [500, 125], [625, 125]]


  var Spring = BB.Spring = function () {
    this.drawing = new Image();
    this.drawing.src = "images/spring_sprite.png";
    this.sizeScalar = 1.3;
    this.position = new BB.Vector(BB.Game.DIM_X / 2, BB.Game.DIM_Y - 125 * this.sizeScalar);
    this.velocity = 0;
    this.springing = false;
    this.phases = [1, 9, 11, 8, 6, 7, 2, 3, 2, 7, 6, 8];
    this.count = 0;
    this.sprite = false;
    this._tickCount = 0;
    this.ticksPerFrame = 7;
    this.paused = true;
    this.box = new BB.Box(15000, new BB.Vector(this.position.x + 8 * this.sizeScalar, this.position.y + boxYOffset[0] * this.sizeScalar), 109 * this.sizeScalar, 25 * this.sizeScalar, true);
  }

  Spring.prototype.updateBox = function (boxIdx) {
    this.box.position = new BB.Vector(this.position.x + 8 * this.sizeScalar, this.position.y + boxYOffset[0] * this.sizeScalar);
  }

  Spring.prototype.setSprite = function () {
    if (this.springing) {
      var phaseIdx = Math.floor(this._tickCount / this.ticksPerFrame)
      this.sprite = new BB.Sprite(this.drawing,
                                  [this.position.x, this.position.y],
                                  [125, 125],
                                  this.sizeScalar,
                                  .2,
                                  spritePositions[phaseIdx],
                                  'horizontal',
                                  true)
      if (!this.paused) {
        this._tickCount += 1;
      }

      if (this._tickCount > (this.phases.length * this.ticksPerFrame - 1)) {
        this.springing = false;
        this._tickCount = 0;
      }

    } else {
      this.sprite = new BB.Sprite(this.drawing,
                                  [this.position.x, this.position.y],
                                  [125, 125],
                                  this.sizeScalar,
                                  .2,
                                  spritePositions[0],
                                  'horizontal',
                                  true)
    }
  }

  Spring.prototype.move = function (velocity) {
    var maxVelocity = 15;
    if (key.isPressed(37) && !key.isPressed(39)) {
      this.velocity = this.velocity - 0.4;
    } else if (key.isPressed(39) && !key.isPressed(37)) {
      this.velocity = this.velocity + 0.4;
    } else {
      this.velocity *= .85;
    }
    if (Math.abs(this.velocity) > maxVelocity) {
      this.velocity = (this.velocity / Math.abs(this.velocity)) * maxVelocity
    }
    this.position.x += this.velocity
    if (this.position.x < 0) {
      this.velocity = 0;
      this.position.x = 0;
    } else if (this.position.x > BB.Game.DIM_X - 125) {
      this.velocity = 0;
      this.position.x = BB.Game.DIM_X - 125;
    }
  }

  Spring.prototype.applyCollisionForce = function (vertices, body) {
    vertices.forEach(function (vertex) {
      if (this.box.checkCollision(vertex)) {
        // debugger;
        vertex.force = vertex.force.add(this.box.getForce(vertex.absPos, body));
        this.springing = true;
      }
    }.bind(this))
    return false;
  }

  Spring.prototype.draw = function (ctx) {
    this.setSprite();
    this.sprite.draw(ctx);
    this.updateBox();
    this.box.draw(ctx);
  }

}())

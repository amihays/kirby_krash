(function () {
  window.BB = window.BB || {};
  var spritePositions = [[0, 0], [125, 0], [250, 0], [375, 0],
                         [500, 0], [625, 0], [0, 125], [125, 125],
                         [250, 125], [375, 125], [500, 125], [625, 125]]

  var Spring = BB.Spring = function () {
    this.drawing = new Image();
    this.drawing.src = "spring_sprite.png";
    this.position = [BB.Game.DIM_X / 2, BB.Game.DIM_Y - 20];
    this.springing = false;
    // this.phaseIdx = false;
    this.phases = [1, 9, 11, 8, 6, 7, 2, 3, 2, 7, 6, 8];
    this.count = 0;
    this.sprite = false;
    this._tickCount = 0;
    this.ticksPerFrame = 4;
  }

  Spring.prototype.setSprite = function () {
    if (this.springing) {
      var phaseIdx = Math.floor(this._tickCount / this.ticksPerFrame)
      this.sprite = new BB.Sprite(this.drawing,
                                  this.position,
                                  [125, 125],
                                  .2,
                                  spritePositions[phaseIdx],
                                  'horizontal',
                                  true)
      this._tickCount += 1;

      if (this._tickCount > (this.phases.length * this.ticksPerFrame - 1)) {
        this.springing = false;
        this._tickCount = 0;
      }

    } else {
      this.sprite = new BB.Sprite(this.drawing,
                                  this.position,
                                  [125, 125],
                                  .2,
                                  spritePositions[0],
                                  'horizontal',
                                  true)
    }
  }

  Spring.prototype.checkCollision = function (vertex) {
    this.count += 1;
    if (this.count % 200 === 0) {
      this.springing = true;
    }
    return false;
  }

  Spring.prototype.draw = function (ctx) {
    this.checkCollision();
    this.setSprite();
    this.sprite.draw(ctx);
  }
}())

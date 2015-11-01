(function () {
  window.BB = window.BB || {};

  var Brick = BB.Brick = function (position, forceMag, handleCollisionCallback) {
    this.handleCollisionCallback = handleCollisionCallback;
    this.position = position;
    this.width = 40;
    this.height = 10;
    this.box = new BB.Box(forceMag, this.position, this.width, this.height, true)
  }

  Brick.prototype.checkCollision = function (vertex) {
    return this.box.checkCollision(vertex);
  }

  Brick.prototype.handleCollision = function () {
    this.handleCollisionCallback(this);
  }

  Brick.prototype.collisionUpdate = function(vertex) {
    if (this.checkCollision(vertex)) {
      this.handleCollision();
    }
  }

  Brick.prototype.draw = function (ctx) {
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
    ctx.stroke();
  }

  Brick.prototype.move = function () {
  }
}())

(function () {
  window.BB = window.BB || {};

  var Brick = BB.Brick = function (position, forceMag, handleCollisionCallback) {
    this.handleCollisionCallback = handleCollisionCallback;
    this.position = position;
    this.width = 60;
    this.height = 20;
    this.box = new BB.Box(forceMag, this.position, this.width, this.height, false)
  }

  // Brick.prototype.checkCollision = function (vertex) {
  //   return this.box.checkCollision(vertex);
  // }
  //
  // Brick.prototype.handleCollision = function () {
  //   this.handleCollisionCallback(this);
  // }
  //
  Brick.prototype.applyCollisionForce = function (vertices, body) {
    vertices.forEach(function (vertex) {
      if (this.box.checkCollision(vertex)) {
        vertex.force = vertex.force.add(this.box.getForce(vertex.absPos, body));
        this.handleCollisionCallback(this);
      }
    }.bind(this))
    return false;
  }


  Brick.prototype.collisionUpdate = function(vertex) {
    if (this.checkCollision(vertex)) {
      this.handleCollision();
    }
  }

  Brick.prototype.draw = function (ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
    ctx.stroke();
    ctx.fill();
  }

  Brick.prototype.move = function () {
  }
}())

(function () {
  window.BB = window.BB || {};

  var Brick = BB.Brick = function (position, forceMag, handleCollisionCallback, health) {
    this.handleCollisionCallback = handleCollisionCallback;
    this.position = position;
    this.width = 60;
    this.height = 20;
    this.health = health;
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
    var hit = false;
    vertices.forEach(function (vertex) {
      if (this.box.checkCollision(vertex)) {
        vertex.force = vertex.force.add(this.box.getForce(vertex.absPos, body));
        hit = true;
      }
    }.bind(this))
    if (hit) {
      this.health -= 1;
    }
    if (this.health <= 0) {
      this.handleCollisionCallback(this);
    }
    return false;
  }

  Brick.prototype.draw = function (ctx) {
    if (this.health === 3) {
      ctx.fillStyle = "red";
    } else if (this.health === 2) {
      ctx.fillStyle = "orange";
    } else {
      ctx.fillStyle = "teal";
    }
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
    ctx.stroke();
    ctx.fill();
  }

  Brick.prototype.move = function () {
  }
}())

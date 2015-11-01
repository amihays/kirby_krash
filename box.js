(function () {
  window.BB = window.BB || {};

  var Box = BB.Box = function (forceMag, position, width, height, convexEdges) {
    this.forceMag = forceMag; // magnitude of force
    this.position = position; // upper left corner
    this.width = width;
    this.height = height;
    this.convexEdges = convexEdges || false; // forces applied as though top is convex
  }

  Box.prototype.checkCollision = function (vertex) {
    if (vertex.absPos.x > this.position.x && vertex.absPos.x < this.position.x + this.width &&
        vertex.absPos.y > this.position.y && vertex.absPos.y < this.position.y + this.height) {
          return true;
    }
  }

  Box.prototype.getForce = function (contactPos) {
    if (this.convexEdges) {
      return this.getConvexForce(contactPos);
    } else {
      return this.getFlatForce(contactPos);
    }
  }

  Box.prototype.getConvexForce = function (contactPos) {
    var diffVector = contactPos.subtract(this.getCenter());
    var unitVector = diffVector.unitVector();
    return unitVector.scale(this.forceMag);
  }

  Box.prototype.getFlatForce = function (contactPos) {
    // var force;
    // var leftDiffX = this.position.x - contactPos.x;
    // var rightDiffX = this.position.x + this.width - contactPos.x;
    // var topDiffY = contactPos.y - this.position.y;
    // var bottomDiffY = this.position.y + this.height - contactPos.y;
    // if ((Math.abs(leftDiffX - topDiffY) < 5) && leftDiffX < rightDiffX && topDiffY < bottomDiffY) {
    //   force = new Vector(-1, -1);
    // } else if ((Math.abs(rightDiffX - topDiffY) < 5) && topDiffY < bottomDiffY) {
    //   force = new Vector(1, -1);
    // } else if ((Math.abs(rightDiffX - bottomDiffY) < 5) && topDiffY < bottomDiffY) {
    //
    // }
  }

  Box.prototype.getCenter = function () {
    return new BB.Vector(this.position.x + this.width / 2,
                        this.position.y + this.height / 2);
  }

  Box.prototype.draw = function (ctx) {
    ctx.rect(this.position.x,this.position.y,this.width,this.height);
    ctx.stroke();
  }

  Box.prototype.move = function () {
  }
}())

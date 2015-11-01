(function () {
  window.BB = window.BB || {};

  var Box = BB.Box = function (forceMag, position, width, height, isPaddle) {
    this.forceMag = forceMag; // magnitude of force
    this.position = position; // upper left corner
    this.width = width;
    this.height = height;
    this.isPaddle = isPaddle || false; // forces applied as though top is convex
  }

  Box.prototype.checkCollision = function (vertex) {
    if (vertex.absPos.x > this.position.x && vertex.absPos.x < this.position.x + this.width &&
        vertex.absPos.y > this.position.y && vertex.absPos.y < this.position.y + this.height) {
          return true;
    }
  }

  Box.prototype.horizontalMargin = function () {
    return this.width * (0.2);
  }

  Box.prototype.verticalMargin = function () {
    return this.height * (0.3);
  }

  Box.prototype.getForce = function (contactPos, body) {
    if (this.isPaddle) {
      return this.getPaddleForce(contactPos, body);
    } else {
      return this.getBrickForce(contactPos, body);
    }
  }

  Box.prototype.getBrickForce = function (contactPos, body) {
    var relPos = contactPos.subtract(this.position);
    var forceDir = new BB.Vector(0, 0);
    var horizontalMargin = this.horizontalMargin();
    var verticalMargin = this.verticalMargin();
    if (relPos.x < horizontalMargin) {
      if (relPos.y < verticalMargin) {
        forceDir = new BB.Vector(-1, -1);
      } else if (relPos.y < this.height - verticalMargin) {
        forceDir = new BB.Vector(-1, 0);
      } else {
        forceDir = new BB.Vector(-1, 1);
      }
    } else if (relPos.x < this.width - horizontalMargin) {
      if (relPos.y < this.height / 2) {
        forceDir = new BB.Vector(0, -1);
      } else {
        forceDir = new BB.Vector(0, 1);
      }
    } else {
      if (relPos.y < verticalMargin) {
        forceDir = new BB.Vector(1, -1);
      } else if (relPos.y < this.height - verticalMargin) {
        forceDir = new BB.Vector(1, 0);
      } else {
        forceDir = new BB.Vector(1, 1);
      }
    }
    if ((forceDir.x === -1 && body.velocity.x > 0) || (forceDir.x === 1 && body.velocity.x < 0)) {
      body.velocity.x *= -1;
    }
    if ((forceDir.y === -1 && body.velocity.y > 0) || (forceDir.y === 1 && body.velocity.y < 0)) {
      body.velocity.y *= -1;
    }
    // if (contactPos.x - this.getCenter().x > 30) {
    //   body.velocity.x += 30;
    // } else if (contactPos.x - this.getCenter().x < -30) {
    //   body.velocity.x -= 30;
    // }
    var diffVector = contactPos.subtract(this.getCenter());
    var unitVector = diffVector.unitVector();
    unitVector.x *= 0.2;
    unitVector.y *= 4;
    return unitVector.scale(this.forceMag);
  }

  Box.prototype.getPaddleForce = function (contactPos, body) {
    if (body.velocity.y > 0) {
      body.velocity.y = -body.velocity.y
      if (contactPos.x - this.getCenter().x > 30) {
        body.velocity.x += 30;
      } else if (contactPos.x - this.getCenter().x < -30) {
        body.velocity.x -= 30;
      }
    }
    var diffVector = contactPos.subtract(this.getCenter());
    var unitVector = diffVector.unitVector();
    unitVector.x *= 0.2;
    unitVector.y *= 4;
    // debugger;
    return unitVector.scale(this.forceMag);
  }
  //
  // Box.prototype.getFlatForce = function (contactPos, body) {
  //   // var force;
  //   // var leftDiffX = this.position.x - contactPos.x;
  //   // var rightDiffX = this.position.x + this.width - contactPos.x;
  //   // var topDiffY = contactPos.y - this.position.y;
  //   // var bottomDiffY = this.position.y + this.height - contactPos.y;
  //   // if ((Math.abs(leftDiffX - topDiffY) < 5) && leftDiffX < rightDiffX && topDiffY < bottomDiffY) {
  //   //   force = new Vector(-1, -1);
  //   // } else if ((Math.abs(rightDiffX - topDiffY) < 5) && topDiffY < bottomDiffY) {
  //   //   force = new Vector(1, -1);
  //   // } else if ((Math.abs(rightDiffX - bottomDiffY) < 5) && topDiffY < bottomDiffY) {
  //   //
  //   // }
  // }

  Box.prototype.getCenter = function () {
    return new BB.Vector(this.position.x + this.width / 2,
                        this.position.y + this.height / 2);
  }

  Box.prototype.draw = function (ctx) {
    // ctx.rect(this.position.x,this.position.y, this.width, this.height);
    // ctx.stroke();
  }

  Box.prototype.move = function () {
  }
}())

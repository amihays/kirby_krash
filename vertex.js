(function () {
  window.BB = window.BB || {};

  var Vertex = BB.Vertex = function (force, relativePosition, mass, radius) {
    this.relPos = relativePosition;
    this.origRelPos = relativePosition.scale(1);
    this.mass = mass;
    this.absPos = new BB.Vector(0, 0);
    this.force = force;
    this.radius = radius || this.mass / 10;
  }

  Vertex.prototype.outOfBoundsX = function () {
    var restoringForce = 50000;
    if (this.absPos.x < 0) {
      this.force.x = restoringForce;
      return -1;
    } else if (this.absPos.x > BB.Game.DIM_X) {
      this.force.x = -restoringForce;
      return 1;
    }
  }

  Vertex.prototype.outOfBoundsY = function () {
    var restoringForce = 50000;
    if (this.absPos.y < 0) {
      this.force.y = restoringForce;
      return -1;
    } else if (this.absPos.y > BB.Game.DIM_Y) {
      return 1;
    }
  }

  // Vertex.prototype.updateForce = function (gravity, body) {
  //   var restoringForce = 50000;
  //   if (this.absPos.y > BB.Game.DIM_Y) {
  //     this.force.y += -restoringForce;
  //     body.velocity.y = - body.velocity.y;
  //   } else if (this.absPos.y < 0) {
  //     this.force.y = restoringForce;
  //     body.velocity.y = - body.velocity.y;
  //   } else if (this.absPos.x < 0) {
  //     this.force.x = restoringForce;
  //     body.velocity.x = - body.velocity.x;
  //   } else if (this.absPos.x > BB.Game.DIM_X) {
  //     this.force.x = -restoringForce;
  //     body.velocity.x = - body.velocity.x;
  //   }
  //   // this.force = this.force.add(gravity.scale(this.mass));
  // }
  //
  Vertex.prototype.updateAbsPosition = function (bodyPos) {
    this.absPos = this.relPos.add(bodyPos);
  }

  Vertex.prototype.rotate = function (theta) {
    this.relPos.x = this.origRelPos.x * Math.cos(theta) + this.origRelPos.y * Math.sin(theta);
    this.relPos.y = this.origRelPos.x * -Math.sin(theta) + this.origRelPos.y * Math.cos(theta);
  }

  Vertex.prototype.draw = function(ctx){
    ctx.fillStyle = "blue";
    ctx.beginPath();

    ctx.arc(this.absPos.x, //x pos
            this.absPos.y, //y pos
            this.radius,
            0,
            Math.PI * 2,
            false);
    ctx.fill();

    var scale = 6;
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(this.absPos.x, this.absPos.y)
    ctx.lineTo(this.force.x * scale + this.absPos.x, this.force.y * scale + this.absPos.y);
    ctx.stroke();
  }
}())

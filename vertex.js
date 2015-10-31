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

  Vertex.prototype.updateForce = function (gravity) {
    var totalForce = new BB.Vector(0, 0)
    if (this.absPos.y > BB.Game.DIM_Y) {
      totalForce.y += -5000;
    } else if (this.absPos.y < 0) {
      totalForce.y = 1000;
    }
    totalForce = totalForce.add(gravity.scale(this.mass));
    this.force = totalForce;
  }

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

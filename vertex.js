(function () {
  window.BB = window.BB || {};

  var Vertex = BB.Vertex = function (force, relativePosition, mass) {
    this.relPos = relativePosition;
    this.origRelPos = relativePosition.scale(1);
    this.mass = mass;
    this.absPos = new BB.Vector(0, 0);
    this.force = force;
  }

  Vertex.prototype.updateForce = function (gravity, stopCallback) {

    // var totalForce = new BB.Vector(0, 0)
    // totalForce = totalForce.add(gravity.scale(this.mass));
    // if (this.absPos.y + (this.mass / 3) >= BB.Game.DIM_Y) {
    //   // var penetration = this.absPos.y -(BB.Game.DIM_Y - buffer);
    //   // totalForce = totalForce.subtract(gravity.scale(this.mass * 10));
    //   // totalForce = totalForce.add(new BB.Vector(0, -10))
    //   // stopCallback();
    // }
    // this.force = totalForce;
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
            this.mass / 3,
            0,
            Math.PI * 2,
            false);
    ctx.fill();

    var scale = 60;
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(this.absPos.x, this.absPos.y)
    ctx.lineTo(this.force.x * scale + this.absPos.x, this.force.y * scale + this.absPos.y);
    ctx.stroke();
  }
}())

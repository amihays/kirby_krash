(function () {
  window.BB = window.BB || {};

  var Vertex = BB.Vertex = function (force, relativePosition, mass) {
    this.force = force;
    this.relPos = relativePosition;
    this.mass = mass;
    this.absPos = new BB.Vector(0, 0);
  }

  Vertex.prototype.updateAbsPosition = function (bodyPos) {
    this.absPos = this.relPos.add(bodyPos);
  }

  Vertex.prototype.rotate = function (theta) {
    this.relPos.x = this.relPos.x * Math.cos(theta) + this.relPos.y * Math.sin(theta);
    this.relPos.y = this.relPos.x * -Math.sin(theta) + this.relPos.y * Math.cos(theta);
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
  }
}())

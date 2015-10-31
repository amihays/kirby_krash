(function () {
  window.BB = window.BB || {};

  var Explosion = BB.Explosion = function (position, thickness, rate, radius, maxRadius, deleteCallback) {
    this.position = position;
    this.thickness = thickness;
    this.rate = rate;
    this.radius = radius;
    this.maxRadius = maxRadius || 50;
    this.deleteCallback = deleteCallback;
  }

  Explosion.prototype.draw = function (ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();

    ctx.arc(this.position.x, //x pos
            this.position.y, //y pos
            this.radius,
            0,
            Math.PI * 2,
            false);
    ctx.fill();
  }

  Explosion.prototype.move = function (dt) {
    this.radius += this.rate * dt;
    if (this.radius > this.maxRadius) {
      this.deleteCallback();
    }
  }
}())

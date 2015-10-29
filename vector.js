(function () {
  window.BB = window.BB || {};

  var Vector = BB.Vector = function (x, y) {
    this.x = x;
    this.y = y;
  }

  Vector.prototype.scale = function (scalar) {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  Vector.prototype.add = function (vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  Vector.prototype.subtract = function (vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  Vector.prototype.magnitude = function () {
    return Math.pow((Math.pow(this.x, 2) + Math.pow(this.y, 2)), .5);
  }

  Vector.prototype.dot = function (vector) {
    return (this.x * vector.x) + (this.y * vector.y);
  }

  Vector.prototype.cross = function (vector) {
    return this.x * vector.y - this.y * vector.x;
  }
}())

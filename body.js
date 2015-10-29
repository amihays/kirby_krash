(function () {
  window.BB = window.BB || {};

  var Body = BB.Body = function (position, velocity, force, angVel, torque, vertices) {
    this.position = position;
    this.velocity = velocity;
    this.force = force;
    this.angVel = angVel; // angular velocity
    this.torque = torque; // angular acceleration
    this.vertices = vertices;
    this.mass = this.calcMass();
    this.modifyVerticesRelativePosition();
  }

  Body.prototype.stop = function () {
    this.velocity.y = 0;
  }

  Body.prototype.calcMass = function () {
    var totalMass = 0;
    this.vertices.forEach(function(vertex) {
      totalMass += vertex.mass;
    })
    return totalMass;
  }

  Body.prototype.modifyVerticesRelativePosition = function () {
    var vectorSum = new BB.Vector(0, 0);
    this.vertices.forEach(function(vertex) {
      vectorSum = vectorSum.add(vertex.relPos.scale(vertex.mass));
    })
    centerOfMass = vectorSum.scale(1/this.mass);
    this.vertices.forEach(function (vertex) {
      vertex.relPos = vertex.relPos.subtract(centerOfMass);
      vertex.updateAbsPosition(this.position);
    }.bind(this))
  }

  Body.prototype.draw = function (ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();

    ctx.arc(this.position.x, //x pos
            this.position.y, //y pos
            5,
            0,
            Math.PI * 2,
            false);
    ctx.fill();

    this.vertices.forEach(function(vertex){
      vertex.draw(ctx);
    });
  }

  Body.prototype.updateForces = function (gravity) {
    this.force = new BB.Vector(0, 0);
    this.torque = 0;
    this.vertices.forEach(function (vertex) {
      vertex.updateForce(gravity);
      var bodyForce = vertex.force.unitVector();
      var relDirection = vertex.relPos.unitVector();
      bodyForce = bodyForce.scale(Math.abs(relDirection.dot(vertex.force)));
      this.force = this.force.add(bodyForce);
      this.torque += vertex.force.cross(vertex.relPos);
    }.bind(this))
  }

  Body.prototype.move = function (dt, gravity) {
    this.updateForces(gravity, this.stop.bind(this));
    this.position = this.position.add(this.velocity.scale(dt));
    var acceleration = this.force.scale(1/this.mass);
    this.velocity = this.velocity.add(acceleration)

    this.angVel += this.torque / 1000000

    this.vertices.forEach(function (vertex) {
      vertex.rotate(this.angVel);
      vertex.updateAbsPosition(this.position);
    }.bind(this))
  }
}())

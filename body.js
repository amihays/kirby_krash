(function () {
  window.BB = window.BB || {};

  var Body = BB.Body = function (position, velocity, force, angle, angVel, torque, vertices) {
    this.position = position;
    this.velocity = velocity;
    this.force = force;
    this.angle = angle;
    this.angVel = angVel; // angular velocity
    this.torque = torque; // angular acceleration
    this.vertices = vertices;
    this.mass = this.calcMass();
    this.modifyVerticesRelativePosition();
  }

  Body.prototype.calcMass = function () {
    var totalMass = 0;
    this.vertices.forEach(function(vertex) {
      totalMass += vertex.mass;
    })
    return totalMass;
  }

  Body.prototype.modifyVerticesRelativePosition = function () {
    var centerOfMass = new BB.Vector(0, 0);
    this.vertices.forEach(function(vertex) {
      centerOfMass = centerOfMass.add(vertex.relPos.scale(vertex.mass));
    })
    centerOfMass = centerOfMass.scale(1/this.mass);
    this.vertices.forEach(function (vertex) {
      vertex.relPos = vertex.relPos.add(centerOfMass);
      vertex.updateAbsPosition(this.position);
    }.bind(this))
  }

  Body.prototype.draw = function (ctx) {
    this.vertices.forEach(function(vertex){
      vertex.draw(ctx);
    });
  }

  Body.prototype.updateForces = function () {
    this.force = new BB.Vector(0, 0);
    this.torque = 0;
    this.vertices.forEach(function (vertex) {
      var bodyForce = vertex.force.scale(1/vertex.force.magnitude());
      bodyForce = bodyForce.scale(Math.abs(vertex.relPos.dot(vertex.force)));
      this.force = this.force.add(bodyForce);
      this.torque += vertex.relPos.cross(vertex.force)
    }.bind(this))
  }

  Body.prototype.move = function (dt) {
    this.updateForces();
    this.position = this.position.add(this.velocity.scale(dt));
    var acceleration = this.force.scale(1/this.mass);
    this.velocity = this.velocity.add(acceleration)
    this.vertices.forEach(function (vertex) {
      vertex.updateAbsPosition(this.position);
    }.bind(this))
  }
}())

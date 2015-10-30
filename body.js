(function () {
  window.BB = window.BB || {};

  var Body = BB.Body = function (position, velocity, force, angVel, torque, vertices) {
    this.lastPosition = position;
    this.lastVelocity = velocity;
    this.lastForce = force;
    this.lastTorque = torque;
    this.lastAngVel = angVel;
    this.lastAngle = 0;
    this.centerOfMass = new BB.Vector(0, 0);
    this.angle = 0;
    this.position = position;
    this.velocity = velocity;
    this.force = force;
    this.angVel = angVel; // angular velocity
    this.torque = torque; // angular acceleration
    this.vertices = vertices;
    this.mass = this.calcMass();
    this.modifyVerticesRelativePosition();
    this.calcMomentOfInertia();
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

  Body.prototype.calcMomentOfInertia = function () {
    this.momentOfInertia = 0;
    this.vertices.forEach(function(vertex) {
      this.momentOfInertia += vertex.mass * Math.pow(vertex.relPos.magnitude(), 2);
    }.bind(this))
  }

  Body.prototype.modifyVerticesRelativePosition = function () {
    var vectorSum = new BB.Vector(0, 0);
    this.vertices.forEach(function(vertex) {
      vectorSum = vectorSum.add(vertex.relPos.scale(vertex.mass));
    })
    this.centerOfMass = vectorSum.scale(1 / this.mass);
    this.vertices.forEach(function (vertex) {
      vertex.relPos = vertex.relPos.subtract(this.centerOfMass);
      vertex.origRelPos = vertex.origRelPos.subtract(this.centerOfMass);
      vertex.updateAbsPosition(this.position);
    }.bind(this))
    this.centerOfMass = new BB.Vector(0, 0);
  }

  Body.prototype.draw = function (ctx) {
    drawing = new Image()
    drawing.src = "pixel_robot.jpg"
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(-this.angle);
    var scalar = 0.3;
    ctx.drawImage(drawing,
                  scalar * (-drawing.width / 2),
                  scalar * (-drawing.height / 2),
                  drawing.width * scalar,
                  drawing.height * scalar);
    ctx.restore();
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

  Body.prototype.resetLastVars = function () {
    this.lastPosition = this.position;
    this.lastVelocity = this.velocity;
    this.lastForce = this.force;
    this.lastAngVel = this.angVel;
    this.lastTorque = this.torque;
    this.lastAngle = this.angle;
  }

  Body.prototype.move = function (dt, gravity) {
    this.updateForces(gravity, this.stop.bind(this));
    var lastAcceleration = this.lastForce.scale(1/this.mass);
    var acceleration = this.force.scale(1/this.mass);
    this.position = this.lastPosition.add(this.lastVelocity.scale(dt)).add(lastAcceleration.scale(0.5 * Math.pow(dt, 2)));
    this.velocity = this.lastVelocity.add((lastAcceleration.add(acceleration)).scale(0.5 * dt))
    var I = this.momentOfInertia;
    this.angle = this.lastAngle + (this.lastAngVel * dt) + (0.5 * this.lastTorque * Math.pow(dt, 2) * (1 / I))
    this.angVel = this.lastAngVel + 0.5 * (this.lastTorque + this.torque) * (dt / I);

    this.vertices.forEach(function (vertex) {
      vertex.rotate(this.angle);
      vertex.updateAbsPosition(this.position);
    }.bind(this))

    this.resetLastVars();
  }
}())

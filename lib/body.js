(function () {
  window.BB = window.BB || {};

  var Body = BB.Body = function (position, velocity, force, angVel, torque, vertices) {
    this.angle = 0;
    this.position = position;
    this.velocity = velocity;
    this.force = force;
    this.angVel = angVel; // angular velocity
    this.torque = torque; // angular acceleration
    this.resetLastVars();
    this.vertices = vertices;
    this.centerOfMass = new BB.Vector(0, 0);
    this.mass = this.calcMass();
    this.modifyVerticesRelativePosition();
    this.momentOfInertia = this.calcMomentOfInertia();
    this.kirbyImage = new Image();
    this.kirbyImage.src = "images/kirby.png";
    this.speed = 50;
  }

  Body.prototype.isBelowScreen = function () {
    var allOutOfBounds = true;
    this.vertices.forEach(function(vertex) {
      if (vertex.outOfBoundsY() !== 1) {
        allOutOfBounds = false;
      }
    })
    return allOutOfBounds;
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
    var momentOfInertia = 0;
    this.vertices.forEach(function(vertex) {
      momentOfInertia += vertex.mass * Math.pow(vertex.relPos.magnitude(), 2);
    }.bind(this))
    return momentOfInertia;
  }

  Body.prototype.clearVertexForces = function () {
    this.vertices.forEach(function (vertex) {
      vertex.force = new BB.Vector(0, 0);
    })
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
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(-this.angle);
    var scalar = 0.125;
    ctx.drawImage(this.kirbyImage,
                  scalar * (-this.kirbyImage.width / 2),
                  scalar * (-this.kirbyImage.height / 2 - 20),
                  this.kirbyImage.width * scalar,
                  this.kirbyImage.height * scalar);
    ctx.restore();
  }

  Body.prototype.updateForces = function (gravity) {
    this.force = new BB.Vector(0, 0);
    this.torque = 0;
    this.vertices.forEach(function (vertex) {
      if (vertex.outOfBoundsX() === -1) {
        this.velocity.x = Math.abs(this.velocity.x)
      } else if (vertex.outOfBoundsX() === 1) {
        this.velocity.x = -Math.abs(this.velocity.x)
      }
      if (vertex.outOfBoundsY() === -1) {
        this.velocity.y = Math.abs(this.velocity.y)
      }
      var relDirection = vertex.relPos.unitVector();
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
    // this.velocity = this.lastVelocity.add((lastAcceleration.add(acceleration)).scale(0.5 * dt))
    // if (this.velocity.magnitude() > this.speed) {
    this.velocity = this.velocity.unitVector().scale(this.speed);
    // } else if (this.velocity.magnitude() > this.speed * 0.5) {
    //   this.velocity = this.velocity.scale(0.98);
    // }
    this.position = this.lastPosition.add(this.lastVelocity.scale(dt)).add(lastAcceleration.scale(0.5 * Math.pow(dt, 2)));
    var I = this.momentOfInertia;
    this.angVel = this.lastAngVel + 0.5 * (this.lastTorque + this.torque) * (dt / I);
    // if (Math.abs(this.angVel) > 0.4) {
    //   this.angVel = 0.3;
    // } else if (Math.abs(this.angVel) > 0.2) {
    //   this.angVel = this.angVel * (0.99);
    // }
    this.angle = this.lastAngle + (this.lastAngVel * dt) + (0.5 * this.lastTorque * Math.pow(dt, 2) * (1 / I))

    this.vertices.forEach(function (vertex) {
      vertex.rotate(this.angle);
      vertex.updateAbsPosition(this.position);
    }.bind(this))
    //
    // this.vertices.forEach(function (vertex) {
    //   var diffY = (vertex.absPos.y + vertex.radius) - BB.Game.DIM_Y;
    //   if (diffY > 0) {
    //     vertex.force.y = -1000;
    //   }
    // }.bind(this))

    this.clearVertexForces();
    this.resetLastVars();
  }
}())

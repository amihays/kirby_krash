(function () {
  window.BB = window.BB || {};

  var Body = BB.Body = function (position, velocity, angVel, torque, vertices) {
    this.angle = 0;
    this.position = position;
    this.velocity = velocity;
    this.angVel = angVel; // angular velocity
    this.torque = torque; // angular acceleration
    this.resetLastVars();
    this.vertices = vertices;
    this.calcMass();
    this.centerOfMass = new BB.Vector(0, 0);
    this.setCenterOfMass();
    this.modifyVerticesRelativePosition();
    this.calcMomentOfInertia();
    this.kirbyImage = new Image();
    this.kirbyImage.src = "images/kirby.png";
    this.speed = 50;
  }

  Body.prototype.calcMass = function () {
    this.mass = 0;
    this.vertices.forEach(function(vertex) {
      this.mass += vertex.mass;
    }.bind(this))
  }

  Body.prototype.calcMomentOfInertia = function () {
    this.momentOfInertia = 0;
    this.vertices.forEach(function(vertex) {
      this.momentOfInertia += vertex.mass * Math.pow(vertex.relPos.magnitude(), 2);
    }.bind(this))
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

  Body.prototype.setCenterOfMass = function () {
    var vectorSum = new BB.Vector(0, 0);
    this.vertices.forEach(function(vertex) {
      vectorSum = vectorSum.add(vertex.relPos.scale(vertex.mass));
    })
    this.centerOfMass = vectorSum.scale(1 / this.mass);
  }

  Body.prototype.modifyVerticesRelativePosition = function () {
    this.vertices.forEach(function (vertex) {
      vertex.relPos = vertex.relPos.subtract(this.centerOfMass);
      vertex.origRelPos = vertex.origRelPos.subtract(this.centerOfMass);
      vertex.updateAbsPosition(this.position);
    }.bind(this))
  }

  Body.prototype.clearVertexForces = function () {
    this.vertices.forEach(function (vertex) {
      vertex.force = new BB.Vector(0, 0);
    })
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

  Body.prototype.updateTorque = function () {
    this.torque = 0;
    this.vertices.forEach(function (vertex) {
      this.torque += vertex.force.cross(vertex.relPos);
    }.bind(this))
  }

  Body.prototype.bounceOffWalls = function () {
    this.vertices.forEach(function (vertex) {
      if (vertex.outOfBoundsX() === -1) {
        this.velocity.x = Math.abs(this.velocity.x)
      } else if (vertex.outOfBoundsX() === 1) {
        this.velocity.x = -Math.abs(this.velocity.x)
      }
      if (vertex.outOfBoundsY() === -1) {
        this.velocity.y = Math.abs(this.velocity.y)
      }
    }.bind(this))
  }

  Body.prototype.resetLastVars = function () {
    this.lastPosition = this.position;
    this.lastVelocity = this.velocity;
    this.lastAngVel = this.angVel;
    this.lastTorque = this.torque;
    this.lastAngle = this.angle;
  }

  Body.prototype.moveVertices = function () {
    this.vertices.forEach(function (vertex) {
      vertex.rotate(this.angle);
      vertex.updateAbsPosition(this.position);
    }.bind(this))
  }

  Body.prototype.updateAngularMotion = function (dt) {
    var I = this.momentOfInertia;
    this.angVel = this.lastAngVel +
                  0.5 * (this.lastTorque + this.torque) *
                  (dt / I);
    this.angle = this.lastAngle +
                 (this.lastAngVel * dt) +
                 (0.5 * this.lastTorque * Math.pow(dt, 2) * (1 / I));
  }

  Body.prototype.updateLinearMotion = function (dt) {
    this.velocity = this.velocity.unitVector().scale(this.speed);
    this.position = this.lastPosition.add(this.lastVelocity.scale(dt));
  }

  Body.prototype.move = function (dt) {
    this.updateTorque();
    this.bounceOffWalls();
    this.updateLinearMotion(dt);
    this.updateAngularMotion(dt);
    this.moveVertices();
    this.clearVertexForces();
    this.resetLastVars();
  }
}())

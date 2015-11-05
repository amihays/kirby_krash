(function () {
  window.BB = window.BB || {};

  var Sprite = BB.Sprite = function (drawing, pos, size, scalar, speed, frame, dir, once) {
    this.drawing = drawing;
    this.pos = pos;
    this.size = size;
    this.scalar = scalar;
    this.speed = typeof speed === 'number' ? speed : 0;
    this._index = 0;
    this.frame = frame;
    this.dir = dir || 'horizontal';
    this.once = once;
  }
  //
  // Sprite.prototype.update = function () {
  //   this._index += this.speed; //this._index += this.speed * dt;
  // }

  Sprite.prototype.draw = function (ctx) {
    // var frame;

    // if (this.speed > 0) {
    //   var max = this.frames.length;
    //   var idx = Math.floor(this._index);
    //   frame = this.frames[idx % max];
    //
    //   if (this.once && idx >= max) {
    //     this.done = true;
    //     return;
    //   }
    // } else {
    //   frame = 0;
    // }
    //
    // var x = this.pos[0];
    // var y = this.pos[1];
    //
    // if (this.dir == 'vertical') {
    //   y += frame * this.size[1];
    // } else {
    //   x += frame * this.size[0];
    // }

    // debugger;
    // this.update()
    // var idx = Math.floor(this._index);
    // debugger;
    ctx.drawImage(this.drawing,
                  this.frame[0],
                  this.frame[1],
                  this.size[0],
                  this.size[1],
                  this.pos[0],
                  this.pos[1],
                  this.size[0] * this.scalar,
                  this.size[1] * this.scalar);

    // ctx.fillStyle = "red";
    // ctx.beginPath();
    //
    // ctx.arc(this.pos[0], //x pos
    //         this.pos[1], //y pos
    //         5,
    //         0,
    //         Math.PI * 2,
    //         false);
    // ctx.fill();


    // ctx.drawImage(drawing,
    //   x, y,
    //   0, 0,
    //   this.size[0], this.size[1],
    //   100, 100,
    //   this.size[0], this.size[1])
  }
}())

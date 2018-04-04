import Sprite from './base/sprite.js';

const DIRS = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
};

class Character extends Sprite {
  /*
  A Character is a sprite consisting of 8 sprites:
    - front-facing
    - back-facing
    - left/right-facing (mirrored for right-facing)
    - stepping forward
    - stepping backwards
    - stepping left/right (mirrored for stepping right)
  */

  constructor(options) {
    super(options);

    this.numberOfFrames = 6;
    this.spriteWidth = this.width / this.numberOfFrames;
    this.facing = options.direction || DIRS.down;
    this.moving = options.moving || false;
    this.lastFoot = 0;
  }

  getCurrentSprite() {
    /*
    Gets the appropriate sprite from spritesheet given current orientation
    and movement status.
    */

    let shift = {
      x: this.facing * this.spriteWidth,
      y: 0,
    };

    if (this.moving) {
      shift.x += this.spriteWidth * 4;

      if ([0, 1].includes(this.facing)) {
        this.lastFoot = this.lastFoot ? 0 : 1;
        shift.y = this.lastFoot * this.spriteWidth;
      }
    }

    return shift;
  }

  render() {

    return new Promise((resolve, reject) => {
      try {
        this.context.clearRect(0, 0, this.context.canvas.width,
          this.context.canvas.height);
        this.context.fillRect(0, 0, this.context.canvas.width,
          this.context.canvas.height);

        let sprite = this.getCurrentSprite();

        this.context.drawImage(
          this.image,
          sprite.x,
          sprite.y,
          this.spriteWidth,
          this.spriteWidth,
          this.xLoc,
          this.yLoc,
          this.spriteWidth * this.scaling,
          this.spriteWidth * this.scaling,
        );

        resolve();
      } catch (e) {
        reject(e);
      }
    });

  }

  move(event) {
    event.preventDefault();
    if (!this.moving) {

      if ([37, 38, 39, 40].includes(event.keyCode))
        this.moving = true;

      switch (event.keyCode) {
        case 39:
        // Pressed right key.
        this.facing = DIRS.right;
        break;
        case 37:
        // Pressed left key.
        this.facing = DIRS.left;
        break;
        case 38:
        // Pressed up key.
        this.facing = DIRS.up;
        break;
        case 40:
        // Pressed down key
        this.facing = DIRS.down;
        break;
      }
      this.render()
      .then(() => this.translate())
      .then(() => this.endMove());
    }

  }

  translate() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 250);
    });
  }

  endMove(event) {
    this.moving = false;

    this.render();
  }

};

export default Character;

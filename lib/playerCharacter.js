import Character from './base/character.js';

const DIRS = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
};

class PlayerCharacter extends Character {
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
    this.walking = options.walking || false;
    this.lastFoot = 0;
    this.locked = this.interacting = false;
    this.movementDirection = 'down';

    this.currentTile = options.currentTile || [ 0, 0 ];
    this.cancel = false
  }

  toString() {
    return `[PlayerCharacter]`;
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

    if (this.walking) {
      shift.x += this.spriteWidth * 4;

      if ([0, 1].includes(this.facing)) {
        this.lastFoot = this.lastFoot ? 0 : 1;
        shift.y = this.lastFoot * this.spriteWidth;
      }
    }

    return shift;
  }

  render() {
    // Center the player character on the screen, then render.
    this.x = (this.game.baseWidth - this.game.tileSize) / 2 * this.game.scaling;
    this.y = (this.game.baseHeight - this.game.tileSize) / 2
        * this.game.scaling;

    return super.render();
  }

  getFacingTile() {
    let x = this.currentTile[0];
    let y = this.currentTile[1];

    switch (this.movementDirection) {
      case 'down':
        return this.game.level.getTile(x, y + 1);
        break;
      case 'left':
        return this.game.level.getTile(x - 1, y);
        break;
      case 'right':
        return this.game.level.getTile(x + 1, y);
        break;
      case 'up':
        return this.game.level.getTile(x, y - 1);
        break;
    }
  }

  animateMovement() {
    return this.render();
  }

  startMove() {

    if (this.movementDirection === null)
      return;

    let movement = new Promise((resolve, reject) => {
      this.animateMovement().then(() => resolve());
    });
    movement.then(() => {
      let nextTile = this.getFacingTile();
      if (nextTile && nextTile.walkable)
        return this.game.level.slideToTile(nextTile, 150)
            .then(() => {
              this.currentTile = [ nextTile.x, nextTile.y ];
              return this.endMove();
            });
      else
        return this.endMove();
    });
  }

  move(direction) {
    // Returns a callback function for moving the character in the given
    // direction.
    if (this.controlsLocked) {
      return;
    }

    this.movementDirection = direction;
    return this.startMove;
  }

};

export default PlayerCharacter;

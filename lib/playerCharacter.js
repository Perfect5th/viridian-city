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

    this.currentTile = options.currentTile || [0, 0];
    this.cancel = false
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

    return new Promise((resolve, reject) => {
      try {
        let sprite = this.getCurrentSprite();

        this.context.clearRect(this.xLoc, this.yLoc,
          this.spriteWidth * this.scaling, this.spriteWidth * this.scaling);

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

  wakeUp(event) {
    let movementKey = false;
    let lock = false;

    if ([37, 38, 39, 40].includes(event.keyCode)) {
      event.preventDefault();
      movementKey = true;
      lock = true;
    }

    if (!this.walking && !this.locked) {

      if (movementKey && !this.interacting)
        this.walking = true;

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
        case 65:
        // Pressed 'a' key
        if (this.interacting) {
          this.endInteraction();
        } else
          this.interact();
        break;
      }

      if (this.walking) {
        this.render()
        .then(() => {
          this.locked = lock;
          return this.translate();
        })
        .then(() => {
          setTimeout(() => {
            this.endMove();
          }, 200);
        });
      }
    }

  }

  translate() {
    if (this.walking) {
      let nextTile = this.background.getFacingTile(this.facing);

      if (nextTile.walkable) {
        return this.background.slideToTile(nextTile);
      }
    }
  }

  endMove(event) {
    if (this.walking) {
      this.walking = false;
      this.render().then(() => {
        this.locked = false;
      });
    }
  }

  interact() {
    // Interact with the tile the character is currently facing.
    let tile = this.background.getFacingTile(this.facing);

    if (tile.interactible) {
      this.locked = this.interacting = true;
      tile.runInteraction(this.cancel).then(() => this.locked = false);
    }
  }

  endInteraction() {
    /* Attempts to end the current interaction.
     * This may not be possible yet, depending on the state of the interaction.
     */
    let tile = this.background.getFacingTile(this.facing);

    tile.endInteraction().then(ended => {
      if (ended) {
        this.interacting = this.locked = false;
        this.background.render();
      }
    });
  }

};

export default PlayerCharacter;

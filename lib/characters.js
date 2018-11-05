
// Constants:
// ====================================

const MOVE_DURATION = 420;
const MOVE_DISTANCE = 1;
const ANIM_FRAMES = 8;
const MOVE_LOCK_DIFF = 80;

// Data Definitions:
// ====================================

/*
 * Direction is one of:
 *   - 'up'
 *   - 'right'
 *   - 'down'
 *   - 'left'
 * interp. The direction that a Character is facing.
 */
const DIRECTIONS = {
  UP:    'up',
  RIGHT: 'right',
  DOWN:  'down',
  LEFT:  'left',
};

/*
 * Coordinate is one of:
 *   - 0
 *   - 1
 * interp. x or y coordinate. 0 == x, 1 == y
 */
const COORDS = {
  X: 0,
  Y: 1,
};

/*
 * Position is [Natural, Natural]
 * interp. an x and y coordinate of a tile in the world.
 */
const ORIGIN = [0, 0];

// Class Definitions:
// ====================================

class Character {
  /*
   * Character is new Character(SpriteMap, Position, Direction)
   * interp. A Character in the world with a set of sprites, a current position,
   *   and currently facing a specific direction
   */

  constructor(sm, pos=ORIGIN, dir=DIRECTIONS.DOWN) {
    this.spriteMap       = sm;
    this.position        = pos;
    this.directionFacing = dir;
    this.moving          = false;
    this.altMove         = false;
    this.locked          = false;
  }

  hasLoaded() {
    return this.spriteMap.hasLoaded();
  }

}

class PlayerCharacter extends Character {
  /*
   * PlayerCharacter is a Character with additional arguments ()
   */

  cycleMove(direction, coord, increment) {
    /*
     * Direction Coordinate Integer ->
     * Sets this.moving to true for MOVE_DURATION, performs movement animation
     */
    let target = this.position.slice();
    target[coord] += increment;

    this.moving = true;
    this.locked = true;
    this.altMove = !this.altMove;

    const moveAnimation = setInterval(() => {
      let endCondition = false;

      switch (direction) {
        case DIRECTIONS.RIGHT:
        case DIRECTIONS.DOWN:
          endCondition = (this.position[coord] >= target[coord]);
          break;
        case DIRECTIONS.LEFT:
        case DIRECTIONS.UP:
          endCondition = (this.position[coord] <= target[coord]);
      }

      if (endCondition) {
        this.position[coord] = target[coord];
        clearInterval(moveAnimation);
      } else {
        this.position[coord] += increment / ANIM_FRAMES;
      }
    }, MOVE_DURATION / ANIM_FRAMES);

    setTimeout(() => {
      this.moving = false;
    }, MOVE_DURATION);

    setTimeout(() => {
      this.locked = false;
    }, MOVE_DURATION + MOVE_LOCK_DIFF);
  }

  move(level, direction, coord, increment) {
    /*
     * Level Direction Coordinate Integer ->
     * Produces next state of PlayerCharacter moved in direction by increment.
     */
    if (this.locked) {
      return;
    }

    this.directionFacing = direction;

    this.cycleMove(direction, coord, increment);
  }

  moveRight(level) {
    /*
     * Level ->
     * Produces next state of PlayerCharacter by moving one position right.
     */
     this.move(level, DIRECTIONS.RIGHT, COORDS.X, MOVE_DISTANCE);
  }

  moveLeft(level) {
    /*
     * Level ->
     * Produces next state of PlayerCharacter by moving one position left.
     */
     this.move(level, DIRECTIONS.LEFT, COORDS.X, -MOVE_DISTANCE);
  }

  moveUp(level) {
    /*
     * Level ->
     * Produces next state of PlayerCharacter by moving one position left.
     */
     this.move(level, DIRECTIONS.UP, COORDS.Y, -MOVE_DISTANCE);
  }

  moveDown(level) {
    /*
     * Level ->
     * Produces next state of PlayerCharacter by moving one position left.
     */
    this.move(level, DIRECTIONS.DOWN, COORDS.Y, MOVE_DISTANCE);
  }

  render(context, tileSize) {
    /*
     * CanvasRenderingContext2D Natural -> Promise
     * Produces the correct Sprite from the SpriteMap given Character state.
     */

    return new Promise((resolve, reject) => {
      try {
        const image = this.spriteMap.getSprite(this.directionFacing,
          this.moving, this.altMove);
        const startX = context.canvas.width / 2 - tileSize / 2;
        const startY = context.canvas.height / 2 - tileSize / 2;

        context.clearRect(
          startX,
          startY,
          tileSize,
          tileSize,
        );

        context.drawImage(
          image,
          startX,
          startY,
          tileSize,
          tileSize,
        );

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

class NPCharacter extends Character {
  /*
   * NPCharacter is a Character with additional arguments ()
   */

  onScreen(context, tileSize, pcPosition) {
    /*
     * CanvasRenderingContext2D Natural Position -> Boolean
     * Produces true if the NPC is currently visible to the player.
     */

    // TODO: this actual determination.
    return false;
  }

  render(context, tileSize, pcPosition) {
    /*
     * CanvasRenderingContext2D Natural Position -> Promise
     * Produces the correct Sprite from the SpriteMap given Character state.
     */

    return new Promise((resolve, reject) => {
      if (this.onScreen(context, tileSize, pcPosition)) {
        try {
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    });
  }
}

export {
  PlayerCharacter,
  NPCharacter,
  DIRECTIONS,
};

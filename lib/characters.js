
// Constants:
// ====================================

const MOVE_DURATION = 400;
const MOVE_DISTANCE = 1;
const ANIM_FRAMES = 8;
const MOVE_LOCK_DIFF = 40;

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

  constructor(sm, pos=ORIGIN, dir=DIRECTIONS.DOWN) {
    /*
     * Character is new Character(SpriteMap, Position, Direction)
     * interp. A Character in the world with a set of sprites, a current
     *   position, and currently facing a specific direction.
     */
    this.spriteMap       = sm;
    this.position        = pos;
    this.directionFacing = dir;
    this.moving          = false;
    this.altMove         = false;
  }

  hasLoaded() {
    /*
     * Character -> Character Promise
     * produce a promise that resolves if the Character sprite has loaded.
     */
    return this.spriteMap.hasLoaded();
  }

}

class PlayerCharacter extends Character {

  constructor(sm, pos=ORIGIN, dir=DIRECTIONS.DOWN) {
    /*
     * PlayerCharacter is new PlayerCharacter(SpriteMap, Position, Direction)
     * interp. The player character, with set of sprites, current position, and
     *   currently facing a specific direction.
     */

    super(sm, pos, dir);

    this.locked = false;
  }

  cycleMove(direction, coord, increment) {
    /*
     * PlayerCharacter Direction Coordinate Integer -> PlayerCharacter
     * produce next PlayerCharacter moved in direction by increment
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
     * PlayerCharacter Level Direction Coordinate Integer -> PlayerCharacter
     * Produces next PlayerCharacter moved in direction by increment
     */
    if (this.locked) {
      return;
    }

    let moveTargetPos = this.position.slice();
    moveTargetPos[coord] += increment;

    const canMove = level.getTile(moveTargetPos)
      && level.getTile(moveTargetPos).walkable;

    this.directionFacing = direction;

    if (canMove) {
      this.cycleMove(direction, coord, increment);
    } else {
      this.cycleMove(direction, coord, 0);
    }
  }

  moveRight(level) {
    /*
     * PlayerCharacter Level -> PlayerCharacter
     * Produces next state of PlayerCharacter by moving one position right.
     */
     this.move(level, DIRECTIONS.RIGHT, COORDS.X, MOVE_DISTANCE);
  }

  moveLeft(level) {
    /*
     * PlayerCharacter Level -> PlayerCharacter
     * Produces next state of PlayerCharacter by moving one position left.
     */
     this.move(level, DIRECTIONS.LEFT, COORDS.X, -MOVE_DISTANCE);
  }

  moveUp(level) {
    /*
     * PlayerCharacter Level -> PlayerCharacter
     * Produces next state of PlayerCharacter by moving one position left.
     */
     this.move(level, DIRECTIONS.UP, COORDS.Y, -MOVE_DISTANCE);
  }

  moveDown(level) {
    /*
     * PlayerCharacter Level -> PlayerCharacter
     * Produces next state of PlayerCharacter by moving one position left.
     */
    this.move(level, DIRECTIONS.DOWN, COORDS.Y, MOVE_DISTANCE);
  }

  render(context, tileSize) {
    /*
     * PlayerCharacter CanvasRenderingContext2D Natural -> Promise
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

  onScreen(context, x, y, tileSize) {
    /*
     * NPCharacter CanvasRenderingContext2D Number Number Natural -> Boolean
     * Produces true if the NPC at x y pixels in currently on screen.
     */

    return (
      x > 0 - tileSize
      && x <= context.canvas.width
      && y > 0 - tileSize
      && y <= context.canvas.height
    );
  }

  occupyTile(level, position) {
    /*
     * NPCharacter Level Position -> Level
     * Sets the tile the NPC currently occupies to not-walkable.
     */

    level.getTile(position).walkable = false;
  }

  unOccupyTile(level, position) {
    /*
     * NPCharacter Level -> Level
     * Sets the tile the NPC currently occupies to walkable.
     */

    level.getTile(position).walkable = true;
  }

  render(context, tileSize, pcPosition) {
    /*
     * NPCharacter Level CanvasRenderingContext2D Natural Position -> Promise
     * Produces the correct Sprite from the SpriteMap given Character state.
     */

    return new Promise((resolve, reject) => {
      const startX = context.canvas.width / 2 - tileSize / 2
        + (this.position[COORDS.X] - pcPosition[COORDS.X])
        * tileSize;
      const startY = context.canvas.height / 2 - tileSize / 2
        + (this.position[COORDS.Y] - pcPosition[COORDS.Y])
        * tileSize;

      if (this.onScreen(context, startX, startY, tileSize)) {
        try {
          const image = this.spriteMap.getSprite(this.directionFacing,
            this.moving, this.altMove);

          context.clearRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height,
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
  COORDS,
};

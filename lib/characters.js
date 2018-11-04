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
  }

  hasLoaded() {
    return this.spriteMap.hasLoaded();
  }

  render() {
    /*
     * Produces the correct Sprite from the SpriteMap given Character state.
     */

    return this.spriteMap.getSprite(this.directionFacing, this.moving);
  }
}

class PlayerCharacter extends Character {
  /*
   * PlayerCharacter is a Character with additional arguments ()
   */

  // TODO
}

class NPCharacter extends Character {
  /*
   * NPCharacter is a Character with additional arguments ()
   */

  // TODO
}

export {
  PlayerCharacter,
  NPCharacter,
};

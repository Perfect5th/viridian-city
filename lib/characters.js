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

}

class PlayerCharacter extends Character {
  /*
   * PlayerCharacter is a Character with additional arguments ()
   */

  render(context, tileSize) {
    /*
     * CanvasRenderingContext2D Natural -> Promise
     * Produces the correct Sprite from the SpriteMap given Character state.
     */

    return new Promise((resolve, reject) => {
      try {
        let image = this.spriteMap.getSprite(this.directionFacing, this.moving);

        context.drawImage(
          image,
          context.canvas.width / 2 - tileSize / 2,
          context.canvas.height / 2 - tileSize / 2,
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

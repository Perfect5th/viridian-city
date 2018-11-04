import { imgFromURI } from './image-utils.js';
import { DIRECTIONS } from './characters.js';

// Class Definitions:
// ====================================

class SpriteMap {

  constructor(size, uris) {
    /*
     * SpriteMap is new SpriteMap(Natural, [ Image * 10 ])
     * interp. A collection of 10 sprite image URIs of given size (pixels) in
     *   the following order:
     *   - facing down
     *   - facing up
     *   - facing left
     *   - facing right
     *   - walking down 1
     *   - walking down 2
     *   - walking up 1
     *   - walking up 2
     *   - walking left
     *   - walking right
     */

    this.size = size;

    [
      this.down,
      this.up,
      this.left,
      this.right,
      this.walkDown1,
      this.walkDown2,
      this.walkUp1,
      this.walkUp2,
      this.walkLeft,
      this.walkRight,
    ] = uris.map(uri => imgFromURI(uri, this.size, this.size));
  }

  hasLoaded() {
    /*
     * -> Promise
     * Produce a promise that resolves when all sprite images loaded
     */

    return Promise.all([
      this.down,
      this.up,
      this.left,
      this.right,
      this.walkDown1,
      this.walkDown2,
      this.walkUp1,
      this.walkUp2,
      this.walkLeft,
      this.walkRight,
    ].map(img => img.loaded));
  }

  getSprite(dir, moving, useAlt) {
    /*
     * Direction Boolean Boolean -> Image
     * Produce the correct image for the current direction and movement state.
     */

    switch (dir) {
      case DIRECTIONS.UP:
        if (moving) {
          return (useAlt ? this.walkUp2 : this.walkUp1);
        } else {
          return this.up;
        }
      case DIRECTIONS.RIGHT:
        return (moving ? this.walkRight : this.right);
      case DIRECTIONS.DOWN:
        if (moving) {
          return (useAlt ? this.walkDown2 : this.walkDown1);
        } else {
          return this.down;
        }
      case DIRECTIONS.LEFT:
        return (moving ? this.walkLeft : this.left);
    }
  }

};

export default SpriteMap;

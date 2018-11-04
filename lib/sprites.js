import { imageLoadedProm } from './image-utils.js';

// Class Definitions:
// ====================================

class SpriteMap {

  constructor(imgs) {
    /*
     * SpriteMap is new SpriteMap([ Image * 10 ])
     * interp. A collection of 10 sprite images in the following order:
     *  - facing down
     *  - facing up
     *  - facing left
     *  - facing right
     *  - walking down 1
     *  - walking down 2
     *  - walking up 1
     *  - walking up 2
     *  - walking left
     *  - walking right
     */

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
    ] = imgs;
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
    ].map(img => imageLoadedProm(img)));
  }

};

export default SpriteMap;

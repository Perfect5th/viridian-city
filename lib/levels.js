import { imageLoadedProm } from './image-utils.js';

// Class Definitions:
// ====================================

class Level {

  constructor(bg, tileSize, tileSet) {
    /*
    * Level is new Level(URI, Number, TileSet)
    * interp. a game level with a background image, a square tile size
    *   (in pixels), and a set of possibly interactible tiles.
    */
    this.bg       = bg;
    this.tileSize = tileSize;
    this.tileSet  = tileSet;
  }

  hasLoaded() {
    return imageLoadedProm(this.bg);
  }
}

export default Level;

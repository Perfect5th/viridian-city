import Sprite from './sprite.js';

class Tile {

  constructor(options) {
    this.walkable = options.walkable || false;
    this.interactible = options.interactible || false;
  }

};

export default Tile;

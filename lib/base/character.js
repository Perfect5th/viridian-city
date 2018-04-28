import Renderable from '../canvas/renderable.js';
import Sprite from '../canvas/image/sprite.js';


class Character extends Renderable {

  constructor(options) {
    super();

    if (typeof options.sprite === 'undefined')
      throw Error("A sprite image must be provided when adding a character");

    this.image = new Sprite();
    this.image.src = options.sprite;
    this.image.parent = this;
  }

  toString() {
    return `[Character src=${this.image.src}]`;
  }

}

export default Character;

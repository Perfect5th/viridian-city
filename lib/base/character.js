import Renderable from './renderable.js'


class Character extends Renderable {

  constructor(options) {
    super();

    if (typeof options.sprite === 'undefined')
      throw Error("A sprite image must be provided when adding a character");

    this.image = new Image();
    this.image.src = options.sprite;
  }

}

export default Character;

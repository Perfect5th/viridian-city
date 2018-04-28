import Sprite from './image/sprite.js';
import Background from './image/background.js';


class Renderable {

  ready() {
    // Promise that resolves when the renderable's image has finished loading.
    if (typeof this.image === 'undefined')
      throw Error("Classes derived from Renderable must have an the " +
          "attribute `image`, an Image object");

    return new Promise((resolve, reject) => {
      this.image.addEventListener('load', resolve);
    });
  }

  clear(context, options) {
    console.log(`Clearing for ${this}`);
    const clearOptions = options.slice(1, options.length);
    context.clearRect(...clearOptions);
  }

  draw(context, options) {
    return new Promise((resolve, reject) => {
      try {
        this.clear(context, options);
        context.drawImage(...options);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  renderLevel(options) {
    console.log(`rendering ${this}`);
    const context = this.game.levelLayer.getContext('2d')
    // TODO: Figure out options for renderLevel.

    return this.draw(context, drawOptions);
  }

  renderSprite(options) {
    console.log(`rendering ${this}`);
    const context = this.game.characterLayer.getContext('2d');
    let drawOptions = [
      ...this.image.frontView,
      this.x,
      this.y,
      this.game.tileSize * this.game.scaling,
      this.game.tileSize * this.game.scaling,
    ];

    return this.draw(context, drawOptions);
  }

  renderImage(options) {
    console.log(`rendering ${this}`);
    // TODO: implement renderImage (if it's needed)/
  }

  render(options) {
    // Triages to renderSprite() or renderImage() based on the type of the
    // instance.
    if (typeof this.image === 'undefined')
      throw Error(`Renderable ${this} does not have an image to render`);

    if (this.image instanceof Sprite)
      return this.renderSprite(options);
    else if (this.image instanceof Background)
      return this.renderBackground(options);
    else
      return this.renderImage(options);
  }

}

export default Renderable;

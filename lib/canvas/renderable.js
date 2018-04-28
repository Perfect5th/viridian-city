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
    return new Promise((resolve, reject) => {
      console.log(`Clearing for ${this}.`);
      const clearOptions = options.slice(1, options.length);
      context.clearRect(...clearOptions);
      resolve();
    });
  }

  underDraw(context, options) {
    // Draw black (or possibly other color) `underbackground` for level
    // backgrounds.

    return new Promise((resolve, reject) => {
      try {
        context.fillRect(
          0,
          0,
          this.game.levelLayer.width,
          this.game.levelLayer.height,
        );
        resolve();
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  draw(context, options) {
    return new Promise((resolve, reject) => {
      try {
        console.log(`Rendering ${this}`);
        context.drawImage(...options);
        resolve();
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  renderLevel(options) {
    const context = this.game.levelLayer.getContext('2d')
    let drawOptions = [
      this.image,
      ...this.currentWindow,
      0,
      0,
      this.game.levelLayer.width,
      this.game.levelLayer.height,
    ];

    return this.underDraw(context, drawOptions)
        .then(() => this.draw(context, drawOptions));
  }

  renderSprite(options) {
    const context = this.game.characterLayer.getContext('2d');



    let drawOptions = [
      ...this.image[this.spriteStatus],
      this.x,
      this.y,
      this.game.tileSize * this.game.scaling,
      this.game.tileSize * this.game.scaling,
    ];

    return this.clear(context, drawOptions)
        .then(() => this.draw(context, drawOptions));
  }

  renderImage(options) {
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
      return this.renderLevel(options);
    else
      return this.renderImage(options);
  }

}

export default Renderable;

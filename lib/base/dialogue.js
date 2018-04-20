import Sprite from './sprite.js';

class Dialogue extends Sprite {

  constructor(options) {
    options.image = options.dialogueBackground;
    super(options);

    if (!options.letterMap)
      throw new Error('No letterMap provided');
    else
      this.letterMap = options.letterMap;
    this.textColor = options.textColor || '#000';
    this.dialogue = options.dialogue || 'No dialog provided';
    this.padding = options.padding || 0;
    this.fontSize = options.fontSize || 10 * this.scaling;
    this.fontFace = options.fontFace || 'sans-serif';
    this.font = options.font ||
        `${this.fontSize}px ${this.fontFace}`;
  }

  render() {
    return super.render().then(() => {
      return new Promise((resolve, reject) => {
        try {
          this.context.fillStyle = this.textColor;

          this.context.font = this.font;

          this.padding = this.padding || this.fontSize * 2;
          this.context.fillText(this.dialogue, this.xLoc + this.padding,
              this.yLoc + this.padding);
          resolve();
        } catch (e) {
          reject();
        }
      });
    });
  }

}

export default Dialogue;

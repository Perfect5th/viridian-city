import Sprite from './sprite.js';

class Dialogue extends Sprite {

  constructor(options) {
    options.image = options.dialogueBackground;
    super(options);

    if (!this.letterMap)
      throw new Error('No letterMap provided');
    this.textColor = options.textColor || '#000';
    this.dialogue = options.dialogue || 'No dialog provided';
  }

  render() {
    super.render().then(() => {
      return new Promise((resolve, reject) => {
        try {
          this.context.fillStyle = this.textColor;

          this.context.fillText(this.dialogue, this.xLoc + this.padding,
              this.yLoc + this.padding, this.width - this.padding * 2);
          resolve();
        } catch (e) {
          reject();
        }
      });
    });
  }

}

export default Dialogue;

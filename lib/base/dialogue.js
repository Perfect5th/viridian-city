import Sprite from './sprite.js';

class Dialogue extends Sprite {

  constructor(options) {
    options.image = options.dialogueBackground;
    super(options);

    this.letterMap = options.letterMap || '';
    this.textColor = options.textColor || '#000';
    this.dialogue = options.dialogue || 'No dialog provided';
    this.padding = options.padding;
    this.fontSize = options.fontSize || 10;
    this.fontFace = options.fontFace || 'sans-serif';
  }

  render(cancel) {
    return super.render().then(() => {
      return new Promise((resolve, reject) => {
        try {
          this.context.fillStyle = this.textColor;

          this.context.font = `${this.fontSize * this.scaling}px ${this.fontFace}`;

          this.padding = this.padding || this.fontSize * this.scaling * 2;

          let cleared = false;
          for (let i = 0; i < this.dialogue.length; i++) {
            setTimeout(() => {
              if (cancel) {
                if (!cleared) {
                  this.clear();
                  cleared = true;
                }
              } else {
                super.render().then(() => {
                  this.context.fillText(this.dialogue.slice(0, i),
                  this.xLoc + this.padding, this.yLoc + this.padding);

                  if (i === this.dialogue.length - 1) {
                    // Done rendering the text - time to resolve.
                    this.completed = true;
                    resolve();
                  }
                });
              }
            }, 100 * i);
          }
        } catch (e) {
          reject();
        }
      });
    });
  }

  clear() {
    return new Promise((resolve, reject) => {
      if (this.completed) {
        super.clear();
        resolve(true);
      } else
        resolve(false);
    });
  }

}

export default Dialogue;

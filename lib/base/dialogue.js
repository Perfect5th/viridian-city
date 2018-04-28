import Renderable from './renderable.js';


class Dialogue extends Renderable {
  /*
   * Class for displaying and interacting with dialogue boxes.
   *
   * Options
   *   *required"
   *     dialogue <string>: the text of the dialogue box.
   *     style <object>: a dialogueStyle object with:
   *       *required*
   *         background <string>: URI of dialogue background image.
   *         start <Array [x, y]>: starting corner of dialogue box (pixels).
   *         end <Array [x, y]>: ending corner of dialogue box (pixels).
   *       _optional_
   *         textColor <string '#RGB'>: color of dialogue text. Defaults to
   *             #000.
   *         fontSize <int>: font size. Defaults to 10.
   *         fontFace <string>: font face. Defaults to 'sans-serif'.
   *         padding <int>: padding around text. Defaults to 0.
   */

  constructor(options) {
    super();
    this.background = new Image();
    this.background.src = options.style.background;

    this.textColor = options.textColor || '#000';
    this.padding = options.padding || 0;
    this.fontSize = options.fontSize || 10;
    this.fontFace = options.fontFace || 'sans-serif';

    if (typeof options.dialogue === 'undefined')
      throw Error("No dialogue string has been provided.");
    else
      this.dialogue = options.dialogue;
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

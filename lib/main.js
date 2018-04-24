import Character from './character.js';
import Background from './base/background.js';
import Tile, { DialogueTile } from './base/tile.js';


class VCGame {
  /*
  Main class that is instantiated to start the game. Requires a spritesheet for
  the player character and a background, with options passed as objects.
  */

  constructor(options) {
    this.scaling = options.scaling || 1;
    this.tileSize = options.tileSize || 16;
    this.currentTile = options.startTile || [0, 0];
  }

  addBackground(options) {
    this.background = new Background({
      canvas: options.canvas,
      image: options.image,
      width: options.width,
      height: options.height,
      currentTile: this.currentTile,
      scaling: this.scaling,
      spriteWidth: this.tileSize,
    });

    this.setCanvas(options.canvas);

    if (this.mainCharacter && !this.mainCharacter.background)
      this.mainCharacter.background = this.background;
  }

  addMainCharacter(options) {
    this.mainCharacter = new Character({
      context: options.canvas.getContext('2d'),
      image: options.image,
      width: this.tileSize * 6,
      height: this.tileSize * 2,
      xLoc: 4.5 * this.tileSize * this.scaling,
      yLoc: 4 * this.tileSize * this.scaling,
      scaling: this.scaling,
      currentTile: this.currentTile,
    });

    this.setCanvas(options.canvas);

    if (this.background && !this.mainCharacter.background)
      this.background.mainCharacter = this.mainCharacter;
  }

  setCanvas(canvas) {
    canvas.width = 160 * this.scaling;
    canvas.height = 144 * this.scaling;
  }

  waitForImages() {
    let imagePromises = [this.background.image, this.mainCharacter.image].map(i => {
      return new Promise((resolve, reject) => {
        i.addEventListener('load', () => resolve());
      });
    });

    return Promise.all(imagePromises);
  }

  addTile(tileInput) {
    // Alias for Background.addTile().
    if (tileInput.sprite)
      tileInput.sprite.scaling = this.scaling;

    this.background.addTile(tileInput);
  }

  addDialogueTile(options) {
    // Instantiates a dialogue tile from options and adds it to the tileMap.
    options.context = options.canvas.getContext('2d');
    let bgImage = new Image();
    bgImage.src = options.background;
    options.dialogueBackground = bgImage;

    let tile = new DialogueTile({
      walkable: options.walkable,
      interactible: options.interactible,
      dialogueOptions: options,
    });

    tile.x = options.x;
    tile.y = options.y;

    this.addTile(tile);
  }

  start() {
    // Starts the game once all required images have loaded.

    this.waitForImages()
        .then(() => this.background.render())
        .then(() => this.mainCharacter.render())
        .then(() => {
          document.addEventListener('keydown', e => {
            this.mainCharacter.wakeUp(e, this.background)
          });
        });
  }

};

export default VCGame;

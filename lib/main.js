import PlayerCharacter from './playerCharacter.js';
import NPC from './npc.js';
import Level from './base/level.js';
import { DialogueTile } from './base/tiles.js';

class VCGame {
  /*
  Main class that is instantiated to start the game.

  Includes methods for adding characters, levels, tiles, dialogues, menus, etc.,
  but mainly just acts as an interface for the developer to put the game
  together before running it.
  */

  constructor(elem, options) {
    this.scaling = options.scaling || 1;
    this.tileSize = options.tileSize || 16;

    this.NPCs = [];
    this.dialogueStyles = {};
  }

  addPlayerCharacter(options) {
    // Instantiates and adds a controllable PlayerCharacter to the game.
    if (typeof this.playerCharacter !== 'undefined')
      throw Error("A Player Character has already been added to this game. " +
          "You'll need to remove the existing Player Character before adding " +
          "another one");

    this.playerCharacter = new PlayerCharacter(options);
    this.playerCharacter.game = this;
  }

  addNPC(options) {
    // Instantiates and adds a Non-Player Character to the game.
    let npc = new NPC(options);
    npc.game = this;
    this.NPCs.push(npc);
  }

  addCharacter(isPlayerCharacter=false, options) {
    // Triages addition of Character based on `isPlayerCharacter`.
    if (isPlayerCharacter) {
      this.addPlayerCharacter(options);
    } else {
      // Character must be an NPC
      this.addNPC(options);
    }
  }

  addLevel(options, tileSet) {
    // Instantiates and adds a Level to the game.
    this.level = new Level(options);
    this.level.game = this;

    if (tileSet)
      this.level.addTile(tileSet);
  }

  addTile(tileInput) {
    // Alias for Level.addTile(), with checking for existing level.
    if (typeof this.level === 'undefined')
      throw Error("A level must be added before tiles can be added.");

    this.level.addTile(tileInput);
  }

  addDialogueStyle(name, options) {
    if (typeof name !== 'string')
      throw Error("Please provide a string as the name for the new Dialogue " +
          "Style");

    this.dialogueStyles[name] = options;
  }

  addDialogueTile(options) {
    // Instantiates a dialogue tile and adds it to the tileMap.

    let style;
    if (typeof options.style === 'string')
      style = this.dialogueStyles[options.style]

    if (typeof style === 'undefined')
      throw Error("A dialogueStyle was either not provided, or a style has" +
          "not been added for the given style name.");

    options.style = style;
    let tile = new DialogueTile(options);

    this.addTile(tile);
  }

 /*
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
 */
};

export default VCGame;

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

  constructor(elemID, options) {
    if (typeof elemID !== 'string')
      throw Error("Please provide the ID of the parent element of the game " +
        "as the first argument when instantiating a new game.");

    this.parentElem = document.getElementById(elemID);

    if (this.parentElem === null)
      throw Error("Provided parent element ID is not an existing DOM element.");

    this.parentElem.style.position = 'relative';

    this.scaling = options.scaling || 1;
    this.tileSize = options.tileSize || 16;
    this.baseWidth = 160;
    this.baseHeight = 144;

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

  createLayers() {
    // Creates the canvases for each layer of the game
    this.levelLayer = document.createElement('canvas');
    this.levelLayer.id = 'levelLayer';

    this.characterLayer = document.createElement('canvas');
    this.characterLayer.id = 'characterLayer';

    this.dialogueLayer = document.createElement('canvas');
    this.dialogueLayer.id = 'dialogueLayer';

    [this.levelLayer, this.characterLayer, this.dialogueLayer]
        .forEach((l, i) => {
          l.width = this.scaling * this.baseWidth;
          l.height = this.scaling * this.baseHeight;
          l.style.zIndex = i * 100;
          l.style.position = 'absolute';
          l.top = 0;
          l.left = 0;
          this.parentElem.appendChild(l);
        });
  }

  start() {
    // Starts the game:
    // 1. creates the canvas layers
    // 2. ensures the required assets are loaded

    this.createLayers();

    Promise.all([
      this.level.ready(),
      this.playerCharacter.ready(),
    ]).then(() => this.level.render())
      .then(() => this.playerCharacter.render());
  }

};

export default VCGame;

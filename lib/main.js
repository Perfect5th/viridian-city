import Character from './character.js';
import Background from './base/background.js';
import Tile, { DialogueTile } from './base/tile.js';

// Constants
// ====================================

const WIDTH = 160;
const HEIGHT = 144;

const CANVAS_CSS = "position: absolute; top: 0; left: 0; z-index: 1";

const DEFAULTS = {
  SCALING: 1,
  TICK_SPEED: 1000,
};

const KEYCODES = {
  RIGHT: 39,
  LEFT:  37,
  UP:    38,
  DOWN:  40,
  A:     65,
};

// Class Definitions
// ====================================

class VCGame {
  /*
   * VCGame is new VCGame(
   *   Element,
   *   PlayerCharacter,
   *   [ NPCharacter, ],
   *   Level,
   *   {
   *     scaling: Number,
   *     tickSpeed: Number,
   *   }
   * )
   *
   * Interp. A Viridian City Game with a PlayerCharacter (pc), an arbitrary
   *   amount of NPCharacters (npc), and a starting Level on a screen scaled by
   *   scaling and tick speed of tickSpeed.
   *
   *   The game is rendered on an HTML5 canvas within the given Element.
   *
   * Usage:
   *  - VCGame.start(): start the game
   *  - VCGame.stop(): stop the game
   */

  constructor(screen, pc, npcs, level, options={}) {
    this.screen    = screen;
    this.pc        = pc;
    this.npcs      = npcs;
    this.level     = level;
    this.scaling   = options.scaling || DEFAULTS.SCALING;
    this.tickSpeed = options.tickSpeed || DEFAULTS.TICK_SPEED;
  }

  tick() {
    /*
     * Updates the world state every this.tickSpeed milliseconds.
     */

    this.render();
  }

  awaitAssets() {
    return Promise.all([
      this.level.hasLoaded(),
      this.pc.hasLoaded(),
      ...this.npcs.map(npc => npc.hasLoaded),
    ]);
  }

  render() {
    /*
     * Renders the game world to the HTML5 canvas.
     */

    this.awaitAssets()
      .then(() => this.renderLevel())
      .then(() => this.renderPC())
      .then(() => this.renderNPCs());
  }

  handleKey(ke) {
    /*
     * Runs the appropriate keyevent handler for the given key.
     */

    switch (ke) {
      case KEYCODES.RIGHT:
        return this.pc.moveRight();
      case KEYCODES.LEFT:
        return this.pc.moveLeft();
      case KEYCODES.UP:
        return this.pc.moveUp();
      case KEYCODES.DOWN:
        return this.pc.moveDown();
      case KEYCODES.A:
        return this.pc.interact();
      default:
        return;
    }
  }

  start() {
    /*
     * Starts the game by starting the clock and creating the keydown listeners.
     */
    this.clock = setInterval(() => this.tick(), this.tickSpeed);

    document.addEventListener('keydown', e => this.handleKey(e.keyCode));

    this.backgroundCanvas = document.createElement('canvas');
    this.backgroundCanvas.style.cssText = CANVAS_CSS;
    this.backgroundCanvas.width = WIDTH * this.scaling;
    this.backgroundCanvas.height = HEIGHT * this.scaling;

    this.characterCanvas = this.backgroundCanvas.cloneNode();
    this.characterCanvas.style.zIndex = 2;

    this.screen.style.position = 'relative';

    this.screen.appendChild(this.backgroundCanvas);
    this.screen.appendChild(this.characterCanvas);
  }

  stop() {
    clearInterval(this.clock);
  }

};

export default VCGame;

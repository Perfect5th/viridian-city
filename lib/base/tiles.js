import Dialogue from './dialogue.js';


class Tile {
  // Base Tile class
  constructor(options) {
    this.walkable = options.walkable || false;
    this.interactible = options.interactible || false;

    this.interaction = options.interaction || (() => console.log('generic interaction'));
  }

  runInteraction(cancel) {
    // Run interaction for this tile.
    this.interaction(cancel);
  }

  endInteraction() {
    // Close the interaction for this tile.
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

}

class DialogueTile extends Tile {
  /*
   * A tile that opens a dialogue when interacted with.
   */

  constructor(options) {
    options.interactible = options.interactible || true;

    super(options);

    this.dialogue = new Dialogue(options);
    this.sprite = this.dialogue;
  }

  runInteraction(cancel) {
    return this.openDialogue(cancel);
  }

  endInteraction() {
    return this.dialogue.clear();
  }

  openDialogue(cancel) {
    return this.dialogue.render(cancel);
  }

  closeDialogue() {
    return this.dialogue.clear();
  }

}

export default Tile;
export { DialogueTile };

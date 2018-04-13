import Dialogue from './dialogue.js';

class Tile {
  // Base Tile class
  constructor(options) {
    this.walkable = options.walkable || false;
    this.interactible = options.interactible || false;
  }

  interaction() {
    // Run interaction for this tile.
  }

}


class DialogueTile extends Tile {
  // A tile that opens a dialogue when interacted with.
  constructor(options) {
    super(options);

    this.dialogue = new Dialogue(options.dialogueOptions);
  }

  interaction() {
    return this.openDialogue();
  }

  openDialogue() {
    return this.dialogue.render();
  }

}


export default Tile;

import Dialogue from './dialogue.js';

class Tile {
  // Base Tile class
  constructor(options) {
    this.walkable = options.walkable || false;
    this.interactible = options.interactible || false;

    this.interaction = options.interaction || (() => console.log('generic interaction'));
  }

  runInteraction() {
    // Run interaction for this tile.
    this.interaction();
  }

}


class DialogueTile extends Tile {
  // A tile that opens a dialogue when interacted with.
  constructor(options) {
    super(options);

    this.dialogue = new Dialogue(options.dialogueOptions);
  }

  runInteraction() {
    return this.openDialogue();
  }

  openDialogue() {
    return this.dialogue.render();
  }

  closeDialogue() {
    return this.dialogue.clear();
  }

}


export default Tile;
export { DialogueTile };

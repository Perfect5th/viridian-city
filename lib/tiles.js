
// Class Definitions:
// ====================================

class Tile {

  constructor(walkable=true, occupied=false) {
    /*
     * Tile is new Tile(Boolean)
     *   - a tile that is or is not walkable and whether it is occupied
     */

    this.walkable = walkable;
    this.occupied = occupied;
  }

};

export default Tile;

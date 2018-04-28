import Renderable from '../canvas/renderable.js';
import Tile from './tiles.js';


class Level extends Renderable {
  /*
   * Class for defining levels, including their background images and tilemaps.
   *
   * options:
   *   *required*
   *     background <string>: URI of background image for the level
   */

  constructor(options) {
    super();

    if (typeof options.background === 'undefined')
      throw Error("You must provide a background image URL to create a level.");

    this.background = new Image();
    this.background.src = options.background;

    this.image = this.background;
  }

  toString() {
    return `[Level src=${this.background.src}]`;
  }

  initiateTileMap() {
    return this.ready().then(() => {
      return new Promise((resolve, reject) => {
        // The total number of horizontal and vertical tiles is the width or height
        // of the image divided by the spriteWidth/tileWidth. If not evenly
        // divisible, any extra background image is not part of the `map`.
        this.xTiles = parseInt(this.background.width / this.game.tileSize, 10);
        this.yTiles = parseInt(this.background.height / this.game.tileSize, 10);

        // Instantiate and fill the map with nullTiles.
        // TODO: There must be a more efficient/simpler way to do this.
        this.tileMap = new Array(this.xTiles);
        this.tileMap = this.tileMap.fill(new Array(this.yTiles))
        this.tileMap.forEach(a => a = a.fill(null));
        this.tileMap = this.tileMap.map(arr => arr.slice());

        // The next slot to be filled by Background.addTile().
        this.currSlot = {
          x: 0,
          y: 0,
        };

        resolve();
      });
    });
  }

  advanceTileMapSlot() {
    // Moves currSlot to the next slot in the tileMap.
    if (this.currSlot.x < this.xTiles - 1) {
      this.currSlot++;
    } else {
      if (this.currSlot.y < this.yTiles - 1) {
        this.currSlot.x = 0;
        this.currSlot.y++;
      } else
        throw Error("tileMap is full - cannot add another tile to the end.");
    }
  }

  addTilesFromMap(mapInput) {
    // Inserts tiles based on an object map/array.

    mapInput.forEach((item, index) => {

      switch (item.type) {

        case 'tile':
          let tile = new Tile(item.options);

          if (item.x && item.y) {
            tile.x = item.x;
            tile.y = item.y;
            this.addTileToCoord(tile);
          } else
            this.addTileToNextSlot(tile);
          break;

        case 'range':
          // Add the tile type to each tile in the x, y range provided,
          // end-exclusive.
          for (let i = item.start[0]; i < item.end[0]; i++) {
            for (let j = item.start[1]; j < item.end[1]; j++) {
              let tile = new Tile(item.options);
              tile.x = i;
              tile.y = j;
              this.addTileToCoord(tile);
            }
          }
          break;

        default:
          throw Error(`Invalid type specified for tileMap item ${item} at` +
              `index ${index}`);
      }

    });
  }

  addTileToCoord(tile) {
    try {
      this.tileMap[tile.x, tile.y] = tile;
    } catch (e) {
      throw Error(`Can't add tile: coordinates at (${tile.x}, ${tile.y}) ` +
          `outside of tileMap`);
    }
  }

  addTileToNextSlot(tile) {
    // Inserts a tile into the next open slot in the tileMap.
    tile.x = this.currSlot.x;
    tile.y = this.currSlot.y;
    this.tileMap[tile.x, tile.y] = tile;

    this.advanceTileMapSlot();
  }

  addTile(tileInput) {
    // Triages different methods for adding tiles.
    if (typeof this.tileMap === 'undefined') {
      this.initiateTileMap().then(() => {
        this.addTile(tileInput);
      });
    } else {
      if (tileInput instanceof Tile) {
        if (tileInput.x && tileInput.y)
          this.addTiletoCoord(tileInput);
        else
          this.addTileToNextSlot(tileInput);
      } else if (tileInput instanceof Array)
        this.addTilesFromMap(tileInput);
      else
        throw Error("Please provide either a Tile instance or tileMap array " +
            "when adding a tile to a level.");
    }

  }

}

export default Level;

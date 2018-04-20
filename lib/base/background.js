import Tile from './tile.js';


class Background {
  /*
  Base class for describing the world surrounding (behind) the character.

  Requires a canvas context - should be one with a lower z-index than the one
  belonging to the player character and other sprites.

  options = {
    context: canvas.getContext('2d'),
    image: Image object - 8 sprite sprite-sheet,
    scaling: scaling factor for canvas (int),
    width: total width of background image (int),
    height: total height of background image (int),
    spriteWidth: the width of one square `tile` (int),
    currentTile: the starting tile (arr: [x, y], default: [0, 0]),
  }
  */

  constructor(options) {
    this.canvas = options.canvas;
    this.context = this.canvas.getContext('2d');
    this.image = options.image;
    this.scaling = options.scaling;
    this.width = options.width;
    this.height = options.height;
    this.spriteWidth = options.spriteWidth;

    // The total number of horizontal and vertical tiles is the width or height
    // of the image divided by the spriteWidth/tileWidth. If not evenly
    // divisible, any extra background image is not part of the `map`.
    this.xTiles = parseInt(this.width / this.spriteWidth, 10);
    this.yTiles = parseInt(this.height / this.spriteWidth, 10);

    // Instantiate and fill the map with nullTiles.
    // TODO: There must be a more efficient/simpler way to do this.
    this.tileMap = new Array(this.xTiles);
    this.tileMap = this.tileMap.fill(new Array(this.yTiles));
    this.tileMap.forEach(a => {
      a = a.fill(null)
    });
    this.tileMap = this.tileMap.map(arr => arr.slice());

    this.currentTile = options.currentTile || [0, 0];

    // The next slot to be filled by Background.addTile().
    this.currSlot = {
      x: 0,
      y: 0,
    };
  }

  getCurrentCoords() {
    // Converts the [x, y] of the current tile to pixel values to align the
    // `game location` with the physical location on the background.
    let x = this.currentTile[0];
    let y = this.currentTile[1];

    return {
      x: x * this.spriteWidth - this.spriteWidth / 2,
      y: y * this.spriteWidth,
    };
  }

  adjustCoords(coords) {
    // Adjusts coordinates for rendering to compensate for screen height and width
    let x = coords.x - 4 * this.spriteWidth;
    let y = coords.y - 4 * this.spriteWidth;

    return { x: x, y: y };
  }

  render() {
    let coords = this.getCurrentCoords();

    let adjustedCoords = this.adjustCoords(coords);

    return new Promise((resolve, reject) => {
      try {
        this.context.fillStyle = '#333';
        this.context.fillRect(0, 0, this.canvas.width,
          this.canvas.height);

        this.context.drawImage(
          this.image,
          adjustedCoords.x,
          adjustedCoords.y,
          this.canvas.width / this.scaling,
          this.canvas.height / this.scaling,
          0,
          0,
          this.canvas.width,
          this.canvas.height,
        );

        resolve();
      } catch (e) {
        reject(e);
      }
    });

  }

  getCurrentTile() {
    return this.getTile(this.currentTile[0], this.currentTile[1]);
  }

  getTile(x, y) {
    let tile;
    try {
      tile = this.tileMap[x][y];
    } catch(e) {
      tile = this.getCurrentTile();
    }

    tile = tile ? tile : this.getCurrentTile();
    return tile;
  }

  getFacingTile(direction) {
    let newTile;
    let x = this.currentTile[0];
    let y = this.currentTile[1];

    switch (direction) {
      case 0:
        newTile = this.getTile(x, y + 1);
        break;
      case 1:
        newTile = this.getTile(x, y - 1);
        break;
      case 2:
        newTile = this.getTile(x - 1, y);
        break;
      case 3:
        newTile = this.getTile(x + 1, y);
        break;
      default:
        newTile = this.getTile(x, y);
    }

    return newTile;
  }

  addTile(tileInput) {
    // Triages different methods for adding tiles.
    if (tileInput instanceof Tile) {
      if (tileInput.x && tileInput.y)
        this.addTileToCoord(tileInput, tileInput.x, tileInput.y);
      else
        this.addTileToNextSlot(tileInput);
    } else if (tileInput instanceof Array)
      this.addTilesFromMap(tileInput);
    else
      this.addTileToNextSlot(tileInput);
  }

  addTileToNextSlot(tile) {
    // Inserts a tile into the next open slot in the array.
    tile.x = this.currSlot.x;
    tile.y = this.currSlot.y;
    this.tileMap[this.currSlot.x][this.currSlot.y] = tile;

    if (this.currSlot.x >= this.xTiles - 1) {
      this.currSlot.x = 0;

      if (this.currSlot.y >= this.yTiles - 1) {
        throw new Error('Tilemap is full - cannot add another tile');
      } else {
        this.currSlot.y++;
      }
    } else {
      this.currSlot.x++
    }
  }

  addTileToCoord(tile, xCoord, yCoord) {
    try {
      this.tileMap[xCoord][yCoord] = tile;
      tile.x = xCoord;
      tile.y = yCoord;
    } catch (e) {
      throw new Error(`Can't add tile: coordinates at (${x}, ${y}) outside ` +
          `tileMap`);
    }
  }

  addTilesFromMap(mapInput) {
    // Inserts tiles based on an object map.
    mapInput.forEach((item, index) => {
      switch (item.type) {
        case 'tile':
          let tile = new Tile(item.options);
          if (item.x && item.y)
            this.addTileToCoord(tile, item.x, item.y);
          else
            this.addTileToNextSlot(tile);
          break;
        case 'range':
          // Add the tile type to each tile in the x, y range provided, inclusive.
          for (let i = item.start[0]; i < item.end[0]; i++) {
            for (let j = item.start[1]; j < item.end[1]; j++) {
              let tile = new Tile(item.options);
              this.addTileToCoord(tile, i, j);
            }
          }
          break;
        default:
          throw new Error(`No type specified for tileMap item ${item} at ` +
              `index ${index}`);
      }
    });
  }

  slideToTile(tile) {
    let oldCoords = this.getCurrentCoords();
    this.currentTile = [tile.x, tile.y];

    let coords = this.getCurrentCoords();

    let xDiff = coords.x - oldCoords.x;
    let yDiff = coords.y - oldCoords.y;

    return new Promise((resolve, reject) => {

      let animationInt = setInterval(() => {

        if (xDiff && xDiff > 0) {
          xDiff -= 2;
        } else if (xDiff && xDiff < 0) {
          xDiff += 2;
        }

        if (yDiff && yDiff > 0) {
          yDiff -= 2;
        } else if (yDiff && yDiff < 0) {
          yDiff += 2;
        }

        let newCoords = { x: coords.x - xDiff, y: coords.y - yDiff };
        newCoords = this.adjustCoords(newCoords);

        this.context.fillStyle = '#333';
        this.context.fillRect(0, 0, this.canvas.width,
            this.canvas.height);

        this.context.drawImage(
          this.image,
          newCoords.x,
          newCoords.y,
          this.canvas.width / this.scaling,
          this.canvas.height / this.scaling,
          0,
          0,
          this.canvas.width,
          this.canvas.height,
        );

        if (!xDiff && !yDiff) {
          clearInterval(animationInt);
          resolve();
        }
      }, 20);

    });
  }

};

export default Background;

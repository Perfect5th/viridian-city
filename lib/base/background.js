
class Background {
  /*
  Base class for describing the world surrounding the character.
  */

  constructor(options) {
    this.context = options.context;
    this.image = options.image;
    this.scaling = options.scaling;
    this.width = options.width;
    this.height = options.height;
    this.spriteWidth = options.spriteWidth;

    this.xTiles = parseInt(this.width / this.spriteWidth, 10);
    this.yTiles = parseInt(this.height / this.spriteWidth, 10);

    this.tileMap = new Array(this.xTiles);
    this.tileMap = this.tileMap.fill(new Array(this.yTiles));
    this.tileMap.forEach(a => {
      a = a.fill(null)
    });
    this.tileMap = this.tileMap.map(arr => arr.slice());

    this.currentTile = options.currentTile || [0, 0];

    this.currSlot = {
      x: 0,
      y: 0,
    };
  }

  getCurrentCoords() {
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
        this.context.clearRect(this.xLoc, this.yLoc, this.width * this.scaling,
          this.height * this.scaling);

        this.context.drawImage(
          this.image,
          adjustedCoords.x,
          adjustedCoords.y,
          this.width,
          this.height,
          0,
          0,
          this.width * this.scaling,
          this.height * this.scaling,
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

  addTile(tile) {
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

        this.context.clearRect(this.xLoc, this.yLoc, this.width * this.scaling,
          this.height * this.scaling);

        this.context.drawImage(
          this.image,
          newCoords.x,
          newCoords.y,
          this.width,
          this.height,
          0,
          0,
          this.width * this.scaling,
          this.height * this.scaling,
        );

        if (!xDiff && !yDiff) {
          clearInterval(animationInt);
          resolve();
        }
      }, 25);

    });
  }

};

export default Background;

import { imgFromURI } from './image-utils.js';
import Tile from './tiles.js';

// Constants:
// ====================================

const DEFAULT_TILE_SIZE = 16;

// Data Definitions:
// ====================================

/*
 * TileSet is [[Tile, ...], ...]
 * interp. A 2D-array of level tiles.
 */

const EMPTY_LEVEL = Array(10).fill(Array(10).fill(new Tile()))
  .map(arr => arr.slice());

// Class Definitions:
// ====================================

class Level {

  constructor(uri, w, h, tileSize, tileSet) {
    /*
    * Level is new Level(URI, Natural, Natural, Number, TileSet)
    * interp. a game level with a background image URI with width and height
    *   (pixels), a square tile size (pixels), and a set of possibly
    *   interactible tiles.
    */
    this.bg       = imgFromURI(uri, w, h);
    this.tileSize = tileSize || DEFAULT_TILE_SIZE;
    this.tileSet  = tileSet || EMPTY_LEVEL;
  }

  hasLoaded() {
    return this.bg.loaded;
  }

  getTile(pos) {
    /*
     * Position -> Tile
     * Produce the Tile at position by getting it from the tileSet.
     */

    return this.tileSet[pos[0]][pos[1]];
  }

  getLeftEdge(centerPos, context) {
    /*
     * Position -> Natural
     * Produces leftmost visible edge of background given center position.
     */
    const centerW = centerPos[0] * this.tileSize;
    const canvasXTiles = context.canvas.width / this.tileSize;

    return (centerW - canvasXTiles / 2 * this.tileSize) + this.tileSize / 2;
  }

  getTopEdge(centerPos, context) {
    /*
     * Position -> Natural
     * Produces topmost visible edge of background given center position.
     */
    const centerH = centerPos[1] * this.tileSize;
    const canvasYTiles = context.canvas.height / this.tileSize;

    return (centerH - canvasYTiles / 2 * this.tileSize) + this.tileSize / 2;
  }

  getRightEdge(centerPos, context) {
    /*
     * Position -> Natural
     * Produces topmost visible edge of background given center position.
     */
    const centerW = centerPos[0] * this.tileSize;
    const canvasXTiles = context.canvas.width / this.tileSize;

    return (centerW + canvasXTiles / 2 * this.tileSize) + this.tileSize / 2;
  }

  getBottomEdge(centerPos, context) {
    /*
     * Position -> Natural
     * Produces topmost visible edge of background given center position.
     */
    const centerH = centerPos[1] * this.tileSize;
    const canvasYTiles = context.canvas.height / this.tileSize;

    return (centerH + canvasYTiles / 2 * this.tileSize) + this.tileSize / 2;
  }

  render(context, centerPosition) {
    /*
     * CanvasRenderingContext2D -> Promise
     * Render level centered on centerPosition with given context
     */

    return new Promise((resolve, reject) => {
      try {
        const rightEdge = this.getRightEdge(centerPosition, context);
        const bottomEdge = this.getBottomEdge(centerPosition, context);

        let canvasLeft = 0
        let canvasTop = 0

        let leftEdge = this.getLeftEdge(centerPosition, context);
        let topEdge = this.getTopEdge(centerPosition, context);

        if (leftEdge < 0) {
          canvasLeft = -leftEdge;
          leftEdge = 0;
        }

        if (topEdge < 0) {
          canvasTop = -topEdge;
          topEdge = 0;
        }

        context.drawImage(
          this.bg,
          leftEdge,
          topEdge,
          rightEdge,
          bottomEdge,
          canvasLeft,
          canvasTop,
          context.canvas.width,
          context.canvas.height,
        );

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default Level;

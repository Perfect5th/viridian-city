import Character from './lib/character.js';
import Background from './lib/base/background.js';
import Tile from './lib/base/tile.js';

let mainImage = new Image();
mainImage.src = "sprites/main.png";

document.addEventListener("DOMContentLoaded", () => {

  let canvas = document.getElementById('gameScreen');
  let backgroundCanvas = document.getElementById('background');
  let scaling = 3;
  canvas.width = backgroundCanvas.width = 160 * scaling;
  canvas.height = backgroundCanvas.height = 144 * scaling;

  let context = canvas.getContext('2d');
  let bgContext = backgroundCanvas.getContext('2d');
  bgContext.fillStyle = 'rgb(0, 0, 0)';
  bgContext.fillRect(0, 0, canvas.width, canvas.height);

  let bgImage = new Image();
  bgImage.src = 'backgrounds/vc.png';
  let background = new Background({
    context: bgContext,
    width: bgImage.width,
    height: bgImage.height,
    currentTile: [0, 0],
    image: bgImage,
    scaling: scaling,
    spriteWidth: 16,
  });

  for (let i = 0; i < 40 * 36 - 1; i++) {
    let tile = new Tile({ walkable: true });
    background.addTile(tile);
  }

  let mainSprite = new Character({
    context: context,
    width: 96,
    height: 32,
    xLoc: 72 * scaling,
    yLoc: 64 * scaling,
    image: mainImage,
    scaling: scaling,
    currentTile: [0, 0],
  });

  mainImage.addEventListener("load", () => {
    background.render()
    .then(mainSprite.render())
    .then(() => {
      document.addEventListener("keydown", e => mainSprite.walk(e, background));
      //document.addEventListener("keyup", e => mainSprite.endMove(e));
    });
  });

});

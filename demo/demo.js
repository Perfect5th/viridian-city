import Tile from '../lib/base/tile.js';
import VCGame from '../lib/main.js';

/* What I want this to look like */

let mainSprite = new Image();
let bgImage = new Image();
mainSprite.src = './sprites/main.png';
bgImage.src = './backgrounds/vc.png';

document.addEventListener('DOMContentLoaded', () => {

  let mainCanvas = document.getElementById('mainCanvas');
  let bgCanvas = document.getElementById('bgCanvas');

  let demoGame = new VCGame({
    scaling: 3,
    tileSize: 16,
    startTile: [18, 20],
  });

  demoGame.addMainCharacter({
    canvas: mainCanvas,
    image: mainSprite,
  });
  demoGame.addBackground({
    canvas: bgCanvas,
    image: bgImage,
    width: 640,
    height: 576,
  });

  for (let i = 0; i < 40 * 36 - 1; i++) {
    let tile = new Tile({ walkable: true });
    demoGame.addTile(tile);
  }

  demoGame.start();

});

import { DialogueTile } from '../lib/base/tile.js';
import VCGame from '../lib/main.js';

/* What I want this to look like */

let mainSprite = new Image();
let bgImage = new Image();
mainSprite.src = './sprites/main.png';
bgImage.src = './backgrounds/vc-inset.png';

document.addEventListener('DOMContentLoaded', () => {

  let mainCanvas = document.getElementById('mainCanvas');
  let bgCanvas = document.getElementById('bgCanvas');

  let demoGame = new VCGame({
    scaling: 3,
    tileSize: 16,
    startTile: [5, 4],
  });

  demoGame.addMainCharacter({
    canvas: mainCanvas,
    image: mainSprite,
  });
  demoGame.addBackground({
    canvas: bgCanvas,
    image: bgImage,
    width: 192,
    height: 128,
  });

  let tileMap = [
    {
      type: 'range',
      start: [0, 0],
      end: [12, 8],
      options: {
        walkable: true,
        interactible: false,
      },
    },
    {
      type: 'range',
      start: [0, 0],
      end: [3, 3],
      options: {
        walkable: false,
        interactible: false,
      },
    },
    {
      type: 'range',
      start: [3, 0],
      end: [4, 2],
      options: {
        walkable: false,
        interactible: false,
      }
    },
    {
      type: 'range',
      start: [7, 0],
      end: [11, 2],
      options: {
        walkable: false,
        interactible: false,
      }
    },
    {
      type: 'range',
      start: [7, 3],
      end: [11, 4],
      options: {
        walkable: false,
        interactible: false,
      }
    }
  ];

  demoGame.addTile(tileMap);

  demoGame.addDialogueTile({
    x: 4,
    y: 3,
    walkable: false,
    interactible: true,
    canvas: bgCanvas,
    dialogue: 'Welcome to the demo!',
    background: './dialogues/background.png',
    width: 160,
    height: 48,
    xLoc: 0,
    yLoc: (144 - 48) * 3,
  });

  demoGame.start();

});

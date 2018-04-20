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

  /*for (let i = 0; i < 40 * 36 - 1; i++) {
    let tile = new Tile({
      walkable: true,
      interactible: true,
    });
    demoGame.addTile(tile);
  }*/

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

  let dialogueBg = new Image();
  dialogueBg.src = './dialogues/background.png';
  let dialogueTile = new DialogueTile({
    walkable: false,
    interactible: true,
    dialogueOptions: {
      dialogue: 'Welcome to the demo!',
      dialogueBackground: dialogueBg,
      letterMap: dialogueBg,
      context: bgCanvas.getContext('2d'),
      width: 160,
      height: 48,
      xLoc: 0,
      yLoc: (144 - 48) * 3,
    },
  });

  dialogueTile.x = 4;
  dialogueTile.y = 3;

  demoGame.addTile(dialogueTile)

  demoGame.start();

});

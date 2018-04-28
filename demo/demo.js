import VCGame from '../lib/main.js';

/* What I want this to look like */

document.addEventListener('DOMContentLoaded', () => {

  let demoGame = new VCGame('gameBoy', {
    scaling: 3,
    tileSize: 16,
  });

  demoGame.addCharacter(true, {
    sprite: './sprites/main.png',
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

  demoGame.addLevel({
    background: './backgrounds/vc-inset.png',
  }, tileMap);

  demoGame.addDialogueStyle('default', {
    background: './dialogues/background.png',
    start: [0, 96],
    end: [160, 144],
  });

  demoGame.addDialogueTile({
    dialogue: "Welcome to the demo!",
    loc: [4, 3],
    style: 'default',
  });

  demoGame.start();

});

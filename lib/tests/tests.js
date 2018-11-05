import SpriteMap from '../sprites.js';
import { PlayerCharacter, NPCharacter } from '../characters.js';
import Level from '../levels.js';
import Tile from '../tiles.js';
import VCGame from '../main.js';


document.addEventListener('DOMContentLoaded', () => {

  const screen = document.getElementById('vc-screen');

  const spriteImages = [
    './images/sprites/down.png',
    './images/sprites/up.png',
    './images/sprites/left.png',
    './images/sprites/right.png',
    './images/sprites/walk-down1.png',
    './images/sprites/walk-down2.png',
    './images/sprites/walk-up1.png',
    './images/sprites/walk-up2.png',
    './images/sprites/walk-left.png',
    './images/sprites/walk-right.png',
  ];
  const pcSm = new SpriteMap(16, spriteImages);
  const pcPos = [5, 3];
  const npcSm = new SpriteMap(16, spriteImages);
  const npcPos = [6, 3];

  const pc = new PlayerCharacter(pcSm, pcPos);
  const npcs = [
    new NPCharacter(npcSm, npcPos),
  ];

  const tileSet = [
    [
      new Tile(false),
      new Tile(false),
      new Tile(false),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(false),
      new Tile(false),
      new Tile(false),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(false),
      new Tile(false),
      new Tile(false),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(false),
      new Tile(false),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(false),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(false),
      new Tile(false),
      new Tile(),
      new Tile(false),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(false),
      new Tile(),
      new Tile(),
      new Tile(false),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(false),
      new Tile(false),
      new Tile(),
      new Tile(false),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(false),
      new Tile(false),
      new Tile(),
      new Tile(false),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
    [
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
      new Tile(),
    ],
  ];

  const level = new Level('./images/background.png', 192, 128, 16, tileSet);

  const game = new VCGame(screen, pc, npcs, level);

  game.start();
});

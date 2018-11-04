import SpriteMap from '../sprites.js';
import { PlayerCharacter, NPCharacter } from '../characters.js';
import Level from '../levels.js';
import VCGame from '../main.js';


document.addEventListener('DOMContentLoaded', () => {


  let screen = document.getElementById('vc-screen');

  let spriteImages = [
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
  let pcSm = new SpriteMap(spriteImages.slice().map(uri => {
    let img = new Image(16, 16);
    img.src = uri;
    return img;
  }));
  let pcPos = [0, 0];
  let npcSm = new SpriteMap(spriteImages.slice().map(uri => {
    let img = new Image(16, 16);
    img.src = uri;
    return img;
  }));
  let npcPos = [1, 1];

  let pc = new PlayerCharacter(pcSm, pcPos);
  let npcs = [
    new NPCharacter(npcSm, npcPos),
  ];

  let levelBG = new Image(640, 576);
  levelBG.src = ('./images/background.png');
  let level = new Level(levelBG);

  let game = new VCGame(screen, pc, npcs, level);

  game.start();
});

import Character from './lib/character.js';

let mainImage = new Image();
mainImage.src = "sprites/main.png";

document.addEventListener("DOMContentLoaded", () => {

  let canvas = document.getElementById('gameScreen');
  let scaling = 3;
  canvas.width = 160 * scaling;
  canvas.height = 144 * scaling;

  let context = canvas.getContext('2d');
  context.fillStyle = 'rgb(121, 170, 76)';
  context.fillRect(0, 0, canvas.width, canvas.height)

  let mainSprite = new Character({
    context: canvas.getContext('2d'),
    width: 96,
    height: 32,
    xLoc: 72 * scaling,
    yLoc: 64 * scaling,
    image: mainImage,
    scaling: scaling,
  });

  mainSprite.render()
  .then(() => {
    document.addEventListener("keydown", e => mainSprite.walk(e));
    //document.addEventListener("keyup", e => mainSprite.endMove(e));
  });

});

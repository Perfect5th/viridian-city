import bigBang from './universe';
import {movePlayChar} from './movements';

import bgImage from '../assets/background.png';
import pcImage from '../assets/playchar.png';

/*
 * onTick: called on each game event loop. Produces new state based on what
 *         should change.
 * State -> State
 */
const onTick = state => state;

/*
 * onKey: handlers for key presses. Produces new state based on key pressed.
 * State, KeyboardEvent -> State
 */
const onKey = (state, ke) => {
  const {key} = ke;

  switch (key) {
    case 'ArrowUp':
      return movePlayChar.up(state);
    case 'ArrowRight':
      return movePlayChar.right(state);
    case 'ArrowDown':
      return movePlayChar.down(state);
    case 'ArrowLeft':
      return movePlayChar.left(state);
    default:
      return state;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const level = {
    bgImage
  };
  const playChar = {
    location: {
      x: 0,
      y: 0
    },
    image: pcImage
  };

  bigBang({
    level,
    playChar
  }, {}, onTick, onKey);
});

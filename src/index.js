import bigBang from './universe';
import bgImage from '../assets/background.png';
import pcImage from '../assets/playchar.png';

const onTick = state => state;

const onKey = (state, ke) => {
  const {key} = ke;

  switch (key) {
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
      y: 10
    },
    image: pcImage
  };

  bigBang({
    level,
    playChar
  }, {}, onTick, onKey);
});

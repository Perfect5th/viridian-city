import bigBang from './universe';
import bgImage from '../assets/background.png';

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

  bigBang({
    level
  }, onKey, onTick);
});

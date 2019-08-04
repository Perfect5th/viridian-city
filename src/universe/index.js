const TICK_RATE = 36  // ms, roughly 28 ticks/second
let stateLocked = false;

/*
 * WorldState -> WorldState
 * pure function that returns a new WorldState based on the current WorldState.
 */
const onTick = state => {
  return state;
};

/*
 * WorldState, KeyboardEvent -> WorldState
 * pure function that returns a new WorldState based on the key pressed.
 */
const onKey = (state, ke) => {
  const {key, altKey, ctrlKey, shiftKey} = ke;

  switch (key) {
    default:
      return state;
  }
};

export default function bigBang(state) {
  state.shouldDraw = false;

  setInterval(() => {
    state = onTick(state);

    if (state.shouldDraw) {
      draw(state);
    }
  }, TICK_RATE);

  document.addEventListener('keydown', ke => {
    state = onKey(state, ke);
  });
}

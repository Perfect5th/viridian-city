import draw from './draw';

const TICK_RATE = 36  // ms, roughly 28 ticks/second
const CANVAS_DEFAULTS = {
  SCREEN_ID: 'vc-screen',
  ELEMENT: 'canvas',
  STYLE: 'position: absolute; top: 0; left: 0; z-index: 1',
  WIDTH: 160,
  HEIGHT: 144,
  SCALING: 1,
  TILE_SIZE: 16
};
const PLAY_CHAR_DEFAULTS = {
  location: {x: 0, y: 0}
};

/*
 * setup: render the DOM required to represent the game and internalize that in
 * state.
 * State, Settings -> State
 */
const setup = (state, settings = {}) => {
  const _screen = document.getElementById(settings.screenId ||
    CANVAS_DEFAULTS.SCREEN_ID);
  const _bgCanvas = document.createElement(settings.element ||
    CANVAS_DEFAULTS.ELEMENT);

  _bgCanvas.style.cssText = settings.screenStyle || CANVAS_DEFAULTS.STYLE;
  _bgCanvas.width = (settings.width || CANVAS_DEFAULTS.WIDTH) *
    (settings.scaling || CANVAS_DEFAULTS.SCALING);
  _bgCanvas.height = (settings.height || CANVAS_DEFAULTS.HEIGHT) *
    (settings.scaling || CANVAS_DEFAULTS.SCALING);

  const _charCanvas = _bgCanvas.cloneNode();
  _charCanvas.style.zIndex = parseInt(_bgCanvas.style.zIndex, 10) + 1;

  _screen.style.position = 'relative';
  _screen.appendChild(_bgCanvas);
  _screen.appendChild(_charCanvas);

  const tileSize = settings.tileSize || CANVAS_DEFAULTS.TILE_SIZE;
  const playChar = state.playChar || PLAY_CHAR_DEFAULTS;

  return {
    ...state,
    _screen,
    _bgCanvas,
    _charCanvas,
    tileSize,
    playChar,
    shouldDraw: true
  };
};

/*
 * bigBang: sets up the event loop and renders/calls callbacks as appropriate.
 * State -> undefined (ugh)
 *    state:    initial state object.
 *    settings: settings object.
 *    onTick:   State -> State
 *              pure function, called on each loop. Should return new state
 *              based on previous state. Set `State.shouldDraw = true` if a
 *              render is needed.
 *    onKey:    State, KeyboardEvent -> State
 *              pure function, called on keydown event. Should return new state
 *              based on previous state and event. Set
 *              `State.shouldDraw = true` if a render is needed.
 */
export default function bigBang(
  state = {}, settings, onTick = s => s, onKey = s => s
) {
  state = setup(state, settings);

  setInterval(() => {
    state = onTick(state);

    if (state.shouldDraw) {
      state = draw(state);
    }
  }, TICK_RATE);

  document.addEventListener('keydown', ke => {
    state = onKey(state, ke);
  });
}

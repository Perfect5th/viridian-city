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
const CANVAS_CTX = '2d';

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

const loadBgImageIfNeeded = state => {
  if (state.level._bgImage instanceof Image) {
    return state;
  }

  const _bgImage = new Image();
  _bgImage.src = state.level.bgImage;

  return {
    ...state,
    level: {
      ...state.level,
      _bgImage
    }
  }
};

/*
 * convertToPixels: calculate level coordinates position on the bgImage in
 *                  pixels
 * Natural -> Natural
 */
const convertToPixels = (state, coord) => coord * state.tileSize;

/*
 * getBgCoord: Determine number of pixels in coord direction playChar is.
 * State, String -> Natural
 */
const getBgCoord = (state, coord) => {
  const {location} = state.playChar;
  const dim = coord === 'x' ? 'width' : 'height';

  return Math.max(
    convertToPixels(state, location[coord]) - (state._bgCanvas[dim] / 2),
    0
  );
}

/*
 * getBgSx: Determine how many pixels from the left of the bgImage to render.
 * State -> Natural
 */
const getBgSx = state => getBgCoord(state, 'x');

/*
 * getBgSy: Determine how many pixels from the top of the bgImage to render.
 * State -> Natural
 */
const getBgSy = state => getBgCoord(state, 'y');

const drawImage = (state, imageLoader, entity, image, canvas, drawArgs) => {
  const newState = imageLoader(state);

  const drawCallback = newState[entity][image].addEventListener('load', () => {
    const _canvas = newState[canvas];
    const ctx = _canvas.getContext(CANVAS_CTX);
    const _image = newState[entity][image];

    ctx.drawImage(_image, ...drawArgs);

    _image.removeEventListener('load', drawCallback);
  });

  return newState;
};

/*
 * drawBackground: load background image (if needed), then draw it on canvas.
 * State -> State
 *    side-effects: draws image to canvas.
 */
const drawBackground = state => drawImage(
  state,
  loadBgImageIfNeeded,
  'level',
  '_bgImage',
  '_bgCanvas',
  [
    getBgSx(state),
    getBgSy(state),
    state._bgCanvas.width,
    state._bgCanvas.height,
    0,
    0,
    state._bgCanvas.width,
    state._bgCanvas.height
  ]
);

/*
 * loadPcImageIfNeeded: loads the player character image if it hasn't been
 *                      done.
 * State -> State
 */
const loadPcImageIfNeeded = state => {
  if (state.playChar._image instanceof Image) {
    return state;
  }

  const _image = new Image();
  _image.src = state.playChar.image;

  return {
    ...state,
    playChar: {
      ...state.playChar,
      _image
    }
  };
};

/*
 * getPcSx: get player character source image x
 * State -> Natural
 */
const getPcSx = state => 0;

/*
 * getPcSy: get player character source image y
 * State -> Natural
 */
const getPcSy = state => 0;

/*
 * getPcD: get player character position on canvas in given dimension.
 * State, String -> Number
 */
const getPcD = (state, dim) => ((state._charCanvas[dim] - state.tileSize) / 2);

/*
 * getPcDx: get player character position on canvas in x dimension.
 * State -> Number
 */
const getPcDx = state => getPcD(state, 'width');

/*
 * getPcDx: get player character position on canvas in y dimension.
 * State -> Number
 */
const getPcDy = state => getPcD(state, 'height');

/*
 * drawPlayerCharacter: load player character image (if needed), then draw on
 *                      canvas.
 * State -> State
 *    side-effects: draws image to canvas
 */
const drawPlayerCharacter = state => drawImage(
  state,
  loadPcImageIfNeeded,
  'playChar',
  '_image',
  '_charCanvas',
  [
    getPcSx(state),
    getPcSy(state),
    state.tileSize,
    state.tileSize,
    getPcDx(state),
    getPcDy(state),
    state.tileSize,
    state.tileSize
  ]
);

const drawNPCs = npcs => npcs;

/*
 * drawCharacters: load character images (if needed), then draw on canvas.
 * State -> State
 *    side-effects: draws images to canvas
 */
const drawCharacters = state => drawNPCs(drawPlayerCharacter(state));

/*
 * draw: load images (if needed), then draw on canvas.
 * State -> State
 *    side-effects: draws images to canvas
 */
const draw = state => drawCharacters(drawBackground({
  ...state,
  shouldDraw: false
}));

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

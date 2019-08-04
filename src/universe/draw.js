const CANVAS_CTX = '2d';
const VOID_COLOR = 'black';

/*
 * loadBgImageIfNeeded: loads the given bgImage into _bgImage if it isn't
 *                      already there.
 * State -> State
 *    side-effects: loads an image asset
 */
const loadBgImageIfNeeded = state => {
  if (
    state.level._bgImage instanceof Image &&
    state.level._bgImage.src === state.level.bgImage
   ) {
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
 * convertToTiles: calculate number of tiles represented by an amount of
 *                 pixels.
 * Natural -> Number
 */
const convertToTiles = (state, pixels) => pixels / state.tileSize;

/*
 * drawImage: given state, load image with imageLoader, then draw image from
 *            entity on canvas using drawArgs
 * State, State -> State, String, String, String, [Args] -> State
 */
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
 * getBgCoord: Determine number of pixels in coord direction playChar is.
 * State, String -> Natural
 */
const getBgSPixel = (state, coord) => {
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
const getBgSx = state => getBgSPixel(state, 'x');

/*
 * getBgSy: Determine how many pixels from the top of the bgImage to render.
 * State -> Natural
 */
const getBgSy = state => getBgDPixel(state, 'y');

/*
 * getBgDPixel: Determine how many pixels from the edge of _bgCanvas to render
 *              bgImage along the given coordinate.
 * State, String -> Number
 */
const getBgDPixel = (state, coord) => {
  const {location} = state.playChar;
  const dim = coord === 'x' ? 'width' : 'height';

  return Math.max(
    convertToPixels(
      state,
      convertToTiles(state, state._bgCanvas[dim]) / 2 - location[coord] - 0.5
    ),
    0
  );
}

/*
 * getBgDx: Determine where to place left side of bgImage from state.
 * State -> Number
 */
const getBgDx = state => getBgDPixel(state, 'x');

/*
 * getBgDy: Determine where to place top of bgImage from state.
 * State -> Number
 */
const getBgDy = state => getBgDPixel(state, 'y');

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
    getBgDx(state),
    getBgDy(state),
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
 * drawVoid: draw the 'void' of blackness that obscures previous renders and
 *           clear the _charCanvas.
 * State -> State
 *    side-effects: draws/clears canvases
 */
const drawVoid = state => {
  const bgCtx = state._bgCanvas.getContext(CANVAS_CTX);
  const charCtx = state._charCanvas.getContext(CANVAS_CTX);

  bgCtx.fillStyle = VOID_COLOR;

  bgCtx.fillRect(0, 0, state._bgCanvas.width, state._bgCanvas.height);
  charCtx.clearRect(0, 0, state._charCanvas.width, state._charCanvas.height);

  return state;
};

/*
 * draw: load images (if needed), then draw on canvas.
 * State -> State
 *    side-effects: draws images to canvas
 */
export default function draw(state) {
  return drawCharacters(drawBackground(drawVoid({
    ...state,
    shouldDraw: false
  })));
}

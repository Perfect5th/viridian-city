/*
 * Enum Coordinate: one of x or y cartesian coordinates
 */
const Coordinate = {
  X: 'x',
  Y: 'y'
};

/*
 * movePlayChar: move the player character in the given direction along coord.
 * State, Coordinate, [-1 | 1] -> State
 */
const movePlayCharDir = (state, coord, dir) => {
  return {
    ...state,
    playChar: {
      ...state.playChar,
      location: {
        ...state.playChar.location,
        [coord]: state.playChar.location[coord] + dir
      }
    }
  };
}

/*
 * movePlayChar...: move the player character in the given direction.
 * State -> State
 */
const movePlayCharUp = state => movePlayCharDir(state, Coordinate.Y, -1);
const movePlayCharRight = state => movePlayCharDir(state, Coordinate.X, 1);
const movePlayCharDown = state => movePlayCharDir(state, Coordinate.Y, 1);
const movePlayCharLeft = state => movePlayCharDir(state, Coordinate.X, -1);

const shouldDraw = fn => state => {
  return {
    ...fn(state),
    shouldDraw: true
  };
};

export const movePlayChar = {
  up: shouldDraw(movePlayCharUp),
  right: shouldDraw(movePlayCharRight),
  down: shouldDraw(movePlayCharDown),
  left: shouldDraw(movePlayCharLeft)
};

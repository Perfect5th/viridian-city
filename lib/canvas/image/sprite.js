
class Sprite extends Image {
  /*
   * Wrapper for Image that allows easy identification and rendering of Sprites.
   */

  constructor() {
    super();

    this.front = [0, 0];
    this.back = [16, 0];
    this.left = [32, 0];
    this.right = [48, 0];
    this.walkDown1 = [64, 0];
    this.walkDown2 = [64, 16];
    this.walkUp1 = [80, 0];
    this.walkUp2 = [80, 16];
    this.walkLeft = [96, 0];
    this.walkRight = [112, 0];

    this.walkDown = 0;
    this.walkUp = 0;
  }

  baseOptions(orientation) {
    return [ this, orientation[0], orientation[1], 16, 16 ];
  }

  get frontView() {
    // Returns rendering options for front view.
    return this.baseOptions(this.front);
  }

  get backView() {
    // Returns rendering options for back view.
    return this.baseOptions(this.back);
  }

  get leftView() {
    // Returns rendering options for left view.
    return this.baseOptions(this.left);
  }

  get rightView() {
    // Returns rendering options for right view.
    return this.baseOptions(this.right);
  }

  get walkDownView() {
    // Returns rendering options for walking down view.
    this.walkDown = this.walkDown ? 0 : 1;

    if (this.walkDown)
      return this.baseOptions(this.walkDown1);
    else
      return this.baseOptions(this.walkDown2);
  }

  get walkUpView() {
    // Returns rendering options for walking up view.
    this.walkUp = this.walkUp ? 0 : 1;

    if (this.walkUp)
      return this.baseOptions(this.walkUp1);
    else
      return this.baseOptions(this.walkUp2);
  }

  get walkLeftView() {
    // Returns rendering options for walking left view.
    return this.baseOptions(this.walkLeft);
  }

  get walkRightView() {
    // Returns rendering options for walking right view.
    return this.baseOptions(this.walkRight);
  }

}


export default Sprite;

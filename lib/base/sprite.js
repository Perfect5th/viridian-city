
class Sprite {

  constructor(options) {
    this.scaling = options.scaling || 1;

    this.context = options.context;
    this.width = options.width;
    this.height = options.height * this.scaling;
    this.image = options.image;
    this.xLoc = options.xLoc;
    this.yLoc = options.yLoc;

    this.frameIndex = options.frameIndex || 0;
    this.numberOfFrames = options.numberOfFrames || 1;
  }

  render() {
    // Clear the canvas.
    this.context.clearRect(0, 0, this.width, this.height);

    // Draw the animation.
    this.context.drawImage(
      this.image,
      this.frameIndex * this.width / this.numberOfFrames,
      0,
      this.width / this.numberOfFrames,
      this.height,
      0,
      0,
      this.width / this.numberOfFrames,
      this.height,
    );
  }
}

export default Sprite;

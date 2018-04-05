
class Sprite {

  constructor(options) {
    this.scaling = options.scaling || 1;

    this.context = options.context;
    this.width = options.width;
    this.height = options.height;
    this.image = options.image;
    this.xLoc = options.xLoc;
    this.yLoc = options.yLoc;
  }

  render() {

    return new Promise((resolve, reject) => {
      try {
        this.context.clearRect(this.xLoc, this.yLoc, this.width * this.scaling,
          this.height * this.scaling);

        this.context.drawImage(
          this.image,
          0,
          0,
          this.width,
          this.height,
          this.xLoc,
          this.yLoc,
          this.width * this.scaling,
          this.height * this.scaling,
        );

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

}

export default Sprite;

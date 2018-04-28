
class Renderable {
  /*
   * Base class for definine renderable objects.
   */

  ready() {
    // Promise that resolves when the renderable's image has finished loading.
    if (typeof this.image === 'undefined')
      throw Error("Classes derived from Renderable must have an the " +
          "attribute `image`, an Image object");

    return new Promise((resolve, reject) => {
      this.image.addEventListener('load', resolve);
    });
  }

  render() {
    // Draws the renderable's image to the canvas.
  }

}

export default Renderable;

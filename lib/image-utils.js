
// Function Definitions:
// ====================================

function imgFromURI(uri, w, h) {
  /*
   * URI Natural -> Image
   * produces an Image instance of given width and height by loading from URI
   * and attaches a Promise that resolves when the Image loads.
   */

  let img = new Image(w, h);

  img.loaded = new Promise((resolve, reject) => {
    img.addEventListener('load', () => resolve());
    img.addEventListener('error', error => reject(error));
  });
  img.src = uri;

  return img;
}

export { imgFromURI };

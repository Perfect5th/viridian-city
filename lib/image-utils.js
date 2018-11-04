
// Function Definitions:
// ====================================

function imageLoadedProm(img) {
  /*
   * Image -> Promise
   * Produce a promise that resolves when img loaded or rejects on img error.
   */

  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => resolve());
    img.addEventListener('error', error => reject(error));
  });
}

export { imageLoadedProm };

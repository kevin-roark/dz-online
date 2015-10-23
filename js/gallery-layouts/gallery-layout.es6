
let THREE = require('three');
let imageUtil = require('../image-util');

export class GalleryLayout {

  constructor(options) {
    // mandatory config
    this.container = options.container;
    this.media = options.media;
    this.controlObject = options.controlObject;

    // optional config
    this.yLevel = options.yLevel || 0;

    // perform initial layout
    for (var i = 0; i < this.media.length; i++) {
      var media = this.media[i];
      this.layoutMedia(i, media);
    }
  }

  update() {

  }

  layoutMedia(index, media) {
    // override this
  }

  createTexture(media) {
    var imageURL = media.thumbnail.url;
    var texture = imageUtil.loadTexture(imageURL, false);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

}

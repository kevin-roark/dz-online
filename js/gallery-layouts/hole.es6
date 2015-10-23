
let THREE = require('three');
import {GalleryLayout} from './gallery-layout.es6';

/// different hole styles
/// set imagedepth == distanceBetweenPhotos to get cool no gap style
//

export class Hole extends GalleryLayout {

  constructor(options) {
    this.xPosition = options.xPosition || 0;
    this.zPosition = options.zPosition || 0;
    this.imageWidth = options.imageWidth || 20;
    this.imageDepth = options.imageDepth || 20;

    this.distanceBetweenPhotos = options.distanceBetweenPhotos || 25;
    this.downwardVelocity = options.initialDownwardVelocity || -0.001;
    this.thresholdVelocity = options.thresholdVelocity || -0.022;
    this.slowAcceleration = options.slowAcceleration || -0.00003;
    this.fastAcceleration = options.fastAcceleration || -0.0005; // good fun value is -0.0005
    this.repeatCount = options.repeatCount || Math.round(1000 / options.media.length);
    this.fallThroughImages = options.fallThroughImages || true;

    super(options);
  }

  update() {
    super.update();

    console.log(this.downwardVelocity);

    if (this.downwardVelocity > this.thresholdVelocity) {
      this.downwardVelocity += this.slowAcceleration;
    }
    else {
      this.downwardVelocity += this.fastAcceleration;
    }

    this.controlObject.translateY(this.downwardVelocity);
  }

  layoutMedia(index, media) {
    var width = this.imageWidth;
    var height = (media.thumbnail.width / media.thumbnail.height) * width;
    var mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, this.imageDepth),
      new THREE.MeshBasicMaterial({map: this.createTexture(media), side: THREE.DoubleSide})
    );

    mesh.castShadow = true;

    if (this.fallThroughImages) {
      mesh.rotation.x = Math.PI / 2;
    }

    var distancePerChunk = this.media.length * this.distanceBetweenPhotos;

    for (var i = 0; i < this.repeatCount; i++) {
      var mediaMesh = i === 0 ? mesh : mesh.clone();

      // cool stacky intersection way: this.yLevel - (index * i * this.distanceBetweenPhotos)
      var y = this.yLevel - (i * distancePerChunk) - (index * this.distanceBetweenPhotos);
      mediaMesh.position.set(this.xPosition, y, this.zPosition);

      this.container.add(mediaMesh);
    }
  }

}

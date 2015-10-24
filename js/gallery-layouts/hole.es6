
let THREE = require('three');
import {GalleryLayout} from './gallery-layout.es6';

/// different hole styles
/// set imagedepth == distanceBetweenPhotos to get cool no gap style
//

export class Hole extends GalleryLayout {

  constructor(options) {
    super(options);

    this.xPosition = options.xPosition || 0;
    this.zPosition = options.zPosition || 0;
    this.imageWidth = options.imageWidth || 20;
    this.imageDepth = options.imageDepth || 20;
    this.fallThroughImages = options.fallThroughImages || true;
    this.yLevel = options.yLevel || -11;
    this.distanceBetweenPhotos = options.distanceBetweenPhotos || 25;
    this.downwardVelocity = options.initialDownwardVelocity || -0.001;
    this.thresholdVelocity = options.thresholdVelocity || -0.031;
    this.slowAcceleration = options.slowAcceleration || -0.00003;
    this.fastAcceleration = options.fastAcceleration || -0.0005; // good fun value is -0.0005
    this.slowMotionVelocity = options.slowMotionVelocity || -0.01;
    this.ascensionVelocity = options.ascensionVelocity || 0.048;

    this.activeMeshCount = options.activeMeshCount || 400;
    this.halfActiveMeshCount = this.activeMeshCount / 2;
    this.nextMediaMeshToPassIndex = 0;
    this.hasReachedBottom = false;
    this.nextMediaToPassPosition = this.yForMediaWithIndex(this.nextMediaMeshToPassIndex);
    this.nextMediaToAddIndex = this.activeMeshCount; // we will layout 0 -> 665 in the constructor
    this.activeMeshes = [];

    this.hasStarted = false;
    this.inSlowMotion = false;
    this.goRotateOnce = false;
    this.goCrazyRotate = false;
    this.ascending = false;

    // perform initial layout
    for (var i = 0; i < this.activeMeshCount; i++) {
      var media = this.media[i];
      this.layoutMedia(i, media);
    }

    // face me down
    this.pitchObject.rotation.x = -Math.PI / 2;
  }

  start() {
    this.hasStarted = true;
  }

  update() {
    super.update();

    if (!this.hasStarted) {
      return;
    }

    if (!this.hasReachedBottom) {
      // continue our descent
      if (!this.inSlowMotion) {
        if (this.downwardVelocity > this.thresholdVelocity) {
          this.downwardVelocity += this.slowAcceleration;
        }
        else {
          this.downwardVelocity += this.fastAcceleration;
        }

        this.controlObject.translateY(this.downwardVelocity);
      }
      else {
        this.controlObject.translateY(Math.max(this.slowMotionVelocity, this.downwardVelocity));
      }
    }
    else if (this.ascending) {
      // permanently rise
      this.controlObject.translateY(this.ascensionVelocity);
    }

    while (this.controlObject.position.y < this.nextMediaToPassPosition && !this.hasReachedBottom) {
      this.didPassMesh();
    }
  }

  didPassMesh() {
    // mesh management
    if (this.nextMediaMeshToPassIndex > this.halfActiveMeshCount) {
      // remove first item in array, the thing halfActiveMeshCount above me
      var meshToRemove = this.activeMeshes.shift();
      this.container.remove(meshToRemove);

      // add the next media to the barrel
      this.layoutMedia(this.nextMediaToAddIndex, this.media[this.nextMediaToAddIndex]);
      this.nextMediaToAddIndex += 1;
    }

    // turn the camera wildly
    if (this.goCrazyRotate) {
      this.turnControlObject(this.nextMediaMeshToPassIndex);
      this.turnPitchObject(this.nextMediaMeshToPassIndex);
    }

    this.nextMediaMeshToPassIndex += 1;
    this.nextMediaToPassPosition = this.yForMediaWithIndex(this.nextMediaMeshToPassIndex);
    //console.log('my pass index is ' + this.nextMediaMeshToPassIndex);

    if (this.nextMediaMeshToPassIndex >= this.media.length) {
      this.hasReachedBottom = true;
      setTimeout(() => {
        this.ascending = true;
      }, 3000); // wait 3 seconds at the bottom
    }
  }

  layoutMedia(index, media) {
    if (!media) {
      return;
    }

    //console.log('laying out: ' + index);

    var width = this.imageWidth;
    var height = (media.thumbnail.width / media.thumbnail.height) * width;
    var mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, this.imageDepth),
      new THREE.MeshBasicMaterial({map: this.createTexture(media), side: THREE.DoubleSide})
    );

    mesh.castShadow = true;

    if (this.fallThroughImages) {
      mesh.rotation.x = -Math.PI / 2; // flip downwards
      mesh.rotation.y = Math.PI; // rightside up images
    }

    // cool stacky intersection way: this.yLevel - (index * repeatIndex * this.distanceBetweenPhotos)
    mesh.position.set(this.xPosition, this.yForMediaWithIndex(index), this.zPosition);

    this.container.add(mesh);
    this.activeMeshes.push(mesh);
  }

  yForMediaWithIndex(index) {
    var y = this.yLevel - (index * this.distanceBetweenPhotos);
    return y;
  }

  turnControlObject(index) {
    var yrotation = Math.PI * (index / 50);
    this.controlObject.rotation.y = yrotation;
  }

  turnPitchObject(index) {
    var xrotation = Math.PI * (index / 50);
    this.pitchObject.rotation.x = xrotation;
  }

  toggleSlowMotion() {
    this.inSlowMotion = !this.inSlowMotion;
  }

  toggleRotateOnce() {
    var oldval = this.pitchObject.rotation.x;
    this.pitchObject.rotation.x = oldval - Math.PI / 2;
  }

  toggleCrazyRotate() {
    this.goCrazyRotate = !this.goCrazyRotate;
  }

}

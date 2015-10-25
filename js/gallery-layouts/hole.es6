
let THREE = require('three');
let $ = require('jquery');
import {GalleryLayout} from './gallery-layout.es6';

/// different hole styles
/// set imagedepth == distanceBetweenPhotos to get cool no gap style
//

export class Hole extends GalleryLayout {

  constructor(options) {
    super(options);

    this.domMode = options.domMode || false;
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
    this.bigCubeStyle = options.bigCubeStyle || 'none';
    this.bigCubeCount = options.bigCubeCount || 26;
    this.bigCubeLength = options.bigCubeLength || 500;

    this.activeMeshCount = options.activeMeshCount || 400;
    this.halfActiveMeshCount = this.activeMeshCount / 2;
    this.nextMediaToPassIndex = 0;
    this.hasReachedBottom = false;
    this.nextMediaToPassPosition = this.yForMediaWithIndex(this.nextMediaToPassIndex);
    this.nextMediaToAddIndex = this.activeMeshCount; // we will layout 0 -> 665 in the constructor
    this.activeMeshes = [];

    this.hasStarted = false;
    this.inSlowMotion = false;
    this.goRotateOnce = false;
    this.goCrazyRotate = false;
    this.ascending = false;

    if (!this.domMode) {
      // one fucked up way to get the stacked single-image cube is just to blast its length to length * count
      this.handleBigCubeState();

      // perform initial layout
      for (var i = 0; i < this.activeMeshCount; i++) {
        var media = this.media[i];
        this.layoutMedia(i, media);
      }

      // face me down
      this.pitchObject.rotation.x = -Math.PI / 2;
    }
    else {
      this.fullScreenImage = $('<img style="display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: white; z-index: 1000"></img>');
      $('body').append(this.fullScreenImage);
    }
  }

  start() {
    this.hasStarted = true;

    if (this.domMode) {
      setTimeout(() => {
        var media = this.media[0];
        var imageURL = media.type === 'image' ? media.media.url : media.thumbnail.url;
        this.fullScreenImage.attr('src', imageURL);
      }, 3000);
    }
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

    if (!this.domMode) {
      if (this.bigCubeStyle === 'singleStack') {
        this.topStackingBigCube.position.y = this.controlObject.position.y + (this.bigCubeLength * this.bigCubeCount / 2);
      }
    }

    while (this.controlObject.position.y < this.nextMediaToPassPosition && !this.hasReachedBottom) {
      this.didPassMesh();
    }
  }

  didPassMesh() {
    if (this.domMode) {
      var media = this.media[this.nextMediaToPassIndex + 1];
      if (media) {
        var imageURL = media.type === 'image' ? media.media.url : media.thumbnail.url;
        this.fullScreenImage.attr('src', imageURL);
      }
      this.nextMediaToPassIndex += 1;
      this.nextMediaToPassPosition = this.yForMediaWithIndex(this.nextMediaToPassIndex);
      return;
    }

    // mesh management
    if (this.nextMediaToPassIndex > this.halfActiveMeshCount) {
      // remove first item in array, the thing halfActiveMeshCount above me
      var meshToRemove = this.activeMeshes.shift();
      this.container.remove(meshToRemove);

      // add the next media to the barrel
      this.layoutMedia(this.nextMediaToAddIndex, this.media[this.nextMediaToAddIndex]);
      this.nextMediaToAddIndex += 1;
    }

    // turn the camera wildly
    if (this.goCrazyRotate) {
      this.turnControlObject(this.nextMediaToPassIndex);
      this.turnPitchObject(this.nextMediaToPassIndex);
    }

    this.nextMediaToPassIndex += 1;
    this.nextMediaToPassPosition = this.yForMediaWithIndex(this.nextMediaToPassIndex);
    //console.log('my pass index is ' + this.nextMediaToPassIndex);

    if (this.bigCubeStyle === 'singleStack') {
      // update big cube with the current passing item
      this.updateStackingBigCubeTextures(this.media[this.nextMediaToPassIndex]);
    }
    else if (this.bigCubeStyle === 'layer' && (this.nextMediaToPassIndex - 1) % 25 === 0) {
      var bottomMeshIndex = (this.nextMediaToPassIndex - 1) + (this.bigCubeCount / 2) * 25;
      if (bottomMeshIndex >= this.media.count) {
        return;
      }

      var bigMesh = this.createBigCube(this.media[bottomMeshIndex]);
      bigMesh.position.set(this.xPosition, this.controlObject.position.y + (this.bigCubeCount / 2) * -500, this.zPosition);
      this.container.add(bigMesh);
      this.bigLayeredCubes.push(bigMesh);

      if (this.bigLayeredCubes.length > this.bigCubeCount) {
        var bigCubeToRemove = this.bigLayeredCubes.unshift();
        this.container.remove(bigCubeToRemove);
      }
    }

    if (this.nextMediaToPassIndex >= this.media.length) {
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

  toggleBigCube() {
    if (this.bigCubeStyle === 'singleStack') {
      this.bigCubeStyle = 'layer';
    }
    else if (this.bigCubeStyle === 'layer') {
      this.bigCubeStyle = 'none';
    }
    else if (this.bigCubeStyle === 'none') {
      this.bigCubeStyle = 'singleStack';
    }

    this.handleBigCubeState();
  }

  handleBigCubeState() {
    if (this.bigCubeStyle === 'singleStack') {
      this.topStackingBigCube = this.createBigCube(this.media[this.nextMediaToPassIndex]);
      this.container.add(this.topStackingBigCube);

      this.childStackingBigCubes = [];
      for (var i = 1; i < this.bigCubeCount; i++) {
        var cube = (i == 1) ? this.createBigCube(this.media[this.nextMediaToPassIndex]) : this.childStackingBigCubes[0].clone();
        cube.position.y = - i * (this.bigCubeLength;
        this.topStackingBigCube.add(cube);
        this.childStackingBigCubes.push(cube);
      }
    }
    else {
      this.container.remove(this.topStackingBigCube);
      this.topStackingBigCube = null;
      this.childStackingBigCubes = null;
    }

    if (this.bigCubeStyle === 'layer') {
      this.bigLayeredCubes = [];

      for (var i = 0; i < (this.bigCubeCount / 2); i++) {
        var belowIndex = (i + this.nextMediaToPassIndex) * 20;
        if (belowIndex < this.media.length) {
          var bigMesh = this.createBigCube(this.media[belowIndex]);
          bigMesh.position.set(this.xPosition, (this.controlObject.position.y || 0) + (i * -500), this.zPosition);
          this.container.add(bigMesh);
          this.bigLayeredCubes.push(bigMesh);
        }

        if (i > 0) {
          var aboveIndex = (this.nextMediaToPassIndex - i) * 20;
          if (aboveIndex >= 0) {
            var bigMesh = this.createBigCube(this.media[aboveIndex]);
            bigMesh.position.set(this.xPosition, (this.controlObject.position.y || 0) + (i * 500), this.zPosition);
            this.container.add(bigMesh);
            this.bigLayeredCubes.push(bigMesh);
          }
        }
      }
    }
    else {
      if (this.bigLayeredCubes) {
        for (var i = 0; i < this.bigLayeredCubes.length; i++) {
          var bigLayerCube = this.bigLayeredCubes[i];
          this.container.remove(bigLayerCube);
        }
      }
      this.bigLayeredCubes = null;
    }
  }

  toggleRotateOnce() {
    var oldval = this.pitchObject.rotation.x;
    this.pitchObject.rotation.x = oldval - Math.PI / 2;
  }

  toggleCrazyRotate() {
    this.goCrazyRotate = !this.goCrazyRotate;
  }

  updateStackingBigCubeTextures(media) {
    var material = this.bigCubeMaterial(media);
    if (!material) return;

    this.topStackingBigCube.material = material;
    this.topStackingBigCube.needsUpdate = true;

    for (var i = 0; i < this.childStackingBigCubes.length; i++) {
      this.childStackingBigCubes[i].material = material;
      this.childStackingBigCubes[i].needsUpdate = true;
    }
  }

  createBigCube(media) {
    var material = media ? this.bigCubeMaterial(media) : new THREE.MeshFaceMaterial();
    return new THREE.Mesh(
      new THREE.BoxGeometry(this.bigCubeLength, this.bigCubeLength, this.bigCubeLength),
      material
    );
  }

  bigCubeMaterial(media) {
    if (!media) return null;
    var texture = this.createTexture(media);

    var material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}); // want shiny? maybe l8r

    var materials = [
      material,         // Left side
      material.clone(), // Right side
      new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0}), // Top side
      new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0}), // Bottom side
      material.clone(), // Front side
      material.clone()  // Back side
    ];

    return new THREE.MeshFaceMaterial(materials);
  }

}

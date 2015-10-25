
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
    this.useBigCube = options.useBigCube || false;
    this.useBigCubeV2 = options.useBigCubeV2 || true;

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

    // big cube
    if (this.useBigCubeV2) {
      this.bigCube = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube);

      this.bigCube3 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube3);

      this.bigCube4 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube4);

      this.bigCube5 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube5);

      this.bigCube6 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube6);

      this.bigCube7 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube7);

      this.bigCube8 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube8);

      this.bigCube9 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube9);

      this.bigCube10 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube10);

      this.bigCube11 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube11);

      this.bigCube12 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube12);

      this.bigCube13 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube13);

      this.bigCube14 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube14);

      this.bigCube15 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube15);

      this.bigCube16 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube16);

      this.bigCube17 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube17);

      this.bigCube18 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube18);

      this.bigCube19 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube19);

      this.bigCube20 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube20);

      this.bigCube21 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(this.media[0])
      );
      this.container.add(this.bigCube21);

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

   if (this.useBigCubeV2) {
      this.bigCube.position.y = this.controlObject.position.y;
      this.bigCube3.position.y = this.controlObject.position.y-500;
      this.bigCube4.position.y = this.controlObject.position.y-1000;
      this.bigCube5.position.y = this.controlObject.position.y-1500;
      this.bigCube6.position.y = this.controlObject.position.y-2000;
      this.bigCube7.position.y = this.controlObject.position.y-2500;
      this.bigCube8.position.y = this.controlObject.position.y-3000;
      this.bigCube9.position.y = this.controlObject.position.y+500;
      this.bigCube10.position.y = this.controlObject.position.y+1000;
      this.bigCube11.position.y = this.controlObject.position.y+1500;
      this.bigCube12.position.y = this.controlObject.position.y+2000;
      this.bigCube13.position.y = this.controlObject.position.y+2500;
      this.bigCube14.position.y = this.controlObject.position.y+3000;
      this.bigCube15.position.y = this.controlObject.position.y+3500;
      this.bigCube16.position.y = this.controlObject.position.y+4500;
      this.bigCube17.position.y = this.controlObject.position.y+4000;
      this.bigCube18.position.y = this.controlObject.position.y-3500;
      this.bigCube19.position.y = this.controlObject.position.y-4000;
      this.bigCube20.position.y = this.controlObject.position.y+4500;
      this.bigCube21.position.y = this.controlObject.position.y-4500;

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

    if (this.useBigCubeV2) {
      // update big cube with the current passing item
      this.updateBigCubeTexture(this.media[this.nextMediaMeshToPassIndex]);
    }

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

    if (this.useBigCube) {
      this.bigCube2 = new THREE.Mesh(
        new THREE.BoxGeometry(500, 500, 500),
        this.bigCubeMaterial(media)
      );
      this.container.add(this.bigCube2);
      this.bigCube2.position.set(this.xPosition, this.yForMediaWithIndex(index)*20, this.zPosition);
    }

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
    if (this.useBigCubeV2 && !this.useBigCube){
      this.useBigCubeV2 = false;
      this.useBigCube = true;
    }

    if (this.useBigCube && !this.useBigCubeV2){
      this.useBigCube = false;
      this.useBigCubeV2 = true;
    }

    if (!this.useBigCube && !this.useBigCubeV2){
      this.useBigCube = true;
    }
  }

  toggleRotateOnce() {
    var oldval = this.pitchObject.rotation.x;
    this.pitchObject.rotation.x = oldval - Math.PI / 2;
  }

  toggleCrazyRotate() {
    this.goCrazyRotate = !this.goCrazyRotate;
  }

  updateBigCubeTexture(media) {
    var material = this.bigCubeMaterial(media);
    if (!material) return;

    this.bigCube.material = material;
    this.bigCube.needsUpdate = true;

    this.bigCube3.material = material;
    this.bigCube3.needsUpdate = true;

    this.bigCube4.material = material;
    this.bigCube4.needsUpdate = true;

    this.bigCube5.material = material;
    this.bigCube5.needsUpdate = true;

    this.bigCube6.material = material;
    this.bigCube6.needsUpdate = true;

    this.bigCube7.material = material;
    this.bigCube7.needsUpdate = true;

    this.bigCube8.material = material;
    this.bigCube8.needsUpdate = true;

    this.bigCube9.material = material;
    this.bigCube9.needsUpdate = true;

    this.bigCube10.material = material;
    this.bigCube10.needsUpdate = true;

    this.bigCube11.material = material;
    this.bigCube11.needsUpdate = true;

    this.bigCube12.material = material;
    this.bigCube12.needsUpdate = true;

    this.bigCube13.material = material;
    this.bigCube13.needsUpdate = true;

    this.bigCube14.material = material;
    this.bigCube14.needsUpdate = true;

    this.bigCube15.material = material;
    this.bigCube15.needsUpdate = true;

    this.bigCube16.material = material;
    this.bigCube16.needsUpdate = true;

    this.bigCube17.material = material;
    this.bigCube17.needsUpdate = true;

    this.bigCube18.material = material;
    this.bigCube18.needsUpdate = true;

    this.bigCube19.material = material;
    this.bigCube19.needsUpdate = true;

    this.bigCube20.material = material;
    this.bigCube20.needsUpdate = true;

    this.bigCube21.material = material;
    this.bigCube21.needsUpdate = true;
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

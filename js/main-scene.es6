
let THREE = require('three');
let $ = require('jquery');
let buzz = require('./lib/buzz.js');
let kt = require('kutility');

import {SheenScene} from './sheen-scene.es6';
import {Gallery} from './gallery.es6';

export class MainScene extends SheenScene {

  /// Init

  constructor(renderer, camera, scene, options) {
    super(renderer, camera, scene, options);

    this.name = "Art Decade";
  }

  /// Overrides

  enter() {
    super.enter();

    this.makeLights();

    // make all the galleries here
    this.david = new Gallery(this.scene, this.controlObject, {
      yLevel: 0
    });
  }

  doTimedWork() {
    super.doTimedWork();

    this.david.create();
  }

  exit() {
    super.exit();

    this.david.destroy();
  }

  children() {
    return [this.lightContainer];
  }

  update() {
    super.update();

    if (this.lightContainer) {
      this.lightContainer.position.y = this.camera.position.y - 5;
    }

    if (this.david) {
      this.david.update();
    }
  }

  // Creation

  makeLights() {
    let container = new THREE.Object3D();
    this.scene.add(container);
    this.lightContainer = container;

    this.frontLight = makeDirectionalLight();
    this.frontLight.position.set(-40, 125, 200);
    setupShadow(this.frontLight);

    this.backLight = makeDirectionalLight();
    this.backLight.position.set(40, 125, -200);

    this.leftLight = makeDirectionalLight();
    this.leftLight.position.set(-200, 75, -45);

    this.rightLight = makeDirectionalLight();
    this.rightLight.position.set(200, 75, -45);
    this.rightLight.shadowDarkness = 0.05;

    this.lights = [this.frontLight, this.backLight, this.leftLight, this.rightLight];

    function makeDirectionalLight() {
      var light = new THREE.DirectionalLight( 0xffffff, 0.9);
      light.color.setHSL( 0.1, 1, 0.95 );

      container.add(light);
      return light;
    }

    function setupShadow(light) {
      light.castShadow = true;
      light.shadowCameraFar = 500;
      light.shadowDarkness = 0.6;
      light.shadowMapWidth = light.shadowMapHeight = 2048;
    }
  }

}

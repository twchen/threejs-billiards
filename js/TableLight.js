class SpotLight {
  constructor(x, y, z) {
    this.light = new THREE.SpotLight(0xffffe5, 1);

    this.light.position.set(x, y, z);
    this.light.target.position.set(x, 0, z); //the light points directly towards the xz plane
    this.light.target.updateMatrixWorld();

    this.light.castShadow = true;
    this.light.shadow.camera.fov = 110;
    this.light.shadow.camera.near = 100;
    this.light.shadow.camera.far = 170;
    this.light.shadow.mapSize.width = 2048;
    this.light.shadow.mapSize.height = 2048;

    scene.add(this.light);

    if (debug) {
      this.shadowCam = new THREE.CameraHelper(this.light.shadow.camera);
      scene.add(this.shadowCam);
    }
  }
}

class DirectionalLight {
  constructor(x, y, z) {
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(x, y, z);
    this.light.castShadow = true;

    this.light.shadow.mapSize.width = 2048; // default
    this.light.shadow.mapSize.height = 2048; // default
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = 400;
    this.light.shadow.camera.left = -100;
    this.light.shadow.camera.right = 100;
    this.light.shadow.camera.top = 200;
    this.light.shadow.camera.bottom = -200;
    scene.add(this.light);

    if (debug) {
      var helper = new THREE.CameraHelper(this.light.shadow.camera);
      scene.add(helper);
    }
  }
}
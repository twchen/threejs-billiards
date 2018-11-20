var SpotLight = function (x,y,z) {
  this.spotlight = new THREE.SpotLight(0xffffe5, 1);

  this.spotlight.position.set(x, y, z);
  this.spotlight.target.position.set(x, 0, z); //the light points directly towards the xz plane
  this.spotlight.target.updateMatrixWorld();

  this.spotlight.castShadow = true;
  this.spotlight.shadow.camera.fov = 110;
  this.spotlight.shadow.camera.near = 100;
  this.spotlight.shadow.camera.far = 170;
  this.spotlight.shadow.mapSize.width = 2048;
  this.spotlight.shadow.mapSize.height = 2048;

  scene.add(this.spotlight);

  if (debug) {
    this.shadowCam = new THREE.CameraHelper(this.spotlight.shadow.camera);
    scene.add(this.shadowCam);
  }
};

var DirectionalLight = function (x, y, z) {
  this.light = new THREE.DirectionalLight(0xffffff, 1);
  this.light.position.set(x, y, z);
  this.light.castShadow = true;

  this.light.shadow.mapSize.width = 2048; // default
  this.light.shadow.mapSize.height = 2048; // default
  this.light.shadow.camera.near = 0.5; // default
  this.light.shadow.camera.far = 300; // default
  this.light.shadow.camera.left = -150;
  this.light.shadow.camera.right = 150;
  this.light.shadow.camera.top = 100;
  this.light.shadow.camera.bottom = -100;
  scene.add(this.light);
  if(debug){
    var helper = new THREE.CameraHelper(this.light.shadow.camera);
    scene.add(helper);
  }
}
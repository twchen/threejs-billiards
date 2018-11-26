function loadJSON(url) {
  return new Promise((resolve, reject) => {
    return new THREE.JSONLoader().load(url, resolve, undefined, reject);
  });
}

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, resolve, undefined, reject);
  });
}

class KeyboardControls {
  constructor(camera, orbitControls) {
    this.camera = camera;
    this.controls = orbitControls;
    this.followingCueball = true;
    this.keyPressed = null;
    this.speed = 100;
    window.addEventListener(
      "keyup",
      event => {
        this.keyPressed = null;
      },
      false
    );
    window.addEventListener(
      "keydown",
      event => {
        if('qweasd'.indexOf(event.key) !== -1){
          this.followingCueball = false;
        }
        this.keyPressed = event.key;
      },
      false
    );
    const button = document.querySelector('#focusBtn');
    button.onclick = () => {
      this.followingCueball = true;
    }
  }

  update() {
    const position = this.camera.position;
    const target = this.controls.target;
    const deltaX = target.x - position.x;
    const deltaZ = target.z - position.z;
    let delta = null;
    switch (this.keyPressed) {
      case "a":
        delta = new THREE.Vector3(deltaZ, 0, -deltaX);
        break;
      case "d":
        delta = new THREE.Vector3(-deltaZ, 0, deltaX);
        break;
      case "w":
        delta = new THREE.Vector3(deltaX, 0, deltaZ);
        break;
      case "s":
        delta = new THREE.Vector3(-deltaX, 0, -deltaZ);
        break;
      case "e":
        delta = new THREE.Vector3(0, 1, 0);
        break;
      case "q":
        delta = new THREE.Vector3(0, -1, 0);
        break;
      default:
    }
    if (delta) {
      delta.normalize();
      position.add(delta);
      target.add(delta);
      this.controls.update();
    }
  }
}

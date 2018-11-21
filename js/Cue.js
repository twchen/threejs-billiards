class Cue {
  constructor(scene) {
    const geometry = new THREE.CylinderGeometry(0.5, 1, 100, 16, 16);
    const texture = new THREE.TextureLoader().load('textures/brown-light-wood.jpg');
    const material = new THREE.MeshPhongMaterial({
      map: texture
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.rotation.z = Math.PI / 2 + Math.PI / 12;
    scene.add(this.mesh);
  }

  update(ballPostion, ballForward) {
    const cueForward = new THREE.Vector3(-1, 0, 0);
    const cross = cueForward.clone().cross(ballForward);
    const angle = Math.acos(cueForward.clone().dot(ballForward));
    const rotationY = cross.y < 0 ? -angle : angle;
    const position = ballPostion.clone().sub(ballForward.clone().multiplyScalar(70));
    position.y = 20;
    this.mesh.position.copy(position);
    this.mesh.rotation.y = rotationY;
  }
}
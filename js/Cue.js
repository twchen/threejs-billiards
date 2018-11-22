class Cue {
  constructor(scene) {
    this.smallRadius = 0.5;
    this.largeRadius = 1;
    this.length = 100;
    this.angle = Math.PI / 12;
    const geometry = new THREE.CylinderGeometry(this.smallRadius, this.largeRadius, this.length, 16, 16);
    const texture = new THREE.TextureLoader().load('textures/brown-light-wood.jpg');
    const material = new THREE.MeshPhongMaterial({
      map: texture
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.rotation.z = Math.PI / 2 + this.angle;
    scene.add(this.mesh);
  }

  update(ballPostion, ballForward) {
    const cueForward = new THREE.Vector3(-1, 0, 0);
    const cross = cueForward.clone().cross(ballForward);
    const angle = Math.acos(cueForward.clone().dot(ballForward));
    const rotationY = cross.y < 0 ? -angle : angle;
    const hypotenuse = this.length / 2 + 6 * Ball.RADIUS;
    const scale = hypotenuse * Math.cos(this.angle);
    const position = ballPostion.clone().sub(ballForward.clone().multiplyScalar(scale));
    position.y = hypotenuse * Math.sin(this.angle);
    this.mesh.position.copy(position);
    this.mesh.rotation.y = rotationY;
  }

  shoot(strength){
    const cuePos = this.mesh.position;
    const coords = cuePos.clone();
    const ballPos = game.balls[0].mesh.position;
    const ballForward = game.balls[0].forward;
    const hypotenuse = this.length / 2 + Ball.RADIUS;
    const scale = hypotenuse * Math.cos(this.angle);
    const end = ballPos.clone().sub(ballForward.clone().multiplyScalar(scale));
    end.y = hypotenuse * Math.sin(this.angle);
    const tween = new TWEEN.Tween(coords)
      .to(end, 200)
      .onUpdate(function(){
        this.mesh.position.copy(coords);
      }.bind(this))
      .onComplete(function(){
        game.balls[0].hitForward(strength);
      });
    tween.start();
  }
}
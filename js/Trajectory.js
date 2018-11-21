class Trajectory {
  constructor(scene) {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(50, 0, 0));
    const material = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 2,
      gapSize: 2
    });
    this.line = new THREE.Line(geometry, material);
    this.line.computeLineDistances();
    this.length = 20;
    scene.add(this.line);
  }

  hide() {
    this.line.visible = false;
  }

  show(start, forward) {
    this.line.position.copy(start);
    // atan2(y, x) return the angle between the positive x axis
    // and the ray from (0, 0) to (x, y)
    //const rotaionY = Math.atan2(forward.z, forward.x);
    //this.line.rotation.y = rotaionY;
    //this.line.visible = true;
    const end = start.clone().add(forward.multiplyScalar(this.length));
    this.draw(start, end);
  }

  draw(start, end){
    this.line.geometry.vertices[0].copy(start);
    const endCopy = end.clone();
    endCopy.sub(start).multiplyScalar(this.length).add(start);
    this.line.geometry.vertices[1].copy(endCopy);
    this.line.geometry.verticesNeedUpdate = true;
    this.line.visible = true;
  }
}

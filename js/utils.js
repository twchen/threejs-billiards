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

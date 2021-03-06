const WIDTH = Math.floor(window.innerWidth * 0.95);
const HEIGHT = Math.floor(window.innerHeight * 0.95);

// Globals
var renderer, scene, camera, game, controls, keyboard, lightsConfig, world, gui, eightballgame;
var debug = false; // if true then collision wireframes are drawn
var keyboardControls;

var progressBar;
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms, 2: mb

var textureLoader = new THREE.TextureLoader();

THREE.DefaultLoadingManager.onProgress = function (url, loaded, total) {
  if (typeof progressBar !== 'undefined') {
    progressBar.style.width = (loaded / total * 100) + '%';
  }

  if (loaded == total && total > 28) {
    // hide progress bar
    var progBarDiv = document.getElementById('loading');
    //progBarDiv.parentNode.removeChild(progBarDiv);

    gui.show(document.getElementById('mainMenu'));

    // attach the render-supplied DOM element
    var canvasContainer = document.getElementById('canvas');
    canvasContainer.appendChild(renderer.domElement);
    draw();
  }
};

const VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.5,
    FAR = 4000;

// We use the clock to measure time, an extension for the keyboard
var clock = new THREE.Clock();

function onLoad() {
  gui = new GameGui();

  progressBar = document.getElementById('prog-bar');

  const overlay = document.querySelector('#overlay');
  overlay.style.width = `${WIDTH}px`;
  overlay.style.height = `${HEIGHT}px`;

  // create a WebGL renderer, camera
  // and a scene
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.up = new THREE.Vector3(0, 1, 0);

  scene = new THREE.Scene();
  scene.add(camera);

  // create renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;

  // Setup our cannon.js world for physics
  world = createPhysicsWorld();
  // Populate meshes and physics bodies:
  game = new Game();
  // Define how different objects interect physics-wise:
  setCollisionBehaviour();
  // Configure lighting:
  createSky();
  addLights();

  // MOUSE controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  keyboardControls = new KeyboardControls(camera, controls);

  controls.enableZoom = true;
  controls.enablePan = true;
  // increase precision of arrow key controls
  controls.keyPanSpeed = 1;

  //controls.minDistance = 35;
  //controls.maxDistance = 165;
  // Don't let the camera go below the ground
  controls.maxPolarAngle = 0.49 * Math.PI;

  camera.position.set(-170, 70, 0);

  // make the background void a grey color instead of black.
  renderer.setClearColor(0x262626, 1);
}

function createPhysicsWorld() {
  w = new CANNON.World();
  w.gravity.set(0, 30 * -9.82, 0); // m/s²

  w.solver.iterations = 10;
  w.solver.tolerance = 0; // Force solver to use all iterations

  // Allow sleeping
  w.allowSleep = true;

  w.fixedTimeStep = 1.0 / 60.0; // seconds

  return w;
}

/** Here the interaction when two materials touch is defined. E.g. how much a ball
    loses energy when hitting a wall.
    !TODO figure out whether the definition of Contactmaterials should be defined in
    some other place. For example, perhaps each ball object should define it's contactmaterial
    with the walls itself?
*/
function setCollisionBehaviour() {
  world.defaultContactMaterial.friction = 0.1;
  world.defaultContactMaterial.restitution = 0.85;

  var ball_floor = new CANNON.ContactMaterial(
    Ball.contactMaterial,
    Table.floorContactMaterial, {
      friction: 0.7,
      restitution: 0.1
    }
  );

  var ball_wall = new CANNON.ContactMaterial(
    Ball.contactMaterial,
    Table.wallContactMaterial, {
      friction: 0.5,
      restitution: 0.9
    }
  );

  world.addContactMaterial(ball_floor);
  world.addContactMaterial(ball_wall);
}

function draw(time) {
  stats.begin();

  // Controls
  if(keyboardControls.followingCueball){
    controls.target.copy(game.balls[0].mesh.position);
    controls.update();
  }else{
    keyboardControls.update();
  }
  

  // Physics world
  world.step(w.fixedTimeStep);

  // THREE objects
  var dt = clock.getDelta();
  game.tick(dt);

  stats.end();
  requestAnimationFrame(draw);
  TWEEN.update(time);
  renderer.render(scene, camera); // We render our scene with our camera
}

function createSky() {
  var geometry = new THREE.CubeGeometry(2000, 2000, 2000);
  var prefix = 'textures/skybox/chlorine-bay_';
  var ext = '.tga';
  var filenames = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];
  var materials = [];
  var loader = new THREE.TGALoader();
  for (var i = 0; i < filenames.length; ++i) {
    materials.push(new THREE.MeshBasicMaterial({
      map: loader.load(prefix + filenames[i] + ext),
      side: THREE.BackSide
    }));
  }
  var cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);
}

// Adds an ambient light and two spotlights above the table
function addLights() {
  var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4); // soft white ambient light
  scene.add(ambientLight);
  /*
  var tableLight1 = new TableLight( Table.LEN_X / 4, 150, 0);
  var tableLight2 = new TableLight(-Table.LEN_X / 4, 150, 0);
  */
  var sunLight = new DirectionalLight(-150, 150, 0);
}
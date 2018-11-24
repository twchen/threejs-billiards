class Table {
  constructor() {
    this.init();

    this.floor = this.createFloor(); //floor

    this.holes = this.createHoles();

    this.walls = this.createWalls();
  }

  async init() {
    const meshX = -Table.LEN_X / 2;
    const meshY = 0;
    const meshZ = Table.LEN_Z / 2;

    const feltTexture = await loadTexture('textures/baize.jpg');

    const params = {
      'base': {
        color: new THREE.Color(0x7a5230),
        specular: 0x404040,
        shininess: 20
      },
      'felt': {
        map: feltTexture,
        specular: 0x404040,
        shininess: 10,
      },
      'edges': {
        color: new THREE.Color(0x7a5230),
        specular: 0x404040,
        shininess: 100
      },
      'pockets': {
        color: new THREE.Color(0x7a5230),
        specular: 0x3D3D3D,
        shininess: 20
      },
      'pocket_bottoms': {
        color: new THREE.Color(0x000),
        specular: 0x000,
        shininess: 0
      }
    };

    const promises = Object.keys(params).map(async key => {
      const url = `json/table/${key}.json`;
      const geometry = await loadJSON(url);
      const material = new THREE.MeshPhongMaterial(params[key]);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(meshX, meshY, meshZ);
      mesh.scale.set(100, 100, 100);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      return mesh;
    });

    const meshes = await Promise.all(promises);
    meshes.forEach(mesh => scene.add(mesh));
  }

  createHoles() {
    const holes = [
      //corners of -x table side
      new Hole(Table.LEN_X / 2 + 1.5, 0, -Table.LEN_Z / 2 - 1.5, Math.PI / 4),
      new Hole(-Table.LEN_X / 2 - 1.5, 0, -Table.LEN_Z / 2 - 1.5, -Math.PI / 4),
      //middle holes
      new Hole(0, 0, -Table.LEN_Z / 2 - 4.8, 0),
      new Hole(0, 0, Table.LEN_Z / 2 + 4.8, Math.PI),
      //corners of +x table side
      new Hole(Table.LEN_X / 2 + 1.5, 0, Table.LEN_Z / 2 + 1.5, 3 * Math.PI / 4),
      new Hole(-Table.LEN_X / 2 - 1.5, 0, Table.LEN_Z / 2 + 1.5, -3 * Math.PI / 4)
    ];
    return holes;
  }

  createWalls() {
    const walls = [
      // walls of -z
      new LongWall(Table.LEN_X / 4 - 0.8, 2, -Table.LEN_Z / 2, 61),
      new LongWall(-Table.LEN_X / 4 + 0.8, 2, -Table.LEN_Z / 2, 61),
      // walls of +z
      new LongWall(Table.LEN_X / 4 - 0.8, 2, Table.LEN_Z / 2, 61),
      new LongWall(-Table.LEN_X / 4 + 0.8, 2, Table.LEN_Z / 2, 61),
      // wall of +x
      new ShortWall(Table.LEN_X / 2, 2, 0, 60.5),
      // wall of -x
      new ShortWall(-Table.LEN_X / 2, 2, 0, 60.5)
    ];
    walls[1].body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI);
    walls[2].body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI);
    walls[3].body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI);
    walls[5].body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -1.5 * Math.PI);
    walls.forEach(wall => {
      world.addBody(wall.body);
      if (debug) {
        addCannonVisual(wall.body);
      }
    });
    return walls;
  }

  createFloor() {
    const narrowStripWidth = 2;
    const narrowStripLength = Table.LEN_Z / 2 - 5;
    const floorThickness = 1;
    const mainAreaX = Table.LEN_X / 2 - 2 * narrowStripWidth;

    const floorBox = new CANNON.Box(new CANNON.Vec3(mainAreaX, floorThickness, Table.LEN_Z / 2));
    const floorBoxSmall = new CANNON.Box(new CANNON.Vec3(narrowStripWidth, floorThickness, narrowStripLength));

    const body = new CANNON.Body({
      mass: 0, // mass == 0 makes the body static
      material: Table.floorContactMaterial
    });
    body.addShape(floorBox, new CANNON.Vec3(0, -floorThickness, 0));
    body.addShape(floorBoxSmall, new CANNON.Vec3(-mainAreaX - narrowStripWidth, -floorThickness, 0));
    body.addShape(floorBoxSmall, new CANNON.Vec3(mainAreaX + narrowStripWidth, -floorThickness, 0));

    if (debug) {
      addCannonVisual(body, 0xff0000);
    }
    world.add(body);
    return body
  }
};

Table.LEN_Z = 137.16;
Table.LEN_X = 274.32;
Table.WALL_HEIGHT = 6;
Table.floorContactMaterial = new CANNON.Material('floorMaterial');
Table.wallContactMaterial = new CANNON.Material('wallMaterial');
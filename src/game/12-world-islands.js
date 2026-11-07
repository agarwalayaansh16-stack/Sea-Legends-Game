
// ── 12-world-islands.js ─ World creation, islands, terrain and island decorations.
function createWorld() {
  for (let i = 0; i < 10; i += 1) {
    const angle = i * 0.62;
    const distance = i === 0 ? 0 : i === 1 ? 2750 : 5200 + i * 950;
    const radius = i === 0 ? STARTER_RADIUS : i === 1 ? 1450 : i === 2 ? 2400 : i === 3 ? 1120 : i === 4 ? 900 : 90 + i * 36;
    const position = i === 1
      ? new THREE.Vector3(2280, 0, -1420)
      : i === 2
        ? new THREE.Vector3(-3400, 0, -3200)
        : i === 3
          ? new THREE.Vector3(-4550, 0, 980)
          : i === 4
            ? new THREE.Vector3(4800, 0, 3600)
            : new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);
    const island = createIsland(position, radius, i);
    islands.push({ index: i, position, radius, mesh: island, surfaceY: getIslandSurfaceY(i) });
  }

  const starterIsland = islands[0];
  const qgY = getIslandSurfaceHeightAt(52, 16, starterIsland);
  createQuestGiver(new THREE.Vector3(52, qgY, 16));
  
  const bdY = getIslandSurfaceHeightAt(-460, 60, starterIsland);
  createBoatDealer(new THREE.Vector3(-460, bdY, 60));
  
  const sdY = getIslandSurfaceHeightAt(48, 104, starterIsland);
  createSwordDealer(new THREE.Vector3(48, sdY, 104));
  
  createCrossingDock();
  
  const tel1Y = getIslandSurfaceHeightAt(438, -310, starterIsland);
  createTeleporter(new THREE.Vector3(438, tel1Y, -310), new THREE.Vector3(islands[1].position.x - 620, islands[1].surfaceY + 0.15, islands[1].position.z + 430));
  
  // Secondary teleporter nearby on Starter Island
  const tel3Y = getIslandSurfaceHeightAt(458, -290, starterIsland);
  createTeleporter(new THREE.Vector3(458, tel3Y, -290), new THREE.Vector3(islands[1].position.x - 620, islands[1].surfaceY + 0.15, islands[1].position.z + 430));
  
  const tel2Y = getIslandSurfaceHeightAt(-380, -360, starterIsland);
  createTeleporter(new THREE.Vector3(-380, tel2Y, -360), new THREE.Vector3(islands[2].position.x + 50, islands[2].surfaceY + 0.15, islands[2].position.z + 50), true);

  // Teleporter to Snowy Village (on east edge of Starter Island)
  const tel4Y = getIslandSurfaceHeightAt(480, 220, starterIsland);
  createTeleporter(new THREE.Vector3(480, tel4Y, 220), new THREE.Vector3(islands[4]?.position.x - 400, islands[4]?.surfaceY + 0.15, islands[4]?.position.z - 200));
  
  createBanditCamp();
  
  const oqgPos = islands[2].position.clone().add(new THREE.Vector3(0, 0, 0));
  oqgPos.y = getIslandSurfaceHeightAt(oqgPos.x, oqgPos.z, islands[2]);
  createOutpostQuestGiver(oqgPos);
  
  const htPos = islands[3].position.clone().add(new THREE.Vector3(70, 0, -60));
  htPos.y = getIslandSurfaceHeightAt(htPos.x, htPos.z, islands[3]);
  createHakiTrainer(htPos);
  
  spawnPirateCamp(islands[2]);
  spawnBruteCamp(islands[2]);
  
  // Spawn Jester Boss at Pirate Town
  const buggyPos = islands[2].position.clone().add(new THREE.Vector3(260, 0, -220));
  buggyPos.y = getIslandSurfaceHeightAt(buggyPos.x, buggyPos.z, islands[2]);
  spawnBuggyBoss(buggyPos);

  // ── Secret Cave: Blaze Kick Dojo (near Jester's arena) ──
  const pirate = islands[2];
  if (pirate) {
    // Cave entrance is slightly behind & west of Jester's spawn
    const caveEntryPos = new THREE.Vector3(
      pirate.position.x + 180, 0, pirate.position.z - 300
    );
    caveEntryPos.y = getIslandSurfaceHeightAt(caveEntryPos.x, caveEntryPos.z, pirate);
    createBlackLegDojo(caveEntryPos);
  }


  const jungle = islands[1];
  if (jungle) {
    spawnJungleCamps(jungle);

    const jQuestPos = new THREE.Vector3(jungle.position.x + 350, getIslandSurfaceHeightAt(jungle.position.x + 350, jungle.position.z + 300, jungle), jungle.position.z + 300);
    createJungleQuestGiver(jQuestPos);
    createReturnTeleporter(jQuestPos.clone().add(new THREE.Vector3(25, 0, 25)));

    const jPulsePos = new THREE.Vector3(jungle.position.x - 150, getIslandSurfaceHeightAt(jungle.position.x - 150, jungle.position.z - 200, jungle), jungle.position.z - 200);
    createJunglePulseTrainer(jPulsePos);
    createReturnTeleporter(jPulsePos.clone().add(new THREE.Vector3(-25, 0, -25)));
  }

  // Desert Island additional spawns
  const desert = islands[3];
  if (desert) {
    spawnDesertCamps(desert);

    const dQuestPos = new THREE.Vector3(desert.position.x + 200, getIslandSurfaceHeightAt(desert.position.x + 200, desert.position.z + 200, desert), desert.position.z + 200);
    createDesertQuestGiver(dQuestPos);
    createReturnTeleporter(dQuestPos.clone().add(new THREE.Vector3(25, 0, 25)));
    
    // Teleporter near Aura Trainer
    const dHakiTelPos = htPos.clone().add(new THREE.Vector3(-25, 0, -25));
    createReturnTeleporter(dHakiTelPos);
  }

  // Snowy Village additional spawns
  const snowy = islands[4];
  if (snowy) {
    spawnSnowyCamps(snowy);

    const sQuestPos = new THREE.Vector3(snowy.position.x + 280, getIslandSurfaceHeightAt(snowy.position.x + 280, snowy.position.z + 180, snowy), snowy.position.z + 180);
    createSnowyQuestGiver(sQuestPos);
    createReturnTeleporter(sQuestPos.clone().add(new THREE.Vector3(30, 0, 30)));

    // Foresight Master (West Mountain Peak)
    const obsPos = new THREE.Vector3(snowy.position.x - 240, getIslandSurfaceHeightAt(snowy.position.x - 240, snowy.position.z + 160, snowy), snowy.position.z + 160);
    createObservationHakiTrainer(obsPos);
    createReturnTeleporter(obsPos.clone().add(new THREE.Vector3(-25, 0, 25)));

    // Flash Step Master (East Glacier Ridge)
    const flashPos = new THREE.Vector3(snowy.position.x + 180, getIslandSurfaceHeightAt(snowy.position.x + 180, snowy.position.z - 180, snowy), snowy.position.z - 180);
    createFlashStepTrainer(flashPos);
    createReturnTeleporter(flashPos.clone().add(new THREE.Vector3(25, 0, -25)));
  }

  // Last: make sure everything that stands on an island actually touches it.
  islands.forEach((island) => settleIslandObjects(island));
  // Prepare grass ground-cover maps now (during loading) rather than mid-game.
  windGrassIslands.forEach((island) => prepareGrassCoverMask(island));
}

function createIsland(position, radius, index) {
  const group = new THREE.Group();
  group.position.copy(position);
  const height = getIslandHeight(index);

  const baseGeometry = makeIrregularCylinderGeometry(radius, height, index === 2 ? 160 : index <= 1 ? 128 : index <= 4 ? 96 : 40, index + 3, -1, { radius, height, index, rings: index === 2 ? 60 : index <= 4 ? 24 : 14 });
  const base = new THREE.Mesh(
    baseGeometry,
    new THREE.MeshStandardMaterial({
      color: islandTerrainColor(WORLD_PALETTE.terrain.cliff, index),
      roughness: 0.86,
      metalness: 0.08,
      emissive: index === 0 ? 0x332711 : index === 4 ? 0x1a2430 : 0x1f1a16,
      emissiveIntensity: 0.06,
      flatShading: true,
    }),
  );
  base.position.y = height / 2;
  base.userData.surface = index === 4 ? "rock" : "cliff";
  base.receiveShadow = true;
  base.castShadow = true;
  base.userData.isTerrain = true;
  group.add(base);

  const grass = new THREE.Mesh(
    // Fine enough to follow the plateau's roll-off (and the outpost's two lobes).
    makeTerrainSurfaceGeometry(radius, height, index, index === 2 ? 160 : index <= 1 ? 128 : index <= 4 ? 96 : 48, index === 2 ? 70 : index === 1 ? 64 : index === 0 ? 40 : index <= 4 ? 32 : 18),
    new THREE.MeshStandardMaterial({ 
      color: islandTerrainColor(WORLD_PALETTE.terrain.grass, index),
      roughness: 0.82, 
      metalness: 0.02 
    }),
  );
  grass.userData.surface = index === 4 ? "snow" : "grass";
  grass.receiveShadow = true;
  grass.castShadow = true;
  grass.userData.isTerrain = true;
  group.add(grass);

  if (index === 0) {
    addStarterIslandDetails(group, radius, height, index);
  }
  if (index === 1) {
    addJungleIslandDetails(group, radius, height);
  }
  if (index === 2) {
    addOutpostIslandDetails(group, radius, height, index);
  }
  if (index === 3) {
    addDesertIslandDetails(group, radius, height, index);
  }
  if (index !== 1) {
    addIslandRocks(group, radius, height);
  }
  if (index === 0) {
    addStarterWindmills(group, radius, height);
  }
  // Grass goes last so it can avoid everything placed above.
  addWindGrass(group, radius, height, index);

  if (index === 0) {
    // Village flagpole marks the starter island from afar.
    const poleMat = new THREE.MeshStandardMaterial({ color: worldHex(0xe9e2cf), roughness: 0.5, metalness: 0.3 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 46, 10), poleMat);
    pole.position.set(0, height + 23, 0);
    pole.castShadow = true;
    pole.userData.surface = "metal";
    group.add(pole);
    const finial = new THREE.Mesh(new THREE.SphereGeometry(1.2, 14, 10), new THREE.MeshStandardMaterial({ color: 0xffd25a, emissive: 0x3a2300, metalness: 0.6, roughness: 0.3 }));
    finial.position.set(0, height + 46.6, 0);
    group.add(finial);
    const pennantShape = new THREE.Shape();
    pennantShape.moveTo(0, 0);
    pennantShape.lineTo(15, -3.5);
    pennantShape.lineTo(0, -7);
    pennantShape.lineTo(0, 0);
    const pennant = new THREE.Mesh(
      new THREE.ShapeGeometry(pennantShape),
      new THREE.MeshStandardMaterial({ color: worldHex(0xd8483a), side: THREE.DoubleSide, roughness: 0.7 }),
    );
    pennant.position.set(0.5, height + 45.4, 0);
    pennant.castShadow = true;
    pennant.userData.surface = "plaster";
    group.add(pennant);
    animatedFoliage.push({ mesh: pennant, baseRotZ: 0, phase: 0.4 });
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 1.6, 12), new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.stone), roughness: 0.9 }));
    plinth.position.set(0, height + 0.8, 0);
    plinth.userData.surface = "stone";
    group.add(plinth);
    addCollisionCircle(new THREE.Vector3(0, height, 0), 3.4, "Flagpole", { material: "metal", height: 1.6 });
    addCollisionCircle(new THREE.Vector3(0, height, 0), 1.0, "Flagpole", { material: "metal" });

    const label = makeLabel("Island 1", 2);
    label.position.set(0, height + 55, 0);
    group.add(label);
  }

  if (index !== 1 && index !== 0) {
    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(index === 0 ? 2.5 : 0.4, index === 0 ? 2.5 : 0.4, index === 0 ? 48 : 9 + index * 0.8, 8),
      new THREE.MeshStandardMaterial({ color: index === 4 ? 0x88ccff : 0xffd25a, emissive: index === 4 ? 0x1a3a5c : 0x3a2300 }),
    );
    // Stand the pole on the ground (its height is 9 + 0.8 * index).
    marker.position.set(0, getLocalSurfaceHeightAt(0, 0, radius, height, index) + (9 + index * 0.8) / 2 - 0.2, 0);
    group.add(marker);

    const islandLabel = index === 4 ? "Snowy Village" : `Island ${index + 1}`;
    const label = makeLabel(islandLabel, 2 + index * 0.2);
    label.position.set(0, height + (index === 0 ? 55 : 10 + index * 0.55), 0);
    group.add(label);
  }

  if (index > 0 && index !== 1) {
    const treeCount = index === 4 ? 22 : Math.min(8, index + 2);
    for (let t = 0; t < treeCount; t += 1) {
      const tree = index === 4 ? createSnowyTree() : createTree();
      const a = Math.random() * Math.PI * 2;
      const d = radius * (0.15 + Math.random() * 0.55);
      const tx = Math.cos(a) * d;
      const tz = Math.sin(a) * d;
      tree.position.set(tx, getLocalSurfaceHeightAt(tx, tz, radius, height, index) - 0.1, tz);
      group.add(tree);
    }
  }

  // (The old translucent "meadow glow" disc was removed: the wind grass gives the
  //  ground its colour variation, and the disc hung off the plateau on cove islands.)

  scene.add(group);
  return group;
}

function getIslandHeight(index) {
  if (index === 0) return STARTER_HEIGHT;
  if (index === 1) return 62;
  if (index === 2) return 48;
  if (index === 3) return 54;
  if (index === 4) return 58;
  return 3 + index * 0.2;
}

function getIslandSurfaceY(index) {
  if (index === 0) return STARTER_SURFACE_Y;
  return getIslandHeight(index) + 0.16;
}

// Collision volumes are flat shapes on the ground (x/z) with an optional height.
// Players can jump over anything whose `height` is below their feet.
//   circle  — rocks, posts, trees, wells
//   segment — capsules along a line (fences)
//   box     — rotated rectangles (houses, stalls)
function addCollisionVolume(shape, center, label, options = {}) {
  const volume = {
    shape,
    center: center.clone(),
    radius: options.radius ?? 0,
    label,
    height: options.height ?? Infinity,
    damage: options.damage ?? 10,
    material: options.material || "stone",
    toughness: options.toughness ?? 1,
  };
  if (shape === "segment") {
    volume.end = options.end.clone();
  }
  if (shape === "box") {
    volume.halfX = options.halfX;
    volume.halfZ = options.halfZ;
    volume.rotation = options.rotation || 0;
    volume.cos = Math.cos(volume.rotation);
    volume.sin = Math.sin(volume.rotation);
  }
  // Bounding radius for a cheap rejection test before the exact shape test.
  volume.bound = shape === "box"
    ? Math.hypot(volume.halfX, volume.halfZ)
    : shape === "segment"
      ? Math.hypot(volume.end.x - center.x, volume.end.z - center.z) + volume.radius
      : volume.radius;
  collisionVolumes.push(volume);
  return volume;
}

function addCollisionCircle(center, radius, label, options = {}) {
  return addCollisionVolume("circle", center, label, { ...options, radius });
}

function addCollisionSegment(start, end, radius, label, options = {}) {
  return addCollisionVolume("segment", start, label, { ...options, radius, end });
}

// rotation matches the mesh's rotation.y, so halfX/halfZ are the mesh's own half sizes.
function addCollisionBox(center, halfX, halfZ, rotation, label, options = {}) {
  return addCollisionVolume("box", center, label, { ...options, halfX, halfZ, rotation });
}

function createSnowyTree() {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.48, 2.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x483227, roughness: 0.92 }),
  );
  trunk.position.y = 1.4;
  trunk.castShadow = true;
  group.add(trunk);

  const foliageGroup = new THREE.Group();
  const tierColors = [0x42686b, 0x5a8385, 0x82a9ab];
  for (let i = 0; i < 3; i++) {
    const tier = new THREE.Mesh(
      new THREE.ConeGeometry(2.1 - i * 0.42, 2.0, 8),
      new THREE.MeshStandardMaterial({ color: tierColors[i], roughness: 0.85 }),
    );
    tier.position.y = 2.7 + i * 1.25;
    tier.castShadow = true;
    foliageGroup.add(tier);

    const snow = new THREE.Mesh(
      new THREE.ConeGeometry((2.1 - i * 0.42) * 0.65, 0.9, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }),
    );
    snow.position.y = tier.position.y + 0.65;
    snow.castShadow = true;
    foliageGroup.add(snow);
  }
  group.add(foliageGroup);
  animatedFoliage.push({ mesh: foliageGroup, baseRotZ: 0, phase: Math.random() * Math.PI * 2 });
  return group;
}

function createTree() {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.55, 3.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x6e4726, roughness: 0.9 }),
  );
  trunk.position.y = 1.6;
  trunk.castShadow = true;
  group.add(trunk);

  const tierColors = [0x267343, 0x2f8a50, 0x3aa35f];
  const foliageGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const tier = new THREE.Mesh(
      new THREE.ConeGeometry(2.3 - i * 0.45, 2.2, 8),
      new THREE.MeshStandardMaterial({ color: tierColors[i], roughness: 0.82 }),
    );
    tier.position.y = 3.1 + i * 1.35;
    tier.castShadow = true;
    foliageGroup.add(tier);
  }
  group.add(foliageGroup);
  animatedFoliage.push({ mesh: foliageGroup, baseRotZ: 0, phase: Math.random() * Math.PI * 2 });
  return group;
}

function addJungleIslandDetails(group, radius, height) {
  addJungleLakeAndPaths(group, radius, height);
  addJungleSatelliteIsland(group, radius, height);

  const tx = -radius * 0.12;
  const tz = radius * 0.08;
  const tY = getLocalSurfaceHeightAt(tx, tz, radius, height, 1);
  
  const treehouseTree = createJungleTree(230, 20);
  treehouseTree.position.set(tx, tY + 0.1, tz);
  group.add(treehouseTree);

  const treehouse = createTreehouse();
  treehouse.position.set(tx, tY + 145, tz);
  treehouse.rotation.y = 0.45;
  group.add(treehouse);

  // Curved rainforest trees, drawn as instanced batches (29-jungle-trees.js).
  addJungleForest(group, radius, height, 180);

  for (let i = 0; i < 260; i += 1) {
    const angle = i * 1.618;
    const distance = radius * (0.06 + ((i * 53) % 80) / 100);
    const bx = Math.cos(angle) * distance;
    const bz = Math.sin(angle) * distance;
    const bY = getLocalSurfaceHeightAt(bx, bz, radius, height, 1);
    const bush = createBigJungleBush(26 + (i % 6) * 7);
    bush.position.set(bx, bY + 1.2, bz);
    bush.rotation.y = angle;
    group.add(bush);
  }
}

function addJungleLakeAndPaths(group, radius, height) {
  const lakeMaterial = new THREE.MeshStandardMaterial({
    color: 0x116fc1,
    emissive: 0x07335c,
    emissiveIntensity: 0.12,
    roughness: 0.22,
    metalness: 0.03,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });
  const dirt = new THREE.MeshStandardMaterial({ color: 0x9a8464, roughness: 0.96 });

  const lake = new THREE.Mesh(makeIrregularDiscGeometry(radius * 0.24, 96, 88), lakeMaterial);
  lake.rotation.x = -Math.PI / 2;
  lake.scale.set(0.75, 1.32, 1);
  lake.position.set(radius * 0.18, height + 0.5, -radius * 0.08);
  group.add(lake);
  animatedWorldObjects.push({ mesh: lake, type: "tide", baseY: lake.position.y, speed: 0.0022, phase: 3.4 });

  const pathSpecs = [
    [-radius * 0.36, radius * 0.1, radius * 0.7, 46, 1.08],
    [radius * 0.04, -radius * 0.28, radius * 0.6, 38, -0.34],
    [radius * 0.17, radius * 0.16, radius * 0.5, 34, 0.76],
  ];

  pathSpecs.forEach(([x, z, length, width, rotation]) => {
    const path = new THREE.Mesh(new THREE.BoxGeometry(width, 0.55, length), dirt);
    path.position.set(x, height + 0.62, z);
    path.rotation.y = rotation;
    path.receiveShadow = true;
    group.add(path);
  });

  const bridge = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x67452c, roughness: 0.88 });
  for (let i = -5; i <= 5; i += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(34, 2.2, 10), wood);
    plank.position.set(i * 13, height + 2.2, 0);
    plank.rotation.y = (i % 2) * 0.04;
    plank.castShadow = true;
    bridge.add(plank);
  }
  bridge.position.set(radius * 0.18, 0, -radius * 0.08);
  bridge.rotation.y = -0.58;
  group.add(bridge);
}

function addJungleSatelliteIsland(group, radius, height) {
  const offset = new THREE.Vector3(-radius * 0.82, 0, radius * 0.76);
  const smallRadius = radius * 0.43;
  const smallHeight = height * 0.72;
  const base = new THREE.Mesh(
    makeIrregularCylinderGeometry(smallRadius, smallHeight, 96, 122),
    new THREE.MeshStandardMaterial({ color: 0x3a3933, roughness: 0.9, flatShading: true }),
  );
  base.position.set(offset.x, smallHeight / 2 - 1, offset.z);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const grass = new THREE.Mesh(
    makeIrregularDiscGeometry(smallRadius * 0.88, 96, 128),
    new THREE.MeshStandardMaterial({ color: 0x246f38, roughness: 0.84 }),
  );
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(offset.x, smallHeight - 0.8, offset.z);
  grass.receiveShadow = true;
  group.add(grass);

  const channel = new THREE.Mesh(
    new THREE.BoxGeometry(34, 0.8, radius * 0.52),
    new THREE.MeshStandardMaterial({ color: 0x08a3d8, roughness: 0.28, transparent: true, opacity: 0.86 }),
  );
  channel.position.set(offset.x + smallRadius * 0.18, smallHeight + 0.2, offset.z);
  channel.rotation.y = -0.08;
  group.add(channel);

  const ropeBridge = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x5b3c25, roughness: 0.9 });
  for (let i = 0; i < 18; i += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(30, 2.3, 9), wood);
    plank.position.z = i * 18;
    plank.rotation.y = Math.sin(i) * 0.05;
    plank.castShadow = true;
    ropeBridge.add(plank);
  }
  ropeBridge.position.set(offset.x + smallRadius * 0.36, smallHeight + 1.6, offset.z - smallRadius * 0.42);
  ropeBridge.rotation.y = -0.5;
  group.add(ropeBridge);

  for (let i = 0; i < 46; i += 1) {
    const angle = i * 2.09;
    const distance = smallRadius * (0.16 + ((i * 31) % 62) / 100);
    const tree = createJungleTree(58 + (i % 5) * 9, 5 + (i % 4));
    tree.position.set(offset.x + Math.cos(angle) * distance, smallHeight, offset.z + Math.sin(angle) * distance);
    tree.rotation.y = angle;
    group.add(tree);
  }
}

function createCrossingDock() {
  const jungle = islands[JUNGLE_ISLAND_INDEX];
  if (!jungle) return;

  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x6c4a31, roughness: 0.88 });
  const start = new THREE.Vector3(470, OCEAN_SURFACE_Y + 1.6, -320);
  const end = new THREE.Vector3(jungle.position.x - 950, OCEAN_SURFACE_Y + 1.8, jungle.position.z + 610);
  const direction = end.clone().sub(start);
  const length = direction.length();
  const midpoint = start.clone().lerp(end, 0.5);

  const pier = new THREE.Mesh(new THREE.BoxGeometry(34, 2.4, length), wood);
  pier.position.copy(midpoint);
  pier.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());
  pier.castShadow = true;
  pier.receiveShadow = true;
  group.add(pier);

  for (let i = 0; i < 42; i += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(43, 1.4, 8), wood);
    plank.position.copy(start).lerp(end, i / 41);
    plank.position.y = OCEAN_SURFACE_Y + 3.2;
    plank.quaternion.copy(pier.quaternion);
    plank.rotation.z += (i % 2 ? 0.015 : -0.015);
    plank.castShadow = true;
    group.add(plank);
  }

  scene.add(group);
}

function createJungleTree(height, trunkRadius) {
  const group = new THREE.Group();
  const modifiedRadius = trunkRadius * 0.55; // Reduce tree radius to take up less space
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5d3b24, roughness: 0.94 });
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x145c32, roughness: 0.86, flatShading: true });

  // Extremely blocky Box trunk
  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(modifiedRadius * 2, height, modifiedRadius * 2),
    trunkMaterial
  );
  trunk.position.y = height / 2;
  trunk.castShadow = true;
  group.add(trunk);

  // Extremely blocky Box foliage
  for (let i = 0; i < 5; i += 1) {
    const size = modifiedRadius * (2.8 - i * 0.28); // foliage size multiplier is reduced to take up less space
    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(size * 2, size * 2, size * 2),
      leafMaterial,
    );
    crown.position.set(
      Math.sin(i * 1.7) * modifiedRadius * 0.7,
      height - i * modifiedRadius * 0.9,
      Math.cos(i * 1.2) * modifiedRadius * 0.7,
    );
    crown.castShadow = true;
    group.add(crown);
  }

  return group;
}

function createBigJungleBush(size) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.jungleCanopy[2]), roughness: 0.88, flatShading: true });

  for (let i = 0; i < 4; i += 1) {
    const bush = new THREE.Mesh(new THREE.SphereGeometry(size * (0.75 + i * 0.08), 12, 8), material);
    bush.position.set(Math.sin(i * 1.8) * size * 0.45, size * 0.42, Math.cos(i * 1.4) * size * 0.45);
    bush.scale.y = 0.48 + i * 0.05;
    bush.castShadow = true;
    bush.receiveShadow = true;
    group.add(bush);
  }

  return group;
}

function createTreehouse() {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a5432, roughness: 0.9 });
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x3d5f2d, roughness: 0.86 });

  const platform = new THREE.Mesh(new THREE.BoxGeometry(115, 10, 95), wood);
  platform.castShadow = true;
  platform.receiveShadow = true;
  group.add(platform);

  const hut = new THREE.Mesh(new THREE.BoxGeometry(72, 48, 58), wood);
  hut.position.y = 29;
  hut.castShadow = true;
  hut.receiveShadow = true;
  group.add(hut);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(58, 45, 4), roofMaterial);
  roof.position.y = 76;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);

  return group;
}

function addOutpostIslandDetails(group, radius, height, index) {
  addBeachRing(group, radius, height, index);
  const dirt = new THREE.MeshStandardMaterial({ color: 0x8b7358, roughness: 0.96 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x5c5a54, roughness: 0.96, flatShading: true });
  const wood = new THREE.MeshStandardMaterial({ color: 0x68432c, roughness: 0.9 });

  // Paths along the bridge
  [
    [-600, -200, 420, 34, 0.32],
    [-300, -100, 420, 34, 0.32],
    [0, 0, 420, 34, 0.32],
    [300, 100, 420, 34, 0.32],
    [600, 200, 420, 34, 0.32]
  ].forEach(([x, z, l, w, r]) => {
    const path = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, l), dirt);
    const pY = getLocalSurfaceHeightAt(x, z, radius, height, 2);
    path.position.set(x, pY + 0.6, z);
    path.rotation.y = r;
    group.add(path);
  });

  // Ruins distributed on the two parts
  for (let i = 0; i < 18; i += 1) {
    const ruin = new THREE.Mesh(new THREE.BoxGeometry(26 + (i % 4) * 8, 24 + (i % 3) * 12, 18), stone);
    const angle = i * 1.17;
    const dist = 200 + (i % 3) * 140;
    let rx, rz;
    if (i < 9) {
      // Pirate area ruins
      rx = -900 + Math.cos(angle) * dist;
      rz = -300 + Math.sin(angle) * dist;
    } else {
      // Brute area ruins
      rx = 900 + Math.cos(angle) * dist;
      rz = 300 + Math.sin(angle) * dist;
    }
    const rY = getLocalSurfaceHeightAt(rx, rz, radius, height, 2);
    ruin.position.set(rx, rY + ruin.geometry.parameters.height / 2, rz);
    ruin.rotation.y = angle;
    ruin.castShadow = true;
    ruin.receiveShadow = true;
    group.add(ruin);
  }

  // Towers on the two parts
  for (let i = 0; i < 8; i += 1) {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(10, 14, 58, 6), stone);
    const angle = i * 1.57;
    let tx, tz;
    if (i < 4) {
      // Pirate towers
      tx = -900 + Math.cos(angle) * 450;
      tz = -300 + Math.sin(angle) * 450;
    } else {
      // Brute towers
      tx = 900 + Math.cos(angle) * 450;
      tz = 300 + Math.sin(angle) * 450;
    }
    const tY = getLocalSurfaceHeightAt(tx, tz, radius, height, 2);
    tower.position.set(tx, tY + 29, tz);
    tower.castShadow = true;
    group.add(tower);
  }

  // Dock at the edge of Pirate Part
  const dockX = -1850;
  const dockZ = -300;
  const dockY = getLocalSurfaceHeightAt(dockX, dockZ, radius, height, 2);
  const dock = new THREE.Mesh(new THREE.BoxGeometry(42, 2.5, 210), wood);
  dock.position.set(dockX, dockY + 1.2, dockZ);
  dock.rotation.y = Math.PI / 2; // running East-West
  dock.castShadow = true;
  group.add(dock);
}

function addDesertIslandDetails(group, radius, height, index) {
  const sand = new THREE.Mesh(
    // Built on the same terrain as the grass, just above it, so the desert is sand all over.
    makeTerrainSurfaceGeometry(radius, height, index, 96, 26).translate(0, 0.1, 0),
    new THREE.MeshStandardMaterial({ color: 0xd6aa64, roughness: 0.96 }),
  );
  sand.userData.surface = "sand";
  sand.userData.noSettle = true;
  sand.receiveShadow = true;
  group.add(sand);

  for (let i = 0; i < 28; i += 1) {
    const obelisk = new THREE.Mesh(
      new THREE.ConeGeometry(8 + (i % 4) * 2, 48 + (i % 5) * 8, 4),
      new THREE.MeshStandardMaterial({ color: 0x9d7647, roughness: 0.92, flatShading: true }),
    );
    const angle = i * 1.41;
    const dist = radius * (0.16 + ((i * 29) % 62) / 100);
    const ox = Math.cos(angle) * dist;
    const oz = Math.sin(angle) * dist;
    const oY = getLocalSurfaceHeightAt(ox, oz, radius, height, 3);
    obelisk.position.set(ox, oY + 24, oz);
    obelisk.rotation.y = angle;
    obelisk.castShadow = true;
    group.add(obelisk);
  }
}

function createPalmTree(height) {
  const group = new THREE.Group();
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.palmTrunk), roughness: 0.9 });
  const leafMaterial = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.palmLeaf), roughness: 0.86, side: THREE.DoubleSide });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.6, height, 9), trunkMaterial);
  trunk.position.y = height / 2;
  trunk.rotation.z = 0.12;
  trunk.castShadow = true;
  group.add(trunk);

  for (let i = 0; i < 7; i += 1) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(4.2, 24, 5), leafMaterial);
    leaf.position.set(Math.cos(i * 0.9) * 4, height + 1.5, Math.sin(i * 0.9) * 4);
    leaf.rotation.z = Math.PI / 2.7;
    leaf.rotation.y = i * 0.9;
    leaf.castShadow = true;
    group.add(leaf);
    animatedFoliage.push({ mesh: leaf, baseRotZ: Math.PI / 2.7, phase: i * 0.9 });
  }

  const coconuts = new THREE.Mesh(
    new THREE.SphereGeometry(2.7, 12, 8),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.coconut), roughness: 0.9 }),
  );
  coconuts.position.y = height;
  coconuts.castShadow = true;
  group.add(coconuts);
  return group;
}

function createFlowerPatch(index) {
  const group = new THREE.Group();
  const colors = [0xf45d8a, 0xffd25a, 0xffffff, 0x7ce0b4, 0xff8a3d];
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x2c8a43, roughness: 0.9 });

  for (let i = 0; i < 6; i += 1) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 2.8, 6), stemMaterial);
    stem.position.set(Math.sin(i * 1.7) * 4, 1.4, Math.cos(i * 1.3) * 4);
    stem.castShadow = true;
    group.add(stem);

    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 8, 6),
      new THREE.MeshStandardMaterial({ color: colors[(index + i) % colors.length], roughness: 0.75 }),
    );
    flower.position.set(stem.position.x, 3, stem.position.z);
    flower.castShadow = true;
    group.add(flower);
  }

  return group;
}

function addStarterIslandDetails(group, radius, height, index) {
  addBeachRing(group, radius, height, index);
  addVillagePaths(group, height);
  addDock(group, radius, height);
  addPondAndWaterfall(group, radius, height);
  addVillagePlaza(group, height);
  addLookoutArch(group, height);
  addLanternsAndBanners(group, height);
  addShoreCrystals(group, radius, height);
  addStarterIslandDecorations(group, height);

  const houseSpots = [
    [-95, 30, 1.2],
    [-42, 82, -0.45],
    [35, 108, 0.15],
    [112, 56, -0.85],
    [142, -38, 0.55],
  ];

  houseSpots.forEach(([x, z, rotation], index) => {
    const house = createHouse(index);
    const hY = getLocalSurfaceHeightAt(x, z, radius, height, 0);
    house.position.set(x, hY + 0.2, z);
    house.rotation.y = rotation;
    group.add(house);
    // Foundation footprint is 39 x 33.
    addCollisionBox(new THREE.Vector3(x, hY, z), 19.5, 16.5, rotation, "House wall", { material: "wood" });
  });

  for (let i = 0; i < 28; i += 1) {
    const angle = i * 0.72 + Math.sin(i * 1.9) * 0.16;
    const distance = radius * (0.58 + (i % 7) * 0.045);
    const palm = createPalmTree(18 + (i % 4) * 2.8);
    const px = Math.cos(angle) * distance;
    const pz = Math.sin(angle) * distance;
    const pY = getLocalSurfaceHeightAt(px, pz, radius, height, 0);
    palm.position.set(px, pY + 0.1, pz);
    palm.rotation.y = angle + Math.PI / 2;
    group.add(palm);
    addCollisionCircle(new THREE.Vector3(px, pY, pz), 2.6, "Palm tree", { material: "wood", damage: 6 });
  }

  for (let i = 0; i < 34; i += 1) {
    const angle = i * 0.64 + Math.sin(i) * 0.2;
    const distance = radius * (0.52 + (i % 5) * 0.075);
    const rockSize = 7 + (i % 4) * 3;
    const rock = createRock(rockSize);
    const rx = Math.cos(angle) * distance;
    const rz = Math.sin(angle) * distance;
    const rY = getLocalSurfaceHeightAt(rx, rz, radius, height, 0);
    rock.position.set(rx, rY + 0.2, rz);
    rock.rotation.y = angle;
    group.add(rock);
    addCollisionCircle(new THREE.Vector3(rx, rY, rz), rockSize * 1.05, "Rock obstacle", { height: rockSize * (0.55 + rockSize * 0.03) * 0.9 });
  }

  // Ground cover is now the wind-blown grass field (26-wind-grass.js).


  for (let i = 0; i < 70; i += 1) {
    const angle = i * 2.31;
    const distance = radius * (0.18 + ((i * 29) % 62) / 100);
    const flowers = createFlowerPatch(i);
    const fx = Math.cos(angle) * distance;
    const fz = Math.sin(angle) * distance;
    const fY = getLocalSurfaceHeightAt(fx, fz, radius, height, 0);
    flowers.position.set(fx, fY + 0.45, fz);
    flowers.rotation.y = angle;
    group.add(flowers);
  }
}

function addStarterIslandDecorations(group, height) {
  addMarketStalls(group, height);
  addCratesAndBarrels(group, height);
  addGardenBeds(group, height);
  addFenceLines(group, height);
  addSignposts(group, height);
  addTrainingYard(group, height);
}

function addMarketStalls(group, height) {
  const spots = [
    [-24, 22, 0.18, 0xd94b37],
    [52, 34, -0.28, 0x1b85aa],
    [18, -18, 0.72, 0xf6b73c],
  ];

  spots.forEach(([x, z, rotation, color]) => {
    const stall = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: 0x7b5635, roughness: 0.88 });
    const cloth = new THREE.MeshStandardMaterial({ color, roughness: 0.7, side: THREE.DoubleSide });

    const table = new THREE.Mesh(new THREE.BoxGeometry(24, 4, 12), wood);
    table.position.y = 5;
    table.castShadow = true;
    stall.add(table);

    const awning = new THREE.Mesh(new THREE.BoxGeometry(28, 2, 16), cloth);
    awning.position.y = 18;
    awning.rotation.z = 0.08;
    awning.castShadow = true;
    stall.add(awning);

    for (let i = -1; i <= 1; i += 2) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 18, 7), wood);
      post.position.set(i * 10, 9, -5);
      post.castShadow = true;
      stall.add(post);
    }

    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    stall.position.set(x, hY + 0.3, z);
    stall.rotation.y = rotation;
    group.add(stall);
    addCollisionBox(new THREE.Vector3(x, hY, z), 12, 6.5, rotation, "Market stall", { material: "wood", height: 7 });
  });
}

function addCratesAndBarrels(group, height) {
  const wood = new THREE.MeshStandardMaterial({ color: 0x6f4a2e, roughness: 0.9 });
  const spots = [
    [-430, 82],
    [-414, 58],
    [-386, 92],
    [170, -72],
    [190, -56],
    [205, -94],
    [8, 286],
    [-18, 270],
  ];

  spots.forEach(([x, z], index) => {
    const item =
      index % 2 === 0
        ? new THREE.Mesh(new THREE.BoxGeometry(12, 12, 12), wood)
        : new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 13, 12), wood);
    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    item.position.set(x, hY + 6.5, z);
    item.rotation.y = index * 0.45;
    item.castShadow = true;
    item.receiveShadow = true;
    group.add(item);
    addCollisionCircle(new THREE.Vector3(x, hY, z), 8, "Supply stack");
  });
}

function addGardenBeds(group, height) {
  const soil = new THREE.MeshStandardMaterial({ color: 0x5b3a24, roughness: 0.96 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x2f9b55, roughness: 0.86 });
  const spots = [
    [-128, -64, 0.25],
    [-148, -104, -0.2],
    [92, 142, 0.55],
  ];

  spots.forEach(([x, z, rotation], bedIndex) => {
    const bed = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(46, 2.5, 18), soil);
    base.position.y = 1.4;
    base.receiveShadow = true;
    bed.add(base);

    for (let i = 0; i < 9; i += 1) {
      const plant = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 6), leaf);
      plant.position.set(-18 + i * 4.5, 4.2, Math.sin(i + bedIndex) * 4);
      plant.castShadow = true;
      bed.add(plant);
    }

    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    bed.position.set(x, hY + 0.5, z);
    bed.rotation.y = rotation;
    group.add(bed);
  });
}

function addFenceLines(group, height) {
  const wood = new THREE.MeshStandardMaterial({ color: 0x6f4a2e, roughness: 0.9 });
  const lines = [
    [-180, -10, 7, 0.35],
    [184, 122, 6, -0.55],
    [-58, 178, 5, 1.15],
  ];

  lines.forEach(([x, z, count, rotation]) => {
    const fence = new THREE.Group();
    for (let i = 0; i < count; i += 1) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 11, 7), wood);
      post.position.set(i * 13, 5.5, 0);
      post.castShadow = true;
      fence.add(post);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(count * 13, 2, 2), wood);
    rail.position.set((count * 13) / 2 - 6.5, 7.2, 0);
    rail.castShadow = true;
    fence.add(rail);

    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    fence.position.set(x, hY + 0.5, z);
    fence.rotation.y = rotation;
    group.add(fence);
    // Capsule along the posts (the fence runs along its local +x axis); low enough to hop over.
    const fenceEnd = new THREE.Vector3(x + Math.cos(rotation) * (count - 1) * 13, hY, z - Math.sin(rotation) * (count - 1) * 13);
    addCollisionSegment(new THREE.Vector3(x, hY, z), fenceEnd, 1.6, "Fence", { material: "wood", height: 9 });
  });
}

function addSignposts(group, height) {
  const wood = new THREE.MeshStandardMaterial({ color: 0x5b3823, roughness: 0.88 });
  const face = new THREE.MeshStandardMaterial({ color: 0xd8b36a, roughness: 0.82 });
  const spots = [
    [62, 16, 0.2],
    [-32, 132, -0.35],
    [-420, 28, 1.2],
  ];

  spots.forEach(([x, z, rotation]) => {
    const sign = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 18, 8), wood);
    post.position.y = 9;
    post.castShadow = true;
    sign.add(post);

    const board = new THREE.Mesh(new THREE.BoxGeometry(22, 10, 1.4), face);
    board.position.y = 18;
    board.castShadow = true;
    sign.add(board);

    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    sign.position.set(x, hY + 0.4, z);
    sign.rotation.y = rotation;
    group.add(sign);
    addCollisionCircle(new THREE.Vector3(x, hY, z), 2.2, "Signpost", { material: "wood" });
  });
}

function addTrainingYard(group, height) {
  const straw = new THREE.MeshStandardMaterial({ color: 0xc99b45, roughness: 0.95 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x5b3823, roughness: 0.88 });
  const yard = new THREE.Group();

  for (let i = 0; i < 4; i += 1) {
    const dummy = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.8, 18, 10), straw);
    body.position.y = 12;
    body.castShadow = true;
    dummy.add(body);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(22, 2.4, 2.4), wood);
    arm.position.y = 18;
    arm.castShadow = true;
    dummy.add(arm);

    // Post and footing: the straw body sits 3 units up, so it needs something to stand on.
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 5, 8), wood);
    post.position.y = 2;
    post.castShadow = true;
    dummy.add(post);
    const footing = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.4, 0.8, 12), wood);
    footing.position.y = 0.1;
    footing.receiveShadow = true;
    dummy.add(footing);

    dummy.position.set((i % 2) * 32, 0, Math.floor(i / 2) * 32);
    yard.add(dummy);
  }

  const hY = getLocalSurfaceHeightAt(224, 138, STARTER_RADIUS, height, 0);
  yard.position.set(208, hY + 0.3, 122);
  yard.rotation.y = -0.35;
  group.add(yard);
  // One collision per dummy (the yard is rotated by -0.35).
  const c = Math.cos(-0.35);
  const sn = Math.sin(-0.35);
  for (let i = 0; i < 4; i += 1) {
    const dx = (i % 2) * 32;
    const dz = Math.floor(i / 2) * 32;
    addCollisionCircle(new THREE.Vector3(208 + dx * c + dz * sn, hY, 122 - dx * sn + dz * c), 5.2, "Training dummy", { material: "wood", damage: 3 });
  }
}

function addLookoutArch(group, height) {
  const stone = new THREE.MeshStandardMaterial({ color: 0x77736b, roughness: 0.96, flatShading: true });
  const positions = [
    [-34, 0, 0],
    [34, 0, 0],
  ];

  const archY = getLocalSurfaceHeightAt(-242, 112, STARTER_RADIUS, height, 0);
  positions.forEach(([x, y, z]) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(6, 8, 38, 10), stone);
    pillar.position.set(-242 + x, archY + 19 + y, 112 + z);
    pillar.castShadow = true;
    group.add(pillar);
    addCollisionCircle(new THREE.Vector3(-242 + x, archY, 112 + z), 10, "Lookout arch");
  });

  const lintel = new THREE.Mesh(new THREE.BoxGeometry(86, 12, 18), stone);
  lintel.position.set(-242, archY + 41, 112);
  lintel.rotation.z = 0.08;
  lintel.castShadow = true;
  group.add(lintel);

  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 16),
    new THREE.MeshStandardMaterial({ color: 0xf6b73c, side: THREE.DoubleSide, roughness: 0.6 }),
  );
  flag.position.set(-198, archY + 52, 112);
  flag.rotation.y = -0.45;
  group.add(flag);
}

// Shade trees around the village (these spots used to hold lantern posts).
function addLanternsAndBanners(group, height) {
  const spots = [
    [-72, 38, 1.0],
    [-18, 92, 1.15],
    [54, 88, 0.95],
    [112, 22, 1.1],
    [54, -46, 1.05],
    [-44, -28, 0.9],
    [18, 150, 1.2],
    [156, 96, 1.0],
  ];

  spots.forEach(([x, z, scale], index) => {
    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    const tree = createVillageTree(scale, index);
    tree.position.set(x, hY + 0.1, z);
    tree.rotation.y = index * 1.37;
    group.add(tree);
    addCollisionCircle(new THREE.Vector3(x, hY, z), 2.6 * scale, "Tree", { material: "wood", damage: 6 });
  });
}

// Rounded broadleaf tree: tapered trunk with two limbs and a clustered canopy
// in three greens so it reads well from any angle.
const villageTreeMaterials = {
  bark: null,
  leaves: null,
};
function createVillageTree(scale = 1, seed = 0) {
  if (!villageTreeMaterials.bark) {
    villageTreeMaterials.bark = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.bark), roughness: 0.92 });
    villageTreeMaterials.leaves = WORLD_PALETTE.foliage.canopy.map((hex) =>
      new THREE.MeshStandardMaterial({ color: worldHex(hex), roughness: 0.85, flatShading: true }),
    );
  }
  const rand = (n) => {
    const v = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const tree = new THREE.Group();
  const trunkHeight = 15 * scale;

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.2 * scale, 2.1 * scale, trunkHeight, 9), villageTreeMaterials.bark);
  trunk.position.y = trunkHeight / 2;
  trunk.rotation.z = (rand(1) - 0.5) * 0.08;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  trunk.userData.surface = "bark";
  tree.add(trunk);

  // Root flare
  const roots = new THREE.Mesh(new THREE.CylinderGeometry(2.1 * scale, 3.2 * scale, 1.6 * scale, 9), villageTreeMaterials.bark);
  roots.position.y = 0.8 * scale;
  roots.userData.surface = "bark";
  tree.add(roots);

  for (let i = 0; i < 2; i += 1) {
    const limb = new THREE.Mesh(new THREE.CylinderGeometry(0.45 * scale, 0.8 * scale, 7 * scale, 6), villageTreeMaterials.bark);
    const side = i === 0 ? 1 : -1;
    limb.position.set(side * 2.2 * scale, trunkHeight * 0.78, (rand(2 + i) - 0.5) * 2 * scale);
    limb.rotation.z = -side * 0.75;
    limb.castShadow = true;
    limb.userData.surface = "bark";
    tree.add(limb);
  }

  const canopy = new THREE.Group();
  const clusters = [
    [0, 0, 0, 7.4],
    [4.6, -1.2, 1.4, 5.4],
    [-4.4, -0.8, -1.2, 5.6],
    [1.2, 2.8, -3.4, 5.0],
    [-1.4, 3.4, 3.0, 4.8],
    [0.4, 5.6, 0.2, 4.2],
  ];
  clusters.forEach(([cx, cy, cz, r], i) => {
    const leaf = new THREE.Mesh(
      new THREE.IcosahedronGeometry(r * scale * (0.9 + rand(10 + i) * 0.2), 1),
      villageTreeMaterials.leaves[i % villageTreeMaterials.leaves.length],
    );
    leaf.position.set(cx * scale, cy * scale, cz * scale);
    leaf.rotation.set(rand(20 + i) * 3, rand(30 + i) * 3, 0);
    leaf.scale.y = 0.85;
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    leaf.userData.surface = "foliage";
    canopy.add(leaf);
  });
  canopy.position.y = trunkHeight + 3.5 * scale;
  tree.add(canopy);
  animatedFoliage.push({ mesh: canopy, baseRotZ: 0, phase: seed * 0.9 });
  return tree;
}

function addShoreCrystals(group, radius, height) {
  const crystalColors = [0x7ce0b4, 0x9defff, 0xffd25a];
  for (let i = 0; i < 16; i += 1) {
    const angle = i * 1.37;
    const distance = radius * (0.68 + (i % 4) * 0.06);
    const crystal = new THREE.Mesh(
      new THREE.ConeGeometry(4 + (i % 3), 18 + (i % 5) * 3, 5),
      new THREE.MeshStandardMaterial({
        color: crystalColors[i % crystalColors.length],
        emissive: crystalColors[i % crystalColors.length],
        emissiveIntensity: 0.18,
        roughness: 0.38,
        transparent: true,
        opacity: 0.88,
      }),
    );
    const cx = Math.cos(angle) * distance;
    const cz = Math.sin(angle) * distance;
    const cY = getLocalSurfaceHeightAt(cx, cz, radius, height, 0);
    crystal.position.set(cx, cY + 9, cz);
    crystal.rotation.z = -0.18 + (i % 4) * 0.1;
    crystal.castShadow = true;
    group.add(crystal);
  }
}

function addBeachRing(group, radius, height, index = 0) {
  const beach = new THREE.Mesh(
    makeIrregularRingGeometry(radius * 0.76, radius * 0.98, 128, 21, height, index, radius),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.sand), roughness: 0.92, side: THREE.DoubleSide }),
  );
  beach.userData.surface = "sand";
  beach.userData.noSettle = true; // already follows the terrain
  beach.userData.groundCover = true; // no grass on the sand
  beach.rotation.x = -Math.PI / 2;
  beach.position.y = height;
  beach.receiveShadow = true;
  group.add(beach);

  const shallowWater = new THREE.Mesh(
    makeIrregularRingGeometry(radius * 0.98, radius * 1.12, 128, 34),
    new THREE.MeshStandardMaterial({
      color: worldHex(WORLD_PALETTE.sea.lagoon),
      transparent: true,
      opacity: 0.34,
      roughness: 0.25,
      side: THREE.DoubleSide,
    }),
  );
  shallowWater.rotation.x = -Math.PI / 2;
  shallowWater.position.y = 0.18;
  group.add(shallowWater);
  animatedWorldObjects.push({ mesh: shallowWater, type: "tide", baseY: shallowWater.position.y, speed: 0.0017, phase: radius * 0.01 });

  for (let i = 0; i < 3; i += 1) {
    const foam = new THREE.Mesh(
      makeIrregularRingGeometry(radius * (1.05 + i * 0.045), radius * (1.07 + i * 0.045), 128, 60 + i),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.13 - i * 0.025,
        side: THREE.DoubleSide,
      }),
    );
    foam.rotation.x = -Math.PI / 2;
    foam.position.y = 0.24 + i * 0.03;
    group.add(foam);
    animatedWorldObjects.push({ mesh: foam, type: "foam", speed: 0.00045 + i * 0.00012, phase: i * 1.7 });
  }
}

function addVillagePaths(group, height) {
  const material = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.path), roughness: 0.96 });
  const paths = [
    [0, 0, 310, 14, 0.25],
    [30, 48, 230, 12, 1.18],
    [-80, 36, 190, 11, -0.85],
    [110, 16, 170, 10, -0.35],
  ];

  paths.forEach(([x, z, length, width, rotation]) => {
    const path = new THREE.Mesh(new THREE.BoxGeometry(width, 0.35, length), material);
    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    path.userData.surface = "dirt";
    path.position.set(x, hY + 0.44, z);
    path.rotation.y = rotation;
    path.receiveShadow = true;
    group.add(path);
  });
}

function addVillagePlaza(group, height) {
  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(54, 48),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.plaza), roughness: 0.9 }),
  );
  plaza.userData.surface = "stone";
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(18, height + 0.5, 42);
  plaza.receiveShadow = true;
  group.add(plaza);

  const well = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 9, 7, 18),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.stone), roughness: 0.95 }),
  );
  well.userData.surface = "stone";
  well.position.set(18, height + 3.8, 42);
  well.castShadow = true;
  group.add(well);
  addCollisionCircle(new THREE.Vector3(18, height, 42), 12, "Stone well");

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(13, 9, 4),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.village.wellRoof), roughness: 0.8 }),
  );
  roof.position.set(18, height + 12.2, 42);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);
}

function addDock(group, radius, height) {
  const wood = new THREE.MeshStandardMaterial({ color: 0x7b5635, roughness: 0.9 });
  const pierY = getLocalSurfaceHeightAt(0, radius * 0.93, radius, height, 0);
  const pier = new THREE.Mesh(new THREE.BoxGeometry(32, 2.5, 170), wood);
  pier.position.set(0, pierY + 1.4, radius * 0.93);
  pier.castShadow = true;
  pier.receiveShadow = true;
  group.add(pier);

  for (let i = -3; i <= 3; i += 1) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.6, 18, 10), wood);
    const postX = i * 11;
    const postZ = radius * 0.78 + Math.abs(i % 2) * 35;
    const postY = getLocalSurfaceHeightAt(postX, postZ, radius, height, 0);
    post.position.set(postX, postY - 3, postZ);
    post.castShadow = true;
    group.add(post);
  }

  const boat = new THREE.Group();
  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(42, 8, 18),
    new THREE.MeshStandardMaterial({ color: 0x5a2f20, roughness: 0.86 }),
  );
  hull.position.y = 4;
  hull.castShadow = true;
  boat.add(hull);

  const sail = new THREE.Mesh(
    new THREE.ConeGeometry(15, 34, 3),
    new THREE.MeshStandardMaterial({ color: 0xfff1c7, roughness: 0.7, side: THREE.DoubleSide }),
  );
  sail.position.y = 28;
  sail.rotation.z = Math.PI / 2;
  boat.add(sail);

  boat.position.set(58, 1.2, radius * 1.08);
  boat.rotation.y = -0.35;
  group.add(boat);
}

function addPondAndWaterfall(group, radius, height) {
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x39b7c8,
    transparent: true,
    opacity: 0.78,
    roughness: 0.18,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const pondY = getLocalSurfaceHeightAt(-138, -72, radius, height, 0);
  const pond = new THREE.Mesh(makeIrregularDiscGeometry(54, 42, 51), waterMaterial);
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(-138, pondY + 0.62, -72);
  group.add(pond);

  const streamY = getLocalSurfaceHeightAt(-184, -176, radius, height, 0);
  const stream = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 185), waterMaterial);
  stream.position.set(-184, streamY + 0.65, -176);
  stream.rotation.y = -0.42;
  group.add(stream);

  const waterfallY = getLocalSurfaceHeightAt(-247, -288, radius, height, 0);
  const waterfall = new THREE.Mesh(
    new THREE.PlaneGeometry(58, 58, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x9defff, transparent: true, opacity: 0.68, side: THREE.DoubleSide }),
  );
  waterfall.position.set(-247, waterfallY - 13, -288);
  waterfall.rotation.y = -0.42;
  group.add(waterfall);

  for (let i = 0; i < 10; i += 1) {
    const mist = new THREE.Mesh(
      new THREE.SphereGeometry(3 + (i % 3), 10, 8),
      new THREE.MeshStandardMaterial({ color: 0xd6fbff, transparent: true, opacity: 0.32 }),
    );
    const mx = -230 + Math.sin(i) * 24;
    const mz = -306 + Math.cos(i * 2) * 18;
    const mY = getLocalSurfaceHeightAt(mx, mz, radius, height, 0);
    mist.position.set(mx, mY + 1 + (i % 4), mz);
    group.add(mist);
  }
}

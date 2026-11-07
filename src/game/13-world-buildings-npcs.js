
// ── 13-world-buildings-npcs.js ─ Houses, quest givers, trainers, teleporters and boats.
// ---- House geometry helpers (shapes are drawn flat, then stood up) ----
function roundedRectShape(width, depth, radius) {
  const w = width / 2;
  const d = depth / 2;
  const r = Math.min(radius, w, d);
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.absarc(w - r, -d + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(w, d - r);
  shape.absarc(w - r, d - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-w + r, d);
  shape.absarc(-w + r, d - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-w, -d + r);
  shape.absarc(-w + r, -d + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

// Extrudes a floor-plan shape upward by `height` (shape x/y -> world x/-z).
function extrudeUp(shape, height, curveSegments = 8) {
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false, curveSegments });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

// Door/window outline: a rectangle with a round arch on top, base at y = 0.
function archShape(width, height, x = 0, y = 0) {
  const r = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x - r, y);
  shape.lineTo(x + r, y);
  shape.lineTo(x + r, y + height - r);
  shape.absarc(x, y + height - r, r, 0, Math.PI, false);
  shape.lineTo(x - r, y);
  return shape;
}

// A frame around an arch: outer arch with the inner arch cut out.
function archFrameShape(width, height, border) {
  const shape = archShape(width + border * 2, height + border);
  shape.holes.push(archShape(width, height, 0, 0));
  return shape;
}

function flatPanel(shape, thickness) {
  return new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 12 });
}

// Shared so every window can glow together at night (see updateDayNightLighting).
const houseWindowGlass = new THREE.MeshStandardMaterial({
  color: 0xffe2b0,
  emissive: 0xffa040,
  emissiveIntensity: 0.05,
  roughness: 0.25,
  metalness: 0.1,
});

function createHouse(index) {
  const group = new THREE.Group();
  const palette = WORLD_PALETTE.village;
  const plasterHex = palette.walls[index % palette.walls.length];
  const roofHex = palette.roofs[index % palette.roofs.length];
  const trimHex = palette.trims[index % palette.trims.length];

  const mat = (hex, roughness, surface, extra = {}) => {
    const m = new THREE.MeshStandardMaterial({ color: worldHex(hex), roughness, ...extra });
    m.userData.surface = surface;
    return m;
  };
  const plaster = mat(plasterHex, 0.9, "plaster");
  const timber = mat(palette.timber, 0.85, "wood");
  const stone = mat(palette.foundation, 0.94, "stone");
  const roofMat = mat(roofHex, 0.78, "tiles", { side: THREE.DoubleSide });
  const trim = mat(trimHex, 0.7, "wood");

  const add = (mesh, surface, castShadow = true) => {
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    if (surface) mesh.userData.surface = surface;
    group.add(mesh);
    return mesh;
  };

  const FOUND_H = 4;
  const WALL_W = 34;
  const WALL_D = 28;
  const WALL_H = 20;
  const WALL_TOP = FOUND_H + WALL_H;
  const FRONT = WALL_D / 2;

  // Stone plinth and plastered walls, both with rounded corners.
  add(new THREE.Mesh(extrudeUp(roundedRectShape(38, 32, 3.2), FOUND_H), stone), "stone");
  const walls = add(new THREE.Mesh(extrudeUp(roundedRectShape(WALL_W, WALL_D, 2.6), WALL_H, 10), plaster), "plaster");
  walls.position.y = FOUND_H;

  // Timber corner posts wrap the rounded corners; a beam belts the walls.
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const post = add(new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, WALL_H, 10), timber), "wood");
    post.position.set(sx * (WALL_W / 2 - 1.6), FOUND_H + WALL_H / 2, sz * (WALL_D / 2 - 1.6));
  });
  [FRONT + 0.25, -FRONT - 0.25].forEach((z) => {
    const beam = add(new THREE.Mesh(new THREE.BoxGeometry(WALL_W - 4, 1.2, 0.8), timber), "wood");
    beam.position.set(0, FOUND_H + 12.5, z);
    const sill = add(new THREE.Mesh(new THREE.BoxGeometry(WALL_W - 4, 1.0, 0.8), timber), "wood");
    sill.position.set(0, WALL_TOP - 0.5, z);
  });
  [WALL_W / 2 + 0.25, -WALL_W / 2 - 0.25].forEach((x) => {
    const beam = add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, WALL_D - 4), timber), "wood");
    beam.position.set(x, FOUND_H + 12.5, 0);
  });

  // Curved gable roof: slopes sweep outward at the eaves.
  const SPAN = WALL_W / 2 + 3.5;
  const RIDGE = 15 + (index % 2) * 2;
  const T = 1.4;
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-SPAN, -0.6);
  roofShape.quadraticCurveTo(-SPAN * 0.42, RIDGE * 0.32, 0, RIDGE);
  roofShape.quadraticCurveTo(SPAN * 0.42, RIDGE * 0.32, SPAN, -0.6);
  roofShape.lineTo(SPAN - 0.4, -0.6 - T);
  roofShape.quadraticCurveTo(SPAN * 0.42, RIDGE * 0.32 - T * 1.5, 0, RIDGE - T * 1.6);
  roofShape.quadraticCurveTo(-SPAN * 0.42, RIDGE * 0.32 - T * 1.5, -SPAN + 0.4, -0.6 - T);
  roofShape.lineTo(-SPAN, -0.6);
  const ROOF_D = WALL_D + 7;
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: ROOF_D, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.4, bevelSegments: 2, curveSegments: 18 });
  roofGeo.translate(0, 0, -ROOF_D / 2);
  const roof = add(new THREE.Mesh(roofGeo, roofMat), "tiles");
  roof.position.y = WALL_TOP + 0.4;

  // Ridge cap
  const ridge = add(new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, ROOF_D + 1, 10), mat(palette.ridge, 0.7, "tiles")), "tiles");
  ridge.rotation.x = Math.PI / 2;
  ridge.position.set(0, WALL_TOP + RIDGE - 0.4, 0);

  // Gable walls fill the space under the curved roof at each end.
  const gableShape = new THREE.Shape();
  const GW = WALL_W / 2 - 0.6;
  gableShape.moveTo(-GW, 0);
  gableShape.quadraticCurveTo(-GW * 0.42, RIDGE * 0.3 - 1.6, 0, RIDGE - 2.2);
  gableShape.quadraticCurveTo(GW * 0.42, RIDGE * 0.3 - 1.6, GW, 0);
  gableShape.lineTo(-GW, 0);
  [FRONT - 0.6, -FRONT - 0.2].forEach((z) => {
    const gable = add(new THREE.Mesh(flatPanel(gableShape, 0.8), plaster), "plaster");
    gable.position.set(0, WALL_TOP, z);
  });

  // Round attic window in the front gable.
  const oculusFrame = new THREE.Shape();
  oculusFrame.absarc(0, 0, 2.6, 0, Math.PI * 2, false);
  const oculusHole = new THREE.Path();
  oculusHole.absarc(0, 0, 1.8, 0, Math.PI * 2, true);
  oculusFrame.holes.push(oculusHole);
  const oculus = add(new THREE.Mesh(flatPanel(oculusFrame, 0.7), trim), "wood");
  oculus.position.set(0, WALL_TOP + RIDGE * 0.42, FRONT + 0.1);
  const oculusGlass = new THREE.Mesh(new THREE.CircleGeometry(1.85, 20), houseWindowGlass);
  oculusGlass.position.set(0, WALL_TOP + RIDGE * 0.42, FRONT + 0.35);
  oculusGlass.userData.noSurface = true;
  group.add(oculusGlass);

  // Arched door with a stone surround and rounded steps.
  const door = add(new THREE.Mesh(flatPanel(archShape(8, 13.5), 0.8), timber), "wood");
  door.position.set(0, FOUND_H, FRONT - 0.2);
  const doorFrame = add(new THREE.Mesh(flatPanel(archFrameShape(8, 13.5, 1.3), 1.2), stone), "stone");
  doorFrame.position.set(0, FOUND_H, FRONT - 0.1);
  const knob = add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), mat(0xc9a24a, 0.35, "metal", { metalness: 0.7 })), null, false);
  knob.position.set(2.6, FOUND_H + 6.2, FRONT + 0.85);
  [[7.2, 1.9, 1.0], [5.6, 1.9, 2.9]].forEach(([radius, h, y]) => {
    const step = add(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius + 0.3, h, 24, 1, false, -Math.PI / 2, Math.PI), stone), "stone");
    step.position.set(0, y, FRONT + 2.4);
  });

  // Porch lantern beside the door (glows at night).
  const lamp = add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 2, 1.4), new THREE.MeshStandardMaterial({ color: 0xffd25a, emissive: 0xffa832, emissiveIntensity: 0.1 })), null, false);
  lamp.position.set(6.4, FOUND_H + 11.5, FRONT + 1.2);
  lamp.userData.noSurface = true;
  const lampArm = add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 1.6), timber), "wood", false);
  lampArm.position.set(6.4, FOUND_H + 12.7, FRONT + 0.6);

  // Arched windows with flower boxes.
  const flowerHexes = [0xe2566b, 0xf4b740, 0xf3f0e6, 0xb07ad6];
  const addWindow = (x, z, rotY, withFlowers) => {
    const win = new THREE.Group();
    const frame = new THREE.Mesh(flatPanel(archFrameShape(5.6, 8, 0.9), 0.9), trim);
    frame.castShadow = true;
    frame.userData.surface = "wood";
    win.add(frame);
    const glass = new THREE.Mesh(flatPanel(archShape(5.6, 8), 0.3), houseWindowGlass);
    glass.userData.noSurface = true;
    win.add(glass);
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.45, 8, 0.9), trim);
    mullion.position.set(0, 4, 0.3);
    win.add(mullion);
    const transom = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.45, 0.9), trim);
    transom.position.set(0, 4.2, 0.3);
    win.add(transom);
    if (withFlowers) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.6, 2), timber);
      box.position.set(0, -0.9, 1.1);
      box.castShadow = true;
      box.userData.surface = "wood";
      win.add(box);
      for (let i = 0; i < 6; i += 1) {
        const bloom = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.75, 0),
          new THREE.MeshStandardMaterial({ color: worldHex(i % 2 ? WORLD_PALETTE.foliage.tuft : flowerHexes[(index + i) % flowerHexes.length]), roughness: 0.8, flatShading: true }),
        );
        bloom.position.set(-3 + i * 1.2, 0.3, 1.2 + (i % 2) * 0.3);
        win.add(bloom);
      }
    }
    win.position.set(x, FOUND_H + 6.5, z);
    win.rotation.y = rotY;
    group.add(win);
  };
  addWindow(-10.5, FRONT - 0.15, 0, true);
  addWindow(10.5, FRONT - 0.15, 0, true);
  addWindow(-8, -FRONT + 0.15, Math.PI, false);
  addWindow(8, -FRONT + 0.15, Math.PI, false);
  addWindow(WALL_W / 2 - 0.15, 0, Math.PI / 2, true);
  addWindow(-WALL_W / 2 + 0.15, 4, -Math.PI / 2, false);

  // Stone chimney with a cap.
  const chimney = add(new THREE.Mesh(new THREE.BoxGeometry(4.4, 15, 4.4), stone), "stone");
  chimney.position.set(9.5, WALL_TOP + 7.5, -5);
  const cap = add(new THREE.Mesh(new THREE.BoxGeometry(5.6, 1, 5.6), stone), "stone");
  cap.position.set(9.5, WALL_TOP + 15.2, -5);

  // Every other cottage gets a round corner turret with a bell-curved roof.
  if (index % 2 === 0) {
    const TX = -WALL_W / 2 + 2.6;
    const TZ = -WALL_D / 2 + 2.6;
    const TR = 5.6;
    const TH = WALL_H + 7;
    const tower = add(new THREE.Mesh(new THREE.CylinderGeometry(TR, TR + 0.3, TH, 24), plaster), "plaster");
    tower.position.set(TX, FOUND_H + TH / 2, TZ);
    const band = add(new THREE.Mesh(new THREE.CylinderGeometry(TR + 0.35, TR + 0.35, 1.2, 24), timber), "wood");
    band.position.set(TX, FOUND_H + 12.5, TZ);
    const profile = [];
    for (let i = 0; i <= 14; i += 1) {
      const t = i / 14;
      profile.push(new THREE.Vector2((TR + 1.8) * Math.pow(1 - t, 1.7) + 0.05, t * 13));
    }
    const spire = add(new THREE.Mesh(new THREE.LatheGeometry(profile, 24), roofMat), "tiles");
    spire.position.set(TX, FOUND_H + TH - 0.2, TZ);
    const finial = add(new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 8), mat(0xc9a24a, 0.35, "metal", { metalness: 0.7 })), null, false);
    finial.position.set(TX, FOUND_H + TH + 13.2, TZ);
    // Turret window faces outward from the corner.
    const turretWin = new THREE.Group();
    const tFrame = new THREE.Mesh(flatPanel(archFrameShape(3.2, 5.4, 0.7), 0.7), trim);
    const tGlass = new THREE.Mesh(flatPanel(archShape(3.2, 5.4), 0.3), houseWindowGlass);
    tGlass.userData.noSurface = true;
    turretWin.add(tFrame, tGlass);
    const outward = Math.atan2(TX, TZ);
    turretWin.position.set(TX + Math.sin(outward) * (TR - 0.1), FOUND_H + 17, TZ + Math.cos(outward) * (TR - 0.1));
    turretWin.rotation.y = outward;
    group.add(turretWin);
  }

  group.scale.setScalar(0.94 + (index % 3) * 0.05);
  return group;
}

function createRock(size) {
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(size, 1),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.rock), roughness: 0.98, flatShading: true }),
  );
  rock.scale.set(1.25, 0.55 + size * 0.03, 0.9);
  rock.castShadow = true;
  rock.receiveShadow = true;
  return rock;
}

function createGrassTuft(size) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.tuft), roughness: 0.95, side: THREE.DoubleSide });
  for (let i = 0; i < 5; i += 1) {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.9, size * 2.8, 5), material);
    blade.position.y = size * 1.3;
    blade.rotation.z = -0.25 + i * 0.12;
    blade.rotation.y = i * 1.25;
    blade.castShadow = true;
    group.add(blade);
  }
  return group;
}

function createQuestGiver(position) {
  const giver = new THREE.Group();
  giver.position.copy(position);

  const body = createHumanAvatarModel(
    {
      name: "Quest Giver",
      skin: "#d49a6a",
      shirt: "#f6b73c",
      pants: "#58412c",
      hair: "#6b3b1f",
      eyes: "#27313a",
      boots: "#2d1c12",
      hairStyle: "cap",
      outfit: "coat",
      height: 102,
      build: 96,
    },
    { showSword: false, showName: false },
  );
  giver.add(body);

  const marker = makeLabel("Quest", 1.5);
  marker.position.y = 14.2;
  giver.add(marker);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(5.4, 0.4, 12, 80),
    new THREE.MeshBasicMaterial({ color: 0xffd25a, transparent: true, opacity: 0.88 }),
  );
  ring.position.y = 13.2;
  ring.rotation.x = Math.PI / 2;
  giver.add(ring);
  animatedWorldObjects.push({ mesh: ring, type: "questRing", speed: 0.01, phase: position.x * 0.02 });

  scene.add(giver);
  questGiverPosition.copy(position);
  interactables.push({
    type: "quest",
    mesh: giver,
    prompt: "Press E: Take quest - defeat 5 bandits",
  });
}

function createTeleporter(position, destination, isDirect = false) {
  const teleporter = new THREE.Group();
  teleporter.position.copy(position);

  // Auto-detect destination island
  let destIslandName = "Unknown Island";
  let requiredLevel = 1;

  if (islands.length > 0) {
    let bestDist = Infinity;
    let bestIdx = 0;
    for (let i = 0; i < Math.min(5, islands.length); i++) {
      const dist = destination.distanceTo(islands[i].position);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    if (bestIdx === 0) {
      destIslandName = "Starter Island";
      requiredLevel = 1;
    } else if (bestIdx === 1) {
      destIslandName = "Jungle Island";
      requiredLevel = 15;
    } else if (bestIdx === 2) {
      destIslandName = "Pirate Town";
      requiredLevel = 1;
    } else if (bestIdx === 3) {
      destIslandName = "Desert Island";
      requiredLevel = 60;
    } else if (bestIdx === 4) {
      destIslandName = "Snowy Village";
      requiredLevel = 85;
    }
  }

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(18, 22, 4, 40),
    new THREE.MeshStandardMaterial({ color: 0x22486b, roughness: 0.35, metalness: 0.25 }),
  );
  base.position.y = 2;
  base.castShadow = true;
  base.receiveShadow = true;
  teleporter.add(base);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(14, 1.2, 14, 96),
    new THREE.MeshBasicMaterial({ color: isDirect ? 0xd1a65c : 0x7ce0b4, transparent: true, opacity: 0.82 }),
  );
  ring.position.y = 11;
  ring.rotation.x = Math.PI / 2;
  teleporter.add(ring);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 34, 32),
    new THREE.MeshBasicMaterial({ color: isDirect ? 0xd1a65c : 0x7ce0b4, transparent: true, opacity: 0.22 }),
  );
  beam.position.y = 18;
  teleporter.add(beam);

  const label = makeLabel(isDirect ? `To ${destIslandName}` : "Teleporter", 1.15);
  label.position.y = 39;
  teleporter.add(label);

  teleporter.userData.settleOn = true; // grounded by settleIslandObjects
  scene.add(teleporter);
  animatedWorldObjects.push({ mesh: ring, type: "teleporter", speed: 0.022, phase: position.x * 0.01 });
  animatedWorldObjects.push({ mesh: beam, type: "teleporterBeam", baseY: beam.position.y, speed: 0.003, phase: position.z * 0.01 });
  interactables.push({
    type: isDirect ? "teleporter" : "menuTeleporter",
    mesh: teleporter,
    destination,
    destIslandName,
    requiredLevel,
    prompt: isDirect ? `Press E: Teleport to ${destIslandName}` : "Press E: Open Teleporter Menu",
  });
  addCollisionCircle(position, 12, "Teleporter base", { damage: 0 });
}

function createBoatDealer(position) {
  const dealer = new THREE.Group();
  dealer.position.copy(position);

  const body = createHumanAvatarModel(
    {
      name: "Boat Dealer",
      skin: "#f4c58d",
      shirt: "#2e7a9d",
      pants: "#2d3848",
      hair: "#1c1b1d",
      eyes: "#1a1a1a",
      boots: "#1a1816",
      hairStyle: "short",
      outfit: "sailor",
      height: 100,
      build: 98,
    },
    { showSword: false, showName: false },
  );
  dealer.add(body);

  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(14, 6, 0.8),
    new THREE.MeshStandardMaterial({ color: 0xffd25a, emissive: 0x8a5a0f, roughness: 0.5 }),
  );
  sign.position.set(0, 13.7, 0);
  dealer.add(sign);

  const signLabel = makeLabel("Boat Shop", 0.9);
  signLabel.position.set(0, 15.2, 0.8);
  dealer.add(signLabel);

  scene.add(dealer);
  interactables.push({
    type: "boat",
    mesh: dealer,
    prompt: "Press E: Choose your boat",
  });
}

function createSwordDealer(position) {
  const dealer = new THREE.Group();
  dealer.position.copy(position);

  const body = createHumanAvatarModel(
    {
      name: "Sword Dealer",
      skin: "#d9b384",
      shirt: "#7c3f25",
      pants: "#2a2f34",
      hair: "#211a16",
      eyes: "#111111",
      boots: "#2a1816",
      hairStyle: "short",
      outfit: "armor",
      height: 102,
      build: 104,
    },
    { showSword: false, showName: false },
  );
  dealer.add(body);

  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(14, 6, 0.8),
    new THREE.MeshStandardMaterial({ color: 0xc84f33, emissive: 0x8a1f0b, roughness: 0.5 }),
  );
  sign.position.set(0, 13.7, 0);
  dealer.add(sign);

  const signLabel = makeLabel("Sword Shop", 0.9);
  signLabel.position.set(0, 15.2, 0.8);
  dealer.add(signLabel);

  scene.add(dealer);
  interactables.push({
    type: "sword",
    mesh: dealer,
    prompt: "Press E: Buy a sword",
  });
}

function createOutpostQuestGiver(position) {
  const giver = new THREE.Group();
  giver.position.copy(position);
  giver.add(createHumanAvatarModel({
    name: "Pirate Town Captain",
    skin: "#c98b62",
    shirt: "#3d5f72",
    pants: "#2b2624",
    hair: "#3a2118",
    eyes: "#101820",
    boots: "#24160e",
    hairStyle: "cap",
    outfit: "coat",
    height: 106,
    build: 108,
  }, { showSword: true, showName: false }));
  const label = makeLabel("Pirate Town Quests", 1.25);
  label.position.y = 15;
  giver.add(label);
  scene.add(giver);
  interactables.push({
    type: "questHub",
    mesh: giver,
    hubType: "pirateTown",
    prompt: "Press E: View Pirate Town quests",
  });
}

function createJungleQuestGiver(position) {
  const giver = new THREE.Group();
  giver.position.copy(position);
  giver.add(createHumanAvatarModel({
    name: "Jungle Quest Giver",
    skin: "#d9ab7e",
    shirt: "#16503c",
    pants: "#254428",
    hair: "#2b1c11",
    eyes: "#0a0a0a",
    boots: "#3a2512",
    hairStyle: "messy",
    outfit: "sailor",
    height: 100,
    build: 90,
  }, { showSword: false, showName: false }));

  const label = makeLabel("Jungle Quest Giver", 0.9);
  label.position.y = 14;
  giver.add(label);

  scene.add(giver);

  interactables.push({
    type: "questHub",
    mesh: giver,
    hubType: "jungle",
    prompt: "Press E: View Jungle quests",
  });
}

function createJunglePulseTrainer(position) {
  const trainer = new THREE.Group();
  trainer.position.copy(position);
  trainer.add(createHumanAvatarModel({
    name: "Jungle Pulse Trainer",
    skin: "#e5c59e",
    shirt: "#7a378b",
    pants: "#3f2048",
    hair: "#fbc531",
    eyes: "#0d0d0d",
    boots: "#1d0c24",
    hairStyle: "cap",
    outfit: "adventurer",
    height: 108,
    build: 95,
  }, { showSword: false, showName: false }));

  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(5.5, 0.2, 8, 42),
    new THREE.MeshBasicMaterial({ color: 0x8e44ad, transparent: true, opacity: 0.8 }),
  );
  aura.position.y = 2;
  aura.rotation.x = Math.PI / 2;
  trainer.add(aura);

  const label = makeLabel("Jungle Pulse Trainer", 1);
  label.position.y = 15;
  trainer.add(label);

  scene.add(trainer);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.018, phase: 1.5 });

  interactables.push({
    type: "junglePulseTrainer",
    mesh: trainer,
    prompt: "Press E: Learn Jungle Pulse",
  });
}

function createDesertQuestGiver(position) {
  const giver = new THREE.Group();
  giver.position.copy(position);
  giver.add(createHumanAvatarModel({
    name: "Desert Quest Giver",
    skin: "#eed2b8",
    shirt: "#b8860b",
    pants: "#8b6508",
    hair: "#3a2512",
    eyes: "#111111",
    boots: "#4a3319",
    hairStyle: "short",
    outfit: "adventurer",
    height: 102,
    build: 105,
  }, { showSword: false, showName: false }));

  const label = makeLabel("Desert Quest Giver", 0.9);
  label.position.y = 14;
  giver.add(label);

  scene.add(giver);

  interactables.push({
    type: "questHub",
    mesh: giver,
    hubType: "desert",
    prompt: "Press E: View Desert quests",
  });
}

function createSnowyQuestGiver(position) {
  const giver = new THREE.Group();
  giver.position.copy(position);
  giver.add(createHumanAvatarModel({
    name: "Snowy Quest Giver",
    skin: "#f0e0d0",
    shirt: "#a8c8e8",
    pants: "#4a5f78",
    hair: "#e8e8f0",
    eyes: "#1a3a5c",
    boots: "#2a3a4a",
    hairStyle: "short",
    outfit: "adventurer",
    height: 104,
    build: 100,
  }, { showSword: false, showName: false }));

  // Snowflake aura ring
  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(5.5, 0.18, 8, 42),
    new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.7 }),
  );
  aura.position.y = 2;
  aura.rotation.x = Math.PI / 2;
  giver.add(aura);

  const label = makeLabel("Snowy Quest Giver", 0.9);
  label.position.y = 15;
  giver.add(label);

  scene.add(giver);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.014, phase: 0.8 });

  interactables.push({
    type: "questHub",
    mesh: giver,
    hubType: "snowy",
    prompt: "Press E: View Snowy Village quests",
  });
}

function createObservationHakiTrainer(position) {
  const trainer = new THREE.Group();
  trainer.position.copy(position);
  trainer.add(createHumanAvatarModel({
    name: "Foresight Master",
    skin: "#d8c2aa",
    shirt: "#771d1d",     // Crimson monk robe
    pants: "#1c1c1c",
    hair: "#ffffff",      // White hair
    eyes: "#ff2222",      // Red eyes / awakened perception
    boots: "#3a2618",
    hairStyle: "messy",
    outfit: "coat",
    height: 110,
    build: 102,
  }, { showSword: false, showName: false }));

  // Glowing red Foresight aura ring
  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(5.2, 0.22, 8, 42),
    new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.8 }),
  );
  aura.position.y = 2;
  aura.rotation.x = Math.PI / 2;
  trainer.add(aura);

  // Floating Foresight eye marker above head
  const eyeMarker = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xff4444 })
  );
  eyeMarker.position.y = 16.5;
  eyeMarker.scale.set(1.4, 0.7, 1);
  trainer.add(eyeMarker);

  const label = makeLabel("Foresight Master", 1.0);
  label.position.y = 19;
  trainer.add(label);

  scene.add(trainer);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.02, phase: 0.5 });
  animatedWorldObjects.push({ mesh: eyeMarker, type: "teleporterBeam", baseY: 16.5, speed: 0.003, phase: 0 });

  interactables.push({
    type: "observationTrainer",
    mesh: trainer,
    prompt: "Press E: Train Foresight",
  });
}

function showObservationHakiDialog() {
  if (!dialoguePanel || !questOptions) return;
  dialoguePanel.classList.remove("hidden");
  dialogueTitle.textContent = "👁️ Foresight Master";
  questOptions.innerHTML = "";

  if (player.observationHaki && player.observationHaki.unlocked) {
    dialogueDetail.textContent = `You have already awakened Foresight! Press K to toggle it ON/OFF. While active, you can automatically dodge up to 5 attacks and sense all nearby threats.`;
  } else {
    dialogueDetail.textContent = `"In the biting blizzard, eyesight fails... but true masters see with their spirit. I can teach you Foresight for $7,500 Doubloons. (Requires Level 80+)."`;
  }

  if (!player.observationHaki || !player.observationHaki.unlocked) {
    const buyBtn = document.createElement("button");
    buyBtn.type = "button";
    buyBtn.className = "quest-option";
    buyBtn.innerHTML = `<strong>👁️ Learn Foresight</strong><span>Awaken Foresight (K key) to auto-dodge 5 attacks and reveal threats through walls.</span><small>Cost: $7,500 Doubloons (Requires Lv 80)</small>`;
    buyBtn.addEventListener("click", () => purchaseObservationHaki());
    questOptions.append(buyBtn);
  }

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "quest-option danger-button";
  closeBtn.style.background = "rgba(235, 94, 85, 0.15)";
  closeBtn.style.borderColor = "rgba(235, 94, 85, 0.3)";
  closeBtn.style.color = "#eb5e55";
  closeBtn.innerHTML = "<strong>Leave</strong><span>Close this menu</span>";
  closeBtn.addEventListener("click", () => { dialoguePanel.classList.add("hidden"); });
  questOptions.append(closeBtn);
}

function purchaseObservationHaki() {
  if (player.observationHaki && player.observationHaki.unlocked) {
    log("You have already mastered Foresight! Press K to toggle.");
    return;
  }
  if (player.level < 80) {
    log("Foresight Master: \"Your spirit is still unfocused. Come back at Level 80.\"");
    return;
  }
  const cost = 7500;
  if (player.money < cost) {
    log(`Foresight Master: "You need $${cost} Doubloons to undergo this training."`);
    return;
  }

  player.money -= cost;
  player.observationHaki.unlocked = true;
  player.observationHaki.active = true;
  player.observationHaki.dodges = 5;
  player.observationHaki.maxDodges = 5;
  dialoguePanel.classList.add("hidden");
  updateHud();
  saveGame();

  audio.playObservation();
  audio.playQuestComplete();

  // Pulse effect
  const pulseRing = new THREE.Mesh(
    new THREE.TorusGeometry(6, 0.2, 8, 48),
    new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.85 })
  );
  pulseRing.position.copy(playerMesh.position).add(new THREE.Vector3(0, 2, 0));
  pulseRing.rotation.x = Math.PI / 2;
  scene.add(pulseRing);
  addTimedEffect(pulseRing, 0.6, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 10);
    mesh.material.opacity = 0.85 * (1 - progress);
  });

  createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 14, 0)), "👁️ FORESIGHT AWAKENED!", "#ff3333");
  log("👁️ You have learned Foresight! Press K to toggle ON/OFF. Automatically evades up to 5 attacks and detects enemy vitals.");
}

function createFlashStepTrainer(position) {
  const trainer = new THREE.Group();
  trainer.position.copy(position);
  trainer.add(createHumanAvatarModel({
    name: "Flash Step Master",
    skin: "#eed2b8",
    shirt: "#0d3b66",     // Midnight navy shinobi gi
    pants: "#14213d",
    hair: "#48cae4",      // Cyan streak hair
    eyes: "#00b4d8",
    boots: "#03045e",
    hairStyle: "spiky",
    outfit: "adventurer",
    height: 106,
    build: 96,
  }, { showSword: false, showName: false }));

  // Glowing cyan speed ring
  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(5.2, 0.22, 8, 42),
    new THREE.MeshBasicMaterial({ color: 0x66ddff, transparent: true, opacity: 0.8 }),
  );
  aura.position.y = 2;
  aura.rotation.x = Math.PI / 2;
  trainer.add(aura);

  const label = makeLabel("Flash Step Master", 1.0);
  label.position.y = 16;
  trainer.add(label);

  scene.add(trainer);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.03, phase: 1.2 });

  interactables.push({
    type: "flashStepTrainer",
    mesh: trainer,
    prompt: "Press E: Train Flash Step",
  });
}

function showFlashStepDialog() {
  if (!dialoguePanel || !questOptions) return;
  dialoguePanel.classList.remove("hidden");
  dialogueTitle.textContent = "⚡ Flash Step Master";
  questOptions.innerHTML = "";

  if (player.hasFlashStep) {
    dialogueDetail.textContent = "You have already mastered Flash Step! Press T to instantly vanish and teleport directly to where you are pointing with your cursor.";
  } else {
    dialogueDetail.textContent = `"By kicking the snow a dozen times in a fraction of a second, one can vanish before the eye can track. I will teach you the ancient Flash Step for $5,000 Doubloons. (Requires Level 75+)."`;
  }

  if (!player.hasFlashStep) {
    const buyBtn = document.createElement("button");
    buyBtn.type = "button";
    buyBtn.className = "quest-option";
    buyBtn.innerHTML = `<strong>⚡ Learn Flash Step</strong><span>Unlocks T key to instantly teleport directly to where your cursor points.</span><small>Cost: $5,000 Doubloons (Requires Lv 75)</small>`;
    buyBtn.addEventListener("click", () => purchaseFlashStep());
    questOptions.append(buyBtn);
  }

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "quest-option danger-button";
  closeBtn.style.background = "rgba(235, 94, 85, 0.15)";
  closeBtn.style.borderColor = "rgba(235, 94, 85, 0.3)";
  closeBtn.style.color = "#eb5e55";
  closeBtn.innerHTML = "<strong>Leave</strong><span>Close this menu</span>";
  closeBtn.addEventListener("click", () => { dialoguePanel.classList.add("hidden"); });
  questOptions.append(closeBtn);
}

function purchaseFlashStep() {
  if (player.hasFlashStep) {
    log("You have already mastered Flash Step! Press T to use it.");
    return;
  }
  if (player.level < 75) {
    log("Flash Step Master: \"Your legs aren't fast enough yet, rookie. Come back at Level 75.\"");
    return;
  }
  const cost = 5000;
  if (player.money < cost) {
    log(`Flash Step Master: "You need $${cost} Doubloons to master Flash Step."`);
    return;
  }

  player.money -= cost;
  player.hasFlashStep = true;
  dialoguePanel.classList.add("hidden");
  updateHud();
  saveGame();

  audio.playFlashStep();
  audio.playFanfare();

  createFlashStepAfterimage(playerMesh.position.clone());
  createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 14, 0)), "⚡ FLASH STEP UNLOCKED!", "#66ddff");
  log("⚡ You have learned Flash Step! Press T to burst forward with sonic speed.");
}

function updateObservationVision(dt) {
  if (!player.observationHaki || !player.observationHaki.active) {
    enemies.forEach(e => {
      if (e.obsMarker) e.obsMarker.visible = false;
    });
    return;
  }

  // Periodic subtle radar pulse
  if (!updateObservationVision.lastPulse || performance.now() - updateObservationVision.lastPulse > 1800) {
    updateObservationVision.lastPulse = performance.now();
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.14, 6, 36),
      new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.45 })
    );
    ring.position.copy(playerMesh.position).add(new THREE.Vector3(0, 1.2, 0));
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    addTimedEffect(ring, 0.85, (mesh, progress) => {
      mesh.scale.setScalar(1 + progress * 7.5);
      mesh.material.opacity = 0.45 * (1 - progress);
    });
  }

  // Highlight all nearby enemies
  enemies.forEach(e => {
    if (!e.alive) {
      if (e.obsMarker) e.obsMarker.visible = false;
      return;
    }
    const dist = e.mesh.position.distanceTo(playerMesh.position);
    if (dist <= 260) {
      if (!e.obsMarker) {
        const marker = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.3, 0),
          new THREE.MeshBasicMaterial({ color: 0xff3333, wireframe: true })
        );
        marker.position.set(0, 14.5, 0);
        e.mesh.add(marker);
        e.obsMarker = marker;
      }
      e.obsMarker.visible = true;
      e.obsMarker.rotation.y += dt * 3.5;
    } else {
      if (e.obsMarker) e.obsMarker.visible = false;
    }
  });
}

function createBlackLegDojo(position) {
  const group = new THREE.Group();
  group.position.copy(position);

  // === Cave structure ===
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x2a2218,
    roughness: 0.95,
    metalness: 0.05,
    flatShading: true,
  });

  // Back wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(28, 18, 2.5), rockMat);
  backWall.position.set(0, 9, -12);
  group.add(backWall);

  // Left wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2.5, 18, 24), rockMat);
  leftWall.position.set(-12, 9, -2);
  group.add(leftWall);

  // Right wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2.5, 18, 24), rockMat);
  rightWall.position.set(12, 9, -2);
  group.add(rightWall);

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(28, 2.5, 24), rockMat);
  ceiling.position.set(0, 18, -2);
  group.add(ceiling);

  // Cave floor (darker stone)
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1610, roughness: 0.98 });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(24, 0.5, 22), floorMat);
  floor.position.set(0, 0.25, -2);
  group.add(floor);

  // Entrance arch frame (left & right pillars)
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x3a3020, roughness: 0.9, flatShading: true });
  const pillarL = new THREE.Mesh(new THREE.BoxGeometry(3, 16, 3), pillarMat);
  pillarL.position.set(-11, 8, 10);
  group.add(pillarL);
  const pillarR = new THREE.Mesh(new THREE.BoxGeometry(3, 16, 3), pillarMat);
  pillarR.position.set(11, 8, 10);
  group.add(pillarR);

  // Entrance lintel
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(28, 3, 3), pillarMat);
  lintel.position.set(0, 15.5, 10);
  group.add(lintel);

  // === Central fire pit ===
  const pitMat = new THREE.MeshStandardMaterial({ color: 0x1a0d00, roughness: 0.95 });
  const pit = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 1, 10), pitMat);
  pit.position.set(0, 0.5, -4);
  group.add(pit);

  // Fire glow sphere (emissive orange)
  const fireGlow = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 8, 6),
    new THREE.MeshStandardMaterial({
      color: 0xff4400,
      emissive: 0xff3300,
      emissiveIntensity: 2.5,
      transparent: true,
      opacity: 0.82,
    })
  );
  fireGlow.position.set(0, 2.5, -4);
  group.add(fireGlow);
  animatedWorldObjects.push({ mesh: fireGlow, type: "fireGlow", phase: 0 });

  // Fire inner core (brighter yellow)
  const fireCore = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 6, 5),
    new THREE.MeshBasicMaterial({ color: 0xffcc00 })
  );
  fireCore.position.set(0, 2.8, -4);
  group.add(fireCore);
  animatedWorldObjects.push({ mesh: fireCore, type: "fireCore", phase: 1.2 });

  // Point light for fire warmth
  const fireLight = new THREE.PointLight(0xff5500, 1.6, 30);
  fireLight.position.set(0, 5, -4);
  group.add(fireLight);

  // === Hanging lanterns ===
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xff7700 });
  const lanternGeo = new THREE.SphereGeometry(0.6, 6, 4);
  [[-8, 14, -6], [8, 14, -6], [0, 14, -10]].forEach(([x, y, z]) => {
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(x, y, z);
    group.add(lantern);
    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3, 4),
      new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    wire.position.set(x, y + 1.5, z);
    group.add(wire);
  });

  // === Kick-style crossed-leg training mannequin (simple shapes) ===
  // Decorative kick target dummy
  const dummyMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.85 });
  const dummyBody = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 8), dummyMat);
  dummyBody.position.set(-7, 4, -8);
  group.add(dummyBody);
  const dummyHead = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 6), dummyMat);
  dummyHead.position.set(-7, 8, -8);
  group.add(dummyHead);
  const dummyPost = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 6), new THREE.MeshStandardMaterial({ color: 0x3a2810 }));
  dummyPost.position.set(-7, 1, -8);
  group.add(dummyPost);

  // === SECRET entrance sign ===
  const secretLabel = makeLabel("🔥 SECRET AREA 🔥", 1.1);
  secretLabel.position.set(0, 18, 10);
  group.add(secretLabel);

  // === Old Cinder NPC ===
  const zeffPos = new THREE.Vector3(0, 1, -8);
  const zeff = new THREE.Group();
  zeff.position.copy(zeffPos);
  zeff.add(createHumanAvatarModel({
    name: "Old Cinder",
    skin: "#c49a6c",
    shirt: "#cc2200",     // Red chef coat
    pants: "#1a1a1a",
    hair: "#e8c870",      // Blonde/gold
    eyes: "#442200",
    boots: "#0a0a0a",
    hairStyle: "messy",
    outfit: "coat",
    height: 112,
    build: 108,
  }, { showSword: false, showName: false }));

  // Golden star/flame label for Old Cinder
  const zeffLabel = makeLabel("Old Cinder — Blaze Kick Master", 1.0);
  zeffLabel.position.y = 17;
  zeff.add(zeffLabel);

  // Small fire ring around Old Cinder's feet
  const zeffRing = new THREE.Mesh(
    new THREE.TorusGeometry(4, 0.15, 6, 32),
    new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.7 })
  );
  zeffRing.position.y = 1;
  zeffRing.rotation.x = Math.PI / 2;
  zeff.add(zeffRing);
  animatedWorldObjects.push({ mesh: zeffRing, type: "teleporter", speed: 0.025, phase: 0 });

  group.add(zeff);

  scene.add(group);

  // Register interactable (use the world-space position of Old Cinder)
  const worldZeffPos = position.clone().add(zeffPos);
  const zeffWorldGroup = new THREE.Group();
  zeffWorldGroup.position.copy(worldZeffPos);
  zeff.getWorldPosition(worldZeffPos);

  interactables.push({
    type: "flamingFeetShop",
    mesh: group,            // proximity check against the whole cave group
    interactCenter: worldZeffPos,
    prompt: "Press E: Talk to Old Cinder (Blaze Kick Master)",
  });
}

function showFlamingFeetShop() {
  if (!dialoguePanel || !questOptions) return;
  dialoguePanel.classList.remove("hidden");
  dialogueTitle.textContent = "⚡ Old Cinder — Blaze Kick Style";
  questOptions.innerHTML = "";

  if (player.hasFlamingFeet) {
    dialogueDetail.textContent = "You already master the Blaze Kick Style! Use C (Ember Shot) and V (Inferno Kick) in Melee mode. Set your legs ablaze!";
  } else {
    dialogueDetail.textContent = `"You want to learn Blaze Kick Style? It'll cost ya ${5000} Doubloons. The style focuses kicks infused with friction-generated flames. C = Ember Shot, V = Inferno Kick."`;
  }

  if (!player.hasFlamingFeet) {
    const buyBtn = document.createElement("button");
    buyBtn.type = "button";
    buyBtn.className = "quest-option";
    buyBtn.innerHTML = `<strong>🔥 Learn Blaze Kick Style</strong><span>Unlocks Ember Shot (C) and Inferno Kick (V) in Melee mode.</span><small>Cost: $5,000 Doubloons</small>`;
    buyBtn.addEventListener("click", () => buyFlamingFeet());
    questOptions.append(buyBtn);
  }

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "quest-option danger-button";
  closeBtn.style.background = "rgba(235, 94, 85, 0.15)";
  closeBtn.style.borderColor = "rgba(235, 94, 85, 0.3)";
  closeBtn.style.color = "#eb5e55";
  closeBtn.innerHTML = "<strong>Leave</strong><span>Close this menu</span>";
  closeBtn.addEventListener("click", () => { dialoguePanel.classList.add("hidden"); });
  questOptions.append(closeBtn);
}

function buyFlamingFeet() {
  if (player.hasFlamingFeet) {
    log("You already know the Blaze Kick Style!");
    return;
  }
  if (player.level < 30) {
    log("Old Cinder: \"You're too green, rookie. Come back at level 30.\"");
    return;
  }
  const cost = 5000;
  if (player.money < cost) {
    log(`Old Cinder: "Not enough Doubloons! You need ${cost} to learn from me."`);
    return;
  }
  player.money -= cost;
  player.hasFlamingFeet = true;
  dialoguePanel.classList.add("hidden");
  updateHud();
  saveGame();
  audio.playQuestComplete();

  // Fire burst celebration effect
  createFireBurst(playerMesh.position.clone().add(new THREE.Vector3(0, 4, 0)));
  createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 14, 0)), "🔥 BLACK LEG STYLE UNLOCKED!", "#ff5500");
}

function createReturnTeleporter(position) {
  const starterIslandPos = new THREE.Vector3(0, islands[0].surfaceY + 0.15, 0);
  const teleporter = new THREE.Group();
  teleporter.position.copy(position);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6.5, 0.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x112233, roughness: 0.6, metalness: 0.8 })
  );
  base.position.y = 0.4;
  base.castShadow = true;
  base.receiveShadow = true;
  teleporter.add(base);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.3, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0x3ce88a, transparent: true, opacity: 0.6 })
  );
  ring.position.y = 0.5;
  ring.rotation.x = Math.PI / 2;
  teleporter.add(ring);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(4.8, 4.8, 18, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x3ce88a, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
  );
  beam.position.y = 9;
  teleporter.add(beam);

  const label = makeLabel("Teleporter", 1.15);
  label.position.y = 15;
  teleporter.add(label);

  teleporter.userData.settleOn = true; // grounded by settleIslandObjects
  scene.add(teleporter);
  animatedWorldObjects.push({ mesh: ring, type: "teleporter", speed: 0.022, phase: position.x * 0.01 });
  animatedWorldObjects.push({ mesh: beam, type: "teleporterBeam", baseY: beam.position.y, speed: 0.003, phase: position.z * 0.01 });

  interactables.push({
    type: "returnTeleporter",
    mesh: teleporter,
    prompt: "Press E: Return to Starter Island",
    destination: starterIslandPos,
  });
}

function learnJunglePulse() {
  if (player.specialUnlocked) {
    log("You already know Jungle Pulse. Press 4 to equip it.");
    return;
  }
  if (!quest.complete) {
    log("The Jungle Pulse Trainer says: Complete the Starter Island quest before training with me.");
    return;
  }
  player.specialUnlocked = true;
  player.stats.special = Math.max(1, player.stats.special);
  updateHud();
  log("Jungle Pulse special ability unlocked!");
  saveGame();
}

function showTeleporterMenu() {
  if (!dialoguePanel || !questOptions) return;
  dialoguePanel.classList.remove("hidden");
  dialogueTitle.textContent = "Sea Teleporter Node";
  dialogueDetail.textContent = "Select an island destination:";
  questOptions.innerHTML = "";

  const jungleBtn = document.createElement("button");
  jungleBtn.type = "button";
  jungleBtn.className = "quest-option";
  jungleBtn.innerHTML = "<strong>Jungle Island</strong><span>Travel to the dense tropical forest. (Requires Level 15)</span>";
  jungleBtn.addEventListener("click", () => {
    if (player.level < 15) {
      log("You need to be level 15+ to access Jungle Island.");
      return;
    }
    showTeleporterSubMenu("Jungle");
  });
  questOptions.append(jungleBtn);

  const pirateBtn = document.createElement("button");
  pirateBtn.type = "button";
  pirateBtn.className = "quest-option";
  pirateBtn.innerHTML = "<strong>Pirate Town</strong><span>Travel to the pirate town.</span>";
  pirateBtn.addEventListener("click", () => {
    showTeleporterSubMenu("PirateTown");
  });
  questOptions.append(pirateBtn);

  const desertBtn = document.createElement("button");
  desertBtn.type = "button";
  desertBtn.className = "quest-option";
  desertBtn.innerHTML = "<strong>The Desert Island</strong><span>Travel to the dry, burning sands. (Requires Level 60)</span>";
  desertBtn.addEventListener("click", () => {
    if (player.level < 60) {
      log("You need to be level 60+ to access Desert Island.");
      return;
    }
    showTeleporterSubMenu("Desert");
  });
  questOptions.append(desertBtn);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "quest-option danger-button";
  closeBtn.style.background = "rgba(235, 94, 85, 0.15)";
  closeBtn.style.borderColor = "rgba(235, 94, 85, 0.3)";
  closeBtn.style.color = "#eb5e55";
  closeBtn.innerHTML = "<strong>Cancel</strong><span>Close menu</span>";
  closeBtn.addEventListener("click", () => {
    dialoguePanel.classList.add("hidden");
  });
  questOptions.append(closeBtn);
}

function showTeleporterSubMenu(island) {
  if (!dialoguePanel || !questOptions) return;
  const friendlyName = island === "PirateTown" ? "Pirate Town" : `${island} Island`;
  dialogueTitle.textContent = `${friendlyName} Locations`;
  dialogueDetail.textContent = "Select a specific coordinate to teleport to:";
  questOptions.innerHTML = "";

  if (island === "PirateTown") {
    const questGiverBtn = document.createElement("button");
    questGiverBtn.type = "button";
    questGiverBtn.className = "quest-option";
    questGiverBtn.innerHTML = "<strong>Quest Giver</strong><span>Teleport near the island's quest dealer.</span>";
    questGiverBtn.addEventListener("click", () => {
      dialoguePanel.classList.add("hidden");
      teleportToLocation(island, "questGiver");
    });
    questOptions.append(questGiverBtn);
  } else {
    const questGiverBtn = document.createElement("button");
    questGiverBtn.type = "button";
    questGiverBtn.className = "quest-option";
    questGiverBtn.innerHTML = "<strong>Quest Giver</strong><span>Teleport near the island's quest dealer.</span>";
    questGiverBtn.addEventListener("click", () => {
      dialoguePanel.classList.add("hidden");
      teleportToLocation(island, "questGiver");
    });
    questOptions.append(questGiverBtn);

    const specialBtn = document.createElement("button");
    specialBtn.type = "button";
    specialBtn.className = "quest-option";
    const abilityName = island === "Jungle" ? "Jungle Pulse Trainer" : "Iron Aura Trainer";
    specialBtn.innerHTML = `<strong>${abilityName}</strong><span>Teleport to the special ability trainer.</span>`;
    specialBtn.addEventListener("click", () => {
      dialoguePanel.classList.add("hidden");
      teleportToLocation(island, "special");
    });
    questOptions.append(specialBtn);
  }

  const backBtn = document.createElement("button");
  backBtn.type = "button";
  backBtn.className = "quest-option";
  backBtn.innerHTML = "<strong>&larr; Back</strong><span>Return to island selection</span>";
  backBtn.addEventListener("click", () => {
    showTeleporterMenu();
  });
  questOptions.append(backBtn);
}

function teleportToLocation(island, type) {
  let dest;
  if (island === "Jungle") {
    const jungle = islands[JUNGLE_ISLAND_INDEX];
    if (!jungle) return;
    if (type === "questGiver") {
      dest = new THREE.Vector3(jungle.position.x + 350, getIslandSurfaceHeightAt(jungle.position.x + 350, jungle.position.z + 300, jungle) + 0.15, jungle.position.z + 300);
    } else {
      dest = new THREE.Vector3(jungle.position.x - 150, getIslandSurfaceHeightAt(jungle.position.x - 150, jungle.position.z - 200, jungle) + 0.15, jungle.position.z - 200);
    }
    log("Teleported to Jungle Island.");
  } else if (island === "PirateTown") {
    const pt = islands[2];
    if (!pt) return;
    if (type === "questGiver") {
      dest = new THREE.Vector3(pt.position.x, getIslandSurfaceHeightAt(pt.position.x, pt.position.z, pt) + 0.15, pt.position.z);
    }
    log("Teleported to Pirate Town.");
  } else if (island === "Desert") {
    const desert = islands[3];
    if (!desert) return;
    if (type === "questGiver") {
      dest = new THREE.Vector3(desert.position.x + 200, getIslandSurfaceHeightAt(desert.position.x + 200, desert.position.z + 200, desert) + 0.15, desert.position.z + 200);
    } else {
      dest = desert.position.clone().add(new THREE.Vector3(70, 0.15, -60));
    }
    log("Teleported to Desert Island.");
  }

  if (dest) {
    playerMesh.position.copy(dest);
    jumpOffset = 0;
    verticalVelocity = 0;
    isGrounded = true;
    createWallHitEffect(playerMesh.position.clone(), false);
  }
}

function createHakiTrainer(position) {
  const trainer = new THREE.Group();
  trainer.position.copy(position);
  trainer.add(createHumanAvatarModel({
    name: "Aura Trainer",
    skin: "#b68158",
    shirt: "#111111",
    pants: "#292929",
    hair: "#f2f2e8",
    eyes: "#0a0a0a",
    boots: "#101010",
    hairStyle: "spiky",
    outfit: "armor",
    height: 112,
    build: 118,
  }, { showSword: false, showName: false }));
  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(5.5, 0.2, 8, 42),
    new THREE.MeshBasicMaterial({ color: 0x151515, transparent: true, opacity: 0.75 }),
  );
  aura.position.y = 2;
  aura.rotation.x = Math.PI / 2;
  trainer.add(aura);
  const label = makeLabel("Aura Trainer", 1);
  label.position.y = 15;
  trainer.add(label);
  scene.add(trainer);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.018, phase: 1.2 });
  interactables.push({
    type: "hakiTrainer",
    mesh: trainer,
    prompt: "Press E: Learn Iron Aura",
  });
}

function createBoat(type) {
  const sizes = {
    dinghy: { length: 18, width: 6, color: 0x8c5c3a, sail: false },
    sailor: { length: 24, width: 7.5, color: 0x4b7a9a, sail: true },
    brigade: { length: 32, width: 9, color: 0x30536f, sail: true },
  };
  const spec = sizes[type] || sizes.dinghy;
  const boat = new THREE.Group();

  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(spec.length, 1.8, spec.width),
    new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.62, metalness: 0.12 }),
  );
  hull.position.y = 0.9;
  hull.castShadow = true;
  boat.add(hull);

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(spec.length * 0.88, 0.4, spec.width * 0.92),
    new THREE.MeshStandardMaterial({ color: 0xd4b27e, roughness: 0.72 }),
  );
  deck.position.y = 1.35;
  boat.add(deck);

  if (spec.sail) {
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x3b3029, roughness: 0.85 }),
    );
    mast.position.y = 4.5;
    boat.add(mast);

    const sail = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 7.5),
      new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.92 }),
    );
    sail.position.set(0, 4.5, 0);
    sail.rotation.y = -Math.PI / 2;
    sail.rotation.z = 0.12;
    boat.add(sail);
  }

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(spec.length * 0.3, 1.6, spec.width * 0.75),
    new THREE.MeshStandardMaterial({ color: 0x2c4b5c, roughness: 0.78 }),
  );
  cabin.position.set(-spec.length * 0.15, 2.1, 0);
  boat.add(cabin);

  return boat;
}

function addIslandRocks(group, radius, height) {
  const rockMaterial = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.rockDark), roughness: 0.97, flatShading: true });
  const rockCount = 18;
  for (let i = 0; i < rockCount; i += 1) {
    const rockRadius = 3 + Math.random() * 4;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rockRadius, 0), rockMaterial);
    const angle = (i / rockCount) * Math.PI * 2 + Math.random() * 0.4;
    const distance = radius * (0.96 + Math.random() * 0.07);
    const rx = Math.cos(angle) * distance;
    const rz = Math.sin(angle) * distance;
    const ry = height * 0.02 + Math.random() * 1.1;
    rock.position.set(rx, ry, rz);
    rock.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.6);
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);

    // Add collision circle for boundary rock in global space
    const globalPos = group.position.clone().add(new THREE.Vector3(rx, ry, rz));
    addCollisionCircle(globalPos, rockRadius * 0.85, "Shore Rock");
  }
}

function handleBoatSelection(type) {
  if (activeBoat) {
    scene.remove(activeBoat);
  }
  const boat = createBoat(type);
  enhanceWorldSurfaces(boat);
  const offset = new THREE.Vector3(0, 0, -28).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerMesh.rotation.y);
  boat.position.copy(playerMesh.position).add(offset);
  boat.position.y = OCEAN_SURFACE_Y + 0.28;
  boat.rotation.y = playerMesh.rotation.y;
  scene.add(boat);
  activeBoat = boat;
  hideBoatMenu();
  log(`Spawned ${type} boat near the water.`);
}

function showBoatMenu() {
  document.querySelector("#boat-menu").classList.remove("hidden");
}

function hideBoatMenu() {
  document.querySelector("#boat-menu").classList.add("hidden");
}

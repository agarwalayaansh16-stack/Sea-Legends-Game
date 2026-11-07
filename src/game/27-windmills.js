
// ── 27-windmills.js ─ Tower windmills, a wheat field and hay bales for the starter island.

const windmillRotors = [];

function updateWindmills(dt) {
  const strength = windUniforms.uWindStrength.value;
  windmillRotors.forEach((rotor) => {
    rotor.mesh.rotation.z -= dt * rotor.speed * (0.6 + strength * 0.5);
  });
}

function createWindmill(scale = 1, seed = 0) {
  const village = WORLD_PALETTE.village;
  const mat = (hex, roughness, surface, extra = {}) => {
    const m = new THREE.MeshStandardMaterial({ color: worldHex(hex), roughness, ...extra });
    m.userData.surface = surface;
    return m;
  };
  const stone = mat(village.foundation, 0.95, "stone");
  const plaster = mat(village.walls[seed % village.walls.length], 0.9, "plaster");
  const timber = mat(village.timber, 0.85, "wood");
  const roofMat = mat(village.roofs[(seed + 1) % village.roofs.length], 0.78, "tiles", { side: THREE.DoubleSide });
  const sailCloth = mat(0xefe6d2, 0.95, "plaster", { side: THREE.DoubleSide });
  const trim = mat(village.trims[seed % village.trims.length], 0.7, "wood");

  const mill = new THREE.Group();
  const shade = (mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // Tapered tower: stone base, plastered body (curved profile via a lathe).
  const towerProfile = [];
  for (let i = 0; i <= 12; i += 1) {
    const t = i / 12;
    towerProfile.push(new THREE.Vector2(11 - 4.2 * t - 0.8 * Math.sin(t * Math.PI), 6 + t * 34));
  }
  const tower = shade(new THREE.Mesh(new THREE.LatheGeometry(towerProfile, 28), plaster));
  mill.add(tower);
  const base = shade(new THREE.Mesh(new THREE.CylinderGeometry(11.4, 12.4, 6, 28), stone));
  base.position.y = 3;
  mill.add(base);

  // Balcony / reefing stage with railing.
  const stage = shade(new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 0.8, 28), timber));
  stage.position.y = 22;
  mill.add(stage);
  for (let i = 0; i < 16; i += 1) {
    const a = (i / 16) * Math.PI * 2;
    const post = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.2, 6), timber));
    post.position.set(Math.cos(a) * 10.6, 23.6, Math.sin(a) * 10.6);
    mill.add(post);
  }
  const rail = shade(new THREE.Mesh(new THREE.TorusGeometry(10.6, 0.25, 6, 32), timber));
  rail.rotation.x = Math.PI / 2;
  rail.position.y = 25.1;
  mill.add(rail);

  // Arched door and windows (reuse the cottage window glass so they glow at night).
  const door = shade(new THREE.Mesh(flatPanel(archShape(5.6, 9), 0.6), timber));
  door.position.set(0, 0.2, 11.6);
  mill.add(door);
  const doorFrame = shade(new THREE.Mesh(flatPanel(archFrameShape(5.6, 9, 1), 1), stone));
  doorFrame.position.set(0, 0.2, 11.7);
  mill.add(doorFrame);
  [[12, 0.6], [30, 2.6], [30, -2.4]].forEach(([y, a]) => {
    const r = 11 - 4.2 * ((y - 6) / 34) - 0.8 * Math.sin(((y - 6) / 34) * Math.PI);
    const win = new THREE.Group();
    const frame = new THREE.Mesh(flatPanel(archFrameShape(2.6, 4, 0.6), 0.6), trim);
    const glass = new THREE.Mesh(flatPanel(archShape(2.6, 4), 0.25), houseWindowGlass);
    glass.userData.noSurface = true;
    win.add(frame, glass);
    win.position.set(Math.sin(a) * (r - 0.15), y, Math.cos(a) * (r - 0.15));
    win.rotation.y = a;
    mill.add(win);
  });

  // Rotating cap with a bell-curved roof; the sails face +z.
  const cap = new THREE.Group();
  cap.position.y = 40;
  const capProfile = [];
  for (let i = 0; i <= 14; i += 1) {
    const t = i / 14;
    capProfile.push(new THREE.Vector2(7.8 * Math.pow(1 - t, 0.8) * (1 - 0.18 * Math.sin(t * Math.PI)) + 0.05, t * 10));
  }
  const capRoof = shade(new THREE.Mesh(new THREE.LatheGeometry(capProfile, 24), roofMat));
  cap.add(capRoof);
  const capRing = shade(new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 1.2, 24), timber));
  capRing.position.y = 0.2;
  cap.add(capRing);
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), mat(0xc9a24a, 0.35, "metal", { metalness: 0.7 }));
  finial.position.y = 10.4;
  cap.add(finial);
  const axle = shade(new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 6, 12), timber));
  axle.rotation.x = Math.PI / 2;
  axle.position.set(0, 4, 8.2);
  cap.add(axle);

  const rotor = new THREE.Group();
  rotor.position.set(0, 4, 11.4);
  const hub = shade(new THREE.Mesh(new THREE.SphereGeometry(1.6, 14, 10), trim));
  rotor.add(hub);
  for (let s = 0; s < 4; s += 1) {
    const sail = new THREE.Group();
    const spar = shade(new THREE.Mesh(new THREE.BoxGeometry(0.9, 30, 0.9), timber));
    spar.position.y = 15;
    sail.add(spar);
    // Lattice frame with a cloth panel on one side of the spar.
    const cloth = shade(new THREE.Mesh(new THREE.PlaneGeometry(6, 24, 1, 1), sailCloth));
    cloth.position.set(3.6, 17.5, -0.3);
    sail.add(cloth);
    for (let k = 0; k <= 6; k += 1) {
      const bar = shade(new THREE.Mesh(new THREE.BoxGeometry(7, 0.35, 0.35), timber));
      bar.position.set(3.2, 5.5 + k * 4, 0.1);
      sail.add(bar);
    }
    const edge = shade(new THREE.Mesh(new THREE.BoxGeometry(0.35, 24.5, 0.35), timber));
    edge.position.set(6.7, 17.5, 0.1);
    sail.add(edge);
    sail.rotation.z = (s / 4) * Math.PI * 2;
    rotor.add(sail);
  }
  rotor.rotation.z = seed * 0.7;
  cap.add(rotor);
  mill.add(cap);
  windmillRotors.push({ mesh: rotor, speed: 0.55 + (seed % 3) * 0.08 });

  mill.scale.setScalar(scale);
  return mill;
}

function createHayBale(radius = 3) {
  const bale = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, radius * 1.3, 18),
    new THREE.MeshStandardMaterial({ color: worldHex(0xd9b866), roughness: 0.95 }),
  );
  bale.rotation.z = Math.PI / 2;
  bale.castShadow = true;
  bale.receiveShadow = true;
  bale.userData.surface = "dirt";
  return bale;
}

// Golden wheat that sways with the same wind as the grass.
function createWheatField(width, depth, seed = 0) {
  const field = new THREE.Group();
  const soil = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.6, depth),
    new THREE.MeshStandardMaterial({ color: worldHex(0x7a5a3a), roughness: 0.98 }),
  );
  soil.position.y = 0.3;
  soil.receiveShadow = true;
  soil.userData.surface = "dirt";
  field.add(soil);

  const count = Math.round(width * depth * 1.6);
  const wheat = new THREE.InstancedMesh(createGrassBladeGeometry(), createWindGrassMaterial(0x9a7a32, 0xf3d77a), count);
  wheat.frustumCulled = false;
  wheat.receiveShadow = true;
  wheat.userData.noSurface = true;
  const dummy = new THREE.Object3D();
  let state = (seed + 7) * 2246822519 >>> 0;
  const rng = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const tint = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    // Planted in rows along x.
    const row = Math.floor(rng() * Math.floor(depth / 2.2));
    dummy.position.set((rng() - 0.5) * (width - 2), 0.55, -depth / 2 + 1.5 + row * 2.2 + (rng() - 0.5) * 0.6);
    dummy.rotation.set((rng() - 0.5) * 0.2, rng() * Math.PI * 2, (rng() - 0.5) * 0.2);
    dummy.scale.set(0.9 + rng() * 0.5, 4.2 + rng() * 1.8, 1);
    dummy.updateMatrix();
    wheat.setMatrixAt(i, dummy.matrix);
    wheat.setColorAt(i, tint.setHSL(0.11 + rng() * 0.03, 0.5, 0.82 + rng() * 0.15));
  }
  wheat.instanceMatrix.needsUpdate = true;
  if (wheat.instanceColor) wheat.instanceColor.needsUpdate = true;
  field.add(wheat);
  return field;
}

function addStarterWindmills(group, radius, height) {
  const surface = (x, z) => getLocalSurfaceHeightAt(x, z, radius, height, 0);
  const mills = [
    // x, z, scale, facing (radians, sails point roughly into the wind)
    [330, -70, 1.15, -0.6],
    [-170, -300, 1.0, 0.4],
    [150, -340, 0.9, -0.2],
  ];
  mills.forEach(([x, z, scale, facing], i) => {
    const y = surface(x, z);
    const mill = createWindmill(scale, i);
    mill.position.set(x, y - 0.4, z);
    mill.rotation.y = facing;
    group.add(mill);
    addCollisionCircle(new THREE.Vector3(x, y, z), 12.2 * scale, "Windmill", { material: "stone" });
  });

  // Wheat field and hay bales beside the big mill.
  const fx = 280;
  const fz = -150;
  const field = createWheatField(56, 34, 3);
  field.position.set(fx, surface(fx, fz) - 0.1, fz);
  field.rotation.y = -0.6;
  group.add(field);
  const fenceY = surface(fx, fz);
  addCollisionBox(new THREE.Vector3(fx, fenceY, fz), 28, 17, -0.6, "Wheat field", { material: "wood", height: 3 });

  [[318, -112, 3.2], [324, -102, 2.8], [312, -96, 3], [246, -196, 3.1]].forEach(([x, z, r], i) => {
    const bale = createHayBale(r);
    bale.position.set(x, surface(x, z) + r - 0.2, z);
    bale.rotation.y = i * 0.9;
    group.add(bale);
    addCollisionCircle(new THREE.Vector3(x, surface(x, z), z), r * 1.1, "Hay bale", { material: "wood", damage: 2, height: r * 1.9 });
  });
}

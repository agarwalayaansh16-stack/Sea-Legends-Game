
// ── 37-boats.js ─ Boat models, launching at open water, riding at the helm, shore collisions and the sailing HUD.
var BOAT_SPECS = {
  dinghy:  { name: "Dinghy",      length: 22, beam: 8,  depth: 3.2, maxSpeed: 95,  accel: 40, turn: 1.75, hull: 0x8a5a36, trim: 0xe8c27a, bottom: 0x3d6f7c, masts: 0 },
  sailor:  { name: "Sailor Boat", length: 34, beam: 11, depth: 4.2, maxSpeed: 135, accel: 34, turn: 1.3,  hull: 0x2f5f86, trim: 0xf4b740, bottom: 0x8c3a2c, masts: 1 },
  brigade: { name: "Brigade",     length: 48, beam: 15, depth: 5.6, maxSpeed: 165, accel: 27, turn: 0.95, hull: 0x2a2f3a, trim: 0xc98a1b, bottom: 0x7a2f26, masts: 2 },
};

var boatBumpCooldown = 0;
var boatUiRefs = null;

// Hull width at a point along the boat, 0 = stern, 1 = bow.
function boatHalfBeamAt(t, beam) {
  const f = t < 0.62
    ? 0.8 + 0.2 * Math.sin(Math.min(1, t / 0.4) * Math.PI / 2)
    : Math.pow(Math.cos(((t - 0.62) / 0.38) * Math.PI / 2), 0.75);
  return Math.max(0.02, f) * beam / 2;
}

function boatKeelAt(t, depth) {
  return (t > 0.72 ? Math.pow((t - 0.72) / 0.28, 2) * depth * 0.62 : 0) + (t < 0.12 ? (0.12 - t) / 0.12 * depth * 0.12 : 0);
}

function boatSheerAt(t, depth) {
  return depth * (1 + 0.16 * Math.pow(2 * t - 1, 2) + 0.12 * Math.max(0, t - 0.6) / 0.4);
}

// A smooth lofted hull: cross sections from stern to bow, keel to gunwale.
function createBoatHullGeometry(spec) {
  const N = 28;
  const M = 12;
  const positions = [];
  const colors = [];
  const uvs = [];
  const indices = [];
  const topColor = new THREE.Color(spec.hull);
  const lowColor = new THREE.Color(spec.bottom);
  for (let i = 0; i <= N; i += 1) {
    const t = i / N;
    const z = (t - 0.5) * spec.length;
    const hb = boatHalfBeamAt(t, spec.beam);
    const keel = boatKeelAt(t, spec.depth);
    const top = boatSheerAt(t, spec.depth);
    for (let j = 0; j <= M; j += 1) {
      const a = -Math.PI / 2 + Math.PI * j / M;
      const s = Math.sin(a);
      const x = hb * Math.sign(s) * Math.pow(Math.abs(s), 0.62);
      const y = keel + (top - keel) * (1 - Math.cos(a));
      positions.push(x, y, z);
      const waterline = (y - keel) / Math.max(0.01, top - keel) < 0.36;
      const c = waterline ? lowColor : topColor;
      colors.push(c.r, c.g, c.b);
      uvs.push(z / 7, (j / M) * (spec.depth * 2.4) / 7);
    }
  }
  for (let i = 0; i < N; i += 1) {
    for (let j = 0; j < M; j += 1) {
      const a = i * (M + 1) + j;
      const b = a + M + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  // Flat transom at the stern.
  const centre = positions.length / 3;
  positions.push(0, boatSheerAt(0, spec.depth) * 0.7, -spec.length / 2);
  colors.push(topColor.r, topColor.g, topColor.b);
  uvs.push(0.5, 0.5);
  for (let j = 0; j < M; j += 1) indices.push(centre, j + 1, j);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function createBoatDeckGeometry(spec, deckY) {
  const shape = new THREE.Shape();
  const steps = 22;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const p = [boatHalfBeamAt(t, spec.beam) * 0.9, -((t - 0.5) * spec.length * 0.97)];
    if (i === 0) shape.moveTo(p[0], p[1]); else shape.lineTo(p[0], p[1]);
  }
  for (let i = steps; i >= 0; i -= 1) {
    const t = i / steps;
    shape.lineTo(-boatHalfBeamAt(t, spec.beam) * 0.9, -((t - 0.5) * spec.length * 0.97));
  }
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, deckY, 0);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i += 1) uv.setXY(i, pos.getX(i) / 5, pos.getZ(i) / 5);
  return geo;
}

// A canvas sail that bellies forward; scale.z is animated with speed.
function createBoatSail(width, height, color, emblem) {
  const geo = new THREE.PlaneGeometry(width, height, 10, 8);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const v = y / height + 0.5;
    pos.setX(i, x * (1 - 0.16 * v));
    pos.setZ(i, (1 - Math.pow((2 * x) / width, 2)) * (1 - 0.55 * Math.pow(2 * v - 1, 2)));
  }
  geo.computeVertexNormals();
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 128, 128);
  ctx.globalAlpha = 0.09;
  ctx.fillStyle = "#000";
  for (let x = 0; x < 128; x += 16) ctx.fillRect(x, 0, 1.5, 128);
  ctx.globalAlpha = 0.2;
  ctx.fillRect(0, 0, 128, 4);
  ctx.fillRect(0, 124, 128, 4);
  if (emblem) {
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = emblem;
    ctx.beginPath();
    ctx.arc(64, 60, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.fillRect(56, 52, 5, 6);
    ctx.fillRect(67, 52, 5, 6);
    ctx.fillRect(58, 68, 12, 4);
  }
  const tex = new THREE.CanvasTexture(canvas);
  const sail = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.9 }));
  sail.castShadow = true;
  sail.userData.noSurface = true;
  return sail;
}

function createBoat(type) {
  const spec = BOAT_SPECS[type] || BOAT_SPECS.dinghy;
  const boat = new THREE.Group();
  boat.userData.boatType = BOAT_SPECS[type] ? type : "dinghy";
  boat.userData.spec = spec;
  boat.userData.sails = [];
  boat.userData.flags = [];
  const lib = typeof getSurfaceLibrary === "function" ? getSurfaceLibrary() : null;
  const woodMap = lib?.wood?.map || null;
  const woodBump = lib?.wood?.bump || null;
  const noSurface = (mesh) => { mesh.userData.noSurface = true; return mesh; };

  // Everything floats inside a "body" that rolls and pitches with the sea.
  const body = new THREE.Group();
  boat.add(body);
  boat.userData.body = body;

  const hull = noSurface(new THREE.Mesh(
    createBoatHullGeometry(spec),
    new THREE.MeshStandardMaterial({ map: woodMap, bumpMap: woodBump, bumpScale: 0.05, vertexColors: true, roughness: 0.72, side: THREE.DoubleSide }),
  ));
  hull.castShadow = true;
  hull.receiveShadow = true;
  body.add(hull);

  const deckY = spec.depth * 0.82;
  boat.userData.deckY = deckY;
  const deck = noSurface(new THREE.Mesh(
    createBoatDeckGeometry(spec, deckY),
    new THREE.MeshStandardMaterial({ map: woodMap, bumpMap: woodBump, bumpScale: 0.04, color: 0xd8b383, roughness: 0.8 }),
  ));
  deck.receiveShadow = true;
  body.add(deck);

  // Painted rail along the gunwale.
  const railPts = [];
  for (let i = 0; i <= 20; i += 1) {
    const t = i / 20;
    railPts.push(new THREE.Vector3(boatHalfBeamAt(t, spec.beam), boatSheerAt(t, spec.depth), (t - 0.5) * spec.length));
  }
  for (let i = 20; i >= 0; i -= 1) {
    const t = i / 20;
    railPts.push(new THREE.Vector3(-boatHalfBeamAt(t, spec.beam), boatSheerAt(t, spec.depth), (t - 0.5) * spec.length));
  }
  const trimMat = new THREE.MeshStandardMaterial({ color: spec.trim, roughness: 0.45, metalness: 0.25 });
  const rail = noSurface(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts, true), 90, 0.32 + spec.beam * 0.012, 6, true), trimMat));
  rail.castShadow = true;
  body.add(rail);

  const darkWood = new THREE.MeshStandardMaterial({ map: woodMap, color: 0x6b4428, roughness: 0.82 });

  // Benches for the dinghy, cannons for the brigade.
  if (spec.masts === 0) {
    [-0.12, 0.18].forEach((f) => {
      const bench = noSurface(new THREE.Mesh(new THREE.BoxGeometry(spec.beam * 0.78, 0.35, 1.6), darkWood));
      bench.position.set(0, deckY + 1.1, f * spec.length);
      body.add(bench);
    });
    [-1, 1].forEach((side) => {
      const oar = noSurface(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 11, 6), darkWood));
      oar.rotation.z = side * 1.2;
      oar.rotation.x = -0.25;
      oar.position.set(side * (spec.beam / 2 + 2.5), deckY + 0.7, 0.05 * spec.length);
      body.add(oar);
    });
  }
  if (type === "brigade") {
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x23262b, roughness: 0.4, metalness: 0.7 });
    [-1, 1].forEach((side) => {
      [-0.18, 0.02, 0.22].forEach((f) => {
        const t = f + 0.5;
        const cannon = noSurface(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 3.6, 10), ironMat));
        cannon.rotation.z = Math.PI / 2;
        cannon.position.set(side * (boatHalfBeamAt(t, spec.beam) - 0.4), deckY + 1.2, f * spec.length);
        body.add(cannon);
      });
    });
    const castle = noSurface(new THREE.Mesh(new THREE.BoxGeometry(spec.beam * 0.72, 2.2, spec.length * 0.16), darkWood));
    castle.position.set(0, deckY + 1.1, -spec.length * 0.4);
    castle.castShadow = true;
    body.add(castle);
    const lanternMat = new THREE.MeshStandardMaterial({ color: 0xffd173, emissive: 0xffa630, emissiveIntensity: 1.2 });
    const lantern = noSurface(new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.3, 0.9), lanternMat));
    lantern.position.set(0, deckY + 3.6, -spec.length * 0.49);
    body.add(lantern);
  }

  // Masts, yards and sails.
  const faction = String(player?.faction || "");
  const sailColor = faction.startsWith("Marine") ? "#f4f1ea" : faction.startsWith("Pirate") ? "#2b2a2f" : "#efe3c8";
  const emblem = faction.startsWith("Marine") ? "#2f6db3" : faction.startsWith("Pirate") ? "#efe6d6" : null;
  const flagColor = faction.startsWith("Marine") ? 0x2f6db3 : faction.startsWith("Pirate") ? 0x141414 : 0xc23b2e;
  const mastSpots = spec.masts === 2 ? [0.12, -0.16] : spec.masts === 1 ? [0.06] : [];
  mastSpots.forEach((f, idx) => {
    const mastH = spec.depth * (idx === 0 ? 5.2 : 4.4);
    const mast = noSurface(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, mastH, 8), darkWood));
    mast.position.set(0, deckY + mastH / 2, f * spec.length);
    mast.castShadow = true;
    body.add(mast);
    const tiers = spec.masts === 2 ? [0.42, 0.78] : [0.5];
    tiers.forEach((h, k) => {
      const w = spec.beam * (k === 0 ? 1.15 : 0.82);
      const sh = mastH * (k === 0 ? 0.4 : 0.28);
      const yardY = deckY + mastH * h + sh / 2;
      const yard = noSurface(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, w + 1.2, 6), darkWood));
      yard.rotation.z = Math.PI / 2;
      yard.position.set(0, yardY, f * spec.length + 0.5);
      body.add(yard);
      const sail = createBoatSail(w, sh, sailColor, k === 0 && idx === 0 ? emblem : null);
      sail.position.set(0, yardY - sh / 2, f * spec.length + 0.6);
      body.add(sail);
      boat.userData.sails.push(sail);
    });
    if (idx === 0) {
      const flag = noSurface(new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 1.9, 6, 1).translate(1.6, 0, 0),
        new THREE.MeshStandardMaterial({ color: flagColor, side: THREE.DoubleSide, roughness: 0.8 }),
      ));
      flag.rotation.y = Math.PI / 2;
      flag.position.set(0, deckY + mastH + 0.4, f * spec.length);
      body.add(flag);
      boat.userData.flags.push(flag);
    }
  });
  if (spec.masts === 2) {
    const sprit = noSurface(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, spec.length * 0.28, 6), darkWood));
    sprit.rotation.x = Math.PI / 2 - 0.35;
    sprit.position.set(0, boatSheerAt(1, spec.depth) + 1.6, spec.length * 0.56);
    body.add(sprit);
  }

  // Ship's wheel; the captain stands just behind it.
  const helmZ = -spec.length * (spec.masts === 2 ? 0.27 : 0.3);
  const post = noSurface(new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.2, 0.7), darkWood));
  post.position.set(0, deckY + 1.6, helmZ);
  body.add(post);
  const wheel = new THREE.Group();
  wheel.add(noSurface(new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.14, 6, 18), trimMat)));
  for (let s = 0; s < 8; s += 1) {
    const spoke = noSurface(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4, 5), darkWood));
    spoke.rotation.z = (s / 8) * Math.PI;
    wheel.add(spoke);
  }
  wheel.position.set(0, deckY + 3.4, helmZ - 0.5);
  body.add(wheel);
  boat.userData.wheel = wheel;
  boat.userData.helmPoint = new THREE.Vector3(0, deckY + 0.1, helmZ - 2.6);

  return boat;
}

// True when a boat-sized spot is clear of land, docks and rocks.
function boatSpotIsWater(x, z, pad = 0) {
  if (groundHeightAt(x, z) > OCEAN_SURFACE_Y + 0.02) return false;
  if (typeof sightBlockedAt === "function" && sightBlockedAt(x, OCEAN_SURFACE_Y + 1.5, z, pad, 0)) return false;
  return true;
}

function boatAreaIsWater(x, z, clearance) {
  if (!boatSpotIsWater(x, z, 2)) return false;
  for (let k = 0; k < 8; k += 1) {
    const a = (k / 8) * Math.PI * 2;
    if (!boatSpotIsWater(x + Math.cos(a) * clearance, z + Math.sin(a) * clearance, 1)) return false;
  }
  return true;
}

// Water that connects to the open sea: walking straight away from the island stays wet.
// This rules out lagoons and ponds enclosed by land.
function boatReachesOpenSea(x, z) {
  for (let i = 0; i < islands.length; i += 1) {
    const isl = islands[i];
    const dx = x - isl.position.x;
    const dz = z - isl.position.z;
    const d = Math.hypot(dx, dz);
    const edge = isl.radius * 1.08 + 20;
    if (d >= edge) continue;
    const ux = d > 0.01 ? dx / d : 1;
    const uz = d > 0.01 ? dz / d : 0;
    for (let r = d; r <= edge; r += 8) {
      if (!boatSpotIsWater(isl.position.x + ux * r, isl.position.z + uz * r, 0)) return false;
    }
  }
  return true;
}

// Nearest open water to a point, searching outward in rings.
function findOpenWaterNear(origin, clearance, maxRadius = 900) {
  const ok = (x, z) => boatAreaIsWater(x, z, clearance) && boatReachesOpenSea(x, z);
  if (ok(origin.x, origin.z)) return new THREE.Vector3(origin.x, OCEAN_SURFACE_Y, origin.z);
  for (let r = 12; r <= maxRadius; r += 12) {
    const count = Math.max(12, Math.round(r / 6));
    for (let k = 0; k < count; k += 1) {
      const a = (k / count) * Math.PI * 2;
      const x = origin.x + Math.cos(a) * r;
      const z = origin.z + Math.sin(a) * r;
      if (ok(x, z)) return new THREE.Vector3(x, OCEAN_SURFACE_Y, z);
    }
  }
  return null;
}

// Nearest dry ground to a point, for stepping ashore.
function findShoreNear(origin, minR, maxR) {
  for (let r = minR; r <= maxR; r += 5) {
    const count = Math.max(16, Math.round(r / 3));
    let best = null;
    for (let k = 0; k < count; k += 1) {
      const a = (k / count) * Math.PI * 2;
      const x = origin.x + Math.cos(a) * r;
      const z = origin.z + Math.sin(a) * r;
      const g = groundHeightAt(x, z);
      if (g > OCEAN_SURFACE_Y + 0.35 && !(typeof sightBlockedAt === "function" && sightBlockedAt(x, g + 2, z, 2, 0))) {
        if (!best || g < best.y) best = new THREE.Vector3(x, g, z);
      }
    }
    if (best) return best;
  }
  return null;
}

// Heading pointing away from the closest island, so a new boat faces open sea.
function seawardYaw(point) {
  let nearest = null;
  let gap = Infinity;
  islands.forEach((isl) => {
    const d = Math.hypot(point.x - isl.position.x, point.z - isl.position.z) - isl.radius;
    if (d < gap) { gap = d; nearest = isl; }
  });
  if (!nearest) return 0;
  return Math.atan2(point.x - nearest.position.x, point.z - nearest.position.z);
}

function boatSurfaceY(boat) {
  return OCEAN_SURFACE_Y - boat.userData.spec.depth * 0.36;
}

function handleBoatSelection(type) {
  if (isHelming) unhelmBoat(true);
  if (activeBoat) scene.remove(activeBoat);
  const boat = createBoat(type);
  const spec = boat.userData.spec;
  const spot = findOpenWaterNear(playerMesh.position, spec.length * 0.62);
  hideBoatMenu();
  if (!spot) {
    activeBoat = null;
    log("There is no open water nearby. Walk closer to the sea and try again.");
    return;
  }
  boat.position.set(spot.x, boatSurfaceY(boat), spot.z);
  boat.rotation.y = seawardYaw(spot);
  scene.add(boat);
  activeBoat = boat;
  createSplashEffect(spot.clone());
  helmBoat();
  log(`Your ${spec.name} is launched and you have the helm. W and S to sail, A and D to steer, G to go ashore.`);
}

function toggleHelm() {
  if (!activeBoat) {
    log("You don't have a boat yet. Visit the Boat Dealer near the Starter Island shore.");
    return;
  }
  if (isHelming) {
    unhelmBoat();
    return;
  }
  if (boatBoardDistance() > activeBoat.userData.spec.length * 0.5 + 34) {
    log("Get closer to your boat to climb aboard.");
    return;
  }
  helmBoat();
}

function boatBoardDistance() {
  if (!activeBoat) return Infinity;
  return Math.hypot(playerMesh.position.x - activeBoat.position.x, playerMesh.position.z - activeBoat.position.z);
}

function helmBoat() {
  if (!activeBoat) return;
  isHelming = true;
  player.isSwimming = false;
  player.oxygen = 100;
  playerMesh.visible = true;
  boatYaw = activeBoat.rotation.y;
  boatVelocity = 0;
  placePlayerAtHelm();
  audio.playFanfare();
  updateBoatUi(0);
}

function unhelmBoat(silent) {
  isHelming = false;
  boatVelocity = 0;
  playerMesh.visible = true;
  playerMesh.rotation.x = 0;
  playerMesh.rotation.z = 0;
  if (!activeBoat) return;
  const spec = activeBoat.userData.spec;
  const shore = findShoreNear(activeBoat.position, spec.beam * 0.6, spec.length * 0.5 + 70);
  if (shore) {
    playerMesh.position.set(shore.x, shore.y + 0.15, shore.z);
    playerMesh.rotation.y = Math.atan2(shore.x - activeBoat.position.x, shore.z - activeBoat.position.z);
    if (!silent) log("You stepped ashore. Press G near your boat to sail again.");
  } else {
    const side = new THREE.Vector3(Math.cos(boatYaw), 0, -Math.sin(boatYaw)).multiplyScalar(spec.beam * 0.5 + 5);
    playerMesh.position.set(activeBoat.position.x + side.x, OCEAN_SURFACE_Y + 0.75, activeBoat.position.z + side.z);
    if (!silent) log("No shore nearby, so you dived into the sea. Press G to climb back aboard.");
  }
  playerMoveState?.velocity?.set(0, 0, 0);
  cameraYaw = boatYaw + Math.PI;
  updateBoatUi(0);
}

function placePlayerAtHelm() {
  const body = activeBoat.userData.body;
  body.updateMatrixWorld(true);
  const p = activeBoat.userData.helmPoint.clone();
  body.localToWorld(p);
  playerMesh.position.copy(p);
  playerMesh.rotation.y = boatYaw;
}

// Sea motion shared by a moored boat and one under sail.
function animateBoat(boat, dt, speed, turn) {
  const t = performance.now() * 0.001;
  const spec = boat.userData.spec;
  const body = boat.userData.body;
  const sizeCalm = 18 / spec.length;
  boat.position.y = boatSurfaceY(boat) + Math.sin(t * 1.3 + boat.position.x * 0.01) * 0.35 * sizeCalm;
  const targetRoll = Math.sin(t * 0.9) * 0.05 * sizeCalm - turn * Math.min(1, Math.abs(speed) / spec.maxSpeed) * 0.12;
  const targetPitch = Math.sin(t * 1.1 + 1.3) * 0.03 * sizeCalm - Math.min(1, Math.abs(speed) / spec.maxSpeed) * 0.04;
  body.rotation.z += (targetRoll - body.rotation.z) * Math.min(1, dt * 3);
  body.rotation.x += (targetPitch - body.rotation.x) * Math.min(1, dt * 3);
  const fill = 0.6 + 2.4 * Math.min(1, Math.max(0, speed) / spec.maxSpeed);
  boat.userData.sails.forEach((sail, i) => {
    sail.scale.z += (fill + Math.sin(t * 3 + i) * 0.15 - sail.scale.z) * Math.min(1, dt * 2.5);
  });
  boat.userData.flags.forEach((flag) => {
    flag.rotation.y = Math.PI / 2 + Math.sin(t * 6) * 0.25;
    flag.rotation.x = Math.sin(t * 4.3) * 0.12;
  });
  if (boat.userData.wheel) boat.userData.wheel.rotation.z += (turn * 1.2 - boat.userData.wheel.rotation.z) * Math.min(1, dt * 4);
}

function boatProbeBlocked(x, z, spec) {
  return !boatSpotIsWater(x, z, spec.beam * 0.35);
}

function updateBoat(dt) {
  if (!activeBoat) {
    isHelming = false;
    return;
  }
  const spec = activeBoat.userData.spec;
  const accel = keys.has("KeyW") || keys.has("ArrowUp") ? 1 : keys.has("KeyS") || keys.has("ArrowDown") ? -1 : 0;
  const turn = keys.has("KeyD") || keys.has("ArrowRight") ? -1 : keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0;

  if (accel !== 0) {
    boatVelocity = clamp(boatVelocity + accel * dt * spec.accel, -spec.maxSpeed * 0.3, spec.maxSpeed);
  } else {
    boatVelocity *= Math.pow(0.965, dt * 30);
    if (Math.abs(boatVelocity) < 0.3) boatVelocity = 0;
  }
  // Steering bites harder as the boat picks up speed; a little at rest so you can line up.
  const steer = Math.min(1, 0.25 + Math.abs(boatVelocity) / (spec.maxSpeed * 0.45));
  boatYaw += turn * spec.turn * steer * dt * (boatVelocity < -1 ? -1 : 1);

  const forward = new THREE.Vector3(Math.sin(boatYaw), 0, Math.cos(boatYaw));
  const step = boatVelocity * dt;
  const next = activeBoat.position.clone().addScaledVector(forward, step);
  const probeDist = (boatVelocity >= 0 ? 1 : -1) * spec.length * 0.5;
  const probe = next.clone().addScaledVector(forward, probeDist);
  boatBumpCooldown = Math.max(0, boatBumpCooldown - dt);
  if (Math.abs(step) > 0 && boatProbeBlocked(probe.x, probe.z, spec)) {
    if (Math.abs(boatVelocity) > 25 && boatBumpCooldown <= 0) {
      audio.playImpact();
      cameraShake = Math.max(cameraShake, Math.min(1.2, Math.abs(boatVelocity) / 120));
      createSplashEffect(probe.clone());
      log("Your boat ran into the shore. Back off with S, or press G to step ashore.");
      boatBumpCooldown = 1.2;
    }
    boatVelocity = -boatVelocity * 0.2;
  } else {
    activeBoat.position.copy(next);
  }
  activeBoat.rotation.y = boatYaw;
  animateBoat(activeBoat, dt, boatVelocity, turn);
  placePlayerAtHelm();

  if (Math.abs(boatVelocity) > 18 && Math.random() < 0.28) {
    createSplashEffect(activeBoat.position.clone().addScaledVector(forward, -spec.length * 0.55));
  }
  if (boatVelocity > 30 && Math.random() < 0.12) {
    const side = new THREE.Vector3(forward.z, 0, -forward.x).multiplyScalar((Math.random() < 0.5 ? -1 : 1) * spec.beam * 0.55);
    createSplashEffect(activeBoat.position.clone().addScaledVector(forward, spec.length * 0.35).add(side));
  }
  updateCamera();
}

// Per frame: moored-boat motion, the "board" prompt and the sailing gauge.
function updateBoatUi(dt) {
  if (!boatUiRefs) {
    boatUiRefs = {
      board: document.getElementById("boat-board"),
      hud: document.getElementById("sail-hud"),
      name: document.getElementById("sail-hud-name"),
      speed: document.getElementById("sail-speed-value"),
      fill: document.getElementById("sail-speed-fill"),
      heading: document.getElementById("sail-heading"),
      ashore: document.getElementById("sail-ashore"),
    };
    boatUiRefs.board?.addEventListener("click", () => { if (gameStarted && !isHelming) toggleHelm(); });
    boatUiRefs.ashore?.addEventListener("click", () => { if (gameStarted && isHelming) unhelmBoat(); });
  }
  const refs = boatUiRefs;
  if (activeBoat && !isHelming && dt > 0) animateBoat(activeBoat, dt, 0, 0);
  const canBoard = !!activeBoat && !isHelming && gameStarted && player.health > 0
    && boatBoardDistance() <= activeBoat.userData.spec.length * 0.5 + 34;
  refs.board?.classList.toggle("hidden", !canBoard);
  refs.hud?.classList.toggle("hidden", !isHelming || !activeBoat);
  document.body.classList.toggle("is-sailing", isHelming && !!activeBoat);
  if (!isHelming || !activeBoat || !refs.hud) return;
  const spec = activeBoat.userData.spec;
  if (refs.name && refs.name.dataset.type !== activeBoat.userData.boatType) {
    refs.name.dataset.type = activeBoat.userData.boatType;
    refs.name.textContent = typeof tr === "function" ? tr(spec.name) : spec.name;
  }
  const knots = Math.round(Math.abs(boatVelocity) / 6);
  if (refs.speed && refs.speed.textContent !== String(knots)) refs.speed.textContent = String(knots);
  if (refs.fill) refs.fill.style.transform = `scaleX(${Math.min(1, Math.abs(boatVelocity) / spec.maxSpeed).toFixed(3)})`;
  refs.hud.classList.toggle("is-reversing", boatVelocity < -1);
  if (refs.heading) {
    const deg = ((Math.atan2(Math.sin(boatYaw), -Math.cos(boatYaw)) * 180) / Math.PI + 360) % 360;
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const label = dirs[Math.round(deg / 45) % 8];
    if (refs.heading.textContent !== label) refs.heading.textContent = label;
  }
}

// Hands on the wheel while sailing (runs after the normal idle animation).
function holdShipWheelPose() {
  const parts = playerMesh.children[0]?.userData?.parts;
  if (!parts) return;
  const sway = Math.sin(performance.now() * 0.002) * 0.05;
  ["leftArm", "rightArm"].forEach((name, i) => {
    if (!parts[name]) return;
    parts[name].rotation.x = -1.05 + sway;
    parts[name].rotation.z = (i === 0 ? 1 : -1) * 0.18;
  });
  if (parts.leftForearm) parts.leftForearm.rotation.x = -0.55;
  if (parts.rightForearm) parts.rightForearm.rotation.x = -0.55;
}

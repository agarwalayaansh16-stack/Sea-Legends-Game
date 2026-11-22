
// ── 41-sea-combat.js ─ Ship cannons and raider ships that patrol the waters around each island.
// One tier per island: raiders near harder islands are tougher and pay more.
var RAIDER_TIERS = [
  { hp: 180, damage: 8, money: 90, xp: 80, speed: 58, type: "sailor" },
  { hp: 420, damage: 16, money: 160, xp: 380, speed: 64, type: "sailor" },
  { hp: 800, damage: 28, money: 250, xp: 760, speed: 70, type: "brigade" },
  { hp: 1400, damage: 42, money: 720, xp: 3400, speed: 74, type: "brigade" },
  { hp: 2400, damage: 60, money: 1360, xp: 7200, speed: 78, type: "brigade" },
];
// Player cannons per boat: balls per volley, damage per ball, seconds between volleys.
var BOAT_CANNONS = {
  dinghy: { balls: 1, damage: 26, reload: 2.0 },
  sailor: { balls: 2, damage: 30, reload: 1.7 },
  brigade: { balls: 3, damage: 34, reload: 1.4 },
};
var CANNON_RANGE = 300;
var CANNON_GRAVITY = 70;
var seaRaiders = [];
var cannonballs = [];
var playerCannonReload = 0;
var seaCombatReady = false;
var cannonballGeo = null;
var cannonballMat = null;

function cannonDamageBonus() {
  // Gun training helps with cannons too.
  return 1 + Math.max(0, (player.stats?.gun || 1) - 1) * 0.04;
}

function makeRaiderHealthBar() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 20;
  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  sprite.scale.set(22, 3.4, 1);
  sprite.renderOrder = 10;
  sprite.userData.canvas = canvas;
  return sprite;
}

function drawRaiderHealth(raider) {
  const sprite = raider.bar;
  const c = sprite.userData.canvas;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "rgba(5,16,25,0.85)";
  ctx.fillRect(0, 0, c.width, c.height);
  const f = Math.max(0, raider.hp / raider.maxHp);
  ctx.fillStyle = f > 0.5 ? "#e0453a" : f > 0.25 ? "#f08a3a" : "#ffd25a";
  ctx.fillRect(3, 3, (c.width - 6) * f, c.height - 6);
  sprite.material.map.needsUpdate = true;
}

function spawnRaider(raider) {
  const isl = islands[raider.tierIndex];
  const spec = BOAT_SPECS[raider.tier.type];
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const a = Math.random() * Math.PI * 2;
    const r = isl.radius + 260 + Math.random() * 260;
    const guess = new THREE.Vector3(isl.position.x + Math.cos(a) * r, 0, isl.position.z + Math.sin(a) * r);
    const spot = findOpenWaterNear(guess, spec.length * 0.7, 240);
    if (spot && spot.distanceTo(playerMesh.position) > 400) {
      raider.home.copy(spot);
      raider.group.position.set(spot.x, boatSurfaceY(raider.group), spot.z);
      break;
    }
  }
  raider.hp = raider.maxHp;
  raider.alive = true;
  raider.sinkT = 0;
  raider.yaw = Math.random() * Math.PI * 2;
  raider.group.rotation.set(0, raider.yaw, 0);
  raider.group.userData.body.rotation.set(0, 0, 0);
  raider.group.visible = true;
  raider.reload = 2 + Math.random() * 2;
  raider.wanderTarget = null;
  drawRaiderHealth(raider);
}

function setupSeaCombat() {
  if (seaCombatReady || !islands.length || !scene) return;
  seaCombatReady = true;
  cannonballGeo = new THREE.SphereGeometry(0.9, 10, 8);
  cannonballMat = new THREE.MeshStandardMaterial({ color: 0x1d1f24, roughness: 0.35, metalness: 0.6 });
  RAIDER_TIERS.forEach((tier, tierIndex) => {
    if (!islands[tierIndex]) return;
    const count = tierIndex === 0 ? 1 : 2;
    for (let n = 0; n < count; n += 1) {
      const group = createBoat(tier.type, { sailColor: "#2a1414", emblem: "#d23b2e", flagColor: 0xb3261e });
      group.userData.isRaider = true;
      const bar = makeRaiderHealthBar();
      bar.position.set(0, BOAT_SPECS[tier.type].depth * 6 + 8, 0);
      group.add(bar);
      scene.add(group);
      const raider = { group, bar, tier, tierIndex, maxHp: tier.hp, hp: tier.hp, alive: true, yaw: 0, speed: 0, reload: 3, home: new THREE.Vector3(), wanderTarget: null, sinkT: 0, respawn: 0 };
      spawnRaider(raider);
      seaRaiders.push(raider);
    }
  });
}

function raiderAhead(raider, dist) {
  const p = raider.group.position;
  return { x: p.x + Math.sin(raider.yaw) * dist, z: p.z + Math.cos(raider.yaw) * dist };
}

function steerRaider(raider, target, dt, speedFactor) {
  const spec = raider.group.userData.spec;
  const p = raider.group.position;
  let want = Math.atan2(target.x - p.x, target.z - p.z);
  // Look ahead; turn away from land.
  const probe = raiderAhead(raider, spec.length * 0.6 + 30);
  if (!boatSpotIsWater(probe.x, probe.z, spec.beam * 0.4)) {
    const left = raider.yaw + 0.9;
    const pl = { x: p.x + Math.sin(left) * 60, z: p.z + Math.cos(left) * 60 };
    want = boatSpotIsWater(pl.x, pl.z, 4) ? left : raider.yaw - 0.9;
    raider.wanderTarget = null;
  }
  let diff = want - raider.yaw;
  diff = Math.atan2(Math.sin(diff), Math.cos(diff));
  const turn = Math.sign(diff) * Math.min(Math.abs(diff), 0.9 * dt);
  raider.yaw += turn;
  const targetSpeed = raider.tier.speed * speedFactor;
  raider.speed += (targetSpeed - raider.speed) * Math.min(1, dt * 0.8);
  const nx = p.x + Math.sin(raider.yaw) * raider.speed * dt;
  const nz = p.z + Math.cos(raider.yaw) * raider.speed * dt;
  const front = { x: nx + Math.sin(raider.yaw) * spec.length * 0.5, z: nz + Math.cos(raider.yaw) * spec.length * 0.5 };
  if (boatSpotIsWater(front.x, front.z, spec.beam * 0.3)) {
    p.x = nx;
    p.z = nz;
  } else {
    raider.speed *= 0.3;
  }
  raider.group.rotation.y = raider.yaw;
  animateBoat(raider.group, dt, raider.speed, Math.sign(turn) * Math.min(1, Math.abs(turn) / (0.9 * dt + 1e-6)));
}

function fireCannonball(from, to, damage, owner, raider) {
  const flat = Math.hypot(to.x - from.x, to.z - from.z);
  const time = Math.max(0.6, flat / 190);
  const vel = new THREE.Vector3(
    (to.x - from.x) / time,
    (to.y - from.y + 0.5 * CANNON_GRAVITY * time * time) / time,
    (to.z - from.z) / time,
  );
  const mesh = new THREE.Mesh(cannonballGeo, cannonballMat);
  mesh.position.copy(from);
  mesh.castShadow = true;
  scene.add(mesh);
  cannonballs.push({ mesh, vel, damage, owner, raider, life: time + 1.5 });
  // Muzzle flash and smoke
  const flash = glowSprite(0xffb347, 7, 0.9, getStarTexture());
  flash.position.copy(from);
  scene.add(flash);
  let f = 0;
  const fade = () => {
    f += 1;
    flash.material.opacity = Math.max(0, 0.9 - f * 0.12);
    flash.scale.multiplyScalar(1.06);
    if (f < 8) requestAnimationFrame(fade); else { scene.remove(flash); flash.material.dispose(); }
  };
  requestAnimationFrame(fade);
}

// Where a raider will be when a ball fired now lands.
function raiderLeadPoint(raider) {
  const p = raider.group.position;
  const flight = Math.max(0.6, Math.hypot(p.x - playerMesh.position.x, p.z - playerMesh.position.z) / 190);
  return p.clone().add(new THREE.Vector3(Math.sin(raider.yaw), 0, Math.cos(raider.yaw)).multiplyScalar(raider.speed * flight));
}

// True when a point is inside a ship's hull outline (a box along its length), with a little slack.
function pointHitsShip(point, shipPos, yaw, spec, slack = 3) {
  const dx = point.x - shipPos.x;
  const dz = point.z - shipPos.z;
  const along = dx * Math.sin(yaw) + dz * Math.cos(yaw);
  const across = dx * Math.cos(yaw) - dz * Math.sin(yaw);
  return Math.abs(along) < spec.length * 0.5 + slack && Math.abs(across) < spec.beam * 0.5 + slack && point.y < shipPos.y + spec.depth * 3;
}

function nearestRaider(maxDist) {
  let best = null;
  let bestD = maxDist;
  seaRaiders.forEach((r) => {
    if (!r.alive) return;
    const d = r.group.position.distanceTo(playerMesh.position);
    if (d < bestD) { bestD = d; best = r; }
  });
  return best;
}

// The spot on the sea (or the raider ship) under the pointer.
var cannonRaycaster = null;
function cannonAimFromPointer(x, y) {
  if (!camera || !renderer) return null;
  const rect = renderer.domElement.getBoundingClientRect();
  const ndc = new THREE.Vector2(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
  cannonRaycaster = cannonRaycaster || new THREE.Raycaster();
  cannonRaycaster.setFromCamera(ndc, camera);
  const ships = seaRaiders.filter((r) => r.alive).map((r) => r.group);
  const hit = cannonRaycaster.intersectObjects(ships, true)[0];
  if (hit) {
    let node = hit.object;
    while (node && !node.userData.isRaider) node = node.parent;
    if (node) return node.position.clone();
  }
  const sea = new THREE.Plane(new THREE.Vector3(0, 1, 0), -OCEAN_SURFACE_Y);
  const point = new THREE.Vector3();
  return cannonRaycaster.ray.intersectPlane(sea, point) ? point : null;
}

// Fired with left click, R or the Attack button while at the helm.
function fireBoatCannons(event) {
  if (!activeBoat || playerCannonReload > 0) return;
  const cfg = BOAT_CANNONS[activeBoat.userData.boatType] || BOAT_CANNONS.dinghy;
  const spec = activeBoat.userData.spec;
  // Aim at the clicked spot when it is water within range, else at the nearest raider, else straight ahead.
  let aim = event && event.clientX !== undefined ? cannonAimFromPointer(event.clientX, event.clientY) : null;
  if (aim && aim.distanceTo(activeBoat.position) > CANNON_RANGE * 1.3) aim = null;
  const target = nearestRaider(CANNON_RANGE);
  if (!aim && target) aim = raiderLeadPoint(target);
  if (!aim) aim = activeBoat.position.clone().add(new THREE.Vector3(Math.sin(boatYaw), 0, Math.cos(boatYaw)).multiplyScalar(160));
  aim.y = OCEAN_SURFACE_Y;
  const toAim = new THREE.Vector3(aim.x - activeBoat.position.x, 0, aim.z - activeBoat.position.z).normalize();
  const side = new THREE.Vector3(Math.cos(boatYaw), 0, -Math.sin(boatYaw));
  const sideSign = side.dot(toAim) >= 0 ? 1 : -1;
  for (let i = 0; i < cfg.balls; i += 1) {
    const along = (i - (cfg.balls - 1) / 2) * spec.length * 0.2;
    const from = activeBoat.position.clone()
      .addScaledVector(side, sideSign * spec.beam * 0.5)
      .add(new THREE.Vector3(Math.sin(boatYaw) * along, spec.depth + 1.5, Math.cos(boatYaw) * along));
    const spread = new THREE.Vector3((Math.random() - 0.5) * 6, 0, (Math.random() - 0.5) * 6);
    pendingCannonShots.push({ delay: i * 0.11, from, to: aim.clone().add(spread), damage: Math.round(cfg.damage * cannonDamageBonus()) });
  }
  playerCannonReload = cfg.reload;
  audio.playShot();
  cameraShake = Math.max(cameraShake, 0.35);
  if (!target && !seaCombatHintShown) {
    seaCombatHintShown = true;
    log("Cannons fire at the spot you click, or at the nearest raider ship. Raiders patrol the waters around every island.");
  }
}
var seaCombatHintShown = false;
var pendingCannonShots = [];

function sinkRaider(raider) {
  raider.alive = false;
  raider.sinkT = 0;
  raider.respawn = 75;
  player.money += raider.tier.money;
  addXp(raider.tier.xp);
  addMasteryXp?.("gun", 40);
  audio.playQuestComplete();
  const pos = raider.group.position.clone().add(new THREE.Vector3(0, 14, 0));
  createFloatingText(pos, `${tr("Raider sunk!")} +$${raider.tier.money} +${raider.tier.xp} XP`, "#ffd25a");
  log(`${tr("Raider sunk!")} +$${raider.tier.money}, +${raider.tier.xp} XP.`);
  updateHud();
}

function updateCannonballs(dt) {
  for (let i = cannonballs.length - 1; i >= 0; i -= 1) {
    const b = cannonballs[i];
    b.vel.y -= CANNON_GRAVITY * dt;
    b.mesh.position.addScaledVector(b.vel, dt);
    b.life -= dt;
    let hit = false;
    if (b.owner === "player") {
      for (const r of seaRaiders) {
        if (!r.alive) continue;
        if (pointHitsShip(b.mesh.position, r.group.position, r.yaw, r.group.userData.spec)) {
          r.hp -= b.damage;
          createFloatingText(b.mesh.position.clone().add(new THREE.Vector3(0, 4, 0)), `-${b.damage}`, "#ffb347");
          createSplashEffect(b.mesh.position.clone());
          audio.playImpact();
          drawRaiderHealth(r);
          if (r.hp <= 0) sinkRaider(r);
          hit = true;
          break;
        }
      }
    } else if (isHelming && activeBoat) {
      if (pointHitsShip(b.mesh.position, activeBoat.position, boatYaw, activeBoat.userData.spec)) {
        createSplashEffect(b.mesh.position.clone());
        damagePlayer(b.damage, "Raider cannon");
        hit = true;
      }
    }
    if (!hit && b.mesh.position.y <= OCEAN_SURFACE_Y) {
      createSplashEffect(b.mesh.position.clone());
      hit = true;
    }
    if (hit || b.life <= 0) {
      scene.remove(b.mesh);
      cannonballs.splice(i, 1);
    }
  }
}

function updateSeaCombat(dt) {
  if (!gameStarted) return;
  if (!seaCombatReady) setupSeaCombat();
  playerCannonReload = Math.max(0, playerCannonReload - dt);
  for (let i = pendingCannonShots.length - 1; i >= 0; i -= 1) {
    const s = pendingCannonShots[i];
    s.delay -= dt;
    if (s.delay <= 0) {
      pendingCannonShots.splice(i, 1);
      if (activeBoat) fireCannonball(s.from, s.to, s.damage, "player");
    }
  }
  updateCannonballs(dt);
  const helmPos = isHelming && activeBoat ? activeBoat.position : null;
  seaRaiders.forEach((raider) => {
    const g = raider.group;
    if (!raider.alive) {
      if (raider.sinkT < 5) {
        raider.sinkT += dt;
        g.position.y -= dt * 3.2;
        g.userData.body.rotation.z = Math.min(1.1, g.userData.body.rotation.z + dt * 0.3);
        if (raider.sinkT >= 5) g.visible = false;
      }
      raider.respawn -= dt;
      if (raider.respawn <= 0) spawnRaider(raider);
      return;
    }
    const distToPlayer = helmPos ? g.position.distanceTo(helmPos) : Infinity;
    // Skip far-away raiders that nobody can see; they wait where they are.
    if (!helmPos && g.position.distanceTo(playerMesh.position) > 1600) return;
    if (distToPlayer < 380) {
      // Circle the player at cannon range and fire.
      const toPlayer = Math.atan2(helmPos.x - g.position.x, helmPos.z - g.position.z);
      const orbit = toPlayer + (distToPlayer > 170 ? 0.5 : 1.45);
      const target = { x: g.position.x + Math.sin(orbit) * 100, z: g.position.z + Math.cos(orbit) * 100 };
      steerRaider(raider, target, dt, 0.85);
      raider.reload -= dt;
      if (raider.reload <= 0 && distToPlayer < CANNON_RANGE) {
        raider.reload = 2.6 + Math.random() * 1.2;
        const spec = g.userData.spec;
        const lead = new THREE.Vector3(Math.sin(boatYaw), 0, Math.cos(boatYaw)).multiplyScalar(boatVelocity * 1.1);
        const aim = helmPos.clone().add(lead).add(new THREE.Vector3((Math.random() - 0.5) * 22, 0, (Math.random() - 0.5) * 22));
        aim.y = OCEAN_SURFACE_Y + 1;
        const from = g.position.clone().add(new THREE.Vector3(0, spec.depth + 2, 0));
        fireCannonball(from, aim, raider.tier.damage, "raider", raider);
        audio.playShot();
      }
    } else {
      // Patrol near home.
      if (!raider.wanderTarget || g.position.distanceTo(raider.wanderTarget) < 40) {
        const a = Math.random() * Math.PI * 2;
        raider.wanderTarget = raider.home.clone().add(new THREE.Vector3(Math.cos(a) * 180, 0, Math.sin(a) * 180));
      }
      steerRaider(raider, raider.wanderTarget, dt, 0.45);
    }
  });
}

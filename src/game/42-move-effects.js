
// ── 42-move-effects.js ─ Parry and executions, block pose, running style, water effects,
//    take-off/landing dust and activation effects for abilities, level-ups and quests.

var PARRY_WINDOW_MS = 280;      // block this soon before a blow lands to parry it
var EXECUTE_THRESHOLD = 0.1;    // parrying an enemy below 10% health executes it

// ===== Shared effect helpers =====
function puffSprite(color, size, opacity = 0.7) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: getGlowTexture(), color, transparent: true, opacity, depthWrite: false,
  }));
  sprite.scale.setScalar(size);
  return sprite;
}

function flatRing(color, opacity = 0.8, thin = false) {
  const geo = fxGeometry(thin ? "flatRingThin" : "flatRing", () => {
    const g = new THREE.RingGeometry(thin ? 0.93 : 0.82, 1, 48);
    g.rotateX(-Math.PI / 2);
    return g;
  });
  return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }));
}

function expandingRing(position, color, from, to, life, opacity = 0.8, thin = false) {
  const ring = flatRing(color, opacity, thin);
  ring.position.copy(position);
  addTimedEffect(ring, life, (mesh, p) => {
    mesh.scale.setScalar(from + (to - from) * (1 - (1 - p) ** 2));
    mesh.material.opacity = opacity * (1 - p);
  });
  return ring;
}

// Small balls thrown up that fall back under gravity (droplets, debris, confetti).
function burstParticles(origin, count, color, opts = {}) {
  const geo = fxGeometry(opts.flat ? "confetti" : "droplet", () => (opts.flat ? new THREE.PlaneGeometry(0.6, 0.35) : new THREE.SphereGeometry(0.28, 6, 4)));
  for (let i = 0; i < count; i += 1) {
    const c = Array.isArray(color) ? color[i % color.length] : color;
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 1, side: THREE.DoubleSide, depthWrite: false }));
    const a = Math.random() * Math.PI * 2;
    const out = (opts.spread || 10) * (0.4 + Math.random() * 0.6);
    const vel = new THREE.Vector3(Math.cos(a) * out, (opts.up || 22) * (0.6 + Math.random() * 0.6), Math.sin(a) * out);
    const spin = new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8);
    mesh.position.copy(origin);
    const size = (opts.size || 1) * (0.6 + Math.random() * 0.7);
    mesh.scale.setScalar(size);
    const floor = opts.floor ?? -Infinity;
    addTimedEffect(mesh, opts.life || 0.9, (m, p, dt) => {
      vel.y -= (opts.gravity || 60) * dt;
      m.position.addScaledVector(vel, dt);
      if (m.position.y < floor) { m.position.y = floor; vel.set(0, 0, 0); }
      if (opts.flat) { m.rotation.x += spin.x * dt; m.rotation.y += spin.y * dt; m.rotation.z += spin.z * dt; }
      m.material.opacity = p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3;
    });
  }
}

function groundDustColor() {
  const island = typeof getIslandUnderPlayer === "function" ? getIslandUnderPlayer() : null;
  return [0xb7a27a, 0x7d6a48, 0xc7ad80, 0xe6cf93, 0xf4f8fb][island?.index ?? 0] ?? 0xb7a27a;
}

function dustPuff(position, size = 3, color = groundDustColor(), drift = null) {
  const puff = puffSprite(color, size, 0.55);
  puff.position.copy(position);
  const d = drift || new THREE.Vector3((Math.random() - 0.5) * 4, 2.5, (Math.random() - 0.5) * 4);
  addTimedEffect(puff, 0.6, (m, p, dt) => {
    m.position.addScaledVector(d, dt);
    m.scale.setScalar(size * (1 + p * 1.4));
    m.material.opacity = 0.55 * (1 - p);
  });
}

// ===== Parry and executions =====
PLAYER_ACTIONS.parry = {
  dur: 0.42, blendIn: 0.04, blendOut: 0.2, events: { clash: 0.12 },
  keys: [
    { t: 0.12, ease: "out", rAx: -1.75, rAz: -0.55, rF: -0.6, rH: 0.4, lAx: -1.1, lAz: 0.35, lF: -1.6, yaw: 0.35, tX: -0.12, hX: -0.1, dip: 0.35 },
    { t: 0.45, ease: "smooth", rAx: -0.9, rAz: 0.6, rF: -0.4, lAx: -0.6, lF: -1.2, yaw: -0.4, tX: 0.08, lunge: 0.4, dip: 0.25 },
    { t: 0.8, rAx: -0.7, rF: -0.9, lAx: -0.6, lF: -1.4, yaw: 0, dip: 0.2 },
  ],
};

PLAYER_ACTIONS.execute = {
  dur: 0.62, blendIn: 0.05, blendOut: 0.25, events: { impact: 0.5 },
  keys: [
    { t: 0.25, ease: "smooth", rAx: -2.6, rAz: 0.3, rF: -0.5, lAx: -2.2, lAz: -0.3, lF: -0.6, tX: -0.3, hX: -0.15, rise: 1.4, yaw: 0.2 },
    { t: 0.5, ease: "out", rAx: 0.5, rAz: -0.1, rF: -0.05, lAx: 0.3, lF: -0.2, tX: 0.55, lunge: 2.2, dip: 0.6, yaw: -0.15 },
    { t: 0.85, rAx: 0.2, rF: -0.3, lAx: 0.1, tX: 0.35, dip: 0.45 },
  ],
};

function parryClashPoint(attacker) {
  const head = playerMesh.position.clone().add(new THREE.Vector3(0, 7, 0));
  if (!attacker) return head.add(facingVector().multiplyScalar(4));
  const to = attacker.mesh.position.clone().setY(head.y).sub(head);
  return head.add(to.multiplyScalar(0.45));
}

function parryClashFx(point, gold) {
  const core = glowSprite(0xffffff, 9, 1, getStarTexture());
  core.position.copy(point);
  addTimedEffect(core, 0.28, (m, p) => {
    m.scale.setScalar(9 * (1 + p * 1.6));
    m.material.opacity = 1 - p;
    m.material.rotation = p * 1.2;
  });
  const halo = glowSprite(gold ? 0xffc94a : 0x9fe8ff, 16, 0.8);
  halo.position.copy(point);
  addTimedEffect(halo, 0.4, (m, p) => {
    m.scale.setScalar(16 * (0.6 + p));
    m.material.opacity = 0.8 * (1 - p);
  });
  const ring = new THREE.Mesh(
    fxGeometry("parryRing", () => new THREE.TorusGeometry(1, 0.07, 6, 48)),
    new THREE.MeshBasicMaterial({ color: 0xfff2c4, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  ring.position.copy(point);
  ring.lookAt(camera.position);
  addTimedEffect(ring, 0.35, (m, p) => {
    m.scale.setScalar(1 + p * 9);
    m.material.opacity = (1 - p) ** 1.5;
  });
  for (let i = 0; i < 16; i += 1) {
    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9 - 0.2, Math.random() - 0.5).normalize();
    spawnStreak(point, dir, i % 3 === 0 ? 0xffffff : 0xffc94a, 2 + Math.random() * 1.5, 55 + Math.random() * 35, 0.3, 0.14);
  }
}

function performParry(attacker, amount) {
  const point = parryClashPoint(attacker);
  playPlayerAction("parry");
  audio.playHaki();
  audio.playImpact();
  parryClashFx(point, true);
  hitStopTimer = Math.max(hitStopTimer, 0.18);
  cameraShake = Math.max(cameraShake, 0.6);
  flashScreen("parry");
  player.blockStartTime = -Infinity; // one parry per block press

  if (!attacker) {
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), tr("PARRY!"), "#ffe08a");
    return;
  }
  // Below 10% health: an execution.
  if (attacker.health / attacker.maxHealth < EXECUTE_THRESHOLD) {
    executeEnemy(attacker);
    return;
  }
  createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), tr("PERFECT PARRY!"), "#ffe08a");
  // The attacker reels back, open to a counter-attack.
  attacker.parryStun = 1.1;
  const anim = enemyAnimState(attacker);
  anim.pending = null;
  anim.attackT = -1;
  anim.flinchT = 0.7;
  const away = attacker.mesh.position.clone().sub(playerMesh.position).setY(0);
  if (away.lengthSq() > 1e-4) anim.knock = away.normalize().multiplyScalar(HEAVY_ENEMY_TYPES.has(attacker.type) ? 6 : 16);
  triggerHitFlash(attacker.mesh);
  const dizzy = glowSprite(0xffe27a, 3, 0.9, getStarTexture());
  addTimedEffect(dizzy, 1.1, (m, p) => {
    const a = p * Math.PI * 6;
    m.position.copy(attacker.mesh.position).add(new THREE.Vector3(Math.cos(a) * 3, 13 * attacker.mesh.scale.y, Math.sin(a) * 3));
    m.material.opacity = 0.9 * (1 - p);
  });
  // Defense mastery 5+: part of the blow is turned back on the attacker.
  if (player.mastery.defense >= 5 && amount > 0) {
    const reflected = Math.round(amount * 0.4);
    attacker.health -= reflected;
    createFloatingText(attacker.mesh.position.clone().add(new THREE.Vector3(0, 9, 0)), `${tr("Reflected")} -${reflected}`, "#ffe08a");
    if (attacker.health <= 0) defeatEnemy(attacker);
  }
}

function executeEnemy(enemy) {
  enemy.parryStun = 2;
  const anim = enemyAnimState(enemy);
  anim.pending = null;
  anim.attackT = -1;
  const toEnemy = enemy.mesh.position.clone().sub(playerMesh.position).setY(0);
  if (toEnemy.lengthSq() > 1e-4) faceAttackDirection(toEnemy.clone().normalize(), 0.8);
  hitStopTimer = Math.max(hitStopTimer, 0.22);
  createFloatingText(enemy.mesh.position.clone().add(new THREE.Vector3(0, 13, 0)), tr("EXECUTION!"), "#ff5a4a");
  playPlayerAction("execute", {
    impact: () => {
      if (!enemy.alive) return;
      const hit = enemy.mesh.position.clone().add(new THREE.Vector3(0, 6, 0));
      // A crimson X slash, a shock ring and a burst of embers.
      [0.75, -0.75].forEach((roll) => {
        const slash = new THREE.Mesh(
          fxGeometry("execSlash", () => new THREE.PlaneGeometry(18, 1.4)),
          new THREE.MeshBasicMaterial({ color: 0xff3b2f, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
        );
        slash.position.copy(hit);
        slash.lookAt(camera.position);
        slash.rotateZ(roll);
        addTimedEffect(slash, 0.45, (m, p) => {
          m.scale.set(0.3 + p * 1.2, 1 - p * 0.6, 1);
          m.material.opacity = 1 - p;
        });
      });
      parryClashFx(hit, false);
      expandingRing(enemy.mesh.position.clone().add(new THREE.Vector3(0, 0.4, 0)), 0xff5a4a, 2, 26, 0.6, 0.9);
      burstParticles(hit, 22, [0xff5a3a, 0xffb347, 0xffe08a], { spread: 18, up: 26, life: 0.9, size: 0.8 });
      cameraShake = Math.max(cameraShake, 1.2);
      flashScreen("execute");
      audio.playImpact();
      audio.playLevelUp();
      enemy.health = 0;
      defeatEnemy(enemy);
      log(tr("Execution! A perfect parry finished the enemy off."));
    },
  });
}

// ===== Block pose and shield =====
var blockShield = null;
function applyBlockPose(model, anim, dt) {
  const parts = model.userData.parts;
  const blocking = player.isBlocking && !player.isSwimming && !isHelming && player.health > 0;
  anim.blockW = THREE.MathUtils.lerp(anim.blockW || 0, blocking ? 1 : 0, 1 - Math.exp(-(blocking ? 18 : 10) * dt));
  const w = anim.blockW;
  if (w > 0.01) {
    const mix = (v, to) => v + (to - v) * w;
    const weapon = player.weapon;
    if (weapon === "sword") {
      // Blade held across the body.
      parts.rightArm.rotation.x = mix(parts.rightArm.rotation.x, -1.45);
      parts.rightArm.rotation.z = mix(parts.rightArm.rotation.z, -0.55);
      parts.rightForearm.rotation.x = mix(parts.rightForearm.rotation.x, -1.1);
      parts.leftArm.rotation.x = mix(parts.leftArm.rotation.x, -0.9);
      parts.leftForearm.rotation.x = mix(parts.leftForearm.rotation.x, -1.6);
    } else {
      // Forearms crossed in front of the face.
      parts.rightArm.rotation.x = mix(parts.rightArm.rotation.x, -1.55);
      parts.rightArm.rotation.z = mix(parts.rightArm.rotation.z, -0.35);
      parts.leftArm.rotation.x = mix(parts.leftArm.rotation.x, -1.55);
      parts.leftArm.rotation.z = mix(parts.leftArm.rotation.z, 0.35);
      parts.rightForearm.rotation.x = mix(parts.rightForearm.rotation.x, -1.9);
      parts.leftForearm.rotation.x = mix(parts.leftForearm.rotation.x, -1.9);
    }
    parts.torso.rotation.x = mix(parts.torso.rotation.x, 0.12);
    parts.leftShin.rotation.x = mix(parts.leftShin.rotation.x, 0.35);
    parts.rightShin.rotation.x = mix(parts.rightShin.rotation.x, 0.35);
  }
  // A shimmering shield disc in front of the player.
  if (!blockShield) {
    const geo = new THREE.CircleGeometry(5.5, 40);
    blockShield = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: 0x8fdcff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(5.5, 0.12, 6, 48), new THREE.MeshBasicMaterial({ color: 0xd8f6ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    blockShield.add(rim);
    blockShield.userData.rim = rim;
    scene.add(blockShield);
  }
  const fresh = player.isBlocking && performance.now() - player.blockStartTime < PARRY_WINDOW_MS;
  blockShield.visible = w > 0.02;
  if (blockShield.visible) {
    const f = facingVector();
    blockShield.position.copy(playerMesh.position).add(new THREE.Vector3(f.x * 4.5, 6.5, f.z * 4.5));
    blockShield.rotation.set(0, playerMesh.rotation.y, 0);
    const pulse = 0.5 + Math.sin(performance.now() * 0.012) * 0.5;
    blockShield.material.opacity = w * (fresh ? 0.35 : 0.12 + pulse * 0.05);
    blockShield.material.color.setHex(fresh ? 0xffe08a : 0x8fdcff);
    blockShield.userData.rim.material.opacity = w * (fresh ? 1 : 0.55);
    blockShield.userData.rim.material.color.setHex(fresh ? 0xfff2c4 : 0xd8f6ff);
    blockShield.scale.setScalar(0.7 + w * 0.3);
  }
}

// ===== Running style and footstep dust =====
var runFx = { stepSide: null };
function applyRunStyle(model, anim, moving, groundSpeed, dt) {
  const parts = model.userData.parts;
  const grounded = isGrounded && !player.isSwimming && (anim.air || 0) < 0.3;
  const runTarget = moving && grounded ? THREE.MathUtils.clamp((groundSpeed - 32) / 38, 0, 1) : 0;
  anim.runW = THREE.MathUtils.lerp(anim.runW || 0, runTarget, 1 - Math.exp(-8 * dt));
  const w = anim.runW;
  if (w > 0.01 && !(anim.attackTimer > 0) && !(anim.blockW > 0.3)) {
    const ph = anim.walkPhase;
    // Lean into the run, pump the arms with bent elbows, lift the knees.
    parts.torso.rotation.x += 0.2 * w;
    parts.head.rotation.x = (parts.head.rotation.x || 0) - 0.12 * w;
    const pump = Math.sin(ph + Math.PI) * 0.55 * w;
    parts.leftArm.rotation.x += pump;
    parts.rightArm.rotation.x -= pump;
    parts.leftForearm.rotation.x -= 0.55 * w;
    parts.rightForearm.rotation.x -= anim.attackTimer > 0 ? 0 : 0.55 * w;
    parts.leftLeg.rotation.x -= Math.max(0, -Math.sin(ph)) * 0.35 * w;
    parts.rightLeg.rotation.x -= Math.max(0, Math.sin(ph)) * 0.35 * w;
    parts.torso.position.y += Math.abs(Math.sin(ph)) * 0.25 * w;
  }
  // Kick up dust with each footfall when moving fast.
  const side = Math.sin(anim.walkPhase) > 0;
  if (runFx.stepSide !== null && side !== runFx.stepSide && grounded && groundSpeed > 40) {
    const footSide = side ? 1 : -1;
    const f = facingVector();
    const right = new THREE.Vector3(f.z, 0, -f.x);
    const foot = playerMesh.position.clone().addScaledVector(right, footSide * 1.2).add(new THREE.Vector3(0, 0.6, 0));
    if (playerMesh.position.y > OCEAN_SURFACE_Y + 1.2) {
      dustPuff(foot, 2 + w * 1.5, groundDustColor(), f.clone().multiplyScalar(-6).add(new THREE.Vector3(0, 2, 0)));
    }
  }
  runFx.stepSide = side;
}

// ===== Take-off and landing =====
var moveFx = { takeoff: 0, landing: 0, wasSwimming: false, fallSpeed: 0, rippleT: 0, foamT: 0, wadeT: 0, haki: false, foresight: false, weapon: null, level: null };
function updateMoveFx(dt) {
  if (!gameStarted || !playerMesh) return;
  const feet = playerMesh.position.clone().add(new THREE.Vector3(0, 0.4, 0));
  if (jumpState.takeoffTimer > moveFx.takeoff + 0.01 && !player.isSwimming) {
    for (let i = 0; i < 4; i += 1) {
      const a = (i / 4) * Math.PI * 2;
      dustPuff(feet, 2.2, groundDustColor(), new THREE.Vector3(Math.cos(a) * 7, 1.5, Math.sin(a) * 7));
    }
  }
  if (jumpState.landingTimer > moveFx.landing + 0.01 && !player.isSwimming && playerMesh.position.y > OCEAN_SURFACE_Y + 1.2) {
    const s = jumpState.landingStrength || 0.5;
    expandingRing(feet, 0xf2ead8, 1, 6 + s * 8, 0.4, 0.45 * s + 0.2, true);
    const count = Math.round(4 + s * 6);
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2;
      dustPuff(feet, 2 + s * 2, groundDustColor(), new THREE.Vector3(Math.cos(a) * (8 + s * 8), 1 + s * 2, Math.sin(a) * (8 + s * 8)));
    }
  }
  moveFx.takeoff = jumpState.takeoffTimer;
  moveFx.landing = jumpState.landingTimer;
  if (!player.isSwimming && !isGrounded) moveFx.fallSpeed = Math.max(0, -verticalVelocity);
  updateWaterFx(dt);
  updateAbilityFx();
}

// ===== Water: entry splash, swimming wake, wading ripples =====
function waterSplashSound(size) {
  if (!audio.enabled || !audio.ctx || typeof audio.noiseBurst !== "function") return;
  const now = audio.ctx.currentTime;
  audio.noiseBurst(now, 0.35 + size * 0.25, 0.12 + size * 0.12, "lowpass", 900 + size * 500, audio.ctx.destination);
  audio.noiseBurst(now + 0.05, 0.25, 0.05 + size * 0.05, "highpass", 2500, audio.ctx.destination);
}

function waterSplash(position, size = 1) {
  const surface = new THREE.Vector3(position.x, OCEAN_SURFACE_Y + 0.15, position.z);
  // Crown of water thrown up around the entry point.
  const crown = new THREE.Mesh(
    fxGeometry("splashCrown", () => new THREE.CylinderGeometry(1.25, 1, 1, 24, 1, true)),
    new THREE.MeshBasicMaterial({ color: 0xe8fbff, transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide }),
  );
  crown.position.copy(surface);
  addTimedEffect(crown, 0.55, (m, p) => {
    const r = (1.5 + p * 4.5) * size;
    m.scale.set(r, (6 * Math.sin(p * Math.PI)) * size + 0.1, r);
    m.position.y = surface.y + m.scale.y / 2;
    m.material.opacity = 0.85 * (1 - p);
  });
  burstParticles(surface.clone().add(new THREE.Vector3(0, 1, 0)), Math.round(18 + size * 16), [0xffffff, 0xd6f6ff, 0x9fe3f5], { spread: 9 * size, up: 26 * Math.sqrt(size), life: 1.0, gravity: 55, size: 1.1 * size, floor: OCEAN_SURFACE_Y });
  // A column of water shooting up from the centre, then collapsing.
  const column = new THREE.Mesh(
    fxGeometry("splashColumn", () => new THREE.SphereGeometry(1, 12, 10)),
    new THREE.MeshBasicMaterial({ color: 0xf4fdff, transparent: true, opacity: 0.9, depthWrite: false }),
  );
  column.position.copy(surface);
  addTimedEffect(column, 0.7, (m, p) => {
    const h = Math.sin(Math.min(1, p * 1.4) * Math.PI) * 9 * size;
    m.scale.set(1.3 * size * (1 - p * 0.5), Math.max(0.2, h), 1.3 * size * (1 - p * 0.5));
    m.position.y = surface.y + h * 0.5;
    m.material.opacity = 0.9 * (1 - p * p);
  });
  // White foam left on the surface.
  const foam = new THREE.Mesh(
    fxGeometry("splashFoam", () => { const g = new THREE.CircleGeometry(1, 28); g.rotateX(-Math.PI / 2); return g; }),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false }),
  );
  foam.position.copy(surface).add(new THREE.Vector3(0, 0.05, 0));
  addTimedEffect(foam, 2.2, (m, p) => {
    m.scale.setScalar((3 + p * 6) * size);
    m.material.opacity = 0.55 * (1 - p);
  });
  const mist = puffSprite(0xf2fcff, 11 * size, 0.6);
  mist.position.copy(surface).add(new THREE.Vector3(0, 2, 0));
  addTimedEffect(mist, 0.8, (m, p) => {
    m.scale.setScalar(11 * size * (1 + p));
    m.position.y = surface.y + 2 + p * 3;
    m.material.opacity = 0.6 * (1 - p);
  });
  [0, 0.12, 0.26].forEach((delay, i) => {
    setTimeout(() => expandingRing(surface, 0xffffff, 2 * size, (12 + i * 5) * size, 1.1, 0.7 - i * 0.15), delay * 1000);
  });
  waterSplashSound(size);
}

function updateWaterFx(dt) {
  if (isHelming) { moveFx.wasSwimming = false; return; }
  const pos = playerMesh.position;
  const swimming = player.isSwimming;
  // Entering the water: a splash sized by how fast you were falling.
  if (swimming && !moveFx.wasSwimming) {
    const size = THREE.MathUtils.clamp(0.6 + moveFx.fallSpeed / 70, 0.6, 2.2);
    waterSplash(pos, size);
    cameraShake = Math.max(cameraShake, Math.min(0.5, size * 0.2));
  }
  if (!swimming && moveFx.wasSwimming) {
    // Climbing out: water streams off.
    burstParticles(pos.clone().add(new THREE.Vector3(0, 5, 0)), 10, [0xd6f6ff, 0xffffff], { spread: 4, up: 6, life: 0.6, size: 0.6 });
  }
  moveFx.wasSwimming = swimming;
  if (swimming) moveFx.fallSpeed = 0;
  const moving = playerMoveState.velocity.lengthSq() > 30 || (swimming && (keys.has("KeyW") || keys.has("KeyA") || keys.has("KeyS") || keys.has("KeyD")));
  const surface = new THREE.Vector3(pos.x, OCEAN_SURFACE_Y + 0.12, pos.z);
  moveFx.rippleT -= dt;
  moveFx.foamT -= dt;
  if (swimming) {
    if (moveFx.rippleT <= 0) {
      moveFx.rippleT = moving ? 0.28 : 0.95;
      expandingRing(surface, 0xffffff, 2, moving ? 7 : 9, moving ? 0.9 : 1.6, moving ? 0.5 : 0.35, true);
    }
    if (moving && moveFx.foamT <= 0) {
      moveFx.foamT = 0.12;
      const f = facingVector();
      const side = new THREE.Vector3(f.z, 0, -f.x).multiplyScalar((Math.random() - 0.5) * 3);
      const foam = puffSprite(0xffffff, 2.4, 0.6);
      foam.position.copy(surface).addScaledVector(f, -2).add(side).add(new THREE.Vector3(0, 0.4, 0));
      addTimedEffect(foam, 0.9, (m, p) => {
        m.scale.setScalar(2.4 * (1 + p * 1.5));
        m.material.opacity = 0.6 * (1 - p);
      });
      // Arm strokes throw a few drops.
      if (Math.random() < 0.35) burstParticles(surface.clone().addScaledVector(f, 2).add(new THREE.Vector3(0, 0.8, 0)), 4, 0xe8fbff, { spread: 4, up: 8, life: 0.5, size: 0.5, floor: OCEAN_SURFACE_Y });
    }
    return;
  }
  // Wading through shallow water: ripples and small splashes at the feet.
  const wading = pos.y < OCEAN_SURFACE_Y + 1.4 && groundHeightAt(pos.x, pos.z) <= OCEAN_SURFACE_Y + 0.05;
  if (wading && moving && isGrounded) {
    moveFx.wadeT -= dt;
    if (moveFx.wadeT <= 0) {
      moveFx.wadeT = 0.2;
      expandingRing(surface, 0xffffff, 1.5, 6, 0.8, 0.5, true);
      burstParticles(surface.clone().add(new THREE.Vector3(0, 0.6, 0)), 5, [0xffffff, 0xd6f6ff], { spread: 5, up: 10, life: 0.5, size: 0.55, floor: OCEAN_SURFACE_Y });
    }
  }
}

// ===== Activation effects for abilities, weapons, level-ups and quests =====
function auraBurst(color, ringColor, power = 1) {
  const center = playerMesh.position.clone().add(new THREE.Vector3(0, 6, 0));
  const flash = glowSprite(color, 14 * power, 0.9);
  flash.position.copy(center);
  addTimedEffect(flash, 0.5, (m, p) => { m.scale.setScalar(14 * power * (0.6 + p)); m.material.opacity = 0.9 * (1 - p); });
  expandingRing(playerMesh.position.clone().add(new THREE.Vector3(0, 0.5, 0)), ringColor, 2, 22 * power, 0.6, 0.85);
  for (let i = 0; i < 14; i += 1) {
    const a = (i / 14) * Math.PI * 2;
    spawnStreak(center, new THREE.Vector3(Math.cos(a), 0.15 + Math.random() * 0.4, Math.sin(a)), ringColor, 2.4, 50, 0.35, 0.16);
  }
}

function levelUpFx() {
  const base = playerMesh.position.clone();
  const pillar = new THREE.Mesh(
    fxGeometry("lvlPillar", () => new THREE.CylinderGeometry(3.2, 3.2, 1, 24, 1, true)),
    new THREE.MeshBasicMaterial({ color: 0xffd25a, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  );
  addTimedEffect(pillar, 1.4, (m, p) => {
    m.position.copy(playerMesh.position).add(new THREE.Vector3(0, 0, 0));
    const h = 40 * Math.min(1, p * 3);
    m.scale.set(1 - p * 0.4, h, 1 - p * 0.4);
    m.position.y += h / 2;
    m.material.opacity = 0.6 * (1 - p);
  });
  [0, 0.2, 0.4].forEach((d) => setTimeout(() => expandingRing(playerMesh.position.clone().add(new THREE.Vector3(0, 0.5, 0)), 0xffd25a, 2, 18, 0.9, 0.9), d * 1000));
  for (let i = 0; i < 24; i += 1) {
    const mote = glowSprite(i % 2 ? 0xffe08a : 0xffffff, 1.6, 1, getStarTexture());
    const a = Math.random() * Math.PI * 2;
    const r = 2 + Math.random() * 4;
    addTimedEffect(mote, 1.2 + Math.random() * 0.6, (m, p) => {
      m.position.copy(playerMesh.position).add(new THREE.Vector3(Math.cos(a + p * 4) * r, p * 26, Math.sin(a + p * 4) * r));
      m.material.opacity = 1 - p;
    });
  }
  flashScreen("level");
}

function questCompleteFx() {
  burstParticles(playerMesh.position.clone().add(new THREE.Vector3(0, 12, 0)), 40, [0xffd25a, 0x59c7d8, 0xe0453a, 0x7be08f, 0xffffff], { flat: true, spread: 16, up: 20, gravity: 22, life: 2.2, size: 1.4 });
  auraBurst(0xffe08a, 0xffd25a, 0.8);
}

function weaponDrawFx() {
  const hand = playerHandWorldPosition?.("right");
  if (!hand) return;
  const glint = glowSprite(0xffffff, 3.5, 1, getStarTexture());
  glint.position.copy(hand);
  addTimedEffect(glint, 0.35, (m, p) => {
    m.position.copy(playerHandWorldPosition("right"));
    m.scale.setScalar(3.5 * (1 + Math.sin(p * Math.PI)));
    m.material.opacity = 1 - p;
    m.material.rotation = p * 3;
  });
}

// Watches state each frame, so the effects fire however the change happened (key, button or skill).
function updateAbilityFx() {
  const hakiOn = !!player.haki?.active;
  if (hakiOn && !moveFx.haki) auraBurst(0x6b3bd1, 0xb48cff, 1);
  moveFx.haki = hakiOn;
  const foresightOn = !!player.observationHaki?.active;
  if (foresightOn && !moveFx.foresight) {
    const eye = playerMesh.position.clone().add(new THREE.Vector3(0, 9, 0));
    const ring = new THREE.Mesh(
      fxGeometry("eyeRing", () => new THREE.TorusGeometry(1, 0.06, 6, 48)),
      new THREE.MeshBasicMaterial({ color: 0x7fe9ff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ring.position.copy(eye);
    ring.lookAt(camera.position);
    addTimedEffect(ring, 0.7, (m, p) => { m.scale.setScalar(1 + p * 30); m.material.opacity = 1 - p; });
    auraBurst(0x2fb7d8, 0x7fe9ff, 0.7);
  }
  moveFx.foresight = foresightOn;
  if (moveFx.weapon !== null && moveFx.weapon !== player.weapon) weaponDrawFx();
  moveFx.weapon = player.weapon;
  if (moveFx.level !== null && player.level > moveFx.level) levelUpFx();
  moveFx.level = player.level;
}

// Quest completion and enemy defeats get their own effects.
var __completeQuest = completeQuest;
completeQuest = function () { const r = __completeQuest.apply(this, arguments); questCompleteFx(); return r; };
var __completeMajorQuest = completeMajorQuest;
completeMajorQuest = function () { const r = __completeMajorQuest.apply(this, arguments); questCompleteFx(); return r; };
var __defeatEnemy = defeatEnemy;
defeatEnemy = function (enemy) {
  const r = __defeatEnemy.apply(this, arguments);
  if (enemy?.mesh) {
    const at = enemy.mesh.position.clone().add(new THREE.Vector3(0, 6, 0));
    const big = HEAVY_ENEMY_TYPES.has(enemy.type);
    const burst = glowSprite(big ? 0xffb347 : 0xfff0c8, big ? 16 : 8, 0.9, getStarTexture());
    burst.position.copy(at);
    addTimedEffect(burst, 0.4, (m, p) => { m.scale.setScalar((big ? 16 : 8) * (0.5 + p)); m.material.opacity = 0.9 * (1 - p); });
    for (let i = 0; i < (big ? 10 : 5); i += 1) {
      const wisp = glowSprite(0xcfe8ff, 1.8, 0.8);
      const a = Math.random() * Math.PI * 2;
      addTimedEffect(wisp, 1.1 + Math.random() * 0.4, (m, p) => {
        m.position.copy(at).add(new THREE.Vector3(Math.cos(a) * (1 + p * 3), p * 14, Math.sin(a) * (1 + p * 3)));
        m.material.opacity = 0.8 * (1 - p);
      });
    }
  }
  return r;
};

// ===== Screen flashes (styled in 57-polish.css) =====
var screenFlashEl = null;
function flashScreen(kind) {
  if (!screenFlashEl) {
    screenFlashEl = document.createElement("div");
    screenFlashEl.className = "screen-flash";
    screenFlashEl.setAttribute("aria-hidden", "true");
    document.body.append(screenFlashEl);
  }
  screenFlashEl.className = "screen-flash";
  void screenFlashEl.offsetWidth; // restart the animation
  screenFlashEl.classList.add(`is-${kind}`);
}

// ===== Dash: lean pose, afterimages along the path and speed streaks =====
PLAYER_ACTIONS["dash-lunge"] = {
  dur: 0.3, blendIn: 0.03, blendOut: 0.2,
  keys: [
    { t: 0.2, ease: "out", tX: 0.45, rAx: 0.7, lAx: 0.7, rAz: 0.3, lAz: -0.3, rF: -0.3, lF: -0.3, rLx: 0.5, lLx: -0.7, lS: 0.9, dip: 0.4 },
    { t: 1, tX: 0, rAx: -0.2, lAx: -0.2, dip: 0 },
  ],
};
var __dash = dash;
dash = function () {
  const start = playerMesh.position.clone();
  const before = player.dashCooldown;
  const r = __dash.apply(this, arguments);
  if (player.dashCooldown > before && playerMesh.position.distanceToSquared(start) > 1) {
    const end = playerMesh.position.clone();
    const dir = end.clone().sub(start).setY(0).normalize();
    playPlayerAction("dash-lunge");
    [0.25, 0.5, 0.75].forEach((f) => createFlashStepAfterimage(start.clone().lerp(end, f)));
    for (let i = 0; i < 8; i += 1) {
      const p = start.clone().lerp(end, Math.random()).add(new THREE.Vector3((Math.random() - 0.5) * 3, 2 + Math.random() * 8, (Math.random() - 0.5) * 3));
      spawnStreak(p, dir.clone().negate(), 0xe8f6ff, 4 + Math.random() * 3, 30, 0.25, 0.1);
    }
    audio.playFlashStep?.();
  }
  return r;
};

// ===== Enemy swings: a visible arc as the blow lands =====
function enemySwingFx(enemy, landed) {
  const s = enemy.mesh.scale.y || 1;
  const center = enemy.mesh.position.clone().add(new THREE.Vector3(0, 6 * s, 0));
  const toPlayer = playerMesh.position.clone().sub(enemy.mesh.position).setY(0);
  if (toPlayer.lengthSq() < 1e-4) return;
  toPlayer.normalize();
  const arc = new THREE.Mesh(
    fxGeometry("enemyArc", () => new THREE.RingGeometry(4.2, 5.6, 28, 1, -Math.PI * 0.45, Math.PI * 0.9)),
    new THREE.MeshBasicMaterial({ color: landed ? 0xff6a4a : 0xdfe7ea, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  );
  arc.position.copy(center);
  arc.lookAt(center.clone().add(new THREE.Vector3(0, 1, 0)));
  arc.rotateZ(Math.atan2(toPlayer.x, toPlayer.z) - Math.PI / 2);
  arc.scale.setScalar(s);
  addTimedEffect(arc, 0.25, (m, p) => {
    m.rotation.z += 0.12;
    m.material.opacity = 0.85 * (1 - p);
  });
  if (landed && player.health > 0) {
    const chest = playerMesh.position.clone().add(new THREE.Vector3(0, 6.5, 0));
    createFistImpact(chest, toPlayer, 0.7, 0xff6a4a);
  }
}

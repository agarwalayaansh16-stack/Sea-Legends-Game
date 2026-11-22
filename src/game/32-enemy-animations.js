// ── 32-enemy-animations.js ─ Enemy walk cycles, telegraphed strikes, flinches and defeat animation.
//
// The enemy AI (17-enemy-ai-and-damage.js) decides what enemies do; this layer
// watches them and poses their bodies to match:
//   - walking speed is read from how far each enemy moved this frame
//   - simple melee strikes are held back for a short wind-up, so the player can
//     see them coming and step away; they only land if the player is still in reach
//   - taking damage makes an enemy flinch and stagger back
//   - a defeated enemy falls over before it disappears

let enemyUpdateContext = null;   // the enemy whose AI is running right now
let enemyStrikeResolving = false; // true while a wound-up strike is being applied
let enemyStrikeAttacker = null;   // the enemy whose wound-up strike is being applied

const ENEMY_WINDUP = 0.42;        // seconds between the wind-up starting and the blow landing
const ENEMY_ATTACK_DURATION = 0.8;
const ENEMY_DEATH_FALL = 0.45;
const ENEMY_DEATH_TOTAL = 1.5;
// Heavy enemies don't get shoved around by ordinary hits.
const HEAVY_ENEMY_TYPES = new Set(["buggy", "brute", "gorilla_king", "yeti"]);
// Multi-hit combos and specials that have their own timing land immediately.
const IMMEDIATE_STRIKES = /Mace|Deadly|Rapid Rush|Meteor/;

function enemyAnimState(enemy) {
  if (!enemy.anim) {
    enemy.anim = {
      phase: Math.random() * 6, speed: 0, last: enemy.mesh.position.clone(),
      attackT: -1, pending: null, flinchT: 0, deathT: -1, wasAlive: true,
    };
    enemy.mesh.rotation.order = "YXZ"; // lets the whole enemy tip over backwards whichever way it faces
  }
  return enemy.anim;
}

// Called from damagePlayer(). Returns true when the strike has been queued behind
// a wind-up (the caller should not apply the damage yet).
function interceptEnemyStrike(amount, source) {
  const enemy = enemyUpdateContext;
  if (!enemy || enemyStrikeResolving || !enemy.alive) return false;
  const anim = enemyAnimState(enemy);
  if (IMMEDIATE_STRIKES.test(source || "")) {
    anim.attackT = ENEMY_WINDUP; // jump straight to the swing
    anim.pending = null;
    return false;
  }
  const distance = enemy.mesh.position.distanceTo(playerMesh.position);
  anim.attackT = 0;
  anim.pending = { amount, source, reach: Math.max(12, distance + 6) };
  // A red glint warns that a blow is coming.
  const glint = glowSprite(0xff4a3a, 3.5, 1, getStarTexture());
  glint.position.copy(enemy.mesh.position).add(new THREE.Vector3(0, 11 * enemy.mesh.scale.y, 0));
  addTimedEffect(glint, ENEMY_WINDUP, (mesh, p) => {
    mesh.position.copy(enemy.mesh.position).add(new THREE.Vector3(0, 11 * enemy.mesh.scale.y, 0));
    mesh.scale.setScalar(3.5 * (1.3 - p * 0.6));
    mesh.material.opacity = 1 - p * p;
    mesh.material.rotation = p * 2;
  });
  return true;
}

// Called from damageEnemy(): flinch and stagger away from the player.
function reactEnemyHit(enemy, damage) {
  if (!enemy.alive) return;
  const anim = enemyAnimState(enemy);
  anim.flinchT = 0.3;
  if (HEAVY_ENEMY_TYPES.has(enemy.type)) return;
  const away = enemy.mesh.position.clone().sub(playerMesh.position).setY(0);
  if (away.lengthSq() < 1e-4) return;
  anim.knock = away.normalize().multiplyScalar(Math.min(16, 7 + damage * 0.08));
}

// Called from defeatEnemy(): keep the body on screen while it falls.
function startEnemyDeath(enemy) {
  const anim = enemyAnimState(enemy);
  const model = enemy.mesh.children[0];
  if (!model?.userData?.parts) {
    enemy.mesh.visible = false;
    return;
  }
  anim.deathT = 0;
  anim.pending = null;
  anim.attackT = -1;
  enemy.mesh.visible = true;
}

function updateEnemyAnimations(dt) {
  if (dt <= 0) return;
  const px = playerMesh.position.x;
  const pz = playerMesh.position.z;
  const now = performance.now() * 0.001;
  for (let i = 0; i < enemies.length; i += 1) {
    const enemy = enemies[i];
    const group = enemy.mesh;
    const anim = enemyAnimState(enemy);

    if (!enemy.alive) {
      anim.wasAlive = false;
      if (anim.deathT < 0) continue;
      anim.deathT += dt;
      const fall = Math.min(1, anim.deathT / ENEMY_DEATH_FALL);
      group.rotation.x = -(Math.PI / 2) * (1 - (1 - fall) ** 2) * 0.96;
      if (!anim.landed && fall >= 1) {
        anim.landed = true;
        createDustCloud(group.position.clone());
      }
      // Sink into the ground at the end.
      const sink = Math.max(0, (anim.deathT - 1.0) / (ENEMY_DEATH_TOTAL - 1.0));
      group.position.y = anim.deathY - sink * 3.5 * group.scale.y;
      if (anim.deathT >= ENEMY_DEATH_TOTAL) {
        anim.deathT = -1;
        group.visible = false;
      }
      continue;
    }
    if (!anim.wasAlive) {
      // Respawned: stand back up.
      anim.wasAlive = true;
      anim.deathT = -1;
      anim.landed = false;
      anim.flinchT = 0;
      group.rotation.x = 0;
      group.visible = true;
      anim.last.copy(group.position);
    }
    anim.deathY = group.position.y;

    // Stagger from a hit.
    if (anim.knock) {
      group.position.addScaledVector(anim.knock, dt * 4);
      anim.knock.multiplyScalar(Math.max(0, 1 - dt * 9));
      if (anim.knock.lengthSq() < 0.05) anim.knock = null;
    }

    // Wound-up strike lands (or misses if the player got away).
    if (anim.attackT >= 0) {
      const before = anim.attackT;
      anim.attackT += dt;
      if (anim.pending && before < ENEMY_WINDUP && anim.attackT >= ENEMY_WINDUP) {
        const strike = anim.pending;
        anim.pending = null;
        if (group.position.distanceTo(playerMesh.position) <= strike.reach && player.health > 0) {
          enemyStrikeResolving = true;
          enemyStrikeAttacker = enemy;
          let dealt;
          try { dealt = damagePlayer(strike.amount, strike.source); } finally { enemyStrikeResolving = false; enemyStrikeAttacker = null; }
          enemySwingFx(enemy, dealt !== 0);
          updateHud();
        } else {
          enemySwingFx(enemy, false);
          createFloatingText(group.position.clone().add(new THREE.Vector3(0, 10, 0)), "Miss", "#cfd8dc");
        }
      }
      if (anim.attackT >= ENEMY_ATTACK_DURATION) anim.attackT = -1;
    }
    anim.flinchT = Math.max(0, anim.flinchT - dt);

    // Posing is skipped for enemies too far away to see clearly.
    const dx = group.position.x - px;
    const dz = group.position.z - pz;
    if (dx * dx + dz * dz > 420 * 420) {
      anim.last.copy(group.position);
      continue;
    }
    const model = group.children[0];
    const parts = model?.userData?.parts;
    if (!parts || !parts.leftShin) continue;

    // Walking speed from actual movement (teleports and knockback are ignored).
    const moved = Math.hypot(group.position.x - anim.last.x, group.position.z - anim.last.z);
    anim.last.copy(group.position);
    const speed = moved / dt;
    const target = speed > 200 ? 0 : speed;
    anim.speed += (target - anim.speed) * Math.min(1, dt * 10);
    const stride = THREE.MathUtils.clamp(anim.speed / 30, 0, 1.2);
    anim.phase += dt * (3 + anim.speed * 0.32);

    const swing = Math.sin(anim.phase) * 0.62 * stride;
    const breathe = Math.sin(now * 1.6 + i) * 0.03;
    let lLx = swing;
    let rLx = -swing;
    let lS = 0.05 + Math.max(0, -Math.cos(anim.phase)) * 0.95 * stride;
    let rS = 0.05 + Math.max(0, Math.cos(anim.phase)) * 0.95 * stride;
    let lAx = -swing * 0.8 + breathe;
    let rAx = swing * 0.8 - breathe;
    let lF = -0.2 - stride * 0.5;
    let rF = -0.2 - stride * 0.5;
    let rAz = 0.07;
    let tX = stride * 0.12;
    let tY = Math.sin(anim.phase) * 0.1 * stride;
    let hX = 0;
    let lean = 0;

    if (anim.attackT >= 0) {
      const t = anim.attackT;
      let w; // 0 = rest, 1 = fully wound up, then swings through to -1
      if (t < ENEMY_WINDUP) {
        const u = t / ENEMY_WINDUP;
        w = u * u * (3 - 2 * u);
        rAx = THREE.MathUtils.lerp(rAx, -2.75, w);
        rF = THREE.MathUtils.lerp(rF, -1.25, w);
        rAz = THREE.MathUtils.lerp(rAz, 0.25, w);
        lAx = THREE.MathUtils.lerp(lAx, -0.7, w);
        lF = THREE.MathUtils.lerp(lF, -1.2, w);
        tX = THREE.MathUtils.lerp(tX, -0.22, w);
        tY = THREE.MathUtils.lerp(tY, 0.3, w);
        lean = -0.08 * w;
      } else {
        const u = Math.min(1, (t - ENEMY_WINDUP) / 0.1);
        const back = THREE.MathUtils.smoothstep(t, ENEMY_WINDUP + 0.16, ENEMY_ATTACK_DURATION);
        const s = (1 - (1 - u) ** 3) * (1 - back);
        const hold = 1 - back;
        rAx = THREE.MathUtils.lerp(rAx, THREE.MathUtils.lerp(-2.75, -0.75, 1 - (1 - u) ** 3), hold);
        rF = THREE.MathUtils.lerp(rF, THREE.MathUtils.lerp(-1.25, -0.12, u), hold);
        lAx = THREE.MathUtils.lerp(lAx, 0.35, s);
        tX = THREE.MathUtils.lerp(tX, 0.38, s);
        tY = THREE.MathUtils.lerp(tY, -0.35, s);
        lean = 0.14 * s;
        lLx -= 0.35 * s;
        rLx += 0.3 * s;
      }
    }

    if (anim.flinchT > 0) {
      const f = Math.sin((anim.flinchT / 0.3) * Math.PI);
      tX -= 0.42 * f;
      hX -= 0.35 * f;
      lAx -= 0.5 * f;
      rAx -= 0.3 * f;
      lean -= 0.14 * f;
      lS += 0.25 * f;
      rS += 0.25 * f;
    }

    parts.leftLeg.rotation.x = lLx;
    parts.rightLeg.rotation.x = rLx;
    parts.leftShin.rotation.x = lS;
    parts.rightShin.rotation.x = rS;
    parts.leftArm.rotation.x = lAx;
    parts.rightArm.rotation.x = rAx;
    parts.rightArm.rotation.z = rAz;
    parts.leftForearm.rotation.x = lF;
    parts.rightForearm.rotation.x = rF;
    parts.torso.rotation.x = tX;
    parts.torso.rotation.y = tY;
    parts.head.rotation.x = hX;
    group.rotation.x = lean;
    // A little bounce in the step.
    model.position.y = Math.abs(Math.sin(anim.phase)) * 0.18 * stride;
  }
}

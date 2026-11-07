
// ── 19-combat-and-effects.js ─ Attacks, projectiles, hazards and combat visual effects.
function attack(event = null) {
  if (!gameStarted || attackCooldown > 0 || player.weapon === "special") return;

  // Melee Ground Slam in Air!
  if (!isGrounded && jumpOffset > 0 && player.weapon === "melee" && player.mastery.melee >= 20) {
    jumpOffset = 0;
    verticalVelocity = -100; // Slam down!
    playerMesh.position.y = (getIslandUnderPlayer()?.surfaceY || STARTER_SURFACE_Y) + 0.15;
    isGrounded = true;
    createGroundSlam(playerMesh.position.clone(), { type: "player" });
    audio.playImpact();

    // Damage all targets in massive AOE
    enemies.forEach((enemy) => {
      if (enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) < 45) {
        const dmg = Math.round(getDamage() * 1.5);
        damageEnemy(enemy, dmg, "GroundSlam", "#ffcf5a");
      }
    });
    attackCooldown = 0.5;
    return;
  }

  // Set attack cooldown
  const isGatling = player.weapon === "melee" && player.mastery.melee >= 50;
  attackCooldown = isGatling ? 0.11 : (player.weapon === "gun" ? 0.55 : 0.42);

  if (playerMesh?.userData?.animation) {
    playerMesh.userData.animation.attackTimer = playerMesh.userData.animation.attackDuration;
  }

  // Procedural Sound triggers
  if (player.weapon === "sword") audio.playSlash();
  else if (player.weapon === "gun") audio.playShot();
  else if (player.weapon === "special") audio.playSpecial();
  else audio.playSlash(); // Melee swing sound

  const traits = getAvatarTraits();
  
  // Sword Piercing Thrust: +12 range
  const swordBonus = (player.weapon === "sword" && player.mastery.sword >= 5) ? 12 : 0;
  // Sniper Focus: Double gun range when standing still
  const isSniper = player.weapon === "gun" && player.mastery.gun >= 50 && player.lastMoveSpeed === 0;
  const gunRange = isSniper ? 170 : 85;

  const baseRange = (player.weapon === "gun" ? gunRange : (11 + swordBonus));
  const range = baseRange * traits.rangeMultiplier;

  let damage = getDamage();
  let isFalcon = false;

  // Meteor Fist: 15% chance for double damage + knockback
  if (player.weapon === "melee" && player.mastery.melee >= 5 && Math.random() < 0.15) {
    isFalcon = true;
    damage = Math.round(damage * 2.5);
  }

  // Inferno Kick multiplier
  const isDiableJambeActive = player.weapon === "melee" && player.diableJambeTimer > 0;
  if (isDiableJambeActive) {
    damage = Math.round(damage * 2.5);
  }

  let target = null;
  let isGunHeadshot = false;

  if (player.weapon === "gun") {
    // Raycast to find if we clicked or aimed directly at any enemy
    const clientX = event?.clientX ?? mouseScreenPos.x;
    const clientY = event?.clientY ?? mouseScreenPos.y;
    const mouse = new THREE.Vector2();
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    // Find all alive enemies in range
    const candidateEnemies = enemies.filter(enemy => enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) <= range);
    
    let bestHit = null;
    for (const enemy of candidateEnemies) {
      const intersects = raycaster.intersectObject(enemy.mesh, true);
      if (intersects.length > 0) {
        const dist = intersects[0].distance;
        if (bestHit === null || dist < bestHit.dist) {
          let isHead = false;
          for (let i = 0; i < intersects.length; i++) {
            let obj = intersects[i].object;
            while (obj) {
              if (obj.userData && obj.userData.isHead) {
                isHead = true;
                break;
              }
              obj = obj.parent;
            }
            if (isHead) break;
          }
          bestHit = { enemy, dist, isHead };
        }
      }
    }
    
    if (bestHit) {
      target = bestHit.enemy;
      isGunHeadshot = bestHit.isHead;
    }
  }

  // Fallback to closest enemy if no direct mouse-hit target
  if (!target) {
    target = enemies
      .filter((enemy) => enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) <= range)
      .sort((a, b) => a.mesh.position.distanceTo(playerMesh.position) - b.mesh.position.distanceTo(playerMesh.position))[0];
    isGunHeadshot = false;
  }

  if (playerMesh?.userData?.animation) {
    playerMesh.userData.animation.attackImpact = target ? 1 : 0.3;
  }
  
  if (player.weapon === "gun") {
    createGunShot(target, isGunHeadshot);
  } else {
    createCombatEffect(player.weapon, target);
  }

  // Sword Dimensional Blade: Fires giant air slash forward!
  if (player.weapon === "sword" && player.mastery.sword >= 50) {
    const dir = getAttackDirection(target);
    createAirSlash(playerMesh.position.clone().setY(playerMesh.position.y + 6), dir, { type: "player" });
  }

  // Gun Double Tap: Fires a second bullet quickly
  if (player.weapon === "gun" && player.mastery.gun >= 5) {
    setTimeout(() => {
      if (player.weapon === "gun") {
        audio.playShot();
        createGunShot(target, isGunHeadshot);
        if (target && target.alive) {
          const dmgDouble = Math.round(getDamage() * 0.85);
          damageEnemy(target, dmgDouble, "DoubleTap", "#9defff", isGunHeadshot);
        }
      }
    }, 110);
  }

  // Pulse Bubble repel for Special Mastery 50
  if (player.weapon === "special" && player.mastery.special >= 5) {
    enemies.forEach((enemy) => {
      if (enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) < 48) {
        const pushDir = enemy.mesh.position.clone().sub(playerMesh.position).setY(0).normalize();
        enemy.mesh.position.addScaledVector(pushDir, 28);
        const dmgBubble = Math.round(getDamage() * 0.4);
        damageEnemy(enemy, dmgBubble, "Pulse", "#a775ff");
      }
    });
  }

  if (!target) {
    log(`${weaponName()} attack missed.`);
    return;
  }

  // Grand Awakening: instantly vaporizes minor enemies below 20% health
  const isGrandAwakening = player.weapon === "special" && player.mastery.special >= 50;
  if (isGrandAwakening && target.health < target.maxHealth * 0.20) {
    createFloatingText(target.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "VAPORIZED!", "#a775ff");
    target.health = 0;
    defeatEnemy(target);
    player.health = Math.min(player.maxHealth, player.health + 50); // Heal 50 HP on direct vaporize
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 6, 0)), "+50 HP", "#7ce0b4");
    audio.playQuestComplete();
    return;
  }

  target.mesh.scale.setScalar(1.08);
  setTimeout(() => target.mesh.scale.setScalar(1), 90);

  if (isDiableJambeActive) {
    player.diableJambeHits = (player.diableJambeHits || 0) + 1;
    if (player.diableJambeHits >= 5) {
      player.diableJambeTimer = 0;
      player.diableJambeHits = 0;
      createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "🔥 Inferno Kick Extinguished", "#ff7700");
      log("🔥 Inferno Kick legs extinguished after 5 strikes.");
    }
    createFireBurst(target.mesh.position.clone());
  }

  if (isFalcon) {
    const pushDir = target.mesh.position.clone().sub(playerMesh.position).setY(0).normalize();
    target.mesh.position.addScaledVector(pushDir, 35);
    const label = isDiableJambeActive ? "🔥 Inferno Meteor Fist" : "Meteor Fist";
    const color = isDiableJambeActive ? "#ff2200" : "#ff8a3d";
    damageEnemy(target, damage, label, color);
  } else {
    const label = isDiableJambeActive ? "🔥 Diable Strike" : weaponName();
    const color = isDiableJambeActive ? "#ff4400" : "#ff7a3d";
    damageEnemy(target, damage, label, color, player.weapon === "gun" ? isGunHeadshot : null);
  }
}

function addTimedEffect(mesh, duration, update) {
  scene.add(mesh);
  combatEffects.push({ mesh, duration, age: 0, update });
}

function updateCombatEffects(dt) {
  for (let i = combatEffects.length - 1; i >= 0; i -= 1) {
    const effect = combatEffects[i];
    effect.age += dt;
    const progress = clamp(effect.age / effect.duration, 0, 1);
    effect.update(effect.mesh, progress, dt);
    if (progress >= 1) {
      scene.remove(effect.mesh);
      combatEffects.splice(i, 1);
    }
  }
}

function createCombatEffect(weapon, target) {
  if (weapon === "sword") {
    createSwordSlash(target);
    return;
  }
  if (weapon === "gun") {
    createGunShot(target);
    return;
  }
  if (weapon === "special") {
    createSpecialBurst(target);
    return;
  }
  createMeleeBurst(target);
}

function createWallHitEffect(position, showDamage) {
  const color = showDamage ? 0xff3f2f : 0x7ce0b4;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(5.8, 0.34, 10, 48),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.88 }),
  );
  ring.position.copy(position);
  ring.position.y += 5;
  ring.rotation.x = Math.PI / 2;
  addTimedEffect(ring, 0.32, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2.4);
    mesh.material.opacity = 0.88 * (1 - progress);
  });

  if (!showDamage) return;
  for (let i = 0; i < 8; i += 1) {
    const chip = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
      new THREE.MeshBasicMaterial({ color: 0xff8a3d, transparent: true, opacity: 0.95 }),
    );
    const angle = (i / 8) * Math.PI * 2;
    const direction = new THREE.Vector3(Math.cos(angle), 0.35, Math.sin(angle)).normalize();
    chip.position.copy(position);
    chip.position.y += 4;
    addTimedEffect(chip, 0.38, (mesh, progress, dt) => {
      mesh.position.addScaledVector(direction, dt * 42);
      mesh.material.opacity = 0.95 * (1 - progress);
      mesh.rotation.x += dt * 8;
      mesh.rotation.y += dt * 7;
    });
  }
}

function getAttackDirection(target) {
  if (target && target.mesh) {
    return target.mesh.position.clone().sub(playerMesh.position).setY(0).normalize();
  }
  return new THREE.Vector3(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y)).normalize();
}

function createMeleeBurst(target) {
  const direction = getAttackDirection(target);
  const origin = playerMesh.position.clone().add(direction.clone().multiplyScalar(8));
  origin.y += 4.2;

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.22, 8, 40),
    new THREE.MeshBasicMaterial({ color: 0xffcf5a, transparent: true, opacity: 0.78 }),
  );
  ring.position.copy(origin);
  ring.rotation.x = Math.PI / 2;
  addTimedEffect(ring, 0.28, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2.7);
    mesh.material.opacity = 0.78 * (1 - progress);
  });

  for (let i = 0; i < 7; i += 1) {
    const spark = new THREE.Mesh(
      new THREE.SphereGeometry(0.7 + (i % 2) * 0.25, 8, 6),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0xff7a3d : 0xfff0a0, transparent: true, opacity: 0.95 }),
    );
    const side = new THREE.Vector3(-direction.z, 0, direction.x).multiplyScalar((i - 3) * 1.5);
    spark.position.copy(origin).add(side);
    addTimedEffect(spark, 0.34, (mesh, progress, dt) => {
      mesh.position.addScaledVector(direction, dt * 32);
      mesh.position.y += dt * (14 - progress * 24);
      mesh.material.opacity = 0.95 * (1 - progress);
      mesh.scale.setScalar(1 + progress * 1.4);
    });
  }
}

function createFireBurst(position) {
  for (let i = 0; i < 16; i += 1) {
    const fire = new THREE.Mesh(
      new THREE.SphereGeometry(1.2 + (i % 3) * 0.6, 8, 6),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xff3300 : 0xffaa00, transparent: true, opacity: 0.85 }),
    );
    const angle = i * 2.3;
    const dir = new THREE.Vector3(Math.cos(angle), (Math.random() - 0.2) * 0.6, Math.sin(angle)).normalize();
    fire.position.copy(position);
    scene.add(fire);
    addTimedEffect(fire, 0.45, (mesh, progress, dt) => {
      mesh.position.addScaledVector(dir, dt * 48);
      mesh.scale.setScalar(1 + progress * 1.5);
      mesh.material.opacity = 0.85 * (1 - progress);
    });
  }
}

function createSwordSlash(target) {
  const direction = getAttackDirection(target);
  const slash = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeSlashTexture(),
      color: 0xdaf6ff,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    }),
  );
  slash.position.copy(playerMesh.position).add(direction.clone().multiplyScalar(10));
  slash.position.y += 6.4;
  slash.scale.set(18, 10, 1);
  addTimedEffect(slash, 0.24, (mesh, progress) => {
    mesh.position.addScaledVector(direction, 0.9);
    mesh.material.opacity = 0.95 * (1 - progress);
    mesh.scale.set(18 + progress * 16, 10 + progress * 7, 1);
    mesh.material.rotation = -0.7 + progress * 0.55;
  });
}

function createGunShot(target, isHeadshot = false) {
  const direction = getAttackDirection(target);
  const start = playerMesh.position.clone().add(direction.clone().multiplyScalar(5));
  start.y += 6;
  const end = target ? target.mesh.position.clone() : start.clone().add(direction.clone().multiplyScalar(80));
  end.y += target ? (isHeadshot ? 8.65 : 5.7) : 0;
  const midpoint = start.clone().lerp(end, 0.5);
  const length = start.distanceTo(end);

  const tracer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, length, 8),
    new THREE.MeshBasicMaterial({ color: 0x9defff, transparent: true, opacity: 0.85 }),
  );
  tracer.position.copy(midpoint);
  tracer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
  addTimedEffect(tracer, 0.18, (mesh, progress) => {
    mesh.material.opacity = 0.85 * (1 - progress);
    mesh.scale.set(1, 1, 1 + progress * 0.12);
  });

  const muzzle = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 14, 10),
    new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.85 }),
  );
  muzzle.position.copy(start);
  addTimedEffect(muzzle, 0.16, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2);
    mesh.material.opacity = 0.85 * (1 - progress);
  });
}

function createSpecialBurst(target) {
  const direction = getAttackDirection(target);
  const origin = playerMesh.position.clone();
  origin.y += 5.3;

  const aura = new THREE.Mesh(
    new THREE.SphereGeometry(6, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xa775ff, transparent: true, opacity: 0.28, wireframe: true }),
  );
  aura.position.copy(origin);
  addTimedEffect(aura, 0.52, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 4.2);
    mesh.rotation.y += 0.08;
    mesh.material.opacity = 0.28 * (1 - progress);
  });

  for (let i = 0; i < 5; i += 1) {
    const boltDirection = direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), (i - 2) * 0.22);
    const bolt = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 28 + i * 3),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0x7ce0b4 : 0xd7b7ff, transparent: true, opacity: 0.8 }),
    );
    bolt.position.copy(origin).add(boltDirection.clone().multiplyScalar(16 + i * 2));
    bolt.rotation.y = Math.atan2(boltDirection.x, boltDirection.z);
    addTimedEffect(bolt, 0.38, (mesh, progress) => {
      mesh.position.addScaledVector(boltDirection, 1.2);
      mesh.material.opacity = 0.8 * (1 - progress);
      mesh.scale.set(1 + progress * 1.5, 1 + progress * 1.5, 1 + progress * 0.35);
    });
  }
}

function createJungleArrivalEffect(island) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(78, 2.2, 10, 80),
    new THREE.MeshBasicMaterial({ color: 0x78e3b2, transparent: true, opacity: 0.9 }),
  );
  ring.position.copy(playerMesh.position);
  ring.position.y = island.surfaceY + 3;
  ring.rotation.x = Math.PI / 2;
  addTimedEffect(ring, 1.1, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 4.8);
    mesh.material.opacity = 0.9 * (1 - progress);
  });
}

function makeSlashTexture() {
  if (makeSlashTexture.texture) return makeSlashTexture.texture;
  const slashCanvas = document.createElement("canvas");
  slashCanvas.width = 256;
  slashCanvas.height = 128;
  const ctx = slashCanvas.getContext("2d");
  const gradient = ctx.createLinearGradient(24, 98, 232, 20);
  gradient.addColorStop(0, "rgba(124, 224, 180, 0)");
  gradient.addColorStop(0.22, "rgba(124, 224, 180, 0.82)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.8, "rgba(157, 239, 255, 0.82)");
  gradient.addColorStop(1, "rgba(157, 239, 255, 0)");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(24, 96);
  ctx.quadraticCurveTo(116, 12, 232, 28);
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.stroke();
  makeSlashTexture.texture = new THREE.CanvasTexture(slashCanvas);
  return makeSlashTexture.texture;
}

function createAirSlash(position, direction, enemy) {
  const isBuggy = enemy && enemy.type === "buggy";
  const isPlayer = enemy && (enemy.type === "player" || enemy.type === "neutral" || enemy.type === "Pirates" || enemy.type === "Marines");
  const projectile = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeSlashTexture(),
      color: isBuggy ? 0xff4668 : (isPlayer ? 0x3ce88a : 0x9defff),
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    }),
  );
  projectile.position.copy(position);
  projectile.scale.set(16, 8, 1);
  scene.add(projectile);
  projectiles.push({
    mesh: projectile,
    direction: direction.clone(),
    speed: isBuggy ? 118 : 92,
    damage: isBuggy ? 24 : 14,
    age: 0,
    duration: 1.8,
    owner: isPlayer ? "player" : "enemy"
  });
}

function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = projectiles[i];
    projectile.age += dt;
    projectile.mesh.position.addScaledVector(projectile.direction, projectile.speed * dt);
    if (projectile.mesh.material && projectile.mesh.material.rotation !== undefined) {
      projectile.mesh.material.rotation += dt * 7;
    }
    
    if (projectile.owner === "player") {
      let hit = false;
      for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j];
        if (enemy.alive && projectile.mesh.position.distanceTo(enemy.mesh.position) < 26) {
          hit = true;
          if (projectile.isMortar) {
            createGroundSlam(projectile.mesh.position.clone(), { type: "player" });
            enemies.forEach(e => {
              if (e.alive && e.mesh.position.distanceTo(projectile.mesh.position) < 55) {
                damageEnemy(e, projectile.damage, "Explosion", "#ff7a3d");
              }
            });
          } else {
            damageEnemy(enemy, projectile.damage, "Slash", "#3ce88a");
          }
          break;
        }
      }
      if (hit) {
        scene.remove(projectile.mesh);
        projectiles.splice(i, 1);
        continue;
      }
    } else {
      if (projectile.mesh.position.distanceTo(playerMesh.position) < 14) {
        damagePlayer(projectile.damage, "Air Slash");
        scene.remove(projectile.mesh);
        projectiles.splice(i, 1);
        continue;
      }
    }
    
    if (projectile.age >= projectile.duration) {
      if (projectile.isMortar) {
        createGroundSlam(projectile.mesh.position.clone(), { type: "player" });
        enemies.forEach(e => {
          if (e.alive && e.mesh.position.distanceTo(projectile.mesh.position) < 55) {
            damageEnemy(e, projectile.damage, "Explosion", "#ff7a3d");
          }
        });
      }
      scene.remove(projectile.mesh);
      projectiles.splice(i, 1);
    }
  }
}

const activeSurgeRocks = [];

function createGroundSurge(enemy) {
  if (!enemy || !enemy.mesh) return;
  const startPos = enemy.mesh.position.clone();
  const dir = playerMesh.position.clone().sub(startPos).setY(0).normalize();
  const numRocks = 8;
  const rockSpacing = 22;
  
  audio.playImpact();
  
  for (let i = 0; i < numRocks; i += 1) {
    setTimeout(() => {
      if (!enemy.alive) return;
      const rockPos = startPos.clone().addScaledVector(dir, i * rockSpacing);
      
      const island = islands.find(isl => {
        const dx = rockPos.x - isl.position.x;
        const dz = rockPos.z - isl.position.z;
        return Math.sqrt(dx * dx + dz * dz) <= isl.radius;
      });
      const groundY = island ? getIslandSurfaceHeightAt(rockPos.x, rockPos.z, island) : OCEAN_SURFACE_Y;
      rockPos.y = groundY;
      
      const rockGeo = new THREE.DodecahedronGeometry(6 + Math.random() * 3, 0);
      rockGeo.scale(1.1, 0.7 + Math.random() * 0.5, 0.9 + Math.random() * 0.3);
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0x4d4741,
        roughness: 0.96,
        flatShading: true
      });
      const rockMesh = new THREE.Mesh(rockGeo, rockMat);
      rockMesh.position.copy(rockPos).setY(groundY - 14);
      rockMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rockMesh.castShadow = true;
      rockMesh.receiveShadow = true;
      scene.add(rockMesh);
      
      createDustCloud(rockPos);
      
      activeSurgeRocks.push({
        mesh: rockMesh,
        startY: groundY - 14,
        peakY: groundY + 2.5 + Math.random() * 2,
        time: 0,
        duration: 1.6,
        hitDetected: false,
        pos: rockPos
      });
    }, i * 180);
  }
}

function updateSurgeRocks(dt) {
  for (let i = activeSurgeRocks.length - 1; i >= 0; i -= 1) {
    const rock = activeSurgeRocks[i];
    rock.time += dt;
    const t = rock.time / rock.duration;
    
    if (t < 0.22) {
      const p = t / 0.22;
      rock.mesh.position.y = rock.startY + (rock.peakY - rock.startY) * p;
      rock.mesh.scale.setScalar(p);
    } else if (t < 0.78) {
      rock.mesh.position.y = rock.peakY;
      rock.mesh.scale.setScalar(1);
    } else if (t < 1.0) {
      const p = (1.0 - t) / 0.22;
      rock.mesh.position.y = rock.startY + (rock.peakY - rock.startY) * p;
      rock.mesh.scale.setScalar(Math.max(0.001, p));
    } else {
      scene.remove(rock.mesh);
      rock.mesh.geometry.dispose();
      rock.mesh.material.dispose();
      activeSurgeRocks.splice(i, 1);
      continue;
    }
    
    if (!rock.hitDetected && rock.time < 1.1) {
      const dist = rock.mesh.position.distanceTo(playerMesh.position);
      if (dist < 18) {
        rock.hitDetected = true;
        damagePlayer(28, "Ground Surge");
        player.stunTimer = 0.8;
        verticalVelocity = 90;
        isGrounded = false;
        createDustCloud(playerMesh.position.clone());
      }
    }
  }
}

function createGroundSlam(position, enemy) {
  cameraShake = Math.max(cameraShake, 1.4);
  createDustCloud(position);

  // Set violent player ground slam animation
  if (enemy && (enemy.type === "player" || enemy.type === "starter") && playerMesh?.userData?.animation) {
    playerMesh.userData.animation.slamTimer = 0.5;
    playerMesh.userData.animation.slamDuration = 0.5;
  }

  const owner = (enemy && (enemy.type === "player" || enemy.type === "starter")) ? "player" : "enemy";
  const numRocks = 12;

  for (let i = 0; i < numRocks; i += 1) {
    const angle = (i / numRocks) * Math.PI * 2;
    // Vary distance from 10 (near) to 32 (far)
    const distance = 10 + Math.random() * 22;

    // Scale rock base size based on distance: nearer = smaller, farther = larger
    const minDistance = 10;
    const maxDistance = 32;
    const sizeMultiplier = 0.4 + 1.2 * ((distance - minDistance) / (maxDistance - minDistance));
    const rockRadius = (2.2 + Math.random() * 1.2) * sizeMultiplier;

    // Jagged low-poly rock geometry
    const rockGeo = new THREE.DodecahedronGeometry(rockRadius, 0);
    // Squish rocks to make them look irregular and natural
    rockGeo.scale(1.2, 0.7 + Math.random() * 0.6, 0.8 + Math.random() * 0.4);

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x5a4f43,
      roughness: 0.95,
      metalness: 0.1,
      flatShading: true
    });

    const rock = new THREE.Mesh(rockGeo, rockMat);
    const targetX = position.x + Math.cos(angle) * distance;
    const targetZ = position.z + Math.sin(angle) * distance;

    const startY = position.y - 6 * sizeMultiplier; // sink larger rocks deeper
    const baseY = position.y + 0.5; // sit slightly above ground level

    rock.position.set(targetX, startY, targetZ);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);

     hazards.push({
      mesh: rock,
      damage: (enemy && enemy.type === "brute") ? 20 : (enemy && enemy.type === "gorilla_king") ? 24 : (enemy && enemy.type === "yeti") ? 32 : 28,
      radius: Math.max(3, rockRadius * 1.4), // collision radius scales with rock size
      age: 0,
      duration: 3.2,
      owner: owner,
      startY: startY,
      baseY: baseY
    });
  }
}

function updateHazards(dt) {
  for (let i = hazards.length - 1; i >= 0; i -= 1) {
    const hazard = hazards[i];
    hazard.age += dt;

    const scaleUpTime = 0.35;
    const fadeOutTime = 0.35;
    let progress = 1;

    // Rock rising and sinking animation
    if (hazard.age < scaleUpTime) {
      progress = hazard.age / scaleUpTime;
      if (hazard.startY !== undefined && hazard.baseY !== undefined) {
        hazard.mesh.position.y = hazard.startY + (hazard.baseY - hazard.startY) * progress;
      }
      hazard.mesh.scale.setScalar(progress);
    } else if (hazard.age > hazard.duration - fadeOutTime) {
      progress = (hazard.duration - hazard.age) / fadeOutTime;
      if (hazard.startY !== undefined && hazard.baseY !== undefined) {
        hazard.mesh.position.y = hazard.startY + (hazard.baseY - hazard.startY) * progress;
      }
      hazard.mesh.scale.setScalar(Math.max(0.001, progress));
    } else {
      if (hazard.baseY !== undefined) {
        hazard.mesh.position.y = hazard.baseY;
      }
      hazard.mesh.scale.setScalar(1.0);
    }

    // Player takes damage from hazards ONLY if not owned by the player
    if (hazard.owner !== "player" && hazard.mesh.position.distanceTo(playerMesh.position) < hazard.radius && wallHitCooldown <= 0) {
      applyImpactDamage(hazard.damage, playerMesh.position.clone(), playerMesh.position.clone().sub(hazard.mesh.position).normalize(), "crushing rocks");
      wallHitCooldown = 0.8;
    }

    if (hazard.age >= hazard.duration) {
      scene.remove(hazard.mesh);
      hazards.splice(i, 1);
    }
  }
}

function createFloatingText(position, text, color = "#fff7e6") {
  const label = makeLabel(text, 0.72);
  label.position.copy(position);
  label.material.color = new THREE.Color(color);
  addTimedEffect(label, 0.75, (mesh, progress) => {
    mesh.position.y += 0.22;
    mesh.material.opacity = 1 - progress;
  });
}

function createDustCloud(position) {
  for (let i = 0; i < 10; i += 1) {
    const dust = new THREE.Mesh(
      new THREE.SphereGeometry(1.8 + (i % 3), 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xb99b72, transparent: true, opacity: 0.34 }),
    );
    const angle = i * 1.7;
    const dir = new THREE.Vector3(Math.cos(angle), 0.15, Math.sin(angle)).normalize();
    dust.position.copy(position).add(new THREE.Vector3(0, 2, 0));
    scene.add(dust);
    addTimedEffect(dust, 0.55, (mesh, progress, dt) => {
      mesh.position.addScaledVector(dir, dt * 38);
      mesh.scale.setScalar(1 + progress * 2);
      mesh.material.opacity = 0.34 * (1 - progress);
    });
  }
}

function createSplashEffect(position) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.18, 8, 36),
    new THREE.MeshBasicMaterial({ color: 0x9defff, transparent: true, opacity: 0.7 }),
  );
  ring.position.copy(position);
  ring.position.y = OCEAN_SURFACE_Y + 0.15;
  ring.rotation.x = Math.PI / 2;
  addTimedEffect(ring, 0.38, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2.4);
    mesh.material.opacity = 0.7 * (1 - progress);
  });
}

function createBubbleEffect(position) {
  const bubble = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xcff8ff, transparent: true, opacity: 0.45 }),
  );
  bubble.position.copy(position);
  addTimedEffect(bubble, 1.1, (mesh, progress) => {
    mesh.position.y += 0.18;
    mesh.material.opacity = 0.45 * (1 - progress);
  });
}

function applyHakiVisuals() {
  const model = playerMesh?.children?.[0];
  const parts = model?.userData?.parts;
  if (!parts) return;
  const covered = player.haki.active ? ["rightArm", "leftArm", "torso", "rightLeg", "leftLeg", "head"].slice(0, Math.min(6, player.haki.level + 1)) : [];
  Object.entries(parts).forEach(([name, mesh]) => {
    if (!mesh.material) return;
    if (!mesh.userData.baseColor) mesh.userData.baseColor = mesh.material.color.clone();
    if (covered.includes(name)) {
      mesh.material.color.set(player.haki.level >= 5 ? 0x050505 : 0x181a1e);
      mesh.material.emissive?.set(player.haki.level >= 4 ? 0x1a0f3a : 0x000000);
      mesh.material.emissiveIntensity = player.haki.level >= 4 ? 0.25 : 0;
    } else {
      mesh.material.color.copy(mesh.userData.baseColor);
      if (mesh.material.emissive) mesh.material.emissive.set(0x000000);
      mesh.material.emissiveIntensity = 0;
    }
  });
}

function updateBossHud() {
  const boss = enemies.find((enemy) => (enemy.type === "buggy" || enemy.type === "gorilla_king" || enemy.type === "yeti") && enemy.alive);
  const proximityRange = boss?.type === "yeti" ? 350 : 260;
  if (!boss || boss.mesh.position.distanceTo(playerMesh.position) > proximityRange) {
    bossBar?.classList.add("hidden");
    return;
  }
  bossBar?.classList.remove("hidden");
  let bossDisplayName = "Boss";
  if (boss.type === "buggy") bossDisplayName = "Captain Jester Captain";
  else if (boss.type === "gorilla_king") bossDisplayName = "Gorilla King";
  else if (boss.type === "yeti") bossDisplayName = "The Yeti";
  if (bossName) bossName.textContent = bossDisplayName;
  if (bossHealthBar) bossHealthBar.style.width = `${Math.max(0, (boss.health / boss.maxHealth) * 100)}%`;
}

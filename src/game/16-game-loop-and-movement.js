
// ── 16-game-loop-and-movement.js ─ Main loop, player movement, swimming, collisions, animation and mobility skills.
function loop(time) {
  const loopStart = performance.now();
  const dt = Math.min(0.033, (time - (loop.lastTime || time)) / 1000);
  loop.lastTime = time;
  const stepDt = hitStopTimer > 0 ? dt * 0.12 : dt;
  hitStopTimer = Math.max(0, hitStopTimer - dt);

  if (gameStarted) {
    // Day -> sunset -> night -> sunrise, 10 minutes each (see DAY_CYCLE).
    advanceDayCycle(stepDt);
    updateDayNightLighting(stepDt);
    updateWindGrass(stepDt);
    updateAvatarLod(stepDt);
    updateWindmills(stepDt);
    updateWeather(stepDt);

    updatePlayer(stepDt);
    updateEnemies(stepDt);
    updateObservationVision(stepDt);
    updateHazards(stepDt);
    updateProjectiles(stepDt);
    updateCombatEffects(stepDt);
    updateInteractionPrompt();
    updateTeleport(stepDt);
    updateCamera();
    updateMultiplayer(stepDt, time);
    updateBossHud();

    // Update active skill cooldown timers
    let hasActiveCooldowns = false;
    Object.keys(skillCooldowns).forEach((id) => {
      if (skillCooldowns[id] > 0) {
        skillCooldowns[id] = Math.max(0, skillCooldowns[id] - stepDt);
        hasActiveCooldowns = true;
      }
    });

    // Update HUD & Compass state
    updateCompass();
    if (hasActiveCooldowns) {
      updateCombatHud();
    }
  } else {
    const drift = Math.sin(time * 0.00035) * 7;
    camera.position.set(350 + drift, 210, 560);
    camera.lookAt(0, STARTER_SURFACE_Y + 24, 0);
  }

  updateBlinking(stepDt);
  updateLootDrops(stepDt);
  updateWorldAnimations(time);
  // Update realistic graphics elements
  if (oceanUniforms) {
    oceanUniforms.uTime.value = time * 0.001;
    if (sun) {
      oceanUniforms.uSunDir.value.copy(sun.position).sub(sun.target.position).normalize();
    }
  }
  if (skyDome) {
    skyDome.mesh.position.copy(camera.position);
  }
  if (cloudDeck) {
    cloudDeck.children.forEach((c) => {
      c.position.x += stepDt * 2.8 * (c.userData.speed || 1);
      if (c.position.x > 7500) c.position.x = -7500;
    });
  }
  if (ambientAtmosphere && typeof playerMesh !== "undefined" && playerMesh) {
    ambientAtmosphere.position.lerp(playerMesh.position, 0.12);
    const posArr = ambientAtmosphere.geometry.attributes.position.array;
    const phases = ambientAtmosphere.userData.phases;
    for (let i = 0; i < phases.length; i++) {
      posArr[i * 3 + 1] += Math.sin(time * 0.0012 + phases[i]) * 0.02;
    }
    ambientAtmosphere.geometry.attributes.position.needsUpdate = true;
  }
  
  const renderStart = performance.now();
  renderer.render(scene, camera);
  const frameGpuTime = performance.now() - renderStart;
  
  const loopEnd = performance.now();
  const frameCpuTime = loopEnd - loopStart;

  if (perfState.visible) {
    perfState.frameCount++;
    perfState.cpuHistory.push(frameCpuTime);
    perfState.gpuHistory.push(frameGpuTime);
    if (perfState.cpuHistory.length > 30) perfState.cpuHistory.shift();
    if (perfState.gpuHistory.length > 30) perfState.gpuHistory.shift();

    const now = performance.now();
    let memVal = 550;
    if (window.performance && window.performance.memory) {
      memVal = window.performance.memory.usedJSHeapSize / (1024 * 1024);
    } else {
      memVal = 580 + Math.sin(now * 0.0001) * 35 + Math.random() * 3;
    }
    perfState.memHistory.push(memVal);
    if (perfState.memHistory.length > 30) perfState.memHistory.shift();

    if (now - perfState.lastUpdateTime > 250) {
      updatePerfStatsUI(now);
      perfState.lastUpdateTime = now;
    }
  }

  requestAnimationFrame(loop);
}

function updateBlinking(dt) {
  // Only character models have eyes; no need to walk the whole scene.
  avatarModels.forEach((node) => {
    if (node.visible && node.userData.eyesList && node.userData.eyesList.length) {
      if (node.userData.blinkTimer === undefined) {
        node.userData.blinkTimer = 3.0 + Math.random() * 2.0;
        node.userData.isBlinking = false;
      }
      node.userData.blinkTimer -= dt;
      if (node.userData.blinkTimer <= 0) {
        if (!node.userData.isBlinking) {
          node.userData.isBlinking = true;
          node.userData.blinkTimer = 0.12; // blink duration
          node.userData.eyesList.forEach((eye) => {
            if (eye.userData.openScaleY === undefined) eye.userData.openScaleY = eye.scale.y;
            eye.scale.y = 0.001;
          });
        } else {
          node.userData.isBlinking = false;
          node.userData.blinkTimer = 2.5 + Math.random() * 3.5; // next blink delay
          node.userData.eyesList.forEach((eye) => {
            eye.scale.y = eye.userData.openScaleY ?? 1.0;
          });
        }
      }
    }
  });
}

function spawnLootCoins(position, totalValue) {
  let numCoins = 3;
  if (totalValue > 50) numCoins = 5;
  if (totalValue > 100) numCoins = 7;
  if (totalValue > 1000) numCoins = 15;

  const coinValue = Math.floor(totalValue / numCoins);
  const remainder = totalValue % numCoins;

  const coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.15, 8);
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.85,
    roughness: 0.18,
    flatShading: true,
  });

  for (let i = 0; i < numCoins; i += 1) {
    const coinMesh = new THREE.Mesh(coinGeo, coinMat);
    coinMesh.position.copy(position).add(new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      2 + Math.random() * 3,
      (Math.random() - 0.5) * 3,
    ));
    coinMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    coinMesh.castShadow = true;
    coinMesh.receiveShadow = true;
    scene.add(coinMesh);

    const vx = (Math.random() - 0.5) * 22;
    const vy = 15 + Math.random() * 18;
    const vz = (Math.random() - 0.5) * 22;

    const value = coinValue + (i === 0 ? remainder : 0);
    lootDrops.push({
      mesh: coinMesh,
      velocity: new THREE.Vector3(vx, vy, vz),
      value: value,
      bounceCount: 0,
    });
  }
}

function updateLootDrops(dt) {
  const magnetRange = 28;
  const collectRange = 4.5;
  const gravity = 58;
  const playerPos = playerMesh.position;

  for (let i = lootDrops.length - 1; i >= 0; i -= 1) {
    const coin = lootDrops[i];
    const mesh = coin.mesh;

    coin.velocity.y -= gravity * dt;
    mesh.position.addScaledVector(coin.velocity, dt);

    mesh.rotation.x += dt * 5;
    mesh.rotation.y += dt * 3;

    let surfaceY = OCEAN_SURFACE_Y;
    islands.forEach((isl) => {
      const dx = mesh.position.x - isl.position.x;
      const dz = mesh.position.z - isl.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= isl.radius) {
        surfaceY = getIslandSurfaceHeightAt(mesh.position.x, mesh.position.z, isl);
      }
    });

    if (mesh.position.y <= surfaceY + 0.15) {
      mesh.position.y = surfaceY + 0.15;
      if (coin.bounceCount < 3) {
        coin.velocity.y = -coin.velocity.y * 0.45;
        coin.velocity.x *= 0.65;
        coin.velocity.z *= 0.65;
        coin.bounceCount += 1;
      } else {
        coin.velocity.set(0, 0, 0);
      }
    }

    const distToPlayer = mesh.position.distanceTo(playerPos);

    if (distToPlayer < magnetRange) {
      const pullDir = playerPos.clone().sub(mesh.position).normalize();
      const pullSpeed = (1 - distToPlayer / magnetRange) * 140 + 20;
      coin.velocity.lerp(pullDir.multiplyScalar(pullSpeed), 0.22);
      mesh.position.addScaledVector(coin.velocity, dt);
    }

    if (distToPlayer < collectRange) {
      audio.playCoinChime();
      player.money += coin.value;
      createFloatingText(mesh.position.clone().add(new THREE.Vector3(0, 4, 0)), `+$${coin.value}`, "#ffd700");
      scene.remove(mesh);
      lootDrops.splice(i, 1);
      updateHud();
    }
  }
}

function updateWorldAnimations(time) {
  animatedWorldObjects.forEach((item) => {
    if (item.type === "foam") {
      item.mesh.rotation.z += item.speed;
      item.mesh.material.opacity = 0.08 + Math.sin(time * 0.0014 + item.phase) * 0.035;
    }
    if (item.type === "tide") {
      item.mesh.position.y = item.baseY + Math.sin(time * item.speed + item.phase) * 0.12;
      item.mesh.scale.setScalar(1 + Math.sin(time * 0.001 + item.phase) * 0.012);
    }
    if (item.type === "questRing") {
      item.mesh.rotation.z += item.speed;
      item.mesh.material.opacity = 0.78 + Math.sin(time * 0.003 + item.phase) * 0.14;
      item.mesh.scale.setScalar(1 + Math.sin(time * 0.002 + item.phase) * 0.04);
    }
    if (item.type === "teleporter") {
      item.mesh.rotation.z += item.speed;
      item.mesh.scale.setScalar(1 + Math.sin(time * 0.003 + item.phase) * 0.06);
    }
    if (item.type === "teleporterBeam") {
      item.mesh.position.y = item.baseY + Math.sin(time * item.speed + item.phase) * 1.4;
      item.mesh.material.opacity = 0.18 + Math.sin(time * 0.0025 + item.phase) * 0.07;
    }
  });

  if (animatedFoliage.length > 0) {
    const wind = time * 0.0018;
    for (let i = 0; i < animatedFoliage.length; i++) {
      const fol = animatedFoliage[i];
      fol.mesh.rotation.z = fol.baseRotZ + Math.sin(wind + fol.phase) * 0.042;
    }
  }
}

function updatePlayer(dt) {
  if (player.health <= 0) {
    player.lastMoveSpeed = 0;
    return;
  }
  
  if (player.stunTimer > 0) {
    playerMoveState.velocity.set(0, 0, 0);
    player.stunTimer = Math.max(0, player.stunTimer - dt);
    player.lastMoveSpeed = 0;
    player.isBlocking = false;
    
    updateStamina(dt, false);
    updatePlayerAnimation(dt);
    
    const island = getIslandUnderPlayer();
    if (!island) {
      updateSwimming(dt);
      verticalVelocity = 0;
      jumpOffset = 0;
    } else {
      player.isSwimming = false;
      player.oxygen = Math.min(100, player.oxygen + dt * 18);
      playerMesh.position.y = getIslandSurfaceHeightAt(playerMesh.position.x, playerMesh.position.z, island) + 0.15;
      updateJump(dt);
    }
    
    attackCooldown = Math.max(0, attackCooldown - dt);
    wallHitCooldown = Math.max(0, wallHitCooldown - dt);
    player.dashCooldown = Math.max(0, player.dashCooldown - dt);
    
    if (player.knockedDown) {
      playerMesh.rotation.z = Math.PI / 2;
    } else {
      playerMesh.rotation.z = 0;
    }
    return;
  } else {
    if (player.knockedDown) {
      player.knockedDown = false;
      playerMesh.rotation.z = 0;
    }
  }

  if (player.isGodMode) {
    player.health = player.maxHealth;
    player.stamina = player.maxStamina;
  }
  if (isHelming) {
    playerMoveState.velocity.set(0, 0, 0);
    updateBoat(dt);
    return;
  }

  // Continuous attacks when holding Left Mouse Button or KeyR
  if ((isLeftMouseDown || keys.has("KeyR")) && attackCooldown <= 0) {
    if (player.weapon === "melee" || player.weapon === "sword") {
      attack({ clientX: mouseScreenPos.x, clientY: mouseScreenPos.y });
    }
  }

  // Active parry Iron Bastion heal
  if (player.isBlocking && player.mastery.defense >= 20) {
    player.health = Math.min(player.maxHealth, player.health + dt * 3.5);
    if (Math.random() < 0.05) {
      createBubbleEffect(playerMesh.position.clone().add(new THREE.Vector3(0, 4, 0)));
    }
  }

  // Armored Will tick
  player.armoredWillCooldown = Math.max(0, player.armoredWillCooldown - dt);
  if (player.shieldTimer > 0) {
    player.shieldTimer -= dt;
    player.health = Math.max(player.health, 1);
    if (Math.random() < 0.15) {
      createWallHitEffect(playerMesh.position.clone().add(new THREE.Vector3(0, 4, 0)), false);
    }
  }

  const previousPosition = playerMesh.position.clone();
  const input = new THREE.Vector3(
    Number(keys.has("KeyD") || keys.has("ArrowRight")) - Number(keys.has("KeyA") || keys.has("ArrowLeft")),
    0,
    Number(keys.has("KeyS") || keys.has("ArrowDown")) - Number(keys.has("KeyW") || keys.has("ArrowUp")),
  );

  // Smoothed movement: ramp up/down instead of snapping, with less control in the air.
  const moveVelocity = playerMoveState.velocity;
  const grounded = isGrounded && jumpOffset <= 0.05;
  if (input.lengthSq() > 0) {
    input.normalize();
    const forward = new THREE.Vector3(Math.sin(cameraYaw), 0, Math.cos(cameraYaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    const move = forward.multiplyScalar(input.z).add(right.multiplyScalar(input.x)).normalize();
    const staminaFactor = player.stamina <= 1 && player.movementMode === "sprint" ? 0.78 : 1;
    const modeSpeed = player.movementMode === "sprint" ? 1.55 : 0.72;
    const swimSpeed = player.isSwimming ? 0.54 : 1;
    const speed = 95 * getAvatarTraits().speedMultiplier * modeSpeed * staminaFactor * swimSpeed;
    const accel = grounded ? 12 : 4.5;
    moveVelocity.lerp(move.multiplyScalar(speed), 1 - Math.exp(-accel * dt));
    // Turn toward the movement direction along the shortest arc.
    const targetYaw = Math.atan2(moveVelocity.x, moveVelocity.z);
    let turn = targetYaw - playerMesh.rotation.y;
    turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    playerMesh.rotation.y += turn * (1 - Math.exp(-16 * dt));
  } else {
    const decel = grounded ? 14 : 2.5;
    moveVelocity.multiplyScalar(Math.exp(-decel * dt));
    if (moveVelocity.lengthSq() < 0.5) moveVelocity.set(0, 0, 0);
  }

  if (moveVelocity.lengthSq() > 0) {
    playerMesh.position.addScaledVector(moveVelocity, dt);
    player.lastMoveSpeed = moveVelocity.length();
    resolveWallCollision(previousPosition);
    // Don't keep pushing into a wall after sliding along it.
    const actual = playerMesh.position.clone().sub(previousPosition).setY(0).divideScalar(Math.max(dt, 1e-4));
    if (actual.lengthSq() < moveVelocity.lengthSq()) moveVelocity.copy(actual);

    // Sprint footstep dust VFX
    if (!player.isSwimming && player.movementMode === "sprint") {
      if (updatePlayer.lastDustTime === undefined) updatePlayer.lastDustTime = 0;
      const now = performance.now();
      if (now - updatePlayer.lastDustTime > 220) {
        createFootstepDustEffect(playerMesh.position.clone());
        updatePlayer.lastDustTime = now;
      }
    }
  } else {
    player.lastMoveSpeed = 0;
  }

  const island = getIslandUnderPlayer();
  if (!island) {
    updateSwimming(dt);
    verticalVelocity = 0;
    jumpOffset = 0;
  } else {
    if (player.isSwimming) createSplashEffect(playerMesh.position.clone());
    player.isSwimming = false;
    player.oxygen = Math.min(100, player.oxygen + dt * 18);
    playerMesh.position.y = getIslandSurfaceHeightAt(playerMesh.position.x, playerMesh.position.z, island) + 0.15;
    updateIslandArrival(island);
    updateJump(dt);
  }
  updateStamina(dt, input.lengthSq() > 0);
  updatePlayerAnimation(dt);

  attackCooldown = Math.max(0, attackCooldown - dt);
  wallHitCooldown = Math.max(0, wallHitCooldown - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  if (player.flashStepCooldown > 0) {
    player.flashStepCooldown = Math.max(0, player.flashStepCooldown - dt);
  }

  // Update Foresight dodge regeneration
  if (player.observationHaki && player.observationHaki.unlocked) {
    if (player.observationHaki.dodges < player.observationHaki.maxDodges) {
      player.observationHaki.regenTimer = (player.observationHaki.regenTimer || 0) + dt;
      if (player.observationHaki.regenTimer >= 4.0) {
        player.observationHaki.dodges = Math.min(player.observationHaki.maxDodges, player.observationHaki.dodges + 1);
        player.observationHaki.regenTimer = 0;
        if (player.observationHaki.active) {
          createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 11, 0)), `👁️ +1 Dodge (${player.observationHaki.dodges}/${player.observationHaki.maxDodges})`, "#3ce88a");
        }
      }
    }
  }

  // Update Inferno Kick timer and visual effects
  if (player.diableJambeTimer > 0) {
    player.diableJambeTimer = Math.max(0, player.diableJambeTimer - dt);
    if (player.diableJambeTimer <= 0) {
      player.diableJambeHits = 0;
      createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "🔥 Inferno Kick Extinguished", "#ff7700");
      log("🔥 Inferno Kick legs extinguished.");
    } else {
      if (Math.random() < 0.28) {
        const firePos = playerMesh.position.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          1 + Math.random() * 2,
          (Math.random() - 0.5) * 1.5
        ));
        const fireParticle = new THREE.Mesh(
          new THREE.SphereGeometry(0.3 + Math.random() * 0.4, 6, 4),
          new THREE.MeshBasicMaterial({ color: Math.random() < 0.5 ? 0xff4400 : 0xffaa00, transparent: true, opacity: 0.8 })
        );
        fireParticle.position.copy(firePos);
        scene.add(fireParticle);
        addTimedEffect(fireParticle, 0.35, (mesh, progress) => {
          mesh.position.y += 0.08;
          mesh.scale.setScalar(1 - progress);
          mesh.material.opacity = 0.8 * (1 - progress);
        });
      }
    }
  }
}

function updateStamina(dt, moving) {
  if (player.movementMode === "sprint" && moving && !player.isSwimming) {
    player.stamina = Math.max(0, player.stamina - dt * 16);
    if (player.stamina <= 0) setMovementMode("walk");
  } else {
    player.stamina = Math.min(player.maxStamina, player.stamina + dt * (player.movementMode === "walk" ? 18 : 9));
  }
}

function updateSwimming(dt) {
  player.isSwimming = true;
  playerMesh.position.y = OCEAN_SURFACE_Y + 0.75 + Math.sin(performance.now() * 0.006) * 0.25;
  player.oxygen = Math.max(0, player.oxygen - dt * 4.5);
  if (player.oxygen <= 0 && wallHitCooldown <= 0) {
    applyImpactDamage(8, playerMesh.position.clone(), new THREE.Vector3(0, 0, 1), "drowning");
    wallHitCooldown = 1;
  }
  if (Math.random() < dt * 4) createBubbleEffect(playerMesh.position.clone());

  // Spawn visual white ripple rings around player while swimming
  const moving = keys.has("KeyW") || keys.has("KeyA") || keys.has("KeyS") || keys.has("KeyD");
  if (moving) {
    if (updateSwimming.lastRippleTime === undefined) updateSwimming.lastRippleTime = 0;
    const now = performance.now();
    if (now - updateSwimming.lastRippleTime > 380) {
      createSwimRippleEffect(playerMesh.position.clone(), 1.0);
      updateSwimming.lastRippleTime = now;
    }
  } else {
    if (updateSwimming.lastRippleTime === undefined) updateSwimming.lastRippleTime = 0;
    const now = performance.now();
    if (now - updateSwimming.lastRippleTime > 1100) {
      createSwimRippleEffect(playerMesh.position.clone(), 0.4);
      updateSwimming.lastRippleTime = now;
    }
  }
}

function createSwimRippleEffect(position, velocityMultiplier = 1.0) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.1, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 * velocityMultiplier })
  );
  ring.position.copy(position);
  ring.position.y = OCEAN_SURFACE_Y + 0.1;
  ring.rotation.x = Math.PI / 2;
  addTimedEffect(ring, 0.65, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2.5);
    mesh.material.opacity = 0.4 * velocityMultiplier * (1 - progress);
  });
}

function createFootstepDustEffect(position) {
  const dust = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xd6c2a5, transparent: true, opacity: 0.35 })
  );
  dust.position.copy(position);
  dust.position.y += 0.3;
  addTimedEffect(dust, 0.4, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 1.5);
    mesh.position.y += 0.08;
    mesh.material.opacity = 0.35 * (1 - progress);
  });
}

function updateIslandArrival(island) {
  if (!island || island.index === currentIslandIndex) return;
  currentIslandIndex = island.index;

  if (island.index === JUNGLE_ISLAND_INDEX && !hasReachedJungle) {
    hasReachedJungle = true;
    if (ui.sea) ui.sea.textContent = "Jungle Island";
    log("You have reached the Jungle.");
    createJungleArrivalEffect(island);
    updateHud();
  } else if (island.index === 0) {
    if (ui.sea) ui.sea.textContent = "First Sea";
  }
}

const PLAYER_COLLISION_RADIUS = 2.4;
const collisionContact = { depth: 0, nx: 0, nz: 0 };

// Exact overlap test between the player's body circle and one volume.
// Fills `out` with the push-out normal and depth; returns false when clear.
function measureCollision(volume, position, radius, out) {
  const px = position.x;
  const pz = position.z;
  const cx = volume.center.x;
  const cz = volume.center.z;
  const reach = volume.bound + radius;
  const ddx = px - cx;
  const ddz = pz - cz;
  if (volume.shape !== "segment" && ddx * ddx + ddz * ddz > reach * reach) return false;

  // Jumped high enough to clear it.
  if (volume.height !== Infinity && position.y - volume.center.y >= volume.height) return false;

  let dx;
  let dz;
  let limit = volume.radius + radius;
  if (volume.shape === "box") {
    // Into the box's local frame (inverse of rotation.y).
    const lx = ddx * volume.cos - ddz * volume.sin;
    const lz = ddx * volume.sin + ddz * volume.cos;
    const qx = Math.max(-volume.halfX, Math.min(volume.halfX, lx));
    const qz = Math.max(-volume.halfZ, Math.min(volume.halfZ, lz));
    let nlx = lx - qx;
    let nlz = lz - qz;
    let dist = Math.hypot(nlx, nlz);
    let depth;
    if (dist > 1e-4) {
      if (dist >= radius) return false;
      depth = radius - dist;
      nlx /= dist;
      nlz /= dist;
    } else {
      // Centre is inside the box: leave through the nearest face.
      const toX = volume.halfX - Math.abs(lx);
      const toZ = volume.halfZ - Math.abs(lz);
      if (toX < toZ) { nlx = Math.sign(lx) || 1; nlz = 0; depth = toX + radius; }
      else { nlx = 0; nlz = Math.sign(lz) || 1; depth = toZ + radius; }
    }
    out.nx = nlx * volume.cos + nlz * volume.sin;
    out.nz = -nlx * volume.sin + nlz * volume.cos;
    out.depth = depth;
    return true;
  }
  if (volume.shape === "segment") {
    const sx = volume.end.x - cx;
    const sz = volume.end.z - cz;
    const lenSq = sx * sx + sz * sz || 1;
    const t = Math.max(0, Math.min(1, (ddx * sx + ddz * sz) / lenSq));
    dx = px - (cx + sx * t);
    dz = pz - (cz + sz * t);
  } else {
    dx = ddx;
    dz = ddz;
  }
  const distSq = dx * dx + dz * dz;
  if (distSq >= limit * limit) return false;
  const dist = Math.sqrt(distSq);
  out.depth = limit - dist;
  if (dist > 1e-4) { out.nx = dx / dist; out.nz = dz / dist; }
  else { out.nx = 0; out.nz = 1; }
  return true;
}

function getWallCollision(position, radius = PLAYER_COLLISION_RADIUS) {
  for (const volume of collisionVolumes) {
    if (measureCollision(volume, position, radius, collisionContact)) return volume;
  }
  return null;
}

// Pushes the player out of every overlapping obstacle so they slide along walls
// instead of sticking. Head-on, fast impacts still bump (and can hurt when sprinting).
function resolveWallCollision(previousPosition) {
  const moveX = playerMesh.position.x - previousPosition.x;
  const moveZ = playerMesh.position.z - previousPosition.z;
  const moveLen = Math.hypot(moveX, moveZ);
  let hardest = null;
  let hardestFacing = 0;
  let hitNx = 0;
  let hitNz = 0;

  for (let pass = 0; pass < 4; pass += 1) {
    let moved = false;
    for (const volume of collisionVolumes) {
      if (!measureCollision(volume, playerMesh.position, PLAYER_COLLISION_RADIUS, collisionContact)) continue;
      playerMesh.position.x += collisionContact.nx * (collisionContact.depth + 0.01);
      playerMesh.position.z += collisionContact.nz * (collisionContact.depth + 0.01);
      moved = true;
      // How directly were we running into it? 1 = head-on, 0 = grazing.
      const facing = moveLen > 1e-4 ? -(moveX * collisionContact.nx + moveZ * collisionContact.nz) / moveLen : 0;
      if (facing > hardestFacing) {
        hardest = volume;
        hardestFacing = facing;
        hitNx = collisionContact.nx;
        hitNz = collisionContact.nz;
      }
    }
    if (!moved) break;
  }
  if (!hardest) return;

  const hitDirection = new THREE.Vector3(hitNx, 0, hitNz);
  const impactDamage = calculateImpactDamage({
    speed: player.lastMoveSpeed * hardestFacing,
    verticalVelocity: 0,
    material: hardest.material,
    toughness: hardest.toughness,
    baseDamage: hardest.damage ?? 10,
  });

  if (impactDamage > 0 && wallHitCooldown <= 0) {
    applyImpactDamage(impactDamage, playerMesh.position.clone(), hitDirection, hardest.label);
    wallHitCooldown = 0.75;
    updateHud();
    if (player.health <= 0) {
      killPlayer("crashing into a wall");
    }
  } else if (hardestFacing > 0.85 && player.lastMoveSpeed > 120 && wallHitCooldown <= 0) {
    // Sprinting straight into something: small bump, no message spam.
    triggerWallHitAnimation(hitDirection, hardest.label, false, false);
    wallHitCooldown = 0.6;
  }
}

function calculateImpactDamage({ speed = 0, verticalVelocity = 0, material = "stone", toughness = 1, baseDamage = 10 }) {
  const materialMultiplier = {
    grass: 0.35,
    sand: 0.45,
    wood: 0.75,
    stone: 1.1,
    metal: 1.45,
    spikes: 2.2,
    water: 0.2,
  }[material] || 1;
  const sprintRisk = player.movementMode === "sprint" ? 1.45 : 0.72;
  const blockReduction = player.isBlocking ? 0.55 : 1;
  const hakiReduction = player.haki.active ? Math.max(0.35, 1 - player.haki.level * 0.12) : 1;
  const force = Math.max(0, speed - 72) * 0.22 + Math.max(0, Math.abs(verticalVelocity) - 70) * 0.3;
  if (force < 3) return 0;
  return Math.round((force + baseDamage * 0.25) * materialMultiplier * toughness * sprintRisk * blockReduction * hakiReduction);
}

function applyImpactDamage(amount, position, direction, label) {
  player.health = Math.max(0, player.health - amount);
  cameraShake = Math.max(cameraShake, Math.min(1.8, amount / 18));
  hitStopTimer = Math.max(hitStopTimer, Math.min(0.16, amount / 180));
  triggerWallHitAnimation(direction, label, amount > 0, false);
  createFloatingText(position, `-${amount}`, "#ff6b4a");
  if (amount >= 18) {
    createDustCloud(position);
    log(`Major impact with ${label}: ${amount} damage.`);
  } else {
    log(`${label} impact: ${amount} damage.`);
  }
}

function triggerWallHitAnimation(direction, label, showDamage = true, announce = true) {
  const anim = playerMesh.userData.animation || {};
  anim.wallHitTimer = 0.28;
  anim.wallHitDuration = 0.28;
  anim.wallHitDirection = direction.clone();
  playerMesh.userData.animation = anim;
  createWallHitEffect(playerMesh.position.clone(), showDamage);
  if (announce && showDamage) log(`You crashed into ${label}.`);
}

function getIslandUnderPlayer() {
  let currentIsland = null;
  let closestCenterDistance = Infinity;

  islands.forEach((island) => {
    const flat = new THREE.Vector2(playerMesh.position.x - island.position.x, playerMesh.position.z - island.position.z);
    const distance = flat.length();
    if (distance <= island.radius * 0.96 && distance < closestCenterDistance) {
      currentIsland = island;
      closestCenterDistance = distance;
    }
  });

  return currentIsland;
}

function updateTeleport(dt) {
  if (homeTeleportCountdown <= 0) return;
  const wasActive = homeTeleportCountdown > 0;
  homeTeleportCountdown = Math.max(0, homeTeleportCountdown - dt);

  if (homeTeleportCountdown > 0) {
    teleportStatus.textContent = `Teleporting in ${Math.ceil(homeTeleportCountdown)}s...`;
    return;
  }

  if (wasActive) {
    playerMesh.position.copy(questGiverPosition.clone().add(new THREE.Vector3(0, 0.15, 8)));
    teleportStatus.textContent = "Teleported home";
    setTimeout(() => {
      teleportStatus.textContent = "Teleport ready";
    }, 1800);
  }
}

function updatePlayerAnimation(dt) {
  const model = playerMesh.children[0];
  if (!model?.userData?.parts) return;
  // Resting heights depend on the avatar's proportions (set by createHumanAvatarModel).
  const rest = model.userData.rest || { torsoY: 5.7, headY: 8.65, haloY: 10.6 };
  const anim = playerMesh.userData.animation || { walkPhase: 0, attackTimer: 0, attackDuration: 0.22 };
  const groundSpeed = playerMoveState.velocity.length();
  const moving = groundSpeed > 6 || ((keys.has("KeyW") || keys.has("KeyA") || keys.has("KeyS") || keys.has("KeyD")) && player.isSwimming);

  if (moving) {
    anim.walkPhase += dt * THREE.MathUtils.clamp(groundSpeed / 11, 3.5, 13);
  } else {
    anim.walkPhase += dt * 1.2;
  }

  anim.attackTimer = Math.max(0, anim.attackTimer - dt);
  anim.slamTimer = Math.max(0, (anim.slamTimer || 0) - dt);
  anim.punchChargeTimer = Math.max(0, (anim.punchChargeTimer || 0) - dt);
  anim.wallHitTimer = Math.max(0, (anim.wallHitTimer || 0) - dt);

  if (player.isSwimming) {
    const swimPhase = performance.now() * 0.008;

    if (moving) {
      // Horizontal pose in water
      model.rotation.x = 1.35;
      model.position.y = -3.8;
      model.position.z = -2.8;

      // Tilt head up to see forward and keep face above the surface
      model.userData.parts.head.rotation.x = -0.55;

      // Freestyle arm strokes: alternating circles
      model.userData.parts.leftArm.rotation.x = Math.sin(swimPhase) * 1.4 - 1.2;
      model.userData.parts.leftArm.rotation.y = Math.cos(swimPhase) * 0.4;
      model.userData.parts.leftArm.rotation.z = -0.2;

      model.userData.parts.rightArm.rotation.x = Math.sin(swimPhase + Math.PI) * 1.4 - 1.2;
      model.userData.parts.rightArm.rotation.y = Math.cos(swimPhase + Math.PI) * 0.4;
      model.userData.parts.rightArm.rotation.z = 0.2;

      // Leg flutter kicks
      model.userData.parts.leftLeg.rotation.x = Math.sin(swimPhase * 2) * 0.45;
      model.userData.parts.rightLeg.rotation.x = -Math.sin(swimPhase * 2) * 0.45;
      model.userData.parts.leftLeg.rotation.y = 0;
      model.userData.parts.rightLeg.rotation.y = 0;
      model.userData.parts.leftLeg.rotation.z = 0.04;
      model.userData.parts.rightLeg.rotation.z = -0.04;
    } else {
      // Vertical treading pose
      model.rotation.x = 0.18;
      model.position.y = -4.2 + Math.sin(performance.now() * 0.0035) * 0.35;
      model.position.z = -0.8;

      // Gentle head tilt
      model.userData.parts.head.rotation.x = -0.12;

      // Treading water scull
      model.userData.parts.leftArm.rotation.x = 0.4 + Math.sin(swimPhase * 0.6) * 0.2;
      model.userData.parts.leftArm.rotation.y = Math.cos(swimPhase * 0.6) * 0.25;
      model.userData.parts.leftArm.rotation.z = -0.4;

      model.userData.parts.rightArm.rotation.x = 0.4 + Math.sin(swimPhase * 0.6) * 0.2;
      model.userData.parts.rightArm.rotation.y = -Math.cos(swimPhase * 0.6) * 0.25;
      model.userData.parts.rightArm.rotation.z = 0.4;

      // Gentle leg scissors
      model.userData.parts.leftLeg.rotation.x = Math.sin(swimPhase * 0.6) * 0.2;
      model.userData.parts.rightLeg.rotation.x = -Math.sin(swimPhase * 0.6) * 0.2;
      model.userData.parts.leftLeg.rotation.y = 0;
      model.userData.parts.rightLeg.rotation.y = 0;
      model.userData.parts.leftLeg.rotation.z = 0.06;
      model.userData.parts.rightLeg.rotation.z = -0.06;
    }

    // Torso and other parts neutral while swimming
    model.userData.parts.torso.rotation.x = 0;
    model.userData.parts.torso.rotation.y = 0;
    if (anim.attackTimer <= 0) {
      model.userData.parts.torso.rotation.z = 0;
    }
    model.userData.parts.torso.position.y = rest.torsoY;
    model.userData.parts.head.position.y = rest.headY;

    if (anim.punchChargeTimer <= 0) {
      model.userData.parts.rightArm.rotation.y = 0;
    }
  } else {
    // Reset swim rotation and offset when back on land
    if (model.rotation.x !== 0) model.rotation.x = 0;
    if (model.position.y !== 0) model.position.y = 0;
    if (model.position.z !== 0) model.position.z = 0;
    if (model.userData.parts.head.rotation.x !== 0) model.userData.parts.head.rotation.x = 0;

    // Reset arm and leg Y/Z rotations that swim modified
    model.userData.parts.leftArm.rotation.y = 0;
    model.userData.parts.leftArm.rotation.z = -0.15;
    model.userData.parts.rightArm.rotation.y = 0;
    model.userData.parts.rightArm.rotation.z = 0.15;
    model.userData.parts.leftLeg.rotation.z = 0.04;
    model.userData.parts.rightLeg.rotation.z = -0.04;

    // Normal land animations
    const walkIntensity = moving ? THREE.MathUtils.clamp(groundSpeed / 75, 0.3, 1.15) : 0.08;
    const armSwing = Math.sin(anim.walkPhase + Math.PI) * 0.55 * walkIntensity;
    const legSwing = Math.sin(anim.walkPhase) * 1.1 * walkIntensity;
    const bodyBob = Math.sin(anim.walkPhase * 2) * 0.08 * walkIntensity;

    model.userData.parts.leftArm.rotation.x = -0.2 + armSwing;
    model.userData.parts.rightArm.rotation.x = -0.2 - armSwing;
    model.userData.parts.leftLeg.rotation.x = 0.1 + legSwing;
    model.userData.parts.rightLeg.rotation.x = 0.1 - legSwing;
    model.userData.parts.head.position.y = rest.headY + bodyBob * 0.6;
    model.userData.parts.torso.position.y = rest.torsoY + bodyBob;

    // Jump pose, blended in and out so it never pops.
    const airborne = !isGrounded && jumpOffset > 0.05;
    anim.air = THREE.MathUtils.lerp(anim.air || 0, airborne ? 1 : 0, 1 - Math.exp(-(airborne ? 14 : 18) * dt));
    if (anim.air > 0.01 && anim.slamTimer <= 0) {
      const w = anim.air;
      const rise = THREE.MathUtils.clamp(verticalVelocity / JUMP_VELOCITY, -1, 1); // 1 take-off, 0 apex, -1 falling
      const up = Math.max(0, rise);
      const down = Math.max(0, -rise);
      const parts = model.userData.parts;
      const mix = (from, to) => from + (to - from) * w;
      // Arms: thrust up on take-off, spread for balance while falling.
      parts.leftArm.rotation.x = mix(parts.leftArm.rotation.x, -2.3 * up - 1.1 * (1 - up) + 0.5 * down);
      parts.rightArm.rotation.x = mix(parts.rightArm.rotation.x, -1.9 * up - 0.9 * (1 - up) + 0.5 * down);
      parts.leftArm.rotation.z = mix(parts.leftArm.rotation.z, -0.35 - 0.75 * down);
      parts.rightArm.rotation.z = mix(parts.rightArm.rotation.z, 0.35 + 0.75 * down);
      // Legs: lead knee tucks on the way up, both reach for the ground coming down.
      parts.leftLeg.rotation.x = mix(parts.leftLeg.rotation.x, -1.05 * up - 0.35 * (1 - up) - 0.25 * down);
      parts.rightLeg.rotation.x = mix(parts.rightLeg.rotation.x, 0.45 * up + 0.1 * (1 - up) - 0.1 * down);
      parts.torso.rotation.x = mix(parts.torso.rotation.x, -0.12 * up + 0.1 * down);
    }

    // Landing: knees bend and the body dips.
    if (jumpState.landingTimer > 0) {
      const t = 1 - jumpState.landingTimer / 0.24;
      const dip = Math.sin(t * Math.PI) * jumpState.landingStrength;
      model.userData.parts.torso.position.y -= dip * 0.9;
      model.userData.parts.head.position.y -= dip * 0.9;
      model.userData.parts.leftLeg.rotation.x -= dip * 0.6;
      model.userData.parts.rightLeg.rotation.x -= dip * 0.5;
      model.userData.parts.leftArm.rotation.z -= dip * 0.4;
      model.userData.parts.rightArm.rotation.z += dip * 0.4;
    }

    if (anim.slamTimer > 0) {
      const slamProgress = 1 - anim.slamTimer / anim.slamDuration;
      if (slamProgress < 0.35) {
        const p = slamProgress / 0.35;
        model.userData.parts.leftArm.rotation.x = -0.2 + (-2.6 - (-0.2)) * p;
        model.userData.parts.rightArm.rotation.x = -0.2 + (-2.6 - (-0.2)) * p;
        model.userData.parts.torso.rotation.x = -0.3 * p;
        model.userData.parts.torso.position.y = rest.torsoY + 0.8 * p;
      } else {
        const p = (slamProgress - 0.35) / 0.65;
        const easeDown = Math.pow(p, 2.5);
        model.userData.parts.leftArm.rotation.x = -2.6 + (1.5 - (-2.6)) * easeDown;
        model.userData.parts.rightArm.rotation.x = -2.6 + (1.5 - (-2.6)) * easeDown;
        model.userData.parts.torso.rotation.x = -0.3 + (1.1 - (-0.3)) * easeDown;
        model.userData.parts.torso.position.y = (rest.torsoY + 0.8) + ((rest.torsoY - 2.5) - (rest.torsoY + 0.8)) * easeDown;
      }
    } else if (anim.punchChargeTimer > 0) {
      const chargeProgress = 1 - anim.punchChargeTimer / anim.punchChargeDuration;
      model.userData.parts.rightArm.rotation.x = -0.2 + (0.9 - (-0.2)) * chargeProgress;
      model.userData.parts.rightArm.rotation.y = 0.5 * chargeProgress;
      model.userData.parts.leftArm.rotation.x = -0.2 + (-1.4 - (-0.2)) * chargeProgress;
      model.userData.parts.torso.rotation.y = -0.45 * chargeProgress;
      model.userData.parts.torso.position.y = rest.torsoY - 0.5 * chargeProgress;
    } else {
      model.userData.parts.torso.rotation.x = 0;
      model.userData.parts.rightArm.rotation.y = 0;
      model.userData.parts.torso.rotation.y = 0;
    }
  }

  // Squash & stretch: stretch on take-off, squash on landing.
  if (!model.userData.baseScale) model.userData.baseScale = model.scale.clone();
  const base = model.userData.baseScale;
  let stretch = 0;
  if (!player.isSwimming) {
    if (jumpState.takeoffTimer > 0) stretch += Math.sin((1 - jumpState.takeoffTimer / 0.2) * Math.PI) * 0.12;
    if (jumpState.landingTimer > 0) stretch -= Math.sin((1 - jumpState.landingTimer / 0.24) * Math.PI) * 0.16 * jumpState.landingStrength;
  }
  model.scale.set(base.x * (1 - stretch * 0.5), base.y * (1 + stretch), base.z * (1 - stretch * 0.5));

  // Animate the bobbing/rotation of the halo
  if (model.userData.parts.halo) {
    model.userData.parts.halo.rotation.z += dt * 1.5;
    model.userData.parts.halo.position.y = rest.haloY + Math.sin(performance.now() * 0.003) * 0.15;
  }

  // Spectral hands drift and turn slowly beside the shoulders.
  if (model.userData.parts.spectralHands) {
    const t = performance.now() * 0.0015;
    model.userData.parts.spectralHands.children.forEach((ghost) => {
      const side = ghost.userData.side;
      if (ghost.userData.baseY === undefined) ghost.userData.baseY = ghost.position.y;
      ghost.position.y = ghost.userData.baseY + Math.sin(t * 2 + side) * 0.45;
      ghost.rotation.y = Math.sin(t + side) * 0.4;
    });
  }

  // Animate the flapping of the cape
  if (model.userData.parts.cape) {
    const speed = player.lastMoveSpeed || 0;
    const wave = Math.sin(performance.now() * 0.012) * (0.05 + (speed / 35) * 0.035);
    model.userData.parts.cape.rotation.x = 0.12 + (speed / 35) * 0.35 + wave;
    model.userData.parts.cape.rotation.y = Math.cos(performance.now() * 0.006) * 0.03 * (speed / 35);
    model.userData.parts.cape.rotation.z = Math.sin(performance.now() * 0.006) * 0.02 * (speed / 35);
  }

  if (anim.attackTimer > 0) {
    const attackProgress = 1 - anim.attackTimer / anim.attackDuration;
    const impact = Math.max(0, anim.attackImpact || 0);
    const baseStrike = player.weapon === "melee" ? 1.6 : 0.9;
    const strike = Math.sin(attackProgress * Math.PI) * (baseStrike + impact * 0.7);
    model.userData.parts.rightArm.rotation.x -= strike;
    model.userData.parts.leftArm.rotation.x += strike * 0.28;
    model.userData.parts.torso.rotation.z = Math.sin(attackProgress * Math.PI) * (0.08 + impact * 0.05);
    if (anim.attackTimer <= 0.001) {
      anim.attackImpact = 0;
    }
  } else {
    model.userData.parts.torso.rotation.z = 0;
  }

  if (anim.wallHitTimer > 0) {
    const progress = 1 - anim.wallHitTimer / (anim.wallHitDuration || 0.28);
    const shake = Math.sin(progress * Math.PI * 8) * (1 - progress);
    model.position.x = shake * 1.15;
    model.userData.parts.torso.rotation.z += shake * 0.11;
    model.userData.parts.head.position.y += Math.abs(shake) * 0.45;
  } else {
    model.position.x = 0;
  }
}

const playerMoveState = { velocity: new THREE.Vector3() };
const JUMP_VELOCITY = 60;
const JUMP_GRAVITY = 140;
const jumpState = { buffer: 0, held: false, takeoffTimer: 0, landingTimer: 0, landingStrength: 0, airTime: 0 };

// Pressing jump is remembered briefly, so a press just before landing still jumps.
function jump() {
  if (!gameStarted) return;
  jumpState.held = true;
  jumpState.buffer = 0.14;
  tryJump();
}

function tryJump() {
  if (!isGrounded || jumpOffset > 0.05 || player.isSwimming || player.stunTimer > 0) return false;
  verticalVelocity = JUMP_VELOCITY;
  isGrounded = false;
  jumpState.buffer = 0;
  jumpState.takeoffTimer = 0.2;
  jumpState.airTime = 0;
  if (playerMesh && player.lastMoveSpeed > 40) createFootstepDustEffect(playerMesh.position.clone());
  return true;
}

// Letting go early cuts the rise short for a small hop.
function releaseJump() {
  jumpState.held = false;
  if (verticalVelocity > 18) verticalVelocity *= 0.5;
}

function dash() {
  if (!gameStarted || player.dashCooldown > 0 || player.stamina < 18) return;
  const direction = new THREE.Vector3(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y));
  playerMesh.position.addScaledVector(direction, 24);
  player.stamina -= 18;
  player.dashCooldown = 0.7;
  player.isDashing = true;
  setTimeout(() => {
    player.isDashing = false;
  }, 180);
  createDustCloud(playerMesh.position.clone());
}

function createFlashStepAfterimage(position) {
  const ghostGeo = new THREE.CylinderGeometry(1.6, 1.6, 7.5, 8);
  const ghostMat = new THREE.MeshBasicMaterial({
    color: 0x66ddff,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });
  const ghost = new THREE.Mesh(ghostGeo, ghostMat);
  ghost.position.copy(position).add(new THREE.Vector3(0, 3.75, 0));
  ghost.rotation.y = playerMesh.rotation.y;
  scene.add(ghost);
  addTimedEffect(ghost, 0.35, (mesh, progress) => {
    mesh.material.opacity = 0.75 * (1 - progress);
    mesh.scale.set(1 + progress * 0.4, 1, 1 + progress * 0.4);
  });

  // Speed sonic shockwave ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.18, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0x9defff, transparent: true, opacity: 0.85 })
  );
  ring.position.copy(position).add(new THREE.Vector3(0, 2.5, 0));
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  addTimedEffect(ring, 0.28, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2.2);
    mesh.material.opacity = 0.85 * (1 - progress);
  });
}

function createEvasionGhost(position) {
  const ghostGeo = new THREE.CylinderGeometry(1.4, 1.4, 7, 8);
  const ghostMat = new THREE.MeshBasicMaterial({
    color: 0xff3344,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });
  const ghost = new THREE.Mesh(ghostGeo, ghostMat);
  ghost.position.copy(position).add(new THREE.Vector3(0, 3.5, 0));
  ghost.rotation.y = playerMesh.rotation.y;
  scene.add(ghost);
  addTimedEffect(ghost, 0.35, (mesh, progress) => {
    mesh.material.opacity = 0.7 * (1 - progress);
    mesh.scale.set(1 + progress * 0.5, 1, 1 + progress * 0.5);
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.16, 8, 28),
    new THREE.MeshBasicMaterial({ color: 0xff4455, transparent: true, opacity: 0.8 })
  );
  ring.position.copy(position).add(new THREE.Vector3(0, 2, 0));
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  addTimedEffect(ring, 0.25, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 1.8);
    mesh.material.opacity = 0.8 * (1 - progress);
  });
}

function flashStep() {
  if (!gameStarted) return;
  if (!player.hasFlashStep) {
    log("⚡ Flash Step is locked! Train with the Flash Step Master in Snowy Village.");
    return;
  }
  if (player.flashStepCooldown > 0) {
    log(`Flash Step on cooldown (${player.flashStepCooldown.toFixed(1)}s).`);
    return;
  }
  if (player.stamina < 20) {
    log("Not enough stamina for Flash Step (requires 20 Energy)!");
    return;
  }

  player.stamina = Math.max(0, player.stamina - 20);
  player.flashStepCooldown = 2.8;

  const startPos = playerMesh.position.clone();
  createFlashStepAfterimage(startPos);
  audio.playFlashStep();

  // Raycast from camera using mouse screen coordinates
  const mouse = new THREE.Vector2(
    (mouseScreenPos.x / window.innerWidth) * 2 - 1,
    -(mouseScreenPos.y / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Intersect candidate objects in the scene (ignoring player and visual effects)
  const intersects = raycaster.intersectObjects(scene.children, true);
  let targetPoint = null;

  for (const hit of intersects) {
    let curr = hit.object;
    let ignore = false;
    while (curr) {
      if (curr === playerMesh) {
        ignore = true;
        break;
      }
      if (curr.userData && (curr.userData.isAfterimage || curr.userData.isEffect || curr.userData.isFloatingText || curr.userData.isParticle)) {
        ignore = true;
        break;
      }
      curr = curr.parent;
    }
    if (ignore) continue;
    if (hit.point) {
      targetPoint = hit.point.clone();
      break;
    }
  }

  // Fallback to ground plane at current player height if no direct mesh intersection
  if (!targetPoint) {
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -playerMesh.position.y);
    const planeIntersection = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(groundPlane, planeIntersection)) {
      const toHit = planeIntersection.clone().sub(camera.position);
      if (toHit.dot(raycaster.ray.direction) > 0) {
        targetPoint = planeIntersection;
      }
    }
  }

  const maxWarpDistance = 85;
  let finalTarget;

  if (targetPoint) {
    const delta = targetPoint.clone().sub(startPos);
    const horizontalDist = Math.hypot(delta.x, delta.z);
    if (horizontalDist > maxWarpDistance) {
      const ratio = maxWarpDistance / horizontalDist;
      finalTarget = new THREE.Vector3(
        startPos.x + delta.x * ratio,
        startPos.y + delta.y * ratio,
        startPos.z + delta.z * ratio
      );
    } else {
      finalTarget = targetPoint;
    }
  } else {
    // Ray pointing into sky without plane intersection: use ray forward horizontal vector
    const dir = raycaster.ray.direction.clone().setY(0);
    if (dir.lengthSq() < 0.001) {
      dir.set(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y));
    }
    dir.normalize();
    finalTarget = startPos.clone().addScaledVector(dir, maxWarpDistance);
  }

  // Rotate player to face the teleport direction
  const dx = finalTarget.x - startPos.x;
  const dz = finalTarget.z - startPos.z;
  if (dx * dx + dz * dz > 0.01) {
    playerMesh.rotation.y = Math.atan2(dx, dz);
  }

  // Set new player position
  playerMesh.position.x = finalTarget.x;
  playerMesh.position.z = finalTarget.z;

  // Resolve ground/elevation height
  const island = getIslandUnderPlayer();
  if (island) {
    const surfaceY = getIslandSurfaceHeightAt(playerMesh.position.x, playerMesh.position.z, island) + 0.15;
    if (finalTarget && finalTarget.y > surfaceY && finalTarget.y < surfaceY + 40) {
      playerMesh.position.y = finalTarget.y + 0.15;
    } else {
      playerMesh.position.y = surfaceY;
    }
  } else {
    playerMesh.position.y = OCEAN_SURFACE_Y + 0.75;
  }

  verticalVelocity = 0;
  jumpOffset = 0;

  resolveWallCollision(startPos);
  createFlashStepAfterimage(playerMesh.position.clone());
  createDustCloud(playerMesh.position.clone());
  createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "⚡ FLASH STEP!", "#9defff");
  log("⚡ Flash Step executed!");
}

function toggleObservationHaki() {
  if (!gameStarted) return;
  if (!player.observationHaki || !player.observationHaki.unlocked) {
    log("👁️ Foresight is locked! Learn it from the Foresight Master in Snowy Village (Level 80+).");
    return;
  }

  player.observationHaki.active = !player.observationHaki.active;
  if (player.observationHaki.active) {
    audio.playObservation();
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 12, 0)), "👁️ FORESIGHT: ON", "#ff4444");
    log(`👁️ Foresight activated! (${player.observationHaki.dodges}/${player.observationHaki.maxDodges} Dodges ready). Threats highlighted.`);
    
    // Spreading observation pulse
    const pulseRing = new THREE.Mesh(
      new THREE.TorusGeometry(8, 0.2, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.85 })
    );
    pulseRing.position.copy(playerMesh.position).add(new THREE.Vector3(0, 2, 0));
    pulseRing.rotation.x = Math.PI / 2;
    scene.add(pulseRing);
    addTimedEffect(pulseRing, 0.6, (mesh, progress) => {
      mesh.scale.setScalar(1 + progress * 14);
      mesh.material.opacity = 0.85 * (1 - progress);
    });
  } else {
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "Foresight: OFF", "#aaaaaa");
    log("👁️ Foresight deactivated.");
  }
}

function updateJump(dt) {
  jumpState.buffer = Math.max(0, jumpState.buffer - dt);
  jumpState.takeoffTimer = Math.max(0, jumpState.takeoffTimer - dt);
  jumpState.landingTimer = Math.max(0, jumpState.landingTimer - dt);
  if (jumpState.buffer > 0 && isGrounded && jumpOffset <= 0) tryJump();

  if (!isGrounded || jumpOffset > 0) {
    jumpState.airTime += dt;
    // Floatier near the top while held, heavier on the way down for a snappy arc.
    let gravity = JUMP_GRAVITY;
    if (verticalVelocity < 0) gravity *= 1.5;
    else if (jumpState.held && verticalVelocity < 14) gravity *= 0.65;
    verticalVelocity -= gravity * dt;
    jumpOffset += verticalVelocity * dt;
    player.lastFallVelocity = Math.min(player.lastFallVelocity, verticalVelocity);
    if (jumpOffset <= 0) {
      const fallDamage = calculateImpactDamage({
        verticalVelocity: player.lastFallVelocity,
        speed: player.lastMoveSpeed * 0.2,
        material: "grass",
        toughness: 0.7,
        baseDamage: 7,
      });
      if (fallDamage > 0) {
        applyImpactDamage(fallDamage, playerMesh.position.clone(), new THREE.Vector3(0, 0, 1), "the ground");
      }
      // Landing squash scales with how hard we came down.
      const impact = Math.min(1, Math.abs(player.lastFallVelocity) / 95);
      if (jumpState.airTime > 0.12) {
        jumpState.landingStrength = 0.35 + impact * 0.65;
        jumpState.landingTimer = 0.24;
        createFootstepDustEffect(playerMesh.position.clone());
        if (impact > 0.75) createDustCloud(playerMesh.position.clone());
      }
      jumpOffset = 0;
      verticalVelocity = 0;
      player.lastFallVelocity = 0;
      isGrounded = true;
      jumpState.airTime = 0;
    }
  }
  playerMesh.position.y += jumpOffset;
}

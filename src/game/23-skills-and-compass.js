
// ── 23-skills-and-compass.js ─ Weapon skills, quest unlocks, compass and combat HUD.
function triggerSwordQ() {
  audio.playSlash();
  createSpecialBurst({ mesh: playerMesh });
  
  enemies.forEach((enemy) => {
    if (enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) < 38) {
      const dmg = Math.round(getDamage() * 1.8);
      damageEnemy(enemy, dmg, "Spin", "#ffcf5a");
    }
  });
}

function triggerGunQ() {
  audio.playShot();
  const forward = new THREE.Vector3(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y)).normalize();
  
  createGunShot();
  setTimeout(() => {
    createGunShot();
  }, 40);
  
  let hits = 0;
  enemies.forEach((enemy) => {
    if (enemy.alive && hits < 3) {
      const toEnemy = enemy.mesh.position.clone().sub(playerMesh.position);
      const dist = toEnemy.length();
      if (dist < 95) {
        toEnemy.normalize();
        const angle = forward.angleTo(toEnemy);
        if (angle < 0.42) {
          hits++;
          const dmg = Math.round(getDamage() * 1.25);
          damageEnemy(enemy, dmg, "Buckshot", "#ff7a3d");
        }
      }
    }
  });
}

function triggerSpecialQ() {
  audio.playQuestComplete();
  sun.intensity = 6.0;
  scene.background.setHex(0xffffff);
  scene.fog.color.setHex(0xffffff);
  setTimeout(() => {
    updateDayNightLighting(0);
  }, 80);
  
  enemies.forEach((enemy) => {
    if (enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) < 140) {
      const dmg = Math.round(getDamage() * 2.2);
      damageEnemy(enemy, dmg, "⚡ LIGHTNING", "#7ce0b4");
      createWallHitEffect(enemy.mesh.position.clone(), true);
    }
  });
}

// ========================
// NEW SYSTEMS
// ========================

function checkNewQuestUnlocks() {
  if (!player.unlockedQuestsSeen) player.unlockedQuestsSeen = { starter: true };
  let hasNew = false;
  Object.values(questCatalog).forEach((q) => {
    if (player.level >= q.minLevel && !player.unlockedQuestsSeen[q.id]) {
      hasNew = true;
    }
  });
  if (hasNew) {
    player.newQuestUnlocked = true;
  }
}

function executeSkillByKey(keyChar) {
  if (!gameStarted) return;
  const weapon = player.weapon;
  let skills = masterySkills[weapon] || [];
  // Ember Shot (C) and Inferno Kick (V) are standard melee attacks for everyone.
  const skill = skills.find(s => s.key === keyChar);
  if (!skill) return;

  const masteryLevel = player.mastery[weapon] || 1;
  if (masteryLevel < skill.req) {
    log(`Skill locked! Need Mastery ${skill.req} for ${skill.name}.`);
    return;
  }

  const cooldownRemaining = skillCooldowns[skill.id] || 0;
  if (cooldownRemaining > 0) {
    log(`${skill.name} on cooldown (${cooldownRemaining.toFixed(1)}s).`);
    return;
  }

  skillCooldowns[skill.id] = skill.cd;
  triggerActiveSkill(skill.id);
  updateCombatHud();
}

function getQuestTargetPosition() {
  if (!quest.active && !quest.complete) {
    return new THREE.Vector3(52, STARTER_SURFACE_Y, 16);
  }
  if (quest.active && !quest.complete) {
    const aliveBandit = enemies.find(e => !e.type && e.alive);
    if (aliveBandit) return aliveBandit.mesh.position;
    return new THREE.Vector3(-100, STARTER_SURFACE_Y, 20);
  }
  if (quest.complete && !activeQuest) {
    if (islands[2]) {
      return islands[2].position.clone().add(new THREE.Vector3(-80, 0, 40));
    }
    return questGiverPosition;
  }
  if (activeQuest && activeQuest.active) {
    const tt = activeQuest.targetType;
    const alive = enemies.find(e => e.type === tt && e.alive);
    if (alive) return alive.mesh.position;
    if (islands[2]) return islands[2].position;
  }
  return null;
}

function updateCompass() {
  if (!gameStarted || !ui.questCompass || !ui.compassPointer || !playerMesh) return;

  if (player.newQuestUnlocked) {
    ui.questCompass.classList.add("new-quest-unlocked");
  } else {
    ui.questCompass.classList.remove("new-quest-unlocked");
  }

  const targetPos = getQuestTargetPosition();
  if (!targetPos) { ui.questCompass.style.opacity = "0"; return; }
  ui.questCompass.style.opacity = "1";

  const dx = targetPos.x - playerMesh.position.x;
  const dz = targetPos.z - playerMesh.position.z;
  const distance = Math.sqrt(dx * dx + dz * dz);
  const targetYaw = isHelming ? boatYaw : cameraYaw;

  const fx = -Math.sin(targetYaw);
  const fz = -Math.cos(targetYaw);
  const rx = Math.cos(targetYaw);
  const rz = -Math.sin(targetYaw);
  const forwardProj = dx * fx + dz * fz;
  const rightProj = dx * rx + dz * rz;
  const angle = Math.atan2(rightProj, forwardProj);

  ui.compassPointer.style.transform = `rotate(${angle}rad)`;
  if (ui.compassLabel) ui.compassLabel.textContent = `${Math.round(distance)}m`;
}

function updateCombatHud() {
  if (!ui.combatHud) return;

  const weapon = player.weapon;
  const val = player.masteryXp ? (player.masteryXp[weapon] || 0) : 0;
  const weaponEmojis = { melee: "👊", sword: "⚔️", gun: "🔫", special: "✨" };
  const weaponNames = { melee: "MELEE", sword: "SWORD", gun: "GUN", special: "SPECIAL" };

  if (ui.combatWeaponIcon) ui.combatWeaponIcon.textContent = weaponEmojis[weapon] || "👊";
  if (ui.combatWeaponName) ui.combatWeaponName.textContent = weaponNames[weapon] || "COMBAT";

  let skills = masterySkills[weapon] || [];
  // Ember Shot (C) and Inferno Kick (V) are standard melee attacks for everyone.
  const masteryInfo = getMasteryInfo(val);
  const currentLevel = masteryInfo.level;
  const currentLevelPoints = masteryInfo.currentLevelPoints;
  const neededForNext = masteryInfo.neededForNext;
  const neededText = `(Need ${neededForNext - currentLevelPoints} MP)`;

  if (ui.combatMasteryLabel) ui.combatMasteryLabel.textContent = `Mastery ${currentLevel}`;
  if (ui.combatMasteryBar) ui.combatMasteryBar.style.width = `${Math.min(100, (currentLevelPoints / neededForNext) * 100)}%`;
  if (ui.combatMasteryText) ui.combatMasteryText.textContent = `${currentLevelPoints}/${neededForNext} ${neededText}`;

  if (ui.combatSkillsList) {
    ui.combatSkillsList.innerHTML = skills.map(skill => {
      const unlocked = currentLevel >= skill.req;
      const cd = skillCooldowns[skill.id] || 0;
      const cdPercent = cd > 0 ? (cd / skill.cd) * 100 : 0;
      const rowClass = `combat-skill-row${unlocked ? "" : " locked"}${unlocked ? " skill-row-glow" : ""}`;
      return `
        <div class="${rowClass}">
          <div class="skill-cooldown-overlay" style="height:${cdPercent}%"></div>
          <span class="skill-key">${skill.key}</span>
          <div class="skill-info">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-req">${unlocked ? "UNLOCKED" : `Mastery ${skill.req}`}</span>
          </div>
          ${cd > 0 ? `<span class="skill-cd-number">${cd.toFixed(1)}s</span>` : ""}
        </div>`;
    }).join("");
  }
}

function triggerCombatFlash() {
  const flash = document.querySelector("#combat-flash");
  if (flash) {
    flash.classList.remove("active");
    void flash.offsetWidth; // Force reflow
    flash.classList.add("active");
    setTimeout(() => {
      flash.classList.remove("active");
    }, 80);
  }
}

function triggerActiveSkill(skillId) {
  const forward = new THREE.Vector3(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y)).normalize();

  if (skillId === "falcon-punch") {
    // Immediately snap player mesh to face where the camera is looking
    playerMesh.rotation.y = cameraYaw + Math.PI;

    // Set procedural charging animation on the model
    if (playerMesh?.userData?.animation) {
      playerMesh.userData.animation.punchChargeTimer = 0.3;
      playerMesh.userData.animation.punchChargeDuration = 0.3;
    }

    // Delay the punch release, damage, and audio by 300ms (charge time)
    setTimeout(() => {
      if (!gameStarted || !playerMesh) return;

      // Re-snap to camera yaw in case they turned camera during the 0.3s charge
      playerMesh.rotation.y = cameraYaw + Math.PI;

      // Re-calculate the direction vector when the punch is released
      let currentForward = new THREE.Vector3(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y)).normalize();

      // High-range single target detection towards the direction player is facing (up to 24 units visual range + 4 units radius buffer)
      const punchRange = 24;
      const candidates = enemies
        .filter(e => e.alive)
        .map(e => {
          const toEnemy = e.mesh.position.clone().sub(playerMesh.position);
          const dist3D = toEnemy.length();
          const toEnemy2D = toEnemy.clone().setY(0);
          const dist2D = toEnemy2D.length();
          return { enemy: e, toEnemy2D, dist2D, dist3D };
        })
        .filter(item => item.dist2D <= punchRange + 4.0) // 28 units center-to-center accounts for 24 units visual reach plus body radii
        .filter(item => {
          if (item.dist2D < 8.0) return true; // Close range automatic hit
          const angle = currentForward.angleTo(item.toEnemy2D.clone().normalize());
          return angle < 1.15; // Generous facing cone (~66 degrees) for gameplay forgiveness
        })
        .sort((a, b) => a.dist2D - b.dist2D);

      const t = candidates.length > 0 ? candidates[0].enemy : null;

      // Aim-snap: if target found, snap player Y-rotation and align currentForward to face them directly!
      if (t) {
        const toTarget = t.mesh.position.clone().sub(playerMesh.position).setY(0).normalize();
        playerMesh.rotation.y = Math.atan2(toTarget.x, toTarget.z);
        currentForward.copy(toTarget);
      }

      audio.playSlash();
      triggerCombatFlash();
      createMeleeBurst(playerMesh);

      // Play release punch strike animation
      if (playerMesh.userData.animation) {
        playerMesh.userData.animation.attackTimer = 0.22;
        playerMesh.userData.animation.attackDuration = 0.22;
        playerMesh.userData.animation.attackImpact = 1.0;
      }

      // Visual feedback: a series of shockwaves/bursts along the path, and ground rupture V-shaped rocks
      const maxDistance = t ? Math.max(4, t.mesh.position.distanceTo(playerMesh.position)) : 24;
      const perpendicular = new THREE.Vector3(-currentForward.z, 0, currentForward.x).normalize();

      // We'll spawn pairs of rocks in a forward-rippling sequence up to maxDistance
      for (let d = 3.5; d <= maxDistance; d += 2.5) {
        const delay = (d / 24) * 200; // sequential forward ripple delay (0 to 200ms)

        setTimeout(() => {
          if (!gameStarted || !playerMesh) return;

          const progress = (d - 3.5) / 20.5; // 0 to 1 scaling along the path
          const sizeMultiplier = 0.35 + 1.25 * progress; // near you are smaller, further from you are bigger
          const halfWidth = 1.2 + progress * 6.5; // V-shape divergence (starts close, spreads outwards)

          // Spawn a left and a right rock
          const offsets = [halfWidth, -halfWidth];
          offsets.forEach(offsetSign => {
            const rockPos = playerMesh.position.clone()
              .addScaledVector(currentForward, d)
              .addScaledVector(perpendicular, offsetSign);

            const rockRadius = (1.5 + Math.random() * 0.8) * sizeMultiplier;
            const rockGeo = new THREE.DodecahedronGeometry(rockRadius, 0);
            rockGeo.scale(1.2, 0.7 + Math.random() * 0.5, 0.8 + Math.random() * 0.4);

            const rockMat = new THREE.MeshStandardMaterial({
              color: 0x5a4f43, // match Ground Slam rock color
              roughness: 0.95,
              metalness: 0.1,
              flatShading: true
            });

            const rock = new THREE.Mesh(rockGeo, rockMat);
            const startY = rockPos.y - 6 * sizeMultiplier;
            const baseY = rockPos.y + 0.2;

            rock.position.set(rockPos.x, startY, rockPos.z);
            rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            rock.castShadow = true;
            rock.receiveShadow = true;
            scene.add(rock);

            // Spawn smoke/dust above rising rock
            if (Math.random() < 0.7) {
              const smokePos = rockPos.clone();
              smokePos.y += rockRadius * 0.8;
              createDustCloud(smokePos);
            }

            // Push to hazards to animate and auto-expire
            hazards.push({
              mesh: rock,
              damage: 0, // visual hazard, doesn't deal extra damage
              radius: 0.1,
              age: 0,
              duration: 2.2,
              owner: "player",
              startY: startY,
              baseY: baseY
            });
          });

          // Also spawn the golden shockwave ring at this point along the center line
          const effectPos = playerMesh.position.clone().addScaledVector(currentForward, d);
          effectPos.y += 3.5; // hand height
          
          const punchRing = new THREE.Mesh(
            new THREE.TorusGeometry(1.2 + progress * 2.2, 0.15, 8, 24),
            new THREE.MeshBasicMaterial({ color: 0xffdf80, transparent: true, opacity: 0.85 })
          );
          punchRing.position.copy(effectPos);
          punchRing.lookAt(effectPos.clone().add(currentForward));
          
          addTimedEffect(punchRing, 0.22, (mesh, progress) => {
            mesh.scale.setScalar(1 + progress * 1.5);
            mesh.material.opacity = 0.85 * (1 - progress);
          });
        }, delay);
      }

      if (t) {
        const dmg = Math.max(t.maxHealth * 2.5, 9999);
        // Violent knockback
        t.mesh.position.addScaledVector(currentForward, 24);
        cameraShake = Math.max(cameraShake, 2.2);
        createWallHitEffect(t.mesh.position.clone(), true);
        damageEnemy(t, dmg, "FalconPunch", "#ffcf5a");
      } else {
        cameraShake = Math.max(cameraShake, 0.8);
        const endPos = playerMesh.position.clone().addScaledVector(currentForward, 24);
        createWallHitEffect(endPos, false);
      }
    }, 300);
  } else if (skillId === "ground-slam") {
    createGroundSlam(playerMesh.position.clone(), { type: "player" });
    triggerCombatFlash();
    audio.playImpact();
    enemies.forEach(e => {
      if (e.alive && e.mesh.position.distanceTo(playerMesh.position) < 48) {
        const dmg = Math.round(getDamage() * 2.2);
        damageEnemy(e, dmg, "Slam", "#ffcf5a");
      }
    });

  } else if (skillId === "gatling-flurry") {
    let count = 0;
    const iv = setInterval(() => {
      if (count >= 10 || !gameStarted) { clearInterval(iv); return; }
      audio.playSlash();
      const pos = playerMesh.position.clone().addScaledVector(forward, 6 + Math.random() * 8).add(new THREE.Vector3((Math.random() - 0.5) * 4, 3 + (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4));
      createDustCloud(pos);
      enemies.forEach(e => {
        if (e.alive && e.mesh.position.distanceTo(playerMesh.position) < 30) {
          const dmg = Math.round(getDamage() * 0.38);
          damageEnemy(e, dmg, "Gatling", "#ffcf5a");
        }
      });
      count++;
    }, 100);

  } else if (skillId === "piercing-thrust") {
    audio.playSlash();
    playerMesh.position.addScaledVector(forward, 20);
    createSwordSlash(playerMesh);
    enemies.forEach(e => {
      if (!e.alive) return;
      const toE = e.mesh.position.clone().sub(playerMesh.position).normalize();
      if (forward.angleTo(toE) < 0.5 && e.mesh.position.distanceTo(playerMesh.position) < 38) {
        const dmg = Math.round(getDamage() * 2.1);
        damageEnemy(e, dmg, "Thrust", "#f6b73c");
      }
    });

  } else if (skillId === "cyclone-spin") {
    audio.playSlash();
    createSpecialBurst(playerMesh);
    enemies.forEach(e => {
      if (e.alive && e.mesh.position.distanceTo(playerMesh.position) < 42) {
        const dmg = Math.round(getDamage() * 1.9);
        damageEnemy(e, dmg, "Cyclone", "#ffcf5a");
      }
    });

  } else if (skillId === "dimensional-slash") {
    audio.playSlash();
    createAirSlash(playerMesh.position.clone().add(new THREE.Vector3(0, 6, 0)), forward, { type: "player" });

  } else if (skillId === "double-tap") {
    audio.playShot();
    createGunShot();
    const shoot = () => {
      const t = enemies.filter(e => e.alive && e.mesh.position.distanceTo(playerMesh.position) <= 130)
        .sort((a, b) => a.mesh.position.distanceTo(playerMesh.position) - b.mesh.position.distanceTo(playerMesh.position))[0];
      if (t) {
        const dmg = Math.round(getDamage() * 1.4);
        damageEnemy(t, dmg, "DoubleTap", "#9defff");
      }
    };
    shoot();
    setTimeout(() => { audio.playShot(); createGunShot(); shoot(); }, 160);

  } else if (skillId === "buckshot-cone") {
    audio.playShot();
    createGunShot(); createGunShot();
    let hits = 0;
    enemies.forEach(e => {
      if (!e.alive || hits >= 5) return;
      const toE = e.mesh.position.clone().sub(playerMesh.position);
      if (toE.length() < 95 && forward.angleTo(toE.normalize()) < 0.5) {
        hits++;
        const dmg = Math.round(getDamage() * 1.3);
        damageEnemy(e, dmg, "Buckshot", "#ff7a3d");
      }
    });

  } else if (skillId === "mortar-blast") {
    audio.playShot();
    const shell = new THREE.Mesh(
      new THREE.DodecahedronGeometry(2, 0),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8, metalness: 0.9, emissive: 0xff4400, emissiveIntensity: 0.6 })
    );
    shell.position.copy(playerMesh.position).add(new THREE.Vector3(0, 6, 0)).addScaledVector(forward, 8);
    scene.add(shell);
    projectiles.push({ mesh: shell, direction: forward.clone(), speed: 68, damage: Math.round(getDamage() * 2.8), age: 0, duration: 2.0, owner: "player", isMortar: true });

  } else if (skillId === "pulse-bubble") {
    audio.playQuestComplete();
    createSpecialBurst(playerMesh);
    enemies.forEach(e => {
      if (e.alive && e.mesh.position.distanceTo(playerMesh.position) < 55) {
        const push = e.mesh.position.clone().sub(playerMesh.position).setY(0).normalize();
        e.mesh.position.addScaledVector(push, 34);
        const dmg = Math.round(getDamage() * 1.5);
        damageEnemy(e, dmg, "Bubble", "#7ce0b4");
      }
    });

  } else if (skillId === "storm-call") {
    audio.playQuestComplete();
    sun.intensity = 6.0;
    scene.background.setHex(0xffffff);
    scene.fog.color.setHex(0xffffff);
    setTimeout(() => updateDayNightLighting(0), 80);
    enemies.forEach(e => {
      if (e.alive && e.mesh.position.distanceTo(playerMesh.position) < 140) {
        const dmg = Math.round(getDamage() * 2.2);
        damageEnemy(e, dmg, "⚡ Storm", "#7ce0b4");
        createWallHitEffect(e.mesh.position.clone(), true);
      }
    });

  } else if (skillId === "celestial-beam") {
    audio.playSpecial();
    const beamGeo = new THREE.CylinderGeometry(2.5, 2.5, 90, 8, 1, true);
    beamGeo.rotateX(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x7ce0b4, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    const beamCenter = playerMesh.position.clone().add(new THREE.Vector3(0, 5, 0)).addScaledVector(forward, 45);
    beam.position.copy(beamCenter);
    beam.lookAt(playerMesh.position.clone().add(new THREE.Vector3(0, 5, 0)));
    scene.add(beam);
    let tick = 0;
    const biv = setInterval(() => {
      if (tick >= 6 || !gameStarted) { clearInterval(biv); scene.remove(beam); return; }
      enemies.forEach(e => {
        if (!e.alive) return;
        const toE = e.mesh.position.clone().sub(playerMesh.position);
        if (toE.length() < 95 && forward.angleTo(toE.normalize()) < 0.3) {
          const dmg = Math.round(getDamage() * 0.5);
          damageEnemy(e, dmg, "Beam", "#7ce0b4");
        }
      });
      beam.material.opacity = Math.max(0, 0.9 - (tick / 6) * 0.7);
      tick++;
    }, 200);

  } else if (skillId === "grand-awakening") {
    audio.playQuestComplete();
    player.health = Math.min(player.maxHealth, player.health + 100);
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "+100 HP HEAL", "#7ce0b4");
    sun.intensity = 9.0;
    scene.background.setHex(0xa775ff);
    scene.fog.color.setHex(0xa775ff);
    setTimeout(() => updateDayNightLighting(0), 120);
    enemies.forEach(e => {
      if (e.alive && e.health < e.maxHealth * 0.22 && e.mesh.position.distanceTo(playerMesh.position) < 130) {
        createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "VAPORIZED!", "#a775ff");
        e.health = 0;
        defeatEnemy(e);
      }
    });
    updateHud();

  } else if (skillId === "gods-judgment") {
    audio.playQuestComplete();
    cameraShake = Math.max(cameraShake, 3.5);
    const pillarGeo = new THREE.CylinderGeometry(14, 14, 200, 16, 1, true);
    const pillarMat = new THREE.MeshBasicMaterial({ color: 0x3ce88a, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.copy(playerMesh.position).setY(100);
    scene.add(pillar);
    enemies.forEach(e => {
      if (e.alive && e.mesh.position.distanceTo(playerMesh.position) < 80) {
        const dmg = Math.round(getDamage() * 4.2);
        damageEnemy(e, dmg, "⚡JUDGMENT", "#3ce88a");
      }
    });
    let f = 0;
    const fiv = setInterval(() => {
      if (f >= 10 || !gameStarted) { clearInterval(fiv); scene.remove(pillar); return; }
      pillar.scale.x = Math.max(0.05, pillar.scale.x - 0.08);
      pillar.scale.z = Math.max(0.05, pillar.scale.z - 0.08);
      pillar.material.opacity = Math.max(0, pillar.material.opacity - 0.09);
      f++;
    }, 80);

  } else if (skillId === "flambage-shot") {
    audio.playSlash();
    const dashDir = new THREE.Vector3(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y)).normalize();
    const dashDist = 25;
    const startPos = playerMesh.position.clone();
    let step = 0;
    const steps = 5;
    const stepDist = dashDist / steps;
    const interval = setInterval(() => {
      if (step >= steps || !gameStarted) {
        clearInterval(interval);
        return;
      }
      playerMesh.position.addScaledVector(dashDir, stepDist);
      resolveWallCollision(playerMesh.position.clone().addScaledVector(dashDir, -stepDist));
      createFireBurst(playerMesh.position.clone().add(new THREE.Vector3(0, 2, 0)));
      enemies.forEach(e => {
        if (e.alive && e.mesh.position.distanceTo(playerMesh.position) < 18) {
          const dmg = Math.round(getDamage() * 1.8);
          const push = e.mesh.position.clone().sub(startPos).setY(0).normalize();
          e.mesh.position.addScaledVector(push, 20);
          damageEnemy(e, dmg, "🔥 Ember Shot", "#ff3300");
          createFireBurst(e.mesh.position.clone());
        }
      });
      step++;
    }, 40);

  } else if (skillId === "diable-jambe") {
    audio.playQuestComplete();
    player.diableJambeTimer = 18;
    player.diableJambeHits = 0;
    createFireBurst(playerMesh.position.clone().add(new THREE.Vector3(0, 3, 0)));
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 12, 0)), "🔥 INFERNO KICK!", "#ff2200");
    log("🔥 Inferno Kick activated! Kicks are now infused with friction flames!");
  }
}

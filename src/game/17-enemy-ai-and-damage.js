
// ── 17-enemy-ai-and-damage.js ─ Enemy AI updates and damage to/from the player.
function setEnemyWeaponVisuals(enemy, weapon) {
  if (!enemy.mesh) return;
  enemy.mesh.children.forEach(child => {
    if (child.name === "gun") {
      child.visible = (weapon === "gun");
    }
  });
  const avatar = enemy.mesh.children[0];
  if (avatar) {
    avatar.children.forEach(child => {
      if (child.name === "swordGroup") {
        child.visible = (weapon === "sword");
      }
    });
  }
}

function updateEnemies(dt) {
  updateSurgeRocks(dt);
  enemies.forEach((enemy) => {
    if (!enemy.alive) {
      enemy.respawnTimer -= dt;
      if (enemy.respawnTimer <= 0) {
        enemy.alive = true;
        enemy.health = enemy.maxHealth;
        enemy.mesh.visible = true;
        enemy.mesh.position.copy(enemy.spawn);
      }
      return;
    }

    enemy.hitTimer = Math.max(0, enemy.hitTimer - dt);

    // Captain Jester split-apart animation
    if (enemy.type === "buggy" && enemy.parts) {
      const parts = enemy.parts;
      const t = performance.now() * 0.015;
      
      const isAttacking = enemy.ai.rush > 1.2 || enemy.ai.slash > 1.6;
      const isDamaged = enemy.hitTimer > 0;
      
      if (isAttacking) {
        parts.leftArm.position.set(-6 + Math.sin(t) * 8, 5.9, Math.cos(t) * 8);
        parts.rightArm.position.set(6 + Math.cos(t) * 8, 5.9, Math.sin(t) * 8);
        parts.leftLeg.position.set(-2, 2.45 + Math.sin(t * 2) * 3, 0);
        parts.rightLeg.position.set(2, 2.45 + Math.cos(t * 2) * 3, 0);
        parts.head.position.y = 8.65 + Math.sin(t) * 4;
      } else if (isDamaged) {
        parts.head.position.y = 14 + Math.sin(t) * 3;
        parts.head.rotation.y += 0.5;
        parts.leftArm.position.set(-2.25, 5.9, 0);
        parts.rightArm.position.set(2.25, 5.9, 0);
        parts.leftLeg.position.set(-0.85, 2.45, 0);
        parts.rightLeg.position.set(0.85, 2.45, 0);
      } else {
        parts.head.position.y = 8.65 + Math.sin(t * 0.4) * 0.7;
        parts.leftArm.position.set(-2.25, 5.9, 0);
        parts.rightArm.position.set(2.25, 5.9, 0);
        parts.leftLeg.position.set(-0.85, 2.45, 0);
        parts.rightLeg.position.set(0.85, 2.45, 0);
      }
    }

    if (enemy.type === "brute") {
      enemy.comboStep = enemy.comboStep !== undefined ? enemy.comboStep : 0;
      enemy.comboCooldown = enemy.comboCooldown !== undefined ? enemy.comboCooldown : 0;
      enemy.groundSurgeCooldown = enemy.groundSurgeCooldown !== undefined ? enemy.groundSurgeCooldown : 6.0;
      enemy.deadlyComboCooldown = enemy.deadlyComboCooldown !== undefined ? enemy.deadlyComboCooldown : 10.0;
      enemy.activeComboState = enemy.activeComboState !== undefined ? enemy.activeComboState : null;
      enemy.deadlyComboTimer = enemy.deadlyComboTimer !== undefined ? enemy.deadlyComboTimer : 0;
      enemy.deadlyComboHits = enemy.deadlyComboHits !== undefined ? enemy.deadlyComboHits : 0;
      enemy.finisherStep = enemy.finisherStep !== undefined ? enemy.finisherStep : 0;
      enemy.finisherTimer = enemy.finisherTimer !== undefined ? enemy.finisherTimer : 0;
      enemy.swingTimer = enemy.swingTimer !== undefined ? enemy.swingTimer : 0;
      enemy.swingType = enemy.swingType !== undefined ? enemy.swingType : null;
      
      enemy.comboCooldown = Math.max(0, enemy.comboCooldown - dt);
      enemy.groundSurgeCooldown = Math.max(0, enemy.groundSurgeCooldown - dt);
      enemy.deadlyComboCooldown = Math.max(0, enemy.deadlyComboCooldown - dt);

      const distance = enemy.mesh.position.distanceTo(playerMesh.position);
      const aggroRange = 170;

      // Mace swing animation update
      if (enemy.swingTimer > 0) {
        enemy.swingTimer -= dt;
        if (enemy.mace) {
          if (enemy.swingType === "left") {
            enemy.mace.rotation.y = Math.sin(enemy.swingTimer * 10) * 1.5;
          } else if (enemy.swingType === "right") {
            enemy.mace.rotation.y = -Math.sin(enemy.swingTimer * 10) * 1.5;
          } else if (enemy.swingType === "uppercut") {
            enemy.mace.rotation.x = -Math.sin(enemy.swingTimer * 10) * 1.5;
            enemy.mace.position.y = 5.2 + Math.sin(enemy.swingTimer * 10) * 3;
          } else if (enemy.swingType === "slam") {
            enemy.mace.rotation.x = Math.sin(enemy.swingTimer * 10) * 2.0;
            enemy.mace.position.y = 5.2 - Math.sin(enemy.swingTimer * 10) * 2;
          }
        }
      } else {
        if (enemy.mace) {
          enemy.mace.rotation.set(0, 0, -0.72);
          enemy.mace.position.set(3.5, 5.2, 0.8);
        }
      }

      if (distance < aggroRange) {
        const direction = playerMesh.position.clone().sub(enemy.mesh.position).setY(0).normalize();
        enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);

        if (enemy.activeComboState === "deadly") {
          enemy.deadlyComboTimer += dt;
          const speed = 35;
          if (distance > 18) {
            enemy.mesh.position.addScaledVector(direction, dt * speed);
          }

          const hitTimes = [0.4, 0.7, 1.0, 1.3];
          hitTimes.forEach((hitTime, idx) => {
            if (enemy.deadlyComboHits === idx && enemy.deadlyComboTimer >= hitTime) {
              enemy.deadlyComboHits += 1;
              if (distance < 50) {
                damagePlayer(8, "Deadly Combo Strike");
                player.stunTimer = 0.5;
                enemy.swingType = idx % 2 === 0 ? "left" : "right";
                enemy.swingTimer = 0.25;
              }
            }
          });

          if (enemy.deadlyComboTimer >= 1.8) {
            if (distance < 50) {
              if (player.health < 100) {
                enemy.activeComboState = "finisher";
                enemy.finisherTimer = 0;
                enemy.finisherStep = 0;
                
                damagePlayer(30, "Mace Finisher Slam");
                player.knockedDown = true;
                player.stunTimer = 4.0;
                verticalVelocity = -220;
                jumpOffset = 0;
                createGroundSlam(playerMesh.position.clone(), enemy);
                log("Special Finisher! The Brute slams you down and prepares to pierce!");
              } else {
                damagePlayer(25, "Deadly Combo Slam");
                player.knockedDown = true;
                player.stunTimer = 1.5;
                createGroundSlam(playerMesh.position.clone(), enemy);
                
                enemy.activeComboState = null;
                enemy.deadlyComboCooldown = 15.0;
                enemy.comboCooldown = 2.5;
              }
            } else {
              enemy.activeComboState = null;
              enemy.deadlyComboCooldown = 15.0;
              enemy.comboCooldown = 2.0;
            }
          }
        } else if (enemy.activeComboState === "finisher") {
          enemy.finisherTimer += dt;
          if (distance > 12) {
            enemy.mesh.position.addScaledVector(direction, dt * 15);
          }

          if (enemy.finisherStep === 0 && enemy.finisherTimer >= 1.0) {
            enemy.finisherStep = 1;
            damagePlayer(70, "Mace Finisher Pierce");
            enemy.swingType = "slam";
            enemy.swingTimer = 0.5;
            createDustCloud(playerMesh.position.clone());
            cameraShake = Math.max(cameraShake, 2.5);
            log("Crucial Pierce! You took massive finisher damage!");
          }

          if (enemy.finisherTimer >= 2.0) {
            enemy.activeComboState = null;
            enemy.deadlyComboCooldown = 20.0;
            enemy.comboCooldown = 3.0;
          }
        } else {
          const speed = 18;
          if (enemy.comboCooldown <= 0) {
            if (enemy.deadlyComboCooldown <= 0 && distance < 65) {
              enemy.activeComboState = "deadly";
              enemy.deadlyComboTimer = 0;
              enemy.deadlyComboHits = 0;
            } else if (enemy.groundSurgeCooldown <= 0 && distance > 50 && distance < 150) {
              enemy.activeComboState = "surge";
              enemy.comboCooldown = 1.5;
              createGroundSurge(enemy);
              enemy.groundSurgeCooldown = 10.0;
            } else if (distance < 44) {
              if (enemy.comboStep === 0) {
                damagePlayer(15, "Mace Swing Left");
                player.stunTimer = 0.5;
                enemy.swingType = "left";
                enemy.swingTimer = 0.3;
                enemy.comboCooldown = 0.5;
                enemy.comboStep = 1;
              } else if (enemy.comboStep === 1) {
                damagePlayer(15, "Mace Swing Right");
                player.stunTimer = 0.5;
                enemy.swingType = "right";
                enemy.swingTimer = 0.3;
                enemy.comboCooldown = 0.5;
                enemy.comboStep = 2;
              } else if (enemy.comboStep === 2) {
                damagePlayer(20, "Mace Uppercut");
                player.stunTimer = 1.0;
                verticalVelocity = 160;
                isGrounded = false;
                enemy.swingType = "uppercut";
                enemy.swingTimer = 0.4;
                enemy.comboCooldown = 0.5;
                enemy.comboStep = 3;
              } else if (enemy.comboStep === 3) {
                damagePlayer(25, "Mace Ground Slam");
                player.knockedDown = true;
                player.stunTimer = 2.0;
                verticalVelocity = -220;
                createGroundSlam(playerMesh.position.clone(), enemy);
                enemy.swingType = "slam";
                enemy.swingTimer = 0.5;
                enemy.comboCooldown = 3.0;
                enemy.comboStep = 0;
              }
            } else {
              enemy.mesh.position.addScaledVector(direction, dt * speed);
            }
          } else {
            if (distance > 28) {
              enemy.mesh.position.addScaledVector(direction, dt * speed);
            }
          }
        }
      }
    } else if (enemy.type === "monkey") {
      const distance = enemy.mesh.position.distanceTo(playerMesh.position);
      const aggroRange = 170;

      if (distance < aggroRange) {
        const direction = playerMesh.position.clone().sub(enemy.mesh.position).setY(0).normalize();
        const speed = 24;
        enemy.mesh.position.addScaledVector(direction, dt * speed);
        enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);

        if (distance < 7 && enemy.hitTimer <= 0) {
          damagePlayer(Math.round(8 * getAvatarTraits().incomingDamageMultiplier), "Monkey Strike");
          enemy.hitTimer = 1.0;
          updateHud();
        }
      }
    } else if (enemy.type === "gorilla") {
      const distance = enemy.mesh.position.distanceTo(playerMesh.position);
      const aggroRange = 170;

      if (distance < aggroRange) {
        const direction = playerMesh.position.clone().sub(enemy.mesh.position).setY(0).normalize();
        const speed = 22;
        enemy.mesh.position.addScaledVector(direction, dt * speed);
        enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);

        if (distance < 7 && enemy.hitTimer <= 0) {
          damagePlayer(Math.round(16 * getAvatarTraits().incomingDamageMultiplier), "Gorilla Strike");
          enemy.hitTimer = 1.0;
          updateHud();
        }
      }
    } else if (enemy.type === "gorilla_king") {
      enemy.slamCount = enemy.slamCount !== undefined ? enemy.slamCount : 0;
      enemy.slamTimer = enemy.slamTimer !== undefined ? enemy.slamTimer : 0;
      enemy.slamCooldown = enemy.slamCooldown !== undefined ? enemy.slamCooldown : 8.0;
      
      enemy.slamCooldown = Math.max(0, enemy.slamCooldown - dt);
      
      const distance = enemy.mesh.position.distanceTo(playerMesh.position);
      const aggroRange = 200;

      if (distance < aggroRange) {
        const direction = playerMesh.position.clone().sub(enemy.mesh.position).setY(0).normalize();
        enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);

        if (enemy.slamCount > 0) {
          enemy.slamTimer += dt;
          if (enemy.slamTimer >= 0.6) {
            enemy.slamTimer = 0;
            createGroundSlam(enemy.mesh.position.clone(), enemy);
            enemy.slamCount -= 1;
            if (enemy.slamCount === 0) {
              enemy.slamCooldown = 8.0;
            }
          }
        } else {
          const speed = 25;
          if (distance > 10) {
            enemy.mesh.position.addScaledVector(direction, dt * speed);
          }

          if (enemy.slamCooldown <= 0 && distance < 60) {
            enemy.slamCount = 4;
            enemy.slamTimer = 0.5;
          } else if (distance < 10 && enemy.hitTimer <= 0) {
            damagePlayer(Math.round(24 * getAvatarTraits().incomingDamageMultiplier), "Gorilla King Strike");
            enemy.hitTimer = 1.0;
            updateHud();
          }
        }
      }
    } else if (enemy.type === "desert_officer") {
      enemy.currentWeapon = enemy.currentWeapon || "gun";
      enemy.shootCooldown = enemy.shootCooldown !== undefined ? enemy.shootCooldown : 1.0;
      enemy.shootCooldown = Math.max(0, enemy.shootCooldown - dt);

      const distance = enemy.mesh.position.distanceTo(playerMesh.position);
      const aggroRange = 170;

      if (distance < aggroRange) {
        const direction = playerMesh.position.clone().sub(enemy.mesh.position).setY(0).normalize();
        enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);

        if (distance < 28) {
          if (enemy.currentWeapon !== "sword") {
            enemy.currentWeapon = "sword";
            setEnemyWeaponVisuals(enemy, "sword");
          }
        } else {
          if (enemy.currentWeapon !== "gun") {
            enemy.currentWeapon = "gun";
            setEnemyWeaponVisuals(enemy, "gun");
          }
        }

        if (enemy.currentWeapon === "sword") {
          const speed = 30;
          enemy.mesh.position.addScaledVector(direction, dt * speed);

          if (distance < 7 && enemy.hitTimer <= 0) {
            damagePlayer(Math.round(15 * getAvatarTraits().incomingDamageMultiplier), "Officer Slash");
            enemy.hitTimer = 1.0;
            updateHud();
          }
        } else {
          const speed = 14;
          enemy.mesh.position.addScaledVector(direction, dt * speed);

          if (enemy.shootCooldown <= 0) {
            const muzzleOffset = new THREE.Vector3(0, 5, 0).addScaledVector(direction, 3);
            const shootPos = enemy.mesh.position.clone().add(muzzleOffset);
            const targetPos = playerMesh.position.clone().add(new THREE.Vector3(0, 5, 0));
            const shootDir = targetPos.sub(shootPos).normalize();

            createFlintlockTracer(shootPos, shootDir);
            audio.playShot();
            enemy.shootCooldown = 1.5;
          }
        }
      }
    } else if (enemy.type === "desert_bandit") {
      const distance = enemy.mesh.position.distanceTo(playerMesh.position);
      const aggroRange = 170;

      if (distance < aggroRange) {
        const direction = playerMesh.position.clone().sub(enemy.mesh.position).setY(0).normalize();
        const speed = 28;
        enemy.mesh.position.addScaledVector(direction, dt * speed);
        enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);

        if (distance < 7 && enemy.hitTimer <= 0) {
          damagePlayer(Math.round(12 * getAvatarTraits().incomingDamageMultiplier), "Bandit Strike");
          enemy.hitTimer = 1.0;
          updateHud();
        }
      }
    } else if (enemy.type === "frozen_bandit") {
      const distance = enemy.mesh.position.distanceTo(playerMesh.position);
      const aggroRange = 180;

      if (distance < aggroRange) {
        const direction = playerMesh.position.clone().sub(enemy.mesh.position).setY(0).normalize();
        // Frozen bandits are slower while shell is intact
        const speed = enemy.shellBroken ? 28 : 16;
        enemy.mesh.position.addScaledVector(direction, dt * speed);
        enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);

        if (distance < 8 && enemy.hitTimer <= 0) {
          const dmg = Math.round(18 * getAvatarTraits().incomingDamageMultiplier);
          damagePlayer(dmg, "Frozen Sword Strike");
          enemy.hitTimer = 1.2;
          updateHud();
        }
      }
    } else if (enemy.type === "snowman") {
      const distance = enemy.mesh.position.distanceTo(playerMesh.position);
      const aggroRange = 175;

      if (distance < aggroRange) {
        const direction = playerMesh.position.clone().sub(enemy.mesh.position).setY(0).normalize();
        const speed = 22;
        enemy.mesh.position.addScaledVector(direction, dt * speed);
        enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);

        if (distance < 8 && enemy.hitTimer <= 0) {
          const dmg = Math.round(22 * getAvatarTraits().incomingDamageMultiplier);
          damagePlayer(dmg, "Snowman Pummel");
          enemy.hitTimer = 1.1;
          updateHud();
        }
      }
    } else if (enemy.type === "yeti") {
      // Initialize Yeti state timers
      enemy.slamCount    = enemy.slamCount    !== undefined ? enemy.slamCount    : 0;
      enemy.slamTimer    = enemy.slamTimer    !== undefined ? enemy.slamTimer    : 0;
      enemy.slamCooldown = enemy.slamCooldown !== undefined ? enemy.slamCooldown : 8.0;
      enemy.falconCooldown   = enemy.falconCooldown   !== undefined ? enemy.falconCooldown   : 12.0;
      enemy.falconWindup     = enemy.falconWindup     !== undefined ? enemy.falconWindup     : 0;
      enemy.falconCharging   = enemy.falconCharging   !== undefined ? enemy.falconCharging   : false;

      enemy.slamCooldown   = Math.max(0, enemy.slamCooldown   - dt);
      enemy.falconCooldown = Math.max(0, enemy.falconCooldown - dt);

      const distance = enemy.mesh.position.distanceTo(playerMesh.position);
      const aggroRange = 220;

      if (distance < aggroRange) {
        const direction = playerMesh.position.clone().sub(enemy.mesh.position).setY(0).normalize();
        enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);

        // --- Ground Slam sequence (4x) ---
        if (enemy.slamCount > 0) {
          enemy.slamTimer += dt;
          if (enemy.slamTimer >= 0.6) {
            enemy.slamTimer = 0;
            createGroundSlam(enemy.mesh.position.clone(), enemy);
            enemy.slamCount -= 1;
            if (enemy.slamCount === 0) {
              enemy.slamCooldown = 8.0;
            }
          }
        } else if (enemy.falconCharging) {
          // --- Meteor Fist windup ---
          enemy.falconWindup += dt;
          // During windup, Yeti trembles in place
          enemy.mesh.position.x += (Math.random() - 0.5) * 0.4;
          enemy.mesh.position.z += (Math.random() - 0.5) * 0.4;

          if (enemy.falconWindup >= 0.65) {
            // LAUNCH — rocket toward player
            enemy.falconCharging = false;
            enemy.falconWindup = 0;
            enemy.falconCooldown = 15.0;

            const rushDist = distance < 90 ? distance : 90;
            enemy.mesh.position.addScaledVector(direction, rushDist);

            const punchDist = enemy.mesh.position.distanceTo(playerMesh.position);
            if (punchDist < 22) {
              const dmg = Math.round(55 * getAvatarTraits().incomingDamageMultiplier);
              damagePlayer(dmg, "Yeti Meteor Fist");
              // Knock the player back hard
              player.knockedDown = true;
              player.stunTimer = 1.8;
              verticalVelocity = -160;
              jumpOffset = 0;
              cameraShake = Math.max(cameraShake, 3.0);
              createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "FALCON PUNCH!", "#ff9900");
              log("💥 FALCON PUNCH! The Yeti launches you with a devastating blow!");
            }
          }
        } else {
          // --- Normal movement ---
          const speed = 30;
          if (distance > 12) {
            enemy.mesh.position.addScaledVector(direction, dt * speed);
          }

          // Trigger 4x slam sequence
          if (enemy.slamCooldown <= 0 && distance < 70) {
            enemy.slamCount = 4;
            enemy.slamTimer = 0.5;
          }
          // Trigger Meteor Fist windup
          else if (enemy.falconCooldown <= 0 && distance < 100) {
            enemy.falconCharging = true;
            enemy.falconWindup = 0;
            createFloatingText(enemy.mesh.position.clone().add(new THREE.Vector3(0, 14, 0)), "FALCON PUNCH!!!", "#ff6600");
            log("⚠️ The Yeti is winding up a Meteor Fist!");
          }
          // Basic melee
          else if (distance < 12 && enemy.hitTimer <= 0) {
            const dmg = Math.round(30 * getAvatarTraits().incomingDamageMultiplier);
            damagePlayer(dmg, "Yeti Strike");
            enemy.hitTimer = 1.0;
            updateHud();
          }
        }
      }
    } else {

      // Non-brutes standard logic (Jester, Pirate, Bandits)
      enemy.ai = enemy.ai || { cooldown: 0, rush: 1, slash: 1, slam: 1, dodge: 1 };
      enemy.ai.cooldown = Math.max(0, enemy.ai.cooldown - dt);
      enemy.ai.rush = Math.max(0, enemy.ai.rush - dt);
      enemy.ai.slash = Math.max(0, enemy.ai.slash - dt);
      enemy.ai.slam = Math.max(0, enemy.ai.slam - dt);
      enemy.ai.dodge = Math.max(0, enemy.ai.dodge - dt);
      const distance = enemy.mesh.position.distanceTo(playerMesh.position);
      const aggroRange = enemy.type ? 170 : 90;
      if (distance < aggroRange) {
        const direction = playerMesh.position.clone().sub(enemy.mesh.position).setY(0).normalize();
        const speed = enemy.type === "buggy" ? 42 : enemy.type === "pirate" ? 36 : 26;
        if (enemy.type === "pirate" && enemy.ai.dodge <= 0 && distance < 38) {
          const side = new THREE.Vector3(-direction.z, 0, direction.x).multiplyScalar(Math.random() > 0.5 ? 1 : -1);
          enemy.mesh.position.addScaledVector(side, dt * 80);
          enemy.ai.dodge = 1.2;
        } else {
          enemy.mesh.position.addScaledVector(direction, dt * speed);
        }
        enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);
        if (enemy.type === "buggy" && enemy.ai.rush <= 0 && distance < 58) {
          enemy.mesh.position.addScaledVector(direction, 18);
          enemy.ai.rush = 1.6;
          createSwordSlash({ mesh: playerMesh });
          damagePlayer(18, "Rapid Rush");
        }
        if (enemy.type === "buggy" && enemy.ai.slash <= 0 && distance < 135) {
          createAirSlash(enemy.mesh.position.clone().setY(enemy.mesh.position.y + 7), direction, enemy);
          enemy.ai.slash = 2.1;
        }
      }
      if (distance < 7 && enemy.hitTimer <= 0) {
        damagePlayer(Math.round((enemy.type === "buggy" ? 22 : 8) * getAvatarTraits().incomingDamageMultiplier), enemy.type === "buggy" ? "strike" : "enemy strike");
        enemy.hitTimer = 1.0;
        updateHud();
      }
    }

    // Update enemy Y coordinate to match sloped terrain
    const enemyIsland = islands.find(isl => {
      const dx = enemy.mesh.position.x - isl.position.x;
      const dz = enemy.mesh.position.z - isl.position.z;
      return Math.sqrt(dx * dx + dz * dz) <= isl.radius;
    });
    if (enemyIsland) {
      enemy.mesh.position.y = getIslandSurfaceHeightAt(enemy.mesh.position.x, enemy.mesh.position.z, enemyIsland);
    } else {
      enemy.mesh.position.y = OCEAN_SURFACE_Y;
    }
  });
}

function damagePlayer(amount, source) {
  if (player.isGodMode) return; // Admin Invulnerability!
  if (player.shieldTimer > 0) return; // Invulnerable shield active!

  // Foresight Auto-Dodge
  if (player.observationHaki && player.observationHaki.active && player.observationHaki.dodges > 0) {
    player.observationHaki.dodges -= 1;
    audio.playFlashStep();

    // Sideways evasive slide
    const evadeAngle = playerMesh.rotation.y + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2);
    const evadeDir = new THREE.Vector3(Math.sin(evadeAngle), 0, Math.cos(evadeAngle));
    const startPos = playerMesh.position.clone();
    playerMesh.position.addScaledVector(evadeDir, 10);
    resolveWallCollision(startPos);

    createEvasionGhost(startPos);
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 11, 0)), `⚡ DODGE! (${player.observationHaki.dodges}/${player.observationHaki.maxDodges})`, "#ff4444");
    log(`👁️ Foresight dodged an attack from ${source || "an enemy"}! (${player.observationHaki.dodges} dodges left)`);

    if (player.observationHaki.dodges === 0) {
      log("⚠️ Foresight dodges depleted! Regenerating 1 dodge every 4s...");
    }
    return 0; // Completely dodge attack!
  }

  const isHeadshot = Math.random() < 0.20;
  if (isHeadshot) {
    amount = Math.round(amount * 1.5);
  }

  // Play synthesized impact sound
  audio.playImpact();
  triggerHitFlash(playerMesh);

  // Defense Mastery gain on hit/block
  const masteryGained = player.isBlocking ? 8 : 2;
  addMasteryXp("defense", masteryGained);

  let block = player.isBlocking ? 0.45 : 1;
  let parried = false;

  // Perfect Parry: Block within 0.25s of keydown
  if (player.isBlocking && player.mastery.defense >= 5 && (performance.now() - player.blockStartTime < 250)) {
    block = 0; // Immune!
    parried = true;
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "PERFECT PARRY!", "#7ce0b4");
    audio.playHaki(); // Clang sound effect

    // Reflect 40% damage to closest enemy
    const closest = enemies
      .filter((e) => e.alive && e.mesh.position.distanceTo(playerMesh.position) < 80)
      .sort((a, b) => a.mesh.position.distanceTo(playerMesh.position) - b.mesh.position.distanceTo(playerMesh.position))[0];
    if (closest) {
      const reflectedDmg = Math.round(amount * 0.4);
      closest.health -= reflectedDmg;
      triggerHitFlash(closest.mesh);
      createFloatingText(closest.mesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `Reflected -${reflectedDmg}`, "#7ce0b4");
      if (closest.health <= 0) defeatEnemy(closest);
    }
  }

  const haki = player.haki.active ? Math.max(0.35, 1 - player.haki.level * 0.1) : 1;
  const finalDamage = Math.max(0, Math.round(amount * block * haki));

  // Armored Will: Prevents fatal damage once on 90s CD
  if (player.health - finalDamage <= 0 && player.mastery.defense >= 50 && player.armoredWillCooldown <= 0) {
    player.health = 1;
    player.armoredWillCooldown = 90;
    player.shieldTimer = 3.0; // 3s invulnerable shield
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 12, 0)), "ARMORED WILL TRIGGERED!", "#ffdb88");
    audio.playQuestComplete();
    updateHud();
    return;
  }

  player.health = Math.max(0, player.health - finalDamage);
  cameraShake = Math.max(cameraShake, finalDamage / 25);
  if (finalDamage > 0) {
    if (isHeadshot) {
      createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), `HEADSHOT! -${finalDamage}`, "#ff3333");
      log(`⚠️ HEADSHOT! Taken 1.5x damage from ${source || "an enemy"}.`);
    } else {
      createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `-${finalDamage}`, "#ff6b4a");
    }
  }

  if (player.health <= 0) {
    killPlayer(source || "an enemy");
  }
}

function damageEnemy(enemy, baseAmount, label = "Strike", color = "#ff7a3d", isForcedHeadshot = null) {
  if (!enemy || !enemy.alive) return 0;
  if (player.isInstakill) {
    baseAmount = Math.max(baseAmount, enemy.maxHealth * 10);
  }

  // === Frozen Bandit: Icy Shell Mechanic ===
  if (enemy.type === "frozen_bandit" && !enemy.shellBroken && enemy.iceShell) {
    // Sword is weak vs shell; melee is strong
    const isSwordHit = player.weapon === "sword";
    const shellMult = isSwordHit ? 0.4 : 1.5;
    const shellDamage = Math.round(baseAmount * shellMult);

    enemy.iceShellHp = Math.max(0, enemy.iceShellHp - shellDamage);
    triggerHitFlash(enemy.mesh);

    const pos = enemy.mesh.position.clone().add(new THREE.Vector3(0, 10, 0));
    if (isSwordHit) {
      createFloatingText(pos, `Shell: -${shellDamage} (Weak!)`, "#aaddff");
      log(`Sword barely chips the icy shell! ${shellDamage} damage.`);
    } else {
      createFloatingText(pos, `Shell: -${shellDamage}`, "#88ccff");
      log(`Melee cracks the icy shell! ${shellDamage} damage.`);
    }

    // Update shell opacity based on remaining HP
    const shellFrac = enemy.iceShellHp / enemy.iceShellMax;
    if (enemy.iceShell.material) {
      enemy.iceShell.material.opacity = 0.15 + 0.35 * shellFrac;
    }

    if (enemy.iceShellHp <= 0) {
      // Shell shatters!
      enemy.shellBroken = true;
      enemy.iceShell.visible = false;
      // Flash white to signal shatter
      triggerHitFlash(enemy.mesh);
      const shatPos = enemy.mesh.position.clone().add(new THREE.Vector3(0, 8, 0));
      createFloatingText(shatPos, "ICE SHELL SHATTERED!", "#ffffff");
      log("The Frozen Bandit's icy shell has shattered! They are now vulnerable.");
    }
    return shellDamage;
  }

  const isHeadshot = isForcedHeadshot !== null ? isForcedHeadshot : (Math.random() < 0.20);
  let adjustedAmount = baseAmount;

  // Damage modifiers after shell is broken (or for non-frozen types)
  if (enemy.type === "frozen_bandit" && enemy.shellBroken) {
    // Melee is more effective, sword less effective on frozen flesh
    if (player.weapon === "melee") adjustedAmount = Math.round(baseAmount * 1.5);
    else if (player.weapon === "sword") adjustedAmount = Math.round(baseAmount * 0.65);
  }

  const finalDamage = isHeadshot ? Math.round(adjustedAmount * 1.5) : adjustedAmount;

  enemy.health = Math.max(0, enemy.health - finalDamage);
  triggerHitFlash(enemy.mesh);

  const pos = enemy.mesh.position.clone().add(new THREE.Vector3(0, 8, 0));
  if (isHeadshot) {
    createFloatingText(pos, `HEADSHOT! -${finalDamage}`, "#3ce88a");
    log(`🎯 HEADSHOT! Dealt 1.5x damage (${finalDamage}) to ${enemy.type || "enemy"}.`);
  } else {
    const displayText = (label.includes("-") || label.includes("+")) ? label : `${label} -${finalDamage}`;
    createFloatingText(pos, displayText, color);
    log(`${label} hit for ${finalDamage} damage.`);
  }

  if (enemy.health <= 0) {
    defeatEnemy(enemy);
  }
  return finalDamage;
}


function killPlayer(source) {
  player.health = 0;
  if (isHelming) unhelmBoat();
  
  // Clear key states to stop movement sliding
  keys.clear();
  
  // Show Defeat Screen overlay
  const overlay = document.getElementById("low-health-overlay");
  if (overlay) {
    overlay.classList.remove("low");
    overlay.classList.add("defeated");
  }
  
  updateHud();
  log(`You were defeated by ${source}! Click Respawn to return to the starter dock.`);
}

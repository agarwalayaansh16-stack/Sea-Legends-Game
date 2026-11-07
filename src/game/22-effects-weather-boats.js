
// ── 22-effects-weather-boats.js ─ Hit effects, day/night lighting, weather and boat helming.
function createBloodSplatter(position) {
  if (!position) return;
  const count = 8 + Math.floor(Math.random() * 6);
  for (let i = 0; i < count; i++) {
    const size = 0.35 + Math.random() * 0.45;
    const geometry = new THREE.SphereGeometry(size, 6, 6);
    const material = new THREE.MeshBasicMaterial({
      color: 0xcc0000,
      transparent: true,
      opacity: 0.95
    });
    const drop = new THREE.Mesh(geometry, material);
    
    drop.position.copy(position);
    drop.position.y += 2.5 + Math.random() * 3.5;
    drop.position.x += (Math.random() - 0.5) * 1.5;
    drop.position.z += (Math.random() - 0.5) * 1.5;
    
    const angle = Math.random() * Math.PI * 2;
    const speed = 12 + Math.random() * 18;
    const velocity = new THREE.Vector3(
      Math.cos(angle) * speed,
      5 + Math.random() * 15,
      Math.sin(angle) * speed
    );
    
    addTimedEffect(drop, 0.45 + Math.random() * 0.25, (mesh, progress, dt) => {
      velocity.y -= dt * 75;
      mesh.position.addScaledVector(velocity, dt);
      mesh.material.opacity = 0.95 * (1 - progress);
      mesh.scale.setScalar(1 - progress * 0.5);
    });
  }
}

function triggerHitFlash(group) {
  if (group && group.position) {
    createBloodSplatter(group.position);
  }
  group.traverse((child) => {
    if (child.isMesh && child.material) {
      if (!child.userData.baseEmissive) {
        child.userData.baseEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0);
        child.userData.baseEmissiveInt = child.material.emissiveIntensity || 0;
      }
      if (child.material.emissive) {
        child.material.emissive.setHex(0xff3333);
        child.material.emissiveIntensity = 1.0;
        setTimeout(() => {
          if (child.material) {
            child.material.emissive.copy(child.userData.baseEmissive);
            child.material.emissiveIntensity = child.userData.baseEmissiveInt;
          }
        }, 110);
      }
    }
  });
}

// Reused colour objects so the day/night cycle does not allocate every frame.
const skyBlend = { top: new THREE.Color(), horizon: new THREE.Color(), glow: new THREE.Color(), sun: new THREE.Color(), tmp: new THREE.Color() };
const SUN_COLORS = { dawn: 0xffd8b5, day: 0xfff5e6, dusk: 0xff8833, night: 0x8faecc };

function blendSky(from, to, p) {
  const sky = WORLD_PALETTE.sky;
  skyBlend.top.setHex(sky[from].top).lerp(skyBlend.tmp.setHex(sky[to].top), p);
  skyBlend.horizon.setHex(sky[from].horizon).lerp(skyBlend.tmp.setHex(sky[to].horizon), p);
  skyBlend.glow.setHex(sky[from].glow).lerp(skyBlend.tmp.setHex(sky[to].glow), p);
  skyBlend.sun.setHex(SUN_COLORS[from]).lerp(skyBlend.tmp.setHex(SUN_COLORS[to]), p);
}

// The day is four equal phases. `from`/`to` are clock hours used to place the sun.
const DAY_CYCLE = {
  phaseSeconds: 600,
  phases: [
    { name: "day", label: "Day", from: 8.5, to: 17, message: "" },
    { name: "sunset", label: "Sunset", from: 17, to: 19.5, message: "The sun begins to set." },
    { name: "night", label: "Night", from: 19.5, to: 29, message: "Night falls over the islands." },
    { name: "sunrise", label: "Sunrise", from: 29, to: 32.5, message: "Dawn breaks on the horizon." },
  ],
};
const dayCycle = { phase: 0, elapsed: 0, progress: 0 };

function smoothstep01(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function advanceDayCycle(dt) {
  dayCycle.elapsed += dt;
  if (dayCycle.elapsed >= DAY_CYCLE.phaseSeconds) {
    dayCycle.elapsed -= DAY_CYCLE.phaseSeconds;
    dayCycle.phase = (dayCycle.phase + 1) % DAY_CYCLE.phases.length;
    const next = DAY_CYCLE.phases[dayCycle.phase];
    if (next.message) log(next.message);
  }
  dayCycle.progress = dayCycle.elapsed / DAY_CYCLE.phaseSeconds;
  const phase = DAY_CYCLE.phases[dayCycle.phase];
  timeOfDay = (phase.from + (phase.to - phase.from) * dayCycle.progress) % 24;
  updateDayPhaseHud(phase);
}

function updateDayPhaseHud(phase) {
  const chip = document.querySelector("#day-phase");
  if (!chip) return;
  const remaining = Math.max(0, Math.ceil(DAY_CYCLE.phaseSeconds - dayCycle.elapsed));
  const text = `${phase.label} · ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
  if (chip.textContent !== text) chip.textContent = text;
  if (chip.dataset.phase !== phase.name) chip.dataset.phase = phase.name;
}

function updateDayNightLighting(dt) {
  let sunIntensity, nightMix, daylight;
  const p = dayCycle.progress;

  switch (DAY_CYCLE.phases[dayCycle.phase].name) {
    case "day":
      blendSky("day", "day", 0);
      sunIntensity = 2.4;
      nightMix = 0;
      daylight = 1;
      break;
    case "sunset":
      if (p < 0.65) blendSky("day", "dusk", smoothstep01(0, 0.65, p));
      else blendSky("dusk", "night", smoothstep01(0.65, 1, p));
      sunIntensity = 2.4 - 2.05 * smoothstep01(0, 1, p);
      nightMix = smoothstep01(0.55, 1, p);
      daylight = 1 - 0.78 * smoothstep01(0.3, 1, p);
      break;
    case "night":
      blendSky("night", "night", 0);
      sunIntensity = 0.35;
      nightMix = 1;
      daylight = 0.22;
      break;
    default: // sunrise
      if (p < 0.4) blendSky("night", "dawn", smoothstep01(0, 0.4, p));
      else blendSky("dawn", "day", smoothstep01(0.4, 1, p));
      sunIntensity = 0.35 + 2.05 * smoothstep01(0, 1, p);
      nightMix = 1 - smoothstep01(0, 0.45, p);
      daylight = 0.22 + 0.78 * smoothstep01(0, 0.8, p);
      break;
  }

  // Fill lights dim and turn moonlit-blue as night falls.
  hemiLight.intensity = WORLD_PALETTE.lighting.hemisphere * (0.4 + 0.6 * daylight);
  ambientLight.intensity = WORLD_PALETTE.lighting.ambient * (0.6 + 0.4 * daylight);
  hemiLight.color.setHex(0x9fd2f5).lerp(skyBlend.tmp.setHex(0x4a6496), 1 - daylight);
  // Cottage windows glow warmly after dark.
  houseWindowGlass.emissiveIntensity = 0.05 + 1.5 * (1 - daylight) / 0.78;

  const skyTopColor = skyBlend.top;
  const skyHorizonColor = skyBlend.horizon;
  const sunGlowColor = skyBlend.glow;
  const sunColor = skyBlend.sun;

  if (weatherActive) {
    skyTopColor.multiplyScalar(0.38);
    skyHorizonColor.multiplyScalar(0.42);
    sunIntensity *= 0.22;
  }

  if (skyDome) {
    skyDome.uniforms.uSkyTop.value.copy(skyTopColor);
    skyDome.uniforms.uSkyHorizon.value.copy(skyHorizonColor);
    skyDome.uniforms.uSunGlow.value.copy(sunGlowColor);
    skyDome.uniforms.uSunIntensity.value = sunIntensity;
    skyDome.uniforms.uNightMix.value = nightMix;
  }

  scene.background.copy(skyHorizonColor);
  scene.fog.color.copy(skyHorizonColor);
  renderer.setClearColor(skyHorizonColor);
  sun.color.copy(sunColor);
  sun.intensity = sunIntensity * WORLD_PALETTE.lighting.sunScale;

  // Dynamic sun positioning around player/camera so shadows follow across all islands
  const angle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
  const focus = (typeof playerMesh !== "undefined" && playerMesh) ? playerMesh.position : camera.position;
  sun.position.set(
    focus.x + Math.cos(angle) * 360,
    Math.max(60, focus.y + Math.sin(angle) * 360),
    focus.z + 130
  );
  sun.target.position.copy(focus);
  sun.target.updateMatrixWorld();

  const isNight = timeOfDay >= 19.5 || timeOfDay < 5.5;
  const glowIntensity = isNight ? (weatherActive ? 3.0 : 2.0) : 0.1;
  // Walking the whole scene is expensive, so lanterns are collected occasionally
  // and their glow is only written when it actually changes.
  lanternGlowCache.age += dt || 0;
  if (!lanternGlowCache.materials || lanternGlowCache.age > 5) {
    const materials = new Set();
    scene.traverse((child) => {
      if (child.name === "lanternGlow" || (child.material && child.material.emissive && (child.material.color.getHex() === 0xffd25a))) {
        materials.add(child.material);
      }
    });
    if (!lanternGlowCache.materials || materials.size !== lanternGlowCache.materials.size) lanternGlowCache.intensity = null;
    lanternGlowCache.materials = materials;
    lanternGlowCache.age = 0;
  }
  if (lanternGlowCache.intensity !== glowIntensity) {
    lanternGlowCache.materials.forEach((material) => { material.emissiveIntensity = glowIntensity; });
    lanternGlowCache.intensity = glowIntensity;
  }
}
const lanternGlowCache = { materials: null, age: 0, intensity: null };

function updateWeather(dt) {
  weatherTimer -= dt;
  if (weatherTimer <= 0) {
    weatherTimer = 80 + Math.random() * 100;
    weatherActive = Math.random() < 0.25;
    if (weatherActive) {
      log("A storm is rolling in from the east!");
      createRainSystem();
    } else {
      if (rainParticles) {
        scene.remove(rainParticles);
        rainParticles = null;
      }
      log("The sky clears up.");
    }
  }

  if (weatherActive) {
    if (rainParticles) {
      const positions = rainParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= dt * 250;
        if (positions[i] < -50) {
          positions[i] = 120 + Math.random() * 80;
        }
      }
      rainParticles.geometry.attributes.position.needsUpdate = true;
    }

    if (Math.random() < 0.005) {
      log("⚡ Thunder rumbles across the ocean!");
      audio.playImpact();
      sun.intensity = 5.0;
      scene.background.setHex(0xffffff);
      scene.fog.color.setHex(0xffffff);
      setTimeout(() => {
        updateDayNightLighting(0);
      }, 70);
    }
  }
}

function createRainSystem() {
  if (rainParticles) scene.remove(rainParticles);

  const count = 1200;
  const material = new THREE.LineBasicMaterial({
    color: 0x8ebdd1,
    transparent: true,
    opacity: 0.4,
  });

  const linePositions = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = Math.random() * 200;
    const z = (Math.random() - 0.5) * 800;
    linePositions.push(x, y, z);
    linePositions.push(x, y - 6, z);
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  rainParticles = new THREE.LineSegments(lineGeometry, material);
  scene.add(rainParticles);
}

function toggleHelm() {
  if (!activeBoat) {
    log("Spawn a boat near the water first! Visit the Boat Dealer at the dock.");
    return;
  }

  if (isHelming) {
    unhelmBoat();
  } else {
    const dist = playerMesh.position.distanceTo(activeBoat.position);
    if (dist > 55) {
      log("Get closer to your boat to steer it!");
      return;
    }
    helmBoat();
  }
}

function helmBoat() {
  isHelming = true;
  player.isSwimming = false;
  player.oxygen = 100;
  playerMesh.visible = false;
  boatYaw = activeBoat.rotation.y;
  log("Helming boat! Use WASD to steer across the ocean. Press G to disembark.");
  audio.playFanfare();
}

function unhelmBoat() {
  isHelming = false;
  playerMesh.visible = true;
  playerMesh.position.copy(activeBoat.position).add(new THREE.Vector3(0, 4.5, 0));
  boatVelocity = 0;
  log("Disembarked from boat.");
}

function updateBoat(dt) {
  const accel = keys.has("KeyW") ? 1 : keys.has("KeyS") ? -1 : 0;
  const turn = keys.has("KeyD") ? -1 : keys.has("KeyA") ? 1 : 0;

  const drag = 0.965;
  const maxSpeed = 160;
  const turnSpeed = 1.35;

  if (accel !== 0) {
    boatVelocity = clamp(boatVelocity + accel * dt * 45, -maxSpeed * 0.35, maxSpeed);
  } else {
    boatVelocity *= Math.pow(drag, dt * 30);
  }

  if (turn !== 0 && Math.abs(boatVelocity) > 2) {
    const dir = boatVelocity > 0 ? 1 : -1;
    boatYaw += turn * turnSpeed * dt * dir;
  }

  activeBoat.rotation.y = boatYaw;
  const forward = new THREE.Vector3(Math.sin(boatYaw), 0, Math.cos(boatYaw));
  activeBoat.position.addScaledVector(forward, boatVelocity * dt);
  activeBoat.position.y = OCEAN_SURFACE_Y + 0.28 + Math.sin(performance.now() * 0.002) * 0.18;

  playerMesh.position.copy(activeBoat.position);

  islands.forEach((island) => {
    const flatDist = new THREE.Vector2(activeBoat.position.x - island.position.x, activeBoat.position.z - island.position.z).length();
    if (flatDist < island.radius + 12) {
      const pushDirection = activeBoat.position.clone().sub(island.position).setY(0).normalize();
      activeBoat.position.addScaledVector(pushDirection, 22);
      boatVelocity = -boatVelocity * 0.35;
      audio.playImpact();
      cameraShake = Math.max(cameraShake, 1.1);
      log(`⚠️ Boat bumped into ${island.index === 0 ? "Starter Island" : `Island ${island.index + 1}`}!`);
    }
  });

  if (Math.abs(boatVelocity) > 10 && Math.random() < 0.32) {
    createSplashEffect(activeBoat.position.clone().addScaledVector(forward, -14));
  }

  updateCamera();
}

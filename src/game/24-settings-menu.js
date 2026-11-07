
// ── 24-settings-menu.js ─ Escape menu, graphics quality, volume and performance stats.
// ===== Escape Menu & Performance Stats Bar =====

const escMenu = document.querySelector("#esc-menu");
const escClose = document.querySelector("#esc-close");
const escResumeBtn = document.querySelector("#esc-resume-btn");
const escResetBtn = document.querySelector("#esc-reset-btn");
const escPerfToggle = document.querySelector("#esc-perf-toggle");
const escPingToggle = document.querySelector("#esc-ping-toggle");
const graphicsQualitySlider = document.querySelector("#graphics-quality-slider");
const graphicsLevelVal = document.querySelector("#graphics-level-val");
const volumeSlider = document.querySelector("#volume-slider");
const volumeVal = document.querySelector("#volume-val");
const perfStatsBar = document.querySelector("#perf-stats-bar");
const perfItemPing = document.querySelector("#perf-item-ping");

function toggleEscMenu(forceState = null) {
  const nextState = forceState !== null ? forceState : !escMenuOpen;
  if (nextState === escMenuOpen) return;
  
  escMenuOpen = nextState;
  document.querySelector("#mobile-controls")?.classList.toggle("hidden", escMenuOpen || !gameStarted);
  if (escMenu) {
    escMenu.classList.toggle("hidden", !escMenuOpen);
  }
  
  if (escMenuOpen) {
    keys.clear();
    if (volumeSlider) {
      volumeSlider.value = Math.round(audio.volume * 100);
      if (volumeVal) volumeVal.textContent = `${volumeSlider.value}%`;
    }
    const adminSec = document.querySelector("#esc-admin-section");
    if (adminSec) {
      adminSec.classList.toggle("hidden", !player.isAdmin);
    }
    updateAdminButtonsUI();
  }
}

function setGraphicsQuality(level) {
  if (!renderer || !sun) return;
  
  if (level <= 2) {
    sun.castShadow = false;
    renderer.shadowMap.enabled = false;
    renderer.setPixelRatio(level === 1 ? 0.75 : 0.88);
  } else {
    sun.castShadow = true;
    renderer.shadowMap.enabled = true;
    const ratios = { 3: 1.0, 4: 1.35, 5: 1.65 };
    const targetRatio = ratios[level] || 2.0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, targetRatio));
  }
  
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.needsUpdate = true;
    }
  });
  setWindGrassQuality(level);
}

function drawPerfGraph(canvasId, history, color, minVal, maxVal) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  
  if (history.length < 2) return;
  
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  
  const step = w / (history.length - 1);
  for (let i = 0; i < history.length; i++) {
    const val = history[i];
    const norm = (val - minVal) / (maxVal - minVal || 1);
    const clamped = Math.max(0, Math.min(1, norm));
    const x = i * step;
    const y = h - clamped * (h - 2) - 1;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = color + "1a";
  ctx.fill();
}

function updatePerfStatsUI(now) {
  const memVal = perfState.memHistory[perfState.memHistory.length - 1] || 0;
  const memEl = document.querySelector("#perf-val-mem");
  if (memEl) memEl.textContent = `${memVal.toFixed(2)} MB`;
  drawPerfGraph("perf-graph-mem", perfState.memHistory, "#3ce88a", 400, 800);

  const avgCpu = perfState.cpuHistory.reduce((a, b) => a + b, 0) / (perfState.cpuHistory.length || 1);
  const cpuEl = document.querySelector("#perf-val-cpu");
  if (cpuEl) cpuEl.textContent = `${avgCpu.toFixed(1)} ms`;
  drawPerfGraph("perf-graph-cpu", perfState.cpuHistory, "#3ce88a", 0, 33);

  const avgGpu = perfState.gpuHistory.reduce((a, b) => a + b, 0) / (perfState.gpuHistory.length || 1);
  const gpuEl = document.querySelector("#perf-val-gpu");
  if (gpuEl) gpuEl.textContent = `${avgGpu.toFixed(1)} ms`;
  drawPerfGraph("perf-graph-gpu", perfState.gpuHistory, "#0da9d6", 0, 33);

  const isMoving = keys.size > 0;
  const sentVal = isMoving ? (1.5 + Math.random() * 0.8) : (0.05 + Math.random() * 0.05);
  const recvVal = isMoving ? (15.4 + Math.random() * 25.0) : (1.2 + Math.random() * 0.6);
  const sentEl = document.querySelector("#perf-val-sent");
  if (sentEl) sentEl.textContent = `${sentVal.toFixed(2)} KB/s`;
  const recvEl = document.querySelector("#perf-val-recv");
  if (recvEl) recvEl.textContent = `${recvVal.toFixed(2)} KB/s`;

  if (perfState.showPing) {
    const basePing = 45 + Math.sin(now * 0.0005) * 15;
    const pingVal = basePing + Math.random() * 6 + (isMoving ? Math.random() * 10 : 0);
    perfState.pingHistory.push(pingVal);
    if (perfState.pingHistory.length > 30) perfState.pingHistory.shift();
    
    const pingEl = document.querySelector("#perf-val-ping");
    if (pingEl) pingEl.textContent = `${Math.round(pingVal)} ms`;
    drawPerfGraph("perf-graph-ping", perfState.pingHistory, "#f6b73c", 0, 150);
  }
}

escClose?.addEventListener("click", () => toggleEscMenu(false));
escResumeBtn?.addEventListener("click", () => toggleEscMenu(false));

escResetBtn?.addEventListener("click", () => {
  if (playerMesh) {
    playerMesh.position.set(0, STARTER_SURFACE_Y + 0.15, 12); // just south of the flagpole
    verticalVelocity = 0;
    jumpOffset = 0;
  }
  player.health = player.maxHealth;
  updateHud();
  toggleEscMenu(false);
  log("Character reset to starting dock.");
});

escPerfToggle?.addEventListener("change", () => {
  perfState.visible = escPerfToggle.checked;
  if (perfStatsBar) {
    perfStatsBar.classList.toggle("hidden", !perfState.visible);
  }
  document.body.classList.toggle("perf-hidden", !perfState.visible);
});

escPingToggle?.addEventListener("change", () => {
  perfState.showPing = escPingToggle.checked;
  if (perfItemPing) {
    perfItemPing.classList.toggle("hidden", !perfState.showPing);
  }
});

graphicsQualitySlider?.addEventListener("input", () => {
  const val = parseInt(graphicsQualitySlider.value, 10);
  if (graphicsLevelVal) graphicsLevelVal.textContent = val;
  setGraphicsQuality(val);
});

volumeSlider?.addEventListener("input", () => {
  const val = parseInt(volumeSlider.value, 10);
  if (volumeVal) volumeVal.textContent = `${val}%`;
  audio.setVolume(val / 100);
});

audio.setVolume(0.5);
setGraphicsQuality(5);
document.body.classList.add("perf-hidden");

function updateAdminButtonsUI() {
  const godBtn = document.querySelector("#admin-godmode-btn");
  if (godBtn) {
    godBtn.textContent = `GOD MODE: ${player.isGodMode ? "ON" : "OFF"}`;
    godBtn.style.background = player.isGodMode ? "rgba(60, 232, 138, 0.35)" : "rgba(60, 232, 138, 0.15)";
    godBtn.style.borderColor = player.isGodMode ? "rgba(60, 232, 138, 0.5)" : "rgba(60, 232, 138, 0.3)";
  }
  const instaBtn = document.querySelector("#admin-instakill-btn");
  if (instaBtn) {
    instaBtn.textContent = `INSTAKILL: ${player.isInstakill ? "ON" : "OFF"}`;
    instaBtn.style.background = player.isInstakill ? "rgba(255, 96, 72, 0.35)" : "rgba(255, 96, 72, 0.15)";
    instaBtn.style.borderColor = player.isInstakill ? "rgba(255, 96, 72, 0.5)" : "rgba(255, 96, 72, 0.3)";
  }
}

document.querySelector("#admin-godmode-btn")?.addEventListener("click", () => {
  player.isGodMode = !player.isGodMode;
  if (player.isGodMode) {
    player.health = player.maxHealth;
    player.stamina = player.maxStamina;
  }
  updateAdminButtonsUI();
  saveGame();
  log(`Admin God Mode toggled: ${player.isGodMode ? "ON" : "OFF"}`);
});

document.querySelector("#admin-instakill-btn")?.addEventListener("click", () => {
  player.isInstakill = !player.isInstakill;
  updateAdminButtonsUI();
  saveGame();
  log(`Admin Instakill toggled: ${player.isInstakill ? "ON" : "OFF"}`);
});

document.querySelector("#admin-cash-btn")?.addEventListener("click", () => {
  player.money += 10000;
  updateHud();
  saveGame();
  log("Admin Cash granted: +$10,000");
});

document.querySelector("#admin-mats-btn")?.addEventListener("click", () => {
  player.materials.ironwood += 10;
  player.materials.scrap += 10;
  player.materials.jungleCore += 10;
  updateHud();
  saveGame();
  log("Admin Materials granted: +10 of each resource");
});

document.querySelector("#admin-levels-btn")?.addEventListener("click", () => {
  player.level = 100;
  player.xp = 0;
  player.xpToNext = 1000000;
  player.statPoints += 297;
  
  Object.keys(player.mastery).forEach(type => {
    player.mastery[type] = 100;
    let xp = 0;
    for (let l = 1; l < 100; l++) {
      xp += Math.round(40 * Math.pow(1.2, l - 1));
    }
    player.masteryXp[type] = xp;
  });
  
  player.haki.unlocked = true;
  player.haki.level = 5;
  player.hasSword = true;
  player.hasGun = true;
  player.specialUnlocked = true;
  
  updateDerivedStats();
  updateHud();
  updateCombatHud();
  saveGame();
  log("Admin: Max levels, max masteries, and all slots unlocked!");
});

document.querySelector("#admin-tp-starter")?.addEventListener("click", () => {
  if (playerMesh && islands[0]) {
    playerMesh.position.set(0, islands[0].surfaceY + 0.15, 0);
    verticalVelocity = 0;
    jumpOffset = 0;
    toggleEscMenu(false);
    log("Admin Teleport to Starter Island.");
  }
});

document.querySelector("#admin-tp-desert")?.addEventListener("click", () => {
  if (playerMesh && islands[3]) {
    playerMesh.position.copy(islands[3].position).setY(islands[3].surfaceY + 0.15);
    verticalVelocity = 0;
    jumpOffset = 0;
    toggleEscMenu(false);
    log("Admin Teleport to Desert Island.");
  }
});

document.querySelector("#admin-tp-jungle")?.addEventListener("click", () => {
  if (playerMesh && islands[1]) {
    playerMesh.position.copy(islands[1].position).setY(islands[1].surfaceY + 0.15);
    verticalVelocity = 0;
    jumpOffset = 0;
    toggleEscMenu(false);
    log("Admin Teleport to Jungle Island.");
  }
});

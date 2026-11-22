
// ── 40-world-map.js ─ World map (M) with islands, player, boat, quest target and raiders, plus the quest log.
var MAP_ISLAND_INFO = [
  { name: "Starter Island", levels: "1", land: "#7fb85a", shore: "#e8d9a6" },
  { name: "Jungle Island", levels: "10–20", land: "#3f8a45", shore: "#d9c98f" },
  { name: "Pirate Town", levels: "30–50", land: "#b58c5a", shore: "#e3cf9b" },
  { name: "Desert Island", levels: "60–70", land: "#e0bf6c", shore: "#f1e0a8" },
  { name: "Snowy Village", levels: "90–110", land: "#e9f1f6", shore: "#c9d8df" },
];
var QUEST_ISLAND = {
  starter: 0, monkey10: 1, gorilla15: 1, gorillaKing20: 1, pirates30: 2, brutes40: 2, buggy50: 2,
  desertBandits60: 3, desertOfficers70: 3, frozenBandits90: 4, snowmen100: 4, yeti110: 4,
};
var worldMapOpen = false;
var worldMapView = null;
var worldMapRaf = 0;
var worldMapLast = 0;

function worldMapBounds() {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  islands.forEach((isl) => {
    minX = Math.min(minX, isl.position.x - isl.radius);
    maxX = Math.max(maxX, isl.position.x + isl.radius);
    minZ = Math.min(minZ, isl.position.z - isl.radius);
    maxZ = Math.max(maxZ, isl.position.z + isl.radius);
  });
  const pad = 500;
  return { minX: minX - pad, maxX: maxX + pad, minZ: minZ - pad, maxZ: maxZ + pad };
}

function toggleWorldMap(force) {
  const el = document.getElementById("world-map");
  if (!el) return;
  const open = typeof force === "boolean" ? force : !worldMapOpen;
  if (open && !gameStarted) return;
  worldMapOpen = open;
  el.classList.toggle("hidden", !open);
  if (open) {
    renderQuestLog();
    drawWorldMap();
    const tick = (now) => {
      if (!worldMapOpen) return;
      if (now - worldMapLast > 100) {
        worldMapLast = now;
        drawWorldMap();
      }
      worldMapRaf = requestAnimationFrame(tick);
    };
    worldMapRaf = requestAnimationFrame(tick);
    document.getElementById("world-map-close")?.focus({ preventScroll: true });
  } else {
    cancelAnimationFrame(worldMapRaf);
    document.getElementById("game")?.focus({ preventScroll: true });
  }
}

// Irregular island outline so islands don't look like plain circles.
function islandBlob(ctx, cx, cy, r, seed) {
  ctx.beginPath();
  const steps = 36;
  for (let i = 0; i <= steps; i += 1) {
    const a = (i / steps) * Math.PI * 2;
    const wobble = 1 + 0.07 * Math.sin(a * 3 + seed) + 0.05 * Math.sin(a * 5 + seed * 2.3) + 0.03 * Math.sin(a * 9 + seed * 0.7);
    const x = cx + Math.cos(a) * r * wobble;
    const y = cy + Math.sin(a) * r * wobble;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawWorldMap() {
  const canvas = document.getElementById("world-map-canvas");
  if (!canvas || !islands.length) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  if (!worldMapView) worldMapView = worldMapBounds();
  const b = worldMapView;
  const scale = Math.min(W / (b.maxX - b.minX), H / (b.maxZ - b.minZ));
  const ox = (W - (b.maxX - b.minX) * scale) / 2;
  const oy = (H - (b.maxZ - b.minZ) * scale) / 2;
  const px = (x) => ox + (x - b.minX) * scale;
  const py = (z) => oy + (z - b.minZ) * scale;
  const t = performance.now() * 0.001;

  // Sea
  const sea = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, Math.max(W, H) * 0.7);
  sea.addColorStop(0, "#1f6f8f");
  sea.addColorStop(1, "#0b3048");
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Islands
  islands.forEach((isl) => {
    const info = MAP_ISLAND_INFO[isl.index];
    const cx = px(isl.position.x);
    const cy = py(isl.position.z);
    const r = Math.max(5, isl.radius * scale);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = info ? info.shore : "#cdbf8f";
    islandBlob(ctx, cx, cy, r * 1.04, isl.index * 1.7);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = info ? info.land : "#7c9a6a";
    islandBlob(ctx, cx, cy, r * 0.9, isl.index * 1.7);
    ctx.fill();
    if (info) {
      ctx.textAlign = "center";
      ctx.font = "800 15px Outfit, Inter, sans-serif";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(5,16,25,0.85)";
      const label = tr(info.name);
      ctx.strokeText(label, cx, cy - r - 10);
      ctx.fillStyle = "#fff1ce";
      ctx.fillText(label, cx, cy - r - 10);
      ctx.font = "700 11px Inter, sans-serif";
      const lv = `${tr("Level")} ${info.levels}`;
      ctx.strokeText(lv, cx, cy - r + 5);
      ctx.fillStyle = "#9fdde8";
      ctx.fillText(lv, cx, cy - r + 5);
    }
  });

  // Raider ships
  (typeof seaRaiders !== "undefined" ? seaRaiders : []).forEach((r) => {
    if (!r.alive) return;
    const x = px(r.group.position.x);
    const y = py(r.group.position.z);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-r.yaw);
    ctx.fillStyle = "#e0453a";
    ctx.strokeStyle = "#2a0d0b";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 9);
    ctx.lineTo(5, -6);
    ctx.lineTo(-5, -6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });

  // Quest target
  const target = getQuestTargetPosition?.();
  if (target) {
    const x = px(target.x);
    const y = py(target.z);
    const pulse = 9 + Math.sin(t * 4) * 3;
    ctx.strokeStyle = "rgba(255,210,90,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ffd25a";
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 === 0 ? 7 : 3;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Your boat
  if (activeBoat && !isHelming) {
    const x = px(activeBoat.position.x);
    const y = py(activeBoat.position.z);
    ctx.fillStyle = "#59c7d8";
    ctx.strokeStyle = "#05303a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, 7, 4, -activeBoat.rotation.y + Math.PI / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // You
  if (playerMesh) {
    const x = px(playerMesh.position.x);
    const y = py(playerMesh.position.z);
    const yaw = isHelming ? boatYaw : playerMesh.rotation.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-yaw);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0b2433";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 11);
    ctx.lineTo(7, -7);
    ctx.lineTo(0, -3);
    ctx.lineTo(-7, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function questLogEntry(q, state) {
  const island = MAP_ISLAND_INFO[QUEST_ISLAND[q.id]];
  const div = document.createElement("div");
  div.className = `quest-log-item is-${state}`;
  const title = document.createElement("strong");
  title.textContent = tr(q.title);
  const meta = document.createElement("span");
  meta.textContent = `${island ? tr(island.name) : ""} · ${tr("Level")} ${q.minLevel}+`;
  const detail = document.createElement("p");
  detail.textContent = tr(q.detail);
  const reward = document.createElement("small");
  reward.textContent = `$${q.rewardMoney} · ${q.rewardXp} XP`;
  div.append(title, meta, detail, reward);
  if (state === "active") {
    const done = q.id === "starter" ? quest.defeated : activeQuest?.defeated || 0;
    const bar = document.createElement("i");
    bar.className = "quest-log-progress";
    bar.style.setProperty("--p", Math.min(1, done / q.target).toFixed(3));
    const count = document.createElement("em");
    count.textContent = `${Math.min(done, q.target)} / ${q.target}`;
    div.append(bar, count);
  }
  return div;
}

function renderQuestLog() {
  const list = document.getElementById("quest-log-list");
  if (!list) return;
  list.textContent = "";
  const section = (label) => {
    const h = document.createElement("h4");
    h.textContent = tr(label);
    list.append(h);
  };
  const all = Object.values(questCatalog);
  const current = quest.active && !quest.complete ? questCatalog.starter : activeQuest?.active ? questCatalog[activeQuest.id] : null;
  section("Current quest");
  if (current) list.append(questLogEntry(current, "active"));
  else {
    const p = document.createElement("p");
    p.className = "quest-log-empty";
    p.textContent = tr("No quest yet. Visit a quest giver and press E.");
    list.append(p);
  }
  const available = all.filter((q) => q !== current && q.minLevel <= player.level && !(q.id === "starter" && quest.complete));
  if (available.length) {
    section("Available now");
    available.slice().reverse().forEach((q) => list.append(questLogEntry(q, "available")));
  }
  const upcoming = all.filter((q) => q.minLevel > player.level).slice(0, 3);
  if (upcoming.length) {
    section("Coming up");
    upcoming.forEach((q) => list.append(questLogEntry(q, "locked")));
  }
  if (quest.complete) {
    section("Completed");
    list.append(questLogEntry(questCatalog.starter, "done"));
  }
}

document.getElementById("map-open")?.addEventListener("click", () => toggleWorldMap());
document.getElementById("world-map-close")?.addEventListener("click", () => toggleWorldMap(false));
document.getElementById("world-map")?.addEventListener("click", (event) => {
  if (event.target.id === "world-map") toggleWorldMap(false);
});
// Esc closes the map before it reaches the settings menu.
document.addEventListener("keydown", (event) => {
  if (worldMapOpen && event.key === "Escape") {
    event.stopPropagation();
    event.preventDefault();
    toggleWorldMap(false);
  }
}, true);

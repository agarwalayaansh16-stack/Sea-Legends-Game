
// ── 39-settings-and-saves.js ─ Remembered audio/graphics settings, automatic graphics, save backup.
var SETTINGS_KEY = "sea-legends-settings";
var gameSettings = { volume: 50, music: 100, effects: 100, graphics: 5, autoGraphics: true };
try { Object.assign(gameSettings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")); } catch (err) { /* storage unavailable */ }

function storeSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(gameSettings)); } catch (err) { /* storage unavailable */ }
}

function bindSlider(sliderId, labelId, key, apply, suffix = "%") {
  const slider = document.getElementById(sliderId);
  const label = document.getElementById(labelId);
  if (!slider) return;
  slider.value = gameSettings[key];
  if (label) label.textContent = `${gameSettings[key]}${suffix}`;
  apply(gameSettings[key]);
  slider.addEventListener("input", () => {
    gameSettings[key] = parseInt(slider.value, 10);
    if (label) label.textContent = `${gameSettings[key]}${suffix}`;
    apply(gameSettings[key]);
    storeSettings();
  });
}

bindSlider("volume-slider", "volume-val", "volume", (v) => audio.setVolume(v / 100));
bindSlider("music-volume-slider", "music-volume-val", "music", (v) => { audio.musicVolume = v / 100; });
bindSlider("effects-volume-slider", "effects-volume-val", "effects", (v) => audio.setEffectsVolume(v / 100));
bindSlider("graphics-quality-slider", "graphics-level-val", "graphics", (v) => setGraphicsQuality(v), "");

var autoGraphicsToggle = document.getElementById("esc-auto-graphics");
if (autoGraphicsToggle) {
  autoGraphicsToggle.checked = gameSettings.autoGraphics !== false;
  autoGraphicsToggle.addEventListener("change", () => {
    gameSettings.autoGraphics = autoGraphicsToggle.checked;
    storeSettings();
  });
}

// If the frame rate stays low, step graphics down one level at a time (never below 2).
// Uses real time: the game loop caps dt, so dt alone would hide a low frame rate.
var autoGraphicsState = { time: 0, frames: 0, slowFor: 0, cooldown: 8, last: 0 };
function updateAutoGraphics() {
  const s = autoGraphicsState;
  const now = performance.now();
  const real = s.last ? Math.min(1, (now - s.last) / 1000) : 0;
  s.last = now;
  if (!gameStarted || gameSettings.autoGraphics === false || escMenuOpen || document.hidden) {
    s.time = 0;
    s.frames = 0;
    return;
  }
  s.cooldown = Math.max(0, s.cooldown - real);
  s.time += real;
  s.frames += 1;
  if (s.time < 2) return;
  const fps = s.frames / s.time;
  s.time = 0;
  s.frames = 0;
  s.slowFor = fps < 26 ? s.slowFor + 2 : 0;
  if (s.slowFor >= 6 && s.cooldown <= 0 && gameSettings.graphics > 2) {
    gameSettings.graphics -= 1;
    setGraphicsQuality(gameSettings.graphics);
    const slider = document.getElementById("graphics-quality-slider");
    const label = document.getElementById("graphics-level-val");
    if (slider) slider.value = gameSettings.graphics;
    if (label) label.textContent = gameSettings.graphics;
    storeSettings();
    log(`The game was running slowly, so graphics were lowered to level ${gameSettings.graphics}. You can change this in the Esc menu.`);
    s.slowFor = 0;
    s.cooldown = 12;
  }
}

// ── Save backup ──
var SAVE_FILE_FORMAT = "sea-legends-save";
var SAVE_NUMBER_KEYS = ["level", "xp", "xpToNext", "money"];
var SAVE_BOOL_KEYS = ["hasSword", "hasGun", "specialUnlocked", "hasFlamingFeet", "hasFlashStep", "observationHakiUnlocked"];

function setBackupStatus(text, isError) {
  const el = document.getElementById("save-backup-status");
  if (!el) return;
  el.textContent = tr(text);
  el.classList.toggle("is-error", !!isError);
}

function readAccounts() {
  try { return JSON.parse(localStorage.getItem("sea_legends_accounts") || "[]"); } catch (err) { return []; }
}

function exportSave() {
  if (!currentUsername) {
    setBackupStatus("Choose a profile first.", true);
    return;
  }
  saveGame();
  const account = readAccounts().find((a) => a.username.toLowerCase() === currentUsername.toLowerCase());
  if (!account?.saveData) {
    setBackupStatus("There is no progress to back up yet.", true);
    return;
  }
  const file = { format: SAVE_FILE_FORMAT, version: 1, exportedAt: new Date().toISOString(), profile: account.username, saveData: account.saveData };
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = account.username.replace(/[^a-z0-9_-]+/gi, "-").slice(0, 32) || "profile";
  link.href = url;
  link.download = `sea-legends-${safeName}-level-${account.saveData.level || 1}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  setBackupStatus("Backup downloaded.");
}

// Only well-formed values are kept; anything unexpected is dropped and cheat flags are never imported.
function cleanImportedSave(data) {
  if (!data || typeof data !== "object") return null;
  const clean = {};
  const numberOk = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v < 1e9;
  SAVE_NUMBER_KEYS.forEach((k) => { if (numberOk(data[k])) clean[k] = data[k]; });
  SAVE_BOOL_KEYS.forEach((k) => { if (typeof data[k] === "boolean") clean[k] = data[k]; });
  const numberMap = (obj) => {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return undefined;
    const out = {};
    Object.entries(obj).slice(0, 40).forEach(([k, v]) => { if (/^[a-zA-Z0-9_-]{1,32}$/.test(k) && numberOk(v)) out[k] = v; });
    return out;
  };
  ["materials", "stats", "mastery", "masteryXp"].forEach((k) => { const m = numberMap(data[k]); if (m) clean[k] = m; });
  if (["Pirates", "Marines", "Neutral"].includes(data.faction)) clean.faction = data.faction;
  if (data.haki && typeof data.haki === "object") {
    const h = data.haki;
    clean.haki = { unlocked: h.unlocked === true, active: false, level: numberOk(h.level) ? Math.min(h.level, 100) : 0, kills: numberOk(h.kills) ? h.kills : 0, nextKills: numberOk(h.nextKills) && h.nextKills > 0 ? h.nextKills : 8 };
  }
  if (typeof data.selectedAvatarId === "string" && data.selectedAvatarId.length < 64) clean.selectedAvatarId = data.selectedAvatarId;
  if (Array.isArray(data.avatars) && data.avatars.length <= 50) {
    // Avatars are plain settings objects; strings are stripped of markup.
    const scrub = (v, depth = 0) => {
      if (depth > 4) return undefined;
      if (typeof v === "string") return v.replace(/[<>]/g, "").slice(0, 120);
      if (typeof v === "number" || typeof v === "boolean") return Number.isFinite(v) || typeof v === "boolean" ? v : undefined;
      if (Array.isArray(v)) return v.slice(0, 50).map((x) => scrub(x, depth + 1));
      if (v && typeof v === "object") {
        const o = {};
        Object.entries(v).slice(0, 60).forEach(([k, x]) => { if (/^[a-zA-Z0-9_-]{1,40}$/.test(k)) o[k] = scrub(x, depth + 1); });
        return o;
      }
      return undefined;
    };
    clean.avatars = data.avatars.map((a) => scrub(a));
  }
  clean.isGodMode = false;
  clean.isInstakill = false;
  if (!clean.faction || !numberOk(clean.level)) return null;
  return clean;
}

var pendingImport = null;
function importSaveFile(file) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    setBackupStatus("That file is too large to be a Sea Legends backup.", true);
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    let parsed = null;
    try { parsed = JSON.parse(String(reader.result)); } catch (err) { parsed = null; }
    const saveData = parsed?.format === SAVE_FILE_FORMAT ? cleanImportedSave(parsed.saveData) : null;
    if (!saveData) {
      setBackupStatus("That file is not a valid Sea Legends backup.", true);
      return;
    }
    pendingImport = saveData;
    const button = document.getElementById("save-import");
    if (button) button.textContent = tr("Replace current progress?");
    setBackupStatus(`${tr("Backup found")}: ${tr("Level")} ${saveData.level}, ${saveData.faction}. ${tr("Press the button again to replace this profile's progress.")}`);
  };
  reader.readAsText(file);
}

function applyPendingImport() {
  if (!pendingImport || !currentUsername) return;
  const accounts = readAccounts();
  const account = accounts.find((a) => a.username.toLowerCase() === currentUsername.toLowerCase());
  if (!account) {
    setBackupStatus("Choose a profile first.", true);
    return;
  }
  account.saveData = pendingImport;
  try {
    localStorage.setItem("sea_legends_accounts", JSON.stringify(accounts));
  } catch (err) {
    setBackupStatus("The backup could not be saved in this browser.", true);
    return;
  }
  pendingImport = null;
  setBackupStatus("Backup loaded. Restarting the game...");
  // Stop the next autosave from overwriting the imported progress, then reload.
  gameStarted = false;
  setTimeout(() => location.reload(), 600);
}

document.getElementById("save-export")?.addEventListener("click", exportSave);
document.getElementById("save-import")?.addEventListener("click", () => {
  if (pendingImport) {
    applyPendingImport();
    return;
  }
  if (!currentUsername) {
    setBackupStatus("Choose a profile first.", true);
    return;
  }
  document.getElementById("save-import-file")?.click();
});
document.getElementById("save-import-file")?.addEventListener("change", (event) => {
  importSaveFile(event.target.files?.[0]);
  event.target.value = "";
});

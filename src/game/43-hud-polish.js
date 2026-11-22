
// ── 43-hud-polish.js ─ Health damage trail, low-health warning, level/money pops, message entrance.
var hudPolish = { health: null, level: null, money: null, ready: false, trail: null };

function setupHudPolish() {
  if (hudPolish.ready) return;
  const container = document.querySelector(".hud-bar-container.health");
  if (!container) return;
  hudPolish.ready = true;
  // A pale bar behind the health fill that drains a moment later, showing how much was lost.
  const trail = document.createElement("span");
  trail.className = "hud-bar-trail";
  container.prepend(trail);
  hudPolish.trail = trail;
}

function retrigger(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

function updateHudPolish() {
  setupHudPolish();
  const frac = Math.max(0, Math.min(1, player.health / player.maxHealth));
  if (hudPolish.trail) {
    const trailFrac = parseFloat(hudPolish.trail.dataset.f || "1");
    // Healing snaps the trail; damage lets it drain behind the bar.
    hudPolish.trail.classList.toggle("is-healing", frac > trailFrac);
    hudPolish.trail.style.transform = `scaleX(${frac.toFixed(3)})`;
    hudPolish.trail.dataset.f = frac.toFixed(3);
  }
  const low = gameStarted && player.health > 0 && frac < 0.3;
  document.body.classList.toggle("is-low-health", low);
  document.querySelector(".hud-bar-container.health")?.classList.toggle("is-low", low);
  if (hudPolish.level !== null && player.level > hudPolish.level) retrigger(document.getElementById("level-readout"), "is-pop");
  hudPolish.level = player.level;
  if (hudPolish.money !== null && player.money !== hudPolish.money) retrigger(document.getElementById("money-readout"), player.money > hudPolish.money ? "is-gain" : "is-spend");
  hudPolish.money = player.money;
}

var __updateHud = updateHud;
updateHud = function () {
  const r = __updateHud.apply(this, arguments);
  updateHudPolish();
  return r;
};

var __log = log;
log = function (message) {
  const r = __log.apply(this, arguments);
  retrigger(document.getElementById("message-log"), "is-new");
  return r;
};


// ── 38-mobile-skills.js ─ Touch buttons for skills, dash, block and trained abilities.
var mobileSkillSig = "";
var mobileSkillButtons = [];

function mobileSkillItems() {
  const weapon = player.weapon;
  const mastery = player.mastery?.[weapon] || 1;
  const items = (masterySkills[weapon] || [])
    .filter((s) => s.key && mastery >= s.req)
    .map((s) => ({ kind: "skill", key: s.key, label: s.name, id: s.id, cd: s.cd }));
  items.push({ kind: "dash", key: "Q", label: "Dash" });
  items.push({ kind: "block", key: "F", label: "Block" });
  if (player.haki?.unlocked) items.push({ kind: "haki", key: "H", label: "Iron Aura" });
  if (player.observationHaki?.unlocked) items.push({ kind: "foresight", key: "K", label: "Foresight" });
  if (player.hasFlashStep) items.push({ kind: "flash", key: "T", label: "Flash Step" });
  return items;
}

function mobileSkillsAllowed() {
  return gameStarted && !escMenuOpen && player.health > 0 && !isHelming && !(player.stunTimer > 0);
}

function buildMobileSkills(bar, items) {
  bar.textContent = "";
  mobileSkillButtons = items.map((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mobile-skill mobile-skill-${item.kind}`;
    button.setAttribute("aria-label", tr(item.label));
    const key = document.createElement("kbd");
    key.textContent = item.key;
    const name = document.createElement("span");
    name.textContent = tr(item.label);
    button.append(key, name);
    if (item.kind === "block") {
      const release = () => { player.isBlocking = false; };
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        if (!mobileSkillsAllowed()) return;
        button.setPointerCapture?.(event.pointerId);
        player.isBlocking = true;
        player.blockStartTime = performance.now();
      });
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);
    } else {
      button.addEventListener("click", () => {
        if (!mobileSkillsAllowed()) return;
        if (item.kind === "skill") executeSkillByKey(item.key);
        else if (item.kind === "dash") dash();
        else if (item.kind === "haki") toggleHaki();
        else if (item.kind === "foresight") toggleObservationHaki();
        else if (item.kind === "flash") flashStep();
        updateHud();
      });
    }
    bar.append(button);
    return { button, item };
  });
}

// Called every frame; does nothing unless the touch controls are on screen.
function updateMobileSkills() {
  const bar = document.getElementById("mobile-skills");
  // Skip the work unless the touch controls are on screen (an empty bar is hidden itself).
  if (!bar || !bar.parentElement?.offsetParent) return;
  const items = mobileSkillItems();
  const sig = `${currentLanguage || "en"}|${items.map((i) => i.kind + i.key).join(",")}`;
  if (sig !== mobileSkillSig) {
    mobileSkillSig = sig;
    buildMobileSkills(bar, items);
  }
  mobileSkillButtons.forEach(({ button, item }) => {
    let fraction = 0;
    if (item.kind === "skill") fraction = (skillCooldowns[item.id] || 0) / item.cd;
    button.style.setProperty("--cd", Math.max(0, Math.min(1, fraction)).toFixed(3));
    if (item.kind === "haki") button.classList.toggle("is-on", !!player.haki?.active);
    if (item.kind === "foresight") button.classList.toggle("is-on", !!player.observationHaki?.active);
    if (item.kind === "block") button.classList.toggle("is-on", !!player.isBlocking);
  });
}

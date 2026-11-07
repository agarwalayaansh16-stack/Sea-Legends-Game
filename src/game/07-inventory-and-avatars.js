
// ── 07-inventory-and-avatars.js ─ Movement modes, weapons, inventory UI and the 2D avatar editor.
function setMovementMode(mode) {
  player.movementMode = mode;
  walkToggle?.classList.toggle("active", mode === "walk");
  sprintToggle?.classList.toggle("active", mode === "sprint");
  log(mode === "sprint" ? "Sprint mode enabled. High speed increases impact risk." : "Walk mode enabled. Better control, lower impact risk.");
}

function toggleHaki() {
  if (!player.haki.unlocked) {
    log("Iron Aura is locked. Reach level 60, visit Desert Island, and train with the Aura Trainer.");
    return;
  }
  player.haki.active = !player.haki.active;
  hakiToggle?.classList.toggle("active", player.haki.active);
  applyHakiVisuals();
  audio.playHaki();
  log(player.haki.active ? `Iron Aura level ${player.haki.level} activated.` : "Iron Aura released.");
}

function setWeapon(weapon) {
  if (weapon === "special" && !player.specialUnlocked) return;
  if (weapon === "sword" && !player.hasSword) return;
  if (weapon === "gun" && !player.hasGun) return;
  player.weapon = weapon;
  document.body.dataset.weapon = weapon;
  if (ui.level) {
    ui.level.classList.remove("weapon-pop");
    void ui.level.offsetWidth;
    ui.level.classList.add("weapon-pop");
  }
  renderInventory();
  updateCombatHud();
}

function renderInventory() {
  if (!inventoryPanel || !inventoryTabs || !inventoryList) return;
  inventoryPanel.classList.toggle("hidden", !inventoryState.open);
  inventoryButton?.classList.toggle("active", inventoryState.open);

  inventoryTabs.querySelectorAll("[data-inventory-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.inventoryTab === inventoryState.tab);
  });

  if (inventoryState.tab === "items") {
    inventoryList.innerHTML = `
      <div class="inventory-items-container" style="display: flex; flex-direction: column; gap: 10px; width: 100%; padding: 8px; max-height: 380px; overflow-y: auto; pointer-events: auto;">
        <div class="material-card" style="display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255,247,230,0.15); border-radius: 12px; padding: 12px; background: rgba(5,18,26,0.85); box-shadow: 0 4px 10px rgba(0,0,0,0.4); text-shadow: none;">
          <div style="font-size: 24px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: rgba(140, 90, 50, 0.15); border: 1px solid rgba(140, 90, 50, 0.3); color: #8c5a32;">🪵</div>
          <div style="display: flex; flex-direction: column; flex: 1;">
            <strong style="color: #fff; font-size: 13px;">Ironwood</strong>
            <span style="color: rgba(255,247,230,0.5); font-size: 10.5px;">Premium hardwood used for crafting starter blades.</span>
          </div>
          <span style="color: #3ce88a; font-size: 15px; font-weight: 800; padding: 4px 10px; border-radius: 6px; background: rgba(60,232,138,0.1); border: 1px solid rgba(60,232,138,0.15);">${player.materials.ironwood}</span>
        </div>
        <div class="material-card" style="display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255,247,230,0.15); border-radius: 12px; padding: 12px; background: rgba(5,18,26,0.85); box-shadow: 0 4px 10px rgba(0,0,0,0.4); text-shadow: none;">
          <div style="font-size: 24px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: rgba(120, 120, 120, 0.15); border: 1px solid rgba(120, 120, 120, 0.3); color: #787878;">🔩</div>
          <div style="display: flex; flex-direction: column; flex: 1;">
            <strong style="color: #fff; font-size: 13px;">Wood Scrap / Metal Scrap</strong>
            <span style="color: rgba(255,247,230,0.5); font-size: 10.5px;">Scavenged metal and wood pieces used to build flintlock pistols.</span>
          </div>
          <span style="color: #3ce88a; font-size: 15px; font-weight: 800; padding: 4px 10px; border-radius: 6px; background: rgba(60,232,138,0.1); border: 1px solid rgba(60,232,138,0.15);">${player.materials.scrap}</span>
        </div>
        <div class="material-card" style="display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255,247,230,0.15); border-radius: 12px; padding: 12px; background: rgba(5,18,26,0.85); box-shadow: 0 4px 10px rgba(0,0,0,0.4); text-shadow: none;">
          <div style="font-size: 24px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: rgba(13, 169, 214, 0.15); border: 1px solid rgba(13, 169, 214, 0.3); color: #0da9d6;">🔮</div>
          <div style="display: flex; flex-direction: column; flex: 1;">
            <strong style="color: #fff; font-size: 13px;">Jungle Core</strong>
            <span style="color: rgba(255,247,230,0.5); font-size: 10.5px;">Ancient, glowing cores pulsing with energy, used for Special combat abilities.</span>
          </div>
          <span style="color: #3ce88a; font-size: 15px; font-weight: 800; padding: 4px 10px; border-radius: 6px; background: rgba(60,232,138,0.1); border: 1px solid rgba(60,232,138,0.15);">${player.materials.jungleCore}</span>
        </div>
      </div>
    `;
    return;
  }

  if (inventoryState.tab === "mastery") {
    inventoryList.innerHTML = `
      <div class="mastery-container" style="display: flex; flex-direction: column; gap: 14px; width: 100%; padding: 8px; max-height: 380px; overflow-y: auto; pointer-events: auto;">
        ${Object.keys(player.mastery).map(stat => {
          const val = player.masteryXp ? (player.masteryXp[stat] || 0) : 0;
          const masteryInfo = getMasteryInfo(val);
          const skills = masterySkills[stat];
          const barPercent = (masteryInfo.currentLevelPoints / masteryInfo.neededForNext) * 100;
          return `
            <div class="mastery-card" style="border: 1px solid rgba(255,247,230,0.15); border-radius: 14px; padding: 12px; background: rgba(5,18,26,0.85); box-shadow: 0 4px 10px rgba(0,0,0,0.4); text-shadow: none;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <strong style="color: var(--gold); text-transform: uppercase; font-size: 13px;">${statLabels[stat]} Mastery</strong>
                <span style="color: #7ce0b4; font-weight: bold; font-size: 12px;">Mastery ${masteryInfo.level} (${masteryInfo.currentLevelPoints}/${masteryInfo.neededForNext} MP)</span>
              </div>
              <div class="bar" style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; margin-bottom: 10px;">
                <div style="height: 100%; width: ${Math.min(100, barPercent)}%; background: linear-gradient(90deg, #7ce0b4, #0d7892); transition: width 0.3s ease;"></div>
              </div>
              <div class="mastery-skills" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 6px;">
                ${skills.map(skill => {
                  const unlocked = masteryInfo.level >= skill.req;
                  return `
                    <div style="border: 1px solid ${unlocked ? "rgba(124,224,180,0.3)" : "rgba(255,255,255,0.05)"}; border-radius: 10px; padding: 6px; background: ${unlocked ? "rgba(124,224,180,0.06)" : "rgba(0,0,0,0.25)"}; text-align: center; font-size: 10px;">
                      <strong style="color: ${unlocked ? "#7ce0b4" : "rgba(255,255,255,0.45)"}; display: block; margin-bottom: 2px; font-size: 11px;">${skill.name}</strong>
                      <small style="color: rgba(255,247,230,0.45); display: block; margin-bottom: 4px;">Req: Mastery ${skill.req}</small>
                      <span style="color: rgba(255,255,255,0.65); display: block; font-size: 8.5px; line-height: 1.2; min-height: 38px;">${skill.desc}</span>
                      <b style="color: ${unlocked ? "#ffcf5a" : "#ef6048"}; display: block; margin-top: 4px; font-size: 9px; letter-spacing: 0.05em;">${unlocked ? "ACTIVE" : "LOCKED"}</b>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  const items = inventoryItems[inventoryState.tab] || [];
  inventoryList.innerHTML = "";
  items.forEach((item) => {
    const unlocked = item.unlocked();
    const canBuy = canBuyInventoryItem(item);
    const row = document.createElement("button");
    row.type = "button";
    row.className = `inventory-item${unlocked ? "" : " locked"}${player.weapon === item.weapon ? " equipped" : ""}`;
    row.innerHTML = `
      <span>
        <strong>${item.name}</strong>
        <small>${item.description}</small>
        <em>${unlocked ? "Unlocked" : `Requires ${item.requirement}`}</em>
      </span>
      <b>${player.weapon === item.weapon ? "Equipped" : unlocked ? "Use" : canBuy ? "Buy" : "Locked"}</b>
    `;
    row.addEventListener("click", () => {
      if (!unlocked) {
        if (canBuyInventoryItem(item)) {
          item.buy();
          updateHud();
          renderInventory();
          log(`${item.name} bought and unlocked.`);
          return;
        }
        log(`${item.name} is locked. Requires ${item.requirement}.`);
        return;
      }
      setWeapon(item.weapon);
      log(`${item.name} equipped.`);
    });
    inventoryList.append(row);
  });
}

function canBuyInventoryItem(item) {
  if (!item.cost || !item.buy) return false;
  return Object.entries(item.cost).every(([resource, amount]) => {
    if (resource === "money") return player.money >= amount;
    return (player.materials[resource] || 0) >= amount;
  });
}

function renderStudioAvatarChoices() {
  if (!studioAvatarList) return;
  studioAvatarList.innerHTML = "";
  avatarState.avatars.forEach((avatar) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `avatar-option${avatar.id === avatarState.selectedId ? " selected" : ""}`;
    button.textContent = avatar.name;
    // Styling matching the beautiful studio template buttons
    button.style.cssText = `
      padding: 8px 14px;
      background: ${avatar.id === avatarState.selectedId ? "var(--gold)" : "rgba(255,255,255,0.04)"};
      color: ${avatar.id === avatarState.selectedId ? "var(--ink)" : "#fff"};
      border: 1px solid ${avatar.id === avatarState.selectedId ? "var(--gold)" : "rgba(255,255,255,0.1)"};
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    `;
    button.addEventListener("click", () => {
      avatarState.selectedId = avatar.id;
      applyAvatarToPlayer();
      renderAvatarChoices();
    });
    studioAvatarList.append(button);
  });
}

function renderAvatarChoices() {
  if (!avatarList) return;
  avatarList.innerHTML = "";
  avatarState.avatars.forEach((avatar) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `avatar-option${avatar.id === avatarState.selectedId ? " selected" : ""}`;
    button.textContent = avatar.name;
    button.style.boxShadow = `inset 0 -5px 0 ${avatar.shirt || avatar.torsoColor || "#1b85aa"}`;
    button.addEventListener("click", () => {
      avatarState.selectedId = avatar.id;
      applyAvatarToPlayer();
      renderAvatarChoices();
    });
    avatarList.append(button);
  });

  // Sync the Faction select screen dropdown
  const dropdown = document.querySelector("#faction-avatar-dropdown");
  if (dropdown) {
    dropdown.innerHTML = "";
    avatarState.avatars.forEach((avatar) => {
      const option = document.createElement("option");
      option.value = avatar.id;
      option.textContent = avatar.name;
      option.selected = (avatar.id === avatarState.selectedId);
      dropdown.appendChild(option);
    });
  }

  const activeAvatar = getSelectedAvatar();
  loadAvatarIntoEditor(activeAvatar);
  if (playerMesh) applyAvatarToPlayer();
  
  // Safe update for 3D Customizer Preview
  updateAvatarPreview3D(activeAvatar);

  if (deleteAvatarButton) deleteAvatarButton.disabled = avatarState.avatars.length <= 1;

  // Render studio templates choices
  renderStudioAvatarChoices();
  if (studioDeleteAvatarButton) studioDeleteAvatarButton.disabled = avatarState.avatars.length <= 1;
}

function createCustomAvatar() {
  const avatar = { ...getAvatarFromEditor(), id: `custom-${Date.now()}` };
  avatarState.avatars.push(avatar);
  avatarState.selectedId = avatar.id;
  renderAvatarChoices();
  log(`Created avatar: ${avatar.name}.`);
}

function createStudioCustomAvatar() {
  const avatar = { ...getAvatarFromStudioEditor(), id: `custom-${Date.now()}` };
  avatarState.avatars.push(avatar);
  avatarState.selectedId = avatar.id;
  renderAvatarChoices();
  log(`Created avatar in studio: ${avatar.name}.`);
}

function saveSelectedAvatar() {
  const selected = getSelectedAvatar();
  Object.assign(selected, getAvatarFromEditor(), { id: selected.id });
  updateDerivedStats(selected);
  renderAvatarChoices();
  updateHud();
  log(`Saved avatar: ${selected.name}.`);
}

function saveStudioSelectedAvatar() {
  const selected = getSelectedAvatar();
  Object.assign(selected, getAvatarFromStudioEditor(), { id: selected.id });
  updateDerivedStats(selected);
  renderAvatarChoices();
  updateHud();
  log(`Saved avatar from studio: ${selected.name}.`);
}

function deleteSelectedAvatar() {
  if (avatarState.avatars.length <= 1) {
    log("You need at least one avatar before starting.");
    return;
  }

  const selected = getSelectedAvatar();
  avatarState.avatars = avatarState.avatars.filter((avatar) => avatar.id !== selected.id);
  avatarState.selectedId = avatarState.avatars[0].id;
  renderAvatarChoices();
  log(`Deleted avatar: ${selected.name}.`);
}

function deleteStudioSelectedAvatar() {
  if (avatarState.avatars.length <= 1) {
    log("You need at least one avatar.");
    return;
  }

  const selected = getSelectedAvatar();
  avatarState.avatars = avatarState.avatars.filter((avatar) => avatar.id !== selected.id);
  avatarState.selectedId = avatarState.avatars[0].id;
  renderAvatarChoices();
  log(`Deleted avatar from studio: ${selected.name}.`);
}

function sync2DTo3D() {
  if (avatarNameInput && studioAvatarNameInput) studioAvatarNameInput.value = avatarNameInput.value;
  if (skinColorInput && studioSkinColorInput) studioSkinColorInput.value = skinColorInput.value;
  if (shirtColorInput && studioShirtColorInput) {
    studioShirtColorInput.value = shirtColorInput.value;
    if (studioLeftArmColorInput) studioLeftArmColorInput.value = shirtColorInput.value;
    if (studioRightArmColorInput) studioRightArmColorInput.value = shirtColorInput.value;
    if (studioCapeColorInput) studioCapeColorInput.value = shirtColorInput.value;
  }
  if (pantsColorInput && studioPantsColorInput) {
    studioPantsColorInput.value = pantsColorInput.value;
    if (studioLeftLegColorInput) studioLeftLegColorInput.value = pantsColorInput.value;
    if (studioRightLegColorInput) studioRightLegColorInput.value = pantsColorInput.value;
  }
  if (hairColorInput && studioHairColorInput) studioHairColorInput.value = hairColorInput.value;
  if (eyeColorInput && studioEyeColorInput) studioEyeColorInput.value = eyeColorInput.value;
  if (bootColorInput && studioBootColorInput) {
    studioBootColorInput.value = bootColorInput.value;
    if (studioBeltColorInput) studioBeltColorInput.value = bootColorInput.value;
  }
  if (hairStyleInput && studioHairStyleInput) studioHairStyleInput.value = hairStyleInput.value;
  if (outfitStyleInput && studioOutfitStyleInput) studioOutfitStyleInput.value = outfitStyleInput.value;
  if (heightScaleInput && studioHeightScaleInput) {
    studioHeightScaleInput.value = heightScaleInput.value;
    const heightValText = document.querySelector("#studio-val-height");
    if (heightValText) heightValText.textContent = `${heightScaleInput.value}%`;
  }
  if (buildScaleInput && studioBuildScaleInput) {
    studioBuildScaleInput.value = buildScaleInput.value;
    const buildValText = document.querySelector("#studio-val-build");
    if (buildValText) buildValText.textContent = `${buildScaleInput.value}%`;
  }
}

function sync3DTo2D() {
  if (studioAvatarNameInput && avatarNameInput) avatarNameInput.value = studioAvatarNameInput.value;
  if (studioSkinColorInput && skinColorInput) skinColorInput.value = studioSkinColorInput.value;
  if (studioShirtColorInput && shirtColorInput) shirtColorInput.value = studioShirtColorInput.value;
  if (studioPantsColorInput && pantsColorInput) pantsColorInput.value = studioPantsColorInput.value;
  if (studioHairColorInput && hairColorInput) hairColorInput.value = studioHairColorInput.value;
  if (studioEyeColorInput && eyeColorInput) eyeColorInput.value = studioEyeColorInput.value;
  if (studioBootColorInput && bootColorInput) bootColorInput.value = studioBootColorInput.value;
  if (studioHairStyleInput && hairStyleInput) hairStyleInput.value = studioHairStyleInput.value;
  if (studioOutfitStyleInput && outfitStyleInput) outfitStyleInput.value = studioOutfitStyleInput.value;
  if (studioHeightScaleInput && heightScaleInput) heightScaleInput.value = studioHeightScaleInput.value;
  if (studioBuildScaleInput && buildScaleInput) buildScaleInput.value = studioBuildScaleInput.value;
}

function previewAvatarFromForm() {
  sync2DTo3D();
  const avatar = getAvatarFromEditor();
  updateAvatarPreview3D(avatar);
  const avatarPreviewCard = document.querySelector("#avatar-preview");
  if (avatarPreviewCard && previewName && avatarTraits) {
    updateAvatarPreview(avatar);
  }
  updateDerivedStats(avatar);
  updateHud();
  if (!gameStarted) {
    applyTemporaryAvatarToPlayer(avatar);
  }
}

function previewStudioAvatarFromForm() {
  sync3DTo2D();
  const avatar = getAvatarFromStudioEditor();
  updateAvatarPreview3D(avatar);
  const avatarPreviewCard = document.querySelector("#avatar-preview");
  if (avatarPreviewCard && previewName && avatarTraits) {
    updateAvatarPreview(avatar);
  }
  updateDerivedStats(avatar);
  updateHud();
  if (!gameStarted) {
    applyTemporaryAvatarToPlayer(avatar);
  }
}

function getAvatarFromEditor() {
  return {
    id: avatarState.selectedId,
    name: avatarNameInput.value.trim() || `Avatar ${avatarState.avatars.length + 1}`,
    skin: skinColorInput.value,
    shirt: shirtColorInput.value,
    pants: pantsColorInput.value,
    hair: hairColorInput.value,
    eyes: eyeColorInput.value,
    boots: bootColorInput.value,
    hairStyle: hairStyleInput.value,
    outfit: outfitStyleInput.value,
    height: Number(heightScaleInput.value),
    build: Number(buildScaleInput.value),
    
    // New Advanced Styling Options
    leftArmColor: leftArmColorInput ? leftArmColorInput.value : shirtColorInput.value,
    rightArmColor: rightArmColorInput ? rightArmColorInput.value : shirtColorInput.value,
    leftLegColor: leftLegColorInput ? leftLegColorInput.value : pantsColorInput.value,
    rightLegColor: rightLegColorInput ? rightLegColorInput.value : pantsColorInput.value,
    beltColor: beltColorInput ? beltColorInput.value : bootColorInput.value,
    capeColor: capeColorInput ? capeColorInput.value : shirtColorInput.value,
    capeStyle: capeStyleInput ? capeStyleInput.value : "normal",
  };
}

function getAvatarFromStudioEditor() {
  return {
    id: avatarState.selectedId,
    name: studioAvatarNameInput.value.trim() || `Avatar ${avatarState.avatars.length + 1}`,
    skin: studioSkinColorInput.value,
    shirt: studioShirtColorInput.value,
    pants: studioPantsColorInput.value,
    hair: studioHairColorInput.value,
    eyes: studioEyeColorInput.value,
    boots: studioBootColorInput.value,
    hairStyle: studioHairStyleInput.value,
    outfit: studioOutfitStyleInput.value,
    height: Number(studioHeightScaleInput.value),
    build: Number(studioBuildScaleInput.value),
    
    leftArmColor: studioLeftArmColorInput.value,
    rightArmColor: studioRightArmColorInput.value,
    leftLegColor: studioLeftLegColorInput.value,
    rightLegColor: studioRightLegColorInput.value,
    beltColor: studioBeltColorInput.value,
    capeColor: studioCapeColorInput.value,
    capeStyle: studioCapeStyleInput.value,
    ...readStudioExtras(),
  };
}

// Proportion sliders and look options added to the studio (ids -> avatar fields).
const STUDIO_EXTRA_FIELDS = {
  armLength: { id: "#studio-arm-length", number: true, fallback: 100 },
  legLength: { id: "#studio-leg-length", number: true, fallback: 100 },
  torsoLength: { id: "#studio-torso-length", number: true, fallback: 100 },
  headSize: { id: "#studio-head-size", number: true, fallback: 100 },
  bodyType: { id: "#studio-body-type", fallback: "human" },
  headStyle: { id: "#studio-head-style", fallback: "normal" },
  accessory: { id: "#studio-accessory", fallback: null },
};

function readStudioExtras() {
  const out = {};
  Object.entries(STUDIO_EXTRA_FIELDS).forEach(([field, cfg]) => {
    const input = document.querySelector(cfg.id);
    if (!input) return;
    out[field] = cfg.number ? Number(input.value) : input.value;
  });
  return out;
}

function loadStudioExtras(avatar) {
  Object.entries(STUDIO_EXTRA_FIELDS).forEach(([field, cfg]) => {
    const input = document.querySelector(cfg.id);
    if (!input) return;
    let value = avatar[field] ?? cfg.fallback;
    // Older avatars had a halo unless they wore the adventurer outfit.
    if (field === "accessory" && value == null) value = avatar.outfit !== "adventurer" ? "halo" : "none";
    input.value = value;
  });
  refreshStudioSliderReadouts();
}

function refreshStudioSliderReadouts() {
  document.querySelectorAll(".studio-slider[data-readout]").forEach((slider) => {
    const readout = document.querySelector(slider.dataset.readout);
    if (readout) readout.textContent = `${slider.value}%`;
  });
}

// Avatar codes: a compact, shareable text version of a design.
const AVATAR_CODE_PREFIX = "SL1:";
const AVATAR_CODE_FIELDS = ["name", "skin", "shirt", "pants", "hair", "eyes", "boots", "hairStyle", "outfit", "height", "build",
  "leftArmColor", "rightArmColor", "leftLegColor", "rightLegColor", "beltColor", "capeColor", "capeStyle",
  "armLength", "legLength", "torsoLength", "headSize", "bodyType", "headStyle", "accessory"];

function encodeAvatarCode(avatar) {
  const data = {};
  AVATAR_CODE_FIELDS.forEach((key) => { if (avatar[key] !== undefined) data[key] = avatar[key]; });
  return AVATAR_CODE_PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

// Only known fields with sane values are accepted from a pasted code.
function decodeAvatarCode(code) {
  const text = String(code || "").trim();
  if (!text.startsWith(AVATAR_CODE_PREFIX)) throw new Error("That doesn't look like an avatar code.");
  let data;
  try {
    data = JSON.parse(decodeURIComponent(escape(atob(text.slice(AVATAR_CODE_PREFIX.length)))));
  } catch (error) {
    throw new Error("That avatar code is damaged or incomplete.");
  }
  const clean = {};
  const isColor = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
  const choices = {
    hairStyle: ["short", "spiky", "cap", "messy"],
    outfit: ["sailor", "coat", "armor", "adventurer"],
    capeStyle: ["none", "normal", "long", "torn"],
    bodyType: ["human", "skeleton"],
    headStyle: ["normal", "headless"],
    accessory: ["none", "halo", "spectral-hands"],
  };
  const ranges = { height: [80, 130], build: [75, 135], armLength: [75, 135], legLength: [75, 135], torsoLength: [80, 125], headSize: [75, 135] };
  AVATAR_CODE_FIELDS.forEach((key) => {
    const v = data[key];
    if (v === undefined) return;
    if (key === "name" && typeof v === "string") clean.name = v.slice(0, 18);
    else if (choices[key] && choices[key].includes(v)) clean[key] = v;
    else if (ranges[key] && Number.isFinite(Number(v))) clean[key] = clamp(Number(v), ranges[key][0], ranges[key][1]);
    else if (!choices[key] && !ranges[key] && isColor(v)) clean[key] = v;
  });
  if (!clean.skin) throw new Error("That avatar code is missing its colours.");
  return clean;
}

function loadAvatarIntoEditor(avatar) {
  if (avatarNameInput) avatarNameInput.value = avatar.name;
  if (skinColorInput) skinColorInput.value = avatar.skin;
  if (shirtColorInput) shirtColorInput.value = avatar.shirt;
  if (pantsColorInput) pantsColorInput.value = avatar.pants;
  if (hairColorInput) hairColorInput.value = avatar.hair;
  if (eyeColorInput) eyeColorInput.value = avatar.eyes || "#101820";
  if (bootColorInput) bootColorInput.value = avatar.boots || "#23170f";
  if (hairStyleInput) hairStyleInput.value = avatar.hairStyle || "short";
  if (outfitStyleInput) outfitStyleInput.value = avatar.outfit || "sailor";
  if (heightScaleInput) heightScaleInput.value = avatar.height || 100;
  if (buildScaleInput) buildScaleInput.value = avatar.build || 100;

  // New Advanced Options Loading
  if (leftArmColorInput) leftArmColorInput.value = avatar.leftArmColor || avatar.shirt || avatar.skin;
  if (rightArmColorInput) rightArmColorInput.value = avatar.rightArmColor || avatar.shirt || avatar.skin;
  if (leftLegColorInput) leftLegColorInput.value = avatar.leftLegColor || avatar.pants;
  if (rightLegColorInput) rightLegColorInput.value = avatar.rightLegColor || avatar.pants;
  if (beltColorInput) beltColorInput.value = avatar.beltColor || avatar.boots || "#23170f";
  if (capeColorInput) capeColorInput.value = avatar.capeColor || avatar.shirt || "#a82020";
  if (capeStyleInput) capeStyleInput.value = avatar.capeStyle || "normal";

  // Now, also load into studio inputs if they exist!
  if (studioAvatarNameInput) studioAvatarNameInput.value = avatar.name;
  if (studioSkinColorInput) studioSkinColorInput.value = avatar.skin;
  if (studioShirtColorInput) studioShirtColorInput.value = avatar.shirt;
  if (studioLeftArmColorInput) studioLeftArmColorInput.value = avatar.leftArmColor || avatar.shirt || avatar.skin;
  if (studioRightArmColorInput) studioRightArmColorInput.value = avatar.rightArmColor || avatar.shirt || avatar.skin;
  if (studioHairColorInput) studioHairColorInput.value = avatar.hair;
  if (studioEyeColorInput) studioEyeColorInput.value = avatar.eyes || "#101820";
  if (studioLeftLegColorInput) studioLeftLegColorInput.value = avatar.leftLegColor || avatar.pants;
  if (studioRightLegColorInput) studioRightLegColorInput.value = avatar.rightLegColor || avatar.pants;
  if (studioPantsColorInput) studioPantsColorInput.value = avatar.pants;
  if (studioBootColorInput) studioBootColorInput.value = avatar.boots || "#23170f";
  if (studioBeltColorInput) studioBeltColorInput.value = avatar.beltColor || avatar.boots || "#23170f";
  if (studioCapeColorInput) studioCapeColorInput.value = avatar.capeColor || avatar.shirt || "#a82020";
  if (studioHairStyleInput) studioHairStyleInput.value = avatar.hairStyle || "short";
  if (studioOutfitStyleInput) studioOutfitStyleInput.value = avatar.outfit || "sailor";
  if (studioCapeStyleInput) studioCapeStyleInput.value = avatar.capeStyle || "normal";
  if (studioHeightScaleInput) studioHeightScaleInput.value = avatar.height || 100;
  if (studioBuildScaleInput) studioBuildScaleInput.value = avatar.build || 100;
  loadStudioExtras(avatar);
  
  // Update slider readouts
  const heightValText = document.querySelector("#studio-val-height");
  const buildValText = document.querySelector("#studio-val-build");
  if (heightValText) heightValText.textContent = `${avatar.height || 100}%`;
  if (buildValText) buildValText.textContent = `${avatar.build || 100}%`;
}

function updateAvatarPreview(avatar) {
  const traits = getAvatarTraits(avatar);
  if (!avatarPreview || !previewName || !avatarTraits) return;
  previewName.textContent = avatar.name;
  const buildScale = clamp((avatar.build || 100) / 100, 0.8, 1.3);
  const heightScale = clamp((avatar.height || 100) / 100, 0.85, 1.25);
  avatarPreview.style.setProperty("--preview-build", buildScale);
  avatarPreview.style.setProperty("--preview-height", heightScale);
  avatarPreview.style.setProperty("--preview-torso-width", `${52 * buildScale}px`);
  avatarPreview.style.setProperty("--preview-arm-width", `${16 * buildScale}px`);
  avatarPreview.style.setProperty("--preview-leg-width", `${22 * buildScale}px`);
  avatarPreview.style.setProperty("--preview-body-height", `${62 * heightScale}px`);
  avatarPreview.style.setProperty("--preview-limb-height", `${58 * heightScale}px`);
  avatarPreview.style.setProperty("--preview-leg-height", `${54 * heightScale}px`);
  avatarPreview.style.removeProperty("transform");
  avatarPreview.querySelector(".preview-head").style.background = avatar.skin;
  avatarPreview.querySelector(".preview-neck").style.background = avatar.skin;
  avatarPreview.querySelectorAll(".preview-arm").forEach((part) => {
    part.style.background = `linear-gradient(to bottom, ${avatar.shirt} 65%, ${avatar.skin} 65%)`;
  });
  avatarPreview.querySelector(".preview-body").style.background = avatar.shirt;
  avatarPreview.querySelectorAll(".preview-leg").forEach((part) => {
    part.style.background = avatar.pants;
  });
  avatarPreview.querySelector(".preview-hair").style.background = avatar.hair;
  avatarPreview.querySelector(".preview-belt").style.background = avatar.boots;
  avatarPreview.querySelectorAll(".preview-eye").forEach((part) => {
    part.style.background = avatar.eyes;
  });
  avatarPreview.dataset.hair = avatar.hairStyle;
  avatarPreview.dataset.outfit = avatar.outfit;
  avatarTraits.textContent = formatAvatarTraits(traits);
}

function getAvatarTraits(avatar = getSelectedAvatar()) {
  const height = avatar.height || 100;
  const build = avatar.build || 100;
  const tallness = (height - 100) / 25;
  const bulk = (build - 100) / 30;
  const outfit = avatar.outfit || "sailor";

  const traits = {
    healthMultiplier: 1 - tallness * 0.12 + bulk * 0.18,
    rangeMultiplier: 1 + tallness * 0.24 - bulk * 0.06,
    speedMultiplier: 1 - bulk * 0.13 - Math.max(0, tallness) * 0.04,
    damageMultiplier: 1 + bulk * 0.08,
    incomingDamageMultiplier: 1,
    label: "Balanced bulk",
  };
  // Proportions: longer arms reach a little further, longer legs run a little faster.
  const armLength = clamp((avatar.armLength || 100) / 100, 0.75, 1.35);
  const legLength = clamp((avatar.legLength || 100) / 100, 0.75, 1.35);
  traits.rangeMultiplier *= 1 + (armLength - 1) * 0.25;
  traits.speedMultiplier *= 1 + (legLength - 1) * 0.15;

  if (outfit === "coat") {
    traits.rangeMultiplier += 0.06;
    traits.speedMultiplier -= 0.04;
  }
  if (outfit === "armor") {
    traits.healthMultiplier += 0.12;
    traits.incomingDamageMultiplier -= 0.1;
    traits.speedMultiplier -= 0.08;
  }
  if (outfit === "sailor") {
    traits.speedMultiplier += 0.06;
  }
  if (outfit === "adventurer") {
    traits.speedMultiplier += 0.04;
    traits.damageMultiplier += 0.04;
    traits.incomingDamageMultiplier -= 0.05;
  }

  traits.healthMultiplier = clamp(traits.healthMultiplier, 0.75, 1.35);
  traits.rangeMultiplier = clamp(traits.rangeMultiplier, 0.8, 1.35);
  traits.speedMultiplier = clamp(traits.speedMultiplier, 0.72, 1.25);
  traits.damageMultiplier = clamp(traits.damageMultiplier, 0.9, 1.18);
  traits.incomingDamageMultiplier = clamp(traits.incomingDamageMultiplier, 0.82, 1.15);
  traits.label = getAvatarTraitLabel(traits);
  return traits;
}

function getAvatarTraitLabel(traits) {
  const notes = [];
  if (traits.rangeMultiplier > 1.06) notes.push("longer range");
  if (traits.healthMultiplier < 0.95) notes.push("less health");
  if (traits.healthMultiplier > 1.06) notes.push("more health");
  if (traits.speedMultiplier > 1.04) notes.push("faster movement");
  if (traits.speedMultiplier < 0.95) notes.push("slower movement");
  if (traits.damageMultiplier > 1.04) notes.push("stronger hits");
  if (traits.incomingDamageMultiplier < 0.96) notes.push("takes less damage");
  return notes.length ? notes.join(", ") : "balanced bulk";
}

function formatAvatarTraits(traits) {
  return `Traits: ${traits.label}. Health ${formatMultiplier(traits.healthMultiplier)}, range ${formatMultiplier(traits.rangeMultiplier)}, speed ${formatMultiplier(traits.speedMultiplier)}.`;
}

function formatMultiplier(value) {
  const percent = Math.round((value - 1) * 100);
  if (percent === 0) return "normal";
  return `${percent > 0 ? "+" : ""}${percent}%`;
}

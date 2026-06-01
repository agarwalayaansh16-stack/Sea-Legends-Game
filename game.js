const canvas = document.querySelector("#game");
const factionScreen = document.querySelector("#faction-screen");
const hud = document.querySelector("#hud");
const promptBox = document.querySelector("#prompt");
const messageLog = document.querySelector("#message-log");
const boatMenu = document.querySelector("#boat-menu");
const boatButtons = document.querySelectorAll(".boat-option");
const boatMenuClose = document.querySelector("#boat-menu-close");
const homeTeleportButton = document.querySelector("#home-teleport-button");
const teleportStatus = document.querySelector("#teleport-status");
const shiftlockToggle = document.querySelector("#shiftlock-toggle");
const walkToggle = document.querySelector("#walk-toggle");
const sprintToggle = document.querySelector("#sprint-toggle");
const hakiToggle = document.querySelector("#haki-toggle");
const settingsBar = document.querySelector("#settings-bar");
const settingsCollapseButton = document.querySelector("#settings-collapse-button");
const inventoryButton = document.querySelector("#inventory-button");
const inventoryPanel = document.querySelector("#inventory-panel");
const inventoryTabs = document.querySelector("#inventory-tabs");
const inventoryList = document.querySelector("#inventory-list");
const inventoryCloseButton = document.querySelector("#inventory-close");
const dialoguePanel = document.querySelector("#dialogue-panel");
const dialogueTitle = document.querySelector("#dialogue-title");
const dialogueDetail = document.querySelector("#dialogue-detail");
const questOptions = document.querySelector("#quest-options");
const dialogueClose = document.querySelector("#dialogue-close");
const bossBar = document.querySelector("#boss-bar");
const bossName = document.querySelector("#boss-name");
const bossHealthBar = document.querySelector("#boss-health-bar");
const avatarList = document.querySelector("#avatar-list");
const avatarNameInput = document.querySelector("#avatar-name");
const skinColorInput = document.querySelector("#skin-color");
const shirtColorInput = document.querySelector("#shirt-color");
const pantsColorInput = document.querySelector("#pants-color");
const hairColorInput = document.querySelector("#hair-color");
const eyeColorInput = document.querySelector("#eye-color");
const bootColorInput = document.querySelector("#boot-color");
const hairStyleInput = document.querySelector("#hair-style");
const outfitStyleInput = document.querySelector("#outfit-style");
const heightScaleInput = document.querySelector("#height-scale");
const buildScaleInput = document.querySelector("#build-scale");
const createAvatarButton = document.querySelector("#create-avatar");
const saveAvatarButton = document.querySelector("#save-avatar");
const deleteAvatarButton = document.querySelector("#delete-avatar");
const previewAvatarButton = document.querySelector("#preview-avatar");
const previewName = document.querySelector("#preview-name");
const avatarPreview = document.querySelector("#avatar-preview");
const avatarTraits = document.querySelector("#avatar-traits");

const ui = {
  playerTitle: document.querySelector("#player-title"),
  level: document.querySelector("#level-readout"),
  healthText: document.querySelector("#health-readout"),
  healthBar: document.querySelector("#health-bar"),
  xpText: document.querySelector("#xp-readout"),
  xpBar: document.querySelector("#xp-bar"),
  staminaText: document.querySelector("#stamina-readout"),
  staminaBar: document.querySelector("#stamina-bar"),
  money: document.querySelector("#money-readout"),
  sea: document.querySelector("#sea-readout"),
  questTitle: document.querySelector("#quest-title"),
  questDetail: document.querySelector("#quest-detail"),
  points: document.querySelector("#points-readout"),
  statsList: document.querySelector("#stats-list"),
};

const statLabels = {
  melee: "Melee",
  defense: "Defense",
  sword: "Sword",
  gun: "Gun",
  special: "Special Abilities",
};

const STARTER_RADIUS = 680;
const STARTER_HEIGHT = 38;
const STARTER_SURFACE_Y = STARTER_HEIGHT + 0.35;
const OCEAN_SURFACE_Y = -0.08;
const JUNGLE_ISLAND_INDEX = 1;
const OUTPOST_ISLAND_INDEX = 2;
const DESERT_ISLAND_INDEX = 3;

const avatarState = {
  selectedId: "wave-runner",
  avatars: [
    {
      id: "wave-runner",
      name: "Wave Runner",
      skin: "#c98b62",
      shirt: "#1b85aa",
      pants: "#26364f",
      hair: "#2a1710",
      eyes: "#101820",
      boots: "#23170f",
      hairStyle: "short",
      outfit: "sailor",
      height: 100,
      build: 100,
    },
    {
      id: "reef-guard",
      name: "Reef Guard",
      skin: "#8f5d3d",
      shirt: "#2f8f54",
      pants: "#3f3228",
      hair: "#101010",
      eyes: "#172b3a",
      boots: "#1a110b",
      hairStyle: "spiky",
      outfit: "armor",
      height: 106,
      build: 112,
    },
    {
      id: "sun-captain",
      name: "Sun Captain",
      skin: "#e3ad7a",
      shirt: "#d66b36",
      pants: "#10212d",
      hair: "#73421f",
      eyes: "#1b3c66",
      boots: "#2a1810",
      hairStyle: "cap",
      outfit: "coat",
      height: 98,
      build: 94,
    },
  ],
};

const player = {
  faction: "Neutral",
  level: 1,
  xp: 0,
  xpToNext: 100,
  money: 0,
  materials: {
    ironwood: 0,
    scrap: 0,
    jungleCore: 0,
  },
  statPoints: 0,
  health: 120,
  maxHealth: 120,
  stamina: 100,
  maxStamina: 100,
  oxygen: 100,
  movementMode: "walk",
  isSwimming: false,
  isBlocking: false,
  isDashing: false,
  dashCooldown: 0,
  lastMoveSpeed: 0,
  lastFallVelocity: 0,
  haki: {
    unlocked: false,
    active: false,
    level: 0,
    kills: 0,
    nextKills: 8,
  },
  stats: {
    melee: 1,
    defense: 1,
    sword: 1,
    gun: 1,
    special: 0,
  },
  weapon: "melee",
  hasSword: false,
  hasGun: false,
  specialUnlocked: false,
};

const inventoryState = {
  open: false,
  tab: "melee",
};

const inventoryItems = {
  melee: [
    {
      id: "basic-combat",
      name: "Basic Combat",
      weapon: "melee",
      description: "Default hand-to-hand fighting style.",
      unlocked: () => true,
      requirement: "Always available",
    },
  ],
  swords: [
    {
      id: "starter-blade",
      name: "Starter Blade",
      weapon: "sword",
      description: "A simple steel sword from the village dealer.",
      unlocked: () => player.hasSword,
      requirement: "$120 and 3 ironwood",
      cost: { money: 120, ironwood: 3 },
      buy: () => {
        player.money -= 120;
        player.materials.ironwood -= 3;
        player.hasSword = true;
      },
    },
  ],
  guns: [
    {
      id: "flintlock",
      name: "Flintlock",
      weapon: "gun",
      description: "A short-range sea pistol built from scavenged scrap.",
      unlocked: () => player.hasGun,
      requirement: "$220 and 5 scrap",
      cost: { money: 220, scrap: 5 },
      buy: () => {
        player.money -= 220;
        player.materials.scrap -= 5;
        player.hasGun = true;
      },
    },
  ],
  special: [
    {
      id: "jungle-pulse",
      name: "Jungle Pulse",
      weapon: "special",
      description: "Unlocked through the starter questline and powered by jungle cores.",
      unlocked: () => player.specialUnlocked,
      requirement: "Complete the starter quest and find 1 jungle core",
    },
  ],
};

const quest = {
  active: false,
  complete: false,
  target: 5,
  defeated: 0,
  rewardMoney: 180,
  rewardXp: 120,
};

const questCatalog = {
  starter: {
    id: "starter",
    title: "Bandit Trouble",
    detail: "Defeat 5 starter bandits.",
    targetType: "bandit",
    target: 5,
    defeated: 0,
    minLevel: 1,
    rewardMoney: 180,
    rewardXp: 120,
  },
  pirates30: {
    id: "pirates30",
    title: "Pirate Ambush",
    detail: "Defeat 6 katana pirates at the outpost.",
    targetType: "pirate",
    target: 6,
    defeated: 0,
    minLevel: 30,
    rewardMoney: 620,
    rewardXp: 1900,
  },
  brutes40: {
    id: "brutes40",
    title: "Iron Mace Brutes",
    detail: "Defeat 4 brute enforcers.",
    targetType: "brute",
    target: 4,
    defeated: 0,
    minLevel: 40,
    rewardMoney: 940,
    rewardXp: 3300,
  },
};

let activeQuest = null;

const keys = new Set();
const enemies = [];
const hazards = [];
const projectiles = [];
const interactables = [];
const islands = [];
const combatEffects = [];
const collisionVolumes = [];
const animatedWorldObjects = [];
let nearbyInteractable = null;
let playerMesh;
let cameraYaw = 0.68;
let cameraPitch = 0.38;
let shiftLockEnabled = true;
let homeTeleportCountdown = 0;
let questGiverPosition = new THREE.Vector3();
let activeBoat = null;
let isPointerDown = false;
let lastPointerX = 0;
let lastPointerY = 0;
let attackCooldown = 0;
let wallHitCooldown = 0;
let cameraShake = 0;
let hitStopTimer = 0;
let currentIslandIndex = 0;
let hasReachedJungle = false;
let verticalVelocity = 0;
let jumpOffset = 0;
let isGrounded = true;
let gameStarted = false;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8bd8ff);
scene.fog = new THREE.Fog(0x8bd8ff, 1200, 70000);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 80000);

const sun = new THREE.DirectionalLight(0xfff1c7, 2.2);
sun.position.set(80, 130, 40);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);
scene.add(new THREE.HemisphereLight(0xbbeeff, 0x38624b, 1.5));

const ocean = new THREE.Mesh(
  new THREE.CircleGeometry(50000, 260),
  new THREE.MeshStandardMaterial({
    color: 0x0a83a3,
    roughness: 0.42,
    metalness: 0.05,
  }),
);
ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -0.08;
scene.add(ocean);

const ring = new THREE.Mesh(
  new THREE.RingGeometry(30, 50000, 260),
  new THREE.MeshBasicMaterial({ color: 0x0d5770, side: THREE.DoubleSide, transparent: true, opacity: 0.16 }),
);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.01;
scene.add(ring);

createStatButtons();
renderInventory();
renderAvatarChoices();
createWorld();
createPlayer();
applyAvatarToPlayer();
updateDerivedStats();
updateHud();
resize();
requestAnimationFrame(loop);

document.querySelectorAll("[data-faction]").forEach((button) => {
  button.addEventListener("click", () => startGame(button.dataset.faction));
});

createAvatarButton.addEventListener("click", createCustomAvatar);
saveAvatarButton.addEventListener("click", saveSelectedAvatar);
deleteAvatarButton.addEventListener("click", deleteSelectedAvatar);
previewAvatarButton.addEventListener("click", previewAvatarFromForm);

settingsCollapseButton?.addEventListener("click", () => {
  const collapsed = settingsBar?.classList.toggle("collapsed");
  hud?.classList.toggle("settings-collapsed", Boolean(collapsed));
  settingsCollapseButton.setAttribute("aria-expanded", String(!collapsed));
});

inventoryButton?.addEventListener("click", () => {
  inventoryState.open = !inventoryState.open;
  renderInventory();
});

inventoryCloseButton?.addEventListener("click", () => {
  inventoryState.open = false;
  renderInventory();
});

inventoryTabs?.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-inventory-tab]")?.dataset.inventoryTab;
  if (!tab) return;
  inventoryState.tab = tab;
  renderInventory();
});

boatButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleBoatSelection(button.dataset.boat);
  });
});

boatMenuClose?.addEventListener("click", hideBoatMenu);

boatButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleBoatSelection(button.dataset.boat);
  });
});

boatMenuClose?.addEventListener("click", hideBoatMenu);

[
  avatarNameInput,
  skinColorInput,
  shirtColorInput,
  pantsColorInput,
  hairColorInput,
  eyeColorInput,
  bootColorInput,
  hairStyleInput,
  outfitStyleInput,
  heightScaleInput,
  buildScaleInput,
].forEach((input) => {
  input.addEventListener("input", previewAvatarFromForm);
  input.addEventListener("change", previewAvatarFromForm);
});

const movementCodeMap = {
  w: "KeyW",
  a: "KeyA",
  s: "KeyS",
  d: "KeyD",
  arrowup: "KeyW",
  arrowleft: "KeyA",
  arrowdown: "KeyS",
  arrowright: "KeyD",
  z: "KeyW",
  q: "KeyA",
};
const allowedMovementCodes = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"]);

window.addEventListener("keydown", (event) => {
  const code = event.code;
  const key = event.key.toLowerCase();
  const mappedCode = movementCodeMap[key] || code;
  if (allowedMovementCodes.has(code) || movementCodeMap[key]) {
    keys.add(mappedCode);
    event.preventDefault();
  }

  if (code === "Space") {
    event.preventDefault();
    jump();
  }
  if (code === "ShiftLeft" || code === "ShiftRight") {
    setMovementMode("sprint");
  }
  if (code === "KeyF") {
    player.isBlocking = true;
  }
  if (code === "KeyQ") {
    dash();
  }
  if (code === "KeyH") {
    toggleHaki();
  }
  if (code === "KeyE") {
    interact();
  }
  if (code === "Digit1") setWeapon("melee");
  if (code === "Digit2") setWeapon("sword");
  if (code === "Digit3") setWeapon("gun");
  if (code === "Digit4" && player.specialUnlocked) setWeapon("special");
  updateHud();
});

window.addEventListener("keyup", (event) => {
  const code = event.code;
  const key = event.key.toLowerCase();
  const mappedCode = movementCodeMap[key] || code;
  if (allowedMovementCodes.has(code) || movementCodeMap[key]) {
    keys.delete(mappedCode);
  }
  if (code === "ShiftLeft" || code === "ShiftRight") {
    setMovementMode("walk");
  }
  if (code === "KeyF") {
    player.isBlocking = false;
  }
});
window.addEventListener("resize", resize);

canvas.addEventListener("pointerdown", (event) => {
  if (event.button === 0 && gameStarted) {
    attack();
    return;
  }
  if (event.button !== 2) return;
  isPointerDown = true;
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
});

canvas.addEventListener("contextmenu", (event) => event.preventDefault());

window.addEventListener("pointerup", () => {
  isPointerDown = false;
});

window.addEventListener("pointermove", (event) => {
  if (!isPointerDown) return;
  cameraYaw -= (event.clientX - lastPointerX) * 0.006;
  cameraPitch = clamp(cameraPitch - (event.clientY - lastPointerY) * 0.004, -0.52, 0.95);
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
});

homeTeleportButton?.addEventListener("click", () => {
  if (!gameStarted || homeTeleportCountdown > 0) return;
  homeTeleportCountdown = 5;
  teleportStatus.textContent = "Teleporting in 5s...";
  homeTeleportButton.disabled = true;
});

shiftlockToggle?.addEventListener("change", () => {
  shiftLockEnabled = shiftlockToggle.checked;
  shiftlockToggle.nextElementSibling.textContent = shiftLockEnabled ? "Shiftlock enabled" : "Shiftlock disabled";
});

walkToggle?.addEventListener("click", () => setMovementMode("walk"));
sprintToggle?.addEventListener("click", () => setMovementMode("sprint"));
hakiToggle?.addEventListener("click", toggleHaki);
dialogueClose?.addEventListener("click", hideQuestDialogue);

function startGame(faction) {
  player.faction = faction;
  if (faction === "Marines") {
    player.stats.defense += 1;
  }
  saveSelectedAvatar();
  factionScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  gameStarted = true;
  setWeapon(player.weapon);
  log(`You joined as ${faction}. Welcome to the First Sea.`);
  updateDerivedStats();
  updateHud();
}

function setMovementMode(mode) {
  player.movementMode = mode;
  walkToggle?.classList.toggle("active", mode === "walk");
  sprintToggle?.classList.toggle("active", mode === "sprint");
  log(mode === "sprint" ? "Sprint mode enabled. High speed increases impact risk." : "Walk mode enabled. Better control, lower impact risk.");
}

function toggleHaki() {
  if (!player.haki.unlocked) {
    log("Armament Haki is locked. Reach level 60, visit Desert Island, and train with the Haki Trainer.");
    return;
  }
  player.haki.active = !player.haki.active;
  hakiToggle?.classList.toggle("active", player.haki.active);
  applyHakiVisuals();
  log(player.haki.active ? `Armament Haki level ${player.haki.level} activated.` : "Armament Haki released.");
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
}

function renderInventory() {
  if (!inventoryPanel || !inventoryTabs || !inventoryList) return;
  inventoryPanel.classList.toggle("hidden", !inventoryState.open);
  inventoryButton?.classList.toggle("active", inventoryState.open);

  inventoryTabs.querySelectorAll("[data-inventory-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.inventoryTab === inventoryState.tab);
  });

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

function renderAvatarChoices() {
  if (!avatarList) return;
  avatarList.innerHTML = "";
  avatarState.avatars.forEach((avatar) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `avatar-option${avatar.id === avatarState.selectedId ? " selected" : ""}`;
    button.textContent = avatar.name;
    button.style.boxShadow = `inset 0 -5px 0 ${avatar.shirt}`;
    button.addEventListener("click", () => {
      avatarState.selectedId = avatar.id;
      applyAvatarToPlayer();
      renderAvatarChoices();
    });
    avatarList.append(button);
  });
  loadAvatarIntoEditor(getSelectedAvatar());
  if (playerMesh) applyAvatarToPlayer();
  updateAvatarPreview(getSelectedAvatar());
  if (deleteAvatarButton) deleteAvatarButton.disabled = avatarState.avatars.length <= 1;
}

function createCustomAvatar() {
  const avatar = { ...getAvatarFromEditor(), id: `custom-${Date.now()}` };
  avatarState.avatars.push(avatar);
  avatarState.selectedId = avatar.id;
  renderAvatarChoices();
  log(`Created avatar: ${avatar.name}.`);
}

function saveSelectedAvatar() {
  const selected = getSelectedAvatar();
  Object.assign(selected, getAvatarFromEditor(), { id: selected.id });
  updateDerivedStats(selected);
  renderAvatarChoices();
  updateHud();
  log(`Saved avatar: ${selected.name}.`);
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

function previewAvatarFromForm() {
  const avatar = getAvatarFromEditor();
  updateAvatarPreview(avatar);
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
  };
}

function loadAvatarIntoEditor(avatar) {
  avatarNameInput.value = avatar.name;
  skinColorInput.value = avatar.skin;
  shirtColorInput.value = avatar.shirt;
  pantsColorInput.value = avatar.pants;
  hairColorInput.value = avatar.hair;
  eyeColorInput.value = avatar.eyes || "#101820";
  bootColorInput.value = avatar.boots || "#23170f";
  hairStyleInput.value = avatar.hairStyle || "short";
  outfitStyleInput.value = avatar.outfit || "sailor";
  heightScaleInput.value = avatar.height || 100;
  buildScaleInput.value = avatar.build || 100;
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
    part.style.background = avatar.skin;
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getSelectedAvatar() {
  return avatarState.avatars.find((avatar) => avatar.id === avatarState.selectedId) || avatarState.avatars[0];
}

function applyAvatarToPlayer() {
  applyTemporaryAvatarToPlayer(getSelectedAvatar());
}

function applyTemporaryAvatarToPlayer(avatar) {
  if (!playerMesh) return;
  while (playerMesh.children.length > 0) {
    playerMesh.remove(playerMesh.children[0]);
  }
  playerMesh.add(createHumanAvatarModel(avatar, { showSword: false }));
  applyHakiVisuals();
}

function createWorld() {
  for (let i = 0; i < 10; i += 1) {
    const angle = i * 0.62;
    const distance = i === 0 ? 0 : i === 1 ? 2750 : 5200 + i * 950;
    const radius = i === 0 ? STARTER_RADIUS : i === 1 ? 1450 : i === 2 ? 920 : i === 3 ? 1120 : 90 + i * 36;
    const position = i === 1
      ? new THREE.Vector3(2280, 0, -1420)
      : i === 2
        ? new THREE.Vector3(-2350, 0, -1850)
        : i === 3
          ? new THREE.Vector3(-4550, 0, 980)
          : new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);
    const island = createIsland(position, radius, i);
    islands.push({ index: i, position, radius, mesh: island, surfaceY: getIslandSurfaceY(i) });
  }

  createQuestGiver(new THREE.Vector3(52, STARTER_SURFACE_Y, 16));
  createBoatDealer(new THREE.Vector3(-460, STARTER_SURFACE_Y, 60));
  createSwordDealer(new THREE.Vector3(48, STARTER_SURFACE_Y, 104));
  createCrossingDock();
  createTeleporter(new THREE.Vector3(438, STARTER_SURFACE_Y, -310), new THREE.Vector3(islands[1].position.x - 620, islands[1].surfaceY + 0.15, islands[1].position.z + 430));
  createTeleporter(new THREE.Vector3(-380, STARTER_SURFACE_Y, -360), new THREE.Vector3(islands[2].position.x + 160, islands[2].surfaceY + 0.15, islands[2].position.z + 120));
  createBanditCamp();
  createOutpostQuestGiver(islands[2].position.clone().add(new THREE.Vector3(-80, islands[2].surfaceY, 40)));
  createHakiTrainer(islands[3].position.clone().add(new THREE.Vector3(70, islands[3].surfaceY, -60)));
  spawnPirateCamp(islands[2]);
  spawnBruteCamp(islands[2]);
  spawnBuggyBoss(islands[2].position.clone().add(new THREE.Vector3(260, islands[2].surfaceY, -220)));
}

function createIsland(position, radius, index) {
  const group = new THREE.Group();
  group.position.copy(position);
  const height = getIslandHeight(index);

  const baseGeometry = makeIrregularCylinderGeometry(radius, height, index <= 1 ? 128 : 40, index + 3);
  const base = new THREE.Mesh(
    baseGeometry,
    new THREE.MeshStandardMaterial({
      color: index === 0 ? 0x78654b : index === 1 ? 0x394235 : 0x8f8066,
      roughness: 0.86,
      metalness: 0.08,
      emissive: index === 0 ? 0x332711 : 0x1f1a16,
      emissiveIntensity: 0.06,
      flatShading: true,
    }),
  );
  base.position.y = height / 2;
  base.receiveShadow = true;
  base.castShadow = true;
  group.add(base);

  const grass = new THREE.Mesh(
    makeIrregularDiscGeometry(radius * 0.88, index <= 1 ? 128 : 40, index + 9),
    new THREE.MeshStandardMaterial({ color: index === 0 ? 0x3fb05b : index === 1 ? 0x1f6f3a : 0x4aa65e, roughness: 0.78, metalness: 0.05 }),
  );
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = height + 0.16;
  grass.receiveShadow = true;
  grass.castShadow = true;
  group.add(grass);

  if (index === 0) {
    addStarterIslandDetails(group, radius, height);
  }
  if (index === 1) {
    addJungleIslandDetails(group, radius, height);
  }
  if (index === 2) {
    addOutpostIslandDetails(group, radius, height);
  }
  if (index === 3) {
    addDesertIslandDetails(group, radius, height);
  }
  if (index !== 1) {
    addIslandRocks(group, radius, height);
  }

  if (index !== 1) {
    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(index === 0 ? 2.5 : 0.4, index === 0 ? 2.5 : 0.4, index === 0 ? 48 : 9 + index * 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffd25a, emissive: 0x3a2300 }),
    );
    marker.position.set(0, height + (index === 0 ? 26 : 8 + index * 0.45), 0);
    group.add(marker);

    const label = makeLabel(`Island ${index + 1}`, 2 + index * 0.2);
    label.position.set(0, height + (index === 0 ? 55 : 10 + index * 0.55), 0);
    group.add(label);
  }

  if (index > 0 && index !== 1) {
    for (let t = 0; t < Math.min(8, index + 2); t += 1) {
      const tree = createTree();
      const a = Math.random() * Math.PI * 2;
      const d = radius * (0.2 + Math.random() * 0.45);
      tree.position.set(Math.cos(a) * d, 3.2 + index * 0.1, Math.sin(a) * d);
      group.add(tree);
    }
  }

  if (index !== 1) {
    const shine = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.44, radius * 0.47, 0.4, 80),
      new THREE.MeshStandardMaterial({ color: 0x8de9b5, roughness: 0.92, transparent: true, opacity: 0.18 }),
    );
    shine.rotation.x = -Math.PI / 2;
    shine.position.y = height + 0.33;
    group.add(shine);
  }

  scene.add(group);
  return group;
}

function getIslandHeight(index) {
  if (index === 0) return STARTER_HEIGHT;
  if (index === 1) return 62;
  if (index === 2) return 48;
  if (index === 3) return 54;
  return 3 + index * 0.2;
}

function getIslandSurfaceY(index) {
  if (index === 0) return STARTER_SURFACE_Y;
  return getIslandHeight(index) + 0.16;
}

function addCollisionCircle(center, radius, label, options = {}) {
  collisionVolumes.push({
    center: center.clone(),
    radius,
    label,
    damage: options.damage ?? 10,
    material: options.material || "stone",
    toughness: options.toughness ?? 1,
  });
}

function createTree() {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.55, 3, 8),
    new THREE.MeshStandardMaterial({ color: 0x8c5a32 }),
  );
  trunk.position.y = 1.5;
  trunk.castShadow = true;
  group.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(2, 4, 9),
    new THREE.MeshStandardMaterial({ color: 0x2f8f54 }),
  );
  leaves.position.y = 4;
  leaves.castShadow = true;
  group.add(leaves);
  return group;
}

function addJungleIslandDetails(group, radius, height) {
  addJungleLakeAndPaths(group, radius, height);
  addJungleSatelliteIsland(group, radius, height);

  const treehouseTree = createJungleTree(230, 20);
  treehouseTree.position.set(-radius * 0.12, height + 0.1, radius * 0.08);
  group.add(treehouseTree);

  const treehouse = createTreehouse();
  treehouse.position.set(-radius * 0.12, height + 145, radius * 0.08);
  treehouse.rotation.y = 0.45;
  group.add(treehouse);

  for (let i = 0; i < 180; i += 1) {
    const angle = i * 2.399;
    const distance = radius * (0.08 + ((i * 37) % 76) / 100);
    const tree = createJungleTree(120 + (i % 7) * 18, 10 + (i % 5) * 2.2);
    tree.position.set(Math.cos(angle) * distance, height + 0.1, Math.sin(angle) * distance);
    tree.rotation.y = angle;
    group.add(tree);
  }

  for (let i = 0; i < 260; i += 1) {
    const angle = i * 1.618;
    const distance = radius * (0.06 + ((i * 53) % 80) / 100);
    const bush = createBigJungleBush(26 + (i % 6) * 7);
    bush.position.set(Math.cos(angle) * distance, height + 1.2, Math.sin(angle) * distance);
    bush.rotation.y = angle;
    group.add(bush);
  }
}

function addJungleLakeAndPaths(group, radius, height) {
  const lakeMaterial = new THREE.MeshStandardMaterial({
    color: 0x116fc1,
    emissive: 0x07335c,
    emissiveIntensity: 0.12,
    roughness: 0.22,
    metalness: 0.03,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });
  const dirt = new THREE.MeshStandardMaterial({ color: 0x9a8464, roughness: 0.96 });

  const lake = new THREE.Mesh(makeIrregularDiscGeometry(radius * 0.24, 96, 88), lakeMaterial);
  lake.rotation.x = -Math.PI / 2;
  lake.scale.set(0.75, 1.32, 1);
  lake.position.set(radius * 0.18, height + 0.5, -radius * 0.08);
  group.add(lake);
  animatedWorldObjects.push({ mesh: lake, type: "tide", baseY: lake.position.y, speed: 0.0022, phase: 3.4 });

  const pathSpecs = [
    [-radius * 0.36, radius * 0.1, radius * 0.7, 46, 1.08],
    [radius * 0.04, -radius * 0.28, radius * 0.6, 38, -0.34],
    [radius * 0.17, radius * 0.16, radius * 0.5, 34, 0.76],
  ];

  pathSpecs.forEach(([x, z, length, width, rotation]) => {
    const path = new THREE.Mesh(new THREE.BoxGeometry(width, 0.55, length), dirt);
    path.position.set(x, height + 0.62, z);
    path.rotation.y = rotation;
    path.receiveShadow = true;
    group.add(path);
  });

  const bridge = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x67452c, roughness: 0.88 });
  for (let i = -5; i <= 5; i += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(34, 2.2, 10), wood);
    plank.position.set(i * 13, height + 2.2, 0);
    plank.rotation.y = (i % 2) * 0.04;
    plank.castShadow = true;
    bridge.add(plank);
  }
  bridge.position.set(radius * 0.18, 0, -radius * 0.08);
  bridge.rotation.y = -0.58;
  group.add(bridge);
}

function addJungleSatelliteIsland(group, radius, height) {
  const offset = new THREE.Vector3(-radius * 0.82, 0, radius * 0.76);
  const smallRadius = radius * 0.43;
  const smallHeight = height * 0.72;
  const base = new THREE.Mesh(
    makeIrregularCylinderGeometry(smallRadius, smallHeight, 96, 122),
    new THREE.MeshStandardMaterial({ color: 0x3a3933, roughness: 0.9, flatShading: true }),
  );
  base.position.set(offset.x, smallHeight / 2 - 1, offset.z);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const grass = new THREE.Mesh(
    makeIrregularDiscGeometry(smallRadius * 0.88, 96, 128),
    new THREE.MeshStandardMaterial({ color: 0x246f38, roughness: 0.84 }),
  );
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(offset.x, smallHeight - 0.8, offset.z);
  grass.receiveShadow = true;
  group.add(grass);

  const channel = new THREE.Mesh(
    new THREE.BoxGeometry(34, 0.8, radius * 0.52),
    new THREE.MeshStandardMaterial({ color: 0x08a3d8, roughness: 0.28, transparent: true, opacity: 0.86 }),
  );
  channel.position.set(offset.x + smallRadius * 0.18, smallHeight + 0.2, offset.z);
  channel.rotation.y = -0.08;
  group.add(channel);

  const ropeBridge = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x5b3c25, roughness: 0.9 });
  for (let i = 0; i < 18; i += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(30, 2.3, 9), wood);
    plank.position.z = i * 18;
    plank.rotation.y = Math.sin(i) * 0.05;
    plank.castShadow = true;
    ropeBridge.add(plank);
  }
  ropeBridge.position.set(offset.x + smallRadius * 0.36, smallHeight + 1.6, offset.z - smallRadius * 0.42);
  ropeBridge.rotation.y = -0.5;
  group.add(ropeBridge);

  for (let i = 0; i < 46; i += 1) {
    const angle = i * 2.09;
    const distance = smallRadius * (0.16 + ((i * 31) % 62) / 100);
    const tree = createJungleTree(58 + (i % 5) * 9, 5 + (i % 4));
    tree.position.set(offset.x + Math.cos(angle) * distance, smallHeight, offset.z + Math.sin(angle) * distance);
    tree.rotation.y = angle;
    group.add(tree);
  }
}

function createCrossingDock() {
  const jungle = islands[JUNGLE_ISLAND_INDEX];
  if (!jungle) return;

  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x6c4a31, roughness: 0.88 });
  const start = new THREE.Vector3(470, OCEAN_SURFACE_Y + 1.6, -320);
  const end = new THREE.Vector3(jungle.position.x - 950, OCEAN_SURFACE_Y + 1.8, jungle.position.z + 610);
  const direction = end.clone().sub(start);
  const length = direction.length();
  const midpoint = start.clone().lerp(end, 0.5);

  const pier = new THREE.Mesh(new THREE.BoxGeometry(34, 2.4, length), wood);
  pier.position.copy(midpoint);
  pier.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());
  pier.castShadow = true;
  pier.receiveShadow = true;
  group.add(pier);

  for (let i = 0; i < 42; i += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(43, 1.4, 8), wood);
    plank.position.copy(start).lerp(end, i / 41);
    plank.position.y = OCEAN_SURFACE_Y + 3.2;
    plank.quaternion.copy(pier.quaternion);
    plank.rotation.z += (i % 2 ? 0.015 : -0.015);
    plank.castShadow = true;
    group.add(plank);
  }

  scene.add(group);
}

function createJungleTree(height, trunkRadius) {
  const group = new THREE.Group();
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5d3b24, roughness: 0.94 });
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x145c32, roughness: 0.86, flatShading: true });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(trunkRadius * 0.72, trunkRadius, height, 10), trunkMaterial);
  trunk.position.y = height / 2;
  trunk.castShadow = true;
  group.add(trunk);

  for (let i = 0; i < 5; i += 1) {
    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(trunkRadius * (4.6 - i * 0.34), 14, 10),
      leafMaterial,
    );
    crown.position.set(
      Math.sin(i * 1.7) * trunkRadius * 1.4,
      height - i * trunkRadius * 1.6,
      Math.cos(i * 1.2) * trunkRadius * 1.4,
    );
    crown.scale.y = 0.68;
    crown.castShadow = true;
    group.add(crown);
  }

  return group;
}

function createBigJungleBush(size) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x1f7d3e, roughness: 0.9, flatShading: true });

  for (let i = 0; i < 4; i += 1) {
    const bush = new THREE.Mesh(new THREE.SphereGeometry(size * (0.75 + i * 0.08), 12, 8), material);
    bush.position.set(Math.sin(i * 1.8) * size * 0.45, size * 0.42, Math.cos(i * 1.4) * size * 0.45);
    bush.scale.y = 0.48 + i * 0.05;
    bush.castShadow = true;
    bush.receiveShadow = true;
    group.add(bush);
  }

  return group;
}

function createTreehouse() {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a5432, roughness: 0.9 });
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x3d5f2d, roughness: 0.86 });

  const platform = new THREE.Mesh(new THREE.BoxGeometry(115, 10, 95), wood);
  platform.castShadow = true;
  platform.receiveShadow = true;
  group.add(platform);

  const hut = new THREE.Mesh(new THREE.BoxGeometry(72, 48, 58), wood);
  hut.position.y = 29;
  hut.castShadow = true;
  hut.receiveShadow = true;
  group.add(hut);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(58, 45, 4), roofMaterial);
  roof.position.y = 76;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);

  return group;
}

function addOutpostIslandDetails(group, radius, height) {
  addBeachRing(group, radius, height);
  const dirt = new THREE.MeshStandardMaterial({ color: 0x8b7358, roughness: 0.96 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x5c5a54, roughness: 0.96, flatShading: true });
  const wood = new THREE.MeshStandardMaterial({ color: 0x68432c, roughness: 0.9 });

  [[0, 0, 520, 34, 0.6], [-160, 120, 380, 28, -0.35], [180, -160, 340, 28, 1.2]].forEach(([x, z, l, w, r]) => {
    const path = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, l), dirt);
    path.position.set(x, height + 0.6, z);
    path.rotation.y = r;
    group.add(path);
  });

  for (let i = 0; i < 18; i += 1) {
    const ruin = new THREE.Mesh(new THREE.BoxGeometry(26 + (i % 4) * 8, 24 + (i % 3) * 12, 18), stone);
    const angle = i * 1.17;
    const dist = radius * (0.18 + ((i * 41) % 54) / 100);
    ruin.position.set(Math.cos(angle) * dist, height + ruin.geometry.parameters.height / 2, Math.sin(angle) * dist);
    ruin.rotation.y = angle;
    ruin.castShadow = true;
    ruin.receiveShadow = true;
    group.add(ruin);
  }

  for (let i = 0; i < 9; i += 1) {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(10, 14, 58, 6), stone);
    const angle = i * 0.7;
    const dist = radius * 0.58;
    tower.position.set(Math.cos(angle) * dist, height + 29, Math.sin(angle) * dist);
    tower.castShadow = true;
    group.add(tower);
  }

  const dock = new THREE.Mesh(new THREE.BoxGeometry(42, 2.5, 210), wood);
  dock.position.set(-radius * 0.54, height + 1.2, radius * 0.62);
  dock.rotation.y = -0.58;
  dock.castShadow = true;
  group.add(dock);
}

function addDesertIslandDetails(group, radius, height) {
  const sand = new THREE.Mesh(
    makeIrregularDiscGeometry(radius * 0.82, 96, 177),
    new THREE.MeshStandardMaterial({ color: 0xd6aa64, roughness: 0.96 }),
  );
  sand.rotation.x = -Math.PI / 2;
  sand.position.y = height + 0.44;
  group.add(sand);

  for (let i = 0; i < 28; i += 1) {
    const obelisk = new THREE.Mesh(
      new THREE.ConeGeometry(8 + (i % 4) * 2, 48 + (i % 5) * 8, 4),
      new THREE.MeshStandardMaterial({ color: 0x9d7647, roughness: 0.92, flatShading: true }),
    );
    const angle = i * 1.41;
    const dist = radius * (0.16 + ((i * 29) % 62) / 100);
    obelisk.position.set(Math.cos(angle) * dist, height + 24, Math.sin(angle) * dist);
    obelisk.rotation.y = angle;
    obelisk.castShadow = true;
    group.add(obelisk);
  }
}

function createPalmTree(height) {
  const group = new THREE.Group();
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8a5a37, roughness: 0.9 });
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x2f9b55, roughness: 0.86, side: THREE.DoubleSide });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.6, height, 9), trunkMaterial);
  trunk.position.y = height / 2;
  trunk.rotation.z = 0.12;
  trunk.castShadow = true;
  group.add(trunk);

  for (let i = 0; i < 7; i += 1) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(4.2, 24, 5), leafMaterial);
    leaf.position.set(Math.cos(i * 0.9) * 4, height + 1.5, Math.sin(i * 0.9) * 4);
    leaf.rotation.z = Math.PI / 2.7;
    leaf.rotation.y = i * 0.9;
    leaf.castShadow = true;
    group.add(leaf);
  }

  const coconuts = new THREE.Mesh(
    new THREE.SphereGeometry(2.7, 12, 8),
    new THREE.MeshStandardMaterial({ color: 0x5d3b22, roughness: 0.9 }),
  );
  coconuts.position.y = height;
  coconuts.castShadow = true;
  group.add(coconuts);
  return group;
}

function createFlowerPatch(index) {
  const group = new THREE.Group();
  const colors = [0xf45d8a, 0xffd25a, 0xffffff, 0x7ce0b4, 0xff8a3d];
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x2c8a43, roughness: 0.9 });

  for (let i = 0; i < 6; i += 1) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 2.8, 6), stemMaterial);
    stem.position.set(Math.sin(i * 1.7) * 4, 1.4, Math.cos(i * 1.3) * 4);
    stem.castShadow = true;
    group.add(stem);

    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 8, 6),
      new THREE.MeshStandardMaterial({ color: colors[(index + i) % colors.length], roughness: 0.75 }),
    );
    flower.position.set(stem.position.x, 3, stem.position.z);
    flower.castShadow = true;
    group.add(flower);
  }

  return group;
}

function addStarterIslandDetails(group, radius, height) {
  addBeachRing(group, radius, height);
  addVillagePaths(group, height);
  addDock(group, radius, height);
  addPondAndWaterfall(group, radius, height);
  addVillagePlaza(group, height);
  addLookoutArch(group, height);
  addLanternsAndBanners(group, height);
  addShoreCrystals(group, radius, height);
  addStarterIslandDecorations(group, height);

  const houseSpots = [
    [-95, 30, 1.2],
    [-42, 82, -0.45],
    [35, 108, 0.15],
    [112, 56, -0.85],
    [142, -38, 0.55],
  ];

  houseSpots.forEach(([x, z, rotation], index) => {
    const house = createHouse(index);
    house.position.set(x, height + 0.2, z);
    house.rotation.y = rotation;
    group.add(house);
    addCollisionCircle(new THREE.Vector3(x, height, z), 28, "House wall");
  });

  for (let i = 0; i < 28; i += 1) {
    const angle = i * 0.72 + Math.sin(i * 1.9) * 0.16;
    const distance = radius * (0.58 + (i % 7) * 0.045);
    const palm = createPalmTree(18 + (i % 4) * 2.8);
    palm.position.set(Math.cos(angle) * distance, height + 0.1, Math.sin(angle) * distance);
    palm.rotation.y = angle + Math.PI / 2;
    group.add(palm);
  }

  for (let i = 0; i < 34; i += 1) {
    const angle = i * 0.64 + Math.sin(i) * 0.2;
    const distance = radius * (0.52 + (i % 5) * 0.075);
    const rock = createRock(7 + (i % 4) * 3);
    rock.position.set(Math.cos(angle) * distance, height + 0.2, Math.sin(angle) * distance);
    rock.rotation.y = angle;
    group.add(rock);
  }

  for (let i = 0; i < 46; i += 1) {
    const angle = i * 1.97;
    const distance = radius * (0.14 + ((i * 37) % 68) / 100);
    const tuft = createGrassTuft(3 + (i % 4));
    tuft.position.set(Math.cos(angle) * distance, height + 0.3, Math.sin(angle) * distance);
    tuft.rotation.y = angle;
    group.add(tuft);
  }

  for (let i = 0; i < 70; i += 1) {
    const angle = i * 2.31;
    const distance = radius * (0.18 + ((i * 29) % 62) / 100);
    const flowers = createFlowerPatch(i);
    flowers.position.set(Math.cos(angle) * distance, height + 0.45, Math.sin(angle) * distance);
    flowers.rotation.y = angle;
    group.add(flowers);
  }
}

function addStarterIslandDecorations(group, height) {
  addMarketStalls(group, height);
  addCratesAndBarrels(group, height);
  addGardenBeds(group, height);
  addFenceLines(group, height);
  addSignposts(group, height);
  addTrainingYard(group, height);
}

function addMarketStalls(group, height) {
  const spots = [
    [-24, 22, 0.18, 0xd94b37],
    [52, 34, -0.28, 0x1b85aa],
    [18, -18, 0.72, 0xf6b73c],
  ];

  spots.forEach(([x, z, rotation, color]) => {
    const stall = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: 0x7b5635, roughness: 0.88 });
    const cloth = new THREE.MeshStandardMaterial({ color, roughness: 0.7, side: THREE.DoubleSide });

    const table = new THREE.Mesh(new THREE.BoxGeometry(24, 4, 12), wood);
    table.position.y = 5;
    table.castShadow = true;
    stall.add(table);

    const awning = new THREE.Mesh(new THREE.BoxGeometry(28, 2, 16), cloth);
    awning.position.y = 18;
    awning.rotation.z = 0.08;
    awning.castShadow = true;
    stall.add(awning);

    for (let i = -1; i <= 1; i += 2) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 18, 7), wood);
      post.position.set(i * 10, 9, -5);
      post.castShadow = true;
      stall.add(post);
    }

    stall.position.set(x, height + 0.3, z);
    stall.rotation.y = rotation;
    group.add(stall);
    addCollisionCircle(new THREE.Vector3(x, height, z), 20, "Market stall");
  });
}

function addCratesAndBarrels(group, height) {
  const wood = new THREE.MeshStandardMaterial({ color: 0x6f4a2e, roughness: 0.9 });
  const spots = [
    [-430, 82],
    [-414, 58],
    [-386, 92],
    [170, -72],
    [190, -56],
    [205, -94],
    [8, 286],
    [-18, 270],
  ];

  spots.forEach(([x, z], index) => {
    const item =
      index % 2 === 0
        ? new THREE.Mesh(new THREE.BoxGeometry(12, 12, 12), wood)
        : new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 13, 12), wood);
    item.position.set(x, height + 6.5, z);
    item.rotation.y = index * 0.45;
    item.castShadow = true;
    item.receiveShadow = true;
    group.add(item);
    addCollisionCircle(new THREE.Vector3(x, height, z), 8, "Supply stack");
  });
}

function addGardenBeds(group, height) {
  const soil = new THREE.MeshStandardMaterial({ color: 0x5b3a24, roughness: 0.96 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x2f9b55, roughness: 0.86 });
  const spots = [
    [-128, -64, 0.25],
    [-148, -104, -0.2],
    [92, 142, 0.55],
  ];

  spots.forEach(([x, z, rotation], bedIndex) => {
    const bed = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(46, 2.5, 18), soil);
    base.position.y = 1.4;
    base.receiveShadow = true;
    bed.add(base);

    for (let i = 0; i < 9; i += 1) {
      const plant = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 6), leaf);
      plant.position.set(-18 + i * 4.5, 4.2, Math.sin(i + bedIndex) * 4);
      plant.castShadow = true;
      bed.add(plant);
    }

    bed.position.set(x, height + 0.5, z);
    bed.rotation.y = rotation;
    group.add(bed);
  });
}

function addFenceLines(group, height) {
  const wood = new THREE.MeshStandardMaterial({ color: 0x6f4a2e, roughness: 0.9 });
  const lines = [
    [-180, -10, 7, 0.35],
    [184, 122, 6, -0.55],
    [-58, 178, 5, 1.15],
  ];

  lines.forEach(([x, z, count, rotation]) => {
    const fence = new THREE.Group();
    for (let i = 0; i < count; i += 1) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 11, 7), wood);
      post.position.set(i * 13, 5.5, 0);
      post.castShadow = true;
      fence.add(post);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(count * 13, 2, 2), wood);
    rail.position.set((count * 13) / 2 - 6.5, 7.2, 0);
    rail.castShadow = true;
    fence.add(rail);

    fence.position.set(x, height + 0.5, z);
    fence.rotation.y = rotation;
    group.add(fence);
    addCollisionCircle(new THREE.Vector3(x + Math.cos(rotation) * count * 6, height, z - Math.sin(rotation) * count * 6), count * 8, "Fence");
  });
}

function addSignposts(group, height) {
  const wood = new THREE.MeshStandardMaterial({ color: 0x5b3823, roughness: 0.88 });
  const face = new THREE.MeshStandardMaterial({ color: 0xd8b36a, roughness: 0.82 });
  const spots = [
    [62, 16, 0.2],
    [-32, 132, -0.35],
    [-420, 28, 1.2],
  ];

  spots.forEach(([x, z, rotation]) => {
    const sign = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 18, 8), wood);
    post.position.y = 9;
    post.castShadow = true;
    sign.add(post);

    const board = new THREE.Mesh(new THREE.BoxGeometry(22, 10, 1.4), face);
    board.position.y = 18;
    board.castShadow = true;
    sign.add(board);

    sign.position.set(x, height + 0.4, z);
    sign.rotation.y = rotation;
    group.add(sign);
    addCollisionCircle(new THREE.Vector3(x, height, z), 8, "Signpost");
  });
}

function addTrainingYard(group, height) {
  const straw = new THREE.MeshStandardMaterial({ color: 0xc99b45, roughness: 0.95 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x5b3823, roughness: 0.88 });
  const yard = new THREE.Group();

  for (let i = 0; i < 4; i += 1) {
    const dummy = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.8, 18, 10), straw);
    body.position.y = 12;
    body.castShadow = true;
    dummy.add(body);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(22, 2.4, 2.4), wood);
    arm.position.y = 18;
    arm.castShadow = true;
    dummy.add(arm);

    dummy.position.set((i % 2) * 32, 0, Math.floor(i / 2) * 32);
    yard.add(dummy);
  }

  yard.position.set(208, height + 0.3, 122);
  yard.rotation.y = -0.35;
  group.add(yard);
  addCollisionCircle(new THREE.Vector3(224, height, 138), 36, "Training yard");
}

function addLookoutArch(group, height) {
  const stone = new THREE.MeshStandardMaterial({ color: 0x77736b, roughness: 0.96, flatShading: true });
  const positions = [
    [-34, 0, 0],
    [34, 0, 0],
  ];

  positions.forEach(([x, y, z]) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(6, 8, 38, 10), stone);
    pillar.position.set(-242 + x, height + 19 + y, 112 + z);
    pillar.castShadow = true;
    group.add(pillar);
    addCollisionCircle(new THREE.Vector3(-242 + x, height, 112 + z), 10, "Lookout arch");
  });

  const lintel = new THREE.Mesh(new THREE.BoxGeometry(86, 12, 18), stone);
  lintel.position.set(-242, height + 41, 112);
  lintel.rotation.z = 0.08;
  lintel.castShadow = true;
  group.add(lintel);

  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 16),
    new THREE.MeshStandardMaterial({ color: 0xf6b73c, side: THREE.DoubleSide, roughness: 0.6 }),
  );
  flag.position.set(-198, height + 52, 112);
  flag.rotation.y = -0.45;
  group.add(flag);
}

function addLanternsAndBanners(group, height) {
  const postMaterial = new THREE.MeshStandardMaterial({ color: 0x4b2f1f, roughness: 0.86 });
  const glowMaterial = new THREE.MeshStandardMaterial({ color: 0xffd25a, emissive: 0x8a4f00, roughness: 0.45 });
  const bannerColors = [0xd94b37, 0x1b85aa, 0xf6b73c, 0x2f9b55];
  const spots = [
    [-72, 38],
    [-18, 92],
    [54, 88],
    [112, 22],
    [54, -46],
    [-44, -28],
    [18, 150],
    [156, 96],
  ];

  spots.forEach(([x, z], index) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 22, 8), postMaterial);
    post.position.set(x, height + 11, z);
    post.castShadow = true;
    group.add(post);

    const lantern = new THREE.Mesh(new THREE.SphereGeometry(3.2, 12, 8), glowMaterial);
    lantern.position.set(x, height + 23, z);
    group.add(lantern);

    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 15),
      new THREE.MeshStandardMaterial({ color: bannerColors[index % bannerColors.length], side: THREE.DoubleSide, roughness: 0.72 }),
    );
    banner.position.set(x + 4, height + 15, z);
    banner.rotation.y = index * 0.7;
    group.add(banner);
  });
}

function addShoreCrystals(group, radius, height) {
  const crystalColors = [0x7ce0b4, 0x9defff, 0xffd25a];
  for (let i = 0; i < 16; i += 1) {
    const angle = i * 1.37;
    const distance = radius * (0.68 + (i % 4) * 0.06);
    const crystal = new THREE.Mesh(
      new THREE.ConeGeometry(4 + (i % 3), 18 + (i % 5) * 3, 5),
      new THREE.MeshStandardMaterial({
        color: crystalColors[i % crystalColors.length],
        emissive: crystalColors[i % crystalColors.length],
        emissiveIntensity: 0.18,
        roughness: 0.38,
        transparent: true,
        opacity: 0.88,
      }),
    );
    crystal.position.set(Math.cos(angle) * distance, height + 9, Math.sin(angle) * distance);
    crystal.rotation.z = -0.18 + (i % 4) * 0.1;
    crystal.castShadow = true;
    group.add(crystal);
  }
}

function addBeachRing(group, radius, height) {
  const beach = new THREE.Mesh(
    makeIrregularRingGeometry(radius * 0.76, radius * 0.98, 128, 21),
    new THREE.MeshStandardMaterial({ color: 0xe7c980, roughness: 0.92, side: THREE.DoubleSide }),
  );
  beach.rotation.x = -Math.PI / 2;
  beach.position.y = height + 0.07;
  beach.receiveShadow = true;
  group.add(beach);

  const shallowWater = new THREE.Mesh(
    makeIrregularRingGeometry(radius * 0.98, radius * 1.12, 128, 34),
    new THREE.MeshStandardMaterial({
      color: 0x5ccad1,
      transparent: true,
      opacity: 0.34,
      roughness: 0.25,
      side: THREE.DoubleSide,
    }),
  );
  shallowWater.rotation.x = -Math.PI / 2;
  shallowWater.position.y = 0.18;
  group.add(shallowWater);
  animatedWorldObjects.push({ mesh: shallowWater, type: "tide", baseY: shallowWater.position.y, speed: 0.0017, phase: radius * 0.01 });

  for (let i = 0; i < 3; i += 1) {
    const foam = new THREE.Mesh(
      makeIrregularRingGeometry(radius * (1.05 + i * 0.045), radius * (1.07 + i * 0.045), 128, 60 + i),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.13 - i * 0.025,
        side: THREE.DoubleSide,
      }),
    );
    foam.rotation.x = -Math.PI / 2;
    foam.position.y = 0.24 + i * 0.03;
    group.add(foam);
    animatedWorldObjects.push({ mesh: foam, type: "foam", speed: 0.00045 + i * 0.00012, phase: i * 1.7 });
  }
}

function addVillagePaths(group, height) {
  const material = new THREE.MeshStandardMaterial({ color: 0xcaa96a, roughness: 0.96 });
  const paths = [
    [0, 0, 310, 14, 0.25],
    [30, 48, 230, 12, 1.18],
    [-80, 36, 190, 11, -0.85],
    [110, 16, 170, 10, -0.35],
  ];

  paths.forEach(([x, z, length, width, rotation]) => {
    const path = new THREE.Mesh(new THREE.BoxGeometry(width, 0.35, length), material);
    path.position.set(x, height + 0.44, z);
    path.rotation.y = rotation;
    path.receiveShadow = true;
    group.add(path);
  });
}

function addVillagePlaza(group, height) {
  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(54, 48),
    new THREE.MeshStandardMaterial({ color: 0xb88950, roughness: 0.9 }),
  );
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(18, height + 0.5, 42);
  plaza.receiveShadow = true;
  group.add(plaza);

  const well = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 9, 7, 18),
    new THREE.MeshStandardMaterial({ color: 0x6a6258, roughness: 0.95 }),
  );
  well.position.set(18, height + 3.8, 42);
  well.castShadow = true;
  group.add(well);
  addCollisionCircle(new THREE.Vector3(18, height, 42), 12, "Stone well");

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(13, 9, 4),
    new THREE.MeshStandardMaterial({ color: 0x8b3528, roughness: 0.8 }),
  );
  roof.position.set(18, height + 12.2, 42);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);
}

function addDock(group, radius, height) {
  const wood = new THREE.MeshStandardMaterial({ color: 0x7b5635, roughness: 0.9 });
  const pier = new THREE.Mesh(new THREE.BoxGeometry(32, 2.5, 170), wood);
  pier.position.set(0, height + 1.4, radius * 0.93);
  pier.castShadow = true;
  pier.receiveShadow = true;
  group.add(pier);

  for (let i = -3; i <= 3; i += 1) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.6, 18, 10), wood);
    post.position.set(i * 11, height - 3, radius * 0.78 + Math.abs(i % 2) * 35);
    post.castShadow = true;
    group.add(post);
  }

  const boat = new THREE.Group();
  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(42, 8, 18),
    new THREE.MeshStandardMaterial({ color: 0x5a2f20, roughness: 0.86 }),
  );
  hull.position.y = 4;
  hull.castShadow = true;
  boat.add(hull);

  const sail = new THREE.Mesh(
    new THREE.ConeGeometry(15, 34, 3),
    new THREE.MeshStandardMaterial({ color: 0xfff1c7, roughness: 0.7, side: THREE.DoubleSide }),
  );
  sail.position.y = 28;
  sail.rotation.z = Math.PI / 2;
  boat.add(sail);

  boat.position.set(58, 1.2, radius * 1.08);
  boat.rotation.y = -0.35;
  group.add(boat);
}

function addPondAndWaterfall(group, radius, height) {
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x39b7c8,
    transparent: true,
    opacity: 0.78,
    roughness: 0.18,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const pond = new THREE.Mesh(makeIrregularDiscGeometry(54, 42, 51), waterMaterial);
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(-138, height + 0.62, -72);
  group.add(pond);

  const stream = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 185), waterMaterial);
  stream.position.set(-184, height + 0.65, -176);
  stream.rotation.y = -0.42;
  group.add(stream);

  const waterfall = new THREE.Mesh(
    new THREE.PlaneGeometry(58, 58, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x9defff, transparent: true, opacity: 0.68, side: THREE.DoubleSide }),
  );
  waterfall.position.set(-247, height - 13, -288);
  waterfall.rotation.y = -0.42;
  group.add(waterfall);

  for (let i = 0; i < 10; i += 1) {
    const mist = new THREE.Mesh(
      new THREE.SphereGeometry(3 + (i % 3), 10, 8),
      new THREE.MeshStandardMaterial({ color: 0xd6fbff, transparent: true, opacity: 0.32 }),
    );
    mist.position.set(-230 + Math.sin(i) * 24, height + 1 + (i % 4), -306 + Math.cos(i * 2) * 18);
    group.add(mist);
  }
}

function createHouse(index) {
  const group = new THREE.Group();
  const wallColors = [0xd3a464, 0xc28f5b, 0xa97755, 0xdfb174, 0xb9956a];
  const trimColors = [0x23646f, 0x6b2f35, 0x275d3b, 0x8b5a22, 0x4b5169];
  const trim = new THREE.MeshStandardMaterial({ color: trimColors[index % trimColors.length], roughness: 0.72 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x5d3924, roughness: 0.9 });
  const glass = new THREE.MeshStandardMaterial({
    color: 0x92e6ff,
    emissive: 0x174f5d,
    emissiveIntensity: 0.16,
    roughness: 0.3,
  });

  const foundation = new THREE.Mesh(
    new THREE.BoxGeometry(39, 4, 33),
    new THREE.MeshStandardMaterial({ color: 0x776f63, roughness: 0.96 }),
  );
  foundation.position.y = 2;
  foundation.castShadow = true;
  foundation.receiveShadow = true;
  group.add(foundation);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(34, 23, 28),
    new THREE.MeshStandardMaterial({ color: wallColors[index % wallColors.length], roughness: 0.88 }),
  );
  body.position.y = 15;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(29, 18, 4),
    new THREE.MeshStandardMaterial({ color: index % 2 ? 0x7f2f2a : 0x8e3d28, roughness: 0.76 }),
  );
  roof.position.y = 35.5;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);

  const roofTrim = new THREE.Mesh(new THREE.BoxGeometry(42, 2.2, 32), trim);
  roofTrim.position.y = 27;
  roofTrim.castShadow = true;
  group.add(roofTrim);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(8, 13, 1),
    wood,
  );
  door.position.set(0, 9.8, 14.55);
  group.add(door);

  const handle = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), trim);
  handle.position.set(2.4, 10, 15.18);
  group.add(handle);

  [-10.5, 10.5].forEach((x) => {
    const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(7.8, 7.8, 1.1), trim);
    windowFrame.position.set(x, 17.5, 14.65);
    windowFrame.castShadow = true;
    group.add(windowFrame);

    const pane = new THREE.Mesh(new THREE.BoxGeometry(5.2, 5.2, 1.2), glass);
    pane.position.set(x, 17.5, 15.24);
    group.add(pane);

    const crossA = new THREE.Mesh(new THREE.BoxGeometry(0.55, 6.1, 1.35), wood);
    crossA.position.set(x, 17.5, 15.35);
    group.add(crossA);

    const crossB = new THREE.Mesh(new THREE.BoxGeometry(6.1, 0.55, 1.35), wood);
    crossB.position.set(x, 17.5, 15.36);
    group.add(crossB);
  });

  const balcony = new THREE.Mesh(new THREE.BoxGeometry(26, 2.2, 7), wood);
  balcony.position.set(0, 20.5, -16.4);
  balcony.castShadow = true;
  group.add(balcony);

  for (let i = -2; i <= 2; i += 1) {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 8, 7), trim);
    rail.position.set(i * 5, 24, -19.4);
    rail.castShadow = true;
    group.add(rail);
  }

  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 12, 5.2),
    new THREE.MeshStandardMaterial({ color: 0x5f4a3d, roughness: 0.9 }),
  );
  chimney.position.set(8, 37, -4);
  chimney.rotation.y = 0.18;
  chimney.castShadow = true;
  group.add(chimney);

  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 12),
    new THREE.MeshStandardMaterial({ color: trimColors[(index + 2) % trimColors.length], side: THREE.DoubleSide, roughness: 0.65 }),
  );
  banner.position.set(-16.4, 17, 6);
  banner.rotation.y = Math.PI / 2;
  group.add(banner);

  group.scale.setScalar(0.94 + (index % 3) * 0.05);
  return group;
}

function createRock(size) {
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(size, 1),
    new THREE.MeshStandardMaterial({ color: 0x5d5954, roughness: 0.98, flatShading: true }),
  );
  rock.scale.set(1.25, 0.55 + size * 0.03, 0.9);
  rock.castShadow = true;
  rock.receiveShadow = true;
  return rock;
}

function createGrassTuft(size) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x2f7f3e, roughness: 0.95, side: THREE.DoubleSide });
  for (let i = 0; i < 5; i += 1) {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.9, size * 2.8, 5), material);
    blade.position.y = size * 1.3;
    blade.rotation.z = -0.25 + i * 0.12;
    blade.rotation.y = i * 1.25;
    blade.castShadow = true;
    group.add(blade);
  }
  return group;
}

function createQuestGiver(position) {
  const giver = new THREE.Group();
  giver.position.copy(position);

  const body = createHumanAvatarModel(
    {
      name: "Quest Giver",
      skin: "#d49a6a",
      shirt: "#f6b73c",
      pants: "#58412c",
      hair: "#6b3b1f",
      eyes: "#27313a",
      boots: "#2d1c12",
      hairStyle: "cap",
      outfit: "coat",
      height: 102,
      build: 96,
    },
    { showSword: false, showName: false },
  );
  giver.add(body);

  const marker = makeLabel("Quest", 1.5);
  marker.position.y = 14.2;
  giver.add(marker);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(5.4, 0.4, 12, 80),
    new THREE.MeshBasicMaterial({ color: 0xffd25a, transparent: true, opacity: 0.88 }),
  );
  ring.position.y = 13.2;
  ring.rotation.x = Math.PI / 2;
  giver.add(ring);
  animatedWorldObjects.push({ mesh: ring, type: "questRing", speed: 0.01, phase: position.x * 0.02 });

  scene.add(giver);
  questGiverPosition.copy(position);
  interactables.push({
    type: "quest",
    mesh: giver,
    prompt: "Press E: Take quest - defeat 5 bandits",
  });
}

function createTeleporter(position, destination) {
  const teleporter = new THREE.Group();
  teleporter.position.copy(position);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(18, 22, 4, 40),
    new THREE.MeshStandardMaterial({ color: 0x22486b, roughness: 0.35, metalness: 0.25 }),
  );
  base.position.y = 2;
  base.castShadow = true;
  base.receiveShadow = true;
  teleporter.add(base);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(14, 1.2, 14, 96),
    new THREE.MeshBasicMaterial({ color: 0x7ce0b4, transparent: true, opacity: 0.82 }),
  );
  ring.position.y = 11;
  ring.rotation.x = Math.PI / 2;
  teleporter.add(ring);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 34, 32),
    new THREE.MeshBasicMaterial({ color: 0x7ce0b4, transparent: true, opacity: 0.22 }),
  );
  beam.position.y = 18;
  teleporter.add(beam);

  const label = makeLabel("Teleporter", 1.15);
  label.position.y = 39;
  teleporter.add(label);

  scene.add(teleporter);
  animatedWorldObjects.push({ mesh: ring, type: "teleporter", speed: 0.022, phase: position.x * 0.01 });
  animatedWorldObjects.push({ mesh: beam, type: "teleporterBeam", baseY: beam.position.y, speed: 0.003, phase: position.z * 0.01 });
  interactables.push({
    type: "teleporter",
    mesh: teleporter,
    destination,
    prompt: "Press E: Teleport to Jungle Island",
  });
  addCollisionCircle(position, 12, "Teleporter base", { damage: 0 });
}

function createBoatDealer(position) {
  const dealer = new THREE.Group();
  dealer.position.copy(position);

  const body = createHumanAvatarModel(
    {
      name: "Boat Dealer",
      skin: "#f4c58d",
      shirt: "#2e7a9d",
      pants: "#2d3848",
      hair: "#1c1b1d",
      eyes: "#1a1a1a",
      boots: "#1a1816",
      hairStyle: "short",
      outfit: "sailor",
      height: 100,
      build: 98,
    },
    { showSword: false, showName: false },
  );
  dealer.add(body);

  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(14, 6, 0.8),
    new THREE.MeshStandardMaterial({ color: 0xffd25a, emissive: 0x8a5a0f, roughness: 0.5 }),
  );
  sign.position.set(0, 13.7, 0);
  dealer.add(sign);

  const signLabel = makeLabel("Boat Shop", 0.9);
  signLabel.position.set(0, 15.2, 0.8);
  dealer.add(signLabel);

  scene.add(dealer);
  interactables.push({
    type: "boat",
    mesh: dealer,
    prompt: "Press E: Choose your boat",
  });
}

function createSwordDealer(position) {
  const dealer = new THREE.Group();
  dealer.position.copy(position);

  const body = createHumanAvatarModel(
    {
      name: "Sword Dealer",
      skin: "#d9b384",
      shirt: "#7c3f25",
      pants: "#2a2f34",
      hair: "#211a16",
      eyes: "#111111",
      boots: "#2a1816",
      hairStyle: "short",
      outfit: "armor",
      height: 102,
      build: 104,
    },
    { showSword: false, showName: false },
  );
  dealer.add(body);

  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(14, 6, 0.8),
    new THREE.MeshStandardMaterial({ color: 0xc84f33, emissive: 0x8a1f0b, roughness: 0.5 }),
  );
  sign.position.set(0, 13.7, 0);
  dealer.add(sign);

  const signLabel = makeLabel("Sword Shop", 0.9);
  signLabel.position.set(0, 15.2, 0.8);
  dealer.add(signLabel);

  scene.add(dealer);
  interactables.push({
    type: "sword",
    mesh: dealer,
    prompt: "Press E: Buy a sword",
  });
}

function createOutpostQuestGiver(position) {
  const giver = new THREE.Group();
  giver.position.copy(position);
  giver.add(createHumanAvatarModel({
    name: "Outpost Captain",
    skin: "#c98b62",
    shirt: "#3d5f72",
    pants: "#2b2624",
    hair: "#3a2118",
    eyes: "#101820",
    boots: "#24160e",
    hairStyle: "cap",
    outfit: "coat",
    height: 106,
    build: 108,
  }, { showSword: true, showName: false }));
  const label = makeLabel("Quest Hub", 1.25);
  label.position.y = 15;
  giver.add(label);
  scene.add(giver);
  interactables.push({
    type: "questHub",
    mesh: giver,
    prompt: "Press E: View Outpost quests",
  });
}

function createHakiTrainer(position) {
  const trainer = new THREE.Group();
  trainer.position.copy(position);
  trainer.add(createHumanAvatarModel({
    name: "Haki Trainer",
    skin: "#b68158",
    shirt: "#111111",
    pants: "#292929",
    hair: "#f2f2e8",
    eyes: "#0a0a0a",
    boots: "#101010",
    hairStyle: "spiky",
    outfit: "armor",
    height: 112,
    build: 118,
  }, { showSword: false, showName: false }));
  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(5.5, 0.2, 8, 42),
    new THREE.MeshBasicMaterial({ color: 0x151515, transparent: true, opacity: 0.75 }),
  );
  aura.position.y = 2;
  aura.rotation.x = Math.PI / 2;
  trainer.add(aura);
  const label = makeLabel("Haki Trainer", 1);
  label.position.y = 15;
  trainer.add(label);
  scene.add(trainer);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.018, phase: 1.2 });
  interactables.push({
    type: "hakiTrainer",
    mesh: trainer,
    prompt: "Press E: Learn Armament Haki",
  });
}

function createBoat(type) {
  const sizes = {
    dinghy: { length: 18, width: 6, color: 0x8c5c3a, sail: false },
    sailor: { length: 24, width: 7.5, color: 0x4b7a9a, sail: true },
    brigade: { length: 32, width: 9, color: 0x30536f, sail: true },
  };
  const spec = sizes[type] || sizes.dinghy;
  const boat = new THREE.Group();

  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(spec.length, 1.8, spec.width),
    new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.62, metalness: 0.12 }),
  );
  hull.position.y = 0.9;
  hull.castShadow = true;
  boat.add(hull);

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(spec.length * 0.88, 0.4, spec.width * 0.92),
    new THREE.MeshStandardMaterial({ color: 0xd4b27e, roughness: 0.72 }),
  );
  deck.position.y = 1.35;
  boat.add(deck);

  if (spec.sail) {
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x3b3029, roughness: 0.85 }),
    );
    mast.position.y = 4.5;
    boat.add(mast);

    const sail = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 7.5),
      new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.92 }),
    );
    sail.position.set(0, 4.5, 0);
    sail.rotation.y = -Math.PI / 2;
    sail.rotation.z = 0.12;
    boat.add(sail);
  }

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(spec.length * 0.3, 1.6, spec.width * 0.75),
    new THREE.MeshStandardMaterial({ color: 0x2c4b5c, roughness: 0.78 }),
  );
  cabin.position.set(-spec.length * 0.15, 2.1, 0);
  boat.add(cabin);

  return boat;
}

function addIslandRocks(group, radius, height) {
  const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x60534a, roughness: 0.97, flatShading: true });
  const rockCount = 18;
  for (let i = 0; i < rockCount; i += 1) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(3 + Math.random() * 4, 0), rockMaterial);
    const angle = (i / rockCount) * Math.PI * 2 + Math.random() * 0.4;
    const distance = radius * (0.96 + Math.random() * 0.07);
    rock.position.set(Math.cos(angle) * distance, height * 0.02 + Math.random() * 1.1, Math.sin(angle) * distance);
    rock.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.6);
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
  }
}

function handleBoatSelection(type) {
  if (activeBoat) {
    scene.remove(activeBoat);
  }
  const boat = createBoat(type);
  const offset = new THREE.Vector3(0, 0, -28).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerMesh.rotation.y);
  boat.position.copy(playerMesh.position).add(offset);
  boat.position.y = OCEAN_SURFACE_Y + 0.28;
  boat.rotation.y = playerMesh.rotation.y;
  scene.add(boat);
  activeBoat = boat;
  log(`Spawned ${type} boat near the water.`);
}

function showBoatMenu() {
  document.querySelector("#boat-menu").classList.remove("hidden");
}

function hideBoatMenu() {
  document.querySelector("#boat-menu").classList.add("hidden");
}

function createBanditCamp() {
  const spots = [
    [-155, STARTER_SURFACE_Y, -78],
    [-210, STARTER_SURFACE_Y, 42],
    [-92, STARTER_SURFACE_Y, 168],
    [84, STARTER_SURFACE_Y, -182],
    [218, STARTER_SURFACE_Y, -64],
    [145, STARTER_SURFACE_Y, 158],
  ];

  spots.forEach((spot, index) => spawnBandit(new THREE.Vector3(...spot), index));
}

function spawnPirateCamp(island) {
  const center = island.position;
  for (let i = 0; i < 6; i += 1) {
    const angle = i * 1.05;
    spawnAdvancedEnemy(center.clone().add(new THREE.Vector3(Math.cos(angle) * 230, island.surfaceY, Math.sin(angle) * 230)), i, "pirate");
  }
}

function spawnBruteCamp(island) {
  const center = island.position.clone().add(new THREE.Vector3(-260, 0, 210));
  for (let i = 0; i < 4; i += 1) {
    const angle = i * 1.5;
    spawnAdvancedEnemy(center.clone().add(new THREE.Vector3(Math.cos(angle) * 150, island.surfaceY, Math.sin(angle) * 150)), i, "brute");
  }
}

function spawnAdvancedEnemy(position, index, type) {
  const group = new THREE.Group();
  group.position.copy(position);
  const isBrute = type === "brute";
  const isBoss = type === "buggy";
  group.add(createHumanAvatarModel({
    id: `${type}-${index}`,
    name: isBoss ? "Buggy" : isBrute ? `Brute ${index + 1}` : `Pirate ${index + 1}`,
    skin: isBoss ? "#f1c29b" : "#b97852",
    shirt: isBoss ? "#d74343" : isBrute ? "#3e3430" : "#722b30",
    pants: isBoss ? "#7a4f9d" : "#222a34",
    hair: isBoss ? "#1f67c7" : "#1b120d",
    eyes: "#101010",
    boots: "#1a120d",
    hairStyle: isBoss ? "cap" : "short",
    outfit: isBrute ? "armor" : "coat",
    height: isBoss ? 118 : isBrute ? 126 : 104,
    build: isBoss ? 126 : isBrute ? 142 : 108,
  }, { showSword: !isBrute, showName: false, bandanaColor: isBoss ? "#ff3131" : "#b92832" }));
  if (isBrute) addMaceToEnemy(group);
  scene.add(group);
  enemies.push({
    id: `${type}-${index}`,
    type,
    mesh: group,
    spawn: position.clone(),
    health: isBoss ? 850 : isBrute ? 180 : 95,
    maxHealth: isBoss ? 850 : isBrute ? 180 : 95,
    alive: true,
    respawnTimer: 0,
    hitTimer: 0,
    ai: {
      state: "patrol",
      cooldown: 0.5 + index * 0.2,
      rush: 1.8,
      slash: 2.4,
      slam: 3.2,
      dodge: 1.5,
    },
  });
}

function spawnBuggyBoss(position) {
  spawnAdvancedEnemy(position, 0, "buggy");
}

function addMaceToEnemy(group) {
  const mace = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.42, 6, 10),
    new THREE.MeshStandardMaterial({ color: 0x4a4642, roughness: 0.72, metalness: 0.35 }),
  );
  mace.position.set(3.5, 5.2, 0.8);
  mace.rotation.z = -0.72;
  group.add(mace);
  const head = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.25, 0),
    new THREE.MeshStandardMaterial({ color: 0x2f2d2b, roughness: 0.82, metalness: 0.5 }),
  );
  head.position.set(5.2, 3.5, 0.8);
  group.add(head);
}

function spawnBandit(position, index) {
  const group = new THREE.Group();
  group.position.copy(position);
  const banditAvatars = [
    { skin: "#b97852", shirt: "#7b3f2f", pants: "#2a2430", hair: "#1a100c", height: 92, build: 88 },
    { skin: "#8f5d3d", shirt: "#8e2f23", pants: "#33251f", hair: "#0f0b08", height: 112, build: 120 },
    { skin: "#d69a70", shirt: "#5f4736", pants: "#1c2b34", hair: "#55341e", height: 98, build: 104 },
    { skin: "#a46d4d", shirt: "#9b5a2e", pants: "#272a38", hair: "#21140e", height: 121, build: 96 },
    { skin: "#c0845d", shirt: "#633c2d", pants: "#423023", hair: "#16110e", height: 87, build: 128 },
    { skin: "#e0ad82", shirt: "#6c2d39", pants: "#1f3140", hair: "#6e3c20", height: 105, build: 82 },
  ];
  const avatar = {
    id: `bandit-${index}`,
    name: `Bandit ${index + 1}`,
    eyes: "#111111",
    boots: "#21150e",
    hairStyle: index % 2 === 0 ? "spiky" : "short",
    outfit: index % 3 === 0 ? "coat" : "sailor",
    ...banditAvatars[index % banditAvatars.length],
  };
  group.add(createHumanAvatarModel(avatar, {
    showSword: true,
    showName: false,
    bandanaColor: index % 2 === 0 ? "#c74148" : "#3d2b1e",
  }));

  scene.add(group);
  enemies.push({
    id: index,
    mesh: group,
    spawn: position.clone(),
    health: 45,
    maxHealth: 45,
    alive: true,
    respawnTimer: 0,
    hitTimer: 0,
  });
}

function createPlayer() {
  playerMesh = new THREE.Group();
  playerMesh.position.set(0, STARTER_SURFACE_Y + 0.15, 0);
  playerMesh.userData.animation = { walkPhase: 0, attackTimer: 0, attackDuration: 0.22, attackImpact: 0 };
  scene.add(playerMesh);
  applyAvatarToPlayer();
}

function createHumanAvatarModel(avatar, options = {}) {
  const showSword = options.showSword !== false;
  const showName = options.showName !== false;
  const group = new THREE.Group();
  const avatarParts = {};
  const heightScale = (avatar.height || 100) / 100;
  const buildScale = (avatar.build || 100) / 100;
  const skin = new THREE.MeshStandardMaterial({ color: avatar.skin, roughness: 0.72 });
  const shirt = new THREE.MeshStandardMaterial({ color: avatar.shirt, roughness: 0.84 });
  const pants = new THREE.MeshStandardMaterial({ color: avatar.pants, roughness: 0.86 });
  const hair = new THREE.MeshStandardMaterial({ color: avatar.hair, roughness: 0.9 });
  const eyes = new THREE.MeshStandardMaterial({ color: avatar.eyes || "#101820", roughness: 0.4 });
  const boots = new THREE.MeshStandardMaterial({ color: avatar.boots || "#23170f", roughness: 0.9 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xc8d7df, metalness: 0.7, roughness: 0.25 });
  const trim = new THREE.MeshStandardMaterial({ color: avatar.outfit === "armor" ? 0xb8c1c7 : avatar.boots || "#23170f", roughness: 0.65 });

  const torsoWidth = 3.2 * buildScale;
  const torso = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth, 4.1, 1.6), shirt);
  torso.position.y = 5.7;
  torso.castShadow = true;
  group.add(torso);

  if (avatar.outfit === "coat") {
    const coat = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth + 0.45, 5.4, 1.85), shirt);
    coat.position.y = 5.0;
    coat.castShadow = true;
    group.add(coat);
  }

  if (avatar.outfit === "armor") {
    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(torsoWidth + 0.25, 2.2, 0.22), trim);
    chestPlate.position.set(0, 6.15, 0.92);
    chestPlate.castShadow = true;
    group.add(chestPlate);
  }

  const head = new THREE.Mesh(new THREE.SphereGeometry(1.25, 24, 18), skin);
  head.position.y = 8.65;
  head.castShadow = true;
  group.add(head);

  addHair(group, avatar.hairStyle || "short", hair);

  if (options.bandanaColor) {
    const bandana = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.26, 12, 28),
      new THREE.MeshStandardMaterial({ color: options.bandanaColor, roughness: 0.74 }),
    );
    bandana.position.y = 9.05;
    bandana.rotation.x = Math.PI / 2;
    group.add(bandana);
  }

  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), eyes);
  leftEye.position.set(-0.42, 8.72, 1.08);
  group.add(leftEye);

  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), eyes);
  rightEye.position.set(0.42, 8.72, 1.08);
  group.add(rightEye);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.55, 14), skin);
  neck.position.y = 7.45;
  neck.castShadow = true;
  group.add(neck);

  const leftArm = addLimb(group, -2.25 * buildScale, 5.9, 0, 0.45 * buildScale, 2.5, skin, -0.15);
  const rightArm = addLimb(group, 2.25 * buildScale, 5.9, 0, 0.45 * buildScale, 2.5, skin, 0.15);
  const leftLeg = addLimb(group, -0.85 * buildScale, 2.45, 0, 0.55 * buildScale, 3.8, pants, 0.04);
  const rightLeg = addLimb(group, 0.85 * buildScale, 2.45, 0, 0.55 * buildScale, 3.8, pants, -0.04);

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.28 * buildScale, 10, 10), skin);
  leftHand.position.set(0, -2.75, 0);
  leftArm.add(leftHand);

  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.28 * buildScale, 10, 10), skin);
  rightHand.position.set(0, -2.75, 0);
  rightArm.add(rightHand);

  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(1.05 * buildScale, 0.42, 1.25), boots);
  leftBoot.position.set(0, -3.85, 0.14);
  leftBoot.castShadow = true;
  leftLeg.add(leftBoot);

  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(1.05 * buildScale, 0.42, 1.25), boots);
  rightBoot.position.set(0, -3.85, 0.14);
  rightBoot.castShadow = true;
  rightLeg.add(rightBoot);

  const belt = new THREE.Mesh(new THREE.BoxGeometry(3.4 * buildScale, 0.38, 1.75), boots);
  belt.position.y = 3.7;
  belt.castShadow = true;
  group.add(belt);

  avatarParts.leftArm = leftArm;
  avatarParts.rightArm = rightArm;
  avatarParts.leftLeg = leftLeg;
  avatarParts.rightLeg = rightLeg;
  avatarParts.leftHand = leftHand;
  avatarParts.rightHand = rightHand;
  avatarParts.torso = torso;
  avatarParts.head = head;
  group.userData.parts = avatarParts;

  if (showSword) {
    const sword = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 0.22), metal);
    sword.position.set(2.55, 4.7, -0.55);
    sword.rotation.z = -0.62;
    sword.castShadow = true;
    group.add(sword);

    const swordHandle = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.22, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x5b351e, roughness: 0.75 }),
    );
    swordHandle.position.set(1.35, 6.1, -0.55);
    swordHandle.rotation.z = -0.62;
    group.add(swordHandle);

    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), metal);
    pommel.position.set(1.1, 5.2, -0.55);
    group.add(pommel);
  }

  if (showName) {
    const nameLabel = makeLabel(avatar.name, 0.95);
    nameLabel.position.y = 11.2;
    group.add(nameLabel);
  }

  group.scale.set(buildScale, heightScale, buildScale);
  return group;
}

function addHair(group, style, material) {
  if (style === "spiky") {
    for (let i = 0; i < 7; i += 1) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.05, 8), material);
      spike.position.set(-0.9 + i * 0.3, 9.45 + Math.sin(i) * 0.1, -0.05 + Math.cos(i) * 0.18);
      spike.rotation.z = -0.45 + i * 0.15;
      spike.castShadow = true;
      group.add(spike);
    }
    return;
  }

  if (style === "cap") {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1.34, 24, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), material);
    cap.position.y = 9.05;
    cap.castShadow = true;
    group.add(cap);

    const brim = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.16, 0.7), material);
    brim.position.set(0, 8.92, 1.2);
    brim.castShadow = true;
    group.add(brim);
    return;
  }

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(1.32, 24, 10, 0, Math.PI * 2, 0, Math.PI * 0.58), material);
  hairCap.position.y = 9.0;
  hairCap.castShadow = true;
  group.add(hairCap);
}

function addLimb(group, x, y, z, radius, height, material, lean) {
  const limbGroup = new THREE.Group();
  limbGroup.position.set(x, y, z);
  limbGroup.rotation.z = lean;

  const limb = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.9, height, 14), material);
  limb.position.y = -height / 2;
  limb.castShadow = true;
  limbGroup.add(limb);

  group.add(limbGroup);
  return limbGroup;
}

function createStatButtons() {
  ui.statsList.innerHTML = "";
  Object.keys(player.stats).forEach((stat) => {
    const row = document.createElement("div");
    row.className = "stat-line";
    row.innerHTML = `<span>${statLabels[stat]}: <strong data-stat-value="${stat}">0</strong></span>`;
    const button = document.createElement("button");
    button.textContent = "+";
    button.addEventListener("click", () => spendPoint(stat));
    row.append(button);
    ui.statsList.append(row);
  });
}

function spendPoint(stat) {
  if (player.statPoints <= 0) return;
  player.statPoints -= 1;
  player.stats[stat] += 1;
  updateDerivedStats();
  updateHud();
}

function updateDerivedStats(avatar = getSelectedAvatar()) {
  const oldMax = player.maxHealth;
  const traits = getAvatarTraits(avatar);
  player.maxHealth = Math.round((100 + player.stats.defense * 20) * traits.healthMultiplier);
  player.health = Math.min(player.maxHealth, player.health + Math.max(0, player.maxHealth - oldMax));
  player.maxStamina = Math.round(100 * clamp(traits.speedMultiplier + traits.healthMultiplier * 0.2, 0.82, 1.28));
  player.stamina = Math.min(player.stamina, player.maxStamina);
}

function loop(time) {
  const dt = Math.min(0.033, (time - (loop.lastTime || time)) / 1000);
  loop.lastTime = time;
  const stepDt = hitStopTimer > 0 ? dt * 0.12 : dt;
  hitStopTimer = Math.max(0, hitStopTimer - dt);

  if (gameStarted) {
    updatePlayer(stepDt);
    updateEnemies(stepDt);
    updateHazards(stepDt);
    updateProjectiles(stepDt);
    updateCombatEffects(stepDt);
    updateInteractionPrompt();
    updateTeleport(stepDt);
    updateCamera();
    updateBossHud();
  } else {
    const drift = Math.sin(time * 0.00035) * 7;
    camera.position.set(350 + drift, 210, 560);
    camera.lookAt(0, STARTER_SURFACE_Y + 24, 0);
  }

  updateWorldAnimations(time);
  ocean.material.color.offsetHSL(0, 0, Math.sin(time * 0.001) * 0.0008);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
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
}

function updatePlayer(dt) {
  const previousPosition = playerMesh.position.clone();
  const input = new THREE.Vector3(
    Number(keys.has("KeyD") || keys.has("ArrowRight")) - Number(keys.has("KeyA") || keys.has("ArrowLeft")),
    0,
    Number(keys.has("KeyS") || keys.has("ArrowDown")) - Number(keys.has("KeyW") || keys.has("ArrowUp")),
  );

  if (input.lengthSq() > 0) {
    input.normalize();
    const forward = new THREE.Vector3(Math.sin(cameraYaw), 0, Math.cos(cameraYaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    const move = forward.multiplyScalar(input.z).add(right.multiplyScalar(input.x)).normalize();
    const staminaFactor = player.stamina <= 1 && player.movementMode === "sprint" ? 0.78 : 1;
    const modeSpeed = player.movementMode === "sprint" ? 1.55 : 0.72;
    const swimSpeed = player.isSwimming ? 0.54 : 1;
    const speed = 95 * getAvatarTraits().speedMultiplier * modeSpeed * staminaFactor * swimSpeed;
    playerMesh.position.addScaledVector(move, dt * speed);
    player.lastMoveSpeed = speed * input.length();
    playerMesh.rotation.y = Math.atan2(move.x, move.z);
    resolveWallCollision(previousPosition);
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
    playerMesh.position.y = island.surfaceY + 0.15;
    updateIslandArrival(island);
    updateJump(dt);
  }
  updateStamina(dt, input.lengthSq() > 0);
  updatePlayerAnimation(dt);

  attackCooldown = Math.max(0, attackCooldown - dt);
  wallHitCooldown = Math.max(0, wallHitCooldown - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
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

function resolveWallCollision(previousPosition) {
  const collision = getWallCollision(playerMesh.position);
  if (!collision) return;

  const hitDirection = playerMesh.position.clone().sub(collision.center).setY(0);
  if (hitDirection.lengthSq() < 0.001) {
    hitDirection.copy(playerMesh.position.clone().sub(previousPosition).setY(0).multiplyScalar(-1));
  }
  hitDirection.normalize();
  playerMesh.position.copy(previousPosition);
  playerMesh.position.addScaledVector(hitDirection, 2.5);

  const impactDamage = calculateImpactDamage({
    speed: player.lastMoveSpeed,
    verticalVelocity: 0,
    material: collision.material,
    toughness: collision.toughness,
    baseDamage: collision.damage ?? 10,
  });

  if (impactDamage > 0 && wallHitCooldown <= 0) {
    applyImpactDamage(impactDamage, playerMesh.position.clone(), hitDirection, collision.label);
    wallHitCooldown = 0.75;
    updateHud();
    if (player.health <= 0) {
      player.health = player.maxHealth;
      playerMesh.position.set(0, STARTER_SURFACE_Y + 0.15, 0);
      updateHud();
      log("You crashed into a wall and were returned to the island dock.");
    }
  } else {
    triggerWallHitAnimation(hitDirection, collision.label, false);
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
  triggerWallHitAnimation(direction, label, amount > 0);
  createFloatingText(position, `-${amount}`, "#ff6b4a");
  if (amount >= 18) {
    createDustCloud(position);
    log(`Major impact with ${label}: ${amount} damage.`);
  } else {
    log(`${label} impact: ${amount} damage.`);
  }
}

function getWallCollision(position) {
  return collisionVolumes.find((volume) => {
    const flat = new THREE.Vector2(position.x - volume.center.x, position.z - volume.center.z);
    return flat.length() < volume.radius;
  });
}

function triggerWallHitAnimation(direction, label, showDamage = true) {
  const anim = playerMesh.userData.animation || {};
  anim.wallHitTimer = 0.28;
  anim.wallHitDuration = 0.28;
  anim.wallHitDirection = direction.clone();
  playerMesh.userData.animation = anim;
  createWallHitEffect(playerMesh.position.clone(), showDamage);
  log(showDamage ? `You bumped into ${label} and took 10 damage.` : `${label} blocks the way.`);
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
  const anim = playerMesh.userData.animation || { walkPhase: 0, attackTimer: 0, attackDuration: 0.22 };
  const moving = keys.has("KeyW") || keys.has("KeyA") || keys.has("KeyS") || keys.has("KeyD");

  if (moving) {
    anim.walkPhase += dt * 6;
  } else {
    anim.walkPhase += dt * 1.2;
  }

  anim.attackTimer = Math.max(0, anim.attackTimer - dt);
  anim.wallHitTimer = Math.max(0, (anim.wallHitTimer || 0) - dt);
  const walkIntensity = moving ? 1 : 0.08;
  const armSwing = Math.sin(anim.walkPhase + Math.PI) * 0.55 * walkIntensity;
  const legSwing = Math.sin(anim.walkPhase) * 1.1 * walkIntensity;
  const bodyBob = Math.sin(anim.walkPhase * 2) * 0.08 * walkIntensity;

  model.userData.parts.leftArm.rotation.x = -0.2 + armSwing;
  model.userData.parts.rightArm.rotation.x = -0.2 - armSwing;
  model.userData.parts.leftLeg.rotation.x = 0.1 + legSwing;
  model.userData.parts.rightLeg.rotation.x = 0.1 - legSwing;
  model.userData.parts.head.position.y = 8.65 + bodyBob * 0.6;
  model.userData.parts.torso.position.y = 5.7 + bodyBob;

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

function jump() {
  if (!gameStarted || !isGrounded) return;
  verticalVelocity = 58;
  isGrounded = false;
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

function updateJump(dt) {
  if (!isGrounded || jumpOffset > 0) {
    verticalVelocity -= 138 * dt;
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
      jumpOffset = 0;
      verticalVelocity = 0;
      player.lastFallVelocity = 0;
      isGrounded = true;
    }
  }
  playerMesh.position.y += jumpOffset;
}

function updateEnemies(dt) {
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
      const speed = enemy.type === "brute" ? 18 : enemy.type === "buggy" ? 42 : enemy.type === "pirate" ? 36 : 26;
      if (enemy.type === "pirate" && enemy.ai.dodge <= 0 && distance < 38) {
        const side = new THREE.Vector3(-direction.z, 0, direction.x).multiplyScalar(Math.random() > 0.5 ? 1 : -1);
        enemy.mesh.position.addScaledVector(side, dt * 80);
        enemy.ai.dodge = 1.2;
      } else {
        enemy.mesh.position.addScaledVector(direction, dt * speed);
      }
      enemy.mesh.rotation.y = Math.atan2(direction.x, direction.z);
      if ((enemy.type === "pirate" || enemy.type === "buggy") && enemy.ai.rush <= 0 && distance < 58) {
        enemy.mesh.position.addScaledVector(direction, 18);
        enemy.ai.rush = enemy.type === "buggy" ? 1.6 : 2.8;
        createSwordSlash({ mesh: playerMesh });
        damagePlayer(enemy.type === "buggy" ? 18 : 12, "Rapid Rush");
      }
      if ((enemy.type === "pirate" || enemy.type === "buggy") && enemy.ai.slash <= 0 && distance < 135) {
        createAirSlash(enemy.mesh.position.clone().setY(enemy.mesh.position.y + 7), direction, enemy);
        enemy.ai.slash = enemy.type === "buggy" ? 2.1 : 3.3;
      }
      if (enemy.type === "brute" && enemy.ai.slam <= 0 && distance < 44) {
        createGroundSlam(enemy.mesh.position.clone(), enemy);
        enemy.ai.slam = 4.5;
      }
    }
    if (distance < 7 && enemy.hitTimer <= 0) {
      damagePlayer(Math.round((enemy.type === "brute" ? 18 : enemy.type === "buggy" ? 22 : 8) * getAvatarTraits().incomingDamageMultiplier), enemy.type === "brute" ? "mace hit" : "enemy strike");
      enemy.hitTimer = 1.0;
      updateHud();
    }
  });
}

function damagePlayer(amount, source) {
  const block = player.isBlocking ? 0.45 : 1;
  const haki = player.haki.active ? Math.max(0.35, 1 - player.haki.level * 0.1) : 1;
  const finalDamage = Math.max(1, Math.round(amount * block * haki));
  player.health = Math.max(0, player.health - finalDamage);
  cameraShake = Math.max(cameraShake, finalDamage / 25);
  createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `-${finalDamage}`, "#ff6b4a");
  if (player.health <= 0) {
    player.health = player.maxHealth;
    playerMesh.position.set(0, STARTER_SURFACE_Y + 0.15, 0);
    jumpOffset = 0;
    verticalVelocity = 0;
    isGrounded = true;
    log(`You were knocked out by ${source} and returned to the island dock.`);
  }
}

function updateCamera() {
  const targetYaw = shiftLockEnabled ? playerMesh.rotation.y : cameraYaw;
  const distance = 58;
  const horizontalDistance = Math.cos(cameraPitch) * distance;
  const height = 14 + Math.sin(cameraPitch) * distance;
  const island = getIslandUnderPlayer();
  const floorY = (island ? island.surfaceY : OCEAN_SURFACE_Y) + 4.5;
  const offset = new THREE.Vector3(
    Math.sin(targetYaw) * horizontalDistance,
    Math.max(height, floorY - playerMesh.position.y),
    Math.cos(targetYaw) * horizontalDistance,
  );
  camera.position.lerp(playerMesh.position.clone().add(offset), 0.12);
  if (camera.position.y < floorY) camera.position.y = floorY;
  if (cameraShake > 0) {
    camera.position.x += (Math.random() - 0.5) * cameraShake;
    camera.position.y += (Math.random() - 0.5) * cameraShake * 0.65;
    camera.position.z += (Math.random() - 0.5) * cameraShake;
    cameraShake = Math.max(0, cameraShake - 0.08);
  }
  camera.lookAt(playerMesh.position.x, playerMesh.position.y + 7, playerMesh.position.z);
  if (shiftLockEnabled) {
    cameraYaw = targetYaw;
  }
}

function updateInteractionPrompt() {
  nearbyInteractable = null;
  for (const item of interactables) {
    if (item.mesh.position.distanceTo(playerMesh.position) < 22) {
      nearbyInteractable = item;
      break;
    }
  }

  if (nearbyInteractable) {
    promptBox.textContent = nearbyInteractable.prompt;
    promptBox.classList.remove("hidden");
  } else {
    promptBox.classList.add("hidden");
  }
}

function interact() {
  if (!nearbyInteractable) return;
  if (nearbyInteractable.type === "quest") {
    if (quest.complete) {
      log("The starter quest is complete. Bigger islands are waiting across the First Sea.");
      return;
    }
    quest.active = true;
    log("Quest accepted: defeat 5 bandits on Starter Island.");
    updateHud();
  } else if (nearbyInteractable.type === "boat") {
    showBoatMenu();
  } else if (nearbyInteractable.type === "questHub") {
    showQuestDialogue();
  } else if (nearbyInteractable.type === "hakiTrainer") {
    purchaseHaki();
  } else if (nearbyInteractable.type === "sword") {
    if (player.hasSword) {
      log("You already own a blade. Press 2 to equip the sword.");
      return;
    }
    const cost = 120;
    const ironwoodCost = 3;
    if (player.money >= cost && player.materials.ironwood >= ironwoodCost) {
      player.money -= cost;
      player.materials.ironwood -= ironwoodCost;
      player.hasSword = true;
      updateHud();
      renderInventory();
      log(`Starter Blade purchased for $${cost} and ${ironwoodCost} ironwood. Open Inventory to equip it.`);
    } else {
      log(`Starter Blade requires $${cost} and ${ironwoodCost} ironwood. Defeat bandits for materials.`);
    }
  } else if (nearbyInteractable.type === "teleporter") {
    playerMesh.position.copy(nearbyInteractable.destination);
    jumpOffset = 0;
    verticalVelocity = 0;
    isGrounded = true;
    createWallHitEffect(playerMesh.position.clone(), false);
    log("Teleported to Jungle Island.");
  }
}

function showQuestDialogue() {
  if (!dialoguePanel || !questOptions) return;
  dialoguePanel.classList.remove("hidden");
  dialogueTitle.textContent = "Outpost Quest Hub";
  dialogueDetail.textContent = "Only one major quest can be active. Pick a contract and preview its reward.";
  questOptions.innerHTML = "";
  Object.values(questCatalog).forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quest-option";
    button.innerHTML = `<strong>${entry.title}</strong><span>Level ${entry.minLevel}+ | ${entry.detail}</span><small>Reward: $${entry.rewardMoney}, ${entry.rewardXp} XP</small>`;
    button.addEventListener("click", () => acceptMajorQuest(entry.id));
    questOptions.append(button);
  });
}

function hideQuestDialogue() {
  dialoguePanel?.classList.add("hidden");
}

function acceptMajorQuest(id) {
  const template = questCatalog[id];
  if (!template) return;
  if (player.level < template.minLevel) {
    log(`${template.title} recommends level ${template.minLevel}. Train more before accepting.`);
    return;
  }
  activeQuest = { ...template, defeated: 0, active: true };
  hideQuestDialogue();
  updateHud();
  log(`Quest accepted: ${activeQuest.title}.`);
}

function purchaseHaki() {
  if (player.haki.unlocked) {
    log("You already know Armament Haki. Press H or use the Haki button to toggle it.");
    return;
  }
  if (player.level < 60) {
    log("The Haki Trainer refuses: reach level 60 before training.");
    return;
  }
  if (player.money < 3500) {
    log("Armament Haki training costs $3500.");
    return;
  }
  player.money -= 3500;
  player.haki.unlocked = true;
  player.haki.level = 1;
  player.haki.nextKills = 8;
  player.haki.active = true;
  hakiToggle?.classList.add("active");
  applyHakiVisuals();
  updateHud();
  log("Armament Haki Level 1 unlocked.");
}

function attack() {
  if (!gameStarted || attackCooldown > 0) return;
  attackCooldown = player.weapon === "gun" ? 0.55 : 0.42;
  if (playerMesh?.userData?.animation) {
    playerMesh.userData.animation.attackTimer = playerMesh.userData.animation.attackDuration;
  }

  const traits = getAvatarTraits();
  const range = (player.weapon === "gun" ? 85 : 11) * traits.rangeMultiplier;
  const damage = getDamage();
  const target = enemies
    .filter((enemy) => enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) <= range)
    .sort((a, b) => a.mesh.position.distanceTo(playerMesh.position) - b.mesh.position.distanceTo(playerMesh.position))[0];

  if (playerMesh?.userData?.animation) {
    playerMesh.userData.animation.attackImpact = target ? 1 : 0.3;
  }
  createCombatEffect(player.weapon, target);

  if (!target) {
    log(`${weaponName()} attack missed.`);
    return;
  }

  target.health -= damage;
  target.mesh.scale.setScalar(1.08);
  setTimeout(() => target.mesh.scale.setScalar(1), 90);
  log(`${weaponName()} hit a bandit for ${damage} damage.`);

  if (target.health <= 0) {
    defeatEnemy(target);
  }
}

function addTimedEffect(mesh, duration, update) {
  scene.add(mesh);
  combatEffects.push({ mesh, duration, age: 0, update });
}

function updateCombatEffects(dt) {
  for (let i = combatEffects.length - 1; i >= 0; i -= 1) {
    const effect = combatEffects[i];
    effect.age += dt;
    const progress = clamp(effect.age / effect.duration, 0, 1);
    effect.update(effect.mesh, progress, dt);
    if (progress >= 1) {
      scene.remove(effect.mesh);
      combatEffects.splice(i, 1);
    }
  }
}

function createCombatEffect(weapon, target) {
  if (weapon === "sword") {
    createSwordSlash(target);
    return;
  }
  if (weapon === "gun") {
    createGunShot(target);
    return;
  }
  if (weapon === "special") {
    createSpecialBurst(target);
    return;
  }
  createMeleeBurst(target);
}

function createWallHitEffect(position, showDamage) {
  const color = showDamage ? 0xff3f2f : 0x7ce0b4;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(5.8, 0.34, 10, 48),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.88 }),
  );
  ring.position.copy(position);
  ring.position.y += 5;
  ring.rotation.x = Math.PI / 2;
  addTimedEffect(ring, 0.32, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2.4);
    mesh.material.opacity = 0.88 * (1 - progress);
  });

  if (!showDamage) return;
  for (let i = 0; i < 8; i += 1) {
    const chip = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
      new THREE.MeshBasicMaterial({ color: 0xff8a3d, transparent: true, opacity: 0.95 }),
    );
    const angle = (i / 8) * Math.PI * 2;
    const direction = new THREE.Vector3(Math.cos(angle), 0.35, Math.sin(angle)).normalize();
    chip.position.copy(position);
    chip.position.y += 4;
    addTimedEffect(chip, 0.38, (mesh, progress, dt) => {
      mesh.position.addScaledVector(direction, dt * 42);
      mesh.material.opacity = 0.95 * (1 - progress);
      mesh.rotation.x += dt * 8;
      mesh.rotation.y += dt * 7;
    });
  }
}

function getAttackDirection(target) {
  if (target) {
    return target.mesh.position.clone().sub(playerMesh.position).setY(0).normalize();
  }
  return new THREE.Vector3(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y)).normalize();
}

function createMeleeBurst(target) {
  const direction = getAttackDirection(target);
  const origin = playerMesh.position.clone().add(direction.clone().multiplyScalar(8));
  origin.y += 4.2;

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.22, 8, 40),
    new THREE.MeshBasicMaterial({ color: 0xffcf5a, transparent: true, opacity: 0.78 }),
  );
  ring.position.copy(origin);
  ring.rotation.x = Math.PI / 2;
  addTimedEffect(ring, 0.28, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2.7);
    mesh.material.opacity = 0.78 * (1 - progress);
  });

  for (let i = 0; i < 7; i += 1) {
    const spark = new THREE.Mesh(
      new THREE.SphereGeometry(0.7 + (i % 2) * 0.25, 8, 6),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0xff7a3d : 0xfff0a0, transparent: true, opacity: 0.95 }),
    );
    const side = new THREE.Vector3(-direction.z, 0, direction.x).multiplyScalar((i - 3) * 1.5);
    spark.position.copy(origin).add(side);
    addTimedEffect(spark, 0.34, (mesh, progress, dt) => {
      mesh.position.addScaledVector(direction, dt * 32);
      mesh.position.y += dt * (14 - progress * 24);
      mesh.material.opacity = 0.95 * (1 - progress);
      mesh.scale.setScalar(1 + progress * 1.4);
    });
  }
}

function createSwordSlash(target) {
  const direction = getAttackDirection(target);
  const slash = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeSlashTexture(),
      color: 0xdaf6ff,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    }),
  );
  slash.position.copy(playerMesh.position).add(direction.clone().multiplyScalar(10));
  slash.position.y += 6.4;
  slash.scale.set(18, 10, 1);
  addTimedEffect(slash, 0.24, (mesh, progress) => {
    mesh.position.addScaledVector(direction, 0.9);
    mesh.material.opacity = 0.95 * (1 - progress);
    mesh.scale.set(18 + progress * 16, 10 + progress * 7, 1);
    mesh.material.rotation = -0.7 + progress * 0.55;
  });
}

function createGunShot(target) {
  const direction = getAttackDirection(target);
  const start = playerMesh.position.clone().add(direction.clone().multiplyScalar(5));
  start.y += 6;
  const end = target ? target.mesh.position.clone() : start.clone().add(direction.clone().multiplyScalar(80));
  end.y += target ? 5 : 0;
  const midpoint = start.clone().lerp(end, 0.5);
  const length = start.distanceTo(end);

  const tracer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, length, 8),
    new THREE.MeshBasicMaterial({ color: 0x9defff, transparent: true, opacity: 0.85 }),
  );
  tracer.position.copy(midpoint);
  tracer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
  addTimedEffect(tracer, 0.18, (mesh, progress) => {
    mesh.material.opacity = 0.85 * (1 - progress);
    mesh.scale.set(1, 1, 1 + progress * 0.12);
  });

  const muzzle = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 14, 10),
    new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.85 }),
  );
  muzzle.position.copy(start);
  addTimedEffect(muzzle, 0.16, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2);
    mesh.material.opacity = 0.85 * (1 - progress);
  });
}

function createSpecialBurst(target) {
  const direction = getAttackDirection(target);
  const origin = playerMesh.position.clone();
  origin.y += 5.3;

  const aura = new THREE.Mesh(
    new THREE.SphereGeometry(6, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xa775ff, transparent: true, opacity: 0.28, wireframe: true }),
  );
  aura.position.copy(origin);
  addTimedEffect(aura, 0.52, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 4.2);
    mesh.rotation.y += 0.08;
    mesh.material.opacity = 0.28 * (1 - progress);
  });

  for (let i = 0; i < 5; i += 1) {
    const boltDirection = direction.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), (i - 2) * 0.22);
    const bolt = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 28 + i * 3),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0x7ce0b4 : 0xd7b7ff, transparent: true, opacity: 0.8 }),
    );
    bolt.position.copy(origin).add(boltDirection.clone().multiplyScalar(16 + i * 2));
    bolt.rotation.y = Math.atan2(boltDirection.x, boltDirection.z);
    addTimedEffect(bolt, 0.38, (mesh, progress) => {
      mesh.position.addScaledVector(boltDirection, 1.2);
      mesh.material.opacity = 0.8 * (1 - progress);
      mesh.scale.set(1 + progress * 1.5, 1 + progress * 1.5, 1 + progress * 0.35);
    });
  }
}

function createJungleArrivalEffect(island) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(78, 2.2, 10, 80),
    new THREE.MeshBasicMaterial({ color: 0x78e3b2, transparent: true, opacity: 0.9 }),
  );
  ring.position.copy(playerMesh.position);
  ring.position.y = island.surfaceY + 3;
  ring.rotation.x = Math.PI / 2;
  addTimedEffect(ring, 1.1, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 4.8);
    mesh.material.opacity = 0.9 * (1 - progress);
  });
}

function makeSlashTexture() {
  if (makeSlashTexture.texture) return makeSlashTexture.texture;
  const slashCanvas = document.createElement("canvas");
  slashCanvas.width = 256;
  slashCanvas.height = 128;
  const ctx = slashCanvas.getContext("2d");
  const gradient = ctx.createLinearGradient(24, 98, 232, 20);
  gradient.addColorStop(0, "rgba(124, 224, 180, 0)");
  gradient.addColorStop(0.22, "rgba(124, 224, 180, 0.82)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.8, "rgba(157, 239, 255, 0.82)");
  gradient.addColorStop(1, "rgba(157, 239, 255, 0)");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(24, 96);
  ctx.quadraticCurveTo(116, 12, 232, 28);
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.stroke();
  makeSlashTexture.texture = new THREE.CanvasTexture(slashCanvas);
  return makeSlashTexture.texture;
}

function createAirSlash(position, direction, enemy) {
  const projectile = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeSlashTexture(),
      color: enemy.type === "buggy" ? 0xff4668 : 0x9defff,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    }),
  );
  projectile.position.copy(position);
  projectile.scale.set(16, 8, 1);
  scene.add(projectile);
  projectiles.push({ mesh: projectile, direction: direction.clone(), speed: enemy.type === "buggy" ? 118 : 92, damage: enemy.type === "buggy" ? 24 : 14, age: 0, duration: 1.8 });
}

function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = projectiles[i];
    projectile.age += dt;
    projectile.mesh.position.addScaledVector(projectile.direction, projectile.speed * dt);
    projectile.mesh.material.rotation += dt * 7;
    if (projectile.mesh.position.distanceTo(playerMesh.position) < 8) {
      damagePlayer(projectile.damage, "Air Slash");
      scene.remove(projectile.mesh);
      projectiles.splice(i, 1);
      continue;
    }
    if (projectile.age >= projectile.duration) {
      scene.remove(projectile.mesh);
      projectiles.splice(i, 1);
    }
  }
}

function createGroundSlam(position, enemy) {
  cameraShake = Math.max(cameraShake, 1.2);
  createDustCloud(position);
  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2;
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 22, 5),
      new THREE.MeshStandardMaterial({ color: 0x6b5f54, roughness: 0.95, flatShading: true }),
    );
    spike.position.copy(position).add(new THREE.Vector3(Math.cos(angle) * 22, 9, Math.sin(angle) * 22));
    spike.rotation.z = Math.sin(i) * 0.25;
    spike.castShadow = true;
    scene.add(spike);
    hazards.push({ mesh: spike, damage: enemy.type === "brute" ? 20 : 28, radius: 8, age: 0, duration: 3.4 });
  }
}

function updateHazards(dt) {
  for (let i = hazards.length - 1; i >= 0; i -= 1) {
    const hazard = hazards[i];
    hazard.age += dt;
    const scale = hazard.age < 0.25 ? hazard.age / 0.25 : 1;
    hazard.mesh.scale.setScalar(scale);
    if (hazard.mesh.position.distanceTo(playerMesh.position) < hazard.radius && wallHitCooldown <= 0) {
      applyImpactDamage(hazard.damage, playerMesh.position.clone(), playerMesh.position.clone().sub(hazard.mesh.position).normalize(), "rock spikes");
      wallHitCooldown = 0.8;
    }
    if (hazard.age >= hazard.duration) {
      scene.remove(hazard.mesh);
      hazards.splice(i, 1);
    }
  }
}

function createFloatingText(position, text, color = "#fff7e6") {
  const label = makeLabel(text, 0.72);
  label.position.copy(position);
  label.material.color = new THREE.Color(color);
  addTimedEffect(label, 0.75, (mesh, progress) => {
    mesh.position.y += 0.22;
    mesh.material.opacity = 1 - progress;
  });
}

function createDustCloud(position) {
  for (let i = 0; i < 10; i += 1) {
    const dust = new THREE.Mesh(
      new THREE.SphereGeometry(1.8 + (i % 3), 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xb99b72, transparent: true, opacity: 0.34 }),
    );
    const angle = i * 1.7;
    const dir = new THREE.Vector3(Math.cos(angle), 0.15, Math.sin(angle)).normalize();
    dust.position.copy(position).add(new THREE.Vector3(0, 2, 0));
    scene.add(dust);
    addTimedEffect(dust, 0.55, (mesh, progress, dt) => {
      mesh.position.addScaledVector(dir, dt * 38);
      mesh.scale.setScalar(1 + progress * 2);
      mesh.material.opacity = 0.34 * (1 - progress);
    });
  }
}

function createSplashEffect(position) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.18, 8, 36),
    new THREE.MeshBasicMaterial({ color: 0x9defff, transparent: true, opacity: 0.7 }),
  );
  ring.position.copy(position);
  ring.position.y = OCEAN_SURFACE_Y + 0.15;
  ring.rotation.x = Math.PI / 2;
  addTimedEffect(ring, 0.38, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2.4);
    mesh.material.opacity = 0.7 * (1 - progress);
  });
}

function createBubbleEffect(position) {
  const bubble = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xcff8ff, transparent: true, opacity: 0.45 }),
  );
  bubble.position.copy(position);
  addTimedEffect(bubble, 1.1, (mesh, progress) => {
    mesh.position.y += 0.18;
    mesh.material.opacity = 0.45 * (1 - progress);
  });
}

function applyHakiVisuals() {
  const model = playerMesh?.children?.[0];
  const parts = model?.userData?.parts;
  if (!parts) return;
  const covered = player.haki.active ? ["rightArm", "leftArm", "torso", "rightLeg", "leftLeg", "head"].slice(0, Math.min(6, player.haki.level + 1)) : [];
  Object.entries(parts).forEach(([name, mesh]) => {
    if (!mesh.material) return;
    if (!mesh.userData.baseColor) mesh.userData.baseColor = mesh.material.color.clone();
    if (covered.includes(name)) {
      mesh.material.color.set(player.haki.level >= 5 ? 0x050505 : 0x181a1e);
      mesh.material.emissive?.set(player.haki.level >= 4 ? 0x1a0f3a : 0x000000);
      mesh.material.emissiveIntensity = player.haki.level >= 4 ? 0.25 : 0;
    } else {
      mesh.material.color.copy(mesh.userData.baseColor);
      if (mesh.material.emissive) mesh.material.emissive.set(0x000000);
      mesh.material.emissiveIntensity = 0;
    }
  });
}

function updateBossHud() {
  const boss = enemies.find((enemy) => enemy.type === "buggy" && enemy.alive);
  if (!boss || boss.mesh.position.distanceTo(playerMesh.position) > 260) {
    bossBar?.classList.add("hidden");
    return;
  }
  bossBar?.classList.remove("hidden");
  if (bossName) bossName.textContent = "Buggy the Clown Captain";
  if (bossHealthBar) bossHealthBar.style.width = `${Math.max(0, (boss.health / boss.maxHealth) * 100)}%`;
}

function getDamage() {
  const traits = getAvatarTraits();
  const hakiBonus = player.haki.active ? 1 + player.haki.level * 0.12 : 1;
  if (player.weapon === "sword") return Math.round((12 + player.stats.sword * 5) * traits.damageMultiplier * hakiBonus);
  if (player.weapon === "gun") return Math.round((9 + player.stats.gun * 4) * traits.damageMultiplier * hakiBonus);
  if (player.weapon === "special") return Math.round((20 + player.stats.special * 7) * traits.damageMultiplier * hakiBonus);
  return Math.round((10 + player.stats.melee * 5) * traits.damageMultiplier * hakiBonus);
}

function weaponName() {
  if (player.weapon === "special") return "Special ability";
  return statLabels[player.weapon];
}

function defeatBandit(enemy) {
  defeatEnemy(enemy);
}

function defeatEnemy(enemy) {
  enemy.alive = false;
  enemy.mesh.visible = false;
  enemy.respawnTimer = enemy.type === "buggy" ? 999 : 6;
  const xpReward = enemy.type === "buggy" ? 9000 : enemy.type === "brute" ? 950 : enemy.type === "pirate" ? 520 : 18;
  const moneyReward = enemy.type === "buggy" ? 4200 : enemy.type === "brute" ? 95 : enemy.type === "pirate" ? 62 : 12;
  addXp(xpReward);
  player.money += moneyReward;
  player.materials.ironwood += enemy.type ? 2 : 1;
  player.materials.scrap += enemy.type === "brute" ? 3 : 1;

  if (quest.active && !quest.complete) {
    quest.defeated += 1;
    if (quest.defeated >= quest.target) {
      completeQuest();
    }
  }
  if (activeQuest?.active && (!activeQuest.targetType || activeQuest.targetType === enemy.type)) {
    activeQuest.defeated += 1;
    if (activeQuest.defeated >= activeQuest.target) completeMajorQuest();
  }
  if (player.haki.active && player.haki.unlocked) {
    player.haki.kills += 1;
    if (player.haki.level < 5 && player.haki.kills >= player.haki.nextKills) {
      player.haki.kills = 0;
      player.haki.level += 1;
      player.haki.nextKills *= 2;
      applyHakiVisuals();
      log(`Armament Haki reached Level ${player.haki.level}.`);
    }
  }
  if (enemy.type === "buggy") {
    bossBar?.classList.add("hidden");
    player.materials.jungleCore += 2;
    log("Buggy defeated: massive XP, cash, and rare cores acquired.");
  }

  updateHud();
  renderInventory();
}

function completeMajorQuest() {
  if (!activeQuest) return;
  player.money += activeQuest.rewardMoney;
  addXp(activeQuest.rewardXp);
  log(`Quest complete: ${activeQuest.title}. +$${activeQuest.rewardMoney}, +${activeQuest.rewardXp} XP.`);
  activeQuest.active = false;
  activeQuest = null;
}

function completeQuest() {
  quest.complete = true;
  quest.active = false;
  const moneyReward = player.faction === "Pirates" ? Math.round(quest.rewardMoney * 1.15) : quest.rewardMoney;
  player.money += moneyReward;
  addXp(quest.rewardXp);
  player.specialUnlocked = true;
  player.stats.special = Math.max(1, player.stats.special);
  player.materials.jungleCore += 1;
  log(`Quest complete: +$${moneyReward}, +${quest.rewardXp} XP. Special abilities unlocked on key 4.`);
  renderInventory();
}

function addXp(amount) {
  player.xp += amount;
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level += 1;
    player.statPoints += 3;
    player.xpToNext = Math.round(player.xpToNext * 1.35);
    player.health = player.maxHealth;
    log(`Level up! You reached level ${player.level} and gained 3 stat points.`);
  }
}

function updateHud() {
  const traits = getAvatarTraits();
  ui.playerTitle.textContent = `${getSelectedAvatar().name} | ${player.faction} ${player.level >= 4 ? "Captain" : "Rookie"}`;
  ui.level.textContent = `Level ${player.level} | ${weaponName()} | ${traits.label}`;
  ui.healthText.textContent = `${player.health}/${player.maxHealth}`;
  ui.healthBar.style.width = `${(player.health / player.maxHealth) * 100}%`;
  ui.xpText.textContent = `${player.xp}/${player.xpToNext}`;
  ui.xpBar.style.width = `${(player.xp / player.xpToNext) * 100}%`;
  if (ui.staminaText) ui.staminaText.textContent = `${Math.round(player.stamina)}/${player.maxStamina}`;
  if (ui.staminaBar) ui.staminaBar.style.width = `${(player.stamina / player.maxStamina) * 100}%`;
  ui.money.textContent = `$${player.money} | Wood ${player.materials.ironwood} | Scrap ${player.materials.scrap} | Core ${player.materials.jungleCore}`;
  if (ui.sea) ui.sea.textContent = hasReachedJungle ? "Jungle Island" : "First Sea";
  ui.points.textContent = `${player.statPoints} points`;

  if (activeQuest?.active) {
    ui.questTitle.textContent = `${activeQuest.title} | Haki ${player.haki.level || 0}`;
    ui.questDetail.textContent = `${activeQuest.detail} Progress: ${activeQuest.defeated}/${activeQuest.target}. Haki kills: ${player.haki.kills}/${player.haki.nextKills}.`;
  } else if (quest.complete) {
    ui.questTitle.textContent = "Starter Island Cleared";
    ui.questDetail.textContent = `Special ability unlocked. Haki ${player.haki.unlocked ? `Lv ${player.haki.level}` : "locked until level 60 Desert training"}.`;
  } else if (quest.active) {
    ui.questTitle.textContent = "Bandit Trouble";
    ui.questDetail.textContent = `Defeat bandits: ${quest.defeated}/${quest.target}. Reward: $${quest.rewardMoney}, ${quest.rewardXp} XP.`;
  } else {
    ui.questTitle.textContent = "Find the Quest Giver";
    ui.questDetail.textContent = "Walk to the gold Quest NPC on Starter Island and press E.";
  }

  Object.keys(player.stats).forEach((stat) => {
    const value = document.querySelector(`[data-stat-value="${stat}"]`);
    if (value) value.textContent = player.stats[stat];
  });

  document.querySelectorAll(".stat-line button").forEach((button) => {
    button.disabled = player.statPoints <= 0;
  });
}

function log(message) {
  messageLog.textContent = message;
}

function makeIrregularCylinderGeometry(radius, height, segments, seed) {
  const positions = [];
  const indices = [];
  const topCenterIndex = 0;
  const bottomCenterIndex = 1;
  positions.push(0, height / 2, 0, 0, -height / 2, 0);

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const topRadius = islandProfileRadius(angle, radius * 0.9, seed);
    const bottomRadius = islandProfileRadius(angle + 0.08, radius, seed + 2);
    const ledge = Math.sin(angle * 11 + seed) * 1.4;
    positions.push(Math.cos(angle) * topRadius, height / 2 + ledge, Math.sin(angle) * topRadius);
    positions.push(Math.cos(angle) * bottomRadius, -height / 2, Math.sin(angle) * bottomRadius);
  }

  for (let i = 0; i < segments; i += 1) {
    const next = (i + 1) % segments;
    const topA = 2 + i * 2;
    const bottomA = topA + 1;
    const topB = 2 + next * 2;
    const bottomB = topB + 1;

    indices.push(topA, bottomA, topB, topB, bottomA, bottomB);
    indices.push(topCenterIndex, topB, topA);
    indices.push(bottomCenterIndex, bottomA, bottomB);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeIrregularDiscGeometry(radius, segments, seed) {
  const positions = [0, 0, 0];
  const indices = [];

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const edgeRadius = islandProfileRadius(angle, radius, seed);
    const rise = Math.sin(angle * 9 + seed) * 0.7 + Math.cos(angle * 17) * 0.35;
    positions.push(Math.cos(angle) * edgeRadius, Math.sin(angle) * edgeRadius, rise);
  }

  for (let i = 1; i <= segments; i += 1) {
    const next = i === segments ? 1 : i + 1;
    indices.push(0, i, next);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeIrregularRingGeometry(innerRadius, outerRadius, segments, seed) {
  const positions = [];
  const indices = [];

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const inner = islandProfileRadius(angle + 0.12, innerRadius, seed + 1);
    const outer = islandProfileRadius(angle, outerRadius, seed);
    const ripple = Math.sin(angle * 15 + seed) * 0.3;
    positions.push(Math.cos(angle) * inner, Math.sin(angle) * inner, ripple);
    positions.push(Math.cos(angle) * outer, Math.sin(angle) * outer, -ripple);
  }

  for (let i = 0; i < segments; i += 1) {
    const next = (i + 1) % segments;
    const innerA = i * 2;
    const outerA = innerA + 1;
    const innerB = next * 2;
    const outerB = innerB + 1;
    indices.push(innerA, outerA, innerB, innerB, outerA, outerB);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function islandProfileRadius(angle, radius, seed) {
  const longCurve = Math.sin(angle * 3 + seed) * 0.13;
  const cove = Math.cos(angle * 5 - seed * 0.7) * 0.08;
  const chips = Math.sin(angle * 13 + seed * 1.4) * 0.035;
  return radius * (1 + longCurve + cove + chips);
}

function makeLabel(text, scale = 1) {
  const canvasLabel = document.createElement("canvas");
  canvasLabel.width = 256;
  canvasLabel.height = 96;
  const ctx = canvasLabel.getContext("2d");
  ctx.fillStyle = "rgba(7, 28, 38, 0.72)";
  roundRect(ctx, 10, 16, 236, 60, 18);
  ctx.fill();
  ctx.fillStyle = "#fff7e6";
  ctx.font = "bold 30px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText(text, 128, 56);

  const texture = new THREE.CanvasTexture(canvasLabel);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(5 * scale, 1.9 * scale, 1);
  return sprite;
}

function makeCapsuleMesh(radius, height, material) {
  const group = new THREE.Group();
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 16), material);
  const top = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 10), material);
  const bottom = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 10), material);

  cylinder.castShadow = true;
  top.castShadow = true;
  bottom.castShadow = true;
  top.position.y = height / 2;
  bottom.position.y = -height / 2;

  group.add(cylinder, top, bottom);
  return group;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

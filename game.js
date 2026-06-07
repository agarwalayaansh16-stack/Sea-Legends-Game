// Procedural Sound Manager using browser Web Audio API
const audio = {
  ctx: null,
  enabled: false,
  volume: 0.5,
  masterGain: null,
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      
      const originalConnect = AudioNode.prototype.connect;
      const self = this;
      AudioNode.prototype.connect = function(destination, output, input) {
        if (destination === self.ctx.destination) {
          return originalConnect.call(this, self.masterGain, output, input);
        }
        return originalConnect.call(this, destination, output, input);
      };

      this.enabled = true;
      this.playFanfare();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  },
  setVolume(val) {
    this.volume = clamp(val, 0, 1);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  },
  playSlash() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(8000, ctx.currentTime + 0.1);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  },
  playShot() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
  },
  playImpact() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(20, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },
  playHaki() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(440, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(220, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.35);
  },
  playLevelUp() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  },
  playQuestComplete() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const chord = [392.00, 493.88, 587.33, 783.99];
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    });
  },
  playSpecial() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  },
  playFanfare() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.12, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.22);
    });
  },
  playCoinChime() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.08); // E6
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  }
};

let skillCooldowns = {};

const masterySkills = {
  melee: [
    { key: "Z", id: "falcon-punch", name: "Falcon Punch", req: 5, cd: 4, desc: "Active: A very hard punch going 24 units far in the direction you face." },
    { key: "X", id: "ground-slam", name: "Ground Slam", req: 20, cd: 8, desc: "Active: Slam the ground dealing massive AOE damage around you." }
  ],
  defense: [
    { name: "Perfect Parry", req: 5, desc: "Passive: Blocking within 0.2s of attack reflects 40% damage." },
    { name: "Iron Bastion", req: 20, desc: "Passive: Blocking slowly regenerates +3.5 health/second." }
  ],
  sword: [
    { key: "Z", id: "piercing-thrust", name: "Piercing Thrust", req: 5, cd: 5, desc: "Active: A long-range piercing dash strike that bypasses block." },
    { key: "X", id: "cyclone-spin", name: "Cyclone Spin", req: 20, cd: 7, desc: "Active: Spin your sword rapidly, dealing AOE damage to nearby foes." }
  ],
  gun: [
    { key: "Z", id: "double-tap", name: "Double Tap", req: 5, cd: 4, desc: "Active: Quickly fire two high-damage sniper shots." },
    { key: "X", id: "buckshot-cone", name: "Buckshot Cone", req: 20, cd: 6, desc: "Active: Fire a wide cone of 5 bullets spreading outwards." }
  ],
  special: [
    { key: "Z", id: "pulse-bubble", name: "Pulse Bubble", req: 5, cd: 6, desc: "Active: Unleash an expanding shockwave pushing enemies away." },
    { key: "X", id: "gods-judgment", name: "God's Judgment", req: 20, cd: 40, desc: "Active: Summon a massive cosmic energy blast dealing colossal AOE damage." }
  ]
};

// Day-Night & Weather states
let timeOfDay = 8.0;
let weatherActive = false;
let weatherTimer = 100.0;
let rainParticles = null;

// Sailing states
let isHelming = false;
let boatVelocity = 0;
let boatYaw = 0;

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
const controlsToggle = document.querySelector("#controls-toggle");
const questToggle = document.querySelector("#quest-toggle");
const walkToggle = document.querySelector("#walk-toggle");
const sprintToggle = document.querySelector("#sprint-toggle");
const hakiToggle = document.querySelector("#haki-toggle");
const settingsBar = document.querySelector("#settings-bar");
const settingsCollapseButton = document.querySelector("#settings-collapse-button");
const inventoryButton = document.querySelector("#nav-btn-items");
const statsCard = document.querySelector(".stats-card");
const topLeftMenuBtn = document.querySelector("#top-left-menu-btn");
const navBtnStats = document.querySelector("#nav-btn-stats");
const navBtnShop = document.querySelector("#nav-btn-shop");
const navBtnClose = document.querySelector("#nav-btn-close");
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
  
  combatHud: document.querySelector("#combat-hud"),
  combatWeaponIcon: document.querySelector("#combat-weapon-icon"),
  combatWeaponName: document.querySelector("#combat-weapon-name"),
  combatMasteryLabel: document.querySelector("#combat-mastery-label"),
  combatMasteryBar: document.querySelector("#combat-mastery-bar"),
  combatMasteryText: document.querySelector("#combat-mastery-text"),
  combatSkillsList: document.querySelector("#combat-skills-list"),
  
  questCompass: document.querySelector("#quest-compass"),
  compassPointer: document.querySelector("#compass-pointer"),
  compassLabel: document.querySelector("#compass-label"),
  lowHealthOverlay: document.querySelector("#low-health-overlay"),
  respawnButton: document.querySelector("#respawn-button"),
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
  selectedId: "tavern-hero",
  avatars: [
    {
      id: "tavern-hero",
      name: "Tavern Hero",
      skin: "#eed2b8",
      shirt: "#223745",
      pants: "#4d4637",
      hair: "#8e4e24",
      eyes: "#1f3c5b",
      boots: "#3d2616",
      hairStyle: "messy",
      outfit: "adventurer",
      height: 100,
      build: 100,
    },
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
  mastery: {
    melee: 20,
    defense: 20,
    sword: 20,
    gun: 20,
    special: 20,
  },
  armoredWillCooldown: 0,
  blockStartTime: 0,
  shieldTimer: 0,
  weapon: "melee",
  hasSword: false,
  hasGun: false,
  specialUnlocked: false,
  unlockedQuestsSeen: { starter: true },
  newQuestUnlocked: false,
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
const lootDrops = [];
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
let escMenuOpen = false;
const perfState = {
  visible: false,
  showPing: true,
  memHistory: [],
  cpuHistory: [],
  gpuHistory: [],
  pingHistory: [],
  lastUpdateTime: 0,
  frameCount: 0,
};
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
  if (inventoryState.open) {
    statsCard?.classList.add("hidden");
    navBtnStats?.classList.remove("active");
  }
  renderInventory();
});

inventoryCloseButton?.addEventListener("click", () => {
  inventoryState.open = false;
  renderInventory();
});

topLeftMenuBtn?.addEventListener("click", () => {
  toggleEscMenu();
});

navBtnStats?.addEventListener("click", () => {
  if (!statsCard) return;
  const isHidden = statsCard.classList.contains("hidden");
  if (isHidden) {
    statsCard.classList.remove("hidden");
    navBtnStats.classList.add("active");
    inventoryState.open = false;
    renderInventory();
  } else {
    statsCard.classList.add("hidden");
    navBtnStats.classList.remove("active");
  }
});

navBtnShop?.addEventListener("click", () => {
  log("Shop Guidelines: Walk up to a Shop Sign (like Boat Shop or Sword Shop) and press E to interact and purchase items.");
});

navBtnClose?.addEventListener("click", () => {
  statsCard?.classList.add("hidden");
  navBtnStats?.classList.remove("active");
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
  q: "KeyA",
};
const allowedMovementCodes = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"]);

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    event.preventDefault();
    toggleEscMenu();
    return;
  }
  if (escMenuOpen) return;
  if (!gameStarted || player.health <= 0) return;
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
    player.blockStartTime = performance.now();
  }
  if (code === "KeyQ") {
    dash();
  }
  if (code === "KeyZ") {
    event.preventDefault();
    executeSkillByKey("Z");
  }
  if (code === "KeyX") {
    event.preventDefault();
    executeSkillByKey("X");
  }
  if (code === "KeyC") {
    event.preventDefault();
    executeSkillByKey("C");
  }
  if (code === "KeyV") {
    event.preventDefault();
    executeSkillByKey("V");
  }
  if (code === "KeyB") {
    event.preventDefault();
    executeSkillByKey("B");
  }
  if (code === "KeyG") {
    toggleHelm();
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
  if (escMenuOpen) return;
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
  if (escMenuOpen) return;
  if (player.health <= 0) return;
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
  if (escMenuOpen) return;
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

controlsToggle?.addEventListener("change", () => {
  const showControls = controlsToggle.checked;
  const controlsPanel = document.querySelector(".controls");
  if (controlsPanel) {
    controlsPanel.classList.toggle("hidden", !showControls);
  }
});

questToggle?.addEventListener("change", () => {
  const showQuest = questToggle.checked;
  const questCard = document.querySelector(".quest-card");
  const questCompass = document.querySelector("#quest-compass");
  if (questCard) {
    questCard.classList.toggle("hidden", !showQuest);
  }
  if (questCompass) {
    questCompass.classList.toggle("hidden", !showQuest);
  }
});

walkToggle?.addEventListener("click", () => setMovementMode("walk"));
sprintToggle?.addEventListener("click", () => setMovementMode("sprint"));
hakiToggle?.addEventListener("click", toggleHaki);
dialogueClose?.addEventListener("click", hideQuestDialogue);

ui.respawnButton?.addEventListener("click", () => {
  player.health = player.maxHealth;
  playerMesh.position.set(0, STARTER_SURFACE_Y + 0.15, 0);
  jumpOffset = 0;
  verticalVelocity = 0;
  isGrounded = true;
  if (ui.lowHealthOverlay) {
    ui.lowHealthOverlay.classList.remove("low", "defeated");
  }
  updateHud();
  log("You respawned at the starter dock.");
});

window.addEventListener("pointerdown", () => {
  if (player.health <= 0) return;
  audio.init();
}, { once: true });

function startGame(faction) {
  audio.init();
  player.faction = faction;
  if (faction === "Marines") {
    player.stats.defense += 1;
  }
  saveSelectedAvatar();
  factionScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  gameStarted = true;
  checkNewQuestUnlocks();
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
  audio.playHaki();
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
          const val = player.mastery[stat];
          const skills = masterySkills[stat];
          return `
            <div class="mastery-card" style="border: 1px solid rgba(255,247,230,0.15); border-radius: 14px; padding: 12px; background: rgba(5,18,26,0.85); box-shadow: 0 4px 10px rgba(0,0,0,0.4); text-shadow: none;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <strong style="color: var(--gold); text-transform: uppercase; font-size: 13px;">${statLabels[stat]} Mastery</strong>
                <span style="color: #7ce0b4; font-weight: bold; font-size: 12px;">Lv. ${Math.floor(val / 100) + 1} (${val} MP)</span>
              </div>
              <div class="bar" style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; margin-bottom: 10px;">
                <div style="height: 100%; width: ${Math.min(100, (val % 100))}%; background: linear-gradient(90deg, #7ce0b4, #0d7892); transition: width 0.3s ease;"></div>
              </div>
              <div class="mastery-skills" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 6px;">
                ${skills.map(skill => {
                  const unlocked = val >= skill.req;
                  return `
                    <div style="border: 1px solid ${unlocked ? "rgba(124,224,180,0.3)" : "rgba(255,255,255,0.05)"}; border-radius: 10px; padding: 6px; background: ${unlocked ? "rgba(124,224,180,0.06)" : "rgba(0,0,0,0.25)"}; text-align: center; font-size: 10px;">
                      <strong style="color: ${unlocked ? "#7ce0b4" : "rgba(255,255,255,0.45)"}; display: block; margin-bottom: 2px; font-size: 11px;">${skill.name}</strong>
                      <small style="color: rgba(255,247,230,0.45); display: block; margin-bottom: 4px;">Req: ${skill.req} MP</small>
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

  const starterIsland = islands[0];
  const qgY = getIslandSurfaceHeightAt(52, 16, starterIsland);
  createQuestGiver(new THREE.Vector3(52, qgY, 16));
  
  const bdY = getIslandSurfaceHeightAt(-460, 60, starterIsland);
  createBoatDealer(new THREE.Vector3(-460, bdY, 60));
  
  const sdY = getIslandSurfaceHeightAt(48, 104, starterIsland);
  createSwordDealer(new THREE.Vector3(48, sdY, 104));
  
  createCrossingDock();
  
  const tel1Y = getIslandSurfaceHeightAt(438, -310, starterIsland);
  createTeleporter(new THREE.Vector3(438, tel1Y, -310), new THREE.Vector3(islands[1].position.x - 620, islands[1].surfaceY + 0.15, islands[1].position.z + 430));
  
  const tel2Y = getIslandSurfaceHeightAt(-380, -360, starterIsland);
  createTeleporter(new THREE.Vector3(-380, tel2Y, -360), new THREE.Vector3(islands[2].position.x + 160, islands[2].surfaceY + 0.15, islands[2].position.z + 120));
  
  createBanditCamp();
  
  const oqgPos = islands[2].position.clone().add(new THREE.Vector3(-80, 0, 40));
  oqgPos.y = getIslandSurfaceHeightAt(oqgPos.x, oqgPos.z, islands[2]);
  createOutpostQuestGiver(oqgPos);
  
  const htPos = islands[3].position.clone().add(new THREE.Vector3(70, 0, -60));
  htPos.y = getIslandSurfaceHeightAt(htPos.x, htPos.z, islands[3]);
  createHakiTrainer(htPos);
  
  spawnPirateCamp(islands[2]);
  spawnBruteCamp(islands[2]);
  
  const buggyPos = islands[2].position.clone().add(new THREE.Vector3(260, 0, -220));
  buggyPos.y = getIslandSurfaceHeightAt(buggyPos.x, buggyPos.z, islands[2]);
  spawnBuggyBoss(buggyPos);
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
    makeIrregularDiscGeometry(radius * 0.88, index <= 1 ? 128 : 40, index + 9, height),
    new THREE.MeshStandardMaterial({ color: index === 0 ? 0x3fb05b : index === 1 ? 0x1f6f3a : 0x4aa65e, roughness: 0.78, metalness: 0.05 }),
  );
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = height + 0.16;
  grass.receiveShadow = true;
  grass.castShadow = true;
  group.add(grass);

  if (index === 0) {
    addStarterIslandDetails(group, radius, height, index);
  }
  if (index === 1) {
    addJungleIslandDetails(group, radius, height);
  }
  if (index === 2) {
    addOutpostIslandDetails(group, radius, height, index);
  }
  if (index === 3) {
    addDesertIslandDetails(group, radius, height, index);
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

  const tx = -radius * 0.12;
  const tz = radius * 0.08;
  const tY = getLocalSurfaceHeightAt(tx, tz, radius, height, 1);
  
  const treehouseTree = createJungleTree(230, 20);
  treehouseTree.position.set(tx, tY + 0.1, tz);
  group.add(treehouseTree);

  const treehouse = createTreehouse();
  treehouse.position.set(tx, tY + 145, tz);
  treehouse.rotation.y = 0.45;
  group.add(treehouse);

  for (let i = 0; i < 180; i += 1) {
    const angle = i * 2.399;
    const distance = radius * (0.08 + ((i * 37) % 76) / 100);
    const trx = Math.cos(angle) * distance;
    const trz = Math.sin(angle) * distance;
    const trY = getLocalSurfaceHeightAt(trx, trz, radius, height, 1);
    const tree = createJungleTree(120 + (i % 7) * 18, 10 + (i % 5) * 2.2);
    tree.position.set(trx, trY + 0.1, trz);
    tree.rotation.y = angle;
    group.add(tree);
  }

  for (let i = 0; i < 260; i += 1) {
    const angle = i * 1.618;
    const distance = radius * (0.06 + ((i * 53) % 80) / 100);
    const bx = Math.cos(angle) * distance;
    const bz = Math.sin(angle) * distance;
    const bY = getLocalSurfaceHeightAt(bx, bz, radius, height, 1);
    const bush = createBigJungleBush(26 + (i % 6) * 7);
    bush.position.set(bx, bY + 1.2, bz);
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

function addOutpostIslandDetails(group, radius, height, index) {
  addBeachRing(group, radius, height, index);
  const dirt = new THREE.MeshStandardMaterial({ color: 0x8b7358, roughness: 0.96 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x5c5a54, roughness: 0.96, flatShading: true });
  const wood = new THREE.MeshStandardMaterial({ color: 0x68432c, roughness: 0.9 });

  [[0, 0, 520, 34, 0.6], [-160, 120, 380, 28, -0.35], [180, -160, 340, 28, 1.2]].forEach(([x, z, l, w, r]) => {
    const path = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, l), dirt);
    const pY = getLocalSurfaceHeightAt(x, z, radius, height, 2);
    path.position.set(x, pY + 0.6, z);
    path.rotation.y = r;
    group.add(path);
  });

  for (let i = 0; i < 18; i += 1) {
    const ruin = new THREE.Mesh(new THREE.BoxGeometry(26 + (i % 4) * 8, 24 + (i % 3) * 12, 18), stone);
    const angle = i * 1.17;
    const dist = radius * (0.18 + ((i * 41) % 54) / 100);
    const rx = Math.cos(angle) * dist;
    const rz = Math.sin(angle) * dist;
    const rY = getLocalSurfaceHeightAt(rx, rz, radius, height, 2);
    ruin.position.set(rx, rY + ruin.geometry.parameters.height / 2, rz);
    ruin.rotation.y = angle;
    ruin.castShadow = true;
    ruin.receiveShadow = true;
    group.add(ruin);
  }

  for (let i = 0; i < 9; i += 1) {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(10, 14, 58, 6), stone);
    const angle = i * 0.7;
    const dist = radius * 0.58;
    const tx = Math.cos(angle) * dist;
    const tz = Math.sin(angle) * dist;
    const tY = getLocalSurfaceHeightAt(tx, tz, radius, height, 2);
    tower.position.set(tx, tY + 29, tz);
    tower.castShadow = true;
    group.add(tower);
  }

  const dockX = -radius * 0.54;
  const dockZ = radius * 0.62;
  const dockY = getLocalSurfaceHeightAt(dockX, dockZ, radius, height, 2);
  const dock = new THREE.Mesh(new THREE.BoxGeometry(42, 2.5, 210), wood);
  dock.position.set(dockX, dockY + 1.2, dockZ);
  dock.rotation.y = -0.58;
  dock.castShadow = true;
  group.add(dock);
}

function addDesertIslandDetails(group, radius, height, index) {
  const sand = new THREE.Mesh(
    makeIrregularDiscGeometry(radius * 0.82, 96, 177, height),
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
    const ox = Math.cos(angle) * dist;
    const oz = Math.sin(angle) * dist;
    const oY = getLocalSurfaceHeightAt(ox, oz, radius, height, 3);
    obelisk.position.set(ox, oY + 24, oz);
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

function addStarterIslandDetails(group, radius, height, index) {
  addBeachRing(group, radius, height, index);
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
    const hY = getLocalSurfaceHeightAt(x, z, radius, height, 0);
    house.position.set(x, hY + 0.2, z);
    house.rotation.y = rotation;
    group.add(house);
    addCollisionCircle(new THREE.Vector3(x, hY, z), 28, "House wall");
  });

  for (let i = 0; i < 28; i += 1) {
    const angle = i * 0.72 + Math.sin(i * 1.9) * 0.16;
    const distance = radius * (0.58 + (i % 7) * 0.045);
    const palm = createPalmTree(18 + (i % 4) * 2.8);
    const px = Math.cos(angle) * distance;
    const pz = Math.sin(angle) * distance;
    const pY = getLocalSurfaceHeightAt(px, pz, radius, height, 0);
    palm.position.set(px, pY + 0.1, pz);
    palm.rotation.y = angle + Math.PI / 2;
    group.add(palm);
  }

  for (let i = 0; i < 34; i += 1) {
    const angle = i * 0.64 + Math.sin(i) * 0.2;
    const distance = radius * (0.52 + (i % 5) * 0.075);
    const rockSize = 7 + (i % 4) * 3;
    const rock = createRock(rockSize);
    const rx = Math.cos(angle) * distance;
    const rz = Math.sin(angle) * distance;
    const rY = getLocalSurfaceHeightAt(rx, rz, radius, height, 0);
    rock.position.set(rx, rY + 0.2, rz);
    rock.rotation.y = angle;
    group.add(rock);
    addCollisionCircle(new THREE.Vector3(rx, rY, rz), rockSize * 0.85, "Rock obstacle");
  }

  for (let i = 0; i < 46; i += 1) {
    const angle = i * 1.97;
    const distance = radius * (0.14 + ((i * 37) % 68) / 100);
    const tuft = createGrassTuft(3 + (i % 4));
    const tx = Math.cos(angle) * distance;
    const tz = Math.sin(angle) * distance;
    const tY = getLocalSurfaceHeightAt(tx, tz, radius, height, 0);
    tuft.position.set(tx, tY + 0.3, tz);
    tuft.rotation.y = angle;
    group.add(tuft);
  }

  for (let i = 0; i < 70; i += 1) {
    const angle = i * 2.31;
    const distance = radius * (0.18 + ((i * 29) % 62) / 100);
    const flowers = createFlowerPatch(i);
    const fx = Math.cos(angle) * distance;
    const fz = Math.sin(angle) * distance;
    const fY = getLocalSurfaceHeightAt(fx, fz, radius, height, 0);
    flowers.position.set(fx, fY + 0.45, fz);
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

    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    stall.position.set(x, hY + 0.3, z);
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
    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    item.position.set(x, hY + 6.5, z);
    item.rotation.y = index * 0.45;
    item.castShadow = true;
    item.receiveShadow = true;
    group.add(item);
    addCollisionCircle(new THREE.Vector3(x, hY, z), 8, "Supply stack");
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

    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    bed.position.set(x, hY + 0.5, z);
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

    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    fence.position.set(x, hY + 0.5, z);
    fence.rotation.y = rotation;
    group.add(fence);
    addCollisionCircle(new THREE.Vector3(x + Math.cos(rotation) * count * 6, hY, z - Math.sin(rotation) * count * 6), count * 8, "Fence");
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

    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    sign.position.set(x, hY + 0.4, z);
    sign.rotation.y = rotation;
    group.add(sign);
    addCollisionCircle(new THREE.Vector3(x, hY, z), 8, "Signpost");
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

  const hY = getLocalSurfaceHeightAt(224, 138, STARTER_RADIUS, height, 0);
  yard.position.set(208, hY + 0.3, 122);
  yard.rotation.y = -0.35;
  group.add(yard);
  addCollisionCircle(new THREE.Vector3(224, hY, 138), 36, "Training yard");
}

function addLookoutArch(group, height) {
  const stone = new THREE.MeshStandardMaterial({ color: 0x77736b, roughness: 0.96, flatShading: true });
  const positions = [
    [-34, 0, 0],
    [34, 0, 0],
  ];

  const archY = getLocalSurfaceHeightAt(-242, 112, STARTER_RADIUS, height, 0);
  positions.forEach(([x, y, z]) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(6, 8, 38, 10), stone);
    pillar.position.set(-242 + x, archY + 19 + y, 112 + z);
    pillar.castShadow = true;
    group.add(pillar);
    addCollisionCircle(new THREE.Vector3(-242 + x, archY, 112 + z), 10, "Lookout arch");
  });

  const lintel = new THREE.Mesh(new THREE.BoxGeometry(86, 12, 18), stone);
  lintel.position.set(-242, archY + 41, 112);
  lintel.rotation.z = 0.08;
  lintel.castShadow = true;
  group.add(lintel);

  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 16),
    new THREE.MeshStandardMaterial({ color: 0xf6b73c, side: THREE.DoubleSide, roughness: 0.6 }),
  );
  flag.position.set(-198, archY + 52, 112);
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
    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 22, 8), postMaterial);
    post.position.set(x, hY + 11, z);
    post.castShadow = true;
    group.add(post);

    const lantern = new THREE.Mesh(new THREE.SphereGeometry(3.2, 12, 8), glowMaterial);
    lantern.position.set(x, hY + 23, z);
    group.add(lantern);

    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 15),
      new THREE.MeshStandardMaterial({ color: bannerColors[index % bannerColors.length], side: THREE.DoubleSide, roughness: 0.72 }),
    );
    banner.position.set(x + 4, hY + 15, z);
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
    const cx = Math.cos(angle) * distance;
    const cz = Math.sin(angle) * distance;
    const cY = getLocalSurfaceHeightAt(cx, cz, radius, height, 0);
    crystal.position.set(cx, cY + 9, cz);
    crystal.rotation.z = -0.18 + (i % 4) * 0.1;
    crystal.castShadow = true;
    group.add(crystal);
  }
}

function addBeachRing(group, radius, height, index = 0) {
  const beach = new THREE.Mesh(
    makeIrregularRingGeometry(radius * 0.76, radius * 0.98, 128, 21, height, index, radius),
    new THREE.MeshStandardMaterial({ color: 0xe7c980, roughness: 0.92, side: THREE.DoubleSide }),
  );
  beach.rotation.x = -Math.PI / 2;
  beach.position.y = height;
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
    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    path.position.set(x, hY + 0.44, z);
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
  const pierY = getLocalSurfaceHeightAt(0, radius * 0.93, radius, height, 0);
  const pier = new THREE.Mesh(new THREE.BoxGeometry(32, 2.5, 170), wood);
  pier.position.set(0, pierY + 1.4, radius * 0.93);
  pier.castShadow = true;
  pier.receiveShadow = true;
  group.add(pier);

  for (let i = -3; i <= 3; i += 1) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.6, 18, 10), wood);
    const postX = i * 11;
    const postZ = radius * 0.78 + Math.abs(i % 2) * 35;
    const postY = getLocalSurfaceHeightAt(postX, postZ, radius, height, 0);
    post.position.set(postX, postY - 3, postZ);
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

  const pondY = getLocalSurfaceHeightAt(-138, -72, radius, height, 0);
  const pond = new THREE.Mesh(makeIrregularDiscGeometry(54, 42, 51), waterMaterial);
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(-138, pondY + 0.62, -72);
  group.add(pond);

  const streamY = getLocalSurfaceHeightAt(-184, -176, radius, height, 0);
  const stream = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 185), waterMaterial);
  stream.position.set(-184, streamY + 0.65, -176);
  stream.rotation.y = -0.42;
  group.add(stream);

  const waterfallY = getLocalSurfaceHeightAt(-247, -288, radius, height, 0);
  const waterfall = new THREE.Mesh(
    new THREE.PlaneGeometry(58, 58, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x9defff, transparent: true, opacity: 0.68, side: THREE.DoubleSide }),
  );
  waterfall.position.set(-247, waterfallY - 13, -288);
  waterfall.rotation.y = -0.42;
  group.add(waterfall);

  for (let i = 0; i < 10; i += 1) {
    const mist = new THREE.Mesh(
      new THREE.SphereGeometry(3 + (i % 3), 10, 8),
      new THREE.MeshStandardMaterial({ color: 0xd6fbff, transparent: true, opacity: 0.32 }),
    );
    const mx = -230 + Math.sin(i) * 24;
    const mz = -306 + Math.cos(i * 2) * 18;
    const mY = getLocalSurfaceHeightAt(mx, mz, radius, height, 0);
    mist.position.set(mx, mY + 1 + (i % 4), mz);
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
    const rockRadius = 3 + Math.random() * 4;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rockRadius, 0), rockMaterial);
    const angle = (i / rockCount) * Math.PI * 2 + Math.random() * 0.4;
    const distance = radius * (0.96 + Math.random() * 0.07);
    const rx = Math.cos(angle) * distance;
    const rz = Math.sin(angle) * distance;
    const ry = height * 0.02 + Math.random() * 1.1;
    rock.position.set(rx, ry, rz);
    rock.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.6);
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);

    // Add collision circle for boundary rock in global space
    const globalPos = group.position.clone().add(new THREE.Vector3(rx, ry, rz));
    addCollisionCircle(globalPos, rockRadius * 0.85, "Shore Rock");
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
    const px = Math.cos(angle) * 230;
    const pz = Math.sin(angle) * 230;
    const spawnPos = center.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "pirate");
  }
}

function spawnBruteCamp(island) {
  const center = island.position.clone().add(new THREE.Vector3(-260, 0, 210));
  for (let i = 0; i < 4; i += 1) {
    const angle = i * 1.5;
    const px = Math.cos(angle) * 150;
    const pz = Math.sin(angle) * 150;
    const spawnPos = center.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "brute");
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
  const enemyObj = {
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
  };
  if (isBoss) {
    enemyObj.parts = group.children[0]?.userData?.parts;
  }
  enemies.push(enemyObj);
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
  const leather = new THREE.MeshStandardMaterial({ color: "#5c3d21", roughness: 0.82 });
  const darkLeather = new THREE.MeshStandardMaterial({ color: "#362a22", roughness: 0.88 });

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
  leftEye.position.set(-0.42, 0.07, 1.08);
  head.add(leftEye);

  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), eyes);
  rightEye.position.set(0.42, 0.07, 1.08);
  head.add(rightEye);

  // Reddish mouth material for premium aesthetics
  const mouthMaterial = new THREE.MeshStandardMaterial({ color: "#5c1e28", roughness: 0.6 });
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 8, 16, Math.PI * 0.8), mouthMaterial);
  mouth.position.set(0, -0.35, 1.16);
  mouth.rotation.set(0.15, 0, Math.PI * 1.1); // Rotate to smile + align
  head.add(mouth);

  // Eyebrows matching hair color
  const leftEyebrow = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.12), hair);
  leftEyebrow.position.set(-0.42, 0.25, 1.14);
  leftEyebrow.rotation.set(0, 0, -0.12);
  head.add(leftEyebrow);

  const rightEyebrow = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.12), hair);
  rightEyebrow.position.set(0.42, 0.25, 1.14);
  rightEyebrow.rotation.set(0, 0, 0.12);
  head.add(rightEyebrow);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.55, 14), skin);
  neck.position.y = 7.45;
  neck.castShadow = true;
  group.add(neck);

  // Shirt collar/neck trim for professional detail
  const collarMaterial = avatar.outfit === "adventurer" ? leather : shirt;
  const collarGeo = avatar.outfit === "adventurer"
    ? new THREE.CylinderGeometry(0.56, 0.6, 0.48, 14, 1, true)
    : new THREE.TorusGeometry(0.55, 0.12, 8, 16);
  const collar = new THREE.Mesh(collarGeo, collarMaterial);
  if (avatar.outfit === "adventurer") {
    collar.position.y = 7.75;
  } else {
    collar.position.y = 7.65;
    collar.rotation.x = Math.PI / 2;
  }
  collar.castShadow = true;
  group.add(collar);

  const leftArm = addLimb(group, -2.25 * buildScale, 5.9, 0, 0.45 * buildScale, 2.5, skin, -0.15, shirt);
  const rightArm = addLimb(group, 2.25 * buildScale, 5.9, 0, 0.45 * buildScale, 2.5, skin, 0.15, shirt);
  const leftLeg = addLimb(group, -0.85 * buildScale, 2.45, 0, 0.55 * buildScale, 3.8, pants, 0.04);
  const rightLeg = addLimb(group, 0.85 * buildScale, 2.45, 0, 0.55 * buildScale, 3.8, pants, -0.04);

  // Armor accessories (shoulder pads, gauntlets) if wearing armor outfit
  if (avatar.outfit === "armor") {
    const leftPad = new THREE.Mesh(new THREE.BoxGeometry(1.25 * buildScale, 0.8, 1.25 * buildScale), trim);
    leftPad.position.set(0, -0.2, 0);
    leftPad.castShadow = true;
    leftArm.add(leftPad);

    const rightPad = new THREE.Mesh(new THREE.BoxGeometry(1.25 * buildScale, 0.8, 1.25 * buildScale), trim);
    rightPad.position.set(0, -0.2, 0);
    rightPad.castShadow = true;
    rightArm.add(rightPad);

    const leftGauntlet = new THREE.Mesh(new THREE.CylinderGeometry(0.55 * buildScale, 0.5 * buildScale, 0.95, 12), trim);
    leftGauntlet.position.set(0, -1.8, 0);
    leftGauntlet.castShadow = true;
    leftArm.add(leftGauntlet);

    const rightGauntlet = new THREE.Mesh(new THREE.CylinderGeometry(0.55 * buildScale, 0.5 * buildScale, 0.95, 12), trim);
    rightGauntlet.position.set(0, -1.8, 0);
    rightGauntlet.castShadow = true;
    rightArm.add(rightGauntlet);
  }

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

  // Boot cuffs trim for layered clothing feel
  const leftBootCuff = new THREE.Mesh(new THREE.BoxGeometry(1.15 * buildScale, 0.25, 1.35), trim);
  leftBootCuff.position.set(0, -3.65, 0.14);
  leftBootCuff.castShadow = true;
  leftLeg.add(leftBootCuff);

  const rightBootCuff = new THREE.Mesh(new THREE.BoxGeometry(1.15 * buildScale, 0.25, 1.35), trim);
  rightBootCuff.position.set(0, -3.65, 0.14);
  rightBootCuff.castShadow = true;
  rightLeg.add(rightBootCuff);

  const belt = new THREE.Mesh(new THREE.BoxGeometry(3.4 * buildScale, 0.38, 1.75), boots);
  belt.position.y = 3.7;
  belt.castShadow = true;
  group.add(belt);

  if (avatar.outfit === "adventurer") {
    // Harness / Shoulder Straps
    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 4.15, 1.76), leather);
    strapL.position.set(-0.82 * buildScale, 5.7, 0.02);
    strapL.castShadow = true;
    group.add(strapL);

    const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 4.15, 1.76), leather);
    strapR.position.set(0.82 * buildScale, 5.7, 0.02);
    strapR.castShadow = true;
    group.add(strapR);

    // Silver buckles on shoulder straps (front only)
    const buckleL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.12), metal);
    buckleL.position.set(-0.82 * buildScale, 6.8, 0.89);
    buckleL.castShadow = true;
    group.add(buckleL);

    const buckleR = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.12), metal);
    buckleR.position.set(0.82 * buildScale, 6.8, 0.89);
    buckleR.castShadow = true;
    group.add(buckleR);

    // Diagonal crossing chest strap
    const crossStrap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.8, 1.8), leather);
    crossStrap.position.set(0, 5.7, 0.05);
    crossStrap.rotation.z = -0.55;
    crossStrap.castShadow = true;
    group.add(crossStrap);

    // Backpack / Rolled bedroll on the back
    const backpack = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 3.4 * buildScale, 12), leather);
    backpack.position.set(0, 5.9, -1.25);
    backpack.rotation.z = Math.PI / 2;
    backpack.castShadow = true;
    group.add(backpack);

    // Backpack straps (vertical rings looping around bedroll)
    const bpStrapL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.45, 1.45), darkLeather);
    bpStrapL.position.set(-0.95 * buildScale, 5.9, -1.25);
    bpStrapL.castShadow = true;
    group.add(bpStrapL);

    const bpStrapR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.45, 1.45), darkLeather);
    bpStrapR.position.set(0.95 * buildScale, 5.9, -1.25);
    bpStrapR.castShadow = true;
    group.add(bpStrapR);

    // Hip Pouches (attached to belt)
    const pouchR = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.95, 0.52), leather);
    pouchR.position.set(1.68 * buildScale, 3.55, 0.38);
    pouchR.rotation.y = 0.25;
    pouchR.rotation.z = -0.15;
    pouchR.castShadow = true;
    group.add(pouchR);

    const satchelL = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.15, 0.62), leather);
    satchelL.position.set(-1.68 * buildScale, 3.42, 0.22);
    satchelL.rotation.y = -0.25;
    satchelL.rotation.z = 0.15;
    satchelL.castShadow = true;
    group.add(satchelL);

    // Fingerless gloves (adds cuff/bodies on hands)
    const gloveBodyL = new THREE.Mesh(new THREE.CylinderGeometry(0.52 * buildScale, 0.48 * buildScale, 0.72, 12), darkLeather);
    gloveBodyL.position.set(0, -0.05, 0);
    gloveBodyL.castShadow = true;
    leftHand.add(gloveBodyL);

    const gloveBodyR = new THREE.Mesh(new THREE.CylinderGeometry(0.52 * buildScale, 0.48 * buildScale, 0.72, 12), darkLeather);
    gloveBodyR.position.set(0, -0.05, 0);
    gloveBodyR.castShadow = true;
    rightHand.add(gloveBodyR);

    // Knee pads on legs
    const kneePadL = new THREE.Mesh(new THREE.BoxGeometry(0.85 * buildScale, 0.85, 0.35), darkLeather);
    kneePadL.position.set(0, -1.9, 0.58);
    kneePadL.castShadow = true;
    leftLeg.add(kneePadL);

    const kneePadR = new THREE.Mesh(new THREE.BoxGeometry(0.85 * buildScale, 0.85, 0.35), darkLeather);
    kneePadR.position.set(0, -1.9, 0.58);
    kneePadR.castShadow = true;
    rightLeg.add(kneePadR);

    // Boot Straps
    const bootStrapL = new THREE.Mesh(new THREE.BoxGeometry(1.18 * buildScale, 0.15, 0.45), leather);
    bootStrapL.position.set(0, -3.72, 0.42);
    bootStrapL.castShadow = true;
    leftLeg.add(bootStrapL);

    const bootStrapR = new THREE.Mesh(new THREE.BoxGeometry(1.18 * buildScale, 0.15, 0.45), leather);
    bootStrapR.position.set(0, -3.72, 0.42);
    bootStrapR.castShadow = true;
    rightLeg.add(bootStrapR);

    // Wooden Runic Staff attached to Left Arm
    const staffShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 7.8, 8), leather);
    staffShaft.position.set(0, -1.8, 0.45);
    staffShaft.castShadow = true;
    leftArm.add(staffShaft);

    // Curved top of staff
    const staffTop = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), leather);
    staffTop.position.set(0, 3.9, 0);
    staffShaft.add(staffTop);

    const staffHorn = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.11, 8, 16, Math.PI * 0.72), leather);
    staffHorn.position.set(0, 4.0, 0.15);
    staffHorn.rotation.x = Math.PI / 2;
    staffShaft.add(staffHorn);

    // Glowing Neon-Blue Runes
    const runeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const rune1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.06), runeMat);
    rune1.position.set(0, 3.0, 0.16);
    staffShaft.add(rune1);

    const rune2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.06), runeMat);
    rune2.position.set(0, 2.6, 0.16);
    staffShaft.add(rune2);

    const rune3 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.06), runeMat);
    rune3.position.set(0, 2.2, 0.16);
    staffShaft.add(rune3);
  }

  // Save eye references to userData for blinking animations
  group.userData.eyesList = [leftEye, rightEye];

  let halo;
  if (avatar.outfit !== "adventurer") {
    // Golden halo floating above head
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    halo = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.12, 8, 24), haloMat);
    halo.position.set(0, 10.6, 0);
    halo.rotation.x = Math.PI / 2;
    group.add(halo);
  }

  let cape;
  if (avatar.outfit !== "adventurer") {
    // Flowing royal cape on the back
    const capeColor = avatar.shirt || "#111111";
    const capeMat = new THREE.MeshStandardMaterial({
      color: capeColor,
      roughness: 0.85,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    cape = new THREE.Mesh(new THREE.BoxGeometry(2.8 * buildScale, 5.0, 0.15), capeMat);
    cape.position.set(0, 4.4, -0.92);
    cape.rotation.x = 0.12;
    cape.castShadow = true;
    group.add(cape);
  }

  avatarParts.leftArm = leftArm;
  avatarParts.rightArm = rightArm;
  avatarParts.leftLeg = leftLeg;
  avatarParts.rightLeg = rightLeg;
  avatarParts.leftHand = leftHand;
  avatarParts.rightHand = rightHand;
  avatarParts.torso = torso;
  avatarParts.head = head;
  if (halo) avatarParts.halo = halo;
  if (cape) avatarParts.cape = cape;
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

  if (style === "messy") {
    // Base hair cap covering top/back of head
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(1.35, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.58), material);
    hairCap.position.set(0, 9.0, -0.05);
    hairCap.castShadow = true;
    group.add(hairCap);

    // Front messy bangs hanging over face (fringe)
    const fringeCount = 5;
    for (let i = 0; i < fringeCount; i++) {
      const angle = -0.5 + (i / (fringeCount - 1)) * 1.0;
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.95, 6), material);
      const px = Math.sin(angle) * 0.95;
      const py = 9.15 - Math.abs(angle) * 0.15 + (i % 2 === 0 ? 0.05 : -0.05);
      const pz = 1.02 - Math.abs(angle) * 0.2;
      bang.position.set(px, py, pz);
      bang.rotation.x = Math.PI * 0.58;
      bang.rotation.y = -angle * 0.5;
      bang.rotation.z = -angle * 0.8 + 0.1 * Math.sin(i);
      bang.castShadow = true;
      group.add(bang);
    }

    // Top messy/wavy tufts pointing up/back/sides
    const tuftCount = 8;
    for (let i = 0; i < tuftCount; i++) {
      const theta = (i / tuftCount) * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.3;
      const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.15, 6), material);
      const px = Math.cos(theta) * r;
      const py = 9.7 + Math.random() * 0.25;
      const pz = Math.sin(theta) * r - 0.1;
      tuft.position.set(px, py, pz);
      tuft.rotation.x = (pz / 1.35) * 0.8 + 0.2;
      tuft.rotation.z = -(px / 1.35) * 0.8;
      tuft.rotation.y = Math.random() * Math.PI;
      tuft.castShadow = true;
      group.add(tuft);
    }

    // Sideburns
    const leftSide = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 6), material);
    leftSide.position.set(-1.18, 8.4, 0.45);
    leftSide.rotation.x = 0.1;
    leftSide.rotation.z = 0.18;
    leftSide.castShadow = true;
    group.add(leftSide);

    const rightSide = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 6), material);
    rightSide.position.set(1.18, 8.4, 0.45);
    rightSide.rotation.x = 0.1;
    rightSide.rotation.z = -0.18;
    rightSide.castShadow = true;
    group.add(rightSide);
    return;
  }

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(1.32, 24, 10, 0, Math.PI * 2, 0, Math.PI * 0.58), material);
  hairCap.position.y = 9.0;
  hairCap.castShadow = true;
  group.add(hairCap);
}

function addLimb(group, x, y, z, radius, height, material, lean, sleeveMaterial = null) {
  const limbGroup = new THREE.Group();
  limbGroup.position.set(x, y, z);
  limbGroup.rotation.z = lean;

  if (sleeveMaterial) {
    const sleeveHeight = height * 0.65;
    const forearmHeight = height * 0.35;

    // Sleeve part
    const sleeveGeo = new THREE.CylinderGeometry(radius, radius * 0.93, sleeveHeight, 14);
    const sleeve = new THREE.Mesh(sleeveGeo, sleeveMaterial);
    sleeve.position.y = -sleeveHeight / 2;
    sleeve.castShadow = true;
    limbGroup.add(sleeve);

    // Forearm part (skin)
    const forearmGeo = new THREE.CylinderGeometry(radius * 0.93, radius * 0.9, forearmHeight, 14);
    const forearm = new THREE.Mesh(forearmGeo, material);
    forearm.position.y = -sleeveHeight - forearmHeight / 2;
    forearm.castShadow = true;
    limbGroup.add(forearm);
  } else {
    const limb = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.9, height, 14), material);
    limb.position.y = -height / 2;
    limb.castShadow = true;
    limbGroup.add(limb);
  }

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
  const loopStart = performance.now();
  const dt = Math.min(0.033, (time - (loop.lastTime || time)) / 1000);
  loop.lastTime = time;
  const stepDt = hitStopTimer > 0 ? dt * 0.12 : dt;
  hitStopTimer = Math.max(0, hitStopTimer - dt);

  if (gameStarted) {
    // Day-Night progression (1 full cycle in 160 seconds)
    timeOfDay = (timeOfDay + stepDt * 0.15) % 24;
    updateDayNightLighting(stepDt);
    updateWeather(stepDt);

    updatePlayer(stepDt);
    updateEnemies(stepDt);
    updateHazards(stepDt);
    updateProjectiles(stepDt);
    updateCombatEffects(stepDt);
    updateInteractionPrompt();
    updateTeleport(stepDt);
    updateCamera();
    updateBossHud();

    // Update active skill cooldown timers
    let hasActiveCooldowns = false;
    Object.keys(skillCooldowns).forEach((id) => {
      if (skillCooldowns[id] > 0) {
        skillCooldowns[id] = Math.max(0, skillCooldowns[id] - stepDt);
        hasActiveCooldowns = true;
      }
    });

    // Update HUD & Compass state
    updateCompass();
    if (hasActiveCooldowns) {
      updateCombatHud();
    }
  } else {
    const drift = Math.sin(time * 0.00035) * 7;
    camera.position.set(350 + drift, 210, 560);
    camera.lookAt(0, STARTER_SURFACE_Y + 24, 0);
  }

  updateBlinking(stepDt);
  updateLootDrops(stepDt);
  updateWorldAnimations(time);
  ocean.material.color.offsetHSL(0, 0, Math.sin(time * 0.001) * 0.0008);
  
  const renderStart = performance.now();
  renderer.render(scene, camera);
  const frameGpuTime = performance.now() - renderStart;
  
  const loopEnd = performance.now();
  const frameCpuTime = loopEnd - loopStart;

  if (perfState.visible) {
    perfState.frameCount++;
    perfState.cpuHistory.push(frameCpuTime);
    perfState.gpuHistory.push(frameGpuTime);
    if (perfState.cpuHistory.length > 30) perfState.cpuHistory.shift();
    if (perfState.gpuHistory.length > 30) perfState.gpuHistory.shift();

    const now = performance.now();
    let memVal = 550;
    if (window.performance && window.performance.memory) {
      memVal = window.performance.memory.usedJSHeapSize / (1024 * 1024);
    } else {
      memVal = 580 + Math.sin(now * 0.0001) * 35 + Math.random() * 3;
    }
    perfState.memHistory.push(memVal);
    if (perfState.memHistory.length > 30) perfState.memHistory.shift();

    if (now - perfState.lastUpdateTime > 250) {
      updatePerfStatsUI(now);
      perfState.lastUpdateTime = now;
    }
  }

  requestAnimationFrame(loop);
}

function updateBlinking(dt) {
  scene.traverse((node) => {
    if (node.userData && node.userData.eyesList) {
      if (node.userData.blinkTimer === undefined) {
        node.userData.blinkTimer = 3.0 + Math.random() * 2.0;
        node.userData.isBlinking = false;
      }
      node.userData.blinkTimer -= dt;
      if (node.userData.blinkTimer <= 0) {
        if (!node.userData.isBlinking) {
          node.userData.isBlinking = true;
          node.userData.blinkTimer = 0.12; // blink duration
          node.userData.eyesList.forEach((eye) => {
            eye.scale.y = 0.001;
          });
        } else {
          node.userData.isBlinking = false;
          node.userData.blinkTimer = 2.5 + Math.random() * 3.5; // next blink delay
          node.userData.eyesList.forEach((eye) => {
            eye.scale.y = 1.0;
          });
        }
      }
    }
  });
}

function spawnLootCoins(position, totalValue) {
  let numCoins = 3;
  if (totalValue > 50) numCoins = 5;
  if (totalValue > 100) numCoins = 7;
  if (totalValue > 1000) numCoins = 15;

  const coinValue = Math.floor(totalValue / numCoins);
  const remainder = totalValue % numCoins;

  const coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.15, 8);
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.85,
    roughness: 0.18,
    flatShading: true,
  });

  for (let i = 0; i < numCoins; i += 1) {
    const coinMesh = new THREE.Mesh(coinGeo, coinMat);
    coinMesh.position.copy(position).add(new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      2 + Math.random() * 3,
      (Math.random() - 0.5) * 3,
    ));
    coinMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    coinMesh.castShadow = true;
    coinMesh.receiveShadow = true;
    scene.add(coinMesh);

    const vx = (Math.random() - 0.5) * 22;
    const vy = 15 + Math.random() * 18;
    const vz = (Math.random() - 0.5) * 22;

    const value = coinValue + (i === 0 ? remainder : 0);
    lootDrops.push({
      mesh: coinMesh,
      velocity: new THREE.Vector3(vx, vy, vz),
      value: value,
      bounceCount: 0,
    });
  }
}

function updateLootDrops(dt) {
  const magnetRange = 28;
  const collectRange = 4.5;
  const gravity = 58;
  const playerPos = playerMesh.position;

  for (let i = lootDrops.length - 1; i >= 0; i -= 1) {
    const coin = lootDrops[i];
    const mesh = coin.mesh;

    coin.velocity.y -= gravity * dt;
    mesh.position.addScaledVector(coin.velocity, dt);

    mesh.rotation.x += dt * 5;
    mesh.rotation.y += dt * 3;

    let surfaceY = OCEAN_SURFACE_Y;
    islands.forEach((isl) => {
      const dx = mesh.position.x - isl.position.x;
      const dz = mesh.position.z - isl.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= isl.radius) {
        surfaceY = getIslandSurfaceHeightAt(mesh.position.x, mesh.position.z, isl);
      }
    });

    if (mesh.position.y <= surfaceY + 0.15) {
      mesh.position.y = surfaceY + 0.15;
      if (coin.bounceCount < 3) {
        coin.velocity.y = -coin.velocity.y * 0.45;
        coin.velocity.x *= 0.65;
        coin.velocity.z *= 0.65;
        coin.bounceCount += 1;
      } else {
        coin.velocity.set(0, 0, 0);
      }
    }

    const distToPlayer = mesh.position.distanceTo(playerPos);

    if (distToPlayer < magnetRange) {
      const pullDir = playerPos.clone().sub(mesh.position).normalize();
      const pullSpeed = (1 - distToPlayer / magnetRange) * 140 + 20;
      coin.velocity.lerp(pullDir.multiplyScalar(pullSpeed), 0.22);
      mesh.position.addScaledVector(coin.velocity, dt);
    }

    if (distToPlayer < collectRange) {
      audio.playCoinChime();
      player.money += coin.value;
      createFloatingText(mesh.position.clone().add(new THREE.Vector3(0, 4, 0)), `+$${coin.value}`, "#ffd700");
      scene.remove(mesh);
      lootDrops.splice(i, 1);
      updateHud();
    }
  }
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
  if (player.health <= 0) {
    player.lastMoveSpeed = 0;
    return;
  }
  if (isHelming) {
    updateBoat(dt);
    return;
  }

  // Gatling Flurry rapid melee punches
  if (isPointerDown && player.weapon === "melee" && player.mastery.melee >= 500 && attackCooldown <= 0) {
    attack();
  }

  // Active parry Iron Bastion heal
  if (player.isBlocking && player.mastery.defense >= 200) {
    player.health = Math.min(player.maxHealth, player.health + dt * 3.5);
    if (Math.random() < 0.05) {
      createBubbleEffect(playerMesh.position.clone().add(new THREE.Vector3(0, 4, 0)));
    }
  }

  // Armored Will tick
  player.armoredWillCooldown = Math.max(0, player.armoredWillCooldown - dt);
  if (player.shieldTimer > 0) {
    player.shieldTimer -= dt;
    player.health = Math.max(player.health, 1);
    if (Math.random() < 0.15) {
      createWallHitEffect(playerMesh.position.clone().add(new THREE.Vector3(0, 4, 0)), false);
    }
  }

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

    // Sprint footstep dust VFX
    if (!player.isSwimming && player.movementMode === "sprint") {
      if (updatePlayer.lastDustTime === undefined) updatePlayer.lastDustTime = 0;
      const now = performance.now();
      if (now - updatePlayer.lastDustTime > 220) {
        createFootstepDustEffect(playerMesh.position.clone());
        updatePlayer.lastDustTime = now;
      }
    }
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
    playerMesh.position.y = getIslandSurfaceHeightAt(playerMesh.position.x, playerMesh.position.z, island) + 0.15;
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

  // Spawn visual white ripple rings around player while swimming
  const moving = keys.has("KeyW") || keys.has("KeyA") || keys.has("KeyS") || keys.has("KeyD");
  if (moving) {
    if (updateSwimming.lastRippleTime === undefined) updateSwimming.lastRippleTime = 0;
    const now = performance.now();
    if (now - updateSwimming.lastRippleTime > 380) {
      createSwimRippleEffect(playerMesh.position.clone(), 1.0);
      updateSwimming.lastRippleTime = now;
    }
  } else {
    if (updateSwimming.lastRippleTime === undefined) updateSwimming.lastRippleTime = 0;
    const now = performance.now();
    if (now - updateSwimming.lastRippleTime > 1100) {
      createSwimRippleEffect(playerMesh.position.clone(), 0.4);
      updateSwimming.lastRippleTime = now;
    }
  }
}

function createSwimRippleEffect(position, velocityMultiplier = 1.0) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.1, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 * velocityMultiplier })
  );
  ring.position.copy(position);
  ring.position.y = OCEAN_SURFACE_Y + 0.1;
  ring.rotation.x = Math.PI / 2;
  addTimedEffect(ring, 0.65, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2.5);
    mesh.material.opacity = 0.4 * velocityMultiplier * (1 - progress);
  });
}

function createFootstepDustEffect(position) {
  const dust = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xd6c2a5, transparent: true, opacity: 0.35 })
  );
  dust.position.copy(position);
  dust.position.y += 0.3;
  addTimedEffect(dust, 0.4, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 1.5);
    mesh.position.y += 0.08;
    mesh.material.opacity = 0.35 * (1 - progress);
  });
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
  let collision = getWallCollision(playerMesh.position);
  if (!collision) return;

  const initialCollision = collision;
  let hitDirection = playerMesh.position.clone().sub(collision.center).setY(0);
  if (hitDirection.lengthSq() < 0.001) {
    hitDirection.copy(playerMesh.position.clone().sub(previousPosition).setY(0).multiplyScalar(-1));
  }
  hitDirection.normalize();

  let iterations = 0;
  while (collision && iterations < 3) {
    const pushVec = playerMesh.position.clone().sub(collision.center).setY(0);
    const dist = pushVec.length();
    if (dist < collision.radius) {
      const penetration = collision.radius - dist;
      if (dist > 0.001) {
        pushVec.divideScalar(dist);
      } else {
        pushVec.copy(hitDirection);
      }
      playerMesh.position.addScaledVector(pushVec, penetration + 0.05);
    }
    iterations++;
    collision = getWallCollision(playerMesh.position);
  }

  const impactDamage = calculateImpactDamage({
    speed: player.lastMoveSpeed,
    verticalVelocity: 0,
    material: initialCollision.material,
    toughness: initialCollision.toughness,
    baseDamage: initialCollision.damage ?? 10,
  });

  if (impactDamage > 0 && wallHitCooldown <= 0) {
    applyImpactDamage(impactDamage, playerMesh.position.clone(), hitDirection, initialCollision.label);
    wallHitCooldown = 0.75;
    updateHud();
    if (player.health <= 0) {
      killPlayer("crashing into a wall");
    }
  } else {
    if (wallHitCooldown <= 0) {
      triggerWallHitAnimation(hitDirection, initialCollision.label, false);
      wallHitCooldown = 0.25;
    }
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
  anim.slamTimer = Math.max(0, (anim.slamTimer || 0) - dt);
  anim.punchChargeTimer = Math.max(0, (anim.punchChargeTimer || 0) - dt);
  anim.wallHitTimer = Math.max(0, (anim.wallHitTimer || 0) - dt);

  if (player.isSwimming) {
    const swimPhase = performance.now() * 0.008;

    if (moving) {
      // Horizontal pose in water
      model.rotation.x = 1.35;
      model.position.y = -3.8;
      model.position.z = -2.8;

      // Tilt head up to see forward and keep face above the surface
      model.userData.parts.head.rotation.x = -0.55;

      // Freestyle arm strokes: alternating circles
      model.userData.parts.leftArm.rotation.x = Math.sin(swimPhase) * 1.4 - 1.2;
      model.userData.parts.leftArm.rotation.y = Math.cos(swimPhase) * 0.4;
      model.userData.parts.leftArm.rotation.z = -0.2;

      model.userData.parts.rightArm.rotation.x = Math.sin(swimPhase + Math.PI) * 1.4 - 1.2;
      model.userData.parts.rightArm.rotation.y = Math.cos(swimPhase + Math.PI) * 0.4;
      model.userData.parts.rightArm.rotation.z = 0.2;

      // Leg flutter kicks
      model.userData.parts.leftLeg.rotation.x = Math.sin(swimPhase * 2) * 0.45;
      model.userData.parts.rightLeg.rotation.x = -Math.sin(swimPhase * 2) * 0.45;
      model.userData.parts.leftLeg.rotation.y = 0;
      model.userData.parts.rightLeg.rotation.y = 0;
      model.userData.parts.leftLeg.rotation.z = 0.04;
      model.userData.parts.rightLeg.rotation.z = -0.04;
    } else {
      // Vertical treading pose
      model.rotation.x = 0.18;
      model.position.y = -4.2 + Math.sin(performance.now() * 0.0035) * 0.35;
      model.position.z = -0.8;

      // Gentle head tilt
      model.userData.parts.head.rotation.x = -0.12;

      // Treading water scull
      model.userData.parts.leftArm.rotation.x = 0.4 + Math.sin(swimPhase * 0.6) * 0.2;
      model.userData.parts.leftArm.rotation.y = Math.cos(swimPhase * 0.6) * 0.25;
      model.userData.parts.leftArm.rotation.z = -0.4;

      model.userData.parts.rightArm.rotation.x = 0.4 + Math.sin(swimPhase * 0.6) * 0.2;
      model.userData.parts.rightArm.rotation.y = -Math.cos(swimPhase * 0.6) * 0.25;
      model.userData.parts.rightArm.rotation.z = 0.4;

      // Gentle leg scissors
      model.userData.parts.leftLeg.rotation.x = Math.sin(swimPhase * 0.6) * 0.2;
      model.userData.parts.rightLeg.rotation.x = -Math.sin(swimPhase * 0.6) * 0.2;
      model.userData.parts.leftLeg.rotation.y = 0;
      model.userData.parts.rightLeg.rotation.y = 0;
      model.userData.parts.leftLeg.rotation.z = 0.06;
      model.userData.parts.rightLeg.rotation.z = -0.06;
    }

    // Torso and other parts neutral while swimming
    model.userData.parts.torso.rotation.x = 0;
    model.userData.parts.torso.rotation.y = 0;
    if (anim.attackTimer <= 0) {
      model.userData.parts.torso.rotation.z = 0;
    }
    model.userData.parts.torso.position.y = 5.7;
    model.userData.parts.head.position.y = 8.65;

    if (anim.punchChargeTimer <= 0) {
      model.userData.parts.rightArm.rotation.y = 0;
    }
  } else {
    // Reset swim rotation and offset when back on land
    if (model.rotation.x !== 0) model.rotation.x = 0;
    if (model.position.y !== 0) model.position.y = 0;
    if (model.position.z !== 0) model.position.z = 0;
    if (model.userData.parts.head.rotation.x !== 0) model.userData.parts.head.rotation.x = 0;

    // Reset arm and leg Y/Z rotations that swim modified
    model.userData.parts.leftArm.rotation.y = 0;
    model.userData.parts.leftArm.rotation.z = -0.15;
    model.userData.parts.rightArm.rotation.y = 0;
    model.userData.parts.rightArm.rotation.z = 0.15;
    model.userData.parts.leftLeg.rotation.z = 0.04;
    model.userData.parts.rightLeg.rotation.z = -0.04;

    // Normal land animations
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

    if (anim.slamTimer > 0) {
      const slamProgress = 1 - anim.slamTimer / anim.slamDuration;
      if (slamProgress < 0.35) {
        const p = slamProgress / 0.35;
        model.userData.parts.leftArm.rotation.x = -0.2 + (-2.6 - (-0.2)) * p;
        model.userData.parts.rightArm.rotation.x = -0.2 + (-2.6 - (-0.2)) * p;
        model.userData.parts.torso.rotation.x = -0.3 * p;
        model.userData.parts.torso.position.y = 5.7 + 0.8 * p;
      } else {
        const p = (slamProgress - 0.35) / 0.65;
        const easeDown = Math.pow(p, 2.5);
        model.userData.parts.leftArm.rotation.x = -2.6 + (1.5 - (-2.6)) * easeDown;
        model.userData.parts.rightArm.rotation.x = -2.6 + (1.5 - (-2.6)) * easeDown;
        model.userData.parts.torso.rotation.x = -0.3 + (1.1 - (-0.3)) * easeDown;
        model.userData.parts.torso.position.y = 6.5 + (3.2 - 6.5) * easeDown;
      }
    } else if (anim.punchChargeTimer > 0) {
      const chargeProgress = 1 - anim.punchChargeTimer / anim.punchChargeDuration;
      model.userData.parts.rightArm.rotation.x = -0.2 + (0.9 - (-0.2)) * chargeProgress;
      model.userData.parts.rightArm.rotation.y = 0.5 * chargeProgress;
      model.userData.parts.leftArm.rotation.x = -0.2 + (-1.4 - (-0.2)) * chargeProgress;
      model.userData.parts.torso.rotation.y = -0.45 * chargeProgress;
      model.userData.parts.torso.position.y = 5.7 - 0.5 * chargeProgress;
    } else {
      model.userData.parts.torso.rotation.x = 0;
      model.userData.parts.rightArm.rotation.y = 0;
      model.userData.parts.torso.rotation.y = 0;
    }
  }

  // Animate the bobbing/rotation of the halo
  if (model.userData.parts.halo) {
    model.userData.parts.halo.rotation.z += dt * 1.5;
    model.userData.parts.halo.position.y = 10.6 + Math.sin(performance.now() * 0.003) * 0.15;
  }

  // Animate the flapping of the cape
  if (model.userData.parts.cape) {
    const speed = player.lastMoveSpeed || 0;
    const wave = Math.sin(performance.now() * 0.012) * (0.05 + (speed / 35) * 0.035);
    model.userData.parts.cape.rotation.x = 0.12 + (speed / 35) * 0.35 + wave;
    model.userData.parts.cape.rotation.y = Math.cos(performance.now() * 0.006) * 0.03 * (speed / 35);
    model.userData.parts.cape.rotation.z = Math.sin(performance.now() * 0.006) * 0.02 * (speed / 35);
  }

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

    // Captain Buggy chop-chop dismemberment animation
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
  if (player.shieldTimer > 0) return; // Invulnerable shield active!

  // Play synthesized impact sound
  audio.playImpact();
  triggerHitFlash(playerMesh);

  // Defense Mastery gain on hit/block
  const masteryGained = player.isBlocking ? 8 : 2;
  player.mastery.defense += masteryGained;
  masterySkills.defense.forEach((skill) => {
    if (player.mastery.defense === skill.req || (player.mastery.defense >= skill.req && player.mastery.defense - masteryGained < skill.req)) {
      log(`🌟 SKILL UNLOCKED: ${skill.name} (Defense skill)!`);
      audio.playQuestComplete();
    }
  });

  let block = player.isBlocking ? 0.45 : 1;
  let parried = false;

  // Perfect Parry: Block within 0.25s of keydown
  if (player.isBlocking && player.mastery.defense >= 50 && (performance.now() - player.blockStartTime < 250)) {
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
  if (player.health - finalDamage <= 0 && player.mastery.defense >= 500 && player.armoredWillCooldown <= 0) {
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
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `-${finalDamage}`, "#ff6b4a");
  }

  if (player.health <= 0) {
    killPlayer(source || "an enemy");
  }
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

function updateCamera() {
  const targetYaw = isHelming ? boatYaw : (shiftLockEnabled ? playerMesh.rotation.y : cameraYaw);
  const isSniper = player.weapon === "gun" && player.mastery.gun >= 500 && player.lastMoveSpeed === 0;
  const distance = isHelming ? 100 : (isSniper ? 98 : 58);
  const horizontalDistance = Math.cos(cameraPitch) * distance;
  const height = (isHelming ? 24 : 14) + Math.sin(cameraPitch) * distance;
  const island = getIslandUnderPlayer();
  const floorY = (island ? island.surfaceY : OCEAN_SURFACE_Y) + 4.5;
  
  const targetPos = isHelming ? activeBoat.position : playerMesh.position;
  const offset = new THREE.Vector3(
    Math.sin(targetYaw) * horizontalDistance,
    Math.max(height, floorY - targetPos.y),
    Math.cos(targetYaw) * horizontalDistance,
  );
  
  camera.position.lerp(targetPos.clone().add(offset), 0.12);
  if (camera.position.y < floorY) camera.position.y = floorY;
  
  if (cameraShake > 0) {
    camera.position.x += (Math.random() - 0.5) * cameraShake;
    camera.position.y += (Math.random() - 0.5) * cameraShake * 0.65;
    camera.position.z += (Math.random() - 0.5) * cameraShake;
    cameraShake = Math.max(0, cameraShake - 0.08);
  }
  camera.lookAt(targetPos.x, targetPos.y + (isHelming ? 4 : 7), targetPos.z);
  if (shiftLockEnabled && !isHelming) {
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

  // Clear new quest alert when viewing quest hub
  Object.values(questCatalog).forEach((q) => {
    if (player.level >= q.minLevel) {
      player.unlockedQuestsSeen[q.id] = true;
    }
  });
  player.newQuestUnlocked = false;
  if (ui.questCompass) {
    ui.questCompass.classList.remove("new-quest-unlocked");
  }

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
  if (!gameStarted || attackCooldown > 0 || player.weapon === "special") return;

  // Melee Ground Slam in Air!
  if (!isGrounded && jumpOffset > 0 && player.weapon === "melee" && player.mastery.melee >= 200) {
    jumpOffset = 0;
    verticalVelocity = -100; // Slam down!
    playerMesh.position.y = (getIslandUnderPlayer()?.surfaceY || STARTER_SURFACE_Y) + 0.15;
    isGrounded = true;
    createGroundSlam(playerMesh.position.clone(), { type: "player" });
    audio.playImpact();

    // Damage all targets in massive AOE
    enemies.forEach((enemy) => {
      if (enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) < 45) {
        const dmg = Math.round(getDamage() * 1.5);
        enemy.health -= dmg;
        triggerHitFlash(enemy.mesh);
        createFloatingText(enemy.mesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `GroundSlam -${dmg}`, "#ffcf5a");
        if (enemy.health <= 0) defeatEnemy(enemy);
      }
    });
    attackCooldown = 0.5;
    return;
  }

  // Set attack cooldown
  const isGatling = player.weapon === "melee" && player.mastery.melee >= 500;
  attackCooldown = isGatling ? 0.11 : (player.weapon === "gun" ? 0.55 : 0.42);

  if (playerMesh?.userData?.animation) {
    playerMesh.userData.animation.attackTimer = playerMesh.userData.animation.attackDuration;
  }

  // Procedural Sound triggers
  if (player.weapon === "sword") audio.playSlash();
  else if (player.weapon === "gun") audio.playShot();
  else if (player.weapon === "special") audio.playSpecial();
  else audio.playSlash(); // Melee swing sound

  const traits = getAvatarTraits();
  
  // Sword Piercing Thrust: +12 range
  const swordBonus = (player.weapon === "sword" && player.mastery.sword >= 50) ? 12 : 0;
  // Sniper Focus: Double gun range when standing still
  const isSniper = player.weapon === "gun" && player.mastery.gun >= 500 && player.lastMoveSpeed === 0;
  const gunRange = isSniper ? 170 : 85;

  const baseRange = (player.weapon === "gun" ? gunRange : (11 + swordBonus));
  const range = baseRange * traits.rangeMultiplier;

  let damage = getDamage();
  let isFalcon = false;

  // Falcon Punch: 15% chance for double damage + knockback
  if (player.weapon === "melee" && player.mastery.melee >= 50 && Math.random() < 0.15) {
    isFalcon = true;
    damage = Math.round(damage * 2.5);
  }

  const target = enemies
    .filter((enemy) => enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) <= range)
    .sort((a, b) => a.mesh.position.distanceTo(playerMesh.position) - b.mesh.position.distanceTo(playerMesh.position))[0];

  if (playerMesh?.userData?.animation) {
    playerMesh.userData.animation.attackImpact = target ? 1 : 0.3;
  }
  createCombatEffect(player.weapon, target);

  // Sword Dimensional Blade: Fires giant air slash forward!
  if (player.weapon === "sword" && player.mastery.sword >= 500) {
    const dir = getAttackDirection(target);
    createAirSlash(playerMesh.position.clone().setY(playerMesh.position.y + 6), dir, { type: "player" });
  }

  // Gun Double Tap: Fires a second bullet quickly
  if (player.weapon === "gun" && player.mastery.gun >= 50) {
    setTimeout(() => {
      if (player.weapon === "gun") {
        audio.playShot();
        createGunShot(target);
        if (target && target.alive) {
          const dmgDouble = Math.round(getDamage() * 0.85);
          target.health -= dmgDouble;
          triggerHitFlash(target.mesh);
          createFloatingText(target.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), `DoubleTap -${dmgDouble}`, "#9defff");
          if (target.health <= 0) defeatEnemy(target);
        }
      }
    }, 110);
  }

  // Pulse Bubble repel for Special Mastery 50
  if (player.weapon === "special" && player.mastery.special >= 50) {
    enemies.forEach((enemy) => {
      if (enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) < 48) {
        const pushDir = enemy.mesh.position.clone().sub(playerMesh.position).setY(0).normalize();
        enemy.mesh.position.addScaledVector(pushDir, 28);
        enemy.health -= Math.round(getDamage() * 0.4);
        triggerHitFlash(enemy.mesh);
        if (enemy.health <= 0) defeatEnemy(enemy);
      }
    });
  }

  if (!target) {
    log(`${weaponName()} attack missed.`);
    return;
  }

  // Grand Awakening: instantly vaporizes minor enemies below 20% health
  const isGrandAwakening = player.weapon === "special" && player.mastery.special >= 500;
  if (isGrandAwakening && target.health < target.maxHealth * 0.20) {
    createFloatingText(target.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "VAPORIZED!", "#a775ff");
    target.health = 0;
    defeatEnemy(target);
    player.health = Math.min(player.maxHealth, player.health + 50); // Heal 50 HP on direct vaporize
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 6, 0)), "+50 HP", "#7ce0b4");
    audio.playQuestComplete();
    return;
  }

  target.health -= damage;
  target.mesh.scale.setScalar(1.08);
  setTimeout(() => target.mesh.scale.setScalar(1), 90);
  triggerHitFlash(target.mesh);

  if (isFalcon) {
    const pushDir = target.mesh.position.clone().sub(playerMesh.position).setY(0).normalize();
    target.mesh.position.addScaledVector(pushDir, 35);
    createFloatingText(target.mesh.position.clone().add(new THREE.Vector3(0, 12, 0)), `FALCON PUNCH! -${damage}`, "#ff8a3d");
  } else {
    log(`${weaponName()} hit a bandit for ${damage} damage.`);
  }

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
  if (target && target.mesh) {
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
  const isBuggy = enemy && enemy.type === "buggy";
  const isPlayer = enemy && (enemy.type === "player" || enemy.type === "neutral" || enemy.type === "Pirates" || enemy.type === "Marines");
  const projectile = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeSlashTexture(),
      color: isBuggy ? 0xff4668 : (isPlayer ? 0x3ce88a : 0x9defff),
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    }),
  );
  projectile.position.copy(position);
  projectile.scale.set(16, 8, 1);
  scene.add(projectile);
  projectiles.push({
    mesh: projectile,
    direction: direction.clone(),
    speed: isBuggy ? 118 : 92,
    damage: isBuggy ? 24 : 14,
    age: 0,
    duration: 1.8,
    owner: isPlayer ? "player" : "enemy"
  });
}

function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = projectiles[i];
    projectile.age += dt;
    projectile.mesh.position.addScaledVector(projectile.direction, projectile.speed * dt);
    if (projectile.mesh.material && projectile.mesh.material.rotation !== undefined) {
      projectile.mesh.material.rotation += dt * 7;
    }
    
    if (projectile.owner === "player") {
      let hit = false;
      for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j];
        if (enemy.alive && projectile.mesh.position.distanceTo(enemy.mesh.position) < 26) {
          hit = true;
          if (projectile.isMortar) {
            createGroundSlam(projectile.mesh.position.clone(), { type: "player" });
            enemies.forEach(e => {
              if (e.alive && e.mesh.position.distanceTo(projectile.mesh.position) < 55) {
                const dmg = projectile.damage;
                e.health -= dmg;
                triggerHitFlash(e.mesh);
                createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `Explosion -${dmg}`, "#ff7a3d");
                if (e.health <= 0) defeatEnemy(e);
              }
            });
          } else {
            enemy.health -= projectile.damage;
            triggerHitFlash(enemy.mesh);
            createFloatingText(enemy.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), `Slash -${projectile.damage}`, "#3ce88a");
            if (enemy.health <= 0) defeatEnemy(enemy);
          }
          break;
        }
      }
      if (hit) {
        scene.remove(projectile.mesh);
        projectiles.splice(i, 1);
        continue;
      }
    } else {
      if (projectile.mesh.position.distanceTo(playerMesh.position) < 14) {
        damagePlayer(projectile.damage, "Air Slash");
        scene.remove(projectile.mesh);
        projectiles.splice(i, 1);
        continue;
      }
    }
    
    if (projectile.age >= projectile.duration) {
      if (projectile.isMortar) {
        createGroundSlam(projectile.mesh.position.clone(), { type: "player" });
        enemies.forEach(e => {
          if (e.alive && e.mesh.position.distanceTo(projectile.mesh.position) < 55) {
            const dmg = projectile.damage;
            e.health -= dmg;
            triggerHitFlash(e.mesh);
            createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `Explosion -${dmg}`, "#ff7a3d");
            if (e.health <= 0) defeatEnemy(e);
          }
        });
      }
      scene.remove(projectile.mesh);
      projectiles.splice(i, 1);
    }
  }
}

function createGroundSlam(position, enemy) {
  cameraShake = Math.max(cameraShake, 1.4);
  createDustCloud(position);

  // Set violent player ground slam animation
  if (enemy && (enemy.type === "player" || enemy.type === "starter") && playerMesh?.userData?.animation) {
    playerMesh.userData.animation.slamTimer = 0.5;
    playerMesh.userData.animation.slamDuration = 0.5;
  }

  const owner = (enemy && (enemy.type === "player" || enemy.type === "starter")) ? "player" : "enemy";
  const numRocks = 12;

  for (let i = 0; i < numRocks; i += 1) {
    const angle = (i / numRocks) * Math.PI * 2;
    // Vary distance from 10 (near) to 32 (far)
    const distance = 10 + Math.random() * 22;

    // Scale rock base size based on distance: nearer = smaller, farther = larger
    const minDistance = 10;
    const maxDistance = 32;
    const sizeMultiplier = 0.4 + 1.2 * ((distance - minDistance) / (maxDistance - minDistance));
    const rockRadius = (2.2 + Math.random() * 1.2) * sizeMultiplier;

    // Jagged low-poly rock geometry
    const rockGeo = new THREE.DodecahedronGeometry(rockRadius, 0);
    // Squish rocks to make them look irregular and natural
    rockGeo.scale(1.2, 0.7 + Math.random() * 0.6, 0.8 + Math.random() * 0.4);

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x5a4f43,
      roughness: 0.95,
      metalness: 0.1,
      flatShading: true
    });

    const rock = new THREE.Mesh(rockGeo, rockMat);
    const targetX = position.x + Math.cos(angle) * distance;
    const targetZ = position.z + Math.sin(angle) * distance;

    const startY = position.y - 6 * sizeMultiplier; // sink larger rocks deeper
    const baseY = position.y + 0.5; // sit slightly above ground level

    rock.position.set(targetX, startY, targetZ);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);

    hazards.push({
      mesh: rock,
      damage: (enemy && enemy.type === "brute") ? 20 : 28,
      radius: Math.max(3, rockRadius * 1.4), // collision radius scales with rock size
      age: 0,
      duration: 3.2,
      owner: owner,
      startY: startY,
      baseY: baseY
    });
  }
}

function updateHazards(dt) {
  for (let i = hazards.length - 1; i >= 0; i -= 1) {
    const hazard = hazards[i];
    hazard.age += dt;

    const scaleUpTime = 0.35;
    const fadeOutTime = 0.35;
    let progress = 1;

    // Rock rising and sinking animation
    if (hazard.age < scaleUpTime) {
      progress = hazard.age / scaleUpTime;
      if (hazard.startY !== undefined && hazard.baseY !== undefined) {
        hazard.mesh.position.y = hazard.startY + (hazard.baseY - hazard.startY) * progress;
      }
      hazard.mesh.scale.setScalar(progress);
    } else if (hazard.age > hazard.duration - fadeOutTime) {
      progress = (hazard.duration - hazard.age) / fadeOutTime;
      if (hazard.startY !== undefined && hazard.baseY !== undefined) {
        hazard.mesh.position.y = hazard.startY + (hazard.baseY - hazard.startY) * progress;
      }
      hazard.mesh.scale.setScalar(Math.max(0.001, progress));
    } else {
      if (hazard.baseY !== undefined) {
        hazard.mesh.position.y = hazard.baseY;
      }
      hazard.mesh.scale.setScalar(1.0);
    }

    // Player takes damage from hazards ONLY if not owned by the player
    if (hazard.owner !== "player" && hazard.mesh.position.distanceTo(playerMesh.position) < hazard.radius && wallHitCooldown <= 0) {
      applyImpactDamage(hazard.damage, playerMesh.position.clone(), playerMesh.position.clone().sub(hazard.mesh.position).normalize(), "crushing rocks");
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
  const mastery = player.mastery[player.weapon] || 0;
  const masteryBonus = Math.pow(1.001, mastery);

  let baseDmg = 10;
  if (player.weapon === "sword") baseDmg = 12 + player.stats.sword * 5;
  else if (player.weapon === "gun") baseDmg = 9 + player.stats.gun * 4;
  else if (player.weapon === "special") baseDmg = 20 + player.stats.special * 7;
  else baseDmg = 10 + player.stats.melee * 5;

  return Math.round(baseDmg * traits.damageMultiplier * hakiBonus * masteryBonus);
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
  spawnLootCoins(enemy.mesh.position.clone(), moneyReward);
  player.materials.ironwood += enemy.type ? 2 : 1;
  player.materials.scrap += enemy.type === "brute" ? 3 : 1;

  // Mastery Reward!
  player.enemiesDefeatedCount = (player.enemiesDefeatedCount || 0) + 1;
  const baseMastery = enemy.type === "buggy" ? 800 : enemy.type === "brute" ? 90 : enemy.type === "pirate" ? 45 : 5;
  const decayFactor = 0.10; // 10% harder per defeat
  const masteryGained = Math.max(1, Math.round(baseMastery / (1 + (player.enemiesDefeatedCount - 1) * decayFactor)));
  const currentWeapon = player.weapon;
  player.mastery[currentWeapon] += masteryGained;
  log(`Mastered ${statLabels[currentWeapon]}: +${masteryGained} Mastery Points! (Multiplier: x${(1 / (1 + (player.enemiesDefeatedCount - 1) * decayFactor)).toFixed(2)})`);

  // Mastery skill unlock check
  masterySkills[currentWeapon].forEach((skill) => {
    if (player.mastery[currentWeapon] === skill.req || (player.mastery[currentWeapon] >= skill.req && player.mastery[currentWeapon] - masteryGained < skill.req)) {
      log(`🌟 SKILL UNLOCKED: ${skill.name} (${statLabels[currentWeapon]} skill)!`);
      audio.playQuestComplete();
    }
  });

  // Grand Awakening execution check for other nearby enemies
  if (player.weapon === "special" && player.mastery.special >= 500) {
    enemies.forEach((e) => {
      if (e.alive && e !== enemy && e.health < e.maxHealth * 0.20 && e.mesh.position.distanceTo(playerMesh.position) < 120) {
        createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "VAPORIZED!", "#a775ff");
        e.health = 0;
        defeatEnemy(e);
        player.health = Math.min(player.maxHealth, player.health + 10);
        createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 6, 0)), "+10 HP", "#7ce0b4");
        audio.playQuestComplete();
      }
    });
  }

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
  audio.playQuestComplete();
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
  audio.playQuestComplete();
  log(`Quest complete: +$${moneyReward}, +${quest.rewardXp} XP. Special abilities unlocked on key 4.`);
  renderInventory();
}

function addXp(amount) {
  player.xp += amount;
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level += 1;
    checkNewQuestUnlocks();
    player.statPoints += 3;
    player.xpToNext = Math.round(player.xpToNext * 1.35);
    player.health = player.maxHealth;
    audio.playLevelUp();
    log(`Level up! You reached level ${player.level} and gained 3 stat points.`);
  }
}

function updateHud() {
  const traits = getAvatarTraits();
  
  if (ui.lowHealthOverlay) {
    if (player.health <= 0) {
      ui.lowHealthOverlay.classList.remove("low");
      ui.lowHealthOverlay.classList.add("defeated");
    } else if (player.health / player.maxHealth <= 0.3) {
      ui.lowHealthOverlay.classList.remove("defeated");
      ui.lowHealthOverlay.classList.add("low");
    } else {
      ui.lowHealthOverlay.classList.remove("low", "defeated");
    }
  }

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

  updateCombatHud();
}

function log(message) {
  messageLog.textContent = message;
}

function getLocalSurfaceHeightAt(lx, lz, radius, height, index) {
  const r = Math.sqrt(lx * lx + lz * lz);
  const normDist = Math.min(1, r / (radius * 0.96));
  const angle = Math.atan2(lz, lx);
  
  const centerHeight = height + 0.5;
  const seed = index + 9;
  const slope = -height;
  const uneven = Math.sin(angle * 6 + seed) * 1.5 + Math.cos(angle * 11) * 0.8;
  const edgeHeight = height + 0.16 + slope + uneven;
  
  return centerHeight + (edgeHeight - centerHeight) * normDist;
}

function getIslandSurfaceHeightAt(x, z, island) {
  if (!island) return OCEAN_SURFACE_Y;
  const height = island.surfaceY - 0.16;
  return getLocalSurfaceHeightAt(x - island.position.x, z - island.position.z, island.radius, height, island.index);
}

function makeIrregularCylinderGeometry(radius, height, segments, seed) {
  const positions = [];
  const indices = [];
  const topCenterIndex = 0;
  const bottomCenterIndex = 1;
  positions.push(0, height / 2, 0, 0, -height / 2 - 40, 0);

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const topRadius = islandProfileRadius(angle, radius * 0.9, seed);
    const bottomRadius = islandProfileRadius(angle + 0.08, radius, seed + 2);
    
    // Sloped edge height matching the disc
    const slope = -height;
    const uneven = Math.sin(angle * 6 + (seed + 6)) * 1.5 + Math.cos(angle * 11) * 0.8;
    const ledge = slope + uneven;
    
    positions.push(Math.cos(angle) * topRadius, height / 2 + ledge, Math.sin(angle) * topRadius);
    positions.push(Math.cos(angle) * bottomRadius, -height / 2 - 40, Math.sin(angle) * bottomRadius);
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

function makeIrregularDiscGeometry(radius, segments, seed, height = 0) {
  const positions = [0, 0, 0.5]; // Center is slightly raised
  const indices = [];

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const edgeRadius = islandProfileRadius(angle, radius, seed);
    
    const slope = -height;
    const uneven = Math.sin(angle * 6 + seed) * 1.5 + Math.cos(angle * 11) * 0.8;
    const rise = slope + uneven;
    
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

function makeIrregularRingGeometry(innerRadius, outerRadius, segments, seed, height = 0, index = 0, maxRadius = 1) {
  const positions = [];
  const indices = [];

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const inner = islandProfileRadius(angle + 0.12, innerRadius, seed + 1);
    const outer = islandProfileRadius(angle, outerRadius, seed);
    
    let innerRise = Math.sin(angle * 15 + seed) * 0.3;
    let outerRise = -innerRise;
    
    if (height > 0) {
      const slope = -height;
      const seedVal = index + 9;
      const uneven = Math.sin(angle * 6 + seedVal) * 1.5 + Math.cos(angle * 11) * 0.8;
      
      const centerHeight = 0.5;
      const edgeHeight = 0.16 + slope + uneven;
      
      const normInner = Math.min(1, inner / (maxRadius * 0.96));
      const normOuter = Math.min(1, outer / (maxRadius * 0.96));
      
      innerRise = centerHeight + (edgeHeight - centerHeight) * normInner;
      outerRise = centerHeight + (edgeHeight - centerHeight) * normOuter;
    }
    
    positions.push(Math.cos(angle) * inner, Math.sin(angle) * inner, innerRise);
    positions.push(Math.cos(angle) * outer, Math.sin(angle) * outer, outerRise);
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

function updateDayNightLighting(dt) {
  let skyColor, fogColor, sunIntensity, sunColor;
  
  if (timeOfDay >= 6 && timeOfDay < 9) {
    const p = (timeOfDay - 6) / 3;
    skyColor = new THREE.Color(0xffa07a).lerp(new THREE.Color(0x8bd8ff), p);
    fogColor = skyColor.clone();
    sunIntensity = 0.5 + p * 1.7;
    sunColor = new THREE.Color(0xffd8b5).lerp(new THREE.Color(0xfff1c7), p);
  } else if (timeOfDay >= 9 && timeOfDay < 17) {
    skyColor = new THREE.Color(0x8bd8ff);
    fogColor = skyColor.clone();
    sunIntensity = 2.2;
    sunColor = new THREE.Color(0xfff1c7);
  } else if (timeOfDay >= 17 && timeOfDay < 20) {
    const p = (timeOfDay - 17) / 3;
    skyColor = new THREE.Color(0x8bd8ff).lerp(new THREE.Color(0xff5533), p);
    fogColor = skyColor.clone();
    sunIntensity = 2.2 - p * 1.8;
    sunColor = new THREE.Color(0xfff1c7).lerp(new THREE.Color(0xffaa44), p);
  } else {
    let p = 0;
    if (timeOfDay >= 20) p = (timeOfDay - 20) / 4;
    else p = 1 - (timeOfDay / 6);
    skyColor = new THREE.Color(0xff5533).lerp(new THREE.Color(0x060c12), Math.min(1, p * 1.5));
    fogColor = skyColor.clone();
    sunIntensity = 0.4;
    sunColor = new THREE.Color(0x7a8fa6);
  }

  if (weatherActive) {
    skyColor.multiplyScalar(0.35);
    fogColor.multiplyScalar(0.35);
    sunIntensity *= 0.25;
  }

  scene.background.copy(skyColor);
  scene.fog.color.copy(fogColor);
  renderer.setClearColor(skyColor);
  sun.color.copy(sunColor);
  sun.intensity = sunIntensity;

  const angle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
  sun.position.set(Math.cos(angle) * 300, Math.sin(angle) * 300, 100);

  const isNight = timeOfDay >= 19.5 || timeOfDay < 5.5;
  scene.traverse((child) => {
    if (child.name === "lanternGlow" || (child.material && child.material.emissive && (child.material.color.getHex() === 0xffd25a))) {
      child.material.emissiveIntensity = isNight ? (weatherActive ? 3.0 : 2.0) : 0.1;
    }
  });
}

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

function triggerSwordQ() {
  audio.playSlash();
  createSpecialBurst({ mesh: playerMesh });
  
  enemies.forEach((enemy) => {
    if (enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) < 38) {
      const dmg = Math.round(getDamage() * 1.8);
      enemy.health -= dmg;
      triggerHitFlash(enemy.mesh);
      createFloatingText(enemy.mesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `Spin -${dmg}`, "#ffcf5a");
      if (enemy.health <= 0) defeatEnemy(enemy);
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
          enemy.health -= dmg;
          triggerHitFlash(enemy.mesh);
          createFloatingText(enemy.mesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `Buckshot -${dmg}`, "#ff7a3d");
          if (enemy.health <= 0) defeatEnemy(enemy);
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
      enemy.health -= dmg;
      triggerHitFlash(enemy.mesh);
      createFloatingText(enemy.mesh.position.clone().add(new THREE.Vector3(0, 12, 0)), `⚡ LIGHTNING -${dmg}`, "#7ce0b4");
      createWallHitEffect(enemy.mesh.position.clone(), true);
      if (enemy.health <= 0) defeatEnemy(enemy);
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
  const skills = masterySkills[weapon] || [];
  const skill = skills.find(s => s.key === keyChar);
  if (!skill) return;

  const val = player.mastery[weapon] || 0;
  if (val < skill.req) {
    log(`Skill locked! Need ${skill.req} Mastery for ${skill.name}.`);
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
  const val = player.mastery[weapon] || 0;
  const weaponEmojis = { melee: "👊", sword: "⚔️", gun: "🔫", special: "✨" };
  const weaponNames = { melee: "MELEE", sword: "SWORD", gun: "GUN", special: "SPECIAL" };

  if (ui.combatWeaponIcon) ui.combatWeaponIcon.textContent = weaponEmojis[weapon] || "👊";
  if (ui.combatWeaponName) ui.combatWeaponName.textContent = weaponNames[weapon] || "COMBAT";

  const skills = masterySkills[weapon] || [];
  const maxBarValue = 20;
  const currentLevel = Math.floor(val / 100) + 1;
  const needed = Math.max(0, 20 - val);
  const neededText = needed > 0 ? `(Need ${needed} MP)` : "(Maxed)";

  if (ui.combatMasteryLabel) ui.combatMasteryLabel.textContent = `Mastery ${val} (Lv. ${currentLevel})`;
  if (ui.combatMasteryBar) ui.combatMasteryBar.style.width = `${Math.min(100, (val / maxBarValue) * 100)}%`;
  if (ui.combatMasteryText) ui.combatMasteryText.textContent = `${val}/${maxBarValue} ${neededText}`;

  if (ui.combatSkillsList) {
    ui.combatSkillsList.innerHTML = skills.map(skill => {
      const unlocked = val >= skill.req;
      const cd = skillCooldowns[skill.id] || 0;
      const cdPercent = cd > 0 ? (cd / skill.cd) * 100 : 0;
      const rowClass = `combat-skill-row${unlocked ? "" : " locked"}${unlocked ? " skill-row-glow" : ""}`;
      return `
        <div class="${rowClass}">
          <div class="skill-cooldown-overlay" style="height:${cdPercent}%"></div>
          <span class="skill-key">${skill.key}</span>
          <div class="skill-info">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-req">${unlocked ? "UNLOCKED" : `Req ${skill.req} MP`}</span>
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
        t.health -= dmg;
        triggerHitFlash(t.mesh);
        // Violent knockback
        t.mesh.position.addScaledVector(currentForward, 24);
        createFloatingText(t.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), `FalconPunch -${dmg}`, "#ffcf5a");
        cameraShake = Math.max(cameraShake, 2.2);
        createWallHitEffect(t.mesh.position.clone(), true);
        if (t.health <= 0) defeatEnemy(t);
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
        e.health -= dmg;
        triggerHitFlash(e.mesh);
        createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `Slam -${dmg}`, "#ffcf5a");
        if (e.health <= 0) defeatEnemy(e);
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
          e.health -= dmg;
          triggerHitFlash(e.mesh);
          createFloatingText(e.mesh.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 6, 8, 0)), `Gatling -${dmg}`, "#ffcf5a");
          if (e.health <= 0) defeatEnemy(e);
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
        e.health -= dmg;
        triggerHitFlash(e.mesh);
        createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), `Thrust -${dmg}`, "#f6b73c");
        if (e.health <= 0) defeatEnemy(e);
      }
    });

  } else if (skillId === "cyclone-spin") {
    audio.playSlash();
    createSpecialBurst(playerMesh);
    enemies.forEach(e => {
      if (e.alive && e.mesh.position.distanceTo(playerMesh.position) < 42) {
        const dmg = Math.round(getDamage() * 1.9);
        e.health -= dmg;
        triggerHitFlash(e.mesh);
        createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `Cyclone -${dmg}`, "#ffcf5a");
        if (e.health <= 0) defeatEnemy(e);
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
        t.health -= dmg;
        triggerHitFlash(t.mesh);
        createFloatingText(t.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), `DoubleTap -${dmg}`, "#9defff");
        if (t.health <= 0) defeatEnemy(t);
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
        e.health -= dmg;
        triggerHitFlash(e.mesh);
        createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `Buckshot -${dmg}`, "#ff7a3d");
        if (e.health <= 0) defeatEnemy(e);
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
        e.health -= dmg;
        triggerHitFlash(e.mesh);
        createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 8, 0)), `Bubble -${dmg}`, "#7ce0b4");
        if (e.health <= 0) defeatEnemy(e);
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
        e.health -= dmg;
        triggerHitFlash(e.mesh);
        createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 12, 0)), `⚡ Storm -${dmg}`, "#7ce0b4");
        createWallHitEffect(e.mesh.position.clone(), true);
        if (e.health <= 0) defeatEnemy(e);
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
          e.health -= dmg;
          triggerHitFlash(e.mesh);
          createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), `Beam -${dmg}`, "#7ce0b4");
          if (e.health <= 0) defeatEnemy(e);
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
        e.health -= dmg;
        triggerHitFlash(e.mesh);
        createFloatingText(e.mesh.position.clone().add(new THREE.Vector3(0, 12, 0)), `⚡JUDGMENT -${dmg}`, "#3ce88a");
        if (e.health <= 0) defeatEnemy(e);
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
  }
}

// ===== Escape Menu & Performance Stats Bar (Roblox Style) =====

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
  if (escMenu) {
    escMenu.classList.toggle("hidden", !escMenuOpen);
  }
  
  if (escMenuOpen) {
    keys.clear();
    if (volumeSlider) {
      volumeSlider.value = Math.round(audio.volume * 100);
      if (volumeVal) volumeVal.textContent = `${volumeSlider.value}%`;
    }
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
    playerMesh.position.set(0, STARTER_SURFACE_Y + 0.15, 0);
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


// GENERATED FILE - do not edit. Edit src/game/ and run "npm run build:assets". 
// ── 00-bootstrap.js ─ Opens the game closure and shows load/runtime errors to the player.
// Keep initialization errors visible to players while preserving their details in the console.
(function bootstrapSeaLegends() {
try {
  const showGameError = (message) => {
    const status = document.querySelector("#game-load-status");
    const errorPanel = document.querySelector("#game-init-error");
    const errorMessage = document.querySelector("#game-init-error-message");
    if (status) status.hidden = true;
    if (errorMessage) errorMessage.textContent = message;
    if (errorPanel) errorPanel.hidden = false;
  };
  window.addEventListener("error", (event) => {
    console.error("Sea Legends runtime error:", event.error || event.message);
    showGameError("A game error stopped part of the experience. Reload the page to try again.");
  });
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Sea Legends async error:", event.reason);
    showGameError("A game resource or task failed. Check your connection and reload the page.");
  });
  document.querySelector("#game-init-retry")?.addEventListener("click", () => window.location.reload());

// ── 01-audio.js ─ Procedural Web Audio sound effects and master volume.
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
  },
  playObservation() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  },
  playFlashStep() {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  }
};

// ── 02-skills-and-dom.js ─ Mastery skill data, world/boat state flags and cached DOM element references.
let skillCooldowns = {};

const masterySkills = {
  melee: [
    { key: "Z", id: "falcon-punch", name: "Meteor Fist", req: 5, cd: 4, desc: "Active: A very hard punch going 24 units far in the direction you face." },
    { key: "X", id: "ground-slam", name: "Ground Slam", req: 20, cd: 8, desc: "Active: Slam the ground dealing massive AOE damage around you." },
    { key: "C", id: "flambage-shot", name: "Ember Shot", req: 1, cd: 6, desc: "Blaze Kick: Leap forward with a blazing fire kick — burn damage + knockback." },
    { key: "V", id: "diable-jambe", name: "Inferno Kick", req: 1, cd: 18, desc: "Blaze Kick: Ignite your legs — next 5 attacks deal 2.5x fire damage." }
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
const multiplayerStatus = document.querySelector("#multiplayer-status");
const multiplayerOpenButton = document.querySelector("#multiplayer-open");
const multiplayerBrowser = document.querySelector("#multiplayer-browser");
const multiplayerCloseButton = document.querySelector("#multiplayer-close");
const multiplayerBrowserMessage = document.querySelector("#multiplayer-browser-message");
const multiplayerQuickJoinButton = document.querySelector("#multiplayer-quick-join");
const multiplayerServerList = document.querySelector("#multiplayer-server-list");
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

// Advanced body designing selectors
const leftArmColorInput = document.querySelector("#left-arm-color");
const rightArmColorInput = document.querySelector("#right-arm-color");
const leftLegColorInput = document.querySelector("#left-leg-color");
const rightLegColorInput = document.querySelector("#right-leg-color");
const beltColorInput = document.querySelector("#belt-color");
const capeColorInput = document.querySelector("#cape-color");
const capeStyleInput = document.querySelector("#cape-style");

// Studio Customizer Selectors
const studioAvatarList = document.querySelector("#studio-avatar-list");
const studioAvatarNameInput = document.querySelector("#studio-avatar-name");
const studioSkinColorInput = document.querySelector("#studio-skin-color");
const studioShirtColorInput = document.querySelector("#studio-shirt-color");
const studioLeftArmColorInput = document.querySelector("#studio-left-arm-color");
const studioRightArmColorInput = document.querySelector("#studio-right-arm-color");
const studioHairColorInput = document.querySelector("#studio-hair-color");
const studioEyeColorInput = document.querySelector("#studio-eye-color");
const studioLeftLegColorInput = document.querySelector("#studio-left-leg-color");
const studioRightLegColorInput = document.querySelector("#studio-right-leg-color");
const studioPantsColorInput = document.querySelector("#studio-pants-color");
const studioBootColorInput = document.querySelector("#studio-boot-color");
const studioBeltColorInput = document.querySelector("#studio-belt-color");
const studioCapeColorInput = document.querySelector("#studio-cape-color");
const studioHairStyleInput = document.querySelector("#studio-hair-style");
const studioOutfitStyleInput = document.querySelector("#studio-outfit-style");
const studioCapeStyleInput = document.querySelector("#studio-cape-style");
const studioHeightScaleInput = document.querySelector("#studio-height-scale");
const studioBuildScaleInput = document.querySelector("#studio-build-scale");
const studioCreateAvatarButton = document.querySelector("#studio-create-avatar");
const studioSaveAvatarButton = document.querySelector("#studio-save-avatar");
const studioDeleteAvatarButton = document.querySelector("#studio-delete-avatar");
const studioPreviewName = document.querySelector("#studio-preview-name");
const studioPreviewTraits = document.querySelector("#studio-preview-traits");
const studioPreviewTraitsLabel = document.querySelector("#studio-preview-traits-label");

// ── 03-game-state.js ─ Core constants, player, inventory, quest catalog and runtime state.
const avatarPreview3D = {
  scene: null,
  camera: null,
  renderer: null,
  characterGroup: null,
  animationFrameId: null,
  isDragging: false,
  previousMouseX: 0,
  rotationY: -0.5,
  autoRotate: true,
};

const marketState = {
  listings: []
};

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
  stunTimer: 0,
  knockedDown: false,
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
    melee: 1,
    defense: 1,
    sword: 1,
    gun: 1,
    special: 1,
  },
  masteryXp: {
    melee: 0,
    defense: 0,
    sword: 0,
    gun: 0,
    special: 0,
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
  isAdmin: false,
  isGodMode: false,
  isInstakill: false,
  hasFlamingFeet: true, // Blaze Kick attacks (Ember Shot / Inferno Kick) are part of melee
  diableJambeTimer: 0,    // seconds remaining on Inferno Kick ignition buff
  diableJambeHits: 0,    // hits remaining on Inferno Kick buff
  hasFlashStep: false,
  flashStepCooldown: 0,
  observationHaki: {
    unlocked: false,
    active: false,
    dodges: 5,
    maxDodges: 5,
    regenTimer: 0,
  },
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
        saveGame();
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
        saveGame();
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
  monkey10: {
    id: "monkey10",
    title: "Monkey Mischief",
    detail: "Defeat 5 jungle monkeys.",
    targetType: "monkey",
    target: 5,
    defeated: 0,
    minLevel: 10,
    rewardMoney: 380,
    rewardXp: 950,
  },
  gorilla15: {
    id: "gorilla15",
    title: "Gorilla Strength",
    detail: "Defeat 5 wild gorillas.",
    targetType: "gorilla",
    target: 5,
    defeated: 0,
    minLevel: 15,
    rewardMoney: 550,
    rewardXp: 1600,
  },
  gorillaKing20: {
    id: "gorillaKing20",
    title: "The Gorilla King",
    detail: "Defeat the Gorilla King boss.",
    targetType: "gorilla_king",
    target: 1,
    defeated: 0,
    minLevel: 20,
    rewardMoney: 1200,
    rewardXp: 4500,
  },
  pirates30: {
    id: "pirates30",
    title: "Pirate Ambush",
    detail: "Defeat 6 katana pirates at Pirate Town.",
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
  buggy50: {
    id: "buggy50",
    title: "Captain Jester",
    detail: "Defeat Captain Jester.",
    targetType: "buggy",
    target: 1,
    defeated: 0,
    minLevel: 50,
    rewardMoney: 1500,
    rewardXp: 6000,
  },
  desertBandits60: {
    id: "desertBandits60",
    title: "Desert Bandits",
    detail: "Defeat 5 desert bandits.",
    targetType: "desert_bandit",
    target: 5,
    defeated: 0,
    minLevel: 60,
    rewardMoney: 1800,
    rewardXp: 8500,
  },
  desertOfficers70: {
    id: "desertOfficers70",
    title: "Desert Officers",
    detail: "Defeat 5 desert officers.",
    targetType: "desert_officer",
    target: 5,
    defeated: 0,
    minLevel: 70,
    rewardMoney: 2500,
    rewardXp: 12000,
  },
  frozenBandits90: {
    id: "frozenBandits90",
    title: "Frozen Bandits",
    detail: "Defeat 5 frozen bandits at Snowy Village.",
    targetType: "frozen_bandit",
    target: 5,
    defeated: 0,
    minLevel: 90,
    rewardMoney: 3400,
    rewardXp: 18000,
  },
  snowmen100: {
    id: "snowmen100",
    title: "Snowman Swarm",
    detail: "Defeat 5 snowmen at Snowy Village.",
    targetType: "snowman",
    target: 5,
    defeated: 0,
    minLevel: 100,
    rewardMoney: 4500,
    rewardXp: 26000,
  },
  yeti110: {
    id: "yeti110",
    title: "The Yeti Boss",
    detail: "Defeat the Yeti boss at Snowy Village.",
    targetType: "yeti",
    target: 1,
    defeated: 0,
    minLevel: 110,
    rewardMoney: 6800,
    rewardXp: 48000,
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
let isLeftMouseDown = false;
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
const mouseScreenPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
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
const multiplayerState = {
  socket: null,
  clientId: null,
  serverId: null,
  serverName: "",
  players: new Map(),
  targetServerId: null,
  lastSentAt: 0,
  reconnectTimer: null,
  manualDisconnect: false,
};
const multiplayerUrl = document.querySelector('meta[name="sea-legends-multiplayer-url"]')?.content.trim() || "";

// ── 03-world-palette.js ─ World colour palette: sky, sea, terrain and village colours in one place.
//
// Colours here are written as they should appear on screen (normal sRGB hex).
// Three.js r128 treats material colours as linear and brightens them on output,
// so anything used on a lit material goes through worldHex()/worldColor(),
// which converts sRGB to linear. Sky dome, background and fog colours are drawn
// without that conversion, so they are used as-is.
const WORLD_PALETTE = {
  // r128 multiplies every light by PI, so these are tuned lower than they look.
  // Raise them for a brighter, softer world; lower them for richer, deeper colour.
  lighting: {
    sunScale: 0.62,       // multiplies the day/night sun intensity
    hemisphere: 0.62,     // sky/ground fill light
    ambient: 0.12,
    exposure: 1.0,
  },
  sky: {
    // [top, horizon, sun glow] per time of day — used raw by the sky shader and fog
    dawn: { top: 0x2b4479, horizon: 0xf3a77e, glow: 0xffb871 },
    day: { top: 0x3b86cf, horizon: 0xbfe2f1, glow: 0xfff1d2 },
    dusk: { top: 0x26325f, horizon: 0xee7e58, glow: 0xff6c40 },
    night: { top: 0x060f22, horizon: 0x0d1e35, glow: 0x3a5a78 },
  },
  sea: {
    base: 0x2c8fae,       // lit water surface
    deep: 0x2a7f9e,       // deep/shallow/foam tint the lit surface in the ocean shader
    shallow: 0x55c4cf,
    foam: 0xe9fbff,
    lagoon: 0x47c6cf,     // shallow ring around islands
  },
  terrain: {
    // index 0 Starter, 1 Jungle, 4 Snowy Village, others use "default"
    grass: { 0: 0x63a552, 1: 0x2f7438, 4: 0xf4f7fb, default: 0x74ad5a },
    cliff: { 0: 0xb0916a, 1: 0x5a5644, 4: 0xb9c3cf, default: 0xab9472 },
    meadowGlow: 0xc9e79a,  // soft lighter wash in each island centre
    sand: 0xecd39a,
    path: 0xd8bd8c,
    plaza: 0xc29a66,
    stone: 0x8a857c,
    rock: 0x7a746c,
    rockDark: 0x6b625a,
  },
  foliage: {
    palmLeaf: 0x3f9f4d,
    palmTrunk: 0x92633e,
    coconut: 0x5d3b22,
    tuft: 0x4c9a44,
    bark: 0x6b4a32,
    canopy: [0x3f8a3c, 0x55a24a, 0x6db557],  // dark, mid, light leaf clusters
    jungleBark: 0x5b4330,
    jungleCanopy: [0x24602c, 0x2f7535, 0x3d8a3a, 0x4f9a3f],  // deep rainforest greens
  },
  village: {
    roofs: [0xa9473a, 0x8f5a3c, 0x4d6a80, 0xb0603e, 0x5e7a4c],
    walls: [0xefe3c8, 0xe8d3b0, 0xf2e8d8, 0xe3cfa8, 0xeadcc2],   // limewashed plaster
    trims: [0x2f5f6e, 0x6b3a32, 0x35603f, 0x7a5426, 0x48506a],
    timber: 0x5a3b26,
    foundation: 0x8a847a,
    ridge: 0x6d3a2e,
    wellRoof: 0xa8463a,
  },
};

const worldColorCache = new Map();
// sRGB hex -> linear THREE.Color (for lit materials).
function worldColor(hex) {
  return new THREE.Color(hex).convertSRGBToLinear();
}
// sRGB hex -> linear hex number, cached (for material `color:` options).
function worldHex(hex) {
  if (!worldColorCache.has(hex)) worldColorCache.set(hex, worldColor(hex).getHex());
  return worldColorCache.get(hex);
}
function islandTerrainColor(table, index) {
  return worldHex(table[index] ?? table.default);
}

// ── 04-scene-sky-ocean.js ─ Three.js scene, renderer, lighting, ocean shader, sky dome, clouds and atmosphere.

const scene = new THREE.Scene();
scene.background = new THREE.Color(WORLD_PALETTE.sky.day.horizon);
scene.fog = new THREE.FogExp2(WORLD_PALETTE.sky.day.horizon, 0.00016);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = WORLD_PALETTE.lighting.exposure;

const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 80000);

const sun = new THREE.DirectionalLight(0xfff8ed, 2.4);
sun.position.set(160, 240, 100);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const shadowDist = 260;
sun.shadow.camera.left = -shadowDist;
sun.shadow.camera.right = shadowDist;
sun.shadow.camera.top = shadowDist;
sun.shadow.camera.bottom = -shadowDist;
sun.shadow.camera.near = 10;
sun.shadow.camera.far = 1400;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.04;
sun.shadow.radius = 2.0;
scene.add(sun);
scene.add(sun.target);

const hemiLight = new THREE.HemisphereLight(0x9fd2f5, 0x3a4a2c, WORLD_PALETTE.lighting.hemisphere);
scene.add(hemiLight);

const ambientLight = new THREE.AmbientLight(0xd0e6f7, WORLD_PALETTE.lighting.ambient);
scene.add(ambientLight);

// High-fidelity procedural wave normal texture
function createRealisticWaterNormalTexture() {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  const heights = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * Math.PI * 2 * 6;
      const v = (y / size) * Math.PI * 2 * 6;
      const h = Math.sin(u) * Math.cos(v) * 0.45 +
                Math.sin(u * 2.1 + 1.2) * Math.cos(v * 2.3 + 0.8) * 0.28 +
                Math.sin(u * 4.4 - v * 3.7) * 0.16 +
                Math.sin(u * 8.5 + v * 7.1) * 0.08 +
                Math.cos(u * 14.2 - v * 11.5) * 0.03;
      heights[y * size + x] = h;
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const xL = heights[y * size + ((x - 1 + size) % size)];
      const xR = heights[y * size + ((x + 1) % size)];
      const yU = heights[((y - 1 + size) % size) * size + x];
      const yD = heights[((y + 1) % size) * size + x];

      const dx = (xR - xL) * 3.2;
      const dy = (yD - yU) * 3.2;
      const dz = 1.0;
      const invLen = 1.0 / Math.hypot(dx, dy, dz);

      data[idx] = Math.floor((-dx * invLen * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((-dy * invLen * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor((dz * invLen * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(140, 140);
  return tex;
}

const waterNormalTexture = createRealisticWaterNormalTexture();

const oceanUniforms = {
  uTime: { value: 0 },
  uSunDir: { value: new THREE.Vector3(0.5, 0.7, 0.3).normalize() },
  uSunColor: { value: new THREE.Color(0xfff8ed) },
  uDeepColor: { value: new THREE.Color(WORLD_PALETTE.sea.deep) }, // tint multipliers: used raw
  uShallowColor: { value: new THREE.Color(WORLD_PALETTE.sea.shallow) },
  uFoamColor: { value: new THREE.Color(WORLD_PALETTE.sea.foam) },
};

const oceanMaterial = new THREE.MeshStandardMaterial({
  color: worldHex(WORLD_PALETTE.sea.base),
  roughness: 0.12,
  metalness: 0.12,
  normalMap: waterNormalTexture,
  normalScale: new THREE.Vector2(0.65, 0.65),
  transparent: true,
  opacity: 0.88,
});

oceanMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = oceanUniforms.uTime;
  shader.uniforms.uSunDir = oceanUniforms.uSunDir;
  shader.uniforms.uSunColor = oceanUniforms.uSunColor;
  shader.uniforms.uDeepColor = oceanUniforms.uDeepColor;
  shader.uniforms.uShallowColor = oceanUniforms.uShallowColor;
  shader.uniforms.uFoamColor = oceanUniforms.uFoamColor;

  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `#include <common>
    uniform float uTime;
    varying vec3 vWorldPosition;
    `
  );

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `#include <begin_vertex>
    float wave1 = sin(transformed.x * 0.018 + uTime * 1.5) * cos(transformed.y * 0.018 + uTime * 1.2) * 0.55;
    float wave2 = sin(transformed.x * 0.045 - uTime * 2.0) * cos(transformed.y * 0.04 + uTime * 1.6) * 0.22;
    transformed.z += wave1 + wave2;
    vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `#include <common>
    uniform float uTime;
    uniform vec3 uSunDir;
    uniform vec3 uSunColor;
    uniform vec3 uDeepColor;
    uniform vec3 uShallowColor;
    uniform vec3 uFoamColor;
    varying vec3 vWorldPosition;
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <normal_fragment_maps>',
    `#ifdef USE_NORMALMAP
      vec2 uvA = vUv * 160.0 + vec2(uTime * 0.012, uTime * 0.009);
      vec2 uvB = vUv * 240.0 + vec2(-uTime * 0.015, uTime * 0.018);
      vec3 mapN1 = texture2D(normalMap, uvA).xyz * 2.0 - 1.0;
      vec3 mapN2 = texture2D(normalMap, uvB).xyz * 2.0 - 1.0;
      vec3 blendedN = normalize(mapN1 + mapN2);
      normal = normalize(vNormal + blendedN * 0.45);
    #endif
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <dithering_fragment>',
    `#include <dithering_fragment>
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(clamp(1.0 - dot(normal, viewDir), 0.0, 1.0), 3.5);
    vec3 halfVec = normalize(uSunDir + viewDir);
    float spec = pow(max(0.0, dot(normal, halfVec)), 128.0) * 1.8;
    float crest = clamp((vWorldPosition.y - (-0.08)) * 1.4, 0.0, 1.0);
    vec3 waterColor = mix(uDeepColor, uShallowColor, fresnel * 0.6 + crest * 0.4);
    waterColor = mix(waterColor, uFoamColor, pow(crest, 4.0) * 0.35);

    gl_FragColor.rgb = mix(gl_FragColor.rgb * waterColor * 1.4, uSunColor, spec);
    `
  );
};

const ocean = new THREE.Mesh(
  new THREE.PlaneGeometry(75000, 75000, 160, 160),
  oceanMaterial,
);
ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -0.08;
ocean.receiveShadow = true;
scene.add(ocean);

// Atmospheric Scattering Sky Dome
function createSkyDome() {
  const geo = new THREE.SphereGeometry(44000, 48, 24);
  const uniforms = {
    uSunPos: { value: new THREE.Vector3(100, 200, 100).normalize() },
    uSkyTop: { value: new THREE.Color(WORLD_PALETTE.sky.day.top) },
    uSkyHorizon: { value: new THREE.Color(WORLD_PALETTE.sky.day.horizon) },
    uSunGlow: { value: new THREE.Color(WORLD_PALETTE.sky.day.glow) },
    uSunIntensity: { value: 1.0 },
    uNightMix: { value: 0.0 },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uSunPos;
      uniform vec3 uSkyTop;
      uniform vec3 uSkyHorizon;
      uniform vec3 uSunGlow;
      uniform float uSunIntensity;
      uniform float uNightMix;
      varying vec3 vWorldPosition;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec3 ray = normalize(vWorldPosition);
        float h = clamp(ray.y * 1.8, 0.0, 1.0);
        vec3 col = mix(uSkyHorizon, uSkyTop, pow(h, 0.65));

        float sunDot = max(0.0, dot(ray, uSunPos));
        float sunGlow = pow(sunDot, 12.0) * 0.65 * uSunIntensity;
        float sunDisk = step(0.9985, sunDot) * 2.2 * uSunIntensity;
        col += uSunGlow * (sunGlow + sunDisk);

        if (uNightMix > 0.01) {
          vec2 starCoord = ray.xz / (abs(ray.y) + 0.15) * 280.0;
          float starVal = hash(floor(starCoord));
          if (starVal > 0.993 && ray.y > 0.05) {
            float twinkle = sin(starCoord.x * 2.0 + starCoord.y * 3.0) * 0.3 + 0.7;
            col += vec3(1.0, 0.98, 0.9) * twinkle * uNightMix * (starVal - 0.993) * 120.0;
          }
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = { isEffect: true };
  scene.add(mesh);
  return { mesh, uniforms };
}

const skyDome = createSkyDome();

// 3D Volumetric Cloud Deck
function createCloudDeck() {
  const group = new THREE.Group();
  group.userData = { isEffect: true };

  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.95,
    metalness: 0.0,
    transparent: true,
    opacity: 0.82,
    flatShading: true,
  });

  const puffGeo = new THREE.DodecahedronGeometry(1, 1);
  const cloudCount = 20;

  for (let c = 0; c < cloudCount; c++) {
    const cluster = new THREE.Group();
    const angle = (c / cloudCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const dist = 1400 + Math.random() * 5200;
    const cy = 340 + Math.random() * 90;
    cluster.position.set(Math.cos(angle) * dist, cy, Math.sin(angle) * dist);

    const puffs = 7 + Math.floor(Math.random() * 6);
    for (let p = 0; p < puffs; p++) {
      const puff = new THREE.Mesh(puffGeo, cloudMat);
      const rad = 55 + Math.random() * 65;
      puff.scale.set(rad, rad * (0.45 + Math.random() * 0.3), rad * (0.8 + Math.random() * 0.4));
      puff.position.set(
        (p - puffs / 2) * 55 + (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 45
      );
      puff.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      cluster.add(puff);
    }
    cluster.userData = { speed: 1.2 + Math.random() * 1.5 };
    group.add(cluster);
  }

  scene.add(group);
  return group;
}

const cloudDeck = createCloudDeck();

// Ambient Sun Motes & Sea Mist Particles
function createAmbientAtmosphere() {
  // Sparse drifting pollen: enough to feel alive without veiling the view.
  const particleCount = 150;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 220;
    positions[i * 3 + 1] = Math.random() * 40 + 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 220;
    phases[i] = Math.random() * Math.PI * 2;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255, 255, 240, 1.0)");
  grad.addColorStop(0.3, "rgba(255, 245, 210, 0.6)");
  grad.addColorStop(1, "rgba(255, 240, 190, 0.0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  const particleTexture = new THREE.CanvasTexture(c);

  const mat = new THREE.PointsMaterial({
    size: 1.1,
    map: particleTexture,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  particles.userData = { isEffect: true, phases };
  scene.add(particles);
  return particles;
}

const ambientAtmosphere = createAmbientAtmosphere();
const animatedFoliage = [];

// ── 05-input-and-ui-events.js ─ Keyboard, pointer, touch and HUD button event bindings.
// Initialization moved to the end of the file to prevent TDZ errors.

document.querySelectorAll("[data-faction]").forEach((button) => {
  button.addEventListener("click", () => startGame(button.dataset.faction));
});

createAvatarButton?.addEventListener("click", createCustomAvatar);
saveAvatarButton?.addEventListener("click", saveSelectedAvatar);
deleteAvatarButton?.addEventListener("click", deleteSelectedAvatar);
previewAvatarButton?.addEventListener("click", previewAvatarFromForm);

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
  leftArmColorInput,
  rightArmColorInput,
  leftLegColorInput,
  rightLegColorInput,
  beltColorInput,
  capeColorInput,
  capeStyleInput,
].forEach((input) => {
  if (input) {
    input.addEventListener("input", previewAvatarFromForm);
    input.addEventListener("change", previewAvatarFromForm);
  }
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
const allowedMovementCodes = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "KeyR"]);

window.addEventListener("keydown", (event) => {
  // Prevent key events from moving character or performing actions when typing in inputs
  if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) {
    return;
  }
  if (event.code === "Escape") {
    event.preventDefault();
    toggleEscMenu();
    return;
  }
  if (escMenuOpen) return;
  if (!gameStarted || player.health <= 0 || player.stunTimer > 0) return;
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
  if (code === "KeyR") {
    attack();
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
  if (code === "KeyK") {
    toggleObservationHaki();
  }
  if (code === "KeyT") {
    flashStep();
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
  if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) {
    return;
  }
  if (escMenuOpen) return;
  const code = event.code;
  const key = event.key.toLowerCase();
  const mappedCode = movementCodeMap[key] || code;
  if (allowedMovementCodes.has(code) || movementCodeMap[key]) {
    keys.delete(mappedCode);
  }
  if (code === "Space") {
    releaseJump();
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
  mouseScreenPos.x = event.clientX;
  mouseScreenPos.y = event.clientY;
  if (escMenuOpen) return;
  if (player.health <= 0 || player.stunTimer > 0) return;

  if (event.pointerType === "touch") {
    isPointerDown = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    return;
  }

  // Left mouse click (0): Attack
  if (event.button === 0) {
    isLeftMouseDown = true;
    attack(event);
  }
  // Right mouse click (2): Camera / screen rotation
  else if (event.button === 2) {
    isPointerDown = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
  }
});

canvas.addEventListener("contextmenu", (event) => event.preventDefault());

window.addEventListener("pointerup", (event) => {
  if (event.pointerType === "touch") {
    isLeftMouseDown = false;
    isPointerDown = false;
  } else if (event.button === 0) {
    isLeftMouseDown = false;
  } else if (event.button === 2) {
    isPointerDown = false;
  } else {
    isLeftMouseDown = false;
    isPointerDown = false;
  }
});

window.addEventListener("blur", () => {
  isLeftMouseDown = false;
  isPointerDown = false;
});

window.addEventListener("pointermove", (event) => {
  mouseScreenPos.x = event.clientX;
  mouseScreenPos.y = event.clientY;
  if (escMenuOpen) return;
  if (!isPointerDown) return;
  cameraYaw -= (event.clientX - lastPointerX) * 0.006;
  cameraPitch = clamp(cameraPitch - (event.clientY - lastPointerY) * 0.004, -0.52, 0.95);
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
});

document.querySelectorAll("#mobile-controls [data-touch-key]").forEach((button) => {
  const code = button.dataset.touchKey;
  const release = (event) => {
    keys.delete(code);
    if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
  };
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (!gameStarted || escMenuOpen) return;
    button.setPointerCapture?.(event.pointerId);
    keys.add(code);
  });
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", () => keys.delete(code));
});

document.querySelectorAll("#mobile-controls [data-touch-action]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!gameStarted || escMenuOpen || player.health <= 0) return;
    if (button.dataset.touchAction === "attack") attack();
    if (button.dataset.touchAction === "jump") jump();
    if (button.dataset.touchAction === "interact") interact();
  });
});

document.querySelectorAll("#mobile-controls [data-touch-weapon]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!gameStarted || escMenuOpen) return;
    if (button.dataset.touchWeapon === "special" && !player.specialUnlocked) return;
    setWeapon(button.dataset.touchWeapon);
  });
});

homeTeleportButton?.addEventListener("click", () => {
  if (!gameStarted || homeTeleportCountdown > 0) return;
  homeTeleportCountdown = 5;
  teleportStatus.textContent = "Teleporting in 5s...";
  homeTeleportButton.disabled = true;
});

shiftlockToggle?.addEventListener("change", () => {
  shiftLockEnabled = shiftlockToggle.checked;
  shiftlockToggle.nextElementSibling.textContent = "Shift lock";
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
  playerMesh.position.set(0, STARTER_SURFACE_Y + 0.15, 12); // just south of the flagpole
  jumpOffset = 0;
  verticalVelocity = 0;
  isGrounded = true;
  playerMoveState.velocity.set(0, 0, 0);
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

// ── 06-start-and-multiplayer.js ─ Game start and the optional WebSocket multiplayer client.
function startGame(faction) {
  audio.init();
  player.faction = faction;
  if (faction === "Marines") {
    player.stats.defense += 1;
  }
  saveSelectedAvatar();
  factionScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  document.querySelector("#mobile-controls")?.classList.remove("hidden");
  setGameScrollLock(true);
  gameStarted = true;
  connectMultiplayer();
  checkNewQuestUnlocks();
  setWeapon(player.weapon);
  log(`You joined as ${faction}. Welcome to the First Sea.`);
  updateDerivedStats();
  updateHud();
  saveGame();
}

function setGameScrollLock(locked) {
  document.documentElement.classList.toggle("game-active", locked);
  document.body.classList.toggle("game-active", locked);
  if (locked) window.scrollTo(0, 0);
}

function setMultiplayerStatus(message, state = "idle") {
  if (!multiplayerStatus) return;
  multiplayerStatus.textContent = message;
  multiplayerStatus.dataset.state = state;
}

function multiplayerSend(message) {
  if (multiplayerState.socket?.readyState === WebSocket.OPEN) {
    multiplayerState.socket.send(JSON.stringify(message));
    return true;
  }
  return false;
}

function currentMultiplayerProfile() {
  const avatar = getSelectedAvatar() || DEFAULT_AVATARS[0];
  return {
    name: currentUsername || avatar.name || "Sailor",
    faction: player.faction,
    avatar,
    position: playerMesh ? { x: playerMesh.position.x, y: playerMesh.position.y, z: playerMesh.position.z } : { x: 0, y: STARTER_SURFACE_Y, z: 0 },
    rotation: playerMesh?.rotation.y || 0,
    weapon: player.weapon,
  };
}

// Automatic reconnects back off and then stop, so a missing server doesn't spam errors.
const MULTIPLAYER_MAX_AUTO_RETRIES = 3;
const multiplayerRetry = { failures: 0, everConnected: false };

function multiplayerOfflineHint() {
  const local = /^wss?:\/\/(localhost|127\.0\.0\.1)/.test(multiplayerUrl);
  return local
    ? "The multiplayer server isn't running. Start it in a second terminal with \"npm run multiplayer\", then press Servers to connect. Single-player works without it."
    : "The multiplayer servers can't be reached right now. You can keep playing solo; press Servers to try again.";
}

// Called from buttons: the player asked to connect, so try again even after giving up.
function connectMultiplayerManually(serverId) {
  multiplayerRetry.failures = 0;
  connectMultiplayer(serverId);
}

function connectMultiplayer(serverId = multiplayerState.targetServerId) {
  if (!multiplayerUrl || typeof WebSocket === "undefined") {
    setMultiplayerStatus("Multiplayer not configured", "error");
    if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = "Online servers are not configured for this site yet.";
    return;
  }
  if (multiplayerState.socket?.readyState === WebSocket.OPEN) {
    multiplayerState.targetServerId = serverId || null;
    multiplayerSend({ type: "join", ...currentMultiplayerProfile(), serverId: serverId || "" });
    multiplayerSend({ type: "list" });
    return;
  }
  if (multiplayerState.socket?.readyState === WebSocket.CONNECTING) return;
  clearTimeout(multiplayerState.reconnectTimer);
  multiplayerState.manualDisconnect = false;
  multiplayerState.targetServerId = serverId || null;
  setMultiplayerStatus("Connecting to servers…", "connecting");
  if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = "Connecting to the multiplayer service…";

  let socket;
  try { socket = new WebSocket(multiplayerUrl); }
  catch (error) {
    console.warn("Could not open multiplayer connection:", error?.message || error);
    setMultiplayerStatus("Servers offline", "error");
    return;
  }
  let opened = false;
  multiplayerState.socket = socket;
  socket.addEventListener("open", () => {
    if (multiplayerState.socket !== socket) return;
    opened = true;
    multiplayerRetry.failures = 0;
    multiplayerRetry.everConnected = true;
    multiplayerSend({ type: "join", ...currentMultiplayerProfile(), serverId: multiplayerState.targetServerId || "" });
  });
  socket.addEventListener("message", (event) => {
    if (multiplayerState.socket !== socket) return;
    let message;
    try { message = JSON.parse(event.data); } catch (error) {
      console.warn("Ignored an invalid multiplayer message:", error);
      return;
    }
    handleMultiplayerMessage(message);
  });
  // A WebSocket error event carries no details (it logs as "{}"); the close handler
  // below decides what to do, so this only notes it quietly.
  socket.addEventListener("error", () => {
    if (multiplayerState.socket !== socket) return;
    if (multiplayerRetry.failures === 0) console.warn(`Multiplayer server not reachable at ${multiplayerUrl}. Playing offline.`);
  });
  socket.addEventListener("close", () => {
    if (multiplayerState.socket !== socket) return;
    multiplayerState.socket = null;
    multiplayerState.clientId = null;
    multiplayerState.serverId = null;
    clearRemotePlayers();
    if (multiplayerState.manualDisconnect || !gameStarted) {
      setMultiplayerStatus("Offline", "idle");
      return;
    }
    if (!opened) multiplayerRetry.failures += 1;
    if (multiplayerRetry.failures > MULTIPLAYER_MAX_AUTO_RETRIES) {
      setMultiplayerStatus("Servers offline", "error");
      if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = multiplayerOfflineHint();
      return;
    }
    // 2.5s, 5s, 10s ... capped at 30s.
    const delay = Math.min(30000, 2500 * Math.pow(2, Math.max(0, multiplayerRetry.failures - 1)));
    setMultiplayerStatus(opened ? "Disconnected · reconnecting" : "Servers offline · retrying", "error");
    multiplayerState.reconnectTimer = setTimeout(() => connectMultiplayer(multiplayerState.targetServerId), delay);
  });
}

function handleMultiplayerMessage(message) {
  if (message.type === "server-list") {
    renderMultiplayerServers(Array.isArray(message.servers) ? message.servers : []);
    return;
  }
  if (message.type === "joined") {
    multiplayerState.clientId = message.id;
    multiplayerState.serverId = message.server?.id || null;
    multiplayerState.serverName = message.server?.name || "World server";
    multiplayerState.targetServerId = multiplayerState.serverId;
    const count = message.server?.players ?? 1;
    const capacity = message.server?.capacity ?? 10;
    setMultiplayerStatus(`${multiplayerState.serverName} · ${count}/${capacity}`, "connected");
    if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = `Connected to ${multiplayerState.serverName}. Players in this server: ${count}/${capacity}.`;
    (message.players || []).forEach(upsertRemotePlayer);
    multiplayerSend({ type: "list" });
    return;
  }
  if (message.type === "player-joined") {
    upsertRemotePlayer(message.player);
    return;
  }
  if (message.type === "player-state") {
    upsertRemotePlayer(message.player);
    return;
  }
  if (message.type === "player-left") {
    removeRemotePlayer(message.id);
    return;
  }
  if (message.type === "server-error") {
    if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = message.message || "The server could not complete that request.";
    if (!multiplayerState.serverId && multiplayerState.targetServerId) {
      setMultiplayerStatus("Server unavailable", "error");
      multiplayerState.targetServerId = null;
      multiplayerSend({ type: "join", ...currentMultiplayerProfile(), serverId: "" });
    } else if (multiplayerState.serverId) {
      multiplayerSend({ type: "list" });
    } else {
      setMultiplayerStatus("Server unavailable", "error");
    }
  }
}

function upsertRemotePlayer(data) {
  if (!data || !data.id || data.id === multiplayerState.clientId || !data.position) return;
  let remote = multiplayerState.players.get(data.id);
  if (!remote) {
    const avatar = { ...DEFAULT_AVATARS[0], ...(data.avatar || {}), name: String(data.name || "Sailor").slice(0, 18) };
    const mesh = createHumanAvatarModel(avatar, { showName: true, showSword: false });
    mesh.userData.remotePlayerId = data.id;
    scene.add(mesh);
    remote = { mesh, target: new THREE.Vector3(data.position.x, data.position.y, data.position.z), targetYaw: Number(data.rotation) || 0 };
    multiplayerState.players.set(data.id, remote);
  } else {
    remote.target.set(data.position.x, data.position.y, data.position.z);
    remote.targetYaw = Number(data.rotation) || 0;
  }
}

function disposeRemoteMesh(mesh) {
  mesh.traverse((object) => {
    object.geometry?.dispose?.();
    const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => { if (value?.isTexture) value.dispose(); });
      material.dispose?.();
    });
  });
}

function removeRemotePlayer(id) {
  const remote = multiplayerState.players.get(id);
  if (!remote) return;
  scene.remove(remote.mesh);
  disposeRemoteMesh(remote.mesh);
  multiplayerState.players.delete(id);
}

function clearRemotePlayers() {
  for (const id of [...multiplayerState.players.keys()]) removeRemotePlayer(id);
}

function renderMultiplayerServers(servers) {
  if (!multiplayerServerList) return;
  const currentServer = servers.find((server) => server.id === multiplayerState.serverId);
  if (currentServer) {
    setMultiplayerStatus(`${currentServer.name} · ${currentServer.players}/${currentServer.capacity}`, "connected");
    if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = `Connected to ${currentServer.name}. Players in this server: ${currentServer.players}/${currentServer.capacity}.`;
  }
  multiplayerServerList.replaceChildren();
  if (servers.length === 0) {
    const empty = document.createElement("p");
    empty.className = "multiplayer-browser-message";
    empty.textContent = "No active servers yet. Find an open server to create one.";
    multiplayerServerList.append(empty);
    return;
  }
  servers.forEach((server) => {
    const card = document.createElement("div");
    card.className = "multiplayer-server-card";
    const label = document.createElement("span");
    label.textContent = `${server.name} · ${server.players}/${server.capacity}`;
    const join = document.createElement("button");
    const isFull = server.players >= server.capacity;
    join.type = "button";
    join.textContent = isFull ? "Full" : server.id === multiplayerState.serverId ? "Current" : "Join";
    join.disabled = isFull || server.id === multiplayerState.serverId;
    join.addEventListener("click", () => connectMultiplayerManually(server.id));
    card.append(label, join);
    multiplayerServerList.append(card);
  });
}

function initMultiplayerBrowser() {
  multiplayerOpenButton?.addEventListener("click", () => {
    multiplayerBrowser?.classList.remove("hidden");
    if (!multiplayerUrl) {
      setMultiplayerStatus("Multiplayer not configured", "error");
      if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = "No multiplayer endpoint is configured. The site owner must set NEXT_PUBLIC_MULTIPLAYER_URL to the multiplayer WebSocket address.";
      return;
    }
    multiplayerSend({ type: "list" });
    if (!multiplayerState.socket || multiplayerState.socket.readyState === WebSocket.CLOSED) connectMultiplayerManually();
  });
  multiplayerCloseButton?.addEventListener("click", () => multiplayerBrowser?.classList.add("hidden"));
  multiplayerQuickJoinButton?.addEventListener("click", () => connectMultiplayerManually());
}

function stopMultiplayer() {
  multiplayerState.manualDisconnect = true;
  clearTimeout(multiplayerState.reconnectTimer);
  if (multiplayerState.socket) {
    const socket = multiplayerState.socket;
    multiplayerState.socket = null;
    socket.close(1000, "Player left the game");
  }
  multiplayerState.clientId = null;
  multiplayerState.serverId = null;
  clearRemotePlayers();
  setMultiplayerStatus("Offline", "idle");
}

function updateMultiplayer(dt, time) {
  if (multiplayerState.socket?.readyState === WebSocket.OPEN) {
    if (time - multiplayerState.lastSentAt >= 100 && playerMesh) {
      multiplayerState.lastSentAt = time;
      multiplayerSend({
        type: "state",
        position: { x: playerMesh.position.x, y: playerMesh.position.y, z: playerMesh.position.z },
        rotation: playerMesh.rotation.y,
        weapon: player.weapon,
      });
    }
  }
  for (const remote of multiplayerState.players.values()) {
    remote.mesh.position.lerp(remote.target, Math.min(1, dt * 12));
    const yawDelta = Math.atan2(Math.sin(remote.targetYaw - remote.mesh.rotation.y), Math.cos(remote.targetYaw - remote.mesh.rotation.y));
    remote.mesh.rotation.y += yawDelta * Math.min(1, dt * 12);
  }
}

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

// ── 08-avatar-studio-3d.js ─ 3D avatar studio preview and in-game alert toasts.
// ==========================================
// 3D Avatar Customizer & Studio Renderer
// ==========================================

function initAvatar3DPreview() {
  const container = document.querySelector("#avatar-3d-preview-container");
  if (!container || avatarPreview3D.renderer) return;

  const width = container.clientWidth || 380;
  const height = container.clientHeight || 400;

  // Scene setup
  const scene = new THREE.Scene();
  avatarPreview3D.scene = scene;

  // Camera setup
  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  camera.position.set(0, 7.5, 23); // Centered relative to mesh height
  avatarPreview3D.camera = camera;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  avatarPreview3D.renderer = renderer;

  // Ambient & directional lighting for realistic detail shading
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111620, 0.85);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.75);
  dirLight.position.set(5, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 25;
  dirLight.shadow.camera.left = -6;
  dirLight.shadow.camera.right = 6;
  dirLight.shadow.camera.top = 10;
  dirLight.shadow.camera.bottom = -4;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x90b0d0, 0.35);
  fillLight.position.set(-6, 4, -4);
  scene.add(fillLight);

  // Platform and grid helper
  const platformGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.4, 32);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x11202e,
    roughness: 0.85,
    metalness: 0.1,
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.y = -0.2;
  platform.receiveShadow = true;
  scene.add(platform);

  const gridHelper = new THREE.GridHelper(8, 8, 0xf6b73c, 0x1b3c52);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);

  // click and drag interaction to orbit-rotate
  container.addEventListener("pointerdown", (e) => {
    avatarPreview3D.isDragging = true;
    avatarPreview3D.previousMouseX = e.clientX;
    avatarPreview3D.autoRotate = false;
  });

  window.addEventListener("pointermove", (e) => {
    if (!avatarPreview3D.isDragging) return;
    const deltaX = e.clientX - avatarPreview3D.previousMouseX;
    avatarPreview3D.rotationY += deltaX * 0.007;
    avatarPreview3D.previousMouseX = e.clientX;
    if (avatarPreview3D.characterGroup) {
      avatarPreview3D.characterGroup.rotation.y = avatarPreview3D.rotationY;
    }
  });

  const stopDrag = () => {
    if (avatarPreview3D.isDragging) {
      avatarPreview3D.isDragging = false;
      setTimeout(() => {
        if (!avatarPreview3D.isDragging) {
          avatarPreview3D.autoRotate = true;
        }
      }, 4000);
    }
  };
  window.addEventListener("pointerup", stopDrag);
  window.addEventListener("pointercancel", stopDrag);

  // auto-adjust viewport on container dimensions change
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const w = entry.contentRect.width || 380;
      const h = entry.contentRect.height || 400;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  });
  resizeObserver.observe(container);

  // Render Loop
  function animatePreview() {
    avatarPreview3D.animationFrameId = requestAnimationFrame(animatePreview);

    if (avatarPreview3D.autoRotate && avatarPreview3D.characterGroup) {
      avatarPreview3D.rotationY += 0.005;
      avatarPreview3D.characterGroup.rotation.y = avatarPreview3D.rotationY;
    }

    renderer.render(scene, camera);
  }
  animatePreview();
}

function updateAvatarPreview3D(avatar) {
  if (!avatarPreview3D.scene) {
    initAvatar3DPreview();
  }
  const scene = avatarPreview3D.scene;
  if (!scene) return;

  // Clear previous mesh instances to avoid memory leaks
  if (avatarPreview3D.characterGroup) {
    scene.remove(avatarPreview3D.characterGroup);
    avatarPreview3D.characterGroup.traverse((node) => {
      if (node.isMesh) {
        node.geometry.dispose();
        if (Array.isArray(node.material)) {
          node.material.forEach(m => m.dispose());
        } else {
          node.material.dispose();
        }
      }
    });
  }

  // Build new mesh model on the customizer platform
  const model = createHumanAvatarModel(avatar, { showName: false, showSword: true });
  model.position.y = 0.05;
  model.rotation.y = avatarPreview3D.rotationY;
  
  scene.add(model);
  avatarPreview3D.characterGroup = model;

  // Sync editor labels and stats
  const previewNameText = document.querySelector("#studio-preview-name");
  const traitsLabel = document.querySelector("#studio-preview-traits-label");
  const traitsDetail = document.querySelector("#studio-preview-traits");
  
  if (previewNameText) previewNameText.textContent = avatar.name;
  
  const traits = getAvatarTraits(avatar);
  if (traitsLabel) {
    traitsLabel.textContent = traits.label || "Balanced bulk";
  }
  if (traitsDetail) {
    traitsDetail.innerHTML = formatAvatarTraitsHTML(traits);
  }
}

function formatAvatarTraitsHTML(traits) {
  return `
    <strong>Health Multiplier:</strong> ${(traits.healthMultiplier * 100).toFixed(0)}% | 
    <strong>Damage Multiplier:</strong> ${(traits.damageMultiplier * 100).toFixed(0)}%<br>
    <strong>Speed Multiplier:</strong> ${(traits.speedMultiplier * 100).toFixed(0)}% | 
    <strong>Range Multiplier:</strong> ${(traits.rangeMultiplier * 100).toFixed(0)}%
  `;
}

// ==========================================
// Custom Popup Alerts Notification
// ==========================================

function showMarketplaceAlert(title, message) {
  let alertEl = document.querySelector("#marketplace-alert");
  if (!alertEl) {
    alertEl = document.createElement("div");
    alertEl.id = "marketplace-alert";
    alertEl.style.cssText = `
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      background: rgba(6, 18, 28, 0.95);
      border: 1.5px solid var(--gold);
      border-radius: 12px;
      padding: 12px 20px;
      color: #fff;
      z-index: 100000;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      text-align: center;
      min-width: 250px;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(alertEl);
  }
  
  alertEl.innerHTML = `
    <strong style="display: block; color: var(--gold); font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">${title}</strong>
    <span style="font-size: 12px; color: rgba(255, 247, 230, 0.85);">${message}</span>
  `;
  
  // Slide down & fade in
  alertEl.style.transform = "translateX(-50%) translateY(0)";
  alertEl.style.opacity = "1";
  
  // Slide back up after 3.5 seconds
  setTimeout(() => {
    alertEl.style.transform = "translateX(-50%) translateY(-100px)";
    alertEl.style.opacity = "0";
  }, 3500);
}

// ── 09-marketplace.js ─ Simulated avatar marketplace.
// ==========================================
// Simulated Trading Marketplace Mechanics
// ==========================================

const npcCreators = [
  "Captain Redbeard",
  "Sea Rogue Marlo",
  "Dread Captain Rourke",
  "Admiral Corin",
  "Tessa the Stylist",
  "Longshot Pell",
  "Solo Blade Kaito",
  "Ember Kick Rhys",
  "Patchwork Pip",
  "Greybeard Jr",
  "Gem Queen Ivy",
  "Flint the Firestarter"
];

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateMockListing(id) {
  const npcName = npcCreators[Math.floor(Math.random() * npcCreators.length)];
  const hairStyles = ["short", "spiky", "cap", "messy"];
  const outfitStyles = ["sailor", "coat", "armor", "adventurer"];
  const capeStyles = ["none", "normal", "long", "torn"];
  
  const skinCol = getRandomColor();
  const shirtCol = getRandomColor();
  const pantsCol = getRandomColor();
  const hairCol = getRandomColor();
  const eyesCol = getRandomColor();
  const bootsCol = getRandomColor();
  
  const hStyle = hairStyles[Math.floor(Math.random() * hairStyles.length)];
  const oStyle = outfitStyles[Math.floor(Math.random() * outfitStyles.length)];
  const cStyle = capeStyles[Math.floor(Math.random() * capeStyles.length)];
  
  const height = Math.floor(Math.random() * 41) + 85; // 85% to 125%
  const build = Math.floor(Math.random() * 51) + 80;   // 80% to 130%
  
  const names = [
    "Dread Admiral", "Abyss Raider", "Jungle Ranger", "Desert Nomad", 
    "Scurvy Mate", "Coral Defender", "Wave Master", "Storm Vanguard", 
    "Shadow Assassin", "Glory Captain", "Red Corsair", "Blue Mariner"
  ];
  const avatarName = names[Math.floor(Math.random() * names.length)];

  return {
    id: id || `npc-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    price: Math.floor(Math.random() * 12) * 100 + 300, // $300 to $1400
    creator: npcName,
    isPlayerListing: false,
    avatar: {
      id: `avatar-template-${Math.floor(Math.random() * 100000)}`,
      name: avatarName,
      skin: skinCol,
      shirt: shirtCol,
      pants: pantsCol,
      hair: hairCol,
      eyes: eyesCol,
      boots: bootsCol,
      hairStyle: hStyle,
      outfit: oStyle,
      height: height,
      build: build,
      
      leftArmColor: getRandomColor(),
      rightArmColor: getRandomColor(),
      leftLegColor: getRandomColor(),
      rightLegColor: getRandomColor(),
      beltColor: getRandomColor(),
      capeColor: getRandomColor(),
      capeStyle: cStyle,
    }
  };
}

function initMarketState() {
  const saveStr = localStorage.getItem("sea_legends_save");
  if (saveStr) {
    try {
      const saveData = JSON.parse(saveStr);
      if (saveData.marketListings) {
        marketState.listings = saveData.marketListings;
        return;
      }
    } catch (e) {
      console.error("Failed to parse market save data", e);
    }
  }
  
  // Pre-populate with 6 mock NPC listings
  marketState.listings = [];
  for (let i = 0; i < 6; i++) {
    marketState.listings.push(generateMockListing(`npc-init-${i}`));
  }
}

function renderMarketplace() {
  const cashDisplay = document.querySelector("#market-player-cash");
  if (cashDisplay) {
    cashDisplay.textContent = `Cash: $${player.money}`;
  }

  const yourListingsContainer = document.querySelector("#market-your-listings");
  const browseListingsContainer = document.querySelector("#market-browse-listings");

  if (!yourListingsContainer || !browseListingsContainer) return;

  yourListingsContainer.innerHTML = "";
  browseListingsContainer.innerHTML = "";

  const playerListings = marketState.listings.filter(l => l.isPlayerListing);
  const npcListings = marketState.listings.filter(l => !l.isPlayerListing);

  if (playerListings.length === 0) {
    yourListingsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.3); font-size: 12px; padding: 15px; background: rgba(255,255,255,0.01); border-radius: 10px; border: 1px dashed rgba(255,255,255,0.05);">You have no designs published for sale. Customize an avatar and set a price to publish!</div>`;
  } else {
    playerListings.forEach(l => {
      yourListingsContainer.appendChild(createMarketCard(l));
    });
  }

  if (npcListings.length === 0) {
    browseListingsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.3); font-size: 12px; padding: 15px; background: rgba(255,255,255,0.01); border-radius: 10px; border: 1px dashed rgba(255,255,255,0.05);">No listings currently available. Check back later!</div>`;
  } else {
    npcListings.forEach(l => {
      browseListingsContainer.appendChild(createMarketCard(l));
    });
  }
}

function createMarketCard(listing) {
  const card = document.createElement("div");
  card.className = "market-card";
  
  const colorDots = `
    <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.skin};" title="Skin"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.torsoColor || listing.avatar.shirt};" title="Torso"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.leftArmColor || listing.avatar.shirt};" title="Left Arm"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.rightArmColor || listing.avatar.shirt};" title="Right Arm"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.leftLegColor || listing.avatar.pants};" title="Left Leg"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.rightLegColor || listing.avatar.pants};" title="Right Leg"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.hair};" title="Hair"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.eyes};" title="Eyes"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.boots || listing.avatar.bootsColor || '#23170f'};" title="Boots"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.beltColor || listing.avatar.boots || '#23170f'};" title="Belt"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.capeColor || listing.avatar.shirt || '#a82020'};" title="Cape"></span>
    </div>
  `;

  const detailsText = `
    <div style="font-size: 11px; color: rgba(255,255,255,0.5); line-height: 1.3;">
      Style: <strong>${listing.avatar.outfit}</strong> / ${listing.avatar.hairStyle}<br>
      Height: ${listing.avatar.height || 100}% | Build: ${listing.avatar.build || 100}%
    </div>
  `;

  card.innerHTML = `
    <div class="market-card-preview">
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
        <span style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">👕</span>
        <span style="font-size: 11px; font-weight: bold; background: rgba(0,0,0,0.4); color: #fff; padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">${listing.avatar.name}</span>
      </div>
    </div>
    <div class="market-card-details">
      <h5 class="market-card-name">${listing.avatar.name}</h5>
      <span class="market-card-creator">Creator: ${listing.creator}</span>
      ${colorDots}
      ${detailsText}
    </div>
    <div class="market-card-footer">
      <span class="market-card-price">$${listing.price}</span>
      ${listing.isPlayerListing 
        ? `<button class="market-card-btn danger" onclick="cancelListing('${listing.id}')">Cancel</button>` 
        : `<button class="market-card-btn" onclick="buyListing('${listing.id}')">Buy Template</button>`
      }
    </div>
  `;
  
  return card;
}

window.cancelListing = function(listingId) {
  const listing = marketState.listings.find(l => l.id === listingId);
  if (!listing) return;
  
  marketState.listings = marketState.listings.filter(l => l.id !== listingId);
  log(`Cancelled sale listing for design '${listing.avatar.name}'.`);
  
  saveGame();
  renderMarketplace();
};

window.buyListing = function(listingId) {
  const listing = marketState.listings.find(l => l.id === listingId);
  if (!listing) return;

  if (player.money < listing.price) {
    log(`❌ Insufficient funds! You need $${listing.price} to buy this template.`);
    showMarketplaceAlert("❌ Insufficient Funds", `You need $${listing.price} to purchase this design.`);
    return;
  }

  player.money -= listing.price;
  
  const newAvatar = {
    ...listing.avatar,
    id: `custom-bought-${Date.now()}`
  };
  avatarState.avatars.push(newAvatar);
  avatarState.selectedId = newAvatar.id;
  
  marketState.listings = marketState.listings.filter(l => l.id !== listingId);
  
  log(`🛒 Purchased template '${listing.avatar.name}' for $${listing.price}! Added to templates.`);
  showMarketplaceAlert("🎉 Design Purchased", `You successfully bought "${listing.avatar.name}" design!`);
  
  applyAvatarToPlayer();
  renderAvatarChoices();
  loadAvatarIntoEditor(newAvatar);
  updateAvatarPreview3D(newAvatar);
  
  saveGame();
  renderMarketplace();
};

function publishListing() {
  const priceInput = document.querySelector("#studio-sell-price");
  if (!priceInput) return;
  const price = Math.round(Number(priceInput.value));
  if (isNaN(price) || price < 50) {
    log("❌ Invalid price! Sale price must be at least $50.");
    showMarketplaceAlert("❌ Invalid Price", "Please enter a price of $50 or more.");
    return;
  }

  const currentAvatar = getAvatarFromStudioEditor();
  
  const newListing = {
    id: `player-list-${Date.now()}`,
    price: price,
    creator: "You",
    isPlayerListing: true,
    avatar: { ...currentAvatar, id: `avatar-copy-${Date.now()}` }
  };

  marketState.listings.push(newListing);
  log(`🛒 Published design "${currentAvatar.name}" for sale at $${price}!`);
  showMarketplaceAlert("✨ Design Published", `"${currentAvatar.name}" is now listed in the shop for $${price}!`);

  saveGame();
  renderMarketplace();
}

function runMarketplaceNPCSimulation() {
  const playerListings = marketState.listings.filter(l => l.isPlayerListing);
  if (playerListings.length === 0) return;

  const targetListing = playerListings[Math.floor(Math.random() * playerListings.length)];
  const price = targetListing.price;
  let chance = 0.05;
  
  if (price <= 200) chance = 0.35;
  else if (price <= 500) chance = 0.22;
  else if (price <= 1500) chance = 0.12;
  else if (price <= 5000) chance = 0.05;
  else if (price <= 20000) chance = 0.02;
  else chance = 0.005;

  if (Math.random() < chance) {
    const buyerName = npcCreators[Math.floor(Math.random() * npcCreators.length)];
    marketState.listings = marketState.listings.filter(l => l.id !== targetListing.id);
    player.money += targetListing.price;
    
    log(`✨ [Marketplace] NPC ${buyerName} bought your design "${targetListing.avatar.name}" for $${targetListing.price}!`);
    showMarketplaceAlert("💰 Item Sold!", `${buyerName} bought your design "${targetListing.avatar.name}" for $${targetListing.price}!`);
    audio.playQuestComplete();
    
    saveGame();
    renderMarketplace();
  }
}

function runMarketplaceNPCListingSimulation() {
  const npcListings = marketState.listings.filter(l => !l.isPlayerListing);
  
  if (npcListings.length < 8 && Math.random() < 0.35) {
    const newListing = generateMockListing();
    marketState.listings.push(newListing);
    log(`[Marketplace] A new design template by ${newListing.creator} has been listed!`);
    renderMarketplace();
    saveGame();
  }
}

// Set up periodic simulation cycles
setInterval(runMarketplaceNPCSimulation, 25000);
setInterval(runMarketplaceNPCListingSimulation, 45000);

// ── 10-studio-ui.js ─ Avatar studio modal bindings.
function initAvatarStudioUI() {
  const dropdown = document.querySelector("#faction-avatar-dropdown");
  if (dropdown) {
    dropdown.addEventListener("change", () => {
      avatarState.selectedId = dropdown.value;
      applyAvatarToPlayer();
      renderAvatarChoices();
    });
  }

  const tabBtnDesigner = document.querySelector("#tab-btn-designer");
  const tabBtnMarketplace = document.querySelector("#tab-btn-marketplace");
  const panelDesigner = document.querySelector("#panel-designer");
  const panelMarketplace = document.querySelector("#panel-marketplace");

  if (tabBtnDesigner && tabBtnMarketplace && panelDesigner && panelMarketplace) {
    tabBtnDesigner.addEventListener("click", () => {
      tabBtnDesigner.classList.add("active");
      tabBtnMarketplace.classList.remove("active");
      panelDesigner.classList.add("active");
      panelMarketplace.classList.remove("active");
      const activeAvatar = getAvatarFromStudioEditor();
      updateAvatarPreview3D(activeAvatar);
    });

    tabBtnMarketplace.addEventListener("click", () => {
      tabBtnMarketplace.classList.add("active");
      tabBtnDesigner.classList.remove("active");
      panelMarketplace.classList.add("active");
      panelDesigner.classList.remove("active");
      renderMarketplace();
    });
  }

  const studioModal = document.querySelector("#avatar-studio-modal");
  const studioCloseBtn = document.querySelector("#avatar-studio-close-btn");
  const factionOpenStudioBtn = document.querySelector("#faction-open-studio-btn");
  const navBtnAvatar = document.querySelector("#nav-btn-avatar");

  function openStudioModal() {
    if (!studioModal) return;
    studioModal.classList.remove("hidden");
    setTimeout(() => {
      studioModal.style.opacity = "1";
      studioModal.style.pointerEvents = "auto";
      const modalContent = studioModal.querySelector(".modal-content");
      if (modalContent) modalContent.style.transform = "scale(1)";
    }, 10);

    const activeAvatar = getSelectedAvatar();
    loadAvatarIntoEditor(activeAvatar);
    updateAvatarPreview3D(activeAvatar);
  }

  function closeStudioModal() {
    if (!studioModal) return;
    studioModal.style.opacity = "0";
    studioModal.style.pointerEvents = "none";
    const modalContent = studioModal.querySelector(".modal-content");
    if (modalContent) modalContent.style.transform = "scale(0.95)";
    setTimeout(() => {
      studioModal.classList.add("hidden");
    }, 300);

    if (avatarPreview3D.animationFrameId) {
      cancelAnimationFrame(avatarPreview3D.animationFrameId);
      avatarPreview3D.animationFrameId = null;
    }
  }

  if (studioCloseBtn) studioCloseBtn.addEventListener("click", closeStudioModal);
  if (factionOpenStudioBtn) factionOpenStudioBtn.addEventListener("click", openStudioModal);
  if (navBtnAvatar) navBtnAvatar.addEventListener("click", openStudioModal);

  const publishBtn = document.querySelector("#studio-publish-btn");
  if (publishBtn) {
    publishBtn.addEventListener("click", publishListing);
  }

  const heightValText = document.querySelector("#studio-val-height");
  const buildValText = document.querySelector("#studio-val-build");

  if (studioHeightScaleInput && heightValText) {
    studioHeightScaleInput.addEventListener("input", () => {
      heightValText.textContent = `${studioHeightScaleInput.value}%`;
    });
  }
  if (studioBuildScaleInput && buildValText) {
    studioBuildScaleInput.addEventListener("input", () => {
      buildValText.textContent = `${studioBuildScaleInput.value}%`;
    });
  }

  // Bind event listeners to studio inputs
  [
    studioAvatarNameInput,
    studioSkinColorInput,
    studioShirtColorInput,
    studioLeftArmColorInput,
    studioRightArmColorInput,
    studioHairColorInput,
    studioEyeColorInput,
    studioLeftLegColorInput,
    studioRightLegColorInput,
    studioPantsColorInput,
    studioBootColorInput,
    studioBeltColorInput,
    studioCapeColorInput,
    studioHairStyleInput,
    studioOutfitStyleInput,
    studioCapeStyleInput,
    studioHeightScaleInput,
    studioBuildScaleInput,
    ...Object.values(STUDIO_EXTRA_FIELDS).map((cfg) => document.querySelector(cfg.id)),
  ].forEach((input) => {
    if (input) {
      input.addEventListener("input", previewStudioAvatarFromForm);
      input.addEventListener("change", previewStudioAvatarFromForm);
    }
  });

  document.querySelectorAll(".studio-slider[data-readout]").forEach((slider) => {
    slider.addEventListener("input", refreshStudioSliderReadouts);
  });

  // Avatar code: copy the current design, or load one someone shared.
  const codeBox = document.querySelector("#studio-avatar-code");
  const codeStatus = document.querySelector("#studio-code-status");
  const setCodeStatus = (text, isError = false) => {
    if (!codeStatus) return;
    codeStatus.textContent = text;
    codeStatus.classList.toggle("error", isError);
  };
  document.querySelector("#studio-export-code")?.addEventListener("click", async () => {
    const code = encodeAvatarCode(getAvatarFromStudioEditor());
    if (codeBox) codeBox.value = code;
    try {
      await navigator.clipboard.writeText(code);
      setCodeStatus("Code copied. Share it, or paste it here later to bring this design back.");
    } catch (error) {
      codeBox?.select();
      setCodeStatus("Code ready below. Press Ctrl+C to copy it.");
    }
  });
  document.querySelector("#studio-import-code")?.addEventListener("click", () => {
    try {
      const imported = decodeAvatarCode(codeBox?.value);
      const current = getAvatarFromStudioEditor();
      loadAvatarIntoEditor({ ...current, ...imported, id: current.id });
      previewStudioAvatarFromForm();
      setCodeStatus("Design imported. Press Save Changes or Create New to keep it.");
    } catch (error) {
      setCodeStatus(error.message, true);
    }
  });

  // Bind click listeners to studio action buttons
  if (studioCreateAvatarButton) {
    studioCreateAvatarButton.addEventListener("click", createStudioCustomAvatar);
  }
  if (studioSaveAvatarButton) {
    studioSaveAvatarButton.addEventListener("click", saveStudioSelectedAvatar);
  }
  if (studioDeleteAvatarButton) {
    studioDeleteAvatarButton.addEventListener("click", deleteStudioSelectedAvatar);
  }
}

// ── 11-progression-and-saves.js ─ Mastery, default avatars, local profiles, saving and loading.
function getMasteryInfo(totalPoints) {
  let level = 1;
  let pointsLeft = Math.max(0, totalPoints);
  while (true) {
    let neededForNext = Math.round(40 * Math.pow(1.2, level - 1));
    if (pointsLeft >= neededForNext) {
      pointsLeft -= neededForNext;
      level++;
    } else {
      break;
    }
  }
  let neededForNext = Math.round(40 * Math.pow(1.2, level - 1));
  return {
    level: level,
    currentLevelPoints: pointsLeft,
    neededForNext: neededForNext
  };
}

function addMasteryXp(type, amount) {
  if (!player.masteryXp) {
    player.masteryXp = { melee: 0, defense: 0, sword: 0, gun: 0, special: 0 };
  }
  const oldLevel = player.mastery[type] || 1;
  player.masteryXp[type] = (player.masteryXp[type] || 0) + amount;
  
  // Calculate new level from total accumulated points
  const masteryInfo = getMasteryInfo(player.masteryXp[type]);
  const newLevel = masteryInfo.level;
  player.mastery[type] = newLevel;
  
  if (newLevel > oldLevel) {
    log(`🎉 Your ${statLabels[type] || type} Mastery reached Level ${newLevel}!`);
    audio.playQuestComplete();
    
    // Alert if any skills unlocked
    const skills = masterySkills[type] || [];
    skills.forEach(skill => {
      if (newLevel >= skill.req && oldLevel < skill.req) {
        log(`🌟 SKILL UNLOCKED: ${skill.name} (${statLabels[type] || type} skill)!`);
      }
    });
  }
  updateHud();
  saveGame();
}

let currentUsername = "";

const DEFAULT_AVATARS = [
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
  }
];

function resetPlayerState() {
  player.faction = "Neutral";
  player.level = 1;
  player.xp = 0;
  player.xpToNext = 100;
  player.money = 0;
  player.materials = { ironwood: 0, scrap: 0, jungleCore: 0 };
  player.statPoints = 0;
  player.health = 120;
  player.maxHealth = 120;
  player.stamina = 100;
  player.maxStamina = 100;
  player.oxygen = 100;
  player.movementMode = "walk";
  player.isSwimming = false;
  player.isBlocking = false;
  player.isDashing = false;
  player.dashCooldown = 0;
  player.stunTimer = 0;
  player.knockedDown = false;
  player.lastMoveSpeed = 0;
  player.lastFallVelocity = 0;
  player.haki = { unlocked: false, active: false, level: 0, kills: 0, nextKills: 8 };
  player.stats = { melee: 1, defense: 1, sword: 1, gun: 1, special: 0 };
  player.mastery = { melee: 1, defense: 1, sword: 1, gun: 1, special: 1 };
  player.masteryXp = { melee: 0, defense: 0, sword: 0, gun: 0, special: 0 };
  player.armoredWillCooldown = 0;
  player.blockStartTime = 0;
  player.shieldTimer = 0;
  player.weapon = "melee";
  player.hasSword = false;
  player.hasGun = false;
  player.specialUnlocked = false;
  player.unlockedQuestsSeen = { starter: true };
  player.newQuestUnlocked = false;
  player.isAdmin = false;
  player.isGodMode = false;
  player.isInstakill = false;
  player.hasFlamingFeet = true;
  player.diableJambeTimer = 0;
  player.diableJambeHits = 0;
  player.hasFlashStep = false;
  player.flashStepCooldown = 0;
  player.observationHaki = {
    unlocked: false,
    active: false,
    dodges: 5,
    maxDodges: 5,
    regenTimer: 0,
  };

  activeQuest = null;
  if (typeof isHelming !== 'undefined' && isHelming) {
    unhelmBoat();
  }

  // Restore default avatars
  avatarState.selectedId = "tavern-hero";
  avatarState.avatars = JSON.parse(JSON.stringify(DEFAULT_AVATARS));
}

function saveGame() {
  if (!gameStarted || !currentUsername) return;
  const saveData = {
    level: player.level,
    xp: player.xp,
    xpToNext: player.xpToNext,
    money: player.money,
    materials: player.materials,
    stats: player.stats,
    mastery: player.mastery,
    masteryXp: player.masteryXp,
    hasSword: player.hasSword,
    hasGun: player.hasGun,
    specialUnlocked: player.specialUnlocked,
    haki: player.haki,
    faction: player.faction,
    selectedAvatarId: avatarState.selectedId,
    isGodMode: player.isGodMode,
    isInstakill: player.isInstakill,
    hasFlamingFeet: player.hasFlamingFeet,
    hasFlashStep: player.hasFlashStep,
    observationHakiUnlocked: player.observationHaki ? player.observationHaki.unlocked : false,
    avatars: avatarState.avatars,
    marketListings: marketState.listings,
  };
  
  const accountsStr = localStorage.getItem("sea_legends_accounts") || "[]";
  try {
    const accounts = JSON.parse(accountsStr);
    const account = accounts.find(a => a.username.toLowerCase() === currentUsername.toLowerCase());
    if (account) {
      account.saveData = saveData;
      localStorage.setItem("sea_legends_accounts", JSON.stringify(accounts));
    }
  } catch (e) {
    console.error("Failed to save progress to account database:", e);
  }
}

function checkAndLoadSave() {
  const activeUser = localStorage.getItem("sea_legends_current_user");
  if (!activeUser) {
    showLoginScreen();
    return;
  }
  
  currentUsername = activeUser;
  // No client-side username may grant privileged controls.
  player.isAdmin = false;
  
  // Toggle escape menu admin panel section based on isAdmin
  const adminSec = document.querySelector("#esc-admin-section");
  if (adminSec) {
    adminSec.classList.toggle("hidden", !player.isAdmin);
  }
  
  const accountsStr = localStorage.getItem("sea_legends_accounts") || "[]";
  try {
    const accounts = JSON.parse(accountsStr);
    const account = accounts.find(a => a.username.toLowerCase() === currentUsername.toLowerCase());
    if (!account) {
      performLogout();
      return;
    }
    
    // Hide login screen overlay
    const loginScreen = document.querySelector("#login-screen");
    if (loginScreen) loginScreen.classList.add("hidden");
    
    const saveData = account.saveData;
    if (!saveData || !saveData.faction) {
      // If fresh account or no faction chosen, show faction screen
      const fscreen = document.querySelector("#faction-screen");
      if (fscreen) fscreen.classList.remove("hidden");
      return;
    }
    
    // Load save data
    if (saveData.level !== undefined) player.level = saveData.level;
    if (saveData.xp !== undefined) player.xp = saveData.xp;
    if (saveData.xpToNext !== undefined) player.xpToNext = saveData.xpToNext;
    if (saveData.money !== undefined) player.money = saveData.money;
    if (saveData.materials) player.materials = { ...player.materials, ...saveData.materials };
    if (saveData.stats) player.stats = { ...player.stats, ...saveData.stats };
    if (saveData.mastery) player.mastery = { ...player.mastery, ...saveData.mastery };
    if (saveData.masteryXp) player.masteryXp = { ...player.masteryXp, ...saveData.masteryXp };
    if (saveData.hasSword !== undefined) player.hasSword = saveData.hasSword;
    if (saveData.hasGun !== undefined) player.hasGun = saveData.hasGun;
    if (saveData.specialUnlocked !== undefined) player.specialUnlocked = saveData.specialUnlocked;
    if (saveData.haki) player.haki = { ...player.haki, ...saveData.haki };
    if (saveData.faction !== undefined) player.faction = saveData.faction;
    if (saveData.avatars) avatarState.avatars = saveData.avatars;
    if (saveData.marketListings) marketState.listings = saveData.marketListings;
    if (saveData.selectedAvatarId !== undefined) avatarState.selectedId = saveData.selectedAvatarId;
    // Ignore legacy client-side admin flags from old profile saves.
    player.isGodMode = false;
    player.isInstakill = false;
    // Older saves stored false here; Blaze Kick attacks are now part of melee for everyone.
    player.hasFlamingFeet = true;
    if (saveData.hasFlashStep !== undefined) player.hasFlashStep = saveData.hasFlashStep;
    if (saveData.observationHakiUnlocked !== undefined) {
      player.observationHaki.unlocked = saveData.observationHakiUnlocked;
    }
    
    applyAvatarToPlayer();
    updateDerivedStats();
    updateHud();
    
    audio.init();
    const fscreen = document.querySelector("#faction-screen");
    if (fscreen) fscreen.classList.add("hidden");
    if (hud) hud.classList.remove("hidden");
    setGameScrollLock(true);
    gameStarted = true;
    connectMultiplayer();
    checkNewQuestUnlocks();
    setWeapon(player.weapon);
    updateCombatHud();
    
    log(`💾 Progress loaded for account: ${currentUsername}. Welcome back!`);
  } catch (e) {
    console.error("Failed to parse user save data:", e);
  }
}

function readLocalProfiles() {
  try {
    const profiles = JSON.parse(localStorage.getItem("sea_legends_accounts") || "[]");
    return Array.isArray(profiles) ? profiles.filter((p) => p && typeof p.username === "string") : [];
  } catch (error) {
    return [];
  }
}

// Shows saved profiles as one-click chips. With no profiles yet, new players go straight to "create".
function renderProfileList({ showSignupWhenEmpty = false } = {}) {
  const wrap = document.querySelector("#profile-list-wrap");
  const list = document.querySelector("#profile-list");
  if (!wrap || !list) return;
  const profiles = readLocalProfiles();
  list.replaceChildren();
  profiles.forEach((profile) => {
    const level = profile.saveData?.level || 1;
    const faction = profile.saveData?.faction || "Neutral";
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "profile-chip";
    const initial = document.createElement("span");
    initial.className = "profile-chip-avatar";
    initial.textContent = profile.username.charAt(0).toUpperCase();
    const text = document.createElement("span");
    text.className = "profile-chip-text";
    const name = document.createElement("strong");
    name.textContent = profile.username;
    const meta = document.createElement("small");
    meta.textContent = `Level ${level} · ${faction}`;
    text.append(name, meta);
    chip.append(initial, text);
    chip.addEventListener("click", () => {
      const input = document.querySelector("#login-username");
      if (input) input.value = profile.username;
      document.querySelector("#login-submit-btn")?.click();
    });
    list.append(chip);
  });
  wrap.classList.toggle("hidden", profiles.length === 0);
  if (showSignupWhenEmpty && profiles.length === 0) {
    document.querySelector("#login-form-container")?.classList.add("hidden");
    document.querySelector("#signup-form-container")?.classList.remove("hidden");
  }
}

function showLoginScreen() {
  renderProfileList();
  stopMultiplayer();
  setGameScrollLock(false);
  document.querySelector("#mobile-controls")?.classList.add("hidden");
  const loginScreen = document.querySelector("#login-screen");
  if (loginScreen) loginScreen.classList.remove("hidden");
  
  const fscreen = document.querySelector("#faction-screen");
  if (fscreen) fscreen.classList.add("hidden");
  
  if (hud) hud.classList.add("hidden");
  gameStarted = false;
}

function performLogout() {
  // Save progress before clearing
  if (gameStarted && currentUsername) {
    saveGame();
  }
  
  resetPlayerState();
  currentUsername = "";
  localStorage.removeItem("sea_legends_current_user");
  
  // Close any open HUD menus
  if (typeof toggleEscMenu !== 'undefined') {
    toggleEscMenu(false);
  }
  
  showLoginScreen();
  log("🚪 You have logged out successfully.");
}

function initAuthSystem() {
  // Preserve locally saved progress while removing credentials collected by
  // the former demo sign-up form. These local profiles are not authenticated.
  try {
    const storedProfiles = JSON.parse(localStorage.getItem("sea_legends_accounts") || "[]");
    const sanitizedProfiles = storedProfiles.map(({ password, recovery, ...profile }) => profile);
    localStorage.setItem("sea_legends_accounts", JSON.stringify(sanitizedProfiles));
  } catch (error) {
    localStorage.removeItem("sea_legends_accounts");
  }

  const loginForm = document.querySelector("#login-form-container");
  const signupForm = document.querySelector("#signup-form-container");
  const recoveryForm = document.querySelector("#recovery-form-container");
  
  const loginUsernameInput = document.querySelector("#login-username");
  const loginErrorMsg = document.querySelector("#login-error-msg");
  
  const signupUsernameInput = document.querySelector("#signup-username");
  const signupErrorMsg = document.querySelector("#signup-error-msg");

  // Both panels are <form>s so Enter submits; the button click handlers below do the work.
  [loginForm, signupForm].forEach((form) => form?.addEventListener("submit", (e) => {
    e.preventDefault();
    // Enter key and button clicks already ran the click handler; route other submits to it.
    if (!e.submitter) form.querySelector('[type="submit"]')?.click();
  }));
  renderProfileList({ showSignupWhenEmpty: true });
  
  // Transition links
  document.querySelector("#go-to-signup")?.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    signupErrorMsg.textContent = "";
  });
  
  document.querySelector("#go-to-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    loginErrorMsg.textContent = "";
  });
  
  document.querySelector("#go-to-recovery")?.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    recoveryForm.classList.remove("hidden");
  });
  
  document.querySelector("#recovery-back-to-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    recoveryForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    loginErrorMsg.textContent = "";
  });
  
  // Login Submit
  document.querySelector("#login-submit-btn")?.addEventListener("click", () => {
    const username = loginUsernameInput.value.trim();
    
    if (!username) {
      loginErrorMsg.textContent = "Enter a profile name.";
      return;
    }
    const accountsStr = localStorage.getItem("sea_legends_accounts") || "[]";
    try {
      const accounts = JSON.parse(accountsStr);
      const account = accounts.find(a => a.username.toLowerCase() === username.toLowerCase());
      
      if (!account) {
        loginErrorMsg.textContent = "No profile with that name in this browser. Create one first.";
        return;
      }
      
      // Success
      loginErrorMsg.textContent = "";
      loginUsernameInput.value = "";
      
      currentUsername = account.username;
      localStorage.setItem("sea_legends_current_user", currentUsername);
      checkAndLoadSave();
    } catch (e) {
      console.error(e);
      loginErrorMsg.textContent = "Could not read saved profiles in this browser. Try clearing site data.";
    }
  });
  
  // Registration Submit
  document.querySelector("#signup-submit-btn")?.addEventListener("click", () => {
    const username = signupUsernameInput.value.trim();
    
    if (!username) {
      signupErrorMsg.textContent = "Enter a profile name.";
      return;
    }
    const accountsStr = localStorage.getItem("sea_legends_accounts") || "[]";
    try {
      const accounts = JSON.parse(accountsStr);
      const exists = accounts.some(a => a.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        signupErrorMsg.textContent = "That profile name is already used in this browser.";
        return;
      }
      
      // Create new account object
      const newAccount = {
        username,
        saveData: {
          faction: "Neutral",
          level: 1,
          xp: 0,
          xpToNext: 100,
          money: 0,
          materials: { ironwood: 0, scrap: 0, jungleCore: 0 },
          stats: { melee: 1, defense: 1, sword: 1, gun: 1, special: 0 },
          mastery: { melee: 1, defense: 1, sword: 1, gun: 1, special: 1 },
          masteryXp: { melee: 0, defense: 0, sword: 0, gun: 0, special: 0 },
          selectedAvatarId: "tavern-hero",
          isGodMode: false,
          isInstakill: false,
          avatars: JSON.parse(JSON.stringify(DEFAULT_AVATARS)),
          marketListings: []
        }
      };
      
      accounts.push(newAccount);
      localStorage.setItem("sea_legends_accounts", JSON.stringify(accounts));
      
      signupUsernameInput.value = "";
      signupErrorMsg.textContent = "";
      
      // Switch back to login panel and log in
      signupForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
      
      currentUsername = username;
      localStorage.setItem("sea_legends_current_user", currentUsername);
      checkAndLoadSave();
    } catch (e) {
      console.error(e);
      signupErrorMsg.textContent = "Could not read saved profiles in this browser. Try clearing site data.";
    }
  });
  
  // Bind Settings Bar and Escape Menu logouts
  document.querySelector("#hud-logout-btn")?.addEventListener("click", performLogout);
  document.querySelector("#esc-logout-btn")?.addEventListener("click", performLogout);
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

// ── 12-world-islands.js ─ World creation, islands, terrain and island decorations.
function createWorld() {
  for (let i = 0; i < 10; i += 1) {
    const angle = i * 0.62;
    const distance = i === 0 ? 0 : i === 1 ? 2750 : 5200 + i * 950;
    const radius = i === 0 ? STARTER_RADIUS : i === 1 ? 1450 : i === 2 ? 2400 : i === 3 ? 1120 : i === 4 ? 900 : 90 + i * 36;
    const position = i === 1
      ? new THREE.Vector3(2280, 0, -1420)
      : i === 2
        ? new THREE.Vector3(-3400, 0, -3200)
        : i === 3
          ? new THREE.Vector3(-4550, 0, 980)
          : i === 4
            ? new THREE.Vector3(4800, 0, 3600)
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
  
  // Secondary teleporter nearby on Starter Island
  const tel3Y = getIslandSurfaceHeightAt(458, -290, starterIsland);
  createTeleporter(new THREE.Vector3(458, tel3Y, -290), new THREE.Vector3(islands[1].position.x - 620, islands[1].surfaceY + 0.15, islands[1].position.z + 430));
  
  const tel2Y = getIslandSurfaceHeightAt(-380, -360, starterIsland);
  createTeleporter(new THREE.Vector3(-380, tel2Y, -360), new THREE.Vector3(islands[2].position.x + 50, islands[2].surfaceY + 0.15, islands[2].position.z + 50), true);

  // Teleporter to Snowy Village (on east edge of Starter Island)
  const tel4Y = getIslandSurfaceHeightAt(480, 220, starterIsland);
  createTeleporter(new THREE.Vector3(480, tel4Y, 220), new THREE.Vector3(islands[4]?.position.x - 400, islands[4]?.surfaceY + 0.15, islands[4]?.position.z - 200));
  
  createBanditCamp();
  
  const oqgPos = islands[2].position.clone().add(new THREE.Vector3(0, 0, 0));
  oqgPos.y = getIslandSurfaceHeightAt(oqgPos.x, oqgPos.z, islands[2]);
  createOutpostQuestGiver(oqgPos);
  
  const htPos = islands[3].position.clone().add(new THREE.Vector3(70, 0, -60));
  htPos.y = getIslandSurfaceHeightAt(htPos.x, htPos.z, islands[3]);
  createHakiTrainer(htPos);
  
  spawnPirateCamp(islands[2]);
  spawnBruteCamp(islands[2]);
  
  // Spawn Jester Boss at Pirate Town
  const buggyPos = islands[2].position.clone().add(new THREE.Vector3(260, 0, -220));
  buggyPos.y = getIslandSurfaceHeightAt(buggyPos.x, buggyPos.z, islands[2]);
  spawnBuggyBoss(buggyPos);

  // ── Secret Cave: Blaze Kick Dojo (near Jester's arena) ──
  const pirate = islands[2];
  if (pirate) {
    // Cave entrance is slightly behind & west of Jester's spawn
    const caveEntryPos = new THREE.Vector3(
      pirate.position.x + 180, 0, pirate.position.z - 300
    );
    caveEntryPos.y = getIslandSurfaceHeightAt(caveEntryPos.x, caveEntryPos.z, pirate);
    createBlackLegDojo(caveEntryPos);
  }


  const jungle = islands[1];
  if (jungle) {
    spawnJungleCamps(jungle);

    const jQuestPos = new THREE.Vector3(jungle.position.x + 350, getIslandSurfaceHeightAt(jungle.position.x + 350, jungle.position.z + 300, jungle), jungle.position.z + 300);
    createJungleQuestGiver(jQuestPos);
    createReturnTeleporter(jQuestPos.clone().add(new THREE.Vector3(25, 0, 25)));

    const jPulsePos = new THREE.Vector3(jungle.position.x - 150, getIslandSurfaceHeightAt(jungle.position.x - 150, jungle.position.z - 200, jungle), jungle.position.z - 200);
    createJunglePulseTrainer(jPulsePos);
    createReturnTeleporter(jPulsePos.clone().add(new THREE.Vector3(-25, 0, -25)));
  }

  // Desert Island additional spawns
  const desert = islands[3];
  if (desert) {
    spawnDesertCamps(desert);

    const dQuestPos = new THREE.Vector3(desert.position.x + 200, getIslandSurfaceHeightAt(desert.position.x + 200, desert.position.z + 200, desert), desert.position.z + 200);
    createDesertQuestGiver(dQuestPos);
    createReturnTeleporter(dQuestPos.clone().add(new THREE.Vector3(25, 0, 25)));
    
    // Teleporter near Aura Trainer
    const dHakiTelPos = htPos.clone().add(new THREE.Vector3(-25, 0, -25));
    createReturnTeleporter(dHakiTelPos);
  }

  // Snowy Village additional spawns
  const snowy = islands[4];
  if (snowy) {
    spawnSnowyCamps(snowy);

    const sQuestPos = new THREE.Vector3(snowy.position.x + 280, getIslandSurfaceHeightAt(snowy.position.x + 280, snowy.position.z + 180, snowy), snowy.position.z + 180);
    createSnowyQuestGiver(sQuestPos);
    createReturnTeleporter(sQuestPos.clone().add(new THREE.Vector3(30, 0, 30)));

    // Foresight Master (West Mountain Peak)
    const obsPos = new THREE.Vector3(snowy.position.x - 240, getIslandSurfaceHeightAt(snowy.position.x - 240, snowy.position.z + 160, snowy), snowy.position.z + 160);
    createObservationHakiTrainer(obsPos);
    createReturnTeleporter(obsPos.clone().add(new THREE.Vector3(-25, 0, 25)));

    // Flash Step Master (East Glacier Ridge)
    const flashPos = new THREE.Vector3(snowy.position.x + 180, getIslandSurfaceHeightAt(snowy.position.x + 180, snowy.position.z - 180, snowy), snowy.position.z - 180);
    createFlashStepTrainer(flashPos);
    createReturnTeleporter(flashPos.clone().add(new THREE.Vector3(25, 0, -25)));
  }

  // Last: make sure everything that stands on an island actually touches it.
  islands.forEach((island) => settleIslandObjects(island));
  // Prepare grass ground-cover maps now (during loading) rather than mid-game.
  windGrassIslands.forEach((island) => prepareGrassCoverMask(island));
}

function createIsland(position, radius, index) {
  const group = new THREE.Group();
  group.position.copy(position);
  const height = getIslandHeight(index);

  const baseGeometry = makeIrregularCylinderGeometry(radius, height, index === 2 ? 160 : index <= 1 ? 128 : index <= 4 ? 96 : 40, index + 3, -1, { radius, height, index, rings: index === 2 ? 60 : index <= 4 ? 24 : 14 });
  const base = new THREE.Mesh(
    baseGeometry,
    new THREE.MeshStandardMaterial({
      color: islandTerrainColor(WORLD_PALETTE.terrain.cliff, index),
      roughness: 0.86,
      metalness: 0.08,
      emissive: index === 0 ? 0x332711 : index === 4 ? 0x1a2430 : 0x1f1a16,
      emissiveIntensity: 0.06,
      flatShading: true,
    }),
  );
  base.position.y = height / 2;
  base.userData.surface = index === 4 ? "rock" : "cliff";
  base.receiveShadow = true;
  base.castShadow = true;
  base.userData.isTerrain = true;
  group.add(base);

  const grass = new THREE.Mesh(
    // Fine enough to follow the plateau's roll-off (and the outpost's two lobes).
    makeTerrainSurfaceGeometry(radius, height, index, index === 2 ? 160 : index <= 1 ? 128 : index <= 4 ? 96 : 48, index === 2 ? 70 : index === 1 ? 64 : index === 0 ? 40 : index <= 4 ? 32 : 18),
    new THREE.MeshStandardMaterial({ 
      color: islandTerrainColor(WORLD_PALETTE.terrain.grass, index),
      roughness: 0.82, 
      metalness: 0.02 
    }),
  );
  grass.userData.surface = index === 4 ? "snow" : "grass";
  grass.receiveShadow = true;
  grass.castShadow = true;
  grass.userData.isTerrain = true;
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
  if (index === 0) {
    addStarterWindmills(group, radius, height);
  }
  // Grass goes last so it can avoid everything placed above.
  addWindGrass(group, radius, height, index);

  if (index === 0) {
    // Village flagpole marks the starter island from afar.
    const poleMat = new THREE.MeshStandardMaterial({ color: worldHex(0xe9e2cf), roughness: 0.5, metalness: 0.3 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 46, 10), poleMat);
    pole.position.set(0, height + 23, 0);
    pole.castShadow = true;
    pole.userData.surface = "metal";
    group.add(pole);
    const finial = new THREE.Mesh(new THREE.SphereGeometry(1.2, 14, 10), new THREE.MeshStandardMaterial({ color: 0xffd25a, emissive: 0x3a2300, metalness: 0.6, roughness: 0.3 }));
    finial.position.set(0, height + 46.6, 0);
    group.add(finial);
    const pennantShape = new THREE.Shape();
    pennantShape.moveTo(0, 0);
    pennantShape.lineTo(15, -3.5);
    pennantShape.lineTo(0, -7);
    pennantShape.lineTo(0, 0);
    const pennant = new THREE.Mesh(
      new THREE.ShapeGeometry(pennantShape),
      new THREE.MeshStandardMaterial({ color: worldHex(0xd8483a), side: THREE.DoubleSide, roughness: 0.7 }),
    );
    pennant.position.set(0.5, height + 45.4, 0);
    pennant.castShadow = true;
    pennant.userData.surface = "plaster";
    group.add(pennant);
    animatedFoliage.push({ mesh: pennant, baseRotZ: 0, phase: 0.4 });
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 1.6, 12), new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.stone), roughness: 0.9 }));
    plinth.position.set(0, height + 0.8, 0);
    plinth.userData.surface = "stone";
    group.add(plinth);
    addCollisionCircle(new THREE.Vector3(0, height, 0), 3.4, "Flagpole", { material: "metal", height: 1.6 });
    addCollisionCircle(new THREE.Vector3(0, height, 0), 1.0, "Flagpole", { material: "metal" });

    const label = makeLabel("Island 1", 2);
    label.position.set(0, height + 55, 0);
    group.add(label);
  }

  if (index !== 1 && index !== 0) {
    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(index === 0 ? 2.5 : 0.4, index === 0 ? 2.5 : 0.4, index === 0 ? 48 : 9 + index * 0.8, 8),
      new THREE.MeshStandardMaterial({ color: index === 4 ? 0x88ccff : 0xffd25a, emissive: index === 4 ? 0x1a3a5c : 0x3a2300 }),
    );
    // Stand the pole on the ground (its height is 9 + 0.8 * index).
    marker.position.set(0, getLocalSurfaceHeightAt(0, 0, radius, height, index) + (9 + index * 0.8) / 2 - 0.2, 0);
    group.add(marker);

    const islandLabel = index === 4 ? "Snowy Village" : `Island ${index + 1}`;
    const label = makeLabel(islandLabel, 2 + index * 0.2);
    label.position.set(0, height + (index === 0 ? 55 : 10 + index * 0.55), 0);
    group.add(label);
  }

  if (index > 0 && index !== 1) {
    const treeCount = index === 4 ? 22 : Math.min(8, index + 2);
    for (let t = 0; t < treeCount; t += 1) {
      const tree = index === 4 ? createSnowyTree() : createTree();
      const a = Math.random() * Math.PI * 2;
      const d = radius * (0.15 + Math.random() * 0.55);
      const tx = Math.cos(a) * d;
      const tz = Math.sin(a) * d;
      tree.position.set(tx, getLocalSurfaceHeightAt(tx, tz, radius, height, index) - 0.1, tz);
      group.add(tree);
    }
  }

  // (The old translucent "meadow glow" disc was removed: the wind grass gives the
  //  ground its colour variation, and the disc hung off the plateau on cove islands.)

  scene.add(group);
  return group;
}

function getIslandHeight(index) {
  if (index === 0) return STARTER_HEIGHT;
  if (index === 1) return 62;
  if (index === 2) return 48;
  if (index === 3) return 54;
  if (index === 4) return 58;
  return 3 + index * 0.2;
}

function getIslandSurfaceY(index) {
  if (index === 0) return STARTER_SURFACE_Y;
  return getIslandHeight(index) + 0.16;
}

// Collision volumes are flat shapes on the ground (x/z) with an optional height.
// Players can jump over anything whose `height` is below their feet.
//   circle  — rocks, posts, trees, wells
//   segment — capsules along a line (fences)
//   box     — rotated rectangles (houses, stalls)
function addCollisionVolume(shape, center, label, options = {}) {
  const volume = {
    shape,
    center: center.clone(),
    radius: options.radius ?? 0,
    label,
    height: options.height ?? Infinity,
    damage: options.damage ?? 10,
    material: options.material || "stone",
    toughness: options.toughness ?? 1,
  };
  if (shape === "segment") {
    volume.end = options.end.clone();
  }
  if (shape === "box") {
    volume.halfX = options.halfX;
    volume.halfZ = options.halfZ;
    volume.rotation = options.rotation || 0;
    volume.cos = Math.cos(volume.rotation);
    volume.sin = Math.sin(volume.rotation);
  }
  // Bounding radius for a cheap rejection test before the exact shape test.
  volume.bound = shape === "box"
    ? Math.hypot(volume.halfX, volume.halfZ)
    : shape === "segment"
      ? Math.hypot(volume.end.x - center.x, volume.end.z - center.z) + volume.radius
      : volume.radius;
  collisionVolumes.push(volume);
  return volume;
}

function addCollisionCircle(center, radius, label, options = {}) {
  return addCollisionVolume("circle", center, label, { ...options, radius });
}

function addCollisionSegment(start, end, radius, label, options = {}) {
  return addCollisionVolume("segment", start, label, { ...options, radius, end });
}

// rotation matches the mesh's rotation.y, so halfX/halfZ are the mesh's own half sizes.
function addCollisionBox(center, halfX, halfZ, rotation, label, options = {}) {
  return addCollisionVolume("box", center, label, { ...options, halfX, halfZ, rotation });
}

function createSnowyTree() {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.48, 2.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x483227, roughness: 0.92 }),
  );
  trunk.position.y = 1.4;
  trunk.castShadow = true;
  group.add(trunk);

  const foliageGroup = new THREE.Group();
  const tierColors = [0x42686b, 0x5a8385, 0x82a9ab];
  for (let i = 0; i < 3; i++) {
    const tier = new THREE.Mesh(
      new THREE.ConeGeometry(2.1 - i * 0.42, 2.0, 8),
      new THREE.MeshStandardMaterial({ color: tierColors[i], roughness: 0.85 }),
    );
    tier.position.y = 2.7 + i * 1.25;
    tier.castShadow = true;
    foliageGroup.add(tier);

    const snow = new THREE.Mesh(
      new THREE.ConeGeometry((2.1 - i * 0.42) * 0.65, 0.9, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }),
    );
    snow.position.y = tier.position.y + 0.65;
    snow.castShadow = true;
    foliageGroup.add(snow);
  }
  group.add(foliageGroup);
  animatedFoliage.push({ mesh: foliageGroup, baseRotZ: 0, phase: Math.random() * Math.PI * 2 });
  return group;
}

function createTree() {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.55, 3.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x6e4726, roughness: 0.9 }),
  );
  trunk.position.y = 1.6;
  trunk.castShadow = true;
  group.add(trunk);

  const tierColors = [0x267343, 0x2f8a50, 0x3aa35f];
  const foliageGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const tier = new THREE.Mesh(
      new THREE.ConeGeometry(2.3 - i * 0.45, 2.2, 8),
      new THREE.MeshStandardMaterial({ color: tierColors[i], roughness: 0.82 }),
    );
    tier.position.y = 3.1 + i * 1.35;
    tier.castShadow = true;
    foliageGroup.add(tier);
  }
  group.add(foliageGroup);
  animatedFoliage.push({ mesh: foliageGroup, baseRotZ: 0, phase: Math.random() * Math.PI * 2 });
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

  // Curved rainforest trees, drawn as instanced batches (29-jungle-trees.js).
  addJungleForest(group, radius, height, 180);

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
  const modifiedRadius = trunkRadius * 0.55; // Reduce tree radius to take up less space
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5d3b24, roughness: 0.94 });
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x145c32, roughness: 0.86, flatShading: true });

  // Extremely blocky Box trunk
  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(modifiedRadius * 2, height, modifiedRadius * 2),
    trunkMaterial
  );
  trunk.position.y = height / 2;
  trunk.castShadow = true;
  group.add(trunk);

  // Extremely blocky Box foliage
  for (let i = 0; i < 5; i += 1) {
    const size = modifiedRadius * (2.8 - i * 0.28); // foliage size multiplier is reduced to take up less space
    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(size * 2, size * 2, size * 2),
      leafMaterial,
    );
    crown.position.set(
      Math.sin(i * 1.7) * modifiedRadius * 0.7,
      height - i * modifiedRadius * 0.9,
      Math.cos(i * 1.2) * modifiedRadius * 0.7,
    );
    crown.castShadow = true;
    group.add(crown);
  }

  return group;
}

function createBigJungleBush(size) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.jungleCanopy[2]), roughness: 0.88, flatShading: true });

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

  // Paths along the bridge
  [
    [-600, -200, 420, 34, 0.32],
    [-300, -100, 420, 34, 0.32],
    [0, 0, 420, 34, 0.32],
    [300, 100, 420, 34, 0.32],
    [600, 200, 420, 34, 0.32]
  ].forEach(([x, z, l, w, r]) => {
    const path = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, l), dirt);
    const pY = getLocalSurfaceHeightAt(x, z, radius, height, 2);
    path.position.set(x, pY + 0.6, z);
    path.rotation.y = r;
    group.add(path);
  });

  // Ruins distributed on the two parts
  for (let i = 0; i < 18; i += 1) {
    const ruin = new THREE.Mesh(new THREE.BoxGeometry(26 + (i % 4) * 8, 24 + (i % 3) * 12, 18), stone);
    const angle = i * 1.17;
    const dist = 200 + (i % 3) * 140;
    let rx, rz;
    if (i < 9) {
      // Pirate area ruins
      rx = -900 + Math.cos(angle) * dist;
      rz = -300 + Math.sin(angle) * dist;
    } else {
      // Brute area ruins
      rx = 900 + Math.cos(angle) * dist;
      rz = 300 + Math.sin(angle) * dist;
    }
    const rY = getLocalSurfaceHeightAt(rx, rz, radius, height, 2);
    ruin.position.set(rx, rY + ruin.geometry.parameters.height / 2, rz);
    ruin.rotation.y = angle;
    ruin.castShadow = true;
    ruin.receiveShadow = true;
    group.add(ruin);
  }

  // Towers on the two parts
  for (let i = 0; i < 8; i += 1) {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(10, 14, 58, 6), stone);
    const angle = i * 1.57;
    let tx, tz;
    if (i < 4) {
      // Pirate towers
      tx = -900 + Math.cos(angle) * 450;
      tz = -300 + Math.sin(angle) * 450;
    } else {
      // Brute towers
      tx = 900 + Math.cos(angle) * 450;
      tz = 300 + Math.sin(angle) * 450;
    }
    const tY = getLocalSurfaceHeightAt(tx, tz, radius, height, 2);
    tower.position.set(tx, tY + 29, tz);
    tower.castShadow = true;
    group.add(tower);
  }

  // Dock at the edge of Pirate Part
  const dockX = -1850;
  const dockZ = -300;
  const dockY = getLocalSurfaceHeightAt(dockX, dockZ, radius, height, 2);
  const dock = new THREE.Mesh(new THREE.BoxGeometry(42, 2.5, 210), wood);
  dock.position.set(dockX, dockY + 1.2, dockZ);
  dock.rotation.y = Math.PI / 2; // running East-West
  dock.castShadow = true;
  group.add(dock);
}

function addDesertIslandDetails(group, radius, height, index) {
  const sand = new THREE.Mesh(
    // Built on the same terrain as the grass, just above it, so the desert is sand all over.
    makeTerrainSurfaceGeometry(radius, height, index, 96, 26).translate(0, 0.1, 0),
    new THREE.MeshStandardMaterial({ color: 0xd6aa64, roughness: 0.96 }),
  );
  sand.userData.surface = "sand";
  sand.userData.noSettle = true;
  sand.receiveShadow = true;
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
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.palmTrunk), roughness: 0.9 });
  const leafMaterial = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.palmLeaf), roughness: 0.86, side: THREE.DoubleSide });

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
    animatedFoliage.push({ mesh: leaf, baseRotZ: Math.PI / 2.7, phase: i * 0.9 });
  }

  const coconuts = new THREE.Mesh(
    new THREE.SphereGeometry(2.7, 12, 8),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.coconut), roughness: 0.9 }),
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
    // Foundation footprint is 39 x 33.
    addCollisionBox(new THREE.Vector3(x, hY, z), 19.5, 16.5, rotation, "House wall", { material: "wood" });
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
    addCollisionCircle(new THREE.Vector3(px, pY, pz), 2.6, "Palm tree", { material: "wood", damage: 6 });
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
    addCollisionCircle(new THREE.Vector3(rx, rY, rz), rockSize * 1.05, "Rock obstacle", { height: rockSize * (0.55 + rockSize * 0.03) * 0.9 });
  }

  // Ground cover is now the wind-blown grass field (26-wind-grass.js).


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
    addCollisionBox(new THREE.Vector3(x, hY, z), 12, 6.5, rotation, "Market stall", { material: "wood", height: 7 });
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
    // Capsule along the posts (the fence runs along its local +x axis); low enough to hop over.
    const fenceEnd = new THREE.Vector3(x + Math.cos(rotation) * (count - 1) * 13, hY, z - Math.sin(rotation) * (count - 1) * 13);
    addCollisionSegment(new THREE.Vector3(x, hY, z), fenceEnd, 1.6, "Fence", { material: "wood", height: 9 });
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
    addCollisionCircle(new THREE.Vector3(x, hY, z), 2.2, "Signpost", { material: "wood" });
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

    // Post and footing: the straw body sits 3 units up, so it needs something to stand on.
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 5, 8), wood);
    post.position.y = 2;
    post.castShadow = true;
    dummy.add(post);
    const footing = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.4, 0.8, 12), wood);
    footing.position.y = 0.1;
    footing.receiveShadow = true;
    dummy.add(footing);

    dummy.position.set((i % 2) * 32, 0, Math.floor(i / 2) * 32);
    yard.add(dummy);
  }

  const hY = getLocalSurfaceHeightAt(224, 138, STARTER_RADIUS, height, 0);
  yard.position.set(208, hY + 0.3, 122);
  yard.rotation.y = -0.35;
  group.add(yard);
  // One collision per dummy (the yard is rotated by -0.35).
  const c = Math.cos(-0.35);
  const sn = Math.sin(-0.35);
  for (let i = 0; i < 4; i += 1) {
    const dx = (i % 2) * 32;
    const dz = Math.floor(i / 2) * 32;
    addCollisionCircle(new THREE.Vector3(208 + dx * c + dz * sn, hY, 122 - dx * sn + dz * c), 5.2, "Training dummy", { material: "wood", damage: 3 });
  }
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

// Shade trees around the village (these spots used to hold lantern posts).
function addLanternsAndBanners(group, height) {
  const spots = [
    [-72, 38, 1.0],
    [-18, 92, 1.15],
    [54, 88, 0.95],
    [112, 22, 1.1],
    [54, -46, 1.05],
    [-44, -28, 0.9],
    [18, 150, 1.2],
    [156, 96, 1.0],
  ];

  spots.forEach(([x, z, scale], index) => {
    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    const tree = createVillageTree(scale, index);
    tree.position.set(x, hY + 0.1, z);
    tree.rotation.y = index * 1.37;
    group.add(tree);
    addCollisionCircle(new THREE.Vector3(x, hY, z), 2.6 * scale, "Tree", { material: "wood", damage: 6 });
  });
}

// Rounded broadleaf tree: tapered trunk with two limbs and a clustered canopy
// in three greens so it reads well from any angle.
const villageTreeMaterials = {
  bark: null,
  leaves: null,
};
function createVillageTree(scale = 1, seed = 0) {
  if (!villageTreeMaterials.bark) {
    villageTreeMaterials.bark = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.bark), roughness: 0.92 });
    villageTreeMaterials.leaves = WORLD_PALETTE.foliage.canopy.map((hex) =>
      new THREE.MeshStandardMaterial({ color: worldHex(hex), roughness: 0.85, flatShading: true }),
    );
  }
  const rand = (n) => {
    const v = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const tree = new THREE.Group();
  const trunkHeight = 15 * scale;

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.2 * scale, 2.1 * scale, trunkHeight, 9), villageTreeMaterials.bark);
  trunk.position.y = trunkHeight / 2;
  trunk.rotation.z = (rand(1) - 0.5) * 0.08;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  trunk.userData.surface = "bark";
  tree.add(trunk);

  // Root flare
  const roots = new THREE.Mesh(new THREE.CylinderGeometry(2.1 * scale, 3.2 * scale, 1.6 * scale, 9), villageTreeMaterials.bark);
  roots.position.y = 0.8 * scale;
  roots.userData.surface = "bark";
  tree.add(roots);

  for (let i = 0; i < 2; i += 1) {
    const limb = new THREE.Mesh(new THREE.CylinderGeometry(0.45 * scale, 0.8 * scale, 7 * scale, 6), villageTreeMaterials.bark);
    const side = i === 0 ? 1 : -1;
    limb.position.set(side * 2.2 * scale, trunkHeight * 0.78, (rand(2 + i) - 0.5) * 2 * scale);
    limb.rotation.z = -side * 0.75;
    limb.castShadow = true;
    limb.userData.surface = "bark";
    tree.add(limb);
  }

  const canopy = new THREE.Group();
  const clusters = [
    [0, 0, 0, 7.4],
    [4.6, -1.2, 1.4, 5.4],
    [-4.4, -0.8, -1.2, 5.6],
    [1.2, 2.8, -3.4, 5.0],
    [-1.4, 3.4, 3.0, 4.8],
    [0.4, 5.6, 0.2, 4.2],
  ];
  clusters.forEach(([cx, cy, cz, r], i) => {
    const leaf = new THREE.Mesh(
      new THREE.IcosahedronGeometry(r * scale * (0.9 + rand(10 + i) * 0.2), 1),
      villageTreeMaterials.leaves[i % villageTreeMaterials.leaves.length],
    );
    leaf.position.set(cx * scale, cy * scale, cz * scale);
    leaf.rotation.set(rand(20 + i) * 3, rand(30 + i) * 3, 0);
    leaf.scale.y = 0.85;
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    leaf.userData.surface = "foliage";
    canopy.add(leaf);
  });
  canopy.position.y = trunkHeight + 3.5 * scale;
  tree.add(canopy);
  animatedFoliage.push({ mesh: canopy, baseRotZ: 0, phase: seed * 0.9 });
  return tree;
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
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.sand), roughness: 0.92, side: THREE.DoubleSide }),
  );
  beach.userData.surface = "sand";
  beach.userData.noSettle = true; // already follows the terrain
  beach.userData.groundCover = true; // no grass on the sand
  beach.rotation.x = -Math.PI / 2;
  beach.position.y = height;
  beach.receiveShadow = true;
  group.add(beach);

  const shallowWater = new THREE.Mesh(
    makeIrregularRingGeometry(radius * 0.98, radius * 1.12, 128, 34),
    new THREE.MeshStandardMaterial({
      color: worldHex(WORLD_PALETTE.sea.lagoon),
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
  const material = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.path), roughness: 0.96 });
  const paths = [
    [0, 0, 310, 14, 0.25],
    [30, 48, 230, 12, 1.18],
    [-80, 36, 190, 11, -0.85],
    [110, 16, 170, 10, -0.35],
  ];

  paths.forEach(([x, z, length, width, rotation]) => {
    const path = new THREE.Mesh(new THREE.BoxGeometry(width, 0.35, length), material);
    const hY = getLocalSurfaceHeightAt(x, z, STARTER_RADIUS, height, 0);
    path.userData.surface = "dirt";
    path.position.set(x, hY + 0.44, z);
    path.rotation.y = rotation;
    path.receiveShadow = true;
    group.add(path);
  });
}

function addVillagePlaza(group, height) {
  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(54, 48),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.plaza), roughness: 0.9 }),
  );
  plaza.userData.surface = "stone";
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(18, height + 0.5, 42);
  plaza.receiveShadow = true;
  group.add(plaza);

  const well = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 9, 7, 18),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.stone), roughness: 0.95 }),
  );
  well.userData.surface = "stone";
  well.position.set(18, height + 3.8, 42);
  well.castShadow = true;
  group.add(well);
  addCollisionCircle(new THREE.Vector3(18, height, 42), 12, "Stone well");

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(13, 9, 4),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.village.wellRoof), roughness: 0.8 }),
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

// ── 13-world-buildings-npcs.js ─ Houses, quest givers, trainers, teleporters and boats.
// ---- House geometry helpers (shapes are drawn flat, then stood up) ----
function roundedRectShape(width, depth, radius) {
  const w = width / 2;
  const d = depth / 2;
  const r = Math.min(radius, w, d);
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.absarc(w - r, -d + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(w, d - r);
  shape.absarc(w - r, d - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-w + r, d);
  shape.absarc(-w + r, d - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-w, -d + r);
  shape.absarc(-w + r, -d + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

// Extrudes a floor-plan shape upward by `height` (shape x/y -> world x/-z).
function extrudeUp(shape, height, curveSegments = 8) {
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false, curveSegments });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

// Door/window outline: a rectangle with a round arch on top, base at y = 0.
function archShape(width, height, x = 0, y = 0) {
  const r = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x - r, y);
  shape.lineTo(x + r, y);
  shape.lineTo(x + r, y + height - r);
  shape.absarc(x, y + height - r, r, 0, Math.PI, false);
  shape.lineTo(x - r, y);
  return shape;
}

// A frame around an arch: outer arch with the inner arch cut out.
function archFrameShape(width, height, border) {
  const shape = archShape(width + border * 2, height + border);
  shape.holes.push(archShape(width, height, 0, 0));
  return shape;
}

function flatPanel(shape, thickness) {
  return new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 12 });
}

// Shared so every window can glow together at night (see updateDayNightLighting).
const houseWindowGlass = new THREE.MeshStandardMaterial({
  color: 0xffe2b0,
  emissive: 0xffa040,
  emissiveIntensity: 0.05,
  roughness: 0.25,
  metalness: 0.1,
});

function createHouse(index) {
  const group = new THREE.Group();
  const palette = WORLD_PALETTE.village;
  const plasterHex = palette.walls[index % palette.walls.length];
  const roofHex = palette.roofs[index % palette.roofs.length];
  const trimHex = palette.trims[index % palette.trims.length];

  const mat = (hex, roughness, surface, extra = {}) => {
    const m = new THREE.MeshStandardMaterial({ color: worldHex(hex), roughness, ...extra });
    m.userData.surface = surface;
    return m;
  };
  const plaster = mat(plasterHex, 0.9, "plaster");
  const timber = mat(palette.timber, 0.85, "wood");
  const stone = mat(palette.foundation, 0.94, "stone");
  const roofMat = mat(roofHex, 0.78, "tiles", { side: THREE.DoubleSide });
  const trim = mat(trimHex, 0.7, "wood");

  const add = (mesh, surface, castShadow = true) => {
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    if (surface) mesh.userData.surface = surface;
    group.add(mesh);
    return mesh;
  };

  const FOUND_H = 4;
  const WALL_W = 34;
  const WALL_D = 28;
  const WALL_H = 20;
  const WALL_TOP = FOUND_H + WALL_H;
  const FRONT = WALL_D / 2;

  // Stone plinth and plastered walls, both with rounded corners.
  add(new THREE.Mesh(extrudeUp(roundedRectShape(38, 32, 3.2), FOUND_H), stone), "stone");
  const walls = add(new THREE.Mesh(extrudeUp(roundedRectShape(WALL_W, WALL_D, 2.6), WALL_H, 10), plaster), "plaster");
  walls.position.y = FOUND_H;

  // Timber corner posts wrap the rounded corners; a beam belts the walls.
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const post = add(new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, WALL_H, 10), timber), "wood");
    post.position.set(sx * (WALL_W / 2 - 1.6), FOUND_H + WALL_H / 2, sz * (WALL_D / 2 - 1.6));
  });
  [FRONT + 0.25, -FRONT - 0.25].forEach((z) => {
    const beam = add(new THREE.Mesh(new THREE.BoxGeometry(WALL_W - 4, 1.2, 0.8), timber), "wood");
    beam.position.set(0, FOUND_H + 12.5, z);
    const sill = add(new THREE.Mesh(new THREE.BoxGeometry(WALL_W - 4, 1.0, 0.8), timber), "wood");
    sill.position.set(0, WALL_TOP - 0.5, z);
  });
  [WALL_W / 2 + 0.25, -WALL_W / 2 - 0.25].forEach((x) => {
    const beam = add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, WALL_D - 4), timber), "wood");
    beam.position.set(x, FOUND_H + 12.5, 0);
  });

  // Curved gable roof: slopes sweep outward at the eaves.
  const SPAN = WALL_W / 2 + 3.5;
  const RIDGE = 15 + (index % 2) * 2;
  const T = 1.4;
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-SPAN, -0.6);
  roofShape.quadraticCurveTo(-SPAN * 0.42, RIDGE * 0.32, 0, RIDGE);
  roofShape.quadraticCurveTo(SPAN * 0.42, RIDGE * 0.32, SPAN, -0.6);
  roofShape.lineTo(SPAN - 0.4, -0.6 - T);
  roofShape.quadraticCurveTo(SPAN * 0.42, RIDGE * 0.32 - T * 1.5, 0, RIDGE - T * 1.6);
  roofShape.quadraticCurveTo(-SPAN * 0.42, RIDGE * 0.32 - T * 1.5, -SPAN + 0.4, -0.6 - T);
  roofShape.lineTo(-SPAN, -0.6);
  const ROOF_D = WALL_D + 7;
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: ROOF_D, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.4, bevelSegments: 2, curveSegments: 18 });
  roofGeo.translate(0, 0, -ROOF_D / 2);
  const roof = add(new THREE.Mesh(roofGeo, roofMat), "tiles");
  roof.position.y = WALL_TOP + 0.4;

  // Ridge cap
  const ridge = add(new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, ROOF_D + 1, 10), mat(palette.ridge, 0.7, "tiles")), "tiles");
  ridge.rotation.x = Math.PI / 2;
  ridge.position.set(0, WALL_TOP + RIDGE - 0.4, 0);

  // Gable walls fill the space under the curved roof at each end.
  const gableShape = new THREE.Shape();
  const GW = WALL_W / 2 - 0.6;
  gableShape.moveTo(-GW, 0);
  gableShape.quadraticCurveTo(-GW * 0.42, RIDGE * 0.3 - 1.6, 0, RIDGE - 2.2);
  gableShape.quadraticCurveTo(GW * 0.42, RIDGE * 0.3 - 1.6, GW, 0);
  gableShape.lineTo(-GW, 0);
  [FRONT - 0.6, -FRONT - 0.2].forEach((z) => {
    const gable = add(new THREE.Mesh(flatPanel(gableShape, 0.8), plaster), "plaster");
    gable.position.set(0, WALL_TOP, z);
  });

  // Round attic window in the front gable.
  const oculusFrame = new THREE.Shape();
  oculusFrame.absarc(0, 0, 2.6, 0, Math.PI * 2, false);
  const oculusHole = new THREE.Path();
  oculusHole.absarc(0, 0, 1.8, 0, Math.PI * 2, true);
  oculusFrame.holes.push(oculusHole);
  const oculus = add(new THREE.Mesh(flatPanel(oculusFrame, 0.7), trim), "wood");
  oculus.position.set(0, WALL_TOP + RIDGE * 0.42, FRONT + 0.1);
  const oculusGlass = new THREE.Mesh(new THREE.CircleGeometry(1.85, 20), houseWindowGlass);
  oculusGlass.position.set(0, WALL_TOP + RIDGE * 0.42, FRONT + 0.35);
  oculusGlass.userData.noSurface = true;
  group.add(oculusGlass);

  // Arched door with a stone surround and rounded steps.
  const door = add(new THREE.Mesh(flatPanel(archShape(8, 13.5), 0.8), timber), "wood");
  door.position.set(0, FOUND_H, FRONT - 0.2);
  const doorFrame = add(new THREE.Mesh(flatPanel(archFrameShape(8, 13.5, 1.3), 1.2), stone), "stone");
  doorFrame.position.set(0, FOUND_H, FRONT - 0.1);
  const knob = add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), mat(0xc9a24a, 0.35, "metal", { metalness: 0.7 })), null, false);
  knob.position.set(2.6, FOUND_H + 6.2, FRONT + 0.85);
  [[7.2, 1.9, 1.0], [5.6, 1.9, 2.9]].forEach(([radius, h, y]) => {
    const step = add(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius + 0.3, h, 24, 1, false, -Math.PI / 2, Math.PI), stone), "stone");
    step.position.set(0, y, FRONT + 2.4);
  });

  // Porch lantern beside the door (glows at night).
  const lamp = add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 2, 1.4), new THREE.MeshStandardMaterial({ color: 0xffd25a, emissive: 0xffa832, emissiveIntensity: 0.1 })), null, false);
  lamp.position.set(6.4, FOUND_H + 11.5, FRONT + 1.2);
  lamp.userData.noSurface = true;
  const lampArm = add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 1.6), timber), "wood", false);
  lampArm.position.set(6.4, FOUND_H + 12.7, FRONT + 0.6);

  // Arched windows with flower boxes.
  const flowerHexes = [0xe2566b, 0xf4b740, 0xf3f0e6, 0xb07ad6];
  const addWindow = (x, z, rotY, withFlowers) => {
    const win = new THREE.Group();
    const frame = new THREE.Mesh(flatPanel(archFrameShape(5.6, 8, 0.9), 0.9), trim);
    frame.castShadow = true;
    frame.userData.surface = "wood";
    win.add(frame);
    const glass = new THREE.Mesh(flatPanel(archShape(5.6, 8), 0.3), houseWindowGlass);
    glass.userData.noSurface = true;
    win.add(glass);
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.45, 8, 0.9), trim);
    mullion.position.set(0, 4, 0.3);
    win.add(mullion);
    const transom = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.45, 0.9), trim);
    transom.position.set(0, 4.2, 0.3);
    win.add(transom);
    if (withFlowers) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.6, 2), timber);
      box.position.set(0, -0.9, 1.1);
      box.castShadow = true;
      box.userData.surface = "wood";
      win.add(box);
      for (let i = 0; i < 6; i += 1) {
        const bloom = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.75, 0),
          new THREE.MeshStandardMaterial({ color: worldHex(i % 2 ? WORLD_PALETTE.foliage.tuft : flowerHexes[(index + i) % flowerHexes.length]), roughness: 0.8, flatShading: true }),
        );
        bloom.position.set(-3 + i * 1.2, 0.3, 1.2 + (i % 2) * 0.3);
        win.add(bloom);
      }
    }
    win.position.set(x, FOUND_H + 6.5, z);
    win.rotation.y = rotY;
    group.add(win);
  };
  addWindow(-10.5, FRONT - 0.15, 0, true);
  addWindow(10.5, FRONT - 0.15, 0, true);
  addWindow(-8, -FRONT + 0.15, Math.PI, false);
  addWindow(8, -FRONT + 0.15, Math.PI, false);
  addWindow(WALL_W / 2 - 0.15, 0, Math.PI / 2, true);
  addWindow(-WALL_W / 2 + 0.15, 4, -Math.PI / 2, false);

  // Stone chimney with a cap.
  const chimney = add(new THREE.Mesh(new THREE.BoxGeometry(4.4, 15, 4.4), stone), "stone");
  chimney.position.set(9.5, WALL_TOP + 7.5, -5);
  const cap = add(new THREE.Mesh(new THREE.BoxGeometry(5.6, 1, 5.6), stone), "stone");
  cap.position.set(9.5, WALL_TOP + 15.2, -5);

  // Every other cottage gets a round corner turret with a bell-curved roof.
  if (index % 2 === 0) {
    const TX = -WALL_W / 2 + 2.6;
    const TZ = -WALL_D / 2 + 2.6;
    const TR = 5.6;
    const TH = WALL_H + 7;
    const tower = add(new THREE.Mesh(new THREE.CylinderGeometry(TR, TR + 0.3, TH, 24), plaster), "plaster");
    tower.position.set(TX, FOUND_H + TH / 2, TZ);
    const band = add(new THREE.Mesh(new THREE.CylinderGeometry(TR + 0.35, TR + 0.35, 1.2, 24), timber), "wood");
    band.position.set(TX, FOUND_H + 12.5, TZ);
    const profile = [];
    for (let i = 0; i <= 14; i += 1) {
      const t = i / 14;
      profile.push(new THREE.Vector2((TR + 1.8) * Math.pow(1 - t, 1.7) + 0.05, t * 13));
    }
    const spire = add(new THREE.Mesh(new THREE.LatheGeometry(profile, 24), roofMat), "tiles");
    spire.position.set(TX, FOUND_H + TH - 0.2, TZ);
    const finial = add(new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 8), mat(0xc9a24a, 0.35, "metal", { metalness: 0.7 })), null, false);
    finial.position.set(TX, FOUND_H + TH + 13.2, TZ);
    // Turret window faces outward from the corner.
    const turretWin = new THREE.Group();
    const tFrame = new THREE.Mesh(flatPanel(archFrameShape(3.2, 5.4, 0.7), 0.7), trim);
    const tGlass = new THREE.Mesh(flatPanel(archShape(3.2, 5.4), 0.3), houseWindowGlass);
    tGlass.userData.noSurface = true;
    turretWin.add(tFrame, tGlass);
    const outward = Math.atan2(TX, TZ);
    turretWin.position.set(TX + Math.sin(outward) * (TR - 0.1), FOUND_H + 17, TZ + Math.cos(outward) * (TR - 0.1));
    turretWin.rotation.y = outward;
    group.add(turretWin);
  }

  group.scale.setScalar(0.94 + (index % 3) * 0.05);
  return group;
}

function createRock(size) {
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(size, 1),
    new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.rock), roughness: 0.98, flatShading: true }),
  );
  rock.scale.set(1.25, 0.55 + size * 0.03, 0.9);
  rock.castShadow = true;
  rock.receiveShadow = true;
  return rock;
}

function createGrassTuft(size) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.tuft), roughness: 0.95, side: THREE.DoubleSide });
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

function createTeleporter(position, destination, isDirect = false) {
  const teleporter = new THREE.Group();
  teleporter.position.copy(position);

  // Auto-detect destination island
  let destIslandName = "Unknown Island";
  let requiredLevel = 1;

  if (islands.length > 0) {
    let bestDist = Infinity;
    let bestIdx = 0;
    for (let i = 0; i < Math.min(5, islands.length); i++) {
      const dist = destination.distanceTo(islands[i].position);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    if (bestIdx === 0) {
      destIslandName = "Starter Island";
      requiredLevel = 1;
    } else if (bestIdx === 1) {
      destIslandName = "Jungle Island";
      requiredLevel = 15;
    } else if (bestIdx === 2) {
      destIslandName = "Pirate Town";
      requiredLevel = 1;
    } else if (bestIdx === 3) {
      destIslandName = "Desert Island";
      requiredLevel = 60;
    } else if (bestIdx === 4) {
      destIslandName = "Snowy Village";
      requiredLevel = 85;
    }
  }

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
    new THREE.MeshBasicMaterial({ color: isDirect ? 0xd1a65c : 0x7ce0b4, transparent: true, opacity: 0.82 }),
  );
  ring.position.y = 11;
  ring.rotation.x = Math.PI / 2;
  teleporter.add(ring);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7, 34, 32),
    new THREE.MeshBasicMaterial({ color: isDirect ? 0xd1a65c : 0x7ce0b4, transparent: true, opacity: 0.22 }),
  );
  beam.position.y = 18;
  teleporter.add(beam);

  const label = makeLabel(isDirect ? `To ${destIslandName}` : "Teleporter", 1.15);
  label.position.y = 39;
  teleporter.add(label);

  teleporter.userData.settleOn = true; // grounded by settleIslandObjects
  scene.add(teleporter);
  animatedWorldObjects.push({ mesh: ring, type: "teleporter", speed: 0.022, phase: position.x * 0.01 });
  animatedWorldObjects.push({ mesh: beam, type: "teleporterBeam", baseY: beam.position.y, speed: 0.003, phase: position.z * 0.01 });
  interactables.push({
    type: isDirect ? "teleporter" : "menuTeleporter",
    mesh: teleporter,
    destination,
    destIslandName,
    requiredLevel,
    prompt: isDirect ? `Press E: Teleport to ${destIslandName}` : "Press E: Open Teleporter Menu",
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
    name: "Pirate Town Captain",
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
  const label = makeLabel("Pirate Town Quests", 1.25);
  label.position.y = 15;
  giver.add(label);
  scene.add(giver);
  interactables.push({
    type: "questHub",
    mesh: giver,
    hubType: "pirateTown",
    prompt: "Press E: View Pirate Town quests",
  });
}

function createJungleQuestGiver(position) {
  const giver = new THREE.Group();
  giver.position.copy(position);
  giver.add(createHumanAvatarModel({
    name: "Jungle Quest Giver",
    skin: "#d9ab7e",
    shirt: "#16503c",
    pants: "#254428",
    hair: "#2b1c11",
    eyes: "#0a0a0a",
    boots: "#3a2512",
    hairStyle: "messy",
    outfit: "sailor",
    height: 100,
    build: 90,
  }, { showSword: false, showName: false }));

  const label = makeLabel("Jungle Quest Giver", 0.9);
  label.position.y = 14;
  giver.add(label);

  scene.add(giver);

  interactables.push({
    type: "questHub",
    mesh: giver,
    hubType: "jungle",
    prompt: "Press E: View Jungle quests",
  });
}

function createJunglePulseTrainer(position) {
  const trainer = new THREE.Group();
  trainer.position.copy(position);
  trainer.add(createHumanAvatarModel({
    name: "Jungle Pulse Trainer",
    skin: "#e5c59e",
    shirt: "#7a378b",
    pants: "#3f2048",
    hair: "#fbc531",
    eyes: "#0d0d0d",
    boots: "#1d0c24",
    hairStyle: "cap",
    outfit: "adventurer",
    height: 108,
    build: 95,
  }, { showSword: false, showName: false }));

  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(5.5, 0.2, 8, 42),
    new THREE.MeshBasicMaterial({ color: 0x8e44ad, transparent: true, opacity: 0.8 }),
  );
  aura.position.y = 2;
  aura.rotation.x = Math.PI / 2;
  trainer.add(aura);

  const label = makeLabel("Jungle Pulse Trainer", 1);
  label.position.y = 15;
  trainer.add(label);

  scene.add(trainer);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.018, phase: 1.5 });

  interactables.push({
    type: "junglePulseTrainer",
    mesh: trainer,
    prompt: "Press E: Learn Jungle Pulse",
  });
}

function createDesertQuestGiver(position) {
  const giver = new THREE.Group();
  giver.position.copy(position);
  giver.add(createHumanAvatarModel({
    name: "Desert Quest Giver",
    skin: "#eed2b8",
    shirt: "#b8860b",
    pants: "#8b6508",
    hair: "#3a2512",
    eyes: "#111111",
    boots: "#4a3319",
    hairStyle: "short",
    outfit: "adventurer",
    height: 102,
    build: 105,
  }, { showSword: false, showName: false }));

  const label = makeLabel("Desert Quest Giver", 0.9);
  label.position.y = 14;
  giver.add(label);

  scene.add(giver);

  interactables.push({
    type: "questHub",
    mesh: giver,
    hubType: "desert",
    prompt: "Press E: View Desert quests",
  });
}

function createSnowyQuestGiver(position) {
  const giver = new THREE.Group();
  giver.position.copy(position);
  giver.add(createHumanAvatarModel({
    name: "Snowy Quest Giver",
    skin: "#f0e0d0",
    shirt: "#a8c8e8",
    pants: "#4a5f78",
    hair: "#e8e8f0",
    eyes: "#1a3a5c",
    boots: "#2a3a4a",
    hairStyle: "short",
    outfit: "adventurer",
    height: 104,
    build: 100,
  }, { showSword: false, showName: false }));

  // Snowflake aura ring
  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(5.5, 0.18, 8, 42),
    new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.7 }),
  );
  aura.position.y = 2;
  aura.rotation.x = Math.PI / 2;
  giver.add(aura);

  const label = makeLabel("Snowy Quest Giver", 0.9);
  label.position.y = 15;
  giver.add(label);

  scene.add(giver);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.014, phase: 0.8 });

  interactables.push({
    type: "questHub",
    mesh: giver,
    hubType: "snowy",
    prompt: "Press E: View Snowy Village quests",
  });
}

function createObservationHakiTrainer(position) {
  const trainer = new THREE.Group();
  trainer.position.copy(position);
  trainer.add(createHumanAvatarModel({
    name: "Foresight Master",
    skin: "#d8c2aa",
    shirt: "#771d1d",     // Crimson monk robe
    pants: "#1c1c1c",
    hair: "#ffffff",      // White hair
    eyes: "#ff2222",      // Red eyes / awakened perception
    boots: "#3a2618",
    hairStyle: "messy",
    outfit: "coat",
    height: 110,
    build: 102,
  }, { showSword: false, showName: false }));

  // Glowing red Foresight aura ring
  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(5.2, 0.22, 8, 42),
    new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.8 }),
  );
  aura.position.y = 2;
  aura.rotation.x = Math.PI / 2;
  trainer.add(aura);

  // Floating Foresight eye marker above head
  const eyeMarker = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xff4444 })
  );
  eyeMarker.position.y = 16.5;
  eyeMarker.scale.set(1.4, 0.7, 1);
  trainer.add(eyeMarker);

  const label = makeLabel("Foresight Master", 1.0);
  label.position.y = 19;
  trainer.add(label);

  scene.add(trainer);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.02, phase: 0.5 });
  animatedWorldObjects.push({ mesh: eyeMarker, type: "teleporterBeam", baseY: 16.5, speed: 0.003, phase: 0 });

  interactables.push({
    type: "observationTrainer",
    mesh: trainer,
    prompt: "Press E: Train Foresight",
  });
}

function showObservationHakiDialog() {
  if (!dialoguePanel || !questOptions) return;
  dialoguePanel.classList.remove("hidden");
  dialogueTitle.textContent = "👁️ Foresight Master";
  questOptions.innerHTML = "";

  if (player.observationHaki && player.observationHaki.unlocked) {
    dialogueDetail.textContent = `You have already awakened Foresight! Press K to toggle it ON/OFF. While active, you can automatically dodge up to 5 attacks and sense all nearby threats.`;
  } else {
    dialogueDetail.textContent = `"In the biting blizzard, eyesight fails... but true masters see with their spirit. I can teach you Foresight for $7,500 Doubloons. (Requires Level 80+)."`;
  }

  if (!player.observationHaki || !player.observationHaki.unlocked) {
    const buyBtn = document.createElement("button");
    buyBtn.type = "button";
    buyBtn.className = "quest-option";
    buyBtn.innerHTML = `<strong>👁️ Learn Foresight</strong><span>Awaken Foresight (K key) to auto-dodge 5 attacks and reveal threats through walls.</span><small>Cost: $7,500 Doubloons (Requires Lv 80)</small>`;
    buyBtn.addEventListener("click", () => purchaseObservationHaki());
    questOptions.append(buyBtn);
  }

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "quest-option danger-button";
  closeBtn.style.background = "rgba(235, 94, 85, 0.15)";
  closeBtn.style.borderColor = "rgba(235, 94, 85, 0.3)";
  closeBtn.style.color = "#eb5e55";
  closeBtn.innerHTML = "<strong>Leave</strong><span>Close this menu</span>";
  closeBtn.addEventListener("click", () => { dialoguePanel.classList.add("hidden"); });
  questOptions.append(closeBtn);
}

function purchaseObservationHaki() {
  if (player.observationHaki && player.observationHaki.unlocked) {
    log("You have already mastered Foresight! Press K to toggle.");
    return;
  }
  if (player.level < 80) {
    log("Foresight Master: \"Your spirit is still unfocused. Come back at Level 80.\"");
    return;
  }
  const cost = 7500;
  if (player.money < cost) {
    log(`Foresight Master: "You need $${cost} Doubloons to undergo this training."`);
    return;
  }

  player.money -= cost;
  player.observationHaki.unlocked = true;
  player.observationHaki.active = true;
  player.observationHaki.dodges = 5;
  player.observationHaki.maxDodges = 5;
  dialoguePanel.classList.add("hidden");
  updateHud();
  saveGame();

  audio.playObservation();
  audio.playQuestComplete();

  // Pulse effect
  const pulseRing = new THREE.Mesh(
    new THREE.TorusGeometry(6, 0.2, 8, 48),
    new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.85 })
  );
  pulseRing.position.copy(playerMesh.position).add(new THREE.Vector3(0, 2, 0));
  pulseRing.rotation.x = Math.PI / 2;
  scene.add(pulseRing);
  addTimedEffect(pulseRing, 0.6, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 10);
    mesh.material.opacity = 0.85 * (1 - progress);
  });

  createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 14, 0)), "👁️ FORESIGHT AWAKENED!", "#ff3333");
  log("👁️ You have learned Foresight! Press K to toggle ON/OFF. Automatically evades up to 5 attacks and detects enemy vitals.");
}

function createFlashStepTrainer(position) {
  const trainer = new THREE.Group();
  trainer.position.copy(position);
  trainer.add(createHumanAvatarModel({
    name: "Flash Step Master",
    skin: "#eed2b8",
    shirt: "#0d3b66",     // Midnight navy shinobi gi
    pants: "#14213d",
    hair: "#48cae4",      // Cyan streak hair
    eyes: "#00b4d8",
    boots: "#03045e",
    hairStyle: "spiky",
    outfit: "adventurer",
    height: 106,
    build: 96,
  }, { showSword: false, showName: false }));

  // Glowing cyan speed ring
  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(5.2, 0.22, 8, 42),
    new THREE.MeshBasicMaterial({ color: 0x66ddff, transparent: true, opacity: 0.8 }),
  );
  aura.position.y = 2;
  aura.rotation.x = Math.PI / 2;
  trainer.add(aura);

  const label = makeLabel("Flash Step Master", 1.0);
  label.position.y = 16;
  trainer.add(label);

  scene.add(trainer);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.03, phase: 1.2 });

  interactables.push({
    type: "flashStepTrainer",
    mesh: trainer,
    prompt: "Press E: Train Flash Step",
  });
}

function showFlashStepDialog() {
  if (!dialoguePanel || !questOptions) return;
  dialoguePanel.classList.remove("hidden");
  dialogueTitle.textContent = "⚡ Flash Step Master";
  questOptions.innerHTML = "";

  if (player.hasFlashStep) {
    dialogueDetail.textContent = "You have already mastered Flash Step! Press T to instantly vanish and teleport directly to where you are pointing with your cursor.";
  } else {
    dialogueDetail.textContent = `"By kicking the snow a dozen times in a fraction of a second, one can vanish before the eye can track. I will teach you the ancient Flash Step for $5,000 Doubloons. (Requires Level 75+)."`;
  }

  if (!player.hasFlashStep) {
    const buyBtn = document.createElement("button");
    buyBtn.type = "button";
    buyBtn.className = "quest-option";
    buyBtn.innerHTML = `<strong>⚡ Learn Flash Step</strong><span>Unlocks T key to instantly teleport directly to where your cursor points.</span><small>Cost: $5,000 Doubloons (Requires Lv 75)</small>`;
    buyBtn.addEventListener("click", () => purchaseFlashStep());
    questOptions.append(buyBtn);
  }

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "quest-option danger-button";
  closeBtn.style.background = "rgba(235, 94, 85, 0.15)";
  closeBtn.style.borderColor = "rgba(235, 94, 85, 0.3)";
  closeBtn.style.color = "#eb5e55";
  closeBtn.innerHTML = "<strong>Leave</strong><span>Close this menu</span>";
  closeBtn.addEventListener("click", () => { dialoguePanel.classList.add("hidden"); });
  questOptions.append(closeBtn);
}

function purchaseFlashStep() {
  if (player.hasFlashStep) {
    log("You have already mastered Flash Step! Press T to use it.");
    return;
  }
  if (player.level < 75) {
    log("Flash Step Master: \"Your legs aren't fast enough yet, rookie. Come back at Level 75.\"");
    return;
  }
  const cost = 5000;
  if (player.money < cost) {
    log(`Flash Step Master: "You need $${cost} Doubloons to master Flash Step."`);
    return;
  }

  player.money -= cost;
  player.hasFlashStep = true;
  dialoguePanel.classList.add("hidden");
  updateHud();
  saveGame();

  audio.playFlashStep();
  audio.playFanfare();

  createFlashStepAfterimage(playerMesh.position.clone());
  createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 14, 0)), "⚡ FLASH STEP UNLOCKED!", "#66ddff");
  log("⚡ You have learned Flash Step! Press T to burst forward with sonic speed.");
}

function updateObservationVision(dt) {
  if (!player.observationHaki || !player.observationHaki.active) {
    enemies.forEach(e => {
      if (e.obsMarker) e.obsMarker.visible = false;
    });
    return;
  }

  // Periodic subtle radar pulse
  if (!updateObservationVision.lastPulse || performance.now() - updateObservationVision.lastPulse > 1800) {
    updateObservationVision.lastPulse = performance.now();
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.14, 6, 36),
      new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.45 })
    );
    ring.position.copy(playerMesh.position).add(new THREE.Vector3(0, 1.2, 0));
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    addTimedEffect(ring, 0.85, (mesh, progress) => {
      mesh.scale.setScalar(1 + progress * 7.5);
      mesh.material.opacity = 0.45 * (1 - progress);
    });
  }

  // Highlight all nearby enemies
  enemies.forEach(e => {
    if (!e.alive) {
      if (e.obsMarker) e.obsMarker.visible = false;
      return;
    }
    const dist = e.mesh.position.distanceTo(playerMesh.position);
    if (dist <= 260) {
      if (!e.obsMarker) {
        const marker = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.3, 0),
          new THREE.MeshBasicMaterial({ color: 0xff3333, wireframe: true })
        );
        marker.position.set(0, 14.5, 0);
        e.mesh.add(marker);
        e.obsMarker = marker;
      }
      e.obsMarker.visible = true;
      e.obsMarker.rotation.y += dt * 3.5;
    } else {
      if (e.obsMarker) e.obsMarker.visible = false;
    }
  });
}

function createBlackLegDojo(position) {
  const group = new THREE.Group();
  group.position.copy(position);

  // === Cave structure ===
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x2a2218,
    roughness: 0.95,
    metalness: 0.05,
    flatShading: true,
  });

  // Back wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(28, 18, 2.5), rockMat);
  backWall.position.set(0, 9, -12);
  group.add(backWall);

  // Left wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2.5, 18, 24), rockMat);
  leftWall.position.set(-12, 9, -2);
  group.add(leftWall);

  // Right wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2.5, 18, 24), rockMat);
  rightWall.position.set(12, 9, -2);
  group.add(rightWall);

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(28, 2.5, 24), rockMat);
  ceiling.position.set(0, 18, -2);
  group.add(ceiling);

  // Cave floor (darker stone)
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1610, roughness: 0.98 });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(24, 0.5, 22), floorMat);
  floor.position.set(0, 0.25, -2);
  group.add(floor);

  // Entrance arch frame (left & right pillars)
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x3a3020, roughness: 0.9, flatShading: true });
  const pillarL = new THREE.Mesh(new THREE.BoxGeometry(3, 16, 3), pillarMat);
  pillarL.position.set(-11, 8, 10);
  group.add(pillarL);
  const pillarR = new THREE.Mesh(new THREE.BoxGeometry(3, 16, 3), pillarMat);
  pillarR.position.set(11, 8, 10);
  group.add(pillarR);

  // Entrance lintel
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(28, 3, 3), pillarMat);
  lintel.position.set(0, 15.5, 10);
  group.add(lintel);

  // === Central fire pit ===
  const pitMat = new THREE.MeshStandardMaterial({ color: 0x1a0d00, roughness: 0.95 });
  const pit = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 1, 10), pitMat);
  pit.position.set(0, 0.5, -4);
  group.add(pit);

  // Fire glow sphere (emissive orange)
  const fireGlow = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 8, 6),
    new THREE.MeshStandardMaterial({
      color: 0xff4400,
      emissive: 0xff3300,
      emissiveIntensity: 2.5,
      transparent: true,
      opacity: 0.82,
    })
  );
  fireGlow.position.set(0, 2.5, -4);
  group.add(fireGlow);
  animatedWorldObjects.push({ mesh: fireGlow, type: "fireGlow", phase: 0 });

  // Fire inner core (brighter yellow)
  const fireCore = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 6, 5),
    new THREE.MeshBasicMaterial({ color: 0xffcc00 })
  );
  fireCore.position.set(0, 2.8, -4);
  group.add(fireCore);
  animatedWorldObjects.push({ mesh: fireCore, type: "fireCore", phase: 1.2 });

  // Point light for fire warmth
  const fireLight = new THREE.PointLight(0xff5500, 1.6, 30);
  fireLight.position.set(0, 5, -4);
  group.add(fireLight);

  // === Hanging lanterns ===
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xff7700 });
  const lanternGeo = new THREE.SphereGeometry(0.6, 6, 4);
  [[-8, 14, -6], [8, 14, -6], [0, 14, -10]].forEach(([x, y, z]) => {
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(x, y, z);
    group.add(lantern);
    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3, 4),
      new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    wire.position.set(x, y + 1.5, z);
    group.add(wire);
  });

  // === Kick-style crossed-leg training mannequin (simple shapes) ===
  // Decorative kick target dummy
  const dummyMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.85 });
  const dummyBody = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 8), dummyMat);
  dummyBody.position.set(-7, 4, -8);
  group.add(dummyBody);
  const dummyHead = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 6), dummyMat);
  dummyHead.position.set(-7, 8, -8);
  group.add(dummyHead);
  const dummyPost = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 6), new THREE.MeshStandardMaterial({ color: 0x3a2810 }));
  dummyPost.position.set(-7, 1, -8);
  group.add(dummyPost);

  // === SECRET entrance sign ===
  const secretLabel = makeLabel("🔥 SECRET AREA 🔥", 1.1);
  secretLabel.position.set(0, 18, 10);
  group.add(secretLabel);

  // === Old Cinder NPC ===
  const zeffPos = new THREE.Vector3(0, 1, -8);
  const zeff = new THREE.Group();
  zeff.position.copy(zeffPos);
  zeff.add(createHumanAvatarModel({
    name: "Old Cinder",
    skin: "#c49a6c",
    shirt: "#cc2200",     // Red chef coat
    pants: "#1a1a1a",
    hair: "#e8c870",      // Blonde/gold
    eyes: "#442200",
    boots: "#0a0a0a",
    hairStyle: "messy",
    outfit: "coat",
    height: 112,
    build: 108,
  }, { showSword: false, showName: false }));

  // Golden star/flame label for Old Cinder
  const zeffLabel = makeLabel("Old Cinder — Blaze Kick Master", 1.0);
  zeffLabel.position.y = 17;
  zeff.add(zeffLabel);

  // Small fire ring around Old Cinder's feet
  const zeffRing = new THREE.Mesh(
    new THREE.TorusGeometry(4, 0.15, 6, 32),
    new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.7 })
  );
  zeffRing.position.y = 1;
  zeffRing.rotation.x = Math.PI / 2;
  zeff.add(zeffRing);
  animatedWorldObjects.push({ mesh: zeffRing, type: "teleporter", speed: 0.025, phase: 0 });

  group.add(zeff);

  scene.add(group);

  // Register interactable (use the world-space position of Old Cinder)
  const worldZeffPos = position.clone().add(zeffPos);
  const zeffWorldGroup = new THREE.Group();
  zeffWorldGroup.position.copy(worldZeffPos);
  zeff.getWorldPosition(worldZeffPos);

  interactables.push({
    type: "flamingFeetShop",
    mesh: group,            // proximity check against the whole cave group
    interactCenter: worldZeffPos,
    prompt: "Press E: Talk to Old Cinder (Blaze Kick Master)",
  });
}

function showFlamingFeetShop() {
  if (!dialoguePanel || !questOptions) return;
  dialoguePanel.classList.remove("hidden");
  dialogueTitle.textContent = "⚡ Old Cinder — Blaze Kick Style";
  questOptions.innerHTML = "";

  if (player.hasFlamingFeet) {
    dialogueDetail.textContent = "You already master the Blaze Kick Style! Use C (Ember Shot) and V (Inferno Kick) in Melee mode. Set your legs ablaze!";
  } else {
    dialogueDetail.textContent = `"You want to learn Blaze Kick Style? It'll cost ya ${5000} Doubloons. The style focuses kicks infused with friction-generated flames. C = Ember Shot, V = Inferno Kick."`;
  }

  if (!player.hasFlamingFeet) {
    const buyBtn = document.createElement("button");
    buyBtn.type = "button";
    buyBtn.className = "quest-option";
    buyBtn.innerHTML = `<strong>🔥 Learn Blaze Kick Style</strong><span>Unlocks Ember Shot (C) and Inferno Kick (V) in Melee mode.</span><small>Cost: $5,000 Doubloons</small>`;
    buyBtn.addEventListener("click", () => buyFlamingFeet());
    questOptions.append(buyBtn);
  }

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "quest-option danger-button";
  closeBtn.style.background = "rgba(235, 94, 85, 0.15)";
  closeBtn.style.borderColor = "rgba(235, 94, 85, 0.3)";
  closeBtn.style.color = "#eb5e55";
  closeBtn.innerHTML = "<strong>Leave</strong><span>Close this menu</span>";
  closeBtn.addEventListener("click", () => { dialoguePanel.classList.add("hidden"); });
  questOptions.append(closeBtn);
}

function buyFlamingFeet() {
  if (player.hasFlamingFeet) {
    log("You already know the Blaze Kick Style!");
    return;
  }
  if (player.level < 30) {
    log("Old Cinder: \"You're too green, rookie. Come back at level 30.\"");
    return;
  }
  const cost = 5000;
  if (player.money < cost) {
    log(`Old Cinder: "Not enough Doubloons! You need ${cost} to learn from me."`);
    return;
  }
  player.money -= cost;
  player.hasFlamingFeet = true;
  dialoguePanel.classList.add("hidden");
  updateHud();
  saveGame();
  audio.playQuestComplete();

  // Fire burst celebration effect
  createFireBurst(playerMesh.position.clone().add(new THREE.Vector3(0, 4, 0)));
  createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 14, 0)), "🔥 BLACK LEG STYLE UNLOCKED!", "#ff5500");
}

function createReturnTeleporter(position) {
  const starterIslandPos = new THREE.Vector3(0, islands[0].surfaceY + 0.15, 0);
  const teleporter = new THREE.Group();
  teleporter.position.copy(position);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6.5, 0.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x112233, roughness: 0.6, metalness: 0.8 })
  );
  base.position.y = 0.4;
  base.castShadow = true;
  base.receiveShadow = true;
  teleporter.add(base);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.3, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0x3ce88a, transparent: true, opacity: 0.6 })
  );
  ring.position.y = 0.5;
  ring.rotation.x = Math.PI / 2;
  teleporter.add(ring);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(4.8, 4.8, 18, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x3ce88a, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
  );
  beam.position.y = 9;
  teleporter.add(beam);

  const label = makeLabel("Teleporter", 1.15);
  label.position.y = 15;
  teleporter.add(label);

  teleporter.userData.settleOn = true; // grounded by settleIslandObjects
  scene.add(teleporter);
  animatedWorldObjects.push({ mesh: ring, type: "teleporter", speed: 0.022, phase: position.x * 0.01 });
  animatedWorldObjects.push({ mesh: beam, type: "teleporterBeam", baseY: beam.position.y, speed: 0.003, phase: position.z * 0.01 });

  interactables.push({
    type: "returnTeleporter",
    mesh: teleporter,
    prompt: "Press E: Return to Starter Island",
    destination: starterIslandPos,
  });
}

function learnJunglePulse() {
  if (player.specialUnlocked) {
    log("You already know Jungle Pulse. Press 4 to equip it.");
    return;
  }
  if (!quest.complete) {
    log("The Jungle Pulse Trainer says: Complete the Starter Island quest before training with me.");
    return;
  }
  player.specialUnlocked = true;
  player.stats.special = Math.max(1, player.stats.special);
  updateHud();
  log("Jungle Pulse special ability unlocked!");
  saveGame();
}

function showTeleporterMenu() {
  if (!dialoguePanel || !questOptions) return;
  dialoguePanel.classList.remove("hidden");
  dialogueTitle.textContent = "Sea Teleporter Node";
  dialogueDetail.textContent = "Select an island destination:";
  questOptions.innerHTML = "";

  const jungleBtn = document.createElement("button");
  jungleBtn.type = "button";
  jungleBtn.className = "quest-option";
  jungleBtn.innerHTML = "<strong>Jungle Island</strong><span>Travel to the dense tropical forest. (Requires Level 15)</span>";
  jungleBtn.addEventListener("click", () => {
    if (player.level < 15) {
      log("You need to be level 15+ to access Jungle Island.");
      return;
    }
    showTeleporterSubMenu("Jungle");
  });
  questOptions.append(jungleBtn);

  const pirateBtn = document.createElement("button");
  pirateBtn.type = "button";
  pirateBtn.className = "quest-option";
  pirateBtn.innerHTML = "<strong>Pirate Town</strong><span>Travel to the pirate town.</span>";
  pirateBtn.addEventListener("click", () => {
    showTeleporterSubMenu("PirateTown");
  });
  questOptions.append(pirateBtn);

  const desertBtn = document.createElement("button");
  desertBtn.type = "button";
  desertBtn.className = "quest-option";
  desertBtn.innerHTML = "<strong>The Desert Island</strong><span>Travel to the dry, burning sands. (Requires Level 60)</span>";
  desertBtn.addEventListener("click", () => {
    if (player.level < 60) {
      log("You need to be level 60+ to access Desert Island.");
      return;
    }
    showTeleporterSubMenu("Desert");
  });
  questOptions.append(desertBtn);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "quest-option danger-button";
  closeBtn.style.background = "rgba(235, 94, 85, 0.15)";
  closeBtn.style.borderColor = "rgba(235, 94, 85, 0.3)";
  closeBtn.style.color = "#eb5e55";
  closeBtn.innerHTML = "<strong>Cancel</strong><span>Close menu</span>";
  closeBtn.addEventListener("click", () => {
    dialoguePanel.classList.add("hidden");
  });
  questOptions.append(closeBtn);
}

function showTeleporterSubMenu(island) {
  if (!dialoguePanel || !questOptions) return;
  const friendlyName = island === "PirateTown" ? "Pirate Town" : `${island} Island`;
  dialogueTitle.textContent = `${friendlyName} Locations`;
  dialogueDetail.textContent = "Select a specific coordinate to teleport to:";
  questOptions.innerHTML = "";

  if (island === "PirateTown") {
    const questGiverBtn = document.createElement("button");
    questGiverBtn.type = "button";
    questGiverBtn.className = "quest-option";
    questGiverBtn.innerHTML = "<strong>Quest Giver</strong><span>Teleport near the island's quest dealer.</span>";
    questGiverBtn.addEventListener("click", () => {
      dialoguePanel.classList.add("hidden");
      teleportToLocation(island, "questGiver");
    });
    questOptions.append(questGiverBtn);
  } else {
    const questGiverBtn = document.createElement("button");
    questGiverBtn.type = "button";
    questGiverBtn.className = "quest-option";
    questGiverBtn.innerHTML = "<strong>Quest Giver</strong><span>Teleport near the island's quest dealer.</span>";
    questGiverBtn.addEventListener("click", () => {
      dialoguePanel.classList.add("hidden");
      teleportToLocation(island, "questGiver");
    });
    questOptions.append(questGiverBtn);

    const specialBtn = document.createElement("button");
    specialBtn.type = "button";
    specialBtn.className = "quest-option";
    const abilityName = island === "Jungle" ? "Jungle Pulse Trainer" : "Iron Aura Trainer";
    specialBtn.innerHTML = `<strong>${abilityName}</strong><span>Teleport to the special ability trainer.</span>`;
    specialBtn.addEventListener("click", () => {
      dialoguePanel.classList.add("hidden");
      teleportToLocation(island, "special");
    });
    questOptions.append(specialBtn);
  }

  const backBtn = document.createElement("button");
  backBtn.type = "button";
  backBtn.className = "quest-option";
  backBtn.innerHTML = "<strong>&larr; Back</strong><span>Return to island selection</span>";
  backBtn.addEventListener("click", () => {
    showTeleporterMenu();
  });
  questOptions.append(backBtn);
}

function teleportToLocation(island, type) {
  let dest;
  if (island === "Jungle") {
    const jungle = islands[JUNGLE_ISLAND_INDEX];
    if (!jungle) return;
    if (type === "questGiver") {
      dest = new THREE.Vector3(jungle.position.x + 350, getIslandSurfaceHeightAt(jungle.position.x + 350, jungle.position.z + 300, jungle) + 0.15, jungle.position.z + 300);
    } else {
      dest = new THREE.Vector3(jungle.position.x - 150, getIslandSurfaceHeightAt(jungle.position.x - 150, jungle.position.z - 200, jungle) + 0.15, jungle.position.z - 200);
    }
    log("Teleported to Jungle Island.");
  } else if (island === "PirateTown") {
    const pt = islands[2];
    if (!pt) return;
    if (type === "questGiver") {
      dest = new THREE.Vector3(pt.position.x, getIslandSurfaceHeightAt(pt.position.x, pt.position.z, pt) + 0.15, pt.position.z);
    }
    log("Teleported to Pirate Town.");
  } else if (island === "Desert") {
    const desert = islands[3];
    if (!desert) return;
    if (type === "questGiver") {
      dest = new THREE.Vector3(desert.position.x + 200, getIslandSurfaceHeightAt(desert.position.x + 200, desert.position.z + 200, desert) + 0.15, desert.position.z + 200);
    } else {
      dest = desert.position.clone().add(new THREE.Vector3(70, 0.15, -60));
    }
    log("Teleported to Desert Island.");
  }

  if (dest) {
    playerMesh.position.copy(dest);
    jumpOffset = 0;
    verticalVelocity = 0;
    isGrounded = true;
    createWallHitEffect(playerMesh.position.clone(), false);
  }
}

function createHakiTrainer(position) {
  const trainer = new THREE.Group();
  trainer.position.copy(position);
  trainer.add(createHumanAvatarModel({
    name: "Aura Trainer",
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
  const label = makeLabel("Aura Trainer", 1);
  label.position.y = 15;
  trainer.add(label);
  scene.add(trainer);
  animatedWorldObjects.push({ mesh: aura, type: "teleporter", speed: 0.018, phase: 1.2 });
  interactables.push({
    type: "hakiTrainer",
    mesh: trainer,
    prompt: "Press E: Learn Iron Aura",
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
  const rockMaterial = new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.terrain.rockDark), roughness: 0.97, flatShading: true });
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
  enhanceWorldSurfaces(boat);
  const offset = new THREE.Vector3(0, 0, -28).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerMesh.rotation.y);
  boat.position.copy(playerMesh.position).add(offset);
  boat.position.y = OCEAN_SURFACE_Y + 0.28;
  boat.rotation.y = playerMesh.rotation.y;
  scene.add(boat);
  activeBoat = boat;
  hideBoatMenu();
  log(`Spawned ${type} boat near the water.`);
}

function showBoatMenu() {
  document.querySelector("#boat-menu").classList.remove("hidden");
}

function hideBoatMenu() {
  document.querySelector("#boat-menu").classList.add("hidden");
}

// ── 14-enemies.js ─ Enemy camps, bosses and enemy weapons.
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

function spawnJungleCamps(island) {
  const center = island.position;

  // Spawn 5 Monkeys in a camp/bunch
  const monkeyCenter = center.clone().add(new THREE.Vector3(-250, 0, -250));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 100;
    const pz = Math.sin(angle) * 100;
    const spawnPos = monkeyCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "monkey");
  }

  // Spawn 5 Gorillas in a camp/bunch
  const gorillaCenter = center.clone().add(new THREE.Vector3(250, 0, -250));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 120;
    const pz = Math.sin(angle) * 120;
    const spawnPos = gorillaCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "gorilla");
  }

  // Spawn 1 Gorilla King (Boss)
  const gkPos = center.clone().add(new THREE.Vector3(0, 0, 200));
  gkPos.y = getIslandSurfaceHeightAt(gkPos.x, gkPos.z, island);
  spawnAdvancedEnemy(gkPos, 0, "gorilla_king");
}

function spawnDesertCamps(island) {
  const center = island.position;
  
  // Spawn 5 Desert Bandits in a bunch
  const banditCenter = center.clone().add(new THREE.Vector3(200, 0, -150));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 120;
    const pz = Math.sin(angle) * 120;
    const spawnPos = banditCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "desert_bandit");
  }

  // Spawn 5 Desert Officers in a bunch
  const officerCenter = center.clone().add(new THREE.Vector3(-200, 0, 150));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 120;
    const pz = Math.sin(angle) * 120;
    const spawnPos = officerCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "desert_officer");
  }
}

function spawnSnowyCamps(island) {
  const center = island.position;

  // Spawn 5 Frozen Bandits in a bunch (West side)
  const banditCenter = center.clone().add(new THREE.Vector3(-250, 0, -150));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 110;
    const pz = Math.sin(angle) * 110;
    const spawnPos = banditCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "frozen_bandit");
  }

  // Spawn 5 Snowmen in a bunch (East side)
  const snowmanCenter = center.clone().add(new THREE.Vector3(250, 0, -150));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 110;
    const pz = Math.sin(angle) * 110;
    const spawnPos = snowmanCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "snowman");
  }

  // Spawn 1 Yeti Boss (North side)
  const yetiPos = center.clone().add(new THREE.Vector3(0, 0, 250));
  yetiPos.y = getIslandSurfaceHeightAt(yetiPos.x, yetiPos.z, island);
  spawnAdvancedEnemy(yetiPos, 0, "yeti");
}

function spawnAdvancedEnemy(position, index, type) {
  const group = new THREE.Group();
  group.position.copy(position);
  const isBrute = type === "brute";
  const isBoss = type === "buggy";
  const isOfficer = type === "desert_officer";
  const isDesertBandit = type === "desert_bandit";
  const isGorillaKing = type === "gorilla_king";
  const isGorilla = type === "gorilla";
  const isMonkey = type === "monkey";
  const isFrozenBandit = type === "frozen_bandit";
  const isSnowman = type === "snowman";
  const isYeti = type === "yeti";

  let name = `Pirate ${index + 1}`;
  if (isBoss) name = "Jester";
  else if (isBrute) name = `Brute ${index + 1}`;
  else if (isOfficer) name = `Desert Officer ${index + 1}`;
  else if (isDesertBandit) name = `Desert Bandit ${index + 1}`;
  else if (isGorillaKing) name = "Gorilla King";
  else if (isGorilla) name = `Gorilla ${index + 1}`;
  else if (isMonkey) name = `Monkey ${index + 1}`;
  else if (isFrozenBandit) name = `Frozen Bandit ${index + 1}`;
  else if (isSnowman) name = `Snowman ${index + 1}`;
  else if (isYeti) name = "Yeti";

  let skinColor = "#b97852";
  let shirtColor = "#722b30";
  let pantsColor = "#222a34";
  let hairColor = "#1b120d";
  let hairStyle = "short";
  let outfit = "coat";
  let height = 104;
  let build = 108;

  if (isBoss) {
    skinColor = "#f1c29b";
    shirtColor = "#d74343";
    pantsColor = "#7a4f9d";
    hairColor = "#1f67c7";
    hairStyle = "cap";
    height = 118;
    build = 126;
  } else if (isBrute) {
    skinColor = "#b97852";
    shirtColor = "#3e3430";
    pantsColor = "#222a34";
    hairColor = "#1b120d";
    outfit = "armor";
    height = 126;
    build = 142;
  } else if (isOfficer) {
    skinColor = "#d2b48c";
    shirtColor = "#4a708b";
    pantsColor = "#2f4f4f";
    hairColor = "#000000";
    hairStyle = "spiky";
    outfit = "coat";
    height = 110;
    build = 110;
  } else if (isDesertBandit) {
    skinColor = "#eed2b8";
    shirtColor = "#8b7355";
    pantsColor = "#4a3b32";
    hairColor = "#3a2512";
    hairStyle = "short";
    outfit = "sailor";
    height = 102;
    build = 98;
  } else if (isMonkey) {
    skinColor = "#8b5a2b";
    shirtColor = "#8b5a2b";
    pantsColor = "#5c4033";
    hairColor = "#5c4033";
    hairStyle = "short";
    outfit = "sailor";
    height = 75;
    build = 80;
  } else if (isGorilla) {
    skinColor = "#2f4f4f";
    shirtColor = "#1a1a1a";
    pantsColor = "#1a1a1a";
    hairColor = "#1a1a1a";
    hairStyle = "messy";
    outfit = "armor";
    height = 120;
    build = 140;
  } else if (isGorillaKing) {
    skinColor = "#1a1a1a";
    shirtColor = "#ffd700";
    pantsColor = "#1a1a1a";
    hairColor = "#ffd700";
    hairStyle = "spiky";
    outfit = "armor";
    height = 150;
    build = 160;
  } else if (isFrozenBandit) {
    skinColor = "#c8dce8";
    shirtColor = "#3a6a8a";
    pantsColor = "#1e3f5a";
    hairColor = "#d0e8f8";
    hairStyle = "short";
    outfit = "armor";
    height = 106;
    build = 112;
  } else if (isSnowman) {
    skinColor = "#f0f8ff";
    shirtColor = "#e0e8f0";
    pantsColor = "#d0dce8";
    hairColor = "#404040";
    hairStyle = "short";
    outfit = "sailor";
    height = 100;
    build = 120;
  } else if (isYeti) {
    skinColor = "#e8f0f8";
    shirtColor = "#c8d8e8";
    pantsColor = "#a0b8c8";
    hairColor = "#f0f8ff";
    hairStyle = "messy";
    outfit = "armor";
    height = 155;
    build = 170;
  }

  const showSword = !isBrute && !isMonkey && !isGorilla && !isGorillaKing && !isSnowman && !isYeti;

  group.add(createHumanAvatarModel({
    id: `${type}-${index}`,
    name,
    skin: skinColor,
    shirt: shirtColor,
    pants: pantsColor,
    hair: hairColor,
    eyes: "#101010",
    boots: "#1a120d",
    hairStyle,
    outfit,
    height,
    build,
  }, { 
    showSword: showSword, 
    showName: false, 
    bandanaColor: isBoss ? "#ff3131" : isOfficer ? "#4682b4" : isGorillaKing ? "#ffd700" : "#b92832" 
  }));

  if (isBrute) addMaceToEnemy(group);
  if (isOfficer) {
    addGunToEnemy(group);
    // Hide sword, show gun initially
    group.children.forEach(child => {
      if (child.name === "gun") child.visible = true;
    });
    const avatar = group.children[0];
    if (avatar) {
      avatar.children.forEach(child => {
        if (child.name === "swordGroup") child.visible = false;
      });
    }
  }

  // Icy shell mesh for Frozen Bandits (transparent blue box around body)
  if (isFrozenBandit) {
    const shellGeo = new THREE.BoxGeometry(9, 14, 7);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
    const iceShell = new THREE.Mesh(shellGeo, shellMat);
    iceShell.name = "iceShell";
    iceShell.position.set(0, 6, 0);
    group.add(iceShell);
  }

  scene.add(group);
  
  let maxHp = 95;
  if (isBoss) maxHp = 850;
  else if (isBrute) maxHp = 180;
  else if (isOfficer) maxHp = 340;
  else if (isDesertBandit) maxHp = 260;
  else if (isGorillaKing) maxHp = 750;
  else if (isGorilla) maxHp = 160;
  else if (isMonkey) maxHp = 100;
  else if (isFrozenBandit) maxHp = 500;
  else if (isSnowman) maxHp = 650;
  else if (isYeti) maxHp = 2000;

  const enemyObj = {
    id: `${type}-${index}`,
    type,
    mesh: group,
    spawn: position.clone(),
    health: maxHp,
    maxHealth: maxHp,
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
  if (isBrute) {
    enemyObj.mace = group.children[1];
    enemyObj.maceHead = enemyObj.mace.children[0];
  }
  if (isFrozenBandit) {
    // iceShell mesh is the last child in the group
    enemyObj.iceShell = group.children[group.children.length - 1];
    enemyObj.iceShellHp = 180;   // shell has its own HP pool
    enemyObj.iceShellMax = 180;
    enemyObj.shellBroken = false;
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
  head.position.set(2.4, -0.15, 0);
  mace.add(head);
}

function addGunToEnemy(group) {
  const gunGroup = new THREE.Group();
  gunGroup.name = "gun";

  // Barrel
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 3.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 })
  );
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0, 1.6);
  gunGroup.add(barrel);

  // Handle / Grip
  const grip = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.2, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.8 })
  );
  grip.position.set(0, -0.5, 0.1);
  grip.rotation.x = -0.4;
  gunGroup.add(grip);

  // Lock plate
  const lock = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.4, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.9, roughness: 0.3 })
  );
  lock.position.set(0.2, 0.15, 0.4);
  gunGroup.add(lock);

  // Position gun similarly to held weapons
  gunGroup.position.set(2.55, 4.7, -0.55);
  gunGroup.rotation.set(0, 0, -0.62);
  group.add(gunGroup);
  return gunGroup;
}

function createFlintlockTracer(position, direction) {
  const geometry = new THREE.SphereGeometry(0.4, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  scene.add(mesh);

  projectiles.push({
    mesh,
    direction: direction.clone(),
    speed: 150,
    damage: 20,
    age: 0,
    duration: 1.5,
    owner: "enemy",
    isBullet: true
  });
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

// ── 15-player-model.js ─ Player creation, human avatar model and stat points.
function createPlayer() {
  playerMesh = new THREE.Group();
  playerMesh.position.set(0, STARTER_SURFACE_Y + 0.15, 12); // just south of the flagpole
  playerMesh.userData.animation = { walkPhase: 0, attackTimer: 0, attackDuration: 0.22, attackImpact: 0 };
  scene.add(playerMesh);
  applyAvatarToPlayer();
}

// Body proportions from the studio sliders (percent values, 100 = default).
function getAvatarProportions(avatar) {
  const pct = (value, min, max) => THREE.MathUtils.clamp((value || 100) / 100, min, max);
  return {
    height: pct(avatar.height, 0.8, 1.3),
    width: pct(avatar.build, 0.75, 1.35),
    arm: pct(avatar.armLength, 0.75, 1.35),
    leg: pct(avatar.legLength, 0.75, 1.35),
    torso: pct(avatar.torsoLength, 0.8, 1.25),
    head: pct(avatar.headSize, 0.75, 1.35),
  };
}

// Builds a character: rounded torso, jointed limbs and a proper face.
// Part names and default joint positions (torso 5.7, head 8.65, shoulders 5.9,
// hips 2.45) are kept so every animation, NPC and enemy still lines up.
function createHumanAvatarModel(avatar, options = {}) {
  const showSword = options.showSword !== false;
  const showName = options.showName !== false;
  const group = new THREE.Group();
  group.userData.noSurface = true;
  const avatarParts = {};
  const prop = getAvatarProportions(avatar);
  const bodyType = avatar.bodyType || "human";
  const headStyle = avatar.headStyle || "normal";
  const accessory = avatar.accessory || (avatar.outfit !== "adventurer" ? "halo" : "none");
  const skeleton = bodyType === "skeleton";

  const std = (color, roughness = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra });
  const bone = std("#ece4cf", 0.65);
  const skin = skeleton ? bone : std(avatar.skin, 0.62);
  const hair = std(avatar.hair, 0.9);
  const torsoMat = std(avatar.torsoColor || avatar.shirt || "#1b85aa", 0.84);
  const shirt = torsoMat;
  const leftArmMat = std(avatar.leftArmColor || avatar.shirt || "#1b85aa", 0.84);
  const rightArmMat = std(avatar.rightArmColor || avatar.shirt || "#1b85aa", 0.84);
  const leftLegMat = std(avatar.leftLegColor || avatar.pants || "#26364f", 0.86);
  const rightLegMat = std(avatar.rightLegColor || avatar.pants || "#26364f", 0.86);
  const beltMat = std(avatar.beltColor || avatar.boots || "#23170f", 0.9);
  const bootsMat = std(avatar.boots || "#23170f", 0.75);
  const metal = std(0xc8d7df, 0.25, { metalness: 0.7 });
  const trim = std(avatar.outfit === "armor" ? 0xb8c1c7 : avatar.boots || "#23170f", 0.65);
  const leather = std("#5c3d21", 0.82);
  const darkLeather = std("#362a22", 0.88);
  const shade = (mesh) => { mesh.castShadow = true; return mesh; };

  // ---- Layout (all heights in model units; defaults reproduce the classic rig) ----
  const FOOT_Y = -1.56;
  const legLen = 3.8 * prop.leg;
  const hipY = FOOT_Y + legLen + 0.21;               // 2.45 at default
  const torsoH = 4.1 * prop.torso;
  const torsoY = hipY + 3.25 + (torsoH - 4.1) / 2;   // 5.7 at default
  const torsoTop = torsoY + torsoH / 2;              // 7.75 at default
  const shoulderY = torsoTop - 1.85;                 // 5.9 at default
  const headR = 1.25 * prop.head;
  const headY = torsoTop + 0.9 + (headR - 1.25) * 0.85; // 8.65 at default
  const armLen = 2.5 * prop.arm;
  // Torso-relative heights for things strapped to the body.
  const onTorso = (absoluteDefaultY) => (absoluteDefaultY - 5.7) * prop.torso;

  // ---- Torso: tapered chest with rounded shoulders (or a ribcage) ----
  let torso;
  if (skeleton) {
    torso = new THREE.Group();
    const spine = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, torsoH, 8), bone));
    torso.add(spine);
    for (let i = 0; i < 5; i += 1) {
      const rib = shade(new THREE.Mesh(new THREE.TorusGeometry(1.05 - i * 0.06, 0.11, 6, 20, Math.PI * 1.6), bone));
      rib.rotation.x = Math.PI / 2;
      rib.rotation.z = Math.PI * 0.7;
      rib.scale.set(1.25, 0.75, 1);
      rib.position.y = torsoH * 0.32 - i * 0.48 * prop.torso;
      torso.add(rib);
    }
    const collarbone = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.2, 6), bone));
    collarbone.rotation.z = Math.PI / 2;
    collarbone.position.y = torsoH / 2 - 0.25;
    torso.add(collarbone);
  } else {
    const profile = [
      [0.01, -0.5], [0.98, -0.5], [1.02, -0.36], [0.92, -0.12], [1.12, 0.12],
      [1.32, 0.3], [1.36, 0.4], [1.22, 0.47], [0.62, 0.5], [0.01, 0.5],
    ].map(([r, y]) => new THREE.Vector2(r, y * torsoH));
    torso = shade(new THREE.Mesh(new THREE.LatheGeometry(profile, 22), torsoMat));
    torso.scale.set(1.18, 1, 0.66);
    torso.userData.surfaceScale = true;
  }
  torso.position.y = torsoY;
  group.add(torso);
  // Children of the torso move with it (and aren't stretched by its x/z scale).
  const torsoAnchor = new THREE.Group();
  if (!skeleton) torsoAnchor.scale.set(1 / 1.18, 1, 1 / 0.66);
  torso.add(torsoAnchor);

  // Hips / pelvis
  const pelvis = shade(new THREE.Mesh(new THREE.SphereGeometry(1.0, 18, 12), skeleton ? bone : std(avatar.pants || "#26364f", 0.86)));
  pelvis.scale.set(skeleton ? 1.2 : 1.55, skeleton ? 0.55 : 0.62, skeleton ? 0.8 : 0.95);
  pelvis.position.y = hipY + 0.55;
  group.add(pelvis);

  if (!skeleton && avatar.outfit === "coat") {
    const coatProfile = [[1.0, 0.5], [1.12, 0.1], [1.28, -0.4], [1.42, -0.62]].map(([r, y]) => new THREE.Vector2(r, y * 5.4));
    const coat = shade(new THREE.Mesh(new THREE.LatheGeometry(coatProfile, 22, 0, Math.PI * 2), std(avatar.torsoColor || avatar.shirt || "#1b85aa", 0.84, { side: THREE.DoubleSide })));
    coat.scale.set(1.2, 1, 0.72);
    coat.position.y = onTorso(5.0) - 0.1;
    torsoAnchor.add(coat);
  }
  if (!skeleton && avatar.outfit === "armor") {
    const plate = shade(new THREE.Mesh(new THREE.SphereGeometry(1.0, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), trim));
    plate.scale.set(1.55, 1.25, 0.6);
    plate.rotation.x = -Math.PI / 2;
    plate.position.set(0, onTorso(6.15), 0.62);
    torsoAnchor.add(plate);
  }

  // ---- Neck & head ----
  const neck = shade(new THREE.Mesh(new THREE.CylinderGeometry(skeleton ? 0.2 : 0.42, skeleton ? 0.22 : 0.5, 0.7, 12), skin));
  neck.position.y = torsoTop + 0.2;
  group.add(neck);

  const head = new THREE.Group(); // pivot at the head centre; scaled by head size
  head.position.y = headY;
  head.scale.setScalar(prop.head);
  head.userData = { isHead: true };
  group.add(head);
  const eyesList = [];

  if (skeleton) {
    const skull = shade(new THREE.Mesh(new THREE.SphereGeometry(1.2, 22, 16), bone));
    skull.scale.set(0.95, 1.0, 1.02);
    head.add(skull);
    const jaw = shade(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 1.1), bone));
    jaw.position.set(0, -0.95, 0.35);
    head.add(jaw);
    const socketMat = std("#14110e", 0.9);
    [-0.42, 0.42].forEach((x) => {
      const socket = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), socketMat);
      socket.scale.set(1, 1.1, 0.5);
      socket.position.set(x, 0.1, 1.02);
      head.add(socket);
      eyesList.push(socket);
    });
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 3), socketMat);
    nose.rotation.x = Math.PI;
    nose.position.set(0, -0.3, 1.12);
    head.add(nose);
    for (let i = -2; i <= 2; i += 1) {
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.06), bone);
      tooth.position.set(i * 0.17, -0.68, 1.08);
      head.add(tooth);
    }
  } else {
    const face = shade(new THREE.Mesh(new THREE.SphereGeometry(1.25, 28, 20), skin));
    face.scale.set(0.93, 1.08, 0.98);
    head.add(face);
    const jaw = shade(new THREE.Mesh(new THREE.SphereGeometry(0.85, 18, 12), skin));
    jaw.scale.set(1.05, 0.7, 0.95);
    jaw.position.set(0, -0.68, 0.2);
    head.add(jaw);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), skin);
    nose.scale.set(0.8, 1, 1.15);
    nose.position.set(0, -0.3, 1.2);
    head.add(nose);
    [-1, 1].forEach((side) => {
      const ear = shade(new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), skin));
      ear.scale.set(0.45, 1, 0.7);
      ear.position.set(side * 1.15, -0.15, 0);
      head.add(ear);
    });
    const white = std("#f6f3ec", 0.35);
    const iris = std(avatar.eyes || "#101820", 0.3);
    [-0.42, 0.42].forEach((x) => {
      const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), white);
      eyeWhite.scale.set(1, 0.8, 0.6);
      eyeWhite.position.set(x, -0.06, 1.05);
      head.add(eyeWhite);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), iris);
      pupil.position.set(x, -0.06, 1.15);
      head.add(pupil);
      eyesList.push(eyeWhite);
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.12), hair);
      brow.position.set(x, 0.17, 1.15);
      brow.rotation.z = x < 0 ? -0.1 : 0.1;
      head.add(brow);
    });
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 8, 16, Math.PI * 0.75), std("#7a2f34", 0.6));
    mouth.position.set(0, -0.68, 1.08);
    mouth.rotation.set(0.15, 0, Math.PI * 1.12);
    head.add(mouth);

    // Hair is authored around a head centred at y = 8.65, so offset it into head space.
    const hairGroup = new THREE.Group();
    hairGroup.position.y = -8.65;
    addHair(hairGroup, avatar.hairStyle || "short", hair);
    head.add(hairGroup);
  }

  if (options.bandanaColor) {
    const bandana = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.26, 12, 28), std(options.bandanaColor, 0.74));
    bandana.position.y = 0.4;
    bandana.rotation.x = Math.PI / 2;
    head.add(bandana);
  }

  // Headless: hide the head entirely, cap the neck.
  if (headStyle === "headless") {
    head.visible = false;
    const cap = new THREE.Mesh(new THREE.CircleGeometry(skeleton ? 0.2 : 0.42, 14), std("#5a1a1e", 0.7));
    cap.rotation.x = -Math.PI / 2;
    cap.position.y = torsoTop + 0.56;
    group.add(cap);
  }

  if (!skeleton) {
    const collar = shade(new THREE.Mesh(
      avatar.outfit === "adventurer" ? new THREE.CylinderGeometry(0.62, 0.68, 0.45, 14, 1, true) : new THREE.TorusGeometry(0.6, 0.13, 8, 18),
      avatar.outfit === "adventurer" ? leather : shirt,
    ));
    if (avatar.outfit !== "adventurer") collar.rotation.x = Math.PI / 2;
    collar.position.y = torsoTop + (avatar.outfit === "adventurer" ? 0.05 : -0.05);
    group.add(collar);
  }

  // ---- Limbs: shoulder/hip pivot groups, with elbow/knee joints ----
  const makeArm = (side, sleeveMat) => {
    const arm = new THREE.Group();
    arm.position.set(side * 2.25, shoulderY, 0);
    arm.rotation.z = side * 0.15;
    const r = skeleton ? 0.16 : 0.45;
    const upperLen = armLen * 0.55;
    const lowerLen = armLen * 0.45;
    const shoulder = shade(new THREE.Mesh(new THREE.SphereGeometry(skeleton ? 0.3 : 0.52, 14, 10), skeleton ? bone : sleeveMat));
    shoulder.scale.set(1, 0.85, 1);
    shoulder.position.set(-side * 0.12, -0.05, 0);
    arm.add(shoulder);
    const upper = shade(new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.88, upperLen, 12), skeleton ? bone : sleeveMat));
    upper.position.y = -upperLen / 2;
    arm.add(upper);
    const elbow = shade(new THREE.Mesh(new THREE.SphereGeometry(r * (skeleton ? 1.5 : 0.9), 12, 8), skeleton ? bone : skin));
    elbow.position.y = -upperLen;
    arm.add(elbow);
    const lower = shade(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r * 0.7, lowerLen, 12), skin));
    lower.position.y = -upperLen - lowerLen / 2;
    arm.add(lower);
    // Hand: palm with fingers and a thumb (pivot at the wrist like before).
    const hand = new THREE.Group();
    hand.position.y = -armLen - 0.25 * prop.arm;
    const palm = shade(new THREE.Mesh(new THREE.BoxGeometry(skeleton ? 0.4 : 0.5, 0.55, 0.26), skin));
    hand.add(palm);
    const fingers = shade(new THREE.Mesh(new THREE.BoxGeometry(skeleton ? 0.36 : 0.46, 0.34, 0.22), skin));
    fingers.position.set(0, -0.42, 0.04);
    fingers.rotation.x = 0.35;
    hand.add(fingers);
    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.32, 6), skin);
    thumb.position.set(-side * 0.28, -0.1, 0.12);
    thumb.rotation.z = side * 0.6;
    hand.add(thumb);
    arm.add(hand);
    group.add(arm);
    return { arm, hand };
  };
  const makeLeg = (side, legMat) => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.85, hipY, 0);
    leg.rotation.z = -side * 0.04;
    const r = skeleton ? 0.2 : 0.58;
    const thighLen = legLen * 0.52;
    const shinLen = legLen * 0.48;
    const thigh = shade(new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.82, thighLen, 12), skeleton ? bone : legMat));
    thigh.position.y = -thighLen / 2;
    leg.add(thigh);
    const knee = shade(new THREE.Mesh(new THREE.SphereGeometry(r * (skeleton ? 1.5 : 0.86), 12, 8), skeleton ? bone : legMat));
    knee.position.y = -thighLen;
    leg.add(knee);
    const shin = shade(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.8, r * 0.66, shinLen, 12), skeleton ? bone : legMat));
    shin.position.y = -thighLen - shinLen / 2;
    leg.add(shin);
    // Rounded boot (or a bony foot).
    const foot = shade(new THREE.Mesh(new THREE.SphereGeometry(0.62, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), skeleton ? bone : bootsMat));
    foot.scale.set(skeleton ? 0.7 : 0.92, 0.75, 1.3);
    foot.position.set(0, -legLen - 0.2, 0.2);
    leg.add(foot);
    const sole = new THREE.Mesh(new THREE.BoxGeometry(skeleton ? 0.75 : 1.05, 0.16, 1.55), skeleton ? bone : darkLeather);
    sole.position.set(0, -legLen - 0.17, 0.2);
    leg.add(sole);
    if (!skeleton) {
      const cuff = shade(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.78, r * 0.78, 0.32, 12), trim));
      cuff.position.y = -legLen + 0.25;
      leg.add(cuff);
    }
    group.add(leg);
    return leg;
  };
  const { arm: leftArm, hand: leftHand } = makeArm(-1, leftArmMat);
  const { arm: rightArm, hand: rightHand } = makeArm(1, rightArmMat);
  const leftLeg = makeLeg(-1, leftLegMat);
  const rightLeg = makeLeg(1, rightLegMat);

  if (!skeleton && avatar.outfit === "armor") {
    [leftArm, rightArm].forEach((arm) => {
      const pad = shade(new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), trim));
      pad.position.y = 0.15;
      arm.add(pad);
      const gauntlet = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 0.95, 12), trim));
      gauntlet.position.y = -armLen * 0.78;
      arm.add(gauntlet);
    });
  }

  // Belt sits on the hips.
  if (!skeleton) {
    const belt = shade(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.38, 20), beltMat));
    belt.scale.set(1.3, 1, 0.78);
    belt.position.y = hipY + 1.25;
    group.add(belt);
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.34, 0.1), metal);
    buckle.position.set(0, hipY + 1.25, 0.95);
    group.add(buckle);
  }

  if (!skeleton && avatar.outfit === "adventurer") {
    const strap = (x) => {
      const s2 = shade(new THREE.Mesh(new THREE.BoxGeometry(0.34, torsoH, 0.06), leather));
      s2.position.set(x, 0, 0.98);
      torsoAnchor.add(s2);
      const back = s2.clone();
      back.position.z = -0.98;
      torsoAnchor.add(back);
    };
    strap(-0.82);
    strap(0.82);
    [-0.82, 0.82].forEach((x) => {
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.24, 0.1), metal);
      buckle.position.set(x, onTorso(6.8), 1.02);
      torsoAnchor.add(buckle);
    });
    const backpack = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 3.2, 12), leather));
    backpack.position.set(0, onTorso(5.9), -1.35);
    backpack.rotation.z = Math.PI / 2;
    torsoAnchor.add(backpack);
    const pouch = shade(new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.9, 0.5), leather));
    pouch.position.set(1.62, hipY + 1.05, 0.38);
    pouch.rotation.y = 0.25;
    group.add(pouch);
    const satchel = shade(new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.6), leather));
    satchel.position.set(-1.62, hipY + 0.95, 0.22);
    satchel.rotation.y = -0.25;
    group.add(satchel);
    [leftHand, rightHand].forEach((hand) => {
      const glove = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.42, 12), darkLeather));
      glove.position.y = 0.32;
      hand.add(glove);
    });
    [leftLeg, rightLeg].forEach((leg) => {
      const pad = shade(new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), darkLeather));
      pad.scale.set(1, 1, 0.55);
      pad.position.set(0, -legLen * 0.52, 0.45);
      leg.add(pad);
    });
    // Wooden staff with glowing runes, held in the left hand.
    const staff = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 7.8, 8), leather));
    staff.position.set(0, armLen * 0.72 - 2.2, 0.45);
    leftArm.add(staff);
    const horn = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.11, 8, 16, Math.PI * 0.72), leather);
    horn.position.set(0, 4.0, 0.15);
    horn.rotation.x = Math.PI / 2;
    staff.add(horn);
    const runeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    [3.0, 2.6, 2.2].forEach((y) => {
      const rune = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.06), runeMat);
      rune.position.set(0, y, 0.16);
      staff.add(rune);
    });
  }

  // ---- Accessories ----
  let halo;
  if (accessory === "halo") {
    halo = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.12, 8, 24), new THREE.MeshBasicMaterial({ color: 0xffd700 }));
    halo.position.set(0, headY + 1.95 * prop.head, 0);
    halo.rotation.x = Math.PI / 2;
    group.add(halo);
  }
  let spectralHands;
  if (accessory === "spectral-hands") {
    // Two floating, glowing hands that drift beside the shoulders.
    spectralHands = new THREE.Group();
    const glow = new THREE.MeshStandardMaterial({ color: 0xbfe9ff, emissive: 0x58b8ff, emissiveIntensity: 1.2, transparent: true, opacity: 0.78, roughness: 0.3 });
    [-1, 1].forEach((side) => {
      const ghost = new THREE.Group();
      const palm = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.25, 0.32), glow);
      ghost.add(palm);
      for (let f = 0; f < 4; f += 1) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.75, 6), glow);
        finger.position.set(-0.39 + f * 0.26, 0.95, 0);
        ghost.add(finger);
      }
      const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.6, 6), glow);
      thumb.position.set(side * -0.68, 0.2, 0);
      thumb.rotation.z = side * 0.9;
      ghost.add(thumb);
      ghost.position.set(side * 3.6, shoulderY + 1.6, -0.6);
      ghost.rotation.z = side * -0.25;
      ghost.userData.side = side;
      spectralHands.add(ghost);
    });
    group.add(spectralHands);
  }

  // ---- Cape (hangs from the shoulders and moves with the torso) ----
  let cape;
  const capeStyle = avatar.capeStyle || (avatar.outfit !== "adventurer" ? "normal" : "none");
  if (capeStyle !== "none") {
    const capeMat = std(avatar.capeColor || avatar.shirt || "#a82020", 0.85, { metalness: 0.1, side: THREE.DoubleSide });
    const len = capeStyle === "long" ? 6.2 : capeStyle === "torn" ? 4.8 : 5.0;
    const capeGeo = new THREE.PlaneGeometry(capeStyle === "long" ? 3.0 : 2.8, len, 6, 8);
    // Gentle curve around the back.
    const pos = capeGeo.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      pos.setZ(i, -Math.pow(x / 1.5, 2) * 0.35);
      if (capeStyle === "torn" && pos.getY(i) < -len * 0.3) pos.setY(i, pos.getY(i) + Math.abs(Math.sin(x * 4)) * 0.9);
    }
    capeGeo.computeVertexNormals();
    const capeCloth = shade(new THREE.Mesh(capeGeo, capeMat));
    capeCloth.position.y = -len / 2;
    // Pivot at the shoulders so the animation swings it from the top.
    cape = new THREE.Group();
    cape.position.set(0, torsoH / 2 - 0.25, -0.95);
    cape.rotation.x = 0.12;
    cape.add(capeCloth);
    torsoAnchor.add(cape);
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
  if (spectralHands) avatarParts.spectralHands = spectralHands;
  group.userData.parts = avatarParts;
  group.userData.eyesList = eyesList;
  // Resting heights the animation system bobs around.
  group.userData.rest = { torsoY, headY, haloY: halo ? halo.position.y : 0 };

  if (showSword) {
    const swordGroup = new THREE.Group();
    swordGroup.name = "swordGroup";
    const sword = shade(new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 0.22), metal));
    sword.position.set(2.55, onTorso(4.7), -1.05);
    sword.rotation.z = -0.62;
    swordGroup.add(sword);
    const swordHandle = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.22), std(0x5b351e, 0.75));
    swordHandle.position.set(1.35, onTorso(6.1), -1.05);
    swordHandle.rotation.z = -0.62;
    swordGroup.add(swordHandle);
    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), metal);
    pommel.position.set(1.1, onTorso(5.2), -1.05);
    swordGroup.add(pommel);
    torsoAnchor.add(swordGroup);
  }

  if (showName) {
    const nameLabel = makeLabel(avatar.name, 0.95);
    nameLabel.position.y = headY + 2.55 * prop.head;
    group.add(nameLabel);
  }

  group.scale.set(prop.width, prop.height, prop.width);
  compactAvatarModel(group);
  avatarModels.add(group);
  return group;
}

// Every character model (player, NPCs, enemies), for blinking and distance culling.
const avatarModels = new Set();

// Pieces that move together are merged into one mesh per material, so each
// character costs ~25 draw calls instead of ~60. Moving parts (arms, legs, head,
// torso, cape, halo, spectral hands, sword) stay separate, as do blinking eyes.
function compactAvatarModel(group) {
  const parts = group.userData.parts || {};
  const boundaries = new Set([group]);
  Object.values(parts).forEach((part) => part && boundaries.add(part));
  if (parts.spectralHands) parts.spectralHands.children.forEach((ghost) => boundaries.add(ghost));
  const sword = group.getObjectByName("swordGroup");
  if (sword) boundaries.add(sword);
  const keep = new Set(group.userData.eyesList || []);
  group.updateMatrixWorld(true);

  const buckets = new Map();
  group.traverse((mesh) => {
    if (!mesh.isMesh || boundaries.has(mesh) || keep.has(mesh) || Array.isArray(mesh.material)) return;
    let owner = mesh.parent;
    while (owner && !boundaries.has(owner)) owner = owner.parent;
    if (!owner) return;
    const key = `${owner.uuid}|${mesh.material.uuid}|${mesh.castShadow ? 1 : 0}`;
    if (!buckets.has(key)) buckets.set(key, { owner, material: mesh.material, cast: mesh.castShadow, items: [] });
    buckets.get(key).items.push(mesh);
  });

  const inverse = new THREE.Matrix4();
  buckets.forEach(({ owner, material, cast, items }) => {
    if (items.length < 2) return;
    inverse.copy(owner.matrixWorld).invert();
    const geometries = items.map((mesh) => {
      const g = mesh.geometry.clone();
      g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld));
      return g;
    });
    const merged = new THREE.Mesh(mergeForBatch(geometries), material);
    merged.castShadow = cast;
    owner.add(merged);
    items.forEach((mesh) => mesh.parent.remove(mesh));
  });
}

// Hides characters too far away to see (they're a few pixels tall) and keeps
// the rest visible. Runs a few times a second.
const AVATAR_VISIBLE_RANGE = 650;
let avatarLodTimer = 0;
const avatarLodPos = new THREE.Vector3();
function updateAvatarLod(dt) {
  avatarLodTimer -= dt;
  if (avatarLodTimer > 0 || !playerMesh) return;
  avatarLodTimer = 0.3;
  const px = playerMesh.position.x;
  const pz = playerMesh.position.z;
  avatarModels.forEach((model) => {
    if (!model.parent) {
      // Replaced (e.g. the player changed avatar): forget it once it's out of the scene.
      if (!model.userData.lodSeen) avatarModels.delete(model);
      model.userData.lodSeen = false;
      return;
    }
    model.userData.lodSeen = true;
    model.getWorldPosition(avatarLodPos);
    model.visible = Math.hypot(avatarLodPos.x - px, avatarLodPos.z - pz) < AVATAR_VISIBLE_RANGE;
  });
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
  saveGame();
}

function updateDerivedStats(avatar = getSelectedAvatar()) {
  const oldMax = player.maxHealth;
  const traits = getAvatarTraits(avatar);
  player.maxHealth = Math.round((100 + player.stats.defense * 20) * traits.healthMultiplier);
  player.health = Math.min(player.maxHealth, player.health + Math.max(0, player.maxHealth - oldMax));
  player.maxStamina = Math.round(100 * clamp(traits.speedMultiplier + traits.healthMultiplier * 0.2, 0.82, 1.28));
  player.stamina = Math.min(player.stamina, player.maxStamina);
}

// ── 16-game-loop-and-movement.js ─ Main loop, player movement, swimming, collisions, animation and mobility skills.
function loop(time) {
  const loopStart = performance.now();
  const dt = Math.min(0.033, (time - (loop.lastTime || time)) / 1000);
  loop.lastTime = time;
  const stepDt = hitStopTimer > 0 ? dt * 0.12 : dt;
  hitStopTimer = Math.max(0, hitStopTimer - dt);

  if (gameStarted) {
    // Day -> sunset -> night -> sunrise, 10 minutes each (see DAY_CYCLE).
    advanceDayCycle(stepDt);
    updateDayNightLighting(stepDt);
    updateWindGrass(stepDt);
    updateAvatarLod(stepDt);
    updateWindmills(stepDt);
    updateWeather(stepDt);

    updatePlayer(stepDt);
    updateEnemies(stepDt);
    updateObservationVision(stepDt);
    updateHazards(stepDt);
    updateProjectiles(stepDt);
    updateCombatEffects(stepDt);
    updateInteractionPrompt();
    updateTeleport(stepDt);
    updateCamera();
    updateMultiplayer(stepDt, time);
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
  // Update realistic graphics elements
  if (oceanUniforms) {
    oceanUniforms.uTime.value = time * 0.001;
    if (sun) {
      oceanUniforms.uSunDir.value.copy(sun.position).sub(sun.target.position).normalize();
    }
  }
  if (skyDome) {
    skyDome.mesh.position.copy(camera.position);
  }
  if (cloudDeck) {
    cloudDeck.children.forEach((c) => {
      c.position.x += stepDt * 2.8 * (c.userData.speed || 1);
      if (c.position.x > 7500) c.position.x = -7500;
    });
  }
  if (ambientAtmosphere && typeof playerMesh !== "undefined" && playerMesh) {
    ambientAtmosphere.position.lerp(playerMesh.position, 0.12);
    const posArr = ambientAtmosphere.geometry.attributes.position.array;
    const phases = ambientAtmosphere.userData.phases;
    for (let i = 0; i < phases.length; i++) {
      posArr[i * 3 + 1] += Math.sin(time * 0.0012 + phases[i]) * 0.02;
    }
    ambientAtmosphere.geometry.attributes.position.needsUpdate = true;
  }
  
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
  // Only character models have eyes; no need to walk the whole scene.
  avatarModels.forEach((node) => {
    if (node.visible && node.userData.eyesList && node.userData.eyesList.length) {
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
            if (eye.userData.openScaleY === undefined) eye.userData.openScaleY = eye.scale.y;
            eye.scale.y = 0.001;
          });
        } else {
          node.userData.isBlinking = false;
          node.userData.blinkTimer = 2.5 + Math.random() * 3.5; // next blink delay
          node.userData.eyesList.forEach((eye) => {
            eye.scale.y = eye.userData.openScaleY ?? 1.0;
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

  if (animatedFoliage.length > 0) {
    const wind = time * 0.0018;
    for (let i = 0; i < animatedFoliage.length; i++) {
      const fol = animatedFoliage[i];
      fol.mesh.rotation.z = fol.baseRotZ + Math.sin(wind + fol.phase) * 0.042;
    }
  }
}

function updatePlayer(dt) {
  if (player.health <= 0) {
    player.lastMoveSpeed = 0;
    return;
  }
  
  if (player.stunTimer > 0) {
    playerMoveState.velocity.set(0, 0, 0);
    player.stunTimer = Math.max(0, player.stunTimer - dt);
    player.lastMoveSpeed = 0;
    player.isBlocking = false;
    
    updateStamina(dt, false);
    updatePlayerAnimation(dt);
    
    const island = getIslandUnderPlayer();
    if (!island) {
      updateSwimming(dt);
      verticalVelocity = 0;
      jumpOffset = 0;
    } else {
      player.isSwimming = false;
      player.oxygen = Math.min(100, player.oxygen + dt * 18);
      playerMesh.position.y = getIslandSurfaceHeightAt(playerMesh.position.x, playerMesh.position.z, island) + 0.15;
      updateJump(dt);
    }
    
    attackCooldown = Math.max(0, attackCooldown - dt);
    wallHitCooldown = Math.max(0, wallHitCooldown - dt);
    player.dashCooldown = Math.max(0, player.dashCooldown - dt);
    
    if (player.knockedDown) {
      playerMesh.rotation.z = Math.PI / 2;
    } else {
      playerMesh.rotation.z = 0;
    }
    return;
  } else {
    if (player.knockedDown) {
      player.knockedDown = false;
      playerMesh.rotation.z = 0;
    }
  }

  if (player.isGodMode) {
    player.health = player.maxHealth;
    player.stamina = player.maxStamina;
  }
  if (isHelming) {
    playerMoveState.velocity.set(0, 0, 0);
    updateBoat(dt);
    return;
  }

  // Continuous attacks when holding Left Mouse Button or KeyR
  if ((isLeftMouseDown || keys.has("KeyR")) && attackCooldown <= 0) {
    if (player.weapon === "melee" || player.weapon === "sword") {
      attack({ clientX: mouseScreenPos.x, clientY: mouseScreenPos.y });
    }
  }

  // Active parry Iron Bastion heal
  if (player.isBlocking && player.mastery.defense >= 20) {
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

  // Smoothed movement: ramp up/down instead of snapping, with less control in the air.
  const moveVelocity = playerMoveState.velocity;
  const grounded = isGrounded && jumpOffset <= 0.05;
  if (input.lengthSq() > 0) {
    input.normalize();
    const forward = new THREE.Vector3(Math.sin(cameraYaw), 0, Math.cos(cameraYaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    const move = forward.multiplyScalar(input.z).add(right.multiplyScalar(input.x)).normalize();
    const staminaFactor = player.stamina <= 1 && player.movementMode === "sprint" ? 0.78 : 1;
    const modeSpeed = player.movementMode === "sprint" ? 1.55 : 0.72;
    const swimSpeed = player.isSwimming ? 0.54 : 1;
    const speed = 95 * getAvatarTraits().speedMultiplier * modeSpeed * staminaFactor * swimSpeed;
    const accel = grounded ? 12 : 4.5;
    moveVelocity.lerp(move.multiplyScalar(speed), 1 - Math.exp(-accel * dt));
    // Turn toward the movement direction along the shortest arc.
    const targetYaw = Math.atan2(moveVelocity.x, moveVelocity.z);
    let turn = targetYaw - playerMesh.rotation.y;
    turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    playerMesh.rotation.y += turn * (1 - Math.exp(-16 * dt));
  } else {
    const decel = grounded ? 14 : 2.5;
    moveVelocity.multiplyScalar(Math.exp(-decel * dt));
    if (moveVelocity.lengthSq() < 0.5) moveVelocity.set(0, 0, 0);
  }

  if (moveVelocity.lengthSq() > 0) {
    playerMesh.position.addScaledVector(moveVelocity, dt);
    player.lastMoveSpeed = moveVelocity.length();
    resolveWallCollision(previousPosition);
    // Don't keep pushing into a wall after sliding along it.
    const actual = playerMesh.position.clone().sub(previousPosition).setY(0).divideScalar(Math.max(dt, 1e-4));
    if (actual.lengthSq() < moveVelocity.lengthSq()) moveVelocity.copy(actual);

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
  if (player.flashStepCooldown > 0) {
    player.flashStepCooldown = Math.max(0, player.flashStepCooldown - dt);
  }

  // Update Foresight dodge regeneration
  if (player.observationHaki && player.observationHaki.unlocked) {
    if (player.observationHaki.dodges < player.observationHaki.maxDodges) {
      player.observationHaki.regenTimer = (player.observationHaki.regenTimer || 0) + dt;
      if (player.observationHaki.regenTimer >= 4.0) {
        player.observationHaki.dodges = Math.min(player.observationHaki.maxDodges, player.observationHaki.dodges + 1);
        player.observationHaki.regenTimer = 0;
        if (player.observationHaki.active) {
          createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 11, 0)), `👁️ +1 Dodge (${player.observationHaki.dodges}/${player.observationHaki.maxDodges})`, "#3ce88a");
        }
      }
    }
  }

  // Update Inferno Kick timer and visual effects
  if (player.diableJambeTimer > 0) {
    player.diableJambeTimer = Math.max(0, player.diableJambeTimer - dt);
    if (player.diableJambeTimer <= 0) {
      player.diableJambeHits = 0;
      createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "🔥 Inferno Kick Extinguished", "#ff7700");
      log("🔥 Inferno Kick legs extinguished.");
    } else {
      if (Math.random() < 0.28) {
        const firePos = playerMesh.position.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          1 + Math.random() * 2,
          (Math.random() - 0.5) * 1.5
        ));
        const fireParticle = new THREE.Mesh(
          new THREE.SphereGeometry(0.3 + Math.random() * 0.4, 6, 4),
          new THREE.MeshBasicMaterial({ color: Math.random() < 0.5 ? 0xff4400 : 0xffaa00, transparent: true, opacity: 0.8 })
        );
        fireParticle.position.copy(firePos);
        scene.add(fireParticle);
        addTimedEffect(fireParticle, 0.35, (mesh, progress) => {
          mesh.position.y += 0.08;
          mesh.scale.setScalar(1 - progress);
          mesh.material.opacity = 0.8 * (1 - progress);
        });
      }
    }
  }
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

const PLAYER_COLLISION_RADIUS = 2.4;
const collisionContact = { depth: 0, nx: 0, nz: 0 };

// Exact overlap test between the player's body circle and one volume.
// Fills `out` with the push-out normal and depth; returns false when clear.
function measureCollision(volume, position, radius, out) {
  const px = position.x;
  const pz = position.z;
  const cx = volume.center.x;
  const cz = volume.center.z;
  const reach = volume.bound + radius;
  const ddx = px - cx;
  const ddz = pz - cz;
  if (volume.shape !== "segment" && ddx * ddx + ddz * ddz > reach * reach) return false;

  // Jumped high enough to clear it.
  if (volume.height !== Infinity && position.y - volume.center.y >= volume.height) return false;

  let dx;
  let dz;
  let limit = volume.radius + radius;
  if (volume.shape === "box") {
    // Into the box's local frame (inverse of rotation.y).
    const lx = ddx * volume.cos - ddz * volume.sin;
    const lz = ddx * volume.sin + ddz * volume.cos;
    const qx = Math.max(-volume.halfX, Math.min(volume.halfX, lx));
    const qz = Math.max(-volume.halfZ, Math.min(volume.halfZ, lz));
    let nlx = lx - qx;
    let nlz = lz - qz;
    let dist = Math.hypot(nlx, nlz);
    let depth;
    if (dist > 1e-4) {
      if (dist >= radius) return false;
      depth = radius - dist;
      nlx /= dist;
      nlz /= dist;
    } else {
      // Centre is inside the box: leave through the nearest face.
      const toX = volume.halfX - Math.abs(lx);
      const toZ = volume.halfZ - Math.abs(lz);
      if (toX < toZ) { nlx = Math.sign(lx) || 1; nlz = 0; depth = toX + radius; }
      else { nlx = 0; nlz = Math.sign(lz) || 1; depth = toZ + radius; }
    }
    out.nx = nlx * volume.cos + nlz * volume.sin;
    out.nz = -nlx * volume.sin + nlz * volume.cos;
    out.depth = depth;
    return true;
  }
  if (volume.shape === "segment") {
    const sx = volume.end.x - cx;
    const sz = volume.end.z - cz;
    const lenSq = sx * sx + sz * sz || 1;
    const t = Math.max(0, Math.min(1, (ddx * sx + ddz * sz) / lenSq));
    dx = px - (cx + sx * t);
    dz = pz - (cz + sz * t);
  } else {
    dx = ddx;
    dz = ddz;
  }
  const distSq = dx * dx + dz * dz;
  if (distSq >= limit * limit) return false;
  const dist = Math.sqrt(distSq);
  out.depth = limit - dist;
  if (dist > 1e-4) { out.nx = dx / dist; out.nz = dz / dist; }
  else { out.nx = 0; out.nz = 1; }
  return true;
}

function getWallCollision(position, radius = PLAYER_COLLISION_RADIUS) {
  for (const volume of collisionVolumes) {
    if (measureCollision(volume, position, radius, collisionContact)) return volume;
  }
  return null;
}

// Pushes the player out of every overlapping obstacle so they slide along walls
// instead of sticking. Head-on, fast impacts still bump (and can hurt when sprinting).
function resolveWallCollision(previousPosition) {
  const moveX = playerMesh.position.x - previousPosition.x;
  const moveZ = playerMesh.position.z - previousPosition.z;
  const moveLen = Math.hypot(moveX, moveZ);
  let hardest = null;
  let hardestFacing = 0;
  let hitNx = 0;
  let hitNz = 0;

  for (let pass = 0; pass < 4; pass += 1) {
    let moved = false;
    for (const volume of collisionVolumes) {
      if (!measureCollision(volume, playerMesh.position, PLAYER_COLLISION_RADIUS, collisionContact)) continue;
      playerMesh.position.x += collisionContact.nx * (collisionContact.depth + 0.01);
      playerMesh.position.z += collisionContact.nz * (collisionContact.depth + 0.01);
      moved = true;
      // How directly were we running into it? 1 = head-on, 0 = grazing.
      const facing = moveLen > 1e-4 ? -(moveX * collisionContact.nx + moveZ * collisionContact.nz) / moveLen : 0;
      if (facing > hardestFacing) {
        hardest = volume;
        hardestFacing = facing;
        hitNx = collisionContact.nx;
        hitNz = collisionContact.nz;
      }
    }
    if (!moved) break;
  }
  if (!hardest) return;

  const hitDirection = new THREE.Vector3(hitNx, 0, hitNz);
  const impactDamage = calculateImpactDamage({
    speed: player.lastMoveSpeed * hardestFacing,
    verticalVelocity: 0,
    material: hardest.material,
    toughness: hardest.toughness,
    baseDamage: hardest.damage ?? 10,
  });

  if (impactDamage > 0 && wallHitCooldown <= 0) {
    applyImpactDamage(impactDamage, playerMesh.position.clone(), hitDirection, hardest.label);
    wallHitCooldown = 0.75;
    updateHud();
    if (player.health <= 0) {
      killPlayer("crashing into a wall");
    }
  } else if (hardestFacing > 0.85 && player.lastMoveSpeed > 120 && wallHitCooldown <= 0) {
    // Sprinting straight into something: small bump, no message spam.
    triggerWallHitAnimation(hitDirection, hardest.label, false, false);
    wallHitCooldown = 0.6;
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
  triggerWallHitAnimation(direction, label, amount > 0, false);
  createFloatingText(position, `-${amount}`, "#ff6b4a");
  if (amount >= 18) {
    createDustCloud(position);
    log(`Major impact with ${label}: ${amount} damage.`);
  } else {
    log(`${label} impact: ${amount} damage.`);
  }
}

function triggerWallHitAnimation(direction, label, showDamage = true, announce = true) {
  const anim = playerMesh.userData.animation || {};
  anim.wallHitTimer = 0.28;
  anim.wallHitDuration = 0.28;
  anim.wallHitDirection = direction.clone();
  playerMesh.userData.animation = anim;
  createWallHitEffect(playerMesh.position.clone(), showDamage);
  if (announce && showDamage) log(`You crashed into ${label}.`);
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
  // Resting heights depend on the avatar's proportions (set by createHumanAvatarModel).
  const rest = model.userData.rest || { torsoY: 5.7, headY: 8.65, haloY: 10.6 };
  const anim = playerMesh.userData.animation || { walkPhase: 0, attackTimer: 0, attackDuration: 0.22 };
  const groundSpeed = playerMoveState.velocity.length();
  const moving = groundSpeed > 6 || ((keys.has("KeyW") || keys.has("KeyA") || keys.has("KeyS") || keys.has("KeyD")) && player.isSwimming);

  if (moving) {
    anim.walkPhase += dt * THREE.MathUtils.clamp(groundSpeed / 11, 3.5, 13);
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
    model.userData.parts.torso.position.y = rest.torsoY;
    model.userData.parts.head.position.y = rest.headY;

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
    const walkIntensity = moving ? THREE.MathUtils.clamp(groundSpeed / 75, 0.3, 1.15) : 0.08;
    const armSwing = Math.sin(anim.walkPhase + Math.PI) * 0.55 * walkIntensity;
    const legSwing = Math.sin(anim.walkPhase) * 1.1 * walkIntensity;
    const bodyBob = Math.sin(anim.walkPhase * 2) * 0.08 * walkIntensity;

    model.userData.parts.leftArm.rotation.x = -0.2 + armSwing;
    model.userData.parts.rightArm.rotation.x = -0.2 - armSwing;
    model.userData.parts.leftLeg.rotation.x = 0.1 + legSwing;
    model.userData.parts.rightLeg.rotation.x = 0.1 - legSwing;
    model.userData.parts.head.position.y = rest.headY + bodyBob * 0.6;
    model.userData.parts.torso.position.y = rest.torsoY + bodyBob;

    // Jump pose, blended in and out so it never pops.
    const airborne = !isGrounded && jumpOffset > 0.05;
    anim.air = THREE.MathUtils.lerp(anim.air || 0, airborne ? 1 : 0, 1 - Math.exp(-(airborne ? 14 : 18) * dt));
    if (anim.air > 0.01 && anim.slamTimer <= 0) {
      const w = anim.air;
      const rise = THREE.MathUtils.clamp(verticalVelocity / JUMP_VELOCITY, -1, 1); // 1 take-off, 0 apex, -1 falling
      const up = Math.max(0, rise);
      const down = Math.max(0, -rise);
      const parts = model.userData.parts;
      const mix = (from, to) => from + (to - from) * w;
      // Arms: thrust up on take-off, spread for balance while falling.
      parts.leftArm.rotation.x = mix(parts.leftArm.rotation.x, -2.3 * up - 1.1 * (1 - up) + 0.5 * down);
      parts.rightArm.rotation.x = mix(parts.rightArm.rotation.x, -1.9 * up - 0.9 * (1 - up) + 0.5 * down);
      parts.leftArm.rotation.z = mix(parts.leftArm.rotation.z, -0.35 - 0.75 * down);
      parts.rightArm.rotation.z = mix(parts.rightArm.rotation.z, 0.35 + 0.75 * down);
      // Legs: lead knee tucks on the way up, both reach for the ground coming down.
      parts.leftLeg.rotation.x = mix(parts.leftLeg.rotation.x, -1.05 * up - 0.35 * (1 - up) - 0.25 * down);
      parts.rightLeg.rotation.x = mix(parts.rightLeg.rotation.x, 0.45 * up + 0.1 * (1 - up) - 0.1 * down);
      parts.torso.rotation.x = mix(parts.torso.rotation.x, -0.12 * up + 0.1 * down);
    }

    // Landing: knees bend and the body dips.
    if (jumpState.landingTimer > 0) {
      const t = 1 - jumpState.landingTimer / 0.24;
      const dip = Math.sin(t * Math.PI) * jumpState.landingStrength;
      model.userData.parts.torso.position.y -= dip * 0.9;
      model.userData.parts.head.position.y -= dip * 0.9;
      model.userData.parts.leftLeg.rotation.x -= dip * 0.6;
      model.userData.parts.rightLeg.rotation.x -= dip * 0.5;
      model.userData.parts.leftArm.rotation.z -= dip * 0.4;
      model.userData.parts.rightArm.rotation.z += dip * 0.4;
    }

    if (anim.slamTimer > 0) {
      const slamProgress = 1 - anim.slamTimer / anim.slamDuration;
      if (slamProgress < 0.35) {
        const p = slamProgress / 0.35;
        model.userData.parts.leftArm.rotation.x = -0.2 + (-2.6 - (-0.2)) * p;
        model.userData.parts.rightArm.rotation.x = -0.2 + (-2.6 - (-0.2)) * p;
        model.userData.parts.torso.rotation.x = -0.3 * p;
        model.userData.parts.torso.position.y = rest.torsoY + 0.8 * p;
      } else {
        const p = (slamProgress - 0.35) / 0.65;
        const easeDown = Math.pow(p, 2.5);
        model.userData.parts.leftArm.rotation.x = -2.6 + (1.5 - (-2.6)) * easeDown;
        model.userData.parts.rightArm.rotation.x = -2.6 + (1.5 - (-2.6)) * easeDown;
        model.userData.parts.torso.rotation.x = -0.3 + (1.1 - (-0.3)) * easeDown;
        model.userData.parts.torso.position.y = (rest.torsoY + 0.8) + ((rest.torsoY - 2.5) - (rest.torsoY + 0.8)) * easeDown;
      }
    } else if (anim.punchChargeTimer > 0) {
      const chargeProgress = 1 - anim.punchChargeTimer / anim.punchChargeDuration;
      model.userData.parts.rightArm.rotation.x = -0.2 + (0.9 - (-0.2)) * chargeProgress;
      model.userData.parts.rightArm.rotation.y = 0.5 * chargeProgress;
      model.userData.parts.leftArm.rotation.x = -0.2 + (-1.4 - (-0.2)) * chargeProgress;
      model.userData.parts.torso.rotation.y = -0.45 * chargeProgress;
      model.userData.parts.torso.position.y = rest.torsoY - 0.5 * chargeProgress;
    } else {
      model.userData.parts.torso.rotation.x = 0;
      model.userData.parts.rightArm.rotation.y = 0;
      model.userData.parts.torso.rotation.y = 0;
    }
  }

  // Squash & stretch: stretch on take-off, squash on landing.
  if (!model.userData.baseScale) model.userData.baseScale = model.scale.clone();
  const base = model.userData.baseScale;
  let stretch = 0;
  if (!player.isSwimming) {
    if (jumpState.takeoffTimer > 0) stretch += Math.sin((1 - jumpState.takeoffTimer / 0.2) * Math.PI) * 0.12;
    if (jumpState.landingTimer > 0) stretch -= Math.sin((1 - jumpState.landingTimer / 0.24) * Math.PI) * 0.16 * jumpState.landingStrength;
  }
  model.scale.set(base.x * (1 - stretch * 0.5), base.y * (1 + stretch), base.z * (1 - stretch * 0.5));

  // Animate the bobbing/rotation of the halo
  if (model.userData.parts.halo) {
    model.userData.parts.halo.rotation.z += dt * 1.5;
    model.userData.parts.halo.position.y = rest.haloY + Math.sin(performance.now() * 0.003) * 0.15;
  }

  // Spectral hands drift and turn slowly beside the shoulders.
  if (model.userData.parts.spectralHands) {
    const t = performance.now() * 0.0015;
    model.userData.parts.spectralHands.children.forEach((ghost) => {
      const side = ghost.userData.side;
      if (ghost.userData.baseY === undefined) ghost.userData.baseY = ghost.position.y;
      ghost.position.y = ghost.userData.baseY + Math.sin(t * 2 + side) * 0.45;
      ghost.rotation.y = Math.sin(t + side) * 0.4;
    });
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

const playerMoveState = { velocity: new THREE.Vector3() };
const JUMP_VELOCITY = 60;
const JUMP_GRAVITY = 140;
const jumpState = { buffer: 0, held: false, takeoffTimer: 0, landingTimer: 0, landingStrength: 0, airTime: 0 };

// Pressing jump is remembered briefly, so a press just before landing still jumps.
function jump() {
  if (!gameStarted) return;
  jumpState.held = true;
  jumpState.buffer = 0.14;
  tryJump();
}

function tryJump() {
  if (!isGrounded || jumpOffset > 0.05 || player.isSwimming || player.stunTimer > 0) return false;
  verticalVelocity = JUMP_VELOCITY;
  isGrounded = false;
  jumpState.buffer = 0;
  jumpState.takeoffTimer = 0.2;
  jumpState.airTime = 0;
  if (playerMesh && player.lastMoveSpeed > 40) createFootstepDustEffect(playerMesh.position.clone());
  return true;
}

// Letting go early cuts the rise short for a small hop.
function releaseJump() {
  jumpState.held = false;
  if (verticalVelocity > 18) verticalVelocity *= 0.5;
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

function createFlashStepAfterimage(position) {
  const ghostGeo = new THREE.CylinderGeometry(1.6, 1.6, 7.5, 8);
  const ghostMat = new THREE.MeshBasicMaterial({
    color: 0x66ddff,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });
  const ghost = new THREE.Mesh(ghostGeo, ghostMat);
  ghost.position.copy(position).add(new THREE.Vector3(0, 3.75, 0));
  ghost.rotation.y = playerMesh.rotation.y;
  scene.add(ghost);
  addTimedEffect(ghost, 0.35, (mesh, progress) => {
    mesh.material.opacity = 0.75 * (1 - progress);
    mesh.scale.set(1 + progress * 0.4, 1, 1 + progress * 0.4);
  });

  // Speed sonic shockwave ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.18, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0x9defff, transparent: true, opacity: 0.85 })
  );
  ring.position.copy(position).add(new THREE.Vector3(0, 2.5, 0));
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  addTimedEffect(ring, 0.28, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 2.2);
    mesh.material.opacity = 0.85 * (1 - progress);
  });
}

function createEvasionGhost(position) {
  const ghostGeo = new THREE.CylinderGeometry(1.4, 1.4, 7, 8);
  const ghostMat = new THREE.MeshBasicMaterial({
    color: 0xff3344,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });
  const ghost = new THREE.Mesh(ghostGeo, ghostMat);
  ghost.position.copy(position).add(new THREE.Vector3(0, 3.5, 0));
  ghost.rotation.y = playerMesh.rotation.y;
  scene.add(ghost);
  addTimedEffect(ghost, 0.35, (mesh, progress) => {
    mesh.material.opacity = 0.7 * (1 - progress);
    mesh.scale.set(1 + progress * 0.5, 1, 1 + progress * 0.5);
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.16, 8, 28),
    new THREE.MeshBasicMaterial({ color: 0xff4455, transparent: true, opacity: 0.8 })
  );
  ring.position.copy(position).add(new THREE.Vector3(0, 2, 0));
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  addTimedEffect(ring, 0.25, (mesh, progress) => {
    mesh.scale.setScalar(1 + progress * 1.8);
    mesh.material.opacity = 0.8 * (1 - progress);
  });
}

function flashStep() {
  if (!gameStarted) return;
  if (!player.hasFlashStep) {
    log("⚡ Flash Step is locked! Train with the Flash Step Master in Snowy Village.");
    return;
  }
  if (player.flashStepCooldown > 0) {
    log(`Flash Step on cooldown (${player.flashStepCooldown.toFixed(1)}s).`);
    return;
  }
  if (player.stamina < 20) {
    log("Not enough stamina for Flash Step (requires 20 Energy)!");
    return;
  }

  player.stamina = Math.max(0, player.stamina - 20);
  player.flashStepCooldown = 2.8;

  const startPos = playerMesh.position.clone();
  createFlashStepAfterimage(startPos);
  audio.playFlashStep();

  // Raycast from camera using mouse screen coordinates
  const mouse = new THREE.Vector2(
    (mouseScreenPos.x / window.innerWidth) * 2 - 1,
    -(mouseScreenPos.y / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Intersect candidate objects in the scene (ignoring player and visual effects)
  const intersects = raycaster.intersectObjects(scene.children, true);
  let targetPoint = null;

  for (const hit of intersects) {
    let curr = hit.object;
    let ignore = false;
    while (curr) {
      if (curr === playerMesh) {
        ignore = true;
        break;
      }
      if (curr.userData && (curr.userData.isAfterimage || curr.userData.isEffect || curr.userData.isFloatingText || curr.userData.isParticle)) {
        ignore = true;
        break;
      }
      curr = curr.parent;
    }
    if (ignore) continue;
    if (hit.point) {
      targetPoint = hit.point.clone();
      break;
    }
  }

  // Fallback to ground plane at current player height if no direct mesh intersection
  if (!targetPoint) {
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -playerMesh.position.y);
    const planeIntersection = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(groundPlane, planeIntersection)) {
      const toHit = planeIntersection.clone().sub(camera.position);
      if (toHit.dot(raycaster.ray.direction) > 0) {
        targetPoint = planeIntersection;
      }
    }
  }

  const maxWarpDistance = 85;
  let finalTarget;

  if (targetPoint) {
    const delta = targetPoint.clone().sub(startPos);
    const horizontalDist = Math.hypot(delta.x, delta.z);
    if (horizontalDist > maxWarpDistance) {
      const ratio = maxWarpDistance / horizontalDist;
      finalTarget = new THREE.Vector3(
        startPos.x + delta.x * ratio,
        startPos.y + delta.y * ratio,
        startPos.z + delta.z * ratio
      );
    } else {
      finalTarget = targetPoint;
    }
  } else {
    // Ray pointing into sky without plane intersection: use ray forward horizontal vector
    const dir = raycaster.ray.direction.clone().setY(0);
    if (dir.lengthSq() < 0.001) {
      dir.set(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y));
    }
    dir.normalize();
    finalTarget = startPos.clone().addScaledVector(dir, maxWarpDistance);
  }

  // Rotate player to face the teleport direction
  const dx = finalTarget.x - startPos.x;
  const dz = finalTarget.z - startPos.z;
  if (dx * dx + dz * dz > 0.01) {
    playerMesh.rotation.y = Math.atan2(dx, dz);
  }

  // Set new player position
  playerMesh.position.x = finalTarget.x;
  playerMesh.position.z = finalTarget.z;

  // Resolve ground/elevation height
  const island = getIslandUnderPlayer();
  if (island) {
    const surfaceY = getIslandSurfaceHeightAt(playerMesh.position.x, playerMesh.position.z, island) + 0.15;
    if (finalTarget && finalTarget.y > surfaceY && finalTarget.y < surfaceY + 40) {
      playerMesh.position.y = finalTarget.y + 0.15;
    } else {
      playerMesh.position.y = surfaceY;
    }
  } else {
    playerMesh.position.y = OCEAN_SURFACE_Y + 0.75;
  }

  verticalVelocity = 0;
  jumpOffset = 0;

  resolveWallCollision(startPos);
  createFlashStepAfterimage(playerMesh.position.clone());
  createDustCloud(playerMesh.position.clone());
  createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "⚡ FLASH STEP!", "#9defff");
  log("⚡ Flash Step executed!");
}

function toggleObservationHaki() {
  if (!gameStarted) return;
  if (!player.observationHaki || !player.observationHaki.unlocked) {
    log("👁️ Foresight is locked! Learn it from the Foresight Master in Snowy Village (Level 80+).");
    return;
  }

  player.observationHaki.active = !player.observationHaki.active;
  if (player.observationHaki.active) {
    audio.playObservation();
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 12, 0)), "👁️ FORESIGHT: ON", "#ff4444");
    log(`👁️ Foresight activated! (${player.observationHaki.dodges}/${player.observationHaki.maxDodges} Dodges ready). Threats highlighted.`);
    
    // Spreading observation pulse
    const pulseRing = new THREE.Mesh(
      new THREE.TorusGeometry(8, 0.2, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.85 })
    );
    pulseRing.position.copy(playerMesh.position).add(new THREE.Vector3(0, 2, 0));
    pulseRing.rotation.x = Math.PI / 2;
    scene.add(pulseRing);
    addTimedEffect(pulseRing, 0.6, (mesh, progress) => {
      mesh.scale.setScalar(1 + progress * 14);
      mesh.material.opacity = 0.85 * (1 - progress);
    });
  } else {
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "Foresight: OFF", "#aaaaaa");
    log("👁️ Foresight deactivated.");
  }
}

function updateJump(dt) {
  jumpState.buffer = Math.max(0, jumpState.buffer - dt);
  jumpState.takeoffTimer = Math.max(0, jumpState.takeoffTimer - dt);
  jumpState.landingTimer = Math.max(0, jumpState.landingTimer - dt);
  if (jumpState.buffer > 0 && isGrounded && jumpOffset <= 0) tryJump();

  if (!isGrounded || jumpOffset > 0) {
    jumpState.airTime += dt;
    // Floatier near the top while held, heavier on the way down for a snappy arc.
    let gravity = JUMP_GRAVITY;
    if (verticalVelocity < 0) gravity *= 1.5;
    else if (jumpState.held && verticalVelocity < 14) gravity *= 0.65;
    verticalVelocity -= gravity * dt;
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
      // Landing squash scales with how hard we came down.
      const impact = Math.min(1, Math.abs(player.lastFallVelocity) / 95);
      if (jumpState.airTime > 0.12) {
        jumpState.landingStrength = 0.35 + impact * 0.65;
        jumpState.landingTimer = 0.24;
        createFootstepDustEffect(playerMesh.position.clone());
        if (impact > 0.75) createDustCloud(playerMesh.position.clone());
      }
      jumpOffset = 0;
      verticalVelocity = 0;
      player.lastFallVelocity = 0;
      isGrounded = true;
      jumpState.airTime = 0;
    }
  }
  playerMesh.position.y += jumpOffset;
}

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

// ── 18-camera-and-quests.js ─ Camera, interaction prompts and quest dialogue.
function updateCamera() {
  const targetYaw = isHelming ? boatYaw : (shiftLockEnabled ? playerMesh.rotation.y : cameraYaw);
  const isSniper = player.weapon === "gun" && player.mastery.gun >= 50 && player.lastMoveSpeed === 0;
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
    const targetPos = item.interactCenter || item.mesh.position;
    if (targetPos.distanceTo(playerMesh.position) < 22) {
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
    showQuestDialogue(nearbyInteractable.hubType);
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
    if (player.level < (nearbyInteractable.requiredLevel || 1)) {
      log(`You need to be level ${nearbyInteractable.requiredLevel || 1}+ to travel to ${nearbyInteractable.destIslandName || "this island"}.`);
      return;
    }
    playerMesh.position.copy(nearbyInteractable.destination);
    jumpOffset = 0;
    verticalVelocity = 0;
    isGrounded = true;
    createWallHitEffect(playerMesh.position.clone(), false);
    log(`Teleported to ${nearbyInteractable.destIslandName || "the island"}.`);
  } else if (nearbyInteractable.type === "menuTeleporter") {
    showTeleporterMenu();
  } else if (nearbyInteractable.type === "returnTeleporter") {
    playerMesh.position.copy(nearbyInteractable.destination);
    jumpOffset = 0;
    verticalVelocity = 0;
    isGrounded = true;
    createWallHitEffect(playerMesh.position.clone(), false);
    log("Returned to Starter Island.");
  } else if (nearbyInteractable.type === "junglePulseTrainer") {
    learnJunglePulse();
  } else if (nearbyInteractable.type === "flamingFeetShop") {
    showFlamingFeetShop();
  } else if (nearbyInteractable.type === "observationTrainer") {
    showObservationHakiDialog();
  } else if (nearbyInteractable.type === "flashStepTrainer") {
    showFlashStepDialog();
  }
}

function showQuestDialogue(hubType) {
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
  questOptions.innerHTML = "";

  let filteredQuests = [];
  if (hubType === "jungle") {
    dialogueTitle.textContent = "Jungle Quest Hub";
    dialogueDetail.textContent = "Only one major quest can be active. Pick a contract and preview its reward.";
    filteredQuests = [questCatalog.monkey10, questCatalog.gorilla15, questCatalog.gorillaKing20];
  } else if (hubType === "pirateTown") {
    dialogueTitle.textContent = "Pirate Town Quest Hub";
    dialogueDetail.textContent = "Only one major quest can be active. Pick a contract and preview its reward.";
    filteredQuests = [questCatalog.pirates30, questCatalog.brutes40, questCatalog.buggy50];
  } else if (hubType === "desert") {
    dialogueTitle.textContent = "Desert Quest Hub";
    dialogueDetail.textContent = "Only one major quest can be active. Pick a contract and preview its reward.";
    filteredQuests = [questCatalog.desertBandits60, questCatalog.desertOfficers70];
  } else if (hubType === "snowy") {
    dialogueTitle.textContent = "Snowy Village Quest Hub";
    dialogueDetail.textContent = "Only one major quest can be active. Pick a contract and preview its reward.";
    filteredQuests = [questCatalog.frozenBandits90, questCatalog.snowmen100, questCatalog.yeti110];
  } else {
    dialogueTitle.textContent = "Quest Hub";
    dialogueDetail.textContent = "Only one major quest can be active. Pick a contract and preview its reward.";
    filteredQuests = Object.values(questCatalog).filter(q => q.id !== "starter");
  }

  filteredQuests.forEach((entry) => {
    if (!entry) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quest-option";
    button.innerHTML = `<strong>${entry.title}</strong><span>Level ${entry.minLevel}+ | ${entry.detail}</span><small>Reward: $${entry.rewardMoney}, ${entry.rewardXp} XP</small>`;
    button.addEventListener("click", () => acceptMajorQuest(entry.id));
    questOptions.append(button);
  });

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "quest-option danger-button";
  closeBtn.style.background = "rgba(235, 94, 85, 0.15)";
  closeBtn.style.borderColor = "rgba(235, 94, 85, 0.3)";
  closeBtn.style.color = "#eb5e55";
  closeBtn.innerHTML = "<strong>Cancel</strong><span>Close menu</span>";
  closeBtn.addEventListener("click", () => {
    dialoguePanel.classList.add("hidden");
  });
  questOptions.append(closeBtn);
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
    log("You already know Iron Aura. Press H or use the Aura button to toggle it.");
    return;
  }
  if (player.level < 60) {
    log("The Aura Trainer refuses: reach level 60 before training.");
    return;
  }
  if (player.money < 3500) {
    log("Iron Aura training costs $3500.");
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
  log("Iron Aura Level 1 unlocked.");
  saveGame();
}

// ── 19-combat-and-effects.js ─ Attacks, projectiles, hazards and combat visual effects.
function attack(event = null) {
  if (!gameStarted || attackCooldown > 0 || player.weapon === "special") return;

  // Melee Ground Slam in Air!
  if (!isGrounded && jumpOffset > 0 && player.weapon === "melee" && player.mastery.melee >= 20) {
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
        damageEnemy(enemy, dmg, "GroundSlam", "#ffcf5a");
      }
    });
    attackCooldown = 0.5;
    return;
  }

  // Set attack cooldown
  const isGatling = player.weapon === "melee" && player.mastery.melee >= 50;
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
  const swordBonus = (player.weapon === "sword" && player.mastery.sword >= 5) ? 12 : 0;
  // Sniper Focus: Double gun range when standing still
  const isSniper = player.weapon === "gun" && player.mastery.gun >= 50 && player.lastMoveSpeed === 0;
  const gunRange = isSniper ? 170 : 85;

  const baseRange = (player.weapon === "gun" ? gunRange : (11 + swordBonus));
  const range = baseRange * traits.rangeMultiplier;

  let damage = getDamage();
  let isFalcon = false;

  // Meteor Fist: 15% chance for double damage + knockback
  if (player.weapon === "melee" && player.mastery.melee >= 5 && Math.random() < 0.15) {
    isFalcon = true;
    damage = Math.round(damage * 2.5);
  }

  // Inferno Kick multiplier
  const isDiableJambeActive = player.weapon === "melee" && player.diableJambeTimer > 0;
  if (isDiableJambeActive) {
    damage = Math.round(damage * 2.5);
  }

  let target = null;
  let isGunHeadshot = false;

  if (player.weapon === "gun") {
    // Raycast to find if we clicked or aimed directly at any enemy
    const clientX = event?.clientX ?? mouseScreenPos.x;
    const clientY = event?.clientY ?? mouseScreenPos.y;
    const mouse = new THREE.Vector2();
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    // Find all alive enemies in range
    const candidateEnemies = enemies.filter(enemy => enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) <= range);
    
    let bestHit = null;
    for (const enemy of candidateEnemies) {
      const intersects = raycaster.intersectObject(enemy.mesh, true);
      if (intersects.length > 0) {
        const dist = intersects[0].distance;
        if (bestHit === null || dist < bestHit.dist) {
          let isHead = false;
          for (let i = 0; i < intersects.length; i++) {
            let obj = intersects[i].object;
            while (obj) {
              if (obj.userData && obj.userData.isHead) {
                isHead = true;
                break;
              }
              obj = obj.parent;
            }
            if (isHead) break;
          }
          bestHit = { enemy, dist, isHead };
        }
      }
    }
    
    if (bestHit) {
      target = bestHit.enemy;
      isGunHeadshot = bestHit.isHead;
    }
  }

  // Fallback to closest enemy if no direct mouse-hit target
  if (!target) {
    target = enemies
      .filter((enemy) => enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) <= range)
      .sort((a, b) => a.mesh.position.distanceTo(playerMesh.position) - b.mesh.position.distanceTo(playerMesh.position))[0];
    isGunHeadshot = false;
  }

  if (playerMesh?.userData?.animation) {
    playerMesh.userData.animation.attackImpact = target ? 1 : 0.3;
  }
  
  if (player.weapon === "gun") {
    createGunShot(target, isGunHeadshot);
  } else {
    createCombatEffect(player.weapon, target);
  }

  // Sword Dimensional Blade: Fires giant air slash forward!
  if (player.weapon === "sword" && player.mastery.sword >= 50) {
    const dir = getAttackDirection(target);
    createAirSlash(playerMesh.position.clone().setY(playerMesh.position.y + 6), dir, { type: "player" });
  }

  // Gun Double Tap: Fires a second bullet quickly
  if (player.weapon === "gun" && player.mastery.gun >= 5) {
    setTimeout(() => {
      if (player.weapon === "gun") {
        audio.playShot();
        createGunShot(target, isGunHeadshot);
        if (target && target.alive) {
          const dmgDouble = Math.round(getDamage() * 0.85);
          damageEnemy(target, dmgDouble, "DoubleTap", "#9defff", isGunHeadshot);
        }
      }
    }, 110);
  }

  // Pulse Bubble repel for Special Mastery 50
  if (player.weapon === "special" && player.mastery.special >= 5) {
    enemies.forEach((enemy) => {
      if (enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) < 48) {
        const pushDir = enemy.mesh.position.clone().sub(playerMesh.position).setY(0).normalize();
        enemy.mesh.position.addScaledVector(pushDir, 28);
        const dmgBubble = Math.round(getDamage() * 0.4);
        damageEnemy(enemy, dmgBubble, "Pulse", "#a775ff");
      }
    });
  }

  if (!target) {
    log(`${weaponName()} attack missed.`);
    return;
  }

  // Grand Awakening: instantly vaporizes minor enemies below 20% health
  const isGrandAwakening = player.weapon === "special" && player.mastery.special >= 50;
  if (isGrandAwakening && target.health < target.maxHealth * 0.20) {
    createFloatingText(target.mesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "VAPORIZED!", "#a775ff");
    target.health = 0;
    defeatEnemy(target);
    player.health = Math.min(player.maxHealth, player.health + 50); // Heal 50 HP on direct vaporize
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 6, 0)), "+50 HP", "#7ce0b4");
    audio.playQuestComplete();
    return;
  }

  target.mesh.scale.setScalar(1.08);
  setTimeout(() => target.mesh.scale.setScalar(1), 90);

  if (isDiableJambeActive) {
    player.diableJambeHits = (player.diableJambeHits || 0) + 1;
    if (player.diableJambeHits >= 5) {
      player.diableJambeTimer = 0;
      player.diableJambeHits = 0;
      createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 10, 0)), "🔥 Inferno Kick Extinguished", "#ff7700");
      log("🔥 Inferno Kick legs extinguished after 5 strikes.");
    }
    createFireBurst(target.mesh.position.clone());
  }

  if (isFalcon) {
    const pushDir = target.mesh.position.clone().sub(playerMesh.position).setY(0).normalize();
    target.mesh.position.addScaledVector(pushDir, 35);
    const label = isDiableJambeActive ? "🔥 Inferno Meteor Fist" : "Meteor Fist";
    const color = isDiableJambeActive ? "#ff2200" : "#ff8a3d";
    damageEnemy(target, damage, label, color);
  } else {
    const label = isDiableJambeActive ? "🔥 Diable Strike" : weaponName();
    const color = isDiableJambeActive ? "#ff4400" : "#ff7a3d";
    damageEnemy(target, damage, label, color, player.weapon === "gun" ? isGunHeadshot : null);
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

function createFireBurst(position) {
  for (let i = 0; i < 16; i += 1) {
    const fire = new THREE.Mesh(
      new THREE.SphereGeometry(1.2 + (i % 3) * 0.6, 8, 6),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xff3300 : 0xffaa00, transparent: true, opacity: 0.85 }),
    );
    const angle = i * 2.3;
    const dir = new THREE.Vector3(Math.cos(angle), (Math.random() - 0.2) * 0.6, Math.sin(angle)).normalize();
    fire.position.copy(position);
    scene.add(fire);
    addTimedEffect(fire, 0.45, (mesh, progress, dt) => {
      mesh.position.addScaledVector(dir, dt * 48);
      mesh.scale.setScalar(1 + progress * 1.5);
      mesh.material.opacity = 0.85 * (1 - progress);
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

function createGunShot(target, isHeadshot = false) {
  const direction = getAttackDirection(target);
  const start = playerMesh.position.clone().add(direction.clone().multiplyScalar(5));
  start.y += 6;
  const end = target ? target.mesh.position.clone() : start.clone().add(direction.clone().multiplyScalar(80));
  end.y += target ? (isHeadshot ? 8.65 : 5.7) : 0;
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
                damageEnemy(e, projectile.damage, "Explosion", "#ff7a3d");
              }
            });
          } else {
            damageEnemy(enemy, projectile.damage, "Slash", "#3ce88a");
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
            damageEnemy(e, projectile.damage, "Explosion", "#ff7a3d");
          }
        });
      }
      scene.remove(projectile.mesh);
      projectiles.splice(i, 1);
    }
  }
}

const activeSurgeRocks = [];

function createGroundSurge(enemy) {
  if (!enemy || !enemy.mesh) return;
  const startPos = enemy.mesh.position.clone();
  const dir = playerMesh.position.clone().sub(startPos).setY(0).normalize();
  const numRocks = 8;
  const rockSpacing = 22;
  
  audio.playImpact();
  
  for (let i = 0; i < numRocks; i += 1) {
    setTimeout(() => {
      if (!enemy.alive) return;
      const rockPos = startPos.clone().addScaledVector(dir, i * rockSpacing);
      
      const island = islands.find(isl => {
        const dx = rockPos.x - isl.position.x;
        const dz = rockPos.z - isl.position.z;
        return Math.sqrt(dx * dx + dz * dz) <= isl.radius;
      });
      const groundY = island ? getIslandSurfaceHeightAt(rockPos.x, rockPos.z, island) : OCEAN_SURFACE_Y;
      rockPos.y = groundY;
      
      const rockGeo = new THREE.DodecahedronGeometry(6 + Math.random() * 3, 0);
      rockGeo.scale(1.1, 0.7 + Math.random() * 0.5, 0.9 + Math.random() * 0.3);
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0x4d4741,
        roughness: 0.96,
        flatShading: true
      });
      const rockMesh = new THREE.Mesh(rockGeo, rockMat);
      rockMesh.position.copy(rockPos).setY(groundY - 14);
      rockMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rockMesh.castShadow = true;
      rockMesh.receiveShadow = true;
      scene.add(rockMesh);
      
      createDustCloud(rockPos);
      
      activeSurgeRocks.push({
        mesh: rockMesh,
        startY: groundY - 14,
        peakY: groundY + 2.5 + Math.random() * 2,
        time: 0,
        duration: 1.6,
        hitDetected: false,
        pos: rockPos
      });
    }, i * 180);
  }
}

function updateSurgeRocks(dt) {
  for (let i = activeSurgeRocks.length - 1; i >= 0; i -= 1) {
    const rock = activeSurgeRocks[i];
    rock.time += dt;
    const t = rock.time / rock.duration;
    
    if (t < 0.22) {
      const p = t / 0.22;
      rock.mesh.position.y = rock.startY + (rock.peakY - rock.startY) * p;
      rock.mesh.scale.setScalar(p);
    } else if (t < 0.78) {
      rock.mesh.position.y = rock.peakY;
      rock.mesh.scale.setScalar(1);
    } else if (t < 1.0) {
      const p = (1.0 - t) / 0.22;
      rock.mesh.position.y = rock.startY + (rock.peakY - rock.startY) * p;
      rock.mesh.scale.setScalar(Math.max(0.001, p));
    } else {
      scene.remove(rock.mesh);
      rock.mesh.geometry.dispose();
      rock.mesh.material.dispose();
      activeSurgeRocks.splice(i, 1);
      continue;
    }
    
    if (!rock.hitDetected && rock.time < 1.1) {
      const dist = rock.mesh.position.distanceTo(playerMesh.position);
      if (dist < 18) {
        rock.hitDetected = true;
        damagePlayer(28, "Ground Surge");
        player.stunTimer = 0.8;
        verticalVelocity = 90;
        isGrounded = false;
        createDustCloud(playerMesh.position.clone());
      }
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
      damage: (enemy && enemy.type === "brute") ? 20 : (enemy && enemy.type === "gorilla_king") ? 24 : (enemy && enemy.type === "yeti") ? 32 : 28,
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
  const boss = enemies.find((enemy) => (enemy.type === "buggy" || enemy.type === "gorilla_king" || enemy.type === "yeti") && enemy.alive);
  const proximityRange = boss?.type === "yeti" ? 350 : 260;
  if (!boss || boss.mesh.position.distanceTo(playerMesh.position) > proximityRange) {
    bossBar?.classList.add("hidden");
    return;
  }
  bossBar?.classList.remove("hidden");
  let bossDisplayName = "Boss";
  if (boss.type === "buggy") bossDisplayName = "Captain Jester Captain";
  else if (boss.type === "gorilla_king") bossDisplayName = "Gorilla King";
  else if (boss.type === "yeti") bossDisplayName = "The Yeti";
  if (bossName) bossName.textContent = bossDisplayName;
  if (bossHealthBar) bossHealthBar.style.width = `${Math.max(0, (boss.health / boss.maxHealth) * 100)}%`;
}

// ── 20-rewards-and-hud.js ─ Damage formulas, enemy defeat rewards, quests, XP and HUD updates.

function getDamage() {
  const traits = getAvatarTraits();
  const hakiBonus = player.haki.active ? 1 + player.haki.level * 0.12 : 1;
  const masteryXp = player.masteryXp ? (player.masteryXp[player.weapon] || 0) : 0;
  const masteryBonus = Math.pow(1.001, masteryXp);

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
  enemy.respawnTimer = (enemy.type === "buggy" || enemy.type === "gorilla_king" || enemy.type === "yeti") ? 45 : 6;
  let xpReward = 18;
  let moneyReward = 12;
  let baseMastery = 90;

  if (enemy.type === "buggy") {
    xpReward = 9000;
    moneyReward = 4200;
    baseMastery = 1000;
  } else if (enemy.type === "brute") {
    xpReward = 950;
    moneyReward = 95;
    baseMastery = 250;
  } else if (enemy.type === "pirate") {
    xpReward = 520;
    moneyReward = 62;
    baseMastery = 150;
  } else if (enemy.type === "desert_officer") {
    xpReward = 4800;
    moneyReward = 280;
    baseMastery = 750;
  } else if (enemy.type === "desert_bandit") {
    xpReward = 3200;
    moneyReward = 190;
    baseMastery = 500;
  } else if (enemy.type === "gorilla_king") {
    xpReward = 4500;
    moneyReward = 220;
    baseMastery = 800;
  } else if (enemy.type === "gorilla") {
    xpReward = 650;
    moneyReward = 75;
    baseMastery = 200;
  } else if (enemy.type === "monkey") {
    xpReward = 380;
    moneyReward = 45;
    baseMastery = 120;
  } else if (enemy.type === "frozen_bandit") {
    xpReward = 5500;
    moneyReward = 320;
    baseMastery = 900;
  } else if (enemy.type === "snowman") {
    xpReward = 7200;
    moneyReward = 420;
    baseMastery = 1100;
  } else if (enemy.type === "yeti") {
    xpReward = 18000;
    moneyReward = 2800;
    baseMastery = 2500;
  }

  addXp(xpReward);
  spawnLootCoins(enemy.mesh.position.clone(), moneyReward);
  player.materials.ironwood += enemy.type ? 2 : 1;
  player.materials.scrap += enemy.type === "brute" ? 3 : 1;

  // Mastery Reward!
  player.enemiesDefeatedCount = (player.enemiesDefeatedCount || 0) + 1;
  const decayFactor = 0.10; // 10% harder per defeat
  const masteryGained = Math.max(1, Math.round(baseMastery / (1 + (player.enemiesDefeatedCount - 1) * decayFactor)));
  const currentWeapon = player.weapon;
  addMasteryXp(currentWeapon, masteryGained);
  log(`Mastered ${statLabels[currentWeapon]}: +${masteryGained} Mastery Points! (Multiplier: x${(1 / (1 + (player.enemiesDefeatedCount - 1) * decayFactor)).toFixed(2)})`);

  // Grand Awakening execution check for other nearby enemies
  if (player.weapon === "special" && player.mastery.special >= 50) {
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
      log(`Iron Aura reached Level ${player.haki.level}.`);
    }
  }
  if (enemy.type === "buggy" || enemy.type === "gorilla_king" || enemy.type === "yeti") {
    bossBar?.classList.add("hidden");
  }
  if (enemy.type === "buggy") {
    player.materials.jungleCore += 2;
    log("Jester defeated: massive XP, cash, and rare cores acquired.");
  } else if (enemy.type === "gorilla_king") {
    player.materials.jungleCore += 1;
    log("Gorilla King defeated: massive XP, cash, and jungle cores acquired.");
  } else if (enemy.type === "yeti") {
    player.materials.icyCore = (player.materials.icyCore || 0) + 2;
    log("The Yeti has been defeated! Massive XP, cash, and rare icy cores acquired.");
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
  saveGame();
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

  const adminPrefix = player.isAdmin ? "👑 ADMIN | " : "";
  ui.playerTitle.textContent = `${adminPrefix}${getSelectedAvatar().name} | ${player.faction} ${player.level >= 4 ? "Captain" : "Rookie"}`;
  ui.level.textContent = `Level ${player.level} | ${weaponName()} | ${traits.label}`;
  ui.healthText.textContent = `${player.health}/${player.maxHealth}`;
  ui.healthBar.style.width = `${(player.health / player.maxHealth) * 100}%`;
  ui.xpText.textContent = `${player.xp}/${player.xpToNext}`;
  ui.xpBar.style.width = `${(player.xp / player.xpToNext) * 100}%`;
  if (ui.staminaText) ui.staminaText.textContent = `${Math.round(player.stamina)}/${player.maxStamina}`;
  if (ui.staminaBar) ui.staminaBar.style.width = `${(player.stamina / player.maxStamina) * 100}%`;
  ui.money.textContent = `$${player.money}`;
  if (ui.sea) ui.sea.textContent = hasReachedJungle ? "Jungle Island" : "First Sea";
  ui.points.textContent = `${player.statPoints} points`;

  if (activeQuest?.active) {
    ui.questTitle.textContent = `${activeQuest.title} | Aura ${player.haki.level || 0}`;
    ui.questDetail.textContent = `${activeQuest.detail} Progress: ${activeQuest.defeated}/${activeQuest.target}. Aura kills: ${player.haki.kills}/${player.haki.nextKills}.`;
  } else if (quest.complete) {
    ui.questTitle.textContent = "Starter Island Cleared";
    ui.questDetail.textContent = `Special ability unlocked. Aura ${player.haki.unlocked ? `Lv ${player.haki.level}` : "locked until level 60 Desert training"}.`;
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

// How far the island rock base sits below the grass surface at its centre.
const ISLAND_BASE_SINK = 1.4;
// ── 21-geometry-helpers.js ─ Island height sampling and procedural geometry helpers.
function getOutpostIslandProfileRadius(angle, maxRadius) {
  const ax = -900, az = -300;
  const bx = 900, bz = 300;
  const vx = bx - ax, vz = bz - az;
  const v_len_sq = vx * vx + vz * vz;
  
  const r1 = 950;
  const r2 = 950;
  const bridgeWidth = 280;

  let low = 0;
  let high = maxRadius * 1.6;
  for (let step = 0; step < 16; step++) {
    const mid = (low + high) / 2;
    const px = Math.cos(angle) * mid;
    const pz = Math.sin(angle) * mid;
    
    // Check dist1
    const dx1 = px - ax, dz1 = pz - az;
    const dist1 = Math.sqrt(dx1 * dx1 + dz1 * dz1) / r1;
    
    // Check dist2
    const dx2 = px - bx, dz2 = pz - bz;
    const dist2 = Math.sqrt(dx2 * dx2 + dz2 * dz2) / r2;
    
    // Check bridge
    const wx = px - ax, wz = pz - az;
    let t = (wx * vx + wz * vz) / v_len_sq;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + t * vx;
    const cz = az + t * vz;
    const dxB = px - cx, dzB = pz - cz;
    const distB = Math.sqrt(dxB * dxB + dzB * dzB) / bridgeWidth;
    
    const minDist = Math.min(dist1, dist2, distB);
    if (minDist <= 1) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return low;
}

// Islands are a flat plateau in the middle that rolls smoothly down to the shore.
// Everything that stands on the ground (player, buildings, grass, paths) uses this.
function islandPlateauStart(index) {
  if (index === 0) return 0.56;
  if (index >= 5) return 0.25;
  return 0.42;
}

function islandSlopeShape(normDist, index) {
  const start = islandPlateauStart(index);
  const t = Math.min(1, Math.max(0, (normDist - start) / (1 - start)));
  return t * t * (3 - 2 * t);
}

// Where the island's rock base meets the sea, by direction.
function islandCoastRadius(angle, radius, index) {
  return islandProfileRadius(angle, radius * 0.9, index + 3);
}

// Outline of the grassy top: its own wobbly shape, but never past the coast.
function islandGrassRadius(angle, radius, index) {
  return Math.min(islandProfileRadius(angle, radius * 0.88, index + 9), islandCoastRadius(angle, radius, index) * 0.97);
}

function getLocalSurfaceHeightAt(lx, lz, radius, height, index) {
  const seed = index + 9;
  const angle = Math.atan2(lz, lx);
  const centerHeight = height + 0.5;
  const uneven = Math.sin(angle * 6 + seed) * 1.5 + Math.cos(angle * 11) * 0.8;
  const edgeHeight = 0.16 + uneven;
  let normDist;

  if (index === 2) {
    // Outpost: two round lobes joined by a land bridge.
    const ax = -900, az = -300;
    const bx = 900, bz = 300;
    const vx = bx - ax, vz = bz - az;
    const lenSq = vx * vx + vz * vz;
    const dist1 = Math.hypot(lx - ax, lz - az) / 950;
    const dist2 = Math.hypot(lx - bx, lz - bz) / 950;
    const t = Math.max(0, Math.min(1, ((lx - ax) * vx + (lz - az) * vz) / lenSq));
    const distB = Math.hypot(lx - (ax + t * vx), lz - (az + t * vz)) / 280;
    normDist = Math.min(1, dist1, dist2, distB);
  } else {
    // Measured against the real coastline (the rock base rim), so land meets the sea there.
    normDist = Math.min(1, Math.hypot(lx, lz) / (islandCoastRadius(angle, radius, index) * 0.98));
  }

  return centerHeight + (edgeHeight - centerHeight) * islandSlopeShape(normDist, index);
}

function getIslandSurfaceHeightAt(x, z, island) {
  if (!island) return OCEAN_SURFACE_Y;
  const height = island.surfaceY - 0.16;
  return getLocalSurfaceHeightAt(x - island.position.x, z - island.position.z, island.radius, height, island.index);
}

// Island rock base. Its top is built in rings that follow the terrain a little
// below the grass, then drops at the rim to the sea floor.
// `terrain` = { radius, height, index } of the island (omit for a plain cone).
function makeIrregularCylinderGeometry(radius, height, segments, seed, index = -1, terrain = null) {
  const positions = [];
  const indices = [];
  const rings = terrain ? terrain.rings || 14 : 1;
  const bottomY = -height / 2 - 40;
  const centerY = terrain
    ? getLocalSurfaceHeightAt(0, 0, terrain.radius, terrain.height, terrain.index) - height / 2 - ISLAND_BASE_SINK
    : height / 2 - ISLAND_BASE_SINK;
  positions.push(0, centerY, 0, 0, bottomY, 0);
  const perAngle = rings + 1; // top ring vertices + one bottom vertex per angle

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const topRadius = islandProfileRadius(angle, radius * 0.9, seed, index);
    const bottomRadius = islandProfileRadius(angle + 0.08, radius, seed + 2, index);
    const uneven = Math.sin(angle * 6 + (seed + 6)) * 1.5 + Math.cos(angle * 11) * 0.8;
    const rimY = -height / 2 + uneven; // sea level at the rim (mesh-local)
    for (let ring = 1; ring <= rings; ring += 1) {
      const t = ring / rings;
      const x = Math.cos(angle) * topRadius * t;
      const z = Math.sin(angle) * topRadius * t;
      let y = rimY;
      if (terrain) {
        // Just under the grass everywhere; reaches sea level at the coast.
        y = getLocalSurfaceHeightAt(x, z, terrain.radius, terrain.height, terrain.index) - height / 2 - ISLAND_BASE_SINK;
      }
      positions.push(x, y, z);
    }
    positions.push(Math.cos(angle) * bottomRadius, bottomY, Math.sin(angle) * bottomRadius);
  }

  for (let i = 0; i < segments; i += 1) {
    const next = (i + 1) % segments;
    const a = 2 + i * perAngle;
    const b = 2 + next * perAngle;
    indices.push(0, b, a);
    for (let ring = 0; ring < rings - 1; ring += 1) {
      indices.push(a + ring, b + ring, a + ring + 1, b + ring, b + ring + 1, a + ring + 1);
    }
    const rimA = a + rings - 1;
    const rimB = b + rings - 1;
    const botA = a + rings;
    const botB = b + rings;
    indices.push(rimA, botA, rimB, rimB, botA, botB);
    indices.push(1, botA, botB);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Grass surface built on a polar grid whose heights come straight from
// getLocalSurfaceHeightAt, so what you see is exactly what you walk on.
function makeTerrainSurfaceGeometry(radius, height, index, segments, rings) {
  const seed = index + 9;
  const positions = [0, getLocalSurfaceHeightAt(0, 0, radius, height, index) - 0.04, 0];
  const indices = [];
  for (let ring = 1; ring <= rings; ring += 1) {
    // Rings bunch up toward the shore where the slope changes most.
    const t = Math.pow(ring / rings, 0.85);
    for (let i = 0; i < segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2;
      const r = islandGrassRadius(angle, radius, index) * t;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      positions.push(x, getLocalSurfaceHeightAt(x, z, radius, height, index) - 0.04, z);
    }
  }
  for (let i = 0; i < segments; i += 1) {
    const next = (i + 1) % segments;
    indices.push(0, 1 + next, 1 + i);
  }
  for (let ring = 1; ring < rings; ring += 1) {
    const a0 = 1 + (ring - 1) * segments;
    const b0 = 1 + ring * segments;
    for (let i = 0; i < segments; i += 1) {
      const next = (i + 1) % segments;
      indices.push(a0 + i, a0 + next, b0 + i, a0 + next, b0 + next, b0 + i);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeIrregularDiscGeometry(radius, segments, seed, height = 0, index = -1) {
  const positions = [0, 0, 0.5]; // Center is slightly raised
  const indices = [];

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const edgeRadius = islandProfileRadius(angle, radius, seed, index);
    
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

// A wobbly ring (beaches, shallows). Drawn flat in x/y and laid down by the caller
// with rotation.x = -PI/2. With `height` > 0 it follows the island terrain: the caller
// also sets position.y = height, so vertex z = ground - height.
function makeIrregularRingGeometry(innerRadius, outerRadius, segments, seed, height = 0, index = -1, maxRadius = 1) {
  const positions = [];
  const indices = [];
  const rings = height > 0 ? 9 : 1;

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const inner = islandProfileRadius(angle + 0.12, innerRadius, seed + 1, index);
    const outer = islandProfileRadius(angle, outerRadius, seed, index);
    for (let k = 0; k <= rings; k += 1) {
      const r = inner + (outer - inner) * (k / rings);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      let z;
      if (height > 0) {
        // After rotation.x = -PI/2, local (x, y) lands at world (x, -y).
        // Sits clearly above the grass so the two never interleave at the edge.
        z = getLocalSurfaceHeightAt(x, -y, maxRadius, height, index) + 0.35 - height;
      } else {
        const wobble = Math.sin(angle * 15 + seed) * 0.3;
        z = k === 0 ? wobble : -wobble;
      }
      positions.push(x, y, z);
    }
  }

  const stride = rings + 1;
  for (let i = 0; i < segments; i += 1) {
    const next = (i + 1) % segments;
    for (let k = 0; k < rings; k += 1) {
      const a = i * stride + k;
      const b = next * stride + k;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function islandProfileRadius(angle, radius, seed, index = -1) {
  if (index === 2) {
    const baseR = getOutpostIslandProfileRadius(angle, 2400);
    const noise = Math.sin(angle * 13 + seed * 1.4) * 0.025;
    return baseR * (radius / 2400) * (1 + noise);
  }
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

// ── 23-skills-and-compass.js ─ Weapon skills, quest unlocks, compass and combat HUD.
function triggerSwordQ() {
  audio.playSlash();
  createSpecialBurst({ mesh: playerMesh });
  
  enemies.forEach((enemy) => {
    if (enemy.alive && enemy.mesh.position.distanceTo(playerMesh.position) < 38) {
      const dmg = Math.round(getDamage() * 1.8);
      damageEnemy(enemy, dmg, "Spin", "#ffcf5a");
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
          damageEnemy(enemy, dmg, "Buckshot", "#ff7a3d");
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
      damageEnemy(enemy, dmg, "⚡ LIGHTNING", "#7ce0b4");
      createWallHitEffect(enemy.mesh.position.clone(), true);
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
  let skills = masterySkills[weapon] || [];
  // Ember Shot (C) and Inferno Kick (V) are standard melee attacks for everyone.
  const skill = skills.find(s => s.key === keyChar);
  if (!skill) return;

  const masteryLevel = player.mastery[weapon] || 1;
  if (masteryLevel < skill.req) {
    log(`Skill locked! Need Mastery ${skill.req} for ${skill.name}.`);
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
  const val = player.masteryXp ? (player.masteryXp[weapon] || 0) : 0;
  const weaponEmojis = { melee: "👊", sword: "⚔️", gun: "🔫", special: "✨" };
  const weaponNames = { melee: "MELEE", sword: "SWORD", gun: "GUN", special: "SPECIAL" };

  if (ui.combatWeaponIcon) ui.combatWeaponIcon.textContent = weaponEmojis[weapon] || "👊";
  if (ui.combatWeaponName) ui.combatWeaponName.textContent = weaponNames[weapon] || "COMBAT";

  let skills = masterySkills[weapon] || [];
  // Ember Shot (C) and Inferno Kick (V) are standard melee attacks for everyone.
  const masteryInfo = getMasteryInfo(val);
  const currentLevel = masteryInfo.level;
  const currentLevelPoints = masteryInfo.currentLevelPoints;
  const neededForNext = masteryInfo.neededForNext;
  const neededText = `(Need ${neededForNext - currentLevelPoints} MP)`;

  if (ui.combatMasteryLabel) ui.combatMasteryLabel.textContent = `Mastery ${currentLevel}`;
  if (ui.combatMasteryBar) ui.combatMasteryBar.style.width = `${Math.min(100, (currentLevelPoints / neededForNext) * 100)}%`;
  if (ui.combatMasteryText) ui.combatMasteryText.textContent = `${currentLevelPoints}/${neededForNext} ${neededText}`;

  if (ui.combatSkillsList) {
    ui.combatSkillsList.innerHTML = skills.map(skill => {
      const unlocked = currentLevel >= skill.req;
      const cd = skillCooldowns[skill.id] || 0;
      const cdPercent = cd > 0 ? (cd / skill.cd) * 100 : 0;
      const rowClass = `combat-skill-row${unlocked ? "" : " locked"}${unlocked ? " skill-row-glow" : ""}`;
      return `
        <div class="${rowClass}">
          <div class="skill-cooldown-overlay" style="height:${cdPercent}%"></div>
          <span class="skill-key">${skill.key}</span>
          <div class="skill-info">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-req">${unlocked ? "UNLOCKED" : `Mastery ${skill.req}`}</span>
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
        // Violent knockback
        t.mesh.position.addScaledVector(currentForward, 24);
        cameraShake = Math.max(cameraShake, 2.2);
        createWallHitEffect(t.mesh.position.clone(), true);
        damageEnemy(t, dmg, "FalconPunch", "#ffcf5a");
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
        damageEnemy(e, dmg, "Slam", "#ffcf5a");
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
          damageEnemy(e, dmg, "Gatling", "#ffcf5a");
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
        damageEnemy(e, dmg, "Thrust", "#f6b73c");
      }
    });

  } else if (skillId === "cyclone-spin") {
    audio.playSlash();
    createSpecialBurst(playerMesh);
    enemies.forEach(e => {
      if (e.alive && e.mesh.position.distanceTo(playerMesh.position) < 42) {
        const dmg = Math.round(getDamage() * 1.9);
        damageEnemy(e, dmg, "Cyclone", "#ffcf5a");
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
        damageEnemy(t, dmg, "DoubleTap", "#9defff");
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
        damageEnemy(e, dmg, "Buckshot", "#ff7a3d");
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
        damageEnemy(e, dmg, "Bubble", "#7ce0b4");
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
        damageEnemy(e, dmg, "⚡ Storm", "#7ce0b4");
        createWallHitEffect(e.mesh.position.clone(), true);
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
          damageEnemy(e, dmg, "Beam", "#7ce0b4");
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
        damageEnemy(e, dmg, "⚡JUDGMENT", "#3ce88a");
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

  } else if (skillId === "flambage-shot") {
    audio.playSlash();
    const dashDir = new THREE.Vector3(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y)).normalize();
    const dashDist = 25;
    const startPos = playerMesh.position.clone();
    let step = 0;
    const steps = 5;
    const stepDist = dashDist / steps;
    const interval = setInterval(() => {
      if (step >= steps || !gameStarted) {
        clearInterval(interval);
        return;
      }
      playerMesh.position.addScaledVector(dashDir, stepDist);
      resolveWallCollision(playerMesh.position.clone().addScaledVector(dashDir, -stepDist));
      createFireBurst(playerMesh.position.clone().add(new THREE.Vector3(0, 2, 0)));
      enemies.forEach(e => {
        if (e.alive && e.mesh.position.distanceTo(playerMesh.position) < 18) {
          const dmg = Math.round(getDamage() * 1.8);
          const push = e.mesh.position.clone().sub(startPos).setY(0).normalize();
          e.mesh.position.addScaledVector(push, 20);
          damageEnemy(e, dmg, "🔥 Ember Shot", "#ff3300");
          createFireBurst(e.mesh.position.clone());
        }
      });
      step++;
    }, 40);

  } else if (skillId === "diable-jambe") {
    audio.playQuestComplete();
    player.diableJambeTimer = 18;
    player.diableJambeHits = 0;
    createFireBurst(playerMesh.position.clone().add(new THREE.Vector3(0, 3, 0)));
    createFloatingText(playerMesh.position.clone().add(new THREE.Vector3(0, 12, 0)), "🔥 INFERNO KICK!", "#ff2200");
    log("🔥 Inferno Kick activated! Kicks are now infused with friction flames!");
  }
}

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

// ── 25-surfaces.js ─ Procedural surface textures applied to world meshes.
// ===== Realistic Surfaces: procedural textures for world blocks and terrain =====
// Generates tileable detail textures (wood planks, stone bricks, rock, cliff strata,
// grass, sand, snow, dirt, bark, foliage, metal) at load time and applies them to
// world meshes. Textures are near-white detail maps, so each object's original
// color is kept and the texture only adds grain, seams and relief.
const SURFACE_TEX_SIZE = 512;
let surfaceLibrary = null;
const surfaceMaterialCache = new Map();
const surfaceGeometryCache = new Map();

function surfaceRandom(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

// Tileable value noise with independent cell counts on each axis (stretched noise = grain).
function surfaceNoise(size, cellsX, cellsY, seed) {
  const rand = surfaceRandom(seed);
  const grid = new Float32Array(cellsX * cellsY);
  for (let i = 0; i < grid.length; i += 1) grid[i] = rand();
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y += 1) {
    const fy = (y / size) * cellsY;
    const y0 = Math.floor(fy);
    let ty = fy - y0;
    ty = ty * ty * (3 - 2 * ty);
    const y1 = (y0 + 1) % cellsY;
    for (let x = 0; x < size; x += 1) {
      const fx = (x / size) * cellsX;
      const x0 = Math.floor(fx);
      let tx = fx - x0;
      tx = tx * tx * (3 - 2 * tx);
      const x1 = (x0 + 1) % cellsX;
      const a = grid[y0 * cellsX + x0];
      const b = grid[y0 * cellsX + x1];
      const c = grid[y1 * cellsX + x0];
      const d = grid[y1 * cellsX + x1];
      out[y * size + x] = (a + (b - a) * tx) + ((c + (d - c) * tx) - (a + (b - a) * tx)) * ty;
    }
  }
  return out;
}

function surfaceFbm(size, baseCells, octaves, seed, stretchX = 1, stretchY = 1) {
  const out = new Float32Array(size * size);
  let amp = 1;
  let total = 0;
  for (let o = 0; o < octaves; o += 1) {
    const cells = baseCells * (1 << o);
    const n = surfaceNoise(size, Math.max(1, Math.round(cells * stretchX)), Math.max(1, Math.round(cells * stretchY)), seed + o * 101);
    for (let i = 0; i < out.length; i += 1) out[i] += n[i] * amp;
    total += amp;
    amp *= 0.5;
  }
  for (let i = 0; i < out.length; i += 1) out[i] /= total;
  return out;
}

function surfaceCanvasFromValues(size, values) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < values.length; i += 1) {
    const v = Math.max(0, Math.min(255, Math.round(values[i] * 255)));
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function surfaceTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
  return tex;
}

const surfacePainters = {
  wood(size) {
    const rand = surfaceRandom(11);
    const rows = 6;
    const ph = size / rows;
    const grainA = surfaceNoise(size, 3, 96, 21);
    const grainB = surfaceNoise(size, 8, 192, 22);
    const blotch = surfaceFbm(size, 4, 3, 23);
    const tones = [];
    const joints = [];
    for (let r = 0; r < rows; r += 1) {
      tones.push(0.8 + rand() * 0.2);
      joints.push(Math.floor(rand() * size));
    }
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let y = 0; y < size; y += 1) {
      const row = Math.floor(y / ph);
      const inRow = y - row * ph;
      const seamDist = Math.min(inRow, ph - inRow);
      for (let x = 0; x < size; x += 1) {
        const i = y * size + x;
        const g = grainA[i] * 0.6 + grainB[i] * 0.4;
        let v = tones[row] * (0.74 + 0.26 * g) * (0.9 + 0.1 * blotch[i]);
        let h = 0.75 + 0.25 * g;
        const j = joints[row];
        const jd = Math.min(Math.abs(x - j), Math.abs(x - ((j + size / 2) % size)), size - Math.abs(x - j));
        if (seamDist < 2.2 || jd < 1.6) { v *= 0.45; h = 0.05; }
        else if (seamDist < 5) { v *= 0.86; h *= 0.7; }
        // nail heads near the joints
        if (Math.abs(jd - 7) < 2 && Math.abs(inRow - ph * 0.5) < 2) { v *= 0.5; }
        col[i] = Math.min(1, v * 1.08);
        hgt[i] = h;
      }
    }
    return { color: col, height: hgt };
  },

  stone(size) {
    const rand = surfaceRandom(31);
    const rows = 4;
    const perRow = 3;
    const bh = size / rows;
    const bw = size / perRow;
    const mortar = 5;
    const detail = surfaceFbm(size, 8, 4, 32);
    const pits = surfaceNoise(size, 64, 64, 33);
    const tones = Array.from({ length: rows * perRow * 2 }, () => 0.78 + rand() * 0.22);
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let y = 0; y < size; y += 1) {
      const row = Math.floor(y / bh);
      const iy = y - row * bh;
      const offset = row % 2 ? bw / 2 : 0;
      for (let x = 0; x < size; x += 1) {
        const i = y * size + x;
        const sx = (x + offset) % size;
        const b = Math.floor(sx / bw);
        const ix = sx - b * bw;
        const edge = Math.min(ix, bw - ix, iy, bh - iy);
        const tone = tones[(row * perRow + b) % tones.length];
        if (edge < mortar) {
          col[i] = 0.5 + detail[i] * 0.12;
          hgt[i] = 0.05;
        } else {
          const bevel = Math.min(1, (edge - mortar) / 10);
          const pit = pits[i] < 0.12 ? 0.82 : 1;
          col[i] = Math.min(1, tone * (0.8 + detail[i] * 0.28) * (0.88 + 0.12 * bevel) * pit);
          hgt[i] = (0.45 + 0.55 * bevel) * (0.8 + 0.2 * detail[i]);
        }
      }
    }
    return { color: col, height: hgt };
  },

  rock(size) {
    const base = surfaceFbm(size, 4, 6, 41);
    const ridge = surfaceFbm(size, 6, 3, 42);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const r = 1 - Math.abs(ridge[i] * 2 - 1);
      const crack = r > 0.975 ? 0.78 : 1;
      col[i] = (0.58 + 0.5 * base[i]) * crack;
    }
    return { color: col, height: base };
  },

  cliff(size) {
    const strata = surfaceNoise(size, 2, 18, 51);
    const strataFine = surfaceNoise(size, 4, 64, 52);
    const base = surfaceFbm(size, 4, 5, 53);
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const band = strata[i] * 0.6 + strataFine[i] * 0.4;
      col[i] = 0.6 + 0.24 * band + 0.2 * base[i];
      hgt[i] = band * 0.5 + base[i] * 0.5;
    }
    return { color: col, height: hgt };
  },

  grass(size) {
    const clumps = surfaceFbm(size, 3, 3, 61);
    const patches = surfaceFbm(size, 10, 2, 64);
    const fine = surfaceFbm(size, 48, 3, 62);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const c = clumps[i] * 2 - 1;
      col[i] = 0.8 + 0.12 * c + 0.14 * (patches[i] - 0.5) + 0.14 * (fine[i] - 0.5);
    }
    const canvas = surfaceCanvasFromValues(size, col);
    const ctx = canvas.getContext("2d");
    const rand = surfaceRandom(63);
    // short blade strokes, drawn three times offset so the tile stays seamless
    for (let n = 0; n < 5200; n += 1) {
      const x = rand() * size;
      const y = rand() * size;
      const len = 3 + rand() * 6;
      const lean = (rand() - 0.5) * 3;
      const light = rand() > 0.5;
      ctx.strokeStyle = light ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)";
      ctx.lineWidth = 1;
      for (const [ox, oy] of [[0, 0], [-size, 0], [0, -size], [size, 0], [0, size]]) {
        ctx.beginPath();
        ctx.moveTo(x + ox, y + oy);
        ctx.lineTo(x + ox + lean, y + oy - len);
        ctx.stroke();
      }
    }
    return { canvas, height: fine };
  },

  sand(size) {
    const rand = surfaceRandom(71);
    const warp = surfaceFbm(size, 3, 3, 72);
    const soft = surfaceFbm(size, 16, 3, 73);
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const i = y * size + x;
        const ripple = Math.sin(((y / size) * 10 + warp[i] * 2.2) * Math.PI * 2);
        const grain = rand();
        col[i] = 0.84 + ripple * 0.02 + (soft[i] - 0.5) * 0.12 + (grain - 0.5) * 0.14;
        hgt[i] = 0.5 + ripple * 0.15 + (grain - 0.5) * 0.3;
      }
    }
    return { color: col, height: hgt };
  },

  snow(size) {
    const rand = surfaceRandom(81);
    const soft = surfaceFbm(size, 4, 4, 82);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const sparkle = rand() > 0.997 ? 0.08 : 0;
      col[i] = Math.min(1, 0.9 + soft[i] * 0.08 + sparkle);
    }
    return { color: col, height: soft };
  },

  dirt(size) {
    const rand = surfaceRandom(91);
    const base = surfaceFbm(size, 6, 5, 92);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) col[i] = 0.7 + base[i] * 0.3;
    const canvas = surfaceCanvasFromValues(size, col);
    const ctx = canvas.getContext("2d");
    for (let n = 0; n < 420; n += 1) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 1.5 + rand() * 4;
      const shade = rand() > 0.5 ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)";
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.6 + rand() * 0.4), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    return { canvas, height: base };
  },

  bark(size) {
    const streaks = surfaceNoise(size, 40, 3, 101);
    const streaksFine = surfaceNoise(size, 96, 6, 102);
    const base = surfaceFbm(size, 4, 3, 103);
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const s = streaks[i] * 0.65 + streaksFine[i] * 0.35;
      const groove = s < 0.32 ? 0.55 : 1;
      col[i] = (0.68 + 0.32 * s) * groove * (0.9 + 0.1 * base[i]);
      hgt[i] = s * groove;
    }
    return { color: col, height: hgt };
  },

  foliage(size) {
    const leaves = surfaceFbm(size, 12, 3, 111);
    const big = surfaceFbm(size, 3, 2, 112);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const l = leaves[i];
      const edge = l > 0.55 ? 1 : l > 0.45 ? 0.82 : 0.66;
      col[i] = edge * (0.82 + 0.18 * big[i]) + 0.1;
    }
    return { color: col, height: leaves };
  },

  metal(size) {
    const rand = surfaceRandom(121);
    const brushed = surfaceNoise(size, 2, 256, 122);
    const stains = surfaceFbm(size, 3, 3, 123);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) col[i] = 0.82 + brushed[i] * 0.1 + stains[i] * 0.08;
    const canvas = surfaceCanvasFromValues(size, col);
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    for (let n = 0; n < 60; n += 1) {
      const x = rand() * size;
      const y = rand() * size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rand() - 0.5) * 60, y + (rand() - 0.5) * 12);
      ctx.stroke();
    }
    return { canvas, height: brushed };
  },

  // Overlapping curved clay tiles in staggered rows.
  tiles(size) {
    const rows = 8;
    const perRow = 6;
    const ph = size / rows;
    const tw = size / perRow;
    const rand = surfaceRandom(141);
    const grain = surfaceFbm(size, 5, 4, 142);
    const tones = [];
    for (let i = 0; i < rows * perRow; i += 1) tones.push(0.82 + rand() * 0.18);
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let y = 0; y < size; y += 1) {
      const row = Math.floor(y / ph);
      const inRow = (y - row * ph) / ph; // 0 top of tile, 1 lower edge
      const offset = (row % 2) * tw * 0.5;
      for (let x = 0; x < size; x += 1) {
        const i = y * size + x;
        const tx = (x + offset) % size;
        const tile = Math.floor(tx / tw);
        const across = (tx - tile * tw) / tw; // 0..1 across the tile
        const curve = Math.sin(across * Math.PI);  // rounded profile
        const scallop = 0.82 + 0.18 * curve;        // lower edge is curved
        const edge = inRow > scallop ? 0.55 : 1;
        let v = tones[row * perRow + tile] * (0.72 + 0.28 * curve) * (0.9 + 0.1 * grain[i]) * edge;
        v *= 0.82 + 0.18 * (1 - inRow);             // shade under the tile above
        col[i] = Math.min(1, v * 1.08);
        hgt[i] = edge < 1 ? 0.1 : 0.35 + 0.45 * curve + 0.2 * (1 - inRow);
      }
    }
    return { color: col, height: hgt };
  },

  plaster(size) {
    const soft = surfaceFbm(size, 6, 5, 131);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) col[i] = 0.88 + soft[i] * 0.12;
    return { color: col, height: soft };
  },
};

// World units covered by one texture tile, and how strong the relief is.
const surfaceSettings = {
  wood:    { tile: 4,  bump: 0.045, roughness: 0.82 },
  stone:   { tile: 7,  bump: 0.06,  roughness: 0.9 },
  rock:    { tile: 9,  bump: 0.07,  roughness: 0.93 },
  cliff:   { tile: 26, bump: 0.09,  roughness: 0.95 },
  grass:   { tile: 16, bump: 0.025, roughness: 0.92 },
  sand:    { tile: 10, bump: 0.02,  roughness: 0.96 },
  snow:    { tile: 16, bump: 0.015, roughness: 0.8 },
  dirt:    { tile: 9,  bump: 0.04,  roughness: 0.97 },
  bark:    { tile: 3,  bump: 0.06,  roughness: 0.94 },
  foliage: { tile: 3,  bump: 0.04,  roughness: 0.85 },
  metal:   { tile: 4,  bump: 0.01,  roughness: 0.42, metalness: 0.65 },
  plaster: { tile: 6,  bump: 0.02,  roughness: 0.88 },
  tiles:   { tile: 7,  bump: 0.07,  roughness: 0.82 },
};

function getSurfaceLibrary() {
  if (surfaceLibrary) return surfaceLibrary;
  surfaceLibrary = {};
  Object.keys(surfacePainters).forEach((kind) => {
    const result = surfacePainters[kind](SURFACE_TEX_SIZE);
    const colorCanvas = result.canvas || surfaceCanvasFromValues(SURFACE_TEX_SIZE, result.color);
    const heightCanvas = surfaceCanvasFromValues(SURFACE_TEX_SIZE, result.height);
    surfaceLibrary[kind] = { map: surfaceTexture(colorCanvas), bump: surfaceTexture(heightCanvas) };
  });
  // Soft edge shading for blocks so corners read as solid, bevelled edges.
  const s = 128;
  const ao = new Float32Array(s * s);
  for (let y = 0; y < s; y += 1) {
    for (let x = 0; x < s; x += 1) {
      const d = Math.min(x, y, s - 1 - x, s - 1 - y) / s;
      const t = Math.min(1, d / 0.06);
      ao[y * s + x] = 0.6 + 0.4 * (t * t * (3 - 2 * t));
    }
  }
  const aoTex = new THREE.CanvasTexture(surfaceCanvasFromValues(s, ao));
  surfaceLibrary.edgeAO = aoTex;
  return surfaceLibrary;
}

function classifySurface(mesh, mat) {
  if (mesh.userData.surface) return mesh.userData.surface;
  const type = mesh.geometry.type;
  const hsl = { h: 0, s: 0, l: 0 };
  mat.color.getHSL(hsl);
  const { h, s, l } = hsl;
  const isBox = type === "BoxGeometry" || type === "BoxBufferGeometry";
  const isCyl = type.startsWith("Cylinder");
  const isRound = /Sphere|Dodecahedron|Icosahedron|Octahedron|Tetrahedron|Cone/.test(type);
  const isFlat = /Plane|Circle/.test(type);

  if (s < 0.12) {
    if (l > 0.86) return isRound ? null : "snow";
    if (l < 0.16) return isBox || isCyl ? "metal" : "rock";
    return isBox ? "stone" : isCyl ? "stone" : "rock";
  }
  if (h >= 0.17 && h <= 0.47) {
    if (isRound || isCyl) return "foliage";
    if (isBox) {
      const p = mesh.geometry.parameters || {};
      const thin = (p.height || 1) < Math.min(p.width || 1, p.depth || 1) * 0.5;
      return thin ? "grass" : "foliage";
    }
    return "grass";
  }
  if (h >= 0.02 && h < 0.17) {
    if (l > 0.55 && s > 0.25) return isRound ? "rock" : "sand";
    if (s < 0.33 && l > 0.32) return isCyl ? "bark" : isRound ? "rock" : "dirt";
    if (isCyl) return "bark";
    if (isBox) {
      const p = mesh.geometry.parameters || {};
      const tall = (p.height || 1) > Math.max(p.width || 1, p.depth || 1) * 3;
      return tall ? "bark" : "wood";
    }
    if (isFlat) return "wood";
    return "dirt";
  }
  if (h > 0.47 && h < 0.7 && s < 0.3) return isBox ? "stone" : "rock";
  return isBox ? "plaster" : null;
}

function surfaceUvsForMesh(mesh, kind) {
  const src = mesh.geometry;
  const worldScale = new THREE.Vector3();
  mesh.getWorldScale(worldScale);
  const sx = Math.abs(worldScale.x) || 1;
  const sy = Math.abs(worldScale.y) || 1;
  const sz = Math.abs(worldScale.z) || 1;
  const key = `${src.uuid}|${kind}|${sx.toFixed(2)}|${sy.toFixed(2)}|${sz.toFixed(2)}`;
  if (surfaceGeometryCache.has(key)) return surfaceGeometryCache.get(key);

  const tile = surfaceSettings[kind].tile;
  const type = src.type;
  const isBox = type === "BoxGeometry" || type === "BoxBufferGeometry";
  const isCyl = type.startsWith("Cylinder") || type.startsWith("Cone");
  let geo;

  if (isBox || isCyl) {
    geo = src.clone();
    if (!geo.attributes.normal) geo.computeVertexNormals();
    const pos = geo.attributes.position;
    const nor = geo.attributes.normal;
    const origUv = geo.attributes.uv;
    const uv = new Float32Array(pos.count * 2);
    const p = src.parameters || {};
    const radius = isCyl ? ((p.radiusTop ?? p.radius ?? 1) + (p.radiusBottom ?? p.radius ?? 1)) / 2 : 1;
    for (let i = 0; i < pos.count; i += 1) {
      const nx = Math.abs(nor.getX(i));
      const ny = Math.abs(nor.getY(i));
      const nz = Math.abs(nor.getZ(i));
      let u;
      let v;
      if (isCyl && ny < 0.9 && origUv) {
        u = origUv.getX(i) * Math.PI * 2 * radius * Math.max(sx, sz);
        v = pos.getY(i) * sy;
      } else if (ny >= nx && ny >= nz) {
        u = pos.getX(i) * sx;
        v = pos.getZ(i) * sz;
      } else if (nx >= nz) {
        u = pos.getZ(i) * sz;
        v = pos.getY(i) * sy;
      } else {
        u = pos.getX(i) * sx;
        v = pos.getY(i) * sy;
      }
      uv[i * 2] = u / tile;
      uv[i * 2 + 1] = v / tile;
    }
    if (isBox && origUv) geo.setAttribute("uv2", new THREE.BufferAttribute(new Float32Array(origUv.array), 2));
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  } else {
    // Free-form shapes (rocks, foliage, terrain): planar projection chosen per triangle.
    geo = src.index ? src.toNonIndexed() : src.clone();
    const pos = geo.attributes.position;
    const uv = new Float32Array(pos.count * 2);
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const n = new THREE.Vector3();
    for (let t = 0; t < pos.count; t += 3) {
      a.fromBufferAttribute(pos, t);
      b.fromBufferAttribute(pos, t + 1);
      c.fromBufferAttribute(pos, t + 2);
      n.subVectors(c, b).cross(a.clone().sub(b));
      const ax = Math.abs(n.x * sy * sz);
      const ay = Math.abs(n.y * sx * sz);
      const az = Math.abs(n.z * sx * sy);
      for (let k = 0; k < 3; k += 1) {
        const i = t + k;
        let u;
        let v;
        if (ay >= ax && ay >= az) { u = pos.getX(i) * sx; v = pos.getZ(i) * sz; }
        else if (ax >= az) { u = pos.getZ(i) * sz; v = pos.getY(i) * sy; }
        else { u = pos.getX(i) * sx; v = pos.getY(i) * sy; }
        uv[i * 2] = u / tile;
        uv[i * 2 + 1] = v / tile;
      }
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    if (!geo.attributes.normal) geo.computeVertexNormals();
  }
  if (!geo.attributes.uv2) {
    geo.setAttribute("uv2", new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 2).fill(0.5), 2));
  }
  surfaceGeometryCache.set(key, geo);
  return geo;
}

function surfaceMaterialFor(mat, kind, withEdges) {
  // Materials are upgraded in place so any code holding a reference keeps working.
  const done = surfaceMaterialCache.get(mat.uuid);
  if (done) {
    if (withEdges && !mat.aoMap) { mat.aoMap = getSurfaceLibrary().edgeAO; mat.aoMapIntensity = 0.85; mat.needsUpdate = true; }
    return mat;
  }
  const lib = getSurfaceLibrary();
  const settings = surfaceSettings[kind];
  mat.map = lib[kind].map;
  mat.bumpMap = lib[kind].bump;
  mat.bumpScale = settings.bump;
  mat.roughness = settings.roughness;
  if (settings.metalness !== undefined) mat.metalness = settings.metalness;
  if (withEdges) {
    mat.aoMap = lib.edgeAO;
    mat.aoMapIntensity = 0.85;
  }
  // Detail maps darken slightly on average; lift the base color to keep the original look.
  mat.color.multiplyScalar(kind === "snow" || kind === "plaster" ? 1.04 : 1.12);
  mat.needsUpdate = true;
  surfaceMaterialCache.set(mat.uuid, kind);
  return mat;
}

function enhanceWorldSurfaces(root, skip = new Set()) {
  if (!root) return;
  root.updateMatrixWorld(true);
  const visit = (obj) => {
    if (skip.has(obj) || obj.userData.noSurface) return;
    if (obj.isMesh && obj.material && obj.material.isMeshStandardMaterial && !Array.isArray(obj.material)) {
      const mat = obj.material;
      const glowing = mat.emissiveIntensity > 0.2 && (mat.emissive.r + mat.emissive.g + mat.emissive.b) > 0.24;
      if (!mat.map && !mat.transparent && !mat.vertexColors && !glowing && mat.opacity >= 1) {
        const kind = classifySurface(obj, mat);
        if (kind && surfaceSettings[kind]) {
          try {
            const isBox = obj.geometry.type === "BoxGeometry" || obj.geometry.type === "BoxBufferGeometry";
            obj.geometry = surfaceUvsForMesh(obj, kind);
            surfaceMaterialFor(mat, kind, isBox);
          } catch (error) {
            console.warn("Surface enhancement skipped for a mesh:", error);
          }
        }
      }
    }
    obj.children.forEach(visit);
  };
  visit(root);
}

// ── 26-wind-grass.js ─ Instanced grass blades that sway in a shared wind field.
//
// Each island gets one InstancedMesh of tapered blades. The wind is done in the
// vertex shader (rolling gusts + flutter), so thousands of blades cost one draw call.

const windUniforms = {
  uWindTime: { value: 0 },
  uWindDir: { value: new THREE.Vector2(0.86, 0.5).normalize() },
  uWindStrength: { value: 1.0 },
};

// Blades per square world unit at the highest quality, per island index.
const WIND_GRASS_DENSITY = { 0: 0.85, 1: 0.85, 2: 0.65, 3: 0.12, default: 0.5 };
const WIND_GRASS_CELL = 64;           // grass is generated in square cells this wide
const WIND_GRASS_FULL_RANGE = 80;     // full density inside this distance
const WIND_GRASS_FADE_RANGE = 210;    // thins out to nothing by here
const WIND_GRASS_DROP_RANGE = 330;    // cells beyond this are freed
const windGrassIslands = [];
// `var` so the graphics setting can be applied before this file has run.
var windGrassQuality = 1;
var windGrassTimer = 0;
let windGrassGeometry = null;

function updateWind(dt) {
  windUniforms.uWindTime.value += dt;
  // Storms push the grass harder; ease in and out.
  const target = typeof weatherActive !== "undefined" && weatherActive ? 2.1 : 1.0;
  windUniforms.uWindStrength.value += (target - windUniforms.uWindStrength.value) * Math.min(1, dt * 0.6);
  // Wind direction wanders slowly.
  const a = 0.52 + Math.sin(windUniforms.uWindTime.value * 0.021) * 0.45;
  windUniforms.uWindDir.value.set(Math.cos(a), Math.sin(a));
}

function setWindGrassQuality(level) {
  windGrassQuality = ({ 1: 0.18, 2: 0.35, 3: 0.6, 4: 0.82, 5: 1 })[level] ?? 1;
  windGrassTimer = 0; // re-apply densities on the next update
}

// A tapered, slightly curved blade, 1 unit tall. `bladeT` runs 0 at the root to 1 at the tip.
function createGrassBladeGeometry() {
  const segments = 4;
  const positions = [];
  const bladeT = [];
  const normals = [];
  const indices = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const halfWidth = 0.17 * Math.pow(1 - t, 0.9) + 0.004;
    const lean = t * t * 0.32;
    positions.push(-halfWidth, t, lean, halfWidth, t, lean);
    bladeT.push(t, t);
    // Up-facing normals light blades like the ground they grow from (no dark backsides).
    normals.push(0, 1, 0.25, 0, 1, 0.25);
  }
  for (let i = 0; i < segments; i += 1) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("bladeT", new THREE.Float32BufferAttribute(bladeT, 1));
  geometry.setIndex(indices);
  return geometry;
}

function createWindGrassMaterial(rootHex, tipHex) {
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    side: THREE.DoubleSide,
  });
  material.userData.noSurface = true;
  const rootColor = worldColor(rootHex);
  const tipColor = worldColor(tipHex);
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWindTime = windUniforms.uWindTime;
    shader.uniforms.uWindDir = windUniforms.uWindDir;
    shader.uniforms.uWindStrength = windUniforms.uWindStrength;
    shader.uniforms.uRootColor = { value: rootColor };
    shader.uniforms.uTipColor = { value: tipColor };
    shader.vertexShader = `
      attribute float bladeT;
      uniform float uWindTime;
      uniform vec2 uWindDir;
      uniform float uWindStrength;
      varying float vBladeT;
    ` + shader.vertexShader.replace(
      "#include <project_vertex>",
      `
      vBladeT = bladeT;
      vec4 localPos = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        localPos = instanceMatrix * localPos;
      #endif
      vec4 worldPos = modelMatrix * localPos;
      vec4 rootWorld = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      // Big rolling gusts travel across the field; small flutter on top.
      float along = dot(rootWorld.xz, uWindDir);
      float gust = sin(along * 0.045 - uWindTime * 1.6) * 0.5 + 0.5;
      gust = gust * gust;
      float sway = sin(uWindTime * 2.3 + rootWorld.x * 0.21 + rootWorld.z * 0.17) * 0.28
                 + sin(uWindTime * 5.1 + rootWorld.x * 0.73 - rootWorld.z * 0.61) * 0.08;
      float bend = (0.35 + gust * 1.1 + sway) * uWindStrength * bladeT * bladeT;
      float bladeHeight = length(instanceMatrix[1].xyz);
      worldPos.xz += uWindDir * bend * bladeHeight * 0.55;
      worldPos.y -= bend * bend * bladeHeight * 0.12;
      vec4 mvPosition = viewMatrix * worldPos;
      gl_Position = projectionMatrix * mvPosition;
      `,
    );
    shader.fragmentShader = `
      uniform vec3 uRootColor;
      uniform vec3 uTipColor;
      varying float vBladeT;
    ` + shader.fragmentShader.replace(
      "#include <color_fragment>",
      `
      #include <color_fragment>
      // Dark, shaded roots fading to sunlit tips.
      diffuseColor.rgb *= mix(uRootColor, uTipColor, smoothstep(0.0, 1.0, vBladeT));
      `,
    );
  };
  return material;
}

// Islands register once; their grass is generated cell by cell as the player approaches.
function addWindGrass(group, radius, height, index) {
  if (index === 4) return; // snowy island
  const dry = index === 3;
  windGrassIslands.push({
    group,
    radius,
    height,
    index,
    dry,
    density: WIND_GRASS_DENSITY[index] ?? WIND_GRASS_DENSITY.default,
    cells: new Map(),
    pool: [], // freed cells are reused so GPU buffers are not leaked
    covers: null,
    material: dry ? createWindGrassMaterial(0x8a7a3e, 0xe0cd84) : createWindGrassMaterial(0x2f5e26, 0xa9d46a),
    tints: (dry ? [0xf2e2a0, 0xe6d08a, 0xd8c27a] : [0xffffff, 0xe6f2d2, 0xf4f8e4, 0xd2e8b6, 0xfff1c8]).map((hex) => new THREE.Color(hex)),
  });
}

// Flat ground cover (paths, plaza, beach rings, farm plots) that grass must not poke through.
function collectGrassCovers(island) {
  const covers = [];
  const box = new THREE.Box3();
  const groundTop = island.group.position.y + island.height + 3;
  island.group.updateMatrixWorld(true);
  island.group.traverse((obj) => {
    if (!obj.isMesh || obj.isInstancedMesh) return;
    const surface = obj.userData.surface;
    if (surface === "grass" || surface === "cliff" || surface === "rock") return;
    box.setFromObject(obj);
    if (obj.userData.groundCover || (box.max.y - box.min.y < 3.5 && box.min.y < groundTop)) covers.push(obj);
  });
  return covers;
}

// Rasterises every ground cover's triangles (seen from above) into a byte grid once,
// so "is this spot covered?" is a single lookup instead of a raycast per blade.
function prepareGrassCoverMask(island) {
  if (island.mask) return island.mask;
  const covers = collectGrassCovers(island);
  const size = island.radius * 2.1;
  const cell = Math.max(1.25, island.radius / 650);
  const n = Math.ceil(size / cell);
  const grid = new Uint8Array(n * n);
  const ox = island.group.position.x - size / 2;
  const oz = island.group.position.z - size / 2;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const fillTriangle = () => {
    const ax = (a.x - ox) / cell, az = (a.z - oz) / cell;
    const bx = (b.x - ox) / cell, bz = (b.z - oz) / cell;
    const cx = (c.x - ox) / cell, cz = (c.z - oz) / cell;
    const minX = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
    const maxX = Math.min(n - 1, Math.ceil(Math.max(ax, bx, cx)));
    const minZ = Math.max(0, Math.floor(Math.min(az, bz, cz)));
    const maxZ = Math.min(n - 1, Math.ceil(Math.max(az, bz, cz)));
    const area = (bx - ax) * (cz - az) - (bz - az) * (cx - ax);
    if (Math.abs(area) < 1e-9) return;
    for (let z = minZ; z <= maxZ; z += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const px = x + 0.5, pz = z + 0.5;
        const w0 = (bx - px) * (cz - pz) - (bz - pz) * (cx - px);
        const w1 = (cx - px) * (az - pz) - (cz - pz) * (ax - px);
        const w2 = (ax - px) * (bz - pz) - (az - pz) * (bx - px);
        if ((w0 >= 0 && w1 >= 0 && w2 >= 0) || (w0 <= 0 && w1 <= 0 && w2 <= 0)) grid[z * n + x] = 1;
      }
    }
  };
  covers.forEach((mesh) => {
    const pos = mesh.geometry.attributes.position;
    const idx = mesh.geometry.index;
    const m = mesh.matrixWorld;
    const tris = idx ? idx.count / 3 : pos.count / 3;
    for (let t = 0; t < tris; t += 1) {
      const i0 = idx ? idx.getX(t * 3) : t * 3;
      const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
      const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
      a.fromBufferAttribute(pos, i0).applyMatrix4(m);
      b.fromBufferAttribute(pos, i1).applyMatrix4(m);
      c.fromBufferAttribute(pos, i2).applyMatrix4(m);
      fillTriangle();
    }
  });
  island.mask = { grid, n, cell, ox, oz };
  return island.mask;
}

function grassCellCovered(mask, wx, wz) {
  const x = Math.floor((wx - mask.ox) / mask.cell);
  const z = Math.floor((wz - mask.oz) / mask.cell);
  if (x < 0 || z < 0 || x >= mask.n || z >= mask.n) return false;
  return mask.grid[z * mask.n + x] === 1;
}

const grassProbe = new THREE.Vector3();
const grassDummy = new THREE.Object3D();
const grassContact = { depth: 0, nx: 0, nz: 0 };

function buildGrassCell(island, cx, cz) {
  if (!windGrassGeometry) {
    windGrassGeometry = createGrassBladeGeometry();
    // Every cell keeps its blades within this sphere around the cell centre, so
    // the shared bound lets each cell be frustum-culled on its own.
    windGrassGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), WIND_GRASS_CELL * 0.75 + 8);
  }
  const mask = prepareGrassCoverMask(island);
  const { radius, height, index, dry, group } = island;
  const seed = index + 9;
  const profileRadius = radius * 0.88;
  const half = WIND_GRASS_CELL / 2;
  const centerX = (cx + 0.5) * WIND_GRASS_CELL;
  const centerZ = (cz + 0.5) * WIND_GRASS_CELL;
  const target = Math.round(WIND_GRASS_CELL * WIND_GRASS_CELL * island.density);
  let mesh = island.pool.pop();
  if (!mesh) {
    mesh = new THREE.InstancedMesh(windGrassGeometry, island.material, target);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.userData.noSurface = true;
    group.add(mesh);
  }
  mesh.position.set(centerX, 0, centerZ);

  let state = ((cx * 73856093) ^ (cz * 19349663) ^ (index * 83492791)) >>> 0;
  const rng = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  // Only obstacles that overlap this cell are worth testing against.
  const wx0 = group.position.x + centerX;
  const wz0 = group.position.z + centerZ;
  const nearby = collisionVolumes.filter((v) => {
    const reach = (v.shape === "segment" ? Math.hypot(v.end.x - v.center.x, v.end.z - v.center.z) + v.radius : v.bound) + half + 2;
    return Math.abs(v.center.x - wx0) < reach && Math.abs(v.center.z - wz0) < reach;
  });
  let placed = 0;
  for (let attempt = 0; attempt < target * 1.4 && placed < target; attempt += 1) {
    const lx = centerX + (rng() - 0.5) * WIND_GRASS_CELL;
    const lz = centerZ + (rng() - 0.5) * WIND_GRASS_CELL;
    const r = Math.hypot(lx, lz);
    const angle = Math.atan2(lz, lx);
    const edge = islandGrassRadius(angle, radius, index);
    if (r > edge * 0.96) continue;
    // Same height function the terrain mesh and the player use.
    const ly = getLocalSurfaceHeightAt(lx, lz, radius, height, index) - 0.04;
    if (ly < 1.5) continue; // too close to the waterline
    const wx = group.position.x + lx;
    const wz = group.position.z + lz;
    const wy = group.position.y + ly;
    if (grassCellCovered(mask, wx, wz)) continue;
    grassProbe.set(wx, wy, wz);
    let blocked = false;
    for (let k = 0; k < nearby.length && !blocked; k += 1) blocked = measureCollision(nearby[k], grassProbe, 0.6, grassContact);
    if (blocked) continue;

    const bladeHeight = (dry ? 1.5 : 2.0) + rng() * (dry ? 1.5 : 2.6);
    grassDummy.position.set(lx - centerX, ly - 0.05, lz - centerZ);
    grassDummy.rotation.set((rng() - 0.5) * 0.3, rng() * Math.PI * 2, (rng() - 0.5) * 0.3);
    grassDummy.scale.set(0.8 + rng() * 0.7, bladeHeight, 1);
    grassDummy.updateMatrix();
    mesh.setMatrixAt(placed, grassDummy.matrix);
    mesh.setColorAt(placed, island.tints[Math.floor(rng() * island.tints.length)]);
    placed += 1;
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.userData.maxCount = placed;
  mesh.count = 0;
  mesh.visible = false;
  return mesh;
}

// Streams cells in and out around the player and thins distant ones.
function updateWindGrass(dt) {
  updateWind(dt);
  windGrassTimer -= dt;
  if (windGrassTimer > 0 || !playerMesh) return;
  windGrassTimer = 0.25;
  const budgetEnd = performance.now() + 3; // ms of grass generation allowed per frame
  const px = playerMesh.position.x;
  const pz = playerMesh.position.z;
  let builtThisTick = 0;

  windGrassIslands.forEach((island) => {
    const gx = island.group.position.x;
    const gz = island.group.position.z;
    const localX = px - gx;
    const localZ = pz - gz;
    const nearIsland = Math.hypot(localX, localZ) < island.radius + WIND_GRASS_DROP_RANGE;

    // Free far cells.
    island.cells.forEach((mesh, key) => {
      const d = Math.hypot(mesh.position.x - localX, mesh.position.z - localZ);
      if (!nearIsland || d > WIND_GRASS_DROP_RANGE) {
        mesh.count = 0;
        mesh.visible = false;
        island.pool.push(mesh);
        island.cells.delete(key);
      }
    });
    if (!nearIsland || windGrassQuality <= 0) return;

    const reach = Math.ceil(WIND_GRASS_FADE_RANGE / WIND_GRASS_CELL);
    const pcx = Math.floor(localX / WIND_GRASS_CELL);
    const pcz = Math.floor(localZ / WIND_GRASS_CELL);
    const wanted = [];
    for (let cx = pcx - reach; cx <= pcx + reach; cx += 1) {
      for (let cz = pcz - reach; cz <= pcz + reach; cz += 1) {
        const ccx = (cx + 0.5) * WIND_GRASS_CELL;
        const ccz = (cz + 0.5) * WIND_GRASS_CELL;
        if (Math.hypot(ccx, ccz) > island.radius) continue; // off the island
        const d = Math.max(0, Math.hypot(ccx - localX, ccz - localZ) - WIND_GRASS_CELL * 0.5);
        if (d > WIND_GRASS_FADE_RANGE) continue;
        wanted.push({ key: `${cx},${cz}`, cx, cz, d });
      }
    }
    wanted.sort((a, b) => a.d - b.d);
    wanted.forEach(({ key, cx, cz, d }) => {
      let mesh = island.cells.get(key);
      if (!mesh) {
        if (builtThisTick >= 1 && performance.now() > budgetEnd) return; // finish next frame
        mesh = buildGrassCell(island, cx, cz);
        island.cells.set(key, mesh);
        builtThisTick += 1;
      }
      const fade = d <= WIND_GRASS_FULL_RANGE ? 1 : 1 - (d - WIND_GRASS_FULL_RANGE) / (WIND_GRASS_FADE_RANGE - WIND_GRASS_FULL_RANGE);
      // Blades were placed in random order, so a shorter count thins the cell evenly.
      // Thin quickly with distance: far blades are tiny on screen anyway.
      mesh.count = Math.floor(mesh.userData.maxCount * Math.pow(Math.max(0, fade), 1.6) * windGrassQuality);
      mesh.visible = mesh.count > 0;
    });
  });
  if (builtThisTick >= 1 && performance.now() > budgetEnd) windGrassTimer = 0; // more to build next frame
}

// ── 27-windmills.js ─ Tower windmills, a wheat field and hay bales for the starter island.

const windmillRotors = [];

function updateWindmills(dt) {
  const strength = windUniforms.uWindStrength.value;
  windmillRotors.forEach((rotor) => {
    rotor.mesh.rotation.z -= dt * rotor.speed * (0.6 + strength * 0.5);
  });
}

function createWindmill(scale = 1, seed = 0) {
  const village = WORLD_PALETTE.village;
  const mat = (hex, roughness, surface, extra = {}) => {
    const m = new THREE.MeshStandardMaterial({ color: worldHex(hex), roughness, ...extra });
    m.userData.surface = surface;
    return m;
  };
  const stone = mat(village.foundation, 0.95, "stone");
  const plaster = mat(village.walls[seed % village.walls.length], 0.9, "plaster");
  const timber = mat(village.timber, 0.85, "wood");
  const roofMat = mat(village.roofs[(seed + 1) % village.roofs.length], 0.78, "tiles", { side: THREE.DoubleSide });
  const sailCloth = mat(0xefe6d2, 0.95, "plaster", { side: THREE.DoubleSide });
  const trim = mat(village.trims[seed % village.trims.length], 0.7, "wood");

  const mill = new THREE.Group();
  const shade = (mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // Tapered tower: stone base, plastered body (curved profile via a lathe).
  const towerProfile = [];
  for (let i = 0; i <= 12; i += 1) {
    const t = i / 12;
    towerProfile.push(new THREE.Vector2(11 - 4.2 * t - 0.8 * Math.sin(t * Math.PI), 6 + t * 34));
  }
  const tower = shade(new THREE.Mesh(new THREE.LatheGeometry(towerProfile, 28), plaster));
  mill.add(tower);
  const base = shade(new THREE.Mesh(new THREE.CylinderGeometry(11.4, 12.4, 6, 28), stone));
  base.position.y = 3;
  mill.add(base);

  // Balcony / reefing stage with railing.
  const stage = shade(new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 0.8, 28), timber));
  stage.position.y = 22;
  mill.add(stage);
  for (let i = 0; i < 16; i += 1) {
    const a = (i / 16) * Math.PI * 2;
    const post = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.2, 6), timber));
    post.position.set(Math.cos(a) * 10.6, 23.6, Math.sin(a) * 10.6);
    mill.add(post);
  }
  const rail = shade(new THREE.Mesh(new THREE.TorusGeometry(10.6, 0.25, 6, 32), timber));
  rail.rotation.x = Math.PI / 2;
  rail.position.y = 25.1;
  mill.add(rail);

  // Arched door and windows (reuse the cottage window glass so they glow at night).
  const door = shade(new THREE.Mesh(flatPanel(archShape(5.6, 9), 0.6), timber));
  door.position.set(0, 0.2, 11.6);
  mill.add(door);
  const doorFrame = shade(new THREE.Mesh(flatPanel(archFrameShape(5.6, 9, 1), 1), stone));
  doorFrame.position.set(0, 0.2, 11.7);
  mill.add(doorFrame);
  [[12, 0.6], [30, 2.6], [30, -2.4]].forEach(([y, a]) => {
    const r = 11 - 4.2 * ((y - 6) / 34) - 0.8 * Math.sin(((y - 6) / 34) * Math.PI);
    const win = new THREE.Group();
    const frame = new THREE.Mesh(flatPanel(archFrameShape(2.6, 4, 0.6), 0.6), trim);
    const glass = new THREE.Mesh(flatPanel(archShape(2.6, 4), 0.25), houseWindowGlass);
    glass.userData.noSurface = true;
    win.add(frame, glass);
    win.position.set(Math.sin(a) * (r - 0.15), y, Math.cos(a) * (r - 0.15));
    win.rotation.y = a;
    mill.add(win);
  });

  // Rotating cap with a bell-curved roof; the sails face +z.
  const cap = new THREE.Group();
  cap.position.y = 40;
  const capProfile = [];
  for (let i = 0; i <= 14; i += 1) {
    const t = i / 14;
    capProfile.push(new THREE.Vector2(7.8 * Math.pow(1 - t, 0.8) * (1 - 0.18 * Math.sin(t * Math.PI)) + 0.05, t * 10));
  }
  const capRoof = shade(new THREE.Mesh(new THREE.LatheGeometry(capProfile, 24), roofMat));
  cap.add(capRoof);
  const capRing = shade(new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 1.2, 24), timber));
  capRing.position.y = 0.2;
  cap.add(capRing);
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 8), mat(0xc9a24a, 0.35, "metal", { metalness: 0.7 }));
  finial.position.y = 10.4;
  cap.add(finial);
  const axle = shade(new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 6, 12), timber));
  axle.rotation.x = Math.PI / 2;
  axle.position.set(0, 4, 8.2);
  cap.add(axle);

  const rotor = new THREE.Group();
  rotor.position.set(0, 4, 11.4);
  const hub = shade(new THREE.Mesh(new THREE.SphereGeometry(1.6, 14, 10), trim));
  rotor.add(hub);
  for (let s = 0; s < 4; s += 1) {
    const sail = new THREE.Group();
    const spar = shade(new THREE.Mesh(new THREE.BoxGeometry(0.9, 30, 0.9), timber));
    spar.position.y = 15;
    sail.add(spar);
    // Lattice frame with a cloth panel on one side of the spar.
    const cloth = shade(new THREE.Mesh(new THREE.PlaneGeometry(6, 24, 1, 1), sailCloth));
    cloth.position.set(3.6, 17.5, -0.3);
    sail.add(cloth);
    for (let k = 0; k <= 6; k += 1) {
      const bar = shade(new THREE.Mesh(new THREE.BoxGeometry(7, 0.35, 0.35), timber));
      bar.position.set(3.2, 5.5 + k * 4, 0.1);
      sail.add(bar);
    }
    const edge = shade(new THREE.Mesh(new THREE.BoxGeometry(0.35, 24.5, 0.35), timber));
    edge.position.set(6.7, 17.5, 0.1);
    sail.add(edge);
    sail.rotation.z = (s / 4) * Math.PI * 2;
    rotor.add(sail);
  }
  rotor.rotation.z = seed * 0.7;
  cap.add(rotor);
  mill.add(cap);
  windmillRotors.push({ mesh: rotor, speed: 0.55 + (seed % 3) * 0.08 });

  mill.scale.setScalar(scale);
  return mill;
}

function createHayBale(radius = 3) {
  const bale = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, radius * 1.3, 18),
    new THREE.MeshStandardMaterial({ color: worldHex(0xd9b866), roughness: 0.95 }),
  );
  bale.rotation.z = Math.PI / 2;
  bale.castShadow = true;
  bale.receiveShadow = true;
  bale.userData.surface = "dirt";
  return bale;
}

// Golden wheat that sways with the same wind as the grass.
function createWheatField(width, depth, seed = 0) {
  const field = new THREE.Group();
  const soil = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.6, depth),
    new THREE.MeshStandardMaterial({ color: worldHex(0x7a5a3a), roughness: 0.98 }),
  );
  soil.position.y = 0.3;
  soil.receiveShadow = true;
  soil.userData.surface = "dirt";
  field.add(soil);

  const count = Math.round(width * depth * 1.6);
  const wheat = new THREE.InstancedMesh(createGrassBladeGeometry(), createWindGrassMaterial(0x9a7a32, 0xf3d77a), count);
  wheat.frustumCulled = false;
  wheat.receiveShadow = true;
  wheat.userData.noSurface = true;
  const dummy = new THREE.Object3D();
  let state = (seed + 7) * 2246822519 >>> 0;
  const rng = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const tint = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    // Planted in rows along x.
    const row = Math.floor(rng() * Math.floor(depth / 2.2));
    dummy.position.set((rng() - 0.5) * (width - 2), 0.55, -depth / 2 + 1.5 + row * 2.2 + (rng() - 0.5) * 0.6);
    dummy.rotation.set((rng() - 0.5) * 0.2, rng() * Math.PI * 2, (rng() - 0.5) * 0.2);
    dummy.scale.set(0.9 + rng() * 0.5, 4.2 + rng() * 1.8, 1);
    dummy.updateMatrix();
    wheat.setMatrixAt(i, dummy.matrix);
    wheat.setColorAt(i, tint.setHSL(0.11 + rng() * 0.03, 0.5, 0.82 + rng() * 0.15));
  }
  wheat.instanceMatrix.needsUpdate = true;
  if (wheat.instanceColor) wheat.instanceColor.needsUpdate = true;
  field.add(wheat);
  return field;
}

function addStarterWindmills(group, radius, height) {
  const surface = (x, z) => getLocalSurfaceHeightAt(x, z, radius, height, 0);
  const mills = [
    // x, z, scale, facing (radians, sails point roughly into the wind)
    [330, -70, 1.15, -0.6],
    [-170, -300, 1.0, 0.4],
    [150, -340, 0.9, -0.2],
  ];
  mills.forEach(([x, z, scale, facing], i) => {
    const y = surface(x, z);
    const mill = createWindmill(scale, i);
    mill.position.set(x, y - 0.4, z);
    mill.rotation.y = facing;
    group.add(mill);
    addCollisionCircle(new THREE.Vector3(x, y, z), 12.2 * scale, "Windmill", { material: "stone" });
  });

  // Wheat field and hay bales beside the big mill.
  const fx = 280;
  const fz = -150;
  const field = createWheatField(56, 34, 3);
  field.position.set(fx, surface(fx, fz) - 0.1, fz);
  field.rotation.y = -0.6;
  group.add(field);
  const fenceY = surface(fx, fz);
  addCollisionBox(new THREE.Vector3(fx, fenceY, fz), 28, 17, -0.6, "Wheat field", { material: "wood", height: 3 });

  [[318, -112, 3.2], [324, -102, 2.8], [312, -96, 3], [246, -196, 3.1]].forEach(([x, z, r], i) => {
    const bale = createHayBale(r);
    bale.position.set(x, surface(x, z) + r - 0.2, z);
    bale.rotation.y = i * 0.9;
    group.add(bale);
    addCollisionCircle(new THREE.Vector3(x, surface(x, z), z), r * 1.1, "Hay bale", { material: "wood", damage: 2, height: r * 1.9 });
  });
}

// ── 28-ground-settling.js ─ Puts every island object properly on the ground after the world is built.
//
// Objects are placed using the ground height at their centre, which leaves the
// downhill side hanging on slopes. This pass, run once at the end of createWorld:
//   - drapes thin, flat ground covers (paths, plots, decks) over the terrain, and
//   - lowers free-standing objects so their lowest corner touches the ground.
// It leaves alone: water surfaces, things over the sea, intentionally raised parts
// (anything clearly above the ground everywhere), and parts that hold up another part
// (arch pillars, well posts), so multi-piece structures stay joined.

const SETTLE_LIFT = 0.08;     // gap left under draped covers to avoid flicker
const SETTLE_SINK = 0.15;     // how far solid objects are pushed into the ground

function settleIslandObjects(island) {
  const group = island.mesh;
  if (!group) return;
  const { radius, index } = island;
  const height = island.surfaceY - 0.16;
  const gx = group.position.x;
  const gz = group.position.z;
  const groundLocal = (lx, lz) => getLocalSurfaceHeightAt(lx, lz, radius, height, index);
  const groundWorld = (wx, wz) => group.position.y + groundLocal(wx - gx, wz - gz);

  group.updateMatrixWorld(true);
  const box = new THREE.Box3();
  const items = [];
  const consider = (obj) => {
    if (obj.userData.isTerrain || obj.userData.noSettle || obj.isInstancedMesh || obj.isSprite || obj.isLight) return;
    box.setFromObject(obj);
    if (!isFinite(box.min.y) || box.max.x - box.min.x > radius) return;
    items.push({ obj, box: box.clone() });
  };
  group.children.slice().forEach(consider);
  scene.children.forEach((obj) => {
    if (!obj.userData.settleOn) return;
    if (Math.hypot(obj.position.x - gx, obj.position.z - gz) > radius) return;
    consider(obj);
  });

  // Ground under a footprint, sampled on a grid.
  const footprint = (b) => {
    const sx = b.max.x - b.min.x;
    const sz = b.max.z - b.min.z;
    const nx = Math.min(8, Math.max(2, Math.ceil(sx / 10)));
    const nz = Math.min(8, Math.max(2, Math.ceil(sz / 10)));
    let min = Infinity;
    let max = -Infinity;
    let atSea = 0;
    let total = 0;
    for (let i = 0; i <= nx; i += 1) {
      for (let j = 0; j <= nz; j += 1) {
        const wx = b.min.x + (sx * i) / nx;
        const wz = b.min.z + (sz * j) / nz;
        const y = groundWorld(wx, wz);
        min = Math.min(min, y);
        max = Math.max(max, y);
        // At or past the coastline the terrain function bottoms out at its edge height.
        const angle = Math.atan2(wz - gz, wx - gx);
        const edge = 0.16 + Math.sin(angle * 6 + index + 9) * 1.5 + Math.cos(angle * 11) * 0.8;
        if (y - group.position.y - edge < 0.05) atSea += 1;
        total += 1;
      }
    }
    return { min, max, seaShare: atSea / total };
  };

  // Does anything rest on top of this item? Then moving it would open a gap.
  const supportsSomething = (item) => items.some((other) => other !== item
    && Math.abs(other.box.min.y - item.box.max.y) < 1.5
    && other.box.min.x < item.box.max.x && other.box.max.x > item.box.min.x
    && other.box.min.z < item.box.max.z && other.box.max.z > item.box.min.z);

  let draped = 0;
  let lowered = 0;
  items.forEach((item) => {
    const { obj, box: b } = item;
    const material = obj.material;
    if (material && (material.transparent || material.opacity < 1)) return; // water stays level
    const ground = footprint(b);
    if (ground.seaShare > 0.25) return; // mostly over the beach or the sea (docks, shore rocks)
    const thickness = b.max.y - b.min.y;
    const span = Math.max(b.max.x - b.min.x, b.max.z - b.min.z);

    if (obj.isMesh && thickness < 1.6 && span > 8) {
      if (ground.max - ground.min > 0.3 || Math.abs(b.min.y - ground.min) > 0.4) {
        if (drapeMeshOnGround(obj, group, groundLocal, b.min.y - group.position.y)) draped += 1;
      }
      return;
    }

    const gap = b.min.y - ground.min;              // how far the downhill side hangs
    const aboveHighest = b.min.y - ground.max;     // > 0 everywhere = deliberately raised
    if (gap > 0.5 && aboveHighest < 3 && !supportsSomething(item)) {
      obj.position.y -= gap + SETTLE_SINK;
      lowered += 1;
    }
  });
  return { draped, lowered };
}

// Rebuilds a flat mesh with enough subdivisions to bend, bakes its transform,
// then lifts every vertex so the underside follows the terrain.
function drapeMeshOnGround(mesh, group, groundLocal, bottomLocalY) {
  const geo = mesh.geometry;
  const p = geo.parameters || {};
  const seg = (size) => Math.min(80, Math.max(1, Math.ceil(size / 6)));
  let next = null;
  switch (geo.type) {
    case "BoxGeometry":
    case "BoxBufferGeometry":
      next = new THREE.BoxGeometry(p.width, p.height, p.depth, seg(p.width), 1, seg(p.depth));
      break;
    case "PlaneGeometry":
    case "PlaneBufferGeometry":
      next = new THREE.PlaneGeometry(p.width, p.height, seg(p.width), seg(p.height));
      break;
    case "CircleGeometry":
    case "CircleBufferGeometry":
      next = new THREE.RingGeometry(0.01, p.radius, Math.max(24, p.segments || 24), seg(p.radius));
      break;
    case "RingGeometry":
    case "RingBufferGeometry":
      next = new THREE.RingGeometry(p.innerRadius, p.outerRadius, Math.max(24, p.thetaSegments || 24), seg(p.outerRadius - p.innerRadius));
      break;
    case "CylinderGeometry":
    case "CylinderBufferGeometry": {
      // A thin disc: replace with a subdivided top surface plus its rim.
      const r = Math.max(p.radiusTop, p.radiusBottom);
      next = new THREE.RingGeometry(0.01, r, Math.max(32, p.radialSegments || 32), seg(r));
      next.rotateX(-Math.PI / 2);
      next.translate(0, p.height / 2, 0);
      break;
    }
    default:
      next = geo.clone();
  }

  mesh.updateMatrix();
  next.applyMatrix4(mesh.matrix); // now in the island group's space
  const pos = next.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, pos.getY(i) - bottomLocalY + groundLocal(x, z) + SETTLE_LIFT);
  }
  pos.needsUpdate = true;
  next.computeVertexNormals();
  next.computeBoundingBox();
  next.computeBoundingSphere();
  if (mesh.geometry !== next) mesh.geometry.dispose?.();
  mesh.geometry = next;
  mesh.userData.groundCover = true; // grass avoids it (see collectGrassCovers)
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  mesh.updateMatrix();
  return true;
}

// ── 29-jungle-trees.js ─ Curved rainforest trees with swaying canopies for the jungle island.
//
// Six tree shapes are generated once (curved trunk, buttress roots, branches,
// leaf clusters, vines) and drawn as instanced batches, so the whole forest is a
// handful of draw calls. A shared wind shader bends each tree from the top and
// makes the leaves flutter, driven by the same wind as the grass.

const JUNGLE_TREE_HEIGHT = 150; // nominal height the shapes are built at
const JUNGLE_TREE_VARIANTS = 6;
let jungleTreeVariants = null;
let jungleTreeMaterials = null;

// Small deterministic random generator so every run grows the same forest.
function seededRandom(seed) {
  let state = (seed * 2654435761) >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// A tube swept along a curve whose radius shrinks from r0 to r1.
function makeTaperedTube(curve, segments, radial, r0, r1, color = null) {
  const frames = curve.computeFrenetFrames(segments, false);
  const positions = [];
  const normals = [];
  const colors = [];
  const ring = (i) => {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const r = r0 + (r1 - r0) * Math.pow(t, 0.8);
    const n = frames.normals[i];
    const b = frames.binormals[i];
    const out = [];
    for (let j = 0; j <= radial; j += 1) {
      const a = (j / radial) * Math.PI * 2;
      const nx = Math.cos(a) * n.x + Math.sin(a) * b.x;
      const ny = Math.cos(a) * n.y + Math.sin(a) * b.y;
      const nz = Math.cos(a) * n.z + Math.sin(a) * b.z;
      out.push([p.x + nx * r, p.y + ny * r, p.z + nz * r, nx, ny, nz]);
    }
    return out;
  };
  let prev = ring(0);
  for (let i = 1; i <= segments; i += 1) {
    const cur = ring(i);
    for (let j = 0; j < radial; j += 1) {
      const quad = [prev[j], cur[j], prev[j + 1], cur[j], cur[j + 1], prev[j + 1]];
      quad.forEach((v) => {
        positions.push(v[0], v[1], v[2]);
        normals.push(v[3], v[4], v[5]);
        if (color) colors.push(color.r, color.g, color.b);
      });
    }
    prev = cur;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  if (color) geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geo;
}

// Joins geometries (position/normal[/color]) into one non-indexed geometry.
function mergeSimpleGeometries(list, withColor) {
  const parts = list.map((g) => (g.index ? g.toNonIndexed() : g));
  const total = parts.reduce((n, g) => n + g.attributes.position.count, 0);
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  const col = withColor ? new Float32Array(total * 3) : null;
  let offset = 0;
  parts.forEach((g) => {
    pos.set(g.attributes.position.array, offset * 3);
    nor.set(g.attributes.normal.array, offset * 3);
    if (col) {
      if (g.attributes.color) col.set(g.attributes.color.array, offset * 3);
      else col.fill(1, offset * 3, (offset + g.attributes.position.count) * 3);
    }
    offset += g.attributes.position.count;
  });
  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  if (col) merged.setAttribute("color", new THREE.BufferAttribute(col, 3));
  merged.computeBoundingSphere();
  return merged;
}

function leafCluster(center, radius, color, rand) {
  const geo = new THREE.IcosahedronGeometry(radius, 1).toNonIndexed();
  geo.deleteAttribute("uv");
  // Lumpy, flattened clump.
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i += 1) {
    const k = 0.82 + rand() * 0.3;
    p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.58, p.getZ(i) * k);
  }
  geo.computeVertexNormals();
  geo.translate(center.x, center.y, center.z);
  const colors = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i += 3) {
    // Per-face shade variation, lighter on top.
    const top = p.getY(i) > center.y ? 1.08 : 0.86;
    const v = (0.9 + rand() * 0.18) * top;
    for (let k = 0; k < 3; k += 1) {
      colors[(i + k) * 3] = color.r * v;
      colors[(i + k) * 3 + 1] = color.g * v;
      colors[(i + k) * 3 + 2] = color.b * v;
    }
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

// One tree shape at the nominal height. `straight` keeps the top centred (treehouse tree).
function buildJungleTreeShape(seed, straight = false) {
  const rand = seededRandom(seed + 11);
  const H = JUNGLE_TREE_HEIGHT;
  const bend = straight ? 2 : 12;
  const off = () => (rand() - 0.5) * 2 * bend;
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(off() * 0.4, H * 0.28, off() * 0.4),
    new THREE.Vector3(off(), H * 0.62, off()),
    new THREE.Vector3(straight ? 0 : off() * 0.7, H, straight ? 0 : off() * 0.7),
  ]);
  const bark = [makeTaperedTube(trunkCurve, 22, 10, 7.2, 2.4)];
  const leaves = [];
  const greens = WORLD_PALETTE.foliage.jungleCanopy.map((hex) => worldColor(hex));
  const vineColor = worldColor(0x3c6b2c);

  // Buttress roots flaring out to the ground.
  const rootCount = 5;
  for (let i = 0; i < rootCount; i += 1) {
    const a = (i / rootCount) * Math.PI * 2 + rand() * 0.6;
    const reach = 15 + rand() * 7;
    const root = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(a) * 3, 14 + rand() * 5, Math.sin(a) * 3),
      new THREE.Vector3(Math.cos(a) * reach * 0.55, 5, Math.sin(a) * reach * 0.55),
      new THREE.Vector3(Math.cos(a) * reach, -1.5, Math.sin(a) * reach),
    ]);
    bark.push(makeTaperedTube(root, 8, 6, 3.4, 0.7));
  }

  // Branches curving up and out, each ending in a cluster of leaves.
  const branchCount = 4 + Math.floor(rand() * 2);
  for (let i = 0; i < branchCount; i += 1) {
    const t = 0.52 + rand() * 0.38;
    const start = trunkCurve.getPointAt(t);
    const a = (i / branchCount) * Math.PI * 2 + rand() * 0.8;
    const len = 30 + rand() * 20;
    const mid = start.clone().add(new THREE.Vector3(Math.cos(a) * len * 0.5, len * 0.22, Math.sin(a) * len * 0.5));
    const end = start.clone().add(new THREE.Vector3(Math.cos(a) * len, len * 0.5, Math.sin(a) * len));
    bark.push(makeTaperedTube(new THREE.CatmullRomCurve3([start, mid, end]), 8, 7, 2.6, 0.8));
    for (let k = 0; k < 5; k += 1) {
      const c = end.clone().add(new THREE.Vector3((rand() - 0.5) * 22, rand() * 9 - 2, (rand() - 0.5) * 22));
      leaves.push(leafCluster(c, 15 + rand() * 8, greens[Math.floor(rand() * greens.length)], rand));
    }
    // A hanging vine from some branches.
    if (rand() < 0.6) {
      const drop = 26 + rand() * 30;
      const v0 = mid.clone();
      const vine = new THREE.CatmullRomCurve3([
        v0,
        v0.clone().add(new THREE.Vector3(rand() * 2 - 1, -drop * 0.5, rand() * 2 - 1)),
        v0.clone().add(new THREE.Vector3(rand() * 3 - 1.5, -drop, rand() * 3 - 1.5)),
      ]);
      leaves.push(makeTaperedTube(vine, 6, 4, 0.45, 0.25, vineColor));
    }
  }
  // Crown on top.
  const top = trunkCurve.getPointAt(1);
  for (let k = 0; k < 6; k += 1) {
    const a = (k / 6) * Math.PI * 2 + rand();
    const c = top.clone().add(new THREE.Vector3(Math.cos(a) * 15, 2 + rand() * 8, Math.sin(a) * 15));
    leaves.push(leafCluster(c, 17 + rand() * 7, greens[Math.floor(rand() * greens.length)], rand));
  }
  leaves.push(leafCluster(top.clone().add(new THREE.Vector3(0, 14, 0)), 18, greens[1], rand));

  return { bark: mergeSimpleGeometries(bark, false), leaves: mergeSimpleGeometries(leaves, true) };
}

// Wind: the tree bends from the top (roots stay put) and leaves flutter.
function addTreeWind(material, flutter) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWindTime = windUniforms.uWindTime;
    shader.uniforms.uWindDir = windUniforms.uWindDir;
    shader.uniforms.uWindStrength = windUniforms.uWindStrength;
    shader.vertexShader = `
      uniform float uWindTime;
      uniform vec2 uWindDir;
      uniform float uWindStrength;
    ` + shader.vertexShader.replace(
      "#include <project_vertex>",
      `
      vec4 localPos = vec4(transformed, 1.0);
      vec4 rootLocal = vec4(0.0, 0.0, 0.0, 1.0);
      #ifdef USE_INSTANCING
        localPos = instanceMatrix * localPos;
        rootLocal = instanceMatrix * rootLocal;
      #endif
      vec4 worldPos = modelMatrix * localPos;
      vec4 rootWorld = modelMatrix * rootLocal;
      float h = clamp(transformed.y / ${JUNGLE_TREE_HEIGHT.toFixed(1)}, 0.0, 1.2);
      float phase = rootWorld.x * 0.013 + rootWorld.z * 0.011;
      float sway = (sin(uWindTime * 0.8 + phase) * 1.6 + sin(uWindTime * 1.9 + phase * 2.3) * 0.5) * uWindStrength;
      worldPos.xz += uWindDir * sway * h * h * h;
      ${flutter ? `
      // Leaves flutter a little on top of the sway.
      float f = sin(uWindTime * 3.1 + worldPos.x * 0.21 + worldPos.y * 0.17) * 0.55
              + sin(uWindTime * 4.7 + worldPos.z * 0.19) * 0.3;
      worldPos.xyz += vec3(uWindDir.x, 0.35, uWindDir.y) * f * uWindStrength * smoothstep(0.35, 0.9, h);
      ` : ""}
      vec4 mvPosition = viewMatrix * worldPos;
      gl_Position = projectionMatrix * mvPosition;
      `,
    );
  };
  return material;
}

function getJungleTreeAssets() {
  if (!jungleTreeVariants) {
    jungleTreeVariants = [];
    for (let i = 0; i < JUNGLE_TREE_VARIANTS; i += 1) jungleTreeVariants.push(buildJungleTreeShape(i * 7 + 3));
    jungleTreeMaterials = {
      bark: addTreeWind(new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.jungleBark), roughness: 0.95 }), false),
      leaves: addTreeWind(new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.82, flatShading: true }), true),
    };
    jungleTreeMaterials.bark.userData.surface = "bark";
  }
  return { variants: jungleTreeVariants, materials: jungleTreeMaterials };
}

// Single (non-instanced) tree, used for the treehouse tree. Kept the old signature.
function createJungleTree(height, trunkRadius) {
  const { materials } = getJungleTreeAssets();
  const shape = buildJungleTreeShape(99, true);
  const group = new THREE.Group();
  const bark = new THREE.Mesh(shape.bark, materials.bark);
  bark.castShadow = true;
  bark.receiveShadow = true;
  bark.userData.surface = "bark";
  const leaves = new THREE.Mesh(shape.leaves, materials.leaves);
  leaves.castShadow = true;
  leaves.userData.noSurface = true;
  group.add(bark, leaves);
  const s = height / JUNGLE_TREE_HEIGHT;
  const w = Math.max(s, (trunkRadius / 10) * 1.1);
  group.scale.set(w, s, w);
  return group;
}

// Scatters the forest across the jungle island as instanced batches.
function addJungleForest(group, radius, height, count = 180) {
  const { variants, materials } = getJungleTreeAssets();
  const placements = variants.map(() => []);
  const ground = (x, z) => getLocalSurfaceHeightAt(x, z, radius, height, 1);
  for (let i = 0; i < count; i += 1) {
    const angle = i * 2.399;
    const distance = radius * (0.08 + ((i * 37) % 76) / 100);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const treeHeight = 120 + (i % 7) * 18;
    const s = treeHeight / JUNGLE_TREE_HEIGHT;
    const w = s * (0.85 + ((i * 13) % 7) / 25);
    // Sit the roots on the lowest ground under the tree so none hang on slopes.
    const r = 16 * w;
    const y = Math.min(ground(x, z), ground(x + r, z), ground(x - r, z), ground(x, z + r), ground(x, z - r)) - 0.8;
    placements[i % variants.length].push({ x, y, z, s, w, rot: angle * 1.7 });
    addCollisionCircle(group.position.clone().add(new THREE.Vector3(x, ground(x, z), z)), 6.5 * w, "Jungle tree", { material: "wood", damage: 6 });
  }

  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();
  variants.forEach((shape, v) => {
    const list = placements[v];
    if (!list.length) return;
    // Bounds covering every instance of this shape, so the batch is culled when off-screen
    // (and skipped by the shadow pass when the player is far away).
    const bounds = new THREE.Box3();
    list.forEach((p) => bounds.expandByPoint(new THREE.Vector3(p.x, p.y, p.z)));
    bounds.expandByScalar(JUNGLE_TREE_HEIGHT * 1.6);
    const sphere = bounds.getBoundingSphere(new THREE.Sphere());
    const barkGeo = shape.bark.clone();
    const leafGeo = shape.leaves.clone();
    barkGeo.boundingSphere = sphere;
    leafGeo.boundingSphere = sphere.clone();
    const bark = new THREE.InstancedMesh(barkGeo, materials.bark, list.length);
    const leaves = new THREE.InstancedMesh(leafGeo, materials.leaves, list.length);
    list.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(0, p.rot, 0);
      dummy.scale.set(p.w, p.s, p.w);
      dummy.updateMatrix();
      bark.setMatrixAt(i, dummy.matrix);
      leaves.setMatrixAt(i, dummy.matrix);
      leaves.setColorAt(i, tint.setHSL(0.3 + ((i * 7) % 10) / 160, 0.25, 0.72 + ((i * 3) % 5) / 30));
    });
    [bark, leaves].forEach((mesh) => {
      mesh.instanceMatrix.needsUpdate = true;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = true;
      mesh.userData.noSurface = true;
      mesh.userData.noSettle = true;
    });
    if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true;
    group.add(bark, leaves);
  });
}

// ── 30-static-batching.js ─ Merges static island scenery into a few large meshes at load time.
//
// The islands are built from thousands of small meshes (planks, flowers, window
// frames...) with many identical-looking materials. Each one costs a draw call,
// twice when it casts a shadow. This pass, run once after the world is built:
//   1. reuses one material for meshes whose materials look identical, then
//   2. merges static meshes that share a material into one mesh per area cell,
//      so far-off areas are still culled.
// Anything that moves or is looked up later (animated foliage, windmill sails,
// water, glowing rings, named or tagged objects, instanced grass/trees) is left alone.

const STATIC_BATCH_CELL = 320; // world units per merge cell

const STATIC_SAFE_USERDATA = new Set(["surface", "noSettle", "groundCover", "surfaceScale", "noSurface", "settleOn"]);

function materialSignature(mat) {
  const customShader = mat.onBeforeCompile !== THREE.Material.prototype.onBeforeCompile;
  if (customShader || mat.transparent || mat.userData.unique) return `uuid:${mat.uuid}`;
  const hex = (c) => (c ? c.getHexString() : "-");
  return [
    mat.type, hex(mat.color), hex(mat.emissive), (mat.emissiveIntensity ?? 0).toFixed(3),
    (mat.roughness ?? 0).toFixed(3), (mat.metalness ?? 0).toFixed(3),
    mat.map?.uuid, mat.bumpMap?.uuid, (mat.bumpScale ?? 0).toFixed(3), mat.aoMap?.uuid,
    (mat.aoMapIntensity ?? 0).toFixed(2), mat.normalMap?.uuid, mat.side, mat.flatShading,
    mat.vertexColors, mat.wireframe, mat.opacity,
  ].join("|");
}

function collectDynamicObjects() {
  const dynamic = new Set();
  const addTree = (obj) => obj && obj.traverse((child) => dynamic.add(child));
  animatedFoliage.forEach((item) => addTree(item.mesh));
  animatedWorldObjects.forEach((item) => addTree(item.mesh));
  windmillRotors.forEach((item) => addTree(item.mesh));
  return dynamic;
}

function isBatchable(mesh, dynamic) {
  if (!mesh.isMesh || mesh.isInstancedMesh || mesh.isSkinnedMesh || !mesh.visible) return false;
  if (dynamic.has(mesh) || mesh.name || mesh.userData.isTerrain || mesh.userData.noBatch) return false;
  if (Array.isArray(mesh.material) || mesh.material.transparent || mesh.material.opacity < 1) return false;
  const geo = mesh.geometry;
  if (!geo || !geo.attributes.position || Object.keys(geo.morphAttributes).length) return false;
  // Box/cylinder geometries carry one group per face set; with a single material
  // they're drawn whole anyway, so groups only matter if they skip part of it.
  if (geo.drawRange.count !== Infinity || geo.drawRange.start !== 0) return false;
  for (const key of Object.keys(mesh.userData)) {
    if (!STATIC_SAFE_USERDATA.has(key)) return false;
  }
  // Something up the tree is tagged or animated: leave it be.
  for (let p = mesh.parent; p && !p.userData.isIslandRoot; p = p.parent) {
    if (dynamic.has(p) || p.name || p.userData.noBatch) return false;
  }
  return true;
}

// Concatenates geometries (already in the target space). Missing attributes are zero-filled.
function mergeForBatch(geometries) {
  const names = new Map();
  geometries.forEach((g) => {
    Object.keys(g.attributes).forEach((name) => {
      if (!names.has(name)) names.set(name, g.attributes[name].itemSize);
    });
  });
  const flat = geometries.map((g) => (g.index ? g.toNonIndexed() : g));
  const total = flat.reduce((n, g) => n + g.attributes.position.count, 0);
  const merged = new THREE.BufferGeometry();
  names.forEach((itemSize, name) => {
    const out = new Float32Array(total * itemSize);
    let offset = 0;
    flat.forEach((g) => {
      const attr = g.attributes[name];
      const count = g.attributes.position.count;
      if (attr && attr.itemSize === itemSize) {
        out.set(attr.array.length === count * itemSize ? attr.array : Float32Array.from(attr.array).subarray(0, count * itemSize), offset);
      }
      offset += count * itemSize;
    });
    merged.setAttribute(name, new THREE.BufferAttribute(out, itemSize));
  });
  merged.computeBoundingSphere();
  merged.computeBoundingBox();
  return merged;
}

function batchStaticWorld() {
  const started = performance.now();
  const dynamic = collectDynamicObjects();
  const sharedMaterials = new Map();
  let before = 0;
  let after = 0;

  islands.forEach((island) => {
    const root = island.mesh;
    if (!root) return;
    root.userData.isIslandRoot = true;
    root.updateMatrixWorld(true);
    const toRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const buckets = new Map();
    const victims = [];
    const center = new THREE.Vector3();

    root.traverse((mesh) => {
      if (mesh === root || !isBatchable(mesh, dynamic)) return;
      before += 1;
      // 1. Share identical-looking materials.
      const sig = materialSignature(mesh.material);
      if (!sharedMaterials.has(sig)) sharedMaterials.set(sig, mesh.material);
      const material = sharedMaterials.get(sig);
      // 2. Bucket by material, shadow flags and area cell.
      mesh.getWorldPosition(center);
      const cx = Math.floor(center.x / STATIC_BATCH_CELL);
      const cz = Math.floor(center.z / STATIC_BATCH_CELL);
      const key = `${material.uuid}|${mesh.castShadow ? 1 : 0}${mesh.receiveShadow ? 1 : 0}|${cx},${cz}`;
      if (!buckets.has(key)) buckets.set(key, { material, cast: mesh.castShadow, receive: mesh.receiveShadow, items: [] });
      buckets.get(key).items.push(mesh);
      victims.push(mesh);
    });

    buckets.forEach((bucket) => {
      if (bucket.items.length === 1) {
        // Nothing to merge with; just adopt the shared material.
        bucket.items[0].material = bucket.material;
        victims.splice(victims.indexOf(bucket.items[0]), 1);
        after += 1;
        return;
      }
      const geometries = bucket.items.map((mesh) => {
        const g = mesh.geometry.clone();
        g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(toRoot, mesh.matrixWorld));
        return g;
      });
      const merged = new THREE.Mesh(mergeForBatch(geometries), bucket.material);
      merged.castShadow = bucket.cast;
      merged.receiveShadow = bucket.receive;
      merged.userData.noSurface = true;
      merged.userData.staticBatch = true;
      root.add(merged);
      after += 1;
    });

    victims.forEach((mesh) => mesh.parent && mesh.parent.remove(mesh));
  });

  console.info(`Static batching: ${before} meshes -> ${after} (${sharedMaterials.size} materials) in ${Math.round(performance.now() - started)} ms`);
}

// ── 99-init.js ─ Startup sequence and closes the game closure.
// Initialization
createStatButtons();
renderInventory();
renderAvatarChoices();
createWorld();
enhanceWorldSurfaces(scene, new Set([skyDome, cloudDeck, ocean, ...enemies.map((e) => e.mesh)]));
// Merge static scenery into a few large meshes (far fewer draw calls).
batchStaticWorld();
createPlayer();
initMultiplayerBrowser();
applyAvatarToPlayer();
updateDerivedStats();
updateHud();
resize();
requestAnimationFrame(loop);

// Initialize Authentication & Recovery UI bindings
initAuthSystem();

// Auto-Load Save Game if it exists
checkAndLoadSave();

// Initialize Marketplace listing state
initMarketState();

// Initialize Studio UI event bindings
initAvatarStudioUI();

// Periodic Auto-Save every 5 seconds
setInterval(saveGame, 5000);
const gameLoadStatus = document.querySelector("#game-load-status");
if (gameLoadStatus) gameLoadStatus.hidden = true;
} catch (error) {
  console.error("Sea Legends failed to initialize:", error);
  const status = document.querySelector("#game-load-status");
  const errorPanel = document.querySelector("#game-init-error");
  const errorMessage = document.querySelector("#game-init-error-message");
  if (status) status.hidden = true;
  if (errorMessage) {
    errorMessage.textContent = typeof THREE === "undefined"
      ? "The 3D library could not be loaded. Check your internet connection and allow the Three.js CDN request, then reload."
      : "The game could not initialize. Check WebGL support and browser storage permissions, then reload the page.";
  }
  if (errorPanel) errorPanel.hidden = false;
  document.querySelector("#game-init-retry")?.addEventListener("click", () => window.location.reload());
}
})();

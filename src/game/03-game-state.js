
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

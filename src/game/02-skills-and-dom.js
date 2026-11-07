
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

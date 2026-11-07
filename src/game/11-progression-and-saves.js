
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

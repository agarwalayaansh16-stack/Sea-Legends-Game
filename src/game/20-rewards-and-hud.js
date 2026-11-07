
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

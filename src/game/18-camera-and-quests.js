
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

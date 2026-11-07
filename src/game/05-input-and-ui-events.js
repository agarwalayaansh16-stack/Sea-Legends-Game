
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

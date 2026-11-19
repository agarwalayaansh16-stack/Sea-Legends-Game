// ── 35-tutorial.js ─ First-minute guidance for new players.
//
// A small card walks a new player through moving, looking, jumping, attacking
// and picking up the first quest. Each step completes itself when the player
// does the thing. It shows once per browser and can be skipped.

const TUTORIAL_STORAGE_KEY = "sea-legends-tutorial-done";
const tutorialTouch = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
const TUTORIAL_STEPS = [
  {
    text: tutorialTouch ? "Use the arrow pad to walk around." : "Walk around with <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>.",
    start: (s) => { s.from = playerMesh.position.clone(); s.walked = 0; },
    done: (s) => {
      s.walked += Math.min(20, playerMesh.position.distanceTo(s.from));
      s.from.copy(playerMesh.position);
      return s.walked > 60;
    },
  },
  {
    text: tutorialTouch ? "Drag on the screen to look around." : "Hold <kbd>Right Click</kbd> and drag to look around.",
    start: (s) => { s.yaw = cameraYaw; s.turned = 0; },
    done: (s) => {
      s.turned += Math.abs(cameraYaw - s.yaw);
      s.yaw = cameraYaw;
      return s.turned > 0.6;
    },
  },
  {
    text: tutorialTouch ? "Tap <kbd>Jump</kbd> to jump." : "Press <kbd>Space</kbd> to jump. Hold <kbd>Shift</kbd> to sprint.",
    done: () => !isGrounded,
  },
  {
    text: tutorialTouch ? "Tap <kbd>Attack</kbd> to throw a punch. Keep tapping to chain a combo." : "<kbd>Left Click</kbd> to attack. Keep clicking to chain a combo.",
    done: () => attackCooldown > 0,
  },
  {
    text: tutorialTouch
      ? "Follow the compass at the top to the quest giver and tap <kbd>Interact</kbd>."
      : "Follow the compass at the top to the quest giver and press <kbd>E</kbd>.",
    done: () => quest.active || quest.complete,
  },
  {
    text: tutorialTouch
      ? "Defeat 5 bandits to finish your first quest. Watch for the red flash before an enemy strikes and step away."
      : "Defeat 5 bandits to finish your first quest. Watch for the red flash before an enemy strikes, and step away or block with <kbd>F</kbd>.",
    start: (s) => { s.time = 0; },
    done: (s, dt) => { s.time += dt; return s.time > 9; },
  },
];

const tutorialState = { index: -1, finished: false, card: null, scratch: {}, hold: 0 };
try { tutorialState.finished = localStorage.getItem(TUTORIAL_STORAGE_KEY) === "1"; } catch (err) { /* storage unavailable */ }

function finishTutorial() {
  tutorialState.finished = true;
  tutorialState.card?.remove();
  tutorialState.card = null;
  try { localStorage.setItem(TUTORIAL_STORAGE_KEY, "1"); } catch (err) { /* storage unavailable */ }
}

function showTutorialStep(index) {
  tutorialState.index = index;
  tutorialState.scratch = {};
  const step = TUTORIAL_STEPS[index];
  step.start?.(tutorialState.scratch);
  if (!tutorialState.card) {
    const card = document.createElement("div");
    card.id = "tutorial-card";
    card.className = "tutorial-card";
    card.innerHTML = '<div class="tutorial-count"></div><p class="tutorial-text"></p><button type="button" class="tutorial-skip">Skip tutorial</button>';
    card.querySelector(".tutorial-skip").addEventListener("click", finishTutorial);
    (document.querySelector("#hud") || document.body).append(card);
    tutorialState.card = card;
  }
  tutorialState.card.querySelector(".tutorial-count").textContent = `Getting started ${index + 1}/${TUTORIAL_STEPS.length}`;
  tutorialState.card.querySelector(".tutorial-text").innerHTML = tr(step.text);
  tutorialState.card.classList.remove("tutorial-done");
}

// Re-shows the current step after the language changes (36-i18n.js).
function refreshTutorialText() {
  if (!tutorialState.card || tutorialState.index < 0) return;
  tutorialState.card.querySelector(".tutorial-text").innerHTML = tr(TUTORIAL_STEPS[tutorialState.index].text);
}

function updateTutorial(dt) {
  if (tutorialState.finished || !playerMesh) return;
  if (tutorialState.index < 0) {
    // Only brand-new characters get the tutorial.
    if (player.level > 1 || quest.complete || quest.active) { finishTutorial(); return; }
    showTutorialStep(0);
    return;
  }
  if (tutorialState.hold > 0) {
    // Brief "done" tick before the next step appears.
    tutorialState.hold -= dt;
    if (tutorialState.hold <= 0) {
      if (tutorialState.index + 1 >= TUTORIAL_STEPS.length) finishTutorial();
      else showTutorialStep(tutorialState.index + 1);
    }
    return;
  }
  if (TUTORIAL_STEPS[tutorialState.index].done(tutorialState.scratch, dt)) {
    tutorialState.card?.classList.add("tutorial-done");
    tutorialState.hold = 0.7;
  }
}

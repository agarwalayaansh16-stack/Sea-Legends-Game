
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
// Loading finished: the loading screen offers a Play button instead of the progress bar.
const loadingScreen = document.querySelector("#loading-screen");
const loadingPlay = document.querySelector("#loading-play");
const loadingVideo = document.querySelector("#loading-video");
const loadingSound = document.querySelector("#loading-sound");
if (loadingVideo) {
  // Some browsers hold back autoplay until the page is interactive; nudge it.
  loadingVideo.muted = true;
  loadingVideo.play?.().catch(() => {});
}
loadingSound?.addEventListener("click", () => {
  if (!loadingVideo) return;
  loadingVideo.muted = !loadingVideo.muted;
  if (!loadingVideo.muted) loadingVideo.play?.().catch(() => {});
  loadingSound.setAttribute("aria-pressed", String(!loadingVideo.muted));
});
// "Introduction" opens the home page's intro text (below the game, which the
// page no longer scrolls to) as a panel over the loading screen.
function setupIntroPanel() {
const introSection = document.querySelector(".home-content");
const introButton = document.querySelector("#loading-intro");
if (introSection && introButton && !introButton.dataset.ready) {
  introButton.dataset.ready = "1";
  introButton.hidden = false;
  const backdrop = document.createElement("div");
  backdrop.className = "intro-backdrop";
  backdrop.hidden = true;
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "intro-close";
  closeButton.setAttribute("aria-label", "Close introduction");
  closeButton.textContent = "✕";
  introSection.prepend(closeButton);
  document.body.append(backdrop);
  const closeIntro = () => {
    introSection.classList.remove("is-panel-open");
    introSection.removeAttribute("role");
    introSection.removeAttribute("aria-modal");
    backdrop.hidden = true;
    introButton.focus({ preventScroll: true });
  };
  introButton.addEventListener("click", () => {
    introSection.classList.add("is-panel-open");
    introSection.setAttribute("role", "dialog");
    introSection.setAttribute("aria-modal", "true");
    introSection.scrollTop = 0;
    backdrop.hidden = false;
    closeButton.focus({ preventScroll: true });
  });
  closeButton.addEventListener("click", closeIntro);
  backdrop.addEventListener("click", closeIntro);
  // "Play the game above" inside the intro just closes the panel.
  introSection.querySelectorAll('a[href="#game-root"]').forEach((link) => {
    link.addEventListener("click", (event) => { event.preventDefault(); closeIntro(); });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && introSection.classList.contains("is-panel-open")) {
      event.stopPropagation();
      closeIntro();
    }
  }, true);
}
}
// The intro is part of the page around the game; wait for it if it isn't there yet.
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupIntroPanel);
else setupIntroPanel();

if (loadingScreen && loadingPlay) {
  loadingScreen.classList.add("is-ready");
  loadingPlay.hidden = false;
  loadingPlay.addEventListener("click", () => {
    loadingScreen.classList.add("is-leaving");
    if (loadingVideo) loadingVideo.muted = true;
    setTimeout(() => {
      loadingScreen.hidden = true;
      // Free the video once it's out of sight.
      if (loadingVideo) {
        loadingVideo.pause();
        loadingVideo.removeAttribute("src");
        loadingVideo.querySelectorAll("source").forEach((source) => source.remove());
        loadingVideo.load();
      }
    }, 600);
  });
  loadingPlay.focus({ preventScroll: true });
} else if (loadingScreen) {
  loadingScreen.hidden = true;
}
} catch (error) {
  console.error("Sea Legends failed to initialize:", error);
  const status = document.querySelector("#game-load-status");
  const errorPanel = document.querySelector("#game-init-error");
  const errorMessage = document.querySelector("#game-init-error-message");
  if (status) status.hidden = true;
  const loadingScreenEl = document.querySelector("#loading-screen");
  if (loadingScreenEl) loadingScreenEl.hidden = true;
  if (errorMessage) {
    errorMessage.textContent = typeof THREE === "undefined"
      ? "The 3D library could not be loaded. Check your internet connection and allow the Three.js CDN request, then reload."
      : "The game could not initialize. Check WebGL support and browser storage permissions, then reload the page.";
  }
  if (errorPanel) errorPanel.hidden = false;
  document.querySelector("#game-init-retry")?.addEventListener("click", () => window.location.reload());
}
})();

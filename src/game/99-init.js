
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

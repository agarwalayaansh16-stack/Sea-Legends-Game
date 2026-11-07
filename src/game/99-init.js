
// ── 99-init.js ─ Startup sequence and closes the game closure.
// Initialization
createStatButtons();
renderInventory();
renderAvatarChoices();
createWorld();
enhanceWorldSurfaces(scene, new Set([skyDome, cloudDeck, ocean, ...enemies.map((e) => e.mesh)]));
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

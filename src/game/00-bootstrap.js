// ── 00-bootstrap.js ─ Opens the game closure and shows load/runtime errors to the player.
// Keep initialization errors visible to players while preserving their details in the console.
(function bootstrapSeaLegends() {
try {
  const showGameError = (message) => {
    const status = document.querySelector("#game-load-status");
    const errorPanel = document.querySelector("#game-init-error");
    const errorMessage = document.querySelector("#game-init-error-message");
    if (status) status.hidden = true;
    if (errorMessage) errorMessage.textContent = message;
    if (errorPanel) errorPanel.hidden = false;
  };
  window.addEventListener("error", (event) => {
    console.error("Sea Legends runtime error:", event.error || event.message);
    showGameError("A game error stopped part of the experience. Reload the page to try again.");
  });
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Sea Legends async error:", event.reason);
    showGameError("A game resource or task failed. Check your connection and reload the page.");
  });
  document.querySelector("#game-init-retry")?.addEventListener("click", () => window.location.reload());

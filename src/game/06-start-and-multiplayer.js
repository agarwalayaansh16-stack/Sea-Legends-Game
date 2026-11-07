
// ── 06-start-and-multiplayer.js ─ Game start and the optional WebSocket multiplayer client.
function startGame(faction) {
  audio.init();
  player.faction = faction;
  if (faction === "Marines") {
    player.stats.defense += 1;
  }
  saveSelectedAvatar();
  factionScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  document.querySelector("#mobile-controls")?.classList.remove("hidden");
  setGameScrollLock(true);
  gameStarted = true;
  connectMultiplayer();
  checkNewQuestUnlocks();
  setWeapon(player.weapon);
  log(`You joined as ${faction}. Welcome to the First Sea.`);
  updateDerivedStats();
  updateHud();
  saveGame();
}

function setGameScrollLock(locked) {
  document.documentElement.classList.toggle("game-active", locked);
  document.body.classList.toggle("game-active", locked);
  if (locked) window.scrollTo(0, 0);
}

function setMultiplayerStatus(message, state = "idle") {
  if (!multiplayerStatus) return;
  multiplayerStatus.textContent = message;
  multiplayerStatus.dataset.state = state;
}

function multiplayerSend(message) {
  if (multiplayerState.socket?.readyState === WebSocket.OPEN) {
    multiplayerState.socket.send(JSON.stringify(message));
    return true;
  }
  return false;
}

function currentMultiplayerProfile() {
  const avatar = getSelectedAvatar() || DEFAULT_AVATARS[0];
  return {
    name: currentUsername || avatar.name || "Sailor",
    faction: player.faction,
    avatar,
    position: playerMesh ? { x: playerMesh.position.x, y: playerMesh.position.y, z: playerMesh.position.z } : { x: 0, y: STARTER_SURFACE_Y, z: 0 },
    rotation: playerMesh?.rotation.y || 0,
    weapon: player.weapon,
  };
}

// Automatic reconnects back off and then stop, so a missing server doesn't spam errors.
const MULTIPLAYER_MAX_AUTO_RETRIES = 3;
const multiplayerRetry = { failures: 0, everConnected: false };

function multiplayerOfflineHint() {
  const local = /^wss?:\/\/(localhost|127\.0\.0\.1)/.test(multiplayerUrl);
  return local
    ? "The multiplayer server isn't running. Start it in a second terminal with \"npm run multiplayer\", then press Servers to connect. Single-player works without it."
    : "The multiplayer servers can't be reached right now. You can keep playing solo; press Servers to try again.";
}

// Called from buttons: the player asked to connect, so try again even after giving up.
function connectMultiplayerManually(serverId) {
  multiplayerRetry.failures = 0;
  connectMultiplayer(serverId);
}

function connectMultiplayer(serverId = multiplayerState.targetServerId) {
  if (!multiplayerUrl || typeof WebSocket === "undefined") {
    setMultiplayerStatus("Multiplayer not configured", "error");
    if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = "Online servers are not configured for this site yet.";
    return;
  }
  if (multiplayerState.socket?.readyState === WebSocket.OPEN) {
    multiplayerState.targetServerId = serverId || null;
    multiplayerSend({ type: "join", ...currentMultiplayerProfile(), serverId: serverId || "" });
    multiplayerSend({ type: "list" });
    return;
  }
  if (multiplayerState.socket?.readyState === WebSocket.CONNECTING) return;
  clearTimeout(multiplayerState.reconnectTimer);
  multiplayerState.manualDisconnect = false;
  multiplayerState.targetServerId = serverId || null;
  setMultiplayerStatus("Connecting to servers…", "connecting");
  if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = "Connecting to the multiplayer service…";

  let socket;
  try { socket = new WebSocket(multiplayerUrl); }
  catch (error) {
    console.warn("Could not open multiplayer connection:", error?.message || error);
    setMultiplayerStatus("Servers offline", "error");
    return;
  }
  let opened = false;
  multiplayerState.socket = socket;
  socket.addEventListener("open", () => {
    if (multiplayerState.socket !== socket) return;
    opened = true;
    multiplayerRetry.failures = 0;
    multiplayerRetry.everConnected = true;
    multiplayerSend({ type: "join", ...currentMultiplayerProfile(), serverId: multiplayerState.targetServerId || "" });
  });
  socket.addEventListener("message", (event) => {
    if (multiplayerState.socket !== socket) return;
    let message;
    try { message = JSON.parse(event.data); } catch (error) {
      console.warn("Ignored an invalid multiplayer message:", error);
      return;
    }
    handleMultiplayerMessage(message);
  });
  // A WebSocket error event carries no details (it logs as "{}"); the close handler
  // below decides what to do, so this only notes it quietly.
  socket.addEventListener("error", () => {
    if (multiplayerState.socket !== socket) return;
    if (multiplayerRetry.failures === 0) console.warn(`Multiplayer server not reachable at ${multiplayerUrl}. Playing offline.`);
  });
  socket.addEventListener("close", () => {
    if (multiplayerState.socket !== socket) return;
    multiplayerState.socket = null;
    multiplayerState.clientId = null;
    multiplayerState.serverId = null;
    clearRemotePlayers();
    if (multiplayerState.manualDisconnect || !gameStarted) {
      setMultiplayerStatus("Offline", "idle");
      return;
    }
    if (!opened) multiplayerRetry.failures += 1;
    if (multiplayerRetry.failures > MULTIPLAYER_MAX_AUTO_RETRIES) {
      setMultiplayerStatus("Servers offline", "error");
      if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = multiplayerOfflineHint();
      return;
    }
    // 2.5s, 5s, 10s ... capped at 30s.
    const delay = Math.min(30000, 2500 * Math.pow(2, Math.max(0, multiplayerRetry.failures - 1)));
    setMultiplayerStatus(opened ? "Disconnected · reconnecting" : "Servers offline · retrying", "error");
    multiplayerState.reconnectTimer = setTimeout(() => connectMultiplayer(multiplayerState.targetServerId), delay);
  });
}

function handleMultiplayerMessage(message) {
  if (message.type === "server-list") {
    renderMultiplayerServers(Array.isArray(message.servers) ? message.servers : []);
    return;
  }
  if (message.type === "joined") {
    multiplayerState.clientId = message.id;
    multiplayerState.serverId = message.server?.id || null;
    multiplayerState.serverName = message.server?.name || "World server";
    multiplayerState.targetServerId = multiplayerState.serverId;
    const count = message.server?.players ?? 1;
    const capacity = message.server?.capacity ?? 10;
    setMultiplayerStatus(`${multiplayerState.serverName} · ${count}/${capacity}`, "connected");
    if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = `Connected to ${multiplayerState.serverName}. Players in this server: ${count}/${capacity}.`;
    (message.players || []).forEach(upsertRemotePlayer);
    multiplayerSend({ type: "list" });
    return;
  }
  if (message.type === "player-joined") {
    upsertRemotePlayer(message.player);
    return;
  }
  if (message.type === "player-state") {
    upsertRemotePlayer(message.player);
    return;
  }
  if (message.type === "player-left") {
    removeRemotePlayer(message.id);
    return;
  }
  if (message.type === "server-error") {
    if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = message.message || "The server could not complete that request.";
    if (!multiplayerState.serverId && multiplayerState.targetServerId) {
      setMultiplayerStatus("Server unavailable", "error");
      multiplayerState.targetServerId = null;
      multiplayerSend({ type: "join", ...currentMultiplayerProfile(), serverId: "" });
    } else if (multiplayerState.serverId) {
      multiplayerSend({ type: "list" });
    } else {
      setMultiplayerStatus("Server unavailable", "error");
    }
  }
}

function upsertRemotePlayer(data) {
  if (!data || !data.id || data.id === multiplayerState.clientId || !data.position) return;
  let remote = multiplayerState.players.get(data.id);
  if (!remote) {
    const avatar = { ...DEFAULT_AVATARS[0], ...(data.avatar || {}), name: String(data.name || "Sailor").slice(0, 18) };
    const mesh = createHumanAvatarModel(avatar, { showName: true, showSword: false });
    mesh.userData.remotePlayerId = data.id;
    scene.add(mesh);
    remote = { mesh, target: new THREE.Vector3(data.position.x, data.position.y, data.position.z), targetYaw: Number(data.rotation) || 0 };
    multiplayerState.players.set(data.id, remote);
  } else {
    remote.target.set(data.position.x, data.position.y, data.position.z);
    remote.targetYaw = Number(data.rotation) || 0;
  }
}

function disposeRemoteMesh(mesh) {
  mesh.traverse((object) => {
    object.geometry?.dispose?.();
    const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => { if (value?.isTexture) value.dispose(); });
      material.dispose?.();
    });
  });
}

function removeRemotePlayer(id) {
  const remote = multiplayerState.players.get(id);
  if (!remote) return;
  scene.remove(remote.mesh);
  disposeRemoteMesh(remote.mesh);
  multiplayerState.players.delete(id);
}

function clearRemotePlayers() {
  for (const id of [...multiplayerState.players.keys()]) removeRemotePlayer(id);
}

function renderMultiplayerServers(servers) {
  if (!multiplayerServerList) return;
  const currentServer = servers.find((server) => server.id === multiplayerState.serverId);
  if (currentServer) {
    setMultiplayerStatus(`${currentServer.name} · ${currentServer.players}/${currentServer.capacity}`, "connected");
    if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = `Connected to ${currentServer.name}. Players in this server: ${currentServer.players}/${currentServer.capacity}.`;
  }
  multiplayerServerList.replaceChildren();
  if (servers.length === 0) {
    const empty = document.createElement("p");
    empty.className = "multiplayer-browser-message";
    empty.textContent = "No active servers yet. Find an open server to create one.";
    multiplayerServerList.append(empty);
    return;
  }
  servers.forEach((server) => {
    const card = document.createElement("div");
    card.className = "multiplayer-server-card";
    const label = document.createElement("span");
    label.textContent = `${server.name} · ${server.players}/${server.capacity}`;
    const join = document.createElement("button");
    const isFull = server.players >= server.capacity;
    join.type = "button";
    join.textContent = isFull ? "Full" : server.id === multiplayerState.serverId ? "Current" : "Join";
    join.disabled = isFull || server.id === multiplayerState.serverId;
    join.addEventListener("click", () => connectMultiplayerManually(server.id));
    card.append(label, join);
    multiplayerServerList.append(card);
  });
}

function initMultiplayerBrowser() {
  multiplayerOpenButton?.addEventListener("click", () => {
    multiplayerBrowser?.classList.remove("hidden");
    if (!multiplayerUrl) {
      setMultiplayerStatus("Multiplayer not configured", "error");
      if (multiplayerBrowserMessage) multiplayerBrowserMessage.textContent = "No multiplayer endpoint is configured. The site owner must set NEXT_PUBLIC_MULTIPLAYER_URL to the multiplayer WebSocket address.";
      return;
    }
    multiplayerSend({ type: "list" });
    if (!multiplayerState.socket || multiplayerState.socket.readyState === WebSocket.CLOSED) connectMultiplayerManually();
  });
  multiplayerCloseButton?.addEventListener("click", () => multiplayerBrowser?.classList.add("hidden"));
  multiplayerQuickJoinButton?.addEventListener("click", () => connectMultiplayerManually());
}

function stopMultiplayer() {
  multiplayerState.manualDisconnect = true;
  clearTimeout(multiplayerState.reconnectTimer);
  if (multiplayerState.socket) {
    const socket = multiplayerState.socket;
    multiplayerState.socket = null;
    socket.close(1000, "Player left the game");
  }
  multiplayerState.clientId = null;
  multiplayerState.serverId = null;
  clearRemotePlayers();
  setMultiplayerStatus("Offline", "idle");
}

function updateMultiplayer(dt, time) {
  if (multiplayerState.socket?.readyState === WebSocket.OPEN) {
    if (time - multiplayerState.lastSentAt >= 100 && playerMesh) {
      multiplayerState.lastSentAt = time;
      multiplayerSend({
        type: "state",
        position: { x: playerMesh.position.x, y: playerMesh.position.y, z: playerMesh.position.z },
        rotation: playerMesh.rotation.y,
        weapon: player.weapon,
      });
    }
  }
  for (const remote of multiplayerState.players.values()) {
    remote.mesh.position.lerp(remote.target, Math.min(1, dt * 12));
    const yawDelta = Math.atan2(Math.sin(remote.targetYaw - remote.mesh.rotation.y), Math.cos(remote.targetYaw - remote.mesh.rotation.y));
    remote.mesh.rotation.y += yawDelta * Math.min(1, dt * 12);
  }
}

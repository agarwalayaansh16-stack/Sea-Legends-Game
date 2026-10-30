"use strict";

const http = require("http");
const { randomUUID } = require("crypto");
const { WebSocketServer, WebSocket } = require("next/dist/compiled/ws");

const port = Number(process.env.MULTIPLAYER_PORT) || 3010;
const maxPlayersPerServer = 10;
const allowedOrigins = new Set((process.env.MULTIPLAYER_ALLOWED_ORIGINS || "")
  .split(",").map((origin) => origin.trim()).filter(Boolean));
const rooms = new Map();
let roomSequence = 0;

const httpServer = http.createServer((request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host || "localhost"}`).pathname;
  if (request.method === "GET" && (pathname === "/health" || pathname === "/servers")) {
    const body = JSON.stringify(pathname === "/health"
      ? { status: "ok", activeServers: rooms.size, activePlayers: countPlayers(), maxPlayersPerServer }
      : { servers: listServers() });
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" });
    response.end(body);
    return;
  }
  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

const webSocketServer = new WebSocketServer({ noServer: true, maxPayload: 12 * 1024 });

httpServer.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host || "localhost"}`).pathname;
  const origin = request.headers.origin;
  if (pathname !== "/multiplayer" || (allowedOrigins.size && !allowedOrigins.has(origin))) {
    socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
    socket.destroy();
    return;
  }
  webSocketServer.handleUpgrade(request, socket, head, (client) => webSocketServer.emit("connection", client, request));
});

function send(client, message) {
  if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(message));
}

function roomSnapshot(room) {
  return {
    id: room.id,
    name: room.name,
    players: room.clients.size,
    capacity: maxPlayersPerServer,
  };
}

function listServers() {
  return [...rooms.values()].map(roomSnapshot).sort((a, b) => a.id.localeCompare(b.id));
}

function countPlayers() {
  return [...rooms.values()].reduce((total, room) => total + room.clients.size, 0);
}

function broadcastServerList() {
  const message = { type: "server-list", servers: listServers() };
  for (const client of webSocketServer.clients) send(client, message);
}

function broadcast(room, message, except = null) {
  for (const client of room.clients.keys()) {
    if (client !== except) send(client, message);
  }
}

function makeRoom() {
  roomSequence += 1;
  const number = String(roomSequence).padStart(2, "0");
  const room = { id: `first-sea-${number}`, name: `First Sea Server ${number}`, clients: new Map() };
  rooms.set(room.id, room);
  return room;
}

function cleanName(value) {
  const name = String(value || "Sailor").replace(/[<>\u0000-\u001f\u007f]/g, "").trim().slice(0, 18);
  return name || "Sailor";
}

function cleanColor(value, fallback) {
  return /^#[\da-f]{6}$/i.test(value || "") ? value : fallback;
}

function cleanAvatar(value, name) {
  const avatar = value && typeof value === "object" ? value : {};
  return {
    name,
    skin: cleanColor(avatar.skin, "#eed2b8"),
    shirt: cleanColor(avatar.shirt, "#223745"),
    pants: cleanColor(avatar.pants, "#4d4637"),
    hair: cleanColor(avatar.hair, "#8e4e24"),
    eyes: cleanColor(avatar.eyes, "#1f3c5b"),
    boots: cleanColor(avatar.boots, "#3d2616"),
    leftArmColor: cleanColor(avatar.leftArmColor, cleanColor(avatar.shirt, "#223745")),
    rightArmColor: cleanColor(avatar.rightArmColor, cleanColor(avatar.shirt, "#223745")),
    leftLegColor: cleanColor(avatar.leftLegColor, cleanColor(avatar.pants, "#4d4637")),
    rightLegColor: cleanColor(avatar.rightLegColor, cleanColor(avatar.pants, "#4d4637")),
    beltColor: cleanColor(avatar.beltColor, "#3d2616"),
    capeColor: cleanColor(avatar.capeColor, "#a82020"),
    hairStyle: ["short", "spiky", "cap", "messy"].includes(avatar.hairStyle) ? avatar.hairStyle : "short",
    outfit: ["sailor", "coat", "armor", "adventurer"].includes(avatar.outfit) ? avatar.outfit : "sailor",
    capeStyle: ["none", "normal", "long", "torn"].includes(avatar.capeStyle) ? avatar.capeStyle : "none",
    height: Math.max(85, Math.min(125, Number(avatar.height) || 100)),
    build: Math.max(80, Math.min(130, Number(avatar.build) || 100)),
  };
}

function cleanPosition(value) {
  const vector = value && typeof value === "object" ? value : {};
  const coordinates = [Number(vector.x), Number(vector.y), Number(vector.z)];
  if (!coordinates.every(Number.isFinite) || coordinates.some((coordinate) => Math.abs(coordinate) > 100000)) return null;
  return { x: coordinates[0], y: coordinates[1], z: coordinates[2] };
}

function playerSnapshot(record) {
  return {
    id: record.id,
    name: record.name,
    faction: record.faction,
    avatar: record.avatar,
    position: record.position,
    rotation: record.rotation,
    weapon: record.weapon,
  };
}

function leaveRoom(client) {
  const room = client.room;
  const record = client.multiplayerRecord;
  if (!room || !record) return;
  room.clients.delete(client);
  client.room = null;
  client.multiplayerRecord = null;
  broadcast(room, { type: "player-left", id: record.id });
  if (room.clients.size === 0) rooms.delete(room.id);
  broadcastServerList();
}

function joinRoom(client, request) {
  const targetId = typeof request.serverId === "string" ? request.serverId : "";
  let room = targetId ? rooms.get(targetId) : null;
  if (targetId && (!room || (room.clients.size >= maxPlayersPerServer && room !== client.room))) {
    send(client, { type: "server-error", message: room ? "That server is full. Choose one with an open slot." : "That server is no longer available. Refresh the server list." });
    return;
  }
  if (!targetId) {
    room = [...rooms.values()].find((candidate) => candidate.clients.size < maxPlayersPerServer && candidate !== client.room);
    if (!room && client.room && client.room.clients.size < maxPlayersPerServer) room = client.room;
    if (!room) room = makeRoom();
  }
  if (room === client.room) {
    send(client, { type: "joined", id: client.multiplayerRecord.id, server: roomSnapshot(room), players: [...room.clients.values()].map(playerSnapshot) });
    send(client, { type: "server-list", servers: listServers() });
    return;
  }

  leaveRoom(client);
  const name = cleanName(request.name);
  const faction = ["Pirates", "Marines", "Neutral"].includes(request.faction) ? request.faction : "Neutral";
  const record = {
    id: randomUUID(),
    name,
    faction,
    avatar: cleanAvatar(request.avatar, name),
    position: cleanPosition(request.position) || { x: 0, y: 38.5, z: 0 },
    rotation: Number.isFinite(Number(request.rotation)) ? Number(request.rotation) : 0,
    weapon: ["melee", "sword", "gun", "special"].includes(request.weapon) ? request.weapon : "melee",
  };
  client.room = room;
  client.multiplayerRecord = record;
  room.clients.set(client, record);
  send(client, { type: "joined", id: record.id, server: roomSnapshot(room), players: [...room.clients.values()].filter((item) => item.id !== record.id).map(playerSnapshot) });
  broadcast(room, { type: "player-joined", player: playerSnapshot(record) }, client);
  broadcastServerList();
  console.log(`${record.name} joined ${room.name} (${room.clients.size}/${maxPlayersPerServer})`);
}

webSocketServer.on("connection", (client) => {
  client.room = null;
  client.multiplayerRecord = null;
  client.messageWindow = Date.now();
  client.messageCount = 0;
  client.isAlive = true;
  client.on("pong", () => { client.isAlive = true; });

  client.on("message", (data) => {
    const now = Date.now();
    if (now - client.messageWindow > 1000) {
      client.messageWindow = now;
      client.messageCount = 0;
    }
    client.messageCount += 1;
    if (client.messageCount > 35) {
      client.close(1008, "Message rate exceeded");
      return;
    }

    let message;
    try { message = JSON.parse(data.toString()); } catch { return; }
    if (!message || typeof message.type !== "string") return;
    if (message.type === "join") {
      joinRoom(client, message);
      return;
    }
    if (message.type === "list") {
      send(client, { type: "server-list", servers: listServers() });
      return;
    }
    if (message.type === "state" && client.room && client.multiplayerRecord) {
      const position = cleanPosition(message.position);
      if (!position) return;
      const record = client.multiplayerRecord;
      record.position = position;
      record.rotation = Math.max(-Math.PI * 100, Math.min(Math.PI * 100, Number(message.rotation) || 0));
      record.weapon = ["melee", "sword", "gun", "special"].includes(message.weapon) ? message.weapon : "melee";
      broadcast(client.room, { type: "player-state", player: playerSnapshot(record) }, client);
    }
  });

  client.on("close", () => leaveRoom(client));
  client.on("error", (error) => console.warn("Multiplayer connection error:", error.message));
});

const heartbeat = setInterval(() => {
  for (const client of webSocketServer.clients) {
    if (!client.isAlive) {
      client.terminate();
      continue;
    }
    client.isAlive = false;
    client.ping();
  }
}, 30000);

httpServer.listen(port, () => {
  console.log(`Sea Legends multiplayer server listening on port ${port} (maximum ${maxPlayersPerServer} players per world server).`);
});

function shutdown() {
  clearInterval(heartbeat);
  for (const client of webSocketServer.clients) client.close(1001, "Server shutting down");
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

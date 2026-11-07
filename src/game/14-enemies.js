
// ── 14-enemies.js ─ Enemy camps, bosses and enemy weapons.
function createBanditCamp() {
  const spots = [
    [-155, STARTER_SURFACE_Y, -78],
    [-210, STARTER_SURFACE_Y, 42],
    [-92, STARTER_SURFACE_Y, 168],
    [84, STARTER_SURFACE_Y, -182],
    [218, STARTER_SURFACE_Y, -64],
    [145, STARTER_SURFACE_Y, 158],
  ];

  spots.forEach((spot, index) => spawnBandit(new THREE.Vector3(...spot), index));
}

function spawnPirateCamp(island) {
  const center = island.position;
  for (let i = 0; i < 6; i += 1) {
    const angle = i * 1.05;
    const px = Math.cos(angle) * 230;
    const pz = Math.sin(angle) * 230;
    const spawnPos = center.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "pirate");
  }
}

function spawnBruteCamp(island) {
  const center = island.position.clone().add(new THREE.Vector3(-260, 0, 210));
  for (let i = 0; i < 4; i += 1) {
    const angle = i * 1.5;
    const px = Math.cos(angle) * 150;
    const pz = Math.sin(angle) * 150;
    const spawnPos = center.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "brute");
  }
}

function spawnJungleCamps(island) {
  const center = island.position;

  // Spawn 5 Monkeys in a camp/bunch
  const monkeyCenter = center.clone().add(new THREE.Vector3(-250, 0, -250));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 100;
    const pz = Math.sin(angle) * 100;
    const spawnPos = monkeyCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "monkey");
  }

  // Spawn 5 Gorillas in a camp/bunch
  const gorillaCenter = center.clone().add(new THREE.Vector3(250, 0, -250));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 120;
    const pz = Math.sin(angle) * 120;
    const spawnPos = gorillaCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "gorilla");
  }

  // Spawn 1 Gorilla King (Boss)
  const gkPos = center.clone().add(new THREE.Vector3(0, 0, 200));
  gkPos.y = getIslandSurfaceHeightAt(gkPos.x, gkPos.z, island);
  spawnAdvancedEnemy(gkPos, 0, "gorilla_king");
}

function spawnDesertCamps(island) {
  const center = island.position;
  
  // Spawn 5 Desert Bandits in a bunch
  const banditCenter = center.clone().add(new THREE.Vector3(200, 0, -150));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 120;
    const pz = Math.sin(angle) * 120;
    const spawnPos = banditCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "desert_bandit");
  }

  // Spawn 5 Desert Officers in a bunch
  const officerCenter = center.clone().add(new THREE.Vector3(-200, 0, 150));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 120;
    const pz = Math.sin(angle) * 120;
    const spawnPos = officerCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "desert_officer");
  }
}

function spawnSnowyCamps(island) {
  const center = island.position;

  // Spawn 5 Frozen Bandits in a bunch (West side)
  const banditCenter = center.clone().add(new THREE.Vector3(-250, 0, -150));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 110;
    const pz = Math.sin(angle) * 110;
    const spawnPos = banditCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "frozen_bandit");
  }

  // Spawn 5 Snowmen in a bunch (East side)
  const snowmanCenter = center.clone().add(new THREE.Vector3(250, 0, -150));
  for (let i = 0; i < 5; i += 1) {
    const angle = i * (Math.PI * 2 / 5);
    const px = Math.cos(angle) * 110;
    const pz = Math.sin(angle) * 110;
    const spawnPos = snowmanCenter.clone().add(new THREE.Vector3(px, 0, pz));
    spawnPos.y = getIslandSurfaceHeightAt(spawnPos.x, spawnPos.z, island);
    spawnAdvancedEnemy(spawnPos, i, "snowman");
  }

  // Spawn 1 Yeti Boss (North side)
  const yetiPos = center.clone().add(new THREE.Vector3(0, 0, 250));
  yetiPos.y = getIslandSurfaceHeightAt(yetiPos.x, yetiPos.z, island);
  spawnAdvancedEnemy(yetiPos, 0, "yeti");
}

function spawnAdvancedEnemy(position, index, type) {
  const group = new THREE.Group();
  group.position.copy(position);
  const isBrute = type === "brute";
  const isBoss = type === "buggy";
  const isOfficer = type === "desert_officer";
  const isDesertBandit = type === "desert_bandit";
  const isGorillaKing = type === "gorilla_king";
  const isGorilla = type === "gorilla";
  const isMonkey = type === "monkey";
  const isFrozenBandit = type === "frozen_bandit";
  const isSnowman = type === "snowman";
  const isYeti = type === "yeti";

  let name = `Pirate ${index + 1}`;
  if (isBoss) name = "Jester";
  else if (isBrute) name = `Brute ${index + 1}`;
  else if (isOfficer) name = `Desert Officer ${index + 1}`;
  else if (isDesertBandit) name = `Desert Bandit ${index + 1}`;
  else if (isGorillaKing) name = "Gorilla King";
  else if (isGorilla) name = `Gorilla ${index + 1}`;
  else if (isMonkey) name = `Monkey ${index + 1}`;
  else if (isFrozenBandit) name = `Frozen Bandit ${index + 1}`;
  else if (isSnowman) name = `Snowman ${index + 1}`;
  else if (isYeti) name = "Yeti";

  let skinColor = "#b97852";
  let shirtColor = "#722b30";
  let pantsColor = "#222a34";
  let hairColor = "#1b120d";
  let hairStyle = "short";
  let outfit = "coat";
  let height = 104;
  let build = 108;

  if (isBoss) {
    skinColor = "#f1c29b";
    shirtColor = "#d74343";
    pantsColor = "#7a4f9d";
    hairColor = "#1f67c7";
    hairStyle = "cap";
    height = 118;
    build = 126;
  } else if (isBrute) {
    skinColor = "#b97852";
    shirtColor = "#3e3430";
    pantsColor = "#222a34";
    hairColor = "#1b120d";
    outfit = "armor";
    height = 126;
    build = 142;
  } else if (isOfficer) {
    skinColor = "#d2b48c";
    shirtColor = "#4a708b";
    pantsColor = "#2f4f4f";
    hairColor = "#000000";
    hairStyle = "spiky";
    outfit = "coat";
    height = 110;
    build = 110;
  } else if (isDesertBandit) {
    skinColor = "#eed2b8";
    shirtColor = "#8b7355";
    pantsColor = "#4a3b32";
    hairColor = "#3a2512";
    hairStyle = "short";
    outfit = "sailor";
    height = 102;
    build = 98;
  } else if (isMonkey) {
    skinColor = "#8b5a2b";
    shirtColor = "#8b5a2b";
    pantsColor = "#5c4033";
    hairColor = "#5c4033";
    hairStyle = "short";
    outfit = "sailor";
    height = 75;
    build = 80;
  } else if (isGorilla) {
    skinColor = "#2f4f4f";
    shirtColor = "#1a1a1a";
    pantsColor = "#1a1a1a";
    hairColor = "#1a1a1a";
    hairStyle = "messy";
    outfit = "armor";
    height = 120;
    build = 140;
  } else if (isGorillaKing) {
    skinColor = "#1a1a1a";
    shirtColor = "#ffd700";
    pantsColor = "#1a1a1a";
    hairColor = "#ffd700";
    hairStyle = "spiky";
    outfit = "armor";
    height = 150;
    build = 160;
  } else if (isFrozenBandit) {
    skinColor = "#c8dce8";
    shirtColor = "#3a6a8a";
    pantsColor = "#1e3f5a";
    hairColor = "#d0e8f8";
    hairStyle = "short";
    outfit = "armor";
    height = 106;
    build = 112;
  } else if (isSnowman) {
    skinColor = "#f0f8ff";
    shirtColor = "#e0e8f0";
    pantsColor = "#d0dce8";
    hairColor = "#404040";
    hairStyle = "short";
    outfit = "sailor";
    height = 100;
    build = 120;
  } else if (isYeti) {
    skinColor = "#e8f0f8";
    shirtColor = "#c8d8e8";
    pantsColor = "#a0b8c8";
    hairColor = "#f0f8ff";
    hairStyle = "messy";
    outfit = "armor";
    height = 155;
    build = 170;
  }

  const showSword = !isBrute && !isMonkey && !isGorilla && !isGorillaKing && !isSnowman && !isYeti;

  group.add(createHumanAvatarModel({
    id: `${type}-${index}`,
    name,
    skin: skinColor,
    shirt: shirtColor,
    pants: pantsColor,
    hair: hairColor,
    eyes: "#101010",
    boots: "#1a120d",
    hairStyle,
    outfit,
    height,
    build,
  }, { 
    showSword: showSword, 
    showName: false, 
    bandanaColor: isBoss ? "#ff3131" : isOfficer ? "#4682b4" : isGorillaKing ? "#ffd700" : "#b92832" 
  }));

  if (isBrute) addMaceToEnemy(group);
  if (isOfficer) {
    addGunToEnemy(group);
    // Hide sword, show gun initially
    group.children.forEach(child => {
      if (child.name === "gun") child.visible = true;
    });
    const avatar = group.children[0];
    if (avatar) {
      avatar.children.forEach(child => {
        if (child.name === "swordGroup") child.visible = false;
      });
    }
  }

  // Icy shell mesh for Frozen Bandits (transparent blue box around body)
  if (isFrozenBandit) {
    const shellGeo = new THREE.BoxGeometry(9, 14, 7);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
    const iceShell = new THREE.Mesh(shellGeo, shellMat);
    iceShell.name = "iceShell";
    iceShell.position.set(0, 6, 0);
    group.add(iceShell);
  }

  scene.add(group);
  
  let maxHp = 95;
  if (isBoss) maxHp = 850;
  else if (isBrute) maxHp = 180;
  else if (isOfficer) maxHp = 340;
  else if (isDesertBandit) maxHp = 260;
  else if (isGorillaKing) maxHp = 750;
  else if (isGorilla) maxHp = 160;
  else if (isMonkey) maxHp = 100;
  else if (isFrozenBandit) maxHp = 500;
  else if (isSnowman) maxHp = 650;
  else if (isYeti) maxHp = 2000;

  const enemyObj = {
    id: `${type}-${index}`,
    type,
    mesh: group,
    spawn: position.clone(),
    health: maxHp,
    maxHealth: maxHp,
    alive: true,
    respawnTimer: 0,
    hitTimer: 0,
    ai: {
      state: "patrol",
      cooldown: 0.5 + index * 0.2,
      rush: 1.8,
      slash: 2.4,
      slam: 3.2,
      dodge: 1.5,
    },
  };
  if (isBoss) {
    enemyObj.parts = group.children[0]?.userData?.parts;
  }
  if (isBrute) {
    enemyObj.mace = group.children[1];
    enemyObj.maceHead = enemyObj.mace.children[0];
  }
  if (isFrozenBandit) {
    // iceShell mesh is the last child in the group
    enemyObj.iceShell = group.children[group.children.length - 1];
    enemyObj.iceShellHp = 180;   // shell has its own HP pool
    enemyObj.iceShellMax = 180;
    enemyObj.shellBroken = false;
  }
  enemies.push(enemyObj);
}

function spawnBuggyBoss(position) {
  spawnAdvancedEnemy(position, 0, "buggy");
}

function addMaceToEnemy(group) {
  const mace = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.42, 6, 10),
    new THREE.MeshStandardMaterial({ color: 0x4a4642, roughness: 0.72, metalness: 0.35 }),
  );
  mace.position.set(3.5, 5.2, 0.8);
  mace.rotation.z = -0.72;
  group.add(mace);
  const head = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.25, 0),
    new THREE.MeshStandardMaterial({ color: 0x2f2d2b, roughness: 0.82, metalness: 0.5 }),
  );
  head.position.set(2.4, -0.15, 0);
  mace.add(head);
}

function addGunToEnemy(group) {
  const gunGroup = new THREE.Group();
  gunGroup.name = "gun";

  // Barrel
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 3.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 })
  );
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0, 1.6);
  gunGroup.add(barrel);

  // Handle / Grip
  const grip = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1.2, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.8 })
  );
  grip.position.set(0, -0.5, 0.1);
  grip.rotation.x = -0.4;
  gunGroup.add(grip);

  // Lock plate
  const lock = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.4, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.9, roughness: 0.3 })
  );
  lock.position.set(0.2, 0.15, 0.4);
  gunGroup.add(lock);

  // Position gun similarly to held weapons
  gunGroup.position.set(2.55, 4.7, -0.55);
  gunGroup.rotation.set(0, 0, -0.62);
  group.add(gunGroup);
  return gunGroup;
}

function createFlintlockTracer(position, direction) {
  const geometry = new THREE.SphereGeometry(0.4, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  scene.add(mesh);

  projectiles.push({
    mesh,
    direction: direction.clone(),
    speed: 150,
    damage: 20,
    age: 0,
    duration: 1.5,
    owner: "enemy",
    isBullet: true
  });
}

function spawnBandit(position, index) {
  const group = new THREE.Group();
  group.position.copy(position);
  const banditAvatars = [
    { skin: "#b97852", shirt: "#7b3f2f", pants: "#2a2430", hair: "#1a100c", height: 92, build: 88 },
    { skin: "#8f5d3d", shirt: "#8e2f23", pants: "#33251f", hair: "#0f0b08", height: 112, build: 120 },
    { skin: "#d69a70", shirt: "#5f4736", pants: "#1c2b34", hair: "#55341e", height: 98, build: 104 },
    { skin: "#a46d4d", shirt: "#9b5a2e", pants: "#272a38", hair: "#21140e", height: 121, build: 96 },
    { skin: "#c0845d", shirt: "#633c2d", pants: "#423023", hair: "#16110e", height: 87, build: 128 },
    { skin: "#e0ad82", shirt: "#6c2d39", pants: "#1f3140", hair: "#6e3c20", height: 105, build: 82 },
  ];
  const avatar = {
    id: `bandit-${index}`,
    name: `Bandit ${index + 1}`,
    eyes: "#111111",
    boots: "#21150e",
    hairStyle: index % 2 === 0 ? "spiky" : "short",
    outfit: index % 3 === 0 ? "coat" : "sailor",
    ...banditAvatars[index % banditAvatars.length],
  };
  group.add(createHumanAvatarModel(avatar, {
    showSword: true,
    showName: false,
    bandanaColor: index % 2 === 0 ? "#c74148" : "#3d2b1e",
  }));

  scene.add(group);
  enemies.push({
    id: index,
    mesh: group,
    spawn: position.clone(),
    health: 45,
    maxHealth: 45,
    alive: true,
    respawnTimer: 0,
    hitTimer: 0,
  });
}

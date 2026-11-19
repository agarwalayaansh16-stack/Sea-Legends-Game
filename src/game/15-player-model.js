
// ── 15-player-model.js ─ Player creation, human avatar model and stat points.
function createPlayer() {
  playerMesh = new THREE.Group();
  playerMesh.position.set(0, STARTER_SURFACE_Y + 0.15, 12); // just south of the flagpole
  playerMesh.userData.animation = { walkPhase: 0, attackTimer: 0, attackDuration: 0.22, attackImpact: 0 };
  scene.add(playerMesh);
  applyAvatarToPlayer();
}

// Body proportions from the studio sliders (percent values, 100 = default).
function getAvatarProportions(avatar) {
  const pct = (value, min, max) => THREE.MathUtils.clamp((value || 100) / 100, min, max);
  return {
    height: pct(avatar.height, 0.8, 1.3),
    width: pct(avatar.build, 0.75, 1.35),
    arm: pct(avatar.armLength, 0.75, 1.35),
    leg: pct(avatar.legLength, 0.75, 1.35),
    torso: pct(avatar.torsoLength, 0.8, 1.25),
    head: pct(avatar.headSize, 0.75, 1.35),
  };
}

// ---- Character shaping helpers ----

// Head size relative to the old chunky rig, giving roughly 5.5-heads-tall proportions.
const AVATAR_HEAD_SCALE = 0.8;
// Torso cross-section: radius (before x/z scaling) at heights -0.5..0.5 of the torso.
const TORSO_PROFILE = [
  [0.01, -0.5], [0.98, -0.5], [1.0, -0.42], [0.93, -0.22], [0.98, -0.02], [1.1, 0.16],
  [1.2, 0.3], [1.2, 0.38], [1.06, 0.45], [0.6, 0.5], [0.01, 0.5],
];
const TORSO_SX = 1.22;
const TORSO_SZ = 0.68;

// Averages normals of vertices that share a position so seams (sphere/lathe
// edges, sculpted surfaces) shade smoothly.
function weldNormals(geo) {
  geo.computeVertexNormals();
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  const shared = new Map();
  for (let i = 0; i < pos.count; i += 1) {
    const key = `${Math.round(pos.getX(i) * 1e4)},${Math.round(pos.getY(i) * 1e4)},${Math.round(pos.getZ(i) * 1e4)}`;
    const list = shared.get(key);
    if (list) list.push(i);
    else shared.set(key, [i]);
  }
  const n = new THREE.Vector3();
  shared.forEach((list) => {
    if (list.length < 2) return;
    n.set(0, 0, 0);
    list.forEach((i) => { n.x += nor.getX(i); n.y += nor.getY(i); n.z += nor.getZ(i); });
    n.normalize();
    list.forEach((i) => nor.setXYZ(i, n.x, n.y, n.z));
  });
  nor.needsUpdate = true;
  return geo;
}

function sculptGeometry(geo, shape) {
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    shape(v, i);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  return weldNormals(geo);
}

// A limb segment hanging down from y = 0. profile: [radius, t] with t 0 (top) .. 1 (bottom).
function limbLathe(profile, length, segments = 14) {
  const full = [[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]];
  const points = full.slice().reverse().map(([r, t]) => new THREE.Vector2(Math.max(r, 0.001), -t * length));
  return weldNormals(new THREE.LatheGeometry(points, segments));
}

// Turns a point on a sphere of radius 1.25 into the matching point on the
// sculpted head: longer face, narrow jaw, chin, cheekbones, brow and eye sockets.
function sculptSkullPoint(v) {
  const R = 1.25;
  const nx = v.x / R;
  const ny = v.y / R;
  const nz = v.z / R;
  let x = v.x * 0.9;
  let y = v.y * 1.12;
  let z = v.z * (nz < 0 ? 1.06 : 0.96);
  if (ny < 0) {
    const t = Math.min(1, -ny);
    x *= 1 - 0.3 * t * t;
    z *= nz > 0 ? 1 + 0.06 * t : 1 - 0.3 * t * t;
  }
  const g = (cx, cy, s) => Math.exp(-((nx - cx) ** 2 + (ny - cy) ** 2) / (s * s));
  const front = Math.max(0, nz);
  let push = 0;
  push -= 0.09 * front * (g(-0.36, 0.02, 0.17) + g(0.36, 0.02, 0.17)); // eye sockets
  push += 0.05 * front * (g(-0.35, 0.2, 0.16) + g(0.35, 0.2, 0.16));   // brow ridge
  push += 0.06 * front * (g(-0.52, -0.22, 0.2) + g(0.52, -0.22, 0.2)); // cheekbones
  push += 0.05 * front * g(0, -0.48, 0.25);                             // mouth area
  push += 0.07 * front * g(0, -0.8, 0.18);                              // chin
  push -= 0.04 * (g(-0.85, 0.35, 0.2) + g(0.85, 0.35, 0.2));            // temples
  const len = Math.hypot(x, y, z) || 1;
  const k = 1 + (push * R) / len;
  return v.set(x * k, y * k, z * k);
}

// Point on the sculpted face for a front-facing direction (nx, ny), lifted off the skin.
function skullPoint(nx, ny, lift = 0) {
  const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  const p = sculptSkullPoint(new THREE.Vector3(nx, ny, nz).multiplyScalar(1.25));
  return p.add(new THREE.Vector3(nx, ny, nz).multiplyScalar(lift));
}

function torsoRadiusAt(yn) {
  for (let i = 1; i < TORSO_PROFILE.length - 2; i += 1) {
    const [r0, y0] = TORSO_PROFILE[i];
    const [r1, y1] = TORSO_PROFILE[i + 1];
    if (yn >= y0 && yn <= y1) return r0 + ((r1 - r0) * (yn - y0)) / (y1 - y0 || 1);
  }
  return yn < 0 ? TORSO_PROFILE[1][0] : TORSO_PROFILE[TORSO_PROFILE.length - 2][0];
}

// How far the torso surface sticks out (front or back) at x, height y from its centre.
function torsoSurfaceZ(x, y, torsoH, face = 1) {
  const yn = THREE.MathUtils.clamp(y / torsoH, -0.5, 0.5);
  const r = torsoRadiusAt(yn);
  const lx = x / TORSO_SX; // lathe-space x
  let z = r * Math.sqrt(Math.max(0, 1 - (lx / r) ** 2)) + torsoChestOffset(lx, yn, face);
  return z * TORSO_SZ;
}

// Chest (front) and shoulder blades (back), in lathe space.
function torsoChestOffset(lx, yn, face) {
  const band = Math.exp(-(((yn - 0.24) / 0.14) ** 2));
  const side = Math.exp(-((lx / 0.55) ** 2));
  return face > 0 ? 0.09 * band * (1 - side * 0.55) : 0.05 * band;
}

// A flat band (strap) that hugs the torso surface, front (1) or back (-1).
function torsoStripGeometry(x, halfWidth, y0, y1, torsoH, face, lift = 0.035) {
  const rows = 10;
  const positions = [];
  const indices = [];
  for (let i = 0; i <= rows; i += 1) {
    const y = y0 + ((y1 - y0) * i) / rows;
    [-1, 1].forEach((j) => {
      const xx = x + j * halfWidth;
      positions.push(xx, y, face * (torsoSurfaceZ(xx, y, torsoH, face) + lift));
    });
  }
  for (let i = 0; i < rows; i += 1) {
    const a = i * 2;
    if (face > 0) indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    else indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Eyeball texture: white with a shaded iris, pupil and a catch-light, centred on +z.
const avatarEyeMaterials = new Map();
function avatarEyeMaterial(irisColor) {
  const key = String(irisColor || "#3b2a1e");
  if (avatarEyeMaterials.has(key)) return avatarEyeMaterials.get(key);
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const sclera = ctx.createLinearGradient(0, 0, 0, 128);
  sclera.addColorStop(0, "#d9d2c8");
  sclera.addColorStop(0.5, "#f7f4ee");
  sclera.addColorStop(1, "#d9d2c8");
  ctx.fillStyle = sclera;
  ctx.fillRect(0, 0, 256, 128);
  const cx = 64;
  const cy = 64;
  const base = new THREE.Color(key);
  const css = (c) => `#${c.getHexString()}`;
  const iris = ctx.createRadialGradient(cx, cy, 4, cx, cy, 23);
  iris.addColorStop(0, css(base.clone().lerp(new THREE.Color("#ffe9b0"), 0.35)));
  iris.addColorStop(0.55, css(base));
  iris.addColorStop(0.9, css(base.clone().multiplyScalar(0.55)));
  iris.addColorStop(1, "#1a1410");
  ctx.fillStyle = iris;
  ctx.beginPath();
  ctx.arc(cx, cy, 23, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 28; i += 1) {
    const a = (i / 28) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 9, cy + Math.sin(a) * 9);
    ctx.lineTo(cx + Math.cos(a) * 21, cy + Math.sin(a) * 21);
    ctx.stroke();
  }
  ctx.fillStyle = "#050505";
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(cx - 7, cy - 7, 3.5, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.encoding = THREE.sRGBEncoding;
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.18 });
  avatarEyeMaterials.set(key, material);
  return material;
}

// Fine weave used as a bump map on clothes.
let avatarClothBump;
function getAvatarClothBump() {
  if (avatarClothBump) return avatarClothBump;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const weave = ((x >> 1) + (y >> 1)) % 2 ? 22 : -22;
      const v = Math.max(0, Math.min(255, 128 + weave + (rand() - 0.5) * 40));
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  avatarClothBump = new THREE.CanvasTexture(canvas);
  avatarClothBump.wrapS = avatarClothBump.wrapT = THREE.RepeatWrapping;
  avatarClothBump.repeat.set(10, 10);
  return avatarClothBump;
}

function shoeGeometry() {
  return sculptGeometry(new THREE.SphereGeometry(0.5, 20, 14), (v) => {
    const nz = v.z / 0.5;
    v.x *= 0.82 * (nz > 0.4 ? 1 - (nz - 0.4) * 0.3 : 1);
    v.z *= 1.55;
    v.y *= 0.62;
    if (v.y > 0) v.y -= Math.max(0, v.z) * 0.12; // instep slopes down to the toe
    if (v.y < -0.12) v.y = -0.12 + (v.y + 0.12) * 0.12; // flat underside
  });
}

// A relaxed hand hanging from the wrist (y = 0), fingers gently curled toward the body.
function buildAvatarHand(side, material, bony) {
  const hand = new THREE.Group();
  const inward = -side;
  const add = (geo, x, y, z, parent = hand) => {
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const palm = add(new THREE.SphereGeometry(0.25, 14, 10), 0, -0.22, 0);
  palm.scale.set(bony ? 0.25 : 0.36, 0.95, bony ? 0.7 : 0.82);
  const fr = bony ? 0.034 : 0.052;
  const finger = (z, length, curl) => {
    const root = new THREE.Group();
    root.position.set(inward * 0.01, -0.42, z);
    root.rotation.set(-z * 0.5, 0, inward * curl);
    hand.add(root);
    add(new THREE.SphereGeometry(fr * 1.1, 8, 6), 0, 0, 0, root);
    add(new THREE.CylinderGeometry(fr, fr * 0.95, length * 0.55, 7), 0, -length * 0.275, 0, root);
    const mid = new THREE.Group();
    mid.position.y = -length * 0.55;
    mid.rotation.z = inward * curl * 1.6;
    root.add(mid);
    add(new THREE.CylinderGeometry(fr * 0.95, fr * 0.82, length * 0.45, 7), 0, -length * 0.225, 0, mid);
    add(new THREE.SphereGeometry(fr * 0.85, 8, 6), 0, -length * 0.45, 0, mid);
    return root;
  };
  finger(0.15, 0.36, 0.2);
  finger(0.05, 0.4, 0.22);
  finger(-0.05, 0.37, 0.25);
  finger(-0.15, 0.29, 0.28);
  const thumb = finger(0.2, 0.34, 0.3);
  thumb.position.set(inward * 0.07, -0.14, 0.17);
  thumb.rotation.set(-0.65, 0, inward * 0.4);
  return hand;
}

// Builds a character: sculpted head and face, shaped torso, and arms/legs with
// working elbows, knees, hands and boots. Part names are shared with the
// animation code; joints are separate groups so they can bend.
function createHumanAvatarModel(avatar, options = {}) {
  const showSword = options.showSword !== false;
  const showName = options.showName !== false;
  const group = new THREE.Group();
  group.userData.noSurface = true;
  const avatarParts = {};
  const prop = getAvatarProportions(avatar);
  const bodyType = avatar.bodyType || "human";
  const headStyle = avatar.headStyle || "normal";
  const accessory = avatar.accessory || (avatar.outfit !== "adventurer" ? "halo" : "none");
  const skeleton = bodyType === "skeleton";
  const adventurer = !skeleton && avatar.outfit === "adventurer";

  // Studio colours are sRGB; the renderer works in linear light like the rest of the world.
  const lin = (c) => (c instanceof THREE.Color ? c.clone() : new THREE.Color(c)).convertSRGBToLinear();
  const std = (color, roughness = 0.8, extra = {}) => new THREE.MeshStandardMaterial({
    roughness, ...extra, color: lin(color), ...(extra.emissive !== undefined ? { emissive: lin(extra.emissive) } : {}),
  });
  const cloth = (color, roughness = 0.86) => std(color, roughness, { bumpMap: getAvatarClothBump(), bumpScale: 0.035 });
  const skinColor = new THREE.Color(avatar.skin || "#e0ac69");
  const bone = std("#ece4cf", 0.65);
  const skin = skeleton ? bone : std(skinColor, 0.55, { emissive: skinColor.clone().multiplyScalar(0.05) });
  const skinShade = std(skinColor.clone().multiplyScalar(0.6), 0.7);
  const lips = std(skinColor.clone().lerp(new THREE.Color("#a3474f"), 0.5), 0.42);
  const lash = std("#1c1512", 0.8);
  const hair = std(avatar.hair, 0.62);
  const torsoMat = cloth(avatar.torsoColor || avatar.shirt || "#1b85aa");
  const leftArmMat = cloth(avatar.leftArmColor || avatar.shirt || "#1b85aa");
  const rightArmMat = cloth(avatar.rightArmColor || avatar.shirt || "#1b85aa");
  const leftLegMat = cloth(avatar.leftLegColor || avatar.pants || "#26364f", 0.88);
  const rightLegMat = cloth(avatar.rightLegColor || avatar.pants || "#26364f", 0.88);
  const pantsMat = cloth(avatar.pants || "#26364f", 0.88);
  const beltMat = std(avatar.beltColor || avatar.boots || "#23170f", 0.7);
  const bootsMat = std(avatar.boots || "#23170f", 0.55);
  const metal = std(0xc8d7df, 0.25, { metalness: 0.7 });
  const trim = std(avatar.outfit === "armor" ? 0xb8c1c7 : avatar.boots || "#23170f", 0.6, avatar.outfit === "armor" ? { metalness: 0.6 } : {});
  const leather = std("#5c3d21", 0.75);
  const darkLeather = std("#362a22", 0.8);
  const shade = (mesh) => { mesh.castShadow = true; return mesh; };
  const mesh = (geo, mat, parent, x = 0, y = 0, z = 0) => {
    const m = shade(new THREE.Mesh(geo, mat));
    m.position.set(x, y, z);
    if (parent) parent.add(m);
    return m;
  };

  // ---- Layout (model units; feet rest on y = -1.6) ----
  const FOOT_Y = -1.56;
  const legLen = 4.6 * prop.leg;
  const hipY = FOOT_Y + legLen + 0.21;               // 3.25 at default
  const torsoH = 3.7 * prop.torso;
  const torsoY = hipY + 1.0 + torsoH / 2;            // 6.1 at default
  const torsoTop = torsoY + torsoH / 2;              // 7.95 at default
  const shoulderY = torsoTop - 0.55;
  const shoulderX = 1.72;
  const headK = prop.head * AVATAR_HEAD_SCALE;
  const headY = torsoTop + 0.2 + 1.0 * prop.head;    // 9.15 at default
  const armLen = 4.5 * prop.arm;
  const upperLen = armLen * 0.5;
  const forearmLen = armLen * 0.5 - 0.12;
  const thighLen = legLen * 0.5;
  const shinLen = legLen * 0.5;
  // Torso-relative heights for things strapped to the body (authored for the old 4.1-tall torso at 5.7).
  const onTorso = (absoluteDefaultY) => (absoluteDefaultY - 5.7) * (torsoH / 4.1);

  // ---- Torso ----
  let torso;
  if (skeleton) {
    torso = new THREE.Group();
    mesh(new THREE.CylinderGeometry(0.2, 0.24, torsoH, 8), bone, torso);
    for (let i = 0; i < 5; i += 1) {
      const rib = mesh(new THREE.TorusGeometry(0.95 - i * 0.06, 0.1, 6, 20, Math.PI * 1.6), bone, torso, 0, torsoH * 0.3 - i * 0.42 * prop.torso);
      rib.rotation.x = Math.PI / 2;
      rib.rotation.z = Math.PI * 0.7;
      rib.scale.set(1.25, 0.75, 1);
    }
    const collarbone = mesh(new THREE.CylinderGeometry(0.11, 0.11, 3.0, 6), bone, torso, 0, torsoH / 2 - 0.25);
    collarbone.rotation.z = Math.PI / 2;
  } else {
    const profile = TORSO_PROFILE.map(([r, y]) => new THREE.Vector2(r, y * torsoH));
    const geo = sculptGeometry(new THREE.LatheGeometry(profile, 28), (v) => {
      // Chest and shoulder blades.
      const off = torsoChestOffset(v.x, v.y / torsoH, v.z > 0 ? 1 : -1);
      v.z += v.z > 0 ? off : -off;
    });
    torso = shade(new THREE.Mesh(geo, torsoMat));
    torso.scale.set(TORSO_SX, 1, TORSO_SZ);
    torso.userData.surfaceScale = true;
  }
  torso.position.y = torsoY;
  group.add(torso);
  // Children of the torso move with it (and aren't stretched by its x/z scale).
  const torsoAnchor = new THREE.Group();
  if (!skeleton) torsoAnchor.scale.set(1 / TORSO_SX, 1, 1 / TORSO_SZ);
  torso.add(torsoAnchor);

  // Hips
  const pelvis = mesh(new THREE.SphereGeometry(1.0, 20, 14), skeleton ? bone : pantsMat, group, 0, hipY + 0.45);
  pelvis.scale.set(skeleton ? 1.1 : 1.38, skeleton ? 0.5 : 0.78, skeleton ? 0.7 : 0.8);

  if (!skeleton && avatar.outfit !== "armor") {
    // Shirt collar and buttons.
    const collar = mesh(new THREE.TorusGeometry(0.6, 0.1, 8, 22), adventurer ? leather : torsoMat, torsoAnchor, 0, torsoH / 2 - 0.08);
    collar.rotation.x = Math.PI / 2;
    collar.scale.set(1.05, 0.85, 1);
    if (!adventurer) {
      for (let i = 0; i < 4; i += 1) {
        const y = torsoH * (0.32 - i * 0.17);
        mesh(new THREE.SphereGeometry(0.065, 8, 6), trim, torsoAnchor, 0, y, torsoSurfaceZ(0, y, torsoH) + 0.07);
      }
    }
  }

  if (!skeleton && avatar.outfit === "coat") {
    const top = torsoH * 0.42;
    const hem = -(torsoY - hipY) - 1.9;
    const coatProfile = [
      [1.42, hem], [1.28, hem + 0.9], [1.12, -(torsoY - hipY) + 0.6], [1.02, -torsoH * 0.22],
      [1.13, torsoH * 0.18], [1.12, top], [0.7, top + 0.2],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const coat = mesh(new THREE.LatheGeometry(coatProfile, 26, Math.PI * 0.1, Math.PI * 1.8),
      std(avatar.torsoColor || avatar.shirt || "#1b85aa", 0.84, { side: THREE.DoubleSide, bumpMap: getAvatarClothBump(), bumpScale: 0.035 }), torsoAnchor);
    coat.geometry = weldNormals(coat.geometry);
    coat.scale.set(1.22, 1, 0.74);
  }
  if (!skeleton && avatar.outfit === "armor") {
    const plate = mesh(new THREE.SphereGeometry(1.0, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), trim, torsoAnchor, 0, torsoH * 0.12, 0.35);
    plate.scale.set(1.42, 1.15, 0.6);
    plate.rotation.x = -Math.PI / 2;
    const gorget = mesh(new THREE.TorusGeometry(0.62, 0.16, 8, 22), trim, torsoAnchor, 0, torsoH / 2 - 0.1);
    gorget.rotation.x = Math.PI / 2;
  }

  // ---- Neck & head ----
  const neckBottom = torsoTop - 0.35;
  const neckTop = headY - 0.55 * prop.head;
  if (skeleton) {
    const spine = mesh(new THREE.CylinderGeometry(0.17, 0.2, neckTop - neckBottom, 8), bone, group, 0, (neckTop + neckBottom) / 2);
    spine.castShadow = true;
  } else {
    const neckGeo = limbLathe([[0.47, 0], [0.43, 0.45], [0.5, 0.85], [0.56, 1]], neckTop - neckBottom, 16);
    mesh(neckGeo, skin, group, 0, neckTop, -0.05);
  }

  const head = new THREE.Group(); // pivot at the head centre; scaled by head size
  head.position.y = headY;
  head.scale.setScalar(headK);
  head.userData = { isHead: true };
  group.add(head);
  const eyesList = [];

  if (skeleton) {
    const skull = mesh(new THREE.SphereGeometry(1.2, 24, 18), bone, head);
    skull.scale.set(0.95, 1.05, 1.02);
    mesh(new THREE.BoxGeometry(1.3, 0.42, 1.0), bone, head, 0, -1.0, 0.35);
    const socketMat = std("#14110e", 0.9);
    [-0.42, 0.42].forEach((x) => {
      const socket = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), socketMat);
      socket.scale.set(1, 1.1, 0.5);
      socket.position.set(x, 0.1, 1.02);
      head.add(socket);
      eyesList.push(socket);
    });
    const nose = mesh(new THREE.ConeGeometry(0.14, 0.28, 3), socketMat, head, 0, -0.3, 1.12);
    nose.rotation.x = Math.PI;
    for (let i = -2; i <= 2; i += 1) mesh(new THREE.BoxGeometry(0.14, 0.2, 0.06), bone, head, i * 0.17, -0.7, 1.06);
  } else {
    // Sculpted skull and face.
    mesh(sculptGeometry(new THREE.SphereGeometry(1.25, 44, 32), sculptSkullPoint), skin, head);

    // Ears.
    [-1, 1].forEach((side) => {
      const ear = mesh(new THREE.SphereGeometry(0.28, 14, 10), skin, head, side * 1.09, -0.1, -0.12);
      ear.scale.set(0.24, 1, 0.58);
      ear.rotation.y = -side * 0.3;
      const inner = mesh(new THREE.SphereGeometry(0.15, 10, 8), skinShade, head, side * 1.135, -0.1, -0.09);
      inner.scale.set(0.2, 0.85, 0.55);
      inner.rotation.y = -side * 0.35;
    });

    // Eyes: textured eyeballs (they blink) under skin-coloured lids, with lashes and brows.
    const eyeMat = avatarEyeMaterial(avatar.eyes);
    [-1, 1].forEach((side) => {
      const p = skullPoint(side * 0.36, 0.02);
      p.z -= 0.075;
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 14), eyeMat);
      eye.position.copy(p);
      eye.rotation.y = side * 0.06;
      head.add(eye);
      eyesList.push(eye);
      mesh(new THREE.SphereGeometry(0.185, 18, 8, 0, Math.PI * 2, 0, Math.PI * 0.38), skin, head, p.x, p.y, p.z);
      mesh(new THREE.SphereGeometry(0.182, 18, 6, 0, Math.PI * 2, Math.PI * 0.68, Math.PI * 0.32), skin, head, p.x, p.y, p.z);
      const lashes = mesh(new THREE.TorusGeometry(0.172, 0.02, 4, 16, Math.PI), lash, head, p.x, p.y + 0.066, p.z);
      lashes.rotation.x = Math.PI / 2;
      const brow = new THREE.QuadraticBezierCurve3(
        skullPoint(side * 0.13, 0.24, 0.03), skullPoint(side * 0.36, 0.31, 0.04), skullPoint(side * 0.6, 0.23, 0.02),
      );
      const browMesh = mesh(new THREE.TubeGeometry(brow, 10, 0.05, 5, false), hair, head);
      browMesh.scale.y = 0.9;
    });

    // Nose: bridge, tip and nostril wings.
    const bridgeTop = skullPoint(0, 0.08, 0.01);
    const tip = skullPoint(0, -0.29, 0.1);
    const bridgeDir = new THREE.Vector3().subVectors(bridgeTop, tip);
    const bridge = mesh(new THREE.CylinderGeometry(0.06, 0.1, bridgeDir.length(), 10), skin, head);
    bridge.position.copy(bridgeTop).add(tip).multiplyScalar(0.5);
    bridge.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bridgeDir.normalize());
    const noseTip = mesh(new THREE.SphereGeometry(0.105, 12, 10), skin, head);
    noseTip.position.copy(tip);
    noseTip.scale.set(1, 0.9, 0.95);
    [-1, 1].forEach((side) => {
      const wing = mesh(new THREE.SphereGeometry(0.07, 10, 8), skin, head);
      wing.position.copy(skullPoint(side * 0.1, -0.31, 0.03));
      const nostril = mesh(new THREE.SphereGeometry(0.035, 8, 6), skinShade, head);
      nostril.position.copy(tip).add(new THREE.Vector3(side * 0.05, -0.075, -0.03));
      nostril.scale.set(1, 0.55, 1.2);
    });

    // Lips.
    const upperLip = mesh(new THREE.SphereGeometry(0.19, 16, 10), lips, head);
    upperLip.position.copy(skullPoint(0, -0.5, -0.06));
    upperLip.scale.set(1.1, 0.3, 0.4);
    const lowerLip = mesh(new THREE.SphereGeometry(0.17, 16, 10), lips, head);
    lowerLip.position.copy(skullPoint(0, -0.59, -0.065));
    lowerLip.scale.set(1.0, 0.4, 0.4);
    const mouthLine = mesh(new THREE.BoxGeometry(0.36, 0.02, 0.05), skinShade, head);
    mouthLine.position.copy(skullPoint(0, -0.545, -0.025));

    addHair(head, avatar.hairStyle || "short", hair, torsoMat);
  }

  if (options.bandanaColor) {
    const bandana = mesh(new THREE.TorusGeometry(1.18, 0.2, 10, 30), std(options.bandanaColor, 0.74), head, 0, 0.5, -0.05);
    bandana.rotation.x = Math.PI / 2;
    bandana.scale.set(0.95, 1.12, 1);
  }

  // Headless: hide the head entirely, cap the neck.
  if (headStyle === "headless") {
    head.visible = false;
    const cap = new THREE.Mesh(new THREE.CircleGeometry(skeleton ? 0.17 : 0.5, 16), std("#5a1a1e", 0.7));
    cap.rotation.x = -Math.PI / 2;
    cap.position.set(0, neckTop + 0.01, -0.05);
    group.add(cap);
  }

  // ---- Arms: shoulder group -> forearm group (elbow) -> hand ----
  const makeArm = (side, sleeveMat) => {
    const arm = new THREE.Group();
    arm.position.set(side * shoulderX, shoulderY, 0);
    arm.rotation.z = side * 0.07;
    if (skeleton) {
      mesh(new THREE.SphereGeometry(0.26, 12, 8), bone, arm);
      mesh(new THREE.CylinderGeometry(0.12, 0.1, upperLen, 8), bone, arm, 0, -upperLen / 2);
    } else {
      const deltoid = mesh(new THREE.SphereGeometry(0.44, 16, 12), sleeveMat, arm, -side * 0.1, -0.08, 0);
      deltoid.scale.set(0.95, 0.82, 1.0);
      mesh(limbLathe([[0.43, 0], [0.43, 0.15], [0.4, 0.45], [0.36, 0.82], [0.345, 1]], upperLen), sleeveMat, arm);
      const hem = mesh(new THREE.TorusGeometry(0.35, 0.055, 6, 18), sleeveMat, arm, 0, -upperLen * 0.95);
      hem.rotation.x = Math.PI / 2;
    }
    const forearm = new THREE.Group();
    forearm.position.y = -upperLen;
    forearm.rotation.x = -0.2;
    arm.add(forearm);
    if (skeleton) {
      mesh(new THREE.SphereGeometry(0.17, 10, 8), bone, forearm);
      [-0.07, 0.07].forEach((z) => mesh(new THREE.CylinderGeometry(0.06, 0.05, forearmLen, 6), bone, forearm, 0, -forearmLen / 2, z));
    } else {
      mesh(new THREE.SphereGeometry(0.32, 12, 10), skin, forearm);
      mesh(limbLathe([[0.32, 0], [0.35, 0.2], [0.3, 0.55], [0.225, 0.93], [0.215, 1]], forearmLen), skin, forearm);
    }
    const hand = buildAvatarHand(side, adventurer ? darkLeather : skin, skeleton);
    hand.position.y = -forearmLen;
    forearm.add(hand);
    group.add(arm);
    return { arm, forearm, hand };
  };

  // ---- Legs: hip group -> shin group (knee) -> boot ----
  const makeLeg = (side, legMat) => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.78, hipY, 0);
    leg.rotation.z = -side * 0.03;
    if (skeleton) {
      mesh(new THREE.SphereGeometry(0.24, 10, 8), bone, leg);
      mesh(new THREE.CylinderGeometry(0.15, 0.13, thighLen, 8), bone, leg, 0, -thighLen / 2);
    } else {
      mesh(limbLathe([[0.64, 0], [0.66, 0.1], [0.58, 0.55], [0.47, 0.93], [0.45, 1]], thighLen), legMat, leg);
    }
    const shin = new THREE.Group();
    shin.position.y = -thighLen;
    shin.rotation.x = 0.04;
    leg.add(shin);
    if (skeleton) {
      mesh(new THREE.SphereGeometry(0.22, 10, 8), bone, shin);
      [-0.06, 0.08].forEach((z) => mesh(new THREE.CylinderGeometry(0.08, 0.07, shinLen, 6), bone, shin, 0, -shinLen / 2, z));
      const foot = mesh(shoeGeometry(), bone, shin, 0, -shinLen + 0.03, 0.28);
      foot.scale.set(0.7, 0.6, 0.9);
    } else {
      const kneeCap = mesh(new THREE.SphereGeometry(0.49, 20, 14), legMat, shin);
      kneeCap.scale.set(1, 0.85, 1.06);
      mesh(limbLathe([[0.45, 0], [0.49, 0.22], [0.42, 0.55], [0.35, 0.88], [0.34, 1]], shinLen), legMat, shin);
      const bootH = 1.15;
      mesh(limbLathe([[0.5, 0], [0.45, 0.45], [0.41, 1]], bootH, 16), bootsMat, shin, 0, -shinLen + bootH);
      mesh(new THREE.CylinderGeometry(0.55, 0.52, 0.22, 16), trim, shin, 0, -shinLen + bootH);
      mesh(shoeGeometry(), bootsMat, shin, 0, -shinLen + 0.03, 0.28);
      const sole = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.14, 20), darkLeather, shin, 0, -shinLen - 0.18, 0.28);
      sole.scale.set(0.86, 1, 1.62);
      if (adventurer) {
        const pad = mesh(new THREE.SphereGeometry(0.42, 12, 8), darkLeather, shin, 0, 0, 0.3);
        pad.scale.set(1, 1.1, 0.55);
      }
    }
    group.add(leg);
    return { leg, shin };
  };
  const { arm: leftArm, forearm: leftForearm, hand: leftHand } = makeArm(-1, leftArmMat);
  const { arm: rightArm, forearm: rightForearm, hand: rightHand } = makeArm(1, rightArmMat);
  const { leg: leftLeg, shin: leftShin } = makeLeg(-1, leftLegMat);
  const { leg: rightLeg, shin: rightShin } = makeLeg(1, rightLegMat);

  if (!skeleton && avatar.outfit === "armor") {
    [[leftArm, leftForearm], [rightArm, rightForearm]].forEach(([arm, forearm]) => {
      mesh(new THREE.SphereGeometry(0.72, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), trim, arm, 0, 0.12);
      mesh(new THREE.CylinderGeometry(0.4, 0.33, forearmLen * 0.55, 14), trim, forearm, 0, -forearmLen * 0.62);
    });
  }

  // Belt sits on the hips.
  if (!skeleton) {
    const belt = mesh(new THREE.CylinderGeometry(1, 1, 0.34, 26), beltMat, group, 0, hipY + 1.18);
    belt.scale.set(1.24, 1, 0.74);
    mesh(new THREE.BoxGeometry(0.46, 0.32, 0.1), metal, group, 0, hipY + 1.18, 0.76);
  }

  let staffGroup;
  if (adventurer) {
    [-0.62, 0.62].forEach((x) => {
      [1, -1].forEach((face) => mesh(torsoStripGeometry(x, 0.16, -torsoH / 2 + 0.05, torsoH / 2 - 0.12, torsoH, face), leather, torsoAnchor));
      const y = torsoH * 0.2;
      mesh(new THREE.BoxGeometry(0.4, 0.22, 0.08), metal, torsoAnchor, x, y, torsoSurfaceZ(x, y, torsoH) + 0.08);
    });
    const backpack = mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.7, 14), leather, torsoAnchor, 0, torsoH * 0.08, -(torsoSurfaceZ(0, torsoH * 0.08, torsoH, -1) + 0.55));
    backpack.rotation.z = Math.PI / 2;
    const pouch = mesh(new THREE.BoxGeometry(0.62, 0.8, 0.45), leather, group, 1.48, hipY + 0.95, 0.3);
    pouch.rotation.y = 0.3;
    const satchel = mesh(new THREE.BoxGeometry(0.8, 1.0, 0.55), leather, group, -1.48, hipY + 0.85, 0.15);
    satchel.rotation.y = -0.3;
    [leftHand, rightHand].forEach((hand) => mesh(new THREE.CylinderGeometry(0.27, 0.25, 0.3, 12), darkLeather, hand, 0, 0.02));
    // Wooden staff with glowing runes, gripped in the left hand.
    staffGroup = new THREE.Group(); // its own part so it can be stowed in a fight
    leftHand.add(staffGroup);
    const staff = mesh(new THREE.CylinderGeometry(0.12, 0.13, 7.8, 8), leather, staffGroup, 0.1, -0.35, 0.05);
    const horn = mesh(new THREE.TorusGeometry(0.38, 0.11, 8, 16, Math.PI * 0.72), leather, staff, 0, 4.0, 0.15);
    horn.rotation.x = Math.PI / 2;
    const runeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    [3.0, 2.6, 2.2].forEach((y) => mesh(new THREE.BoxGeometry(0.06, 0.22, 0.06), runeMat, staff, 0, y, 0.14));
  }

  // ---- Accessories ----
  let halo;
  if (accessory === "halo") {
    halo = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.1, 8, 24), new THREE.MeshBasicMaterial({ color: 0xffd700 }));
    halo.position.set(0, headY + 1.65 * prop.head, 0);
    halo.rotation.x = Math.PI / 2;
    group.add(halo);
  }
  let spectralHands;
  if (accessory === "spectral-hands") {
    // Two floating, glowing hands that drift beside the shoulders.
    spectralHands = new THREE.Group();
    const glow = new THREE.MeshStandardMaterial({ color: 0xbfe9ff, emissive: 0x58b8ff, emissiveIntensity: 1.2, transparent: true, opacity: 0.78, roughness: 0.3 });
    [-1, 1].forEach((side) => {
      const ghost = new THREE.Group();
      const palm = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.25, 0.32), glow);
      ghost.add(palm);
      for (let f = 0; f < 4; f += 1) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.75, 6), glow);
        finger.position.set(-0.39 + f * 0.26, 0.95, 0);
        ghost.add(finger);
      }
      const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.6, 6), glow);
      thumb.position.set(side * -0.68, 0.2, 0);
      thumb.rotation.z = side * 0.9;
      ghost.add(thumb);
      ghost.position.set(side * 3.6, shoulderY + 1.4, -0.6);
      ghost.rotation.z = side * -0.25;
      ghost.userData.side = side;
      spectralHands.add(ghost);
    });
    group.add(spectralHands);
  }

  // ---- Cape (hangs from the shoulders and moves with the torso) ----
  let cape;
  const capeStyle = avatar.capeStyle || (avatar.outfit !== "adventurer" ? "normal" : "none");
  if (capeStyle !== "none") {
    const capeMat = std(avatar.capeColor || avatar.shirt || "#a82020", 0.85, { metalness: 0.1, side: THREE.DoubleSide, bumpMap: getAvatarClothBump(), bumpScale: 0.035 });
    const len = capeStyle === "long" ? 6.6 : capeStyle === "torn" ? 5.0 : 5.4;
    const capeGeo = new THREE.PlaneGeometry(capeStyle === "long" ? 3.0 : 2.8, len, 8, 12);
    const pos = capeGeo.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Curves around the back and falls in soft folds.
      pos.setZ(i, -Math.pow(x / 1.5, 2) * 0.35 + Math.sin(x * 4.2) * 0.06 * (0.5 - y / len));
      if (capeStyle === "torn" && y < -len * 0.3) pos.setY(i, y + Math.abs(Math.sin(x * 4)) * 0.9);
    }
    capeGeo.computeVertexNormals();
    const capeCloth = shade(new THREE.Mesh(capeGeo, capeMat));
    capeCloth.position.y = -len / 2;
    cape = new THREE.Group();
    const capeTop = torsoH / 2 - 0.25;
    cape.position.set(0, capeTop, -(torsoSurfaceZ(0, capeTop, torsoH, -1) + 0.12));
    cape.rotation.x = 0.12;
    cape.add(capeCloth);
    torsoAnchor.add(cape);
  }

  avatarParts.leftArm = leftArm;
  avatarParts.rightArm = rightArm;
  avatarParts.leftForearm = leftForearm;
  avatarParts.rightForearm = rightForearm;
  avatarParts.leftLeg = leftLeg;
  avatarParts.rightLeg = rightLeg;
  avatarParts.leftShin = leftShin;
  avatarParts.rightShin = rightShin;
  avatarParts.leftHand = leftHand;
  avatarParts.rightHand = rightHand;
  avatarParts.torso = torso;
  avatarParts.head = head;
  if (halo) avatarParts.halo = halo;
  if (cape) avatarParts.cape = cape;
  if (spectralHands) avatarParts.spectralHands = spectralHands;
  if (staffGroup) avatarParts.staff = staffGroup;
  Object.values(avatarParts).forEach((part) => { part.userData.restPos = part.position.clone(); });
  group.userData.parts = avatarParts;
  group.userData.eyesList = eyesList;
  // Resting heights the animation system bobs around.
  group.userData.rest = { torsoY, headY, haloY: halo ? halo.position.y : 0 };

  if (showSword) {
    const swordGroup = new THREE.Group();
    swordGroup.name = "swordGroup";
    const backZ = -(torsoSurfaceZ(0, 0, torsoH, -1) + 0.25);
    const sword = mesh(new THREE.BoxGeometry(0.22, 4.6, 0.12), metal, swordGroup, 1.9, onTorso(4.7), backZ);
    sword.rotation.z = -0.62;
    const swordHandle = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.9, 8), std(0x5b351e, 0.75), swordGroup, 0.75, onTorso(6.3), backZ);
    swordHandle.rotation.z = -0.62;
    const guard = mesh(new THREE.BoxGeometry(0.9, 0.16, 0.2), metal, swordGroup, 1.05, onTorso(5.9), backZ);
    guard.rotation.z = -0.62;
    mesh(new THREE.SphereGeometry(0.15, 10, 8), metal, swordGroup, 0.5, onTorso(6.65), backZ);
    torsoAnchor.add(swordGroup);
  }

  if (showName) {
    const nameLabel = makeLabel(avatar.name, 0.95);
    nameLabel.position.y = headY + 2.3 * prop.head;
    group.add(nameLabel);
  }

  group.scale.set(prop.width, prop.height, prop.width);
  compactAvatarModel(group);
  avatarModels.add(group);
  return group;
}

// Every character model (player, NPCs, enemies), for blinking and distance culling.
const avatarModels = new Set();

// Pieces that move together are merged into one mesh per material, so each
// character costs ~25 draw calls instead of ~60. Moving parts (arms, legs, head,
// torso, cape, halo, spectral hands, sword) stay separate, as do blinking eyes.
function compactAvatarModel(group) {
  const parts = group.userData.parts || {};
  const boundaries = new Set([group]);
  Object.values(parts).forEach((part) => part && boundaries.add(part));
  if (parts.spectralHands) parts.spectralHands.children.forEach((ghost) => boundaries.add(ghost));
  const sword = group.getObjectByName("swordGroup");
  if (sword) boundaries.add(sword);
  const keep = new Set(group.userData.eyesList || []);
  group.updateMatrixWorld(true);

  const buckets = new Map();
  group.traverse((mesh) => {
    if (!mesh.isMesh || boundaries.has(mesh) || keep.has(mesh) || Array.isArray(mesh.material)) return;
    let owner = mesh.parent;
    while (owner && !boundaries.has(owner)) owner = owner.parent;
    if (!owner) return;
    const key = `${owner.uuid}|${mesh.material.uuid}|${mesh.castShadow ? 1 : 0}`;
    if (!buckets.has(key)) buckets.set(key, { owner, material: mesh.material, cast: mesh.castShadow, items: [] });
    buckets.get(key).items.push(mesh);
  });

  const inverse = new THREE.Matrix4();
  buckets.forEach(({ owner, material, cast, items }) => {
    if (items.length < 2) return;
    inverse.copy(owner.matrixWorld).invert();
    const geometries = items.map((mesh) => {
      const g = mesh.geometry.clone();
      g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld));
      return g;
    });
    const merged = new THREE.Mesh(mergeForBatch(geometries), material);
    merged.castShadow = cast;
    owner.add(merged);
    items.forEach((mesh) => mesh.parent.remove(mesh));
  });
}

// Hides characters too far away to see (they're a few pixels tall) and keeps
// the rest visible. Runs a few times a second.
const AVATAR_VISIBLE_RANGE = 650;
let avatarLodTimer = 0;
const avatarLodPos = new THREE.Vector3();
function updateAvatarLod(dt) {
  avatarLodTimer -= dt;
  if (avatarLodTimer > 0 || !playerMesh) return;
  avatarLodTimer = 0.3;
  const px = playerMesh.position.x;
  const pz = playerMesh.position.z;
  avatarModels.forEach((model) => {
    if (!model.parent) {
      // Replaced (e.g. the player changed avatar): forget it once it's out of the scene.
      if (!model.userData.lodSeen) avatarModels.delete(model);
      model.userData.lodSeen = false;
      return;
    }
    model.userData.lodSeen = true;
    model.getWorldPosition(avatarLodPos);
    model.visible = Math.hypot(avatarLodPos.x - px, avatarLodPos.z - pz) < AVATAR_VISIBLE_RANGE;
  });
}

// Hair is a shell that follows the sculpted skull, cut along a natural hairline
// (forehead, around the ears, nape), plus style-specific locks. Head space.
function hairShellGeometry(lift, topVolume, sideburns = true) {
  const geo = new THREE.SphereGeometry(1.25, 44, 30);
  const pos = geo.attributes.position;
  const coverage = new Float32Array(pos.count);
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    n.fromBufferAttribute(pos, i).normalize();
    // Hairline height: forehead in front, above the ears at the sides, low at the nape.
    let line = n.z > 0 ? 0.03 + 0.42 * n.z * n.z : 0.03 + 0.62 * n.z;
    if (sideburns) {
      const burn = Math.exp(-(((n.z - 0.2) / 0.12) ** 2)) * Math.max(0, Math.abs(n.x) - 0.75) * 4;
      line -= 0.45 * Math.min(1, burn);
    }
    coverage[i] = THREE.MathUtils.smoothstep(n.y, line - 0.03, line + 0.06);
  }
  // Below the hairline the shell sinks just under the skin, so the edge blends in
  // smoothly instead of ending in a jagged cut.
  const index = geo.index.array;
  sculptGeometry(geo, (v, i) => {
    sculptSkullPoint(v);
    const c = coverage[i];
    const up = Math.max(0, v.y);
    v.multiplyScalar(1 + THREE.MathUtils.lerp(-0.03, lift, c));
    v.y += up * topVolume * c;
  });
  const kept = [];
  for (let i = 0; i < index.length; i += 3) {
    if (coverage[index[i]] + coverage[index[i + 1]] + coverage[index[i + 2]] > 0) kept.push(index[i], index[i + 1], index[i + 2]);
  }
  geo.setIndex(kept);
  return geo;
}

function addHair(head, style, material, capMaterial = material) {
  const add = (geo, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z);
    m.castShadow = true;
    head.add(m);
    return m;
  };
  // A tapered lock of hair rooted on the scalp at direction (theta, phi), pointing outward.
  let seed = 11;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const lock = (dir, length, radius, tilt) => {
    const d = dir.clone().normalize();
    const root = sculptSkullPoint(d.clone().multiplyScalar(1.25)).multiplyScalar(1.03);
    const outward = d.clone().add(tilt).normalize();
    const m = add(new THREE.ConeGeometry(radius, length, 7));
    m.position.copy(root).addScaledVector(outward, length * 0.4);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), outward);
    return m;
  };

  if (style === "spiky") {
    add(hairShellGeometry(0.035, 0.04));
    for (let i = 0; i < 16; i += 1) {
      const a = (i / 16) * Math.PI * 2 + rand() * 0.3;
      const ring = i % 2 ? 0.45 : 0.7;
      const dir = new THREE.Vector3(Math.cos(a) * ring, 0.75 + rand() * 0.2, Math.sin(a) * ring - 0.1);
      lock(dir, 0.7 + rand() * 0.35, 0.22, new THREE.Vector3(0, 0.6, -0.5));
    }
    return;
  }

  if (style === "cap") {
    add(hairShellGeometry(0.03, 0.0));
    const crown = new THREE.Mesh(sculptGeometry(new THREE.SphereGeometry(1.25, 32, 14, 0, Math.PI * 2, 0, Math.PI * 0.46), (v) => {
      sculptSkullPoint(v);
      v.multiplyScalar(1.09);
    }), capMaterial);
    crown.position.y = 0.04;
    crown.castShadow = true;
    head.add(crown);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.06, 24, 1, false, -Math.PI / 2, Math.PI), capMaterial);
    brim.position.set(0, 0.5, 0.95);
    brim.rotation.x = 0.16;
    brim.scale.set(1, 1, 1.15);
    brim.castShadow = true;
    head.add(brim);
    const button = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), capMaterial);
    button.position.set(0, 1.55, 0);
    head.add(button);
    return;
  }

  if (style === "messy") {
    add(hairShellGeometry(0.06, 0.1));
    // Tufts over the crown.
    for (let i = 0; i < 14; i += 1) {
      const a = rand() * Math.PI * 2;
      const r = 0.25 + rand() * 0.55;
      const dir = new THREE.Vector3(Math.cos(a) * r, 0.8, Math.sin(a) * r - 0.15);
      lock(dir, 0.55 + rand() * 0.3, 0.24, new THREE.Vector3(Math.cos(a) * 0.6, 0.2, Math.sin(a) * 0.6 - 0.3));
    }
    // Fringe falling over the forehead.
    for (let i = 0; i < 6; i += 1) {
      const x = -0.5 + i * 0.2;
      lock(new THREE.Vector3(x, 0.55, 0.8), 0.6 + rand() * 0.2, 0.17, new THREE.Vector3(x * 0.3, -2.2, 0.9));
    }
    return;
  }

  // Short: a neat cut with a little volume on top and a soft side part.
  add(hairShellGeometry(0.04, 0.06));
  for (let i = 0; i < 5; i += 1) {
    const x = -0.15 + i * 0.13;
    lock(new THREE.Vector3(x, 0.62, 0.75), 0.5, 0.16, new THREE.Vector3(1.4, 0.6, -0.6));
  }
}

function addLimb(group, x, y, z, radius, height, material, lean, sleeveMaterial = null) {
  const limbGroup = new THREE.Group();
  limbGroup.position.set(x, y, z);
  limbGroup.rotation.z = lean;

  if (sleeveMaterial) {
    const sleeveHeight = height * 0.65;
    const forearmHeight = height * 0.35;

    // Sleeve part
    const sleeveGeo = new THREE.CylinderGeometry(radius, radius * 0.93, sleeveHeight, 14);
    const sleeve = new THREE.Mesh(sleeveGeo, sleeveMaterial);
    sleeve.position.y = -sleeveHeight / 2;
    sleeve.castShadow = true;
    limbGroup.add(sleeve);

    // Forearm part (skin)
    const forearmGeo = new THREE.CylinderGeometry(radius * 0.93, radius * 0.9, forearmHeight, 14);
    const forearm = new THREE.Mesh(forearmGeo, material);
    forearm.position.y = -sleeveHeight - forearmHeight / 2;
    forearm.castShadow = true;
    limbGroup.add(forearm);
  } else {
    const limb = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.9, height, 14), material);
    limb.position.y = -height / 2;
    limb.castShadow = true;
    limbGroup.add(limb);
  }

  group.add(limbGroup);
  return limbGroup;
}

function createStatButtons() {
  ui.statsList.innerHTML = "";
  Object.keys(player.stats).forEach((stat) => {
    const row = document.createElement("div");
    row.className = "stat-line";
    row.innerHTML = `<span>${statLabels[stat]}: <strong data-stat-value="${stat}">0</strong></span>`;
    const button = document.createElement("button");
    button.textContent = "+";
    button.addEventListener("click", () => spendPoint(stat));
    row.append(button);
    ui.statsList.append(row);
  });
}

function spendPoint(stat) {
  if (player.statPoints <= 0) return;
  player.statPoints -= 1;
  player.stats[stat] += 1;
  updateDerivedStats();
  updateHud();
  saveGame();
}

function updateDerivedStats(avatar = getSelectedAvatar()) {
  const oldMax = player.maxHealth;
  const traits = getAvatarTraits(avatar);
  player.maxHealth = Math.round((100 + player.stats.defense * 20) * traits.healthMultiplier);
  player.health = Math.min(player.maxHealth, player.health + Math.max(0, player.maxHealth - oldMax));
  player.maxStamina = Math.round(100 * clamp(traits.speedMultiplier + traits.healthMultiplier * 0.2, 0.82, 1.28));
  player.stamina = Math.min(player.stamina, player.maxStamina);
}

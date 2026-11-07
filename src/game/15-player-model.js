
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

// Builds a character: rounded torso, jointed limbs and a proper face.
// Part names and default joint positions (torso 5.7, head 8.65, shoulders 5.9,
// hips 2.45) are kept so every animation, NPC and enemy still lines up.
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

  const std = (color, roughness = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra });
  const bone = std("#ece4cf", 0.65);
  const skin = skeleton ? bone : std(avatar.skin, 0.62);
  const hair = std(avatar.hair, 0.9);
  const torsoMat = std(avatar.torsoColor || avatar.shirt || "#1b85aa", 0.84);
  const shirt = torsoMat;
  const leftArmMat = std(avatar.leftArmColor || avatar.shirt || "#1b85aa", 0.84);
  const rightArmMat = std(avatar.rightArmColor || avatar.shirt || "#1b85aa", 0.84);
  const leftLegMat = std(avatar.leftLegColor || avatar.pants || "#26364f", 0.86);
  const rightLegMat = std(avatar.rightLegColor || avatar.pants || "#26364f", 0.86);
  const beltMat = std(avatar.beltColor || avatar.boots || "#23170f", 0.9);
  const bootsMat = std(avatar.boots || "#23170f", 0.75);
  const metal = std(0xc8d7df, 0.25, { metalness: 0.7 });
  const trim = std(avatar.outfit === "armor" ? 0xb8c1c7 : avatar.boots || "#23170f", 0.65);
  const leather = std("#5c3d21", 0.82);
  const darkLeather = std("#362a22", 0.88);
  const shade = (mesh) => { mesh.castShadow = true; return mesh; };

  // ---- Layout (all heights in model units; defaults reproduce the classic rig) ----
  const FOOT_Y = -1.56;
  const legLen = 3.8 * prop.leg;
  const hipY = FOOT_Y + legLen + 0.21;               // 2.45 at default
  const torsoH = 4.1 * prop.torso;
  const torsoY = hipY + 3.25 + (torsoH - 4.1) / 2;   // 5.7 at default
  const torsoTop = torsoY + torsoH / 2;              // 7.75 at default
  const shoulderY = torsoTop - 1.85;                 // 5.9 at default
  const headR = 1.25 * prop.head;
  const headY = torsoTop + 0.9 + (headR - 1.25) * 0.85; // 8.65 at default
  const armLen = 2.5 * prop.arm;
  // Torso-relative heights for things strapped to the body.
  const onTorso = (absoluteDefaultY) => (absoluteDefaultY - 5.7) * prop.torso;

  // ---- Torso: tapered chest with rounded shoulders (or a ribcage) ----
  let torso;
  if (skeleton) {
    torso = new THREE.Group();
    const spine = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, torsoH, 8), bone));
    torso.add(spine);
    for (let i = 0; i < 5; i += 1) {
      const rib = shade(new THREE.Mesh(new THREE.TorusGeometry(1.05 - i * 0.06, 0.11, 6, 20, Math.PI * 1.6), bone));
      rib.rotation.x = Math.PI / 2;
      rib.rotation.z = Math.PI * 0.7;
      rib.scale.set(1.25, 0.75, 1);
      rib.position.y = torsoH * 0.32 - i * 0.48 * prop.torso;
      torso.add(rib);
    }
    const collarbone = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.2, 6), bone));
    collarbone.rotation.z = Math.PI / 2;
    collarbone.position.y = torsoH / 2 - 0.25;
    torso.add(collarbone);
  } else {
    const profile = [
      [0.01, -0.5], [0.98, -0.5], [1.02, -0.36], [0.92, -0.12], [1.12, 0.12],
      [1.32, 0.3], [1.36, 0.4], [1.22, 0.47], [0.62, 0.5], [0.01, 0.5],
    ].map(([r, y]) => new THREE.Vector2(r, y * torsoH));
    torso = shade(new THREE.Mesh(new THREE.LatheGeometry(profile, 22), torsoMat));
    torso.scale.set(1.18, 1, 0.66);
    torso.userData.surfaceScale = true;
  }
  torso.position.y = torsoY;
  group.add(torso);
  // Children of the torso move with it (and aren't stretched by its x/z scale).
  const torsoAnchor = new THREE.Group();
  if (!skeleton) torsoAnchor.scale.set(1 / 1.18, 1, 1 / 0.66);
  torso.add(torsoAnchor);

  // Hips / pelvis
  const pelvis = shade(new THREE.Mesh(new THREE.SphereGeometry(1.0, 18, 12), skeleton ? bone : std(avatar.pants || "#26364f", 0.86)));
  pelvis.scale.set(skeleton ? 1.2 : 1.55, skeleton ? 0.55 : 0.62, skeleton ? 0.8 : 0.95);
  pelvis.position.y = hipY + 0.55;
  group.add(pelvis);

  if (!skeleton && avatar.outfit === "coat") {
    const coatProfile = [[1.0, 0.5], [1.12, 0.1], [1.28, -0.4], [1.42, -0.62]].map(([r, y]) => new THREE.Vector2(r, y * 5.4));
    const coat = shade(new THREE.Mesh(new THREE.LatheGeometry(coatProfile, 22, 0, Math.PI * 2), std(avatar.torsoColor || avatar.shirt || "#1b85aa", 0.84, { side: THREE.DoubleSide })));
    coat.scale.set(1.2, 1, 0.72);
    coat.position.y = onTorso(5.0) - 0.1;
    torsoAnchor.add(coat);
  }
  if (!skeleton && avatar.outfit === "armor") {
    const plate = shade(new THREE.Mesh(new THREE.SphereGeometry(1.0, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), trim));
    plate.scale.set(1.55, 1.25, 0.6);
    plate.rotation.x = -Math.PI / 2;
    plate.position.set(0, onTorso(6.15), 0.62);
    torsoAnchor.add(plate);
  }

  // ---- Neck & head ----
  const neck = shade(new THREE.Mesh(new THREE.CylinderGeometry(skeleton ? 0.2 : 0.42, skeleton ? 0.22 : 0.5, 0.7, 12), skin));
  neck.position.y = torsoTop + 0.2;
  group.add(neck);

  const head = new THREE.Group(); // pivot at the head centre; scaled by head size
  head.position.y = headY;
  head.scale.setScalar(prop.head);
  head.userData = { isHead: true };
  group.add(head);
  const eyesList = [];

  if (skeleton) {
    const skull = shade(new THREE.Mesh(new THREE.SphereGeometry(1.2, 22, 16), bone));
    skull.scale.set(0.95, 1.0, 1.02);
    head.add(skull);
    const jaw = shade(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 1.1), bone));
    jaw.position.set(0, -0.95, 0.35);
    head.add(jaw);
    const socketMat = std("#14110e", 0.9);
    [-0.42, 0.42].forEach((x) => {
      const socket = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), socketMat);
      socket.scale.set(1, 1.1, 0.5);
      socket.position.set(x, 0.1, 1.02);
      head.add(socket);
      eyesList.push(socket);
    });
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 3), socketMat);
    nose.rotation.x = Math.PI;
    nose.position.set(0, -0.3, 1.12);
    head.add(nose);
    for (let i = -2; i <= 2; i += 1) {
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.06), bone);
      tooth.position.set(i * 0.17, -0.68, 1.08);
      head.add(tooth);
    }
  } else {
    const face = shade(new THREE.Mesh(new THREE.SphereGeometry(1.25, 28, 20), skin));
    face.scale.set(0.93, 1.08, 0.98);
    head.add(face);
    const jaw = shade(new THREE.Mesh(new THREE.SphereGeometry(0.85, 18, 12), skin));
    jaw.scale.set(1.05, 0.7, 0.95);
    jaw.position.set(0, -0.68, 0.2);
    head.add(jaw);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), skin);
    nose.scale.set(0.8, 1, 1.15);
    nose.position.set(0, -0.3, 1.2);
    head.add(nose);
    [-1, 1].forEach((side) => {
      const ear = shade(new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), skin));
      ear.scale.set(0.45, 1, 0.7);
      ear.position.set(side * 1.15, -0.15, 0);
      head.add(ear);
    });
    const white = std("#f6f3ec", 0.35);
    const iris = std(avatar.eyes || "#101820", 0.3);
    [-0.42, 0.42].forEach((x) => {
      const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), white);
      eyeWhite.scale.set(1, 0.8, 0.6);
      eyeWhite.position.set(x, -0.06, 1.05);
      head.add(eyeWhite);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), iris);
      pupil.position.set(x, -0.06, 1.15);
      head.add(pupil);
      eyesList.push(eyeWhite);
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.12), hair);
      brow.position.set(x, 0.17, 1.15);
      brow.rotation.z = x < 0 ? -0.1 : 0.1;
      head.add(brow);
    });
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 8, 16, Math.PI * 0.75), std("#7a2f34", 0.6));
    mouth.position.set(0, -0.68, 1.08);
    mouth.rotation.set(0.15, 0, Math.PI * 1.12);
    head.add(mouth);

    // Hair is authored around a head centred at y = 8.65, so offset it into head space.
    const hairGroup = new THREE.Group();
    hairGroup.position.y = -8.65;
    addHair(hairGroup, avatar.hairStyle || "short", hair);
    head.add(hairGroup);
  }

  if (options.bandanaColor) {
    const bandana = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.26, 12, 28), std(options.bandanaColor, 0.74));
    bandana.position.y = 0.4;
    bandana.rotation.x = Math.PI / 2;
    head.add(bandana);
  }

  // Headless: hide the head entirely, cap the neck.
  if (headStyle === "headless") {
    head.visible = false;
    const cap = new THREE.Mesh(new THREE.CircleGeometry(skeleton ? 0.2 : 0.42, 14), std("#5a1a1e", 0.7));
    cap.rotation.x = -Math.PI / 2;
    cap.position.y = torsoTop + 0.56;
    group.add(cap);
  }

  if (!skeleton) {
    const collar = shade(new THREE.Mesh(
      avatar.outfit === "adventurer" ? new THREE.CylinderGeometry(0.62, 0.68, 0.45, 14, 1, true) : new THREE.TorusGeometry(0.6, 0.13, 8, 18),
      avatar.outfit === "adventurer" ? leather : shirt,
    ));
    if (avatar.outfit !== "adventurer") collar.rotation.x = Math.PI / 2;
    collar.position.y = torsoTop + (avatar.outfit === "adventurer" ? 0.05 : -0.05);
    group.add(collar);
  }

  // ---- Limbs: shoulder/hip pivot groups, with elbow/knee joints ----
  const makeArm = (side, sleeveMat) => {
    const arm = new THREE.Group();
    arm.position.set(side * 2.25, shoulderY, 0);
    arm.rotation.z = side * 0.15;
    const r = skeleton ? 0.16 : 0.45;
    const upperLen = armLen * 0.55;
    const lowerLen = armLen * 0.45;
    const shoulder = shade(new THREE.Mesh(new THREE.SphereGeometry(skeleton ? 0.3 : 0.52, 14, 10), skeleton ? bone : sleeveMat));
    shoulder.scale.set(1, 0.85, 1);
    shoulder.position.set(-side * 0.12, -0.05, 0);
    arm.add(shoulder);
    const upper = shade(new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.88, upperLen, 12), skeleton ? bone : sleeveMat));
    upper.position.y = -upperLen / 2;
    arm.add(upper);
    const elbow = shade(new THREE.Mesh(new THREE.SphereGeometry(r * (skeleton ? 1.5 : 0.9), 12, 8), skeleton ? bone : skin));
    elbow.position.y = -upperLen;
    arm.add(elbow);
    const lower = shade(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r * 0.7, lowerLen, 12), skin));
    lower.position.y = -upperLen - lowerLen / 2;
    arm.add(lower);
    // Hand: palm with fingers and a thumb (pivot at the wrist like before).
    const hand = new THREE.Group();
    hand.position.y = -armLen - 0.25 * prop.arm;
    const palm = shade(new THREE.Mesh(new THREE.BoxGeometry(skeleton ? 0.4 : 0.5, 0.55, 0.26), skin));
    hand.add(palm);
    const fingers = shade(new THREE.Mesh(new THREE.BoxGeometry(skeleton ? 0.36 : 0.46, 0.34, 0.22), skin));
    fingers.position.set(0, -0.42, 0.04);
    fingers.rotation.x = 0.35;
    hand.add(fingers);
    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.32, 6), skin);
    thumb.position.set(-side * 0.28, -0.1, 0.12);
    thumb.rotation.z = side * 0.6;
    hand.add(thumb);
    arm.add(hand);
    group.add(arm);
    return { arm, hand };
  };
  const makeLeg = (side, legMat) => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.85, hipY, 0);
    leg.rotation.z = -side * 0.04;
    const r = skeleton ? 0.2 : 0.58;
    const thighLen = legLen * 0.52;
    const shinLen = legLen * 0.48;
    const thigh = shade(new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.82, thighLen, 12), skeleton ? bone : legMat));
    thigh.position.y = -thighLen / 2;
    leg.add(thigh);
    const knee = shade(new THREE.Mesh(new THREE.SphereGeometry(r * (skeleton ? 1.5 : 0.86), 12, 8), skeleton ? bone : legMat));
    knee.position.y = -thighLen;
    leg.add(knee);
    const shin = shade(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.8, r * 0.66, shinLen, 12), skeleton ? bone : legMat));
    shin.position.y = -thighLen - shinLen / 2;
    leg.add(shin);
    // Rounded boot (or a bony foot).
    const foot = shade(new THREE.Mesh(new THREE.SphereGeometry(0.62, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), skeleton ? bone : bootsMat));
    foot.scale.set(skeleton ? 0.7 : 0.92, 0.75, 1.3);
    foot.position.set(0, -legLen - 0.2, 0.2);
    leg.add(foot);
    const sole = new THREE.Mesh(new THREE.BoxGeometry(skeleton ? 0.75 : 1.05, 0.16, 1.55), skeleton ? bone : darkLeather);
    sole.position.set(0, -legLen - 0.17, 0.2);
    leg.add(sole);
    if (!skeleton) {
      const cuff = shade(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.78, r * 0.78, 0.32, 12), trim));
      cuff.position.y = -legLen + 0.25;
      leg.add(cuff);
    }
    group.add(leg);
    return leg;
  };
  const { arm: leftArm, hand: leftHand } = makeArm(-1, leftArmMat);
  const { arm: rightArm, hand: rightHand } = makeArm(1, rightArmMat);
  const leftLeg = makeLeg(-1, leftLegMat);
  const rightLeg = makeLeg(1, rightLegMat);

  if (!skeleton && avatar.outfit === "armor") {
    [leftArm, rightArm].forEach((arm) => {
      const pad = shade(new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), trim));
      pad.position.y = 0.15;
      arm.add(pad);
      const gauntlet = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 0.95, 12), trim));
      gauntlet.position.y = -armLen * 0.78;
      arm.add(gauntlet);
    });
  }

  // Belt sits on the hips.
  if (!skeleton) {
    const belt = shade(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.38, 20), beltMat));
    belt.scale.set(1.3, 1, 0.78);
    belt.position.y = hipY + 1.25;
    group.add(belt);
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.34, 0.1), metal);
    buckle.position.set(0, hipY + 1.25, 0.95);
    group.add(buckle);
  }

  if (!skeleton && avatar.outfit === "adventurer") {
    const strap = (x) => {
      const s2 = shade(new THREE.Mesh(new THREE.BoxGeometry(0.34, torsoH, 0.06), leather));
      s2.position.set(x, 0, 0.98);
      torsoAnchor.add(s2);
      const back = s2.clone();
      back.position.z = -0.98;
      torsoAnchor.add(back);
    };
    strap(-0.82);
    strap(0.82);
    [-0.82, 0.82].forEach((x) => {
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.24, 0.1), metal);
      buckle.position.set(x, onTorso(6.8), 1.02);
      torsoAnchor.add(buckle);
    });
    const backpack = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 3.2, 12), leather));
    backpack.position.set(0, onTorso(5.9), -1.35);
    backpack.rotation.z = Math.PI / 2;
    torsoAnchor.add(backpack);
    const pouch = shade(new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.9, 0.5), leather));
    pouch.position.set(1.62, hipY + 1.05, 0.38);
    pouch.rotation.y = 0.25;
    group.add(pouch);
    const satchel = shade(new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.6), leather));
    satchel.position.set(-1.62, hipY + 0.95, 0.22);
    satchel.rotation.y = -0.25;
    group.add(satchel);
    [leftHand, rightHand].forEach((hand) => {
      const glove = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.42, 12), darkLeather));
      glove.position.y = 0.32;
      hand.add(glove);
    });
    [leftLeg, rightLeg].forEach((leg) => {
      const pad = shade(new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), darkLeather));
      pad.scale.set(1, 1, 0.55);
      pad.position.set(0, -legLen * 0.52, 0.45);
      leg.add(pad);
    });
    // Wooden staff with glowing runes, held in the left hand.
    const staff = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 7.8, 8), leather));
    staff.position.set(0, armLen * 0.72 - 2.2, 0.45);
    leftArm.add(staff);
    const horn = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.11, 8, 16, Math.PI * 0.72), leather);
    horn.position.set(0, 4.0, 0.15);
    horn.rotation.x = Math.PI / 2;
    staff.add(horn);
    const runeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    [3.0, 2.6, 2.2].forEach((y) => {
      const rune = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.06), runeMat);
      rune.position.set(0, y, 0.16);
      staff.add(rune);
    });
  }

  // ---- Accessories ----
  let halo;
  if (accessory === "halo") {
    halo = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.12, 8, 24), new THREE.MeshBasicMaterial({ color: 0xffd700 }));
    halo.position.set(0, headY + 1.95 * prop.head, 0);
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
      ghost.position.set(side * 3.6, shoulderY + 1.6, -0.6);
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
    const capeMat = std(avatar.capeColor || avatar.shirt || "#a82020", 0.85, { metalness: 0.1, side: THREE.DoubleSide });
    const len = capeStyle === "long" ? 6.2 : capeStyle === "torn" ? 4.8 : 5.0;
    const capeGeo = new THREE.PlaneGeometry(capeStyle === "long" ? 3.0 : 2.8, len, 6, 8);
    // Gentle curve around the back.
    const pos = capeGeo.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      pos.setZ(i, -Math.pow(x / 1.5, 2) * 0.35);
      if (capeStyle === "torn" && pos.getY(i) < -len * 0.3) pos.setY(i, pos.getY(i) + Math.abs(Math.sin(x * 4)) * 0.9);
    }
    capeGeo.computeVertexNormals();
    const capeCloth = shade(new THREE.Mesh(capeGeo, capeMat));
    capeCloth.position.y = -len / 2;
    // Pivot at the shoulders so the animation swings it from the top.
    cape = new THREE.Group();
    cape.position.set(0, torsoH / 2 - 0.25, -0.95);
    cape.rotation.x = 0.12;
    cape.add(capeCloth);
    torsoAnchor.add(cape);
  }

  avatarParts.leftArm = leftArm;
  avatarParts.rightArm = rightArm;
  avatarParts.leftLeg = leftLeg;
  avatarParts.rightLeg = rightLeg;
  avatarParts.leftHand = leftHand;
  avatarParts.rightHand = rightHand;
  avatarParts.torso = torso;
  avatarParts.head = head;
  if (halo) avatarParts.halo = halo;
  if (cape) avatarParts.cape = cape;
  if (spectralHands) avatarParts.spectralHands = spectralHands;
  group.userData.parts = avatarParts;
  group.userData.eyesList = eyesList;
  // Resting heights the animation system bobs around.
  group.userData.rest = { torsoY, headY, haloY: halo ? halo.position.y : 0 };

  if (showSword) {
    const swordGroup = new THREE.Group();
    swordGroup.name = "swordGroup";
    const sword = shade(new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 0.22), metal));
    sword.position.set(2.55, onTorso(4.7), -1.05);
    sword.rotation.z = -0.62;
    swordGroup.add(sword);
    const swordHandle = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.22), std(0x5b351e, 0.75));
    swordHandle.position.set(1.35, onTorso(6.1), -1.05);
    swordHandle.rotation.z = -0.62;
    swordGroup.add(swordHandle);
    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), metal);
    pommel.position.set(1.1, onTorso(5.2), -1.05);
    swordGroup.add(pommel);
    torsoAnchor.add(swordGroup);
  }

  if (showName) {
    const nameLabel = makeLabel(avatar.name, 0.95);
    nameLabel.position.y = headY + 2.55 * prop.head;
    group.add(nameLabel);
  }

  group.scale.set(prop.width, prop.height, prop.width);
  return group;
}

function addHair(group, style, material) {
  if (style === "spiky") {
    for (let i = 0; i < 7; i += 1) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.05, 8), material);
      spike.position.set(-0.9 + i * 0.3, 9.45 + Math.sin(i) * 0.1, -0.05 + Math.cos(i) * 0.18);
      spike.rotation.z = -0.45 + i * 0.15;
      spike.castShadow = true;
      group.add(spike);
    }
    return;
  }

  if (style === "cap") {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1.34, 24, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), material);
    cap.position.y = 9.05;
    cap.castShadow = true;
    group.add(cap);

    const brim = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.16, 0.7), material);
    brim.position.set(0, 8.92, 1.2);
    brim.castShadow = true;
    group.add(brim);
    return;
  }

  if (style === "messy") {
    // Base hair cap covering top/back of head
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(1.35, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.58), material);
    hairCap.position.set(0, 9.0, -0.05);
    hairCap.castShadow = true;
    group.add(hairCap);

    // Front messy bangs hanging over face (fringe)
    const fringeCount = 5;
    for (let i = 0; i < fringeCount; i++) {
      const angle = -0.5 + (i / (fringeCount - 1)) * 1.0;
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.95, 6), material);
      const px = Math.sin(angle) * 0.95;
      const py = 9.15 - Math.abs(angle) * 0.15 + (i % 2 === 0 ? 0.05 : -0.05);
      const pz = 1.02 - Math.abs(angle) * 0.2;
      bang.position.set(px, py, pz);
      bang.rotation.x = Math.PI * 0.58;
      bang.rotation.y = -angle * 0.5;
      bang.rotation.z = -angle * 0.8 + 0.1 * Math.sin(i);
      bang.castShadow = true;
      group.add(bang);
    }

    // Top messy/wavy tufts pointing up/back/sides
    const tuftCount = 8;
    for (let i = 0; i < tuftCount; i++) {
      const theta = (i / tuftCount) * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.3;
      const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.15, 6), material);
      const px = Math.cos(theta) * r;
      const py = 9.7 + Math.random() * 0.25;
      const pz = Math.sin(theta) * r - 0.1;
      tuft.position.set(px, py, pz);
      tuft.rotation.x = (pz / 1.35) * 0.8 + 0.2;
      tuft.rotation.z = -(px / 1.35) * 0.8;
      tuft.rotation.y = Math.random() * Math.PI;
      tuft.castShadow = true;
      group.add(tuft);
    }

    // Sideburns
    const leftSide = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 6), material);
    leftSide.position.set(-1.18, 8.4, 0.45);
    leftSide.rotation.x = 0.1;
    leftSide.rotation.z = 0.18;
    leftSide.castShadow = true;
    group.add(leftSide);

    const rightSide = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 6), material);
    rightSide.position.set(1.18, 8.4, 0.45);
    rightSide.rotation.x = 0.1;
    rightSide.rotation.z = -0.18;
    rightSide.castShadow = true;
    group.add(rightSide);
    return;
  }

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(1.32, 24, 10, 0, Math.PI * 2, 0, Math.PI * 0.58), material);
  hairCap.position.y = 9.0;
  hairCap.castShadow = true;
  group.add(hairCap);
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

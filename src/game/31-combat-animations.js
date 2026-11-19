// ── 31-combat-animations.js ─ Held weapons, keyframed attack/skill poses and impact effects.
//
// Poses are keyframes over a normalised 0..1 timeline. Each key sets any of the
// channels below; channels a key leaves out keep whatever the walk/idle pose
// had. Actions blend in and out smoothly and cross-fade into each other, so
// combos chain without popping. Events (impact, release) fire on the frame the
// pose reaches them, which is when effects and damage land.
//
// Channels (right = weapon hand at +x, left = off hand):
//   rAx rAy rAz / lAx lAy lAz   shoulder rotation (x < 0 swings the arm forward/up)
//   rF / lF                     elbow (negative bends)
//   rH / lH                     wrist pitch
//   rLx rLz / lLx lLz           hip rotation (x < 0 lifts the leg forward)
//   rS / lS                     knee (positive bends)
//   tX tY tZ                    torso lean / twist / tilt
//   hX hY                       head pitch / turn
//   yaw                         whole-body turn (carries the arms with it)
//   lunge rise dip              step forward, lift off the ground, crouch (bends both knees)
//   spin                        extra whole-body turns (radians, not blended so full spins land cleanly)

const GUARD = { rAx: -0.78, rAz: -0.06, rF: -1.95, lAx: -0.9, lAz: 0.06, lF: -2.05, rH: 0.15, lH: 0.15 };
const STANCES = {
  melee: { ...GUARD, rS: 0.2, lS: 0.2, dip: 0.25 },
  sword: { rAx: -0.55, rAz: 0.12, rF: -0.95, rH: 0.55, lAx: -0.35, lF: -0.7, dip: 0.15 },
  gun: { rAx: -0.6, rAz: -0.05, rF: -0.65, rH: 0, lAx: -0.45, lF: -0.9 },
  special: { rAx: -0.45, rAz: 0.25, rF: -1.1, rH: -0.4, lAx: -0.45, lAz: -0.25, lF: -1.1, lH: -0.4 },
};

const kick = (extra = {}) => ({ ...extra });

const PLAYER_ACTIONS = {
  // ---- Fists: jab, cross, hook, uppercut ----
  jab: {
    dur: 0.32, events: { impact: 0.42 }, hand: "left", blendIn: 0.08,
    keys: [
      { t: 0.18, ease: "smooth", ...GUARD, yaw: -0.15, dip: 0.3 },
      { t: 0.42, ease: "out", lAx: -1.52, lAz: 0.14, lF: -0.06, lH: 0, rAx: -0.82, rF: -2.0, yaw: 0.34, tY: 0.12, lunge: 1.2, dip: 0.3, lLx: -0.3, rLx: 0.3, lS: 0.25, rS: 0.3 },
      { t: 0.62, lAx: -1.42, lF: -0.35 },
      { t: 1, ease: "smooth", ...GUARD },
    ],
  },
  cross: {
    dur: 0.34, events: { impact: 0.42 }, hand: "right", blendIn: 0.08,
    keys: [
      { t: 0.18, ease: "smooth", ...GUARD, yaw: 0.2, tY: 0.12, dip: 0.3 },
      { t: 0.42, ease: "out", rAx: -1.52, rAz: -0.16, rF: -0.05, rH: 0, lAx: -0.85, lF: -2.05, yaw: -0.48, tY: -0.22, lunge: 1.6, dip: 0.35, lLx: -0.35, rLx: 0.35, lS: 0.3, rS: 0.35 },
      { t: 0.62, rAx: -1.42, rF: -0.35 },
      { t: 1, ease: "smooth", ...GUARD },
    ],
  },
  hook: {
    dur: 0.36, events: { impact: 0.45 }, hand: "right", blendIn: 0.08,
    keys: [
      { t: 0.2, ease: "smooth", ...GUARD, rAx: -1.25, rAz: 0.85, rAy: -1.3, rF: -1.5, yaw: 0.45, dip: 0.35 },
      { t: 0.45, ease: "out", rAx: -1.5, rAz: -0.3, rAy: -1.5, rF: -1.45, yaw: -0.7, tY: -0.3, lunge: 1.0, dip: 0.4 },
      { t: 0.65, rAz: -0.42, rAy: -1.5, yaw: -0.75 },
      { t: 1, ease: "smooth", ...GUARD },
    ],
  },
  uppercut: {
    dur: 0.4, events: { impact: 0.45 }, hand: "left", blendIn: 0.08,
    keys: [
      { t: 0.22, ease: "smooth", ...GUARD, lAx: -0.1, lF: -2.2, yaw: -0.3, tX: 0.18, dip: 0.8 },
      { t: 0.45, ease: "out", lAx: -2.55, lAz: 0.12, lF: -1.35, yaw: 0.38, tX: -0.2, dip: 0, rise: 0.45 },
      { t: 0.65, lAx: -2.6, rise: 0.25 },
      { t: 1, ease: "smooth", ...GUARD },
    ],
  },
  "gatling-l": {
    dur: 0.15, events: { impact: 0.4 }, hand: "left", blendIn: 0.05, blendOut: 0.2,
    keys: [
      { t: 0.15, ...GUARD, yaw: -0.1, dip: 0.3 },
      { t: 0.4, ease: "out", lAx: -1.5, lF: -0.08, lH: 0, rAx: -0.85, rF: -2.0, yaw: 0.3, lunge: 0.6, dip: 0.3 },
      { t: 1, ...GUARD, dip: 0.3 },
    ],
  },
  "gatling-r": {
    dur: 0.15, events: { impact: 0.4 }, hand: "right", blendIn: 0.05, blendOut: 0.2,
    keys: [
      { t: 0.15, ...GUARD, yaw: 0.1, dip: 0.3 },
      { t: 0.4, ease: "out", rAx: -1.5, rF: -0.08, rH: 0, lAx: -0.85, lF: -2.0, yaw: -0.3, lunge: 0.6, dip: 0.3 },
      { t: 1, ...GUARD, dip: 0.3 },
    ],
  },
  // Inferno Kick: a snap front kick and a spinning roundhouse.
  "front-kick": {
    dur: 0.46, events: { impact: 0.46 }, foot: "right",
    keys: [
      { t: 0.22, ease: "smooth", ...GUARD, rLx: -1.5, rS: 2.0, lS: 0.25, tX: -0.15, yaw: 0.1 },
      { t: 0.46, ease: "out", rLx: -1.62, rS: 0.06, tX: -0.32, lunge: 1.3, rise: 0.15 },
      { t: 0.7, rLx: -1.3, rS: 1.6 },
      { t: 1, ease: "smooth", rLx: 0.1, rS: 0.1 },
    ],
  },
  "spin-kick": {
    dur: 0.58, events: { impact: 0.52 }, foot: "right",
    keys: [
      { t: 0.12, ...GUARD, spin: 0, rS: 1.2, rLx: -0.6 },
      { t: 0.38, ease: "smooth", rLx: -0.45, rLz: 1.35, rS: 0.15, tZ: -0.42, lAz: -0.9, lAx: -0.6, rAz: 0.6, rAx: -0.4, lF: -0.5, rF: -0.5, rise: 0.35 },
      { t: 0.82, ease: "smooth", spin: -Math.PI * 2, rLz: 1.25 },
      { t: 1, ease: "smooth", rLz: 0, rLx: 0.1, rS: 0.1, tZ: 0, rise: 0 },
    ],
  },

  // ---- Sword: three-hit combo plus skills ----
  "slash-1": {
    dur: 0.4, events: { impact: 0.5 }, trail: [0.26, 0.72], slash: { roll: -0.25, sweep: -1 },
    keys: [
      { t: 0.26, ease: "smooth", rAx: -1.3, rAz: 1.15, rAy: -1.1, rF: -0.7, rH: 0.75, yaw: 0.48, tY: 0.15, dip: 0.35, lAx: -0.5, lAz: -0.45, lF: -1.0 },
      { t: 0.5, ease: "out", rAx: -1.45, rAz: -0.65, rAy: -1.3, rF: -0.25, yaw: -0.62, tY: -0.25, lunge: 1.8, dip: 0.3, lLx: -0.4, rLx: 0.35, lS: 0.35 },
      { t: 0.72, rAx: -1.2, rAz: -0.95, rF: -0.5, yaw: -0.72 },
    ],
  },
  "slash-2": {
    dur: 0.4, events: { impact: 0.48 }, trail: [0.24, 0.7], slash: { roll: 0.45, sweep: 1 },
    keys: [
      { t: 0.24, ease: "smooth", rAx: -0.7, rAz: -0.75, rAy: 1.1, rF: -1.0, rH: 0.6, yaw: -0.45, tY: -0.2, dip: 0.45 },
      { t: 0.48, ease: "out", rAx: -2.15, rAz: 0.95, rAy: 1.2, rF: -0.2, yaw: 0.52, tY: 0.25, lunge: 1.4, rise: 0.15, dip: 0 },
      { t: 0.7, rAx: -2.25, rAz: 1.15, yaw: 0.56 },
    ],
  },
  "slash-3": {
    dur: 0.52, events: { impact: 0.52 }, trail: [0.32, 0.74], slash: { roll: Math.PI / 2, sweep: 1, big: true },
    keys: [
      { t: 0.3, ease: "smooth", rAx: -2.95, rAz: 0.15, rF: -1.0, rH: 0.6, lAx: -2.6, lAz: -0.12, lF: -1.2, tX: -0.2, rise: 0.25, yaw: -0.1 },
      { t: 0.52, ease: "out", rAx: -0.85, rAz: -0.05, rF: -0.15, lAx: -0.9, lF: -0.6, tX: 0.4, dip: 0.9, rise: 0, lunge: 2.4, lLx: -0.55, lS: 0.7, rLx: 0.45, rS: 0.4 },
      { t: 0.75, rAx: -0.6, tX: 0.35 },
    ],
  },
  thrust: {
    dur: 0.45, events: { impact: 0.45 }, trail: [0.3, 0.6],
    keys: [
      { t: 0.25, ease: "smooth", rAx: -1.25, rF: -1.9, rAz: 0.25, rH: 1.2, yaw: 0.45, dip: 0.4 },
      { t: 0.45, ease: "out", rAx: -1.55, rF: -0.02, rAz: -0.1, rH: 1.45, yaw: -0.45, lunge: 3.2, tX: 0.22, lLx: -0.5, lS: 0.6, rLx: 0.5, dip: 0.5 },
      { t: 0.7, rAx: -1.5, lunge: 3.0 },
    ],
  },
  cyclone: {
    dur: 0.72, events: { impact: 0.45 }, trail: [0.12, 0.85],
    keys: [
      { t: 0.12, ease: "smooth", rAx: -1.5, rAz: 1.35, rAy: -1.3, rH: 0.9, rF: -0.1, lAz: -1.0, lAx: -0.6, spin: 0, dip: 0.3 },
      { t: 0.85, ease: "smooth", spin: -Math.PI * 4, rise: 0.5, tZ: -0.15 },
    ],
  },
  "dimension-cut": {
    dur: 0.8, events: { impact: 0.62 }, trail: [0.48, 0.8], slash: { roll: Math.PI / 2, sweep: 1, big: true },
    keys: [
      { t: 0.38, ease: "smooth", rAx: -3.0, lAx: -2.85, rF: -0.7, lF: -0.9, rH: 0.9, tX: -0.32, rise: 0.4 },
      { t: 0.5, rAx: -3.05, tX: -0.35 },
      { t: 0.64, ease: "out", rAx: -0.6, lAx: -0.8, rF: -0.1, tX: 0.5, dip: 1.2, rise: 0, lunge: 2.5, lLx: -0.6, lS: 0.8, rLx: 0.5 },
      { t: 0.85, rAx: -0.5 },
    ],
  },

  // ---- Pistol ----
  shoot: {
    dur: 0.42, events: { fire: 0.18 }, blendIn: 0.1, blendOut: 0.3,
    keys: [
      { t: 0.18, ease: "out", rAx: -1.56, rAz: -0.18, rAy: 0, rF: -0.05, rH: 0, lAx: -1.32, lAz: 0.42, lF: -0.75, yaw: -0.28, tY: -0.1 },
      { t: 0.3, ease: "out", rAx: -1.95, rF: -0.55, tX: -0.08, lunge: -0.45 },
      { t: 0.55, ease: "smooth", rAx: -1.58, rF: -0.1, tX: 0, lunge: 0 },
      { t: 1, rAx: -1.5 },
    ],
  },
  "shoot-heavy": {
    dur: 0.62, events: { fire: 0.22 }, blendIn: 0.1, blendOut: 0.3,
    keys: [
      { t: 0.22, ease: "out", rAx: -1.56, rAz: -0.22, rF: -0.05, rH: 0, lAx: -1.45, lAz: 0.5, lF: -0.5, yaw: -0.25, dip: 0.45, lLx: -0.35, rLx: 0.35 },
      { t: 0.36, ease: "out", rAx: -2.45, rF: -0.9, lAx: -1.9, tX: -0.22, lunge: -1.5, dip: 0.6 },
      { t: 0.7, ease: "smooth", rAx: -1.6, rF: -0.15, lAx: -1.45, tX: 0, lunge: -0.5 },
    ],
  },

  // ---- Special / magic ----
  cast: {
    dur: 0.62, events: { release: 0.5 }, charge: [0.05, 0.48],
    keys: [
      { t: 0.36, ease: "smooth", rAx: 0.35, lAx: 0.35, rF: -1.7, lF: -1.7, rAz: 0.25, lAz: -0.25, dip: 0.6, tX: 0.12 },
      { t: 0.5, ease: "out", rAx: -1.5, lAx: -1.5, rAz: -0.28, lAz: 0.28, rF: -0.08, lF: -0.08, rH: -1.2, lH: -1.2, lunge: 1.0, tX: -0.1, dip: 0 },
      { t: 0.75, rAx: -1.42, lAx: -1.42 },
    ],
  },
  "sky-cast": {
    dur: 0.95, events: { release: 0.55 }, charge: [0.05, 0.52],
    keys: [
      { t: 0.35, ease: "smooth", rAx: -1.0, lAx: -1.0, rAz: -0.6, lAz: 0.6, rF: -1.8, lF: -1.8, dip: 0.7, tX: 0.2, hX: 0.2 },
      { t: 0.55, ease: "out", rAx: -3.0, lAx: -3.0, rAz: 0.38, lAz: -0.38, rF: -0.1, lF: -0.1, rH: -0.6, lH: -0.6, hX: -0.42, tX: -0.18, dip: 0, rise: 0.6 },
      { t: 0.85, rAx: -2.95, lAx: -2.95, rise: 0.45 },
    ],
  },
  "burst-out": {
    dur: 0.7, events: { release: 0.48 }, charge: [0.05, 0.45],
    keys: [
      { t: 0.32, ease: "smooth", rAx: -1.2, rAz: -0.7, lAx: -1.2, lAz: 0.7, rF: -1.6, lF: -1.6, dip: 0.55, tX: 0.15 },
      { t: 0.48, ease: "out", rAx: -1.1, rAz: 1.5, lAx: -1.1, lAz: -1.5, rF: -0.1, lF: -0.1, rH: -0.8, lH: -0.8, dip: 0, rise: 0.25, tX: -0.12, hX: -0.15 },
      { t: 0.8, rAz: 1.4, lAz: -1.4 },
    ],
  },
  beam: {
    dur: 1.45, events: { release: 0.18 }, charge: [0.0, 0.16],
    keys: [
      { t: 0.16, ease: "out", rAx: -1.52, lAx: -1.52, rAz: -0.3, lAz: 0.3, rF: -0.05, lF: -0.05, rH: -1.2, lH: -1.2, dip: 0.45, lLx: -0.4, rLx: 0.4, lunge: -0.6, tX: -0.08 },
      { t: 0.85, rAx: -1.5, lAx: -1.5, lunge: -0.9 },
    ],
  },

  // ---- Melee skills ----
  "power-punch": {
    dur: 0.78, events: { impact: 0.5 }, hand: "right", charge: [0.05, 0.4], chargeColor: 0xffb347,
    keys: [
      { t: 0.36, ease: "smooth", rAx: 0.55, rAz: 0.3, rF: -2.1, lAx: -1.3, lAz: 0.2, lF: -0.6, yaw: 0.62, tY: 0.3, dip: 0.85, lLx: -0.45, lS: 0.6, rLx: 0.45, rS: 0.5 },
      { t: 0.42, rAx: 0.6, yaw: 0.64 },
      { t: 0.5, ease: "out", rAx: -1.55, rAz: -0.1, rF: -0.02, rH: 0, lAx: -0.4, lF: -1.4, yaw: -0.78, tY: -0.35, tX: 0.25, lunge: 3.5, dip: 0.6, lLx: -0.6, lS: 0.5, rLx: 0.6, rS: 0.2 },
      { t: 0.78, rAx: -1.5, lunge: 3.2 },
    ],
  },
  "slam-down": {
    dur: 0.68, events: { impact: 0.5 },
    keys: [
      { t: 0.28, ease: "out", rise: 3.0, rAx: -3.0, lAx: -3.0, rF: -0.4, lF: -0.4, tX: -0.25, lLx: -0.8, lS: 1.6, rLx: -0.6, rS: 1.4 },
      { t: 0.5, ease: "in", rise: 0, dip: 1.4, rAx: -0.5, lAx: -0.5, rF: -0.2, lF: -0.2, tX: 0.6, lLx: -0.4, rLx: 0.4, lS: 0.4, rS: 0.4 },
      { t: 0.78, dip: 1.2, tX: 0.5 },
    ],
  },
  "air-slam": {
    dur: 0.42, events: { impact: 0.3 },
    keys: [
      { t: 0.1, ease: "out", rAx: -3.0, lAx: -3.0, rF: -0.3, lF: -0.3, tX: -0.2, lS: 1.4, rS: 1.4 },
      { t: 0.3, ease: "in", dip: 1.4, rAx: -0.5, lAx: -0.5, tX: 0.6, lLx: -0.4, rLx: 0.4 },
      { t: 0.7, dip: 1.1, tX: 0.45 },
    ],
  },
  "flying-kick": {
    dur: 0.42, events: { impact: 0.2 }, foot: "right",
    keys: [
      { t: 0.15, ease: "out", rLx: -1.55, rS: 0.05, lLx: 0.5, lS: 1.9, tX: -0.35, rAx: 0.7, lAx: 0.7, rAz: 0.4, lAz: -0.4, rF: -0.4, lF: -0.4, rise: 1.6 },
      { t: 0.8, rise: 1.4 },
    ],
  },
};

// Spirit Bolt: draw energy into the right hand, then thrust the palm forward.
PLAYER_ACTIONS["spirit-bolt"] = {
  dur: 0.5, events: { release: 0.46 }, charge: [0.05, 0.4], blendIn: 0.08,
  keys: [
    { t: 0.32, ease: "smooth", rAx: -0.55, rAz: 0.35, rF: -1.75, rH: -0.5, lAx: -0.6, lF: -1.3, yaw: 0.3, tY: 0.15, dip: 0.3 },
    { t: 0.46, ease: "out", rAx: -1.55, rAz: -0.12, rF: -0.05, rH: -1.25, lAx: -0.45, lF: -1.1, yaw: -0.25, tY: -0.12, lunge: 0.8, dip: 0.2 },
    { t: 0.7, rAx: -1.45, rF: -0.15 },
  ],
};

// Switching weapons: reach back for it, then bring it up ready.
PLAYER_ACTIONS.draw = {
  dur: 0.4, blendIn: 0.15, blendOut: 0.35,
  keys: [
    { t: 0.4, ease: "smooth", rAx: 0.55, rAz: 0.4, rF: -1.7, tY: 0.3, hY: 0.25 },
    { t: 0.75, ease: "out", rAx: -1.15, rAz: 0.1, rF: -0.9, tY: -0.1, hY: 0 },
  ],
};

// Gatling flurry: ten alternating punches, built from the quick jabs.
PLAYER_ACTIONS.flurry = (() => {
  const keys = [];
  const n = 10;
  for (let i = 0; i < n; i += 1) {
    const t0 = i / n;
    const right = i % 2 === 0;
    keys.push({ t: t0 + 0.02, ...GUARD, dip: 0.35, yaw: right ? 0.12 : -0.12 });
    keys.push(right
      ? { t: t0 + 0.06, ease: "out", rAx: -1.5, rF: -0.08, rH: 0, lAx: -0.85, lF: -2.0, yaw: -0.32, lunge: 0.8, dip: 0.35 }
      : { t: t0 + 0.06, ease: "out", lAx: -1.5, lF: -0.08, lH: 0, rAx: -0.85, rF: -2.0, yaw: 0.32, lunge: 0.8, dip: 0.35 });
  }
  return { dur: 1.0, keys, blendIn: 0.04, blendOut: 0.1 };
})();

// ---- Playing actions ----

const playerCombo = { melee: 0, sword: 0, last: 0, gatling: 0 };
const attackFacing = { timer: 0, yaw: 0 };

// Turn the player toward a direction for a moment (attacks shouldn't swing at thin air
// just because the movement keys point elsewhere).
function faceAttackDirection(direction, duration = 0.35) {
  if (!direction || direction.lengthSq() < 1e-4) return;
  attackFacing.yaw = Math.atan2(direction.x, direction.z);
  attackFacing.timer = duration;
}

function updateAttackFacing(dt) {
  if (attackFacing.timer <= 0 || !playerMesh) return;
  attackFacing.timer -= dt;
  let turn = attackFacing.yaw - playerMesh.rotation.y;
  turn = Math.atan2(Math.sin(turn), Math.cos(turn));
  playerMesh.rotation.y += turn * (1 - Math.exp(-28 * dt));
}

function playPlayerAction(name, handlers = {}) {
  const def = PLAYER_ACTIONS[name];
  const anim = playerMesh?.userData?.animation;
  if (!def || !anim) return null;
  anim.actions = anim.actions || [];
  anim.actions.forEach((action) => { action.fading = true; });
  const action = { name, def, t: 0, fade: 1, fading: false, handlers, fired: {} };
  anim.actions.push(action);
  anim.stanceTimer = 4;
  return action;
}

// Picks the next move of the basic-attack combo for the current weapon.
function nextBasicAttackAction() {
  const now = performance.now() / 1000;
  const weapon = player.weapon;
  const chained = now - playerCombo.last < 0.85;
  playerCombo.last = now;
  if (weapon === "melee") {
    if (player.mastery.melee >= 50) {
      playerCombo.gatling = (playerCombo.gatling + 1) % 2;
      return playerCombo.gatling ? "gatling-r" : "gatling-l";
    }
    playerCombo.melee = chained ? (playerCombo.melee + 1) % 4 : 0;
    if (player.diableJambeTimer > 0) return playerCombo.melee % 2 ? "spin-kick" : "front-kick";
    return ["jab", "cross", "hook", "uppercut"][playerCombo.melee];
  }
  if (weapon === "sword") {
    playerCombo.sword = chained ? (playerCombo.sword + 1) % 3 : 0;
    return `slash-${playerCombo.sword + 1}`;
  }
  if (weapon === "gun") return "shoot";
  return "cast";
}

// Seconds from the start of an action until its first event.
function actionEventDelay(name) {
  const def = PLAYER_ACTIONS[name];
  if (!def || !def.events) return 0;
  return Math.min(...Object.values(def.events)) * def.dur;
}

const easeFns = {
  linear: (u) => u,
  in: (u) => u * u,
  out: (u) => 1 - (1 - u) ** 3,
  smooth: (u) => u * u * (3 - 2 * u),
};

// Value of one channel at progress p; `base` is the pose underneath.
function sampleActionChannel(keys, p, channel, base) {
  let prev = null;
  let next = null;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (key[channel] === undefined) continue;
    if (key.t <= p) prev = key;
    else { next = key; break; }
  }
  if (!prev && !next) return undefined;
  if (!next) return prev[channel];
  const a = prev ? prev[channel] : base;
  const t0 = prev ? prev.t : 0;
  const u = THREE.MathUtils.clamp((p - t0) / Math.max(1e-4, next.t - t0), 0, 1);
  return a + (next[channel] - a) * (easeFns[next.ease] || easeFns.smooth)(u);
}

function actionChannelRefs(model) {
  if (model.userData.actionRefs) return model.userData.actionRefs;
  const p = model.userData.parts;
  const refs = {
    rAx: [p.rightArm.rotation, "x"], rAy: [p.rightArm.rotation, "y"], rAz: [p.rightArm.rotation, "z"],
    lAx: [p.leftArm.rotation, "x"], lAy: [p.leftArm.rotation, "y"], lAz: [p.leftArm.rotation, "z"],
    rF: [p.rightForearm.rotation, "x"], lF: [p.leftForearm.rotation, "x"],
    rH: [p.rightHand.rotation, "x"], lH: [p.leftHand.rotation, "x"],
    rLx: [p.rightLeg.rotation, "x"], rLz: [p.rightLeg.rotation, "z"],
    lLx: [p.leftLeg.rotation, "x"], lLz: [p.leftLeg.rotation, "z"],
    rS: [p.rightShin.rotation, "x"], lS: [p.leftShin.rotation, "x"],
    tX: [p.torso.rotation, "x"], tY: [p.torso.rotation, "y"], tZ: [p.torso.rotation, "z"],
    hX: [p.head.rotation, "x"], hY: [p.head.rotation, "y"],
    yaw: [model.rotation, "y"],
  };
  model.userData.actionRefs = refs;
  return refs;
}

const ADDITIVE_CHANNELS = ["lunge", "rise", "dip"];

function blendEnvelope(def, p) {
  const inT = def.blendIn ?? 0.12;
  const outT = def.blendOut ?? 0.25;
  const a = inT > 0 ? THREE.MathUtils.smoothstep(p, 0, inT) : 1;
  const b = outT > 0 ? 1 - THREE.MathUtils.smoothstep(p, 1 - outT, 1) : 1;
  return a * b;
}

// Applies a set of channel values (a pose) on top of the current pose with weight w.
function applyPoseChannels(model, values, w, additive, swimming) {
  const refs = actionChannelRefs(model);
  Object.keys(values).forEach((ch) => {
    const ref = refs[ch];
    if (!ref) return;
    if (swimming && (ch[1] === "L" || ch.endsWith("S") || ch === "yaw")) return;
    const [obj, key] = ref;
    obj[key] += (values[ch] - obj[key]) * w;
  });
  if (swimming) return;
  additive.lunge += (values.lunge || 0) * w;
  additive.rise += (values.rise || 0) * w;
  additive.dip += (values.dip || 0) * w;
}

// Runs the combat stance and every active action for this frame.
function applyPlayerActions(model, anim, dt) {
  const swimming = player.isSwimming;
  const additive = { lunge: 0, rise: 0, dip: 0, spin: 0 };
  const parts = model.userData.parts;
  // Channels the walk/idle pose doesn't drive are reset here so poses never stick.
  model.rotation.y = 0;
  parts.rightHand.rotation.x = 0;
  parts.leftHand.rotation.x = 0;
  parts.torso.rotation.z = 0;

  // Combat stance: after fighting, the player holds a ready pose for a few seconds.
  anim.stanceTimer = Math.max(0, (anim.stanceTimer || 0) - dt);
  const stanceTarget = anim.stanceTimer > 0 && !swimming && (anim.air || 0) < 0.5 ? 1 : 0;
  anim.stanceW = THREE.MathUtils.lerp(anim.stanceW || 0, stanceTarget, 1 - Math.exp(-6 * dt));
  const stance = STANCES[player.weapon];
  if (stance && anim.stanceW > 0.01) {
    const moving = playerMoveState.velocity.lengthSq() > 40;
    applyPoseChannels(model, stance, anim.stanceW * (moving ? 0.75 : 1), additive, swimming);
  }

  const actions = anim.actions || [];
  for (let i = 0; i < actions.length; i += 1) {
    const action = actions[i];
    const def = action.def;
    action.t += dt;
    const p = Math.min(1, action.t / def.dur);
    if (action.fading) action.fade -= dt / 0.09;
    // Events fire once, when the timeline passes them.
    if (def.events) {
      Object.entries(def.events).forEach(([name, at]) => {
        if (!action.fired[name] && p >= at) {
          action.fired[name] = true;
          try { action.handlers[name]?.(action); } catch (err) { console.warn(err); }
        }
      });
    }
    const w = blendEnvelope(def, p) * Math.max(0, action.fade);
    const values = {};
    const refs = actionChannelRefs(model);
    const channels = new Set();
    def.keys.forEach((key) => Object.keys(key).forEach((ch) => { if (ch !== "t" && ch !== "ease") channels.add(ch); }));
    channels.forEach((ch) => {
      if (ch === "spin") return;
      const base = refs[ch] ? refs[ch][0][refs[ch][1]] : 0;
      const v = sampleActionChannel(def.keys, p, ch, base);
      if (v !== undefined) values[ch] = v;
    });
    applyPoseChannels(model, values, w, additive, swimming);
    if (channels.has("spin") && !swimming) additive.spin += sampleActionChannel(def.keys, p, "spin", 0) || 0;
    action.progress = p;
  }
  anim.actions = actions.filter((a) => {
    const keep = a.t < a.def.dur && a.fade > 0;
    // An action cut short by the next one still lands its hit.
    if (!keep && a.def.events) {
      Object.keys(a.def.events).forEach((name) => {
        if (!a.fired[name]) {
          a.fired[name] = true;
          try { a.handlers[name]?.(a); } catch (err) { console.warn(err); }
        }
      });
    }
    return keep;
  });

  // Root motion and crouch.
  model.rotation.y += additive.spin;
  if (!swimming) {
    model.position.z = additive.lunge;
    model.position.y = additive.rise;
    additive.dip *= 0.55;
    if (additive.dip > 0.001) {
      // Crouch: hips drop by `dip`, thighs swing forward and knees bend twice as far,
      // which keeps the feet planted under the body.
      const L = Math.max(1, parts.rightShin.position.y * -1);
      const a = Math.acos(THREE.MathUtils.clamp(1 - additive.dip / (2 * L), -1, 1));
      model.position.y -= additive.dip;
      parts.leftLeg.rotation.x -= a;
      parts.rightLeg.rotation.x -= a;
      parts.leftShin.rotation.x += 2 * a;
      parts.rightShin.rotation.x += 2 * a;
    }
  }
  // One matrix update per frame; hand/muzzle positions are read from this cache.
  playerMesh.updateMatrixWorld(true);
  const held = model.userData.held;
  parts.rightHand.localToWorld(handCache.right.set(0, -0.45, 0.05));
  parts.leftHand.localToWorld(handCache.left.set(0, -0.45, 0.05));
  if (held?.gun) held.gun.userData.muzzle.getWorldPosition(handCache.muzzle);
  handCache.valid = true;
  updateSwordTrail(model, anim, dt);
  updateActionCharge(anim);
}

const handCache = { right: new THREE.Vector3(), left: new THREE.Vector3(), muzzle: new THREE.Vector3(), valid: false };

// ---- Held weapons ----

function buildHeldSword() {
  const group = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xd8e2ea).convertSRGBToLinear(), metalness: 0.85, roughness: 0.22 });
  const dark = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x3b2416).convertSRGBToLinear(), roughness: 0.7 });
  const brass = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xc9a24a).convertSRGBToLinear(), metalness: 0.8, roughness: 0.3 });
  // Blade along +z from the fist (thumb side), tapering to a point.
  const shape = new THREE.Shape();
  const L = 4.6;
  shape.moveTo(-0.17, 0);
  shape.lineTo(-0.15, L * 0.82);
  shape.quadraticCurveTo(-0.12, L * 0.95, 0, L);
  shape.quadraticCurveTo(0.1, L * 0.93, 0.15, L * 0.82);
  shape.lineTo(0.17, 0);
  shape.lineTo(-0.17, 0);
  const bladeGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.03, bevelSegments: 1, steps: 1 });
  bladeGeo.translate(0, 0, -0.025);
  bladeGeo.rotateX(Math.PI / 2); // shape's +y becomes +z
  const blade = new THREE.Mesh(bladeGeo, steel);
  blade.position.z = 0.42;
  blade.castShadow = true;
  group.add(blade);
  const fuller = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.11, L * 0.7), new THREE.MeshStandardMaterial({ color: 0x8a96a0, metalness: 0.9, roughness: 0.3 }));
  fuller.position.set(0, 0, 0.42 + L * 0.38);
  group.add(fuller);
  const guard = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.16, 0.16), brass);
  guard.position.z = 0.36;
  group.add(guard);
  [-1, 1].forEach((s) => {
    const end = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), brass);
    end.position.set(s * 0.5, 0, 0.36);
    group.add(end);
  });
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.78, 10), dark);
  grip.rotation.x = Math.PI / 2;
  grip.position.z = -0.02;
  group.add(grip);
  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), brass);
  pommel.position.z = -0.45;
  group.add(pommel);
  const base = new THREE.Object3D();
  base.position.z = 0.9;
  const tip = new THREE.Object3D();
  tip.position.z = 0.42 + L;
  group.add(base, tip);
  group.userData.trailBase = base;
  group.userData.trailTip = tip;
  return group;
}

// Flintlock pistol: grip in the fist, barrel along the fingers.
function buildHeldPistol() {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x6b3f22).convertSRGBToLinear(), roughness: 0.6 });
  const iron = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x4a4f55).convertSRGBToLinear(), metalness: 0.8, roughness: 0.35 });
  const brass = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xc9a24a).convertSRGBToLinear(), metalness: 0.8, roughness: 0.3 });
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.75), wood);
  grip.position.set(0, -0.28, 0.02);
  grip.rotation.x = 0.25;
  group.add(grip);
  const butt = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), brass);
  butt.position.set(0, -0.2, -0.36);
  group.add(butt);
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.2, 0.26), wood);
  stock.position.set(0, -0.85, 0.38);
  group.add(stock);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 1.6, 12), iron);
  barrel.position.set(0, -1.15, 0.5);
  group.add(barrel);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.03, 6, 12), brass);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, -1.9, 0.5);
  group.add(ring);
  const hammer = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.22), iron);
  hammer.position.set(0, -0.32, 0.5);
  hammer.rotation.x = -0.5;
  group.add(hammer);
  const guard = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 6, 12, Math.PI), brass);
  guard.rotation.y = Math.PI / 2;
  guard.position.set(0, -0.48, 0.2);
  group.add(guard);
  group.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, -2.0, 0.5);
  group.add(muzzle);
  const ejection = new THREE.Object3D();
  ejection.position.set(0.15, -0.5, 0.55);
  group.add(ejection);
  group.userData.muzzle = muzzle;
  group.userData.ejection = ejection;
  return group;
}

function buildHandAura(color) {
  const aura = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 14, 10),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  aura.position.y = -0.4;
  return aura;
}

// Creates the hand-held weapons on the player's model once; visibility follows the
// equipped weapon every frame.
function updateHeldWeapons(model) {
  const parts = model.userData.parts;
  if (!parts?.rightHand) return;
  let held = model.userData.held;
  if (!held) {
    held = {
      sword: buildHeldSword(),
      gun: buildHeldPistol(),
      auraR: buildHandAura(0xa775ff),
      auraL: buildHandAura(0xa775ff),
    };
    held.sword.position.set(0.02, -0.33, 0);
    held.gun.position.set(0.02, -0.12, -0.05);
    parts.rightHand.add(held.sword, held.gun, held.auraR);
    parts.leftHand.add(held.auraL);
    model.userData.held = held;
  }
  const weapon = player.weapon;
  if (parts.staff) {
    const fighting = (model.userData.parts && (playerMesh.userData.animation?.stanceW || 0) > 0.05) || (playerMesh.userData.animation?.actions || []).length > 0;
    parts.staff.visible = weapon === "special" || !fighting;
  }
  held.sword.visible = weapon === "sword";
  held.gun.visible = weapon === "gun";
  const magic = weapon === "special";
  held.auraR.visible = magic;
  held.auraL.visible = magic;
  if (magic) {
    const pulse = 0.85 + Math.sin(performance.now() * 0.008) * 0.15;
    held.auraR.scale.setScalar(pulse);
    held.auraL.scale.setScalar(1.8 - pulse);
  }
}

// Hand and muzzle positions as of this frame's pose.
function playerHandWorldPosition(side = "right") {
  if (!handCache.valid) return playerMesh.position.clone().add(new THREE.Vector3(0, 5, 0));
  return (side === "left" ? handCache.left : handCache.right).clone();
}

function playerMuzzleWorldPosition() {
  if (!handCache.valid || !playerMesh?.children[0]?.userData?.held?.gun?.visible) return playerHandWorldPosition("right");
  return handCache.muzzle.clone();
}

// ---- Sword trail: a glowing ribbon traced by the blade ----

const SWORD_TRAIL_SAMPLES = 26;
const SWORD_TRAIL_LIFE = 0.16;
let swordTrail = null;

function getSwordTrail() {
  if (swordTrail) return swordTrail;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(SWORD_TRAIL_SAMPLES * 2 * 3);
  const colors = new Float32Array(SWORD_TRAIL_SAMPLES * 2 * 3);
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const index = [];
  for (let i = 0; i < SWORD_TRAIL_SAMPLES - 1; i += 1) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geo.setIndex(index);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }));
  mesh.frustumCulled = false;
  mesh.renderOrder = 5;
  swordTrail = { mesh, samples: [], color: new THREE.Color(0xbfe8ff) };
  return swordTrail;
}

function updateSwordTrail(model, anim, dt) {
  const trail = getSwordTrail();
  if (!trail.mesh.parent) scene.add(trail.mesh);
  trail.samples.forEach((s) => { s.age += dt; });
  trail.samples = trail.samples.filter((s) => s.age < SWORD_TRAIL_LIFE);
  const sword = model.userData.held?.sword;
  const active = sword?.visible && (anim.actions || []).some((a) => {
    const window = a.def.trail;
    return window && !a.fading && a.progress >= window[0] && a.progress <= window[1];
  });
  if (active) {
    const base = sword.userData.trailBase.getWorldPosition(new THREE.Vector3());
    const tip = sword.userData.trailTip.getWorldPosition(new THREE.Vector3());
    const last = trail.samples[trail.samples.length - 1];
    // Fill fast swings with in-between samples so the ribbon stays smooth.
    if (last) {
      const steps = Math.min(4, Math.floor(last.tip.distanceTo(tip) / 1.2));
      for (let i = 1; i <= steps; i += 1) {
        const f = i / (steps + 1);
        trail.samples.push({ base: last.base.clone().lerp(base, f), tip: last.tip.clone().lerp(tip, f), age: last.age * (1 - f) });
      }
    }
    trail.samples.push({ base, tip, age: 0 });
    while (trail.samples.length > SWORD_TRAIL_SAMPLES) trail.samples.shift();
  }
  const n = trail.samples.length;
  const pos = trail.mesh.geometry.attributes.position;
  const col = trail.mesh.geometry.attributes.color;
  for (let i = 0; i < n; i += 1) {
    const s = trail.samples[i];
    const fade = (1 - s.age / SWORD_TRAIL_LIFE) * (i / Math.max(1, n - 1));
    pos.setXYZ(i * 2, s.base.x, s.base.y, s.base.z);
    pos.setXYZ(i * 2 + 1, s.tip.x, s.tip.y, s.tip.z);
    col.setXYZ(i * 2, trail.color.r * fade * 0.25, trail.color.g * fade * 0.25, trail.color.b * fade * 0.25);
    col.setXYZ(i * 2 + 1, trail.color.r * fade, trail.color.g * fade, trail.color.b * fade);
  }
  pos.needsUpdate = true;
  col.needsUpdate = true;
  trail.mesh.geometry.setDrawRange(0, Math.max(0, n - 1) * 6);
  trail.mesh.visible = n > 1;
}

// ---- Effect building blocks ----

let glowTexture = null;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.75)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  glowTexture = new THREE.CanvasTexture(c);
  return glowTexture;
}

let starTexture = null;
function getStarTexture() {
  if (starTexture) return starTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  ctx.translate(64, 64);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,240,180,0.85)");
  g.addColorStop(1, "rgba(255,160,40,0)");
  ctx.fillStyle = g;
  for (let i = 0; i < 7; i += 1) {
    ctx.rotate((Math.PI * 2) / 7);
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(64 * (0.6 + (i % 2) * 0.4), 0);
    ctx.lineTo(0, 9);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();
  starTexture = new THREE.CanvasTexture(c);
  return starTexture;
}

function glowSprite(color, size, opacity = 1, texture = getGlowTexture()) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  sprite.scale.setScalar(size);
  return sprite;
}

const fxGeometries = {};
function fxGeometry(name, make) {
  if (!fxGeometries[name]) fxGeometries[name] = make();
  return fxGeometries[name];
}

function facingVector() {
  return new THREE.Vector3(Math.sin(playerMesh.rotation.y), 0, Math.cos(playerMesh.rotation.y));
}

// A thin streak that flies outward and fades (sparks, speed lines).
function spawnStreak(origin, direction, color, length, speed, life, width = 0.12) {
  const geo = fxGeometry(`streak`, () => new THREE.BoxGeometry(1, 1, 1));
  const streak = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }));
  streak.position.copy(origin);
  streak.scale.set(width, width, length);
  streak.lookAt(origin.clone().add(direction));
  const dir = direction.clone().normalize();
  addTimedEffect(streak, life, (mesh, p, dt) => {
    mesh.position.addScaledVector(dir, speed * dt * (1 - p * 0.6));
    mesh.scale.z = length * (1 - p * 0.7);
    mesh.material.opacity = 1 - p;
  });
}

// ---- Fist / kick impact ----

function createFistImpact(position, direction, power = 1, color = 0xffd27a) {
  const dir = direction.clone().normalize();
  const flash = glowSprite(color, 4.5 * power, 1, getStarTexture());
  flash.position.copy(position);
  addTimedEffect(flash, 0.14, (mesh, p) => {
    mesh.scale.setScalar(4.5 * power * (1 + p * 0.8));
    mesh.material.opacity = 1 - p;
    mesh.material.rotation = p * 0.6;
  });
  // Shock ring facing along the punch.
  const ring = new THREE.Mesh(
    fxGeometry("fistRing", () => new THREE.TorusGeometry(1, 0.08, 6, 36)),
    new THREE.MeshBasicMaterial({ color: 0xfff3c8, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  ring.position.copy(position);
  ring.lookAt(position.clone().add(dir));
  addTimedEffect(ring, 0.26, (mesh, p, dt) => {
    mesh.scale.setScalar((1.2 + p * 4.5) * power);
    mesh.position.addScaledVector(dir, dt * 18);
    mesh.material.opacity = 0.9 * (1 - p) ** 1.5;
  });
  // Sparks spraying forward in a cone.
  const side = new THREE.Vector3(-dir.z, 0, dir.x);
  for (let i = 0; i < Math.round(7 * power); i += 1) {
    const spread = dir.clone()
      .addScaledVector(side, (Math.random() - 0.5) * 1.4)
      .add(new THREE.Vector3(0, (Math.random() - 0.3) * 1.0, 0));
    spawnStreak(position, spread, i % 2 ? 0xffb347 : 0xfff0b0, 1.4 + Math.random(), 45 + Math.random() * 25, 0.22);
  }
}

// Speed lines streaming back past the arm as it extends.
function createSpeedLines(origin, direction, count = 5) {
  const dir = direction.clone().normalize();
  const side = new THREE.Vector3(-dir.z, 0, dir.x);
  for (let i = 0; i < count; i += 1) {
    const start = origin.clone()
      .addScaledVector(side, (Math.random() - 0.5) * 2.4)
      .add(new THREE.Vector3(0, (Math.random() - 0.5) * 2.2, 0))
      .addScaledVector(dir, -1.5);
    spawnStreak(start, dir, 0xffffff, 3 + Math.random() * 2, 30, 0.16, 0.06);
  }
}

// ---- Sword slash arc ----

function createSlashArc(direction, roll = 0, sweep = 1, big = false, color = 0xcdeeff) {
  const dir = direction.clone().normalize();
  const radius = big ? 9 : 7;
  const arc = new THREE.Mesh(
    fxGeometry(`slashArc`, () => {
      // Crescent: thick in the middle, thin at the ends.
      const shape = new THREE.Shape();
      const n = 24;
      const span = 2.3;
      for (let i = 0; i <= n; i += 1) {
        const a = -span / 2 + (span * i) / n;
        const w = Math.sin((i / n) * Math.PI) * 0.22;
        const x = Math.cos(a) * (1 + w);
        const y = Math.sin(a) * (1 + w);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      for (let i = n; i >= 0; i -= 1) {
        const a = -span / 2 + (span * i) / n;
        shape.lineTo(Math.cos(a) * 0.96, Math.sin(a) * 0.96);
      }
      return new THREE.ShapeGeometry(shape, 1);
    }),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  );
  const origin = playerMesh.position.clone().add(new THREE.Vector3(0, 6.2, 0)).addScaledVector(dir, 2.5);
  arc.position.copy(origin);
  // Lay the crescent in the swing plane: it opens toward the attack direction.
  arc.rotation.order = "YXZ";
  arc.rotation.set(-Math.PI / 2, Math.atan2(dir.x, dir.z) - Math.PI / 2, 0);
  arc.rotateOnAxis(new THREE.Vector3(1, 0, 0), roll);
  if (sweep < 0) arc.scale.y = -1;
  addTimedEffect(arc, 0.24, (mesh, p, dt) => {
    const s = radius * (0.85 + p * 0.5);
    mesh.scale.set(s, (sweep < 0 ? -1 : 1) * s, s);
    mesh.position.addScaledVector(dir, dt * 22);
    mesh.material.opacity = 0.95 * (1 - p) ** 1.2;
  });
}

function createSwordHitSparks(position, direction) {
  const flash = glowSprite(0xe8f6ff, 5, 1, getStarTexture());
  flash.position.copy(position);
  addTimedEffect(flash, 0.12, (mesh, p) => { mesh.material.opacity = 1 - p; mesh.scale.setScalar(5 + p * 4); });
  for (let i = 0; i < 9; i += 1) {
    const d = direction.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 1.2, (Math.random() - 0.5) * 2));
    spawnStreak(position, d, i % 3 ? 0xdff4ff : 0xffe2a0, 1.2, 55, 0.2, 0.08);
  }
}

// ---- Gunfire ----

function createMuzzleFlash(muzzle, direction) {
  const dir = direction.clone().normalize();
  const star = glowSprite(0xffe2a0, 3.2, 1, getStarTexture());
  star.position.copy(muzzle).addScaledVector(dir, 0.6);
  star.material.rotation = Math.random() * Math.PI;
  addTimedEffect(star, 0.07, (mesh, p) => { mesh.material.opacity = 1 - p; mesh.scale.setScalar(3.2 + p * 2); });
  // Flame cone out of the barrel.
  const cone = new THREE.Mesh(
    fxGeometry("muzzleCone", () => { const g = new THREE.ConeGeometry(0.55, 2.4, 10, 1, true); g.translate(0, 1.2, 0); g.rotateX(Math.PI / 2); return g; }),
    new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  );
  cone.position.copy(muzzle);
  cone.lookAt(muzzle.clone().add(dir));
  cone.rotateZ(Math.PI); // ConeGeometry tip faces away after the flip
  addTimedEffect(cone, 0.08, (mesh, p) => { mesh.scale.set(1 - p * 0.4, 1 - p * 0.4, 1 + p); mesh.material.opacity = 0.9 * (1 - p); });
  // Smoke puff drifting up.
  for (let i = 0; i < 3; i += 1) {
    const smoke = new THREE.Sprite(new THREE.SpriteMaterial({ map: getGlowTexture(), color: 0xbdb7ae, transparent: true, opacity: 0.45, depthWrite: false }));
    smoke.position.copy(muzzle).addScaledVector(dir, 0.8 + i * 0.7);
    smoke.scale.setScalar(1.2);
    const drift = dir.clone().multiplyScalar(2 + i).add(new THREE.Vector3(0, 3 + Math.random() * 2, 0));
    addTimedEffect(smoke, 0.9 + i * 0.15, (mesh, p, dt) => {
      mesh.position.addScaledVector(drift, dt);
      mesh.scale.setScalar(1.2 + p * 3.5);
      mesh.material.opacity = 0.45 * (1 - p);
    });
  }
}

function ejectShellCasing() {
  const model = playerMesh?.children[0];
  const gun = model?.userData?.held?.gun;
  if (!gun?.visible) return;
  playerMesh.updateMatrixWorld(true);
  const from = gun.userData.ejection.getWorldPosition(new THREE.Vector3());
  const right = new THREE.Vector3(Math.cos(playerMesh.rotation.y), 0, -Math.sin(playerMesh.rotation.y));
  const shell = new THREE.Mesh(
    fxGeometry("shell", () => new THREE.CylinderGeometry(0.06, 0.06, 0.24, 8)),
    fxGeometry("shellMat", () => new THREE.MeshStandardMaterial({ color: new THREE.Color(0xd8a640).convertSRGBToLinear(), metalness: 0.9, roughness: 0.25 })),
  );
  shell.position.copy(from);
  const velocity = right.multiplyScalar(-(9 + Math.random() * 4)).add(new THREE.Vector3(0, 11 + Math.random() * 3, 0));
  const groundY = playerMesh.position.y - 1.4;
  const spin = new THREE.Vector3(Math.random() * 20, Math.random() * 20, Math.random() * 20);
  addTimedEffect(shell, 1.1, (mesh, p, dt) => {
    velocity.y -= 60 * dt;
    mesh.position.addScaledVector(velocity, dt);
    if (mesh.position.y < groundY) {
      mesh.position.y = groundY;
      velocity.y = Math.abs(velocity.y) * 0.35;
      velocity.x *= 0.5;
      velocity.z *= 0.5;
      spin.multiplyScalar(0.5);
    }
    mesh.rotation.x += spin.x * dt;
    mesh.rotation.y += spin.y * dt;
    mesh.rotation.z += spin.z * dt;
  });
}

// Bullet: a bright slug that races to the target with a fading tracer behind it.
function createBulletTracer(start, end, color = 0x9defff, onArrive) {
  const dirVec = end.clone().sub(start);
  const length = dirVec.length();
  const dir = dirVec.clone().normalize();
  const travel = THREE.MathUtils.clamp(length / 900, 0.03, 0.12);
  const slug = glowSprite(0xffffff, 1.4);
  slug.position.copy(start);
  const tracer = new THREE.Mesh(
    fxGeometry("tracer", () => { const g = new THREE.CylinderGeometry(0.07, 0.07, 1, 6, 1, true); g.rotateX(Math.PI / 2); g.translate(0, 0, -0.5); return g; }),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  tracer.position.copy(start);
  tracer.lookAt(end);
  let arrived = false;
  addTimedEffect(slug, travel, (mesh, p) => {
    mesh.position.copy(start).addScaledVector(dir, length * p);
    tracer.position.copy(mesh.position);
    tracer.scale.set(1, 1, Math.min(length * p, 14));
    if (p >= 1 && !arrived) {
      arrived = true;
      onArrive?.(end, dir);
    }
  });
  addTimedEffect(tracer, travel + 0.12, (mesh, p) => {
    const late = Math.max(0, (p * (travel + 0.12) - travel) / 0.12);
    mesh.material.opacity = 0.9 * (1 - late);
  });
}

function createBulletImpact(position, direction, headshot = false) {
  const flash = glowSprite(headshot ? 0xff6a4a : 0xfff0c0, headshot ? 5 : 3.2, 1, getStarTexture());
  flash.position.copy(position);
  addTimedEffect(flash, 0.1, (mesh, p) => { mesh.material.opacity = 1 - p; });
  for (let i = 0; i < 6; i += 1) {
    const d = direction.clone().negate().add(new THREE.Vector3((Math.random() - 0.5) * 1.6, Math.random(), (Math.random() - 0.5) * 1.6));
    spawnStreak(position, d, 0xffd27a, 0.8, 40, 0.18, 0.06);
  }
}

// ---- Magic ----

// Motes of light spiral into the hands while a spell charges.
function spawnChargeMotes(color, count = 2) {
  const hands = [playerHandWorldPosition("right"), playerHandWorldPosition("left")];
  for (let i = 0; i < count; i += 1) {
    const hand = hands[i % 2];
    const offset = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.2), (Math.random() - 0.5)).normalize().multiplyScalar(4 + Math.random() * 3);
    const mote = glowSprite(color, 0.9);
    mote.position.copy(hand).add(offset);
    addTimedEffect(mote, 0.3, (mesh, p) => {
      const target = playerHandWorldPosition(i % 2 ? "left" : "right");
      mesh.position.copy(target).addScaledVector(offset, (1 - p) ** 2);
      mesh.material.opacity = Math.min(1, p * 3);
      mesh.scale.setScalar(0.9 * (1 - p * 0.5));
    });
  }
}

function createHandRelease(color, power = 1) {
  ["right", "left"].forEach((side) => {
    const at = playerHandWorldPosition(side);
    const burst = glowSprite(color, 3 * power, 1, getStarTexture());
    burst.position.copy(at);
    addTimedEffect(burst, 0.25, (mesh, p) => { mesh.scale.setScalar(3 * power * (1 + p * 2)); mesh.material.opacity = 1 - p; });
  });
}

// ---- Wiring: basic attacks ----

// Starts the basic-attack animation and returns how long until it lands.
function startBasicAttackAnimation(target, onHit, aimPoint = null) {
  const direction = aimPoint
    ? aimPoint.clone().sub(playerMesh.position).setY(0).normalize()
    : getAttackDirection(target);
  faceAttackDirection(direction, 0.45);
  const name = nextBasicAttackAction();
  const def = PLAYER_ACTIONS[name];
  const handlers = {};
  if (player.weapon === "melee") {
    handlers.impact = () => {
      const hand = def.foot ? "foot" : def.hand || "right";
      const at = hand === "foot"
        ? playerMesh.position.clone().add(new THREE.Vector3(0, 5, 0)).addScaledVector(direction, 6)
        : playerHandWorldPosition(hand);
      const fire = player.diableJambeTimer > 0;
      createFistImpact(at, direction, target ? 1 : 0.6, fire ? 0xff6a2a : 0xffd27a);
      if (fire) createFireBurst(at);
      createSpeedLines(at, direction, 3);
      if (target) cameraShake = Math.max(cameraShake, 0.35);
      onHit?.();
    };
  } else if (player.weapon === "sword") {
    handlers.impact = () => {
      const slash = def.slash || {};
      createSlashArc(direction, slash.roll || 0, slash.sweep || 1, slash.big);
      if (target) {
        const hit = target.mesh.position.clone().add(new THREE.Vector3(0, 6, 0));
        createSwordHitSparks(hit, direction);
        cameraShake = Math.max(cameraShake, slash.big ? 0.6 : 0.3);
      }
      onHit?.();
    };
  } else if (player.weapon === "gun") {
    handlers.fire = () => onHit?.();
  } else {
    handlers.release = () => {
      createHandRelease(0xa775ff);
      onHit?.();
    };
  }
  const action = playPlayerAction(name, handlers);
  return action ? actionEventDelay(name) : 0;
}

// The special weapon's basic attack: a bolt of spirit energy fired at the cursor
// (or, from the touch Attack button, at the nearest enemy in view). It lands
// through resolveAttackHit, so special mastery bonuses apply as they level up.
function castSpiritBolt(event) {
  if (!playerMesh?.userData?.animation || player.health <= 0) return;
  attackCooldown = 0.9;
  skillCooldowns["spirit-bolt"] = Math.max(skillCooldowns["spirit-bolt"] || 0, 0.9);
  audio.playSpecial();
  const range = 95 * getAvatarTraits().rangeMultiplier;
  const aim = event?.autoAim
    ? getAutoGunAim(range)
    : getGunAim(event?.clientX ?? mouseScreenPos.x, event?.clientY ?? mouseScreenPos.y, range);
  const facing = aim.point.clone().sub(playerMesh.position).setY(0);
  if (facing.lengthSq() > 1) {
    playerMesh.rotation.y = Math.atan2(facing.x, facing.z);
    faceAttackDirection(facing.normalize(), 0.55);
  }
  const damage = getDamage();
  playPlayerAction("spirit-bolt", {
    release: () => {
      if (player.weapon !== "special" || !gameStarted) return;
      const target = aim.target && aim.target.alive ? aim.target : null;
      const from = playerHandWorldPosition("right");
      const end = target ? target.mesh.position.clone().add(new THREE.Vector3(0, 6.1, 0)) : aim.point.clone();
      createHandRelease(0xc9a8ff, 0.6);
      fireSpiritBolt(from, end, () => {
        const dir = end.clone().sub(from);
        if (target) createFistImpact(end, dir, 0.9, 0xc9a8ff);
        else createGroundImpact(end, dir.normalize());
        resolveAttackHit(target && target.alive ? target : null, {
          damage, isFalcon: false, isDiableJambeActive: false, isGunHeadshot: false, weapon: "special", aimPoint: aim.point,
        });
      });
    },
  });
}

// A glowing orb with a short sparkling tail that flies from -> to.
function fireSpiritBolt(from, to, onArrive) {
  const length = from.distanceTo(to);
  const travel = THREE.MathUtils.clamp(length / 230, 0.06, 0.45);
  const orb = glowSprite(0xd9c2ff, 2.6);
  const core = glowSprite(0xffffff, 1.1);
  orb.position.copy(from);
  core.position.copy(from);
  let arrived = false;
  let lastMote = 0;
  addTimedEffect(orb, travel, (mesh, p) => {
    mesh.position.lerpVectors(from, to, p);
    core.position.copy(mesh.position);
    mesh.material.rotation += 0.3;
    if (p - lastMote > 0.12) {
      lastMote = p;
      const mote = glowSprite(0xa775ff, 1.2);
      mote.position.copy(mesh.position);
      addTimedEffect(mote, 0.3, (m, q) => { m.material.opacity = 1 - q; m.scale.setScalar(1.2 * (1 - q * 0.6)); });
    }
    if (p >= 1 && !arrived) {
      arrived = true;
      onArrive?.();
    }
  });
  addTimedEffect(core, travel, () => {});
}

// Fires a pistol shot from the muzzle: flash, smoke, casing, and a tracer to the target.
function fireGunEffects(target, isHeadshot = false, color = 0x9defff, aimPoint = null) {
  const muzzle = playerMuzzleWorldPosition();
  let end;
  if (aimPoint && (!target || aimPoint.distanceTo(target.mesh.position) < 14)) {
    end = aimPoint.clone(); // exactly where the player clicked
  } else if (target) {
    end = target.mesh.position.clone();
    end.y += isHeadshot ? 9.15 : 6.1;
  } else {
    end = muzzle.clone().addScaledVector(getAttackDirection(null), 90);
  }
  createMuzzleFlash(muzzle, end.clone().sub(muzzle));
  ejectShellCasing();
  createBulletTracer(muzzle, end, color, (at, dir) => {
    if (target) createBulletImpact(at, dir, isHeadshot);
    else if (aimPoint) createGroundImpact(at, dir);
  });
}

// Bullet hitting the ground or a wall: a puff of dust and a few chips.
function createGroundImpact(position, direction) {
  const puff = new THREE.Sprite(new THREE.SpriteMaterial({ map: getGlowTexture(), color: 0xcbb994, transparent: true, opacity: 0.6, depthWrite: false }));
  puff.position.copy(position).add(new THREE.Vector3(0, 0.4, 0));
  puff.scale.setScalar(1.5);
  addTimedEffect(puff, 0.6, (mesh, p, dt) => {
    mesh.position.y += dt * 2.5;
    mesh.scale.setScalar(1.5 + p * 3.5);
    mesh.material.opacity = 0.6 * (1 - p);
  });
  const spark = glowSprite(0xffe2a0, 2.2, 1, getStarTexture());
  spark.position.copy(position).add(new THREE.Vector3(0, 0.3, 0));
  addTimedEffect(spark, 0.08, (mesh, p) => { mesh.material.opacity = 1 - p; });
  for (let i = 0; i < 5; i += 1) {
    const d = new THREE.Vector3((Math.random() - 0.5) * 1.2, 1 + Math.random(), (Math.random() - 0.5) * 1.2).sub(direction.clone().multiplyScalar(0.5));
    spawnStreak(position, d, 0xd8c8a0, 0.6, 25, 0.25, 0.08);
  }
}

// Charge-up motes for actions that gather power before releasing it.
function updateActionCharge(anim) {
  (anim.actions || []).forEach((action) => {
    const window = action.def.charge;
    if (!window || action.fading || action.progress === undefined) return;
    if (action.progress >= window[0] && action.progress <= window[1]) {
      spawnChargeMotes(action.def.chargeColor || (player.weapon === "special" ? 0xc9a8ff : 0xffd27a), 1);
    }
  });
}

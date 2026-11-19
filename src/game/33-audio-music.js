// ── 33-audio-music.js ─ Generated background music, ocean ambience, footsteps and per-weapon hit sounds.
//
// Everything is synthesised with Web Audio (no sound files). Music is a small
// generative arrangement — pad chords, bass and a repeating melody — whose key,
// tempo and instrument change with the island the player is on, and which slows
// and softens at night.

const MUSIC_STORAGE_KEY = "sea-legends-music";
const midiHz = (note) => 440 * 2 ** ((note - 69) / 12);

// scale: semitone offsets; chords: scale degrees for each bar's root.
const MUSIC_THEMES = {
  village: { root: 60, scale: [0, 2, 4, 7, 9], chords: [0, 3, 4, 3], tempo: 96, lead: "triangle", density: 0.6 },
  jungle: { root: 57, scale: [0, 3, 5, 7, 10], chords: [0, 0, 3, 4], tempo: 108, lead: "square", density: 0.7, drum: true },
  pirate: { root: 62, scale: [0, 2, 3, 7, 8], chords: [0, 4, 3, 4], tempo: 116, lead: "sawtooth", density: 0.65, drum: true },
  desert: { root: 62, scale: [0, 1, 4, 5, 7, 8], chords: [0, 1, 0, 4], tempo: 84, lead: "triangle", density: 0.5 },
  snowy: { root: 65, scale: [0, 2, 4, 7, 9, 11], chords: [0, 4, 2, 3], tempo: 72, lead: "sine", density: 0.45, bell: true },
  sea: { root: 55, scale: [0, 2, 4, 7, 9], chords: [0, 2, 3, 4], tempo: 76, lead: "sine", density: 0.35 },
};
const MUSIC_ISLAND_THEMES = ["village", "jungle", "pirate", "desert", "snowy"];

const musicState = {
  on: true, theme: null, wanted: "village", step: 0, nextTime: 0, motif: [], motifPlays: 0, fade: 0,
};
try { musicState.on = localStorage.getItem(MUSIC_STORAGE_KEY) !== "off"; } catch (err) { /* storage unavailable */ }

Object.assign(audio, {
  musicGain: null,
  ambienceGain: null,
  lastHitSound: 0,

  // A short enveloped oscillator note routed to `out`.
  tone(freq, start, length, type, peak, out, attack = 0.01) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
    osc.connect(gain);
    gain.connect(out);
    osc.start(start);
    osc.stop(start + length + 0.05);
  },

  noiseBurst(start, length, peak, filterType, freq, out) {
    const ctx = this.ctx;
    if (!this.noiseBuffer) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buffer;
    }
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(freq, start);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(peak, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    source.start(start, Math.random() * 0.8, length + 0.02);
  },

  // Each weapon lands with its own sound: thud, ring, crack or shimmer.
  playWeaponHit(weapon) {
    if (!this.enabled) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    if (now - this.lastHitSound < 0.05) return;
    this.lastHitSound = now;
    const out = ctx.destination;
    if (weapon === "sword") {
      this.tone(1760 + Math.random() * 200, now, 0.22, "triangle", 0.12, out, 0.002);
      this.tone(2640 + Math.random() * 300, now, 0.16, "square", 0.04, out, 0.002);
      this.noiseBurst(now, 0.06, 0.12, "highpass", 3000, out);
    } else if (weapon === "gun") {
      this.noiseBurst(now, 0.09, 0.25, "bandpass", 900, out);
      this.tone(160, now, 0.1, "sine", 0.18, out, 0.002);
    } else if (weapon === "special") {
      this.tone(880, now, 0.3, "sine", 0.12, out);
      this.tone(1320, now + 0.04, 0.3, "sine", 0.08, out);
    } else {
      // Fists and kicks: a low thump with a slap on top.
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.13);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      osc.connect(gain);
      gain.connect(out);
      osc.start(now);
      osc.stop(now + 0.2);
      this.noiseBurst(now, 0.05, 0.18, "bandpass", 1400, out);
    }
  },

  playFootstep(speed = 30) {
    if (!this.enabled) return;
    const now = this.ctx.currentTime;
    const level = THREE.MathUtils.clamp(0.035 + speed / 2000, 0.035, 0.09);
    this.noiseBurst(now, 0.07, level, "lowpass", 420 + Math.random() * 260, this.ctx.destination);
  },

  ensureBuses() {
    if (this.musicGain || !this.enabled) return;
    const ctx = this.ctx;
    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0;
    this.musicGain.connect(ctx.destination);
    // Ocean: looping low noise whose level follows how close the shore is.
    this.ambienceGain = ctx.createGain();
    this.ambienceGain.gain.value = 0;
    const seconds = 4;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      last = (last + (Math.random() * 2 - 1) * 0.04) / 1.02; // brown-ish noise
      data[i] = last * 6;
    }
    // Blend the ends so the loop has no click.
    const blend = Math.floor(ctx.sampleRate * 0.25);
    for (let i = 0; i < blend; i += 1) {
      const f = i / blend;
      data[data.length - blend + i] = data[data.length - blend + i] * (1 - f) + data[i] * f;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    source.connect(filter);
    filter.connect(this.ambienceGain);
    this.ambienceGain.connect(ctx.destination);
    source.start();
  },
});

function setMusicEnabled(on) {
  musicState.on = !!on;
  try { localStorage.setItem(MUSIC_STORAGE_KEY, on ? "on" : "off"); } catch (err) { /* storage unavailable */ }
}

function newMusicMotif(theme) {
  // A two-bar melody (16 eighth-notes) as scale steps; null is a rest.
  const motif = [];
  let step = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < 16; i += 1) {
    const strong = i % 4 === 0;
    if (Math.random() > (strong ? Math.min(1, theme.density + 0.3) : theme.density)) {
      motif.push(null);
      continue;
    }
    step += Math.floor(Math.random() * 5) - 2;
    step = THREE.MathUtils.clamp(step, 0, theme.scale.length * 2 - 1);
    motif.push(step);
  }
  motif[0] = motif[0] ?? 2;
  return motif;
}

function scaleNote(theme, step, octave = 0) {
  const n = theme.scale.length;
  return theme.root + theme.scale[((step % n) + n) % n] + 12 * (Math.floor(step / n) + octave);
}

// Schedules notes a little ahead of the audio clock. Called every frame.
function updateMusic(dt) {
  if (!audio.enabled || !audio.ctx) return;
  audio.ensureBuses();
  const ctx = audio.ctx;
  const now = ctx.currentTime;
  const island = typeof getIslandUnderPlayer === "function" && playerMesh ? getIslandUnderPlayer() : null;
  const night = typeof dayCycle !== "undefined" && DAY_CYCLE.phases[dayCycle.phase].name === "night";

  // Ocean ambience: loud at sea and on the beach, quiet inland.
  let shore = 1;
  if (island) {
    const d = Math.hypot(playerMesh.position.x - island.position.x, playerMesh.position.z - island.position.z) / island.radius;
    shore = THREE.MathUtils.clamp((d - 0.35) / 0.55, 0, 1) ** 2;
  }
  const swell = 0.75 + Math.sin(now * 0.45) * 0.25;
  audio.ambienceGain.gain.setTargetAtTime(gameStarted ? (0.05 + shore * 0.3) * swell : 0, now, 0.4);

  musicState.wanted = island ? MUSIC_ISLAND_THEMES[island.index] || "sea" : "sea";
  const playing = musicState.on && gameStarted && player.health > 0;
  // Cross-fade: fade out, swap theme, fade back in.
  const changing = musicState.theme !== musicState.wanted;
  const targetFade = playing && !changing ? 1 : 0;
  musicState.fade += THREE.MathUtils.clamp(targetFade - musicState.fade, -dt / 1.2, dt / 1.5);
  audio.musicGain.gain.setTargetAtTime(musicState.fade * (night ? 0.55 : 0.8), now, 0.1);
  if (changing && musicState.fade <= 0.02) {
    musicState.theme = musicState.wanted;
    musicState.step = 0;
    musicState.motif = [];
    musicState.nextTime = now + 0.1;
  }
  if (!playing || !musicState.theme) return;

  const theme = MUSIC_THEMES[musicState.theme];
  const eighth = 60 / (theme.tempo * (night ? 0.85 : 1)) / 2;
  if (musicState.nextTime < now) musicState.nextTime = now + 0.05;
  const out = audio.musicGain;
  while (musicState.nextTime < now + 0.3) {
    const t = musicState.nextTime;
    const step = musicState.step;
    const inBar = step % 8;
    const bar = Math.floor(step / 8) % theme.chords.length;
    const chordRoot = theme.chords[bar];
    if (step % 16 === 0) {
      // Repeat each melody a few times so it sounds intentional, then vary it.
      if (!musicState.motif.length || musicState.motifPlays >= 3) {
        musicState.motif = newMusicMotif(theme);
        musicState.motifPlays = 0;
      }
      musicState.motifPlays += 1;
    }
    if (inBar === 0) {
      // Pad chord for the bar.
      [0, 2, 4].forEach((third) => {
        audio.tone(midiHz(scaleNote(theme, chordRoot + third, -1)), t, eighth * 8.2, "sine", 0.05, out, eighth * 1.5);
      });
    }
    if (inBar === 0 || inBar === 4) {
      audio.tone(midiHz(scaleNote(theme, chordRoot, -2)), t, eighth * 3, "triangle", 0.13, out, 0.02);
    }
    const note = musicState.motif[step % 16];
    if (note !== null && note !== undefined) {
      const freq = midiHz(scaleNote(theme, note + chordRoot, 0));
      const peak = theme.lead === "sine" || theme.lead === "triangle" ? 0.1 : 0.045;
      audio.tone(freq, t, eighth * (theme.bell ? 3.5 : 1.6), theme.lead, peak, out, 0.012);
      if (theme.bell) audio.tone(freq * 2, t, eighth * 2.5, "sine", 0.03, out, 0.005);
    }
    if (theme.drum && !night) {
      if (inBar % 2 === 0) audio.noiseBurst(t, 0.05, inBar === 0 ? 0.08 : 0.04, "highpass", 5000, out);
      if (inBar === 0 || inBar === 3 || inBar === 6) audio.tone(90, t, 0.14, "sine", 0.16, out, 0.004);
    }
    musicState.step += 1;
    musicState.nextTime += eighth;
  }
}

// "Music" switch in the menu.
const musicToggle = document.querySelector("#music-toggle");
if (musicToggle) {
  musicToggle.checked = musicState.on;
  musicToggle.addEventListener("change", () => setMusicEnabled(musicToggle.checked));
}


// ── 03-world-palette.js ─ World colour palette: sky, sea, terrain and village colours in one place.
//
// Colours here are written as they should appear on screen (normal sRGB hex).
// Three.js r128 treats material colours as linear and brightens them on output,
// so anything used on a lit material goes through worldHex()/worldColor(),
// which converts sRGB to linear. Sky dome, background and fog colours are drawn
// without that conversion, so they are used as-is.
const WORLD_PALETTE = {
  // r128 multiplies every light by PI, so these are tuned lower than they look.
  // Raise them for a brighter, softer world; lower them for richer, deeper colour.
  lighting: {
    sunScale: 0.62,       // multiplies the day/night sun intensity
    hemisphere: 0.62,     // sky/ground fill light
    ambient: 0.12,
    exposure: 1.0,
  },
  sky: {
    // [top, horizon, sun glow] per time of day — used raw by the sky shader and fog
    dawn: { top: 0x2b4479, horizon: 0xf3a77e, glow: 0xffb871 },
    day: { top: 0x3b86cf, horizon: 0xbfe2f1, glow: 0xfff1d2 },
    dusk: { top: 0x26325f, horizon: 0xee7e58, glow: 0xff6c40 },
    night: { top: 0x060f22, horizon: 0x0d1e35, glow: 0x3a5a78 },
  },
  sea: {
    base: 0x2c8fae,       // lit water surface
    deep: 0x2a7f9e,       // deep/shallow/foam tint the lit surface in the ocean shader
    shallow: 0x55c4cf,
    foam: 0xe9fbff,
    lagoon: 0x47c6cf,     // shallow ring around islands
  },
  terrain: {
    // index 0 Starter, 1 Jungle, 4 Snowy Village, others use "default"
    grass: { 0: 0x63a552, 1: 0x2f7438, 4: 0xf4f7fb, default: 0x74ad5a },
    cliff: { 0: 0xb0916a, 1: 0x5a5644, 4: 0xb9c3cf, default: 0xab9472 },
    meadowGlow: 0xc9e79a,  // soft lighter wash in each island centre
    sand: 0xecd39a,
    path: 0xd8bd8c,
    plaza: 0xc29a66,
    stone: 0x8a857c,
    rock: 0x7a746c,
    rockDark: 0x6b625a,
  },
  foliage: {
    palmLeaf: 0x3f9f4d,
    palmTrunk: 0x92633e,
    coconut: 0x5d3b22,
    tuft: 0x4c9a44,
    bark: 0x6b4a32,
    canopy: [0x3f8a3c, 0x55a24a, 0x6db557],  // dark, mid, light leaf clusters
    jungleBark: 0x5b4330,
    jungleCanopy: [0x24602c, 0x2f7535, 0x3d8a3a, 0x4f9a3f],  // deep rainforest greens
  },
  village: {
    roofs: [0xa9473a, 0x8f5a3c, 0x4d6a80, 0xb0603e, 0x5e7a4c],
    walls: [0xefe3c8, 0xe8d3b0, 0xf2e8d8, 0xe3cfa8, 0xeadcc2],   // limewashed plaster
    trims: [0x2f5f6e, 0x6b3a32, 0x35603f, 0x7a5426, 0x48506a],
    timber: 0x5a3b26,
    foundation: 0x8a847a,
    ridge: 0x6d3a2e,
    wellRoof: 0xa8463a,
  },
};

const worldColorCache = new Map();
// sRGB hex -> linear THREE.Color (for lit materials).
function worldColor(hex) {
  return new THREE.Color(hex).convertSRGBToLinear();
}
// sRGB hex -> linear hex number, cached (for material `color:` options).
function worldHex(hex) {
  if (!worldColorCache.has(hex)) worldColorCache.set(hex, worldColor(hex).getHex());
  return worldColorCache.get(hex);
}
function islandTerrainColor(table, index) {
  return worldHex(table[index] ?? table.default);
}

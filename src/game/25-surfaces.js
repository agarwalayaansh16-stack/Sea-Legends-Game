
// ── 25-surfaces.js ─ Procedural surface textures applied to world meshes.
// ===== Realistic Surfaces: procedural textures for world blocks and terrain =====
// Generates tileable detail textures (wood planks, stone bricks, rock, cliff strata,
// grass, sand, snow, dirt, bark, foliage, metal) at load time and applies them to
// world meshes. Textures are near-white detail maps, so each object's original
// color is kept and the texture only adds grain, seams and relief.
const SURFACE_TEX_SIZE = 512;
let surfaceLibrary = null;
const surfaceMaterialCache = new Map();
const surfaceGeometryCache = new Map();

function surfaceRandom(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

// Tileable value noise with independent cell counts on each axis (stretched noise = grain).
function surfaceNoise(size, cellsX, cellsY, seed) {
  const rand = surfaceRandom(seed);
  const grid = new Float32Array(cellsX * cellsY);
  for (let i = 0; i < grid.length; i += 1) grid[i] = rand();
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y += 1) {
    const fy = (y / size) * cellsY;
    const y0 = Math.floor(fy);
    let ty = fy - y0;
    ty = ty * ty * (3 - 2 * ty);
    const y1 = (y0 + 1) % cellsY;
    for (let x = 0; x < size; x += 1) {
      const fx = (x / size) * cellsX;
      const x0 = Math.floor(fx);
      let tx = fx - x0;
      tx = tx * tx * (3 - 2 * tx);
      const x1 = (x0 + 1) % cellsX;
      const a = grid[y0 * cellsX + x0];
      const b = grid[y0 * cellsX + x1];
      const c = grid[y1 * cellsX + x0];
      const d = grid[y1 * cellsX + x1];
      out[y * size + x] = (a + (b - a) * tx) + ((c + (d - c) * tx) - (a + (b - a) * tx)) * ty;
    }
  }
  return out;
}

function surfaceFbm(size, baseCells, octaves, seed, stretchX = 1, stretchY = 1) {
  const out = new Float32Array(size * size);
  let amp = 1;
  let total = 0;
  for (let o = 0; o < octaves; o += 1) {
    const cells = baseCells * (1 << o);
    const n = surfaceNoise(size, Math.max(1, Math.round(cells * stretchX)), Math.max(1, Math.round(cells * stretchY)), seed + o * 101);
    for (let i = 0; i < out.length; i += 1) out[i] += n[i] * amp;
    total += amp;
    amp *= 0.5;
  }
  for (let i = 0; i < out.length; i += 1) out[i] /= total;
  return out;
}

function surfaceCanvasFromValues(size, values) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < values.length; i += 1) {
    const v = Math.max(0, Math.min(255, Math.round(values[i] * 255)));
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function surfaceTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4;
  return tex;
}

const surfacePainters = {
  wood(size) {
    const rand = surfaceRandom(11);
    const rows = 6;
    const ph = size / rows;
    const grainA = surfaceNoise(size, 3, 96, 21);
    const grainB = surfaceNoise(size, 8, 192, 22);
    const blotch = surfaceFbm(size, 4, 3, 23);
    const tones = [];
    const joints = [];
    for (let r = 0; r < rows; r += 1) {
      tones.push(0.8 + rand() * 0.2);
      joints.push(Math.floor(rand() * size));
    }
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let y = 0; y < size; y += 1) {
      const row = Math.floor(y / ph);
      const inRow = y - row * ph;
      const seamDist = Math.min(inRow, ph - inRow);
      for (let x = 0; x < size; x += 1) {
        const i = y * size + x;
        const g = grainA[i] * 0.6 + grainB[i] * 0.4;
        let v = tones[row] * (0.74 + 0.26 * g) * (0.9 + 0.1 * blotch[i]);
        let h = 0.75 + 0.25 * g;
        const j = joints[row];
        const jd = Math.min(Math.abs(x - j), Math.abs(x - ((j + size / 2) % size)), size - Math.abs(x - j));
        if (seamDist < 2.2 || jd < 1.6) { v *= 0.45; h = 0.05; }
        else if (seamDist < 5) { v *= 0.86; h *= 0.7; }
        // nail heads near the joints
        if (Math.abs(jd - 7) < 2 && Math.abs(inRow - ph * 0.5) < 2) { v *= 0.5; }
        col[i] = Math.min(1, v * 1.08);
        hgt[i] = h;
      }
    }
    return { color: col, height: hgt };
  },

  stone(size) {
    const rand = surfaceRandom(31);
    const rows = 4;
    const perRow = 3;
    const bh = size / rows;
    const bw = size / perRow;
    const mortar = 5;
    const detail = surfaceFbm(size, 8, 4, 32);
    const pits = surfaceNoise(size, 64, 64, 33);
    const tones = Array.from({ length: rows * perRow * 2 }, () => 0.78 + rand() * 0.22);
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let y = 0; y < size; y += 1) {
      const row = Math.floor(y / bh);
      const iy = y - row * bh;
      const offset = row % 2 ? bw / 2 : 0;
      for (let x = 0; x < size; x += 1) {
        const i = y * size + x;
        const sx = (x + offset) % size;
        const b = Math.floor(sx / bw);
        const ix = sx - b * bw;
        const edge = Math.min(ix, bw - ix, iy, bh - iy);
        const tone = tones[(row * perRow + b) % tones.length];
        if (edge < mortar) {
          col[i] = 0.5 + detail[i] * 0.12;
          hgt[i] = 0.05;
        } else {
          const bevel = Math.min(1, (edge - mortar) / 10);
          const pit = pits[i] < 0.12 ? 0.82 : 1;
          col[i] = Math.min(1, tone * (0.8 + detail[i] * 0.28) * (0.88 + 0.12 * bevel) * pit);
          hgt[i] = (0.45 + 0.55 * bevel) * (0.8 + 0.2 * detail[i]);
        }
      }
    }
    return { color: col, height: hgt };
  },

  rock(size) {
    const base = surfaceFbm(size, 4, 6, 41);
    const ridge = surfaceFbm(size, 6, 3, 42);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const r = 1 - Math.abs(ridge[i] * 2 - 1);
      const crack = r > 0.975 ? 0.78 : 1;
      col[i] = (0.58 + 0.5 * base[i]) * crack;
    }
    return { color: col, height: base };
  },

  cliff(size) {
    const strata = surfaceNoise(size, 2, 18, 51);
    const strataFine = surfaceNoise(size, 4, 64, 52);
    const base = surfaceFbm(size, 4, 5, 53);
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const band = strata[i] * 0.6 + strataFine[i] * 0.4;
      col[i] = 0.6 + 0.24 * band + 0.2 * base[i];
      hgt[i] = band * 0.5 + base[i] * 0.5;
    }
    return { color: col, height: hgt };
  },

  grass(size) {
    const clumps = surfaceFbm(size, 3, 3, 61);
    const patches = surfaceFbm(size, 10, 2, 64);
    const fine = surfaceFbm(size, 48, 3, 62);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const c = clumps[i] * 2 - 1;
      col[i] = 0.8 + 0.12 * c + 0.14 * (patches[i] - 0.5) + 0.14 * (fine[i] - 0.5);
    }
    const canvas = surfaceCanvasFromValues(size, col);
    const ctx = canvas.getContext("2d");
    const rand = surfaceRandom(63);
    // short blade strokes, drawn three times offset so the tile stays seamless
    for (let n = 0; n < 5200; n += 1) {
      const x = rand() * size;
      const y = rand() * size;
      const len = 3 + rand() * 6;
      const lean = (rand() - 0.5) * 3;
      const light = rand() > 0.5;
      ctx.strokeStyle = light ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)";
      ctx.lineWidth = 1;
      for (const [ox, oy] of [[0, 0], [-size, 0], [0, -size], [size, 0], [0, size]]) {
        ctx.beginPath();
        ctx.moveTo(x + ox, y + oy);
        ctx.lineTo(x + ox + lean, y + oy - len);
        ctx.stroke();
      }
    }
    return { canvas, height: fine };
  },

  sand(size) {
    const rand = surfaceRandom(71);
    const warp = surfaceFbm(size, 3, 3, 72);
    const soft = surfaceFbm(size, 16, 3, 73);
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const i = y * size + x;
        const ripple = Math.sin(((y / size) * 10 + warp[i] * 2.2) * Math.PI * 2);
        const grain = rand();
        col[i] = 0.84 + ripple * 0.02 + (soft[i] - 0.5) * 0.12 + (grain - 0.5) * 0.14;
        hgt[i] = 0.5 + ripple * 0.15 + (grain - 0.5) * 0.3;
      }
    }
    return { color: col, height: hgt };
  },

  snow(size) {
    const rand = surfaceRandom(81);
    const soft = surfaceFbm(size, 4, 4, 82);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const sparkle = rand() > 0.997 ? 0.08 : 0;
      col[i] = Math.min(1, 0.9 + soft[i] * 0.08 + sparkle);
    }
    return { color: col, height: soft };
  },

  dirt(size) {
    const rand = surfaceRandom(91);
    const base = surfaceFbm(size, 6, 5, 92);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) col[i] = 0.7 + base[i] * 0.3;
    const canvas = surfaceCanvasFromValues(size, col);
    const ctx = canvas.getContext("2d");
    for (let n = 0; n < 420; n += 1) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 1.5 + rand() * 4;
      const shade = rand() > 0.5 ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)";
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.6 + rand() * 0.4), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    return { canvas, height: base };
  },

  bark(size) {
    const streaks = surfaceNoise(size, 40, 3, 101);
    const streaksFine = surfaceNoise(size, 96, 6, 102);
    const base = surfaceFbm(size, 4, 3, 103);
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const s = streaks[i] * 0.65 + streaksFine[i] * 0.35;
      const groove = s < 0.32 ? 0.55 : 1;
      col[i] = (0.68 + 0.32 * s) * groove * (0.9 + 0.1 * base[i]);
      hgt[i] = s * groove;
    }
    return { color: col, height: hgt };
  },

  foliage(size) {
    const leaves = surfaceFbm(size, 12, 3, 111);
    const big = surfaceFbm(size, 3, 2, 112);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) {
      const l = leaves[i];
      const edge = l > 0.55 ? 1 : l > 0.45 ? 0.82 : 0.66;
      col[i] = edge * (0.82 + 0.18 * big[i]) + 0.1;
    }
    return { color: col, height: leaves };
  },

  metal(size) {
    const rand = surfaceRandom(121);
    const brushed = surfaceNoise(size, 2, 256, 122);
    const stains = surfaceFbm(size, 3, 3, 123);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) col[i] = 0.82 + brushed[i] * 0.1 + stains[i] * 0.08;
    const canvas = surfaceCanvasFromValues(size, col);
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    for (let n = 0; n < 60; n += 1) {
      const x = rand() * size;
      const y = rand() * size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rand() - 0.5) * 60, y + (rand() - 0.5) * 12);
      ctx.stroke();
    }
    return { canvas, height: brushed };
  },

  // Overlapping curved clay tiles in staggered rows.
  tiles(size) {
    const rows = 8;
    const perRow = 6;
    const ph = size / rows;
    const tw = size / perRow;
    const rand = surfaceRandom(141);
    const grain = surfaceFbm(size, 5, 4, 142);
    const tones = [];
    for (let i = 0; i < rows * perRow; i += 1) tones.push(0.82 + rand() * 0.18);
    const col = new Float32Array(size * size);
    const hgt = new Float32Array(size * size);
    for (let y = 0; y < size; y += 1) {
      const row = Math.floor(y / ph);
      const inRow = (y - row * ph) / ph; // 0 top of tile, 1 lower edge
      const offset = (row % 2) * tw * 0.5;
      for (let x = 0; x < size; x += 1) {
        const i = y * size + x;
        const tx = (x + offset) % size;
        const tile = Math.floor(tx / tw);
        const across = (tx - tile * tw) / tw; // 0..1 across the tile
        const curve = Math.sin(across * Math.PI);  // rounded profile
        const scallop = 0.82 + 0.18 * curve;        // lower edge is curved
        const edge = inRow > scallop ? 0.55 : 1;
        let v = tones[row * perRow + tile] * (0.72 + 0.28 * curve) * (0.9 + 0.1 * grain[i]) * edge;
        v *= 0.82 + 0.18 * (1 - inRow);             // shade under the tile above
        col[i] = Math.min(1, v * 1.08);
        hgt[i] = edge < 1 ? 0.1 : 0.35 + 0.45 * curve + 0.2 * (1 - inRow);
      }
    }
    return { color: col, height: hgt };
  },

  plaster(size) {
    const soft = surfaceFbm(size, 6, 5, 131);
    const col = new Float32Array(size * size);
    for (let i = 0; i < col.length; i += 1) col[i] = 0.88 + soft[i] * 0.12;
    return { color: col, height: soft };
  },
};

// World units covered by one texture tile, and how strong the relief is.
const surfaceSettings = {
  wood:    { tile: 4,  bump: 0.045, roughness: 0.82 },
  stone:   { tile: 7,  bump: 0.06,  roughness: 0.9 },
  rock:    { tile: 9,  bump: 0.07,  roughness: 0.93 },
  cliff:   { tile: 26, bump: 0.09,  roughness: 0.95 },
  grass:   { tile: 16, bump: 0.025, roughness: 0.92 },
  sand:    { tile: 10, bump: 0.02,  roughness: 0.96 },
  snow:    { tile: 16, bump: 0.015, roughness: 0.8 },
  dirt:    { tile: 9,  bump: 0.04,  roughness: 0.97 },
  bark:    { tile: 3,  bump: 0.06,  roughness: 0.94 },
  foliage: { tile: 3,  bump: 0.04,  roughness: 0.85 },
  metal:   { tile: 4,  bump: 0.01,  roughness: 0.42, metalness: 0.65 },
  plaster: { tile: 6,  bump: 0.02,  roughness: 0.88 },
  tiles:   { tile: 7,  bump: 0.07,  roughness: 0.82 },
};

function getSurfaceLibrary() {
  if (surfaceLibrary) return surfaceLibrary;
  surfaceLibrary = {};
  Object.keys(surfacePainters).forEach((kind) => {
    const result = surfacePainters[kind](SURFACE_TEX_SIZE);
    const colorCanvas = result.canvas || surfaceCanvasFromValues(SURFACE_TEX_SIZE, result.color);
    const heightCanvas = surfaceCanvasFromValues(SURFACE_TEX_SIZE, result.height);
    surfaceLibrary[kind] = { map: surfaceTexture(colorCanvas), bump: surfaceTexture(heightCanvas) };
  });
  // Soft edge shading for blocks so corners read as solid, bevelled edges.
  const s = 128;
  const ao = new Float32Array(s * s);
  for (let y = 0; y < s; y += 1) {
    for (let x = 0; x < s; x += 1) {
      const d = Math.min(x, y, s - 1 - x, s - 1 - y) / s;
      const t = Math.min(1, d / 0.06);
      ao[y * s + x] = 0.6 + 0.4 * (t * t * (3 - 2 * t));
    }
  }
  const aoTex = new THREE.CanvasTexture(surfaceCanvasFromValues(s, ao));
  surfaceLibrary.edgeAO = aoTex;
  return surfaceLibrary;
}

function classifySurface(mesh, mat) {
  if (mesh.userData.surface) return mesh.userData.surface;
  const type = mesh.geometry.type;
  const hsl = { h: 0, s: 0, l: 0 };
  mat.color.getHSL(hsl);
  const { h, s, l } = hsl;
  const isBox = type === "BoxGeometry" || type === "BoxBufferGeometry";
  const isCyl = type.startsWith("Cylinder");
  const isRound = /Sphere|Dodecahedron|Icosahedron|Octahedron|Tetrahedron|Cone/.test(type);
  const isFlat = /Plane|Circle/.test(type);

  if (s < 0.12) {
    if (l > 0.86) return isRound ? null : "snow";
    if (l < 0.16) return isBox || isCyl ? "metal" : "rock";
    return isBox ? "stone" : isCyl ? "stone" : "rock";
  }
  if (h >= 0.17 && h <= 0.47) {
    if (isRound || isCyl) return "foliage";
    if (isBox) {
      const p = mesh.geometry.parameters || {};
      const thin = (p.height || 1) < Math.min(p.width || 1, p.depth || 1) * 0.5;
      return thin ? "grass" : "foliage";
    }
    return "grass";
  }
  if (h >= 0.02 && h < 0.17) {
    if (l > 0.55 && s > 0.25) return isRound ? "rock" : "sand";
    if (s < 0.33 && l > 0.32) return isCyl ? "bark" : isRound ? "rock" : "dirt";
    if (isCyl) return "bark";
    if (isBox) {
      const p = mesh.geometry.parameters || {};
      const tall = (p.height || 1) > Math.max(p.width || 1, p.depth || 1) * 3;
      return tall ? "bark" : "wood";
    }
    if (isFlat) return "wood";
    return "dirt";
  }
  if (h > 0.47 && h < 0.7 && s < 0.3) return isBox ? "stone" : "rock";
  return isBox ? "plaster" : null;
}

function surfaceUvsForMesh(mesh, kind) {
  const src = mesh.geometry;
  const worldScale = new THREE.Vector3();
  mesh.getWorldScale(worldScale);
  const sx = Math.abs(worldScale.x) || 1;
  const sy = Math.abs(worldScale.y) || 1;
  const sz = Math.abs(worldScale.z) || 1;
  const key = `${src.uuid}|${kind}|${sx.toFixed(2)}|${sy.toFixed(2)}|${sz.toFixed(2)}`;
  if (surfaceGeometryCache.has(key)) return surfaceGeometryCache.get(key);

  const tile = surfaceSettings[kind].tile;
  const type = src.type;
  const isBox = type === "BoxGeometry" || type === "BoxBufferGeometry";
  const isCyl = type.startsWith("Cylinder") || type.startsWith("Cone");
  let geo;

  if (isBox || isCyl) {
    geo = src.clone();
    if (!geo.attributes.normal) geo.computeVertexNormals();
    const pos = geo.attributes.position;
    const nor = geo.attributes.normal;
    const origUv = geo.attributes.uv;
    const uv = new Float32Array(pos.count * 2);
    const p = src.parameters || {};
    const radius = isCyl ? ((p.radiusTop ?? p.radius ?? 1) + (p.radiusBottom ?? p.radius ?? 1)) / 2 : 1;
    for (let i = 0; i < pos.count; i += 1) {
      const nx = Math.abs(nor.getX(i));
      const ny = Math.abs(nor.getY(i));
      const nz = Math.abs(nor.getZ(i));
      let u;
      let v;
      if (isCyl && ny < 0.9 && origUv) {
        u = origUv.getX(i) * Math.PI * 2 * radius * Math.max(sx, sz);
        v = pos.getY(i) * sy;
      } else if (ny >= nx && ny >= nz) {
        u = pos.getX(i) * sx;
        v = pos.getZ(i) * sz;
      } else if (nx >= nz) {
        u = pos.getZ(i) * sz;
        v = pos.getY(i) * sy;
      } else {
        u = pos.getX(i) * sx;
        v = pos.getY(i) * sy;
      }
      uv[i * 2] = u / tile;
      uv[i * 2 + 1] = v / tile;
    }
    if (isBox && origUv) geo.setAttribute("uv2", new THREE.BufferAttribute(new Float32Array(origUv.array), 2));
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  } else {
    // Free-form shapes (rocks, foliage, terrain): planar projection chosen per triangle.
    geo = src.index ? src.toNonIndexed() : src.clone();
    const pos = geo.attributes.position;
    const uv = new Float32Array(pos.count * 2);
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const n = new THREE.Vector3();
    for (let t = 0; t < pos.count; t += 3) {
      a.fromBufferAttribute(pos, t);
      b.fromBufferAttribute(pos, t + 1);
      c.fromBufferAttribute(pos, t + 2);
      n.subVectors(c, b).cross(a.clone().sub(b));
      const ax = Math.abs(n.x * sy * sz);
      const ay = Math.abs(n.y * sx * sz);
      const az = Math.abs(n.z * sx * sy);
      for (let k = 0; k < 3; k += 1) {
        const i = t + k;
        let u;
        let v;
        if (ay >= ax && ay >= az) { u = pos.getX(i) * sx; v = pos.getZ(i) * sz; }
        else if (ax >= az) { u = pos.getZ(i) * sz; v = pos.getY(i) * sy; }
        else { u = pos.getX(i) * sx; v = pos.getY(i) * sy; }
        uv[i * 2] = u / tile;
        uv[i * 2 + 1] = v / tile;
      }
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    if (!geo.attributes.normal) geo.computeVertexNormals();
  }
  if (!geo.attributes.uv2) {
    geo.setAttribute("uv2", new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 2).fill(0.5), 2));
  }
  surfaceGeometryCache.set(key, geo);
  return geo;
}

function surfaceMaterialFor(mat, kind, withEdges) {
  // Materials are upgraded in place so any code holding a reference keeps working.
  const done = surfaceMaterialCache.get(mat.uuid);
  if (done) {
    if (withEdges && !mat.aoMap) { mat.aoMap = getSurfaceLibrary().edgeAO; mat.aoMapIntensity = 0.85; mat.needsUpdate = true; }
    return mat;
  }
  const lib = getSurfaceLibrary();
  const settings = surfaceSettings[kind];
  mat.map = lib[kind].map;
  mat.bumpMap = lib[kind].bump;
  mat.bumpScale = settings.bump;
  mat.roughness = settings.roughness;
  if (settings.metalness !== undefined) mat.metalness = settings.metalness;
  if (withEdges) {
    mat.aoMap = lib.edgeAO;
    mat.aoMapIntensity = 0.85;
  }
  // Detail maps darken slightly on average; lift the base color to keep the original look.
  mat.color.multiplyScalar(kind === "snow" || kind === "plaster" ? 1.04 : 1.12);
  mat.needsUpdate = true;
  surfaceMaterialCache.set(mat.uuid, kind);
  return mat;
}

function enhanceWorldSurfaces(root, skip = new Set()) {
  if (!root) return;
  root.updateMatrixWorld(true);
  const visit = (obj) => {
    if (skip.has(obj) || obj.userData.noSurface) return;
    if (obj.isMesh && obj.material && obj.material.isMeshStandardMaterial && !Array.isArray(obj.material)) {
      const mat = obj.material;
      const glowing = mat.emissiveIntensity > 0.2 && (mat.emissive.r + mat.emissive.g + mat.emissive.b) > 0.24;
      if (!mat.map && !mat.transparent && !mat.vertexColors && !glowing && mat.opacity >= 1) {
        const kind = classifySurface(obj, mat);
        if (kind && surfaceSettings[kind]) {
          try {
            const isBox = obj.geometry.type === "BoxGeometry" || obj.geometry.type === "BoxBufferGeometry";
            obj.geometry = surfaceUvsForMesh(obj, kind);
            surfaceMaterialFor(mat, kind, isBox);
          } catch (error) {
            console.warn("Surface enhancement skipped for a mesh:", error);
          }
        }
      }
    }
    obj.children.forEach(visit);
  };
  visit(root);
}

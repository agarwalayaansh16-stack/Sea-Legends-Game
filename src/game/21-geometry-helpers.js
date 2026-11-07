
// How far the island rock base sits below the grass surface at its centre.
const ISLAND_BASE_SINK = 1.4;
// ── 21-geometry-helpers.js ─ Island height sampling and procedural geometry helpers.
function getOutpostIslandProfileRadius(angle, maxRadius) {
  const ax = -900, az = -300;
  const bx = 900, bz = 300;
  const vx = bx - ax, vz = bz - az;
  const v_len_sq = vx * vx + vz * vz;
  
  const r1 = 950;
  const r2 = 950;
  const bridgeWidth = 280;

  let low = 0;
  let high = maxRadius * 1.6;
  for (let step = 0; step < 16; step++) {
    const mid = (low + high) / 2;
    const px = Math.cos(angle) * mid;
    const pz = Math.sin(angle) * mid;
    
    // Check dist1
    const dx1 = px - ax, dz1 = pz - az;
    const dist1 = Math.sqrt(dx1 * dx1 + dz1 * dz1) / r1;
    
    // Check dist2
    const dx2 = px - bx, dz2 = pz - bz;
    const dist2 = Math.sqrt(dx2 * dx2 + dz2 * dz2) / r2;
    
    // Check bridge
    const wx = px - ax, wz = pz - az;
    let t = (wx * vx + wz * vz) / v_len_sq;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + t * vx;
    const cz = az + t * vz;
    const dxB = px - cx, dzB = pz - cz;
    const distB = Math.sqrt(dxB * dxB + dzB * dzB) / bridgeWidth;
    
    const minDist = Math.min(dist1, dist2, distB);
    if (minDist <= 1) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return low;
}

// Islands are a flat plateau in the middle that rolls smoothly down to the shore.
// Everything that stands on the ground (player, buildings, grass, paths) uses this.
function islandPlateauStart(index) {
  if (index === 0) return 0.56;
  if (index >= 5) return 0.25;
  return 0.42;
}

function islandSlopeShape(normDist, index) {
  const start = islandPlateauStart(index);
  const t = Math.min(1, Math.max(0, (normDist - start) / (1 - start)));
  return t * t * (3 - 2 * t);
}

// Where the island's rock base meets the sea, by direction.
function islandCoastRadius(angle, radius, index) {
  return islandProfileRadius(angle, radius * 0.9, index + 3);
}

// Outline of the grassy top: its own wobbly shape, but never past the coast.
function islandGrassRadius(angle, radius, index) {
  return Math.min(islandProfileRadius(angle, radius * 0.88, index + 9), islandCoastRadius(angle, radius, index) * 0.97);
}

function getLocalSurfaceHeightAt(lx, lz, radius, height, index) {
  const seed = index + 9;
  const angle = Math.atan2(lz, lx);
  const centerHeight = height + 0.5;
  const uneven = Math.sin(angle * 6 + seed) * 1.5 + Math.cos(angle * 11) * 0.8;
  const edgeHeight = 0.16 + uneven;
  let normDist;

  if (index === 2) {
    // Outpost: two round lobes joined by a land bridge.
    const ax = -900, az = -300;
    const bx = 900, bz = 300;
    const vx = bx - ax, vz = bz - az;
    const lenSq = vx * vx + vz * vz;
    const dist1 = Math.hypot(lx - ax, lz - az) / 950;
    const dist2 = Math.hypot(lx - bx, lz - bz) / 950;
    const t = Math.max(0, Math.min(1, ((lx - ax) * vx + (lz - az) * vz) / lenSq));
    const distB = Math.hypot(lx - (ax + t * vx), lz - (az + t * vz)) / 280;
    normDist = Math.min(1, dist1, dist2, distB);
  } else {
    // Measured against the real coastline (the rock base rim), so land meets the sea there.
    normDist = Math.min(1, Math.hypot(lx, lz) / (islandCoastRadius(angle, radius, index) * 0.98));
  }

  return centerHeight + (edgeHeight - centerHeight) * islandSlopeShape(normDist, index);
}

function getIslandSurfaceHeightAt(x, z, island) {
  if (!island) return OCEAN_SURFACE_Y;
  const height = island.surfaceY - 0.16;
  return getLocalSurfaceHeightAt(x - island.position.x, z - island.position.z, island.radius, height, island.index);
}

// Island rock base. Its top is built in rings that follow the terrain a little
// below the grass, then drops at the rim to the sea floor.
// `terrain` = { radius, height, index } of the island (omit for a plain cone).
function makeIrregularCylinderGeometry(radius, height, segments, seed, index = -1, terrain = null) {
  const positions = [];
  const indices = [];
  const rings = terrain ? terrain.rings || 14 : 1;
  const bottomY = -height / 2 - 40;
  const centerY = terrain
    ? getLocalSurfaceHeightAt(0, 0, terrain.radius, terrain.height, terrain.index) - height / 2 - ISLAND_BASE_SINK
    : height / 2 - ISLAND_BASE_SINK;
  positions.push(0, centerY, 0, 0, bottomY, 0);
  const perAngle = rings + 1; // top ring vertices + one bottom vertex per angle

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const topRadius = islandProfileRadius(angle, radius * 0.9, seed, index);
    const bottomRadius = islandProfileRadius(angle + 0.08, radius, seed + 2, index);
    const uneven = Math.sin(angle * 6 + (seed + 6)) * 1.5 + Math.cos(angle * 11) * 0.8;
    const rimY = -height / 2 + uneven; // sea level at the rim (mesh-local)
    for (let ring = 1; ring <= rings; ring += 1) {
      const t = ring / rings;
      const x = Math.cos(angle) * topRadius * t;
      const z = Math.sin(angle) * topRadius * t;
      let y = rimY;
      if (terrain) {
        // Just under the grass everywhere; reaches sea level at the coast.
        y = getLocalSurfaceHeightAt(x, z, terrain.radius, terrain.height, terrain.index) - height / 2 - ISLAND_BASE_SINK;
      }
      positions.push(x, y, z);
    }
    positions.push(Math.cos(angle) * bottomRadius, bottomY, Math.sin(angle) * bottomRadius);
  }

  for (let i = 0; i < segments; i += 1) {
    const next = (i + 1) % segments;
    const a = 2 + i * perAngle;
    const b = 2 + next * perAngle;
    indices.push(0, b, a);
    for (let ring = 0; ring < rings - 1; ring += 1) {
      indices.push(a + ring, b + ring, a + ring + 1, b + ring, b + ring + 1, a + ring + 1);
    }
    const rimA = a + rings - 1;
    const rimB = b + rings - 1;
    const botA = a + rings;
    const botB = b + rings;
    indices.push(rimA, botA, rimB, rimB, botA, botB);
    indices.push(1, botA, botB);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Grass surface built on a polar grid whose heights come straight from
// getLocalSurfaceHeightAt, so what you see is exactly what you walk on.
function makeTerrainSurfaceGeometry(radius, height, index, segments, rings) {
  const seed = index + 9;
  const positions = [0, getLocalSurfaceHeightAt(0, 0, radius, height, index) - 0.04, 0];
  const indices = [];
  for (let ring = 1; ring <= rings; ring += 1) {
    // Rings bunch up toward the shore where the slope changes most.
    const t = Math.pow(ring / rings, 0.85);
    for (let i = 0; i < segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2;
      const r = islandGrassRadius(angle, radius, index) * t;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      positions.push(x, getLocalSurfaceHeightAt(x, z, radius, height, index) - 0.04, z);
    }
  }
  for (let i = 0; i < segments; i += 1) {
    const next = (i + 1) % segments;
    indices.push(0, 1 + next, 1 + i);
  }
  for (let ring = 1; ring < rings; ring += 1) {
    const a0 = 1 + (ring - 1) * segments;
    const b0 = 1 + ring * segments;
    for (let i = 0; i < segments; i += 1) {
      const next = (i + 1) % segments;
      indices.push(a0 + i, a0 + next, b0 + i, a0 + next, b0 + next, b0 + i);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeIrregularDiscGeometry(radius, segments, seed, height = 0, index = -1) {
  const positions = [0, 0, 0.5]; // Center is slightly raised
  const indices = [];

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const edgeRadius = islandProfileRadius(angle, radius, seed, index);
    
    const slope = -height;
    const uneven = Math.sin(angle * 6 + seed) * 1.5 + Math.cos(angle * 11) * 0.8;
    const rise = slope + uneven;
    
    positions.push(Math.cos(angle) * edgeRadius, Math.sin(angle) * edgeRadius, rise);
  }

  for (let i = 1; i <= segments; i += 1) {
    const next = i === segments ? 1 : i + 1;
    indices.push(0, i, next);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// A wobbly ring (beaches, shallows). Drawn flat in x/y and laid down by the caller
// with rotation.x = -PI/2. With `height` > 0 it follows the island terrain: the caller
// also sets position.y = height, so vertex z = ground - height.
function makeIrregularRingGeometry(innerRadius, outerRadius, segments, seed, height = 0, index = -1, maxRadius = 1) {
  const positions = [];
  const indices = [];
  const rings = height > 0 ? 9 : 1;

  for (let i = 0; i < segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    const inner = islandProfileRadius(angle + 0.12, innerRadius, seed + 1, index);
    const outer = islandProfileRadius(angle, outerRadius, seed, index);
    for (let k = 0; k <= rings; k += 1) {
      const r = inner + (outer - inner) * (k / rings);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      let z;
      if (height > 0) {
        // After rotation.x = -PI/2, local (x, y) lands at world (x, -y).
        // Sits clearly above the grass so the two never interleave at the edge.
        z = getLocalSurfaceHeightAt(x, -y, maxRadius, height, index) + 0.35 - height;
      } else {
        const wobble = Math.sin(angle * 15 + seed) * 0.3;
        z = k === 0 ? wobble : -wobble;
      }
      positions.push(x, y, z);
    }
  }

  const stride = rings + 1;
  for (let i = 0; i < segments; i += 1) {
    const next = (i + 1) % segments;
    for (let k = 0; k < rings; k += 1) {
      const a = i * stride + k;
      const b = next * stride + k;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function islandProfileRadius(angle, radius, seed, index = -1) {
  if (index === 2) {
    const baseR = getOutpostIslandProfileRadius(angle, 2400);
    const noise = Math.sin(angle * 13 + seed * 1.4) * 0.025;
    return baseR * (radius / 2400) * (1 + noise);
  }
  const longCurve = Math.sin(angle * 3 + seed) * 0.13;
  const cove = Math.cos(angle * 5 - seed * 0.7) * 0.08;
  const chips = Math.sin(angle * 13 + seed * 1.4) * 0.035;
  return radius * (1 + longCurve + cove + chips);
}

function makeLabel(text, scale = 1) {
  const canvasLabel = document.createElement("canvas");
  canvasLabel.width = 256;
  canvasLabel.height = 96;
  const ctx = canvasLabel.getContext("2d");
  ctx.fillStyle = "rgba(7, 28, 38, 0.72)";
  roundRect(ctx, 10, 16, 236, 60, 18);
  ctx.fill();
  ctx.fillStyle = "#fff7e6";
  ctx.font = "bold 30px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText(text, 128, 56);

  const texture = new THREE.CanvasTexture(canvasLabel);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(5 * scale, 1.9 * scale, 1);
  return sprite;
}

function makeCapsuleMesh(radius, height, material) {
  const group = new THREE.Group();
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 16), material);
  const top = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 10), material);
  const bottom = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 10), material);

  cylinder.castShadow = true;
  top.castShadow = true;
  bottom.castShadow = true;
  top.position.y = height / 2;
  bottom.position.y = -height / 2;

  group.add(cylinder, top, bottom);
  return group;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

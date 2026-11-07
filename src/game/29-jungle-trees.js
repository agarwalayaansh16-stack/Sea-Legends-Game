
// ── 29-jungle-trees.js ─ Curved rainforest trees with swaying canopies for the jungle island.
//
// Six tree shapes are generated once (curved trunk, buttress roots, branches,
// leaf clusters, vines) and drawn as instanced batches, so the whole forest is a
// handful of draw calls. A shared wind shader bends each tree from the top and
// makes the leaves flutter, driven by the same wind as the grass.

const JUNGLE_TREE_HEIGHT = 150; // nominal height the shapes are built at
const JUNGLE_TREE_VARIANTS = 6;
let jungleTreeVariants = null;
let jungleTreeMaterials = null;

// Small deterministic random generator so every run grows the same forest.
function seededRandom(seed) {
  let state = (seed * 2654435761) >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// A tube swept along a curve whose radius shrinks from r0 to r1.
function makeTaperedTube(curve, segments, radial, r0, r1, color = null) {
  const frames = curve.computeFrenetFrames(segments, false);
  const positions = [];
  const normals = [];
  const colors = [];
  const ring = (i) => {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const r = r0 + (r1 - r0) * Math.pow(t, 0.8);
    const n = frames.normals[i];
    const b = frames.binormals[i];
    const out = [];
    for (let j = 0; j <= radial; j += 1) {
      const a = (j / radial) * Math.PI * 2;
      const nx = Math.cos(a) * n.x + Math.sin(a) * b.x;
      const ny = Math.cos(a) * n.y + Math.sin(a) * b.y;
      const nz = Math.cos(a) * n.z + Math.sin(a) * b.z;
      out.push([p.x + nx * r, p.y + ny * r, p.z + nz * r, nx, ny, nz]);
    }
    return out;
  };
  let prev = ring(0);
  for (let i = 1; i <= segments; i += 1) {
    const cur = ring(i);
    for (let j = 0; j < radial; j += 1) {
      const quad = [prev[j], cur[j], prev[j + 1], cur[j], cur[j + 1], prev[j + 1]];
      quad.forEach((v) => {
        positions.push(v[0], v[1], v[2]);
        normals.push(v[3], v[4], v[5]);
        if (color) colors.push(color.r, color.g, color.b);
      });
    }
    prev = cur;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  if (color) geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geo;
}

// Joins geometries (position/normal[/color]) into one non-indexed geometry.
function mergeSimpleGeometries(list, withColor) {
  const parts = list.map((g) => (g.index ? g.toNonIndexed() : g));
  const total = parts.reduce((n, g) => n + g.attributes.position.count, 0);
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  const col = withColor ? new Float32Array(total * 3) : null;
  let offset = 0;
  parts.forEach((g) => {
    pos.set(g.attributes.position.array, offset * 3);
    nor.set(g.attributes.normal.array, offset * 3);
    if (col) {
      if (g.attributes.color) col.set(g.attributes.color.array, offset * 3);
      else col.fill(1, offset * 3, (offset + g.attributes.position.count) * 3);
    }
    offset += g.attributes.position.count;
  });
  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  if (col) merged.setAttribute("color", new THREE.BufferAttribute(col, 3));
  merged.computeBoundingSphere();
  return merged;
}

function leafCluster(center, radius, color, rand) {
  const geo = new THREE.IcosahedronGeometry(radius, 1).toNonIndexed();
  geo.deleteAttribute("uv");
  // Lumpy, flattened clump.
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i += 1) {
    const k = 0.82 + rand() * 0.3;
    p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.58, p.getZ(i) * k);
  }
  geo.computeVertexNormals();
  geo.translate(center.x, center.y, center.z);
  const colors = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i += 3) {
    // Per-face shade variation, lighter on top.
    const top = p.getY(i) > center.y ? 1.08 : 0.86;
    const v = (0.9 + rand() * 0.18) * top;
    for (let k = 0; k < 3; k += 1) {
      colors[(i + k) * 3] = color.r * v;
      colors[(i + k) * 3 + 1] = color.g * v;
      colors[(i + k) * 3 + 2] = color.b * v;
    }
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

// One tree shape at the nominal height. `straight` keeps the top centred (treehouse tree).
function buildJungleTreeShape(seed, straight = false) {
  const rand = seededRandom(seed + 11);
  const H = JUNGLE_TREE_HEIGHT;
  const bend = straight ? 2 : 12;
  const off = () => (rand() - 0.5) * 2 * bend;
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(off() * 0.4, H * 0.28, off() * 0.4),
    new THREE.Vector3(off(), H * 0.62, off()),
    new THREE.Vector3(straight ? 0 : off() * 0.7, H, straight ? 0 : off() * 0.7),
  ]);
  const bark = [makeTaperedTube(trunkCurve, 22, 10, 7.2, 2.4)];
  const leaves = [];
  const greens = WORLD_PALETTE.foliage.jungleCanopy.map((hex) => worldColor(hex));
  const vineColor = worldColor(0x3c6b2c);

  // Buttress roots flaring out to the ground.
  const rootCount = 5;
  for (let i = 0; i < rootCount; i += 1) {
    const a = (i / rootCount) * Math.PI * 2 + rand() * 0.6;
    const reach = 15 + rand() * 7;
    const root = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(a) * 3, 14 + rand() * 5, Math.sin(a) * 3),
      new THREE.Vector3(Math.cos(a) * reach * 0.55, 5, Math.sin(a) * reach * 0.55),
      new THREE.Vector3(Math.cos(a) * reach, -1.5, Math.sin(a) * reach),
    ]);
    bark.push(makeTaperedTube(root, 8, 6, 3.4, 0.7));
  }

  // Branches curving up and out, each ending in a cluster of leaves.
  const branchCount = 4 + Math.floor(rand() * 2);
  for (let i = 0; i < branchCount; i += 1) {
    const t = 0.52 + rand() * 0.38;
    const start = trunkCurve.getPointAt(t);
    const a = (i / branchCount) * Math.PI * 2 + rand() * 0.8;
    const len = 30 + rand() * 20;
    const mid = start.clone().add(new THREE.Vector3(Math.cos(a) * len * 0.5, len * 0.22, Math.sin(a) * len * 0.5));
    const end = start.clone().add(new THREE.Vector3(Math.cos(a) * len, len * 0.5, Math.sin(a) * len));
    bark.push(makeTaperedTube(new THREE.CatmullRomCurve3([start, mid, end]), 8, 7, 2.6, 0.8));
    for (let k = 0; k < 5; k += 1) {
      const c = end.clone().add(new THREE.Vector3((rand() - 0.5) * 22, rand() * 9 - 2, (rand() - 0.5) * 22));
      leaves.push(leafCluster(c, 15 + rand() * 8, greens[Math.floor(rand() * greens.length)], rand));
    }
    // A hanging vine from some branches.
    if (rand() < 0.6) {
      const drop = 26 + rand() * 30;
      const v0 = mid.clone();
      const vine = new THREE.CatmullRomCurve3([
        v0,
        v0.clone().add(new THREE.Vector3(rand() * 2 - 1, -drop * 0.5, rand() * 2 - 1)),
        v0.clone().add(new THREE.Vector3(rand() * 3 - 1.5, -drop, rand() * 3 - 1.5)),
      ]);
      leaves.push(makeTaperedTube(vine, 6, 4, 0.45, 0.25, vineColor));
    }
  }
  // Crown on top.
  const top = trunkCurve.getPointAt(1);
  for (let k = 0; k < 6; k += 1) {
    const a = (k / 6) * Math.PI * 2 + rand();
    const c = top.clone().add(new THREE.Vector3(Math.cos(a) * 15, 2 + rand() * 8, Math.sin(a) * 15));
    leaves.push(leafCluster(c, 17 + rand() * 7, greens[Math.floor(rand() * greens.length)], rand));
  }
  leaves.push(leafCluster(top.clone().add(new THREE.Vector3(0, 14, 0)), 18, greens[1], rand));

  return { bark: mergeSimpleGeometries(bark, false), leaves: mergeSimpleGeometries(leaves, true) };
}

// Wind: the tree bends from the top (roots stay put) and leaves flutter.
function addTreeWind(material, flutter) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWindTime = windUniforms.uWindTime;
    shader.uniforms.uWindDir = windUniforms.uWindDir;
    shader.uniforms.uWindStrength = windUniforms.uWindStrength;
    shader.vertexShader = `
      uniform float uWindTime;
      uniform vec2 uWindDir;
      uniform float uWindStrength;
    ` + shader.vertexShader.replace(
      "#include <project_vertex>",
      `
      vec4 localPos = vec4(transformed, 1.0);
      vec4 rootLocal = vec4(0.0, 0.0, 0.0, 1.0);
      #ifdef USE_INSTANCING
        localPos = instanceMatrix * localPos;
        rootLocal = instanceMatrix * rootLocal;
      #endif
      vec4 worldPos = modelMatrix * localPos;
      vec4 rootWorld = modelMatrix * rootLocal;
      float h = clamp(transformed.y / ${JUNGLE_TREE_HEIGHT.toFixed(1)}, 0.0, 1.2);
      float phase = rootWorld.x * 0.013 + rootWorld.z * 0.011;
      float sway = (sin(uWindTime * 0.8 + phase) * 1.6 + sin(uWindTime * 1.9 + phase * 2.3) * 0.5) * uWindStrength;
      worldPos.xz += uWindDir * sway * h * h * h;
      ${flutter ? `
      // Leaves flutter a little on top of the sway.
      float f = sin(uWindTime * 3.1 + worldPos.x * 0.21 + worldPos.y * 0.17) * 0.55
              + sin(uWindTime * 4.7 + worldPos.z * 0.19) * 0.3;
      worldPos.xyz += vec3(uWindDir.x, 0.35, uWindDir.y) * f * uWindStrength * smoothstep(0.35, 0.9, h);
      ` : ""}
      vec4 mvPosition = viewMatrix * worldPos;
      gl_Position = projectionMatrix * mvPosition;
      `,
    );
  };
  return material;
}

function getJungleTreeAssets() {
  if (!jungleTreeVariants) {
    jungleTreeVariants = [];
    for (let i = 0; i < JUNGLE_TREE_VARIANTS; i += 1) jungleTreeVariants.push(buildJungleTreeShape(i * 7 + 3));
    jungleTreeMaterials = {
      bark: addTreeWind(new THREE.MeshStandardMaterial({ color: worldHex(WORLD_PALETTE.foliage.jungleBark), roughness: 0.95 }), false),
      leaves: addTreeWind(new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.82, flatShading: true }), true),
    };
    jungleTreeMaterials.bark.userData.surface = "bark";
  }
  return { variants: jungleTreeVariants, materials: jungleTreeMaterials };
}

// Single (non-instanced) tree, used for the treehouse tree. Kept the old signature.
function createJungleTree(height, trunkRadius) {
  const { materials } = getJungleTreeAssets();
  const shape = buildJungleTreeShape(99, true);
  const group = new THREE.Group();
  const bark = new THREE.Mesh(shape.bark, materials.bark);
  bark.castShadow = true;
  bark.receiveShadow = true;
  bark.userData.surface = "bark";
  const leaves = new THREE.Mesh(shape.leaves, materials.leaves);
  leaves.castShadow = true;
  leaves.userData.noSurface = true;
  group.add(bark, leaves);
  const s = height / JUNGLE_TREE_HEIGHT;
  const w = Math.max(s, (trunkRadius / 10) * 1.1);
  group.scale.set(w, s, w);
  return group;
}

// Scatters the forest across the jungle island as instanced batches.
function addJungleForest(group, radius, height, count = 180) {
  const { variants, materials } = getJungleTreeAssets();
  const placements = variants.map(() => []);
  const ground = (x, z) => getLocalSurfaceHeightAt(x, z, radius, height, 1);
  for (let i = 0; i < count; i += 1) {
    const angle = i * 2.399;
    const distance = radius * (0.08 + ((i * 37) % 76) / 100);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const treeHeight = 120 + (i % 7) * 18;
    const s = treeHeight / JUNGLE_TREE_HEIGHT;
    const w = s * (0.85 + ((i * 13) % 7) / 25);
    // Sit the roots on the lowest ground under the tree so none hang on slopes.
    const r = 16 * w;
    const y = Math.min(ground(x, z), ground(x + r, z), ground(x - r, z), ground(x, z + r), ground(x, z - r)) - 0.8;
    placements[i % variants.length].push({ x, y, z, s, w, rot: angle * 1.7 });
    addCollisionCircle(group.position.clone().add(new THREE.Vector3(x, ground(x, z), z)), 6.5 * w, "Jungle tree", { material: "wood", damage: 6 });
  }

  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();
  variants.forEach((shape, v) => {
    const list = placements[v];
    if (!list.length) return;
    // Bounds covering every instance of this shape, so the batch is culled when off-screen
    // (and skipped by the shadow pass when the player is far away).
    const bounds = new THREE.Box3();
    list.forEach((p) => bounds.expandByPoint(new THREE.Vector3(p.x, p.y, p.z)));
    bounds.expandByScalar(JUNGLE_TREE_HEIGHT * 1.6);
    const sphere = bounds.getBoundingSphere(new THREE.Sphere());
    const barkGeo = shape.bark.clone();
    const leafGeo = shape.leaves.clone();
    barkGeo.boundingSphere = sphere;
    leafGeo.boundingSphere = sphere.clone();
    const bark = new THREE.InstancedMesh(barkGeo, materials.bark, list.length);
    const leaves = new THREE.InstancedMesh(leafGeo, materials.leaves, list.length);
    list.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(0, p.rot, 0);
      dummy.scale.set(p.w, p.s, p.w);
      dummy.updateMatrix();
      bark.setMatrixAt(i, dummy.matrix);
      leaves.setMatrixAt(i, dummy.matrix);
      leaves.setColorAt(i, tint.setHSL(0.3 + ((i * 7) % 10) / 160, 0.25, 0.72 + ((i * 3) % 5) / 30));
    });
    [bark, leaves].forEach((mesh) => {
      mesh.instanceMatrix.needsUpdate = true;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = true;
      mesh.userData.noSurface = true;
      mesh.userData.noSettle = true;
    });
    if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true;
    group.add(bark, leaves);
  });
}

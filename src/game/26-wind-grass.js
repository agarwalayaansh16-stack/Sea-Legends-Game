
// ── 26-wind-grass.js ─ Instanced grass blades that sway in a shared wind field.
//
// Each island gets one InstancedMesh of tapered blades. The wind is done in the
// vertex shader (rolling gusts + flutter), so thousands of blades cost one draw call.

const windUniforms = {
  uWindTime: { value: 0 },
  uWindDir: { value: new THREE.Vector2(0.86, 0.5).normalize() },
  uWindStrength: { value: 1.0 },
};

// Blades per square world unit at the highest quality, per island index.
const WIND_GRASS_DENSITY = { 0: 0.85, 1: 0.85, 2: 0.65, 3: 0.12, default: 0.5 };
const WIND_GRASS_CELL = 64;           // grass is generated in square cells this wide
const WIND_GRASS_FULL_RANGE = 80;     // full density inside this distance
const WIND_GRASS_FADE_RANGE = 210;    // thins out to nothing by here
const WIND_GRASS_DROP_RANGE = 330;    // cells beyond this are freed
const windGrassIslands = [];
// `var` so the graphics setting can be applied before this file has run.
var windGrassQuality = 1;
var windGrassTimer = 0;
let windGrassGeometry = null;

function updateWind(dt) {
  windUniforms.uWindTime.value += dt;
  // Storms push the grass harder; ease in and out.
  const target = typeof weatherActive !== "undefined" && weatherActive ? 2.1 : 1.0;
  windUniforms.uWindStrength.value += (target - windUniforms.uWindStrength.value) * Math.min(1, dt * 0.6);
  // Wind direction wanders slowly.
  const a = 0.52 + Math.sin(windUniforms.uWindTime.value * 0.021) * 0.45;
  windUniforms.uWindDir.value.set(Math.cos(a), Math.sin(a));
}

function setWindGrassQuality(level) {
  windGrassQuality = ({ 1: 0.18, 2: 0.35, 3: 0.6, 4: 0.82, 5: 1 })[level] ?? 1;
  windGrassTimer = 0; // re-apply densities on the next update
}

// A tapered, slightly curved blade, 1 unit tall. `bladeT` runs 0 at the root to 1 at the tip.
function createGrassBladeGeometry() {
  const segments = 4;
  const positions = [];
  const bladeT = [];
  const normals = [];
  const indices = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const halfWidth = 0.17 * Math.pow(1 - t, 0.9) + 0.004;
    const lean = t * t * 0.32;
    positions.push(-halfWidth, t, lean, halfWidth, t, lean);
    bladeT.push(t, t);
    // Up-facing normals light blades like the ground they grow from (no dark backsides).
    normals.push(0, 1, 0.25, 0, 1, 0.25);
  }
  for (let i = 0; i < segments; i += 1) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("bladeT", new THREE.Float32BufferAttribute(bladeT, 1));
  geometry.setIndex(indices);
  return geometry;
}

function createWindGrassMaterial(rootHex, tipHex) {
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    side: THREE.DoubleSide,
  });
  material.userData.noSurface = true;
  const rootColor = worldColor(rootHex);
  const tipColor = worldColor(tipHex);
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWindTime = windUniforms.uWindTime;
    shader.uniforms.uWindDir = windUniforms.uWindDir;
    shader.uniforms.uWindStrength = windUniforms.uWindStrength;
    shader.uniforms.uRootColor = { value: rootColor };
    shader.uniforms.uTipColor = { value: tipColor };
    shader.vertexShader = `
      attribute float bladeT;
      uniform float uWindTime;
      uniform vec2 uWindDir;
      uniform float uWindStrength;
      varying float vBladeT;
    ` + shader.vertexShader.replace(
      "#include <project_vertex>",
      `
      vBladeT = bladeT;
      vec4 localPos = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        localPos = instanceMatrix * localPos;
      #endif
      vec4 worldPos = modelMatrix * localPos;
      vec4 rootWorld = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      // Big rolling gusts travel across the field; small flutter on top.
      float along = dot(rootWorld.xz, uWindDir);
      float gust = sin(along * 0.045 - uWindTime * 1.6) * 0.5 + 0.5;
      gust = gust * gust;
      float sway = sin(uWindTime * 2.3 + rootWorld.x * 0.21 + rootWorld.z * 0.17) * 0.28
                 + sin(uWindTime * 5.1 + rootWorld.x * 0.73 - rootWorld.z * 0.61) * 0.08;
      float bend = (0.35 + gust * 1.1 + sway) * uWindStrength * bladeT * bladeT;
      float bladeHeight = length(instanceMatrix[1].xyz);
      worldPos.xz += uWindDir * bend * bladeHeight * 0.55;
      worldPos.y -= bend * bend * bladeHeight * 0.12;
      vec4 mvPosition = viewMatrix * worldPos;
      gl_Position = projectionMatrix * mvPosition;
      `,
    );
    shader.fragmentShader = `
      uniform vec3 uRootColor;
      uniform vec3 uTipColor;
      varying float vBladeT;
    ` + shader.fragmentShader.replace(
      "#include <color_fragment>",
      `
      #include <color_fragment>
      // Dark, shaded roots fading to sunlit tips.
      diffuseColor.rgb *= mix(uRootColor, uTipColor, smoothstep(0.0, 1.0, vBladeT));
      `,
    );
  };
  return material;
}

// Islands register once; their grass is generated cell by cell as the player approaches.
function addWindGrass(group, radius, height, index) {
  if (index === 4) return; // snowy island
  const dry = index === 3;
  windGrassIslands.push({
    group,
    radius,
    height,
    index,
    dry,
    density: WIND_GRASS_DENSITY[index] ?? WIND_GRASS_DENSITY.default,
    cells: new Map(),
    pool: [], // freed cells are reused so GPU buffers are not leaked
    covers: null,
    material: dry ? createWindGrassMaterial(0x8a7a3e, 0xe0cd84) : createWindGrassMaterial(0x2f5e26, 0xa9d46a),
    tints: (dry ? [0xf2e2a0, 0xe6d08a, 0xd8c27a] : [0xffffff, 0xe6f2d2, 0xf4f8e4, 0xd2e8b6, 0xfff1c8]).map((hex) => new THREE.Color(hex)),
  });
}

// Flat ground cover (paths, plaza, beach rings, farm plots) that grass must not poke through.
function collectGrassCovers(island) {
  const covers = [];
  const box = new THREE.Box3();
  const groundTop = island.group.position.y + island.height + 3;
  island.group.updateMatrixWorld(true);
  island.group.traverse((obj) => {
    if (!obj.isMesh || obj.isInstancedMesh) return;
    const surface = obj.userData.surface;
    if (surface === "grass" || surface === "cliff" || surface === "rock") return;
    box.setFromObject(obj);
    if (obj.userData.groundCover || (box.max.y - box.min.y < 3.5 && box.min.y < groundTop)) covers.push({ mesh: obj, box: box.clone() });
  });
  return covers;
}

const grassRaycaster = new THREE.Raycaster();
const grassDown = new THREE.Vector3(0, -1, 0);
const grassOrigin = new THREE.Vector3();
const grassProbe = new THREE.Vector3();
const grassDummy = new THREE.Object3D();

function grassCellCovered(covers, wx, wz, wy) {
  for (const cover of covers) {
    const b = cover.box;
    if (wx < b.min.x || wx > b.max.x || wz < b.min.z || wz > b.max.z || b.max.y < wy - 0.5) continue;
    grassOrigin.set(wx, wy + 10, wz);
    grassRaycaster.set(grassOrigin, grassDown);
    if (grassRaycaster.intersectObject(cover.mesh, false).length) return true;
  }
  return false;
}

function buildGrassCell(island, cx, cz) {
  if (!windGrassGeometry) {
    windGrassGeometry = createGrassBladeGeometry();
    // Every cell keeps its blades within this sphere around the cell centre, so
    // the shared bound lets each cell be frustum-culled on its own.
    windGrassGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), WIND_GRASS_CELL * 0.75 + 8);
  }
  if (!island.covers) island.covers = collectGrassCovers(island);
  const { radius, height, index, dry, group } = island;
  const seed = index + 9;
  const profileRadius = radius * 0.88;
  const half = WIND_GRASS_CELL / 2;
  const centerX = (cx + 0.5) * WIND_GRASS_CELL;
  const centerZ = (cz + 0.5) * WIND_GRASS_CELL;
  const target = Math.round(WIND_GRASS_CELL * WIND_GRASS_CELL * island.density);
  let mesh = island.pool.pop();
  if (!mesh) {
    mesh = new THREE.InstancedMesh(windGrassGeometry, island.material, target);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.userData.noSurface = true;
    group.add(mesh);
  }
  mesh.position.set(centerX, 0, centerZ);

  let state = ((cx * 73856093) ^ (cz * 19349663) ^ (index * 83492791)) >>> 0;
  const rng = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  let placed = 0;
  for (let attempt = 0; attempt < target * 1.4 && placed < target; attempt += 1) {
    const lx = centerX + (rng() - 0.5) * WIND_GRASS_CELL;
    const lz = centerZ + (rng() - 0.5) * WIND_GRASS_CELL;
    const r = Math.hypot(lx, lz);
    const angle = Math.atan2(lz, lx);
    const edge = islandGrassRadius(angle, radius, index);
    if (r > edge * 0.96) continue;
    // Same height function the terrain mesh and the player use.
    const ly = getLocalSurfaceHeightAt(lx, lz, radius, height, index) - 0.04;
    if (ly < 1.5) continue; // too close to the waterline
    const wx = group.position.x + lx;
    const wz = group.position.z + lz;
    const wy = group.position.y + ly;
    grassProbe.set(wx, wy, wz);
    if (getWallCollision(grassProbe, 0.6)) continue;
    if (grassCellCovered(island.covers, wx, wz, wy)) continue;

    const bladeHeight = (dry ? 1.5 : 2.0) + rng() * (dry ? 1.5 : 2.6);
    grassDummy.position.set(lx - centerX, ly - 0.05, lz - centerZ);
    grassDummy.rotation.set((rng() - 0.5) * 0.3, rng() * Math.PI * 2, (rng() - 0.5) * 0.3);
    grassDummy.scale.set(0.8 + rng() * 0.7, bladeHeight, 1);
    grassDummy.updateMatrix();
    mesh.setMatrixAt(placed, grassDummy.matrix);
    mesh.setColorAt(placed, island.tints[Math.floor(rng() * island.tints.length)]);
    placed += 1;
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.userData.maxCount = placed;
  mesh.count = 0;
  mesh.visible = false;
  return mesh;
}

// Streams cells in and out around the player and thins distant ones.
function updateWindGrass(dt) {
  updateWind(dt);
  windGrassTimer -= dt;
  if (windGrassTimer > 0 || !playerMesh) return;
  windGrassTimer = 0.25;
  const px = playerMesh.position.x;
  const pz = playerMesh.position.z;
  let builtThisTick = 0;

  windGrassIslands.forEach((island) => {
    const gx = island.group.position.x;
    const gz = island.group.position.z;
    const localX = px - gx;
    const localZ = pz - gz;
    const nearIsland = Math.hypot(localX, localZ) < island.radius + WIND_GRASS_DROP_RANGE;

    // Free far cells.
    island.cells.forEach((mesh, key) => {
      const d = Math.hypot(mesh.position.x - localX, mesh.position.z - localZ);
      if (!nearIsland || d > WIND_GRASS_DROP_RANGE) {
        mesh.count = 0;
        mesh.visible = false;
        island.pool.push(mesh);
        island.cells.delete(key);
      }
    });
    if (!nearIsland || windGrassQuality <= 0) return;

    const reach = Math.ceil(WIND_GRASS_FADE_RANGE / WIND_GRASS_CELL);
    const pcx = Math.floor(localX / WIND_GRASS_CELL);
    const pcz = Math.floor(localZ / WIND_GRASS_CELL);
    const wanted = [];
    for (let cx = pcx - reach; cx <= pcx + reach; cx += 1) {
      for (let cz = pcz - reach; cz <= pcz + reach; cz += 1) {
        const ccx = (cx + 0.5) * WIND_GRASS_CELL;
        const ccz = (cz + 0.5) * WIND_GRASS_CELL;
        if (Math.hypot(ccx, ccz) > island.radius) continue; // off the island
        const d = Math.max(0, Math.hypot(ccx - localX, ccz - localZ) - WIND_GRASS_CELL * 0.5);
        if (d > WIND_GRASS_FADE_RANGE) continue;
        wanted.push({ key: `${cx},${cz}`, cx, cz, d });
      }
    }
    wanted.sort((a, b) => a.d - b.d);
    wanted.forEach(({ key, cx, cz, d }) => {
      let mesh = island.cells.get(key);
      if (!mesh) {
        if (builtThisTick >= 2) return; // spread the work over several frames
        mesh = buildGrassCell(island, cx, cz);
        island.cells.set(key, mesh);
        builtThisTick += 1;
      }
      const fade = d <= WIND_GRASS_FULL_RANGE ? 1 : 1 - (d - WIND_GRASS_FULL_RANGE) / (WIND_GRASS_FADE_RANGE - WIND_GRASS_FULL_RANGE);
      // Blades were placed in random order, so a shorter count thins the cell evenly.
      // Thin quickly with distance: far blades are tiny on screen anyway.
      mesh.count = Math.floor(mesh.userData.maxCount * Math.pow(Math.max(0, fade), 1.6) * windGrassQuality);
      mesh.visible = mesh.count > 0;
    });
  });
  if (builtThisTick >= 2) windGrassTimer = 0; // keep building next frame
}

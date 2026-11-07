
// ── 30-static-batching.js ─ Merges static island scenery into a few large meshes at load time.
//
// The islands are built from thousands of small meshes (planks, flowers, window
// frames...) with many identical-looking materials. Each one costs a draw call,
// twice when it casts a shadow. This pass, run once after the world is built:
//   1. reuses one material for meshes whose materials look identical, then
//   2. merges static meshes that share a material into one mesh per area cell,
//      so far-off areas are still culled.
// Anything that moves or is looked up later (animated foliage, windmill sails,
// water, glowing rings, named or tagged objects, instanced grass/trees) is left alone.

const STATIC_BATCH_CELL = 320; // world units per merge cell

const STATIC_SAFE_USERDATA = new Set(["surface", "noSettle", "groundCover", "surfaceScale", "noSurface", "settleOn"]);

function materialSignature(mat) {
  const customShader = mat.onBeforeCompile !== THREE.Material.prototype.onBeforeCompile;
  if (customShader || mat.transparent || mat.userData.unique) return `uuid:${mat.uuid}`;
  const hex = (c) => (c ? c.getHexString() : "-");
  return [
    mat.type, hex(mat.color), hex(mat.emissive), (mat.emissiveIntensity ?? 0).toFixed(3),
    (mat.roughness ?? 0).toFixed(3), (mat.metalness ?? 0).toFixed(3),
    mat.map?.uuid, mat.bumpMap?.uuid, (mat.bumpScale ?? 0).toFixed(3), mat.aoMap?.uuid,
    (mat.aoMapIntensity ?? 0).toFixed(2), mat.normalMap?.uuid, mat.side, mat.flatShading,
    mat.vertexColors, mat.wireframe, mat.opacity,
  ].join("|");
}

function collectDynamicObjects() {
  const dynamic = new Set();
  const addTree = (obj) => obj && obj.traverse((child) => dynamic.add(child));
  animatedFoliage.forEach((item) => addTree(item.mesh));
  animatedWorldObjects.forEach((item) => addTree(item.mesh));
  windmillRotors.forEach((item) => addTree(item.mesh));
  return dynamic;
}

function isBatchable(mesh, dynamic) {
  if (!mesh.isMesh || mesh.isInstancedMesh || mesh.isSkinnedMesh || !mesh.visible) return false;
  if (dynamic.has(mesh) || mesh.name || mesh.userData.isTerrain || mesh.userData.noBatch) return false;
  if (Array.isArray(mesh.material) || mesh.material.transparent || mesh.material.opacity < 1) return false;
  const geo = mesh.geometry;
  if (!geo || !geo.attributes.position || Object.keys(geo.morphAttributes).length) return false;
  // Box/cylinder geometries carry one group per face set; with a single material
  // they're drawn whole anyway, so groups only matter if they skip part of it.
  if (geo.drawRange.count !== Infinity || geo.drawRange.start !== 0) return false;
  for (const key of Object.keys(mesh.userData)) {
    if (!STATIC_SAFE_USERDATA.has(key)) return false;
  }
  // Something up the tree is tagged or animated: leave it be.
  for (let p = mesh.parent; p && !p.userData.isIslandRoot; p = p.parent) {
    if (dynamic.has(p) || p.name || p.userData.noBatch) return false;
  }
  return true;
}

// Concatenates geometries (already in the target space). Missing attributes are zero-filled.
function mergeForBatch(geometries) {
  const names = new Map();
  geometries.forEach((g) => {
    Object.keys(g.attributes).forEach((name) => {
      if (!names.has(name)) names.set(name, g.attributes[name].itemSize);
    });
  });
  const flat = geometries.map((g) => (g.index ? g.toNonIndexed() : g));
  const total = flat.reduce((n, g) => n + g.attributes.position.count, 0);
  const merged = new THREE.BufferGeometry();
  names.forEach((itemSize, name) => {
    const out = new Float32Array(total * itemSize);
    let offset = 0;
    flat.forEach((g) => {
      const attr = g.attributes[name];
      const count = g.attributes.position.count;
      if (attr && attr.itemSize === itemSize) {
        out.set(attr.array.length === count * itemSize ? attr.array : Float32Array.from(attr.array).subarray(0, count * itemSize), offset);
      }
      offset += count * itemSize;
    });
    merged.setAttribute(name, new THREE.BufferAttribute(out, itemSize));
  });
  merged.computeBoundingSphere();
  merged.computeBoundingBox();
  return merged;
}

function batchStaticWorld() {
  const started = performance.now();
  const dynamic = collectDynamicObjects();
  const sharedMaterials = new Map();
  let before = 0;
  let after = 0;

  islands.forEach((island) => {
    const root = island.mesh;
    if (!root) return;
    root.userData.isIslandRoot = true;
    root.updateMatrixWorld(true);
    const toRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const buckets = new Map();
    const victims = [];
    const center = new THREE.Vector3();

    root.traverse((mesh) => {
      if (mesh === root || !isBatchable(mesh, dynamic)) return;
      before += 1;
      // 1. Share identical-looking materials.
      const sig = materialSignature(mesh.material);
      if (!sharedMaterials.has(sig)) sharedMaterials.set(sig, mesh.material);
      const material = sharedMaterials.get(sig);
      // 2. Bucket by material, shadow flags and area cell.
      mesh.getWorldPosition(center);
      const cx = Math.floor(center.x / STATIC_BATCH_CELL);
      const cz = Math.floor(center.z / STATIC_BATCH_CELL);
      const key = `${material.uuid}|${mesh.castShadow ? 1 : 0}${mesh.receiveShadow ? 1 : 0}|${cx},${cz}`;
      if (!buckets.has(key)) buckets.set(key, { material, cast: mesh.castShadow, receive: mesh.receiveShadow, items: [] });
      buckets.get(key).items.push(mesh);
      victims.push(mesh);
    });

    buckets.forEach((bucket) => {
      if (bucket.items.length === 1) {
        // Nothing to merge with; just adopt the shared material.
        bucket.items[0].material = bucket.material;
        victims.splice(victims.indexOf(bucket.items[0]), 1);
        after += 1;
        return;
      }
      const geometries = bucket.items.map((mesh) => {
        const g = mesh.geometry.clone();
        g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(toRoot, mesh.matrixWorld));
        return g;
      });
      const merged = new THREE.Mesh(mergeForBatch(geometries), bucket.material);
      merged.castShadow = bucket.cast;
      merged.receiveShadow = bucket.receive;
      merged.userData.noSurface = true;
      merged.userData.staticBatch = true;
      root.add(merged);
      after += 1;
    });

    victims.forEach((mesh) => mesh.parent && mesh.parent.remove(mesh));
  });

  console.info(`Static batching: ${before} meshes -> ${after} (${sharedMaterials.size} materials) in ${Math.round(performance.now() - started)} ms`);
}

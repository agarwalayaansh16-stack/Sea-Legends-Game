
// ── 28-ground-settling.js ─ Puts every island object properly on the ground after the world is built.
//
// Objects are placed using the ground height at their centre, which leaves the
// downhill side hanging on slopes. This pass, run once at the end of createWorld:
//   - drapes thin, flat ground covers (paths, plots, decks) over the terrain, and
//   - lowers free-standing objects so their lowest corner touches the ground.
// It leaves alone: water surfaces, things over the sea, intentionally raised parts
// (anything clearly above the ground everywhere), and parts that hold up another part
// (arch pillars, well posts), so multi-piece structures stay joined.

const SETTLE_LIFT = 0.08;     // gap left under draped covers to avoid flicker
const SETTLE_SINK = 0.15;     // how far solid objects are pushed into the ground

function settleIslandObjects(island) {
  const group = island.mesh;
  if (!group) return;
  const { radius, index } = island;
  const height = island.surfaceY - 0.16;
  const gx = group.position.x;
  const gz = group.position.z;
  const groundLocal = (lx, lz) => getLocalSurfaceHeightAt(lx, lz, radius, height, index);
  const groundWorld = (wx, wz) => group.position.y + groundLocal(wx - gx, wz - gz);

  group.updateMatrixWorld(true);
  const box = new THREE.Box3();
  const items = [];
  const consider = (obj) => {
    if (obj.userData.isTerrain || obj.userData.noSettle || obj.isInstancedMesh || obj.isSprite || obj.isLight) return;
    box.setFromObject(obj);
    if (!isFinite(box.min.y) || box.max.x - box.min.x > radius) return;
    items.push({ obj, box: box.clone() });
  };
  group.children.slice().forEach(consider);
  scene.children.forEach((obj) => {
    if (!obj.userData.settleOn) return;
    if (Math.hypot(obj.position.x - gx, obj.position.z - gz) > radius) return;
    consider(obj);
  });

  // Ground under a footprint, sampled on a grid.
  const footprint = (b) => {
    const sx = b.max.x - b.min.x;
    const sz = b.max.z - b.min.z;
    const nx = Math.min(8, Math.max(2, Math.ceil(sx / 10)));
    const nz = Math.min(8, Math.max(2, Math.ceil(sz / 10)));
    let min = Infinity;
    let max = -Infinity;
    let atSea = 0;
    let total = 0;
    for (let i = 0; i <= nx; i += 1) {
      for (let j = 0; j <= nz; j += 1) {
        const wx = b.min.x + (sx * i) / nx;
        const wz = b.min.z + (sz * j) / nz;
        const y = groundWorld(wx, wz);
        min = Math.min(min, y);
        max = Math.max(max, y);
        // At or past the coastline the terrain function bottoms out at its edge height.
        const angle = Math.atan2(wz - gz, wx - gx);
        const edge = 0.16 + Math.sin(angle * 6 + index + 9) * 1.5 + Math.cos(angle * 11) * 0.8;
        if (y - group.position.y - edge < 0.05) atSea += 1;
        total += 1;
      }
    }
    return { min, max, seaShare: atSea / total };
  };

  // Does anything rest on top of this item? Then moving it would open a gap.
  const supportsSomething = (item) => items.some((other) => other !== item
    && Math.abs(other.box.min.y - item.box.max.y) < 1.5
    && other.box.min.x < item.box.max.x && other.box.max.x > item.box.min.x
    && other.box.min.z < item.box.max.z && other.box.max.z > item.box.min.z);

  let draped = 0;
  let lowered = 0;
  items.forEach((item) => {
    const { obj, box: b } = item;
    const material = obj.material;
    if (material && (material.transparent || material.opacity < 1)) return; // water stays level
    const ground = footprint(b);
    if (ground.seaShare > 0.25) return; // mostly over the beach or the sea (docks, shore rocks)
    const thickness = b.max.y - b.min.y;
    const span = Math.max(b.max.x - b.min.x, b.max.z - b.min.z);

    if (obj.isMesh && thickness < 1.6 && span > 8) {
      if (ground.max - ground.min > 0.3 || Math.abs(b.min.y - ground.min) > 0.4) {
        if (drapeMeshOnGround(obj, group, groundLocal, b.min.y - group.position.y)) draped += 1;
      }
      return;
    }

    const gap = b.min.y - ground.min;              // how far the downhill side hangs
    const aboveHighest = b.min.y - ground.max;     // > 0 everywhere = deliberately raised
    if (gap > 0.5 && aboveHighest < 3 && !supportsSomething(item)) {
      obj.position.y -= gap + SETTLE_SINK;
      lowered += 1;
    }
  });
  return { draped, lowered };
}

// Rebuilds a flat mesh with enough subdivisions to bend, bakes its transform,
// then lifts every vertex so the underside follows the terrain.
function drapeMeshOnGround(mesh, group, groundLocal, bottomLocalY) {
  const geo = mesh.geometry;
  const p = geo.parameters || {};
  const seg = (size) => Math.min(80, Math.max(1, Math.ceil(size / 6)));
  let next = null;
  switch (geo.type) {
    case "BoxGeometry":
    case "BoxBufferGeometry":
      next = new THREE.BoxGeometry(p.width, p.height, p.depth, seg(p.width), 1, seg(p.depth));
      break;
    case "PlaneGeometry":
    case "PlaneBufferGeometry":
      next = new THREE.PlaneGeometry(p.width, p.height, seg(p.width), seg(p.height));
      break;
    case "CircleGeometry":
    case "CircleBufferGeometry":
      next = new THREE.RingGeometry(0.01, p.radius, Math.max(24, p.segments || 24), seg(p.radius));
      break;
    case "RingGeometry":
    case "RingBufferGeometry":
      next = new THREE.RingGeometry(p.innerRadius, p.outerRadius, Math.max(24, p.thetaSegments || 24), seg(p.outerRadius - p.innerRadius));
      break;
    case "CylinderGeometry":
    case "CylinderBufferGeometry": {
      // A thin disc: replace with a subdivided top surface plus its rim.
      const r = Math.max(p.radiusTop, p.radiusBottom);
      next = new THREE.RingGeometry(0.01, r, Math.max(32, p.radialSegments || 32), seg(r));
      next.rotateX(-Math.PI / 2);
      next.translate(0, p.height / 2, 0);
      break;
    }
    default:
      next = geo.clone();
  }

  mesh.updateMatrix();
  next.applyMatrix4(mesh.matrix); // now in the island group's space
  const pos = next.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, pos.getY(i) - bottomLocalY + groundLocal(x, z) + SETTLE_LIFT);
  }
  pos.needsUpdate = true;
  next.computeVertexNormals();
  next.computeBoundingBox();
  next.computeBoundingSphere();
  if (mesh.geometry !== next) mesh.geometry.dispose?.();
  mesh.geometry = next;
  mesh.userData.groundCover = true; // grass avoids it (see collectGrassCovers)
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  mesh.updateMatrix();
  return true;
}

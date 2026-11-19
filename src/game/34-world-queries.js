// ── 34-world-queries.js ─ Line-of-sight checks against walls and terrain (camera, bullets, aiming).

// Walls registered without a height are treated as this tall for sight lines,
// so a camera looking down over a rooftop isn't counted as blocked.
const SIGHT_WALL_HEIGHT = 34;
const sightContact = { depth: 0, nx: 0, nz: 0 };
const sightProbe = new THREE.Vector3();
const sightCache = { list: [], x: Infinity, z: Infinity, time: -1 };

// Collision volumes near the player, refreshed a few times a second.
function nearbySightVolumes() {
  const now = performance.now();
  const p = playerMesh.position;
  if (now - sightCache.time < 300 && Math.hypot(p.x - sightCache.x, p.z - sightCache.z) < 40) return sightCache.list;
  sightCache.time = now;
  sightCache.x = p.x;
  sightCache.z = p.z;
  const reach = 280;
  sightCache.list = collisionVolumes.filter((v) => {
    const dx = v.center.x - p.x;
    const dz = v.center.z - p.z;
    const r = reach + v.bound;
    return dx * dx + dz * dz < r * r;
  });
  return sightCache.list;
}

// Is this point inside a wall/tree/rock? minSize skips thin obstacles (posts, saplings).
function sightBlockedAt(x, y, z, pad, minSize) {
  const volumes = nearbySightVolumes();
  sightProbe.set(x, y, z);
  for (let i = 0; i < volumes.length; i += 1) {
    const v = volumes[i];
    if (v.bound < minSize) continue;
    const top = v.center.y + (v.height === Infinity ? SIGHT_WALL_HEIGHT : v.height);
    if (y >= top || y < v.center.y - 6) continue;
    if (measureCollision(v, sightProbe, pad, sightContact)) return true;
  }
  return false;
}

// How far (0..1) along from -> to the view stays clear of big obstacles.
function clearSightFraction(from, to, steps = 14) {
  for (let i = 1; i <= steps; i += 1) {
    const f = i / steps;
    if (sightBlockedAt(
      from.x + (to.x - from.x) * f,
      from.y + (to.y - from.y) * f,
      from.z + (to.z - from.z) * f,
      1.2, 5,
    )) return (i - 1) / steps;
  }
  return 1;
}

// First point where a shot from -> to hits a wall, or null if the path is clear.
function firstWallHit(from, to) {
  const length = from.distanceTo(to);
  const steps = Math.max(1, Math.ceil(length / 1.5));
  for (let i = 1; i <= steps; i += 1) {
    const f = i / steps;
    const x = from.x + (to.x - from.x) * f;
    const y = from.y + (to.y - from.y) * f;
    const z = from.z + (to.z - from.z) * f;
    if (sightBlockedAt(x, y, z, 0.3, 0)) {
      const back = Math.max(0, f - 1 / steps);
      return new THREE.Vector3(from.x + (to.x - from.x) * back, from.y + (to.y - from.y) * back, from.z + (to.z - from.z) * back);
    }
  }
  return null;
}

function groundHeightAt(x, z) {
  for (let i = 0; i < islands.length; i += 1) {
    const isl = islands[i];
    const dx = x - isl.position.x;
    const dz = z - isl.position.z;
    if (dx * dx + dz * dz <= isl.radius * isl.radius) {
      return Math.max(OCEAN_SURFACE_Y, getIslandSurfaceHeightAt(x, z, isl));
    }
  }
  return OCEAN_SURFACE_Y;
}

// Where a ray meets the ground or sea, following hills and slopes. Null if it never does.
function raycastTerrain(ray, maxDistance = 700) {
  const step = 4;
  let prev = 0;
  for (let t = step; t <= maxDistance; t += step) {
    const x = ray.origin.x + ray.direction.x * t;
    const y = ray.origin.y + ray.direction.y * t;
    const z = ray.origin.z + ray.direction.z * t;
    if (y <= groundHeightAt(x, z)) {
      // Narrow down between the last clear step and this one.
      let lo = prev;
      let hi = t;
      for (let i = 0; i < 6; i += 1) {
        const mid = (lo + hi) / 2;
        const my = ray.origin.y + ray.direction.y * mid;
        if (my <= groundHeightAt(ray.origin.x + ray.direction.x * mid, ray.origin.z + ray.direction.z * mid)) hi = mid;
        else lo = mid;
      }
      return ray.at(hi, new THREE.Vector3());
    }
    prev = t;
  }
  return null;
}

// Camera pull-in: 1 = full distance, smaller when a wall is between the camera and the player.
let cameraClearFrac = 1;
function updateCameraObstruction(pivot, desired) {
  const clear = Math.max(0.16, clearSightFraction(pivot, desired) - 0.04);
  // Pull in quickly so the wall never covers the player; ease back out slowly.
  cameraClearFrac += (Math.min(1, clear) - cameraClearFrac) * (clear < cameraClearFrac ? 0.5 : 0.06);
  return cameraClearFrac;
}

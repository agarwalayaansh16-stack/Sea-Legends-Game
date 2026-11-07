
// ── 04-scene-sky-ocean.js ─ Three.js scene, renderer, lighting, ocean shader, sky dome, clouds and atmosphere.

const scene = new THREE.Scene();
scene.background = new THREE.Color(WORLD_PALETTE.sky.day.horizon);
scene.fog = new THREE.FogExp2(WORLD_PALETTE.sky.day.horizon, 0.00016);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = WORLD_PALETTE.lighting.exposure;

const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 80000);

const sun = new THREE.DirectionalLight(0xfff8ed, 2.4);
sun.position.set(160, 240, 100);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const shadowDist = 260;
sun.shadow.camera.left = -shadowDist;
sun.shadow.camera.right = shadowDist;
sun.shadow.camera.top = shadowDist;
sun.shadow.camera.bottom = -shadowDist;
sun.shadow.camera.near = 10;
sun.shadow.camera.far = 1400;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.04;
sun.shadow.radius = 2.0;
scene.add(sun);
scene.add(sun.target);

const hemiLight = new THREE.HemisphereLight(0x9fd2f5, 0x3a4a2c, WORLD_PALETTE.lighting.hemisphere);
scene.add(hemiLight);

const ambientLight = new THREE.AmbientLight(0xd0e6f7, WORLD_PALETTE.lighting.ambient);
scene.add(ambientLight);

// High-fidelity procedural wave normal texture
function createRealisticWaterNormalTexture() {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  const heights = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * Math.PI * 2 * 6;
      const v = (y / size) * Math.PI * 2 * 6;
      const h = Math.sin(u) * Math.cos(v) * 0.45 +
                Math.sin(u * 2.1 + 1.2) * Math.cos(v * 2.3 + 0.8) * 0.28 +
                Math.sin(u * 4.4 - v * 3.7) * 0.16 +
                Math.sin(u * 8.5 + v * 7.1) * 0.08 +
                Math.cos(u * 14.2 - v * 11.5) * 0.03;
      heights[y * size + x] = h;
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const xL = heights[y * size + ((x - 1 + size) % size)];
      const xR = heights[y * size + ((x + 1) % size)];
      const yU = heights[((y - 1 + size) % size) * size + x];
      const yD = heights[((y + 1) % size) * size + x];

      const dx = (xR - xL) * 3.2;
      const dy = (yD - yU) * 3.2;
      const dz = 1.0;
      const invLen = 1.0 / Math.hypot(dx, dy, dz);

      data[idx] = Math.floor((-dx * invLen * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((-dy * invLen * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor((dz * invLen * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(140, 140);
  return tex;
}

const waterNormalTexture = createRealisticWaterNormalTexture();

const oceanUniforms = {
  uTime: { value: 0 },
  uSunDir: { value: new THREE.Vector3(0.5, 0.7, 0.3).normalize() },
  uSunColor: { value: new THREE.Color(0xfff8ed) },
  uDeepColor: { value: new THREE.Color(WORLD_PALETTE.sea.deep) }, // tint multipliers: used raw
  uShallowColor: { value: new THREE.Color(WORLD_PALETTE.sea.shallow) },
  uFoamColor: { value: new THREE.Color(WORLD_PALETTE.sea.foam) },
};

const oceanMaterial = new THREE.MeshStandardMaterial({
  color: worldHex(WORLD_PALETTE.sea.base),
  roughness: 0.12,
  metalness: 0.12,
  normalMap: waterNormalTexture,
  normalScale: new THREE.Vector2(0.65, 0.65),
  transparent: true,
  opacity: 0.88,
});

oceanMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = oceanUniforms.uTime;
  shader.uniforms.uSunDir = oceanUniforms.uSunDir;
  shader.uniforms.uSunColor = oceanUniforms.uSunColor;
  shader.uniforms.uDeepColor = oceanUniforms.uDeepColor;
  shader.uniforms.uShallowColor = oceanUniforms.uShallowColor;
  shader.uniforms.uFoamColor = oceanUniforms.uFoamColor;

  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `#include <common>
    uniform float uTime;
    varying vec3 vWorldPosition;
    `
  );

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `#include <begin_vertex>
    float wave1 = sin(transformed.x * 0.018 + uTime * 1.5) * cos(transformed.y * 0.018 + uTime * 1.2) * 0.55;
    float wave2 = sin(transformed.x * 0.045 - uTime * 2.0) * cos(transformed.y * 0.04 + uTime * 1.6) * 0.22;
    transformed.z += wave1 + wave2;
    vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `#include <common>
    uniform float uTime;
    uniform vec3 uSunDir;
    uniform vec3 uSunColor;
    uniform vec3 uDeepColor;
    uniform vec3 uShallowColor;
    uniform vec3 uFoamColor;
    varying vec3 vWorldPosition;
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <normal_fragment_maps>',
    `#ifdef USE_NORMALMAP
      vec2 uvA = vUv * 160.0 + vec2(uTime * 0.012, uTime * 0.009);
      vec2 uvB = vUv * 240.0 + vec2(-uTime * 0.015, uTime * 0.018);
      vec3 mapN1 = texture2D(normalMap, uvA).xyz * 2.0 - 1.0;
      vec3 mapN2 = texture2D(normalMap, uvB).xyz * 2.0 - 1.0;
      vec3 blendedN = normalize(mapN1 + mapN2);
      normal = normalize(vNormal + blendedN * 0.45);
    #endif
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <dithering_fragment>',
    `#include <dithering_fragment>
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(clamp(1.0 - dot(normal, viewDir), 0.0, 1.0), 3.5);
    vec3 halfVec = normalize(uSunDir + viewDir);
    float spec = pow(max(0.0, dot(normal, halfVec)), 128.0) * 1.8;
    float crest = clamp((vWorldPosition.y - (-0.08)) * 1.4, 0.0, 1.0);
    vec3 waterColor = mix(uDeepColor, uShallowColor, fresnel * 0.6 + crest * 0.4);
    waterColor = mix(waterColor, uFoamColor, pow(crest, 4.0) * 0.35);

    gl_FragColor.rgb = mix(gl_FragColor.rgb * waterColor * 1.4, uSunColor, spec);
    `
  );
};

const ocean = new THREE.Mesh(
  new THREE.PlaneGeometry(75000, 75000, 160, 160),
  oceanMaterial,
);
ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -0.08;
ocean.receiveShadow = true;
scene.add(ocean);

// Atmospheric Scattering Sky Dome
function createSkyDome() {
  const geo = new THREE.SphereGeometry(44000, 48, 24);
  const uniforms = {
    uSunPos: { value: new THREE.Vector3(100, 200, 100).normalize() },
    uSkyTop: { value: new THREE.Color(WORLD_PALETTE.sky.day.top) },
    uSkyHorizon: { value: new THREE.Color(WORLD_PALETTE.sky.day.horizon) },
    uSunGlow: { value: new THREE.Color(WORLD_PALETTE.sky.day.glow) },
    uSunIntensity: { value: 1.0 },
    uNightMix: { value: 0.0 },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uSunPos;
      uniform vec3 uSkyTop;
      uniform vec3 uSkyHorizon;
      uniform vec3 uSunGlow;
      uniform float uSunIntensity;
      uniform float uNightMix;
      varying vec3 vWorldPosition;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec3 ray = normalize(vWorldPosition);
        float h = clamp(ray.y * 1.8, 0.0, 1.0);
        vec3 col = mix(uSkyHorizon, uSkyTop, pow(h, 0.65));

        float sunDot = max(0.0, dot(ray, uSunPos));
        float sunGlow = pow(sunDot, 12.0) * 0.65 * uSunIntensity;
        float sunDisk = step(0.9985, sunDot) * 2.2 * uSunIntensity;
        col += uSunGlow * (sunGlow + sunDisk);

        if (uNightMix > 0.01) {
          vec2 starCoord = ray.xz / (abs(ray.y) + 0.15) * 280.0;
          float starVal = hash(floor(starCoord));
          if (starVal > 0.993 && ray.y > 0.05) {
            float twinkle = sin(starCoord.x * 2.0 + starCoord.y * 3.0) * 0.3 + 0.7;
            col += vec3(1.0, 0.98, 0.9) * twinkle * uNightMix * (starVal - 0.993) * 120.0;
          }
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = { isEffect: true };
  scene.add(mesh);
  return { mesh, uniforms };
}

const skyDome = createSkyDome();

// 3D Volumetric Cloud Deck
function createCloudDeck() {
  const group = new THREE.Group();
  group.userData = { isEffect: true };

  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.95,
    metalness: 0.0,
    transparent: true,
    opacity: 0.82,
    flatShading: true,
  });

  const puffGeo = new THREE.DodecahedronGeometry(1, 1);
  const cloudCount = 20;

  for (let c = 0; c < cloudCount; c++) {
    const cluster = new THREE.Group();
    const angle = (c / cloudCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const dist = 1400 + Math.random() * 5200;
    const cy = 340 + Math.random() * 90;
    cluster.position.set(Math.cos(angle) * dist, cy, Math.sin(angle) * dist);

    const puffs = 7 + Math.floor(Math.random() * 6);
    for (let p = 0; p < puffs; p++) {
      const puff = new THREE.Mesh(puffGeo, cloudMat);
      const rad = 55 + Math.random() * 65;
      puff.scale.set(rad, rad * (0.45 + Math.random() * 0.3), rad * (0.8 + Math.random() * 0.4));
      puff.position.set(
        (p - puffs / 2) * 55 + (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 45
      );
      puff.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      cluster.add(puff);
    }
    cluster.userData = { speed: 1.2 + Math.random() * 1.5 };
    group.add(cluster);
  }

  scene.add(group);
  return group;
}

const cloudDeck = createCloudDeck();

// Ambient Sun Motes & Sea Mist Particles
function createAmbientAtmosphere() {
  // Sparse drifting pollen: enough to feel alive without veiling the view.
  const particleCount = 150;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 220;
    positions[i * 3 + 1] = Math.random() * 40 + 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 220;
    phases[i] = Math.random() * Math.PI * 2;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255, 255, 240, 1.0)");
  grad.addColorStop(0.3, "rgba(255, 245, 210, 0.6)");
  grad.addColorStop(1, "rgba(255, 240, 190, 0.0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  const particleTexture = new THREE.CanvasTexture(c);

  const mat = new THREE.PointsMaterial({
    size: 1.1,
    map: particleTexture,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  particles.userData = { isEffect: true, phases };
  scene.add(particles);
  return particles;
}

const ambientAtmosphere = createAmbientAtmosphere();
const animatedFoliage = [];

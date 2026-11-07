
// ── 08-avatar-studio-3d.js ─ 3D avatar studio preview and in-game alert toasts.
// ==========================================
// 3D Avatar Customizer & Studio Renderer
// ==========================================

function initAvatar3DPreview() {
  const container = document.querySelector("#avatar-3d-preview-container");
  if (!container || avatarPreview3D.renderer) return;

  const width = container.clientWidth || 380;
  const height = container.clientHeight || 400;

  // Scene setup
  const scene = new THREE.Scene();
  avatarPreview3D.scene = scene;

  // Camera setup
  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  camera.position.set(0, 7.5, 23); // Centered relative to mesh height
  avatarPreview3D.camera = camera;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  avatarPreview3D.renderer = renderer;

  // Ambient & directional lighting for realistic detail shading
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111620, 0.85);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.75);
  dirLight.position.set(5, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 25;
  dirLight.shadow.camera.left = -6;
  dirLight.shadow.camera.right = 6;
  dirLight.shadow.camera.top = 10;
  dirLight.shadow.camera.bottom = -4;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x90b0d0, 0.35);
  fillLight.position.set(-6, 4, -4);
  scene.add(fillLight);

  // Platform and grid helper
  const platformGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.4, 32);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x11202e,
    roughness: 0.85,
    metalness: 0.1,
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.y = -0.2;
  platform.receiveShadow = true;
  scene.add(platform);

  const gridHelper = new THREE.GridHelper(8, 8, 0xf6b73c, 0x1b3c52);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);

  // click and drag interaction to orbit-rotate
  container.addEventListener("pointerdown", (e) => {
    avatarPreview3D.isDragging = true;
    avatarPreview3D.previousMouseX = e.clientX;
    avatarPreview3D.autoRotate = false;
  });

  window.addEventListener("pointermove", (e) => {
    if (!avatarPreview3D.isDragging) return;
    const deltaX = e.clientX - avatarPreview3D.previousMouseX;
    avatarPreview3D.rotationY += deltaX * 0.007;
    avatarPreview3D.previousMouseX = e.clientX;
    if (avatarPreview3D.characterGroup) {
      avatarPreview3D.characterGroup.rotation.y = avatarPreview3D.rotationY;
    }
  });

  const stopDrag = () => {
    if (avatarPreview3D.isDragging) {
      avatarPreview3D.isDragging = false;
      setTimeout(() => {
        if (!avatarPreview3D.isDragging) {
          avatarPreview3D.autoRotate = true;
        }
      }, 4000);
    }
  };
  window.addEventListener("pointerup", stopDrag);
  window.addEventListener("pointercancel", stopDrag);

  // auto-adjust viewport on container dimensions change
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const w = entry.contentRect.width || 380;
      const h = entry.contentRect.height || 400;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  });
  resizeObserver.observe(container);

  // Render Loop
  function animatePreview() {
    avatarPreview3D.animationFrameId = requestAnimationFrame(animatePreview);

    if (avatarPreview3D.autoRotate && avatarPreview3D.characterGroup) {
      avatarPreview3D.rotationY += 0.005;
      avatarPreview3D.characterGroup.rotation.y = avatarPreview3D.rotationY;
    }

    renderer.render(scene, camera);
  }
  animatePreview();
}

function updateAvatarPreview3D(avatar) {
  if (!avatarPreview3D.scene) {
    initAvatar3DPreview();
  }
  const scene = avatarPreview3D.scene;
  if (!scene) return;

  // Clear previous mesh instances to avoid memory leaks
  if (avatarPreview3D.characterGroup) {
    scene.remove(avatarPreview3D.characterGroup);
    avatarPreview3D.characterGroup.traverse((node) => {
      if (node.isMesh) {
        node.geometry.dispose();
        if (Array.isArray(node.material)) {
          node.material.forEach(m => m.dispose());
        } else {
          node.material.dispose();
        }
      }
    });
  }

  // Build new mesh model on the customizer platform
  const model = createHumanAvatarModel(avatar, { showName: false, showSword: true });
  model.position.y = 0.05;
  model.rotation.y = avatarPreview3D.rotationY;
  
  scene.add(model);
  avatarPreview3D.characterGroup = model;

  // Sync editor labels and stats
  const previewNameText = document.querySelector("#studio-preview-name");
  const traitsLabel = document.querySelector("#studio-preview-traits-label");
  const traitsDetail = document.querySelector("#studio-preview-traits");
  
  if (previewNameText) previewNameText.textContent = avatar.name;
  
  const traits = getAvatarTraits(avatar);
  if (traitsLabel) {
    traitsLabel.textContent = traits.label || "Balanced bulk";
  }
  if (traitsDetail) {
    traitsDetail.innerHTML = formatAvatarTraitsHTML(traits);
  }
}

function formatAvatarTraitsHTML(traits) {
  return `
    <strong>Health Multiplier:</strong> ${(traits.healthMultiplier * 100).toFixed(0)}% | 
    <strong>Damage Multiplier:</strong> ${(traits.damageMultiplier * 100).toFixed(0)}%<br>
    <strong>Speed Multiplier:</strong> ${(traits.speedMultiplier * 100).toFixed(0)}% | 
    <strong>Range Multiplier:</strong> ${(traits.rangeMultiplier * 100).toFixed(0)}%
  `;
}

// ==========================================
// Custom Popup Alerts Notification
// ==========================================

function showMarketplaceAlert(title, message) {
  let alertEl = document.querySelector("#marketplace-alert");
  if (!alertEl) {
    alertEl = document.createElement("div");
    alertEl.id = "marketplace-alert";
    alertEl.style.cssText = `
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      background: rgba(6, 18, 28, 0.95);
      border: 1.5px solid var(--gold);
      border-radius: 12px;
      padding: 12px 20px;
      color: #fff;
      z-index: 100000;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      text-align: center;
      min-width: 250px;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(alertEl);
  }
  
  alertEl.innerHTML = `
    <strong style="display: block; color: var(--gold); font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">${title}</strong>
    <span style="font-size: 12px; color: rgba(255, 247, 230, 0.85);">${message}</span>
  `;
  
  // Slide down & fade in
  alertEl.style.transform = "translateX(-50%) translateY(0)";
  alertEl.style.opacity = "1";
  
  // Slide back up after 3.5 seconds
  setTimeout(() => {
    alertEl.style.transform = "translateX(-50%) translateY(-100px)";
    alertEl.style.opacity = "0";
  }, 3500);
}

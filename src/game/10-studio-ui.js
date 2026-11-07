
// ── 10-studio-ui.js ─ Avatar studio modal bindings.
function initAvatarStudioUI() {
  const dropdown = document.querySelector("#faction-avatar-dropdown");
  if (dropdown) {
    dropdown.addEventListener("change", () => {
      avatarState.selectedId = dropdown.value;
      applyAvatarToPlayer();
      renderAvatarChoices();
    });
  }

  const tabBtnDesigner = document.querySelector("#tab-btn-designer");
  const tabBtnMarketplace = document.querySelector("#tab-btn-marketplace");
  const panelDesigner = document.querySelector("#panel-designer");
  const panelMarketplace = document.querySelector("#panel-marketplace");

  if (tabBtnDesigner && tabBtnMarketplace && panelDesigner && panelMarketplace) {
    tabBtnDesigner.addEventListener("click", () => {
      tabBtnDesigner.classList.add("active");
      tabBtnMarketplace.classList.remove("active");
      panelDesigner.classList.add("active");
      panelMarketplace.classList.remove("active");
      const activeAvatar = getAvatarFromStudioEditor();
      updateAvatarPreview3D(activeAvatar);
    });

    tabBtnMarketplace.addEventListener("click", () => {
      tabBtnMarketplace.classList.add("active");
      tabBtnDesigner.classList.remove("active");
      panelMarketplace.classList.add("active");
      panelDesigner.classList.remove("active");
      renderMarketplace();
    });
  }

  const studioModal = document.querySelector("#avatar-studio-modal");
  const studioCloseBtn = document.querySelector("#avatar-studio-close-btn");
  const factionOpenStudioBtn = document.querySelector("#faction-open-studio-btn");
  const navBtnAvatar = document.querySelector("#nav-btn-avatar");

  function openStudioModal() {
    if (!studioModal) return;
    studioModal.classList.remove("hidden");
    setTimeout(() => {
      studioModal.style.opacity = "1";
      studioModal.style.pointerEvents = "auto";
      const modalContent = studioModal.querySelector(".modal-content");
      if (modalContent) modalContent.style.transform = "scale(1)";
    }, 10);

    const activeAvatar = getSelectedAvatar();
    loadAvatarIntoEditor(activeAvatar);
    updateAvatarPreview3D(activeAvatar);
  }

  function closeStudioModal() {
    if (!studioModal) return;
    studioModal.style.opacity = "0";
    studioModal.style.pointerEvents = "none";
    const modalContent = studioModal.querySelector(".modal-content");
    if (modalContent) modalContent.style.transform = "scale(0.95)";
    setTimeout(() => {
      studioModal.classList.add("hidden");
    }, 300);

    if (avatarPreview3D.animationFrameId) {
      cancelAnimationFrame(avatarPreview3D.animationFrameId);
      avatarPreview3D.animationFrameId = null;
    }
  }

  if (studioCloseBtn) studioCloseBtn.addEventListener("click", closeStudioModal);
  if (factionOpenStudioBtn) factionOpenStudioBtn.addEventListener("click", openStudioModal);
  if (navBtnAvatar) navBtnAvatar.addEventListener("click", openStudioModal);

  const publishBtn = document.querySelector("#studio-publish-btn");
  if (publishBtn) {
    publishBtn.addEventListener("click", publishListing);
  }

  const heightValText = document.querySelector("#studio-val-height");
  const buildValText = document.querySelector("#studio-val-build");

  if (studioHeightScaleInput && heightValText) {
    studioHeightScaleInput.addEventListener("input", () => {
      heightValText.textContent = `${studioHeightScaleInput.value}%`;
    });
  }
  if (studioBuildScaleInput && buildValText) {
    studioBuildScaleInput.addEventListener("input", () => {
      buildValText.textContent = `${studioBuildScaleInput.value}%`;
    });
  }

  // Bind event listeners to studio inputs
  [
    studioAvatarNameInput,
    studioSkinColorInput,
    studioShirtColorInput,
    studioLeftArmColorInput,
    studioRightArmColorInput,
    studioHairColorInput,
    studioEyeColorInput,
    studioLeftLegColorInput,
    studioRightLegColorInput,
    studioPantsColorInput,
    studioBootColorInput,
    studioBeltColorInput,
    studioCapeColorInput,
    studioHairStyleInput,
    studioOutfitStyleInput,
    studioCapeStyleInput,
    studioHeightScaleInput,
    studioBuildScaleInput,
    ...Object.values(STUDIO_EXTRA_FIELDS).map((cfg) => document.querySelector(cfg.id)),
  ].forEach((input) => {
    if (input) {
      input.addEventListener("input", previewStudioAvatarFromForm);
      input.addEventListener("change", previewStudioAvatarFromForm);
    }
  });

  document.querySelectorAll(".studio-slider[data-readout]").forEach((slider) => {
    slider.addEventListener("input", refreshStudioSliderReadouts);
  });

  // Avatar code: copy the current design, or load one someone shared.
  const codeBox = document.querySelector("#studio-avatar-code");
  const codeStatus = document.querySelector("#studio-code-status");
  const setCodeStatus = (text, isError = false) => {
    if (!codeStatus) return;
    codeStatus.textContent = text;
    codeStatus.classList.toggle("error", isError);
  };
  document.querySelector("#studio-export-code")?.addEventListener("click", async () => {
    const code = encodeAvatarCode(getAvatarFromStudioEditor());
    if (codeBox) codeBox.value = code;
    try {
      await navigator.clipboard.writeText(code);
      setCodeStatus("Code copied. Share it, or paste it here later to bring this design back.");
    } catch (error) {
      codeBox?.select();
      setCodeStatus("Code ready below. Press Ctrl+C to copy it.");
    }
  });
  document.querySelector("#studio-import-code")?.addEventListener("click", () => {
    try {
      const imported = decodeAvatarCode(codeBox?.value);
      const current = getAvatarFromStudioEditor();
      loadAvatarIntoEditor({ ...current, ...imported, id: current.id });
      previewStudioAvatarFromForm();
      setCodeStatus("Design imported. Press Save Changes or Create New to keep it.");
    } catch (error) {
      setCodeStatus(error.message, true);
    }
  });

  // Bind click listeners to studio action buttons
  if (studioCreateAvatarButton) {
    studioCreateAvatarButton.addEventListener("click", createStudioCustomAvatar);
  }
  if (studioSaveAvatarButton) {
    studioSaveAvatarButton.addEventListener("click", saveStudioSelectedAvatar);
  }
  if (studioDeleteAvatarButton) {
    studioDeleteAvatarButton.addEventListener("click", deleteStudioSelectedAvatar);
  }
}

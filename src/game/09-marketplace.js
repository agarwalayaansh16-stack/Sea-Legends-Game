
// ── 09-marketplace.js ─ Simulated avatar marketplace.
// ==========================================
// Simulated Trading Marketplace Mechanics
// ==========================================

const npcCreators = [
  "Captain Redbeard",
  "Sea Rogue Marlo",
  "Dread Captain Rourke",
  "Admiral Corin",
  "Tessa the Stylist",
  "Longshot Pell",
  "Solo Blade Kaito",
  "Ember Kick Rhys",
  "Patchwork Pip",
  "Greybeard Jr",
  "Gem Queen Ivy",
  "Flint the Firestarter"
];

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateMockListing(id) {
  const npcName = npcCreators[Math.floor(Math.random() * npcCreators.length)];
  const hairStyles = ["short", "spiky", "cap", "messy"];
  const outfitStyles = ["sailor", "coat", "armor", "adventurer"];
  const capeStyles = ["none", "normal", "long", "torn"];
  
  const skinCol = getRandomColor();
  const shirtCol = getRandomColor();
  const pantsCol = getRandomColor();
  const hairCol = getRandomColor();
  const eyesCol = getRandomColor();
  const bootsCol = getRandomColor();
  
  const hStyle = hairStyles[Math.floor(Math.random() * hairStyles.length)];
  const oStyle = outfitStyles[Math.floor(Math.random() * outfitStyles.length)];
  const cStyle = capeStyles[Math.floor(Math.random() * capeStyles.length)];
  
  const height = Math.floor(Math.random() * 41) + 85; // 85% to 125%
  const build = Math.floor(Math.random() * 51) + 80;   // 80% to 130%
  
  const names = [
    "Dread Admiral", "Abyss Raider", "Jungle Ranger", "Desert Nomad", 
    "Scurvy Mate", "Coral Defender", "Wave Master", "Storm Vanguard", 
    "Shadow Assassin", "Glory Captain", "Red Corsair", "Blue Mariner"
  ];
  const avatarName = names[Math.floor(Math.random() * names.length)];

  return {
    id: id || `npc-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    price: Math.floor(Math.random() * 12) * 100 + 300, // $300 to $1400
    creator: npcName,
    isPlayerListing: false,
    avatar: {
      id: `avatar-template-${Math.floor(Math.random() * 100000)}`,
      name: avatarName,
      skin: skinCol,
      shirt: shirtCol,
      pants: pantsCol,
      hair: hairCol,
      eyes: eyesCol,
      boots: bootsCol,
      hairStyle: hStyle,
      outfit: oStyle,
      height: height,
      build: build,
      
      leftArmColor: getRandomColor(),
      rightArmColor: getRandomColor(),
      leftLegColor: getRandomColor(),
      rightLegColor: getRandomColor(),
      beltColor: getRandomColor(),
      capeColor: getRandomColor(),
      capeStyle: cStyle,
    }
  };
}

function initMarketState() {
  const saveStr = localStorage.getItem("sea_legends_save");
  if (saveStr) {
    try {
      const saveData = JSON.parse(saveStr);
      if (saveData.marketListings) {
        marketState.listings = saveData.marketListings;
        return;
      }
    } catch (e) {
      console.error("Failed to parse market save data", e);
    }
  }
  
  // Pre-populate with 6 mock NPC listings
  marketState.listings = [];
  for (let i = 0; i < 6; i++) {
    marketState.listings.push(generateMockListing(`npc-init-${i}`));
  }
}

function renderMarketplace() {
  const cashDisplay = document.querySelector("#market-player-cash");
  if (cashDisplay) {
    cashDisplay.textContent = `Cash: $${player.money}`;
  }

  const yourListingsContainer = document.querySelector("#market-your-listings");
  const browseListingsContainer = document.querySelector("#market-browse-listings");

  if (!yourListingsContainer || !browseListingsContainer) return;

  yourListingsContainer.innerHTML = "";
  browseListingsContainer.innerHTML = "";

  const playerListings = marketState.listings.filter(l => l.isPlayerListing);
  const npcListings = marketState.listings.filter(l => !l.isPlayerListing);

  if (playerListings.length === 0) {
    yourListingsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.3); font-size: 12px; padding: 15px; background: rgba(255,255,255,0.01); border-radius: 10px; border: 1px dashed rgba(255,255,255,0.05);">You have no designs published for sale. Customize an avatar and set a price to publish!</div>`;
  } else {
    playerListings.forEach(l => {
      yourListingsContainer.appendChild(createMarketCard(l));
    });
  }

  if (npcListings.length === 0) {
    browseListingsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.3); font-size: 12px; padding: 15px; background: rgba(255,255,255,0.01); border-radius: 10px; border: 1px dashed rgba(255,255,255,0.05);">No listings currently available. Check back later!</div>`;
  } else {
    npcListings.forEach(l => {
      browseListingsContainer.appendChild(createMarketCard(l));
    });
  }
}

function createMarketCard(listing) {
  const card = document.createElement("div");
  card.className = "market-card";
  
  const colorDots = `
    <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px;">
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.skin};" title="Skin"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.torsoColor || listing.avatar.shirt};" title="Torso"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.leftArmColor || listing.avatar.shirt};" title="Left Arm"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.rightArmColor || listing.avatar.shirt};" title="Right Arm"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.leftLegColor || listing.avatar.pants};" title="Left Leg"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.rightLegColor || listing.avatar.pants};" title="Right Leg"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.hair};" title="Hair"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.eyes};" title="Eyes"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.boots || listing.avatar.bootsColor || '#23170f'};" title="Boots"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.beltColor || listing.avatar.boots || '#23170f'};" title="Belt"></span>
      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: ${listing.avatar.capeColor || listing.avatar.shirt || '#a82020'};" title="Cape"></span>
    </div>
  `;

  const detailsText = `
    <div style="font-size: 11px; color: rgba(255,255,255,0.5); line-height: 1.3;">
      Style: <strong>${listing.avatar.outfit}</strong> / ${listing.avatar.hairStyle}<br>
      Height: ${listing.avatar.height || 100}% | Build: ${listing.avatar.build || 100}%
    </div>
  `;

  card.innerHTML = `
    <div class="market-card-preview">
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
        <span style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">👕</span>
        <span style="font-size: 11px; font-weight: bold; background: rgba(0,0,0,0.4); color: #fff; padding: 2px 8px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">${listing.avatar.name}</span>
      </div>
    </div>
    <div class="market-card-details">
      <h5 class="market-card-name">${listing.avatar.name}</h5>
      <span class="market-card-creator">Creator: ${listing.creator}</span>
      ${colorDots}
      ${detailsText}
    </div>
    <div class="market-card-footer">
      <span class="market-card-price">$${listing.price}</span>
      ${listing.isPlayerListing 
        ? `<button class="market-card-btn danger" onclick="cancelListing('${listing.id}')">Cancel</button>` 
        : `<button class="market-card-btn" onclick="buyListing('${listing.id}')">Buy Template</button>`
      }
    </div>
  `;
  
  return card;
}

window.cancelListing = function(listingId) {
  const listing = marketState.listings.find(l => l.id === listingId);
  if (!listing) return;
  
  marketState.listings = marketState.listings.filter(l => l.id !== listingId);
  log(`Cancelled sale listing for design '${listing.avatar.name}'.`);
  
  saveGame();
  renderMarketplace();
};

window.buyListing = function(listingId) {
  const listing = marketState.listings.find(l => l.id === listingId);
  if (!listing) return;

  if (player.money < listing.price) {
    log(`❌ Insufficient funds! You need $${listing.price} to buy this template.`);
    showMarketplaceAlert("❌ Insufficient Funds", `You need $${listing.price} to purchase this design.`);
    return;
  }

  player.money -= listing.price;
  
  const newAvatar = {
    ...listing.avatar,
    id: `custom-bought-${Date.now()}`
  };
  avatarState.avatars.push(newAvatar);
  avatarState.selectedId = newAvatar.id;
  
  marketState.listings = marketState.listings.filter(l => l.id !== listingId);
  
  log(`🛒 Purchased template '${listing.avatar.name}' for $${listing.price}! Added to templates.`);
  showMarketplaceAlert("🎉 Design Purchased", `You successfully bought "${listing.avatar.name}" design!`);
  
  applyAvatarToPlayer();
  renderAvatarChoices();
  loadAvatarIntoEditor(newAvatar);
  updateAvatarPreview3D(newAvatar);
  
  saveGame();
  renderMarketplace();
};

function publishListing() {
  const priceInput = document.querySelector("#studio-sell-price");
  if (!priceInput) return;
  const price = Math.round(Number(priceInput.value));
  if (isNaN(price) || price < 50) {
    log("❌ Invalid price! Sale price must be at least $50.");
    showMarketplaceAlert("❌ Invalid Price", "Please enter a price of $50 or more.");
    return;
  }

  const currentAvatar = getAvatarFromStudioEditor();
  
  const newListing = {
    id: `player-list-${Date.now()}`,
    price: price,
    creator: "You",
    isPlayerListing: true,
    avatar: { ...currentAvatar, id: `avatar-copy-${Date.now()}` }
  };

  marketState.listings.push(newListing);
  log(`🛒 Published design "${currentAvatar.name}" for sale at $${price}!`);
  showMarketplaceAlert("✨ Design Published", `"${currentAvatar.name}" is now listed in the shop for $${price}!`);

  saveGame();
  renderMarketplace();
}

function runMarketplaceNPCSimulation() {
  const playerListings = marketState.listings.filter(l => l.isPlayerListing);
  if (playerListings.length === 0) return;

  const targetListing = playerListings[Math.floor(Math.random() * playerListings.length)];
  const price = targetListing.price;
  let chance = 0.05;
  
  if (price <= 200) chance = 0.35;
  else if (price <= 500) chance = 0.22;
  else if (price <= 1500) chance = 0.12;
  else if (price <= 5000) chance = 0.05;
  else if (price <= 20000) chance = 0.02;
  else chance = 0.005;

  if (Math.random() < chance) {
    const buyerName = npcCreators[Math.floor(Math.random() * npcCreators.length)];
    marketState.listings = marketState.listings.filter(l => l.id !== targetListing.id);
    player.money += targetListing.price;
    
    log(`✨ [Marketplace] NPC ${buyerName} bought your design "${targetListing.avatar.name}" for $${targetListing.price}!`);
    showMarketplaceAlert("💰 Item Sold!", `${buyerName} bought your design "${targetListing.avatar.name}" for $${targetListing.price}!`);
    audio.playQuestComplete();
    
    saveGame();
    renderMarketplace();
  }
}

function runMarketplaceNPCListingSimulation() {
  const npcListings = marketState.listings.filter(l => !l.isPlayerListing);
  
  if (npcListings.length < 8 && Math.random() < 0.35) {
    const newListing = generateMockListing();
    marketState.listings.push(newListing);
    log(`[Marketplace] A new design template by ${newListing.creator} has been listed!`);
    renderMarketplace();
    saveGame();
  }
}

// Set up periodic simulation cycles
setInterval(runMarketplaceNPCSimulation, 25000);
setInterval(runMarketplaceNPCListingSimulation, 45000);

import Script from "next/script";

export default function Home() {
  return (
    <>
      <main id="game-root" className="min-h-screen">
        <canvas id="game" />

        <section id="faction-screen" className="overlay">
          <div className="panel hero-panel">
            <p className="eyebrow">Sea Legends</p>
            <h1>Choose Your Path</h1>
            <p className="intro">
              Sail the seas, clear islands, master weapons, and uncover a special ability questline.
            </p>

            <div className="avatar-studio">
              <div className="avatar-header">
                <div>
                  <strong>Avatar Studio</strong>
                  <span>Choose, preview, edit, create, or delete your human avatar.</span>
                </div>
                <button id="preview-avatar" type="button">Preview Avatar</button>
              </div>

              <div className="avatar-layout">
                <div>
                  <p className="section-label">Saved Avatars</p>
                  <div id="avatar-list" className="avatar-list" />
                </div>

                <div className="avatar-preview-card">
                  <div id="avatar-preview" className="avatar-preview">
                    <span className="preview-hair" />
                    <span className="preview-head">
                      <i className="preview-eye left" />
                      <i className="preview-eye right" />
                    </span>
                    <span className="preview-neck" />
                    <span className="preview-body" />
                    <span className="preview-arm left" />
                    <span className="preview-arm right" />
                    <span className="preview-belt" />
                    <span className="preview-leg left" />
                    <span className="preview-leg right" />
                  </div>
                  <strong id="preview-name">Wave Runner</strong>
                  <small>Live preview</small>
                  <p id="avatar-traits" className="avatar-traits">Balanced bulk.</p>
                </div>

                <div className="avatar-editor">
                  <p className="section-label">Customize</p>
                  <input id="avatar-name" maxLength="18" placeholder="Avatar name" defaultValue="Rookie" />
                  <div className="editor-grid">
                    <label>Skin <input id="skin-color" type="color" defaultValue="#c98b62" /></label>
                    <label>Shirt <input id="shirt-color" type="color" defaultValue="#1b85aa" /></label>
                    <label>Pants <input id="pants-color" type="color" defaultValue="#26364f" /></label>
                    <label>Hair <input id="hair-color" type="color" defaultValue="#2a1710" /></label>
                    <label>Eyes <input id="eye-color" type="color" defaultValue="#101820" /></label>
                    <label>Boots <input id="boot-color" type="color" defaultValue="#23170f" /></label>
                    <label>
                      Hair Style
                      <select id="hair-style" defaultValue="short">
                        <option value="short">Short</option>
                        <option value="spiky">Spiky</option>
                        <option value="cap">Captain Cap</option>
                      </select>
                    </label>
                    <label>
                      Outfit
                      <select id="outfit-style" defaultValue="sailor">
                        <option value="sailor">Sailor</option>
                        <option value="coat">Long Coat</option>
                        <option value="armor">Light Armor</option>
                      </select>
                    </label>
                    <label>Height <input id="height-scale" type="range" min="85" max="125" defaultValue="100" /></label>
                    <label>Bulk <input id="build-scale" type="range" min="80" max="130" defaultValue="100" /></label>
                  </div>
                  <div className="avatar-actions">
                    <button id="save-avatar" type="button">Save Changes</button>
                    <button id="create-avatar" type="button">Create New</button>
                    <button id="delete-avatar" className="danger-button" type="button">Delete Selected</button>
                  </div>
                </div>
              </div>
            </div>

            <p className="section-label path-label">Choose Your Side</p>
            <div className="faction-grid">
              <button className="faction-card pirate" data-faction="Pirates" type="button">
                <span>Pirates</span>
                <small>Earn extra money from quests.</small>
              </button>
              <button className="faction-card marine" data-faction="Marines" type="button">
                <span>Marines</span>
                <small>Gain bonus defense from training.</small>
              </button>
              <button className="faction-card neutral" data-faction="Neutral" type="button">
                <span>Neutral</span>
                <small>No allegiance. Balanced progression.</small>
              </button>
            </div>
          </div>
        </section>

        <section id="hud" className="hud hidden">
          <div className="top-row">
            <div className="stat-block">
              <strong id="player-title">Neutral Rookie</strong>
              <span id="level-readout">Level 1</span>
            </div>
            <div className="bars">
              <label>Health <span id="health-readout" /></label>
              <div className="bar"><span id="health-bar" /></div>
              <label>XP <span id="xp-readout" /></label>
              <div className="bar xp"><span id="xp-bar" /></div>
            </div>
            <div className="wallet">
              <span id="money-readout">$0</span>
              <span id="sea-readout">First Sea</span>
            </div>
          </div>

          <div id="settings-bar" className="settings-bar">
            <div className="settings-section settings-bar-left">
              <button id="settings-collapse-button" className="settings-collapse-button" type="button" aria-expanded="true">
                <span className="settings-gear" aria-hidden="true">⚙</span>
                <strong>Game Settings</strong>
                <span className="collapse-chevron" aria-hidden="true">v</span>
              </button>
              <button id="home-teleport-button" type="button">
                <span className="home-icon" aria-hidden="true">⌂</span>
                <span className="home-label">Home</span>
              </button>
            </div>
            <div className="settings-section settings-bar-right">
              <span id="teleport-status">Teleport ready</span>
              <label className="toggle">
                <input id="shiftlock-toggle" type="checkbox" defaultChecked />
                <span>Shiftlock enabled</span>
              </label>
            </div>
          </div>

          <div className="quest-card">
            <strong id="quest-title">Find the Quest Giver</strong>
            <p id="quest-detail">Walk to the gold marker on Starter Island and press E.</p>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <strong>Stats</strong>
              <span id="points-readout">0 points</span>
            </div>
            <div id="stats-list" />
          </div>

          <button id="inventory-button" className="inventory-button" type="button">Inventory</button>

          <div id="inventory-panel" className="inventory-panel hidden">
            <div className="inventory-header">
              <strong>Inventory</strong>
              <button id="inventory-close" type="button">Close</button>
            </div>
            <div id="inventory-tabs" className="inventory-tabs">
              <button className="active" data-inventory-tab="melee" type="button">Melee</button>
              <button data-inventory-tab="swords" type="button">Swords</button>
              <button data-inventory-tab="guns" type="button">Guns</button>
              <button data-inventory-tab="special" type="button">Special</button>
            </div>
            <div id="inventory-list" className="inventory-list" />
          </div>

          <div id="prompt" className="prompt hidden" />
          <div id="message-log" className="message-log" />

          <div id="boat-menu" className="boat-menu hidden">
            <strong>Boat Dock</strong>
            <p>Choose a vessel to summon:</p>
            <div className="boat-options">
              <button className="boat-option" data-boat="dinghy" type="button">Dinghy</button>
              <button className="boat-option" data-boat="sailor" type="button">Sailor Boat</button>
              <button className="boat-option" data-boat="brigade" type="button">Brigade</button>
            </div>
            <button id="boat-menu-close" type="button">Cancel</button>
          </div>

          <div className="controls">
            <strong>Controls</strong>
            <span>WASD move</span>
            <span>Right mouse drag rotate</span>
            <span>Left click attack</span>
            <span>Space jump</span>
            <span>1 melee</span>
            <span>2 sword</span>
            <span>3 gun</span>
            <span>4 special</span>
            <span>E interact</span>
          </div>
        </section>
      </main>

      <Script src="/game.js" strategy="afterInteractive" />
    </>
  );
}

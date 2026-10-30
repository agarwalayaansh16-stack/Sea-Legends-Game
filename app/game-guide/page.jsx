import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Game Guide and Controls",
  description: "A practical guide to Sea Legends controls, factions, quests, combat, travel, progression, and local saves.",
  alternates: { canonical: `${siteUrl}/game-guide` },
  openGraph: { title: "Sea Legends Game Guide", description: "Learn the controls, first quest, combat, and progression in the Sea Legends prototype.", url: `${siteUrl}/game-guide` },
};

export default function GuidePage() {
  return <ContentLayout eyebrow="PLAYER GUIDE">
    <h1>Sea Legends game guide</h1>
    <p className="content-lead">This guide covers the currently implemented browser prototype. Content and balance can change as the game develops.</p>

    <h2>Getting started</h2>
    <ol>
      <li>Choose or create a local profile. This only selects a save in this browser; it is not online authentication.</li>
      <li>Choose an avatar, adjust its appearance, and select Pirates, Marines, or Neutral.</li>
      <li>Enter the First Sea on Starter Island and follow the quest marker to the quest giver.</li>
    </ol>

    <h2>Factions and avatar creation</h2>
    <p>Pirates receive extra money from quests. Marines start with one additional defense point. Neutral has no faction bonus shown in the current start logic. The avatar editor lets you create and edit human avatars, including colors, hair, outfit, height, and build. Height, build, and outfit feed into derived character attributes; the editor preview is visual and does not guarantee a particular combat outcome.</p>

    <h2>Controls</h2>
    <div className="content-table-wrap"><table><thead><tr><th scope="col">Input</th><th scope="col">Action</th></tr></thead><tbody>
      <tr><td>W, A, S, D</td><td>Move; steer while helming a boat</td></tr>
      <tr><td>Right mouse drag</td><td>Rotate the camera</td></tr>
      <tr><td>Left click</td><td>Attack with the selected weapon</td></tr>
      <tr><td>Space</td><td>Jump</td></tr>
      <tr><td>E</td><td>Interact with a nearby person or object</td></tr>
      <tr><td>1 / 2 / 3 / 4</td><td>Select melee / sword / gun / unlocked special weapon</td></tr>
      <tr><td>Shift</td><td>Switch to sprint; release to return to walk</td></tr>
      <tr><td>F</td><td>Block</td></tr>
      <tr><td>Q</td><td>Dash</td></tr>
      <tr><td>R</td><td>Attack</td></tr>
      <tr><td>G</td><td>Board or leave a boat when close to it</td></tr>
      <tr><td>Esc</td><td>Open or close the pause/settings menu</td></tr>
    </tbody></table></div>
    <p>On touch screens, use the on-screen pad for movement, attack, jump, interaction, and weapon selection; drag across the scene to rotate the view. Some later skills use Z, X, C, V, or B after unlocking and still require a keyboard.</p>

    <h2>Exploration and travel</h2>
    <p>The First Sea contains a chain of islands with different terrain and enemy groups. Use the quest compass and marker to orient yourself. At a dock, interact with the Boat Dealer, choose a dinghy, sailor boat, or brigade, then approach it and press G to helm it. Use W, A, S, and D to steer; press G again to disembark near the boat. Travel, water, and collision behavior are prototype systems and may be imperfect.</p>

    <h2>Combat and enemies</h2>
    <p>Select melee, sword, or gun with 1, 2, or 3, then attack with a left click or R. Movement modes, blocking, dashing, and jumping are also available. Enemies can detect and pursue the player, attack at close range, and respawn after defeat. Keep moving and watch the health display. The special weapon becomes available after the starter quest; further skills have their own unlock and cooldown requirements.</p>

    <h2>Quests and progression</h2>
    <p>On Starter Island, press E near the quest giver and accept <strong>Bandit Trouble</strong>. Defeat five starter bandits, then return to the quest giver to claim 180 money and 120 XP. Other quest entries unlock at specified levels and ask for enemies or bosses in later areas; the game currently includes a limited set of these encounters. XP raises your level and grants stat points. The stats are melee, defense, sword, gun, and special abilities. Certain abilities and items have additional unlock requirements.</p>

    <h2>Inventory and marketplace</h2>
    <p>Open Inventory from the in-game menu to review weapon categories, items, and mastery. The avatar marketplace interface is local prototype data: its sample NPC listings are generated in the browser and do not represent a shared online market or real transactions.</p>

    <h2>Multiplayer world servers</h2>
    <p>If multiplayer is enabled for the site, entering the game connects you to an available First Sea server. Use <strong>Servers</strong> in the in-game settings bar to see room occupancy or join another server. Each room holds at most ten players. Players in the same room can see each other's avatars and movement. Enemies, combat, quest progress, currency, inventory, and saves are still independent in each browser. If multiplayer is not configured or the service is offline, the game remains playable in local mode.</p>

    <h2>Saves and profiles</h2>
    <p>Profile names, avatar selections, and game progress are kept in this browser’s local storage. They do not sync to a server and cannot be recovered through email. Use the same browser profile to continue. Clearing site data or using a different browser or device can remove or hide progress. Do not enter real passwords or sensitive personal information.</p>

    <h2>Troubleshooting</h2>
    <ul>
      <li><strong>Game does not start:</strong> allow the Three.js CDN request and check that the browser supports WebGL, then reload.</li>
      <li><strong>Progress is missing:</strong> confirm you are using the same browser profile and local profile name; private browsing and cleared site data can remove local saves.</li>
      <li><strong>Controls do not respond:</strong> click the game area, close any open menu, and check that a text field is not focused. Keyboard and mouse are the supported primary controls.</li>
      <li><strong>Slow or unstable rendering:</strong> close other graphics-heavy tabs and lower the graphics quality in the in-game settings.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Play Sea Legends</a></p>
  </ContentLayout>;
}

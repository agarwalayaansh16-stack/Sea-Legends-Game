import ContentLayout from "../content-layout";
import Localized from "./localized";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Game Guide and Controls",
  description: "A practical guide to Sea Legends controls, factions, quests, combat, travel, progression, and local saves.",
  alternates: { canonical: `${siteUrl}/game-guide` },
  openGraph: { title: "Sea Legends Game Guide", description: "Learn the controls, first quest, combat, and progression in Sea Legends.", url: `${siteUrl}/game-guide` },
};

export default function GuidePage() {
  return <Localized><ContentLayout eyebrow="PLAYER GUIDE">
    <h1>Sea Legends game guide</h1>
    <p className="content-lead">Everything you need to get started in Sea Legends: controls, factions, your first quest, combat, travel, and saving. Content and balance are updated as the game develops.</p>

    <h2>Getting started</h2>
    <ol>
      <li>Choose or create a local profile. This only selects a save in this browser; it is not online authentication.</li>
      <li>Choose an avatar, adjust its appearance, and select Pirates, Marines, or Neutral.</li>
      <li>Enter the First Sea on Starter Island and follow the quest marker to the quest giver.</li>
    </ol>
    <p>New characters get a short <strong>Getting Started</strong> card that walks through moving, looking around, jumping, attacking and finding the first quest. Each step ticks off when you do it, and you can skip it at any time.</p>

    <h2>Factions and avatar creation</h2>
    <p>Pirates receive extra money from quests. Marines start with one additional defense point. Neutral has no faction bonus shown in the current start logic. The avatar editor lets you create and edit human avatars, including colors, hair, outfit, height, and build. Height, build, and outfit feed into derived character attributes; the editor preview is visual and does not guarantee a particular combat outcome.</p>

    <h2>Controls</h2>
    <div className="content-table-wrap"><table><thead><tr><th scope="col">Input</th><th scope="col">Action</th></tr></thead><tbody>
      <tr><td>W, A, S, D</td><td>Move; steer while helming a boat</td></tr>
      <tr><td>Right mouse drag</td><td>Rotate the camera</td></tr>
      <tr><td>Left click</td><td>Attack with the selected weapon (hold to keep attacking). With the gun, the shot goes exactly where you click.</td></tr>
      <tr><td>Space</td><td>Jump</td></tr>
      <tr><td>E</td><td>Interact with a nearby person or object</td></tr>
      <tr><td>1 / 2 / 3 / 4</td><td>Select melee / sword / gun / unlocked special weapon</td></tr>
      <tr><td>Shift</td><td>Switch to sprint; release to return to walk</td></tr>
      <tr><td>F</td><td>Block</td></tr>
      <tr><td>Q</td><td>Dash</td></tr>
      <tr><td>Z / X / C / V</td><td>Active skills, once unlocked</td></tr>
      <tr><td>H / K / T</td><td>Iron Aura / Foresight / Flash Step, once trained</td></tr>
      <tr><td>R</td><td>Attack</td></tr>
      <tr><td>G</td><td>Board or leave a boat when close to it</td></tr>
      <tr><td>M</td><td>Open the world map and quest log</td></tr>
      <tr><td>Esc</td><td>Open or close the pause/settings menu</td></tr>
    </tbody></table></div>
    <p>On touch screens, use the on-screen pad for movement, attack, jump, interaction, and weapon selection; drag across the scene to rotate the view. Unlocked skills, dash, block and trained abilities get their own buttons above the attack button, and the Map button opens the world map. With the gun on a touch screen, tap where you want to shoot, or press Attack to aim at the nearest enemy in view.</p>

    <h2>Exploration and travel</h2>
    <p>The First Sea contains a chain of islands with different terrain and enemy groups. Use the quest compass and marker to orient yourself; the <a href="/guides/islands">island guide</a> describes each island. At the dock, talk to the Boat Dealer and choose a dinghy, sailor boat, or brigade. It launches at the nearest open water and you take the helm straight away. W and S sail forward and back, A and D steer, and G takes you ashore. When you are near your boat again, press G or the Board button to climb back aboard. Press M, or the Map button in the top bar, for a world map that shows the islands, your boat and your quest target, next to a quest log of current, available and upcoming quests.</p>

    <h2>Sea combat</h2>
    <p>Raider ships patrol the waters around every island. While you are at the helm, click to fire your cannons at the spot you click or at the nearest raider (on touch screens, press Attack). A dinghy fires one ball per volley, a sailor boat two and a brigade three. Raiders circle you and fire back, so keep moving. Sinking one pays money and XP; raiders near harder islands are tougher and pay more, and sunk raiders return after a while.</p>

    <h2>Combat and enemies</h2>
    <p>Select melee, sword, or gun with 1, 2, or 3, then attack with a left click or R. Clicking again quickly chains attacks into a combo: jab, cross, hook and uppercut with fists, or three sword slashes. The gun fires at the spot under your cursor and scores a 1.5× headshot when you click an enemy's head; bullets stop at walls, trees and rocks.</p>
    <p>Enemies chase you when you come close. Before an ordinary strike, an enemy winds up and a <strong>red flash</strong> appears above it. Step out of reach, dash, or block during that moment and the strike misses. Your hits make enemies flinch and stagger back. Defeated enemies fall and return after a few seconds, and bosses after 45 seconds. The special weapon becomes available after the starter quest; further skills have their own unlock and cooldown requirements. For details, see the <a href="/guides/weapons-and-skills">weapons and skills guide</a> and the <a href="/guides/enemies-and-bosses">enemy and boss guide</a>.</p>

    <h2>Quests and progression</h2>
    <p>On Starter Island, press E near the quest giver and accept <strong>Bandit Trouble</strong>. Defeat five starter bandits, then return to the quest giver to claim 180 money and 120 XP. Other quest entries unlock at specified levels and ask for enemies or bosses in later areas; the game currently includes a limited set of these encounters. XP raises your level and grants stat points. The stats are melee, defense, sword, gun, and special abilities. Certain abilities and items have additional unlock requirements.</p>

    <h2>Inventory and marketplace</h2>
    <p>Open Inventory from the in-game menu to review weapon categories, items, and mastery. The avatar marketplace shows outfits listed by in-game characters. Listings are generated in your browser; there is no real-money trading.</p>

    <h2>Multiplayer world servers</h2>
    <p>If multiplayer is enabled for the site, entering the game connects you to an available First Sea server. Use <strong>Servers</strong> in the in-game settings bar to see room occupancy or join another server. Each room holds at most ten players. Players in the same room can see each other's avatars and movement. Enemies, combat, quest progress, currency, inventory, and saves are still independent in each browser. If multiplayer is not configured or the service is offline, the game remains playable in local mode.</p>

    <h2>Saves and profiles</h2>
    <p>Profile names, avatar selections, and game progress are kept in this browser’s local storage. They do not sync to a server and cannot be recovered through email. Use the same browser profile to continue. Clearing site data or using a different browser or device can remove or hide progress. Do not enter real passwords or sensitive personal information. To keep your progress safe or move it to another browser or device, open the Esc menu, choose <strong>Download backup</strong>, then use <strong>Load backup</strong> on the other device.</p>

    <h2>Language, music and settings</h2>
    <p>The game can be played in English, Hindi, Spanish, French or Portuguese. Choose a language on the loading screen, with the language menu in the top bar, or at the bottom of these pages; your choice is remembered in this browser and applies to the game and the site. The top bar also has switches for background music, the controls panel and the quest panel, and the Esc menu holds graphics quality, which lowers itself if the game runs slowly unless you turn that off, plus separate volume, music and sound effect levels. These settings are remembered in this browser.</p>

    <h2>Troubleshooting</h2>
    <ul>
      <li><strong>Game does not start:</strong> allow the Three.js CDN request and check that the browser supports WebGL, then reload.</li>
      <li><strong>Progress is missing:</strong> confirm you are using the same browser profile and local profile name; private browsing and cleared site data can remove local saves.</li>
      <li><strong>Controls do not respond:</strong> click the game area, close any open menu, and check that a text field is not focused. Keyboard and mouse are the supported primary controls.</li>
      <li><strong>Slow or unstable rendering:</strong> close other graphics-heavy tabs and lower the graphics quality in the in-game settings.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Play Sea Legends</a></p>
  </ContentLayout></Localized>;
}

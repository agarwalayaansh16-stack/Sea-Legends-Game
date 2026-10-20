import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Game Guide and Controls",
  description: "Controls, beginner combat advice, the Starter Island quest, character progression, and troubleshooting for Sea Legends.",
  alternates: { canonical: `${siteUrl}/game-guide` },
  openGraph: { title: "Sea Legends Game Guide", description: "Learn the controls and first steps in the Sea Legends prototype.", url: `${siteUrl}/game-guide` },
};

export default function GuidePage() { return <ContentLayout eyebrow="PLAYER GUIDE">
  <h1>Sea Legends game guide</h1>
  <p className="content-lead">A quick reference for the current prototype. Some systems are still being built, so controls and balance may change.</p>
  <h2>Controls</h2><div className="content-table-wrap"><table><thead><tr><th>Input</th><th>Action</th></tr></thead><tbody>
    <tr><td>W, A, S, D</td><td>Move</td></tr><tr><td>Right mouse drag</td><td>Rotate the camera</td></tr><tr><td>Left mouse click</td><td>Attack with the selected action</td></tr><tr><td>Space</td><td>Jump</td></tr><tr><td>E</td><td>Interact with the quest giver when nearby</td></tr><tr><td>1, 2, 3</td><td>Select melee, sword, or gun</td></tr><tr><td>4</td><td>Use the special ability after it is unlocked</td></tr>
  </tbody></table></div>
  <h2>Your first quest</h2><ol><li>Choose a faction and avatar to enter the world.</li><li>On Starter Island, follow the gold quest marker to the quest giver.</li><li>Press E nearby and accept the available task.</li><li>Defeat five bandits. Keep moving, watch your health, and use the weapon that suits your character.</li><li>Return to the quest giver to complete the task and collect its money and XP rewards.</li></ol>
  <h2>Combat and progression</h2><p>Use 1 for melee, 2 for sword, and 3 for gun. The special slot on 4 is locked until the starter quest is complete. Experience raises your level and grants stat points. The five stats are melee, defense, sword, gun, and special; spend points to develop the style you use most. Avatar build and outfit also affect derived character attributes.</p>
  <h2>Saving and troubleshooting</h2><p>The prototype saves game and profile information in this browser’s local storage. Use the same browser profile and device to continue. Clearing browser data, using a private window, or switching devices can make local saves unavailable. If the scene is blank, make sure WebGL is enabled and reload with a current browser. Three.js is loaded from a CDN, so the game needs an internet connection to start.</p>
  <p><a className="content-button" href="/">Play Sea Legends</a></p>
</ContentLayout>; }

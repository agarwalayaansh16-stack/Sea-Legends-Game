import ContentLayout from "../../content-layout";
import { siteUrl } from "../../site-config";

export const metadata = {
  title: "Weapons and Skills Guide",
  description: "Every weapon style in Sea Legends: fists, sword, gun and special abilities, with how to unlock them, their combos, mastery bonuses and active skills.",
  alternates: { canonical: `${siteUrl}/guides/weapons-and-skills` },
  openGraph: { title: "Sea Legends Weapons and Skills", description: "Weapons, mastery bonuses and skills in Sea Legends.", url: `${siteUrl}/guides/weapons-and-skills` },
};

export default function WeaponsGuidePage() {
  return <ContentLayout eyebrow="COMBAT GUIDE">
    <h1>Weapons and skills</h1>
    <p className="content-lead">Sea Legends has four fighting styles: fists, sword, gun and special abilities. Each one levels up separately through <strong>mastery</strong>, which you earn by landing hits with that style. Higher mastery unlocks passive bonuses and active skills.</p>

    <h2>Switching weapons</h2>
    <p>Press <kbd>1</kbd> for fists, <kbd>2</kbd> for the sword, <kbd>3</kbd> for the gun and <kbd>4</kbd> for your special ability, once you own each one. Your character draws the new weapon with a short animation. Attack with <kbd>Left Click</kbd> or <kbd>R</kbd>, and hold the button to keep attacking. Active skills use <kbd>Z</kbd>, <kbd>X</kbd>, <kbd>C</kbd> and <kbd>V</kbd>, and the skill panel on the right of the screen shows which ones you have unlocked and their cooldowns.</p>

    <h2>Fists (melee)</h2>
    <p><strong>How to get it:</strong> available from the start.</p>
    <p>Repeated attacks chain into a four-hit combo: jab, cross, hook and uppercut. Keep clicking within a moment of the last punch to continue the combo; pausing restarts it. Fists are also the best way to break the ice shells of frozen bandits in Snowy Village.</p>
    <div className="content-table-wrap"><table><thead><tr><th scope="col">Mastery</th><th scope="col">Unlock</th></tr></thead><tbody>
      <tr><td>5</td><td><strong>Meteor Fist</strong> (<kbd>Z</kbd>, 4s cooldown): a charged punch that travels 24 units in the direction you face. Basic punches also gain a 15% chance to land a critical blow for 2.5 times damage.</td></tr>
      <tr><td>20</td><td><strong>Ground Slam</strong> (<kbd>X</kbd>, 8s cooldown): leap up and smash the ground, damaging everything around you. Attacking while in the air also turns into a slam.</td></tr>
      <tr><td>50</td><td><strong>Gatling punches</strong>: your basic attack becomes a rapid flurry of alternating punches.</td></tr>
    </tbody></table></div>
    <p><strong>Blaze Kick style.</strong> Old Cinder, in the hidden cave on Pirate Town, teaches two extra fist skills for $5,000 from level 30: <strong>Ember Shot</strong> (<kbd>C</kbd>, 6s cooldown), a flying fire kick that burns and knocks back, and <strong>Inferno Kick</strong> (<kbd>V</kbd>, 18s cooldown), which sets your legs on fire so your next five attacks become kicks dealing 2.5 times fire damage.</p>

    <h2>Sword</h2>
    <p><strong>How to get it:</strong> buy the Starter Blade from the Sword Dealer on Starter Island for $120 and 3 ironwood. Bandits drop ironwood.</p>
    <p>The sword swings in a three-hit combo: a forehand slash, a rising backhand and a heavy overhead chop. The blade leaves a glowing trail, and it reaches further than your fists.</p>
    <div className="content-table-wrap"><table><thead><tr><th scope="col">Mastery</th><th scope="col">Unlock</th></tr></thead><tbody>
      <tr><td>5</td><td><strong>Piercing Thrust</strong> (<kbd>Z</kbd>, 5s cooldown): a long dash strike that goes through blocks. Basic sword attacks also gain 12 units of extra reach.</td></tr>
      <tr><td>20</td><td><strong>Cyclone Spin</strong> (<kbd>X</kbd>, 7s cooldown): spin with the blade out, hitting every enemy around you.</td></tr>
      <tr><td>50</td><td><strong>Dimensional Blade</strong>: your basic attacks also send a large slash wave flying forward.</td></tr>
    </tbody></table></div>

    <h2>Gun</h2>
    <p><strong>How to get it:</strong> buy the Flintlock from the in-game Shop for $220 and 5 scrap.</p>
    <p>The gun shoots exactly where you click. Click an enemy to hit it, or click the ground to fire at that spot. Clicking an enemy's head scores a <strong>headshot</strong> for 1.5 times damage. The cursor turns into a crosshair while the gun is equipped. Bullets stop at walls, trees and rocks, so you need a clear line of fire. On touch screens, tap where you want to shoot, or press the Attack button to aim at the nearest enemy you can see.</p>
    <div className="content-table-wrap"><table><thead><tr><th scope="col">Mastery</th><th scope="col">Unlock</th></tr></thead><tbody>
      <tr><td>5</td><td><strong>Double Tap</strong> (<kbd>Z</kbd>, 4s cooldown): fire two powerful shots in quick succession. Basic shots also fire a bonus second bullet.</td></tr>
      <tr><td>20</td><td><strong>Buckshot Cone</strong> (<kbd>X</kbd>, 6s cooldown): blast a wide spread of pellets in front of you.</td></tr>
      <tr><td>50</td><td><strong>Sniper Focus</strong>: standing still doubles your gun's range.</td></tr>
    </tbody></table></div>

    <h2>Special abilities</h2>
    <p><strong>How to get it:</strong> complete Bandit Trouble on Starter Island, then speak to the Jungle Pulse Trainer on Jungle Island to learn <strong>Jungle Pulse</strong>.</p>
    <p>Special attacks are spells. Your hands glow while it is equipped, light gathers in them as a spell charges, and the energy is released with a push of the hands. Your basic special attack is <strong>Spirit Bolt</strong>: <kbd>Left Click</kbd> (or <kbd>C</kbd>) fires a glowing bolt at the spot under your cursor, about once a second. Like the gun, it hits whatever you click and stops at walls. On touch screens, the Attack button aims it at the nearest enemy in view.</p>
    <div className="content-table-wrap"><table><thead><tr><th scope="col">Mastery</th><th scope="col">Unlock</th></tr></thead><tbody>
      <tr><td>1</td><td><strong>Spirit Bolt</strong> (<kbd>Left Click</kbd> or <kbd>C</kbd>, 0.9s cooldown): fire a bolt of spirit energy at the cursor. Available as soon as you learn Jungle Pulse.</td></tr>
      <tr><td>5</td><td><strong>Pulse Bubble</strong> (<kbd>Z</kbd>, 6s cooldown): an expanding shockwave that pushes enemies away.</td></tr>
      <tr><td>20</td><td><strong>God's Judgment</strong> (<kbd>X</kbd>, 40s cooldown): call down a huge blast of cosmic energy that hits a wide area.</td></tr>
      <tr><td>50</td><td><strong>Grand Awakening</strong>: special attacks instantly finish off ordinary enemies below 20% health and heal you for 50 when they do.</td></tr>
    </tbody></table></div>

    <h2>Defense</h2>
    <p>Defense is a stat rather than a weapon, but it has mastery bonuses too. Hold <kbd>F</kbd> to block.</p>
    <ul>
      <li><strong>Perfect Parry</strong> (mastery 5): blocking within 0.2 seconds of a hit reflects 40% of the damage back to the attacker.</li>
      <li><strong>Iron Bastion</strong> (mastery 20): while blocking, you slowly regenerate 3.5 health per second.</li>
    </ul>

    <h2>Trained abilities</h2>
    <p>Three abilities are taught by trainers rather than earned through mastery:</p>
    <ul>
      <li><strong>Iron Aura</strong> (<kbd>H</kbd>): from the Aura Trainer on Desert Island, level 60, $3,500. Toggle it for extra armor and damage. It levels up as you defeat enemies with it active.</li>
      <li><strong>Flash Step</strong> (<kbd>T</kbd>): from the Flash Step Master in Snowy Village, level 75, $5,000. A short-range teleport.</li>
      <li><strong>Foresight</strong> (<kbd>K</kbd>): from the Foresight Master in Snowy Village, level 80, $7,500. Automatically dodges a limited number of attacks, recharging one dodge every few seconds.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Play Sea Legends</a> <a href="/guides/islands">Island guide</a> · <a href="/guides/enemies-and-bosses">Enemy and boss guide</a></p>
  </ContentLayout>;
}

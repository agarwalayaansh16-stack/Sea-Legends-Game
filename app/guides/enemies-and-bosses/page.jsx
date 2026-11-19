import ContentLayout from "../../content-layout";
import { siteUrl } from "../../site-config";

export const metadata = {
  title: "Enemy and Boss Guide",
  description: "How every enemy in Sea Legends fights, how much health it has, and strategies for beating the Gorilla King, Captain Jester and the Yeti.",
  alternates: { canonical: `${siteUrl}/guides/enemies-and-bosses` },
  openGraph: { title: "Sea Legends Enemy and Boss Guide", description: "Enemy health, attacks and boss strategies for Sea Legends.", url: `${siteUrl}/guides/enemies-and-bosses` },
};

export default function EnemyGuidePage() {
  return <ContentLayout eyebrow="BESTIARY">
    <h1>Enemies and bosses</h1>
    <p className="content-lead">Each island in the First Sea has its own enemies, and three of them guard a boss. This guide explains how each enemy fights and how to beat it. Health values are each enemy's starting health before your weapon and stat bonuses are applied.</p>

    <h2>How enemies fight</h2>
    <p>Enemies notice you when you come close and chase you down. Before an ordinary melee strike, an enemy raises its weapon and a <strong>red flash</strong> appears above its head. The blow lands just under half a second later, and only if you are still in reach, so stepping back, dashing (<kbd>Q</kbd>) or blocking (<kbd>F</kbd>) at the right moment avoids the damage completely. Blocking just before a hit lands is a <strong>Perfect Parry</strong> once your defense mastery is high enough, and reflects part of the damage back.</p>
    <p>Your hits make enemies flinch and stagger backwards, which can interrupt their approach. Heavy enemies (brutes and bosses) are not pushed back. Defeated enemies fall over and come back a few seconds later; bosses take 45 seconds to return.</p>

    <h2>Regular enemies</h2>
    <div className="content-table-wrap"><table><thead><tr><th scope="col">Enemy</th><th scope="col">Island</th><th scope="col">Health</th><th scope="col">How it fights</th></tr></thead><tbody>
      <tr><td>Bandit</td><td>Starter Island</td><td>95</td><td>Walks up and swings a sword. Slow and easy to read.</td></tr>
      <tr><td>Monkey</td><td>Jungle Island</td><td>100</td><td>Fast, light hits. Comes in groups.</td></tr>
      <tr><td>Gorilla</td><td>Jungle Island</td><td>160</td><td>Heavy punches that do twice a monkey's damage.</td></tr>
      <tr><td>Katana pirate</td><td>Pirate Town</td><td>95</td><td>Quick on its feet and sidesteps as you close in, so attacks can whiff.</td></tr>
      <tr><td>Brute enforcer</td><td>Pirate Town</td><td>180</td><td>Swings an iron mace in long combos and can pin you down for a finishing blow. Cannot be knocked back.</td></tr>
      <tr><td>Desert bandit</td><td>Desert Island</td><td>260</td><td>A tougher, harder-hitting version of the starter bandit.</td></tr>
      <tr><td>Desert officer</td><td>Desert Island</td><td>340</td><td>Shoots a pistol from range and switches to a blade when you get close.</td></tr>
      <tr><td>Frozen bandit</td><td>Snowy Village</td><td>500</td><td>Wrapped in an icy shell that must be broken before it takes full damage.</td></tr>
      <tr><td>Snowman</td><td>Snowy Village</td><td>650</td><td>Slow but very durable, and pummels anyone who stays next to it.</td></tr>
    </tbody></table></div>

    <h3>Tips for the trickier ones</h3>
    <ul>
      <li><strong>Katana pirates:</strong> their sidestep has a cooldown. Let them dodge once, then attack while it recharges. The gun is useful here because you can aim exactly where they land.</li>
      <li><strong>Brute enforcers:</strong> never trade blows mid-combo. Back off while the mace is swinging and step in when the combo ends.</li>
      <li><strong>Desert officers:</strong> standing at medium range gives them free shots. Either close the gap fast or use buildings and rocks as cover, since bullets (theirs and yours) stop at walls.</li>
      <li><strong>Frozen bandits:</strong> swords barely chip the ice shell, while fists crack it quickly. Open with melee until the shell shatters, then switch to any weapon.</li>
    </ul>

    <h2>Bosses</h2>

    <h3>The Gorilla King (Jungle Island, level 20 quest)</h3>
    <p><strong>Health:</strong> 750. <strong>Reward:</strong> $1,200 and 4,500 XP.</p>
    <p>The Gorilla King lumbers toward you and punches hard at close range. Its main threat is a chain of <strong>four ground slams</strong> that it starts whenever you are within range, each sending out a shockwave. Back away when the slams begin, wait for the fourth, then move in while the slam recharges.</p>

    <h3>Captain Jester (Pirate Town, level 50 quest)</h3>
    <p><strong>Health:</strong> 850. <strong>Reward:</strong> $1,500 and 6,000 XP.</p>
    <p>Captain Jester is the fastest boss. From range he throws <strong>air slashes</strong> that travel toward you, and when you get close he uses <strong>Rapid Rush</strong>, a sudden lunge that cuts through you. While attacking, his arms, legs and head split apart and float around him. His ordinary strikes hit harder than any pirate's. Strafe sideways to dodge the air slashes, and attack right after a Rapid Rush, which has a cooldown of under two seconds.</p>

    <h3>The Yeti (Snowy Village, level 110 quest)</h3>
    <p><strong>Health:</strong> 2,000. <strong>Reward:</strong> $6,800 and 48,000 XP.</p>
    <p>The Yeti is the strongest enemy in the game and has two big attacks. Every few seconds it starts a <strong>series of four ground slams</strong>. Less often it winds up a <strong>Meteor Fist</strong>: it trembles in place for about two-thirds of a second, then launches itself at you and sends you flying. When you see the Yeti start trembling, dash sideways out of its path. Bring a high defense stat, and consider learning Foresight first, since its automatic dodges can absorb a Meteor Fist.</p>

    <h2>General advice</h2>
    <ul>
      <li>Do quests in level order. Each island's enemies are tuned for its quest levels, and fighting too far above your level is punishing.</li>
      <li>Spend stat points on the weapon you use most and on defense. Health and damage scale with your stats.</li>
      <li>Headshots with the gun deal 1.5 times damage. Aim at the head instead of the body when you have time.</li>
      <li>If you are defeated, you respawn at the Starter Island dock with your progress intact.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Play Sea Legends</a> <a href="/guides/islands">Island guide</a> · <a href="/guides/weapons-and-skills">Weapons and skills</a></p>
  </ContentLayout>;
}

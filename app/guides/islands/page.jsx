import ContentLayout from "../../content-layout";
import Localized from "./localized";
import { siteUrl } from "../../site-config";

export const metadata = {
  title: "Island Guide",
  description: "A guide to every island in the Sea Legends First Sea: Starter Island, Jungle Island, Pirate Town, Desert Island and Snowy Village, with quests, enemies, trainers and travel tips.",
  alternates: { canonical: `${siteUrl}/guides/islands` },
  openGraph: { title: "Sea Legends Island Guide", description: "Quests, enemies, trainers and tips for each island in the First Sea.", url: `${siteUrl}/guides/islands` },
};

export default function IslandGuidePage() {
  return <Localized><ContentLayout eyebrow="ISLAND GUIDE">
    <h1>Islands of the First Sea</h1>
    <p className="content-lead">The First Sea is a chain of islands, each with its own landscape, enemies and quest giver. This guide covers the five islands you can currently visit, in the order most players reach them, with the level you need and what to do when you get there.</p>

    <div className="content-table-wrap"><table><thead><tr><th scope="col">Island</th><th scope="col">Quest levels</th><th scope="col">Enemies</th><th scope="col">Boss</th></tr></thead><tbody>
      <tr><td>Starter Island</td><td>1</td><td>Bandits</td><td>None</td></tr>
      <tr><td>Jungle Island</td><td>10–20</td><td>Monkeys, gorillas</td><td>Gorilla King</td></tr>
      <tr><td>Pirate Town</td><td>30–50</td><td>Katana pirates, brute enforcers</td><td>Captain Jester</td></tr>
      <tr><td>Desert Island</td><td>60–70</td><td>Desert bandits, desert officers</td><td>None</td></tr>
      <tr><td>Snowy Village</td><td>90–110</td><td>Frozen bandits, snowmen</td><td>Yeti</td></tr>
    </tbody></table></div>

    <h2>Starter Island</h2>
    <p>Every adventure begins in the village on Starter Island. It is the safest place in the game: the houses, windmills and wheat fields are surrounded by gentle hills, and the only enemies are the bandits camped near the edge of the village.</p>
    <p><strong>What to do here.</strong> Follow the compass at the top of the screen to the gold quest giver and press <kbd>E</kbd> to accept <strong>Bandit Trouble</strong>. Defeat five bandits, then return for 180 money and 120 XP. Finishing this quest also lets you learn the special ability later on.</p>
    <p><strong>Useful places.</strong> The Sword Dealer sells the Starter Blade for $120 and 3 ironwood, which bandits drop. The Boat Dealer at the dock lets you summon a dinghy, sailor boat or brigade for sailing to other islands. Teleporter pads around the island's edge send you to Jungle Island, Pirate Town and Snowy Village.</p>
    <p><strong>Tip.</strong> Bandits are weak, so use them to practise the basics: chain your punches into a combo, watch for the red flash that warns of an incoming strike, and step back to make it miss.</p>

    <h2>Jungle Island</h2>
    <p>Jungle Island is covered in tall, curving trees and a thick canopy. Its quest giver offers three quests from level 10 to 20, and the island's teleporter route opens once you reach level 15.</p>
    <ul>
      <li><strong>Monkey Mischief</strong> (level 10): defeat 5 monkeys for $380 and 950 XP. Monkeys are quick but fragile.</li>
      <li><strong>Gorilla Strength</strong> (level 15): defeat 5 gorillas for $550 and 1,600 XP. Gorillas hit twice as hard as monkeys and take longer to bring down.</li>
      <li><strong>The Gorilla King</strong> (level 20): defeat the island's boss for $1,200 and 4,500 XP. See the <a href="/guides/enemies-and-bosses">enemy and boss guide</a> for how to fight it.</li>
    </ul>
    <p>The Jungle Pulse Trainer also lives here. Once you have completed Bandit Trouble on Starter Island, speak to the trainer to unlock Jungle Pulse, the special-ability weapon you equip with <kbd>4</kbd>.</p>

    <h2>Pirate Town</h2>
    <p>Pirate Town is a busy harbour run by rival crews. Its captain hands out three quests for players between level 30 and 50, and the fights here are a clear step up from the jungle.</p>
    <ul>
      <li><strong>Pirate Ambush</strong> (level 30): defeat 6 katana pirates for $620 and 1,900 XP.</li>
      <li><strong>Iron Mace Brutes</strong> (level 40): defeat 4 brute enforcers for $940 and 3,300 XP. Brutes swing heavy maces in long combos, so keep your distance between swings.</li>
      <li><strong>Captain Jester</strong> (level 50): defeat the town's boss for $1,500 and 6,000 XP.</li>
    </ul>
    <p><strong>Secret area.</strong> Behind Captain Jester's arena is a hidden cave where the Blaze Kick master, Old Cinder, trains fighters. From level 30, and for $5,000, he teaches the Blaze Kick style: <strong>Ember Shot</strong>, a flying fire kick, and <strong>Inferno Kick</strong>, which sets your legs alight so your next attacks deal fire damage.</p>

    <h2>Desert Island</h2>
    <p>Desert Island is a sun-baked expanse of sand and rock that opens at level 60. It is also where you can learn <strong>Iron Aura</strong> from the Aura Trainer for $3,500. Iron Aura is a toggle (<kbd>H</kbd>) that grows stronger as you defeat enemies with it active.</p>
    <ul>
      <li><strong>Desert Bandits</strong> (level 60): defeat 5 desert bandits for $1,800 and 8,500 XP.</li>
      <li><strong>Desert Officers</strong> (level 70): defeat 5 desert officers for $2,500 and 12,000 XP. Officers shoot from range and switch to a blade up close, so close the gap quickly or fight from behind cover.</li>
    </ul>
    <h2>Snowy Village</h2>
    <p>Snowy Village sits on the coldest island in the First Sea and holds the toughest regular enemies in the game. Its quests run from level 90 to 110.</p>
    <ul>
      <li><strong>Frozen Bandits</strong> (level 90): defeat 5 frozen bandits for $3,400 and 18,000 XP. They are protected by an icy shell that swords barely scratch. Break it with fists first, then finish them with any weapon.</li>
      <li><strong>Snowman Swarm</strong> (level 100): defeat 5 snowmen for $4,500 and 26,000 XP.</li>
      <li><strong>The Yeti Boss</strong> (level 110): defeat the Yeti for $6,800 and 48,000 XP, the biggest reward in the game.</li>
    </ul>
    <p>Two advanced trainers live in Snowy Village. The <strong>Flash Step Master</strong> (level 75, $5,000) teaches a short-range teleport on <kbd>T</kbd>. The <strong>Foresight Master</strong> (level 80, $7,500) teaches Foresight, which automatically dodges a limited number of attacks and is toggled with <kbd>K</kbd>. Each trainer has a teleporter beside them that takes you back to Starter Island.</p>

    <h2>Getting between islands</h2>
    <p>There are two ways to travel. <strong>Teleporters</strong> on Starter Island send you to the other islands; interact with one to choose a destination, but some routes need a minimum level (15 for Jungle Island, 60 for Desert Island). <strong>Boats</strong> let you go anywhere: choose one at a Boat Dealer and it launches at the nearest open water with you at the helm. Steer with <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>, press <kbd>G</kbd> to go ashore, and press <kbd>G</kbd> near your boat to climb back aboard. The Home button in the top bar teleports you back to Starter Island after a short countdown.</p>

    <p><a className="content-button" href="/#game-root">Play Sea Legends</a> <a href="/guides/enemies-and-bosses">Enemy and boss guide</a> · <a href="/guides/weapons-and-skills">Weapons and skills</a></p>
  </ContentLayout></Localized>;
}

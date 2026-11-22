import ContentLayout from "../content-layout";
import Localized from "./localized";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Update Notes",
  description: "What's new in Sea Legends: a log of game updates, new features, fixes and improvements.",
  alternates: { canonical: `${siteUrl}/updates` },
  openGraph: { title: "Sea Legends Update Notes", description: "New features and fixes in Sea Legends.", url: `${siteUrl}/updates` },
};

const updates = [
  {
    date: "November 22, 2026",
    title: "Parries, executions and a new look in motion",
    items: [
      "Anyone can now parry: block just before a blow lands to take no damage and stagger the attacker. Parry an enemy below 10% health to execute it.",
      "A real block pose with a shield shimmer, and a running style with a forward lean, pumping arms and dust at your feet.",
      "Water comes alive: a big splash when you dive in, ripples and foam as you swim, and splashes when you wade through shallows.",
      "New effects for dashes, jumps and landings, Iron Aura, Foresight, weapon switching, level-ups, quest completion, enemy swings and defeats.",
      "Polished HUD: glossy bars with a damage trail, a pulsing warning at low health, a level badge and animated messages.",
    ],
  },
  {
    date: "November 22, 2026",
    title: "Sea combat, world map and save backups",
    items: [
      "Raider ships now patrol the waters around every island. Click while at the helm to fire your cannons; sinking a raider pays money and XP.",
      "A world map (M, or the Map button) shows the islands, your boat, raiders and your quest target, next to a quest log.",
      "Download a backup of your progress from the Esc menu and load it on another browser or device.",
      "Separate music and sound effect volume. Volume and graphics settings are now remembered.",
      "Graphics lower themselves automatically if the game runs slowly (you can turn this off).",
      "Touch screens get buttons for every unlocked skill, dash, block and trained ability.",
    ],
  },
  {
    date: "November 21, 2026",
    title: "Translated site pages",
    items: [
      "The About, Contact, guide, update and legal pages now follow your language choice: English, Hindi, Spanish, French or Portuguese.",
      "A language menu at the bottom of every page. The choice is shared with the game.",
    ],
  },
  {
    date: "November 20, 2026",
    title: "Rebuilt boats",
    items: [
      "New boat models with curved hulls, filled sails, flags in your faction's colours and a ship's wheel. The brigade has two masts and cannons.",
      "Choosing a boat at the dock launches it at the nearest open water and puts you at the helm.",
      "Boats no longer jump around near the shore. Running into land stops the boat, and G takes you ashore.",
      "A new dock menu and a sailing gauge that shows your speed and heading.",
    ],
  },
  {
    date: "November 19, 2026",
    title: "Languages and new guides",
    items: [
      "The game can now be played in English, Hindi, Spanish, French or Portuguese. Pick a language on the loading screen or in the top bar.",
      "New loading screen with links to the guides and site information.",
      "New island, enemy and boss, and weapons and skills guides.",
      "The special weapon now has a basic attack from mastery 1: Spirit Bolt fires a bolt of energy at your cursor with a left click or C. Before, it couldn't attack until mastery 5, so its mastery couldn't be earned.",
    ],
  },
  {
    date: "November 17, 2026",
    title: "Living enemies, sound and a tutorial",
    items: [
      "Enemies now walk with a proper stride, wind up before striking (watch for the red flash), flinch and stagger when hit, and fall over when defeated.",
      "Step out of reach during an enemy's wind-up and the strike misses.",
      "The camera moves in when a wall is between it and your character, and bullets now stop at walls, trees and rocks.",
      "Generated background music for each island and the open sea, ocean sounds near the shore, footsteps, and different hit sounds for each weapon. Music can be turned off in the top bar.",
      "A short Getting Started tutorial for new characters.",
      "Weapons are drawn with a short animation when you switch.",
      "Gun aiming follows hills and slopes.",
    ],
  },
  {
    date: "November 16, 2026",
    title: "Click-to-aim gun",
    items: [
      "The gun now shoots exactly where you click: an enemy, the ground or the open air. Headshots count when you click an enemy's head.",
      "The cursor becomes a crosshair while the gun is equipped.",
      "Gun skills fire toward the cursor.",
      "Shift lock has been removed. The camera stays where you put it.",
    ],
  },
  {
    date: "November 13, 2026",
    title: "Combat animations",
    items: [
      "Your character now holds a real sword or flintlock pistol.",
      "New combos: jab, cross, hook and uppercut with fists, and a three-hit sword combo with a glowing blade trail.",
      "Pistol recoil, muzzle flashes, smoke, shell casings and visible bullets.",
      "Every skill has its own animation, and damage now lands when the blow connects.",
    ],
  },
  {
    date: "November 8, 2026",
    title: "Realistic characters",
    items: [
      "Rebuilt character models with realistic proportions, detailed faces, five-fingered hands and bending elbows and knees.",
      "Character colours now match the colours you pick in the Avatar Studio.",
    ],
  },
  {
    date: "November 7, 2026",
    title: "Smoother performance",
    items: [
      "Fixed the stutter that started right after entering the game.",
      "The world is drawn in far fewer pieces, so the game runs faster on most computers.",
    ],
  },
  {
    date: "November 6, 2026",
    title: "A living Starter Island",
    items: [
      "Curved-roof cottages, windmills, a wheat field and wind-swept grass.",
      "A full day cycle: ten minutes each of day, sunset, night and sunrise.",
      "Curved jungle trees with leaves that sway in the wind.",
      "More Avatar Studio options, including arm, leg and torso length, head size and new body types.",
    ],
  },
];

export default function UpdatesPage() {
  return <Localized><ContentLayout eyebrow="WHAT'S NEW">
    <h1>Update notes</h1>
    <p className="content-lead">Sea Legends is updated regularly. This page lists what changed in each update, newest first.</p>
    {updates.map((update) => <section key={update.date} aria-labelledby={`u-${update.date}`}>
      <h2 id={`u-${update.date}`}>{update.title}</h2>
      <p className="content-updated">{update.date}</p>
      <ul>{update.items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>)}
    <p><a className="content-button" href="/#game-root">Play the latest version</a></p>
  </ContentLayout></Localized>;
}

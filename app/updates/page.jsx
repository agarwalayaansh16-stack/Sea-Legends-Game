import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Update Notes",
  description: "What's new in Sea Legends: a log of game updates, new features, fixes and improvements.",
  alternates: { canonical: `${siteUrl}/updates` },
  openGraph: { title: "Sea Legends Update Notes", description: "New features and fixes in Sea Legends.", url: `${siteUrl}/updates` },
};

const updates = [
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
  return <ContentLayout eyebrow="WHAT'S NEW">
    <h1>Update notes</h1>
    <p className="content-lead">Sea Legends is updated regularly. This page lists what changed in each update, newest first.</p>
    {updates.map((update) => <section key={update.date} aria-labelledby={`u-${update.date}`}>
      <h2 id={`u-${update.date}`}>{update.title}</h2>
      <p className="content-updated">{update.date}</p>
      <ul>{update.items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>)}
    <p><a className="content-button" href="/#game-root">Play the latest version</a></p>
  </ContentLayout>;
}

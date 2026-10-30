import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "About Sea Legends",
  description: "Learn about Sea Legends, a browser RPG prototype with avatar customization, island exploration, quests, combat, and optional multiplayer.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: { title: "About Sea Legends", description: "An introduction to the Sea Legends browser game prototype.", url: `${siteUrl}/about` },
};

export default function AboutPage() {
  return <ContentLayout eyebrow="ABOUT THE PROJECT">
    <h1>About Sea Legends</h1>
    <p className="content-lead">Sea Legends is a browser-based 3D action RPG prototype built around island exploration, character customization, and quest-driven combat, with optional multiplayer world servers.</p>
    <h2>Choose a faction and make an avatar</h2>
    <p>Players can choose Pirates, Marines, or Neutral. Pirates receive extra quest money, while Marines start with one additional defense point. Avatar tools let players create, preview, and edit a human character. Appearance, height, build, and outfit contribute to character attributes.</p>
    <h2>Explore the First Sea</h2>
    <p>The prototype has a chain of ten islands, with Starter Island as the opening area. Players can explore, interact with quest givers, encounter different enemy groups, and use boats to travel over water. The world and available content remain a work in progress.</p>
    <h2>Fight, complete quests, and grow</h2>
    <p>Combat includes melee, sword, and gun attacks. The starter quest, Bandit Trouble, asks players to defeat five bandits and rewards money and experience. Leveling grants points across melee, defense, sword, gun, and special abilities. A special weapon becomes available after completing the starter quest; other unlocks have additional requirements.</p>
    <h2>Optional multiplayer</h2>
    <p>When a multiplayer server is configured, players can join a shared world server capped at ten players and see one another's avatars and movement. Combat, enemies, quest progress, currency, inventory, and saves are still local to each browser. Multiplayer profile names are not verified identities.</p>
    <h2>Local profiles and saves</h2>
    <p>Profile names, avatars, and progress are stored in the current browser; they are not server authenticated or synced across devices. Sea Legends is a prototype and may change, reset, or become unavailable while it is developed.</p>
    <p><a className="content-button" href="/#game-root">Open the game</a> <a href="/game-guide">Read the player guide</a></p>
  </ContentLayout>;
}

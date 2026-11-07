import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "About Sea Legends",
  description: "Learn about Sea Legends, a free browser RPG with avatar customization, island exploration, quests, combat, and optional multiplayer.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: { title: "About Sea Legends", description: "An introduction to the Sea Legends browser game.", url: `${siteUrl}/about` },
};

export default function AboutPage() {
  return <ContentLayout eyebrow="ABOUT THE PROJECT">
    <h1>About Sea Legends</h1>
    <p className="content-lead">Sea Legends is a free browser-based 3D action RPG built around island exploration, character customization, and quest-driven combat, with optional multiplayer world servers.</p>
    <h2>Choose a faction and make an avatar</h2>
    <p>Players can choose Pirates, Marines, or Neutral. Pirates receive extra quest money, while Marines start with one additional defense point. Avatar tools let players create, preview, and edit a human character. Appearance, height, build, and outfit contribute to character attributes.</p>
    <h2>Explore the First Sea</h2>
    <p>The First Sea is a chain of ten islands, with Starter Island as the opening area. Players can explore, interact with quest givers, encounter different enemy groups, and use boats to travel over water. New areas and quests are added as the game grows.</p>
    <h2>Fight, complete quests, and grow</h2>
    <p>Combat includes melee, sword, and gun attacks. The starter quest, Bandit Trouble, asks players to defeat five bandits and rewards money and experience. Leveling grants points across melee, defense, sword, gun, and special abilities. A special weapon becomes available after completing the starter quest; other unlocks have additional requirements.</p>
    <h2>Optional multiplayer</h2>
    <p>When a multiplayer server is configured, players can join a shared world server capped at ten players and see one another's avatars and movement. Combat, enemies, quest progress, currency, inventory, and saves are still local to each browser. Multiplayer profile names are not verified identities.</p>
    <h2>Local profiles and saves</h2>
    <p>Profile names, avatars, and progress are saved in your current browser, so no sign-up is needed. Because saves are local, they don't sync across devices. Sea Legends is actively developed, and features and balance are updated over time.</p>
    <p><a className="content-button" href="/#game-root">Open the game</a> <a href="/game-guide">Read the player guide</a></p>
  </ContentLayout>;
}

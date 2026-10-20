import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "About Sea Legends",
  description: "Learn what Sea Legends is, how its factions, islands, quests, and combat work, and what is still in prototype development.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: { title: "About Sea Legends", description: "An introduction to the Sea Legends browser game prototype.", url: `${siteUrl}/about` },
};

export default function AboutPage() { return <ContentLayout eyebrow="ABOUT THE PROJECT">
  <h1>Set sail in Sea Legends</h1>
  <p className="content-lead">Sea Legends is a browser-based 3D action RPG prototype. It puts a small, playable adventure in your browser while its systems and world continue to evolve.</p>
  <h2>Choose your side</h2><p>At the start, choose Pirates, Marines, or Neutral. Then select or create an avatar. The current character builder lets you preview appearance options; height, build, and outfit feed into character attributes.</p>
  <h2>Explore the First Sea</h2><p>The prototype’s world is built around a chain of ten islands, with Starter Island as the opening area. Move between land and water, find the quest giver, and discover how far your current character can travel. Progression and content are still limited to the systems present in this prototype.</p>
  <h2>Fight, complete quests, and grow</h2><p>Combat includes melee, sword, and gun actions, plus an ability that becomes available after the starter quest. The first quest asks you to defeat five bandits. Completing it grants money and experience; leveling grants stat points to spend across melee, defense, sword, gun, and special abilities.</p>
  <h2>Prototype status</h2><p>This is an in-progress game, not a finished online service. Accounts and saves are currently held in browser storage on the device and browser where you play. There is no server-backed account system or cross-device save service in this implementation. The game may change, reset, or be unavailable while it is being developed.</p>
  <p><a className="content-button" href="/">Open the game</a></p>
</ContentLayout>; }

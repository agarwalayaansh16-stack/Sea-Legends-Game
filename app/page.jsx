import fs from "fs";
import path from "path";
import Script from "next/script";
import { siteUrl } from "./site-config";

export const metadata = {
  title: "Play the Sea Legends Prototype",
  description: "Choose a faction, explore islands, take on quests, and meet other players in optional Sea Legends multiplayer servers.",
  alternates: { canonical: siteUrl },
  openGraph: { title: "Play Sea Legends", description: "Explore islands and take on quests in a browser-based 3D action RPG prototype.", url: siteUrl },
};

export default function Home() {
  const htmlPath = path.join(process.cwd(), "index.html");
  let bodyContent = "";

  try {
    const fullHtml = fs.readFileSync(htmlPath, "utf-8");
    const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    bodyContent = bodyMatch
      ? bodyMatch[1].replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "").trim()
      : "";
  } catch (err) {
    console.error("Error reading index.html:", err);
  }

  return (
    <>
      <div
        id="next-content-wrap"
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: bodyContent }}
        suppressHydrationWarning
      />
      <main className="home-content" aria-labelledby="home-title">
        <div className="home-content-inner">
          <p className="content-eyebrow">A BROWSER GAME PROTOTYPE</p>
          <h1 id="home-title">Explore the First Sea in Sea Legends</h1>
          <p className="content-lead">Sea Legends is a browser-based 3D action RPG prototype. Pick a faction, customize an avatar, explore the First Sea, and take on quests. When multiplayer is configured, join a world server with up to 10 players.</p>
          <p><a className="content-button" href="#game-root">Play the game above</a> <a href="/game-guide">Read the game guide</a></p>

          <section aria-labelledby="start-title">
            <h2 id="start-title">Start playing</h2>
            <ol>
              <li>Create or choose a local profile, then select an avatar and a faction.</li>
              <li>On Starter Island, follow the quest marker and speak with the quest giver using <kbd>E</kbd>.</li>
              <li>Accept the bandit quest, fight using the weapon keys, then return to the quest giver for rewards.</li>
            </ol>
            <p>Profiles and progress stay in this browser’s local storage. They are not online accounts and do not sync between devices.</p>
          </section>

          <section aria-labelledby="features-title">
            <h2 id="features-title">What you can do</h2>
            <div className="home-feature-grid">
              <article><h3>Choose a faction</h3><p>Join Pirates, Marines, or Neutral. Pirates earn extra quest money; Marines start with one extra defense point.</p></article>
              <article><h3>Build an avatar</h3><p>Choose, preview, and edit a human avatar’s colors, outfit, hair, height, and build. Appearance and build settings affect character attributes.</p></article>
              <article><h3>Explore islands</h3><p>Travel through the First Sea’s island chain, beginning at Starter Island. The prototype’s available quests and progression are limited to its implemented content.</p></article>
              <article><h3>Fight and progress</h3><p>Use melee, sword, and gun attacks. Complete the starter quest to unlock the special ability, earn XP and money, and spend level up points on five stats.</p></article>
            </div>
          </section>

          <section aria-labelledby="controls-title">
            <h2 id="controls-title">Quick controls</h2>
            <p><kbd>W A S D</kbd> move · right mouse drag rotates the camera · left click attacks · <kbd>Space</kbd> jumps · <kbd>E</kbd> interacts · <kbd>1</kbd> melee · <kbd>2</kbd> sword · <kbd>3</kbd> gun · <kbd>4</kbd> special ability after unlock.</p>
            <p>Need details about quests, travel, saving, or troubleshooting? Visit the <a href="/game-guide">Sea Legends game guide</a>.</p>
          </section>

          <nav className="home-info-links" aria-label="About this site">
            <h2>About this project</h2>
            <a href="/about">About Sea Legends</a><a href="/game-guide">Game Guide</a><a href="/privacy-policy">Privacy Policy</a><a href="/terms">Terms of Use</a><a href="/contact">Contact</a>
          </nav>
        </div>
      </main>
      <Script src="/game.js" strategy="afterInteractive" />
    </>
  );
}

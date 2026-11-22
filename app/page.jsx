import fs from "fs";
import path from "path";
import Script from "next/script";
import HomeLocalized from "./home-localized";
import { siteUrl } from "./site-config";

export const metadata = {
  title: { absolute: "Sea Legends – Free 3D Pirate Adventure Game in Your Browser" },
  description: "Sea Legends is a free 3D pirate adventure game you play in your browser. Explore islands, take on quests, fight bosses, sail boats and build your own pirate or marine.",
  alternates: { canonical: `${siteUrl}/` },
  openGraph: { title: "Sea Legends – Free 3D Pirate Adventure Game", description: "Explore islands, take on quests and fight bosses in a free browser-based pirate RPG.", url: `${siteUrl}/` },
};

const faqs = [
  ["Is Sea Legends free to play?", "Yes. Sea Legends is a free browser game. There is nothing to buy and no download, and you do not need an account: you create a local profile when you start."],
  ["Do I need to download or install anything?", "No. The game runs in a modern web browser with WebGL, such as Chrome, Edge, Firefox or Safari. A desktop or laptop gives the smoothest performance."],
  ["Can I play on a phone or tablet?", "Yes. On touch screens the game shows on-screen buttons for moving, jumping, attacking and switching weapons, and tapping the screen fires the gun at the spot you tap."],
  ["How is my progress saved?", "Progress is saved automatically in your browser's local storage. Use the same browser and profile to continue. Clearing site data deletes your save."],
  ["Can I play with friends?", "When a multiplayer server is online, up to 10 players can share one world. Without a server, Sea Legends plays as a single-player adventure."],
  ["Which languages does the game support?", "The game interface is available in English, Hindi, Spanish, French and Portuguese. You can switch language on the loading screen or in the top bar."],
  ["How do I unlock the special ability?", "Finish the Bandit Trouble quest on Starter Island, then speak to the Jungle Pulse Trainer on Jungle Island. Spirit Bolt is available from mastery 1, so you can start levelling the special style straight away."],
];

function structuredData() {
  const url = `${siteUrl}/`;
  const data = [
    { "@context": "https://schema.org", "@type": "WebSite", name: "Sea Legends", url, inLanguage: "en" },
    {
      "@context": "https://schema.org", "@type": "VideoGame", name: "Sea Legends", url,
      description: "A free 3D pirate action RPG played in the web browser, with island exploration, quests, boss fights, boats and character customization.",
      image: `${siteUrl}/opengraph-image.jpg`,
      genre: ["Action role-playing game", "Adventure"], gamePlatform: "Web browser", applicationCategory: "Game",
      operatingSystem: "Any operating system with a modern web browser", playMode: ["SinglePlayer", "MultiPlayer"],
      inLanguage: ["en", "hi", "es", "fr", "pt"], isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock", url },
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

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
        <HomeLocalized>
        <div className="home-content-inner">
          <p className="content-eyebrow">A FREE BROWSER GAME</p>
          <h1 id="home-title">Explore the First Sea in Sea Legends</h1>
          <p className="content-lead">Sea Legends is a free 3D pirate adventure game you play right in your browser. Pick a faction, design your own pirate or marine, then explore a chain of islands, take on quests and battle bandits, brutes and bosses. When a multiplayer server is online, up to 10 players can share the same world.</p>
          <p><a className="content-button" href="#game-root">Play now</a> <a href="/game-guide">Read the game guide</a></p>

          <section aria-labelledby="start-title">
            <h2 id="start-title">Start playing</h2>
            <ol>
              <li>Create or choose a local profile, then select an avatar and a faction.</li>
              <li>On Starter Island, follow the quest marker and speak with the quest giver using <kbd>E</kbd>.</li>
              <li>Accept the bandit quest, fight using the weapon keys, then return to the quest giver for rewards.</li>
            </ol>
            <p>Your progress is saved automatically in this browser. Profiles are local, so use the same browser to continue your adventure.</p>
          </section>

          <section aria-labelledby="features-title">
            <h2 id="features-title">What you can do</h2>
            <div className="home-feature-grid">
              <article><h3>Choose a faction</h3><p>Join Pirates, Marines, or Neutral. Pirates earn extra quest money; Marines start with one extra defense point.</p></article>
              <article><h3>Build an avatar</h3><p>Choose, preview, and edit a human avatar’s colors, outfit, hair, height, and build. Appearance and build settings affect character attributes.</p></article>
              <article><h3>Explore islands</h3><p>Travel through the First Sea’s island chain, beginning at Starter Island. Each island has its own terrain, enemies, quest givers, and trainers.</p></article>
              <article><h3>Fight and progress</h3><p>Use melee, sword, and gun attacks, chain combos, and aim the gun exactly where you click. Complete the starter quest to unlock the special ability, earn XP and money, and spend level up points on five stats.</p></article>
            </div>
          </section>

          <section aria-labelledby="islands-title">
            <h2 id="islands-title">Islands, quests and bosses</h2>
            <p>The First Sea is a chain of ten islands. Five are fully built out with towns, quest givers and enemies, and each asks for a higher level than the last, so this pirate game with island exploration grows with you as you level up.</p>
            <ul>
              <li><strong>Starter Island</strong> (level 1): a quiet village, the first quest and bandits to practise on.</li>
              <li><strong>Jungle Island</strong> (levels 10–20): monkeys, gorillas and the Gorilla King.</li>
              <li><strong>Pirate Town</strong> (levels 30–50): katana pirates, brute enforcers and Captain Jester.</li>
              <li><strong>Desert Island</strong> (levels 60–70): desert bandits and pistol-carrying officers.</li>
              <li><strong>Snowy Village</strong> (levels 90–110): frozen bandits, snowmen and the Yeti.</li>
            </ul>
            <p>Quest givers on each island hand out missions that ask you to defeat a group of enemies or a boss. Finished quests pay money and XP, which you spend on weapons, skills and stat points. The <a href="/guides/islands">island guide</a> lists every quest and its rewards, and the <a href="/guides/enemies-and-bosses">enemy and boss guide</a> explains how to win each fight.</p>
          </section>

          <section aria-labelledby="combat-title">
            <h2 id="combat-title">Weapons and combat</h2>
            <p>Combat in this 3D action RPG browser game uses four fighting styles: fists, sword, gun and a special ability. Punches chain into a four-hit combo, the sword swings in a three-hit combo, and the gun fires exactly where you click. Enemies flash red just before they strike, so you can step back, dash or block in time.</p>
            <p>Each style has its own mastery level. Landing hits raises it and unlocks active skills such as Meteor Fist, Piercing Thrust and Cyclone Spin. Trainers on later islands teach extras like Iron Aura. See the <a href="/guides/weapons-and-skills">weapons and skills guide</a> for every unlock.</p>
          </section>

          <section aria-labelledby="boats-title">
            <h2 id="boats-title">Boats, travel and inventory</h2>
            <p>The Boat Dealer at the Starter Island dock launches a dinghy, a sailor boat or a brigade at the nearest open water and puts you at the helm, ready to sail between islands. Teleporter pads offer a faster route once you have reached the right level. Your inventory keeps your melee styles, swords, guns, special abilities and items in separate tabs, and its mastery tab shows how far each fighting style has progressed.</p>
          </section>

          <section aria-labelledby="controls-title">
            <h2 id="controls-title">Quick controls</h2>
            <p><kbd>W A S D</kbd> move · right mouse drag rotates the camera · left click attacks · <kbd>Space</kbd> jumps · <kbd>E</kbd> interacts · <kbd>1</kbd> melee · <kbd>2</kbd> sword · <kbd>3</kbd> gun · <kbd>4</kbd> special ability after unlock. The game is available in English, Hindi, Spanish, French and Portuguese.</p>
            <p>Need details about quests, travel, saving, or troubleshooting? Visit the <a href="/game-guide">Sea Legends game guide</a>.</p>
          </section>

          <section aria-labelledby="guides-title">
            <h2 id="guides-title">Guides</h2>
            <ul>
              <li><a href="/guides/islands">Island guide</a>: quests, enemies and trainers on the five main islands.</li>
              <li><a href="/guides/enemies-and-bosses">Enemy and boss guide</a>: how every enemy fights, and how to beat the Gorilla King, Captain Jester and the Yeti.</li>
              <li><a href="/guides/weapons-and-skills">Weapons and skills guide</a>: combos, mastery bonuses and every active skill.</li>
              <li><a href="/updates">Update notes</a>: what changed in each update.</li>
            </ul>
          </section>

          <section aria-labelledby="faq-title">
            <h2 id="faq-title">Frequently asked questions</h2>
            {faqs.map(([q, a]) => <div className="home-faq" key={q}><h3>{q}</h3><p>{a}</p></div>)}
          </section>

          <nav className="home-info-links" aria-label="About this site">
            <h2>About this project</h2>
            <a href="/about">About Sea Legends</a><a href="/game-guide">Game Guide</a><a href="/privacy-policy">Privacy Policy</a><a href="/terms">Terms &amp; Conditions</a><a href="/disclaimer">Disclaimer</a><a href="/contact">Contact</a>
          </nav>
        </div>
        </HomeLocalized>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      {/* Start the game only after the loading screen has been painted: building the 3D world
          is a long blocking task, and starting it earlier left the page blank to browsers
          and to Google's PageSpeed test (NO_FCP). */}
      <Script id="game-loader" strategy="afterInteractive">{`(function () {
  function load() {
    if (document.getElementById("game-script")) return;
    var s = document.createElement("script");
    s.id = "game-script";
    s.src = "/game.js";
    document.body.appendChild(s);
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(load, 60); }); });
})();`}</Script>
    </>
  );
}

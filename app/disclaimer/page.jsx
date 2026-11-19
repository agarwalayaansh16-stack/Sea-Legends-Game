import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Disclaimer",
  description: "Disclaimer for the Sea Legends website and browser game, covering game content, advertising, external links and availability.",
  alternates: { canonical: `${siteUrl}/disclaimer` },
  openGraph: { title: "Sea Legends Disclaimer", description: "Disclaimer for the Sea Legends website and game.", url: `${siteUrl}/disclaimer` },
};

export default function DisclaimerPage() {
  return <ContentLayout eyebrow="DISCLAIMER">
    <h1>Disclaimer</h1><p className="content-updated">Last updated: November 19, 2026</p>
    <p className="content-lead">Sea Legends is a free browser game made for entertainment. Please read this disclaimer together with the <a href="/terms">Terms &amp; Conditions</a> and the <a href="/privacy-policy">Privacy Policy</a>.</p>

    <h2>Entertainment only</h2>
    <p>Sea Legends is a work of fiction. Its characters, islands, factions and events are invented, and any resemblance to real people, places or organizations is coincidental. In-game money, items and rewards have no real-world value and cannot be exchanged for real money.</p>

    <h2>Game content and guides</h2>
    <p>The guides on this site describe the game as it is at the time of writing. The game is actively developed, so numbers, rewards, levels and features can change in later updates, and guides may sometimes lag behind the game. We make reasonable efforts to keep them accurate but do not guarantee it.</p>

    <h2>Saves and availability</h2>
    <p>Game progress is stored only in your browser. It can be lost if you clear site data, use private browsing, or switch browser or device. The game and site are provided as they are, without guarantees that they will always be available, error-free or compatible with every device. We are not responsible for lost progress.</p>

    <h2>Advertising</h2>
    <p>This site may show advertisements served by Google AdSense and its partners. Ads are chosen by those companies, not by us, and showing an ad is not an endorsement of the product, service or website advertised. Any purchase you make from an advertiser is between you and that advertiser.</p>

    <h2>External links</h2>
    <p>This site links to other websites, such as Google's ad settings pages. We do not control those sites and are not responsible for their content or privacy practices.</p>

    <h2>Health and safety</h2>
    <p>Like other video games, Sea Legends includes flashing lights and fast motion. If you have a history of photosensitive seizures, take care or consult a doctor before playing. Take regular breaks when playing for long periods.</p>

    <h2>Contact</h2>
    <p>If you notice a mistake in a guide or have a question about this disclaimer, use the details on the <a href="/contact">Contact page</a>.</p>
  </ContentLayout>;
}

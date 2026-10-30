import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn what Sea Legends stores in browser storage, which third-party resources it loads, and how advertising is currently configured.",
  alternates: { canonical: `${siteUrl}/privacy-policy` },
  openGraph: { title: "Sea Legends Privacy Policy", description: "Current data and storage practices for the Sea Legends prototype.", url: `${siteUrl}/privacy-policy` },
};

export default function PrivacyPage() {
  return <ContentLayout eyebrow="PRIVACY">
    <h1>Privacy policy</h1><p className="content-updated">Last updated: October 30, 2026</p>
    <p className="content-lead">This notice describes the current Sea Legends website and game implementation. The profile screens do not connect to an authentication server.</p>
    <h2>Information stored in your browser</h2>
    <p>The game uses browser local storage for profile names, the selected local profile, avatar choices, game progress, and marketplace prototype data. These values are accessible to scripts running on this site and to anyone with access to the browser profile. They are not sent to a game account server or synchronized between devices. Do not use a profile name that identifies you. Clearing site data may remove local progress.</p>
    <p>An earlier prototype version stored password and recovery fields in local profile records, although profiles were never server authenticated. The current game code removes those fields from saved records when the game loads. Visitors who do not launch the game may still have older data in browser storage until it is cleared. No email or SMS is sent, and profile recovery is unavailable.</p>
    <h2>Optional multiplayer data</h2>
    <p>When the site is configured to connect to a multiplayer service, joining a world server sends the local profile name, faction, selected avatar appearance, current position, facing direction, and selected weapon to that service. These details are shared with other players in the same server so their avatars can be displayed and moved. The multiplayer process holds current room and player data in memory and writes a player name and room to its server console when someone joins. This prototype does not authenticate profile names or save multiplayer state on the server. The actual service host and its operational logs depend on the deployment configured by the site owner.</p>
    <h2>Cookies, analytics, and third parties</h2>
    <p>The project does not implement its own analytics or cookie-based tracking. It loads Three.js from cdnjs and web fonts from Google Fonts. Those providers receive technical request information when a browser requests their resources. The hosting provider also processes connection requests to serve the site; the applicable provider and retention details depend on the deployment configuration.</p>
    <p>The Google AdSense publisher script is configured in the site layout and may make a request to Google when a page loads. The project currently renders no ad units, and its ad unit feature flag is off by default. This repository cannot confirm whether Auto ads are enabled in the publisher’s AdSense account. If advertising is enabled, Google and its partners may use cookies or similar technologies according to the services, settings, and visitor region. The owner must confirm applicable notice and consent requirements and configure any needed consent management before enabling ads. No consent banner or consent management platform is currently implemented.</p>
    <h2>Children and sensitive information</h2>
    <p>The prototype is not designed to handle sensitive information. Because local profiles are not secure authentication, avoid entering real passwords, phone numbers, or email addresses.</p>
    <h2>Policy updates and contact</h2>
    <p>This notice should be revisited whenever authentication, analytics, advertising, or additional server services are added. For questions, use the contact instructions on the <a href="/contact">Contact page</a>.</p>
  </ContentLayout>;
}

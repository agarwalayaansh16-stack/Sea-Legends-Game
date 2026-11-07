import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Privacy Policy",
  description: "What Sea Legends stores in your browser, which third-party services it uses, and how advertising and cookies work on this site.",
  alternates: { canonical: `${siteUrl}/privacy-policy` },
  openGraph: { title: "Sea Legends Privacy Policy", description: "Data, storage, cookie, and advertising practices for Sea Legends.", url: `${siteUrl}/privacy-policy` },
};

export default function PrivacyPage() {
  return <ContentLayout eyebrow="PRIVACY">
    <h1>Privacy policy</h1><p className="content-updated">Last updated: November 4, 2026</p>
    <p className="content-lead">This policy explains what information Sea Legends stores, what third-party services the site uses, and the choices you have.</p>

    <h2>Information stored in your browser</h2>
    <p>The game uses your browser's local storage for profile names, the selected profile, avatar choices, game progress, and in-game marketplace data. This information stays on your device. It is not sent to a game account server and does not sync between devices. Clearing your browser's site data removes it. Please don't use your real name as a profile name.</p>
    <p>Profiles are not password-protected accounts. Earlier versions of the game stored password and recovery fields locally; the current game removes those fields automatically when it loads.</p>

    <h2>Multiplayer</h2>
    <p>When you join a multiplayer world server, the game sends your profile name, faction, avatar appearance, position, facing direction, and selected weapon to the multiplayer service so other players in the same server can see your character. The service keeps this only in memory while you are connected and may log your profile name and room when you join. Multiplayer state is not saved on the server.</p>

    <h2>Advertising and cookies</h2>
    <p>This site uses Google AdSense to show ads. Google and its partners, as third-party vendors, use cookies and similar technologies to serve ads based on your previous visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the internet.</p>
    <p>You can opt out of personalized advertising by visiting <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">Google Ads Settings</a>, or opt out of some third-party vendors' use of cookies for personalized advertising at <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer" target="_blank">www.aboutads.info</a>. To learn how Google uses information from sites that use its services, see <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer" target="_blank">How Google uses information from sites or apps that use our services</a>.</p>
    <p>Visitors in the European Economic Area, the United Kingdom, and Switzerland are asked for consent through a consent message before personalized ads or advertising cookies are used. You can change your choice at any time using the privacy settings link shown by that message.</p>

    <h2>Other third-party services</h2>
    <p>The site loads the Three.js graphics library from cdnjs and web fonts from Google Fonts. These providers receive standard technical information, such as your IP address and browser type, when your browser requests their files. Our hosting provider also processes connection data to deliver the site. Sea Legends does not run its own analytics.</p>

    <h2>Children</h2>
    <p>Sea Legends is a general-audience game and is not directed at children under 13. We do not knowingly collect personal information from children. Because profiles are stored only in your browser, please do not enter real names, email addresses, phone numbers, or passwords anywhere in the game.</p>

    <h2>Changes and contact</h2>
    <p>We will update this page if the site's data practices change. For questions about privacy, use the details on the <a href="/contact">Contact page</a>.</p>
  </ContentLayout>;
}

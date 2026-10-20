import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Privacy Policy",
  description: "What Sea Legends currently stores in your browser, which third-party resources it loads, and what to know about future advertising configuration.",
  alternates: { canonical: `${siteUrl}/privacy-policy` },
  openGraph: { title: "Sea Legends Privacy Policy", description: "Current data and storage practices for the Sea Legends prototype.", url: `${siteUrl}/privacy-policy` },
};

export default function PrivacyPage() { return <ContentLayout eyebrow="PRIVACY">
  <h1>Privacy policy</h1><p className="content-updated">Last updated: October 20, 2026</p>
  <p className="content-lead">This notice describes the current Sea Legends website implementation. The game is a prototype and its account screens do not connect to an authentication server.</p>
  <h2>Information stored in your browser</h2><p>When you use the game, it uses browser local storage for game progress, avatar choices, marketplace state, a locally created profile name, and the current profile. These values are accessible to scripts running on the site and to anyone with access to the browser profile. This is not an account service and is not synchronized with a server. Do not use a profile name that identifies you. Clearing site data may remove local progress.</p>
  <p>The previous prototype version stored passwords and recovery details in local storage. The current game code removes those two fields from saved profile records on startup while retaining the local profile name and game save. This cleanup runs in the browser when the game loads; visitors who do not launch the game may still have older data in their browser storage until they do so or clear site data. No email or SMS is sent, and profile recovery is unavailable.</p>
  <h2>Cookies, analytics, and third parties</h2><p>The inspected project does not implement analytics or its own cookie-based tracking. It loads Three.js from cdnjs and web fonts from Google Fonts. Those third-party providers may receive technical request information such as your IP address when your browser fetches their resources; consult their current privacy notices for details.</p>
  <p>The Google AdSense publisher script is configured for this site using the supplied publisher ID. It requests a resource from Google; if ad placements or Auto ads are configured, Google and its partners may use cookies or similar technologies for advertising, measurement, and fraud prevention according to the active services and visitor region. This project currently has no ad-unit placements. Ad technology can require consent or other controls depending on where visitors are located and how ads are configured. The site owner must assess those requirements and implement an appropriate consent-management solution before enabling advertising where required. No consent banner is currently implemented.</p>
  <h2>Children and sensitive information</h2><p>The prototype is not designed to handle sensitive information. Because the local account screens are not secure authentication, avoid entering real credentials, phone numbers, or email addresses.</p>
  <h2>Policy updates and contact</h2><p>This notice should be revisited whenever authentication, analytics, advertising, or server services are added. For questions, use the contact instructions on our <a href="/contact">Contact page</a>.</p>
</ContentLayout>; }

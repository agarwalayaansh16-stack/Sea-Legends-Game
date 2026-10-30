import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Terms of Use",
  description: "Terms for using the Sea Legends game prototype, including availability, user responsibilities, and intellectual property.",
  alternates: { canonical: `${siteUrl}/terms` },
  openGraph: { title: "Sea Legends Terms of Use", description: "Terms for the Sea Legends browser game prototype.", url: `${siteUrl}/terms` },
};

export default function TermsPage() { return <ContentLayout eyebrow="SITE TERMS">
  <h1>Terms of use</h1><p className="content-updated">Last updated: October 30, 2026</p>
  <p className="content-lead">By using Sea Legends, you agree to use this prototype responsibly. If you do not agree, do not use the game.</p>
  <h2>Prototype and availability</h2><p>Sea Legends is an experimental browser game provided for play and evaluation. Features, saves, balance, and availability may change without notice. Progress is stored locally and may be lost. The site is provided as available, without a promise of uninterrupted operation, error-free play, or permanent storage.</p>
  <h2>Your responsibilities</h2><p>Use the site lawfully. Do not attempt to disrupt the site, interfere with other visitors, exploit it to access systems or data you are not authorized to access, or use it to distribute harmful code. Local profile names are not protected by authentication; avoid names that identify you and do not enter sensitive personal information.</p>
  <h2>Multiplayer prototype</h2><p>When available, multiplayer shares your profile name, faction, avatar appearance, player position, facing direction, and selected weapon with people in the same game server. Profile names are not verified accounts. Do not impersonate others, disrupt play, or submit personal or sensitive information through a profile name.</p>
  <h2>Intellectual property</h2><p>Sea Legends text, interface, game code, and artwork are presented as part of this prototype. These terms do not grant permission to copy, redistribute, or commercially use project material. Third-party libraries and services remain subject to their own terms and licenses.</p>
  <h2>Changes and contact</h2><p>These terms may be updated as the project changes. Continued use after a posted update means you accept the revised terms. Questions can be sent using the details on the <a href="/contact">Contact page</a>.</p>
</ContentLayout>; }

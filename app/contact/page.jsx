import ContentLayout from "../content-layout";
import { siteUrl } from "../site-config";

export const metadata = {
  title: "Contact Sea Legends",
  description: "How to contact the Sea Legends project owner about the game, site, privacy, or accessibility.",
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: { title: "Contact Sea Legends", description: "Contact information for the Sea Legends project.", url: `${siteUrl}/contact` },
};

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Viaanagarwal396@gmail.com";
  const usableEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return <ContentLayout eyebrow="GET IN TOUCH">
    <h1>Contact</h1><p className="content-lead">For questions about the game, website, privacy notice, or accessibility, contact the Sea Legends project owner.</p>
    {usableEmail ? <p>Email: <a href={`mailto:${email}`}>{email}</a></p> : <div className="owner-note"><strong>Contact address not configured.</strong><p>The site owner should set <code>NEXT_PUBLIC_CONTACT_EMAIL</code> to a monitored public contact address before publishing this page. No email address has been supplied in the project, so none is displayed here.</p></div>}
  </ContentLayout>;
}

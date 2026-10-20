import "./globals.css";
import "../styles.css";
import Script from "next/script";
import SiteFooter from "./site-footer";
import { adsenseClientId, adsenseEnabled, siteUrl } from "./site-config";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Sea Legends", template: "%s | Sea Legends" },
  description: "Explore islands, take on quests, and learn about Sea Legends, a browser-based 3D action RPG prototype.",
  openGraph: { type: "website", siteName: "Sea Legends", title: "Sea Legends", description: "A browser-based 3D action RPG prototype set across a chain of islands.", url: siteUrl },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
        {adsenseEnabled && <Script id="google-adsense" async strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`} crossOrigin="anonymous" />}
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

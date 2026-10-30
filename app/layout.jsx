import "./globals.css";
import "../styles.css";
import Script from "next/script";
import SiteFooter from "./site-footer";
import { adsenseClientId, adsenseScriptEnabled, siteUrl } from "./site-config";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Sea Legends", template: "%s | Sea Legends" },
  description: "Explore islands, take on quests, and learn about Sea Legends, a browser-based 3D action RPG prototype.",
  openGraph: { type: "website", siteName: "Sea Legends", title: "Sea Legends", description: "A browser-based 3D action RPG prototype set across a chain of islands.", url: siteUrl },
};

export default function RootLayout({ children }) {
  const multiplayerUrl = process.env.NEXT_PUBLIC_MULTIPLAYER_URL
    || (process.env.NODE_ENV === "development" ? "ws://localhost:3010/multiplayer" : "");
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="sea-legends-multiplayer-url" content={multiplayerUrl} />
        {adsenseScriptEnabled && <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`} crossOrigin="anonymous" />}
      </head>
      <body suppressHydrationWarning>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

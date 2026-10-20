import fs from "fs";
import path from "path";
import Script from "next/script";
import { siteUrl } from "./site-config";

export const metadata = {
  title: "Play the Sea Legends Prototype",
  description: "Choose a faction, explore the First Sea, take on quests, and try combat in this browser-based 3D RPG prototype.",
  alternates: { canonical: siteUrl },
  openGraph: { title: "Play Sea Legends", description: "Explore islands and take on quests in a browser-based 3D action RPG prototype.", url: siteUrl },
};

export default function Home() {
  const htmlPath = path.join(process.cwd(), "index.html");
  let bodyContent = "";

  try {
    const fullHtml = fs.readFileSync(htmlPath, "utf-8");
    const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*)<script/i);
    bodyContent = bodyMatch ? bodyMatch[1].trim() : "";
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
      <Script src="/game.js" strategy="afterInteractive" />
    </>
  );
}

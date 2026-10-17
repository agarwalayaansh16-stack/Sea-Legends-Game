import fs from "fs";
import path from "path";
import Script from "next/script";

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

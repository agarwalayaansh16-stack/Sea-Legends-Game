import "./globals.css";
import "../styles.css";
import Script from "next/script";

export const metadata = {
  title: "Sea Legends: Pirates vs Marines",
  description: "A browser-based 3D sea adventure RPG prototype.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}

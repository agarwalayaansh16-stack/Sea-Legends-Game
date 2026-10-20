import Link from "next/link";

const links = [
  ["About", "/about"], ["Game Guide", "/game-guide"],
  ["Privacy Policy", "/privacy-policy"], ["Terms", "/terms"], ["Contact", "/contact"],
];

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-footer-inner">
      <Link className="site-footer-brand" href="/">Sea Legends</Link>
      <nav aria-label="Site information" className="site-footer-nav">
        {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
      <p>A browser-based 3D action RPG prototype. Game progress is stored locally in this browser.</p>
    </div>
  </footer>;
}

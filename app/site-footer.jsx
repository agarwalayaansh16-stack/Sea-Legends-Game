import Link from "next/link";

const links = [
  ["Home", "/"], ["About", "/about"], ["Game Guide", "/game-guide"], ["Islands", "/guides/islands"],
  ["Enemies & Bosses", "/guides/enemies-and-bosses"], ["Weapons & Skills", "/guides/weapons-and-skills"],
  ["Updates", "/updates"], ["Privacy Policy", "/privacy-policy"], ["Terms & Conditions", "/terms"],
  ["Disclaimer", "/disclaimer"], ["Contact", "/contact"],
];

export default function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-footer-inner">
      <Link className="site-footer-brand" href="/">Sea Legends</Link>
      <nav aria-label="Site information" className="site-footer-nav">
        {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
      <p>A free browser-based 3D action RPG. Game progress is saved in your browser.</p>
    </div>
  </footer>;
}

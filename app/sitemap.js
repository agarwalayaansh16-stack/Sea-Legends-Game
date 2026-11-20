import { siteUrl } from "./site-config";

// Date each page's content last changed. Update the date when you edit a page.
const routes = [
  ["/", "2026-11-20", "weekly", 1],
  ["/about", "2026-11-20", "monthly", 0.8],
  ["/game-guide", "2026-11-19", "monthly", 0.8],
  ["/guides/islands", "2026-11-19", "monthly", 0.7],
  ["/guides/enemies-and-bosses", "2026-11-19", "monthly", 0.7],
  ["/guides/weapons-and-skills", "2026-11-19", "monthly", 0.7],
  ["/updates", "2026-11-19", "weekly", 0.6],
  ["/privacy-policy", "2026-11-19", "yearly", 0.3],
  ["/terms", "2026-11-04", "yearly", 0.3],
  ["/disclaimer", "2026-11-19", "yearly", 0.3],
  ["/contact", "2026-11-20", "yearly", 0.3],
];

export default function sitemap() {
  return routes.map(([route, date, changeFrequency, priority]) => ({
    url: route === "/" ? `${siteUrl}/` : `${siteUrl}${route}`,
    lastModified: new Date(`${date}T00:00:00Z`),
    changeFrequency,
    priority,
  }));
}

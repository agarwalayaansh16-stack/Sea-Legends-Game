import { siteUrl } from "./site-config";

export default function sitemap() {
  const routes = [
    "", "/about", "/game-guide", "/guides/islands", "/guides/enemies-and-bosses", "/guides/weapons-and-skills",
    "/updates", "/privacy-policy", "/terms", "/disclaimer", "/contact",
  ];
  return routes.map((route) => ({ url: `${siteUrl}${route}`, changeFrequency: route ? "monthly" : "weekly", priority: route ? 0.6 : 1 }));
}

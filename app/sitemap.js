import { siteUrl } from "./site-config";

export default function sitemap() {
  const routes = ["", "/about", "/game-guide", "/privacy-policy", "/terms", "/contact"];
  return routes.map((route) => ({ url: `${siteUrl}${route}`, changeFrequency: route ? "monthly" : "weekly", priority: route ? 0.6 : 1 }));
}

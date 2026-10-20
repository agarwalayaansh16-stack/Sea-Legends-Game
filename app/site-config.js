export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
export const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"
  && /^ca-pub-\d{16}$/.test(adsenseClientId);

export function validAdSlot(slot) {
  return adsenseEnabled && /^\d{6,20}$/.test(slot || "");
}

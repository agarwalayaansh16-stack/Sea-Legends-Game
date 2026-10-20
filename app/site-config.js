export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://dapolice.vercel.app").replace(/\/$/, "");
export const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-2635367930409387";
const hasValidAdsenseClientId = /^ca-pub-\d{16}$/.test(adsenseClientId);
export const adsenseScriptEnabled = process.env.NEXT_PUBLIC_ADSENSE_SCRIPT_ENABLED !== "false"
  && hasValidAdsenseClientId;
export const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"
  && hasValidAdsenseClientId;

export function validAdSlot(slot) {
  return adsenseEnabled && /^\d{6,20}$/.test(slot || "");
}

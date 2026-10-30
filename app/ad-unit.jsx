"use client";

import { useEffect, useRef } from "react";
import { adsenseClientId, validAdSlot } from "./site-config";

export default function AdUnit({ slot, label = "Advertisement" }) {
  const adRef = useRef(null);
  useEffect(() => {
    if (!validAdSlot(slot) || !adRef.current || adRef.current.dataset.requested) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adRef.current.dataset.requested = "true";
    } catch (error) {
      // Ad blockers and unavailable inventory may prevent the request; gameplay is independent.
      console.warn("AdSense slot request failed:", error);
    }
  }, [slot]);
  if (!validAdSlot(slot)) return null;
  return <aside className="ad-reservation" aria-label={label}>
    <span className="ad-label">{label}</span>
    <ins ref={adRef} className="adsbygoogle ad-unit" style={{ display: "block", minHeight: 250 }}
      data-ad-client={adsenseClientId} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
  </aside>;
}

"use client";

import { useEffect, useState } from "react";

// Same key the game uses, so a language picked anywhere applies everywhere.
export const LANGUAGE_KEY = "sea-legends-language";
export const LANGUAGES = [
  ["en", "English"], ["hi", "हिन्दी"], ["es", "Español"], ["fr", "Français"], ["pt", "Português"],
];
const CODES = LANGUAGES.map(([code]) => code);
const EVENT = "sea-legends-language";

export function readLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (CODES.includes(saved)) return saved;
  } catch (err) { /* storage unavailable */ }
  return "en";
}

export function chooseLanguage(lang) {
  if (!CODES.includes(lang)) lang = "en";
  try { localStorage.setItem(LANGUAGE_KEY, lang); } catch (err) { /* storage unavailable */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: lang }));
}

// Current language; English during server render so search engines always get the English page.
export function useLanguage() {
  const [lang, setLang] = useState("en");
  useEffect(() => {
    const sync = () => {
      const next = readLanguage();
      setLang(next);
      document.documentElement.lang = next;
    };
    sync();
    const onStorage = (event) => { if (!event.key || event.key === LANGUAGE_KEY) sync(); };
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return lang;
}

// Wraps a page's English content and swaps in a translation once it has loaded.
// A translation module exports { es, hi, fr, pt } components and optional { titles }.
export function createLocalized(loader) {
  return function Localized({ children }) {
    const lang = useLanguage();
    const [mod, setMod] = useState(null);
    useEffect(() => {
      if (lang === "en" || mod) return;
      let alive = true;
      loader().then((m) => { if (alive) setMod(m); }).catch(() => {});
      return () => { alive = false; };
    }, [lang, mod]);
    useEffect(() => {
      if (!mod?.titles) return;
      if (!document.documentElement.dataset.titleEn) document.documentElement.dataset.titleEn = document.title;
      document.title = lang !== "en" && mod.titles[lang] ? mod.titles[lang] : document.documentElement.dataset.titleEn;
    }, [lang, mod]);
    const Translated = lang !== "en" && mod ? mod[lang] : null;
    return Translated ? <Translated /> : children;
  };
}

"use client";

import Link from "next/link";
import { LANGUAGES, chooseLanguage, useLanguage } from "./i18n-client";

const links = [
  ["home", "/"], ["about", "/about"], ["guide", "/game-guide"], ["islands", "/guides/islands"],
  ["enemies", "/guides/enemies-and-bosses"], ["weapons", "/guides/weapons-and-skills"],
  ["updates", "/updates"], ["privacy", "/privacy-policy"], ["terms", "/terms"],
  ["disclaimer", "/disclaimer"], ["contact", "/contact"],
];

const text = {
  en: { home: "Home", about: "About", guide: "Game Guide", islands: "Islands", enemies: "Enemies & Bosses", weapons: "Weapons & Skills", updates: "Updates", privacy: "Privacy Policy", terms: "Terms & Conditions", disclaimer: "Disclaimer", contact: "Contact", nav: "Site information", language: "Language", tagline: "A free browser-based 3D action RPG. Game progress is saved in your browser." },
  hi: { home: "होम", about: "परिचय", guide: "गेम गाइड", islands: "द्वीप", enemies: "दुश्मन और बॉस", weapons: "हथियार और कौशल", updates: "अपडेट", privacy: "गोपनीयता नीति", terms: "नियम और शर्तें", disclaimer: "अस्वीकरण", contact: "संपर्क", nav: "साइट जानकारी", language: "भाषा", tagline: "ब्राउज़र में खेला जाने वाला मुफ़्त 3D एक्शन RPG। गेम की प्रगति आपके ब्राउज़र में सेव होती है।" },
  es: { home: "Inicio", about: "Acerca de", guide: "Guía del juego", islands: "Islas", enemies: "Enemigos y jefes", weapons: "Armas y habilidades", updates: "Novedades", privacy: "Política de privacidad", terms: "Términos y condiciones", disclaimer: "Aviso legal", contact: "Contacto", nav: "Información del sitio", language: "Idioma", tagline: "Un RPG de acción 3D gratuito en el navegador. Tu progreso se guarda en tu navegador." },
  fr: { home: "Accueil", about: "À propos", guide: "Guide du jeu", islands: "Îles", enemies: "Ennemis et boss", weapons: "Armes et compétences", updates: "Nouveautés", privacy: "Politique de confidentialité", terms: "Conditions générales", disclaimer: "Avertissement", contact: "Contact", nav: "Informations du site", language: "Langue", tagline: "Un RPG d'action 3D gratuit dans le navigateur. Votre progression est enregistrée dans votre navigateur." },
  pt: { home: "Início", about: "Sobre", guide: "Guia do jogo", islands: "Ilhas", enemies: "Inimigos e chefes", weapons: "Armas e habilidades", updates: "Novidades", privacy: "Política de privacidade", terms: "Termos e condições", disclaimer: "Aviso legal", contact: "Contato", nav: "Informações do site", language: "Idioma", tagline: "Um RPG de ação 3D gratuito no navegador. Seu progresso fica salvo no seu navegador." },
};

export default function SiteFooter() {
  const lang = useLanguage();
  const t = text[lang] || text.en;
  return <footer className="site-footer">
    <div className="site-footer-inner">
      <Link className="site-footer-brand" href="/">Sea Legends</Link>
      <nav aria-label={t.nav} className="site-footer-nav">
        {links.map(([key, href]) => <Link href={href} key={href}>{t[key]}</Link>)}
      </nav>
      <label className="site-footer-language">
        <span>{t.language}</span>
        <select value={lang} onChange={(event) => chooseLanguage(event.target.value)} aria-label={t.language}>
          {LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      </label>
      <p>{t.tagline}</p>
    </div>
  </footer>;
}

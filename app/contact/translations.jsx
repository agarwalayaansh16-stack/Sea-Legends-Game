"use client";

import ContentLayout from "../content-layout";

export const titles = {
  hi: "संपर्क | Sea Legends",
  es: "Contacto | Sea Legends",
  fr: "Contact | Sea Legends",
  pt: "Contato | Sea Legends",
};

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Viaanagarwal396@gmail.com";
const usableEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function Contact({ eyebrow, heading, lead, label, missingTitle, missingText }) {
  return <ContentLayout eyebrow={eyebrow}>
    <h1>{heading}</h1><p className="content-lead">{lead}</p>
    {usableEmail ? <p>{label}: <a href={`mailto:${email}`}>{email}</a></p> : <div className="owner-note"><strong>{missingTitle}</strong><p>{missingText}</p></div>}
  </ContentLayout>;
}

export function hi() {
  return <Contact eyebrow="संपर्क करें" heading="संपर्क" label="ईमेल"
    lead="गेम, वेबसाइट, गोपनीयता नीति या सुलभता से जुड़े सवालों के लिए Sea Legends प्रोजेक्ट के मालिक से संपर्क करें।"
    missingTitle="संपर्क पता सेट नहीं है।"
    missingText="इस पेज को प्रकाशित करने से पहले साइट के मालिक को NEXT_PUBLIC_CONTACT_EMAIL में एक सार्वजनिक संपर्क पता डालना चाहिए।" />;
}

export function es() {
  return <Contact eyebrow="PONTE EN CONTACTO" heading="Contacto" label="Correo electrónico"
    lead="Para preguntas sobre el juego, el sitio web, el aviso de privacidad o la accesibilidad, contacta con el responsable del proyecto Sea Legends."
    missingTitle="Dirección de contacto no configurada."
    missingText="Antes de publicar esta página, el responsable del sitio debe indicar una dirección de contacto pública en NEXT_PUBLIC_CONTACT_EMAIL." />;
}

export function fr() {
  return <Contact eyebrow="NOUS CONTACTER" heading="Contact" label="E-mail"
    lead="Pour toute question sur le jeu, le site, la politique de confidentialité ou l'accessibilité, contactez le responsable du projet Sea Legends."
    missingTitle="Adresse de contact non configurée."
    missingText="Avant de publier cette page, le responsable du site doit renseigner une adresse de contact publique dans NEXT_PUBLIC_CONTACT_EMAIL." />;
}

export function pt() {
  return <Contact eyebrow="FALE CONOSCO" heading="Contato" label="E-mail"
    lead="Para dúvidas sobre o jogo, o site, o aviso de privacidade ou a acessibilidade, entre em contato com o responsável pelo projeto Sea Legends."
    missingTitle="Endereço de contato não configurado."
    missingText="Antes de publicar esta página, o responsável pelo site deve definir um endereço de contato público em NEXT_PUBLIC_CONTACT_EMAIL." />;
}

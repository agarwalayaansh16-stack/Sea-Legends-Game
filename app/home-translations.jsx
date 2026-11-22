"use client";

// Translations of the home page introduction (the "Introduction" panel on the loading screen).
function Intro({ t }) {
  return <div className="home-content-inner">
    <p className="content-eyebrow">{t.eyebrow}</p>
    <h1 id="home-title">{t.title}</h1>
    <p className="content-lead">{t.lead}</p>
    <p><a className="content-button" href="#game-root">{t.play}</a> <a href="/game-guide">{t.readGuide}</a></p>

    <section aria-labelledby="start-title">
      <h2 id="start-title">{t.startTitle}</h2>
      <ol>{t.start.map((s) => <li key={s}>{s}</li>)}</ol>
      <p>{t.startNote}</p>
    </section>

    <section aria-labelledby="features-title">
      <h2 id="features-title">{t.featuresTitle}</h2>
      <div className="home-feature-grid">
        {t.features.map(([h, p]) => <article key={h}><h3>{h}</h3><p>{p}</p></article>)}
      </div>
    </section>

    <section aria-labelledby="islands-title">
      <h2 id="islands-title">{t.islandsTitle}</h2>
      <p>{t.islandsIntro}</p>
      <ul>{t.islands.map(([name, rest]) => <li key={name}><strong>{name}</strong> {rest}</li>)}</ul>
      <p>{t.questsText[0]} <a href="/guides/islands">{t.questsText[1]}</a>{t.questsText[2]}<a href="/guides/enemies-and-bosses">{t.questsText[3]}</a>{t.questsText[4]}</p>
    </section>

    <section aria-labelledby="combat-title">
      <h2 id="combat-title">{t.combatTitle}</h2>
      <p>{t.combat1}</p>
      <p>{t.combat2[0]}<a href="/guides/weapons-and-skills">{t.combat2[1]}</a>{t.combat2[2]}</p>
    </section>

    <section aria-labelledby="boats-title">
      <h2 id="boats-title">{t.boatsTitle}</h2>
      <p>{t.boats}</p>
    </section>

    <section aria-labelledby="controls-title">
      <h2 id="controls-title">{t.controlsTitle}</h2>
      <p>{t.controls}</p>
      <p>{t.controlsMore[0]}<a href="/game-guide">{t.controlsMore[1]}</a>{t.controlsMore[2]}</p>
    </section>

    <section aria-labelledby="guides-title">
      <h2 id="guides-title">{t.guidesTitle}</h2>
      <ul>{t.guides.map(([href, label, rest]) => <li key={href}><a href={href}>{label}</a>{rest}</li>)}</ul>
    </section>

    <section aria-labelledby="faq-title">
      <h2 id="faq-title">{t.faqTitle}</h2>
      {t.faqs.map(([q, a]) => <div className="home-faq" key={q}><h3>{q}</h3><p>{a}</p></div>)}
    </section>

    <nav className="home-info-links" aria-label={t.aboutTitle}>
      <h2>{t.aboutTitle}</h2>
      {t.links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
    </nav>
  </div>;
}

const hiText = {
  eyebrow: "एक मुफ़्त ब्राउज़र गेम",
  title: "Sea Legends में फ़र्स्ट सी की खोज करें",
  lead: "Sea Legends एक मुफ़्त 3D समुद्री डाकू एडवेंचर गेम है जिसे आप सीधे अपने ब्राउज़र में खेलते हैं। एक गुट चुनें, अपना समुद्री डाकू या मरीन बनाएँ, फिर द्वीपों की श्रृंखला की खोज करें, क्वेस्ट पूरे करें और डाकुओं, पहलवानों और बॉस से लड़ें। जब मल्टीप्लेयर सर्वर ऑनलाइन हो, तो 10 खिलाड़ी तक एक ही दुनिया में खेल सकते हैं।",
  play: "अभी खेलें", readGuide: "गेम गाइड पढ़ें",
  startTitle: "खेलना शुरू करें",
  start: [
    "एक लोकल प्रोफ़ाइल बनाएँ या चुनें, फिर एक अवतार और एक गुट चुनें।",
    "स्टार्टर द्वीप पर क्वेस्ट मार्कर के पीछे जाएँ और E दबाकर क्वेस्ट देने वाले से बात करें।",
    "डाकुओं वाला क्वेस्ट स्वीकार करें, हथियार वाली कुंजियों से लड़ें, फिर इनाम के लिए क्वेस्ट देने वाले के पास लौटें।",
  ],
  startNote: "आपकी प्रगति इस ब्राउज़र में अपने आप सेव होती है। प्रोफ़ाइल लोकल हैं, इसलिए अपना सफ़र जारी रखने के लिए वही ब्राउज़र इस्तेमाल करें।",
  featuresTitle: "आप क्या कर सकते हैं",
  features: [
    ["गुट चुनें", "समुद्री डाकू, मरीन या तटस्थ में शामिल हों। समुद्री डाकुओं को क्वेस्ट में ज़्यादा पैसे मिलते हैं; मरीन एक अतिरिक्त डिफ़ेंस पॉइंट के साथ शुरू करते हैं।"],
    ["अवतार बनाएँ", "इंसानी अवतार के रंग, कपड़े, बाल, लंबाई और बनावट चुनें, देखें और बदलें। रूप और बनावट की सेटिंग किरदार की खूबियों पर असर डालती हैं।"],
    ["द्वीपों की खोज करें", "स्टार्टर द्वीप से शुरू करके फ़र्स्ट सी के द्वीपों में सफ़र करें। हर द्वीप की अपनी ज़मीन, दुश्मन, क्वेस्ट देने वाले और ट्रेनर हैं।"],
    ["लड़ें और आगे बढ़ें", "मुक्के, तलवार और बंदूक से हमला करें, कॉम्बो जोड़ें और बंदूक से ठीक वहीं निशाना लगाएँ जहाँ आप क्लिक करें। स्पेशल क्षमता खोलने के लिए पहला क्वेस्ट पूरा करें, XP और पैसे कमाएँ, और लेवल अप पॉइंट पाँच स्टैट पर लगाएँ।"],
  ],
  islandsTitle: "द्वीप, क्वेस्ट और बॉस",
  islandsIntro: "फ़र्स्ट सी दस द्वीपों की श्रृंखला है। पाँच पूरी तरह बने हैं, जिनमें कस्बे, क्वेस्ट देने वाले और दुश्मन हैं, और हर द्वीप पिछले से ऊँचा लेवल माँगता है, इसलिए द्वीपों की खोज वाला यह गेम आपके लेवल के साथ आगे बढ़ता है।",
  islands: [
    ["स्टार्टर द्वीप", "(लेवल 1): एक शांत गाँव, पहला क्वेस्ट और अभ्यास के लिए डाकू।"],
    ["जंगल द्वीप", "(लेवल 10–20): बंदर, गोरिल्ला और गोरिल्ला किंग।"],
    ["पाइरेट टाउन", "(लेवल 30–50): कटाना वाले समुद्री डाकू, पहलवान रक्षक और कैप्टन जेस्टर।"],
    ["रेगिस्तानी द्वीप", "(लेवल 60–70): रेगिस्तानी डाकू और पिस्तौल वाले अफ़सर।"],
    ["बर्फ़ीला गाँव", "(लेवल 90–110): बर्फ़ीले डाकू, हिममानव और यती।"],
  ],
  questsText: ["हर द्वीप पर क्वेस्ट देने वाले ऐसे मिशन देते हैं जिनमें दुश्मनों के झुंड या किसी बॉस को हराना होता है। पूरे हुए क्वेस्ट से पैसे और XP मिलते हैं, जिन्हें आप हथियारों, स्किल और स्टैट पॉइंट पर लगाते हैं। ", "द्वीप गाइड", " में हर क्वेस्ट और उसका इनाम है, और ", "दुश्मन और बॉस गाइड", " बताती है कि हर लड़ाई कैसे जीतें।"],
  combatTitle: "हथियार और लड़ाई",
  combat1: "ब्राउज़र में खेले जाने वाले इस 3D एक्शन RPG की लड़ाई में चार शैलियाँ हैं: मुक्के, तलवार, बंदूक और एक स्पेशल क्षमता। मुक्के चार वार के कॉम्बो में जुड़ते हैं, तलवार तीन वार के कॉम्बो में चलती है, और बंदूक ठीक वहीं चलती है जहाँ आप क्लिक करते हैं। वार से ठीक पहले दुश्मन लाल चमकते हैं, ताकि आप समय पर पीछे हट सकें, डैश कर सकें या बचाव कर सकें।",
  combat2: ["हर शैली का अपना महारत लेवल है। वार लगाने से यह बढ़ता है और उल्का मुक्का, भेदी वार और चक्रवात घुमाव जैसी एक्टिव स्किल खुलती हैं। आगे के द्वीपों पर ट्रेनर आयरन ऑरा जैसी चीज़ें सिखाते हैं। हर अनलॉक के लिए ", "हथियार और कौशल गाइड", " देखें।"],
  boatsTitle: "नावें, सफ़र और इन्वेंटरी",
  boats: "स्टार्टर द्वीप के डॉक पर नाव डीलर छोटी नाव, नाविक नाव या ब्रिगेड जहाज़ को सबसे पास के खुले पानी में उतारता है और पतवार आपको सौंप देता है, ताकि आप द्वीपों के बीच सफ़र कर सकें। सही लेवल पर पहुँचने के बाद टेलीपोर्टर पैड तेज़ रास्ता देते हैं। आपकी इन्वेंटरी मुक्कों की शैलियों, तलवारों, बंदूकों, स्पेशल क्षमताओं और चीज़ों को अलग-अलग टैब में रखती है, और इसका महारत टैब दिखाता है कि हर शैली कितनी आगे बढ़ी है।",
  controlsTitle: "मुख्य कंट्रोल",
  controls: "W A S D चलना · माउस का दायाँ बटन खींचकर कैमरा घुमाएँ · बायाँ क्लिक हमला · Space कूदना · E बातचीत · 1 मुक्के · 2 तलवार · 3 बंदूक · 4 खुलने के बाद स्पेशल क्षमता। गेम अंग्रेज़ी, हिन्दी, स्पैनिश, फ़्रेंच और पुर्तगाली में उपलब्ध है।",
  controlsMore: ["क्वेस्ट, सफ़र, सेव या समस्याओं के बारे में जानकारी चाहिए? ", "Sea Legends गेम गाइड", " देखें।"],
  guidesTitle: "गाइड",
  guides: [
    ["/guides/islands", "द्वीप गाइड", ": पाँच मुख्य द्वीपों के क्वेस्ट, दुश्मन और ट्रेनर।"],
    ["/guides/enemies-and-bosses", "दुश्मन और बॉस गाइड", ": हर दुश्मन कैसे लड़ता है, और गोरिल्ला किंग, कैप्टन जेस्टर और यती को कैसे हराएँ।"],
    ["/guides/weapons-and-skills", "हथियार और कौशल गाइड", ": कॉम्बो, महारत बोनस और हर एक्टिव स्किल।"],
    ["/updates", "अपडेट नोट्स", ": हर अपडेट में क्या बदला।"],
  ],
  faqTitle: "अक्सर पूछे जाने वाले सवाल",
  faqs: [
    ["क्या Sea Legends खेलना मुफ़्त है?", "हाँ। Sea Legends एक मुफ़्त ब्राउज़र गेम है। खरीदने को कुछ नहीं है, कुछ डाउनलोड नहीं करना, और अकाउंट की ज़रूरत नहीं है: शुरू करते समय आप एक लोकल प्रोफ़ाइल बनाते हैं।"],
    ["क्या मुझे कुछ डाउनलोड या इंस्टॉल करना होगा?", "नहीं। गेम WebGL वाले किसी आधुनिक ब्राउज़र में चलता है, जैसे Chrome, Edge, Firefox या Safari। डेस्कटॉप या लैपटॉप पर यह सबसे अच्छा चलता है।"],
    ["क्या मैं फ़ोन या टैबलेट पर खेल सकता हूँ?", "हाँ। टच स्क्रीन पर गेम चलने, कूदने, हमला करने और हथियार बदलने के लिए स्क्रीन पर बटन दिखाता है, और स्क्रीन पर टैप करने से बंदूक उसी जगह चलती है।"],
    ["मेरी प्रगति कैसे सेव होती है?", "प्रगति आपके ब्राउज़र की लोकल स्टोरेज में अपने आप सेव होती है। आगे खेलने के लिए वही ब्राउज़र और प्रोफ़ाइल इस्तेमाल करें। साइट डेटा साफ़ करने से आपका सेव मिट जाता है।"],
    ["क्या मैं दोस्तों के साथ खेल सकता हूँ?", "जब मल्टीप्लेयर सर्वर ऑनलाइन हो, तो 10 खिलाड़ी तक एक ही दुनिया में खेल सकते हैं। सर्वर के बिना Sea Legends एक सिंगल-प्लेयर एडवेंचर है।"],
    ["गेम किन भाषाओं में है?", "गेम का इंटरफ़ेस अंग्रेज़ी, हिन्दी, स्पैनिश, फ़्रेंच और पुर्तगाली में है। आप लोडिंग स्क्रीन पर, ऊपर की बार में या पेजों के नीचे भाषा बदल सकते हैं।"],
    ["स्पेशल क्षमता कैसे खुलती है?", "स्टार्टर द्वीप पर डाकुओं की मुसीबत क्वेस्ट पूरा करें, फिर जंगल द्वीप पर जंगल पल्स ट्रेनर से बात करें। आत्मा बाण महारत 1 से उपलब्ध है, इसलिए आप तुरंत स्पेशल शैली का लेवल बढ़ाना शुरू कर सकते हैं।"],
  ],
  aboutTitle: "इस प्रोजेक्ट के बारे में",
  links: [["/about", "Sea Legends के बारे में"], ["/game-guide", "गेम गाइड"], ["/privacy-policy", "गोपनीयता नीति"], ["/terms", "नियम और शर्तें"], ["/disclaimer", "अस्वीकरण"], ["/contact", "संपर्क"]],
};

const esText = {
  eyebrow: "UN JUEGO GRATIS PARA EL NAVEGADOR",
  title: "Explora el Primer Mar en Sea Legends",
  lead: "Sea Legends es un juego de aventuras piratas en 3D gratuito que juegas directamente en tu navegador. Elige una facción, diseña tu propio pirata o marine y explora una cadena de islas, cumple misiones y lucha contra bandidos, matones y jefes. Cuando hay un servidor multijugador en línea, hasta 10 jugadores pueden compartir el mismo mundo.",
  play: "Jugar ahora", readGuide: "Leer la guía del juego",
  startTitle: "Empieza a jugar",
  start: [
    "Crea o elige un perfil local y luego selecciona un avatar y una facción.",
    "En la Isla Inicial, sigue el marcador de misión y habla con quien da las misiones pulsando E.",
    "Acepta la misión de los bandidos, lucha con las teclas de armas y vuelve a por tu recompensa.",
  ],
  startNote: "Tu progreso se guarda automáticamente en este navegador. Los perfiles son locales, así que usa el mismo navegador para continuar tu aventura.",
  featuresTitle: "Qué puedes hacer",
  features: [
    ["Elige una facción", "Únete a los Piratas, los Marines o Neutral. Los Piratas ganan más dinero en las misiones; los Marines empiezan con un punto extra de defensa."],
    ["Crea un avatar", "Elige, previsualiza y edita los colores, la ropa, el pelo, la altura y la complexión de un avatar humano. La apariencia y la complexión influyen en los atributos del personaje."],
    ["Explora islas", "Viaja por la cadena de islas del Primer Mar, empezando en la Isla Inicial. Cada isla tiene su propio terreno, enemigos, misiones y entrenadores."],
    ["Lucha y progresa", "Ataca con puños, espada y pistola, encadena combos y apunta la pistola justo donde haces clic. Completa la misión inicial para desbloquear la habilidad especial, gana XP y dinero y reparte los puntos de nivel entre cinco atributos."],
  ],
  islandsTitle: "Islas, misiones y jefes",
  islandsIntro: "El Primer Mar es una cadena de diez islas. Cinco están completamente construidas, con pueblos, misiones y enemigos, y cada una pide más nivel que la anterior, así que este juego de piratas con exploración de islas crece contigo a medida que subes de nivel.",
  islands: [
    ["Isla Inicial", "(nivel 1): una aldea tranquila, la primera misión y bandidos para practicar."],
    ["Isla de la Selva", "(niveles 10–20): monos, gorilas y el Rey Gorila."],
    ["Pueblo Pirata", "(niveles 30–50): piratas con katana, matones y el Capitán Bufón."],
    ["Isla del Desierto", "(niveles 60–70): bandidos del desierto y oficiales armados con pistola."],
    ["Aldea Nevada", "(niveles 90–110): bandidos helados, muñecos de nieve y el Yeti."],
  ],
  questsText: ["En cada isla, quienes dan las misiones te encargan derrotar a un grupo de enemigos o a un jefe. Las misiones completadas dan dinero y XP, que gastas en armas, habilidades y puntos de atributo. La ", "guía de islas", " recoge cada misión y su recompensa, y la ", "guía de enemigos y jefes", " explica cómo ganar cada combate."],
  combatTitle: "Armas y combate",
  combat1: "El combate de este RPG de acción en 3D para el navegador tiene cuatro estilos: puños, espada, pistola y una habilidad especial. Los puñetazos forman un combo de cuatro golpes, la espada uno de tres y la pistola dispara justo donde haces clic. Los enemigos brillan en rojo justo antes de golpear, para que puedas retroceder, esquivar o bloquear a tiempo.",
  combat2: ["Cada estilo tiene su propio nivel de maestría. Acertar golpes lo sube y desbloquea habilidades activas como Puño Meteoro, Estocada Perforante y Giro Ciclón. Los entrenadores de las islas avanzadas enseñan extras como Aura de Hierro. Consulta la ", "guía de armas y habilidades", " para ver todos los desbloqueos."],
  boatsTitle: "Barcos, viajes e inventario",
  boats: "En el muelle de la Isla Inicial, el vendedor de barcos lanza al agua abierta más cercana un bote, un barco de marinero o un bergantín y te pone al timón, listo para navegar entre islas. Las plataformas de teletransporte ofrecen una ruta más rápida cuando alcanzas el nivel necesario. Tu inventario guarda en pestañas separadas tus estilos de puños, espadas, pistolas, habilidades especiales y objetos, y su pestaña de maestría muestra cuánto ha avanzado cada estilo de lucha.",
  controlsTitle: "Controles rápidos",
  controls: "W A S D para moverte · arrastra con el botón derecho para girar la cámara · clic izquierdo para atacar · Espacio para saltar · E para interactuar · 1 puños · 2 espada · 3 pistola · 4 habilidad especial tras desbloquearla. El juego está disponible en inglés, hindi, español, francés y portugués.",
  controlsMore: ["¿Necesitas detalles sobre misiones, viajes, partidas guardadas o problemas? Visita la ", "guía del juego Sea Legends", "."],
  guidesTitle: "Guías",
  guides: [
    ["/guides/islands", "Guía de islas", ": misiones, enemigos y entrenadores de las cinco islas principales."],
    ["/guides/enemies-and-bosses", "Guía de enemigos y jefes", ": cómo lucha cada enemigo y cómo vencer al Rey Gorila, al Capitán Bufón y al Yeti."],
    ["/guides/weapons-and-skills", "Guía de armas y habilidades", ": combos, bonificaciones de maestría y todas las habilidades activas."],
    ["/updates", "Notas de actualización", ": qué cambió en cada actualización."],
  ],
  faqTitle: "Preguntas frecuentes",
  faqs: [
    ["¿Sea Legends es gratis?", "Sí. Sea Legends es un juego gratuito para el navegador. No hay nada que comprar ni descargar, y no necesitas cuenta: creas un perfil local al empezar."],
    ["¿Tengo que descargar o instalar algo?", "No. El juego funciona en cualquier navegador moderno con WebGL, como Chrome, Edge, Firefox o Safari. Un ordenador de sobremesa o portátil ofrece el mejor rendimiento."],
    ["¿Puedo jugar en un móvil o una tableta?", "Sí. En pantallas táctiles, el juego muestra botones en pantalla para moverte, saltar, atacar y cambiar de arma, y al tocar la pantalla disparas la pistola en ese punto."],
    ["¿Cómo se guarda mi progreso?", "El progreso se guarda automáticamente en el almacenamiento local de tu navegador. Usa el mismo navegador y perfil para continuar. Si borras los datos del sitio, se borra la partida."],
    ["¿Puedo jugar con amigos?", "Cuando hay un servidor multijugador en línea, hasta 10 jugadores pueden compartir un mundo. Sin servidor, Sea Legends es una aventura para un jugador."],
    ["¿En qué idiomas está el juego?", "La interfaz del juego está en inglés, hindi, español, francés y portugués. Puedes cambiar el idioma en la pantalla de carga, en la barra superior o al pie de las páginas."],
    ["¿Cómo desbloqueo la habilidad especial?", "Termina la misión Problemas con bandidos en la Isla Inicial y habla con el entrenador de Pulso de la Selva en la Isla de la Selva. El Rayo Espiritual está disponible desde la maestría 1, así que puedes subir el estilo especial desde el primer momento."],
  ],
  aboutTitle: "Sobre este proyecto",
  links: [["/about", "Acerca de Sea Legends"], ["/game-guide", "Guía del juego"], ["/privacy-policy", "Política de privacidad"], ["/terms", "Términos y condiciones"], ["/disclaimer", "Aviso legal"], ["/contact", "Contacto"]],
};

const frText = {
  eyebrow: "UN JEU GRATUIT DANS LE NAVIGATEUR",
  title: "Explorez la Première Mer dans Sea Legends",
  lead: "Sea Legends est un jeu d'aventure pirate en 3D gratuit, auquel vous jouez directement dans votre navigateur. Choisissez une faction, créez votre pirate ou votre marine, puis explorez une chaîne d'îles, accomplissez des quêtes et affrontez bandits, brutes et boss. Quand un serveur multijoueur est en ligne, jusqu'à 10 joueurs peuvent partager le même monde.",
  play: "Jouer maintenant", readGuide: "Lire le guide du jeu",
  startTitle: "Commencer à jouer",
  start: [
    "Créez ou choisissez un profil local, puis sélectionnez un avatar et une faction.",
    "Sur l'Île de départ, suivez le marqueur de quête et parlez au donneur de quêtes avec E.",
    "Acceptez la quête des bandits, combattez avec les touches d'armes, puis revenez chercher votre récompense.",
  ],
  startNote: "Votre progression est enregistrée automatiquement dans ce navigateur. Les profils sont locaux : utilisez le même navigateur pour poursuivre l'aventure.",
  featuresTitle: "Ce que vous pouvez faire",
  features: [
    ["Choisir une faction", "Rejoignez les Pirates, les Marines ou Neutre. Les Pirates gagnent plus d'argent en quête ; les Marines commencent avec un point de défense en plus."],
    ["Créer un avatar", "Choisissez, prévisualisez et modifiez les couleurs, la tenue, les cheveux, la taille et la carrure d'un avatar humain. L'apparence et la carrure influencent les attributs du personnage."],
    ["Explorer les îles", "Parcourez la chaîne d'îles de la Première Mer en partant de l'Île de départ. Chaque île a son terrain, ses ennemis, ses donneurs de quêtes et ses entraîneurs."],
    ["Combattre et progresser", "Attaquez aux poings, à l'épée et au pistolet, enchaînez des combos et tirez exactement là où vous cliquez. Terminez la première quête pour débloquer la capacité spéciale, gagnez XP et argent, et répartissez vos points de niveau entre cinq statistiques."],
  ],
  islandsTitle: "Îles, quêtes et boss",
  islandsIntro: "La Première Mer est une chaîne de dix îles. Cinq sont entièrement aménagées, avec villes, donneurs de quêtes et ennemis, et chacune demande un niveau plus élevé que la précédente : ce jeu de pirates à explorer grandit avec vous à mesure que vous progressez.",
  islands: [
    ["Île de départ", "(niveau 1) : un village paisible, la première quête et des bandits pour s'entraîner."],
    ["Île de la Jungle", "(niveaux 10–20) : singes, gorilles et le Roi Gorille."],
    ["Ville Pirate", "(niveaux 30–50) : pirates au katana, brutes et le Capitaine Bouffon."],
    ["Île du Désert", "(niveaux 60–70) : bandits du désert et officiers armés de pistolets."],
    ["Village enneigé", "(niveaux 90–110) : bandits gelés, bonshommes de neige et le Yéti."],
  ],
  questsText: ["Sur chaque île, les donneurs de quêtes proposent des missions qui demandent de vaincre un groupe d'ennemis ou un boss. Les quêtes terminées rapportent argent et XP, à dépenser en armes, compétences et points de statistiques. Le ", "guide des îles", " liste chaque quête et sa récompense, et le ", "guide des ennemis et boss", " explique comment remporter chaque combat."],
  combatTitle: "Armes et combat",
  combat1: "Le combat de ce RPG d'action 3D dans le navigateur repose sur quatre styles : poings, épée, pistolet et capacité spéciale. Les coups de poing s'enchaînent en combo de quatre coups, l'épée en combo de trois, et le pistolet tire exactement là où vous cliquez. Les ennemis s'illuminent en rouge juste avant de frapper, pour que vous puissiez reculer, faire une ruée ou bloquer à temps.",
  combat2: ["Chaque style a son propre niveau de maîtrise. Toucher l'ennemi le fait monter et débloque des compétences actives comme Poing Météore, Estocade perçante et Tourbillon. Les entraîneurs des îles suivantes enseignent des extras comme l'Aura de fer. Consultez le ", "guide des armes et compétences", " pour tous les déblocages."],
  boatsTitle: "Bateaux, voyages et inventaire",
  boats: "Au quai de l'Île de départ, le marchand de bateaux met à l'eau un canot, un bateau de marin ou un brigantin au plus près et vous place à la barre, prêt à naviguer entre les îles. Les plateformes de téléportation offrent un trajet plus rapide une fois le niveau requis atteint. Votre inventaire range dans des onglets séparés vos styles de poings, épées, pistolets, capacités spéciales et objets, et son onglet de maîtrise montre la progression de chaque style de combat.",
  controlsTitle: "Commandes essentielles",
  controls: "W A S D pour se déplacer · glisser avec le clic droit pour tourner la caméra · clic gauche pour attaquer · Espace pour sauter · E pour interagir · 1 poings · 2 épée · 3 pistolet · 4 capacité spéciale une fois débloquée. Le jeu est disponible en anglais, hindi, espagnol, français et portugais.",
  controlsMore: ["Besoin de détails sur les quêtes, les déplacements, les sauvegardes ou le dépannage ? Consultez le ", "guide du jeu Sea Legends", "."],
  guidesTitle: "Guides",
  guides: [
    ["/guides/islands", "Guide des îles", " : quêtes, ennemis et entraîneurs des cinq îles principales."],
    ["/guides/enemies-and-bosses", "Guide des ennemis et boss", " : comment chaque ennemi se bat, et comment vaincre le Roi Gorille, le Capitaine Bouffon et le Yéti."],
    ["/guides/weapons-and-skills", "Guide des armes et compétences", " : combos, bonus de maîtrise et toutes les compétences actives."],
    ["/updates", "Notes de mise à jour", " : ce qui a changé à chaque mise à jour."],
  ],
  faqTitle: "Questions fréquentes",
  faqs: [
    ["Sea Legends est-il gratuit ?", "Oui. Sea Legends est un jeu gratuit dans le navigateur. Il n'y a rien à acheter ni à télécharger, et aucun compte n'est nécessaire : vous créez un profil local au démarrage."],
    ["Faut-il télécharger ou installer quelque chose ?", "Non. Le jeu tourne dans un navigateur moderne compatible WebGL, comme Chrome, Edge, Firefox ou Safari. Un ordinateur de bureau ou portable offre les meilleures performances."],
    ["Puis-je jouer sur téléphone ou tablette ?", "Oui. Sur écran tactile, le jeu affiche des boutons pour se déplacer, sauter, attaquer et changer d'arme, et toucher l'écran fait tirer le pistolet à cet endroit."],
    ["Comment ma progression est-elle enregistrée ?", "La progression est enregistrée automatiquement dans le stockage local de votre navigateur. Utilisez le même navigateur et le même profil pour continuer. Effacer les données du site supprime votre sauvegarde."],
    ["Puis-je jouer avec des amis ?", "Quand un serveur multijoueur est en ligne, jusqu'à 10 joueurs peuvent partager un monde. Sans serveur, Sea Legends est une aventure en solo."],
    ["Dans quelles langues le jeu est-il disponible ?", "L'interface du jeu existe en anglais, hindi, espagnol, français et portugais. Vous pouvez changer de langue sur l'écran de chargement, dans la barre supérieure ou en bas des pages."],
    ["Comment débloquer la capacité spéciale ?", "Terminez la quête Ennuis de bandits sur l'Île de départ, puis parlez à l'entraîneur de Pouls de la Jungle sur l'Île de la Jungle. Le Trait spirituel est disponible dès la maîtrise 1 : vous pouvez faire progresser le style spécial tout de suite."],
  ],
  aboutTitle: "À propos du projet",
  links: [["/about", "À propos de Sea Legends"], ["/game-guide", "Guide du jeu"], ["/privacy-policy", "Politique de confidentialité"], ["/terms", "Conditions générales"], ["/disclaimer", "Avertissement"], ["/contact", "Contact"]],
};

const ptText = {
  eyebrow: "UM JOGO GRÁTIS NO NAVEGADOR",
  title: "Explore o Primeiro Mar em Sea Legends",
  lead: "Sea Legends é um jogo de aventura pirata em 3D gratuito que você joga direto no navegador. Escolha uma facção, crie seu pirata ou fuzileiro e explore uma cadeia de ilhas, cumpra missões e enfrente bandidos, brutamontes e chefes. Quando há um servidor multijogador online, até 10 jogadores podem dividir o mesmo mundo.",
  play: "Jogar agora", readGuide: "Ler o guia do jogo",
  startTitle: "Comece a jogar",
  start: [
    "Crie ou escolha um perfil local e depois selecione um avatar e uma facção.",
    "Na Ilha Inicial, siga o marcador de missão e fale com quem dá as missões apertando E.",
    "Aceite a missão dos bandidos, lute com as teclas de armas e volte para receber a recompensa.",
  ],
  startNote: "Seu progresso é salvo automaticamente neste navegador. Os perfis são locais, então use o mesmo navegador para continuar sua aventura.",
  featuresTitle: "O que você pode fazer",
  features: [
    ["Escolha uma facção", "Entre para os Piratas, os Fuzileiros ou fique Neutro. Os Piratas ganham mais dinheiro nas missões; os Fuzileiros começam com um ponto extra de defesa."],
    ["Crie um avatar", "Escolha, pré-visualize e edite as cores, a roupa, o cabelo, a altura e o porte de um avatar humano. Aparência e porte influenciam os atributos do personagem."],
    ["Explore ilhas", "Viaje pela cadeia de ilhas do Primeiro Mar, começando na Ilha Inicial. Cada ilha tem seu terreno, inimigos, missões e treinadores."],
    ["Lute e evolua", "Ataque com punhos, espada e pistola, encadeie combos e mire a pistola exatamente onde clicar. Conclua a missão inicial para liberar a habilidade especial, ganhe XP e dinheiro e distribua os pontos de nível entre cinco atributos."],
  ],
  islandsTitle: "Ilhas, missões e chefes",
  islandsIntro: "O Primeiro Mar é uma cadeia de dez ilhas. Cinco estão totalmente construídas, com vilas, missões e inimigos, e cada uma pede um nível maior que a anterior, então este jogo de piratas com exploração de ilhas cresce junto com você.",
  islands: [
    ["Ilha Inicial", "(nível 1): uma vila tranquila, a primeira missão e bandidos para treinar."],
    ["Ilha da Selva", "(níveis 10–20): macacos, gorilas e o Rei Gorila."],
    ["Cidade Pirata", "(níveis 30–50): piratas com katana, brutamontes e o Capitão Bufão."],
    ["Ilha do Deserto", "(níveis 60–70): bandidos do deserto e oficiais armados com pistola."],
    ["Vila Nevada", "(níveis 90–110): bandidos congelados, bonecos de neve e o Yeti."],
  ],
  questsText: ["Em cada ilha, quem dá as missões pede que você derrote um grupo de inimigos ou um chefe. Missões concluídas rendem dinheiro e XP, que você gasta em armas, habilidades e pontos de atributo. O ", "guia das ilhas", " lista cada missão e sua recompensa, e o ", "guia de inimigos e chefes", " explica como vencer cada luta."],
  combatTitle: "Armas e combate",
  combat1: "O combate deste RPG de ação 3D para navegador tem quatro estilos: punhos, espada, pistola e uma habilidade especial. Os socos formam um combo de quatro golpes, a espada um combo de três, e a pistola atira exatamente onde você clica. Os inimigos brilham em vermelho logo antes de atacar, para que você possa recuar, avançar ou bloquear a tempo.",
  combat2: ["Cada estilo tem seu próprio nível de maestria. Acertar golpes faz ele subir e libera habilidades ativas como Punho Meteoro, Estocada Perfurante e Giro Ciclone. Treinadores das ilhas seguintes ensinam extras como a Aura de Ferro. Veja o ", "guia de armas e habilidades", " para todos os desbloqueios."],
  boatsTitle: "Barcos, viagens e inventário",
  boats: "No cais da Ilha Inicial, o vendedor de barcos lança um bote, um barco de marinheiro ou um bergantim na água aberta mais próxima e coloca você no leme, pronto para navegar entre as ilhas. As plataformas de teletransporte oferecem um caminho mais rápido quando você atinge o nível necessário. Seu inventário guarda em abas separadas seus estilos de punhos, espadas, pistolas, habilidades especiais e itens, e a aba de maestria mostra quanto cada estilo de luta evoluiu.",
  controlsTitle: "Controles rápidos",
  controls: "W A S D para andar · arraste com o botão direito para girar a câmera · clique esquerdo para atacar · Espaço para pular · E para interagir · 1 punhos · 2 espada · 3 pistola · 4 habilidade especial depois de liberada. O jogo está disponível em inglês, hindi, espanhol, francês e português.",
  controlsMore: ["Precisa de detalhes sobre missões, viagens, saves ou problemas? Veja o ", "guia do jogo Sea Legends", "."],
  guidesTitle: "Guias",
  guides: [
    ["/guides/islands", "Guia das ilhas", ": missões, inimigos e treinadores das cinco ilhas principais."],
    ["/guides/enemies-and-bosses", "Guia de inimigos e chefes", ": como cada inimigo luta e como vencer o Rei Gorila, o Capitão Bufão e o Yeti."],
    ["/guides/weapons-and-skills", "Guia de armas e habilidades", ": combos, bônus de maestria e todas as habilidades ativas."],
    ["/updates", "Notas de atualização", ": o que mudou em cada atualização."],
  ],
  faqTitle: "Perguntas frequentes",
  faqs: [
    ["Sea Legends é grátis?", "Sim. Sea Legends é um jogo gratuito para navegador. Não há nada para comprar nem baixar, e você não precisa de conta: cria um perfil local ao começar."],
    ["Preciso baixar ou instalar alguma coisa?", "Não. O jogo roda em qualquer navegador moderno com WebGL, como Chrome, Edge, Firefox ou Safari. Um computador de mesa ou notebook oferece o melhor desempenho."],
    ["Posso jogar no celular ou tablet?", "Sim. Em telas de toque, o jogo mostra botões na tela para andar, pular, atacar e trocar de arma, e tocar na tela dispara a pistola naquele ponto."],
    ["Como meu progresso é salvo?", "O progresso é salvo automaticamente no armazenamento local do seu navegador. Use o mesmo navegador e perfil para continuar. Limpar os dados do site apaga seu save."],
    ["Posso jogar com amigos?", "Quando há um servidor multijogador online, até 10 jogadores podem dividir um mundo. Sem servidor, Sea Legends é uma aventura para um jogador."],
    ["Em quais idiomas o jogo está?", "A interface do jogo está em inglês, hindi, espanhol, francês e português. Você pode trocar o idioma na tela de carregamento, na barra superior ou no rodapé das páginas."],
    ["Como libero a habilidade especial?", "Conclua a missão Encrenca com bandidos na Ilha Inicial e fale com o treinador do Pulso da Selva na Ilha da Selva. O Raio Espiritual está disponível desde a maestria 1, então você pode evoluir o estilo especial desde o início."],
  ],
  aboutTitle: "Sobre este projeto",
  links: [["/about", "Sobre Sea Legends"], ["/game-guide", "Guia do jogo"], ["/privacy-policy", "Política de privacidade"], ["/terms", "Termos e condições"], ["/disclaimer", "Aviso legal"], ["/contact", "Contato"]],
};

export function hi() { return <Intro t={hiText} />; }
export function es() { return <Intro t={esText} />; }
export function fr() { return <Intro t={frText} />; }
export function pt() { return <Intro t={ptText} />; }

"use client";

import ContentLayout from "../content-layout";

export const titles = {
  hi: "अपडेट नोट्स | Sea Legends",
  es: "Notas de actualización | Sea Legends",
  fr: "Notes de mise à jour | Sea Legends",
  pt: "Notas de atualização | Sea Legends",
};

function Updates({ eyebrow, heading, lead, cta, updates }) {
  return <ContentLayout eyebrow={eyebrow}>
    <h1>{heading}</h1>
    <p className="content-lead">{lead}</p>
    {updates.map(([id, date, title, items]) => <section key={id} aria-labelledby={`u-${id}`}>
      <h2 id={`u-${id}`}>{title}</h2>
      <p className="content-updated">{date}</p>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>)}
    <p><a className="content-button" href="/#game-root">{cta}</a></p>
  </ContentLayout>;
}

export function hi() {
  return <Updates eyebrow="नया क्या है" heading="अपडेट नोट्स" cta="नया संस्करण खेलें"
    lead="Sea Legends नियमित रूप से अपडेट होता है। यह पेज हर अपडेट के बदलाव दिखाता है, सबसे नया सबसे ऊपर।"
    updates={[
      ["1122b", "22 नवंबर 2026", "पैरी, एक्ज़ीक्यूशन और हलचल में नया रूप", [
        "अब हर कोई पैरी कर सकता है: वार लगने से ठीक पहले बचाव करें, तो कोई नुकसान नहीं होता और हमलावर लड़खड़ा जाता है। 10% से कम हेल्थ वाले दुश्मन को पैरी करने पर वह खत्म हो जाता है।",
        "ढाल की चमक के साथ असली बचाव मुद्रा, और आगे झुककर, बाँहें चलाते हुए, पैरों से धूल उड़ाती दौड़।",
        "पानी में जान: छलाँग लगाने पर बड़ी छपाक, तैरते समय लहरें और झाग, और उथले पानी में चलते समय छींटे।",
        "डैश, कूद और उतरने, आयरन ऑरा, फ़ोरसाइट, हथियार बदलने, लेवल अप, क्वेस्ट पूरा होने, दुश्मनों के वार और हार के लिए नए इफ़ेक्ट।",
        "निखरा HUD: नुकसान दिखाने वाली चमकदार बार, कम हेल्थ पर धड़कती चेतावनी, लेवल बैज और एनिमेटेड संदेश।",
      ]],
      ["1122", "22 नवंबर 2026", "समुद्री लड़ाई, दुनिया का नक्शा और सेव बैकअप", [
        "अब हर द्वीप के आसपास के पानी में लुटेरे जहाज़ गश्त करते हैं। पतवार संभालते समय क्लिक करके तोपें दागें; लुटेरा जहाज़ डुबोने पर पैसे और XP मिलते हैं।",
        "दुनिया का नक्शा (M या नक्शा बटन) द्वीप, आपकी नाव, लुटेरे और क्वेस्ट का लक्ष्य दिखाता है, साथ में क्वेस्ट सूची।",
        "Esc मेन्यू से अपनी प्रगति का बैकअप डाउनलोड करें और उसे दूसरे ब्राउज़र या डिवाइस पर लोड करें।",
        "संगीत और ध्वनि प्रभावों की अलग आवाज़। आवाज़ और ग्राफ़िक्स की सेटिंग अब याद रहती हैं।",
        "गेम धीमा चलने पर ग्राफ़िक्स अपने आप कम हो जाते हैं (आप इसे बंद कर सकते हैं)।",
        "टच स्क्रीन पर हर खुली स्किल, डैश, बचाव और सीखी हुई क्षमता के लिए बटन।",
      ]],
      ["1121", "21 नवंबर 2026", "साइट के पेजों का अनुवाद", [
        "परिचय, संपर्क, गाइड, अपडेट और कानूनी पेज अब आपकी चुनी हुई भाषा में दिखते हैं: अंग्रेज़ी, हिन्दी, स्पैनिश, फ़्रेंच या पुर्तगाली।",
        "हर पेज के नीचे भाषा मेन्यू। यह पसंद गेम के साथ साझा होती है।",
      ]],
      ["1120", "20 नवंबर 2026", "नावें नए सिरे से बनीं", [
        "घुमावदार पतवार, हवा से भरे पाल, आपके गुट के रंग के झंडे और जहाज़ के पहिये वाले नए नाव मॉडल। ब्रिगेड जहाज़ में दो मस्तूल और तोपें हैं।",
        "डॉक पर नाव चुनते ही वह सबसे पास के खुले पानी में उतरती है और पतवार आपके हाथ में होती है।",
        "किनारे के पास नावें अब इधर-उधर नहीं उछलतीं। ज़मीन से टकराने पर नाव रुक जाती है, और G से आप किनारे उतरते हैं।",
        "नया डॉक मेन्यू और एक सेलिंग गेज जो आपकी रफ़्तार और दिशा दिखाता है।",
      ]],
      ["1119", "19 नवंबर 2026", "भाषाएँ और नई गाइड", [
        "गेम अब अंग्रेज़ी, हिन्दी, स्पैनिश, फ़्रेंच या पुर्तगाली में खेला जा सकता है। लोडिंग स्क्रीन पर या ऊपर की बार में भाषा चुनें।",
        "गाइड और साइट की जानकारी के लिंक वाली नई लोडिंग स्क्रीन।",
        "द्वीप, दुश्मन और बॉस, और हथियार और कौशल की नई गाइड।",
        "स्पेशल हथियार में अब महारत 1 से एक सामान्य हमला है: आत्मा बाण बाएँ क्लिक या C से आपके कर्सर पर ऊर्जा का बाण चलाता है। पहले यह महारत 5 तक हमला नहीं कर पाता था, इसलिए इसकी महारत बढ़ाई नहीं जा सकती थी।",
      ]],
      ["1117", "17 नवंबर 2026", "जीवंत दुश्मन, आवाज़ और ट्यूटोरियल", [
        "दुश्मन अब सही कदमों से चलते हैं, वार से पहले तैयारी करते हैं (लाल चमक पर नज़र रखें), चोट लगने पर लड़खड़ाते हैं और हारने पर गिर जाते हैं।",
        "दुश्मन की तैयारी के दौरान पहुँच से बाहर हो जाएँ, तो वार चूक जाता है।",
        "दीवार बीच में आने पर कैमरा किरदार के पास आ जाता है, और गोलियाँ अब दीवारों, पेड़ों और चट्टानों पर रुकती हैं।",
        "हर द्वीप और खुले समुद्र के लिए बना बैकग्राउंड संगीत, किनारे के पास लहरों की आवाज़, कदमों की आहट और हर हथियार के लिए अलग वार की आवाज़। संगीत ऊपर की बार से बंद किया जा सकता है।",
        "नए किरदारों के लिए एक छोटा शुरुआती ट्यूटोरियल।",
        "हथियार बदलने पर एक छोटे एनिमेशन के साथ निकाला जाता है।",
        "बंदूक का निशाना पहाड़ियों और ढलानों के हिसाब से लगता है।",
      ]],
      ["1116", "16 नवंबर 2026", "क्लिक से निशाने वाली बंदूक", [
        "बंदूक अब ठीक वहीं चलती है जहाँ आप क्लिक करते हैं: दुश्मन, ज़मीन या खुली हवा। दुश्मन के सिर पर क्लिक करने से हेडशॉट गिना जाता है।",
        "बंदूक चुनने पर कर्सर निशाने के चिह्न में बदल जाता है।",
        "बंदूक की स्किल कर्सर की ओर चलती हैं।",
        "शिफ़्ट लॉक हटा दिया गया है। कैमरा वहीं रहता है जहाँ आप उसे रखते हैं।",
      ]],
      ["1113", "13 नवंबर 2026", "लड़ाई के एनिमेशन", [
        "आपका किरदार अब असली तलवार या फ़्लिंटलॉक पिस्तौल पकड़ता है।",
        "नए कॉम्बो: मुक्कों से जैब, क्रॉस, हुक और अपरकट, और चमकती लकीर वाला तलवार का तीन वार का कॉम्बो।",
        "पिस्तौल का झटका, नली की चमक, धुआँ, खाली कारतूस और दिखने वाली गोलियाँ।",
        "हर स्किल का अपना एनिमेशन है, और नुकसान अब वार लगने के पल पर होता है।",
      ]],
      ["1108", "8 नवंबर 2026", "असली जैसे किरदार", [
        "असली अनुपात, बारीक चेहरों, पाँच उँगलियों वाले हाथों और मुड़ने वाली कोहनियों और घुटनों के साथ नए सिरे से बने किरदार मॉडल।",
        "किरदार के रंग अब अवतार स्टूडियो में चुने गए रंगों से मेल खाते हैं।",
      ]],
      ["1107", "7 नवंबर 2026", "बेहतर परफ़ॉर्मेंस", [
        "गेम में आते ही शुरू होने वाली अटकन ठीक की गई।",
        "दुनिया अब बहुत कम टुकड़ों में बनती है, इसलिए गेम ज़्यादातर कंप्यूटरों पर तेज़ चलता है।",
      ]],
      ["1106", "6 नवंबर 2026", "जीवंत स्टार्टर द्वीप", [
        "घुमावदार छत वाले घर, पवनचक्कियाँ, गेहूँ का खेत और हवा में लहराती घास।",
        "पूरा दिन-रात चक्र: दिन, सूर्यास्त, रात और सूर्योदय, हर एक दस मिनट का।",
        "हवा में झूमती पत्तियों वाले घुमावदार जंगली पेड़।",
        "अवतार स्टूडियो में ज़्यादा विकल्प, जिनमें बाँह, पैर और धड़ की लंबाई, सिर का आकार और नए शरीर के प्रकार शामिल हैं।",
      ]],
    ]} />;
}

export function es() {
  return <Updates eyebrow="NOVEDADES" heading="Notas de actualización" cta="Jugar a la última versión"
    lead="Sea Legends se actualiza con frecuencia. Esta página recoge los cambios de cada actualización, de la más reciente a la más antigua."
    updates={[
      ["1122b", "22 de noviembre de 2026", "Paradas, ejecuciones y un nuevo aspecto en movimiento", [
        "Ahora cualquiera puede parar golpes: bloquea justo antes del impacto para no recibir daño y hacer tambalear al atacante. Para a un enemigo con menos del 10 % de salud y lo ejecutas.",
        "Una postura de bloqueo real con un escudo brillante, y una carrera con el cuerpo inclinado, los brazos bombeando y polvo a tus pies.",
        "El agua cobra vida: un gran chapuzón al lanzarte, ondas y espuma al nadar y salpicaduras al vadear en aguas poco profundas.",
        "Nuevos efectos para esquivas, saltos y aterrizajes, Aura de Hierro, Previsión, cambio de arma, subidas de nivel, misiones completadas y golpes y derrotas de enemigos.",
        "HUD pulido: barras brillantes con rastro de daño, aviso pulsante con poca salud, insignia de nivel y mensajes animados.",
      ]],
      ["1122", "22 de noviembre de 2026", "Combate naval, mapa del mundo y copias de seguridad", [
        "Ahora hay barcos saqueadores patrullando las aguas de cada isla. Haz clic mientras llevas el timón para disparar los cañones; hundir un saqueador da dinero y XP.",
        "Un mapa del mundo (M o el botón Mapa) muestra las islas, tu barco, los saqueadores y el objetivo de tu misión, junto a un diario de misiones.",
        "Descarga una copia de tu progreso desde el menú Esc y cárgala en otro navegador o dispositivo.",
        "Volumen separado para música y efectos de sonido. Los ajustes de volumen y gráficos ahora se recuerdan.",
        "Los gráficos bajan solos si el juego va lento (puedes desactivarlo).",
        "Las pantallas táctiles tienen botones para cada habilidad desbloqueada, la esquiva, el bloqueo y las habilidades entrenadas.",
      ]],
      ["1121", "21 de noviembre de 2026", "Páginas del sitio traducidas", [
        "Las páginas Acerca de, Contacto, guías, novedades y textos legales ahora siguen el idioma que elijas: inglés, hindi, español, francés o portugués.",
        "Un menú de idioma al pie de cada página. La elección se comparte con el juego.",
      ]],
      ["1120", "20 de noviembre de 2026", "Barcos renovados", [
        "Nuevos modelos de barco con cascos curvos, velas hinchadas, banderas con los colores de tu facción y timón. El bergantín tiene dos mástiles y cañones.",
        "Al elegir un barco en el muelle, zarpa en el agua abierta más cercana y te pone al timón.",
        "Los barcos ya no saltan cerca de la costa. Chocar con tierra detiene el barco y G te baja a tierra.",
        "Un nuevo menú del muelle y un indicador de navegación con tu velocidad y rumbo.",
      ]],
      ["1119", "19 de noviembre de 2026", "Idiomas y nuevas guías", [
        "El juego ya se puede jugar en inglés, hindi, español, francés o portugués. Elige el idioma en la pantalla de carga o en la barra superior.",
        "Nueva pantalla de carga con enlaces a las guías y a la información del sitio.",
        "Nuevas guías de islas, de enemigos y jefes, y de armas y habilidades.",
        "El arma especial ahora tiene un ataque básico desde la maestría 1: el Rayo Espiritual lanza un rayo de energía hacia el cursor con clic izquierdo o C. Antes no podía atacar hasta la maestría 5, así que no se podía ganar maestría.",
      ]],
      ["1117", "17 de noviembre de 2026", "Enemigos con vida, sonido y tutorial", [
        "Los enemigos ahora caminan con paso natural, se preparan antes de golpear (atento al destello rojo), se estremecen y retroceden al recibir golpes, y caen al ser derrotados.",
        "Si te alejas mientras un enemigo se prepara, el golpe falla.",
        "La cámara se acerca cuando hay un muro entre ella y tu personaje, y las balas ahora se detienen en muros, árboles y rocas.",
        "Música de fondo generada para cada isla y para mar abierto, sonido del mar cerca de la costa, pasos y sonidos de golpe distintos para cada arma. La música se puede desactivar en la barra superior.",
        "Un breve tutorial de primeros pasos para personajes nuevos.",
        "Las armas se desenfundan con una breve animación al cambiar.",
        "La puntería de la pistola sigue colinas y pendientes.",
      ]],
      ["1116", "16 de noviembre de 2026", "Pistola con apuntado por clic", [
        "La pistola ahora dispara justo donde haces clic: a un enemigo, al suelo o al aire. Los disparos a la cabeza cuentan al hacer clic en la cabeza de un enemigo.",
        "El cursor se convierte en una mira mientras llevas la pistola.",
        "Las habilidades de pistola disparan hacia el cursor.",
        "Se ha eliminado el bloqueo de cámara con Shift. La cámara se queda donde la dejas.",
      ]],
      ["1113", "13 de noviembre de 2026", "Animaciones de combate", [
        "Tu personaje ahora sujeta una espada o una pistola de chispa de verdad.",
        "Nuevos combos: jab, directo, gancho y uppercut con los puños, y un combo de tres golpes con espada con estela brillante.",
        "Retroceso de la pistola, fogonazos, humo, casquillos y balas visibles.",
        "Cada habilidad tiene su propia animación, y el daño ahora se aplica cuando el golpe conecta.",
      ]],
      ["1108", "8 de noviembre de 2026", "Personajes realistas", [
        "Modelos de personaje renovados con proporciones realistas, caras detalladas, manos de cinco dedos y codos y rodillas que se doblan.",
        "Los colores del personaje ahora coinciden con los que eliges en el Estudio de avatar.",
      ]],
      ["1107", "7 de noviembre de 2026", "Rendimiento más fluido", [
        "Corregidos los tirones que empezaban justo al entrar en el juego.",
        "El mundo se dibuja en muchas menos piezas, así que el juego va más rápido en la mayoría de ordenadores.",
      ]],
      ["1106", "6 de noviembre de 2026", "Una Isla Inicial con vida", [
        "Casitas de tejado curvo, molinos, un campo de trigo y hierba mecida por el viento.",
        "Un ciclo de día completo: diez minutos de día, atardecer, noche y amanecer.",
        "Árboles de la selva curvados con hojas que se mueven con el viento.",
        "Más opciones en el Estudio de avatar, como la longitud de brazos, piernas y torso, el tamaño de la cabeza y nuevos tipos de cuerpo.",
      ]],
    ]} />;
}

export function fr() {
  return <Updates eyebrow="NOUVEAUTÉS" heading="Notes de mise à jour" cta="Jouer à la dernière version"
    lead="Sea Legends est mis à jour régulièrement. Cette page liste les changements de chaque mise à jour, de la plus récente à la plus ancienne."
    updates={[
      ["1122b", "22 novembre 2026", "Parades, exécutions et un nouveau style en mouvement", [
        "Tout le monde peut désormais parer : bloquez juste avant l'impact pour ne subir aucun dégât et faire vaciller l'attaquant. Parez un ennemi sous 10 % de santé pour l'exécuter.",
        "Une vraie posture de garde avec un bouclier scintillant, et une course penchée vers l'avant, bras en action et poussière sous les pieds.",
        "L'eau prend vie : grosse gerbe quand vous plongez, ondes et écume en nageant, éclaboussures en traversant les hauts-fonds.",
        "Nouveaux effets pour les ruées, sauts et atterrissages, l'Aura de fer, la Prescience, le changement d'arme, les montées de niveau, les quêtes terminées, les coups et les défaites des ennemis.",
        "HUD peaufiné : barres brillantes avec traînée de dégâts, alerte pulsée à faible santé, badge de niveau et messages animés.",
      ]],
      ["1122", "22 novembre 2026", "Combat naval, carte du monde et sauvegardes", [
        "Des navires pillards patrouillent désormais autour de chaque île. Cliquez à la barre pour tirer au canon ; couler un pillard rapporte argent et XP.",
        "Une carte du monde (M ou le bouton Carte) montre les îles, votre bateau, les pillards et l'objectif de votre quête, à côté d'un journal de quêtes.",
        "Téléchargez une sauvegarde de votre progression depuis le menu Échap et chargez-la sur un autre navigateur ou appareil.",
        "Volumes séparés pour la musique et les effets sonores. Les réglages de volume et de graphismes sont désormais mémorisés.",
        "Les graphismes baissent automatiquement si le jeu ralentit (vous pouvez le désactiver).",
        "Les écrans tactiles ont des boutons pour chaque compétence débloquée, la ruée, le blocage et les capacités apprises.",
      ]],
      ["1121", "21 novembre 2026", "Pages du site traduites", [
        "Les pages À propos, Contact, guides, nouveautés et mentions légales suivent désormais la langue choisie : anglais, hindi, espagnol, français ou portugais.",
        "Un menu de langue en bas de chaque page. Le choix est partagé avec le jeu.",
      ]],
      ["1120", "20 novembre 2026", "Bateaux repensés", [
        "Nouveaux modèles de bateaux avec coques galbées, voiles gonflées, pavillons aux couleurs de votre faction et barre à roue. Le brigantin a deux mâts et des canons.",
        "Choisir un bateau au quai le met à l'eau au plus près et vous place à la barre.",
        "Les bateaux ne sautent plus près du rivage. Heurter la terre arrête le bateau, et G vous fait débarquer.",
        "Un nouveau menu du quai et un indicateur de navigation avec votre vitesse et votre cap.",
      ]],
      ["1119", "19 novembre 2026", "Langues et nouveaux guides", [
        "Le jeu est désormais disponible en anglais, hindi, espagnol, français et portugais. Choisissez la langue sur l'écran de chargement ou dans la barre supérieure.",
        "Nouvel écran de chargement avec des liens vers les guides et les informations du site.",
        "Nouveaux guides des îles, des ennemis et boss, et des armes et compétences.",
        "L'arme spéciale a maintenant une attaque de base dès la maîtrise 1 : le Trait spirituel lance un trait d'énergie vers le curseur au clic gauche ou avec C. Auparavant, elle ne pouvait pas attaquer avant la maîtrise 5, si bien que sa maîtrise était impossible à gagner.",
      ]],
      ["1117", "17 novembre 2026", "Ennemis vivants, son et tutoriel", [
        "Les ennemis marchent désormais d'un pas naturel, prennent leur élan avant de frapper (guettez l'éclair rouge), tressaillent et reculent quand ils sont touchés, et tombent une fois vaincus.",
        "Sortez de portée pendant l'élan d'un ennemi et son coup rate.",
        "La caméra se rapproche quand un mur se trouve entre elle et votre personnage, et les balles s'arrêtent désormais sur les murs, les arbres et les rochers.",
        "Une musique générée pour chaque île et pour la haute mer, le bruit des vagues près du rivage, des bruits de pas et des sons d'impact propres à chaque arme. La musique peut être coupée dans la barre supérieure.",
        "Un court tutoriel de premiers pas pour les nouveaux personnages.",
        "Les armes sont dégainées avec une courte animation lors du changement.",
        "La visée du pistolet suit les collines et les pentes.",
      ]],
      ["1116", "16 novembre 2026", "Pistolet à visée par clic", [
        "Le pistolet tire désormais exactement là où vous cliquez : un ennemi, le sol ou les airs. Les tirs à la tête comptent quand vous cliquez sur la tête d'un ennemi.",
        "Le curseur devient un viseur quand le pistolet est équipé.",
        "Les compétences de pistolet tirent vers le curseur.",
        "Le verrouillage de caméra par Maj a été supprimé. La caméra reste là où vous la placez.",
      ]],
      ["1113", "13 novembre 2026", "Animations de combat", [
        "Votre personnage tient désormais une vraie épée ou un vrai pistolet à silex.",
        "Nouveaux combos : jab, direct, crochet et uppercut aux poings, et un combo d'épée en trois coups avec une traînée lumineuse.",
        "Recul du pistolet, éclairs de bouche, fumée, douilles et balles visibles.",
        "Chaque compétence a sa propre animation, et les dégâts tombent désormais au moment de l'impact.",
      ]],
      ["1108", "8 novembre 2026", "Personnages réalistes", [
        "Modèles de personnages refaits avec des proportions réalistes, des visages détaillés, des mains à cinq doigts et des coudes et genoux articulés.",
        "Les couleurs du personnage correspondent désormais à celles choisies dans le Studio d'avatar.",
      ]],
      ["1107", "7 novembre 2026", "Des performances plus fluides", [
        "Correction des saccades qui commençaient juste après l'entrée en jeu.",
        "Le monde est dessiné en beaucoup moins de morceaux : le jeu tourne plus vite sur la plupart des ordinateurs.",
      ]],
      ["1106", "6 novembre 2026", "Une Île de départ vivante", [
        "Chaumières à toit arrondi, moulins, champ de blé et herbe balayée par le vent.",
        "Un cycle jour-nuit complet : dix minutes chacun pour le jour, le coucher du soleil, la nuit et l'aube.",
        "Arbres de jungle courbés aux feuilles qui ondulent au vent.",
        "Plus d'options dans le Studio d'avatar, dont la longueur des bras, des jambes et du torse, la taille de la tête et de nouvelles morphologies.",
      ]],
    ]} />;
}

export function pt() {
  return <Updates eyebrow="NOVIDADES" heading="Notas de atualização" cta="Jogar a versão mais recente"
    lead="Sea Legends é atualizado com frequência. Esta página lista o que mudou em cada atualização, da mais recente para a mais antiga."
    updates={[
      ["1122b", "22 de novembro de 2026", "Defesas perfeitas, execuções e um visual novo em movimento", [
        "Agora qualquer um pode defender no tempo certo: bloqueie logo antes do golpe para não sofrer dano e fazer o atacante cambalear. Defenda um inimigo com menos de 10% de vida para executá-lo.",
        "Uma postura de bloqueio de verdade com um escudo brilhante, e uma corrida inclinada, com braços em movimento e poeira nos pés.",
        "A água ganha vida: um grande respingo ao mergulhar, ondas e espuma ao nadar e respingos ao atravessar águas rasas.",
        "Novos efeitos para avanços, pulos e aterrissagens, Aura de Ferro, Previsão, troca de arma, subidas de nível, missões concluídas e golpes e derrotas de inimigos.",
        "HUD refinado: barras brilhantes com rastro de dano, alerta pulsante com pouca vida, selo de nível e mensagens animadas.",
      ]],
      ["1122", "22 de novembro de 2026", "Combate naval, mapa do mundo e backups", [
        "Navios saqueadores agora patrulham as águas ao redor de cada ilha. Clique no leme para disparar os canhões; afundar um saqueador rende dinheiro e XP.",
        "Um mapa do mundo (M ou o botão Mapa) mostra as ilhas, seu barco, os saqueadores e o alvo da sua missão, ao lado de um diário de missões.",
        "Baixe um backup do seu progresso no menu Esc e carregue-o em outro navegador ou dispositivo.",
        "Volume separado para música e efeitos sonoros. As configurações de volume e gráficos agora ficam salvas.",
        "Os gráficos diminuem sozinhos se o jogo ficar lento (você pode desativar isso).",
        "Telas de toque ganham botões para cada habilidade liberada, o avanço, o bloqueio e as habilidades treinadas.",
      ]],
      ["1121", "21 de novembro de 2026", "Páginas do site traduzidas", [
        "As páginas Sobre, Contato, guias, novidades e textos legais agora seguem o idioma escolhido: inglês, hindi, espanhol, francês ou português.",
        "Um menu de idioma no rodapé de cada página. A escolha é compartilhada com o jogo.",
      ]],
      ["1120", "20 de novembro de 2026", "Barcos refeitos", [
        "Novos modelos de barco com cascos curvos, velas cheias, bandeiras nas cores da sua facção e um timão. O bergantim tem dois mastros e canhões.",
        "Escolher um barco no cais o lança na água aberta mais próxima e coloca você no leme.",
        "Os barcos não pulam mais perto da costa. Bater em terra para o barco, e G leva você para terra firme.",
        "Um novo menu do cais e um painel de navegação com sua velocidade e direção.",
      ]],
      ["1119", "19 de novembro de 2026", "Idiomas e novos guias", [
        "O jogo agora pode ser jogado em inglês, hindi, espanhol, francês ou português. Escolha o idioma na tela de carregamento ou na barra superior.",
        "Nova tela de carregamento com links para os guias e as informações do site.",
        "Novos guias das ilhas, de inimigos e chefes, e de armas e habilidades.",
        "A arma especial agora tem um ataque básico desde a maestria 1: o Raio Espiritual dispara um raio de energia no cursor com clique esquerdo ou C. Antes, ela não atacava até a maestria 5, então não dava para ganhar maestria.",
      ]],
      ["1117", "17 de novembro de 2026", "Inimigos vivos, som e tutorial", [
        "Os inimigos agora andam com passos naturais, se preparam antes de golpear (fique de olho no brilho vermelho), vacilam e recuam ao ser atingidos e caem ao ser derrotados.",
        "Saia do alcance enquanto o inimigo se prepara e o golpe erra.",
        "A câmera se aproxima quando há uma parede entre ela e seu personagem, e as balas agora param em paredes, árvores e pedras.",
        "Música de fundo gerada para cada ilha e para o mar aberto, som do mar perto da costa, passos e sons de golpe diferentes para cada arma. A música pode ser desligada na barra superior.",
        "Um tutorial curto de primeiros passos para personagens novos.",
        "As armas são sacadas com uma animação curta ao trocar.",
        "A mira da pistola acompanha morros e encostas.",
      ]],
      ["1116", "16 de novembro de 2026", "Pistola com mira por clique", [
        "A pistola agora atira exatamente onde você clica: em um inimigo, no chão ou no ar. Tiros na cabeça contam quando você clica na cabeça de um inimigo.",
        "O cursor vira uma mira enquanto a pistola está equipada.",
        "As habilidades de pistola disparam na direção do cursor.",
        "O travamento de câmera com Shift foi removido. A câmera fica onde você a deixa.",
      ]],
      ["1113", "13 de novembro de 2026", "Animações de combate", [
        "Seu personagem agora segura uma espada ou uma pistola de pederneira de verdade.",
        "Novos combos: jab, direto, gancho e uppercut com os punhos, e um combo de espada de três golpes com rastro brilhante.",
        "Coice da pistola, clarões no cano, fumaça, cápsulas e balas visíveis.",
        "Cada habilidade tem sua própria animação, e o dano agora acontece quando o golpe acerta.",
      ]],
      ["1108", "8 de novembro de 2026", "Personagens realistas", [
        "Modelos de personagem refeitos com proporções realistas, rostos detalhados, mãos com cinco dedos e cotovelos e joelhos que dobram.",
        "As cores do personagem agora combinam com as que você escolhe no Estúdio de avatar.",
      ]],
      ["1107", "7 de novembro de 2026", "Desempenho mais suave", [
        "Corrigidos os travamentos que começavam logo depois de entrar no jogo.",
        "O mundo é desenhado em muito menos partes, então o jogo roda mais rápido na maioria dos computadores.",
      ]],
      ["1106", "6 de novembro de 2026", "Uma Ilha Inicial viva", [
        "Chalés de telhado curvo, moinhos, um campo de trigo e grama balançando ao vento.",
        "Um ciclo de dia completo: dez minutos cada de dia, pôr do sol, noite e nascer do sol.",
        "Árvores da selva curvadas com folhas que balançam ao vento.",
        "Mais opções no Estúdio de avatar, incluindo comprimento de braços, pernas e tronco, tamanho da cabeça e novos tipos de corpo.",
      ]],
    ]} />;
}

"use client";

import ContentLayout from "../content-layout";

export const titles = {
  hi: "गेम के बारे में | Sea Legends",
  es: "Acerca del juego | Sea Legends",
  fr: "À propos du jeu | Sea Legends",
  pt: "Sobre o jogo | Sea Legends",
};

export function hi() {
  return <ContentLayout eyebrow="प्रोजेक्ट के बारे में">
    <h1>Sea Legends के बारे में</h1>
    <p className="content-lead">Sea Legends ब्राउज़र में खेला जाने वाला एक मुफ़्त 3D एक्शन RPG है, जो द्वीपों की खोज, किरदार को अपने हिसाब से बनाने और क्वेस्ट पर आधारित लड़ाई के इर्द-गिर्द बना है। इसमें वैकल्पिक मल्टीप्लेयर वर्ल्ड सर्वर भी हैं।</p>
    <h2>गुट चुनें और अपना अवतार बनाएँ</h2>
    <p>खिलाड़ी समुद्री डाकू, मरीन या तटस्थ गुट चुन सकते हैं। समुद्री डाकुओं को क्वेस्ट में ज़्यादा पैसे मिलते हैं, जबकि मरीन एक अतिरिक्त डिफ़ेंस पॉइंट के साथ शुरू करते हैं। अवतार टूल से आप इंसानी किरदार बना सकते हैं, उसका प्रीव्यू देख सकते हैं और उसे बदल सकते हैं। रूप, लंबाई, बनावट और कपड़े किरदार की खूबियों पर असर डालते हैं।</p>
    <h2>फ़र्स्ट सी की खोज करें</h2>
    <p>फ़र्स्ट सी दस द्वीपों की एक श्रृंखला है। इनमें से पाँच पूरी तरह बने हुए हैं, जहाँ कस्बे, क्वेस्ट और दुश्मन हैं: स्टार्टर द्वीप, जंगल द्वीप, पाइरेट टाउन, रेगिस्तानी द्वीप और बर्फ़ीला गाँव। बाकी छोटे टापू हैं जिनके पास से आप नाव से गुज़र सकते हैं। खिलाड़ी खोजबीन कर सकते हैं, क्वेस्ट देने वालों से बात कर सकते हैं, अलग-अलग दुश्मनों से भिड़ सकते हैं और पानी पर सफ़र के लिए नावों का इस्तेमाल कर सकते हैं। गेम बढ़ने के साथ नए इलाके और क्वेस्ट जोड़े जाते हैं।</p>
    <h2>लड़ें, क्वेस्ट पूरे करें और आगे बढ़ें</h2>
    <p>लड़ाई में मुक्के, तलवार और बंदूक के हमले शामिल हैं। पहला क्वेस्ट, डाकुओं की मुसीबत, पाँच डाकुओं को हराने के लिए कहता है और इनाम में पैसे और अनुभव देता है। लेवल बढ़ने पर मुक्के, डिफ़ेंस, तलवार, बंदूक और स्पेशल क्षमताओं के लिए पॉइंट मिलते हैं। पहला क्वेस्ट पूरा करने के बाद एक स्पेशल हथियार मिलता है; बाकी चीज़ें खोलने की अपनी शर्तें हैं।</p>
    <h2>वैकल्पिक मल्टीप्लेयर</h2>
    <p>जब मल्टीप्लेयर सर्वर सेट हो, तो खिलाड़ी अधिकतम दस खिलाड़ियों वाले साझा वर्ल्ड सर्वर में शामिल होकर एक-दूसरे के अवतार और उनकी हलचल देख सकते हैं। लड़ाई, दुश्मन, क्वेस्ट की प्रगति, पैसा, इन्वेंटरी और सेव अब भी हर ब्राउज़र में अलग रहते हैं। मल्टीप्लेयर में प्रोफ़ाइल के नाम सत्यापित पहचान नहीं हैं।</p>
    <h2>लोकल प्रोफ़ाइल और सेव</h2>
    <p>प्रोफ़ाइल के नाम, अवतार और प्रगति आपके मौजूदा ब्राउज़र में सेव होते हैं, इसलिए साइन-अप की ज़रूरत नहीं है। सेव लोकल होने के कारण ये अलग-अलग डिवाइसों में सिंक नहीं होते। Sea Legends पर लगातार काम हो रहा है और समय के साथ फ़ीचर और संतुलन अपडेट होते रहते हैं।</p>
    <p><a className="content-button" href="/#game-root">गेम खोलें</a> <a href="/game-guide">खिलाड़ी गाइड पढ़ें</a></p>
  </ContentLayout>;
}

export function es() {
  return <ContentLayout eyebrow="SOBRE EL PROYECTO">
    <h1>Acerca de Sea Legends</h1>
    <p className="content-lead">Sea Legends es un RPG de acción en 3D gratuito para el navegador, centrado en explorar islas, personalizar tu personaje y combatir a través de misiones, con servidores multijugador opcionales.</p>
    <h2>Elige una facción y crea tu avatar</h2>
    <p>Puedes elegir entre Piratas, Marines o Neutral. Los Piratas reciben más dinero por las misiones, mientras que los Marines empiezan con un punto extra de defensa. Las herramientas de avatar te permiten crear, previsualizar y editar un personaje humano. La apariencia, la altura, la complexión y la ropa influyen en los atributos del personaje.</p>
    <h2>Explora el Primer Mar</h2>
    <p>El Primer Mar es una cadena de diez islas. Cinco están completamente construidas, con pueblos, misiones y enemigos: Isla Inicial, Isla de la Selva, Pueblo Pirata, Isla del Desierto y Aldea Nevada. Las demás son islotes pequeños junto a los que puedes navegar. Puedes explorar, hablar con quienes dan misiones, enfrentarte a distintos grupos de enemigos y usar barcos para viajar por el agua. Se añaden nuevas zonas y misiones a medida que el juego crece.</p>
    <h2>Lucha, completa misiones y progresa</h2>
    <p>El combate incluye ataques con puños, espada y pistola. La misión inicial, Problemas con bandidos, te pide derrotar a cinco bandidos y te recompensa con dinero y experiencia. Al subir de nivel ganas puntos para puños, defensa, espada, pistola y habilidades especiales. Un arma especial se desbloquea al completar la misión inicial; otros desbloqueos tienen requisitos adicionales.</p>
    <h2>Multijugador opcional</h2>
    <p>Cuando hay un servidor multijugador configurado, puedes unirte a un mundo compartido con un máximo de diez jugadores y ver los avatares y movimientos de los demás. El combate, los enemigos, el progreso de las misiones, el dinero, el inventario y las partidas guardadas siguen siendo locales en cada navegador. Los nombres de perfil en el multijugador no son identidades verificadas.</p>
    <h2>Perfiles y partidas locales</h2>
    <p>Los nombres de perfil, los avatares y el progreso se guardan en tu navegador actual, así que no necesitas registrarte. Como las partidas son locales, no se sincronizan entre dispositivos. Sea Legends está en desarrollo activo y sus funciones y su equilibrio se actualizan con el tiempo.</p>
    <p><a className="content-button" href="/#game-root">Abrir el juego</a> <a href="/game-guide">Leer la guía del jugador</a></p>
  </ContentLayout>;
}

export function fr() {
  return <ContentLayout eyebrow="À PROPOS DU PROJET">
    <h1>À propos de Sea Legends</h1>
    <p className="content-lead">Sea Legends est un RPG d'action 3D gratuit dans le navigateur, axé sur l'exploration d'îles, la personnalisation du personnage et des combats guidés par les quêtes, avec des serveurs multijoueurs facultatifs.</p>
    <h2>Choisissez une faction et créez votre avatar</h2>
    <p>Vous pouvez choisir les Pirates, les Marines ou Neutre. Les Pirates gagnent plus d'argent grâce aux quêtes, tandis que les Marines commencent avec un point de défense supplémentaire. Les outils d'avatar permettent de créer, prévisualiser et modifier un personnage humain. L'apparence, la taille, la carrure et la tenue influencent les attributs du personnage.</p>
    <h2>Explorez la Première Mer</h2>
    <p>La Première Mer est une chaîne de dix îles. Cinq d'entre elles sont entièrement aménagées, avec des villes, des quêtes et des ennemis : l'Île de départ, l'Île de la Jungle, Ville Pirate, l'Île du Désert et le Village enneigé. Les autres sont de petits îlots que vous pouvez longer en bateau. Vous pouvez explorer, parler aux donneurs de quêtes, affronter différents groupes d'ennemis et utiliser des bateaux pour voyager sur l'eau. De nouvelles zones et quêtes sont ajoutées au fil du développement.</p>
    <h2>Combattez, terminez des quêtes et progressez</h2>
    <p>Le combat comprend des attaques aux poings, à l'épée et au pistolet. La première quête, Ennuis de bandits, vous demande de vaincre cinq bandits et rapporte de l'argent et de l'expérience. Chaque niveau gagné donne des points à répartir entre poings, défense, épée, pistolet et capacités spéciales. Une arme spéciale se débloque après la première quête ; les autres déblocages ont leurs propres conditions.</p>
    <h2>Multijoueur facultatif</h2>
    <p>Lorsqu'un serveur multijoueur est configuré, vous pouvez rejoindre un monde partagé limité à dix joueurs et voir les avatars et les déplacements des autres. Le combat, les ennemis, la progression des quêtes, l'argent, l'inventaire et les sauvegardes restent propres à chaque navigateur. Les noms de profil en multijoueur ne sont pas des identités vérifiées.</p>
    <h2>Profils et sauvegardes locaux</h2>
    <p>Les noms de profil, les avatars et la progression sont enregistrés dans votre navigateur actuel : aucune inscription n'est nécessaire. Comme les sauvegardes sont locales, elles ne se synchronisent pas entre appareils. Sea Legends est en développement actif, et ses fonctionnalités et son équilibrage évoluent avec le temps.</p>
    <p><a className="content-button" href="/#game-root">Ouvrir le jeu</a> <a href="/game-guide">Lire le guide du joueur</a></p>
  </ContentLayout>;
}

export function pt() {
  return <ContentLayout eyebrow="SOBRE O PROJETO">
    <h1>Sobre Sea Legends</h1>
    <p className="content-lead">Sea Legends é um RPG de ação 3D gratuito para navegador, focado em explorar ilhas, personalizar o personagem e lutar através de missões, com servidores multijogador opcionais.</p>
    <h2>Escolha uma facção e crie seu avatar</h2>
    <p>Você pode escolher Piratas, Fuzileiros ou Neutro. Os Piratas ganham mais dinheiro nas missões, enquanto os Fuzileiros começam com um ponto extra de defesa. As ferramentas de avatar permitem criar, pré-visualizar e editar um personagem humano. Aparência, altura, porte físico e roupa influenciam os atributos do personagem.</p>
    <h2>Explore o Primeiro Mar</h2>
    <p>O Primeiro Mar é uma cadeia de dez ilhas. Cinco delas estão totalmente construídas, com vilas, missões e inimigos: Ilha Inicial, Ilha da Selva, Cidade Pirata, Ilha do Deserto e Vila Nevada. As outras são ilhotas pequenas pelas quais você pode passar navegando. Você pode explorar, falar com quem dá missões, enfrentar diferentes grupos de inimigos e usar barcos para viajar pela água. Novas áreas e missões são adicionadas conforme o jogo cresce.</p>
    <h2>Lute, complete missões e evolua</h2>
    <p>O combate inclui ataques com punhos, espada e pistola. A missão inicial, Encrenca com bandidos, pede que você derrote cinco bandidos e dá dinheiro e experiência como recompensa. Ao subir de nível você ganha pontos para punhos, defesa, espada, pistola e habilidades especiais. Uma arma especial é liberada após a missão inicial; outros desbloqueios têm requisitos adicionais.</p>
    <h2>Multijogador opcional</h2>
    <p>Quando há um servidor multijogador configurado, você pode entrar em um mundo compartilhado com até dez jogadores e ver os avatares e movimentos dos outros. O combate, os inimigos, o progresso das missões, o dinheiro, o inventário e os saves continuam locais em cada navegador. Os nomes de perfil no multijogador não são identidades verificadas.</p>
    <h2>Perfis e saves locais</h2>
    <p>Nomes de perfil, avatares e progresso ficam salvos no seu navegador atual, então não é preciso criar conta. Como os saves são locais, eles não sincronizam entre dispositivos. Sea Legends está em desenvolvimento ativo, e os recursos e o equilíbrio são atualizados com o tempo.</p>
    <p><a className="content-button" href="/#game-root">Abrir o jogo</a> <a href="/game-guide">Ler o guia do jogador</a></p>
  </ContentLayout>;
}

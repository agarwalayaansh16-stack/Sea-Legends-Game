"use client";

import ContentLayout from "../content-layout";

export const titles = {
  hi: "गोपनीयता नीति | Sea Legends",
  es: "Política de privacidad | Sea Legends",
  fr: "Politique de confidentialité | Sea Legends",
  pt: "Política de privacidade | Sea Legends",
};

const ext = { rel: "noopener noreferrer", target: "_blank" };

export function hi() {
  return <ContentLayout eyebrow="गोपनीयता">
    <h1>गोपनीयता नीति</h1><p className="content-updated">पिछला अपडेट: 19 नवंबर 2026</p>
    <p className="content-updated">यह अनुवाद सुविधा के लिए है। अगर यह अंग्रेज़ी संस्करण से अलग हो, तो अंग्रेज़ी संस्करण मान्य होगा।</p>
    <p className="content-lead">यह नीति बताती है कि Sea Legends कौन-सी जानकारी सेव करता है, साइट किन तीसरे पक्ष की सेवाओं का इस्तेमाल करती है और आपके पास क्या विकल्प हैं।</p>

    <h2>आपके ब्राउज़र में सेव जानकारी</h2>
    <p>गेम प्रोफ़ाइल के नाम, चुनी हुई प्रोफ़ाइल, अवतार के विकल्प, गेम की प्रगति, इन-गेम मार्केटप्लेस का डेटा और आपकी सेटिंग्स (भाषा, संगीत चालू या बंद, और ट्यूटोरियल पूरा हुआ या नहीं) के लिए आपके ब्राउज़र की लोकल स्टोरेज का इस्तेमाल करता है। यह जानकारी आपके डिवाइस पर ही रहती है। यह किसी गेम अकाउंट सर्वर पर नहीं भेजी जाती और डिवाइसों के बीच सिंक नहीं होती। ब्राउज़र का साइट डेटा साफ़ करने से यह मिट जाती है। कृपया प्रोफ़ाइल के नाम के रूप में अपना असली नाम इस्तेमाल न करें।</p>
    <p>प्रोफ़ाइल पासवर्ड से सुरक्षित अकाउंट नहीं हैं। गेम के पुराने संस्करण पासवर्ड और रिकवरी फ़ील्ड लोकल रूप से सेव करते थे; मौजूदा गेम लोड होते समय इन फ़ील्ड को अपने आप हटा देता है।</p>

    <h2>मल्टीप्लेयर</h2>
    <p>जब आप किसी मल्टीप्लेयर वर्ल्ड सर्वर से जुड़ते हैं, तो गेम आपका प्रोफ़ाइल नाम, गुट, अवतार का रूप, स्थिति, दिशा और चुना हुआ हथियार मल्टीप्लेयर सेवा को भेजता है, ताकि उसी सर्वर के दूसरे खिलाड़ी आपका किरदार देख सकें। सेवा यह जानकारी सिर्फ़ तब तक मेमोरी में रखती है जब तक आप जुड़े रहते हैं, और जुड़ते समय आपका प्रोफ़ाइल नाम और रूम लॉग कर सकती है। मल्टीप्लेयर की स्थिति सर्वर पर सेव नहीं होती।</p>

    <h2>विज्ञापन और कुकीज़</h2>
    <p>यह साइट विज्ञापन दिखाने के लिए Google AdSense का इस्तेमाल करती है। Google और उसके पार्टनर, तीसरे पक्ष के विक्रेताओं के रूप में, इस और दूसरी वेबसाइटों पर आपकी पिछली विज़िट के आधार पर विज्ञापन दिखाने के लिए कुकीज़ और इसी तरह की तकनीकों का इस्तेमाल करते हैं। Google की विज्ञापन कुकीज़ उसे और उसके पार्टनर को इस साइट और/या इंटरनेट की दूसरी साइटों पर आपकी विज़िट के आधार पर आपको विज्ञापन दिखाने देती हैं।</p>
    <p>आप <a href="https://adssettings.google.com" {...ext}>Google विज्ञापन सेटिंग्स</a> पर जाकर व्यक्तिगत विज्ञापनों से बाहर हो सकते हैं, या <a href="https://www.aboutads.info/choices/" {...ext}>www.aboutads.info</a> पर कुछ तीसरे पक्ष के विक्रेताओं की कुकीज़ के इस्तेमाल से बाहर हो सकते हैं। Google अपनी सेवाओं का इस्तेमाल करने वाली साइटों की जानकारी कैसे इस्तेमाल करता है, यह जानने के लिए <a href="https://policies.google.com/technologies/partner-sites" {...ext}>यह पेज</a> देखें।</p>
    <p>यूरोपीय आर्थिक क्षेत्र, यूनाइटेड किंगडम और स्विट्ज़रलैंड के विज़िटर से व्यक्तिगत विज्ञापन या विज्ञापन कुकीज़ के इस्तेमाल से पहले एक सहमति संदेश के ज़रिए सहमति माँगी जाती है। आप उस संदेश में दिखने वाले गोपनीयता सेटिंग लिंक से कभी भी अपनी पसंद बदल सकते हैं।</p>

    <h2>तीसरे पक्ष की दूसरी सेवाएँ</h2>
    <p>साइट Three.js ग्राफ़िक्स लाइब्रेरी cdnjs से और वेब फ़ॉन्ट Google Fonts से लोड करती है। जब आपका ब्राउज़र इनकी फ़ाइलें माँगता है, तो इन प्रदाताओं को सामान्य तकनीकी जानकारी मिलती है, जैसे आपका IP पता और ब्राउज़र का प्रकार। साइट पहुँचाने के लिए हमारा होस्टिंग प्रदाता भी कनेक्शन डेटा प्रोसेस करता है। Sea Legends अपना कोई एनालिटिक्स नहीं चलाता।</p>

    <h2>बच्चे</h2>
    <p>Sea Legends सभी के लिए बना गेम है और 13 साल से कम उम्र के बच्चों के लिए नहीं है। हम जानबूझकर बच्चों की निजी जानकारी इकट्ठा नहीं करते। प्रोफ़ाइल सिर्फ़ आपके ब्राउज़र में सेव होती हैं, इसलिए कृपया गेम में कहीं भी असली नाम, ईमेल पता, फ़ोन नंबर या पासवर्ड न डालें।</p>

    <h2>बदलाव और संपर्क</h2>
    <p>अगर साइट के डेटा से जुड़े तरीके बदलते हैं, तो हम यह पेज अपडेट करेंगे। गोपनीयता से जुड़े सवालों के लिए <a href="/contact">संपर्क पेज</a> पर दी गई जानकारी का इस्तेमाल करें।</p>
  </ContentLayout>;
}

export function es() {
  return <ContentLayout eyebrow="PRIVACIDAD">
    <h1>Política de privacidad</h1><p className="content-updated">Última actualización: 19 de noviembre de 2026</p>
    <p className="content-updated">Esta traducción se ofrece por comodidad. Si difiere de la versión en inglés, prevalece la versión en inglés.</p>
    <p className="content-lead">Esta política explica qué información guarda Sea Legends, qué servicios de terceros usa el sitio y qué opciones tienes.</p>

    <h2>Información guardada en tu navegador</h2>
    <p>El juego usa el almacenamiento local de tu navegador para los nombres de perfil, el perfil seleccionado, las opciones del avatar, el progreso, los datos del mercado del juego y tus ajustes (idioma, música activada o no y si has terminado el tutorial). Esta información se queda en tu dispositivo. No se envía a ningún servidor de cuentas del juego ni se sincroniza entre dispositivos. Si borras los datos del sitio en tu navegador, se elimina. Por favor, no uses tu nombre real como nombre de perfil.</p>
    <p>Los perfiles no son cuentas protegidas con contraseña. Versiones anteriores del juego guardaban localmente campos de contraseña y recuperación; el juego actual los elimina automáticamente al cargarse.</p>

    <h2>Multijugador</h2>
    <p>Cuando te unes a un servidor multijugador, el juego envía al servicio multijugador tu nombre de perfil, facción, apariencia del avatar, posición, orientación y arma seleccionada, para que los demás jugadores del mismo servidor vean a tu personaje. El servicio guarda estos datos solo en memoria mientras estás conectado y puede registrar tu nombre de perfil y la sala al entrar. El estado multijugador no se guarda en el servidor.</p>

    <h2>Publicidad y cookies</h2>
    <p>Este sitio usa Google AdSense para mostrar anuncios. Google y sus socios, como proveedores externos, usan cookies y tecnologías similares para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Las cookies publicitarias de Google le permiten a Google y a sus socios mostrarte anuncios según tus visitas a este sitio y/o a otros sitios de internet.</p>
    <p>Puedes desactivar la publicidad personalizada en la <a href="https://adssettings.google.com" {...ext}>configuración de anuncios de Google</a>, o desactivar el uso de cookies de algunos proveedores externos para publicidad personalizada en <a href="https://www.aboutads.info/choices/" {...ext}>www.aboutads.info</a>. Para saber cómo usa Google la información de los sitios que utilizan sus servicios, consulta <a href="https://policies.google.com/technologies/partner-sites" {...ext}>cómo usa Google la información de sitios o aplicaciones que utilizan sus servicios</a>.</p>
    <p>A los visitantes del Espacio Económico Europeo, el Reino Unido y Suiza se les pide su consentimiento mediante un mensaje antes de usar anuncios personalizados o cookies publicitarias. Puedes cambiar tu elección en cualquier momento con el enlace de ajustes de privacidad que muestra ese mensaje.</p>

    <h2>Otros servicios de terceros</h2>
    <p>El sitio carga la biblioteca gráfica Three.js desde cdnjs y las fuentes web desde Google Fonts. Estos proveedores reciben información técnica estándar, como tu dirección IP y tu tipo de navegador, cuando tu navegador solicita sus archivos. Nuestro proveedor de alojamiento también procesa datos de conexión para servir el sitio. Sea Legends no usa analíticas propias.</p>

    <h2>Menores</h2>
    <p>Sea Legends es un juego para público general y no está dirigido a menores de 13 años. No recopilamos a sabiendas información personal de menores. Como los perfiles solo se guardan en tu navegador, no escribas nombres reales, correos electrónicos, números de teléfono ni contraseñas en ninguna parte del juego.</p>

    <h2>Cambios y contacto</h2>
    <p>Actualizaremos esta página si cambian las prácticas de datos del sitio. Para preguntas sobre privacidad, usa los datos de la <a href="/contact">página de contacto</a>.</p>
  </ContentLayout>;
}

export function fr() {
  return <ContentLayout eyebrow="CONFIDENTIALITÉ">
    <h1>Politique de confidentialité</h1><p className="content-updated">Dernière mise à jour : 19 novembre 2026</p>
    <p className="content-updated">Cette traduction est fournie pour plus de commodité. En cas de différence, la version anglaise fait foi.</p>
    <p className="content-lead">Cette politique explique quelles informations Sea Legends enregistre, quels services tiers le site utilise et quels choix s'offrent à vous.</p>

    <h2>Informations enregistrées dans votre navigateur</h2>
    <p>Le jeu utilise le stockage local de votre navigateur pour les noms de profil, le profil sélectionné, les choix d'avatar, la progression, les données du marché du jeu et vos réglages (langue, musique activée ou non, tutoriel terminé ou non). Ces informations restent sur votre appareil. Elles ne sont pas envoyées à un serveur de comptes et ne se synchronisent pas entre appareils. Effacer les données du site dans votre navigateur les supprime. Merci de ne pas utiliser votre vrai nom comme nom de profil.</p>
    <p>Les profils ne sont pas des comptes protégés par mot de passe. D'anciennes versions du jeu stockaient localement des champs de mot de passe et de récupération ; le jeu actuel les supprime automatiquement au chargement.</p>

    <h2>Multijoueur</h2>
    <p>Lorsque vous rejoignez un serveur multijoueur, le jeu envoie au service multijoueur votre nom de profil, votre faction, l'apparence de votre avatar, votre position, votre orientation et votre arme sélectionnée, afin que les autres joueurs du serveur voient votre personnage. Le service conserve ces données uniquement en mémoire pendant votre connexion et peut journaliser votre nom de profil et votre salle à l'arrivée. L'état multijoueur n'est pas enregistré sur le serveur.</p>

    <h2>Publicité et cookies</h2>
    <p>Ce site utilise Google AdSense pour afficher des annonces. Google et ses partenaires, en tant que fournisseurs tiers, utilisent des cookies et des technologies similaires pour diffuser des annonces basées sur vos visites précédentes sur ce site et d'autres sites. Les cookies publicitaires de Google lui permettent, ainsi qu'à ses partenaires, de vous proposer des annonces en fonction de vos visites sur ce site et/ou d'autres sites Internet.</p>
    <p>Vous pouvez désactiver la publicité personnalisée dans les <a href="https://adssettings.google.com" {...ext}>paramètres des annonces Google</a>, ou refuser l'utilisation de cookies par certains fournisseurs tiers sur <a href="https://www.aboutads.info/choices/" {...ext}>www.aboutads.info</a>. Pour savoir comment Google utilise les informations des sites qui utilisent ses services, consultez <a href="https://policies.google.com/technologies/partner-sites" {...ext}>cette page</a>.</p>
    <p>Les visiteurs de l'Espace économique européen, du Royaume-Uni et de la Suisse sont invités à donner leur consentement via un message avant toute publicité personnalisée ou tout cookie publicitaire. Vous pouvez modifier votre choix à tout moment grâce au lien de paramètres de confidentialité affiché par ce message.</p>

    <h2>Autres services tiers</h2>
    <p>Le site charge la bibliothèque graphique Three.js depuis cdnjs et les polices web depuis Google Fonts. Ces fournisseurs reçoivent des informations techniques standard, comme votre adresse IP et votre type de navigateur, lorsque votre navigateur demande leurs fichiers. Notre hébergeur traite également des données de connexion pour diffuser le site. Sea Legends n'utilise pas d'outil d'analyse propre.</p>

    <h2>Enfants</h2>
    <p>Sea Legends est un jeu tout public et ne s'adresse pas aux enfants de moins de 13 ans. Nous ne collectons pas sciemment d'informations personnelles sur des enfants. Comme les profils sont stockés uniquement dans votre navigateur, n'indiquez ni vrai nom, ni adresse e-mail, ni numéro de téléphone, ni mot de passe dans le jeu.</p>

    <h2>Modifications et contact</h2>
    <p>Nous mettrons cette page à jour si les pratiques du site en matière de données changent. Pour toute question sur la confidentialité, utilisez les coordonnées de la <a href="/contact">page Contact</a>.</p>
  </ContentLayout>;
}

export function pt() {
  return <ContentLayout eyebrow="PRIVACIDADE">
    <h1>Política de privacidade</h1><p className="content-updated">Última atualização: 19 de novembro de 2026</p>
    <p className="content-updated">Esta tradução é oferecida por conveniência. Se houver diferença, vale a versão em inglês.</p>
    <p className="content-lead">Esta política explica quais informações o Sea Legends guarda, quais serviços de terceiros o site usa e quais escolhas você tem.</p>

    <h2>Informações guardadas no seu navegador</h2>
    <p>O jogo usa o armazenamento local do seu navegador para nomes de perfil, o perfil selecionado, as escolhas de avatar, o progresso, os dados do mercado do jogo e suas configurações (idioma, música ligada ou não e se você terminou o tutorial). Essas informações ficam no seu dispositivo. Elas não são enviadas a um servidor de contas do jogo nem sincronizadas entre dispositivos. Limpar os dados do site no navegador as apaga. Por favor, não use seu nome real como nome de perfil.</p>
    <p>Os perfis não são contas protegidas por senha. Versões anteriores do jogo guardavam localmente campos de senha e recuperação; o jogo atual remove esses campos automaticamente ao carregar.</p>

    <h2>Multijogador</h2>
    <p>Quando você entra em um servidor multijogador, o jogo envia ao serviço multijogador seu nome de perfil, facção, aparência do avatar, posição, direção e arma selecionada, para que os outros jogadores do mesmo servidor vejam seu personagem. O serviço mantém esses dados apenas na memória enquanto você está conectado e pode registrar seu nome de perfil e a sala ao entrar. O estado do multijogador não é salvo no servidor.</p>

    <h2>Publicidade e cookies</h2>
    <p>Este site usa o Google AdSense para exibir anúncios. O Google e seus parceiros, como fornecedores terceiros, usam cookies e tecnologias semelhantes para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Os cookies de publicidade do Google permitem que ele e seus parceiros exibam anúncios com base nas suas visitas a este site e/ou a outros sites da internet.</p>
    <p>Você pode desativar a publicidade personalizada nas <a href="https://adssettings.google.com" {...ext}>configurações de anúncios do Google</a>, ou desativar o uso de cookies por alguns fornecedores terceiros em <a href="https://www.aboutads.info/choices/" {...ext}>www.aboutads.info</a>. Para saber como o Google usa informações de sites que utilizam seus serviços, veja <a href="https://policies.google.com/technologies/partner-sites" {...ext}>esta página</a>.</p>
    <p>Visitantes do Espaço Econômico Europeu, do Reino Unido e da Suíça recebem uma mensagem pedindo consentimento antes do uso de anúncios personalizados ou cookies de publicidade. Você pode mudar sua escolha a qualquer momento pelo link de configurações de privacidade exibido nessa mensagem.</p>

    <h2>Outros serviços de terceiros</h2>
    <p>O site carrega a biblioteca gráfica Three.js a partir do cdnjs e fontes web do Google Fonts. Esses provedores recebem informações técnicas padrão, como seu endereço IP e tipo de navegador, quando seu navegador solicita os arquivos. Nosso provedor de hospedagem também processa dados de conexão para entregar o site. O Sea Legends não usa ferramentas de análise próprias.</p>

    <h2>Crianças</h2>
    <p>Sea Legends é um jogo para o público geral e não é direcionado a crianças menores de 13 anos. Não coletamos intencionalmente informações pessoais de crianças. Como os perfis ficam apenas no seu navegador, não digite nomes reais, e-mails, números de telefone ou senhas em nenhuma parte do jogo.</p>

    <h2>Mudanças e contato</h2>
    <p>Atualizaremos esta página se as práticas de dados do site mudarem. Para dúvidas sobre privacidade, use as informações da <a href="/contact">página de contato</a>.</p>
  </ContentLayout>;
}

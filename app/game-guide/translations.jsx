"use client";

import ContentLayout from "../content-layout";

export const titles = {
  hi: "गेम गाइड और कंट्रोल | Sea Legends",
  es: "Guía del juego y controles | Sea Legends",
  fr: "Guide du jeu et commandes | Sea Legends",
  pt: "Guia do jogo e controles | Sea Legends",
};

function ControlsTable({ head, rows }) {
  return <div className="content-table-wrap"><table><thead><tr><th scope="col">{head[0]}</th><th scope="col">{head[1]}</th></tr></thead><tbody>
    {rows.map(([input, action]) => <tr key={input}><td>{input}</td><td>{action}</td></tr>)}
  </tbody></table></div>;
}

export function hi() {
  return <ContentLayout eyebrow="खिलाड़ी गाइड">
    <h1>Sea Legends गेम गाइड</h1>
    <p className="content-lead">Sea Legends शुरू करने के लिए ज़रूरी सब कुछ: कंट्रोल, गुट, आपका पहला क्वेस्ट, लड़ाई, सफ़र और सेव। गेम के विकास के साथ सामग्री और संतुलन अपडेट होते रहते हैं।</p>

    <h2>शुरुआत</h2>
    <ol>
      <li>कोई लोकल प्रोफ़ाइल चुनें या बनाएँ। यह सिर्फ़ इस ब्राउज़र में एक सेव चुनता है; यह ऑनलाइन लॉगिन नहीं है।</li>
      <li>एक अवतार चुनें, उसका रूप बदलें, और समुद्री डाकू, मरीन या तटस्थ चुनें।</li>
      <li>स्टार्टर द्वीप पर फ़र्स्ट सी में प्रवेश करें और क्वेस्ट मार्कर के सहारे क्वेस्ट देने वाले तक जाएँ।</li>
    </ol>
    <p>नए किरदारों को एक छोटा <strong>शुरुआत</strong> कार्ड मिलता है, जो चलना, चारों ओर देखना, कूदना, हमला करना और पहला क्वेस्ट ढूँढना सिखाता है। हर कदम पूरा करते ही उस पर निशान लग जाता है, और आप इसे कभी भी छोड़ सकते हैं।</p>

    <h2>गुट और अवतार बनाना</h2>
    <p>समुद्री डाकुओं को क्वेस्ट से ज़्यादा पैसे मिलते हैं। मरीन एक अतिरिक्त डिफ़ेंस पॉइंट के साथ शुरू करते हैं। मौजूदा शुरुआती नियमों में तटस्थ को कोई गुट बोनस नहीं मिलता। अवतार एडिटर से आप इंसानी अवतार बना और बदल सकते हैं, जिसमें रंग, बाल, कपड़े, लंबाई और बनावट शामिल हैं। लंबाई, बनावट और कपड़े किरदार की खूबियों पर असर डालते हैं; एडिटर का प्रीव्यू सिर्फ़ दिखावट के लिए है और लड़ाई के किसी खास नतीजे की गारंटी नहीं देता।</p>

    <h2>कंट्रोल</h2>
    <ControlsTable head={["इनपुट", "काम"]} rows={[
      ["W, A, S, D", "चलें; नाव चलाते समय दिशा बदलें"],
      ["माउस का दायाँ बटन दबाकर खींचें", "कैमरा घुमाएँ"],
      ["बायाँ क्लिक", "चुने हुए हथियार से हमला करें (लगातार हमले के लिए दबाए रखें)। बंदूक से गोली ठीक वहीं जाती है जहाँ आप क्लिक करते हैं।"],
      ["Space", "कूदें"],
      ["E", "पास के व्यक्ति या चीज़ से बातचीत करें"],
      ["1 / 2 / 3 / 4", "मुक्के / तलवार / बंदूक / खुला हुआ स्पेशल हथियार चुनें"],
      ["Shift", "दौड़ना चालू करें; छोड़ने पर फिर से चलें"],
      ["F", "बचाव"],
      ["Q", "डैश"],
      ["Z / X / C / V", "एक्टिव स्किल, खुलने के बाद"],
      ["H / K / T", "आयरन ऑरा / फ़ोरसाइट / फ़्लैश स्टेप, सीखने के बाद"],
      ["R", "हमला"],
      ["G", "पास होने पर नाव पर चढ़ें या उतरें"],
      ["M", "दुनिया का नक्शा और क्वेस्ट सूची खोलें"],
      ["Esc", "पॉज़/सेटिंग मेन्यू खोलें या बंद करें"],
    ]} />
    <p>टच स्क्रीन पर चलने, हमला करने, कूदने, बातचीत करने और हथियार चुनने के लिए स्क्रीन के बटन इस्तेमाल करें; नज़ारा घुमाने के लिए स्क्रीन पर उँगली खींचें। खुली हुई स्किल, डैश, बचाव और सीखी हुई क्षमताओं के अपने बटन हमला बटन के ऊपर हैं, और नक्शा बटन दुनिया का नक्शा खोलता है। टच स्क्रीन पर बंदूक से, जहाँ गोली चलानी हो वहाँ टैप करें, या दिख रहे सबसे पास के दुश्मन पर निशाना लगाने के लिए हमला बटन दबाएँ।</p>

    <h2>खोज और सफ़र</h2>
    <p>फ़र्स्ट सी में अलग-अलग ज़मीन और दुश्मनों वाले द्वीपों की एक श्रृंखला है। दिशा जानने के लिए क्वेस्ट कम्पास और मार्कर का इस्तेमाल करें; <a href="/guides/islands">द्वीप गाइड</a> हर द्वीप के बारे में बताती है। डॉक पर नाव डीलर से बात करें और छोटी नाव, नाविक नाव या ब्रिगेड जहाज़ चुनें। नाव सबसे पास के खुले पानी में उतरती है और आप तुरंत पतवार संभाल लेते हैं। W और S से आगे-पीछे चलें, A और D से दिशा बदलें, और G से किनारे उतरें। नाव के पास दोबारा पहुँचकर G या बोर्ड बटन दबाएँ और फिर से सवार हो जाएँ। M दबाएँ, या ऊपर की बार में नक्शा बटन, तो दुनिया का नक्शा खुलता है जिसमें द्वीप, आपकी नाव और क्वेस्ट का लक्ष्य दिखते हैं, साथ में मौजूदा, उपलब्ध और आने वाले क्वेस्ट की सूची।</p>

    <h2>समुद्री लड़ाई</h2>
    <p>लुटेरे जहाज़ हर द्वीप के आसपास के पानी में गश्त करते हैं। पतवार संभालते समय क्लिक करें, तो आपकी तोपें उस जगह या सबसे पास के लुटेरे जहाज़ पर दागी जाती हैं (टच स्क्रीन पर हमला बटन दबाएँ)। छोटी नाव एक बार में एक गोला दागती है, नाविक नाव दो और ब्रिगेड जहाज़ तीन। लुटेरे आपके चारों ओर घूमकर जवाबी गोले दागते हैं, इसलिए चलते रहें। एक जहाज़ डुबोने पर पैसे और XP मिलते हैं; कठिन द्वीपों के पास के लुटेरे ज़्यादा मज़बूत हैं और ज़्यादा इनाम देते हैं, और डूबे हुए लुटेरे कुछ देर बाद लौट आते हैं।</p>

    <h2>लड़ाई और दुश्मन</h2>
    <p>1, 2 या 3 से मुक्के, तलवार या बंदूक चुनें, फिर बाएँ क्लिक या R से हमला करें। जल्दी-जल्दी क्लिक करने पर हमले एक कॉम्बो बन जाते हैं: मुक्कों से जैब, क्रॉस, हुक और अपरकट, या तलवार के तीन वार। बंदूक आपके कर्सर के नीचे वाली जगह पर चलती है और दुश्मन के सिर पर क्लिक करने पर 1.5× हेडशॉट लगता है; गोलियाँ दीवारों, पेड़ों और चट्टानों पर रुक जाती हैं।</p>
    <p>पास आने पर दुश्मन आपका पीछा करते हैं। सामान्य वार से पहले दुश्मन तैयारी करता है और उसके ऊपर एक <strong>लाल चमक</strong> दिखती है। उसी पल पहुँच से बाहर हो जाएँ, डैश करें या बचाव करें, तो वार चूक जाता है। आपके वार से दुश्मन लड़खड़ाकर पीछे हटते हैं। हारे हुए दुश्मन गिर जाते हैं और कुछ सेकंड बाद लौट आते हैं, और बॉस 45 सेकंड बाद। स्पेशल हथियार पहला क्वेस्ट पूरा करने के बाद मिलता है; बाकी स्किल की अपनी अनलॉक और कूलडाउन शर्तें हैं। ज़्यादा जानकारी के लिए <a href="/guides/weapons-and-skills">हथियार और कौशल गाइड</a> और <a href="/guides/enemies-and-bosses">दुश्मन और बॉस गाइड</a> देखें।</p>

    <h2>क्वेस्ट और प्रगति</h2>
    <p>स्टार्टर द्वीप पर क्वेस्ट देने वाले के पास E दबाएँ और <strong>डाकुओं की मुसीबत</strong> स्वीकार करें। पाँच शुरुआती डाकुओं को हराएँ, फिर 180 पैसे और 120 XP लेने के लिए क्वेस्ट देने वाले के पास लौटें। बाकी क्वेस्ट तय लेवल पर खुलते हैं और आगे के इलाकों में दुश्मनों या बॉस को हराने के लिए कहते हैं; गेम में अभी ऐसी गिनी-चुनी लड़ाइयाँ हैं। XP से आपका लेवल बढ़ता है और स्टैट पॉइंट मिलते हैं। स्टैट हैं: मुक्के, डिफ़ेंस, तलवार, बंदूक और स्पेशल क्षमताएँ। कुछ क्षमताओं और चीज़ों की अपनी अनलॉक शर्तें हैं।</p>

    <h2>इन्वेंटरी और मार्केटप्लेस</h2>
    <p>हथियारों की श्रेणियाँ, चीज़ें और महारत देखने के लिए गेम के मेन्यू से इन्वेंटरी खोलें। अवतार मार्केटप्लेस में गेम के किरदारों के बेचे जा रहे कपड़े दिखते हैं। ये सूचियाँ आपके ब्राउज़र में ही बनती हैं; असली पैसों का कोई लेन-देन नहीं है।</p>

    <h2>मल्टीप्लेयर वर्ल्ड सर्वर</h2>
    <p>अगर साइट पर मल्टीप्लेयर चालू है, तो गेम में आते ही आप किसी उपलब्ध फ़र्स्ट सी सर्वर से जुड़ जाते हैं। कमरों में कितने खिलाड़ी हैं यह देखने या दूसरे सर्वर में जाने के लिए गेम की सेटिंग बार में <strong>सर्वर</strong> इस्तेमाल करें। हर कमरे में अधिकतम दस खिलाड़ी होते हैं। एक ही कमरे के खिलाड़ी एक-दूसरे के अवतार और हलचल देख सकते हैं। दुश्मन, लड़ाई, क्वेस्ट की प्रगति, पैसा, इन्वेंटरी और सेव फिर भी हर ब्राउज़र में अलग रहते हैं। अगर मल्टीप्लेयर सेट नहीं है या सेवा बंद है, तो गेम लोकल मोड में खेला जा सकता है।</p>

    <h2>सेव और प्रोफ़ाइल</h2>
    <p>प्रोफ़ाइल के नाम, अवतार के विकल्प और गेम की प्रगति इस ब्राउज़र की लोकल स्टोरेज में रहते हैं। ये किसी सर्वर से सिंक नहीं होते और ईमेल से वापस नहीं पाए जा सकते। आगे खेलने के लिए वही ब्राउज़र प्रोफ़ाइल इस्तेमाल करें। साइट डेटा साफ़ करने या दूसरा ब्राउज़र या डिवाइस इस्तेमाल करने से प्रगति मिट या छिप सकती है। असली पासवर्ड या संवेदनशील निजी जानकारी न डालें। अपनी प्रगति सुरक्षित रखने या दूसरे ब्राउज़र या डिवाइस पर ले जाने के लिए Esc मेन्यू खोलें, <strong>बैकअप डाउनलोड करें</strong> चुनें, फिर दूसरे डिवाइस पर <strong>बैकअप लोड करें</strong> इस्तेमाल करें।</p>

    <h2>भाषा, संगीत और सेटिंग</h2>
    <p>गेम अंग्रेज़ी, हिन्दी, स्पैनिश, फ़्रेंच या पुर्तगाली में खेला जा सकता है। लोडिंग स्क्रीन पर, ऊपर की बार के भाषा मेन्यू में या इस पेज के नीचे भाषा चुनें; आपकी पसंद इस ब्राउज़र में याद रहती है। ऊपर की बार में बैकग्राउंड संगीत, कंट्रोल पैनल और क्वेस्ट पैनल के स्विच भी हैं, और Esc मेन्यू में ग्राफ़िक्स क्वालिटी है, जो गेम धीमा चलने पर अपने आप कम हो जाती है (आप इसे बंद कर सकते हैं), साथ ही आवाज़, संगीत और ध्वनि प्रभावों के अलग-अलग स्तर। ये सेटिंग इस ब्राउज़र में याद रहती हैं।</p>

    <h2>समस्याओं का हल</h2>
    <ul>
      <li><strong>गेम शुरू नहीं होता:</strong> Three.js CDN अनुरोध की अनुमति दें और देखें कि ब्राउज़र WebGL सपोर्ट करता है, फिर पेज रीलोड करें।</li>
      <li><strong>प्रगति गायब है:</strong> पक्का करें कि आप वही ब्राउज़र प्रोफ़ाइल और वही लोकल प्रोफ़ाइल नाम इस्तेमाल कर रहे हैं; प्राइवेट ब्राउज़िंग और साफ़ किया गया साइट डेटा लोकल सेव मिटा सकते हैं।</li>
      <li><strong>कंट्रोल काम नहीं करते:</strong> गेम वाली जगह पर क्लिक करें, कोई खुला मेन्यू बंद करें और देखें कि कोई टेक्स्ट फ़ील्ड चुना हुआ न हो। कीबोर्ड और माउस मुख्य कंट्रोल हैं।</li>
      <li><strong>धीमा या अटकता ग्राफ़िक्स:</strong> ग्राफ़िक्स वाले दूसरे भारी टैब बंद करें और गेम की सेटिंग में ग्राफ़िक्स क्वालिटी कम करें।</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Sea Legends खेलें</a></p>
  </ContentLayout>;
}

export function es() {
  return <ContentLayout eyebrow="GUÍA DEL JUGADOR">
    <h1>Guía del juego Sea Legends</h1>
    <p className="content-lead">Todo lo que necesitas para empezar en Sea Legends: controles, facciones, tu primera misión, combate, viajes y partidas guardadas. El contenido y el equilibrio se actualizan a medida que el juego avanza.</p>

    <h2>Primeros pasos</h2>
    <ol>
      <li>Elige o crea un perfil local. Solo selecciona una partida en este navegador; no es un inicio de sesión en línea.</li>
      <li>Elige un avatar, ajusta su aspecto y selecciona Piratas, Marines o Neutral.</li>
      <li>Entra en el Primer Mar en la Isla Inicial y sigue el marcador de misión hasta quien da las misiones.</li>
    </ol>
    <p>Los personajes nuevos reciben una pequeña tarjeta de <strong>Primeros pasos</strong> que enseña a moverse, mirar alrededor, saltar, atacar y encontrar la primera misión. Cada paso se marca al completarlo y puedes saltártela en cualquier momento.</p>

    <h2>Facciones y creación del avatar</h2>
    <p>Los Piratas reciben más dinero de las misiones. Los Marines empiezan con un punto extra de defensa. Neutral no tiene bonificación de facción en la lógica inicial actual. El editor de avatares te permite crear y editar avatares humanos, incluidos colores, pelo, ropa, altura y complexión. La altura, la complexión y la ropa influyen en los atributos del personaje; la vista previa del editor es visual y no garantiza un resultado concreto en combate.</p>

    <h2>Controles</h2>
    <ControlsTable head={["Entrada", "Acción"]} rows={[
      ["W, A, S, D", "Moverse; girar al llevar el timón de un barco"],
      ["Arrastrar con el botón derecho", "Girar la cámara"],
      ["Clic izquierdo", "Atacar con el arma seleccionada (mantén pulsado para seguir atacando). Con la pistola, el disparo va justo donde haces clic."],
      ["Espacio", "Saltar"],
      ["E", "Interactuar con una persona u objeto cercano"],
      ["1 / 2 / 3 / 4", "Elegir puños / espada / pistola / arma especial desbloqueada"],
      ["Shift", "Pasar a correr; suelta para volver a caminar"],
      ["F", "Bloquear"],
      ["Q", "Esquiva"],
      ["Z / X / C / V", "Habilidades activas, una vez desbloqueadas"],
      ["H / K / T", "Aura de Hierro / Previsión / Paso Relámpago, una vez entrenados"],
      ["R", "Atacar"],
      ["G", "Subir a un barco o bajar de él cuando estás cerca"],
      ["M", "Abrir el mapa del mundo y el diario de misiones"],
      ["Esc", "Abrir o cerrar el menú de pausa y ajustes"],
    ]} />
    <p>En pantallas táctiles, usa los controles en pantalla para moverte, atacar, saltar, interactuar y elegir arma; arrastra por la escena para girar la vista. Las habilidades desbloqueadas, la esquiva, el bloqueo y las habilidades entrenadas tienen sus propios botones sobre el de atacar, y el botón Mapa abre el mapa del mundo. Con la pistola en pantalla táctil, toca donde quieras disparar o pulsa Atacar para apuntar al enemigo visible más cercano.</p>

    <h2>Exploración y viajes</h2>
    <p>El Primer Mar contiene una cadena de islas con distintos terrenos y grupos de enemigos. Usa la brújula y el marcador de misión para orientarte; la <a href="/guides/islands">guía de islas</a> describe cada isla. En el muelle, habla con el vendedor de barcos y elige un bote, un barco de marinero o un bergantín. Zarpa en el agua abierta más cercana y tomas el timón al instante. W y S para avanzar y retroceder, A y D para girar, y G para bajar a tierra. Cuando vuelvas a estar cerca de tu barco, pulsa G o el botón de subir a bordo. Pulsa M, o el botón Mapa de la barra superior, para ver un mapa del mundo con las islas, tu barco y el objetivo de tu misión, junto a un diario con las misiones actuales, disponibles y próximas.</p>

    <h2>Combate naval</h2>
    <p>Los barcos saqueadores patrullan las aguas de cada isla. Mientras llevas el timón, haz clic para disparar los cañones al punto donde haces clic o al saqueador más cercano (en pantallas táctiles, pulsa Atacar). Un bote dispara una bala por andanada, un barco de marinero dos y un bergantín tres. Los saqueadores te rodean y devuelven el fuego, así que no te quedes quieto. Hundir uno da dinero y XP; los saqueadores cerca de las islas difíciles son más duros y pagan más, y los hundidos vuelven al cabo de un rato.</p>

    <h2>Combate y enemigos</h2>
    <p>Elige puños, espada o pistola con 1, 2 o 3 y ataca con clic izquierdo o R. Si vuelves a hacer clic rápido, encadenas un combo: jab, directo, gancho y uppercut con los puños, o tres tajos con la espada. La pistola dispara al punto bajo el cursor y hace un disparo a la cabeza de 1,5× si haces clic en la cabeza de un enemigo; las balas se detienen en muros, árboles y rocas.</p>
    <p>Los enemigos te persiguen cuando te acercas. Antes de un golpe normal, el enemigo se prepara y aparece un <strong>destello rojo</strong> sobre él. Aléjate, esquiva o bloquea en ese momento y el golpe fallará. Tus golpes hacen que los enemigos se estremezcan y retrocedan. Los enemigos derrotados caen y vuelven a los pocos segundos, y los jefes a los 45 segundos. El arma especial se desbloquea tras la misión inicial; las demás habilidades tienen sus propios requisitos de desbloqueo y tiempos de recarga. Para más detalles, consulta la <a href="/guides/weapons-and-skills">guía de armas y habilidades</a> y la <a href="/guides/enemies-and-bosses">guía de enemigos y jefes</a>.</p>

    <h2>Misiones y progreso</h2>
    <p>En la Isla Inicial, pulsa E junto a quien da las misiones y acepta <strong>Problemas con bandidos</strong>. Derrota a cinco bandidos y vuelve para cobrar 180 de dinero y 120 de XP. Otras misiones se desbloquean en niveles concretos y piden derrotar enemigos o jefes en zonas posteriores; por ahora el juego incluye un número limitado de estos encuentros. La XP sube tu nivel y te da puntos de atributo. Los atributos son puños, defensa, espada, pistola y habilidades especiales. Algunas habilidades y objetos tienen requisitos de desbloqueo adicionales.</p>

    <h2>Inventario y mercado</h2>
    <p>Abre el Inventario desde el menú del juego para revisar las categorías de armas, los objetos y la maestría. El mercado de avatares muestra ropa puesta a la venta por personajes del juego. Las ofertas se generan en tu navegador; no hay comercio con dinero real.</p>

    <h2>Servidores multijugador</h2>
    <p>Si el multijugador está activado en el sitio, al entrar al juego te conectas a un servidor disponible del Primer Mar. Usa <strong>Servidores</strong> en la barra de ajustes del juego para ver la ocupación de las salas o unirte a otro servidor. Cada sala admite como máximo diez jugadores. Los jugadores de la misma sala ven los avatares y movimientos de los demás. Los enemigos, el combate, el progreso de las misiones, el dinero, el inventario y las partidas siguen siendo independientes en cada navegador. Si el multijugador no está configurado o el servicio no funciona, el juego sigue siendo jugable en modo local.</p>

    <h2>Partidas y perfiles</h2>
    <p>Los nombres de perfil, los avatares elegidos y el progreso se guardan en el almacenamiento local de este navegador. No se sincronizan con ningún servidor ni se pueden recuperar por correo electrónico. Usa el mismo perfil de navegador para continuar. Borrar los datos del sitio o usar otro navegador o dispositivo puede eliminar u ocultar el progreso. No introduzcas contraseñas reales ni información personal sensible. Para proteger tu progreso o llevarlo a otro navegador o dispositivo, abre el menú Esc, elige <strong>Descargar copia</strong> y luego usa <strong>Cargar copia</strong> en el otro dispositivo.</p>

    <h2>Idioma, música y ajustes</h2>
    <p>El juego se puede jugar en inglés, hindi, español, francés o portugués. Elige el idioma en la pantalla de carga, en el menú de idioma de la barra superior o al pie de esta página; tu elección se recuerda en este navegador. La barra superior también tiene interruptores para la música de fondo, el panel de controles y el panel de misiones, y el menú Esc incluye la calidad gráfica, que baja sola si el juego va lento salvo que lo desactives, y niveles separados de volumen, música y efectos de sonido. Estos ajustes se recuerdan en este navegador.</p>

    <h2>Solución de problemas</h2>
    <ul>
      <li><strong>El juego no arranca:</strong> permite la solicitud a la CDN de Three.js, comprueba que tu navegador admite WebGL y vuelve a cargar.</li>
      <li><strong>Falta el progreso:</strong> comprueba que usas el mismo perfil de navegador y el mismo nombre de perfil local; la navegación privada y el borrado de datos pueden eliminar las partidas locales.</li>
      <li><strong>Los controles no responden:</strong> haz clic en la zona del juego, cierra cualquier menú abierto y comprueba que no haya un campo de texto activo. El teclado y el ratón son los controles principales.</li>
      <li><strong>Imagen lenta o inestable:</strong> cierra otras pestañas con muchos gráficos y baja la calidad gráfica en los ajustes del juego.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Jugar a Sea Legends</a></p>
  </ContentLayout>;
}

export function fr() {
  return <ContentLayout eyebrow="GUIDE DU JOUEUR">
    <h1>Guide du jeu Sea Legends</h1>
    <p className="content-lead">Tout ce qu'il faut pour bien débuter dans Sea Legends : commandes, factions, première quête, combat, déplacements et sauvegardes. Le contenu et l'équilibrage évoluent avec le développement du jeu.</p>

    <h2>Premiers pas</h2>
    <ol>
      <li>Choisissez ou créez un profil local. Il sélectionne simplement une sauvegarde dans ce navigateur ; ce n'est pas une connexion en ligne.</li>
      <li>Choisissez un avatar, ajustez son apparence et sélectionnez Pirates, Marines ou Neutre.</li>
      <li>Entrez dans la Première Mer sur l'Île de départ et suivez le marqueur de quête jusqu'au donneur de quêtes.</li>
    </ol>
    <p>Les nouveaux personnages reçoivent une petite carte <strong>Premiers pas</strong> qui montre comment se déplacer, regarder autour de soi, sauter, attaquer et trouver la première quête. Chaque étape se coche quand vous la réalisez, et vous pouvez la passer à tout moment.</p>

    <h2>Factions et création d'avatar</h2>
    <p>Les Pirates gagnent plus d'argent grâce aux quêtes. Les Marines commencent avec un point de défense supplémentaire. Neutre n'a pas de bonus de faction dans la logique de départ actuelle. L'éditeur d'avatar permet de créer et modifier des avatars humains : couleurs, cheveux, tenue, taille et carrure. La taille, la carrure et la tenue influencent les attributs du personnage ; l'aperçu de l'éditeur est visuel et ne garantit aucun résultat en combat.</p>

    <h2>Commandes</h2>
    <ControlsTable head={["Touche", "Action"]} rows={[
      ["W, A, S, D", "Se déplacer ; diriger un bateau à la barre"],
      ["Glisser avec le clic droit", "Faire pivoter la caméra"],
      ["Clic gauche", "Attaquer avec l'arme sélectionnée (maintenir pour continuer). Au pistolet, le tir part exactement là où vous cliquez."],
      ["Espace", "Sauter"],
      ["E", "Interagir avec une personne ou un objet proche"],
      ["1 / 2 / 3 / 4", "Choisir poings / épée / pistolet / arme spéciale débloquée"],
      ["Maj", "Passer au sprint ; relâcher pour revenir à la marche"],
      ["F", "Bloquer"],
      ["Q", "Ruée"],
      ["Z / X / C / V", "Compétences actives, une fois débloquées"],
      ["H / K / T", "Aura de fer / Prescience / Pas éclair, une fois appris"],
      ["R", "Attaquer"],
      ["G", "Monter à bord d'un bateau ou en descendre quand vous êtes à côté"],
      ["M", "Ouvrir la carte du monde et le journal de quêtes"],
      ["Échap", "Ouvrir ou fermer le menu pause et réglages"],
    ]} />
    <p>Sur écran tactile, utilisez les commandes à l'écran pour vous déplacer, attaquer, sauter, interagir et choisir une arme ; faites glisser sur la scène pour tourner la vue. Les compétences débloquées, la ruée, le blocage et les capacités apprises ont leurs propres boutons au-dessus du bouton d'attaque, et le bouton Carte ouvre la carte du monde. Au pistolet sur écran tactile, touchez l'endroit où tirer, ou appuyez sur Attaquer pour viser l'ennemi visible le plus proche.</p>

    <h2>Exploration et déplacements</h2>
    <p>La Première Mer compte une chaîne d'îles aux terrains et ennemis variés. Utilisez la boussole et le marqueur de quête pour vous orienter ; le <a href="/guides/islands">guide des îles</a> décrit chaque île. Au quai, parlez au marchand de bateaux et choisissez un canot, un bateau de marin ou un brigantin. Il est mis à l'eau au plus près et vous prenez aussitôt la barre. W et S pour avancer et reculer, A et D pour diriger, et G pour débarquer. Une fois de retour près de votre bateau, appuyez sur G ou sur le bouton d'embarquement pour remonter à bord. Appuyez sur M, ou sur le bouton Carte de la barre supérieure, pour afficher une carte du monde avec les îles, votre bateau et l'objectif de votre quête, à côté d'un journal des quêtes en cours, disponibles et à venir.</p>

    <h2>Combat naval</h2>
    <p>Des navires pillards patrouillent autour de chaque île. À la barre, cliquez pour tirer au canon à l'endroit visé ou sur le pillard le plus proche (sur écran tactile, appuyez sur Attaquer). Un canot tire un boulet par salve, un bateau de marin deux et un brigantin trois. Les pillards vous tournent autour et ripostent : restez en mouvement. En couler un rapporte argent et XP ; les pillards près des îles difficiles sont plus coriaces et paient davantage, et les navires coulés reviennent au bout d'un moment.</p>

    <h2>Combat et ennemis</h2>
    <p>Choisissez poings, épée ou pistolet avec 1, 2 ou 3, puis attaquez avec un clic gauche ou R. En recliquant rapidement, vous enchaînez un combo : jab, direct, crochet et uppercut aux poings, ou trois coups d'épée. Le pistolet tire à l'endroit sous votre curseur et inflige un tir à la tête à 1,5× si vous cliquez sur la tête d'un ennemi ; les balles s'arrêtent sur les murs, les arbres et les rochers.</p>
    <p>Les ennemis vous poursuivent quand vous approchez. Avant un coup normal, l'ennemi prend son élan et un <strong>éclair rouge</strong> apparaît au-dessus de lui. Reculez, faites une ruée ou bloquez à ce moment-là et le coup ratera. Vos coups font tressaillir et reculer les ennemis. Les ennemis vaincus tombent et reviennent après quelques secondes, et les boss après 45 secondes. L'arme spéciale se débloque après la première quête ; les autres compétences ont leurs propres conditions de déblocage et temps de recharge. Pour plus de détails, consultez le <a href="/guides/weapons-and-skills">guide des armes et compétences</a> et le <a href="/guides/enemies-and-bosses">guide des ennemis et boss</a>.</p>

    <h2>Quêtes et progression</h2>
    <p>Sur l'Île de départ, appuyez sur E près du donneur de quêtes et acceptez <strong>Ennuis de bandits</strong>. Battez cinq bandits, puis revenez chercher 180 pièces et 120 XP. D'autres quêtes se débloquent à certains niveaux et demandent de vaincre des ennemis ou des boss dans les zones suivantes ; le jeu propose pour l'instant un nombre limité de ces rencontres. L'XP augmente votre niveau et donne des points de statistiques : poings, défense, épée, pistolet et capacités spéciales. Certaines capacités et certains objets ont des conditions de déblocage supplémentaires.</p>

    <h2>Inventaire et marché</h2>
    <p>Ouvrez l'Inventaire depuis le menu du jeu pour consulter les catégories d'armes, les objets et la maîtrise. Le marché d'avatars propose des tenues mises en vente par des personnages du jeu. Les offres sont générées dans votre navigateur ; il n'y a aucun échange d'argent réel.</p>

    <h2>Serveurs multijoueurs</h2>
    <p>Si le multijoueur est activé sur le site, vous rejoignez un serveur disponible de la Première Mer en entrant dans le jeu. Utilisez <strong>Serveurs</strong> dans la barre de réglages pour voir l'occupation des salles ou en rejoindre une autre. Chaque salle accueille au maximum dix joueurs. Les joueurs d'une même salle voient les avatars et les déplacements des autres. Les ennemis, le combat, la progression des quêtes, l'argent, l'inventaire et les sauvegardes restent propres à chaque navigateur. Si le multijoueur n'est pas configuré ou que le service est hors ligne, le jeu reste jouable en mode local.</p>

    <h2>Sauvegardes et profils</h2>
    <p>Les noms de profil, les avatars choisis et la progression sont conservés dans le stockage local de ce navigateur. Ils ne sont pas synchronisés avec un serveur et ne peuvent pas être récupérés par e-mail. Utilisez le même profil de navigateur pour continuer. Effacer les données du site ou changer de navigateur ou d'appareil peut supprimer ou masquer votre progression. Ne saisissez ni vrai mot de passe ni information personnelle sensible. Pour protéger votre progression ou la transférer vers un autre navigateur ou appareil, ouvrez le menu Échap, choisissez <strong>Télécharger la sauvegarde</strong>, puis utilisez <strong>Charger une sauvegarde</strong> sur l'autre appareil.</p>

    <h2>Langue, musique et réglages</h2>
    <p>Le jeu est disponible en anglais, hindi, espagnol, français et portugais. Choisissez la langue sur l'écran de chargement, dans le menu de langue de la barre supérieure ou en bas de cette page ; votre choix est mémorisé dans ce navigateur. La barre supérieure propose aussi des interrupteurs pour la musique, le panneau des commandes et le panneau des quêtes, et le menu Échap contient la qualité graphique, qui baisse d'elle-même si le jeu ralentit (sauf si vous le désactivez), ainsi que des niveaux séparés pour le volume, la musique et les effets sonores. Ces réglages sont mémorisés dans ce navigateur.</p>

    <h2>Dépannage</h2>
    <ul>
      <li><strong>Le jeu ne démarre pas :</strong> autorisez la requête vers le CDN de Three.js, vérifiez que le navigateur prend en charge WebGL, puis rechargez.</li>
      <li><strong>La progression a disparu :</strong> vérifiez que vous utilisez le même profil de navigateur et le même nom de profil local ; la navigation privée et l'effacement des données peuvent supprimer les sauvegardes locales.</li>
      <li><strong>Les commandes ne répondent pas :</strong> cliquez dans la zone de jeu, fermez tout menu ouvert et vérifiez qu'aucun champ de texte n'est actif. Le clavier et la souris sont les commandes principales.</li>
      <li><strong>Affichage lent ou instable :</strong> fermez les autres onglets gourmands en graphismes et baissez la qualité graphique dans les réglages du jeu.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Jouer à Sea Legends</a></p>
  </ContentLayout>;
}

export function pt() {
  return <ContentLayout eyebrow="GUIA DO JOGADOR">
    <h1>Guia do jogo Sea Legends</h1>
    <p className="content-lead">Tudo o que você precisa para começar em Sea Legends: controles, facções, sua primeira missão, combate, viagens e saves. O conteúdo e o equilíbrio são atualizados conforme o jogo evolui.</p>

    <h2>Primeiros passos</h2>
    <ol>
      <li>Escolha ou crie um perfil local. Ele apenas seleciona um save neste navegador; não é um login online.</li>
      <li>Escolha um avatar, ajuste a aparência e selecione Piratas, Fuzileiros ou Neutro.</li>
      <li>Entre no Primeiro Mar na Ilha Inicial e siga o marcador de missão até quem dá as missões.</li>
    </ol>
    <p>Personagens novos recebem um pequeno cartão de <strong>Primeiros passos</strong> que ensina a andar, olhar ao redor, pular, atacar e encontrar a primeira missão. Cada etapa é marcada quando você a conclui, e você pode pular a qualquer momento.</p>

    <h2>Facções e criação do avatar</h2>
    <p>Os Piratas ganham mais dinheiro nas missões. Os Fuzileiros começam com um ponto extra de defesa. Neutro não tem bônus de facção na lógica inicial atual. O editor de avatar permite criar e editar avatares humanos, incluindo cores, cabelo, roupa, altura e porte físico. Altura, porte e roupa influenciam os atributos do personagem; a prévia do editor é visual e não garante nenhum resultado em combate.</p>

    <h2>Controles</h2>
    <ControlsTable head={["Comando", "Ação"]} rows={[
      ["W, A, S, D", "Andar; virar ao pilotar um barco"],
      ["Arrastar com o botão direito", "Girar a câmera"],
      ["Clique esquerdo", "Atacar com a arma selecionada (segure para continuar atacando). Com a pistola, o tiro vai exatamente onde você clica."],
      ["Espaço", "Pular"],
      ["E", "Interagir com uma pessoa ou objeto próximo"],
      ["1 / 2 / 3 / 4", "Escolher punhos / espada / pistola / arma especial desbloqueada"],
      ["Shift", "Passar a correr; solte para voltar a andar"],
      ["F", "Bloquear"],
      ["Q", "Avanço"],
      ["Z / X / C / V", "Habilidades ativas, depois de desbloqueadas"],
      ["H / K / T", "Aura de Ferro / Previsão / Passo Relâmpago, depois de treinados"],
      ["R", "Atacar"],
      ["G", "Embarcar ou desembarcar quando estiver perto do barco"],
      ["M", "Abrir o mapa do mundo e o diário de missões"],
      ["Esc", "Abrir ou fechar o menu de pausa e configurações"],
    ]} />
    <p>Em telas sensíveis ao toque, use os controles na tela para andar, atacar, pular, interagir e escolher a arma; arraste pela cena para girar a visão. As habilidades liberadas, o avanço, o bloqueio e as habilidades treinadas têm seus próprios botões acima do botão de ataque, e o botão Mapa abre o mapa do mundo. Com a pistola na tela de toque, toque onde quer atirar ou aperte Atacar para mirar no inimigo visível mais próximo.</p>

    <h2>Exploração e viagens</h2>
    <p>O Primeiro Mar tem uma cadeia de ilhas com terrenos e grupos de inimigos diferentes. Use a bússola e o marcador de missão para se orientar; o <a href="/guides/islands">guia das ilhas</a> descreve cada ilha. No cais, fale com o vendedor de barcos e escolha um bote, um barco de marinheiro ou um bergantim. Ele é lançado na água aberta mais próxima e você assume o leme na hora. W e S para avançar e recuar, A e D para virar, e G para desembarcar. Quando estiver perto do barco de novo, aperte G ou o botão de embarcar para voltar a bordo. Aperte M, ou o botão Mapa na barra superior, para ver um mapa do mundo com as ilhas, seu barco e o alvo da sua missão, ao lado de um diário com as missões atuais, disponíveis e futuras.</p>

    <h2>Combate naval</h2>
    <p>Navios saqueadores patrulham as águas ao redor de cada ilha. No leme, clique para disparar os canhões no ponto clicado ou no saqueador mais próximo (em telas de toque, aperte Atacar). Um bote dispara uma bala por rajada, um barco de marinheiro duas e um bergantim três. Os saqueadores rodeiam você e revidam, então continue se movendo. Afundar um rende dinheiro e XP; os saqueadores perto das ilhas difíceis são mais fortes e pagam mais, e os afundados voltam depois de um tempo.</p>

    <h2>Combate e inimigos</h2>
    <p>Escolha punhos, espada ou pistola com 1, 2 ou 3 e ataque com clique esquerdo ou R. Clicando de novo rapidamente, você encadeia um combo: jab, direto, gancho e uppercut com os punhos, ou três golpes de espada. A pistola atira no ponto sob o cursor e faz um tiro na cabeça de 1,5× quando você clica na cabeça de um inimigo; as balas param em paredes, árvores e pedras.</p>
    <p>Os inimigos perseguem você quando você se aproxima. Antes de um golpe normal, o inimigo se prepara e um <strong>brilho vermelho</strong> aparece acima dele. Saia do alcance, use o avanço ou bloqueie nesse momento e o golpe erra. Seus golpes fazem os inimigos vacilar e recuar. Inimigos derrotados caem e voltam depois de alguns segundos, e os chefes depois de 45 segundos. A arma especial é liberada após a missão inicial; as outras habilidades têm seus próprios requisitos de desbloqueio e tempos de recarga. Para mais detalhes, veja o <a href="/guides/weapons-and-skills">guia de armas e habilidades</a> e o <a href="/guides/enemies-and-bosses">guia de inimigos e chefes</a>.</p>

    <h2>Missões e progresso</h2>
    <p>Na Ilha Inicial, aperte E perto de quem dá as missões e aceite <strong>Encrenca com bandidos</strong>. Derrote cinco bandidos e volte para receber 180 de dinheiro e 120 de XP. Outras missões são liberadas em níveis específicos e pedem inimigos ou chefes em áreas posteriores; por enquanto o jogo tem um número limitado desses encontros. A XP aumenta seu nível e dá pontos de atributo: punhos, defesa, espada, pistola e habilidades especiais. Algumas habilidades e itens têm requisitos de desbloqueio adicionais.</p>

    <h2>Inventário e mercado</h2>
    <p>Abra o Inventário pelo menu do jogo para ver as categorias de armas, os itens e a maestria. O mercado de avatares mostra roupas anunciadas por personagens do jogo. Os anúncios são gerados no seu navegador; não há comércio com dinheiro real.</p>

    <h2>Servidores multijogador</h2>
    <p>Se o multijogador estiver ativado no site, ao entrar no jogo você se conecta a um servidor disponível do Primeiro Mar. Use <strong>Servidores</strong> na barra de configurações do jogo para ver a ocupação das salas ou entrar em outro servidor. Cada sala comporta no máximo dez jogadores. Jogadores da mesma sala veem os avatares e movimentos uns dos outros. Inimigos, combate, progresso das missões, dinheiro, inventário e saves continuam independentes em cada navegador. Se o multijogador não estiver configurado ou o serviço estiver fora do ar, o jogo continua jogável no modo local.</p>

    <h2>Saves e perfis</h2>
    <p>Nomes de perfil, avatares escolhidos e o progresso ficam no armazenamento local deste navegador. Eles não sincronizam com nenhum servidor e não podem ser recuperados por e-mail. Use o mesmo perfil de navegador para continuar. Limpar os dados do site ou usar outro navegador ou dispositivo pode apagar ou esconder o progresso. Não digite senhas reais nem informações pessoais sensíveis. Para proteger seu progresso ou levá-lo a outro navegador ou dispositivo, abra o menu Esc, escolha <strong>Baixar backup</strong> e depois use <strong>Carregar backup</strong> no outro dispositivo.</p>

    <h2>Idioma, música e configurações</h2>
    <p>O jogo pode ser jogado em inglês, hindi, espanhol, francês ou português. Escolha o idioma na tela de carregamento, no menu de idioma da barra superior ou no rodapé desta página; sua escolha fica salva neste navegador. A barra superior também tem botões para a música de fundo, o painel de controles e o painel de missões, e o menu Esc tem a qualidade gráfica, que diminui sozinha se o jogo ficar lento (a menos que você desative isso), e níveis separados de volume, música e efeitos sonoros. Essas configurações ficam salvas neste navegador.</p>

    <h2>Solução de problemas</h2>
    <ul>
      <li><strong>O jogo não inicia:</strong> permita a solicitação ao CDN do Three.js, confira se o navegador suporta WebGL e recarregue a página.</li>
      <li><strong>O progresso sumiu:</strong> confirme que está usando o mesmo perfil de navegador e o mesmo nome de perfil local; navegação privada e dados apagados podem remover saves locais.</li>
      <li><strong>Os controles não respondem:</strong> clique na área do jogo, feche qualquer menu aberto e confira se nenhum campo de texto está ativo. Teclado e mouse são os controles principais.</li>
      <li><strong>Imagem lenta ou instável:</strong> feche outras abas com muitos gráficos e reduza a qualidade gráfica nas configurações do jogo.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Jogar Sea Legends</a></p>
  </ContentLayout>;
}

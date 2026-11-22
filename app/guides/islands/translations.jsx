"use client";

import ContentLayout from "../../content-layout";

export const titles = {
  hi: "द्वीप गाइड | Sea Legends",
  es: "Guía de islas | Sea Legends",
  fr: "Guide des îles | Sea Legends",
  pt: "Guia das ilhas | Sea Legends",
};

function IslandTable({ head, rows }) {
  return <div className="content-table-wrap"><table><thead><tr>{head.map((h) => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>
    {rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
  </tbody></table></div>;
}

export function hi() {
  return <ContentLayout eyebrow="द्वीप गाइड">
    <h1>फ़र्स्ट सी के द्वीप</h1>
    <p className="content-lead">फ़र्स्ट सी द्वीपों की एक श्रृंखला है, और हर द्वीप का अपना नज़ारा, अपने दुश्मन और अपना क्वेस्ट देने वाला है। यह गाइड उन पाँच द्वीपों के बारे में है जहाँ आप अभी जा सकते हैं, उसी क्रम में जिसमें ज़्यादातर खिलाड़ी वहाँ पहुँचते हैं, साथ में ज़रूरी लेवल और वहाँ क्या करना है।</p>

    <IslandTable head={["द्वीप", "क्वेस्ट लेवल", "दुश्मन", "बॉस"]} rows={[
      ["स्टार्टर द्वीप", "1", "डाकू", "कोई नहीं"],
      ["जंगल द्वीप", "10–20", "बंदर, गोरिल्ला", "गोरिल्ला किंग"],
      ["पाइरेट टाउन", "30–50", "कटाना वाले समुद्री डाकू, पहलवान रक्षक", "कैप्टन जेस्टर"],
      ["रेगिस्तानी द्वीप", "60–70", "रेगिस्तानी डाकू, रेगिस्तानी अफ़सर", "कोई नहीं"],
      ["बर्फ़ीला गाँव", "90–110", "बर्फ़ीले डाकू, हिममानव", "यती"],
    ]} />

    <h2>स्टार्टर द्वीप</h2>
    <p>हर सफ़र स्टार्टर द्वीप के गाँव से शुरू होता है। यह गेम की सबसे सुरक्षित जगह है: घर, पवनचक्कियाँ और गेहूँ के खेत हल्की पहाड़ियों से घिरे हैं, और यहाँ के अकेले दुश्मन गाँव के किनारे डेरा डाले डाकू हैं।</p>
    <p><strong>यहाँ क्या करें।</strong> स्क्रीन के ऊपर वाले कम्पास के सहारे सुनहरे क्वेस्ट देने वाले तक जाएँ और <kbd>E</kbd> दबाकर <strong>डाकुओं की मुसीबत</strong> स्वीकार करें। पाँच डाकुओं को हराएँ, फिर 180 पैसे और 120 XP के लिए लौटें। यह क्वेस्ट पूरा करने से आगे चलकर स्पेशल क्षमता सीखने का रास्ता भी खुलता है।</p>
    <p><strong>काम की जगहें।</strong> तलवार विक्रेता स्टार्टर ब्लेड $120 और 3 आयरनवुड में बेचता है, जो डाकुओं से मिलती है। डॉक पर नाव डीलर से आप दूसरे द्वीपों तक जाने के लिए छोटी नाव, नाविक नाव या ब्रिगेड जहाज़ बुला सकते हैं। द्वीप के किनारों पर बने टेलीपोर्टर पैड आपको जंगल द्वीप, पाइरेट टाउन और बर्फ़ीले गाँव भेजते हैं।</p>
    <p><strong>सुझाव।</strong> डाकू कमज़ोर हैं, इसलिए उन पर बुनियादी चीज़ों का अभ्यास करें: मुक्कों को कॉम्बो में जोड़ें, आने वाले वार की चेतावनी देने वाली लाल चमक पर नज़र रखें, और पीछे हटकर वार को चूकने दें।</p>

    <h2>जंगल द्वीप</h2>
    <p>जंगल द्वीप ऊँचे, मुड़े हुए पेड़ों और घनी छतरी से ढका है। यहाँ का क्वेस्ट देने वाला लेवल 10 से 20 तक के तीन क्वेस्ट देता है, और लेवल 15 पर पहुँचते ही द्वीप का टेलीपोर्टर रास्ता खुल जाता है।</p>
    <ul>
      <li><strong>बंदरों की शरारत</strong> (लेवल 10): 5 बंदरों को हराएँ, इनाम $380 और 950 XP। बंदर तेज़ हैं, पर नाज़ुक।</li>
      <li><strong>गोरिल्ला की ताकत</strong> (लेवल 15): 5 गोरिल्लों को हराएँ, इनाम $550 और 1,600 XP। गोरिल्ले बंदरों से दोगुना ज़ोर से मारते हैं और देर से गिरते हैं।</li>
      <li><strong>गोरिल्ला किंग</strong> (लेवल 20): द्वीप के बॉस को हराएँ, इनाम $1,200 और 4,500 XP। उससे कैसे लड़ें, यह <a href="/guides/enemies-and-bosses">दुश्मन और बॉस गाइड</a> में देखें।</li>
    </ul>
    <p>जंगल पल्स ट्रेनर भी यहीं रहता है। स्टार्टर द्वीप पर डाकुओं की मुसीबत पूरा करने के बाद ट्रेनर से बात करें और जंगल पल्स खोलें, वह स्पेशल हथियार जिसे आप <kbd>4</kbd> से चुनते हैं।</p>

    <h2>पाइरेट टाउन</h2>
    <p>पाइरेट टाउन विरोधी दलों का चहल-पहल भरा बंदरगाह है। यहाँ का कप्तान लेवल 30 से 50 के खिलाड़ियों को तीन क्वेस्ट देता है, और यहाँ की लड़ाइयाँ जंगल से साफ़ तौर पर कठिन हैं।</p>
    <ul>
      <li><strong>डाकुओं का घात</strong> (लेवल 30): कटाना वाले 6 समुद्री डाकुओं को हराएँ, इनाम $620 और 1,900 XP।</li>
      <li><strong>लोहे की गदा वाले पहलवान</strong> (लेवल 40): 4 पहलवान रक्षकों को हराएँ, इनाम $940 और 3,300 XP। पहलवान भारी गदाएँ लंबे कॉम्बो में घुमाते हैं, इसलिए वारों के बीच दूरी बनाए रखें।</li>
      <li><strong>कैप्टन जेस्टर</strong> (लेवल 50): शहर के बॉस को हराएँ, इनाम $1,500 और 6,000 XP।</li>
    </ul>
    <p><strong>गुप्त जगह।</strong> कैप्टन जेस्टर के अखाड़े के पीछे एक छिपी गुफा है, जहाँ ब्लेज़ किक के उस्ताद ओल्ड सिंडर लड़ाकों को सिखाते हैं। लेवल 30 से, $5,000 में, वे ब्लेज़ किक शैली सिखाते हैं: <strong>अंगारा शॉट</strong>, एक उड़ती आग वाली किक, और <strong>इन्फ़र्नो किक</strong>, जो आपके पैरों में आग लगा देती है ताकि आपके अगले वार आग का नुकसान करें।</p>

    <h2>रेगिस्तानी द्वीप</h2>
    <p>रेगिस्तानी द्वीप रेत और चट्टानों का तपता हुआ फैलाव है, जो लेवल 60 पर खुलता है। यहीं ऑरा ट्रेनर से $3,500 में <strong>आयरन ऑरा</strong> सीखा जा सकता है। आयरन ऑरा एक टॉगल (<kbd>H</kbd>) है, जो चालू रहते हुए दुश्मनों को हराने पर और मज़बूत होता जाता है।</p>
    <ul>
      <li><strong>रेगिस्तानी डाकू</strong> (लेवल 60): 5 रेगिस्तानी डाकुओं को हराएँ, इनाम $1,800 और 8,500 XP।</li>
      <li><strong>रेगिस्तानी अफ़सर</strong> (लेवल 70): 5 रेगिस्तानी अफ़सरों को हराएँ, इनाम $2,500 और 12,000 XP। अफ़सर दूर से गोली चलाते हैं और पास आने पर तलवार निकाल लेते हैं, इसलिए जल्दी पास पहुँचें या किसी आड़ के पीछे से लड़ें।</li>
    </ul>
    <h2>बर्फ़ीला गाँव</h2>
    <p>बर्फ़ीला गाँव फ़र्स्ट सी के सबसे ठंडे द्वीप पर है और यहाँ गेम के सबसे कठिन आम दुश्मन हैं। यहाँ के क्वेस्ट लेवल 90 से 110 तक हैं।</p>
    <ul>
      <li><strong>बर्फ़ीले डाकू</strong> (लेवल 90): 5 बर्फ़ीले डाकुओं को हराएँ, इनाम $3,400 और 18,000 XP। उन पर बर्फ़ का कवच है जिस पर तलवार मुश्किल से असर करती है। पहले मुक्कों से कवच तोड़ें, फिर किसी भी हथियार से खत्म करें।</li>
      <li><strong>हिममानवों का झुंड</strong> (लेवल 100): 5 हिममानवों को हराएँ, इनाम $4,500 और 26,000 XP।</li>
      <li><strong>बॉस यती</strong> (लेवल 110): यती को हराएँ, इनाम $6,800 और 48,000 XP, जो गेम का सबसे बड़ा इनाम है।</li>
    </ul>
    <p>बर्फ़ीले गाँव में दो उन्नत ट्रेनर रहते हैं। <strong>फ़्लैश स्टेप मास्टर</strong> (लेवल 75, $5,000) <kbd>T</kbd> पर कम दूरी का टेलीपोर्ट सिखाता है। <strong>फ़ोरसाइट मास्टर</strong> (लेवल 80, $7,500) फ़ोरसाइट सिखाता है, जो सीमित संख्या में हमलों से अपने आप बचाता है और <kbd>K</kbd> से चालू-बंद होता है। हर ट्रेनर के पास एक टेलीपोर्टर है जो आपको वापस स्टार्टर द्वीप ले जाता है।</p>

    <h2>द्वीपों के बीच सफ़र</h2>
    <p>सफ़र के दो तरीके हैं। स्टार्टर द्वीप पर बने <strong>टेलीपोर्टर</strong> आपको दूसरे द्वीपों पर भेजते हैं; मंज़िल चुनने के लिए किसी टेलीपोर्टर से बातचीत करें, पर कुछ रास्तों के लिए न्यूनतम लेवल चाहिए (जंगल द्वीप के लिए 15, रेगिस्तानी द्वीप के लिए 60)। <strong>नावों</strong> से आप कहीं भी जा सकते हैं: नाव डीलर से एक चुनें और वह सबसे पास के खुले पानी में उतरेगी, पतवार आपके हाथ में होगी। <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> से चलाएँ, किनारे उतरने के लिए <kbd>G</kbd> दबाएँ, और नाव के पास दोबारा <kbd>G</kbd> दबाकर सवार हों। ऊपर की बार में होम बटन थोड़ी उलटी गिनती के बाद आपको स्टार्टर द्वीप पर वापस भेज देता है।</p>

    <p><a className="content-button" href="/#game-root">Sea Legends खेलें</a> <a href="/guides/enemies-and-bosses">दुश्मन और बॉस गाइड</a> · <a href="/guides/weapons-and-skills">हथियार और कौशल</a></p>
  </ContentLayout>;
}

export function es() {
  return <ContentLayout eyebrow="GUÍA DE ISLAS">
    <h1>Las islas del Primer Mar</h1>
    <p className="content-lead">El Primer Mar es una cadena de islas, cada una con su propio paisaje, sus enemigos y quien da las misiones. Esta guía cubre las cinco islas que puedes visitar ahora, en el orden en que suelen llegar los jugadores, con el nivel necesario y qué hacer al llegar.</p>

    <IslandTable head={["Isla", "Niveles de misión", "Enemigos", "Jefe"]} rows={[
      ["Isla Inicial", "1", "Bandidos", "Ninguno"],
      ["Isla de la Selva", "10–20", "Monos, gorilas", "Rey Gorila"],
      ["Pueblo Pirata", "30–50", "Piratas con katana, matones", "Capitán Bufón"],
      ["Isla del Desierto", "60–70", "Bandidos del desierto, oficiales del desierto", "Ninguno"],
      ["Aldea Nevada", "90–110", "Bandidos helados, muñecos de nieve", "Yeti"],
    ]} />

    <h2>Isla Inicial</h2>
    <p>Toda aventura empieza en la aldea de la Isla Inicial. Es el lugar más seguro del juego: las casas, los molinos y los campos de trigo están rodeados de colinas suaves, y los únicos enemigos son los bandidos acampados al borde de la aldea.</p>
    <p><strong>Qué hacer aquí.</strong> Sigue la brújula de la parte superior de la pantalla hasta quien da las misiones, en dorado, y pulsa <kbd>E</kbd> para aceptar <strong>Problemas con bandidos</strong>. Derrota a cinco bandidos y vuelve para cobrar 180 de dinero y 120 de XP. Completar esta misión también te permite aprender más adelante la habilidad especial.</p>
    <p><strong>Lugares útiles.</strong> El vendedor de espadas vende la Hoja Inicial por $120 y 3 de madera de hierro, que sueltan los bandidos. En el muelle, el vendedor de barcos te permite conseguir un bote, un barco de marinero o un bergantín para navegar a otras islas. Las plataformas de teletransporte del borde de la isla te llevan a la Isla de la Selva, al Pueblo Pirata y a la Aldea Nevada.</p>
    <p><strong>Consejo.</strong> Los bandidos son débiles, así que úsalos para practicar lo básico: encadena puñetazos en un combo, fíjate en el destello rojo que avisa de un golpe y retrocede para que falle.</p>

    <h2>Isla de la Selva</h2>
    <p>La Isla de la Selva está cubierta de árboles altos y curvados bajo un denso dosel. Quien da las misiones ofrece tres misiones entre los niveles 10 y 20, y la ruta de teletransporte de la isla se abre al llegar al nivel 15.</p>
    <ul>
      <li><strong>Travesuras de monos</strong> (nivel 10): derrota a 5 monos por $380 y 950 XP. Los monos son rápidos pero frágiles.</li>
      <li><strong>Fuerza de gorila</strong> (nivel 15): derrota a 5 gorilas por $550 y 1.600 XP. Los gorilas pegan el doble de fuerte que los monos y aguantan más.</li>
      <li><strong>El Rey Gorila</strong> (nivel 20): derrota al jefe de la isla por $1.200 y 4.500 XP. Consulta la <a href="/guides/enemies-and-bosses">guía de enemigos y jefes</a> para saber cómo enfrentarte a él.</li>
    </ul>
    <p>El entrenador de Pulso de la Selva también vive aquí. Cuando hayas completado Problemas con bandidos en la Isla Inicial, habla con él para desbloquear Pulso de la Selva, el arma de habilidad especial que equipas con <kbd>4</kbd>.</p>

    <h2>Pueblo Pirata</h2>
    <p>El Pueblo Pirata es un puerto bullicioso dominado por tripulaciones rivales. Su capitán ofrece tres misiones para jugadores de nivel 30 a 50, y los combates aquí son claramente más duros que en la selva.</p>
    <ul>
      <li><strong>Emboscada pirata</strong> (nivel 30): derrota a 6 piratas con katana por $620 y 1.900 XP.</li>
      <li><strong>Brutos de maza de hierro</strong> (nivel 40): derrota a 4 matones por $940 y 3.300 XP. Los matones blanden mazas pesadas en combos largos, así que mantén la distancia entre golpe y golpe.</li>
      <li><strong>Capitán Bufón</strong> (nivel 50): derrota al jefe del pueblo por $1.500 y 6.000 XP.</li>
    </ul>
    <p><strong>Zona secreta.</strong> Detrás de la arena del Capitán Bufón hay una cueva oculta donde el maestro de la Patada Llameante, Old Cinder, entrena a luchadores. Desde el nivel 30 y por $5.000, enseña el estilo de Patada Llameante: <strong>Tiro de Brasa</strong>, una patada voladora de fuego, y <strong>Patada Infernal</strong>, que prende fuego a tus piernas para que tus siguientes ataques hagan daño de fuego.</p>

    <h2>Isla del Desierto</h2>
    <p>La Isla del Desierto es una extensión de arena y roca bajo el sol que se abre en el nivel 60. Aquí también puedes aprender <strong>Aura de Hierro</strong> con el entrenador de aura por $3.500. Aura de Hierro se activa y desactiva con <kbd>H</kbd> y se fortalece a medida que derrotas enemigos con ella activa.</p>
    <ul>
      <li><strong>Bandidos del desierto</strong> (nivel 60): derrota a 5 bandidos del desierto por $1.800 y 8.500 XP.</li>
      <li><strong>Oficiales del desierto</strong> (nivel 70): derrota a 5 oficiales del desierto por $2.500 y 12.000 XP. Los oficiales disparan a distancia y sacan una espada de cerca, así que acorta distancias rápido o lucha a cubierto.</li>
    </ul>
    <h2>Aldea Nevada</h2>
    <p>La Aldea Nevada está en la isla más fría del Primer Mar y tiene los enemigos normales más duros del juego. Sus misiones van del nivel 90 al 110.</p>
    <ul>
      <li><strong>Bandidos helados</strong> (nivel 90): derrota a 5 bandidos helados por $3.400 y 18.000 XP. Los protege una coraza de hielo que las espadas apenas arañan. Rómpela primero con los puños y remátalos con cualquier arma.</li>
      <li><strong>Enjambre de muñecos de nieve</strong> (nivel 100): derrota a 5 muñecos de nieve por $4.500 y 26.000 XP.</li>
      <li><strong>El jefe Yeti</strong> (nivel 110): derrota al Yeti por $6.800 y 48.000 XP, la mayor recompensa del juego.</li>
    </ul>
    <p>En la Aldea Nevada viven dos entrenadores avanzados. El <strong>maestro del Paso Relámpago</strong> (nivel 75, $5.000) enseña un teletransporte corto con <kbd>T</kbd>. El <strong>maestro de la Previsión</strong> (nivel 80, $7.500) enseña Previsión, que esquiva automáticamente un número limitado de ataques y se activa con <kbd>K</kbd>. Junto a cada entrenador hay un teletransportador que te devuelve a la Isla Inicial.</p>

    <h2>Viajar entre islas</h2>
    <p>Hay dos formas de viajar. Los <strong>teletransportadores</strong> de la Isla Inicial te llevan a las demás islas; interactúa con uno para elegir destino, aunque algunas rutas exigen un nivel mínimo (15 para la Isla de la Selva, 60 para la Isla del Desierto). Los <strong>barcos</strong> te llevan a cualquier parte: elige uno con un vendedor de barcos y zarpará en el agua abierta más cercana contigo al timón. Gira con <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>, pulsa <kbd>G</kbd> para bajar a tierra y <kbd>G</kbd> junto a tu barco para volver a subir. El botón Inicio de la barra superior te teletransporta a la Isla Inicial tras una breve cuenta atrás.</p>

    <p><a className="content-button" href="/#game-root">Jugar a Sea Legends</a> <a href="/guides/enemies-and-bosses">Guía de enemigos y jefes</a> · <a href="/guides/weapons-and-skills">Armas y habilidades</a></p>
  </ContentLayout>;
}

export function fr() {
  return <ContentLayout eyebrow="GUIDE DES ÎLES">
    <h1>Les îles de la Première Mer</h1>
    <p className="content-lead">La Première Mer est une chaîne d'îles, chacune avec son paysage, ses ennemis et son donneur de quêtes. Ce guide présente les cinq îles accessibles aujourd'hui, dans l'ordre où la plupart des joueurs les atteignent, avec le niveau requis et ce qu'il faut y faire.</p>

    <IslandTable head={["Île", "Niveaux des quêtes", "Ennemis", "Boss"]} rows={[
      ["Île de départ", "1", "Bandits", "Aucun"],
      ["Île de la Jungle", "10–20", "Singes, gorilles", "Roi Gorille"],
      ["Ville Pirate", "30–50", "Pirates au katana, brutes", "Capitaine Bouffon"],
      ["Île du Désert", "60–70", "Bandits du désert, officiers du désert", "Aucun"],
      ["Village enneigé", "90–110", "Bandits gelés, bonshommes de neige", "Yéti"],
    ]} />

    <h2>Île de départ</h2>
    <p>Toute aventure commence au village de l'Île de départ. C'est l'endroit le plus sûr du jeu : maisons, moulins et champs de blé sont entourés de douces collines, et les seuls ennemis sont les bandits campés en bordure du village.</p>
    <p><strong>Que faire ici.</strong> Suivez la boussole en haut de l'écran jusqu'au donneur de quêtes doré et appuyez sur <kbd>E</kbd> pour accepter <strong>Ennuis de bandits</strong>. Battez cinq bandits, puis revenez chercher 180 pièces et 120 XP. Terminer cette quête vous permet aussi d'apprendre plus tard la capacité spéciale.</p>
    <p><strong>Lieux utiles.</strong> Le marchand d'épées vend la Lame du débutant pour 120 $ et 3 bois de fer, que lâchent les bandits. Au quai, le marchand de bateaux vous propose un canot, un bateau de marin ou un brigantin pour rejoindre les autres îles. Les plateformes de téléportation en bordure de l'île mènent à l'Île de la Jungle, à Ville Pirate et au Village enneigé.</p>
    <p><strong>Astuce.</strong> Les bandits sont faibles : profitez-en pour travailler les bases. Enchaînez vos coups de poing en combo, guettez l'éclair rouge qui annonce une attaque et reculez pour l'esquiver.</p>

    <h2>Île de la Jungle</h2>
    <p>L'Île de la Jungle est couverte de grands arbres courbés sous une canopée épaisse. Son donneur de quêtes propose trois quêtes du niveau 10 au 20, et la route de téléportation de l'île s'ouvre au niveau 15.</p>
    <ul>
      <li><strong>Bêtises de singes</strong> (niveau 10) : battez 5 singes pour 380 $ et 950 XP. Les singes sont rapides mais fragiles.</li>
      <li><strong>Force de gorille</strong> (niveau 15) : battez 5 gorilles pour 550 $ et 1 600 XP. Les gorilles frappent deux fois plus fort que les singes et résistent plus longtemps.</li>
      <li><strong>Le Roi Gorille</strong> (niveau 20) : battez le boss de l'île pour 1 200 $ et 4 500 XP. Consultez le <a href="/guides/enemies-and-bosses">guide des ennemis et boss</a> pour savoir comment l'affronter.</li>
    </ul>
    <p>L'entraîneur de Pouls de la Jungle vit aussi ici. Une fois Ennuis de bandits terminé sur l'Île de départ, parlez-lui pour débloquer Pouls de la Jungle, l'arme de capacité spéciale que vous équipez avec <kbd>4</kbd>.</p>

    <h2>Ville Pirate</h2>
    <p>Ville Pirate est un port animé tenu par des équipages rivaux. Son capitaine propose trois quêtes aux joueurs de niveau 30 à 50, et les combats y sont nettement plus durs que dans la jungle.</p>
    <ul>
      <li><strong>Embuscade pirate</strong> (niveau 30) : battez 6 pirates au katana pour 620 $ et 1 900 XP.</li>
      <li><strong>Brutes à masse de fer</strong> (niveau 40) : battez 4 brutes pour 940 $ et 3 300 XP. Les brutes enchaînent de longs combos à la masse lourde : gardez vos distances entre deux coups.</li>
      <li><strong>Capitaine Bouffon</strong> (niveau 50) : battez le boss de la ville pour 1 500 $ et 6 000 XP.</li>
    </ul>
    <p><strong>Zone secrète.</strong> Derrière l'arène du Capitaine Bouffon se cache une grotte où le maître du Coup de pied ardent, Old Cinder, entraîne les combattants. Dès le niveau 30, et pour 5 000 $, il enseigne ce style : <strong>Tir de Braise</strong>, un coup de pied volant enflammé, et <strong>Coup de pied infernal</strong>, qui embrase vos jambes pour que vos attaques suivantes infligent des dégâts de feu.</p>

    <h2>Île du Désert</h2>
    <p>L'Île du Désert est une étendue de sable et de roche brûlée par le soleil, accessible au niveau 60. C'est aussi là que l'entraîneur d'aura enseigne l'<strong>Aura de fer</strong> pour 3 500 $. L'Aura de fer s'active avec <kbd>H</kbd> et se renforce à mesure que vous battez des ennemis lorsqu'elle est active.</p>
    <ul>
      <li><strong>Bandits du désert</strong> (niveau 60) : battez 5 bandits du désert pour 1 800 $ et 8 500 XP.</li>
      <li><strong>Officiers du désert</strong> (niveau 70) : battez 5 officiers du désert pour 2 500 $ et 12 000 XP. Les officiers tirent à distance et dégainent une lame au corps à corps : rapprochez-vous vite ou combattez à couvert.</li>
    </ul>
    <h2>Village enneigé</h2>
    <p>Le Village enneigé se trouve sur l'île la plus froide de la Première Mer et abrite les ennemis ordinaires les plus coriaces du jeu. Ses quêtes vont du niveau 90 au 110.</p>
    <ul>
      <li><strong>Bandits gelés</strong> (niveau 90) : battez 5 bandits gelés pour 3 400 $ et 18 000 XP. Une carapace de glace les protège et les épées l'égratignent à peine. Brisez-la d'abord aux poings, puis achevez-les avec n'importe quelle arme.</li>
      <li><strong>Nuée de bonshommes de neige</strong> (niveau 100) : battez 5 bonshommes de neige pour 4 500 $ et 26 000 XP.</li>
      <li><strong>Le boss Yéti</strong> (niveau 110) : battez le Yéti pour 6 800 $ et 48 000 XP, la plus grosse récompense du jeu.</li>
    </ul>
    <p>Deux entraîneurs avancés vivent au Village enneigé. Le <strong>maître du Pas éclair</strong> (niveau 75, 5 000 $) enseigne une courte téléportation sur <kbd>T</kbd>. Le <strong>maître de la Prescience</strong> (niveau 80, 7 500 $) enseigne la Prescience, qui esquive automatiquement un nombre limité d'attaques et s'active avec <kbd>K</kbd>. À côté de chaque entraîneur, un téléporteur vous ramène à l'Île de départ.</p>

    <h2>Voyager entre les îles</h2>
    <p>Il y a deux façons de voyager. Les <strong>téléporteurs</strong> de l'Île de départ vous envoient vers les autres îles ; interagissez avec l'un d'eux pour choisir la destination, mais certaines routes exigent un niveau minimum (15 pour l'Île de la Jungle, 60 pour l'Île du Désert). Les <strong>bateaux</strong> vous emmènent partout : choisissez-en un chez un marchand de bateaux et il est mis à l'eau au plus près, vous à la barre. Dirigez avec <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>, appuyez sur <kbd>G</kbd> pour débarquer et sur <kbd>G</kbd> près de votre bateau pour remonter à bord. Le bouton Accueil de la barre supérieure vous téléporte à l'Île de départ après un court compte à rebours.</p>

    <p><a className="content-button" href="/#game-root">Jouer à Sea Legends</a> <a href="/guides/enemies-and-bosses">Guide des ennemis et boss</a> · <a href="/guides/weapons-and-skills">Armes et compétences</a></p>
  </ContentLayout>;
}

export function pt() {
  return <ContentLayout eyebrow="GUIA DAS ILHAS">
    <h1>As ilhas do Primeiro Mar</h1>
    <p className="content-lead">O Primeiro Mar é uma cadeia de ilhas, cada uma com sua paisagem, seus inimigos e quem dá as missões. Este guia cobre as cinco ilhas que você pode visitar hoje, na ordem em que a maioria dos jogadores chega a elas, com o nível necessário e o que fazer lá.</p>

    <IslandTable head={["Ilha", "Níveis das missões", "Inimigos", "Chefe"]} rows={[
      ["Ilha Inicial", "1", "Bandidos", "Nenhum"],
      ["Ilha da Selva", "10–20", "Macacos, gorilas", "Rei Gorila"],
      ["Cidade Pirata", "30–50", "Piratas com katana, brutamontes", "Capitão Bufão"],
      ["Ilha do Deserto", "60–70", "Bandidos do deserto, oficiais do deserto", "Nenhum"],
      ["Vila Nevada", "90–110", "Bandidos congelados, bonecos de neve", "Yeti"],
    ]} />

    <h2>Ilha Inicial</h2>
    <p>Toda aventura começa na vila da Ilha Inicial. É o lugar mais seguro do jogo: casas, moinhos e campos de trigo cercados por colinas suaves, e os únicos inimigos são os bandidos acampados na borda da vila.</p>
    <p><strong>O que fazer aqui.</strong> Siga a bússola no topo da tela até quem dá as missões, em dourado, e aperte <kbd>E</kbd> para aceitar <strong>Encrenca com bandidos</strong>. Derrote cinco bandidos e volte para receber 180 de dinheiro e 120 de XP. Concluir esta missão também permite aprender a habilidade especial mais tarde.</p>
    <p><strong>Lugares úteis.</strong> O vendedor de espadas vende a Lâmina Inicial por $120 e 3 madeiras-de-ferro, que os bandidos deixam cair. No cais, o vendedor de barcos oferece um bote, um barco de marinheiro ou um bergantim para navegar até outras ilhas. As plataformas de teletransporte na borda da ilha levam à Ilha da Selva, à Cidade Pirata e à Vila Nevada.</p>
    <p><strong>Dica.</strong> Os bandidos são fracos, então use-os para treinar o básico: encadeie socos em um combo, fique de olho no brilho vermelho que avisa de um golpe e recue para que ele erre.</p>

    <h2>Ilha da Selva</h2>
    <p>A Ilha da Selva é coberta de árvores altas e curvas sob uma copa densa. Quem dá as missões oferece três missões do nível 10 ao 20, e a rota de teletransporte da ilha abre no nível 15.</p>
    <ul>
      <li><strong>Travessura dos macacos</strong> (nível 10): derrote 5 macacos por $380 e 950 XP. Os macacos são rápidos, mas frágeis.</li>
      <li><strong>Força de gorila</strong> (nível 15): derrote 5 gorilas por $550 e 1.600 XP. Os gorilas batem com o dobro da força dos macacos e demoram mais para cair.</li>
      <li><strong>O Rei Gorila</strong> (nível 20): derrote o chefe da ilha por $1.200 e 4.500 XP. Veja o <a href="/guides/enemies-and-bosses">guia de inimigos e chefes</a> para saber como enfrentá-lo.</li>
    </ul>
    <p>O treinador do Pulso da Selva também mora aqui. Depois de concluir Encrenca com bandidos na Ilha Inicial, fale com ele para liberar o Pulso da Selva, a arma de habilidade especial que você equipa com <kbd>4</kbd>.</p>

    <h2>Cidade Pirata</h2>
    <p>A Cidade Pirata é um porto agitado comandado por tripulações rivais. Seu capitão oferece três missões para jogadores do nível 30 ao 50, e as lutas aqui são bem mais difíceis que na selva.</p>
    <ul>
      <li><strong>Emboscada pirata</strong> (nível 30): derrote 6 piratas com katana por $620 e 1.900 XP.</li>
      <li><strong>Brutamontes da maça de ferro</strong> (nível 40): derrote 4 brutamontes por $940 e 3.300 XP. Eles giram maças pesadas em combos longos, então mantenha distância entre os golpes.</li>
      <li><strong>Capitão Bufão</strong> (nível 50): derrote o chefe da cidade por $1.500 e 6.000 XP.</li>
    </ul>
    <p><strong>Área secreta.</strong> Atrás da arena do Capitão Bufão há uma caverna escondida onde o mestre do Chute Flamejante, Old Cinder, treina lutadores. A partir do nível 30, por $5.000, ele ensina o estilo do Chute Flamejante: <strong>Tiro de Brasa</strong>, um chute voador de fogo, e <strong>Chute Infernal</strong>, que incendeia suas pernas para que os próximos ataques causem dano de fogo.</p>

    <h2>Ilha do Deserto</h2>
    <p>A Ilha do Deserto é uma vastidão de areia e rocha sob o sol, liberada no nível 60. É lá que você aprende a <strong>Aura de Ferro</strong> com o treinador de aura por $3.500. A Aura de Ferro liga e desliga com <kbd>H</kbd> e fica mais forte conforme você derrota inimigos com ela ativa.</p>
    <ul>
      <li><strong>Bandidos do deserto</strong> (nível 60): derrote 5 bandidos do deserto por $1.800 e 8.500 XP.</li>
      <li><strong>Oficiais do deserto</strong> (nível 70): derrote 5 oficiais do deserto por $2.500 e 12.000 XP. Os oficiais atiram de longe e sacam uma lâmina de perto, então encurte a distância rápido ou lute protegido.</li>
    </ul>
    <h2>Vila Nevada</h2>
    <p>A Vila Nevada fica na ilha mais fria do Primeiro Mar e tem os inimigos comuns mais difíceis do jogo. Suas missões vão do nível 90 ao 110.</p>
    <ul>
      <li><strong>Bandidos congelados</strong> (nível 90): derrote 5 bandidos congelados por $3.400 e 18.000 XP. Uma casca de gelo os protege e as espadas mal a arranham. Quebre-a primeiro com os punhos e depois acabe com eles com qualquer arma.</li>
      <li><strong>Enxame de bonecos de neve</strong> (nível 100): derrote 5 bonecos de neve por $4.500 e 26.000 XP.</li>
      <li><strong>O chefe Yeti</strong> (nível 110): derrote o Yeti por $6.800 e 48.000 XP, a maior recompensa do jogo.</li>
    </ul>
    <p>Dois treinadores avançados moram na Vila Nevada. O <strong>mestre do Passo Relâmpago</strong> (nível 75, $5.000) ensina um teletransporte curto no <kbd>T</kbd>. O <strong>mestre da Previsão</strong> (nível 80, $7.500) ensina a Previsão, que desvia automaticamente de um número limitado de ataques e liga com <kbd>K</kbd>. Ao lado de cada treinador há um teletransportador que leva você de volta à Ilha Inicial.</p>

    <h2>Viajando entre as ilhas</h2>
    <p>Há duas formas de viajar. Os <strong>teletransportadores</strong> da Ilha Inicial levam você às outras ilhas; interaja com um para escolher o destino, mas algumas rotas exigem nível mínimo (15 para a Ilha da Selva, 60 para a Ilha do Deserto). Os <strong>barcos</strong> levam você a qualquer lugar: escolha um com um vendedor de barcos e ele é lançado na água aberta mais próxima, com você no leme. Vire com <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>, aperte <kbd>G</kbd> para desembarcar e <kbd>G</kbd> perto do barco para voltar a bordo. O botão Início na barra superior teletransporta você à Ilha Inicial após uma breve contagem regressiva.</p>

    <p><a className="content-button" href="/#game-root">Jogar Sea Legends</a> <a href="/guides/enemies-and-bosses">Guia de inimigos e chefes</a> · <a href="/guides/weapons-and-skills">Armas e habilidades</a></p>
  </ContentLayout>;
}

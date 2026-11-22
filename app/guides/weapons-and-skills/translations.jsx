"use client";

import ContentLayout from "../../content-layout";

export const titles = {
  hi: "हथियार और कौशल गाइड | Sea Legends",
  es: "Guía de armas y habilidades | Sea Legends",
  fr: "Guide des armes et compétences | Sea Legends",
  pt: "Guia de armas e habilidades | Sea Legends",
};

function Mastery({ head, rows }) {
  return <div className="content-table-wrap"><table><thead><tr><th scope="col">{head[0]}</th><th scope="col">{head[1]}</th></tr></thead><tbody>
    {rows.map(([level, text]) => <tr key={level}><td>{level}</td><td>{text}</td></tr>)}
  </tbody></table></div>;
}

const K = ({ children }) => <kbd>{children}</kbd>;

export function hi() {
  const head = ["महारत", "क्या खुलता है"];
  return <ContentLayout eyebrow="लड़ाई की गाइड">
    <h1>हथियार और कौशल</h1>
    <p className="content-lead">Sea Legends में लड़ने की चार शैलियाँ हैं: मुक्के, तलवार, बंदूक और स्पेशल क्षमताएँ। हर शैली <strong>महारत</strong> से अलग-अलग बढ़ती है, जो उस शैली से वार लगाने पर मिलती है। ऊँची महारत से पैसिव बोनस और एक्टिव स्किल खुलते हैं।</p>

    <h2>हथियार बदलना</h2>
    <p>हर हथियार मिल जाने के बाद मुक्कों के लिए <K>1</K>, तलवार के लिए <K>2</K>, बंदूक के लिए <K>3</K> और स्पेशल क्षमता के लिए <K>4</K> दबाएँ। आपका किरदार एक छोटे एनिमेशन के साथ नया हथियार निकालता है। <K>बायाँ क्लिक</K> या <K>R</K> से हमला करें, और लगातार हमले के लिए बटन दबाए रखें। एक्टिव स्किल <K>Z</K>, <K>X</K>, <K>C</K> और <K>V</K> पर हैं, और स्क्रीन के दाईं ओर का स्किल पैनल दिखाता है कि कौन-सी खुल चुकी हैं और उनका कूलडाउन कितना है।</p>

    <h2>मुक्के</h2>
    <p><strong>कैसे मिलते हैं:</strong> शुरुआत से उपलब्ध।</p>
    <p>लगातार हमले चार वार के कॉम्बो में जुड़ते हैं: जैब, क्रॉस, हुक और अपरकट। कॉम्बो जारी रखने के लिए पिछले मुक्के के तुरंत बाद क्लिक करते रहें; रुकने पर कॉम्बो फिर से शुरू होता है। बर्फ़ीले गाँव के बर्फ़ीले डाकुओं का बर्फ़ का कवच तोड़ने के लिए भी मुक्के सबसे अच्छे हैं।</p>
    <Mastery head={head} rows={[
      ["5", <><strong>उल्का मुक्का</strong> (<K>Z</K>, 4s कूलडाउन): एक चार्ज किया हुआ मुक्का जो आपके सामने की दिशा में 24 यूनिट तक जाता है। सामान्य मुक्कों में 2.5 गुना नुकसान वाले क्रिटिकल वार का 15% मौका भी जुड़ जाता है।</>],
      ["20", <><strong>ज़मीनी प्रहार</strong> (<K>X</K>, 8s कूलडाउन): ऊपर उछलकर ज़मीन पर ज़ोर से मारें, जिससे आसपास सबको नुकसान हो। हवा में रहते हुए हमला करना भी प्रहार बन जाता है।</>],
      ["50", <><strong>गैटलिंग मुक्के</strong>: आपका सामान्य हमला बारी-बारी से लगने वाले तेज़ मुक्कों की बौछार बन जाता है।</>],
    ]} />
    <p><strong>ब्लेज़ किक शैली।</strong> पाइरेट टाउन की छिपी गुफा में ओल्ड सिंडर लेवल 30 से $5,000 में मुक्कों की दो और स्किल सिखाते हैं: <strong>अंगारा शॉट</strong> (<K>C</K>, 6s कूलडाउन), एक उड़ती आग वाली किक जो जलाती और पीछे धकेलती है, और <strong>इन्फ़र्नो किक</strong> (<K>V</K>, 18s कूलडाउन), जो आपके पैरों में आग लगा देती है ताकि आपके अगले पाँच हमले 2.5 गुना आग का नुकसान करने वाली किक बन जाएँ।</p>

    <h2>तलवार</h2>
    <p><strong>कैसे मिलती है:</strong> स्टार्टर द्वीप पर तलवार विक्रेता से स्टार्टर ब्लेड $120 और 3 आयरनवुड में खरीदें। आयरनवुड डाकुओं से मिलती है।</p>
    <p>तलवार तीन वार के कॉम्बो में चलती है: सामने से एक वार, ऊपर उठता उल्टा वार और सिर के ऊपर से भारी प्रहार। ब्लेड एक चमकती लकीर छोड़ता है, और इसकी पहुँच मुक्कों से ज़्यादा है।</p>
    <Mastery head={head} rows={[
      ["5", <><strong>भेदी वार</strong> (<K>Z</K>, 5s कूलडाउन): दौड़कर किया गया लंबा वार जो बचाव को भेद देता है। तलवार के सामान्य हमलों की पहुँच भी 12 यूनिट बढ़ जाती है।</>],
      ["20", <><strong>चक्रवात घुमाव</strong> (<K>X</K>, 7s कूलडाउन): तलवार फैलाकर घूमें और आसपास के हर दुश्मन पर वार करें।</>],
      ["50", <><strong>आयामी ब्लेड</strong>: आपके सामान्य हमले आगे की ओर एक बड़ी वार-लहर भी भेजते हैं।</>],
    ]} />

    <h2>बंदूक</h2>
    <p><strong>कैसे मिलती है:</strong> गेम की दुकान से फ़्लिंटलॉक $220 और 5 कबाड़ में खरीदें।</p>
    <p>बंदूक ठीक वहीं चलती है जहाँ आप क्लिक करते हैं। दुश्मन पर क्लिक करके उसे मारें, या ज़मीन पर क्लिक करके उस जगह गोली चलाएँ। दुश्मन के सिर पर क्लिक करने से 1.5 गुना नुकसान वाला <strong>हेडशॉट</strong> लगता है। बंदूक चुनने पर कर्सर निशाने के चिह्न में बदल जाता है। गोलियाँ दीवारों, पेड़ों और चट्टानों पर रुक जाती हैं, इसलिए साफ़ रास्ता चाहिए। टच स्क्रीन पर जहाँ गोली चलानी हो वहाँ टैप करें, या दिख रहे सबसे पास के दुश्मन पर निशाना लगाने के लिए हमला बटन दबाएँ।</p>
    <Mastery head={head} rows={[
      ["5", <><strong>डबल टैप</strong> (<K>Z</K>, 4s कूलडाउन): जल्दी-जल्दी दो ताकतवर गोलियाँ चलाएँ। सामान्य गोलियों के साथ एक बोनस गोली भी चलती है।</>],
      ["20", <><strong>छर्रों की बौछार</strong> (<K>X</K>, 6s कूलडाउन): अपने सामने छर्रों की चौड़ी बौछार करें।</>],
      ["50", <><strong>स्नाइपर फ़ोकस</strong>: स्थिर खड़े रहने पर बंदूक की रेंज दोगुनी हो जाती है।</>],
    ]} />

    <h2>स्पेशल क्षमताएँ</h2>
    <p><strong>कैसे मिलती हैं:</strong> स्टार्टर द्वीप पर डाकुओं की मुसीबत पूरा करें, फिर जंगल द्वीप पर जंगल पल्स ट्रेनर से बात करके <strong>जंगल पल्स</strong> सीखें।</p>
    <p>स्पेशल हमले जादू हैं। इसे चुनने पर आपके हाथ चमकते हैं, जादू चार्ज होते समय उनमें रोशनी इकट्ठा होती है, और हाथों के धक्के से ऊर्जा छूटती है। आपका सामान्य स्पेशल हमला <strong>आत्मा बाण</strong> है: <K>बायाँ क्लिक</K> (या <K>C</K>) आपके कर्सर के नीचे वाली जगह पर लगभग हर सेकंड एक चमकता बाण चलाता है। बंदूक की तरह यह आपकी क्लिक की हुई चीज़ पर लगता है और दीवारों पर रुक जाता है। टच स्क्रीन पर हमला बटन इसे दिख रहे सबसे पास के दुश्मन पर चलाता है।</p>
    <Mastery head={head} rows={[
      ["1", <><strong>आत्मा बाण</strong> (<K>बायाँ क्लिक</K> या <K>C</K>, 0.9s कूलडाउन): कर्सर पर आत्मिक ऊर्जा का बाण चलाएँ। जंगल पल्स सीखते ही उपलब्ध।</>],
      ["5", <><strong>पल्स बबल</strong> (<K>Z</K>, 6s कूलडाउन): फैलती हुई झटके की लहर जो दुश्मनों को दूर धकेलती है।</>],
      ["20", <><strong>ईश्वर का न्याय</strong> (<K>X</K>, 40s कूलडाउन): ब्रह्मांडीय ऊर्जा का एक विशाल धमाका बुलाएँ जो बड़े इलाके पर गिरता है।</>],
      ["50", <><strong>महान जागृति</strong>: स्पेशल हमले 20% से कम हेल्थ वाले आम दुश्मनों को तुरंत खत्म कर देते हैं और ऐसा होने पर आपको 50 हेल्थ देते हैं।</>],
    ]} />

    <h2>डिफ़ेंस</h2>
    <p>डिफ़ेंस हथियार नहीं बल्कि एक स्टैट है, पर इसके भी महारत बोनस हैं। बचाव के लिए <K>F</K> दबाए रखें।</p>
    <ul>
      <li><strong>परफ़ेक्ट पैरी</strong> (सभी के लिए): वार लगने से लगभग चौथाई सेकंड पहले बचाव करें, तो कोई नुकसान नहीं होता और हमलावर लड़खड़ा जाता है। 10% से कम हेल्थ वाला हमलावर तुरंत खत्म हो जाता है। महारत 5 से पैरी 40% नुकसान वापस भी लौटाती है।</li>
      <li><strong>लौह गढ़</strong> (महारत 20): बचाव करते समय हर सेकंड धीरे-धीरे 3.5 हेल्थ वापस आती है।</li>
    </ul>

    <h2>ट्रेनरों से सीखी जाने वाली क्षमताएँ</h2>
    <p>तीन क्षमताएँ महारत से नहीं, बल्कि ट्रेनरों से सीखी जाती हैं:</p>
    <ul>
      <li><strong>आयरन ऑरा</strong> (<K>H</K>): रेगिस्तानी द्वीप के ऑरा ट्रेनर से, लेवल 60, $3,500। ज़्यादा कवच और नुकसान के लिए इसे चालू करें। चालू रहते हुए दुश्मनों को हराने पर इसका लेवल बढ़ता है।</li>
      <li><strong>फ़्लैश स्टेप</strong> (<K>T</K>): बर्फ़ीले गाँव के फ़्लैश स्टेप मास्टर से, लेवल 75, $5,000। कम दूरी का टेलीपोर्ट।</li>
      <li><strong>फ़ोरसाइट</strong> (<K>K</K>): बर्फ़ीले गाँव के फ़ोरसाइट मास्टर से, लेवल 80, $7,500। सीमित संख्या में हमलों से अपने आप बचाता है, और हर कुछ सेकंड में एक बचाव फिर से भर जाता है।</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Sea Legends खेलें</a> <a href="/guides/islands">द्वीप गाइड</a> · <a href="/guides/enemies-and-bosses">दुश्मन और बॉस गाइड</a></p>
  </ContentLayout>;
}

export function es() {
  const head = ["Maestría", "Desbloqueo"];
  return <ContentLayout eyebrow="GUÍA DE COMBATE">
    <h1>Armas y habilidades</h1>
    <p className="content-lead">Sea Legends tiene cuatro estilos de lucha: puños, espada, pistola y habilidades especiales. Cada uno sube por separado gracias a la <strong>maestría</strong>, que ganas al acertar golpes con ese estilo. Más maestría desbloquea bonificaciones pasivas y habilidades activas.</p>

    <h2>Cambiar de arma</h2>
    <p>Pulsa <K>1</K> para los puños, <K>2</K> para la espada, <K>3</K> para la pistola y <K>4</K> para tu habilidad especial, una vez que tengas cada una. Tu personaje desenfunda la nueva arma con una breve animación. Ataca con <K>Clic izquierdo</K> o <K>R</K> y mantén pulsado para seguir atacando. Las habilidades activas usan <K>Z</K>, <K>X</K>, <K>C</K> y <K>V</K>, y el panel de habilidades a la derecha de la pantalla muestra cuáles has desbloqueado y su tiempo de recarga.</p>

    <h2>Puños</h2>
    <p><strong>Cómo conseguirlos:</strong> disponibles desde el principio.</p>
    <p>Los ataques seguidos forman un combo de cuatro golpes: jab, directo, gancho y uppercut. Sigue haciendo clic justo después del último puñetazo para continuar el combo; si te detienes, vuelve a empezar. Los puños también son la mejor forma de romper la coraza de hielo de los bandidos helados de la Aldea Nevada.</p>
    <Mastery head={head} rows={[
      ["5", <><strong>Puño Meteoro</strong> (<K>Z</K>, 4 s de recarga): un puñetazo cargado que avanza 24 unidades en la dirección a la que miras. Los puñetazos normales también ganan un 15 % de probabilidad de crítico con 2,5 veces el daño.</>],
      ["20", <><strong>Golpe Sísmico</strong> (<K>X</K>, 8 s de recarga): salta y golpea el suelo, dañando todo lo que te rodea. Atacar en el aire también se convierte en un golpe al suelo.</>],
      ["50", <><strong>Puñetazos ametralladora</strong>: tu ataque básico se convierte en una ráfaga rápida de puñetazos alternos.</>],
    ]} />
    <p><strong>Estilo de Patada Llameante.</strong> Old Cinder, en la cueva oculta del Pueblo Pirata, enseña dos habilidades extra de puños por $5.000 desde el nivel 30: <strong>Tiro de Brasa</strong> (<K>C</K>, 6 s de recarga), una patada voladora de fuego que quema y empuja, y <strong>Patada Infernal</strong> (<K>V</K>, 18 s de recarga), que prende fuego a tus piernas para que tus cinco siguientes ataques sean patadas con 2,5 veces de daño de fuego.</p>

    <h2>Espada</h2>
    <p><strong>Cómo conseguirla:</strong> compra la Hoja Inicial al vendedor de espadas de la Isla Inicial por $120 y 3 de madera de hierro. Los bandidos sueltan madera de hierro.</p>
    <p>La espada forma un combo de tres golpes: un tajo de derecha, un revés ascendente y un fuerte golpe por encima de la cabeza. La hoja deja una estela brillante y llega más lejos que los puños.</p>
    <Mastery head={head} rows={[
      ["5", <><strong>Estocada Perforante</strong> (<K>Z</K>, 5 s de recarga): un largo golpe en carrera que atraviesa los bloqueos. Los ataques básicos con espada también ganan 12 unidades de alcance.</>],
      ["20", <><strong>Giro Ciclón</strong> (<K>X</K>, 7 s de recarga): gira con la hoja extendida y golpea a todos los enemigos a tu alrededor.</>],
      ["50", <><strong>Hoja Dimensional</strong>: tus ataques básicos también lanzan hacia delante una gran onda cortante.</>],
    ]} />

    <h2>Pistola</h2>
    <p><strong>Cómo conseguirla:</strong> compra la pistola de chispa en la tienda del juego por $220 y 5 de chatarra.</p>
    <p>La pistola dispara justo donde haces clic. Haz clic en un enemigo para darle o en el suelo para disparar a ese punto. Hacer clic en la cabeza de un enemigo logra un <strong>disparo a la cabeza</strong> con 1,5 veces el daño. El cursor se convierte en una mira mientras llevas la pistola. Las balas se detienen en muros, árboles y rocas, así que necesitas línea de tiro despejada. En pantallas táctiles, toca donde quieras disparar o pulsa Atacar para apuntar al enemigo visible más cercano.</p>
    <Mastery head={head} rows={[
      ["5", <><strong>Doble Disparo</strong> (<K>Z</K>, 4 s de recarga): dispara dos tiros potentes seguidos. Los disparos básicos también lanzan una segunda bala extra.</>],
      ["20", <><strong>Cono de Perdigones</strong> (<K>X</K>, 6 s de recarga): suelta una amplia ráfaga de perdigones frente a ti.</>],
      ["50", <><strong>Concentración de francotirador</strong>: quedarte quieto duplica el alcance de la pistola.</>],
    ]} />

    <h2>Habilidades especiales</h2>
    <p><strong>Cómo conseguirlas:</strong> completa Problemas con bandidos en la Isla Inicial y luego habla con el entrenador de Pulso de la Selva, en la Isla de la Selva, para aprender <strong>Pulso de la Selva</strong>.</p>
    <p>Los ataques especiales son hechizos. Tus manos brillan mientras lo llevas equipado, la luz se concentra en ellas al cargar un hechizo y la energía se libera con un empujón de las manos. Tu ataque especial básico es el <strong>Rayo Espiritual</strong>: <K>Clic izquierdo</K> (o <K>C</K>) dispara un rayo brillante al punto bajo el cursor, más o menos una vez por segundo. Como la pistola, alcanza lo que señalas y se detiene en los muros. En pantallas táctiles, el botón Atacar lo dirige al enemigo visible más cercano.</p>
    <Mastery head={head} rows={[
      ["1", <><strong>Rayo Espiritual</strong> (<K>Clic izquierdo</K> o <K>C</K>, 0,9 s de recarga): dispara un rayo de energía espiritual hacia el cursor. Disponible en cuanto aprendes Pulso de la Selva.</>],
      ["5", <><strong>Burbuja de Pulso</strong> (<K>Z</K>, 6 s de recarga): una onda expansiva que aparta a los enemigos.</>],
      ["20", <><strong>Juicio Divino</strong> (<K>X</K>, 40 s de recarga): invoca una enorme explosión de energía cósmica que golpea una zona amplia.</>],
      ["50", <><strong>Gran Despertar</strong>: los ataques especiales rematan al instante a los enemigos normales con menos del 20 % de salud y te curan 50 al hacerlo.</>],
    ]} />

    <h2>Defensa</h2>
    <p>La defensa es un atributo y no un arma, pero también tiene bonificaciones de maestría. Mantén <K>F</K> para bloquear.</p>
    <ul>
      <li><strong>Parada perfecta</strong> (todos): bloquea un cuarto de segundo antes de que llegue un golpe para no recibir daño y hacer tambalear al atacante. Un atacante con menos del 10 % de salud es ejecutado al instante. Desde la maestría 5, la parada también devuelve el 40 % del daño.</li>
      <li><strong>Bastión de Hierro</strong> (maestría 20): mientras bloqueas, regeneras poco a poco 3,5 de salud por segundo.</li>
    </ul>

    <h2>Habilidades entrenadas</h2>
    <p>Tres habilidades las enseñan entrenadores en lugar de ganarse con maestría:</p>
    <ul>
      <li><strong>Aura de Hierro</strong> (<K>H</K>): del entrenador de aura de la Isla del Desierto, nivel 60, $3.500. Actívala para obtener más armadura y daño. Sube de nivel al derrotar enemigos con ella activa.</li>
      <li><strong>Paso Relámpago</strong> (<K>T</K>): del maestro del Paso Relámpago en la Aldea Nevada, nivel 75, $5.000. Un teletransporte de corto alcance.</li>
      <li><strong>Previsión</strong> (<K>K</K>): del maestro de la Previsión en la Aldea Nevada, nivel 80, $7.500. Esquiva automáticamente un número limitado de ataques y recupera una esquiva cada pocos segundos.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Jugar a Sea Legends</a> <a href="/guides/islands">Guía de islas</a> · <a href="/guides/enemies-and-bosses">Guía de enemigos y jefes</a></p>
  </ContentLayout>;
}

export function fr() {
  const head = ["Maîtrise", "Déblocage"];
  return <ContentLayout eyebrow="GUIDE DE COMBAT">
    <h1>Armes et compétences</h1>
    <p className="content-lead">Sea Legends propose quatre styles de combat : poings, épée, pistolet et capacités spéciales. Chacun progresse séparément grâce à la <strong>maîtrise</strong>, gagnée en touchant avec ce style. Une maîtrise plus élevée débloque des bonus passifs et des compétences actives.</p>

    <h2>Changer d'arme</h2>
    <p>Appuyez sur <K>1</K> pour les poings, <K>2</K> pour l'épée, <K>3</K> pour le pistolet et <K>4</K> pour votre capacité spéciale, une fois chacun obtenu. Votre personnage sort la nouvelle arme avec une courte animation. Attaquez avec <K>Clic gauche</K> ou <K>R</K>, et maintenez le bouton pour continuer. Les compétences actives utilisent <K>Z</K>, <K>X</K>, <K>C</K> et <K>V</K>, et le panneau de compétences à droite de l'écran indique celles que vous avez débloquées et leur temps de recharge.</p>

    <h2>Poings</h2>
    <p><strong>Comment les obtenir :</strong> disponibles dès le départ.</p>
    <p>Les attaques successives forment un combo de quatre coups : jab, direct, crochet et uppercut. Cliquez à nouveau juste après le dernier coup pour poursuivre le combo ; une pause le relance depuis le début. Les poings sont aussi le meilleur moyen de briser la carapace de glace des bandits gelés du Village enneigé.</p>
    <Mastery head={head} rows={[
      ["5", <><strong>Poing Météore</strong> (<K>Z</K>, recharge 4 s) : un coup de poing chargé qui parcourt 24 unités dans la direction où vous regardez. Les coups de poing normaux gagnent aussi 15 % de chances de coup critique à 2,5 fois les dégâts.</>],
      ["20", <><strong>Frappe au sol</strong> (<K>X</K>, recharge 8 s) : bondissez et frappez le sol, blessant tout autour de vous. Attaquer en l'air se transforme aussi en frappe au sol.</>],
      ["50", <><strong>Coups de poing Gatling</strong> : votre attaque de base devient une rafale rapide de coups alternés.</>],
    ]} />
    <p><strong>Style du Coup de pied ardent.</strong> Old Cinder, dans la grotte cachée de Ville Pirate, enseigne deux compétences de poings supplémentaires pour 5 000 $ dès le niveau 30 : <strong>Tir de Braise</strong> (<K>C</K>, recharge 6 s), un coup de pied volant enflammé qui brûle et repousse, et <strong>Coup de pied infernal</strong> (<K>V</K>, recharge 18 s), qui embrase vos jambes pour que vos cinq attaques suivantes deviennent des coups de pied infligeant 2,5 fois des dégâts de feu.</p>

    <h2>Épée</h2>
    <p><strong>Comment l'obtenir :</strong> achetez la Lame du débutant au marchand d'épées de l'Île de départ pour 120 $ et 3 bois de fer. Les bandits lâchent du bois de fer.</p>
    <p>L'épée frappe en combo de trois coups : un coup droit, un revers ascendant et un lourd coup vertical. La lame laisse une traînée lumineuse et porte plus loin que les poings.</p>
    <Mastery head={head} rows={[
      ["5", <><strong>Estocade perçante</strong> (<K>Z</K>, recharge 5 s) : une longue attaque en ruée qui traverse les blocages. Les attaques d'épée de base gagnent aussi 12 unités de portée.</>],
      ["20", <><strong>Tourbillon</strong> (<K>X</K>, recharge 7 s) : tournoyez lame tendue et frappez tous les ennemis autour de vous.</>],
      ["50", <><strong>Lame dimensionnelle</strong> : vos attaques de base projettent aussi une grande onde tranchante vers l'avant.</>],
    ]} />

    <h2>Pistolet</h2>
    <p><strong>Comment l'obtenir :</strong> achetez le pistolet à silex dans la boutique du jeu pour 220 $ et 5 ferrailles.</p>
    <p>Le pistolet tire exactement là où vous cliquez. Cliquez sur un ennemi pour le toucher, ou sur le sol pour tirer à cet endroit. Cliquer sur la tête d'un ennemi donne un <strong>tir à la tête</strong> à 1,5 fois les dégâts. Le curseur devient un viseur quand le pistolet est équipé. Les balles s'arrêtent sur les murs, les arbres et les rochers : il faut une ligne de tir dégagée. Sur écran tactile, touchez l'endroit où tirer, ou appuyez sur Attaquer pour viser l'ennemi visible le plus proche.</p>
    <Mastery head={head} rows={[
      ["5", <><strong>Double tir</strong> (<K>Z</K>, recharge 4 s) : tirez deux coups puissants coup sur coup. Les tirs de base lancent aussi une seconde balle bonus.</>],
      ["20", <><strong>Cône de chevrotine</strong> (<K>X</K>, recharge 6 s) : projetez une large gerbe de plombs devant vous.</>],
      ["50", <><strong>Concentration du tireur d'élite</strong> : rester immobile double la portée du pistolet.</>],
    ]} />

    <h2>Capacités spéciales</h2>
    <p><strong>Comment les obtenir :</strong> terminez Ennuis de bandits sur l'Île de départ, puis parlez à l'entraîneur de Pouls de la Jungle sur l'Île de la Jungle pour apprendre <strong>Pouls de la Jungle</strong>.</p>
    <p>Les attaques spéciales sont des sorts. Vos mains brillent quand ce style est équipé, la lumière s'y concentre pendant la charge d'un sort, et l'énergie se libère d'une poussée des mains. Votre attaque spéciale de base est le <strong>Trait spirituel</strong> : <K>Clic gauche</K> (ou <K>C</K>) lance un trait lumineux vers le point sous votre curseur, environ une fois par seconde. Comme le pistolet, il touche ce que vous ciblez et s'arrête sur les murs. Sur écran tactile, le bouton Attaquer le dirige vers l'ennemi visible le plus proche.</p>
    <Mastery head={head} rows={[
      ["1", <><strong>Trait spirituel</strong> (<K>Clic gauche</K> ou <K>C</K>, recharge 0,9 s) : lancez un trait d'énergie spirituelle vers le curseur. Disponible dès que vous apprenez Pouls de la Jungle.</>],
      ["5", <><strong>Bulle d'impulsion</strong> (<K>Z</K>, recharge 6 s) : une onde de choc qui s'étend et repousse les ennemis.</>],
      ["20", <><strong>Jugement divin</strong> (<K>X</K>, recharge 40 s) : invoquez une immense déflagration d'énergie cosmique qui frappe une large zone.</>],
      ["50", <><strong>Grand Éveil</strong> : les attaques spéciales achèvent instantanément les ennemis ordinaires sous 20 % de santé et vous soignent de 50 quand cela arrive.</>],
    ]} />

    <h2>Défense</h2>
    <p>La défense est une statistique et non une arme, mais elle a aussi des bonus de maîtrise. Maintenez <K>F</K> pour bloquer.</p>
    <ul>
      <li><strong>Parade parfaite</strong> (tout le monde) : bloquez environ un quart de seconde avant un coup pour ne subir aucun dégât et faire vaciller l'attaquant. Un attaquant sous 10 % de santé est exécuté instantanément. Dès la maîtrise 5, la parade renvoie aussi 40 % des dégâts.</li>
      <li><strong>Bastion de fer</strong> (maîtrise 20) : pendant le blocage, vous régénérez lentement 3,5 points de santé par seconde.</li>
    </ul>

    <h2>Capacités enseignées</h2>
    <p>Trois capacités s'apprennent auprès d'entraîneurs au lieu de la maîtrise :</p>
    <ul>
      <li><strong>Aura de fer</strong> (<K>H</K>) : auprès de l'entraîneur d'aura de l'Île du Désert, niveau 60, 3 500 $. Activez-la pour plus d'armure et de dégâts. Elle progresse quand vous battez des ennemis lorsqu'elle est active.</li>
      <li><strong>Pas éclair</strong> (<K>T</K>) : auprès du maître du Pas éclair au Village enneigé, niveau 75, 5 000 $. Une téléportation à courte portée.</li>
      <li><strong>Prescience</strong> (<K>K</K>) : auprès du maître de la Prescience au Village enneigé, niveau 80, 7 500 $. Esquive automatiquement un nombre limité d'attaques et récupère une esquive toutes les quelques secondes.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Jouer à Sea Legends</a> <a href="/guides/islands">Guide des îles</a> · <a href="/guides/enemies-and-bosses">Guide des ennemis et boss</a></p>
  </ContentLayout>;
}

export function pt() {
  const head = ["Maestria", "Desbloqueio"];
  return <ContentLayout eyebrow="GUIA DE COMBATE">
    <h1>Armas e habilidades</h1>
    <p className="content-lead">Sea Legends tem quatro estilos de luta: punhos, espada, pistola e habilidades especiais. Cada um evolui separadamente com a <strong>maestria</strong>, que você ganha acertando golpes com aquele estilo. Mais maestria libera bônus passivos e habilidades ativas.</p>

    <h2>Trocar de arma</h2>
    <p>Aperte <K>1</K> para os punhos, <K>2</K> para a espada, <K>3</K> para a pistola e <K>4</K> para sua habilidade especial, depois de ter cada uma. Seu personagem saca a nova arma com uma animação curta. Ataque com <K>Clique esquerdo</K> ou <K>R</K> e segure o botão para continuar atacando. As habilidades ativas usam <K>Z</K>, <K>X</K>, <K>C</K> e <K>V</K>, e o painel de habilidades à direita da tela mostra quais você liberou e o tempo de recarga delas.</p>

    <h2>Punhos</h2>
    <p><strong>Como conseguir:</strong> disponíveis desde o início.</p>
    <p>Ataques seguidos formam um combo de quatro golpes: jab, direto, gancho e uppercut. Continue clicando logo depois do último soco para seguir o combo; se parar, ele recomeça. Os punhos também são a melhor forma de quebrar a casca de gelo dos bandidos congelados da Vila Nevada.</p>
    <Mastery head={head} rows={[
      ["5", <><strong>Punho Meteoro</strong> (<K>Z</K>, recarga de 4 s): um soco carregado que avança 24 unidades na direção para onde você olha. Os socos normais também ganham 15% de chance de crítico com 2,5 vezes o dano.</>],
      ["20", <><strong>Impacto no Chão</strong> (<K>X</K>, recarga de 8 s): salte e golpeie o chão, causando dano a tudo ao redor. Atacar no ar também vira um impacto.</>],
      ["50", <><strong>Socos metralhadora</strong>: seu ataque básico vira uma rajada rápida de socos alternados.</>],
    ]} />
    <p><strong>Estilo do Chute Flamejante.</strong> Old Cinder, na caverna escondida da Cidade Pirata, ensina duas habilidades extras de punhos por $5.000 a partir do nível 30: <strong>Tiro de Brasa</strong> (<K>C</K>, recarga de 6 s), um chute voador de fogo que queima e empurra, e <strong>Chute Infernal</strong> (<K>V</K>, recarga de 18 s), que incendeia suas pernas para que os próximos cinco ataques sejam chutes com 2,5 vezes de dano de fogo.</p>

    <h2>Espada</h2>
    <p><strong>Como conseguir:</strong> compre a Lâmina Inicial com o vendedor de espadas da Ilha Inicial por $120 e 3 madeiras-de-ferro. Os bandidos deixam cair madeira-de-ferro.</p>
    <p>A espada golpeia em um combo de três: um corte de frente, um revés subindo e um golpe pesado de cima para baixo. A lâmina deixa um rastro brilhante e alcança mais longe que os punhos.</p>
    <Mastery head={head} rows={[
      ["5", <><strong>Estocada Perfurante</strong> (<K>Z</K>, recarga de 5 s): um longo golpe em investida que atravessa bloqueios. Os ataques básicos de espada também ganham 12 unidades de alcance.</>],
      ["20", <><strong>Giro Ciclone</strong> (<K>X</K>, recarga de 7 s): gire com a lâmina estendida, acertando todos os inimigos ao redor.</>],
      ["50", <><strong>Lâmina Dimensional</strong>: seus ataques básicos também lançam uma grande onda de corte para a frente.</>],
    ]} />

    <h2>Pistola</h2>
    <p><strong>Como conseguir:</strong> compre a pistola de pederneira na loja do jogo por $220 e 5 sucatas.</p>
    <p>A pistola atira exatamente onde você clica. Clique em um inimigo para acertá-lo, ou no chão para atirar naquele ponto. Clicar na cabeça de um inimigo faz um <strong>tiro na cabeça</strong> com 1,5 vez o dano. O cursor vira uma mira enquanto a pistola está equipada. As balas param em paredes, árvores e pedras, então você precisa de linha de tiro livre. Em telas de toque, toque onde quer atirar ou aperte Atacar para mirar no inimigo visível mais próximo.</p>
    <Mastery head={head} rows={[
      ["5", <><strong>Tiro Duplo</strong> (<K>Z</K>, recarga de 4 s): dispare dois tiros fortes em sequência. Os tiros básicos também disparam uma segunda bala bônus.</>],
      ["20", <><strong>Cone de Chumbo</strong> (<K>X</K>, recarga de 6 s): dispare uma ampla rajada de chumbinhos à sua frente.</>],
      ["50", <><strong>Foco de Atirador</strong>: ficar parado dobra o alcance da pistola.</>],
    ]} />

    <h2>Habilidades especiais</h2>
    <p><strong>Como conseguir:</strong> conclua Encrenca com bandidos na Ilha Inicial e depois fale com o treinador do Pulso da Selva, na Ilha da Selva, para aprender o <strong>Pulso da Selva</strong>.</p>
    <p>Os ataques especiais são feitiços. Suas mãos brilham enquanto ele está equipado, a luz se acumula nelas quando um feitiço carrega, e a energia é liberada com um empurrão das mãos. Seu ataque especial básico é o <strong>Raio Espiritual</strong>: <K>Clique esquerdo</K> (ou <K>C</K>) dispara um raio brilhante no ponto sob o cursor, mais ou menos uma vez por segundo. Como a pistola, ele acerta o que você clica e para nas paredes. Em telas de toque, o botão Atacar mira no inimigo visível mais próximo.</p>
    <Mastery head={head} rows={[
      ["1", <><strong>Raio Espiritual</strong> (<K>Clique esquerdo</K> ou <K>C</K>, recarga de 0,9 s): dispare um raio de energia espiritual no cursor. Disponível assim que você aprende o Pulso da Selva.</>],
      ["5", <><strong>Bolha de Pulso</strong> (<K>Z</K>, recarga de 6 s): uma onda de choque que se expande e empurra os inimigos.</>],
      ["20", <><strong>Julgamento Divino</strong> (<K>X</K>, recarga de 40 s): invoque uma enorme explosão de energia cósmica que atinge uma área ampla.</>],
      ["50", <><strong>Grande Despertar</strong>: ataques especiais acabam na hora com inimigos comuns abaixo de 20% de vida e curam você em 50 quando isso acontece.</>],
    ]} />

    <h2>Defesa</h2>
    <p>Defesa é um atributo, não uma arma, mas também tem bônus de maestria. Segure <K>F</K> para bloquear.</p>
    <ul>
      <li><strong>Defesa perfeita</strong> (todos): bloqueie cerca de um quarto de segundo antes de um golpe para não sofrer dano e fazer o atacante cambalear. Um atacante com menos de 10% de vida é executado na hora. A partir da maestria 5, a defesa também devolve 40% do dano.</li>
      <li><strong>Bastião de Ferro</strong> (maestria 20): enquanto bloqueia, você regenera aos poucos 3,5 de vida por segundo.</li>
    </ul>

    <h2>Habilidades treinadas</h2>
    <p>Três habilidades são ensinadas por treinadores em vez de conquistadas com maestria:</p>
    <ul>
      <li><strong>Aura de Ferro</strong> (<K>H</K>): com o treinador de aura da Ilha do Deserto, nível 60, $3.500. Ative para ganhar mais armadura e dano. Ela sobe de nível conforme você derrota inimigos com ela ativa.</li>
      <li><strong>Passo Relâmpago</strong> (<K>T</K>): com o mestre do Passo Relâmpago na Vila Nevada, nível 75, $5.000. Um teletransporte de curto alcance.</li>
      <li><strong>Previsão</strong> (<K>K</K>): com o mestre da Previsão na Vila Nevada, nível 80, $7.500. Desvia automaticamente de um número limitado de ataques, recuperando um desvio a cada poucos segundos.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Jogar Sea Legends</a> <a href="/guides/islands">Guia das ilhas</a> · <a href="/guides/enemies-and-bosses">Guia de inimigos e chefes</a></p>
  </ContentLayout>;
}

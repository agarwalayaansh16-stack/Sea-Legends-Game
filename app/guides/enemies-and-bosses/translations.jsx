"use client";

import ContentLayout from "../../content-layout";

export const titles = {
  hi: "दुश्मन और बॉस गाइड | Sea Legends",
  es: "Guía de enemigos y jefes | Sea Legends",
  fr: "Guide des ennemis et boss | Sea Legends",
  pt: "Guia de inimigos e chefes | Sea Legends",
};

function EnemyTable({ head, rows }) {
  return <div className="content-table-wrap"><table><thead><tr>{head.map((h) => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>
    {rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}
  </tbody></table></div>;
}

export function hi() {
  return <ContentLayout eyebrow="जीवों की किताब">
    <h1>दुश्मन और बॉस</h1>
    <p className="content-lead">फ़र्स्ट सी के हर द्वीप के अपने दुश्मन हैं, और उनमें से तीन द्वीपों पर एक बॉस है। यह गाइड बताती है कि हर दुश्मन कैसे लड़ता है और उसे कैसे हराएँ। हेल्थ के आँकड़े आपके हथियार और स्टैट बोनस लगने से पहले की शुरुआती हेल्थ हैं।</p>

    <h2>दुश्मन कैसे लड़ते हैं</h2>
    <p>पास आने पर दुश्मन आपको देख लेते हैं और आपका पीछा करते हैं। सामान्य वार से पहले दुश्मन हथियार उठाता है और उसके सिर के ऊपर एक <strong>लाल चमक</strong> दिखती है। वार आधे सेकंड से थोड़ा कम समय बाद लगता है, और सिर्फ़ तब जब आप अब भी पहुँच में हों, इसलिए सही समय पर पीछे हटना, डैश (<kbd>Q</kbd>) या बचाव (<kbd>F</kbd>) करना नुकसान से पूरी तरह बचा लेता है। वार लगने से लगभग चौथाई सेकंड पहले बचाव (<kbd>F</kbd>) करना <strong>परफ़ेक्ट पैरी</strong> है: आपको कोई नुकसान नहीं होता और दुश्मन लड़खड़ाकर पीछे हटता है, जवाबी हमले के लिए खुला। 10% से कम हेल्थ वाले दुश्मन को पैरी करें तो आप उसे वहीं <strong>खत्म</strong> कर देते हैं, बॉस भी।</p>
    <p>आपके वार से दुश्मन लड़खड़ाकर पीछे हटते हैं, जिससे उनका आगे बढ़ना रुक सकता है। भारी दुश्मन (पहलवान और बॉस) पीछे नहीं धकेले जाते। हारे हुए दुश्मन गिर जाते हैं और कुछ सेकंड बाद लौटते हैं; बॉस को लौटने में 45 सेकंड लगते हैं।</p>

    <h2>आम दुश्मन</h2>
    <EnemyTable head={["दुश्मन", "द्वीप", "हेल्थ", "कैसे लड़ता है"]} rows={[
      ["डाकू", "स्टार्टर द्वीप", "95", "पास आकर तलवार घुमाता है। धीमा और आसानी से पढ़ा जा सकता है।"],
      ["बंदर", "जंगल द्वीप", "100", "तेज़, हल्के वार। झुंड में आते हैं।"],
      ["गोरिल्ला", "जंगल द्वीप", "160", "भारी मुक्के, बंदर से दोगुना नुकसान।"],
      ["कटाना वाला समुद्री डाकू", "पाइरेट टाउन", "95", "फुर्तीला है और आपके पास आते ही बगल में हट जाता है, जिससे वार खाली जा सकते हैं।"],
      ["पहलवान रक्षक", "पाइरेट टाउन", "180", "लोहे की गदा लंबे कॉम्बो में घुमाता है और आपको दबोचकर आखिरी वार कर सकता है। पीछे नहीं धकेला जा सकता।"],
      ["रेगिस्तानी डाकू", "रेगिस्तानी द्वीप", "260", "शुरुआती डाकू का ज़्यादा मज़बूत और ज़ोरदार रूप।"],
      ["रेगिस्तानी अफ़सर", "रेगिस्तानी द्वीप", "340", "दूर से पिस्तौल चलाता है और पास आने पर तलवार निकाल लेता है।"],
      ["बर्फ़ीला डाकू", "बर्फ़ीला गाँव", "500", "बर्फ़ के कवच में लिपटा है, जिसे तोड़े बिना पूरा नुकसान नहीं होता।"],
      ["हिममानव", "बर्फ़ीला गाँव", "650", "धीमा पर बहुत मज़बूत, और पास खड़े रहने वाले को पीट डालता है।"],
    ]} />

    <h3>मुश्किल दुश्मनों के लिए सुझाव</h3>
    <ul>
      <li><strong>कटाना वाले समुद्री डाकू:</strong> उनके बगल में हटने का एक कूलडाउन होता है। उन्हें एक बार बचने दें, फिर उसके रिचार्ज होने के दौरान हमला करें। यहाँ बंदूक काम की है क्योंकि आप ठीक वहीं निशाना लगा सकते हैं जहाँ वे पहुँचते हैं।</li>
      <li><strong>पहलवान रक्षक:</strong> कॉम्बो के बीच कभी वार का जवाब वार से न दें। गदा घूमते समय पीछे हटें और कॉम्बो खत्म होने पर आगे बढ़ें।</li>
      <li><strong>रेगिस्तानी अफ़सर:</strong> मध्यम दूरी पर खड़े रहने से उन्हें मुफ़्त निशाने मिलते हैं। या तो जल्दी पास पहुँचें या इमारतों और चट्टानों की आड़ लें, क्योंकि गोलियाँ (उनकी और आपकी) दीवारों पर रुक जाती हैं।</li>
      <li><strong>बर्फ़ीले डाकू:</strong> तलवार बर्फ़ के कवच को मुश्किल से खरोंचती है, जबकि मुक्के उसे जल्दी तोड़ देते हैं। कवच टूटने तक मुक्कों से शुरू करें, फिर कोई भी हथियार इस्तेमाल करें।</li>
    </ul>

    <h2>बॉस</h2>

    <h3>गोरिल्ला किंग (जंगल द्वीप, लेवल 20 क्वेस्ट)</h3>
    <p><strong>हेल्थ:</strong> 750. <strong>इनाम:</strong> $1,200 और 4,500 XP।</p>
    <p>गोरिल्ला किंग भारी कदमों से आपकी ओर आता है और पास से ज़ोरदार मुक्के मारता है। उसका सबसे बड़ा खतरा <strong>चार ज़मीनी प्रहारों</strong> की श्रृंखला है, जो वह आपके पहुँच में आते ही शुरू करता है, और हर प्रहार एक झटके की लहर भेजता है। प्रहार शुरू होते ही पीछे हटें, चौथे का इंतज़ार करें, फिर प्रहार रिचार्ज होने के दौरान पास जाएँ।</p>

    <h3>कैप्टन जेस्टर (पाइरेट टाउन, लेवल 50 क्वेस्ट)</h3>
    <p><strong>हेल्थ:</strong> 850. <strong>इनाम:</strong> $1,500 और 6,000 XP।</p>
    <p>कैप्टन जेस्टर सबसे तेज़ बॉस है। दूर से वह आपकी ओर बढ़ने वाले <strong>हवाई वार</strong> फेंकता है, और पास आने पर <strong>रैपिड रश</strong> इस्तेमाल करता है, एक अचानक झपट्टा जो आपको चीरता हुआ निकल जाता है। हमला करते समय उसके हाथ, पैर और सिर अलग होकर उसके चारों ओर तैरते हैं। उसके सामान्य वार किसी भी समुद्री डाकू से ज़्यादा ज़ोरदार हैं। हवाई वारों से बचने के लिए बगल में चलें, और रैपिड रश के ठीक बाद हमला करें, जिसका कूलडाउन दो सेकंड से कम है।</p>

    <h3>यती (बर्फ़ीला गाँव, लेवल 110 क्वेस्ट)</h3>
    <p><strong>हेल्थ:</strong> 2,000. <strong>इनाम:</strong> $6,800 और 48,000 XP।</p>
    <p>यती गेम का सबसे ताकतवर दुश्मन है और उसके दो बड़े हमले हैं। हर कुछ सेकंड में वह <strong>चार ज़मीनी प्रहारों की श्रृंखला</strong> शुरू करता है। कभी-कभी वह <strong>उल्का मुक्का</strong> तैयार करता है: लगभग दो-तिहाई सेकंड तक अपनी जगह काँपता है, फिर आप पर झपटता है और आपको उछाल देता है। यती को काँपते देखते ही बगल में डैश करके उसके रास्ते से हट जाएँ। ऊँचा डिफ़ेंस स्टैट लेकर आएँ, और पहले फ़ोरसाइट सीखने के बारे में सोचें, क्योंकि उसके अपने आप होने वाले बचाव उल्का मुक्के को झेल सकते हैं।</p>

    <h2>आम सलाह</h2>
    <ul>
      <li>क्वेस्ट लेवल के क्रम में करें। हर द्वीप के दुश्मन उसके क्वेस्ट लेवल के हिसाब से बने हैं, और अपने लेवल से बहुत ऊपर लड़ना भारी पड़ता है।</li>
      <li>स्टैट पॉइंट उस हथियार पर लगाएँ जिसे आप सबसे ज़्यादा इस्तेमाल करते हैं, और डिफ़ेंस पर। हेल्थ और नुकसान आपके स्टैट के साथ बढ़ते हैं।</li>
      <li>बंदूक से हेडशॉट 1.5 गुना नुकसान करते हैं। समय हो तो शरीर की जगह सिर पर निशाना लगाएँ।</li>
      <li>हार जाने पर आप अपनी प्रगति के साथ स्टार्टर द्वीप के डॉक पर फिर से आ जाते हैं।</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Sea Legends खेलें</a> <a href="/guides/islands">द्वीप गाइड</a> · <a href="/guides/weapons-and-skills">हथियार और कौशल</a></p>
  </ContentLayout>;
}

export function es() {
  return <ContentLayout eyebrow="BESTIARIO">
    <h1>Enemigos y jefes</h1>
    <p className="content-lead">Cada isla del Primer Mar tiene sus propios enemigos, y tres de ellas guardan un jefe. Esta guía explica cómo lucha cada enemigo y cómo vencerlo. Los valores de salud son la salud inicial de cada enemigo antes de aplicar las bonificaciones de tu arma y tus atributos.</p>

    <h2>Cómo luchan los enemigos</h2>
    <p>Los enemigos te detectan cuando te acercas y te persiguen. Antes de un golpe cuerpo a cuerpo normal, el enemigo levanta el arma y aparece un <strong>destello rojo</strong> sobre su cabeza. El golpe llega algo menos de medio segundo después, y solo si sigues a su alcance, así que retroceder, esquivar (<kbd>Q</kbd>) o bloquear (<kbd>F</kbd>) en el momento justo evita todo el daño. Bloquear (<kbd>F</kbd>) un cuarto de segundo antes de que llegue el golpe es una <strong>Parada perfecta</strong>: no recibes daño y el enemigo retrocede tambaleándose, expuesto a tu contraataque. Si paras a un enemigo con menos del 10 % de salud, lo <strong>ejecutas</strong> en el acto, jefes incluidos.</p>
    <p>Tus golpes hacen que los enemigos se estremezcan y retrocedan, lo que puede frenar su avance. Los enemigos pesados (matones y jefes) no retroceden. Los enemigos derrotados caen y vuelven a los pocos segundos; los jefes tardan 45 segundos.</p>

    <h2>Enemigos normales</h2>
    <EnemyTable head={["Enemigo", "Isla", "Salud", "Cómo lucha"]} rows={[
      ["Bandido", "Isla Inicial", "95", "Se acerca y da espadazos. Lento y fácil de leer."],
      ["Mono", "Isla de la Selva", "100", "Golpes rápidos y ligeros. Va en grupo."],
      ["Gorila", "Isla de la Selva", "160", "Puñetazos fuertes que hacen el doble de daño que un mono."],
      ["Pirata con katana", "Pueblo Pirata", "95", "Muy ágil; se aparta cuando te acercas, así que tus ataques pueden fallar."],
      ["Matón", "Pueblo Pirata", "180", "Blande una maza de hierro en combos largos y puede inmovilizarte para rematarte. No se le puede hacer retroceder."],
      ["Bandido del desierto", "Isla del Desierto", "260", "Una versión más resistente y contundente del bandido inicial."],
      ["Oficial del desierto", "Isla del Desierto", "340", "Dispara con pistola a distancia y saca una espada cuando te acercas."],
      ["Bandido helado", "Aldea Nevada", "500", "Cubierto por una coraza de hielo que hay que romper antes de que reciba todo el daño."],
      ["Muñeco de nieve", "Aldea Nevada", "650", "Lento pero muy resistente; machaca a quien se queda a su lado."],
    ]} />

    <h3>Consejos para los más difíciles</h3>
    <ul>
      <li><strong>Piratas con katana:</strong> su esquiva tiene recarga. Deja que esquiven una vez y ataca mientras se recarga. La pistola es útil aquí porque puedes apuntar justo donde aterrizan.</li>
      <li><strong>Matones:</strong> nunca intercambies golpes a mitad de su combo. Retrocede mientras gira la maza y entra cuando termine.</li>
      <li><strong>Oficiales del desierto:</strong> quedarte a media distancia les regala disparos. Acorta distancias rápido o usa edificios y rocas como cobertura, ya que las balas (las suyas y las tuyas) se detienen en los muros.</li>
      <li><strong>Bandidos helados:</strong> las espadas apenas arañan la coraza de hielo, mientras que los puños la agrietan rápido. Empieza cuerpo a cuerpo hasta que se rompa y luego cambia a cualquier arma.</li>
    </ul>

    <h2>Jefes</h2>

    <h3>El Rey Gorila (Isla de la Selva, misión de nivel 20)</h3>
    <p><strong>Salud:</strong> 750. <strong>Recompensa:</strong> $1.200 y 4.500 XP.</p>
    <p>El Rey Gorila avanza pesadamente hacia ti y golpea fuerte de cerca. Su mayor amenaza es una serie de <strong>cuatro golpes al suelo</strong> que empieza cuando estás a su alcance, cada uno con una onda expansiva. Aléjate cuando empiecen, espera al cuarto y entra mientras se recarga.</p>

    <h3>Capitán Bufón (Pueblo Pirata, misión de nivel 50)</h3>
    <p><strong>Salud:</strong> 850. <strong>Recompensa:</strong> $1.500 y 6.000 XP.</p>
    <p>El Capitán Bufón es el jefe más rápido. A distancia lanza <strong>tajos de aire</strong> que viajan hacia ti, y de cerca usa <strong>Embestida Rápida</strong>, una estocada repentina que te atraviesa. Al atacar, sus brazos, piernas y cabeza se separan y flotan a su alrededor. Sus golpes normales pegan más fuerte que los de cualquier pirata. Muévete de lado para esquivar los tajos y ataca justo después de una Embestida Rápida, que tarda menos de dos segundos en recargarse.</p>

    <h3>El Yeti (Aldea Nevada, misión de nivel 110)</h3>
    <p><strong>Salud:</strong> 2.000. <strong>Recompensa:</strong> $6.800 y 48.000 XP.</p>
    <p>El Yeti es el enemigo más fuerte del juego y tiene dos grandes ataques. Cada pocos segundos inicia una <strong>serie de cuatro golpes al suelo</strong>. Con menos frecuencia prepara un <strong>Puño Meteoro</strong>: tiembla en el sitio unos dos tercios de segundo y luego se lanza contra ti y te hace salir volando. Cuando veas que el Yeti empieza a temblar, esquiva de lado para salir de su trayectoria. Ven con un atributo de defensa alto y plantéate aprender antes Previsión, ya que sus esquivas automáticas pueden absorber un Puño Meteoro.</p>

    <h2>Consejos generales</h2>
    <ul>
      <li>Haz las misiones en orden de nivel. Los enemigos de cada isla están ajustados a sus niveles de misión, y luchar muy por encima de tu nivel castiga mucho.</li>
      <li>Invierte los puntos de atributo en el arma que más uses y en defensa. La salud y el daño crecen con tus atributos.</li>
      <li>Los disparos a la cabeza con la pistola hacen 1,5 veces el daño. Apunta a la cabeza en lugar del cuerpo cuando tengas tiempo.</li>
      <li>Si te derrotan, reapareces en el muelle de la Isla Inicial con tu progreso intacto.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Jugar a Sea Legends</a> <a href="/guides/islands">Guía de islas</a> · <a href="/guides/weapons-and-skills">Armas y habilidades</a></p>
  </ContentLayout>;
}

export function fr() {
  return <ContentLayout eyebrow="BESTIAIRE">
    <h1>Ennemis et boss</h1>
    <p className="content-lead">Chaque île de la Première Mer a ses propres ennemis, et trois d'entre elles abritent un boss. Ce guide explique comment chaque ennemi se bat et comment le vaincre. Les valeurs de santé correspondent à la santé de départ de chaque ennemi, avant les bonus de votre arme et de vos statistiques.</p>

    <h2>Comment les ennemis se battent</h2>
    <p>Les ennemis vous repèrent quand vous approchez et vous poursuivent. Avant un coup au corps à corps ordinaire, l'ennemi lève son arme et un <strong>éclair rouge</strong> apparaît au-dessus de sa tête. Le coup tombe un peu moins d'une demi-seconde plus tard, et seulement si vous êtes encore à portée : reculer, faire une ruée (<kbd>Q</kbd>) ou bloquer (<kbd>F</kbd>) au bon moment évite tous les dégâts. Bloquer (<kbd>F</kbd>) environ un quart de seconde avant l'impact donne une <strong>Parade parfaite</strong> : vous ne subissez aucun dégât et l'ennemi recule, exposé à votre contre-attaque. Parez un ennemi sous 10 % de santé et vous l'<strong>exécutez</strong> sur-le-champ, boss compris.</p>
    <p>Vos coups font tressaillir et reculer les ennemis, ce qui peut freiner leur avancée. Les ennemis lourds (brutes et boss) ne reculent pas. Les ennemis vaincus tombent et reviennent quelques secondes plus tard ; les boss mettent 45 secondes.</p>

    <h2>Ennemis ordinaires</h2>
    <EnemyTable head={["Ennemi", "Île", "Santé", "Comment il se bat"]} rows={[
      ["Bandit", "Île de départ", "95", "S'approche et frappe à l'épée. Lent et facile à lire."],
      ["Singe", "Île de la Jungle", "100", "Coups rapides et légers. Arrive en groupe."],
      ["Gorille", "Île de la Jungle", "160", "Coups de poing lourds, deux fois plus forts que ceux d'un singe."],
      ["Pirate au katana", "Ville Pirate", "95", "Très vif ; s'écarte quand vous approchez, si bien que vos attaques peuvent rater."],
      ["Brute", "Ville Pirate", "180", "Manie une masse de fer en longs combos et peut vous immobiliser pour vous achever. Impossible à repousser."],
      ["Bandit du désert", "Île du Désert", "260", "Une version plus solide et plus puissante du bandit de départ."],
      ["Officier du désert", "Île du Désert", "340", "Tire au pistolet à distance et dégaine une lame quand vous approchez."],
      ["Bandit gelé", "Village enneigé", "500", "Couvert d'une carapace de glace à briser avant qu'il ne subisse tous les dégâts."],
      ["Bonhomme de neige", "Village enneigé", "650", "Lent mais très résistant ; il roue de coups quiconque reste à côté de lui."],
    ]} />

    <h3>Conseils pour les plus coriaces</h3>
    <ul>
      <li><strong>Pirates au katana :</strong> leur esquive a un temps de recharge. Laissez-les esquiver une fois, puis attaquez pendant la recharge. Le pistolet est utile ici, car vous pouvez viser exactement là où ils atterrissent.</li>
      <li><strong>Brutes :</strong> n'échangez jamais de coups en plein combo. Reculez pendant que la masse tourne et avancez quand le combo se termine.</li>
      <li><strong>Officiers du désert :</strong> rester à mi-distance leur offre des tirs faciles. Rapprochez-vous vite ou utilisez bâtiments et rochers comme couverture, car les balles (les leurs comme les vôtres) s'arrêtent sur les murs.</li>
      <li><strong>Bandits gelés :</strong> les épées égratignent à peine la carapace, alors que les poings la fissurent vite. Commencez au corps à corps jusqu'à ce qu'elle éclate, puis prenez l'arme de votre choix.</li>
    </ul>

    <h2>Boss</h2>

    <h3>Le Roi Gorille (Île de la Jungle, quête de niveau 20)</h3>
    <p><strong>Santé :</strong> 750. <strong>Récompense :</strong> 1 200 $ et 4 500 XP.</p>
    <p>Le Roi Gorille avance lourdement vers vous et frappe fort au contact. Sa principale menace est une série de <strong>quatre frappes au sol</strong> qu'il déclenche dès que vous êtes à portée, chacune envoyant une onde de choc. Reculez quand elles commencent, attendez la quatrième, puis approchez pendant la recharge.</p>

    <h3>Capitaine Bouffon (Ville Pirate, quête de niveau 50)</h3>
    <p><strong>Santé :</strong> 850. <strong>Récompense :</strong> 1 500 $ et 6 000 XP.</p>
    <p>Le Capitaine Bouffon est le boss le plus rapide. À distance, il lance des <strong>lames d'air</strong> qui filent vers vous, et de près il utilise la <strong>Ruée Éclair</strong>, une fente soudaine qui vous transperce. Quand il attaque, ses bras, ses jambes et sa tête se détachent et flottent autour de lui. Ses coups ordinaires frappent plus fort que ceux de n'importe quel pirate. Déplacez-vous latéralement pour éviter les lames d'air et attaquez juste après une Ruée Éclair, qui se recharge en moins de deux secondes.</p>

    <h3>Le Yéti (Village enneigé, quête de niveau 110)</h3>
    <p><strong>Santé :</strong> 2 000. <strong>Récompense :</strong> 6 800 $ et 48 000 XP.</p>
    <p>Le Yéti est l'ennemi le plus fort du jeu et possède deux grandes attaques. Toutes les quelques secondes, il lance une <strong>série de quatre frappes au sol</strong>. Plus rarement, il prépare un <strong>Poing Météore</strong> : il tremble sur place pendant environ deux tiers de seconde, puis se jette sur vous et vous envoie voler. Dès que le Yéti se met à trembler, faites une ruée sur le côté pour sortir de sa trajectoire. Venez avec une bonne défense et pensez à apprendre d'abord la Prescience, dont les esquives automatiques peuvent absorber un Poing Météore.</p>

    <h2>Conseils généraux</h2>
    <ul>
      <li>Faites les quêtes dans l'ordre des niveaux. Les ennemis de chaque île sont réglés sur ses niveaux de quête, et combattre bien au-dessus de votre niveau est très punitif.</li>
      <li>Investissez vos points dans l'arme que vous utilisez le plus et dans la défense. La santé et les dégâts augmentent avec vos statistiques.</li>
      <li>Les tirs à la tête au pistolet infligent 1,5 fois les dégâts. Visez la tête plutôt que le corps quand vous en avez le temps.</li>
      <li>Si vous êtes vaincu, vous réapparaissez au quai de l'Île de départ sans perdre votre progression.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Jouer à Sea Legends</a> <a href="/guides/islands">Guide des îles</a> · <a href="/guides/weapons-and-skills">Armes et compétences</a></p>
  </ContentLayout>;
}

export function pt() {
  return <ContentLayout eyebrow="BESTIÁRIO">
    <h1>Inimigos e chefes</h1>
    <p className="content-lead">Cada ilha do Primeiro Mar tem seus próprios inimigos, e três delas guardam um chefe. Este guia explica como cada inimigo luta e como vencê-lo. Os valores de vida são a vida inicial de cada inimigo, antes dos bônus da sua arma e dos seus atributos.</p>

    <h2>Como os inimigos lutam</h2>
    <p>Os inimigos percebem você quando você se aproxima e partem para cima. Antes de um golpe corpo a corpo comum, o inimigo ergue a arma e um <strong>brilho vermelho</strong> aparece sobre a cabeça dele. O golpe acerta pouco menos de meio segundo depois, e só se você ainda estiver ao alcance, então recuar, usar o avanço (<kbd>Q</kbd>) ou bloquear (<kbd>F</kbd>) na hora certa evita todo o dano. Bloquear (<kbd>F</kbd>) cerca de um quarto de segundo antes do golpe acertar é uma <strong>Defesa perfeita</strong>: você não sofre dano e o inimigo cambaleia para trás, exposto ao seu contra-ataque. Defenda um inimigo com menos de 10% de vida e você o <strong>executa</strong> na hora, chefes incluídos.</p>
    <p>Seus golpes fazem os inimigos vacilar e recuar, o que pode interromper o avanço deles. Inimigos pesados (brutamontes e chefes) não são empurrados. Inimigos derrotados caem e voltam alguns segundos depois; os chefes levam 45 segundos.</p>

    <h2>Inimigos comuns</h2>
    <EnemyTable head={["Inimigo", "Ilha", "Vida", "Como luta"]} rows={[
      ["Bandido", "Ilha Inicial", "95", "Chega perto e golpeia com a espada. Lento e fácil de prever."],
      ["Macaco", "Ilha da Selva", "100", "Golpes rápidos e leves. Anda em grupo."],
      ["Gorila", "Ilha da Selva", "160", "Socos pesados com o dobro do dano de um macaco."],
      ["Pirata com katana", "Cidade Pirata", "95", "Ágil; desvia para o lado quando você se aproxima, então seus ataques podem errar."],
      ["Brutamontes", "Cidade Pirata", "180", "Gira uma maça de ferro em combos longos e pode imobilizar você para o golpe final. Não pode ser empurrado."],
      ["Bandido do deserto", "Ilha do Deserto", "260", "Uma versão mais resistente e forte do bandido inicial."],
      ["Oficial do deserto", "Ilha do Deserto", "340", "Atira de pistola à distância e saca uma lâmina quando você chega perto."],
      ["Bandido congelado", "Vila Nevada", "500", "Envolto em uma casca de gelo que precisa ser quebrada antes de ele sofrer dano total."],
      ["Boneco de neve", "Vila Nevada", "650", "Lento, mas muito resistente, e esmurra quem fica ao lado dele."],
    ]} />

    <h3>Dicas para os mais difíceis</h3>
    <ul>
      <li><strong>Piratas com katana:</strong> o desvio deles tem recarga. Deixe que desviem uma vez e ataque enquanto recarrega. A pistola ajuda aqui porque você pode mirar exatamente onde eles param.</li>
      <li><strong>Brutamontes:</strong> nunca troque golpes no meio do combo. Recue enquanto a maça gira e avance quando o combo terminar.</li>
      <li><strong>Oficiais do deserto:</strong> ficar a média distância dá tiros fáceis a eles. Encurte a distância rápido ou use prédios e pedras como cobertura, já que as balas (as deles e as suas) param nas paredes.</li>
      <li><strong>Bandidos congelados:</strong> as espadas mal arranham a casca de gelo, enquanto os punhos a racham rápido. Comece no corpo a corpo até a casca quebrar e depois troque para qualquer arma.</li>
    </ul>

    <h2>Chefes</h2>

    <h3>O Rei Gorila (Ilha da Selva, missão de nível 20)</h3>
    <p><strong>Vida:</strong> 750. <strong>Recompensa:</strong> $1.200 e 4.500 XP.</p>
    <p>O Rei Gorila avança pesadamente até você e soca forte de perto. Sua maior ameaça é uma sequência de <strong>quatro impactos no chão</strong> que ele começa quando você está ao alcance, cada um com uma onda de choque. Recue quando os impactos começarem, espere o quarto e avance enquanto ele recarrega.</p>

    <h3>Capitão Bufão (Cidade Pirata, missão de nível 50)</h3>
    <p><strong>Vida:</strong> 850. <strong>Recompensa:</strong> $1.500 e 6.000 XP.</p>
    <p>O Capitão Bufão é o chefe mais rápido. De longe, ele lança <strong>cortes de ar</strong> que vêm na sua direção, e de perto usa a <strong>Investida Rápida</strong>, um bote repentino que atravessa você. Enquanto ataca, seus braços, pernas e cabeça se separam e flutuam ao redor dele. Seus golpes comuns batem mais forte que os de qualquer pirata. Ande de lado para desviar dos cortes de ar e ataque logo depois de uma Investida Rápida, que recarrega em menos de dois segundos.</p>

    <h3>O Yeti (Vila Nevada, missão de nível 110)</h3>
    <p><strong>Vida:</strong> 2.000. <strong>Recompensa:</strong> $6.800 e 48.000 XP.</p>
    <p>O Yeti é o inimigo mais forte do jogo e tem dois grandes ataques. A cada poucos segundos ele começa uma <strong>sequência de quatro impactos no chão</strong>. Com menos frequência, prepara um <strong>Punho Meteoro</strong>: treme no lugar por cerca de dois terços de segundo e então se lança contra você, arremessando você longe. Quando vir o Yeti tremer, use o avanço para o lado e saia do caminho. Venha com um atributo de defesa alto e pense em aprender a Previsão antes, já que os desvios automáticos dela podem absorver um Punho Meteoro.</p>

    <h2>Conselhos gerais</h2>
    <ul>
      <li>Faça as missões na ordem dos níveis. Os inimigos de cada ilha são ajustados aos níveis das missões dela, e lutar muito acima do seu nível é punitivo.</li>
      <li>Gaste os pontos de atributo na arma que você mais usa e na defesa. Vida e dano crescem com seus atributos.</li>
      <li>Tiros na cabeça com a pistola causam 1,5 vez o dano. Mire na cabeça em vez do corpo quando tiver tempo.</li>
      <li>Se for derrotado, você reaparece no cais da Ilha Inicial sem perder o progresso.</li>
    </ul>
    <p><a className="content-button" href="/#game-root">Jogar Sea Legends</a> <a href="/guides/islands">Guia das ilhas</a> · <a href="/guides/weapons-and-skills">Armas e habilidades</a></p>
  </ContentLayout>;
}

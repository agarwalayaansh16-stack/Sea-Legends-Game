// ── 36-i18n.js ─ Game language switching (English, Hindi, Spanish, French, Portuguese).
//
// The game's code writes English text into the page as usual. This module
// watches the page and swaps each piece of interface text for its translation,
// so no gameplay code has to change. Text it has no translation for (the event
// log, for example) stays in English. The choice is saved in this browser.

const I18N_LANGS = ["en", "hi", "es", "fr", "pt"];
const I18N_STORAGE_KEY = "sea-legends-language";

// [English, हिन्दी, Español, Français, Português]
const I18N_ROWS = [
  // Loading screen and errors
  ["A free 3D pirate adventure", "एक मुफ़्त 3D समुद्री डाकू एडवेंचर", "Una aventura pirata en 3D gratuita", "Une aventure pirate 3D gratuite", "Uma aventura pirata 3D gratuita"],
  ["Explore the First Sea, master your weapons and take on its bosses.", "पहले समुद्र की खोज करें, अपने हथियारों में महारत हासिल करें और उसके बॉस से लड़ें।", "Explora el Primer Mar, domina tus armas y enfréntate a sus jefes.", "Explorez la Première Mer, maîtrisez vos armes et affrontez ses boss.", "Explore o Primeiro Mar, domine suas armas e enfrente seus chefes."],
  ["Loading Sea Legends…", "Sea Legends लोड हो रहा है…", "Cargando Sea Legends…", "Chargement de Sea Legends…", "Carregando Sea Legends…"],
  ["Play", "खेलें", "Jugar", "Jouer", "Jogar"],
  ["Language", "भाषा", "Idioma", "Langue", "Idioma"],
  ["Sound", "आवाज़", "Sonido", "Son", "Som"],
  ["Trailer sound", "ट्रेलर की आवाज़", "Sonido del tráiler", "Son de la bande-annonce", "Som do trailer"],
  ["Home", "होम", "Inicio", "Accueil", "Início"],
  ["About", "हमारे बारे में", "Acerca de", "À propos", "Sobre"],
  ["Game Guide", "गेम गाइड", "Guía del juego", "Guide du jeu", "Guia do jogo"],
  ["Contact", "संपर्क", "Contacto", "Contact", "Contato"],
  ["Terms & Conditions", "नियम और शर्तें", "Términos y condiciones", "Conditions générales", "Termos e condições"],
  ["Privacy Policy", "गोपनीयता नीति", "Política de privacidad", "Politique de confidentialité", "Política de privacidade"],
  ["Disclaimer", "अस्वीकरण", "Aviso legal", "Avertissement", "Aviso legal"],
  ["Sea Legends could not start", "Sea Legends शुरू नहीं हो सका", "Sea Legends no pudo iniciarse", "Sea Legends n'a pas pu démarrer", "Sea Legends não pôde iniciar"],
  ["Check your connection and browser graphics support, then try again.", "अपना इंटरनेट कनेक्शन और ब्राउज़र का ग्राफ़िक्स सपोर्ट जाँचें, फिर दोबारा कोशिश करें।", "Revisa tu conexión y la compatibilidad gráfica del navegador, y vuelve a intentarlo.", "Vérifiez votre connexion et la prise en charge graphique du navigateur, puis réessayez.", "Verifique sua conexão e o suporte gráfico do navegador e tente novamente."],
  ["Reload game", "गेम दोबारा लोड करें", "Recargar el juego", "Recharger le jeu", "Recarregar o jogo"],

  // Touch controls
  ["Attack", "हमला", "Atacar", "Attaquer", "Atacar"],
  ["Jump", "कूदें", "Saltar", "Sauter", "Pular"],
  ["Interact", "बातचीत", "Interactuar", "Interagir", "Interagir"],
  ["Touch game controls", "टच कंट्रोल", "Controles táctiles", "Commandes tactiles", "Controles de toque"],
  ["Movement", "चलना", "Movimiento", "Déplacement", "Movimento"],
  ["Move forward", "आगे चलें", "Avanzar", "Avancer", "Avançar"],
  ["Move left", "बाएँ चलें", "Moverse a la izquierda", "Aller à gauche", "Mover para a esquerda"],
  ["Move backward", "पीछे चलें", "Retroceder", "Reculer", "Recuar"],
  ["Move right", "दाएँ चलें", "Moverse a la derecha", "Aller à droite", "Mover para a direita"],
  ["Actions", "एक्शन", "Acciones", "Actions", "Ações"],
  ["Select weapon", "हथियार चुनें", "Elegir arma", "Choisir une arme", "Escolher arma"],
  ["Select melee", "मुक्के चुनें", "Elegir puños", "Choisir les poings", "Escolher punhos"],
  ["Select sword", "तलवार चुनें", "Elegir espada", "Choisir l'épée", "Escolher espada"],
  ["Select gun", "बंदूक चुनें", "Elegir pistola", "Choisir le pistolet", "Escolher pistola"],
  ["Select special weapon", "स्पेशल हथियार चुनें", "Elegir arma especial", "Choisir l'arme spéciale", "Escolher arma especial"],

  // Profiles
  ["Local game profile", "लोकल गेम प्रोफ़ाइल", "Perfil de juego local", "Profil de jeu local", "Perfil de jogo local"],
  ["Choose your profile", "अपनी प्रोफ़ाइल चुनें", "Elige tu perfil", "Choisissez votre profil", "Escolha seu perfil"],
  ["Create or choose a local profile to resume your adventure on this browser.", "इस ब्राउज़र पर अपना एडवेंचर जारी रखने के लिए लोकल प्रोफ़ाइल बनाएँ या चुनें।", "Crea o elige un perfil local para continuar tu aventura en este navegador.", "Créez ou choisissez un profil local pour reprendre votre aventure dans ce navigateur.", "Crie ou escolha um perfil local para continuar sua aventura neste navegador."],
  ["This is not an account or sign-in service. Profile names and game progress are stored in this browser only.", "यह कोई अकाउंट या साइन-इन सेवा नहीं है। प्रोफ़ाइल के नाम और गेम की प्रगति सिर्फ़ इसी ब्राउज़र में सेव होती है।", "Esto no es una cuenta ni un servicio de inicio de sesión. Los nombres de perfil y el progreso solo se guardan en este navegador.", "Ce n'est ni un compte ni un service de connexion. Les noms de profil et la progression sont enregistrés uniquement dans ce navigateur.", "Isto não é uma conta nem um serviço de login. Os nomes de perfil e o progresso ficam salvos apenas neste navegador."],
  ["Saved on this browser", "इस ब्राउज़र में सेव", "Guardado en este navegador", "Enregistré dans ce navigateur", "Salvo neste navegador"],
  ["Profile name", "प्रोफ़ाइल का नाम", "Nombre del perfil", "Nom du profil", "Nome do perfil"],
  ["Continue adventure", "एडवेंचर जारी रखें", "Continuar aventura", "Continuer l'aventure", "Continuar aventura"],
  ["New here?", "पहली बार आए हैं?", "¿Eres nuevo?", "Nouveau ici ?", "É novo aqui?"],
  ["Create a profile", "प्रोफ़ाइल बनाएँ", "Crear un perfil", "Créer un profil", "Criar um perfil"],
  ["New profile name", "नई प्रोफ़ाइल का नाम", "Nombre del nuevo perfil", "Nom du nouveau profil", "Nome do novo perfil"],
  ["Create profile & play", "प्रोफ़ाइल बनाएँ और खेलें", "Crear perfil y jugar", "Créer le profil et jouer", "Criar perfil e jogar"],
  ["Back to profiles", "प्रोफ़ाइल पर वापस", "Volver a los perfiles", "Retour aux profils", "Voltar aos perfis"],
  ["Local profiles cannot be recovered or transferred. They are stored only in this browser. No email or SMS verification is available.", "लोकल प्रोफ़ाइल न तो वापस मिल सकती हैं, न ट्रांसफ़र हो सकती हैं। ये सिर्फ़ इसी ब्राउज़र में रहती हैं। ईमेल या SMS से पुष्टि उपलब्ध नहीं है।", "Los perfiles locales no se pueden recuperar ni transferir. Solo se guardan en este navegador. No hay verificación por correo ni SMS.", "Les profils locaux ne peuvent être ni récupérés ni transférés. Ils sont stockés uniquement dans ce navigateur. Aucune vérification par e-mail ou SMS n'est disponible.", "Perfis locais não podem ser recuperados nem transferidos. Eles ficam apenas neste navegador. Não há verificação por e-mail ou SMS."],
  ["Read the game guide", "गेम गाइड पढ़ें", "Leer la guía del juego", "Lire le guide du jeu", "Ler o guia do jogo"],
  ["no profile needed", "प्रोफ़ाइल की ज़रूरत नहीं", "no se necesita perfil", "aucun profil requis", "sem perfil necessário"],
  ["Enter profile name", "प्रोफ़ाइल का नाम लिखें", "Escribe el nombre del perfil", "Saisissez le nom du profil", "Digite o nome do perfil"],
  ["Pick a name (not your real name)", "कोई नाम चुनें (अपना असली नाम नहीं)", "Elige un nombre (no tu nombre real)", "Choisissez un nom (pas votre vrai nom)", "Escolha um nome (não o seu nome real)"],

  // Start screen and avatar
  ["Choose Your Path", "अपना रास्ता चुनें", "Elige tu camino", "Choisissez votre voie", "Escolha seu caminho"],
  ["Sail the seas, clear islands, master weapons, and uncover a special ability questline.", "समुद्र में सफ़र करें, द्वीप जीतें, हथियारों में महारत पाएँ और स्पेशल एबिलिटी की क्वेस्ट खोजें।", "Navega los mares, conquista islas, domina armas y descubre una misión de habilidad especial.", "Naviguez sur les mers, libérez les îles, maîtrisez les armes et découvrez une quête de capacité spéciale.", "Navegue pelos mares, conquiste ilhas, domine armas e descubra uma missão de habilidade especial."],
  ["Avatar Studio", "अवतार स्टूडियो", "Estudio de avatar", "Studio d'avatar", "Estúdio de avatar"],
  ["Choose, preview, edit, create, or delete your human avatar.", "अपना अवतार चुनें, देखें, बदलें, बनाएँ या हटाएँ।", "Elige, previsualiza, edita, crea o elimina tu avatar.", "Choisissez, prévisualisez, modifiez, créez ou supprimez votre avatar.", "Escolha, visualize, edite, crie ou exclua seu avatar."],
  ["Open 3D Studio", "3D स्टूडियो खोलें", "Abrir estudio 3D", "Ouvrir le studio 3D", "Abrir estúdio 3D"],
  ["Preview Avatar", "अवतार देखें", "Vista previa del avatar", "Aperçu de l'avatar", "Pré-visualizar avatar"],
  ["Saved Avatars", "सेव किए गए अवतार", "Avatares guardados", "Avatars enregistrés", "Avatares salvos"],
  ["Live preview", "लाइव प्रीव्यू", "Vista previa en vivo", "Aperçu en direct", "Pré-visualização ao vivo"],
  ["Balanced bulk.", "संतुलित शरीर।", "Complexión equilibrada.", "Carrure équilibrée.", "Porte equilibrado."],
  ["Customize", "कस्टमाइज़ करें", "Personalizar", "Personnaliser", "Personalizar"],
  ["Skin", "त्वचा", "Piel", "Peau", "Pele"],
  ["Shirt", "शर्ट", "Camisa", "Chemise", "Camisa"],
  ["Pants", "पैंट", "Pantalones", "Pantalon", "Calça"],
  ["Hair", "बाल", "Pelo", "Cheveux", "Cabelo"],
  ["Eyes", "आँखें", "Ojos", "Yeux", "Olhos"],
  ["Boots", "जूते", "Botas", "Bottes", "Botas"],
  ["Hair Style", "हेयरस्टाइल", "Peinado", "Coiffure", "Penteado"],
  ["Short", "छोटे", "Corto", "Courts", "Curto"],
  ["Spiky", "नुकीले", "De punta", "En pics", "Espetado"],
  ["Captain Cap", "कप्तान टोपी", "Gorra de capitán", "Casquette de capitaine", "Boné de capitão"],
  ["Messy", "बिखरे", "Despeinado", "En bataille", "Bagunçado"],
  ["Outfit", "पोशाक", "Atuendo", "Tenue", "Roupa"],
  ["Sailor", "नाविक", "Marinero", "Marin", "Marinheiro"],
  ["Long Coat", "लंबा कोट", "Abrigo largo", "Long manteau", "Casaco longo"],
  ["Light Armor", "हल्का कवच", "Armadura ligera", "Armure légère", "Armadura leve"],
  ["Adventurer Vest", "एडवेंचरर जैकेट", "Chaleco de aventurero", "Gilet d'aventurier", "Colete de aventureiro"],
  ["Height", "लंबाई", "Altura", "Taille", "Altura"],
  ["Bulk", "शरीर", "Complexión", "Carrure", "Porte"],
  ["Save Changes", "बदलाव सेव करें", "Guardar cambios", "Enregistrer", "Salvar alterações"],
  ["Create New", "नया बनाएँ", "Crear nuevo", "Créer", "Criar novo"],
  ["Delete Selected", "चुना हुआ हटाएँ", "Eliminar seleccionado", "Supprimer la sélection", "Excluir selecionado"],
  ["Choose Your Side", "अपना पक्ष चुनें", "Elige tu bando", "Choisissez votre camp", "Escolha seu lado"],
  ["Pirates", "समुद्री डाकू", "Piratas", "Pirates", "Piratas"],
  ["Earn extra money from quests.", "क्वेस्ट से ज़्यादा पैसे कमाएँ।", "Gana más dinero con las misiones.", "Gagnez plus d'argent avec les quêtes.", "Ganhe mais dinheiro com missões."],
  ["Marines", "मरीन", "Marines", "Marines", "Fuzileiros"],
  ["Gain bonus defense from training.", "ट्रेनिंग से अतिरिक्त डिफ़ेंस पाएँ।", "Obtén defensa extra por el entrenamiento.", "Gagnez une défense bonus grâce à l'entraînement.", "Ganhe defesa extra com o treinamento."],
  ["Neutral", "तटस्थ", "Neutral", "Neutre", "Neutro"],
  ["No allegiance. Balanced progression.", "किसी का पक्ष नहीं। संतुलित प्रगति।", "Sin lealtades. Progreso equilibrado.", "Aucune allégeance. Progression équilibrée.", "Sem lealdade. Progressão equilibrada."],

  // HUD and top bar
  ["Stats", "आँकड़े", "Estadísticas", "Stats", "Atributos"],
  ["Inventory", "इन्वेंटरी", "Inventario", "Inventaire", "Inventário"],
  ["Shop", "दुकान", "Tienda", "Boutique", "Loja"],
  ["Studio", "स्टूडियो", "Estudio", "Studio", "Estúdio"],
  ["Close", "बंद करें", "Cerrar", "Fermer", "Fechar"],
  ["Health", "हेल्थ", "Salud", "Santé", "Vida"],
  ["Energy", "ऊर्जा", "Energía", "Énergie", "Energia"],
  ["Game Settings", "गेम सेटिंग्स", "Ajustes del juego", "Paramètres du jeu", "Configurações do jogo"],
  ["Teleport ready", "टेलीपोर्ट तैयार", "Teletransporte listo", "Téléportation prête", "Teleporte pronto"],
  ["Teleported home", "घर टेलीपोर्ट हुए", "Teletransportado a casa", "Téléporté à la maison", "Teleportado para casa"],
  ["Multiplayer offline", "मल्टीप्लेयर ऑफ़लाइन", "Multijugador sin conexión", "Multijoueur hors ligne", "Multijogador offline"],
  ["Multiplayer not configured", "मल्टीप्लेयर सेट नहीं है", "Multijugador no configurado", "Multijoueur non configuré", "Multijogador não configurado"],
  ["Servers offline", "सर्वर ऑफ़लाइन", "Servidores sin conexión", "Serveurs hors ligne", "Servidores offline"],
  ["Servers offline · retrying", "सर्वर ऑफ़लाइन · फिर कोशिश", "Servidores sin conexión · reintentando", "Serveurs hors ligne · nouvel essai", "Servidores offline · tentando de novo"],
  ["Disconnected · reconnecting", "डिस्कनेक्ट · फिर जुड़ रहे हैं", "Desconectado · reconectando", "Déconnecté · reconnexion", "Desconectado · reconectando"],
  ["Servers", "सर्वर", "Servidores", "Serveurs", "Servidores"],
  ["Controls", "कंट्रोल", "Controles", "Commandes", "Controles"],
  ["Quest", "क्वेस्ट", "Misión", "Quête", "Missão"],
  ["Music", "संगीत", "Música", "Musique", "Música"],
  ["Log Out", "लॉग आउट", "Salir", "Déconnexion", "Sair"],
  ["World servers", "वर्ल्ड सर्वर", "Servidores del mundo", "Serveurs du monde", "Servidores do mundo"],
  ["Up to 10 players in each server.", "हर सर्वर में 10 खिलाड़ी तक।", "Hasta 10 jugadores por servidor.", "Jusqu'à 10 joueurs par serveur.", "Até 10 jogadores por servidor."],
  ["Connect to browse available servers.", "उपलब्ध सर्वर देखने के लिए कनेक्ट करें।", "Conéctate para ver los servidores disponibles.", "Connectez-vous pour parcourir les serveurs disponibles.", "Conecte-se para ver os servidores disponíveis."],
  ["Find an open server", "खाली सर्वर ढूँढें", "Buscar un servidor libre", "Trouver un serveur libre", "Encontrar um servidor livre"],
  ["Close server browser", "सर्वर सूची बंद करें", "Cerrar lista de servidores", "Fermer la liste des serveurs", "Fechar lista de servidores"],
  ["Time until the next part of the day", "दिन के अगले हिस्से तक का समय", "Tiempo hasta la siguiente parte del día", "Temps avant la prochaine partie de la journée", "Tempo até a próxima parte do dia"],
  ["Day", "दिन", "Día", "Jour", "Dia"],
  ["Sunset", "सूर्यास्त", "Atardecer", "Coucher du soleil", "Pôr do sol"],
  ["Night", "रात", "Noche", "Nuit", "Noite"],
  ["Sunrise", "सूर्योदय", "Amanecer", "Lever du soleil", "Nascer do sol"],

  // Quests
  ["Find the Quest Giver", "क्वेस्ट देने वाले को ढूँढें", "Encuentra al dador de misiones", "Trouvez le donneur de quêtes", "Encontre quem dá as missões"],
  ["Walk to the gold marker on Starter Island and press E.", "स्टार्टर द्वीप पर सुनहरे निशान तक जाएँ और E दबाएँ।", "Ve al marcador dorado de la Isla Inicial y pulsa E.", "Allez au marqueur doré sur l'Île de départ et appuyez sur E.", "Vá até o marcador dourado na Ilha Inicial e aperte E."],
  ["Walk to the gold Quest NPC on Starter Island and press E.", "स्टार्टर द्वीप पर सुनहरे क्वेस्ट NPC तक जाएँ और E दबाएँ।", "Ve al PNJ dorado de misiones en la Isla Inicial y pulsa E.", "Allez voir le PNJ doré des quêtes sur l'Île de départ et appuyez sur E.", "Vá até o NPC dourado de missões na Ilha Inicial e aperte E."],
  ["Starter Island Cleared", "स्टार्टर द्वीप साफ़", "Isla Inicial despejada", "Île de départ libérée", "Ilha Inicial liberada"],
  ["Quest Board", "क्वेस्ट बोर्ड", "Tablón de misiones", "Tableau des quêtes", "Quadro de missões"],
  ["Choose a quest.", "एक क्वेस्ट चुनें।", "Elige una misión.", "Choisissez une quête.", "Escolha uma missão."],
  ["Decline", "मना करें", "Rechazar", "Refuser", "Recusar"],
  ["Bandit Trouble", "डाकुओं की मुसीबत", "Problemas con bandidos", "Ennuis de bandits", "Encrenca com bandidos"],
  ["Defeat 5 starter bandits.", "5 डाकुओं को हराएँ।", "Derrota a 5 bandidos.", "Battez 5 bandits.", "Derrote 5 bandidos."],
  ["Monkey Mischief", "बंदरों की शरारत", "Travesuras de monos", "Bêtises de singes", "Travessura dos macacos"],
  ["Defeat 5 jungle monkeys.", "जंगल के 5 बंदरों को हराएँ।", "Derrota a 5 monos de la selva.", "Battez 5 singes de la jungle.", "Derrote 5 macacos da selva."],
  ["Gorilla Strength", "गोरिल्ला की ताकत", "Fuerza de gorila", "Force de gorille", "Força de gorila"],
  ["Defeat 5 wild gorillas.", "5 जंगली गोरिल्लाओं को हराएँ।", "Derrota a 5 gorilas salvajes.", "Battez 5 gorilles sauvages.", "Derrote 5 gorilas selvagens."],
  ["The Gorilla King", "गोरिल्ला किंग", "El Rey Gorila", "Le Roi Gorille", "O Rei Gorila"],
  ["Defeat the Gorilla King boss.", "बॉस गोरिल्ला किंग को हराएँ।", "Derrota al jefe Rey Gorila.", "Battez le boss Roi Gorille.", "Derrote o chefe Rei Gorila."],
  ["Pirate Ambush", "डाकुओं का घात", "Emboscada pirata", "Embuscade pirate", "Emboscada pirata"],
  ["Defeat 6 katana pirates at Pirate Town.", "पाइरेट टाउन में 6 कटाना डाकुओं को हराएँ।", "Derrota a 6 piratas con katana en Pueblo Pirata.", "Battez 6 pirates à katana à Ville Pirate.", "Derrote 6 piratas de katana na Cidade Pirata."],
  ["Iron Mace Brutes", "लोहे की गदा वाले पहलवान", "Brutos de maza de hierro", "Brutes à masse de fer", "Brutamontes da maça de ferro"],
  ["Defeat 4 brute enforcers.", "4 पहलवान रक्षकों को हराएँ।", "Derrota a 4 brutos ejecutores.", "Battez 4 brutes de main.", "Derrote 4 brutamontes."],
  ["Captain Jester", "कैप्टन जेस्टर", "Capitán Bufón", "Capitaine Bouffon", "Capitão Bufão"],
  ["Defeat Captain Jester.", "कैप्टन जेस्टर को हराएँ।", "Derrota al Capitán Bufón.", "Battez le Capitaine Bouffon.", "Derrote o Capitão Bufão."],
  ["Desert Bandits", "रेगिस्तानी डाकू", "Bandidos del desierto", "Bandits du désert", "Bandidos do deserto"],
  ["Defeat 5 desert bandits.", "5 रेगिस्तानी डाकुओं को हराएँ।", "Derrota a 5 bandidos del desierto.", "Battez 5 bandits du désert.", "Derrote 5 bandidos do deserto."],
  ["Desert Officers", "रेगिस्तानी अफ़सर", "Oficiales del desierto", "Officiers du désert", "Oficiais do deserto"],
  ["Defeat 5 desert officers.", "5 रेगिस्तानी अफ़सरों को हराएँ।", "Derrota a 5 oficiales del desierto.", "Battez 5 officiers du désert.", "Derrote 5 oficiais do deserto."],
  ["Frozen Bandits", "बर्फ़ीले डाकू", "Bandidos helados", "Bandits gelés", "Bandidos congelados"],
  ["Defeat 5 frozen bandits at Snowy Village.", "बर्फ़ीले गाँव में 5 बर्फ़ीले डाकुओं को हराएँ।", "Derrota a 5 bandidos helados en Aldea Nevada.", "Battez 5 bandits gelés au Village enneigé.", "Derrote 5 bandidos congelados na Vila Nevada."],
  ["Snowman Swarm", "हिममानवों का झुंड", "Enjambre de muñecos de nieve", "Nuée de bonshommes de neige", "Enxame de bonecos de neve"],
  ["Defeat 5 snowmen at Snowy Village.", "बर्फ़ीले गाँव में 5 हिममानवों को हराएँ।", "Derrota a 5 muñecos de nieve en Aldea Nevada.", "Battez 5 bonshommes de neige au Village enneigé.", "Derrote 5 bonecos de neve na Vila Nevada."],
  ["The Yeti Boss", "बॉस यती", "El jefe Yeti", "Le boss Yéti", "O chefe Yeti"],
  ["Defeat the Yeti boss at Snowy Village.", "बर्फ़ीले गाँव में बॉस यती को हराएँ।", "Derrota al jefe Yeti en Aldea Nevada.", "Battez le boss Yéti au Village enneigé.", "Derrote o chefe Yeti na Vila Nevada."],
  ["Defeat bandits", "डाकुओं को हराएँ", "Derrota bandidos", "Battez des bandits", "Derrote bandidos"],
  ["Reward", "इनाम", "Recompensa", "Récompense", "Recompensa"],
  ["Progress", "प्रगति", "Progreso", "Progression", "Progresso"],
  ["Aura kills", "ऑरा किल", "Bajas con aura", "Éliminations avec aura", "Abates com aura"],
  ["Special ability unlocked.", "स्पेशल एबिलिटी अनलॉक।", "Habilidad especial desbloqueada.", "Capacité spéciale débloquée.", "Habilidade especial desbloqueada."],
  ["locked until level 60 Desert training", "लेवल 60 की रेगिस्तानी ट्रेनिंग तक बंद", "bloqueada hasta el entrenamiento del desierto (nivel 60)", "verrouillée jusqu'à l'entraînement du désert (niveau 60)", "bloqueada até o treino do deserto (nível 60)"],

  // Interaction prompts (after "Press E:")
  ["Take quest - defeat 5 bandits", "क्वेस्ट लें - 5 डाकुओं को हराएँ", "Aceptar misión: derrota a 5 bandidos", "Prendre la quête : battre 5 bandits", "Aceitar missão: derrotar 5 bandidos"],
  ["Choose your boat", "अपनी नाव चुनें", "Elige tu barco", "Choisir votre bateau", "Escolher seu barco"],
  ["Buy a sword", "तलवार खरीदें", "Comprar una espada", "Acheter une épée", "Comprar uma espada"],
  ["View Pirate Town quests", "पाइरेट टाउन की क्वेस्ट देखें", "Ver misiones de Pueblo Pirata", "Voir les quêtes de Ville Pirate", "Ver missões da Cidade Pirata"],
  ["View Jungle quests", "जंगल की क्वेस्ट देखें", "Ver misiones de la Selva", "Voir les quêtes de la Jungle", "Ver missões da Selva"],
  ["Learn Jungle Pulse", "जंगल पल्स सीखें", "Aprender Pulso de la Selva", "Apprendre Pulsation de la jungle", "Aprender Pulso da Selva"],
  ["View Desert quests", "रेगिस्तान की क्वेस्ट देखें", "Ver misiones del Desierto", "Voir les quêtes du Désert", "Ver missões do Deserto"],
  ["View Snowy Village quests", "बर्फ़ीले गाँव की क्वेस्ट देखें", "Ver misiones de Aldea Nevada", "Voir les quêtes du Village enneigé", "Ver missões da Vila Nevada"],
  ["Train Foresight", "दूरदृष्टि की ट्रेनिंग", "Entrenar Previsión", "S'entraîner à la Prescience", "Treinar Previsão"],
  ["Train Flash Step", "फ़्लैश स्टेप की ट्रेनिंग", "Entrenar Paso Relámpago", "S'entraîner au Pas éclair", "Treinar Passo Relâmpago"],
  ["Talk to Old Cinder (Blaze Kick Master)", "ओल्ड सिंडर से बात करें (ब्लेज़ किक मास्टर)", "Hablar con el Viejo Ceniza (maestro de Patada Ardiente)", "Parler au Vieux Cendre (maître du Coup de pied ardent)", "Falar com o Velho Cinza (mestre do Chute Flamejante)"],
  ["Return to Starter Island", "स्टार्टर द्वीप लौटें", "Volver a la Isla Inicial", "Retourner sur l'Île de départ", "Voltar para a Ilha Inicial"],
  ["Learn Iron Aura", "आयरन ऑरा सीखें", "Aprender Aura de Hierro", "Apprendre Aura de fer", "Aprender Aura de Ferro"],
  ["Open Teleporter Menu", "टेलीपोर्टर मेन्यू खोलें", "Abrir menú del teletransportador", "Ouvrir le menu du téléporteur", "Abrir menu do teleporte"],
  ["Teleport to", "टेलीपोर्ट करें:", "Teletransportarse a", "Se téléporter vers", "Teleportar para"],
  ["Press E", "E दबाएँ", "Pulsa E", "Appuyez sur E", "Aperte E"],

  // Combat panel, weapons and skills
  ["Melee", "मुक्के", "Puños", "Poings", "Punhos"],
  ["Sword", "तलवार", "Espada", "Épée", "Espada"],
  ["Gun", "बंदूक", "Pistola", "Pistolet", "Pistola"],
  ["Defense", "डिफ़ेंस", "Defensa", "Défense", "Defesa"],
  ["Special Abilities", "स्पेशल एबिलिटी", "Habilidades especiales", "Capacités spéciales", "Habilidades especiais"],
  ["Special ability", "स्पेशल एबिलिटी", "Habilidad especial", "Capacité spéciale", "Habilidade especial"],
  ["Swords", "तलवारें", "Espadas", "Épées", "Espadas"],
  ["Guns", "बंदूकें", "Pistolas", "Pistolets", "Pistolas"],
  ["Special", "स्पेशल", "Especial", "Spécial", "Especial"],
  ["Items", "सामान", "Objetos", "Objets", "Itens"],
  ["⭐ Mastery", "⭐ महारत", "⭐ Maestría", "⭐ Maîtrise", "⭐ Maestria"],
  ["Boss", "बॉस", "Jefe", "Boss", "Chefe"],
  ["COMBAT", "युद्ध", "COMBATE", "COMBAT", "COMBATE"],
  ["UNLOCKED", "अनलॉक", "DESBLOQUEADO", "DÉBLOQUÉ", "DESBLOQUEADO"],
  ["MELEE", "मुक्के", "PUÑOS", "POINGS", "PUNHOS"],
  ["SWORD", "तलवार", "ESPADA", "ÉPÉE", "ESPADA"],
  ["GUN", "बंदूक", "PISTOLA", "PISTOLET", "PISTOLA"],
  ["SPECIAL", "स्पेशल", "ESPECIAL", "SPÉCIAL", "ESPECIAL"],
  ["Need", "चाहिए", "Faltan", "Encore", "Faltam"],
  ["Meteor Fist", "उल्का मुक्का", "Puño Meteoro", "Poing Météore", "Punho Meteoro"],
  ["Ground Slam", "ज़मीनी प्रहार", "Golpe Sísmico", "Frappe au sol", "Impacto no Chão"],
  ["Ember Shot", "अंगारा शॉट", "Tiro de Brasa", "Tir de Braise", "Tiro de Brasa"],
  ["Inferno Kick", "इन्फ़र्नो किक", "Patada Infernal", "Coup de pied infernal", "Chute Infernal"],
  ["Perfect Parry", "परफ़ेक्ट बचाव", "Bloqueo perfecto", "Parade parfaite", "Defesa perfeita"],
  ["Iron Bastion", "लौह गढ़", "Bastión de Hierro", "Bastion de fer", "Bastião de Ferro"],
  ["Piercing Thrust", "भेदी वार", "Estocada Perforante", "Estocade perçante", "Estocada Perfurante"],
  ["Cyclone Spin", "चक्रवात घुमाव", "Giro Ciclón", "Tourbillon", "Giro Ciclone"],
  ["Double Tap", "डबल टैप", "Doble Disparo", "Double tir", "Tiro Duplo"],
  ["Buckshot Cone", "छर्रों की बौछार", "Cono de Perdigones", "Cône de chevrotine", "Cone de Chumbo"],
  ["Spirit Bolt", "आत्मा बाण", "Rayo Espiritual", "Trait spirituel", "Raio Espiritual"],
  ["Pulse Bubble", "पल्स बबल", "Burbuja de Pulso", "Bulle d'impulsion", "Bolha de Pulso"],
  ["God's Judgment", "ईश्वर का न्याय", "Juicio Divino", "Jugement divin", "Julgamento Divino"],
  ["Dash", "डैश", "Esquiva", "Ruée", "Avanço"],
  ["Block", "बचाव", "Bloquear", "Bloquer", "Bloquear"],

  // Captions in the controls panel
  ["Move", "चलें", "Mover", "Bouger", "Mover"],
  ["Right drag", "राइट ड्रैग", "Arrastrar (derecho)", "Glisser (droit)", "Arrastar (direito)"],
  ["Camera", "कैमरा", "Cámara", "Caméra", "Câmera"],
  ["Click", "क्लिक", "Clic", "Clic", "Clique"],
  ["Space", "स्पेस", "Espacio", "Espace", "Espaço"],
  ["Sprint", "दौड़ें", "Correr", "Sprinter", "Correr"],
  ["Weapons", "हथियार", "Armas", "Armes", "Armas"],
  ["Skills", "स्किल", "Habilidades", "Compétences", "Habilidades"],
  ["Armament", "आर्मामेंट", "Armamento", "Armement", "Armamento"],
  ["Observation", "अवलोकन", "Observación", "Observation", "Observação"],
  ["Flash step", "फ़्लैश स्टेप", "Paso relámpago", "Pas éclair", "Passo relâmpago"],
  ["Helm boat", "नाव चलाएँ", "Timonear barco", "Barrer le bateau", "Pilotar barco"],
  ["Keyboard controls", "कीबोर्ड कंट्रोल", "Controles del teclado", "Commandes clavier", "Controles do teclado"],

  // Boats, defeat
  ["Boat Dock", "नाव घाट", "Muelle", "Quai", "Cais"],
  ["Choose a vessel to summon:", "बुलाने के लिए नाव चुनें:", "Elige un barco para invocar:", "Choisissez un navire à appeler :", "Escolha um barco para chamar:"],
  ["Dinghy", "छोटी नाव", "Bote", "Canot", "Bote"],
  ["Sailor Boat", "नाविक नाव", "Barco de marinero", "Bateau de marin", "Barco de marinheiro"],
  ["Brigade", "ब्रिगेड जहाज़", "Bergantín", "Brigantin", "Bergantim"],
  ["Cancel", "रद्द करें", "Cancelar", "Annuler", "Cancelar"],
  ["DEFEATED", "हार गए", "DERROTADO", "VAINCU", "DERROTADO"],
  ["You were knocked out in battle", "आप लड़ाई में बेहोश हो गए", "Te dejaron fuera de combate", "Vous avez été mis K.O. au combat", "Você foi nocauteado em batalha"],
  ["Respawn", "फिर से शुरू करें", "Reaparecer", "Réapparaître", "Renascer"],

  // Settings menu
  ["Settings & Performance", "सेटिंग्स और परफ़ॉर्मेंस", "Ajustes y rendimiento", "Paramètres et performances", "Configurações e desempenho"],
  ["Performance Stats Bar", "परफ़ॉर्मेंस बार", "Barra de rendimiento", "Barre de performances", "Barra de desempenho"],
  ["Show Performance Stats (Mem, CPU, GPU, Sent, Recv)", "परफ़ॉर्मेंस आँकड़े दिखाएँ (Mem, CPU, GPU, Sent, Recv)", "Mostrar estadísticas (Mem, CPU, GPU, Sent, Recv)", "Afficher les statistiques (Mem, CPU, GPU, Sent, Recv)", "Mostrar estatísticas (Mem, CPU, GPU, Sent, Recv)"],
  ["Show Ping metric", "पिंग दिखाएँ", "Mostrar ping", "Afficher le ping", "Mostrar ping"],
  ["Graphics Quality", "ग्राफ़िक्स क्वालिटी", "Calidad gráfica", "Qualité graphique", "Qualidade gráfica"],
  ["Graphics Level", "ग्राफ़िक्स लेवल", "Nivel gráfico", "Niveau graphique", "Nível gráfico"],
  ["Low levels disable shadows and lower resolution to boost performance.", "कम लेवल पर परछाइयाँ बंद होती हैं और रिज़ॉल्यूशन घटता है, जिससे गेम तेज़ चलता है।", "Los niveles bajos desactivan las sombras y bajan la resolución para mejorar el rendimiento.", "Les niveaux bas désactivent les ombres et réduisent la résolution pour de meilleures performances.", "Níveis baixos desativam sombras e reduzem a resolução para melhorar o desempenho."],
  ["Volume", "आवाज़", "Volumen", "Volume", "Volume"],
  ["Keyboard Bindings", "कीबोर्ड बटन", "Teclas", "Raccourcis clavier", "Atalhos do teclado"],
  ["Keys", "बटन", "Teclas", "Touches", "Teclas"],
  ["Action / Function", "काम", "Acción", "Action", "Ação"],
  ["Move character / Steer boat", "किरदार चलाएँ / नाव चलाएँ", "Mover personaje / Timonear barco", "Déplacer le personnage / Diriger le bateau", "Mover personagem / Pilotar barco"],
  ["Sprint toggle", "दौड़ चालू/बंद", "Activar carrera", "Activer le sprint", "Alternar corrida"],
  ["Right Click", "राइट क्लिक", "Clic derecho", "Clic droit", "Clique direito"],
  ["Drag to rotate screen (move camera)", "स्क्रीन घुमाने के लिए खींचें (कैमरा)", "Arrastra para girar la cámara", "Glissez pour tourner la caméra", "Arraste para girar a câmera"],
  ["Left Click / R", "लेफ़्ट क्लिक / R", "Clic izquierdo / R", "Clic gauche / R", "Clique esquerdo / R"],
  ["Strike / Shoot (aim gun at head for 1.5x headshot)", "मारें / गोली चलाएँ (1.5x हेडशॉट के लिए सिर पर निशाना लगाएँ)", "Golpear / Disparar (apunta a la cabeza para un tiro x1,5)", "Frapper / Tirer (visez la tête pour un tir x1,5)", "Golpear / Atirar (mire na cabeça para tiro x1,5)"],
  ["Block (Hold to guard, tap right before hit to Perfect Parry)", "बचाव (रोकने के लिए दबाए रखें, परफ़ेक्ट बचाव के लिए वार से ठीक पहले दबाएँ)", "Bloquear (mantén para cubrirte; pulsa justo antes del golpe para un bloqueo perfecto)", "Bloquer (maintenez pour vous protéger ; appuyez juste avant le coup pour une parade parfaite)", "Bloquear (segure para se defender; aperte logo antes do golpe para uma defesa perfeita)"],
  ["Dash in facing direction", "सामने की ओर डैश", "Esquivar hacia delante", "Ruée vers l'avant", "Avançar na direção em que olha"],
  ["Equip: Melee (1), Sword (2), Gun (3), Special (4)", "चुनें: मुक्के (1), तलवार (2), बंदूक (3), स्पेशल (4)", "Equipar: Puños (1), Espada (2), Pistola (3), Especial (4)", "Équiper : Poings (1), Épée (2), Pistolet (3), Spécial (4)", "Equipar: Punhos (1), Espada (2), Pistola (3), Especial (4)"],
  ["Active skills (requires Mastery Level 5 / 20)", "एक्टिव स्किल (महारत लेवल 5 / 20 ज़रूरी)", "Habilidades activas (requiere maestría 5 / 20)", "Compétences actives (maîtrise 5 / 20 requise)", "Habilidades ativas (exige maestria 5 / 20)"],
  ["Steer Boat (E) / Disembark Boat (G)", "नाव चलाएँ (E) / नाव से उतरें (G)", "Timonear (E) / Desembarcar (G)", "Diriger (E) / Débarquer (G)", "Pilotar (E) / Desembarcar (G)"],
  ["Toggle Aura (Armor / Damage boost, level 60 Desert)", "ऑरा चालू/बंद (कवच / ज़्यादा नुकसान, लेवल 60 रेगिस्तान)", "Activar aura (armadura / daño, nivel 60 Desierto)", "Activer l'aura (armure / dégâts, niveau 60 Désert)", "Alternar aura (armadura / dano, nível 60 Deserto)"],
  ["Toggle settings and menu", "सेटिंग्स और मेन्यू खोलें/बंद करें", "Abrir o cerrar el menú", "Ouvrir ou fermer le menu", "Abrir ou fechar o menu"],
  ["Save Protection Status", "सेव सुरक्षा", "Estado del guardado", "État de la sauvegarde", "Status do salvamento"],
  ["Auto-Save is Active:", "ऑटो-सेव चालू है:", "Guardado automático activo:", "Sauvegarde auto active :", "Salvamento automático ativo:"],
  ["Progress is auto-saved locally every 5 seconds. Save data cannot be deleted from within the game.", "प्रगति हर 5 सेकंड में इस डिवाइस पर अपने आप सेव होती है। सेव डेटा गेम के अंदर से नहीं हटाया जा सकता।", "El progreso se guarda localmente cada 5 segundos. Los datos no se pueden borrar desde el juego.", "La progression est sauvegardée localement toutes les 5 secondes. Les données ne peuvent pas être supprimées depuis le jeu.", "O progresso é salvo localmente a cada 5 segundos. Os dados não podem ser apagados dentro do jogo."],
  ["Resume", "जारी रखें", "Reanudar", "Reprendre", "Continuar"],
  ["Reset Character", "किरदार रीसेट करें", "Reiniciar personaje", "Réinitialiser le personnage", "Reiniciar personagem"],

  // Avatar Studio and marketplace
  ["AVATAR STUDIO & DESIGNER", "अवतार स्टूडियो और डिज़ाइनर", "ESTUDIO Y DISEÑADOR DE AVATARES", "STUDIO ET CRÉATEUR D'AVATARS", "ESTÚDIO E CRIADOR DE AVATARES"],
  ["Design your unique character and trade with other players in the marketplace", "अपना अनोखा किरदार बनाएँ और मार्केटप्लेस में दूसरे खिलाड़ियों से व्यापार करें", "Diseña tu personaje único y comercia con otros jugadores en el mercado", "Créez votre personnage unique et échangez avec d'autres joueurs sur le marché", "Crie seu personagem único e negocie com outros jogadores no mercado"],
  ["Avatar Designer", "अवतार डिज़ाइनर", "Diseñador de avatares", "Créateur d'avatar", "Criador de avatar"],
  ["Marketplace", "मार्केटप्लेस", "Mercado", "Marché", "Mercado"],
  ["🖱️ Drag to rotate model", "🖱️ घुमाने के लिए खींचें", "🖱️ Arrastra para girar el modelo", "🖱️ Glissez pour faire pivoter", "🖱️ Arraste para girar o modelo"],
  ["Saved Templates", "सेव किए गए डिज़ाइन", "Plantillas guardadas", "Modèles enregistrés", "Modelos salvos"],
  ["Avatar Name", "अवतार का नाम", "Nombre del avatar", "Nom de l'avatar", "Nome do avatar"],
  ["Avatar name", "अवतार का नाम", "Nombre del avatar", "Nom de l'avatar", "Nome do avatar"],
  ["Enter name...", "नाम लिखें...", "Escribe un nombre...", "Saisissez un nom...", "Digite um nome..."],
  ["Body & Apparel Styling", "शरीर और कपड़े", "Cuerpo y ropa", "Corps et tenue", "Corpo e roupas"],
  ["Skin Color", "त्वचा का रंग", "Color de piel", "Couleur de peau", "Cor da pele"],
  ["Torso (Shirt)", "धड़ (शर्ट)", "Torso (camisa)", "Torse (chemise)", "Tronco (camisa)"],
  ["Left Arm Color", "बाएँ हाथ का रंग", "Color del brazo izquierdo", "Couleur du bras gauche", "Cor do braço esquerdo"],
  ["Right Arm Color", "दाएँ हाथ का रंग", "Color del brazo derecho", "Couleur du bras droit", "Cor do braço direito"],
  ["Hair Color", "बालों का रंग", "Color de pelo", "Couleur des cheveux", "Cor do cabelo"],
  ["Eye Color", "आँखों का रंग", "Color de ojos", "Couleur des yeux", "Cor dos olhos"],
  ["Left Leg Color", "बाएँ पैर का रंग", "Color de la pierna izquierda", "Couleur de la jambe gauche", "Cor da perna esquerda"],
  ["Right Leg Color", "दाएँ पैर का रंग", "Color de la pierna derecha", "Couleur de la jambe droite", "Cor da perna direita"],
  ["Pants (Leg Base)", "पैंट", "Pantalones (base)", "Pantalon (base)", "Calça (base)"],
  ["Boots Color", "जूतों का रंग", "Color de botas", "Couleur des bottes", "Cor das botas"],
  ["Belt Color", "बेल्ट का रंग", "Color del cinturón", "Couleur de la ceinture", "Cor do cinto"],
  ["Cape Color", "केप का रंग", "Color de la capa", "Couleur de la cape", "Cor da capa"],
  ["Outfit Style", "पोशाक का स्टाइल", "Estilo de atuendo", "Style de tenue", "Estilo de roupa"],
  ["Body Type", "शरीर का प्रकार", "Tipo de cuerpo", "Type de corps", "Tipo de corpo"],
  ["Human", "इंसान", "Humano", "Humain", "Humano"],
  ["Skeleton", "कंकाल", "Esqueleto", "Squelette", "Esqueleto"],
  ["Head", "सिर", "Cabeza", "Tête", "Cabeça"],
  ["Normal", "सामान्य", "Normal", "Normale", "Normal"],
  ["Headless", "बिना सिर", "Sin cabeza", "Sans tête", "Sem cabeça"],
  ["Accessory", "एक्सेसरी", "Accesorio", "Accessoire", "Acessório"],
  ["None", "कोई नहीं", "Ninguno", "Aucun", "Nenhum"],
  ["Golden Halo", "सुनहरा प्रभामंडल", "Halo dorado", "Auréole dorée", "Auréola dourada"],
  ["Spectral Hands", "भूतिया हाथ", "Manos espectrales", "Mains spectrales", "Mãos espectrais"],
  ["Cape Style", "केप का स्टाइल", "Estilo de capa", "Style de cape", "Estilo de capa"],
  ["No Cape", "कोई केप नहीं", "Sin capa", "Sans cape", "Sem capa"],
  ["Royal Cape", "शाही केप", "Capa real", "Cape royale", "Capa real"],
  ["Long Flowing Cape", "लंबी लहराती केप", "Capa larga", "Longue cape", "Capa longa"],
  ["Tattered Cape", "फटी केप", "Capa raída", "Cape en lambeaux", "Capa esfarrapada"],
  ["Width", "चौड़ाई", "Anchura", "Largeur", "Largura"],
  ["Arm Length", "हाथ की लंबाई", "Largo de brazos", "Longueur des bras", "Comprimento dos braços"],
  ["Leg Length", "पैर की लंबाई", "Largo de piernas", "Longueur des jambes", "Comprimento das pernas"],
  ["Torso Length", "धड़ की लंबाई", "Largo del torso", "Longueur du torse", "Comprimento do tronco"],
  ["Head Size", "सिर का आकार", "Tamaño de cabeza", "Taille de la tête", "Tamanho da cabeça"],
  ["Avatar Code", "अवतार कोड", "Código de avatar", "Code d'avatar", "Código do avatar"],
  ["Share or import a design", "डिज़ाइन शेयर या इम्पोर्ट करें", "Comparte o importa un diseño", "Partagez ou importez un design", "Compartilhe ou importe um design"],
  ["Copy Code", "कोड कॉपी करें", "Copiar código", "Copier le code", "Copiar código"],
  ["Import", "इम्पोर्ट", "Importar", "Importer", "Importar"],
  ["Paste an avatar code here, then press Import", "यहाँ अवतार कोड पेस्ट करें, फिर इम्पोर्ट दबाएँ", "Pega aquí un código de avatar y pulsa Importar", "Collez un code d'avatar ici, puis appuyez sur Importer", "Cole um código de avatar aqui e aperte Importar"],
  ["Sell This Avatar Design", "यह अवतार डिज़ाइन बेचें", "Vender este diseño", "Vendre ce design", "Vender este design"],
  ["Publish this design blueprint to the Marketplace. NPC players will buy it if the price is right!", "यह डिज़ाइन मार्केटप्लेस पर डालें। सही दाम होगा तो NPC खिलाड़ी इसे खरीदेंगे!", "Publica este diseño en el Mercado. ¡Los PNJ lo comprarán si el precio es justo!", "Publiez ce design sur le Marché. Les PNJ l'achèteront si le prix est bon !", "Publique este design no Mercado. Os NPCs vão comprar se o preço for bom!"],
  ["Publish Design", "डिज़ाइन प्रकाशित करें", "Publicar diseño", "Publier le design", "Publicar design"],
  ["Global Design Market", "ग्लोबल डिज़ाइन मार्केट", "Mercado global de diseños", "Marché mondial des designs", "Mercado global de designs"],
  ["Buy designs from other creators, or view your active listings", "दूसरे क्रिएटर के डिज़ाइन खरीदें या अपनी लिस्टिंग देखें", "Compra diseños de otros creadores o mira tus anuncios", "Achetez des designs d'autres créateurs ou consultez vos annonces", "Compre designs de outros criadores ou veja seus anúncios"],
  ["Your Active Listings", "आपकी लिस्टिंग", "Tus anuncios activos", "Vos annonces actives", "Seus anúncios ativos"],
  ["You have no designs published for sale. Customize an avatar and set a price to publish!", "आपने बिक्री के लिए कोई डिज़ाइन नहीं डाला है। अवतार बनाएँ और दाम तय करके प्रकाशित करें!", "No tienes diseños a la venta. ¡Personaliza un avatar y ponle precio para publicarlo!", "Vous n'avez aucun design en vente. Personnalisez un avatar et fixez un prix pour le publier !", "Você não tem designs à venda. Personalize um avatar e defina um preço para publicar!"],
  ["Browse Designs for Sale", "बिकाऊ डिज़ाइन देखें", "Ver diseños a la venta", "Parcourir les designs en vente", "Ver designs à venda"],

  // Tutorial
  ["Skip tutorial", "ट्यूटोरियल छोड़ें", "Saltar tutorial", "Passer le tutoriel", "Pular tutorial"],
  ["Getting started", "शुरुआत", "Primeros pasos", "Premiers pas", "Primeiros passos"],
  ["Walk around with <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>.", "<kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> से चलें।", "Camina con <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>.", "Déplacez-vous avec <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>.", "Ande com <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>."],
  ["Use the arrow pad to walk around.", "चलने के लिए तीर वाले पैड का इस्तेमाल करें।", "Usa la cruceta para caminar.", "Utilisez les flèches pour vous déplacer.", "Use o direcional para andar."],
  ["Hold <kbd>Right Click</kbd> and drag to look around.", "चारों ओर देखने के लिए <kbd>Right Click</kbd> दबाकर खींचें।", "Mantén <kbd>Right Click</kbd> y arrastra para mirar alrededor.", "Maintenez <kbd>Right Click</kbd> et glissez pour regarder autour.", "Segure <kbd>Right Click</kbd> e arraste para olhar ao redor."],
  ["Drag on the screen to look around.", "चारों ओर देखने के लिए स्क्रीन पर उँगली खींचें।", "Arrastra en la pantalla para mirar alrededor.", "Faites glisser l'écran pour regarder autour.", "Arraste na tela para olhar ao redor."],
  ["Press <kbd>Space</kbd> to jump. Hold <kbd>Shift</kbd> to sprint.", "कूदने के लिए <kbd>Space</kbd> दबाएँ। दौड़ने के लिए <kbd>Shift</kbd> दबाए रखें।", "Pulsa <kbd>Space</kbd> para saltar. Mantén <kbd>Shift</kbd> para correr.", "Appuyez sur <kbd>Space</kbd> pour sauter. Maintenez <kbd>Shift</kbd> pour sprinter.", "Aperte <kbd>Space</kbd> para pular. Segure <kbd>Shift</kbd> para correr."],
  ["Tap <kbd>Jump</kbd> to jump.", "कूदने के लिए <kbd>कूदें</kbd> दबाएँ।", "Toca <kbd>Saltar</kbd> para saltar.", "Touchez <kbd>Sauter</kbd> pour sauter.", "Toque em <kbd>Pular</kbd> para pular."],
  ["<kbd>Left Click</kbd> to attack. Keep clicking to chain a combo.", "हमला करने के लिए <kbd>Left Click</kbd> करें। कॉम्बो बनाने के लिए क्लिक करते रहें।", "<kbd>Left Click</kbd> para atacar. Sigue haciendo clic para encadenar un combo.", "<kbd>Left Click</kbd> pour attaquer. Continuez à cliquer pour enchaîner un combo.", "<kbd>Left Click</kbd> para atacar. Continue clicando para fazer um combo."],
  ["Tap <kbd>Attack</kbd> to throw a punch. Keep tapping to chain a combo.", "मुक्का मारने के लिए <kbd>हमला</kbd> दबाएँ। कॉम्बो के लिए दबाते रहें।", "Toca <kbd>Atacar</kbd> para dar un puñetazo. Sigue tocando para encadenar un combo.", "Touchez <kbd>Attaquer</kbd> pour frapper. Continuez pour enchaîner un combo.", "Toque em <kbd>Atacar</kbd> para socar. Continue tocando para fazer um combo."],
  ["Follow the compass at the top to the quest giver and press <kbd>E</kbd>.", "ऊपर दिए कम्पास के सहारे क्वेस्ट देने वाले तक जाएँ और <kbd>E</kbd> दबाएँ।", "Sigue la brújula de arriba hasta el dador de misiones y pulsa <kbd>E</kbd>.", "Suivez la boussole en haut jusqu'au donneur de quêtes et appuyez sur <kbd>E</kbd>.", "Siga a bússola no topo até quem dá as missões e aperte <kbd>E</kbd>."],
  ["Follow the compass at the top to the quest giver and tap <kbd>Interact</kbd>.", "ऊपर दिए कम्पास के सहारे क्वेस्ट देने वाले तक जाएँ और <kbd>बातचीत</kbd> दबाएँ।", "Sigue la brújula de arriba hasta el dador de misiones y toca <kbd>Interactuar</kbd>.", "Suivez la boussole en haut jusqu'au donneur de quêtes et touchez <kbd>Interagir</kbd>.", "Siga a bússola no topo até quem dá as missões e toque em <kbd>Interagir</kbd>."],
  ["Defeat 5 bandits to finish your first quest. Watch for the red flash before an enemy strikes, and step away or block with <kbd>F</kbd>.", "अपनी पहली क्वेस्ट पूरी करने के लिए 5 डाकुओं को हराएँ। दुश्मन के वार से पहले लाल चमक पर नज़र रखें, और पीछे हटें या <kbd>F</kbd> से बचाव करें।", "Derrota a 5 bandidos para completar tu primera misión. Atento al destello rojo antes de cada golpe enemigo: apártate o bloquea con <kbd>F</kbd>.", "Battez 5 bandits pour terminer votre première quête. Guettez l'éclair rouge avant chaque coup ennemi, puis reculez ou bloquez avec <kbd>F</kbd>.", "Derrote 5 bandidos para concluir sua primeira missão. Fique de olho no brilho vermelho antes do golpe inimigo e se afaste ou bloqueie com <kbd>F</kbd>."],
  ["Defeat 5 bandits to finish your first quest. Watch for the red flash before an enemy strikes and step away.", "अपनी पहली क्वेस्ट पूरी करने के लिए 5 डाकुओं को हराएँ। दुश्मन के वार से पहले लाल चमक पर नज़र रखें और पीछे हट जाएँ।", "Derrota a 5 bandidos para completar tu primera misión. Atento al destello rojo antes de cada golpe enemigo y apártate.", "Battez 5 bandits pour terminer votre première quête. Guettez l'éclair rouge avant chaque coup ennemi et reculez.", "Derrote 5 bandidos para concluir sua primeira missão. Fique de olho no brilho vermelho antes do golpe inimigo e se afaste."],

  // Words used inside longer lines, traits and floating combat text
  ["Level", "लेवल", "Nivel", "Niveau", "Nível"],
  ["Lv.", "लेवल", "Nv.", "Niv.", "Nv."],
  ["Lv", "लेवल", "Nv", "Niv", "Nv"],
  ["points", "पॉइंट", "puntos", "points", "pontos"],
  ["Mastery", "महारत", "Maestría", "Maîtrise", "Maestria"],
  ["Aura", "ऑरा", "Aura", "Aura", "Aura"],
  ["Cash", "पैसे", "Dinero", "Argent", "Dinheiro"],
  ["Captain", "कप्तान", "Capitán", "Capitaine", "Capitão"],
  ["Rookie", "नौसिखिया", "Novato", "Recrue", "Novato"],
  ["Pirate", "समुद्री डाकू", "Pirata", "Pirate", "Pirata"],
  ["Marine", "मरीन", "Marine", "Marine", "Fuzileiro"],
  ["longer range", "ज़्यादा दूरी", "más alcance", "portée accrue", "mais alcance"],
  ["less health", "कम हेल्थ", "menos salud", "moins de santé", "menos vida"],
  ["more health", "ज़्यादा हेल्थ", "más salud", "plus de santé", "mais vida"],
  ["faster movement", "तेज़ चाल", "más rapidez", "déplacement rapide", "mais rapidez"],
  ["slower movement", "धीमी चाल", "menos rapidez", "déplacement lent", "menos rapidez"],
  ["stronger hits", "ज़ोरदार वार", "golpes más fuertes", "coups plus forts", "golpes mais fortes"],
  ["takes less damage", "कम नुकसान", "recibe menos daño", "subit moins de dégâts", "sofre menos dano"],
  ["balanced bulk", "संतुलित शरीर", "complexión equilibrada", "carrure équilibrée", "porte equilibrado"],
  ["Teleporting in", "टेलीपोर्ट होने में", "Teletransporte en", "Téléportation dans", "Teleporte em"],
  ["Miss", "चूक", "Fallo", "Raté", "Errou"],
  ["PERFECT PARRY!", "परफ़ेक्ट बचाव!", "¡BLOQUEO PERFECTO!", "PARADE PARFAITE !", "DEFESA PERFEITA!"],
  ["HEADSHOT!", "हेडशॉट!", "¡TIRO EN LA CABEZA!", "TIR À LA TÊTE !", "TIRO NA CABEÇA!"],
  ["VAPORIZED!", "भस्म!", "¡VAPORIZADO!", "VAPORISÉ !", "VAPORIZADO!"],
  ["ICE SHELL SHATTERED!", "बर्फ़ का कवच टूटा!", "¡CAPARAZÓN DE HIELO ROTO!", "CARAPACE DE GLACE BRISÉE !", "CASCA DE GELO QUEBRADA!"],
];

// Island names that appear inside prompts like "Teleport to Jungle Island".
const I18N_PLACES = [
  ["Starter Island", "स्टार्टर द्वीप", "Isla Inicial", "Île de départ", "Ilha Inicial"],
  ["Jungle Island", "जंगल द्वीप", "Isla de la Selva", "Île de la Jungle", "Ilha da Selva"],
  ["Pirate Town", "पाइरेट टाउन", "Pueblo Pirata", "Ville Pirate", "Cidade Pirata"],
  ["Desert Island", "रेगिस्तानी द्वीप", "Isla del Desierto", "Île du Désert", "Ilha do Deserto"],
  ["Snowy Village", "बर्फ़ीला गाँव", "Aldea Nevada", "Village enneigé", "Vila Nevada"],
];

// `var` so tr() is safe to call even before this file has run (it returns English then).
var i18nMaps = {};
I18N_LANGS.slice(1).forEach((lang, i) => {
  const map = new Map();
  [...I18N_ROWS, ...I18N_PLACES].forEach((row) => { if (row[i + 1]) map.set(row[0], row[i + 1]); });
  i18nMaps[lang] = map;
});

var currentLanguage = "en";
try {
  const saved = localStorage.getItem(I18N_STORAGE_KEY);
  if (I18N_LANGS.includes(saved)) currentLanguage = saved;
} catch (err) { /* storage unavailable */ }

function i18nWord(english) {
  if (currentLanguage === "en" || !i18nMaps || !i18nMaps[currentLanguage]) return english;
  return i18nMaps[currentLanguage].get(english) ?? english;
}

// Lines the game builds from parts ("Level 3 | Sword | stronger hits"): each
// pattern rebuilds the line from translated parts.
const I18N_PATTERNS = [
  [/^Press E: Teleport to (.+)$/, (m) => `${i18nWord("Press E")}: ${i18nWord("Teleport to")} ${i18nWord(m[1])}`],
  [/^Press E: (.+)$/, (m) => `${i18nWord("Press E")}: ${i18nWord(m[1])}`],
  [/^Level (\d+) \| (.+?) \| (.+)$/, (m) => `${i18nWord("Level")} ${m[1]} | ${i18nWord(m[2])} | ${m[3].split(", ").map(i18nWord).join(", ")}`],
  [/^(.+) \| (\S+) (Captain|Rookie)$/, (m) => `${m[1]} | ${i18nWord(m[2])} ${i18nWord(m[3])}`],
  [/^Lv\. (\d+)$/, (m) => `${i18nWord("Lv.")} ${m[1]}`],
  [/^(\d+) points$/, (m) => `${m[1]} ${i18nWord("points")}`],
  [/^Mastery (\d+)$/, (m) => `${i18nWord("Mastery")} ${m[1]}`],
  [/^Mastery (\d+) \(Max\. (\d+)\)$/, (m) => `${i18nWord("Mastery")} ${m[1]} (Max. ${m[2]})`],
  [/^(\d+)\/(\d+) \(Need (\d+) MP\)$/, (m) => `${m[1]}/${m[2]} (${i18nWord("Need")} ${m[3]} MP)`],
  [/^Cash: (.+)$/, (m) => `${i18nWord("Cash")}: ${m[1]}`],
  [/^(Day|Sunset|Night|Sunrise) · (.+)$/, (m) => `${i18nWord(m[1])} · ${m[2]}`],
  [/^Getting started (\d+)\/(\d+)$/, (m) => `${i18nWord("Getting started")} ${m[1]}/${m[2]}`],
  [/^Teleporting in (\d+)s\.\.\.$/, (m) => `${i18nWord("Teleporting in")} ${m[1]}s...`],
  [/^Defeat bandits: (\d+)\/(\d+)\. Reward: (\S+), (\d+) XP\.$/, (m) => `${i18nWord("Defeat bandits")}: ${m[1]}/${m[2]}. ${i18nWord("Reward")}: ${m[3]}, ${m[4]} XP.`],
  [/^(.+\.) Progress: (\d+)\/(\d+)\. Aura kills: (\d+)\/(\d+)\.$/, (m) => `${i18nWord(m[1])} ${i18nWord("Progress")}: ${m[2]}/${m[3]}. ${i18nWord("Aura kills")}: ${m[4]}/${m[5]}.`],
  [/^(.+) \| Aura (\d+)$/, (m) => `${i18nWord(m[1])} | ${i18nWord("Aura")} ${m[2]}`],
  [/^Special ability unlocked\. Aura (Lv \d+|locked until level 60 Desert training)\.$/, (m) => `${i18nWord("Special ability unlocked.")} ${i18nWord("Aura")} ${m[1].startsWith("Lv") ? m[1].replace("Lv", i18nWord("Lv")) : i18nWord(m[1])}.`],
  [/^HEADSHOT! (-\d+)$/, (m) => `${i18nWord("HEADSHOT!")} ${m[1]}`],
];

// Translate one piece of English text into the current language.
function tr(text) {
  if (!currentLanguage || currentLanguage === "en" || !text || !i18nMaps || !i18nMaps[currentLanguage]) return text;
  const key = text.trim();
  if (!key) return text;
  const direct = i18nMaps[currentLanguage].get(key);
  if (direct !== undefined) return text.replace(key, direct);
  for (let i = 0; i < I18N_PATTERNS.length; i += 1) {
    const match = key.match(I18N_PATTERNS[i][0]);
    if (match) return text.replace(key, I18N_PATTERNS[i][1](match));
  }
  return text;
}

// ---- Applying translations to the page ----

// Key caps (<kbd>) keep the key names printed on the keyboard.
const I18N_SKIP = "script, style, textarea, kbd, [data-no-i18n], .home-content, .site-footer, .content-page";
const I18N_ATTRS = ["placeholder", "aria-label", "title"];
const i18nTextSource = new WeakMap(); // text node -> { src, out }
const i18nAttrSource = new WeakMap(); // element -> { attr: { src, out } }

function i18nSkipped(element) {
  return !element || element.closest(I18N_SKIP);
}

function translateTextNode(node) {
  const record = i18nTextSource.get(node);
  // Our own output: translate again from the English it came from.
  // Anything else is new English text written by the game.
  const src = record && node.data === record.out ? record.src : node.data;
  if (!/[A-Za-z]/.test(src)) return;
  const out = tr(src);
  i18nTextSource.set(node, { src, out });
  if (node.data !== out) node.data = out;
}

function translateAttributes(element) {
  let records = i18nAttrSource.get(element);
  I18N_ATTRS.forEach((attr) => {
    const value = element.getAttribute(attr);
    if (value === null) return;
    const record = records?.[attr];
    const src = record && value === record.out ? record.src : value;
    const out = tr(src);
    if (!records) { records = {}; i18nAttrSource.set(element, records); }
    records[attr] = { src, out };
    if (value !== out) element.setAttribute(attr, out);
  });
}

function translateTree(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    if (!i18nSkipped(root.parentElement)) translateTextNode(root);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE || i18nSkipped(root)) return;
  translateAttributes(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return node.matches(I18N_SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
    else translateAttributes(node);
  }
}

const i18nObserver = new MutationObserver((records) => {
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    if (record.type === "characterData") {
      if (!i18nSkipped(record.target.parentElement)) translateTextNode(record.target);
    } else if (record.type === "attributes") {
      if (!i18nSkipped(record.target)) translateAttributes(record.target);
    } else {
      record.addedNodes.forEach(translateTree);
    }
  }
});

function setLanguage(lang) {
  if (!I18N_LANGS.includes(lang)) lang = "en";
  currentLanguage = lang;
  try { localStorage.setItem(I18N_STORAGE_KEY, lang); } catch (err) { /* storage unavailable */ }
  document.documentElement.lang = lang;
  document.querySelectorAll(".language-select, #loading-language").forEach((select) => { select.value = lang; });
  translateTree(document.body);
  refreshTutorialText?.();
}

document.querySelectorAll(".language-select, #loading-language").forEach((select) => {
  select.value = currentLanguage;
  select.addEventListener("change", () => setLanguage(select.value));
});
document.documentElement.lang = currentLanguage;
translateTree(document.body);
i18nObserver.observe(document.body, {
  subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: I18N_ATTRS,
});

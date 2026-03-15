// --- Translations for UI strings in 4 languages ---

const translations = {
  en: {
    code: 'en',
    speechLang: 'en-US',
    flag: '🇬🇧',
    name: 'English',
    
    // Language select
    chooseLang: 'Choose Your Language',
    chooseLangSub: 'Pick the language for your adventure!',
    
    // Theme select
    chooseTheme: 'Choose Your World',
    chooseThemeSub: 'Where will your adventure take place?',
    themeRoyal: 'Royal Court',
    themeSpace: 'Space Station',
    themeWizard: 'Wizard Academy',
    themeUnderwater: 'Underwater Kingdom',
    themeForest: 'Enchanted Forest',
    
    // Age
    ageTitle: 'How old is the youngest player?',
    ageSub: 'We\'ll make sure the stories are just right!',
    ageLabel: 'years old',
    
    // Intro
    introTitle: 'Who\'s Playing Today?',
    introSub: 'Click the microphone and say your names, or type them below.',
    introPlaceholder: 'e.g. "I\'m Dad Mike and this is Princess Emma"',
    confirm: 'Let\'s Go!',
    
    // Game
    newRequest: 'New Request',
    problemLabel: 'Problem & Request',
    hintLabel: '💡 Parent Tip',
    decisionLabel: 'Your Royal Decision:',
    decisionPlaceholder: 'Say or type your decision...',
    sealDecision: 'Seal the Decision!',
    processing: 'Writing in the chronicle...',
    
    // Chronicle
    chronicleTitle: 'Chronicle Gallery',
    chronicleSub: 'Illustrated record of your wise decisions',
    chronicleEmpty: 'No cases have been resolved yet.',
    backToGame: 'Back to the Throne',
    paintingImage: 'The court painter is creating art...',
    imageFailed: 'Could not paint this scene.',
    
    // Nav
    appTitle: 'StoryRulers',
    chronicle: 'Chronicle',
    settings: 'Settings',
    
    // Settings
    settingsTitle: 'Settings',
    apiKeyLabel: 'Gemini API Key',
    apiKeyPlaceholder: 'Paste your API key here...',
    apiKeySaved: 'Key saved!',
    saveKey: 'Save Key',
    changeLang: 'Change Language',
    clearData: 'Clear All Game Data',
    clearConfirm: 'Are you sure? This will delete all your saved games.',
    back: 'Back',
    
    // Loading
    loadingMessages: [
      'A mysterious visitor approaches...',
      'Dusting off the royal scrolls...',
      'Polishing the crown...',
      'Rolling out the red carpet...',
      'The trumpets are warming up...',
      'Checking the dragon handbook...',
      'Brewing some magical tea...',
    ],

    // Narrator defaults
    welcomeNarrator: 'Welcome to the grand hall! Who comes to play today? Are you alone, or does a whole family join? Tell me your names!',
    
    // System instructions for AI
    systemNarrator: 'You are a friendly court announcer for a children\'s story game. Speak in a warm, playful tone suitable for children.',
    systemStoryteller: 'You are a master fairy-tale storyteller for children. Create fun, creative, non-violent stories.',
    systemChronicler: 'You are a court chronicler. Write witty, brief summaries of resolved cases.',
  },
  
  de: {
    code: 'de',
    speechLang: 'de-DE',
    flag: '🇩🇪',
    name: 'Deutsch',
    
    chooseLang: 'Wähle deine Sprache',
    chooseLangSub: 'Wähle die Sprache für dein Abenteuer!',
    
    chooseTheme: 'Wähle deine Welt',
    chooseThemeSub: 'Wo soll dein Abenteuer stattfinden?',
    themeRoyal: 'Königshof',
    themeSpace: 'Raumstation',
    themeWizard: 'Zauberschule',
    themeUnderwater: 'Unterwasserreich',
    themeForest: 'Zauberwald',
    
    ageTitle: 'Wie alt ist der jüngste Spieler?',
    ageSub: 'Wir passen die Geschichten perfekt an!',
    ageLabel: 'Jahre alt',
    
    introTitle: 'Wer spielt heute?',
    introSub: 'Klicke auf das Mikrofon und sage eure Namen, oder tippe sie ein.',
    introPlaceholder: 'z.B. "Ich bin Papa Max und das ist Prinzessin Mia"',
    confirm: 'Los geht\'s!',
    
    newRequest: 'Neue Bitte',
    problemLabel: 'Problem & Bitte',
    hintLabel: '💡 Eltern-Tipp',
    decisionLabel: 'Eure königliche Entscheidung:',
    decisionPlaceholder: 'Sagt oder schreibt eure Entscheidung...',
    sealDecision: 'Entscheidung besiegeln!',
    processing: 'Schreibe in die Chronik...',
    
    chronicleTitle: 'Chronik-Galerie',
    chronicleSub: 'Illustriertes Archiv eurer weisen Entscheidungen',
    chronicleEmpty: 'Noch keine Fälle gelöst.',
    backToGame: 'Zurück zum Thron',
    paintingImage: 'Der Hofmaler erschafft ein Kunstwerk...',
    imageFailed: 'Konnte diese Szene nicht malen.',
    
    appTitle: 'StoryRulers',
    chronicle: 'Chronik',
    settings: 'Einstellungen',
    
    settingsTitle: 'Einstellungen',
    apiKeyLabel: 'Gemini API-Schlüssel',
    apiKeyPlaceholder: 'API-Schlüssel hier einfügen...',
    apiKeySaved: 'Schlüssel gespeichert!',
    saveKey: 'Speichern',
    changeLang: 'Sprache ändern',
    clearData: 'Alle Spieldaten löschen',
    clearConfirm: 'Bist du sicher? Alle gespeicherten Spiele werden gelöscht.',
    back: 'Zurück',
    
    loadingMessages: [
      'Ein geheimnisvoller Besucher nähert sich...',
      'Die königlichen Pergamente werden abgestaubt...',
      'Die Krone wird poliert...',
      'Der rote Teppich wird ausgerollt...',
      'Die Trompeten werden gestimmt...',
      'Im Drachenhandbuch wird nachgeschlagen...',
      'Magischer Tee wird gebraut...',
    ],
    
    welcomeNarrator: 'Willkommen im großen Saal! Wer kommt heute zum Spielen? Seid ihr allein oder kommt eine ganze Familie? Sagt mir eure Namen!',
    systemNarrator: 'Du bist ein freundlicher Hofansager für ein Kinder-Geschichtenspiel. Sprich in einem warmen, spielerischen Ton, der für Kinder geeignet ist. Antworte auf Deutsch.',
    systemStoryteller: 'Du bist ein Meister-Märchenerzähler für Kinder. Erstelle lustige, kreative, gewaltfreie Geschichten. Antworte auf Deutsch.',
    systemChronicler: 'Du bist ein Hofchronist. Schreibe witzige, kurze Zusammenfassungen gelöster Fälle. Antworte auf Deutsch.',
  },
  
  es: {
    code: 'es',
    speechLang: 'es-ES',
    flag: '🇪🇸',
    name: 'Español',
    
    chooseLang: 'Elige tu idioma',
    chooseLangSub: '¡Elige el idioma para tu aventura!',
    
    chooseTheme: 'Elige tu mundo',
    chooseThemeSub: '¿Dónde tendrá lugar tu aventura?',
    themeRoyal: 'Corte Real',
    themeSpace: 'Estación Espacial',
    themeWizard: 'Academia Mágica',
    themeUnderwater: 'Reino Submarino',
    themeForest: 'Bosque Encantado',
    
    ageTitle: '¿Cuántos años tiene el jugador más joven?',
    ageSub: '¡Adaptaremos las historias perfectamente!',
    ageLabel: 'años',
    
    introTitle: '¿Quién juega hoy?',
    introSub: 'Haz clic en el micrófono y di vuestros nombres, o escríbelos abajo.',
    introPlaceholder: 'ej. "Soy Papá Miguel y esta es la Princesa Lucía"',
    confirm: '¡Vamos!',
    
    newRequest: 'Nueva Petición',
    problemLabel: 'Problema y Petición',
    hintLabel: '💡 Consejo para padres',
    decisionLabel: 'Vuestra decisión real:',
    decisionPlaceholder: 'Di o escribe vuestra decisión...',
    sealDecision: '¡Sellar la decisión!',
    processing: 'Escribiendo en la crónica...',
    
    chronicleTitle: 'Galería de la Crónica',
    chronicleSub: 'Registro ilustrado de vuestras sabias decisiones',
    chronicleEmpty: 'Aún no se ha resuelto ningún caso.',
    backToGame: 'Volver al trono',
    paintingImage: 'El pintor de la corte está creando arte...',
    imageFailed: 'No se pudo pintar esta escena.',
    
    appTitle: 'StoryRulers',
    chronicle: 'Crónica',
    settings: 'Ajustes',
    
    settingsTitle: 'Ajustes',
    apiKeyLabel: 'Clave API de Gemini',
    apiKeyPlaceholder: 'Pega tu clave API aquí...',
    apiKeySaved: '¡Clave guardada!',
    saveKey: 'Guardar',
    changeLang: 'Cambiar idioma',
    clearData: 'Borrar todos los datos del juego',
    clearConfirm: '¿Estás seguro? Se borrarán todas las partidas guardadas.',
    back: 'Volver',
    
    loadingMessages: [
      'Un visitante misterioso se acerca...',
      'Desempolvando los pergaminos reales...',
      'Puliendo la corona...',
      'Desenrollando la alfombra roja...',
      'Las trompetas se están afinando...',
      'Consultando el manual de dragones...',
      'Preparando té mágico...',
    ],
    
    welcomeNarrator: '¡Bienvenidos al gran salón! ¿Quién viene a jugar hoy? ¿Estáis solos o viene toda la familia? ¡Decidme vuestros nombres!',
    systemNarrator: 'Eres un simpático anunciador de la corte para un juego de cuentos infantiles. Habla en un tono cálido y juguetón adecuado para niños. Responde en español.',
    systemStoryteller: 'Eres un maestro cuentacuentos para niños. Crea historias divertidas, creativas y no violentas. Responde en español.',
    systemChronicler: 'Eres un cronista de la corte. Escribe resúmenes ingeniosos y breves de los casos resueltos. Responde en español.',
  },
  
  cs: {
    code: 'cs',
    speechLang: 'cs-CZ',
    flag: '🇨🇿',
    name: 'Čeština',
    
    chooseLang: 'Vyber si jazyk',
    chooseLangSub: 'Vyber jazyk pro své dobrodružství!',
    
    chooseTheme: 'Vyber si svět',
    chooseThemeSub: 'Kde se bude tvé dobrodružství odehrávat?',
    themeRoyal: 'Královský dvůr',
    themeSpace: 'Vesmírná stanice',
    themeWizard: 'Čarodějná akademie',
    themeUnderwater: 'Podmořské království',
    themeForest: 'Začarovaný les',
    
    ageTitle: 'Kolik let je nejmladšímu hráči?',
    ageSub: 'Přizpůsobíme příběhy tak, aby byly akorát!',
    ageLabel: 'let',
    
    introTitle: 'Kdo dnes hraje?',
    introSub: 'Klikni na mikrofon a řekni svá jména, nebo je napiš.',
    introPlaceholder: 'např. "Jsem taťka Michal a tady je princezna Emička"',
    confirm: 'Jedeme!',
    
    newRequest: 'Nová žádost',
    problemLabel: 'Problém a žádost',
    hintLabel: '💡 Rada pro rodiče',
    decisionLabel: 'Vaše královské rozhodnutí:',
    decisionPlaceholder: 'Řekněte nebo napište vaše rozhodnutí...',
    sealDecision: 'Zpečetit rozhodnutí!',
    processing: 'Píšu do kroniky...',
    
    chronicleTitle: 'Galerie kroniky',
    chronicleSub: 'Ilustrovaný záznam vašich moudrých rozhodnutí',
    chronicleEmpty: 'Zatím nebyly vyřešeny žádné případy.',
    backToGame: 'Zpět na trůn',
    paintingImage: 'Dvorní malíř tvoří obraz...',
    imageFailed: 'Obrázek se nepodařilo namalovat.',
    
    appTitle: 'StoryRulers',
    chronicle: 'Kronika',
    settings: 'Nastavení',
    
    settingsTitle: 'Nastavení',
    apiKeyLabel: 'API klíč Gemini',
    apiKeyPlaceholder: 'Vlož svůj API klíč...',
    apiKeySaved: 'Klíč uložen!',
    saveKey: 'Uložit',
    changeLang: 'Změnit jazyk',
    clearData: 'Smazat všechna herní data',
    clearConfirm: 'Jsi si jistý? Všechny uložené hry budou smazány.',
    back: 'Zpět',
    
    loadingMessages: [
      'Tajemný návštěvník se blíží...',
      'Oprašujeme královské pergameny...',
      'Leštíme korunu...',
      'Rolujeme červený koberec...',
      'Trubky se ladí...',
      'Listujeme dračí příručkou...',
      'Vaříme kouzelný čaj...',
    ],
    
    welcomeNarrator: 'Vítejte v trůnním sále! Kdo dnes přichází hrát? Jste tu sami, nebo přichází celá rodina? Řekněte mi svá jména!',
    systemNarrator: 'Jsi přátelský dvorní uvaděč pro dětskou příběhovou hru. Mluv vřelým, hravým tónem vhodným pro děti. Odpovídej česky.',
    systemStoryteller: 'Jsi mistr pohádkář pro děti. Vytváříš zábavné, kreativní a nenásilné příběhy. Odpovídej česky.',
    systemChronicler: 'Jsi dvorní kronikář. Piš vtipné, stručné shrnutí vyřešených případů. Odpovídej česky.',
  },
};

// Theme metadata (shared across languages)
export const THEMES = {
  royal: { emoji: '👑', bg: 'royal', narrator: '📯', characters: ['🏰', '⚔️', '🛡️', '🐉', '👸', '🤴'] },
  space: { emoji: '🚀', bg: 'space', narrator: '🛸', characters: ['🌟', '👽', '🤖', '🪐', '🌙', '☄️'] },
  wizard: { emoji: '🧙‍♂️', bg: 'wizard', narrator: '🔮', characters: ['✨', '🧪', '📚', '🦉', '🐱', '🎭'] },
  underwater: { emoji: '🌊', bg: 'underwater', narrator: '🐚', characters: ['🐙', '🐠', '🦈', '🐢', '🧜‍♀️', '🦑'] },
  forest: { emoji: '🌿', bg: 'forest', narrator: '🍄', characters: ['🦊', '🦌', '🐿️', '🦋', '🌺', '🍃'] },
};

export default translations;

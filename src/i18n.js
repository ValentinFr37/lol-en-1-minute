// Langues du site. Le français est servi à la racine (/), les autres sous un préfixe (/en, /es).
// Pour ajouter une langue : une entrée dans LANGS, ses textes dans STRINGS,
// son drapeau dans components/Flag.jsx et ses fiches dans content/champions/<code>/.

export const DEFAULT_LANG = 'fr'

export const LANGS = {
  fr: { code: 'fr', name: 'Français', ddragon: 'fr_FR', og: 'fr_FR', prefix: '' },
  en: { code: 'en', name: 'English', ddragon: 'en_US', og: 'en_US', prefix: '/en' },
  es: { code: 'es', name: 'Español', ddragon: 'es_ES', og: 'es_ES', prefix: '/es' },
}

export const LANG_CODES = Object.keys(LANGS)

export const isLang = (value) => Object.hasOwn(LANGS, value)

const STRINGS = {
  fr: {
    homeLabel: 'LoL en 1 minute, accueil',
    languages: 'Langue du site',
    loading: 'Chargement…',
    listError: 'Impossible de charger la liste des champions depuis les serveurs de Riot.',
    retry: 'Réessayer',
    backToSearch: 'Retour à la recherche',
    supportQuestion: 'Le site t’a aidé ?',
    supportLink: 'Offre-moi un café sur Ko-fi',
    legal:
      'LoL en 1 minute n’est pas approuvé par Riot Games et ne reflète pas les opinions de Riot Games ni de quiconque officiellement impliqué dans la production ou la gestion de League of Legends. League of Legends et Riot Games sont des marques commerciales ou des marques déposées de Riot Games, Inc.',
    patch: (version) => `Données du jeu : patch ${version}.`,

    heroTitle: 'Contre qui tu joues ?',
    heroLead:
      'Les forces, les faiblesses et comment battre chaque champion de League of Legends, le temps de l’écran de chargement.',
    backdropCredit: 'En fond :',
    searchLabel: 'Rechercher un champion',
    searchPlaceholder: 'Darius, MF, Kog…',
    enterToOpen: 'Entrée pour ouvrir',
    roleFilter: 'Filtrer par rôle',
    allRoles: 'Tous',
    noResults: (query) => `Aucun champion ne correspond à « ${query} ». Vérifie l’orthographe ou essaie un surnom.`,
    championCount: (n) => `${n} champions`,

    back: 'Changer de champion',
    spellStrip: 'Aperçu des sorts',
    noFiche: (name) =>
      `Pas encore de fiche rédigée pour ${name}. En attendant, voici ses sorts résumés à partir des données officielles de Riot.`,
    riotTips: 'Conseils de Riot pour l’affronter',
    ficheChecked: (patch) => `Fiche vérifiée au patch ${patch}.`,
    spells: 'Ses sorts',
    spellsLoading: 'Chargement des sorts…',
    spellsError: 'Impossible de charger les sorts de ce champion.',
    watch: 'À surveiller',
    cooldown: 'Récupération',
    howToBeat: (f) => `Comment ${f ? 'la' : 'le'} battre`,
    strengths: 'Ses forces',
    weaknesses: 'Ses faiblesses',
    whenStrong: (f) => `Quand ${f ? 'elle devient forte' : 'il devient fort'}`,
    fullDescription: 'Description complète',
    keyLabels: { P: 'Passif', Q: 'Sort Q', W: 'Sort W', E: 'Sort E', R: 'Ultime (R)' },

    notFoundTitle: 'Page introuvable',
    notFoundLead: 'Ce champion ou cette page n’existe pas. Vérifie l’adresse ou lance une recherche.',
    notFoundButton: 'Chercher un champion',

    roles: { Assassin: 'Assassin', Fighter: 'Combattant', Mage: 'Mage', Marksman: 'Tireur', Support: 'Support', Tank: 'Tank' },
    difficulty: { 1: 'Facile', 2: 'Moyen', 3: 'Difficile' },
    cooldownRange: (first, last) => `${first} à ${last} s`,

    seoHomeTitle: 'LoL en 1 minute : comment contrer chaque champion de League of Legends',
    seoHomeDescription:
      'Forces, faiblesses et conseils pour battre n’importe quel champion de League of Legends, à lire pendant l’écran de chargement. Pensé pour les débutants.',
    seoChampionTitle: (name, f) => `${name} : comment ${f ? 'la' : 'le'} contrer en 1 minute`,
    seoChampionDescription: (name, roles, tip) =>
      `Comment battre ${name} (${roles}) en 1 minute : le sort à surveiller, ses forces, ses faiblesses. ${tip}`,
    seoChampionFallback: (name, title, roles) =>
      `${name}, ${title} (${roles}) : ses sorts résumés et des conseils pour l’affronter, à lire pendant l’écran de chargement.`,
    seoHeadline: (name) => `Comment contrer ${name} en 1 minute`,
    seoImageAlt: (name) => `Illustration officielle de ${name}`,
    seoNotFound: 'Page introuvable',
  },

  en: {
    homeLabel: 'LoL en 1 minute, home',
    languages: 'Site language',
    loading: 'Loading…',
    listError: 'Could not load the champion list from Riot’s servers.',
    retry: 'Try again',
    backToSearch: 'Back to search',
    supportQuestion: 'Did the site help you?',
    supportLink: 'Buy me a coffee on Ko-fi',
    legal:
      'LoL en 1 minute isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.',
    patch: (version) => `Game data: patch ${version}.`,

    heroTitle: 'Who are you up against?',
    heroLead:
      'The strengths, the weaknesses and how to beat every League of Legends champion, in the time of a loading screen.',
    backdropCredit: 'Background:',
    searchLabel: 'Search for a champion',
    searchPlaceholder: 'Darius, MF, Kog…',
    enterToOpen: 'Enter to open',
    roleFilter: 'Filter by role',
    allRoles: 'All',
    noResults: (query) => `No champion matches “${query}”. Check the spelling or try a nickname.`,
    championCount: (n) => `${n} champions`,

    back: 'Change champion',
    spellStrip: 'Spell overview',
    noFiche: (name) =>
      `No guide written for ${name} yet. In the meantime, here are their spells summarised from Riot’s official data.`,
    riotTips: 'Riot’s tips to face them',
    ficheChecked: (patch) => `Guide checked on patch ${patch}.`,
    spells: 'Abilities',
    spellsLoading: 'Loading abilities…',
    spellsError: 'Could not load this champion’s abilities.',
    watch: 'Watch out for',
    cooldown: 'Cooldown',
    howToBeat: (f) => `How to beat ${f ? 'her' : 'him'}`,
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    whenStrong: (f) => `When ${f ? 'she' : 'he'} gets strong`,
    fullDescription: 'Full description',
    keyLabels: { P: 'Passive', Q: 'Q ability', W: 'W ability', E: 'E ability', R: 'Ultimate (R)' },

    notFoundTitle: 'Page not found',
    notFoundLead: 'This champion or page doesn’t exist. Check the address or start a search.',
    notFoundButton: 'Find a champion',

    roles: { Assassin: 'Assassin', Fighter: 'Fighter', Mage: 'Mage', Marksman: 'Marksman', Support: 'Support', Tank: 'Tank' },
    difficulty: { 1: 'Easy', 2: 'Medium', 3: 'Hard' },
    cooldownRange: (first, last) => `${first} to ${last} s`,

    seoHomeTitle: 'LoL en 1 minute: how to counter every League of Legends champion',
    seoHomeDescription:
      'Strengths, weaknesses and tips to beat any League of Legends champion, to read during the loading screen. Made for beginners.',
    seoChampionTitle: (name) => `How to counter ${name} in 1 minute`,
    seoChampionDescription: (name, roles, tip) =>
      `How to beat ${name} (${roles}) in 1 minute: the ability to watch, strengths and weaknesses. ${tip}`,
    seoChampionFallback: (name, title, roles) =>
      `${name}, ${title} (${roles}): abilities summarised and tips to face them, to read during the loading screen.`,
    seoHeadline: (name) => `How to counter ${name} in 1 minute`,
    seoImageAlt: (name) => `Official artwork of ${name}`,
    seoNotFound: 'Page not found',
  },

  es: {
    homeLabel: 'LoL en 1 minute, inicio',
    languages: 'Idioma del sitio',
    loading: 'Cargando…',
    listError: 'No se pudo cargar la lista de campeones desde los servidores de Riot.',
    retry: 'Reintentar',
    backToSearch: 'Volver a la búsqueda',
    supportQuestion: '¿Te ha ayudado el sitio?',
    supportLink: 'Invítame a un café en Ko-fi',
    legal:
      'LoL en 1 minute no está respaldado por Riot Games y no refleja los puntos de vista ni las opiniones de Riot Games ni de nadie oficialmente involucrado en la producción o gestión de League of Legends. League of Legends y Riot Games son marcas comerciales o marcas registradas de Riot Games, Inc.',
    patch: (version) => `Datos del juego: parche ${version}.`,

    heroTitle: '¿Contra quién juegas?',
    heroLead:
      'Las fortalezas, las debilidades y cómo vencer a cada campeón de League of Legends, en lo que dura la pantalla de carga.',
    backdropCredit: 'De fondo:',
    searchLabel: 'Buscar un campeón',
    searchPlaceholder: 'Darius, MF, Kog…',
    enterToOpen: 'Intro para abrir',
    roleFilter: 'Filtrar por rol',
    allRoles: 'Todos',
    noResults: (query) => `Ningún campeón coincide con «${query}». Revisa la ortografía o prueba un apodo.`,
    championCount: (n) => `${n} campeones`,

    back: 'Cambiar de campeón',
    spellStrip: 'Resumen de habilidades',
    noFiche: (name) =>
      `Todavía no hay ficha para ${name}. Mientras tanto, aquí tienes sus habilidades resumidas a partir de los datos oficiales de Riot.`,
    riotTips: 'Consejos de Riot para enfrentarlo',
    ficheChecked: (patch) => `Ficha revisada en el parche ${patch}.`,
    spells: 'Sus habilidades',
    spellsLoading: 'Cargando habilidades…',
    spellsError: 'No se pudieron cargar las habilidades de este campeón.',
    watch: 'Cuidado con',
    cooldown: 'Enfriamiento',
    howToBeat: (f) => `Cómo ${f ? 'vencerla' : 'vencerlo'}`,
    strengths: 'Sus fortalezas',
    weaknesses: 'Sus debilidades',
    whenStrong: () => 'Cuándo se vuelve fuerte',
    fullDescription: 'Descripción completa',
    keyLabels: { P: 'Pasiva', Q: 'Habilidad Q', W: 'Habilidad W', E: 'Habilidad E', R: 'Definitiva (R)' },

    notFoundTitle: 'Página no encontrada',
    notFoundLead: 'Este campeón o esta página no existe. Revisa la dirección o haz una búsqueda.',
    notFoundButton: 'Buscar un campeón',

    roles: { Assassin: 'Asesino', Fighter: 'Luchador', Mage: 'Mago', Marksman: 'Tirador', Support: 'Apoyo', Tank: 'Tanque' },
    difficulty: { 1: 'Fácil', 2: 'Media', 3: 'Difícil' },
    cooldownRange: (first, last) => `${first} a ${last} s`,

    seoHomeTitle: 'LoL en 1 minute: cómo contrarrestar a cada campeón de League of Legends',
    seoHomeDescription:
      'Fortalezas, debilidades y consejos para vencer a cualquier campeón de League of Legends, para leer durante la pantalla de carga. Pensado para principiantes.',
    seoChampionTitle: (name) => `Cómo contrarrestar a ${name} en 1 minuto`,
    seoChampionDescription: (name, roles, tip) =>
      `Cómo vencer a ${name} (${roles}) en 1 minuto: la habilidad a vigilar, sus fortalezas y debilidades. ${tip}`,
    seoChampionFallback: (name, title, roles) =>
      `${name}, ${title} (${roles}): sus habilidades resumidas y consejos para enfrentarlo, para leer durante la pantalla de carga.`,
    seoHeadline: (name) => `Cómo contrarrestar a ${name} en 1 minuto`,
    seoImageAlt: (name) => `Ilustración oficial de ${name}`,
    seoNotFound: 'Página no encontrada',
  },
}

export function t(lang) {
  return STRINGS[lang] ?? STRINGS[DEFAULT_LANG]
}

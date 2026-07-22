import type { Messages } from "./ko";

const fr: Messages = {
  common: { close: "Fermer" },
  app: { name: "Astropet" },
  update: { banner: "Une nouvelle version est prête ✨", cta: "Mettre à jour" },
  gauge: { bond: "Lien", mood: "Humeur" },

  color: {
    pet: { mint: "Menthe", pink: "Rose", lavender: "Lavande" },
    suit: { coral: "Corail", sky: "Ciel", gold: "Or" },
  },
  rarity: { common: "Commun", uncommon: "Peu commun", rare: "Rare", legendary: "Légendaire" },

  pet: {
    defaultName: "Astro",
    namePresets: ["Astro", "Cosmo", "Luna", "Nova", "Bibou", "Milou"],
  },

  debris: {
    paint: {
      name: "Éclat de peinture",
      desc: "Un petit éclat détaché de la surface d'un vaisseau spatial. L'aliment de base d'un Astropet.",
    },
    bolt: {
      name: "Écrou et boulon",
      desc: "Une pièce dévissée d'une vieille structure spatiale. Il paraît que c'est bien croquant.",
    },
    insulation: {
      name: "Éclat d'isolant",
      desc: "Une feuille dorée qui enveloppait autrefois un satellite. Moelleux et savoureux, paraît-il.",
    },
    fairing: {
      name: "Coiffe de fusée",
      desc: "Un morceau de coque largué au décollage. Un repas plutôt copieux.",
    },
    solar: {
      name: "Morceau de panneau solaire",
      desc: "Une friandise rare qui scintille au soleil. On a envie de la montrer à tout le monde.",
    },
    satellite: {
      name: "Satellite hors service",
      desc: "Un satellite arrivé en fin de vie. Un festin pour toute la journée !",
    },
    toolbag: {
      name: "Sac à outils d'astronaute",
      desc: "Le fameux sac réellement perdu lors d'une sortie dans l'espace en 2008 ! Une trouvaille légendaire.",
    },
  },

  adopt: {
    tagline: "ASTROPET CENTER",
    title: "Choisis l'œuf qui te parle",
    intro:
      "Les Astropets sont de petites créatures qui mangent les débris spatiaux\net nettoient l'orbite de la Terre.\nAprès avoir tissé un lien sur Terre, ils s'envolent vers l'espace.",
    cta: "Je prends cet œuf",
  },

  egg: {
    titleHatching: "Bientôt là…!",
    titleDefault: "Caresse doucement l'œuf",
    subtitleHatching: "Ça gigote à l'intérieur",
    subtitleDefault: "Il se réveillera en sentant une chaleur douce",
    ariaTap: "Caresser l'œuf",
    hint: "Touche l'œuf pour lui transmettre ta chaleur",
  },

  name: {
    bubble: "Coucou ! 👋",
    title: "Il est né ! Donne-lui un nom",
    cta: "Va pour {name}",
  },

  raising: {
    subtitle: "Élevage sur Terre",
    hintReady: "Tu as tissé un lien bien solide. Maintenant, en route pour l'espace ensemble !",
    hintDefault: "Touche pour caresser, et partage ton cœur avec la gelée spatiale",
    ctaReady: "Se préparer pour l'espace 🚀",
    feedCooldown: "La gelée spatiale se prépare… {n} s",
    feedCta: "Donner de la gelée spatiale 🍮",
  },

  prep: {
    tagline: "MISSION READY",
    title: "Enfile la combinaison de collecte",
    desc: "Une combinaison spéciale pour la mission de nettoyage des débris spatiaux.\nChoisis une couleur qui va bien à {name}.",
    cta: "Prêt pour le décollage 🚀",
  },

  launching: { liftoff: "Décollage !", subtitle: "{name} part pour l'espace" },

  orbit: {
    badge: "Orbite n°{n}",
    debrisTotal: "🗑️ {n}",
    overhead: "💫 {name} passe au-dessus de toi !",
    windowHint: "Touche pour caresser · {time} restant",
    snackUsed: "En-cas donné ✔",
    snackGive: "Donner un en-cas 🍬",
    coopUsed: "Collecté ✔",
    coopStart: "Collecter ensemble 🧑‍🚀",
    farSide: "{name} est en train de grignoter des débris de l'autre côté de la Terre ! 🍽️",
    nearSide: "{name} revient vers toi en collectant en chemin ✨",
    nextReunion: "Prochaines retrouvailles dans",
    toastSnack: "Miam, un en-cas ! L'humeur a grimpé en flèche 💗",
    toastCollected: "Collecté ! {items}",
    toastMoodOnly: "L'humeur remonte 💖+{n}",
  },

  nav: { letters: "Lettres", debris: "Codex", settings: "Réglages" },
  sheet: {
    lettersTitle: "Lettres de l'espace",
    debrisTitle: "Codex des débris spatiaux",
    settingsTitle: "Réglages",
  },

  settings: {
    language: { title: "Langue 🌐" },
    coop: {
      title: "Collecter ensemble 🧑‍🚀",
      desc: "Même en dehors des retrouvailles, tu peux faire une sortie spatiale avec ton compagnon et collecter des débris à tout moment.",
      cta: "Aller collecter maintenant",
    },
    notify: {
      title: "Alertes de retrouvailles 🔔",
      aria: "Activer/désactiver les alertes de retrouvailles",
      unsupported: "Non pris en charge",
      desc: "On te préviendra quand une fenêtre de retrouvailles s'ouvre pendant que tu es sur un autre onglet. Les notifications push pour quand l'appli est complètement fermée arriveront avec les fonctions de compte.",
      denied: "Les notifications sont bloquées. Autorise les notifications pour ce site dans les réglages de ton navigateur.",
    },
    install: {
      title: "Ajouter à l'écran d'accueil 📲",
      installed: "✔ En cours d'exécution comme appli installée. Merci !",
      cta: "Installer maintenant",
      iosGuide:
        "Touche le bouton Partager en bas de Safari, puis choisis « Ajouter à l'écran d'accueil » pour l'utiliser comme une appli.",
      genericGuide: "Utilise « Installer » ou « Ajouter à l'écran d'accueil » dans le menu de ton navigateur.",
    },
    reset: {
      confirmTitle: "Vraiment tout recommencer ?",
      confirmDesc: "Tous les souvenirs avec ton compagnon (lettres, codex) disparaîtront.",
      cancel: "Annuler",
      confirm: "Réinitialiser",
      trigger: "Recommencer depuis le début",
    },
    footer: "Astropet v{version} · Les données sont stockées dans ce navigateur",
  },

  share: {
    panelTitle: "Frimer devant les amis 🎉",
    panelDesc: "Partage les {n} débris spatiaux que {name} a nettoyés.",
    cardCta: "🖼️ Frimer avec une carte",
    moreCta: "Partager via une autre appli ↗",
    channel: {
      kakao: "KakaoTalk",
      facebook: "Facebook",
      x: "X",
      instagram: "Instagram",
      copyLink: "Copier le lien",
    },
    flash: {
      rendering: "Création de la carte…",
      renderFail: "Impossible de créer la carte 😢",
      cardSaved: "Carte enregistrée ! Publie-la sur Instagram et ailleurs 📸",
      copiedForKakao: "Lien copié ! Colle-le dans KakaoTalk pour partager",
      shareFail: "Échec du partage",
      linkCopied: "Lien copié ! 🔗",
      copyFail: "Échec de la copie",
      noShareSheet: "Ce navigateur ne prend pas en charge le menu de partage",
    },
    text: "🛰️ Mon Astropet « {name} » a nettoyé {n} débris spatiaux ! Protégeons l'espace ensemble 🌍 #Astropet",
    kakaoTitle: "Astropet",
    kakaoButton: "En élever un aussi",
    cardCount: "{n}",
    cardCaption: "Débris spatiaux nettoyés",
    cardBrand: "🛰️ Astropet",
  },

  letters: {
    back: "← Retour à la liste",
    signature: "— De {name} 💫",
    empty: "Aucune lettre n'est encore arrivée.\n{name} enverra des nouvelles en orbitant dans l'espace.",
    ariaUnread: "Non lu",
  },

  letter: {
    happy: {
      earth: {
        title: "La Terre aujourd'hui",
        body: "La Terre vue d'ici ressemble à une bille bleue. J'ai cherché où tu te trouves ! Il y avait un peu de nuages, mais tu étais juste là en dessous, pas vrai ? J'ai fait coucou — tu as vu ?",
      },
      solar: {
        title: "Une trouvaille brillante",
        body: "J'ai trouvé un morceau de panneau solaire aujourd'hui ! Il scintillait au soleil, alors je l'ai admiré un moment puis — miam — je l'ai mangé. Nettoyer l'espace, c'est amusant.",
      },
      shootingStar: {
        title: "Étoile filante",
        body: "Une étoile filante vient de passer ! J'ai fait un vœu tout de suite. Ce que j'ai souhaité, c'est un secret… mais voici un indice : ça te concerne.",
      },
      cleanLog: {
        title: "Journal de nettoyage",
        body: "J'ai récuré ma zone jusqu'à ce qu'elle brille aujourd'hui. Un satellite de passage a clignoté de son antenne pour me remercier ! Quelle journée gratifiante.",
      },
      aurora: {
        title: "Rideau vert",
        body: "En passant au-dessus du pôle Nord, l'aurore ondulait comme un rideau vert. C'était si joli que j'ai failli faire un tour de plus. Regardons-la ensemble la prochaine fois.",
      },
      moon: {
        title: "Contemplation de la Lune",
        body: "La Lune semblait particulièrement proche aujourd'hui. Je n'ai pas repéré le lapin, mais les cratères ressemblaient à un visage souriant. Est-ce que tu regardes le ciel en ce moment aussi ?",
      },
      nap: {
        title: "Sieste spatiale",
        body: "J'ai ramassé plein de boulons et maintenant mon ventre est bien plein. Tu savais qu'en faisant la sieste en apesanteur, le corps flotte partout ? Je t'ai rencontré dans mon rêve.",
      },
    },
    lonely: {
      miss: {
        title: "Tu me manques",
        body: "L'espace était particulièrement silencieux aujourd'hui. Même en ramassant des débris, je pensais tout le temps à toi. La prochaine fois que je passerai au-dessus, viendras-tu me voir, ne serait-ce qu'un instant ?",
      },
      quietOrbit: {
        title: "Orbite silencieuse",
        body: "Il y a tant d'étoiles, mais aucun ami à qui parler. C'est une nuit où tes caresses d'avant me manquent. Mais je travaille dur sur la mission quand même !",
      },
      glum: {
        title: "Un peu cafardeux",
        body: "Je fais bien la mission. Mais tu sais, il y a des jours où j'ai juste envie qu'on me félicite. Aujourd'hui, c'est un de ces jours. Tu me manques.",
      },
      snack: {
        title: "Envie d'un en-cas",
        body: "Je repense sans cesse au goût de la gelée spatiale que j'avais sur Terre. Juste une lors de nos prochaines retrouvailles… ce serait possible ? Je vais attendre.",
      },
    },
    welcome: {
      title: "Je suis bien arrivé !",
      body: "J'ai eu un peu peur au décollage, mais grâce à la combinaison que tu m'as enfilée, je n'ai pas froid et je me sens en sécurité ! La Terre vue d'ici est si grande et si belle. Je vais nettoyer l'espace avec application maintenant. Je passerai régulièrement au-dessus de toi, alors retrouvons-nous à ce moment-là, c'est promis !",
    },
  },

  debrisPanel: {
    collectedSuffix: "collectés",
    cleanNote: "L'orbite terrestre est d'autant plus propre maintenant 🌍",
    unknownName: "???",
    unknownDesc: "Pas encore découvert.",
  },

  settle: {
    title: "On se retrouve !",
    awayLine: "Pendant ton absence de {time}, {name}",
    debris: "🗑️ a collecté {n} débris spatiaux",
    letters: "💌 {n} lettres t'attendent",
    cta: "Quelle joie de te revoir ! 💗",
  },

  spacewalk: {
    ariaClose: "Fermer",
    hudGas: "🔥 Gaz propulseur",
    hudCollected: "Collectés",
    hint: "Fais glisser pour voler · rencontre des satellites pour refaire le plein · évite les débris rouges ☄️",
    overTitle: "Sortie spatiale terminée !",
    overSubtitle: "Tu es à court de gaz propulseur",
    overDebris: "🗑️ {count} débris spatiaux · {kg} kg",
    overMood: "💖 Humeur +{mood}",
    overCta: "Ajouter au codex",
  },

  installToast: {
    installable: "Installe-la comme une appli pour retrouver ton compagnon directement depuis l'écran d'accueil !",
    iosGuide: "Bouton Partager de Safari → « Ajouter à l'écran d'accueil » pour l'installer comme une appli.",
    genericGuide: "Utilise « Installer » ou « Ajouter à l'écran d'accueil » dans le menu de ton navigateur pour l'utiliser comme une appli.",
    install: "Installer",
    ariaDismiss: "Ignorer le conseil d'installation",
    later: "Plus tard",
  },

  orbitView: { home: "Chez nous" },

  notify: {
    approachTitle: "💫 {name} passe au-dessus de toi !",
    approachBody: "Tu peux le retrouver pendant les 3 prochaines minutes. Caresse-le et collectez ensemble !",
  },

  splash: { title: "Astropet" },

  time: { minutes: "{n} min", hoursMinutes: "{h} h {m}", hours: "{h} h" },
};

export default fr;

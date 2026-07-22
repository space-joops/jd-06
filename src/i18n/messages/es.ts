import type { Messages } from "./ko";

// Español — traducción neutral/latinoamericana. Se conservan {vars}, emoji y saltos de línea \n.
const es: Messages = {
  common: { close: "Cerrar" },
  app: { name: "Astropet" },
  update: { banner: "¡Una nueva versión está lista! ✨", cta: "Actualizar" },
  gauge: { bond: "Vínculo", mood: "Ánimo" },

  color: {
    pet: { mint: "Menta", pink: "Rosa", lavender: "Lavanda" },
    suit: { coral: "Coral", sky: "Cielo", gold: "Dorado" },
  },
  rarity: { common: "Común", uncommon: "Poco común", rare: "Raro", legendary: "Legendario" },

  pet: {
    defaultName: "Estrella",
    namePresets: ["Estrella", "Cosmo", "Luna", "Chispa", "Nube", "Cometa"],
  },

  debris: {
    paint: {
      name: "Escama de pintura",
      desc: "Una escamita desprendida de la superficie de una nave espacial. El alimento básico de un Astropet.",
    },
    bolt: {
      name: "Tuerca y tornillo",
      desc: "Una pieza que se soltó de una vieja estructura espacial. Dicen que es bien crujiente.",
    },
    insulation: {
      name: "Fragmento de aislante",
      desc: "Lámina dorada que alguna vez envolvió un satélite. Al parecer es chiclosa y satisfactoria.",
    },
    fairing: {
      name: "Carenado de cohete",
      desc: "Un trozo de cubierta que se desprende en el lanzamiento. Una comida bastante contundente.",
    },
    solar: {
      name: "Trozo de panel solar",
      desc: "Un manjar raro que brilla bajo la luz del sol. Dan ganas de presumirlo.",
    },
    satellite: {
      name: "Satélite fuera de servicio",
      desc: "Un satélite que llegó al final de su vida útil. ¡Un festín para todo el día!",
    },
    toolbag: {
      name: "Bolsa de herramientas de astronauta",
      desc: "¡La mismísima bolsa que de verdad se perdió durante una caminata espacial en 2008! Un hallazgo legendario.",
    },
  },

  adopt: {
    tagline: "ASTROPET CENTER",
    title: "Elige el huevo que más te llame",
    intro:
      "Los Astropets son criaturitas que comen basura espacial\ny limpian la órbita de la Tierra.\nTras crear un vínculo en la Tierra, parten hacia el espacio.",
    cta: "Me llevo este huevo",
  },

  egg: {
    titleHatching: "¡Ya casi llega…!",
    titleDefault: "Dale palmaditas suaves al huevo",
    subtitleHatching: "Se está moviendo por dentro",
    subtitleDefault: "Despertará cuando sienta un toque cálido",
    ariaTap: "Dar palmaditas al huevo",
    hint: "Toca el huevo para transmitirle tu calor",
  },

  name: {
    bubble: "¡Hola! 👋",
    title: "¡Ya nació! Ponle un nombre",
    cta: "Me quedo con {name}",
  },

  raising: {
    subtitle: "Criando en la Tierra",
    hintReady: "Ya acumularon suficiente vínculo. ¡Ahora, juntos al espacio!",
    hintDefault: "Toca para acariciar y comparte tu cariño con la jalea espacial",
    ctaReady: "Prepararse para el espacio 🚀",
    feedCooldown: "Preparando la jalea espacial… {n}s",
    feedCta: "Dar jalea espacial 🍮",
  },

  prep: {
    tagline: "MISSION READY",
    title: "Ponle el traje de limpieza",
    desc: "Un traje especial para la misión de limpieza de basura espacial.\nElige un color que le quede bien a {name}.",
    cta: "Listo para el lanzamiento 🚀",
  },

  launching: { liftoff: "¡Despegue!", subtitle: "{name} va rumbo al espacio" },

  orbit: {
    badge: "Órbita n.º {n}",
    debrisTotal: "🗑️ {n}",
    overhead: "💫 ¡{name} está pasando por encima!",
    windowHint: "Toca para acariciar · quedan {time}",
    snackUsed: "Bocadillo listo ✔",
    snackGive: "Dar un bocadillo 🍬",
    coopUsed: "Recolectado ✔",
    coopStart: "Recolectar juntos 🧑‍🚀",
    farSide: "¡{name} está ocupado comiendo basura al otro lado de la Tierra! 🍽️",
    nearSide: "{name} viene de regreso hacia ti, recolectando por el camino ✨",
    nextReunion: "Próximo reencuentro en",
    toastSnack: "¡Ñam, un bocadillo! El ánimo se disparó 💗",
    toastCollected: "¡Recolectado! {items}",
    toastMoodOnly: "Se siente más feliz 💖+{n}",
  },

  nav: { letters: "Cartas", debris: "Códice", settings: "Ajustes" },
  sheet: {
    lettersTitle: "Cartas desde el espacio",
    debrisTitle: "Códice de basura espacial",
    settingsTitle: "Ajustes",
  },

  settings: {
    language: { title: "Idioma / Language 🌐" },
    coop: {
      title: "Recolectar juntos 🧑‍🚀",
      desc: "Incluso fuera del horario de reencuentro, puedes hacer una caminata espacial con tu mascota y recolectar basura cuando quieras.",
      cta: "Ir a recolectar ahora",
    },
    notify: {
      title: "Alertas de reencuentro 🔔",
      aria: "Activar o desactivar las alertas de reencuentro",
      unsupported: "No compatible",
      desc: "Te avisaremos cuando se abra una ventana de reencuentro mientras estás en otra pestaña. Las notificaciones push para cuando la app está completamente cerrada llegarán junto con las funciones de cuenta.",
      denied: "Las notificaciones están bloqueadas. Permite las notificaciones de este sitio en la configuración de tu navegador.",
    },
    install: {
      title: "Agregar a la pantalla de inicio 📲",
      installed: "✔ Funcionando como app instalada. ¡Gracias!",
      cta: "Instalar ahora",
      iosGuide:
        "Toca el botón Compartir en la parte inferior de Safari y luego elige “Agregar a pantalla de inicio” para usarla como una app.",
      genericGuide: "Usa “Instalar” o “Agregar a pantalla de inicio” en el menú de tu navegador.",
    },
    reset: {
      confirmTitle: "¿De verdad quieres empezar de nuevo?",
      confirmDesc: "Todos los recuerdos con tu mascota (cartas, códice) desaparecerán.",
      cancel: "Cancelar",
      confirm: "Reiniciar",
      trigger: "Empezar de nuevo desde el principio",
    },
    footer: "Astropet v{version} · Los datos se guardan en este navegador",
  },

  share: {
    panelTitle: "Presume ante tus amigos 🎉",
    panelDesc: "Comparte las {n} piezas de basura espacial que {name} ha limpiado.",
    cardCta: "🖼️ Presumir con una tarjeta",
    moreCta: "Compartir en otra app ↗",
    channel: {
      kakao: "KakaoTalk",
      facebook: "Facebook",
      x: "X",
      instagram: "Instagram",
      copyLink: "Copiar enlace",
    },
    flash: {
      rendering: "Creando la tarjeta…",
      renderFail: "No se pudo crear la tarjeta 😢",
      cardSaved: "¡Tarjeta guardada! Publícala en Instagram y más 📸",
      copiedForKakao: "¡Enlace copiado! Pégalo en KakaoTalk para compartir",
      shareFail: "No se pudo compartir",
      linkCopied: "¡Enlace copiado! 🔗",
      copyFail: "No se pudo copiar",
      noShareSheet: "Este navegador no admite la hoja de compartir",
    },
    text: "🛰️ ¡Mi Astropet '{name}' ha limpiado {n} piezas de basura espacial! Protejamos el espacio juntos 🌍 #Astropet",
    kakaoTitle: "Astropet",
    kakaoButton: "Cría el tuyo también",
    cardCount: "{n}",
    cardCaption: "Basura espacial limpiada",
    cardBrand: "🛰️ Astropet",
  },

  letters: {
    back: "← Volver a la lista",
    signature: "— De {name} 💫",
    empty: "Aún no ha llegado ninguna carta.\n{name} te enviará noticias mientras orbita el espacio.",
    ariaUnread: "Sin leer",
  },

  letter: {
    happy: {
      earth: {
        title: "La Tierra hoy",
        body: "La Tierra desde aquí arriba parece una canica azul. ¡Busqué el lugar donde estás! Estaba un poco nublado, pero estabas justo ahí abajo, ¿verdad? Te saludé con la mano… ¿me viste?",
      },
      solar: {
        title: "Un hallazgo brillante",
        body: "¡Hoy encontré un trozo de panel solar! Brillaba bajo la luz del sol, así que lo observé un rato y luego —ñam— me lo comí. Limpiar el espacio es divertido.",
      },
      shootingStar: {
        title: "Estrella fugaz",
        body: "¡Acaba de pasar una estrella fugaz! Pedí un deseo de inmediato. Lo que pedí es un secreto… pero te doy una pista: tiene que ver contigo.",
      },
      cleanLog: {
        title: "Bitácora de limpieza",
        body: "Hoy dejé mi zona asignada reluciente. ¡Un satélite que pasaba parpadeó su antena para dar las gracias! Qué día tan gratificante.",
      },
      aurora: {
        title: "Cortina verde",
        body: "Al pasar sobre el Polo Norte, la aurora ondeaba como una cortina verde. Era tan bonita que casi doy otra vuelta. La próxima vez la vemos juntos.",
      },
      moon: {
        title: "Mirando la Luna",
        body: "Hoy la Luna se veía especialmente cerca. No pude encontrar al conejo, pero los cráteres parecían una carita sonriente. ¿Tú también estás mirando el cielo ahora?",
      },
      nap: {
        title: "Siesta espacial",
        body: "Recogí montones de tornillos y ahora tengo la pancita llena. ¿Sabías que cuando duermes la siesta en gravedad cero tu cuerpo flota por todas partes? Te encontré en mi sueño.",
      },
    },
    lonely: {
      miss: {
        title: "Te extraño",
        body: "Hoy el espacio estuvo especialmente silencioso. Incluso mientras recogía basura, no dejaba de pensar en ti. La próxima vez que pase por encima, ¿vendrás a verme, aunque sea un momento?",
      },
      quietOrbit: {
        title: "Órbita silenciosa",
        body: "Hay tantísimas estrellas, pero ningún amigo con quien hablar. Es una noche en la que extraño cómo solías acariciarme. ¡Aun así, sigo esforzándome en la misión!",
      },
      glum: {
        title: "Un poco triste",
        body: "Estoy cumpliendo bien la misión. Pero ¿sabes? Hay días en que solo quiero que me feliciten. Hoy es uno de esos días. Te extraño.",
      },
      snack: {
        title: "Antojo de un bocadillo",
        body: "No dejo de pensar en el sabor de la jalea espacial que probé en la Tierra. En nuestro próximo reencuentro, solo una… ¿se podrá? Estaré esperando.",
      },
    },
    welcome: {
      title: "¡Llegué sano y salvo!",
      body: "Al principio tuve un poco de miedo en el lanzamiento, pero gracias al traje que me pusiste ¡estoy calientito y seguro! La Tierra desde aquí es enorme y hermosa. Ahora limpiaré el espacio con esmero. Pasaré por encima de ti con regularidad, así que ¡asegurémonos de encontrarnos entonces!",
    },
  },

  debrisPanel: {
    collectedSuffix: "recolectadas",
    cleanNote: "Así de limpia está ahora la órbita de la Tierra 🌍",
    unknownName: "???",
    unknownDesc: "Aún no descubierto.",
  },

  settle: {
    title: "¡Nos volvemos a ver!",
    awayLine: "Mientras estuviste fuera durante {time}, {name}",
    debris: "🗑️ recolectó {n} piezas de basura espacial",
    letters: "💌 {n} cartas te están esperando",
    cta: "¡Qué gusto verte! 💗",
  },

  spacewalk: {
    ariaClose: "Cerrar",
    hudGas: "🔥 Gas del propulsor",
    hudCollected: "Recolectado",
    hint: "Arrastra para volar · encuentra satélites para recargar · esquiva la basura roja ☄️",
    overTitle: "¡Fin de la caminata espacial!",
    overSubtitle: "Te quedaste sin gas del propulsor",
    overDebris: "🗑️ {count} piezas de basura espacial · {kg}kg",
    overMood: "💖 Ánimo +{mood}",
    overCta: "Agregar al códice",
  },

  installToast: {
    installable: "¡Instálala como app para encontrarte con tu mascota directo desde la pantalla de inicio!",
    iosGuide: "Botón Compartir de Safari → “Agregar a pantalla de inicio” para instalarla como una app.",
    genericGuide: "Usa “Instalar” o “Agregar a pantalla de inicio” en el menú de tu navegador para usarla como una app.",
    install: "Instalar",
    ariaDismiss: "Descartar el aviso de instalación",
    later: "Más tarde",
  },

  orbitView: { home: "Casa" },

  notify: {
    approachTitle: "💫 ¡{name} está pasando por encima!",
    approachBody: "Puedes encontrarte durante los próximos 3 minutos. ¡Acaricia y recolecta juntos!",
  },

  splash: { title: "Astropet" },

  time: { minutes: "{n} min", hoursMinutes: "{h} h {m} min", hours: "{h} h" },
};

export default es;

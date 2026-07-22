import type { Messages } from "./ko";

const de: Messages = {
  common: { close: "Schließen" },
  app: { name: "Astropet" },
  update: { banner: "Eine neue Version ist bereit ✨", cta: "Aktualisieren" },
  gauge: { bond: "Bindung", mood: "Stimmung" },

  color: {
    pet: { mint: "Mint", pink: "Rosa", lavender: "Lavendel" },
    suit: { coral: "Koralle", sky: "Himmelblau", gold: "Gold" },
  },
  rarity: { common: "Gewöhnlich", uncommon: "Ungewöhnlich", rare: "Selten", legendary: "Legendär" },

  pet: {
    defaultName: "Sternchen",
    namePresets: ["Sternchen", "Kosmo", "Luna", "Krümel", "Flöckchen", "Wölkchen"],
  },

  debris: {
    paint: {
      name: "Lackflocke",
      desc: "Eine kleine Flocke, die von der Oberfläche eines Raumschiffs abgeblättert ist. Das Grundnahrungsmittel eines Astropets.",
    },
    bolt: {
      name: "Schraube & Mutter",
      desc: "Ein Teil, das sich von einer alten Weltraumstruktur gelöst hat. Es soll schön knusprig sein.",
    },
    insulation: {
      name: "Isolierungssplitter",
      desc: "Goldene Folie, die einst einen Satelliten umhüllte. Angeblich zäh und sättigend.",
    },
    fairing: {
      name: "Raketenverkleidung",
      desc: "Ein Verkleidungsteil, das beim Start abgeworfen wird. Eine ziemlich herzhafte Mahlzeit.",
    },
    solar: {
      name: "Solarpaneel-Stück",
      desc: "Ein seltener Leckerbissen, der im Sonnenlicht glitzert. Man möchte damit richtig angeben.",
    },
    satellite: {
      name: "Ausrangierter Satellit",
      desc: "Ein Satellit, der das Ende seiner Lebensdauer erreicht hat. Ein Festmahl für den ganzen Tag!",
    },
    toolbag: {
      name: "Werkzeugtasche eines Astronauten",
      desc: "Genau die Tasche, die 2008 wirklich bei einem Weltraumspaziergang verloren ging! Ein legendärer Fund.",
    },
  },

  adopt: {
    tagline: "ASTROPET CENTER",
    title: "Wähle das Ei, das dich anspricht",
    intro:
      "Astropets sind winzige Wesen, die Weltraumschrott fressen\nund die Erdumlaufbahn säubern.\nNachdem sie auf der Erde eine Bindung aufgebaut haben, brechen sie ins All auf.",
    cta: "Ich nehme dieses Ei",
  },

  egg: {
    titleHatching: "Gleich ist es so weit…!",
    titleDefault: "Streichle das Ei ganz sanft",
    subtitleHatching: "Es zappelt darin herum",
    subtitleDefault: "Es wacht auf, wenn es eine warme Berührung spürt",
    ariaTap: "Das Ei streicheln",
    hint: "Tippe auf das Ei, um deine Wärme zu teilen",
  },

  name: {
    bubble: "Hallo! 👋",
    title: "Es ist geschlüpft! Gib ihm einen Namen",
    cta: "{name} soll es sein",
  },

  raising: {
    subtitle: "Aufzucht auf der Erde",
    hintReady: "Ihr habt eine starke Bindung aufgebaut. Jetzt gemeinsam ins All!",
    hintDefault: "Tippe zum Streicheln und teile dein Herz mit Weltraum-Gelee",
    ctaReady: "Bereit machen fürs All 🚀",
    feedCooldown: "Weltraum-Gelee wird vorbereitet… {n}s",
    feedCta: "Weltraum-Gelee geben 🍮",
  },

  prep: {
    tagline: "MISSION READY",
    title: "Zieh den Aufräum-Anzug an",
    desc: "Ein Spezialanzug für die Weltraumschrott-Aufräummission.\nWähle eine Farbe, die zu {name} passt.",
    cta: "Startklar 🚀",
  },

  launching: { liftoff: "Abheben!", subtitle: "{name} fliegt ins All" },

  orbit: {
    badge: "Orbit #{n}",
    debrisTotal: "🗑️ {n}",
    overhead: "💫 {name} zieht über dir vorbei!",
    windowHint: "Tippe zum Streicheln · noch {time}",
    snackUsed: "Snack gegeben ✔",
    snackGive: "Snack geben 🍬",
    coopUsed: "Eingesammelt ✔",
    coopStart: "Gemeinsam sammeln 🧑‍🚀",
    farSide: "{name} knabbert gerade eifrig Schrott auf der anderen Seite der Erde! 🍽️",
    nearSide: "{name} kommt zu dir zurück und sammelt unterwegs ein ✨",
    nextReunion: "Nächstes Wiedersehen in",
    toastSnack: "Lecker, ein Snack! Die Stimmung steigt 💗",
    toastCollected: "Eingesammelt! {items}",
    toastMoodOnly: "Bessere Stimmung 💖+{n}",
  },

  nav: { letters: "Briefe", debris: "Katalog", settings: "Einstellungen" },
  sheet: {
    lettersTitle: "Briefe aus dem All",
    debrisTitle: "Weltraumschrott-Katalog",
    settingsTitle: "Einstellungen",
  },

  settings: {
    language: { title: "Sprache 🌐" },
    coop: {
      title: "Gemeinsam sammeln 🧑‍🚀",
      desc: "Auch außerhalb der Wiedersehenszeit kannst du jederzeit mit deinem Pet einen Weltraumspaziergang machen und Schrott einsammeln.",
      cta: "Jetzt sammeln gehen",
    },
    notify: {
      title: "Wiedersehens-Erinnerungen 🔔",
      aria: "Wiedersehens-Erinnerungen ein-/ausschalten",
      unsupported: "Nicht unterstützt",
      desc: "Wir sagen dir Bescheid, wenn sich ein Wiedersehensfenster öffnet, während du in einem anderen Tab bist. Push-Benachrichtigungen für den Fall, dass die App ganz geschlossen ist, kommen mit den Konto-Funktionen.",
      denied: "Benachrichtigungen sind blockiert. Bitte erlaube Benachrichtigungen für diese Seite in deinen Browser-Einstellungen.",
    },
    install: {
      title: "Zum Startbildschirm hinzufügen 📲",
      installed: "✔ Läuft als installierte App. Danke dir!",
      cta: "Jetzt installieren",
      iosGuide:
        "Tippe unten in Safari auf die Teilen-Schaltfläche und wähle dann „Zum Startbildschirm hinzufügen“, um sie wie eine App zu nutzen.",
      genericGuide: "Nutze „Installieren“ oder „Zum Startbildschirm hinzufügen“ im Menü deines Browsers.",
    },
    reset: {
      confirmTitle: "Wirklich von vorn beginnen?",
      confirmDesc: "Alle Erinnerungen an dein Pet (Briefe, Katalog) gehen verloren.",
      cancel: "Abbrechen",
      confirm: "Zurücksetzen",
      trigger: "Von vorn beginnen",
    },
    footer: "Astropet v{version} · Daten werden in diesem Browser gespeichert",
  },

  share: {
    panelTitle: "Vor Freunden angeben 🎉",
    panelDesc: "Teile die {n} Stück Weltraumschrott, die {name} beseitigt hat.",
    cardCta: "🖼️ Mit einer Karte angeben",
    moreCta: "Über eine andere App teilen ↗",
    channel: {
      kakao: "KakaoTalk",
      facebook: "Facebook",
      x: "X",
      instagram: "Instagram",
      copyLink: "Link kopieren",
    },
    flash: {
      rendering: "Karte wird erstellt…",
      renderFail: "Karte konnte nicht erstellt werden 😢",
      cardSaved: "Karte gespeichert! Poste sie auf Instagram und mehr 📸",
      copiedForKakao: "Link kopiert! Füge ihn in KakaoTalk ein, um zu teilen",
      shareFail: "Teilen fehlgeschlagen",
      linkCopied: "Link kopiert! 🔗",
      copyFail: "Kopieren fehlgeschlagen",
      noShareSheet: "Dieser Browser unterstützt das Teilen-Menü nicht",
    },
    text: "🛰️ Mein Astropet '{name}' hat {n} Stück Weltraumschrott beseitigt! Lass uns gemeinsam das All schützen 🌍 #Astropet",
    kakaoTitle: "Astropet",
    kakaoButton: "Auch eins großziehen",
    cardCount: "{n}",
    cardCaption: "Weltraumschrott beseitigt",
    cardBrand: "🛰️ Astropet",
  },

  letters: {
    back: "← Zurück zur Liste",
    signature: "— Von {name} 💫",
    empty: "Noch sind keine Briefe angekommen.\n{name} schickt Neuigkeiten aus der Umlaufbahn.",
    ariaUnread: "Ungelesen",
  },

  letter: {
    happy: {
      earth: {
        title: "Die Erde heute",
        body: "Die Erde sieht von hier oben aus wie eine blaue Murmel. Ich habe nach deinem Zuhause gesucht! Es war ein bisschen wolkig, aber du warst bestimmt da unten, oder? Ich habe gewinkt – hast du's gesehen?",
      },
      solar: {
        title: "Ein glitzernder Fund",
        body: "Heute habe ich ein Solarpaneel-Stück gefunden! Es hat im Sonnenlicht geglitzert, also habe ich es eine Weile bestaunt und dann – nam – aufgefuttert. Weltraumputzen macht Spaß.",
      },
      shootingStar: {
        title: "Sternschnuppe",
        body: "Gerade ist eine Sternschnuppe vorbeigezogen! Ich habe mir sofort etwas gewünscht. Was ich mir gewünscht habe, ist ein Geheimnis… aber ein kleiner Tipp: Es hat mit dir zu tun.",
      },
      cleanLog: {
        title: "Putz-Tagebuch",
        body: "Heute habe ich meinen zugeteilten Bereich blitzblank geputzt. Ein vorbeifliegender Satellit hat zum Dank mit seiner Antenne geblinkt! So ein erfüllender Tag.",
      },
      aurora: {
        title: "Grüner Vorhang",
        body: "Als ich über den Nordpol geflogen bin, wogte das Polarlicht wie ein grüner Vorhang. Es war so schön, dass ich fast noch eine Runde gedreht hätte. Nächstes Mal schauen wir es zusammen an.",
      },
      moon: {
        title: "Mondschau",
        body: "Der Mond sah heute besonders nah aus. Den Hasen habe ich nicht entdeckt, aber die Krater sahen aus wie ein lächelndes Gesicht. Schaust du jetzt auch gerade in den Himmel?",
      },
      nap: {
        title: "Weltraum-Nickerchen",
        body: "Ich habe jede Menge Schrauben aufgesammelt und jetzt ist mein Bäuchlein ganz voll. Wusstest du, dass dein Körper umherschwebt, wenn man in der Schwerelosigkeit ein Nickerchen macht? Im Traum habe ich dich getroffen.",
      },
    },
    lonely: {
      miss: {
        title: "Ich vermisse dich",
        body: "Heute war es im All besonders still. Sogar beim Schrottsammeln musste ich immerzu an dich denken. Wenn ich das nächste Mal über dich hinwegfliege, kommst du mich dann besuchen, wenn auch nur kurz?",
      },
      quietOrbit: {
        title: "Stille Umlaufbahn",
        body: "Es gibt so viele Sterne, aber keinen Freund zum Reden. In so einer Nacht vermisse ich es, wie du mich früher gestreichelt hast. Trotzdem gebe ich bei der Mission mein Bestes!",
      },
      glum: {
        title: "Ein bisschen wehmütig",
        body: "Die Mission läuft gut. Aber weißt du, an manchen Tagen möchte ich einfach mal gelobt werden. Heute ist so ein Tag. Ich vermisse dich.",
      },
      snack: {
        title: "Lust auf einen Snack",
        body: "Ich muss immerzu an den Geschmack des Weltraum-Gelees denken, das ich auf der Erde hatte. Beim nächsten Wiedersehen nur eins… vielleicht? Ich warte auf dich.",
      },
    },
    welcome: {
      title: "Ich bin heil angekommen!",
      body: "Beim Start hatte ich ein bisschen Angst, aber dank des Anzugs, den du mir angezogen hast, ist mir warm und ich fühle mich sicher! Die Erde ist von hier aus so groß und schön. Ab jetzt räume ich fleißig das All auf. Ich fliege regelmäßig über dich hinweg – lass uns dann unbedingt treffen!",
    },
  },

  debrisPanel: {
    collectedSuffix: "eingesammelt",
    cleanNote: "So viel sauberer ist die Erdumlaufbahn jetzt 🌍",
    unknownName: "???",
    unknownDesc: "Noch nicht entdeckt.",
  },

  settle: {
    title: "Wir sehen uns wieder!",
    awayLine: "Während du {time} weg warst, hat {name}",
    debris: "🗑️ {n} Stück Weltraumschrott eingesammelt",
    letters: "💌 {n} Briefe warten auf dich",
    cta: "Schön, dich zu sehen! 💗",
  },

  spacewalk: {
    ariaClose: "Schließen",
    hudGas: "🔥 Schubgas",
    hudCollected: "Gesammelt",
    hint: "Ziehen zum Fliegen · Satelliten treffen zum Auftanken · rotem Schrott ausweichen ☄️",
    overTitle: "Weltraumspaziergang vorbei!",
    overSubtitle: "Dein Schubgas ist aufgebraucht",
    overDebris: "🗑️ {count} Weltraumschrott · {kg} kg",
    overMood: "💖 Stimmung +{mood}",
    overCta: "In den Katalog aufnehmen",
  },

  installToast: {
    installable: "Installiere es als App, um dein Pet direkt vom Startbildschirm aus zu treffen!",
    iosGuide: "Safari Teilen-Schaltfläche → „Zum Startbildschirm hinzufügen“, um es wie eine App zu installieren.",
    genericGuide: "Nutze „Installieren“ oder „Zum Startbildschirm hinzufügen“ im Browser-Menü, um es wie eine App zu verwenden.",
    install: "Installieren",
    ariaDismiss: "Installations-Tipp schließen",
    later: "Später",
  },

  orbitView: { home: "Zuhause" },

  notify: {
    approachTitle: "💫 {name} zieht über dir vorbei!",
    approachBody: "Ihr könnt euch in den nächsten 3 Minuten treffen. Streicheln und gemeinsam sammeln!",
  },

  splash: { title: "Astropet" },

  time: { minutes: "{n} Min.", hoursMinutes: "{h} Std. {m} Min.", hours: "{h} Std." },
};

export default de;

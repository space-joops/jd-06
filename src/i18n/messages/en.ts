import type { Messages } from "./ko";

// English — fallback locale. Keep {vars} and emoji; particles dropped naturally.
const en: Messages = {
  common: { close: "Close" },
  app: { name: "Astropet" },
  update: { banner: "A new version is ready ✨", cta: "Update" },
  gauge: { bond: "Bond", mood: "Mood" },

  color: {
    pet: { mint: "Mint", pink: "Pink", lavender: "Lavender" },
    suit: { coral: "Coral", sky: "Sky", gold: "Gold" },
  },
  rarity: { common: "Common", uncommon: "Uncommon", rare: "Rare", legendary: "Legendary" },

  pet: {
    defaultName: "Astro",
    namePresets: ["Astro", "Cosmo", "Luna", "Pom", "Jelly", "Sora"],
  },

  debris: {
    paint: {
      name: "Paint Flake",
      desc: "A little flake shed from a spacecraft's surface. An Astropet's staple food.",
    },
    bolt: {
      name: "Nut & Bolt",
      desc: "A part loosened from an old space structure. They say it's nice and crunchy.",
    },
    insulation: {
      name: "Insulation Shard",
      desc: "Golden foil that once wrapped a satellite. Chewy and satisfying, apparently.",
    },
    fairing: {
      name: "Rocket Fairing",
      desc: "A shell piece jettisoned at launch. A pretty hearty meal.",
    },
    solar: {
      name: "Solar Panel Piece",
      desc: "A rare treat that glitters in the sunlight. You'll want to show it off.",
    },
    satellite: {
      name: "Dead Satellite",
      desc: "A satellite that has reached the end of its life. An all-day feast!",
    },
    toolbag: {
      name: "Astronaut's Tool Bag",
      desc: "The very bag really lost during a 2008 spacewalk! A legendary find.",
    },
  },

  adopt: {
    tagline: "ASTROPET CENTER",
    title: "Choose the egg that speaks to you",
    intro:
      "Astropets are tiny creatures that eat space debris\nand clean up Earth's orbit.\nAfter bonding on Earth, they set off into space.",
    cta: "I'll take this egg",
  },

  egg: {
    titleHatching: "Almost here…!",
    titleDefault: "Give the egg a gentle pat",
    subtitleHatching: "It's wriggling around inside",
    subtitleDefault: "It'll wake up when it feels a warm touch",
    ariaTap: "Pat the egg",
    hint: "Tap the egg to share your warmth",
  },

  name: {
    bubble: "Hi! 👋",
    title: "It's born! Give it a name",
    cta: "Go with {name}",
  },

  raising: {
    subtitle: "Raising on Earth",
    hintReady: "You've built up plenty of bond. Now, off to space together!",
    hintDefault: "Tap to pet, and share your heart with space jelly",
    ctaReady: "Get ready for space 🚀",
    feedCooldown: "Space jelly warming up… {n}s",
    feedCta: "Give space jelly 🍮",
  },

  prep: {
    tagline: "MISSION READY",
    title: "Put on the cleanup suit",
    desc: "A special suit for the space-debris cleanup mission.\nPick a color that suits {name}.",
    cta: "Ready for launch 🚀",
  },

  launching: { liftoff: "Liftoff!", subtitle: "{name} is heading to space" },

  orbit: {
    badge: "Orbit #{n}",
    debrisTotal: "🗑️ {n}",
    overhead: "💫 {name} is passing overhead!",
    windowHint: "Tap to pet · {time} left",
    snackUsed: "Snack done ✔",
    snackGive: "Give a snack 🍬",
    coopUsed: "Collected ✔",
    coopStart: "Collect together 🧑‍🚀",
    farSide: "{name} is busy munching debris on the far side of Earth! 🍽️",
    nearSide: "{name} is coming back your way, collecting along the route ✨",
    nextReunion: "Next reunion in",
    toastSnack: "Yum, a snack! Mood soared 💗",
    toastCollected: "Collected! {items}",
    toastMoodOnly: "Feeling happier 💖+{n}",
  },

  nav: { letters: "Letters", debris: "Codex", settings: "Settings" },
  sheet: {
    lettersTitle: "Letters from space",
    debrisTitle: "Space Debris Codex",
    settingsTitle: "Settings",
  },

  settings: {
    language: { title: "Language 🌐" },
    coop: {
      title: "Collect together 🧑‍🚀",
      desc: "Even outside reunion time, you can spacewalk with your pet and collect debris anytime.",
      cta: "Go collect now",
    },
    notify: {
      title: "Reunion alerts 🔔",
      aria: "Toggle reunion alerts",
      unsupported: "Not supported",
      desc: "We'll let you know when a reunion window opens while you're on another tab. Push notifications for when the app is fully closed will arrive with account features.",
      denied: "Notifications are blocked. Please allow notifications for this site in your browser settings.",
    },
    install: {
      title: "Add to Home Screen 📲",
      installed: "✔ Running as an installed app. Thank you!",
      cta: "Install now",
      iosGuide:
        "Tap the Share button at the bottom of Safari, then choose “Add to Home Screen” to use it like an app.",
      genericGuide: "Use “Install” or “Add to Home Screen” in your browser menu.",
    },
    reset: {
      confirmTitle: "Really start over?",
      confirmDesc: "All memories with your pet (letters, codex) will be gone.",
      cancel: "Cancel",
      confirm: "Reset",
      trigger: "Start over from the beginning",
    },
    footer: "Astropet v{version} · Data is stored in this browser",
  },

  share: {
    panelTitle: "Show off to friends 🎉",
    panelDesc: "Share the {n} space debris {name} has cleaned up.",
    cardCta: "🖼️ Brag with a card",
    moreCta: "Share via another app ↗",
    channel: {
      kakao: "KakaoTalk",
      facebook: "Facebook",
      x: "X",
      instagram: "Instagram",
      copyLink: "Copy link",
    },
    flash: {
      rendering: "Making the card…",
      renderFail: "Couldn't create the card 😢",
      cardSaved: "Card saved! Post it to Instagram and more 📸",
      copiedForKakao: "Link copied! Paste it into KakaoTalk to share",
      shareFail: "Sharing failed",
      linkCopied: "Link copied! 🔗",
      copyFail: "Copy failed",
      noShareSheet: "This browser doesn't support the share sheet",
    },
    text: "🛰️ My Astropet '{name}' has cleaned up {n} pieces of space debris! Let's protect space together 🌍 #Astropet",
    kakaoTitle: "Astropet",
    kakaoButton: "Raise one too",
    cardCount: "{n}",
    cardCaption: "Space debris cleaned",
    cardBrand: "🛰️ Astropet",
  },

  letters: {
    back: "← Back to list",
    signature: "— From {name} 💫",
    empty: "No letters have arrived yet.\n{name} will send news while orbiting space.",
    ariaUnread: "Unread",
  },

  letter: {
    happy: {
      earth: {
        title: "Earth Today",
        body: "Earth from up here looks like a blue marble. I looked for where you are! It was a little cloudy, but you were right down there, weren't you? I waved — did you see?",
      },
      solar: {
        title: "A Shiny Find",
        body: "I found a solar-panel piece today! It sparkled in the sunlight, so I watched it for a while and then — nom — ate it up. Cleaning space is fun.",
      },
      shootingStar: {
        title: "Shooting Star",
        body: "A shooting star just went by! I made a wish right away. What I wished for is a secret… but here's a hint: it's about you.",
      },
      cleanLog: {
        title: "Cleanup Log",
        body: "I scrubbed my assigned zone until it sparkled today. A passing satellite blinked its antenna to say thanks! What a rewarding day.",
      },
      aurora: {
        title: "Green Curtain",
        body: "As I passed over the North Pole, the aurora rippled like a green curtain. It was so pretty I almost did another lap. Let's watch it together next time.",
      },
      moon: {
        title: "Moon Gazing",
        body: "The Moon looked especially close today. I couldn't spot the rabbit, but the craters looked just like a smiling face. Are you looking at the sky right now too?",
      },
      nap: {
        title: "Space Nap",
        body: "I picked up loads of bolts and now my tummy's full. Did you know that when you nap in zero-g, your body floats around? I met you in my dream.",
      },
    },
    lonely: {
      miss: {
        title: "I Miss You",
        body: "Space was especially quiet today. Even while picking up debris, I kept thinking of you. Next time I pass overhead, will you come see me, even for a moment?",
      },
      quietOrbit: {
        title: "Quiet Orbit",
        body: "There are so many stars, but no friend to talk to. It's a night I miss the way you used to pet me. Still, I'm working hard on the mission!",
      },
      glum: {
        title: "A Little Blue",
        body: "I'm doing the mission well. But you know, some days I just want to be praised. Today is one of those days. I miss you.",
      },
      snack: {
        title: "Craving a Snack",
        body: "I keep thinking about the taste of the space jelly I had on Earth. Just one at our next reunion… maybe? I'll be waiting.",
      },
    },
    welcome: {
      title: "I made it safely!",
      body: "I was a little scared at launch, but thanks to the suit you put on me I'm warm and secure! Earth from here is so big and beautiful. I'll clean up space diligently now. I'll pass over you regularly, so let's be sure to meet then!",
    },
  },

  debrisPanel: {
    collectedSuffix: "collected",
    cleanNote: "That's how much cleaner Earth's orbit is now 🌍",
    unknownName: "???",
    unknownDesc: "Not discovered yet.",
  },

  settle: {
    title: "We meet again!",
    awayLine: "While you were away for {time}, {name}",
    debris: "🗑️ collected {n} pieces of space debris",
    letters: "💌 {n} letters are waiting for you",
    cta: "So good to see you! 💗",
  },

  spacewalk: {
    ariaClose: "Close",
    hudGas: "🔥 Thruster gas",
    hudCollected: "Collected",
    hint: "Drag to fly · meet satellites to refuel · avoid the red debris ☄️",
    overTitle: "Spacewalk over!",
    overSubtitle: "You've run out of thruster gas",
    overDebris: "🗑️ {count} space debris · {kg}kg",
    overMood: "💖 Mood +{mood}",
    overCta: "Add to codex",
  },

  installToast: {
    installable: "Install it as an app to meet your pet right from the home screen!",
    iosGuide: "Safari Share button → “Add to Home Screen” to install it like an app.",
    genericGuide: "Use “Install” or “Add to Home Screen” in your browser menu to use it like an app.",
    install: "Install",
    ariaDismiss: "Dismiss install tip",
    later: "Later",
  },

  orbitView: { home: "Home" },

  notify: {
    approachTitle: "💫 {name} is passing overhead!",
    approachBody: "You can meet for the next 3 minutes. Pet and collect together!",
  },

  splash: { title: "Astropet" },

  time: { minutes: "{n}m", hoursMinutes: "{h}h {m}m", hours: "{h}h" },
};

export default en;

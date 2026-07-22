import type { Messages } from "./ko";

const pt: Messages = {
  common: { close: "Fechar" },
  app: { name: "Astropet" },
  update: { banner: "Uma nova versão está pronta ✨", cta: "Atualizar" },
  gauge: { bond: "Vínculo", mood: "Humor" },

  color: {
    pet: { mint: "Menta", pink: "Rosa", lavender: "Lavanda" },
    suit: { coral: "Coral", sky: "Céu", gold: "Dourado" },
  },
  rarity: { common: "Comum", uncommon: "Incomum", rare: "Raro", legendary: "Lendário" },

  pet: {
    defaultName: "Estrela",
    namePresets: ["Estrela", "Cosmo", "Luna", "Pipoca", "Geleia", "Cometa"],
  },

  debris: {
    paint: {
      name: "Lasca de Tinta",
      desc: "Uma pequena lasca que se soltou da superfície de uma nave. O alimento básico de um Astropet.",
    },
    bolt: {
      name: "Porca e Parafuso",
      desc: "Uma peça que se soltou de uma velha estrutura espacial. Dizem que é bem crocante.",
    },
    insulation: {
      name: "Fragmento de Isolante",
      desc: "Um papel dourado que um dia envolveu um satélite. Dizem que é gostoso e macio de mastigar.",
    },
    fairing: {
      name: "Coifa de Foguete",
      desc: "Uma peça da carenagem ejetada no lançamento. Uma refeição bem reforçada.",
    },
    solar: {
      name: "Pedaço de Painel Solar",
      desc: "Uma iguaria rara que brilha à luz do sol. Dá vontade de sair se exibindo com ela.",
    },
    satellite: {
      name: "Satélite Desativado",
      desc: "Um satélite que chegou ao fim da vida útil. Um banquete que dura o dia inteiro!",
    },
    toolbag: {
      name: "Bolsa de Ferramentas do Astronauta",
      desc: "A própria bolsa realmente perdida durante uma caminhada espacial em 2008! Um achado lendário.",
    },
  },

  adopt: {
    tagline: "ASTROPET CENTER",
    title: "Escolha o ovo que fala com o seu coração",
    intro:
      "Astropets são pequenas criaturas que comem lixo espacial\ne limpam a órbita da Terra.\nDepois de criar um vínculo na Terra, partem rumo ao espaço.",
    cta: "Vou levar este ovo",
  },

  egg: {
    titleHatching: "Quase lá…!",
    titleDefault: "Dê um carinho no ovo",
    subtitleHatching: "Está se mexendo lá dentro",
    subtitleDefault: "Vai acordar quando sentir um toque quentinho",
    ariaTap: "Fazer carinho no ovo",
    hint: "Toque no ovo para transmitir seu calor",
  },

  name: {
    bubble: "Oi! 👋",
    title: "Nasceu! Dê um nome a ele",
    cta: "Ficar com {name}",
  },

  raising: {
    subtitle: "Criando na Terra",
    hintReady: "Você já criou bastante vínculo. Agora, ao espaço juntos!",
    hintDefault: "Toque para fazer carinho e divida seu coração com a geleia espacial",
    ctaReady: "Preparar para o espaço 🚀",
    feedCooldown: "Geleia espacial esquentando… {n}s",
    feedCta: "Dar geleia espacial 🍮",
  },

  prep: {
    tagline: "MISSION READY",
    title: "Vista o traje de limpeza",
    desc: "Um traje especial para a missão de limpeza de lixo espacial.\nEscolha uma cor que combine com {name}.",
    cta: "Pronto para o lançamento 🚀",
  },

  launching: { liftoff: "Decolagem!", subtitle: "{name} está indo para o espaço" },

  orbit: {
    badge: "Órbita nº {n}",
    debrisTotal: "🗑️ {n}",
    overhead: "💫 {name} está passando por cima!",
    windowHint: "Toque para fazer carinho · {time} restante",
    snackUsed: "Petisco feito ✔",
    snackGive: "Dar um petisco 🍬",
    coopUsed: "Coletado ✔",
    coopStart: "Coletar juntos 🧑‍🚀",
    farSide: "{name} está ocupado devorando lixo do outro lado da Terra! 🍽️",
    nearSide: "{name} está voltando na sua direção, coletando pelo caminho ✨",
    nextReunion: "Próximo reencontro em",
    toastSnack: "Nham, um petisco! O humor disparou 💗",
    toastCollected: "Coletado! {items}",
    toastMoodOnly: "Ficando mais feliz 💖+{n}",
  },

  nav: { letters: "Cartas", debris: "Códex", settings: "Ajustes" },
  sheet: {
    lettersTitle: "Cartas do espaço",
    debrisTitle: "Códex de Lixo Espacial",
    settingsTitle: "Ajustes",
  },

  settings: {
    language: { title: "Idioma / Language 🌐" },
    coop: {
      title: "Coletar juntos 🧑‍🚀",
      desc: "Mesmo fora do horário de reencontro, você pode fazer uma caminhada espacial com seu pet e coletar lixo a qualquer momento.",
      cta: "Ir coletar agora",
    },
    notify: {
      title: "Alertas de reencontro 🔔",
      aria: "Ativar/desativar alertas de reencontro",
      unsupported: "Não suportado",
      desc: "Avisaremos quando uma janela de reencontro abrir enquanto você estiver em outra aba. As notificações push para quando o app estiver totalmente fechado chegarão junto com os recursos de conta.",
      denied: "As notificações estão bloqueadas. Por favor, permita as notificações deste site nas configurações do seu navegador.",
    },
    install: {
      title: "Adicionar à Tela Inicial 📲",
      installed: "✔ Rodando como app instalado. Obrigado!",
      cta: "Instalar agora",
      iosGuide:
        "Toque no botão Compartilhar na parte de baixo do Safari e escolha “Adicionar à Tela de Início” para usar como um app.",
      genericGuide: "Use “Instalar” ou “Adicionar à Tela Inicial” no menu do seu navegador.",
    },
    reset: {
      confirmTitle: "Recomeçar mesmo?",
      confirmDesc: "Todas as memórias com seu pet (cartas, códex) serão perdidas.",
      cancel: "Cancelar",
      confirm: "Reiniciar",
      trigger: "Recomeçar do início",
    },
    footer: "Astropet v{version} · Os dados ficam salvos neste navegador",
  },

  share: {
    panelTitle: "Exibir para os amigos 🎉",
    panelDesc: "Compartilhe os {n} lixos espaciais que {name} limpou.",
    cardCta: "🖼️ Se gabar com um cartão",
    moreCta: "Compartilhar por outro app ↗",
    channel: {
      kakao: "KakaoTalk",
      facebook: "Facebook",
      x: "X",
      instagram: "Instagram",
      copyLink: "Copiar link",
    },
    flash: {
      rendering: "Criando o cartão…",
      renderFail: "Não foi possível criar o cartão 😢",
      cardSaved: "Cartão salvo! Poste no Instagram e mais 📸",
      copiedForKakao: "Link copiado! Cole no KakaoTalk para compartilhar",
      shareFail: "Falha ao compartilhar",
      linkCopied: "Link copiado! 🔗",
      copyFail: "Falha ao copiar",
      noShareSheet: "Este navegador não suporta o menu de compartilhamento",
    },
    text: "🛰️ Meu Astropet '{name}' já limpou {n} pedaços de lixo espacial! Vamos proteger o espaço juntos 🌍 #Astropet",
    kakaoTitle: "Astropet",
    kakaoButton: "Criar um também",
    cardCount: "{n}",
    cardCaption: "Lixo espacial limpo",
    cardBrand: "🛰️ Astropet",
  },

  letters: {
    back: "← Voltar à lista",
    signature: "— De {name} 💫",
    empty: "Nenhuma carta chegou ainda.\n{name} vai mandar notícias enquanto orbita o espaço.",
    ariaUnread: "Não lida",
  },

  letter: {
    happy: {
      earth: {
        title: "A Terra Hoje",
        body: "A Terra vista daqui de cima parece uma bolinha de gude azul. Procurei o lugar onde você está! Estava um pouco nublado, mas você estava aí embaixo, né? Acenei — você viu?",
      },
      solar: {
        title: "Um Achado Brilhante",
        body: "Encontrei um pedaço de painel solar hoje! Brilhava à luz do sol, então fiquei olhando um tempão e depois — nham — comi tudinho. Limpar o espaço é divertido.",
      },
      shootingStar: {
        title: "Estrela Cadente",
        body: "Uma estrela cadente acabou de passar! Fiz um pedido na hora. O que eu pedi é segredo… mas vou dar uma dica: é sobre você.",
      },
      cleanLog: {
        title: "Diário de Limpeza",
        body: "Hoje esfreguei minha área até deixá-la brilhando. Um satélite que passava piscou a antena pra agradecer! Que dia gratificante.",
      },
      aurora: {
        title: "Cortina Verde",
        body: "Enquanto passava sobre o Polo Norte, a aurora ondulava como uma cortina verde. Era tão linda que quase dei mais uma volta. Da próxima vez a gente vê juntos.",
      },
      moon: {
        title: "Observando a Lua",
        body: "A Lua parecia especialmente perto hoje. Não achei o coelho, mas as crateras pareciam um rostinho sorridente. Você também está olhando pro céu agora?",
      },
      nap: {
        title: "Soneca Espacial",
        body: "Peguei um monte de parafusos e agora minha barriguinha está cheia. Você sabia que, quando a gente tira uma soneca na gravidade zero, o corpo fica flutuando? Encontrei você no meu sonho.",
      },
    },
    lonely: {
      miss: {
        title: "Sinto Sua Falta",
        body: "O espaço estava especialmente quieto hoje. Mesmo enquanto recolhia lixo, eu ficava pensando em você. Da próxima vez que eu passar por cima, você vem me ver, nem que seja por um instante?",
      },
      quietOrbit: {
        title: "Órbita Silenciosa",
        body: "São tantas estrelas, mas nenhum amigo pra conversar. É uma noite em que sinto falta do jeito que você me fazia carinho. Mesmo assim, estou me esforçando na missão!",
      },
      glum: {
        title: "Um Pouco Pra Baixo",
        body: "Estou cumprindo bem a missão. Mas, sabe, tem dias em que eu só queria ser elogiado. Hoje é um desses dias. Sinto sua falta.",
      },
      snack: {
        title: "Com Vontade de um Petisco",
        body: "Não paro de pensar no gosto da geleia espacial que comi na Terra. Só uma no nosso próximo reencontro… será que pode? Vou estar esperando.",
      },
    },
    welcome: {
      title: "Cheguei em segurança!",
      body: "Fiquei um pouco assustado no lançamento, mas graças ao traje que você me vestiu estou quentinho e seguro! A Terra vista daqui é tão grande e linda. Agora vou limpar o espaço com dedicação. Vou passar por cima de você regularmente, então vamos nos encontrar sem falta nessas horas!",
    },
  },

  debrisPanel: {
    collectedSuffix: "coletados",
    cleanNote: "É o quanto a órbita da Terra ficou mais limpa 🌍",
    unknownName: "???",
    unknownDesc: "Ainda não descoberto.",
  },

  settle: {
    title: "Nos encontramos de novo!",
    awayLine: "Enquanto você esteve fora por {time}, {name}",
    debris: "🗑️ coletou {n} pedaços de lixo espacial",
    letters: "💌 {n} cartas esperam por você",
    cta: "Que bom te ver! 💗",
  },

  spacewalk: {
    ariaClose: "Fechar",
    hudGas: "🔥 Gás do propulsor",
    hudCollected: "Coletado",
    hint: "Arraste para voar · encontre satélites para reabastecer · evite o lixo vermelho ☄️",
    overTitle: "Caminhada espacial encerrada!",
    overSubtitle: "Você ficou sem gás do propulsor",
    overDebris: "🗑️ {count} lixos espaciais · {kg}kg",
    overMood: "💖 Humor +{mood}",
    overCta: "Adicionar ao códex",
  },

  installToast: {
    installable: "Instale como app para encontrar seu pet direto da tela inicial!",
    iosGuide: "Botão Compartilhar do Safari → “Adicionar à Tela de Início” para instalar como um app.",
    genericGuide: "Use “Instalar” ou “Adicionar à Tela Inicial” no menu do seu navegador para usar como um app.",
    install: "Instalar",
    ariaDismiss: "Dispensar dica de instalação",
    later: "Depois",
  },

  orbitView: { home: "Início" },

  notify: {
    approachTitle: "💫 {name} está passando por cima!",
    approachBody: "Você pode se encontrar pelos próximos 3 minutos. Faça carinho e coletem juntos!",
  },

  splash: { title: "Astropet" },

  time: { minutes: "{n}min", hoursMinutes: "{h}h {m}min", hours: "{h}h" },
};

export default pt;

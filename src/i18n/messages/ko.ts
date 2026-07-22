// 한국어 — 메시지 구조의 원본(source of truth). Messages 타입 = typeof ko.
// 값은 모두 문자열({var} 치환), namePresets만 문자열 배열. 줄바꿈은 \n(whitespace-pre-line).

const ko = {
  common: { close: "닫기" },
  app: { name: "아스트로펫" },
  update: { banner: "새 버전이 준비됐어요 ✨", cta: "업데이트" },
  gauge: { bond: "유대감", mood: "기분" },

  color: {
    pet: { mint: "민트", pink: "핑크", lavender: "라벤더" },
    suit: { coral: "코랄", sky: "스카이", gold: "골드" },
  },
  rarity: { common: "흔함", uncommon: "보통", rare: "희귀", legendary: "전설" },

  pet: {
    defaultName: "별이",
    namePresets: ["별이", "코스모", "루나", "봄이", "젤리", "소라"],
  },

  debris: {
    paint: {
      name: "페인트 조각",
      desc: "우주선 표면에서 떨어져 나온 작은 조각. 아스트로펫의 주식이에요.",
    },
    bolt: {
      name: "나사와 볼트",
      desc: "오래된 우주 구조물에서 풀려 나온 부품. 바삭한 식감이래요.",
    },
    insulation: {
      name: "단열재 파편",
      desc: "위성을 감싸던 금빛 단열재. 쫀득하게 씹는 맛이 좋대요.",
    },
    fairing: {
      name: "로켓 페어링",
      desc: "발사 때 분리된 로켓 덮개. 꽤 든든한 한 끼예요.",
    },
    solar: {
      name: "태양전지판 조각",
      desc: "햇빛에 반짝이는 귀한 간식. 발견하면 자랑하고 싶어져요.",
    },
    satellite: {
      name: "폐위성",
      desc: "수명을 다한 인공위성. 하루 종일 배부른 진수성찬!",
    },
    toolbag: {
      name: "우주인의 공구가방",
      desc: "2008년 우주유영 중 실제로 놓친 그 가방! 전설의 발견이에요.",
    },
  },

  adopt: {
    tagline: "ASTROPET CENTER",
    title: "마음에 닿는 알을 골라주세요",
    intro:
      "아스트로펫은 우주쓰레기를 먹으며\n지구 궤도를 청소하는 작은 생명체예요.\n지구에서 유대감을 쌓은 뒤, 우주로 떠나게 됩니다.",
    cta: "이 알을 데려갈래요",
  },

  egg: {
    titleHatching: "곧 만나요…!",
    titleDefault: "알을 토닥토닥 해주세요",
    subtitleHatching: "안에서 꼬물꼬물 움직이고 있어요",
    subtitleDefault: "따뜻한 손길을 느끼면 깨어날 거예요",
    ariaTap: "알 토닥이기",
    hint: "알을 탭해서 온기를 전해주세요",
  },

  name: {
    bubble: "안녕! 👋",
    title: "태어났어요! 이름을 지어주세요",
    cta: "{name}(으)로 정할래요",
  },

  raising: {
    subtitle: "지구 육성 중",
    hintReady: "충분한 유대감이 쌓였어요. 이제 함께 우주로!",
    hintDefault: "탭해서 쓰다듬고, 우주젤리로 마음을 나눠보세요",
    ctaReady: "우주로 보낼 준비하기 🚀",
    feedCooldown: "우주젤리 준비 중… {n}초",
    feedCta: "우주젤리 주기 🍮",
  },

  prep: {
    tagline: "MISSION READY",
    title: "수거 슈트를 입혀주세요",
    desc: "우주쓰레기 수거 임무를 위한 특수 슈트예요.\n{name}에게 어울리는 색을 골라주세요.",
    cta: "발사 준비 완료 🚀",
  },

  launching: { liftoff: "발사!", subtitle: "{name}, 우주로 떠나요" },

  orbit: {
    badge: "{n}번째 궤도",
    debrisTotal: "🗑️ {n}개",
    overhead: "💫 {name}가 상공을 지나고 있어요!",
    windowHint: "탭해서 쓰다듬어 주세요 · {time} 남음",
    snackUsed: "간식 완료 ✔",
    snackGive: "간식 주기 🍬",
    coopUsed: "수거 완료 ✔",
    coopStart: "함께 수거하기 🧑‍🚀",
    farSide: "{name}가 지구 반대편에서 열심히 쓰레기를 먹고 있어요! 🍽️",
    nearSide: "{name}가 우리 집 쪽으로 다가오며 수거 중이에요 ✨",
    nextReunion: "다음 재회까지",
    toastSnack: "간식 냠냠! 기분이 확 좋아졌어요 💗",
    toastCollected: "수거 완료! {items}",
    toastMoodOnly: "기분이 좋아졌어요 💖+{n}",
  },

  nav: { letters: "편지함", debris: "도감", settings: "설정" },
  sheet: {
    lettersTitle: "우주에서 온 편지",
    debrisTitle: "우주쓰레기 도감",
    settingsTitle: "설정",
  },

  settings: {
    language: { title: "언어 / Language 🌐" },
    coop: {
      title: "함께 수거하기 🧑‍🚀",
      desc: "재회 시간이 아니어도 언제든 펫과 우주유영을 하며 우주쓰레기를 수거할 수 있어요.",
      cta: "지금 수거하러 가기",
    },
    notify: {
      title: "재회 알림 🔔",
      aria: "재회 알림 켜기/끄기",
      unsupported: "지원 안 됨",
      desc: "다른 탭을 보는 중에 재회 윈도우가 열리면 알려드려요. 앱을 완전히 닫았을 때 오는 푸시 알림은 계정 기능과 함께 업데이트될 예정이에요.",
      denied: "알림이 차단되어 있어요. 브라우저 설정에서 이 사이트의 알림을 허용해주세요.",
    },
    install: {
      title: "홈 화면에 설치 📲",
      installed: "✔ 설치된 앱으로 실행 중이에요. 고마워요!",
      cta: "지금 설치하기",
      iosGuide:
        "Safari 하단의 공유 버튼을 누른 뒤 “홈 화면에 추가”를 선택하면 앱처럼 쓸 수 있어요.",
      genericGuide: "브라우저 메뉴의 “설치” 또는 “홈 화면에 추가”로 설치할 수 있어요.",
    },
    reset: {
      confirmTitle: "정말 처음부터 시작할까요?",
      confirmDesc: "펫과 쌓은 추억(편지, 도감)이 모두 사라져요.",
      cancel: "취소",
      confirm: "초기화",
      trigger: "처음부터 다시 시작하기",
    },
    footer: "아스트로펫 v{version} · 데이터는 이 브라우저에 저장돼요",
  },

  share: {
    panelTitle: "친구에게 자랑하기 🎉",
    panelDesc: "{name}가 정화한 우주쓰레기 {n}개를 공유해요.",
    cardCta: "🖼️ 카드로 자랑하기",
    moreCta: "다른 앱으로 공유하기 ↗",
    channel: {
      kakao: "카카오톡",
      facebook: "페이스북",
      x: "X",
      instagram: "인스타그램",
      copyLink: "링크 복사",
    },
    flash: {
      rendering: "카드 만드는 중…",
      renderFail: "카드 생성에 실패했어요 😢",
      cardSaved: "카드를 저장했어요! 인스타그램 등에 올려보세요 📸",
      copiedForKakao: "링크를 복사했어요! 카카오톡에 붙여넣어 공유하세요",
      shareFail: "공유에 실패했어요",
      linkCopied: "링크를 복사했어요! 🔗",
      copyFail: "복사에 실패했어요",
      noShareSheet: "이 브라우저는 공유 시트를 지원하지 않아요",
    },
    text: "🛰️ 나의 아스트로펫 '{name}'가 우주쓰레기 {n}개를 정화했어요! 함께 우주를 지켜요 🌍 #아스트로펫",
    kakaoTitle: "아스트로펫",
    kakaoButton: "나도 키우기",
    cardCount: "{n}개",
    cardCaption: "우주쓰레기 정화 완료",
    cardBrand: "🛰️ 아스트로펫",
  },

  letters: {
    back: "← 목록으로",
    signature: "— {name} 올림 💫",
    empty: "아직 도착한 편지가 없어요.\n{name}가 우주를 돌며 소식을 보내올 거예요.",
    ariaUnread: "안 읽음",
  },

  letter: {
    happy: {
      earth: {
        title: "오늘의 지구",
        body: "위에서 보는 지구는 파란 구슬 같아. 네가 있는 곳도 찾아봤어! 구름이 조금 껴 있었지만, 분명 그 아래에 있었지? 손 흔들었는데 봤어?",
      },
      solar: {
        title: "반짝이는 발견",
        body: "오늘 태양전지판 조각을 발견했어! 햇빛을 받아 반짝반짝 빛나길래 한참 구경하다가 냠, 맛있게 먹었어. 우주 청소는 즐거워.",
      },
      shootingStar: {
        title: "별똥별",
        body: "방금 별똥별이 지나갔어! 얼른 소원을 빌었지. 뭘 빌었는지는 비밀인데… 힌트를 주자면, 너랑 관련이 있어.",
      },
      cleanLog: {
        title: "청소 일지",
        body: "오늘 맡은 구역을 반짝반짝하게 치웠어. 지나가던 위성이 고맙다고 안테나를 깜빡여줬다? 뿌듯한 하루야!",
      },
      aurora: {
        title: "초록 커튼",
        body: "북극 위를 지나는데 오로라가 초록 커튼처럼 펄럭였어. 너무 예뻐서 한 바퀴 더 돌 뻔했지 뭐야. 다음엔 꼭 같이 보자.",
      },
      moon: {
        title: "달 구경",
        body: "오늘은 달이 유난히 가까워 보였어. 토끼는 못 찾았지만, 크레이터가 꼭 웃는 얼굴 같더라. 너도 지금 하늘을 보고 있을까?",
      },
      nap: {
        title: "우주 낮잠",
        body: "볼트를 잔뜩 주웠더니 배가 빵빵해. 무중력에서 낮잠을 자면 몸이 둥둥 떠다니는 거 알아? 꿈에서 너를 만났어.",
      },
    },
    lonely: {
      miss: {
        title: "보고 싶어",
        body: "오늘은 우주가 유난히 조용했어. 쓰레기를 주우면서도 자꾸 네 생각이 났어. 다음에 상공을 지날 때, 잠깐이라도 만나러 와줄래?",
      },
      quietOrbit: {
        title: "조용한 궤도",
        body: "별들은 많은데 말을 걸어주는 친구는 없네. 네가 쓰다듬어주던 손길이 그리운 밤이야. 그래도 임무는 열심히 하고 있어!",
      },
      glum: {
        title: "살짝 시무룩",
        body: "임무는 잘하고 있어. 근데 있잖아, 가끔은 칭찬받고 싶은 날이 있어. 오늘이 그런 날이야. 보고 싶다.",
      },
      snack: {
        title: "간식 생각",
        body: "지구에서 먹던 우주젤리 맛이 자꾸 생각나. 다음 재회 때 하나만… 안 될까? 기다리고 있을게.",
      },
    },
    welcome: {
      title: "무사히 도착했어!",
      body: "발사할 때 조금 무서웠는데, 네가 입혀준 슈트 덕분에 하나도 안 춥고 든든해! 여기서 보는 지구는 정말 커다랗고 예뻐. 이제 열심히 우주를 청소할게. 주기적으로 네 위를 지나갈 테니까, 그때 꼭 만나자!",
    },
  },

  debrisPanel: {
    collectedSuffix: "개 수거",
    cleanNote: "그만큼 지구 궤도가 깨끗해졌어요 🌍",
    unknownName: "???",
    unknownDesc: "아직 발견하지 못했어요.",
  },

  settle: {
    title: "다시 만났어요!",
    awayLine: "{time} 동안 {name}는",
    debris: "🗑️ 우주쓰레기 {n}개를 수거했어요",
    letters: "💌 편지 {n}통이 도착해 있어요",
    cta: "반가워! 💗",
  },

  spacewalk: {
    ariaClose: "닫기",
    hudGas: "🔥 분사 가스",
    hudCollected: "수거",
    hint: "화면을 끌어 유영 · 위성과 만나면 가스 충전 · 붉은 파편은 피해요 ☄️",
    overTitle: "유영 종료!",
    overSubtitle: "분사 가스를 다 썼어요",
    overDebris: "🗑️ 우주쓰레기 {count}개 · {kg}kg",
    overMood: "💖 기분 +{mood}",
    overCta: "도감에 담기",
  },

  installToast: {
    installable: "앱으로 설치하면 홈 화면에서 바로 펫을 만날 수 있어요!",
    iosGuide: "Safari 공유 버튼 → “홈 화면에 추가”로 앱처럼 설치할 수 있어요.",
    genericGuide: "브라우저 메뉴의 “설치” 또는 “홈 화면에 추가”로 앱처럼 쓸 수 있어요.",
    install: "설치",
    ariaDismiss: "설치 안내 닫기",
    later: "나중에",
  },

  orbitView: { home: "우리 집" },

  notify: {
    approachTitle: "💫 {name}가 상공을 지나가요!",
    approachBody: "지금부터 3분 동안 만날 수 있어요. 쓰다듬고 함께 수거해요!",
  },

  splash: { title: "아스트로펫" },

  time: { minutes: "{n}분", hoursMinutes: "{h}시간 {m}분", hours: "{h}시간" },
};

export default ko;
export type Messages = typeof ko;

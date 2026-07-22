import type { Messages } from "./ko";

const ja: Messages = {
  common: { close: "閉じる" },
  app: { name: "アストロペット" },
  update: { banner: "新しいバージョンが準備できました ✨", cta: "アップデート" },
  gauge: { bond: "絆", mood: "気分" },

  color: {
    pet: { mint: "ミント", pink: "ピンク", lavender: "ラベンダー" },
    suit: { coral: "コーラル", sky: "スカイ", gold: "ゴールド" },
  },
  rarity: { common: "コモン", uncommon: "アンコモン", rare: "レア", legendary: "レジェンダリー" },

  pet: {
    defaultName: "アストロ",
    namePresets: ["アストロ", "コスモ", "ルナ", "ポム", "ゼリー", "ソラ"],
  },

  debris: {
    paint: {
      name: "ペイントのかけら",
      desc: "宇宙船の表面からはがれ落ちた小さなかけら。アストロペットの主食です。",
    },
    bolt: {
      name: "ねじとボルト",
      desc: "古い宇宙構造物からゆるんで外れた部品。サクサクした食感だそうです。",
    },
    insulation: {
      name: "断熱材の破片",
      desc: "衛星を包んでいた金色の断熱材。もちもちした噛みごたえがいいそうです。",
    },
    fairing: {
      name: "ロケットフェアリング",
      desc: "打ち上げのときに切り離されたロケットの覆い。かなり食べごたえのある一食です。",
    },
    solar: {
      name: "太陽電池パネルのかけら",
      desc: "日ざしにきらめく貴重なおやつ。見つけると自慢したくなります。",
    },
    satellite: {
      name: "廃衛星",
      desc: "寿命を終えた人工衛星。一日じゅうお腹いっぱいのごちそう！",
    },
    toolbag: {
      name: "宇宙飛行士の工具バッグ",
      desc: "2008年の宇宙遊泳中に実際に手放したあのバッグ！伝説の発見です。",
    },
  },

  adopt: {
    tagline: "ASTROPET CENTER",
    title: "心に響く卵を選んでください",
    intro:
      "アストロペットは宇宙ゴミを食べて\n地球の軌道を掃除する小さな生きものです。\n地球で絆を育んだあと、宇宙へと旅立ちます。",
    cta: "この卵を連れて行きます",
  },

  egg: {
    titleHatching: "もうすぐ会えるよ…！",
    titleDefault: "卵をやさしくトントンしてあげて",
    subtitleHatching: "中でもぞもぞ動いています",
    subtitleDefault: "あたたかい手のぬくもりを感じると目を覚まします",
    ariaTap: "卵をトントンする",
    hint: "卵をタップしてぬくもりを伝えてあげて",
  },

  name: {
    bubble: "こんにちは！ 👋",
    title: "生まれたよ！名前をつけてあげて",
    cta: "{name}にする",
  },

  raising: {
    subtitle: "地球で育て中",
    hintReady: "たっぷり絆が育ちました。さあ、いっしょに宇宙へ！",
    hintDefault: "タップしてなでて、宇宙ゼリーで心を通わせよう",
    ctaReady: "宇宙へ送り出す準備をする 🚀",
    feedCooldown: "宇宙ゼリー準備中… {n}秒",
    feedCta: "宇宙ゼリーをあげる 🍮",
  },

  prep: {
    tagline: "MISSION READY",
    title: "回収スーツを着せてあげて",
    desc: "宇宙ゴミ回収ミッションのための特別なスーツです。\n{name}に似合う色を選んでください。",
    cta: "打ち上げ準備完了 🚀",
  },

  launching: { liftoff: "発射！", subtitle: "{name}、宇宙へ出発" },

  orbit: {
    badge: "{n}周目の軌道",
    debrisTotal: "🗑️ {n}個",
    overhead: "💫 {name}が上空を通過しています！",
    windowHint: "タップしてなでてあげて · 残り{time}",
    snackUsed: "おやつ完了 ✔",
    snackGive: "おやつをあげる 🍬",
    coopUsed: "回収完了 ✔",
    coopStart: "いっしょに回収する 🧑‍🚀",
    farSide: "{name}が地球の裏側で一生けんめいゴミを食べています！ 🍽️",
    nearSide: "{name}がおうちのほうへ近づきながら回収中です ✨",
    nextReunion: "次の再会まで",
    toastSnack: "おやつをもぐもぐ！気分がぐんと良くなりました 💗",
    toastCollected: "回収完了！ {items}",
    toastMoodOnly: "気分が良くなりました 💖+{n}",
  },

  nav: { letters: "手紙", debris: "図鑑", settings: "設定" },
  sheet: {
    lettersTitle: "宇宙からの手紙",
    debrisTitle: "宇宙ゴミ図鑑",
    settingsTitle: "設定",
  },

  settings: {
    language: { title: "言語 / Language 🌐" },
    coop: {
      title: "いっしょに回収する 🧑‍🚀",
      desc: "再会の時間でなくても、いつでもペットと宇宙遊泳をしながら宇宙ゴミを回収できます。",
      cta: "今すぐ回収しに行く",
    },
    notify: {
      title: "再会のお知らせ 🔔",
      aria: "再会のお知らせのオン/オフ",
      unsupported: "未対応",
      desc: "他のタブを見ているあいだに再会ウィンドウが開いたらお知らせします。アプリを完全に閉じているときに届くプッシュ通知は、アカウント機能とともにアップデート予定です。",
      denied: "通知がブロックされています。ブラウザの設定でこのサイトの通知を許可してください。",
    },
    install: {
      title: "ホーム画面に追加 📲",
      installed: "✔ インストール済みのアプリとして実行中です。ありがとう！",
      cta: "今すぐインストール",
      iosGuide:
        "Safari下部の共有ボタンを押して「ホーム画面に追加」を選ぶと、アプリのように使えます。",
      genericGuide: "ブラウザメニューの「インストール」または「ホーム画面に追加」からインストールできます。",
    },
    reset: {
      confirmTitle: "本当に最初からやり直しますか？",
      confirmDesc: "ペットと積み重ねた思い出（手紙、図鑑）がすべて消えてしまいます。",
      cancel: "キャンセル",
      confirm: "リセット",
      trigger: "最初からやり直す",
    },
    footer: "アストロペット v{version} · データはこのブラウザに保存されます",
  },

  share: {
    panelTitle: "友だちに自慢する 🎉",
    panelDesc: "{name}が浄化した宇宙ゴミ{n}個をシェアします。",
    cardCta: "🖼️ カードで自慢する",
    moreCta: "他のアプリでシェアする ↗",
    channel: {
      kakao: "カカオトーク",
      facebook: "フェイスブック",
      x: "X",
      instagram: "インスタグラム",
      copyLink: "リンクをコピー",
    },
    flash: {
      rendering: "カードを作成中…",
      renderFail: "カードの作成に失敗しました 😢",
      cardSaved: "カードを保存しました！インスタグラムなどに投稿してみてください 📸",
      copiedForKakao: "リンクをコピーしました！カカオトークに貼りつけてシェアしてください",
      shareFail: "シェアに失敗しました",
      linkCopied: "リンクをコピーしました！ 🔗",
      copyFail: "コピーに失敗しました",
      noShareSheet: "このブラウザは共有シートに対応していません",
    },
    text: "🛰️ わたしのアストロペット「{name}」が宇宙ゴミを{n}個も浄化しました！いっしょに宇宙を守ろう 🌍 #Astropet",
    kakaoTitle: "アストロペット",
    kakaoButton: "わたしも育てる",
    cardCount: "{n}個",
    cardCaption: "宇宙ゴミ浄化完了",
    cardBrand: "🛰️ アストロペット",
  },

  letters: {
    back: "← 一覧にもどる",
    signature: "— {name}より 💫",
    empty: "まだ届いた手紙はありません。\n{name}が宇宙をめぐりながら便りを送ってくれます。",
    ariaUnread: "未読",
  },

  letter: {
    happy: {
      earth: {
        title: "今日の地球",
        body: "上から見る地球は青いビー玉みたい。きみのいる場所も探してみたよ！ちょっと雲がかかってたけど、きっとあの下にいたよね？手を振ったんだけど見えたかな？",
      },
      solar: {
        title: "きらめく発見",
        body: "今日、太陽電池パネルのかけらを見つけたよ！日ざしを受けてキラキラ光ってたから、しばらく見とれてから、もぐっとおいしく食べちゃった。宇宙のお掃除は楽しいな。",
      },
      shootingStar: {
        title: "流れ星",
        body: "さっき流れ星が通ったよ！すぐにお願いごとをしたんだ。何を願ったかはヒミツだけど…ヒントを言うと、きみに関することだよ。",
      },
      cleanLog: {
        title: "お掃除日記",
        body: "今日は担当の区域をピカピカにお掃除したよ。通りかかった衛星がありがとうってアンテナを点滅させてくれたんだ！やりがいのある一日だったよ！",
      },
      aurora: {
        title: "みどりのカーテン",
        body: "北極の上を通ったら、オーロラがみどりのカーテンみたいにゆれてたんだ。あんまりきれいで、もう一周まわりそうになっちゃった。次はぜったいいっしょに見ようね。",
      },
      moon: {
        title: "お月見",
        body: "今日は月がやけに近くに見えたよ。うさぎは見つけられなかったけど、クレーターがまるで笑った顔みたいだったんだ。きみも今、空を見てるのかな？",
      },
      nap: {
        title: "宇宙のお昼寝",
        body: "ボルトをたくさん拾ったらお腹がぱんぱんだよ。無重力でお昼寝すると、体がふわふわ浮かぶって知ってた？夢のなかできみに会ったよ。",
      },
    },
    lonely: {
      miss: {
        title: "会いたいな",
        body: "今日は宇宙がやけに静かだったよ。ゴミを拾いながらも、ついきみのことばかり考えちゃった。次に上空を通るとき、少しでも会いに来てくれる？",
      },
      quietOrbit: {
        title: "静かな軌道",
        body: "星はたくさんあるのに、話しかけてくれる友だちはいないんだ。きみがなでてくれた手のぬくもりが恋しい夜だよ。それでもミッションはがんばってるからね！",
      },
      glum: {
        title: "ちょっぴりしょんぼり",
        body: "ミッションはちゃんとやってるよ。でもね、たまにはほめられたい日があるんだ。今日はそんな日。会いたいな。",
      },
      snack: {
        title: "おやつが恋しい",
        body: "地球で食べた宇宙ゼリーの味が、つい恋しくなっちゃう。次の再会のとき、ひとつだけ…だめかな？待ってるね。",
      },
    },
    welcome: {
      title: "無事に到着したよ！",
      body: "発射のときはちょっぴりこわかったけど、きみが着せてくれたスーツのおかげで、ぜんぜん寒くないし心強いよ！ここから見る地球は、ほんとうに大きくてきれい。これから一生けんめい宇宙をお掃除するね。定期的にきみの上を通るから、そのときはぜったい会おうね！",
    },
  },

  debrisPanel: {
    collectedSuffix: "個 回収",
    cleanNote: "その分、地球の軌道がきれいになりました 🌍",
    unknownName: "???",
    unknownDesc: "まだ発見していません。",
  },

  settle: {
    title: "また会えたね！",
    awayLine: "{time}のあいだに、{name}は",
    debris: "🗑️ 宇宙ゴミを{n}個回収しました",
    letters: "💌 手紙が{n}通届いています",
    cta: "会えてうれしい！ 💗",
  },

  spacewalk: {
    ariaClose: "閉じる",
    hudGas: "🔥 噴射ガス",
    hudCollected: "回収",
    hint: "画面をドラッグして遊泳 · 衛星に出会うとガス補給 · 赤い破片は避けてね ☄️",
    overTitle: "遊泳終了！",
    overSubtitle: "噴射ガスを使いきりました",
    overDebris: "🗑️ 宇宙ゴミ{count}個 · {kg}kg",
    overMood: "💖 気分 +{mood}",
    overCta: "図鑑に入れる",
  },

  installToast: {
    installable: "アプリとしてインストールすれば、ホーム画面からすぐにペットに会えます！",
    iosGuide: "Safariの共有ボタン →「ホーム画面に追加」でアプリのようにインストールできます。",
    genericGuide: "ブラウザメニューの「インストール」または「ホーム画面に追加」でアプリのように使えます。",
    install: "インストール",
    ariaDismiss: "インストール案内を閉じる",
    later: "あとで",
  },

  orbitView: { home: "おうち" },

  notify: {
    approachTitle: "💫 {name}が上空を通過します！",
    approachBody: "今から3分間、会うことができます。なでていっしょに回収しよう！",
  },

  splash: { title: "アストロペット" },

  time: { minutes: "{n}分", hoursMinutes: "{h}時間{m}分", hours: "{h}時間" },
};

export default ja;

import type { Messages } from "./ko";

const zh: Messages = {
  common: { close: "关闭" },
  app: { name: "星宠" },
  update: { banner: "新版本准备好啦 ✨", cta: "更新" },
  gauge: { bond: "羁绊", mood: "心情" },

  color: {
    pet: { mint: "薄荷", pink: "粉红", lavender: "薰衣草" },
    suit: { coral: "珊瑚", sky: "天空蓝", gold: "金色" },
  },
  rarity: { common: "普通", uncommon: "罕见", rare: "稀有", legendary: "传说" },

  pet: {
    defaultName: "星星",
    namePresets: ["星星", "宇宇", "露娜", "波波", "果冻", "小天"],
  },

  debris: {
    paint: {
      name: "油漆碎片",
      desc: "从航天器表面剥落的小碎片。是星宠的主食哦。",
    },
    bolt: {
      name: "螺母与螺栓",
      desc: "从老旧太空结构上松脱的零件。据说嚼起来脆脆的。",
    },
    insulation: {
      name: "隔热层碎片",
      desc: "曾经包裹卫星的金色隔热膜。据说嚼起来又韧又满足。",
    },
    fairing: {
      name: "火箭整流罩",
      desc: "发射时分离的外壳碎片。是相当扎实的一餐。",
    },
    solar: {
      name: "太阳能板碎片",
      desc: "在阳光下闪闪发光的珍稀零食。发现后会忍不住想炫耀。",
    },
    satellite: {
      name: "报废卫星",
      desc: "寿命已尽的人造卫星。是能吃上一整天的丰盛大餐！",
    },
    toolbag: {
      name: "宇航员的工具包",
      desc: "2008 年太空行走时真的弄丢的那个包！传说级的发现。",
    },
  },

  adopt: {
    tagline: "ASTROPET CENTER",
    title: "选一颗打动你心的蛋吧",
    intro:
      "星宠是以太空垃圾为食、\n清扫地球轨道的小小生命。\n在地球上建立羁绊后，便会启程前往太空。",
    cta: "我要带走这颗蛋",
  },

  egg: {
    titleHatching: "马上就要见面啦…！",
    titleDefault: "轻轻拍一拍蛋吧",
    subtitleHatching: "它正在里面扭来扭去",
    subtitleDefault: "感受到温暖的触碰就会醒来哦",
    ariaTap: "拍一拍蛋",
    hint: "点一点蛋，把温暖传递过去吧",
  },

  name: {
    bubble: "嗨！ 👋",
    title: "它出生啦！给它取个名字吧",
    cta: "就叫{name}",
  },

  raising: {
    subtitle: "地球养育中",
    hintReady: "已经积累了足够的羁绊。现在，一起前往太空吧！",
    hintDefault: "点一点抚摸它，用太空果冻分享你的心意吧",
    ctaReady: "准备送它去太空 🚀",
    feedCooldown: "太空果冻准备中… {n}秒",
    feedCta: "喂太空果冻 🍮",
  },

  prep: {
    tagline: "MISSION READY",
    title: "为它穿上回收战衣吧",
    desc: "这是执行太空垃圾回收任务的特制战衣。\n为{name}挑选合适的颜色吧。",
    cta: "发射准备完毕 🚀",
  },

  launching: { liftoff: "发射！", subtitle: "{name}正启程前往太空" },

  orbit: {
    badge: "第 {n} 圈轨道",
    debrisTotal: "🗑️ {n}个",
    overhead: "💫 {name}正从上空经过！",
    windowHint: "点一点抚摸它 · 剩余 {time}",
    snackUsed: "零食完成 ✔",
    snackGive: "喂零食 🍬",
    coopUsed: "回收完成 ✔",
    coopStart: "一起回收 🧑‍🚀",
    farSide: "{name}正在地球另一侧努力吃垃圾呢！ 🍽️",
    nearSide: "{name}正一边回收一边朝我们家方向靠近 ✨",
    nextReunion: "距离下次重逢",
    toastSnack: "零食吃得香喷喷！心情一下子变好了 💗",
    toastCollected: "回收完成！{items}",
    toastMoodOnly: "心情变好了 💖+{n}",
  },

  nav: { letters: "信箱", debris: "图鉴", settings: "设置" },
  sheet: {
    lettersTitle: "来自太空的信",
    debrisTitle: "太空垃圾图鉴",
    settingsTitle: "设置",
  },

  settings: {
    language: { title: "语言 / Language 🌐" },
    coop: {
      title: "一起回收 🧑‍🚀",
      desc: "即使不在重逢时间，也能随时和宠物一起太空漫步、回收太空垃圾。",
      cta: "现在就去回收",
    },
    notify: {
      title: "重逢提醒 🔔",
      aria: "开启/关闭重逢提醒",
      unsupported: "不支持",
      desc: "当你在浏览其他标签页时，如果重逢窗口开启，我们会通知你。应用完全关闭时的推送通知将随账号功能一起更新。",
      denied: "通知已被屏蔽。请在浏览器设置中允许本站点的通知。",
    },
    install: {
      title: "添加到主屏幕 📲",
      installed: "✔ 正以已安装的应用运行中。谢谢你！",
      cta: "立即安装",
      iosGuide:
        "点按 Safari 底部的分享按钮，然后选择“添加到主屏幕”，就能像应用一样使用啦。",
      genericGuide: "使用浏览器菜单中的“安装”或“添加到主屏幕”即可安装。",
    },
    reset: {
      confirmTitle: "真的要从头开始吗？",
      confirmDesc: "和宠物一起积累的回忆（信件、图鉴）都会消失。",
      cancel: "取消",
      confirm: "重置",
      trigger: "从头重新开始",
    },
    footer: "星宠 v{version} · 数据保存在此浏览器中",
  },

  share: {
    panelTitle: "向朋友炫耀 🎉",
    panelDesc: "分享{name}净化的 {n} 个太空垃圾。",
    cardCta: "🖼️ 用卡片炫耀",
    moreCta: "用其他应用分享 ↗",
    channel: {
      kakao: "KakaoTalk",
      facebook: "Facebook",
      x: "X",
      instagram: "Instagram",
      copyLink: "复制链接",
    },
    flash: {
      rendering: "卡片制作中…",
      renderFail: "卡片生成失败了 😢",
      cardSaved: "卡片已保存！快发到 Instagram 等平台吧 📸",
      copiedForKakao: "链接已复制！粘贴到 KakaoTalk 即可分享",
      shareFail: "分享失败了",
      linkCopied: "链接已复制！ 🔗",
      copyFail: "复制失败了",
      noShareSheet: "此浏览器不支持分享面板",
    },
    text: "🛰️ 我的星宠「{name}」已经净化了 {n} 个太空垃圾！一起守护太空吧 🌍 #Astropet",
    kakaoTitle: "星宠",
    kakaoButton: "我也要养一只",
    cardCount: "{n}个",
    cardCaption: "太空垃圾净化完成",
    cardBrand: "🛰️ 星宠",
  },

  letters: {
    back: "← 返回列表",
    signature: "— {name}敬上 💫",
    empty: "还没有收到任何信件。\n{name}会在环绕太空时寄来消息的。",
    ariaUnread: "未读",
  },

  letter: {
    happy: {
      earth: {
        title: "今天的地球",
        body: "从上面看到的地球像一颗蓝色的弹珠。我还找了找你在的地方！虽然有点云，但你一定就在那下面吧？我挥手了，你看到了吗？",
      },
      solar: {
        title: "闪亮的发现",
        body: "今天我发现了一块太阳能板碎片！它在阳光下闪闪发亮，我看了好一会儿，然后——啊呜——美美地吃掉了。清扫太空真开心。",
      },
      shootingStar: {
        title: "流星",
        body: "刚刚有颗流星飞过！我赶紧许了个愿。许了什么是秘密…不过给你个提示：和你有关哦。",
      },
      cleanLog: {
        title: "清扫日志",
        body: "今天把负责的区域打扫得亮晶晶。路过的一颗卫星还闪了闪天线跟我道谢呢！真是充实的一天。",
      },
      aurora: {
        title: "绿色帷幕",
        body: "经过北极上空时，极光像绿色的帷幕一样飘动。太美了，我差点又多绕了一圈。下次一定要一起看。",
      },
      moon: {
        title: "赏月",
        body: "今天月亮看起来格外近。虽然没找到兔子，但环形山看起来就像一张笑脸。你现在也在看天空吗？",
      },
      nap: {
        title: "太空午睡",
        body: "捡了好多螺栓，肚子撑得鼓鼓的。你知道吗，在无重力里午睡时身体会飘来飘去哦？我在梦里见到你了。",
      },
    },
    lonely: {
      miss: {
        title: "好想你",
        body: "今天的太空格外安静。一边捡垃圾，一边总是想起你。下次经过上空时，哪怕只有一会儿，也来见见我好吗？",
      },
      quietOrbit: {
        title: "安静的轨道",
        body: "星星那么多，却没有一个能说话的朋友。今晚好想念你抚摸我的那只手。不过任务我还是很努力地在完成哦！",
      },
      glum: {
        title: "有点小失落",
        body: "任务我完成得很好。可是你知道吗，有时候就是想被夸一夸。今天就是这样的一天。好想你。",
      },
      snack: {
        title: "想吃零食",
        body: "总是想起在地球上吃的太空果冻的味道。下次重逢时来一个…不行吗？我会等着的。",
      },
    },
    welcome: {
      title: "平安抵达啦！",
      body: "发射的时候有点害怕，多亏了你给我穿上的战衣，一点都不冷，还很安心！从这里看到的地球又大又美。接下来我会努力清扫太空的。我会定期经过你的上空，到时候一定要见面哦！",
    },
  },

  debrisPanel: {
    collectedSuffix: "个已回收",
    cleanNote: "地球轨道也因此变得更干净了 🌍",
    unknownName: "???",
    unknownDesc: "还没有发现。",
  },

  settle: {
    title: "又见面啦！",
    awayLine: "在你离开的 {time} 里，{name}",
    debris: "🗑️ 回收了 {n} 个太空垃圾",
    letters: "💌 有 {n} 封信在等着你",
    cta: "见到你真开心！ 💗",
  },

  spacewalk: {
    ariaClose: "关闭",
    hudGas: "🔥 喷射气体",
    hudCollected: "回收",
    hint: "拖动画面进行漫步 · 遇到卫星补充气体 · 躲开红色碎片 ☄️",
    overTitle: "漫步结束！",
    overSubtitle: "喷射气体用完了",
    overDebris: "🗑️ 太空垃圾 {count} 个 · {kg}kg",
    overMood: "💖 心情 +{mood}",
    overCta: "收入图鉴",
  },

  installToast: {
    installable: "安装成应用后，就能直接从主屏幕见到你的宠物啦！",
    iosGuide: "Safari 分享按钮 →“添加到主屏幕”即可像应用一样安装。",
    genericGuide: "使用浏览器菜单中的“安装”或“添加到主屏幕”，就能像应用一样使用。",
    install: "安装",
    ariaDismiss: "关闭安装提示",
    later: "以后再说",
  },

  orbitView: { home: "我们家" },

  notify: {
    approachTitle: "💫 {name}正从上空经过！",
    approachBody: "从现在起 3 分钟内可以见面。快抚摸它、一起回收吧！",
  },

  splash: { title: "星宠" },

  time: { minutes: "{n}分钟", hoursMinutes: "{h}小时{m}分钟", hours: "{h}小时" },
};

export default zh;

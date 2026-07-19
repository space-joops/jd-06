import type { Letter } from "./types";

interface LetterTemplate {
  title: string;
  body: string;
  icon: string;
}

/** 기분 50 이상일 때 오는 밝은 톤의 편지 */
const HAPPY_TEMPLATES: LetterTemplate[] = [
  {
    icon: "🌍",
    title: "오늘의 지구",
    body: "위에서 보는 지구는 파란 구슬 같아. 네가 있는 곳도 찾아봤어! 구름이 조금 껴 있었지만, 분명 그 아래에 있었지? 손 흔들었는데 봤어?",
  },
  {
    icon: "☀️",
    title: "반짝이는 발견",
    body: "오늘 태양전지판 조각을 발견했어! 햇빛을 받아 반짝반짝 빛나길래 한참 구경하다가 냠, 맛있게 먹었어. 우주 청소는 즐거워.",
  },
  {
    icon: "🌠",
    title: "별똥별",
    body: "방금 별똥별이 지나갔어! 얼른 소원을 빌었지. 뭘 빌었는지는 비밀인데… 힌트를 주자면, 너랑 관련이 있어.",
  },
  {
    icon: "🛰️",
    title: "청소 일지",
    body: "오늘 맡은 구역을 반짝반짝하게 치웠어. 지나가던 위성이 고맙다고 안테나를 깜빡여줬다? 뿌듯한 하루야!",
  },
  {
    icon: "💚",
    title: "초록 커튼",
    body: "북극 위를 지나는데 오로라가 초록 커튼처럼 펄럭였어. 너무 예뻐서 한 바퀴 더 돌 뻔했지 뭐야. 다음엔 꼭 같이 보자.",
  },
  {
    icon: "🌙",
    title: "달 구경",
    body: "오늘은 달이 유난히 가까워 보였어. 토끼는 못 찾았지만, 크레이터가 꼭 웃는 얼굴 같더라. 너도 지금 하늘을 보고 있을까?",
  },
  {
    icon: "🫧",
    title: "우주 낮잠",
    body: "볼트를 잔뜩 주웠더니 배가 빵빵해. 무중력에서 낮잠을 자면 몸이 둥둥 떠다니는 거 알아? 꿈에서 너를 만났어.",
  },
];

/** 기분 50 미만일 때 오는 그리운 톤의 편지 */
const LONELY_TEMPLATES: LetterTemplate[] = [
  {
    icon: "💌",
    title: "보고 싶어",
    body: "오늘은 우주가 유난히 조용했어. 쓰레기를 주우면서도 자꾸 네 생각이 났어. 다음에 상공을 지날 때, 잠깐이라도 만나러 와줄래?",
  },
  {
    icon: "🌌",
    title: "조용한 궤도",
    body: "별들은 많은데 말을 걸어주는 친구는 없네. 네가 쓰다듬어주던 손길이 그리운 밤이야. 그래도 임무는 열심히 하고 있어!",
  },
  {
    icon: "🥺",
    title: "살짝 시무룩",
    body: "임무는 잘하고 있어. 근데 있잖아, 가끔은 칭찬받고 싶은 날이 있어. 오늘이 그런 날이야. 보고 싶다.",
  },
  {
    icon: "🍮",
    title: "간식 생각",
    body: "지구에서 먹던 우주젤리 맛이 자꾸 생각나. 다음 재회 때 하나만… 안 될까? 기다리고 있을게.",
  },
];

export function makeWelcomeLetter(at: number): Letter {
  return {
    id: `L-welcome-${at}`,
    at,
    icon: "🚀",
    title: "무사히 도착했어!",
    body: "발사할 때 조금 무서웠는데, 네가 입혀준 슈트 덕분에 하나도 안 춥고 든든해! 여기서 보는 지구는 정말 커다랗고 예뻐. 이제 열심히 우주를 청소할게. 15분마다 네 위를 지나갈 테니까, 그때 꼭 만나자!",
    read: false,
  };
}

export function makeLetter(mood: number, at: number, seq: number): Letter {
  const pool = mood >= 50 ? HAPPY_TEMPLATES : LONELY_TEMPLATES;
  const t = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: `L-${at}-${seq}-${Math.random().toString(36).slice(2, 8)}`,
    at,
    icon: t.icon,
    title: t.title,
    body: t.body,
    read: false,
  };
}

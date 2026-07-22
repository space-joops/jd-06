import type { Letter } from "./types";

// 편지 템플릿 = i18n 키 + 아이콘. 본문/제목 텍스트는 i18n 카탈로그(letter.*)에 있고,
// 렌더 시점(LettersPanel)에서 현재 언어로 번역된다.

/** 기분 50 이상일 때 오는 밝은 톤의 편지 */
const HAPPY: { key: string; icon: string }[] = [
  { key: "letter.happy.earth", icon: "🌍" },
  { key: "letter.happy.solar", icon: "☀️" },
  { key: "letter.happy.shootingStar", icon: "🌠" },
  { key: "letter.happy.cleanLog", icon: "🛰️" },
  { key: "letter.happy.aurora", icon: "💚" },
  { key: "letter.happy.moon", icon: "🌙" },
  { key: "letter.happy.nap", icon: "🫧" },
];

/** 기분 50 미만일 때 오는 그리운 톤의 편지 */
const LONELY: { key: string; icon: string }[] = [
  { key: "letter.lonely.miss", icon: "💌" },
  { key: "letter.lonely.quietOrbit", icon: "🌌" },
  { key: "letter.lonely.glum", icon: "🥺" },
  { key: "letter.lonely.snack", icon: "🍮" },
];

export function makeWelcomeLetter(at: number): Letter {
  return {
    id: `L-welcome-${at}`,
    at,
    icon: "🚀",
    tkey: "letter.welcome",
    read: false,
  };
}

export function makeLetter(mood: number, at: number, seq: number): Letter {
  const pool = mood >= 50 ? HAPPY : LONELY;
  const t = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: `L-${at}-${seq}-${Math.random().toString(36).slice(2, 8)}`,
    at,
    icon: t.icon,
    tkey: t.key,
    read: false,
  };
}

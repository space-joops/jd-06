import type { DebrisDef, PetColor, Rarity, SuitColor } from "./types";

// ── 시간 설계 (압축 시간) ────────────────────────────────────────────
/** 궤도 한 바퀴 = 3분 */
export const ORBIT_MS = 3 * 60_000;
/** 재회 윈도우 = 우리 집 상공(phase 0) 기준 좌우 45° */
export const REUNION_HALF_DEG = 45;
/** phase 단위 반각 (45/360 = 0.125). |상공 기준 거리| ≤ 이 값이면 윈도우 */
export const REUNION_HALF = REUNION_HALF_DEG / 360;
/** 윈도우 총 길이 비율 (좌우 45° = 궤도의 25%) — 진행 바 분모용 */
export const REUNION_WINDOW_RATIO = REUNION_HALF * 2;

// ── 감정 시스템 ──────────────────────────────────────────────────────
/** 기분 1포인트가 감소하는 데 걸리는 시간 (100→0까지 8시간) */
export const MOOD_DECAY_MS = (8 * 3_600_000) / 100;
export const PET_MOOD_GAIN = 4;
export const SNACK_MOOD_GAIN = 15;
export const COOP_MOOD_GAIN = 10;
export const FEED_MOOD_GAIN = 6;

// ── 육성 단계 ────────────────────────────────────────────────────────
export const EGG_WARMTH_GOAL = 8;
export const BOND_GOAL = 100;
export const PET_BOND_GAIN = 6;
export const FEED_BOND_GAIN = 12;
export const PET_COOLDOWN_MS = 2_500;

/** 우주젤리 쿨다운 — NEXT_PUBLIC_FEED_COOLDOWN_MS(ms)로 재정의 가능. 기본 20초 */
const envFeedCooldown = Number(process.env.NEXT_PUBLIC_FEED_COOLDOWN_MS);
export const FEED_COOLDOWN_MS =
  Number.isFinite(envFeedCooldown) && envFeedCooldown >= 0
    ? envFeedCooldown
    : 20_000;

// ── 수거 ─────────────────────────────────────────────────────────────
/** 기분 100 기준 궤도당 수거량 */
export const DEBRIS_PER_ORBIT = 6;
/** 기분이 0이어도 유지되는 최저 효율 */
export const MOOD_FACTOR_FLOOR = 0.25;

// ── 함께 수거하기: 우주유영 아케이드 게임 ────────────────────────────
/** 분사 가스 최대치(=게임 시작 잔량). 0이 되면 게임 종료 */
export const GAS_MAX = 100;
/** 최대 분사 시 추력 가속도 (px/s²) */
export const THRUST_ACCEL = 900;
/** 최대 분사 시 초당 가스 소모량 */
export const GAS_BURN_PER_SEC = 11;
/** 관성 감쇠 계수(초당). 우주 느낌을 위해 아주 약하게만 */
export const SPACE_DRAG = 0.35;
/** 가상 조이스틱 최대 반경(px) — 이 거리에서 분사 100% */
export const JOY_RADIUS = 72;
/** 위성과 조우 시 충전되는 가스량 */
export const SAT_REFUEL = 28;
/** 펫 히트박스 반경(px) */
export const PET_RADIUS = 30;
/** 우주쓰레기 스폰 간격(ms) */
export const DEBRIS_SPAWN_MS = 820;
/** 화면에 동시에 떠 있는 쓰레기 최대 수 */
export const DEBRIS_MAX_ON_SCREEN = 14;
/** 스폰되는 파편이 기분 충전 아이템일 확률 */
export const MOOD_ITEM_CHANCE = 0.14;
/** 기분 충전 아이템 1개당 회복량 */
export const MOOD_ITEM_GAIN = 6;
/** 위성 스폰 간격(ms) */
export const SAT_SPAWN_MS = 5200;
/** 스타링크 트레인일 때 줄지어 나오는 위성 수 */
export const STARLINK_TRAIN = 5;
/** 희귀도별 질량(kg) — HUD 무게 합산용 */
export const RARITY_MASS_KG: Record<Rarity, number> = {
  common: 0.2,
  uncommon: 0.5,
  rare: 1.0,
  legendary: 3.0,
};

// ── 편지 ─────────────────────────────────────────────────────────────
export const LETTER_INTERVAL_MS = 45 * 60_000;
export const MAX_LETTERS_PER_SETTLE = 3;
export const MAX_LETTERS_KEPT = 60;

// ── 정산 모달 ────────────────────────────────────────────────────────
export const SETTLE_MODAL_MIN_AWAY_MS = 10 * 60_000;

export const DEFAULT_PET_NAME = "별이";

// ── 색상 ─────────────────────────────────────────────────────────────
export const PET_COLORS: Record<
  PetColor,
  { base: string; light: string; dark: string; label: string }
> = {
  mint: { base: "#7de8c3", light: "#b5f4de", dark: "#3ec99a", label: "민트" },
  pink: { base: "#f9a8d4", light: "#fcd2e9", dark: "#ec6fb4", label: "핑크" },
  lavender: { base: "#c4b5fd", light: "#e0d9fe", dark: "#9f87f5", label: "라벤더" },
};

export const SUIT_COLORS: Record<SuitColor, { base: string; label: string }> = {
  coral: { base: "#ff8a80", label: "코랄" },
  sky: { base: "#7cc7ff", label: "스카이" },
  gold: { base: "#ffd54f", label: "골드" },
};

// ── 우주쓰레기 도감 ──────────────────────────────────────────────────
export const DEBRIS_DEFS: DebrisDef[] = [
  {
    id: "paint",
    name: "페인트 조각",
    icon: "🎨",
    rarity: "common",
    weight: 34,
    desc: "우주선 표면에서 떨어져 나온 작은 조각. 아스트로펫의 주식이에요.",
  },
  {
    id: "bolt",
    name: "나사와 볼트",
    icon: "🔩",
    rarity: "common",
    weight: 30,
    desc: "오래된 우주 구조물에서 풀려 나온 부품. 바삭한 식감이래요.",
  },
  {
    id: "insulation",
    name: "단열재 파편",
    icon: "🧣",
    rarity: "uncommon",
    weight: 15,
    desc: "위성을 감싸던 금빛 단열재. 쫀득하게 씹는 맛이 좋대요.",
  },
  {
    id: "fairing",
    name: "로켓 페어링",
    icon: "🛡️",
    rarity: "uncommon",
    weight: 12,
    desc: "발사 때 분리된 로켓 덮개. 꽤 든든한 한 끼예요.",
  },
  {
    id: "solar",
    name: "태양전지판 조각",
    icon: "☀️",
    rarity: "rare",
    weight: 5.5,
    desc: "햇빛에 반짝이는 귀한 간식. 발견하면 자랑하고 싶어져요.",
  },
  {
    id: "satellite",
    name: "폐위성",
    icon: "🛰️",
    rarity: "rare",
    weight: 3,
    desc: "수명을 다한 인공위성. 하루 종일 배부른 진수성찬!",
  },
  {
    id: "toolbag",
    name: "우주인의 공구가방",
    icon: "🧰",
    rarity: "legendary",
    weight: 0.5,
    desc: "2008년 우주유영 중 실제로 놓친 그 가방! 전설의 발견이에요.",
  },
];

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "흔함",
  uncommon: "보통",
  rare: "희귀",
  legendary: "전설",
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common: "#9ca3af",
  uncommon: "#7de8c3",
  rare: "#7cc7ff",
  legendary: "#ffd54f",
};

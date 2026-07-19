export type Stage =
  | "adopt"
  | "egg"
  | "name"
  | "raising"
  | "prep"
  | "launching"
  | "orbit";

export type PetColor = "mint" | "pink" | "lavender";
export type SuitColor = "coral" | "sky" | "gold";
export type Expression = "neutral" | "happy" | "excited" | "lonely" | "sleepy";

export type DebrisId =
  | "paint"
  | "bolt"
  | "insulation"
  | "fairing"
  | "solar"
  | "satellite"
  | "toolbag";

export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export interface DebrisDef {
  id: DebrisId;
  name: string;
  icon: string;
  rarity: Rarity;
  weight: number;
  desc: string;
}

export interface Letter {
  id: string;
  at: number;
  title: string;
  body: string;
  icon: string;
  read: boolean;
}

export interface GameState {
  version: 1;
  stage: Stage;
  pet: {
    name: string;
    color: PetColor;
    suit: SuitColor | null;
  };
  eggWarmth: number;
  /** 육성 단계 유대감 0~100 */
  bond: number;
  /** moodAt 시점에 확정된 기분 값. 현재 기분은 currentMood()로 지연 계산 */
  mood: number;
  moodAt: number;
  launchedAt: number | null;
  debris: Record<DebrisId, number>;
  debrisTotal: number;
  /** 수거 진행률(소수). 1을 넘을 때마다 쓰레기 1개 획득 */
  debrisProgress: number;
  /** 다음 편지까지 누적된 시간(ms) */
  letterProgress: number;
  letters: Letter[];
  lastSettleAt: number;
  /** 협동 수거를 사용한 궤도 번호 (궤도당 1회) */
  lastCoopOrbit: number;
  /** 간식을 준 궤도 번호 (윈도우당 1회) */
  lastSnackOrbit: number;
  lastPetAt: number;
  lastFeedAt: number;
  createdAt: number;
}

export interface SettleReport {
  awayMs: number;
  debrisGained: number;
  lettersGained: number;
}

export interface OrbitInfo {
  /** 발사 후 몇 번째 궤도인지 (0부터) */
  index: number;
  /** 현재 궤도에서의 진행률 0~1. 0 = 주인 상공 통과 시작 */
  phase: number;
  inWindow: boolean;
  windowRemainMs: number;
  nextWindowInMs: number;
}

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
export type Expression = "neutral" | "happy" | "excited" | "lonely" | "sleepy" | "eating";

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
  /** 발사 후 몇 번째 궤도인지 (0부터) — 궤도 카운터 표시용 */
  index: number;
  /** 현재 궤도에서의 진행률 0~1. 0 = 주인 상공 정점 */
  phase: number;
  inWindow: boolean;
  windowRemainMs: number;
  nextWindowInMs: number;
  /**
   * 재회 패스 번호 (상공 통과 기준, 0부터). 윈도우가 phase 0 경계를 걸쳐
   * 두 index로 나뉘어도 한 번의 재회는 하나의 windowIndex로 묶인다.
   * 윈도우당 1회 액션(간식·협동 수거)의 중복 방지 키로 사용.
   */
  windowIndex: number;
}

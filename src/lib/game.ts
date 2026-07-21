import {
  BOND_GOAL,
  COOP_MOOD_GAIN,
  DEBRIS_DEFS,
  DEBRIS_PER_ORBIT,
  DEFAULT_PET_NAME,
  EGG_WARMTH_GOAL,
  FEED_BOND_GAIN,
  FEED_COOLDOWN_MS,
  FEED_MOOD_GAIN,
  LETTER_INTERVAL_MS,
  MAX_LETTERS_KEPT,
  MAX_LETTERS_PER_SETTLE,
  MOOD_DECAY_MS,
  MOOD_FACTOR_FLOOR,
  ORBIT_MS,
  PET_BOND_GAIN,
  PET_COOLDOWN_MS,
  PET_MOOD_GAIN,
  REUNION_HALF,
  SNACK_MOOD_GAIN,
} from "./constants";
import { makeLetter, makeWelcomeLetter } from "./letters";
import type {
  DebrisId,
  Expression,
  GameState,
  OrbitInfo,
  PetColor,
  SettleReport,
  SuitColor,
} from "./types";

export function clamp(v: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, v));
}

/** moodAt 이후 자연 감소를 반영한 현재 기분 */
export function currentMood(state: GameState, now: number): number {
  const elapsed = Math.max(0, now - state.moodAt);
  return clamp(state.mood - elapsed / MOOD_DECAY_MS);
}

export function orbitInfo(launchedAt: number, now: number): OrbitInfo {
  const elapsed = Math.max(0, now - launchedAt);
  const raw = elapsed / ORBIT_MS;
  const index = Math.floor(raw);
  const phase = raw - index; // 0~1, 0 = 상공 정점
  // 상공(phase 0) 기준 부호 있는 거리 (−0.5~0.5). 재회는 상공을 가운데로 좌우 대칭.
  const off = phase > 0.5 ? phase - 1 : phase;
  const inWindow = Math.abs(off) <= REUNION_HALF;
  return {
    index,
    phase,
    inWindow,
    // 윈도우 안이면 상공을 지나 +45°(=REUNION_HALF)에 도달할 때까지 남은 시간
    windowRemainMs: inWindow ? (REUNION_HALF - off) * ORBIT_MS : 0,
    // 윈도우 밖(phase∈(REUNION_HALF, 1−REUNION_HALF))이면 다음 −45° 진입까지
    nextWindowInMs: inWindow ? 0 : (1 - REUNION_HALF - phase) * ORBIT_MS,
    // 상공 통과 기준 재회 번호. 경계를 걸쳐도 한 재회는 하나의 값으로 묶인다.
    windowIndex: Math.round(raw),
  };
}

export function getExpression(state: GameState, now: number): Expression {
  if (state.stage === "launching") return "excited";
  const mood = currentMood(state, now);
  if (state.stage === "orbit" && state.launchedAt !== null) {
    if (orbitInfo(state.launchedAt, now).inWindow) {
      return mood < 40 ? "happy" : "excited";
    }
  }
  if (mood >= 70) return "happy";
  if (mood >= 40) return "neutral";
  return "lonely";
}

export function rollDebris(): DebrisId {
  const total = DEBRIS_DEFS.reduce((s, d) => s + d.weight, 0);
  let r = Math.random() * total;
  for (const d of DEBRIS_DEFS) {
    r -= d.weight;
    if (r <= 0) return d.id;
  }
  return DEBRIS_DEFS[0].id;
}

export function createInitialState(now: number): GameState {
  return {
    version: 1,
    stage: "adopt",
    pet: { name: "", color: "mint", suit: null },
    eggWarmth: 0,
    bond: 0,
    mood: 80,
    moodAt: now,
    launchedAt: null,
    debris: {
      paint: 0,
      bolt: 0,
      insulation: 0,
      fairing: 0,
      solar: 0,
      satellite: 0,
      toolbag: 0,
    },
    debrisTotal: 0,
    debrisProgress: 0,
    letterProgress: 0,
    letters: [],
    lastSettleAt: now,
    lastCoopOrbit: -1,
    lastSnackOrbit: -1,
    lastPetAt: 0,
    lastFeedAt: 0,
    createdAt: now,
  };
}

const EMPTY_REPORT: SettleReport = { awayMs: 0, debrisGained: 0, lettersGained: 0 };

/**
 * 경과 시간을 정산한다. 1초 틱과 오프라인 복귀를 같은 코드로 처리.
 * 궤도 스테이지에서만 자동 수거·편지가 발생하며, 기분은 지연 계산이라 여기서 건드리지 않는다.
 */
export function settle(
  state: GameState,
  now: number
): { state: GameState; report: SettleReport } {
  const dt = now - state.lastSettleAt;
  if (dt <= 0) return { state, report: EMPTY_REPORT };
  if (state.stage !== "orbit" || state.launchedAt === null) {
    return { state: { ...state, lastSettleAt: now }, report: EMPTY_REPORT };
  }

  // 구간 평균 기분으로 수거 효율 계산 (시작·끝 기분의 평균 근사)
  const from = Math.max(state.lastSettleAt, state.moodAt);
  const m0 = currentMood(state, from);
  const m1 = currentMood(state, now);
  const avgMood = (m0 + m1) / 2;
  const factor = MOOD_FACTOR_FLOOR + (1 - MOOD_FACTOR_FLOOR) * (avgMood / 100);

  let progress = state.debrisProgress + (DEBRIS_PER_ORBIT / ORBIT_MS) * factor * dt;
  const debris = { ...state.debris };
  let debrisGained = 0;
  while (progress >= 1) {
    progress -= 1;
    debris[rollDebris()] += 1;
    debrisGained += 1;
  }

  let letterProgress = state.letterProgress + dt;
  const pendingCount = Math.floor(letterProgress / LETTER_INTERVAL_MS);
  const genCount = Math.min(pendingCount, MAX_LETTERS_PER_SETTLE);
  letterProgress = letterProgress % LETTER_INTERVAL_MS;
  const newLetters = Array.from({ length: genCount }, (_, i) =>
    // 부재 기간에 걸쳐 도착한 것처럼 과거 시각을 배정
    makeLetter(m1, now - (genCount - 1 - i) * LETTER_INTERVAL_MS, i)
  );

  return {
    state: {
      ...state,
      debris,
      debrisTotal: state.debrisTotal + debrisGained,
      debrisProgress: progress,
      letterProgress,
      letters: [...state.letters, ...newLetters].slice(-MAX_LETTERS_KEPT),
      lastSettleAt: now,
    },
    report: { awayMs: dt, debrisGained, lettersGained: genCount },
  };
}

// ── 액션 (스테이지 가드 포함, 조건이 안 맞으면 원본 참조를 그대로 반환) ──

export function chooseEgg(state: GameState, color: PetColor): GameState {
  if (state.stage !== "adopt") return state;
  return { ...state, stage: "egg", pet: { ...state.pet, color } };
}

export function warmEgg(state: GameState): GameState {
  if (state.stage !== "egg" || state.eggWarmth >= EGG_WARMTH_GOAL) return state;
  return { ...state, eggWarmth: state.eggWarmth + 1 };
}

export function hatched(state: GameState): GameState {
  if (state.stage !== "egg" || state.eggWarmth < EGG_WARMTH_GOAL) return state;
  return { ...state, stage: "name" };
}

export function nameAndStart(state: GameState, name: string, now: number): GameState {
  if (state.stage !== "name") return state;
  const trimmed = name.trim().slice(0, 8);
  return {
    ...state,
    stage: "raising",
    pet: { ...state.pet, name: trimmed || DEFAULT_PET_NAME },
    mood: 80,
    moodAt: now,
    bond: 0,
  };
}

/** 쓰다듬기 — 육성 중엔 유대감, 궤도 재회 윈도우 중엔 기분 회복 */
export function petThePet(state: GameState, now: number): GameState {
  if (now - state.lastPetAt < PET_COOLDOWN_MS) return state;
  if (state.stage === "raising") {
    return {
      ...state,
      bond: clamp(state.bond + PET_BOND_GAIN, 0, BOND_GOAL),
      mood: clamp(currentMood(state, now) + 2),
      moodAt: now,
      lastPetAt: now,
    };
  }
  if (state.stage === "orbit" && state.launchedAt !== null) {
    if (!orbitInfo(state.launchedAt, now).inWindow) return state;
    return {
      ...state,
      mood: clamp(currentMood(state, now) + PET_MOOD_GAIN),
      moodAt: now,
      lastPetAt: now,
    };
  }
  return state;
}

/** 육성 단계 밥 주기 */
export function feed(state: GameState, now: number): GameState {
  if (state.stage !== "raising") return state;
  if (now - state.lastFeedAt < FEED_COOLDOWN_MS) return state;
  return {
    ...state,
    bond: clamp(state.bond + FEED_BOND_GAIN, 0, BOND_GOAL),
    mood: clamp(currentMood(state, now) + FEED_MOOD_GAIN),
    moodAt: now,
    lastFeedAt: now,
  };
}

export function startPrep(state: GameState): GameState {
  if (state.stage !== "raising" || state.bond < BOND_GOAL) return state;
  return { ...state, stage: "prep" };
}

export function launchWithSuit(state: GameState, suit: SuitColor): GameState {
  if (state.stage !== "prep") return state;
  return { ...state, stage: "launching", pet: { ...state.pet, suit } };
}

export function enterOrbit(state: GameState, now: number): GameState {
  if (state.stage !== "launching") return state;
  return {
    ...state,
    stage: "orbit",
    launchedAt: now,
    lastSettleAt: now,
    letterProgress: 0,
    debrisProgress: 0,
    mood: 100,
    moodAt: now,
    letters: [...state.letters, makeWelcomeLetter(now)],
  };
}

/** 재회 윈도우 간식 — 재회 패스당 1회 */
export function giveSnack(state: GameState, now: number): GameState {
  if (state.stage !== "orbit" || state.launchedAt === null) return state;
  const orbit = orbitInfo(state.launchedAt, now);
  if (!orbit.inWindow || state.lastSnackOrbit >= orbit.windowIndex) return state;
  return {
    ...state,
    mood: clamp(currentMood(state, now) + SNACK_MOOD_GAIN),
    moodAt: now,
    lastSnackOrbit: orbit.windowIndex,
  };
}

/**
 * 우주유영 수거 게임 결과를 반영한다. 게임에서 모은 파편(items)과 기분 충전량(moodGain)을
 * 도감·총 수거·기분에 합산한다.
 * - coopPass=true(재회 윈도우 실행): 윈도우 안 + 아직 안 쓴 재회 패스일 때만 반영하며
 *   COOP_MOOD_GAIN 보너스 + 패스 소비. (재회당 1회)
 * - coopPass=false(설정에서 언제나 실행): 게이팅 없이 반영, 패스 미소비.
 * items·moodGain이 모두 없으면 상태 불변.
 */
export function applyCollectResult(
  state: GameState,
  now: number,
  items: DebrisId[],
  moodGain: number,
  opts?: { coopPass?: boolean }
): { state: GameState; items: DebrisId[] } {
  if (state.stage !== "orbit" || state.launchedAt === null) {
    return { state, items: [] };
  }
  const coopPass = opts?.coopPass ?? false;
  if (coopPass) {
    const orbit = orbitInfo(state.launchedAt, now);
    if (!orbit.inWindow || state.lastCoopOrbit >= orbit.windowIndex) {
      return { state, items: [] };
    }
  }
  if (items.length === 0 && moodGain <= 0) return { state, items: [] };
  const debris = { ...state.debris };
  for (const id of items) debris[id] += 1;
  const bonus = coopPass ? COOP_MOOD_GAIN : 0;
  return {
    state: {
      ...state,
      debris,
      debrisTotal: state.debrisTotal + items.length,
      mood: clamp(currentMood(state, now) + moodGain + bonus),
      moodAt: now,
      lastCoopOrbit: coopPass
        ? orbitInfo(state.launchedAt, now).windowIndex
        : state.lastCoopOrbit,
    },
    items,
  };
}

export function markLetterRead(state: GameState, id: string): GameState {
  if (!state.letters.some((l) => l.id === id && !l.read)) return state;
  return {
    ...state,
    letters: state.letters.map((l) => (l.id === id ? { ...l, read: true } : l)),
  };
}

// ── 표시용 유틸 ──────────────────────────────────────────────────────

export function formatMMSS(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatAway(ms: number): string {
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}분`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

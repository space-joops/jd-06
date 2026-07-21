"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SETTLE_MODAL_MIN_AWAY_MS } from "@/lib/constants";
import {
  applyCollectResult,
  chooseEgg,
  createInitialState,
  enterOrbit,
  feed,
  giveSnack,
  hatched,
  launchWithSuit,
  markLetterRead,
  nameAndStart,
  petThePet,
  settle,
  startPrep,
  warmEgg,
} from "@/lib/game";
import { clearGame, loadGame, saveGame } from "@/lib/storage";
import type {
  DebrisId,
  GameState,
  PetColor,
  SettleReport,
  SuitColor,
} from "@/lib/types";

export interface GameApi {
  state: GameState;
  now: number;
  report: SettleReport | null;
  dismissReport: () => void;
  chooseEgg: (color: PetColor) => void;
  warmEgg: () => void;
  hatched: () => void;
  nameAndStart: (name: string) => void;
  /** 쓰다듬기. 쿨다운 등으로 무시되면 false */
  doPet: () => boolean;
  doFeed: () => boolean;
  startPrep: () => void;
  launchWithSuit: (suit: SuitColor) => void;
  enterOrbit: () => void;
  doSnack: () => boolean;
  /**
   * 우주유영 수거 게임 결과 확정 — 모은 파편·기분 충전량을 반영.
   * coopPass=true면 재회 패스 소비(재회 윈도우 실행), false면 무제한(설정 실행).
   * 실제 도감에 반영된 아이템 목록 반환 (불가 시 빈 배열).
   */
  doCollectResult: (
    items: DebrisId[],
    moodGain: number,
    opts?: { coopPass?: boolean }
  ) => DebrisId[];
  markLetterRead: (id: string) => void;
  reset: () => void;
}

export function useGame(): GameApi | null {
  const [state, setState] = useState<GameState | null>(null);
  const [now, setNow] = useState(0);
  const [report, setReport] = useState<SettleReport | null>(null);
  const stateRef = useRef<GameState | null>(null);
  stateRef.current = state;

  const commit = useCallback((next: GameState, t: number) => {
    stateRef.current = next;
    setState(next);
    setNow(t);
  }, []);

  // 마운트: 저장본 로드 + 오프라인 정산
  useEffect(() => {
    const t = Date.now();
    const saved = loadGame();
    const base = saved ?? createInitialState(t);
    const { state: settled, report: r } = settle(base, t);
    commit(settled, t);
    if (
      saved &&
      saved.stage === "orbit" &&
      r.awayMs >= SETTLE_MODAL_MIN_AWAY_MS &&
      (r.debrisGained > 0 || r.lettersGained > 0)
    ) {
      setReport(r);
    }
  }, [commit]);

  // 1초 틱 + 탭 복귀 시 정산
  useEffect(() => {
    const settleNow = (checkReport: boolean) => {
      const s = stateRef.current;
      if (!s) return;
      const t = Date.now();
      const { state: settled, report: r } = settle(s, t);
      commit(settled, t);
      if (
        checkReport &&
        s.stage === "orbit" &&
        r.awayMs >= SETTLE_MODAL_MIN_AWAY_MS &&
        (r.debrisGained > 0 || r.lettersGained > 0)
      ) {
        setReport(r);
      }
    };
    const id = setInterval(() => settleNow(false), 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") settleNow(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [commit]);

  // 자동 저장
  useEffect(() => {
    if (state) saveGame(state);
  }, [state]);

  if (!state) return null;

  const run = (fn: (s: GameState, t: number) => GameState): boolean => {
    const s = stateRef.current;
    if (!s) return false;
    const t = Date.now();
    const settled = settle(s, t).state;
    const next = fn(settled, t);
    commit(next, t);
    return next !== settled;
  };

  return {
    state,
    now,
    report,
    dismissReport: () => setReport(null),
    chooseEgg: (color) => run((s) => chooseEgg(s, color)),
    warmEgg: () => run((s) => warmEgg(s)),
    hatched: () => run((s) => hatched(s)),
    nameAndStart: (name) => run((s, t) => nameAndStart(s, name, t)),
    doPet: () => run((s, t) => petThePet(s, t)),
    doFeed: () => run((s, t) => feed(s, t)),
    startPrep: () => run((s) => startPrep(s)),
    launchWithSuit: (suit) => run((s) => launchWithSuit(s, suit)),
    enterOrbit: () => run((s, t) => enterOrbit(s, t)),
    doSnack: () => run((s, t) => giveSnack(s, t)),
    doCollectResult: (items, moodGain, opts) => {
      const s = stateRef.current;
      if (!s) return [];
      const t = Date.now();
      const settled = settle(s, t).state;
      const { state: next, items: got } = applyCollectResult(
        settled,
        t,
        items,
        moodGain,
        opts
      );
      commit(next, t);
      return got;
    },
    markLetterRead: (id) => run((s) => markLetterRead(s, id)),
    reset: () => {
      clearGame();
      const t = Date.now();
      commit(createInitialState(t), t);
      setReport(null);
    },
  };
}

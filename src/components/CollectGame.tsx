"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PetSvg from "@/components/PetSvg";
import Stars from "@/components/Stars";
import {
  COLLECT_RISE_MS,
  COLLECT_ROUNDS,
  COLLECT_SPAWN_MS,
  COLLECT_TARGET_PER_ROUND,
  DEBRIS_DEFS,
  RARITY_MASS_KG,
} from "@/lib/constants";
import { rollDebris } from "@/lib/game";
import type { DebrisId, PetColor, SuitColor } from "@/lib/types";

interface FloatingDebris {
  key: number;
  id: DebrisId;
  icon: string;
  left: number; // %
  driftDeg: number; // 살짝 기울여 떠오르는 각도
}

const ICON = Object.fromEntries(DEBRIS_DEFS.map((d) => [d.id, d.icon])) as Record<
  DebrisId,
  string
>;
const MASS = Object.fromEntries(
  DEBRIS_DEFS.map((d) => [d.id, RARITY_MASS_KG[d.rarity]])
) as Record<DebrisId, number>;

/**
 * "함께 수거하기" 미니게임 — 지구에서 떠오르는 도감 파편을 탭해 모은다.
 * 라운드 목표를 채우면 다음 라운드, 마지막 라운드 완료(또는 수집 후 닫기) 시
 * 모은 아이템 목록을 onFinish로 넘긴다. 하나도 안 모으고 닫으면 onClose(패스 미소비).
 */
export default function CollectGame({
  color,
  suit,
  onFinish,
  onClose,
}: {
  color: PetColor;
  suit: SuitColor | null;
  onFinish: (items: DebrisId[]) => void;
  onClose: () => void;
}) {
  const [ui, setUi] = useState({ round: 1, roundCount: 0, weightKg: 0 });
  const [elapsed, setElapsed] = useState(0);
  const [floating, setFloating] = useState<FloatingDebris[]>([]);
  const [finishing, setFinishing] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const collectedRef = useRef<DebrisId[]>([]);
  const roundRef = useRef(1);
  const roundCountRef = useRef(0);
  const doneRef = useRef(false);
  const keyRef = useRef(0);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFinishing(true);
    finishTimer.current = setTimeout(() => onFinish(collectedRef.current), 950);
  }, [onFinish]);

  const handleClose = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    // 하나라도 모았으면 확정(패스 소비), 아니면 그냥 닫기
    if (collectedRef.current.length > 0) onFinish(collectedRef.current);
    else onClose();
  }, [onFinish, onClose]);

  // 경과 타이머
  useEffect(() => {
    const id = setInterval(() => {
      if (!doneRef.current) setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // 파편 스폰
  useEffect(() => {
    const id = setInterval(() => {
      if (doneRef.current) return;
      const debrisId = rollDebris();
      setFloating((f) => [
        ...f,
        {
          key: keyRef.current++,
          id: debrisId,
          icon: ICON[debrisId],
          left: 8 + Math.random() * 82,
          driftDeg: -10 + Math.random() * 20,
        },
      ]);
    }, COLLECT_SPAWN_MS);
    return () => clearInterval(id);
  }, []);

  // 언마운트 시 타이머 정리
  useEffect(() => () => {
    if (finishTimer.current) clearTimeout(finishTimer.current);
  }, []);

  const drop = useCallback((key: number) => {
    setFloating((f) => f.filter((d) => d.key !== key));
  }, []);

  const collect = useCallback(
    (item: FloatingDebris) => {
      if (doneRef.current) return;
      drop(item.key);
      collectedRef.current.push(item.id);
      roundCountRef.current += 1;
      const weightKg = collectedRef.current.reduce((s, x) => s + MASS[x], 0);

      if (roundCountRef.current >= COLLECT_TARGET_PER_ROUND) {
        if (roundRef.current >= COLLECT_ROUNDS) {
          setUi({ round: roundRef.current, roundCount: COLLECT_TARGET_PER_ROUND, weightKg });
          finish();
          return;
        }
        roundRef.current += 1;
        roundCountRef.current = 0;
      }
      setUi({ round: roundRef.current, roundCount: roundCountRef.current, weightKg });
    },
    [drop, finish]
  );

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-center bg-space-900">
      <div className="anim-fadeup relative h-full w-full max-w-[430px] overflow-hidden space-bg">
      <Stars />

      {/* 지구 (하단 아크) */}
      <div className="pointer-events-none absolute -bottom-[65%] left-1/2 aspect-square w-[170%] -translate-x-1/2">
        <div className="absolute inset-0 rounded-full bg-[#7cc7ff]/15" />
        <div
          className="absolute inset-[3%] overflow-hidden rounded-full"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 12%, #a5ddff 0%, #5da4ec 45%, #2a5cb8 100%)",
          }}
        >
          <div className="absolute left-[16%] top-[16%] h-[9%] w-[26%] -rotate-12 rounded-full bg-[#79d98f]/85" />
          <div className="absolute left-[52%] top-[24%] h-[12%] w-[32%] rounded-full bg-[#79d98f]/80" />
          <div className="absolute left-[30%] top-[13%] h-[4%] w-[16%] rounded-full bg-white/45" />
          <div className="absolute left-[62%] top-[14%] h-[4%] w-[14%] rounded-full bg-white/40" />
        </div>
      </div>

      {/* 펫 (중앙에서 둥실) */}
      <div className="pointer-events-none absolute left-1/2 top-[42%] w-28 -translate-x-1/2 -translate-y-1/2">
        <PetSvg color={color} suit={suit} expression="excited" />
      </div>

      {/* 떠오르는 파편 */}
      {floating.map((d) => (
        <button
          key={d.key}
          onPointerDown={() => collect(d)}
          onAnimationEnd={() => drop(d.key)}
          aria-label="파편 수거"
          className="anim-debris absolute bottom-0 flex h-12 w-12 items-center justify-center text-3xl leading-none transition-transform active:scale-125"
          style={{
            left: `${d.left}%`,
            animationDuration: `${COLLECT_RISE_MS}ms`,
            rotate: `${d.driftDeg}deg`,
          }}
        >
          {d.icon}
        </button>
      ))}

      {/* 상단 HUD */}
      <header className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-5 pt-6">
        <button
          onClick={handleClose}
          aria-label="닫기"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-lg text-white/85 transition active:scale-90"
        >
          ✕
        </button>
        <div className="pt-1 text-center">
          <p className="text-lg font-bold tabular-nums">
            {COLLECT_ROUNDS} 중 {ui.round}
          </p>
          <p className="mt-0.5 text-[11px] text-white/55">함께 수거하기</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold tabular-nums text-star">
            {ui.weightKg.toFixed(1)}kg
          </p>
          <p className="mt-0.5 text-[11px] tabular-nums text-mint">T +{elapsed}s</p>
        </div>
      </header>

      {/* 하단 안내 + 라운드 진행 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
          {Array.from({ length: COLLECT_TARGET_PER_ROUND }, (_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < ui.roundCount ? "bg-mint" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <p className="rounded-full bg-black/25 px-3 py-1 text-xs text-white/75">
          파편을 탭해서 함께 수거해요! ✨
        </p>
      </div>

      {/* 완료 연출 */}
      {finishing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-space-900/45">
          <p className="anim-pop text-2xl font-bold text-white">수거 완료! 🎉</p>
        </div>
      )}
      </div>
    </div>,
    document.body
  );
}

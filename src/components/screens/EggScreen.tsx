"use client";

import { useEffect, useRef, useState } from "react";
import EggSvg from "@/components/EggSvg";
import type { GameApi } from "@/hooks/useGame";
import { EGG_WARMTH_GOAL } from "@/lib/constants";

export default function EggScreen({ api }: { api: GameApi }) {
  const [wobbleKey, setWobbleKey] = useState<number | undefined>();
  const warmth = api.state.eggWarmth;
  const hatching = warmth >= EGG_WARMTH_GOAL;

  const apiRef = useRef(api);
  apiRef.current = api;

  useEffect(() => {
    if (!hatching) return;
    const t = setTimeout(() => apiRef.current.hatched(), 2200);
    return () => clearTimeout(t);
  }, [hatching]);

  const onTap = () => {
    if (hatching) return;
    api.warmEgg();
    setWobbleKey((k) => (k ?? 0) + 1);
  };

  const crack = warmth >= 6 ? 2 : warmth >= 3 ? 1 : 0;

  return (
    <div className="anim-fadeup relative z-10 flex h-full flex-col items-center px-6 pb-8 pt-14">
      <h1 className="text-xl font-bold">
        {hatching ? "곧 만나요…!" : "알을 토닥토닥 해주세요"}
      </h1>
      <p className="mt-2 text-sm text-white/60">
        {hatching
          ? "안에서 꼬물꼬물 움직이고 있어요"
          : "따뜻한 손길을 느끼면 깨어날 거예요"}
      </p>

      {/* 온기 게이지 */}
      <div className="mt-6 flex gap-1.5">
        {Array.from({ length: EGG_WARMTH_GOAL }, (_, i) => (
          <span
            key={i}
            className={`text-lg transition ${
              i < warmth ? "opacity-100" : "opacity-20"
            }`}
          >
            💗
          </span>
        ))}
      </div>

      <button
        onClick={onTap}
        className="relative mt-4 w-64 active:scale-95 transition"
        aria-label="알 토닥이기"
      >
        <EggSvg
          color={api.state.pet.color}
          crack={crack}
          shaking={hatching}
          wobbleKey={hatching ? undefined : wobbleKey}
          className="w-full"
        />
        {hatching && (
          <span className="anim-twinkle absolute -top-2 right-6 text-3xl">✨</span>
        )}
      </button>

      {!hatching && (
        <p className="mt-6 text-xs text-white/40">알을 탭해서 온기를 전해주세요</p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import PetSvg from "@/components/PetSvg";
import type { GameApi } from "@/hooks/useGame";
import { useI18n } from "@/i18n/I18nProvider";

const STREAKS = Array.from({ length: 9 }, (_, i) => ({
  left: (i * 47 + 13) % 100,
  delay: (i % 5) * 0.22,
}));

export default function LaunchingScreen({ api }: { api: GameApi }) {
  const { t } = useI18n();
  const [count, setCount] = useState(3);
  const apiRef = useRef(api);
  apiRef.current = api;

  useEffect(() => {
    const iv = setInterval(() => setCount((c) => c - 1), 800);
    const done = setTimeout(() => apiRef.current.enterOrbit(), 3600);
    return () => {
      clearInterval(iv);
      clearTimeout(done);
    };
  }, []);

  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center overflow-hidden">
      {/* 별 스트릭 (상승 연출) */}
      {STREAKS.map((s, i) => (
        <span
          key={i}
          className="anim-streak absolute top-0 h-14 w-px bg-white/40"
          style={{ left: `${s.left}%`, animationDelay: `${s.delay}s` }}
        />
      ))}

      <div className="anim-rocket flex flex-col items-center">
        <PetSvg
          color={api.state.pet.color}
          expression="excited"
          suit={api.state.pet.suit}
          bob={false}
          className="w-44"
        />
        <svg viewBox="0 0 60 80" className="-mt-4 w-14" aria-hidden>
          <g className="anim-flame">
            <path d="M30 0 C42 20 46 38 30 76 C14 38 18 20 30 0 Z" fill="#ffb74d" />
            <path d="M30 6 C38 22 40 34 30 58 C20 34 22 22 30 6 Z" fill="#ffe9a8" />
          </g>
        </svg>
      </div>

      <p className="absolute bottom-24 text-center">
        <span className="block font-mono text-6xl font-bold text-star">
          {count > 0 ? count : t("launching.liftoff")}
        </span>
        <span className="mt-3 block text-sm text-white/60">
          {t("launching.subtitle", { name: api.state.pet.name })}
        </span>
      </p>
    </div>
  );
}

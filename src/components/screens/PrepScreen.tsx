"use client";

import { useState } from "react";
import PetSvg from "@/components/PetSvg";
import type { GameApi } from "@/hooks/useGame";
import { SUIT_COLORS } from "@/lib/constants";
import type { SuitColor } from "@/lib/types";

const SUITS: SuitColor[] = ["coral", "sky", "gold"];

export default function PrepScreen({ api }: { api: GameApi }) {
  const [suit, setSuit] = useState<SuitColor>("coral");

  return (
    <div className="anim-fadeup relative z-10 flex h-full flex-col items-center px-6 pb-8 pt-12">
      <p className="text-xs tracking-[0.3em] text-white/50">MISSION READY</p>
      <h1 className="mt-2 text-xl font-bold">수거 슈트를 입혀주세요</h1>
      <p className="mt-2 text-center text-sm text-white/60">
        우주쓰레기 수거 임무를 위한 특수 슈트예요.
        <br />
        {api.state.pet.name}에게 어울리는 색을 골라주세요.
      </p>

      <PetSvg
        color={api.state.pet.color}
        expression="excited"
        suit={suit}
        className="anim-pop mt-4 w-60"
      />

      <div className="mt-4 flex gap-4">
        {SUITS.map((s) => (
          <button
            key={s}
            onClick={() => setSuit(s)}
            className={`flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 transition active:scale-95 ${
              suit === s ? "bg-white/15 ring-2 ring-mint" : "bg-white/5"
            }`}
          >
            <span
              className="h-8 w-8 rounded-full border-2 border-white/40"
              style={{ background: SUIT_COLORS[s].base }}
            />
            <span className="text-xs text-white/80">{SUIT_COLORS[s].label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <button
        onClick={() => api.launchWithSuit(suit)}
        className="w-full rounded-2xl bg-mint py-4 text-lg font-bold text-space-900 transition active:scale-95"
      >
        발사 준비 완료 🚀
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import Gauge, { moodColor } from "@/components/Gauge";
import { Hearts, useHearts } from "@/components/Hearts";
import PetSvg from "@/components/PetSvg";
import type { GameApi } from "@/hooks/useGame";
import { usePetReaction } from "@/hooks/usePetReaction";
import { useI18n } from "@/i18n/I18nProvider";
import { BOND_GOAL, FEED_COOLDOWN_MS } from "@/lib/constants";
import { currentMood, getExpression } from "@/lib/game";
import type { Expression } from "@/lib/types";

export default function RaisingScreen({ api }: { api: GameApi }) {
  const { state, now } = api;
  const { t } = useI18n();
  const { hearts, spawn } = useHearts();
  const { ref: petRef, react } = usePetReaction();
  const [happyUntil, setHappyUntil] = useState(0);

  const mood = currentMood(state, now);
  const bondDone = state.bond >= BOND_GOAL;
  const feedRemainMs = Math.max(0, FEED_COOLDOWN_MS - (now - state.lastFeedAt));

  const baseExpr = getExpression(state, now);
  const expression: Expression = Date.now() < happyUntil ? "excited" : baseExpr;

  const onPetTap = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (api.doPet()) {
      spawn(e.clientX - rect.left, e.clientY - rect.top);
      setHappyUntil(Date.now() + 1500);
      react();
    }
  };

  const onFeed = () => {
    if (api.doFeed()) {
      spawn(140 + Math.random() * 60, 60, "🍮");
      setHappyUntil(Date.now() + 2000);
    }
  };

  return (
    <div className="anim-fadeup relative z-10 flex h-full flex-col px-6 pb-8 pt-8">
      <h1 className="text-center text-lg font-bold">
        {state.pet.name}
        <span className="ml-2 text-sm font-normal text-white/50">{t("raising.subtitle")}</span>
      </h1>

      <div className="mt-4 flex flex-col gap-2">
        <Gauge label={t("gauge.bond")} value={state.bond} color="#f9a8d4" />
        <Gauge label={t("gauge.mood")} value={mood} color={moodColor(mood)} />
      </div>

      {/* 펫 + 초원 */}
      <div className="relative mt-2 flex flex-1 items-center justify-center">
        <div
          className="relative z-10 w-60 cursor-pointer touch-none"
          onPointerDown={onPetTap}
        >
          <div ref={petRef} className="will-change-transform">
            <PetSvg color={state.pet.color} expression={expression} className="w-full" />
          </div>
          <Hearts items={hearts} />
        </div>
        {/* 언덕 */}
        <svg
          viewBox="0 0 430 120"
          className="pointer-events-none absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0 70 Q110 22 230 52 T430 42 L430 120 L0 120 Z" fill="#16324a" opacity={0.9} />
          <path d="M0 92 Q140 58 280 80 T430 72 L430 120 L0 120 Z" fill="#1d4436" opacity={0.95} />
          <circle cx={84} cy={96} r={3} fill="#f9a8d4" opacity={0.8} />
          <circle cx={330} cy={100} r={3} fill="#ffe9a8" opacity={0.8} />
          <circle cx={215} cy={106} r={2.5} fill="#c4b5fd" opacity={0.8} />
        </svg>
      </div>

      <p className="mb-3 text-center text-xs text-white/50">
        {bondDone ? t("raising.hintReady") : t("raising.hintDefault")}
      </p>

      {bondDone ? (
        <button
          onClick={api.startPrep}
          className="anim-glow w-full rounded-2xl bg-mint py-4 text-lg font-bold text-space-900 transition active:scale-95"
        >
          {t("raising.ctaReady")}
        </button>
      ) : (
        <button
          onClick={onFeed}
          disabled={feedRemainMs > 0}
          className="w-full rounded-2xl bg-white/10 py-4 text-lg font-semibold transition active:scale-95 disabled:opacity-40"
        >
          {feedRemainMs > 0
            ? t("raising.feedCooldown", { n: Math.ceil(feedRemainMs / 1000) })
            : t("raising.feedCta")}
        </button>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import EggSvg from "@/components/EggSvg";
import type { GameApi } from "@/hooks/useGame";
import { useI18n } from "@/i18n/I18nProvider";
import { EGG_WARMTH_GOAL } from "@/lib/constants";

export default function EggScreen({ api }: { api: GameApi }) {
  const { t } = useI18n();
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
        {hatching ? t("egg.titleHatching") : t("egg.titleDefault")}
      </h1>
      <p className="mt-2 text-sm text-white/60">
        {hatching ? t("egg.subtitleHatching") : t("egg.subtitleDefault")}
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
        aria-label={t("egg.ariaTap")}
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
        <p className="mt-6 text-xs text-white/40">{t("egg.hint")}</p>
      )}
    </div>
  );
}

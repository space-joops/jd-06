"use client";

import { useState } from "react";
import EggSvg from "@/components/EggSvg";
import type { GameApi } from "@/hooks/useGame";
import { useI18n } from "@/i18n/I18nProvider";
import type { PetColor } from "@/lib/types";

const COLORS: PetColor[] = ["mint", "pink", "lavender"];

export default function AdoptScreen({ api }: { api: GameApi }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<PetColor | null>(null);

  return (
    <div className="anim-fadeup relative z-10 flex h-full flex-col items-center px-6 pb-8 pt-12">
      <p className="text-xs tracking-[0.3em] text-white/50">{t("adopt.tagline")}</p>
      <h1 className="mt-2 text-2xl font-bold">{t("adopt.title")}</h1>
      <p className="mt-4 whitespace-pre-line text-center text-sm leading-relaxed text-white/70">
        {t("adopt.intro")}
      </p>

      <div className="mt-10 grid w-full grid-cols-3 gap-3">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setSelected(color)}
            className={`rounded-2xl px-1 pb-3 pt-2 transition active:scale-95 ${
              selected === color
                ? "bg-white/15 ring-2 ring-mint"
                : "bg-white/5"
            }`}
          >
            <EggSvg color={color} className="w-full" />
            <span className="mt-1 block text-sm text-white/85">
              {t(`color.pet.${color}`)}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <button
        disabled={!selected}
        onClick={() => selected && api.chooseEgg(selected)}
        className="w-full rounded-2xl bg-mint py-4 text-lg font-bold text-space-900 transition active:scale-95 disabled:opacity-30"
      >
        {t("adopt.cta")}
      </button>
    </div>
  );
}

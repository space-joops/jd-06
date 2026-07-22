"use client";

import { useState } from "react";
import PetSvg from "@/components/PetSvg";
import type { GameApi } from "@/hooks/useGame";
import { useI18n } from "@/i18n/I18nProvider";

export default function NameScreen({ api }: { api: GameApi }) {
  const { t, tlist } = useI18n();
  const [name, setName] = useState("");
  const defaultName = t("pet.defaultName");
  const suggestions = tlist("pet.namePresets");
  const finalName = name.trim() || defaultName;

  return (
    <div className="anim-fadeup relative z-10 flex h-full flex-col items-center px-6 pb-8 pt-14">
      <div className="relative">
        <PetSvg
          color={api.state.pet.color}
          expression="excited"
          className="anim-pop w-52"
        />
        <span className="absolute -right-8 top-2 rounded-2xl bg-white/90 px-3 py-1.5 text-sm font-semibold text-space-900">
          {t("name.bubble")}
        </span>
      </div>

      <h1 className="mt-4 text-xl font-bold">{t("name.title")}</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={12}
        placeholder={defaultName}
        className="mt-6 w-full rounded-2xl bg-white/10 px-4 py-3.5 text-center text-lg outline-none ring-mint placeholder:text-white/30 focus:ring-2"
      />

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setName(s)}
            className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white/80 transition active:scale-95"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <button
        onClick={() => api.nameAndStart(finalName)}
        className="w-full rounded-2xl bg-mint py-4 text-lg font-bold text-space-900 transition active:scale-95"
      >
        {t("name.cta", { name: finalName })}
      </button>
    </div>
  );
}

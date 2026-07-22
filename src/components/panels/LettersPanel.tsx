"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Letter } from "@/lib/types";

export default function LettersPanel({
  letters,
  petName,
  onRead,
}: {
  letters: Letter[];
  petName: string;
  onRead: (id: string) => void;
}) {
  const { t, formatDate } = useI18n();
  const [selected, setSelected] = useState<Letter | null>(null);
  const sorted = [...letters].sort((a, b) => b.at - a.at);

  const titleOf = (l: Letter) => (l.tkey ? t(`${l.tkey}.title`) : l.title ?? "");
  const bodyOf = (l: Letter) => (l.tkey ? t(`${l.tkey}.body`) : l.body ?? "");

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-white/60 transition active:scale-95"
        >
          {t("letters.back")}
        </button>
        <div className="mt-3 rounded-2xl bg-white/5 p-5">
          <span className="text-3xl">{selected.icon}</span>
          <h3 className="mt-2 text-lg font-bold">{titleOf(selected)}</h3>
          <p className="mt-0.5 text-xs text-white/45">{formatDate(selected.at)}</p>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/90">
            {bodyOf(selected)}
          </p>
          <p className="mt-5 text-end text-sm text-white/70">
            {t("letters.signature", { name: petName })}
          </p>
        </div>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <p className="whitespace-pre-line py-10 text-center text-sm text-white/50">
        {t("letters.empty", { name: petName })}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((l) => (
        <li key={l.id}>
          <button
            onClick={() => {
              onRead(l.id);
              setSelected(l);
            }}
            className="flex w-full items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-start transition active:scale-[0.98]"
          >
            <span className="text-2xl">{l.icon}</span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{titleOf(l)}</span>
              <span className="block text-xs text-white/45">{formatDate(l.at)}</span>
            </span>
            {!l.read && (
              <span
                className="h-2.5 w-2.5 rounded-full bg-pinkish"
                aria-label={t("letters.ariaUnread")}
              />
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

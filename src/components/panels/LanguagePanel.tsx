"use client";

import { LOCALES } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

/** 설정 최상단 언어 전환 섹션 — 10개 언어의 네이티브 표기 목록 */
export default function LanguagePanel() {
  const { t, locale, setLocale } = useI18n();

  return (
    <section className="rounded-2xl bg-white/5 p-4">
      <span className="text-sm font-semibold">{t("settings.language.title")}</span>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {LOCALES.map((l) => {
          const active = l.code === locale;
          return (
            <button
              key={l.code}
              onClick={() => setLocale(l.code)}
              dir={l.dir}
              aria-pressed={active}
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition active:scale-95 ${
                active
                  ? "bg-mint text-space-900"
                  : "bg-white/10 text-white/80 hover:bg-white/15"
              }`}
            >
              {l.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { SettleReport } from "@/lib/types";

export default function SettleModal({
  report,
  petName,
  onClose,
}: {
  report: SettleReport;
  petName: string;
  onClose: () => void;
}) {
  const { t, formatNumber } = useI18n();

  const away = (ms: number): string => {
    const min = Math.floor(ms / 60_000);
    if (min < 60) return t("time.minutes", { n: min });
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? t("time.hoursMinutes", { h, m }) : t("time.hours", { h });
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center px-8">
      <div className="absolute inset-0 bg-black/65" />
      <div className="anim-pop relative w-full rounded-3xl bg-space-700 p-6 text-center">
        <span className="text-4xl">💫</span>
        <h2 className="mt-2 text-xl font-bold">{t("settle.title")}</h2>
        <p className="mt-1 text-sm text-white/60">
          {t("settle.awayLine", { time: away(report.awayMs), name: petName })}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <div className="rounded-2xl bg-white/5 py-3 text-sm">
            {t("settle.debris", { n: formatNumber(report.debrisGained) })}
          </div>
          {report.lettersGained > 0 && (
            <div className="rounded-2xl bg-white/5 py-3 text-sm">
              {t("settle.letters", { n: report.lettersGained })}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-mint py-3.5 font-bold text-space-900 transition active:scale-95"
        >
          {t("settle.cta")}
        </button>
      </div>
    </div>
  );
}

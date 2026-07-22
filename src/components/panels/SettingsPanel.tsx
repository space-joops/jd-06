"use client";

import { useState } from "react";
import LanguagePanel from "@/components/panels/LanguagePanel";
import SharePanel from "@/components/panels/SharePanel";
import type { PwaApi } from "@/hooks/usePwa";
import { useI18n } from "@/i18n/I18nProvider";
import type { ShareStats } from "@/lib/share";

export default function SettingsPanel({
  pwa,
  onReset,
  onPlayCollect,
  shareStats,
}: {
  pwa: PwaApi;
  onReset: () => void;
  /** 제공되면 "함께 수거하기" 연습 버튼 노출 (궤도 단계에서 언제나 실행) */
  onPlayCollect?: () => void;
  /** 제공되면 소셜 공유 섹션 노출 (궤도 단계에서 자랑) */
  shareStats?: ShareStats;
}) {
  const { t } = useI18n();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* 언어 / Language */}
      <LanguagePanel />

      {/* 친구에게 자랑하기 */}
      {shareStats && <SharePanel stats={shareStats} />}

      {/* 함께 수거하기 (언제나) */}
      {onPlayCollect && (
        <section className="rounded-2xl bg-white/5 p-4">
          <span className="text-sm font-semibold">{t("settings.coop.title")}</span>
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            {t("settings.coop.desc")}
          </p>
          <button
            onClick={onPlayCollect}
            className="mt-3 w-full rounded-xl bg-mint py-2.5 text-sm font-bold text-space-900 transition active:scale-95"
          >
            {t("settings.coop.cta")}
          </button>
        </section>
      )}

      {/* 재회 알림 */}
      <section className="rounded-2xl bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{t("settings.notify.title")}</span>
          {pwa.notifSupported ? (
            <button
              onClick={() => void pwa.toggleAlarm()}
              aria-label={t("settings.notify.aria")}
              className={`h-7 w-12 rounded-full p-0.5 transition ${
                pwa.alarmEnabled ? "bg-mint" : "bg-white/15"
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transition-transform ${
                  pwa.alarmEnabled ? "translate-x-5 rtl:-translate-x-5" : ""
                }`}
              />
            </button>
          ) : (
            <span className="text-xs text-white/45">{t("settings.notify.unsupported")}</span>
          )}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-white/55">
          {t("settings.notify.desc")}
        </p>
        {pwa.notifSupported && pwa.notifPermission === "denied" && (
          <p className="mt-2 text-xs text-[#ff8a80]">{t("settings.notify.denied")}</p>
        )}
      </section>

      {/* 앱 설치 */}
      <section className="rounded-2xl bg-white/5 p-4">
        <span className="text-sm font-semibold">{t("settings.install.title")}</span>
        {pwa.installState === "installed" ? (
          <p className="mt-2 text-xs text-mint">{t("settings.install.installed")}</p>
        ) : pwa.installState === "installable" ? (
          <button
            onClick={() => void pwa.promptInstall()}
            className="mt-3 w-full rounded-xl bg-mint py-2.5 text-sm font-bold text-space-900 transition active:scale-95"
          >
            {t("settings.install.cta")}
          </button>
        ) : pwa.installState === "ios-guide" ? (
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            {t("settings.install.iosGuide")}
          </p>
        ) : (
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            {t("settings.install.genericGuide")}
          </p>
        )}
      </section>

      {/* 초기화 */}
      {confirming ? (
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm font-semibold">{t("settings.reset.confirmTitle")}</p>
          <p className="mt-1 text-xs text-white/55">{t("settings.reset.confirmDesc")}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm transition active:scale-95"
            >
              {t("settings.reset.cancel")}
            </button>
            <button
              onClick={onReset}
              className="flex-1 rounded-xl bg-[#ff8a80] py-2.5 text-sm font-bold text-space-900 transition active:scale-95"
            >
              {t("settings.reset.confirm")}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="rounded-2xl bg-white/5 py-3 text-sm text-white/70 transition active:scale-95"
        >
          {t("settings.reset.trigger")}
        </button>
      )}

      <p className="text-center text-xs text-white/35">
        {t("settings.footer", { version: pwa.version })}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { PwaApi } from "@/hooks/usePwa";
import { useI18n } from "@/i18n/I18nProvider";

const SNOOZE_KEY = "astropet-install-snooze-v1";
const SNOOZE_MS = 24 * 3600 * 1000;

/** 앱이 설치되어 있지 않으면 잠시 후 설치/안내 토스트를 띄운다 (닫으면 24시간 숨김) */
export default function InstallToast({ pwa }: { pwa: PwaApi }) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pwa.installState === "installed") {
      setVisible(false);
      return;
    }
    try {
      const snoozedUntil = Number(window.localStorage.getItem(SNOOZE_KEY) ?? 0);
      if (Date.now() < snoozedUntil) return;
    } catch {
      // ignore
    }
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, [pwa.installState]);

  if (!visible || pwa.installState === "installed") return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
    } catch {
      // ignore
    }
  };

  const message =
    pwa.installState === "installable"
      ? t("installToast.installable")
      : pwa.installState === "ios-guide"
        ? t("installToast.iosGuide")
        : t("installToast.genericGuide");

  return (
    <div className="anim-fadeup absolute inset-x-4 top-4 z-40 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 text-space-900 shadow-lg">
      <span className="text-xl">📲</span>
      <p className="flex-1 text-xs font-semibold leading-snug">{message}</p>
      {pwa.installState === "installable" && (
        <button
          onClick={() => {
            void pwa.promptInstall().then((ok) => {
              if (ok) setVisible(false);
            });
          }}
          className="shrink-0 rounded-xl bg-space-700 px-3 py-2 text-xs font-bold text-white transition active:scale-95"
        >
          {t("installToast.install")}
        </button>
      )}
      <button
        onClick={dismiss}
        aria-label={t("installToast.ariaDismiss")}
        className="shrink-0 rounded-full bg-space-900/10 px-2.5 py-1.5 text-xs font-semibold transition active:scale-95"
      >
        {t("installToast.later")}
      </button>
    </div>
  );
}

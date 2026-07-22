"use client";

import { useEffect, useRef } from "react";
import { useGame, type GameApi } from "@/hooks/useGame";
import { usePwa, type PwaApi } from "@/hooks/usePwa";
import { I18nProvider, useI18n } from "@/i18n/I18nProvider";
import { orbitInfo } from "@/lib/game";
import { notifyApproach } from "@/lib/notify";
import { APP_VERSION } from "@/lib/version";
import InstallToast from "./InstallToast";
import Stars from "./Stars";
import SettleModal from "./panels/SettleModal";
import AdoptScreen from "./screens/AdoptScreen";
import EggScreen from "./screens/EggScreen";
import LaunchingScreen from "./screens/LaunchingScreen";
import NameScreen from "./screens/NameScreen";
import OrbitScreen from "./screens/OrbitScreen";
import PrepScreen from "./screens/PrepScreen";
import RaisingScreen from "./screens/RaisingScreen";

export default function Game() {
  return (
    <I18nProvider>
      <GameInner />
    </I18nProvider>
  );
}

function GameInner() {
  const api = useGame();
  const pwa = usePwa();
  const { t } = useI18n();

  // 재회 윈도우가 열리는 순간 로컬 알림 (탭이 백그라운드일 때만)
  const prevInWindow = useRef(false);
  useEffect(() => {
    if (!api || api.state.stage !== "orbit" || api.state.launchedAt === null) {
      prevInWindow.current = false;
      return;
    }
    const inWin = orbitInfo(api.state.launchedAt, api.now).inWindow;
    if (inWin && !prevInWindow.current) {
      void notifyApproach(
        t("notify.approachTitle", { name: api.state.pet.name }),
        t("notify.approachBody")
      );
    }
    prevInWindow.current = inWin;
  });

  return (
    <div className="space-bg fixed inset-0">
      <main className="relative mx-auto h-full w-full max-w-[430px] overflow-hidden sm:border-x sm:border-white/10">
        <Stars />
        {api ? <Screens api={api} pwa={pwa} /> : <Splash />}
        {api?.report && (
          <SettleModal
            report={api.report}
            petName={api.state.pet.name}
            onClose={api.dismissReport}
          />
        )}
        {pwa.updateReady && (
          <div className="anim-fadeup absolute inset-x-4 bottom-4 z-50 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 text-space-900 shadow-lg">
            <span className="flex-1 text-sm font-semibold">
              {t("update.banner")}
            </span>
            <button
              onClick={pwa.applyUpdate}
              className="rounded-xl bg-space-700 px-3.5 py-2 text-sm font-bold text-white transition active:scale-95"
            >
              {t("update.cta")}
            </button>
          </div>
        )}
        <InstallToast pwa={pwa} />
        {/* 모든 화면 공통 버전 표기 */}
        <p className="pointer-events-none absolute inset-x-0 bottom-0.5 z-20 text-center text-[10px] text-white/30">
          v{APP_VERSION}
        </p>
      </main>
    </div>
  );
}

function Screens({ api, pwa }: { api: GameApi; pwa: PwaApi }) {
  switch (api.state.stage) {
    case "adopt":
      return <AdoptScreen api={api} />;
    case "egg":
      return <EggScreen api={api} />;
    case "name":
      return <NameScreen api={api} />;
    case "raising":
      return <RaisingScreen api={api} />;
    case "prep":
      return <PrepScreen api={api} />;
    case "launching":
      return <LaunchingScreen api={api} />;
    case "orbit":
      return <OrbitScreen api={api} pwa={pwa} />;
  }
}

function Splash() {
  const { t } = useI18n();
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3">
      <span className="anim-twinkle text-4xl">✨</span>
      <h1 className="text-xl font-bold tracking-widest">{t("splash.title")}</h1>
    </div>
  );
}

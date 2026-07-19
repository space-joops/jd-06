"use client";

import { useEffect, useRef } from "react";
import { useGame, type GameApi } from "@/hooks/useGame";
import { usePwa, type PwaApi } from "@/hooks/usePwa";
import { orbitInfo } from "@/lib/game";
import { notifyApproach } from "@/lib/notify";
import { APP_VERSION } from "@/lib/version";
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
  const api = useGame();
  const pwa = usePwa();

  // 재회 윈도우가 열리는 순간 로컬 알림 (탭이 백그라운드일 때만)
  const prevInWindow = useRef(false);
  useEffect(() => {
    if (!api || api.state.stage !== "orbit" || api.state.launchedAt === null) {
      prevInWindow.current = false;
      return;
    }
    const inWin = orbitInfo(api.state.launchedAt, api.now).inWindow;
    if (inWin && !prevInWindow.current) void notifyApproach(api.state.pet.name);
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
              새 버전이 준비됐어요 ✨
            </span>
            <button
              onClick={pwa.applyUpdate}
              className="rounded-xl bg-space-700 px-3.5 py-2 text-sm font-bold text-white transition active:scale-95"
            >
              업데이트
            </button>
          </div>
        )}
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
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3">
      <span className="anim-twinkle text-4xl">✨</span>
      <h1 className="text-xl font-bold tracking-widest">아스트로펫</h1>
      <p className="absolute bottom-6 text-xs text-white/35">v{APP_VERSION}</p>
    </div>
  );
}

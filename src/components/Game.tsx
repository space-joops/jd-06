"use client";

import { useGame, type GameApi } from "@/hooks/useGame";
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

  return (
    <div className="space-bg fixed inset-0">
      <main className="relative mx-auto h-full w-full max-w-[430px] overflow-hidden sm:border-x sm:border-white/10">
        <Stars />
        {api ? <Screens api={api} /> : <Splash />}
        {api?.report && (
          <SettleModal
            report={api.report}
            petName={api.state.pet.name}
            onClose={api.dismissReport}
          />
        )}
      </main>
    </div>
  );
}

function Screens({ api }: { api: GameApi }) {
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
      return <OrbitScreen api={api} />;
  }
}

function Splash() {
  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3">
      <span className="anim-twinkle text-4xl">✨</span>
      <h1 className="text-xl font-bold tracking-widest">아스트로펫</h1>
    </div>
  );
}

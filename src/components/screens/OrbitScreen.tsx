"use client";

import { useRef, useState } from "react";
import SpacewalkGame, { type CollectResult } from "@/components/SpacewalkGame";
import Gauge, { moodColor } from "@/components/Gauge";
import { Hearts, useHearts } from "@/components/Hearts";
import OrbitView from "@/components/OrbitView";
import PetSvg from "@/components/PetSvg";
import DebrisPanel from "@/components/panels/DebrisPanel";
import LettersPanel from "@/components/panels/LettersPanel";
import SettingsPanel from "@/components/panels/SettingsPanel";
import Sheet from "@/components/panels/Sheet";
import type { GameApi } from "@/hooks/useGame";
import type { PwaApi } from "@/hooks/usePwa";
import { DEBRIS_DEFS, ORBIT_MS, REUNION_WINDOW_RATIO } from "@/lib/constants";
import { currentMood, formatMMSS, getExpression, orbitInfo } from "@/lib/game";
import type { DebrisId } from "@/lib/types";

type PanelKind = "letters" | "debris" | "settings" | null;

export default function OrbitScreen({ api, pwa }: { api: GameApi; pwa: PwaApi }) {
  const { state, now } = api;
  const orbit = orbitInfo(state.launchedAt ?? now, now);
  const mood = currentMood(state, now);
  const unread = state.letters.filter((l) => !l.read).length;

  const [panel, setPanel] = useState<PanelKind>(null);
  /** null = 게임 닫힘, "reunion" = 재회 윈도우(패스 소비), "free" = 설정에서 언제나 */
  const [collectMode, setCollectMode] = useState<"reunion" | "free" | null>(null);
  const { hearts, spawn } = useHearts();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snackUsed = state.lastSnackOrbit >= orbit.windowIndex;
  const coopUsed = state.lastCoopOrbit >= orbit.windowIndex;
  const farSide = orbit.phase > 0.25 && orbit.phase < 0.75;

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const onPetTap = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (api.doPet()) {
      spawn(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const onSnack = () => {
    if (api.doSnack()) {
      spawn(80 + Math.random() * 40, 40, "🍬");
      showToast("간식 냠냠! 기분이 확 좋아졌어요 💗");
    }
  };

  const openCoop = () => {
    if (coopUsed || !orbit.inWindow) return;
    setCollectMode("reunion");
  };

  const onCollectExit = (result: CollectResult) => {
    const mode = collectMode;
    setCollectMode(null);
    const got = api.doCollectResult(result.items, result.moodGain, {
      coopPass: mode === "reunion",
    });
    if (got.length === 0 && result.moodGain <= 0) return;
    const counts = new Map<DebrisId, number>();
    for (const id of got) counts.set(id, (counts.get(id) ?? 0) + 1);
    const parts = [...counts.entries()].map(([id, n]) => {
      const d = DEBRIS_DEFS.find((x) => x.id === id)!;
      return `${d.icon}${n}`;
    });
    if (result.moodGain > 0) parts.push(`💖+${Math.round(result.moodGain)}`);
    showToast(
      got.length > 0
        ? `수거 완료! ${parts.join(" · ")}`
        : `기분이 좋아졌어요 💖+${Math.round(result.moodGain)}`
    );
  };

  return (
    <div className="anim-fadeup relative z-10 flex h-full flex-col">
      {/* 헤더 */}
      <header className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{state.pet.name}</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70">
              {orbit.index + 1}번째 궤도
            </span>
          </div>
          <span className="text-sm tabular-nums text-white/85">
            🗑️ {state.debrisTotal.toLocaleString()}개
          </span>
        </div>
        <div className="mt-2.5">
          <Gauge label="기분" value={mood} color={moodColor(mood)} />
        </div>
      </header>

      {/* 궤도 시각화 */}
      <OrbitView
        phase={orbit.phase}
        inWindow={orbit.inWindow}
        color={state.pet.color}
      />

      {/* 상태 / 상호작용 존 */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-6 pb-2">
        {orbit.inWindow ? (
          <>
            <p className="font-semibold text-mint">
              💫 {state.pet.name}가 상공을 지나고 있어요!
            </p>
            <div
              className="relative -mt-1 w-40 cursor-pointer touch-none"
              onPointerDown={onPetTap}
            >
              <PetSvg
                color={state.pet.color}
                expression={getExpression(state, now)}
                suit={state.pet.suit}
                className="w-full"
              />
              <Hearts items={hearts} />
            </div>
            {/* 윈도우 남은 시간 */}
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-mint transition-all duration-1000"
                style={{
                  width: `${(orbit.windowRemainMs / (ORBIT_MS * REUNION_WINDOW_RATIO)) * 100}%`,
                }}
              />
            </div>
            <p className="mt-1 text-[11px] text-white/50">
              탭해서 쓰다듬어 주세요 · {formatMMSS(orbit.windowRemainMs)} 남음
            </p>
            <div className="mt-3 flex w-full gap-2.5">
              <button
                onClick={onSnack}
                disabled={snackUsed}
                className="flex-1 rounded-xl bg-white/10 py-3 text-sm font-semibold transition active:scale-95 disabled:opacity-35"
              >
                {snackUsed ? "간식 완료 ✔" : "간식 주기 🍬"}
              </button>
              <button
                onClick={openCoop}
                disabled={coopUsed}
                className="flex-1 rounded-xl bg-mint py-3 text-sm font-bold text-space-900 transition active:scale-95 disabled:opacity-35"
              >
                {coopUsed ? "수거 완료 ✔" : "함께 수거하기 🧑‍🚀"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-white/60">다음 재회까지</p>
            <p className="mt-1 font-mono text-5xl font-bold tabular-nums">
              {formatMMSS(orbit.nextWindowInMs)}
            </p>
            <p className="mt-3 text-center text-sm text-white/70">
              {farSide
                ? `${state.pet.name}는 지구 반대편을 돌며 수거 중이에요 🌌`
                : `${state.pet.name}가 우리 집 쪽으로 다가오고 있어요 ✨`}
            </p>
          </>
        )}
      </section>

      {/* 토스트 */}
      {toast && (
        <div className="anim-fadeup absolute inset-x-6 top-24 z-20 rounded-2xl bg-white/95 px-4 py-3 text-center text-sm font-semibold text-space-900 shadow-lg">
          {toast}
        </div>
      )}

      {/* 하단 네비 */}
      <nav className="flex justify-around px-8 pb-7 pt-1">
        <NavButton
          icon="💌"
          label="편지함"
          badge={unread}
          onClick={() => setPanel("letters")}
        />
        <NavButton icon="📒" label="도감" onClick={() => setPanel("debris")} />
        <NavButton icon="⚙️" label="설정" onClick={() => setPanel("settings")} />
      </nav>

      {/* 패널 */}
      {panel === "letters" && (
        <Sheet title="우주에서 온 편지" onClose={() => setPanel(null)}>
          <LettersPanel
            letters={state.letters}
            petName={state.pet.name}
            onRead={api.markLetterRead}
          />
        </Sheet>
      )}
      {panel === "debris" && (
        <Sheet title="우주쓰레기 도감" onClose={() => setPanel(null)}>
          <DebrisPanel debris={state.debris} total={state.debrisTotal} />
        </Sheet>
      )}
      {panel === "settings" && (
        <Sheet title="설정" onClose={() => setPanel(null)}>
          <SettingsPanel
            pwa={pwa}
            onReset={api.reset}
            onPlayCollect={() => {
              setPanel(null);
              setCollectMode("free");
            }}
          />
        </Sheet>
      )}

      {/* 함께 수거하기: 우주유영 게임 */}
      {collectMode && (
        <SpacewalkGame
          color={state.pet.color}
          suit={state.pet.suit}
          onExit={onCollectExit}
        />
      )}
    </div>
  );
}

function NavButton({
  icon,
  label,
  badge,
  onClick,
}: {
  icon: string;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 transition active:scale-95"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-[11px] text-white/70">{label}</span>
      {badge != null && badge > 0 && (
        <span className="absolute -top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pinkish px-1 text-[11px] font-bold text-space-900">
          {badge}
        </span>
      )}
    </button>
  );
}

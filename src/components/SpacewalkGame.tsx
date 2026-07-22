"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PetSvg from "@/components/PetSvg";
import {
  DEBRIS_DEFS,
  DEBRIS_MAX_ON_SCREEN,
  DEBRIS_SPAWN_MS,
  GAS_BURN_PER_SEC,
  GAS_HAZARD_PENALTY,
  GAS_MAX,
  HAZARD_SPAWN_MS,
  JOY_RADIUS,
  MOOD_ITEM_CHANCE,
  MOOD_ITEM_GAIN,
  PET_RADIUS,
  RARITY_MASS_KG,
  SAT_REFUEL,
  SAT_SPAWN_MS,
  SPACE_DRAG,
  STARLINK_TRAIN,
  THRUST_ACCEL,
} from "@/lib/constants";
import { DEBRIS_DATAURL } from "@/lib/debris";
import { rollDebris } from "@/lib/game";
import { drawSatellite, SAT_DEFS, STARLINK_DEF, type SatelliteDef } from "@/lib/satellites";
import type { DebrisId, PetColor, SuitColor } from "@/lib/types";

const ICON = Object.fromEntries(DEBRIS_DEFS.map((d) => [d.id, d.icon])) as Record<DebrisId, string>;
const MASS = Object.fromEntries(
  DEBRIS_DEFS.map((d) => [d.id, RARITY_MASS_KG[d.rarity]])
) as Record<DebrisId, number>;
const MOOD_ICONS = ["💖", "🍬", "🩵"];
const SAT_POOL = SAT_DEFS.filter((s) => s.id !== "starlink");

export interface CollectResult {
  items: DebrisId[];
  moodGain: number;
}

interface Debris {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  icon: string;
  id: DebrisId | null; // null = 기분 아이템 또는 위험물 (도감 미반영)
  hazard: boolean; // true = 충돌 금지(가스 감소)
  r: number;
}
type SatKindRun = "front" | "side" | "train";
interface Sat {
  def: SatelliteDef;
  kind: SatKindRun;
  t: number;
  speed: number;
  ax: number;
  ay: number;
  bx: number;
  by: number;
  cx: number;
  cy: number;
  base: number;
  peak: number;
  gassed: boolean;
  boomed: boolean;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  c: string;
  sz: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const bez = (a: number, b: number, c: number, t: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

/** 위성 진행도 t에서의 원근 스케일 (플라이바이 곡선) */
function satScale(sat: Sat): number {
  const t = clamp(sat.t, 0, 1);
  if (sat.kind === "front") return sat.base + (sat.peak - sat.base) * Math.pow(t, 2.1);
  if (sat.kind === "side") return sat.base + (sat.peak - sat.base) * Math.sin(Math.PI * t * 0.92);
  return sat.base + (sat.peak - sat.base) * Math.sin(Math.PI * t);
}
/** 위성 화면 좌표. front는 가속(멀리선 천천히→가까이선 빠르게) */
function satAt(sat: Sat, tOverride?: number): { x: number; y: number } {
  const raw = clamp(tOverride ?? sat.t, 0, 1);
  const te = sat.kind === "front" ? Math.pow(raw, 1.9) : raw;
  return { x: bez(sat.ax, sat.bx, sat.cx, te), y: bez(sat.ay, sat.by, sat.cy, te) };
}

/**
 * 함께 수거하기 — 우주유영 아케이드 게임.
 * 조이스틱으로 분사 이동해 우주쓰레기를 수거하고, 근접 플라이바이하는 위성과 만나 가스를
 * 충전한다. 붉은 위험물은 피해야 하고, 분사 가스가 0이 되면 종료.
 */
export default function SpacewalkGame({
  color,
  suit,
  onExit,
}: {
  color: PetColor;
  suit: SuitColor | null;
  onExit: (result: CollectResult) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [summary, setSummary] = useState<{ count: number; kg: number; mood: number } | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petRef = useRef<HTMLDivElement>(null);
  const gasFillRef = useRef<HTMLDivElement>(null);
  const gasNumRef = useRef<HTMLSpanElement>(null);
  const moodFillRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  const doneRef = useRef(false);
  const overRef = useRef(false);
  const collectedRef = useRef<DebrisId[]>([]);
  const moodGainRef = useRef(0);
  const spritesRef = useRef<Partial<Record<DebrisId, CanvasImageSource>>>({});

  useEffect(() => setMounted(true), []);

  // 우주쓰레기 SVG를 오프스크린 캔버스 스프라이트로 미리 래스터화 (매 프레임 blit)
  useEffect(() => {
    (Object.keys(DEBRIS_DATAURL) as DebrisId[]).forEach((id) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = 64;
        c.height = 64;
        c.getContext("2d")?.drawImage(img, 0, 0, 64, 64);
        spritesRef.current[id] = c;
      };
      img.src = DEBRIS_DATAURL[id];
    });
  }, []);

  // onExit 최신 참조 유지
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  const exit = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onExitRef.current({ items: collectedRef.current, moodGain: moodGainRef.current });
  };

  useEffect(() => {
    if (!mounted) return;
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = wrap.clientWidth;
    let H = wrap.clientHeight;
    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Web Audio (근접 플라이바이 "웅" 사운드) ──
    let audio: AudioContext | null = null;
    const ensureAudio = () => {
      try {
        if (!audio) {
          const AC =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (AC) audio = new AC();
        }
        if (audio && audio.state === "suspended") void audio.resume();
      } catch {
        /* 오디오 미지원 무시 */
      }
    };
    const playWoong = () => {
      if (!audio) return;
      try {
        const t0 = audio.currentTime;
        const o = audio.createOscillator();
        const o2 = audio.createOscillator();
        const g = audio.createGain();
        const f = audio.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = 340;
        o.type = "sine";
        o2.type = "triangle";
        o.frequency.setValueAtTime(44, t0);
        o.frequency.exponentialRampToValueAtTime(92, t0 + 0.55);
        o2.frequency.setValueAtTime(66, t0);
        o2.detune.value = -6;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.32, t0 + 0.22);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.15);
        o.connect(f);
        o2.connect(f);
        f.connect(g);
        g.connect(audio.destination);
        o.start(t0);
        o2.start(t0);
        o.stop(t0 + 1.2);
        o2.stop(t0 + 1.2);
      } catch {
        /* 무시 */
      }
    };

    // ── 게임 상태 ──
    const pet = { x: W / 2, y: H * 0.42, vx: 0, vy: 0 };
    let gas = GAS_MAX;
    const debris: Debris[] = [];
    const sats: Sat[] = [];
    const parts: Particle[] = [];
    const joy = { active: false, ox: 0, oy: 0, kx: 0, ky: 0 };
    let earthAngle = 0;
    let moonAngle = -0.6;
    let gameTime = 0;
    let shake = 0;
    let debrisTimer = 0;
    let hazardTimer = -1500;
    let satTimer = SAT_SPAWN_MS - 3000;

    // ── 조이스틱 입력 ──
    const localXY = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onDown = (e: PointerEvent) => {
      if (overRef.current) return;
      ensureAudio();
      const [x, y] = localXY(e);
      joy.active = true;
      joy.ox = x;
      joy.oy = y;
      joy.kx = x;
      joy.ky = y;
    };
    const onMove = (e: PointerEvent) => {
      if (!joy.active) return;
      const [x, y] = localXY(e);
      joy.kx = x;
      joy.ky = y;
    };
    const onUp = () => {
      joy.active = false;
    };
    const touch = wrap.querySelector<HTMLDivElement>("[data-touch]")!;
    touch.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // ── 스폰 ──
    const edgeSpawn = (): { x: number; y: number; vx: number; vy: number } => {
      const side = Math.floor(Math.random() * 4);
      const m = 44;
      let x = 0;
      let y = 0;
      if (side === 0) {
        x = Math.random() * W;
        y = -m;
      } else if (side === 1) {
        x = W + m;
        y = Math.random() * H * 0.8;
      } else if (side === 2) {
        x = Math.random() * W;
        y = H * 0.7 + Math.random() * H * 0.2;
      } else {
        x = -m;
        y = Math.random() * H * 0.8;
      }
      const tx = W * (0.28 + Math.random() * 0.44);
      const ty = H * (0.24 + Math.random() * 0.42);
      const dx = tx - x;
      const dy = ty - y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = 26 + Math.random() * 30;
      return { x, y, vx: (dx / d) * sp, vy: (dy / d) * sp };
    };

    const spawnDebris = () => {
      if (debris.length >= DEBRIS_MAX_ON_SCREEN) return;
      const s = edgeSpawn();
      const isMood = Math.random() < MOOD_ITEM_CHANCE;
      const id = isMood ? null : rollDebris();
      debris.push({
        ...s,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 1.4,
        icon: isMood ? MOOD_ICONS[Math.floor(Math.random() * MOOD_ICONS.length)] : ICON[id!],
        id,
        hazard: false,
        r: isMood ? 15 : 16,
      });
    };

    const spawnHazard = () => {
      if (debris.length >= DEBRIS_MAX_ON_SCREEN) return;
      const s = edgeSpawn();
      debris.push({
        x: s.x,
        y: s.y,
        vx: s.vx * 1.15,
        vy: s.vy * 1.15,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 2.4,
        icon: "",
        id: null,
        hazard: true,
        r: 19,
      });
    };

    const spawnSat = () => {
      if (sats.length > 0) return; // 한 번에 한 종류만
      const roll = Math.random();
      if (roll < 0.3) {
        // 스타링크 트레인 — 멀리서 다가와 화면 옆으로 빠짐 (가까이 오지 않음)
        const fromLeft = Math.random() < 0.5;
        const ay0 = H * (0.1 + Math.random() * 0.13);
        const cy0 = H * (0.28 + Math.random() * 0.26);
        const ax0 = fromLeft ? -W * 0.15 : W * 1.15;
        const cx0 = fromLeft ? W * 1.15 : -W * 0.15;
        const bx0 = W * 0.5;
        const by0 = H * (0.05 + Math.random() * 0.1);
        const sp = 1 / (10 + Math.random() * 3);
        for (let i = 0; i < STARLINK_TRAIN; i++)
          sats.push({
            def: STARLINK_DEF,
            kind: "train",
            t: -i * 0.09,
            speed: sp,
            ax: ax0,
            ay: ay0,
            bx: bx0,
            by: by0,
            cx: cx0,
            cy: cy0,
            base: 0.2,
            peak: 0.5,
            gassed: false,
            boomed: false,
          });
        return;
      }
      const def = SAT_POOL[Math.floor(Math.random() * SAT_POOL.length)];
      if (roll < 0.66) {
        // front — 아주 멀리서 천천히 다가와 화면 앞으로 크게 통과 (웅장)
        const eSide = Math.floor(Math.random() * 3);
        let cx0 = W * 0.5;
        let cy0 = H * 1.22;
        if (eSide === 1) {
          cx0 = -W * 0.2;
          cy0 = H * (0.7 + Math.random() * 0.4);
        } else if (eSide === 2) {
          cx0 = W * 1.2;
          cy0 = H * (0.7 + Math.random() * 0.4);
        }
        sats.push({
          def,
          kind: "front",
          t: 0,
          speed: 1 / (7 + Math.random() * 2),
          ax: W * (0.35 + Math.random() * 0.3),
          ay: H * (0.08 + Math.random() * 0.12),
          bx: W * (0.35 + Math.random() * 0.3),
          by: H * (0.45 + Math.random() * 0.15),
          cx: cx0,
          cy: cy0,
          base: 0.16,
          peak: def.r >= 30 ? 2.6 : 2.1,
          gassed: false,
          boomed: false,
        });
      } else {
        // side — 다가오다 말고 사이드로 빠짐 (적당한 크기)
        const fromRight = Math.random() < 0.5;
        sats.push({
          def,
          kind: "side",
          t: 0,
          speed: 1 / (5 + Math.random() * 2),
          ax: W * (0.3 + Math.random() * 0.4),
          ay: H * (0.06 + Math.random() * 0.12),
          bx: W * (0.4 + Math.random() * 0.2),
          by: H * (0.28 + Math.random() * 0.16),
          cx: fromRight ? W * 1.2 : -W * 0.2,
          cy: H * (0.32 + Math.random() * 0.3),
          base: 0.16,
          peak: 0.95,
          gassed: false,
          boomed: false,
        });
      }
    };

    const burst = (x: number, y: number, n: number, c: string, spd: number, life: number) => {
      for (let k = 0; k < n; k++)
        parts.push({
          x,
          y,
          vx: (Math.random() - 0.5) * spd,
          vy: (Math.random() - 0.5) * spd,
          life,
          max: life,
          c,
          sz: 2,
        });
    };

    // ── 루프 ──
    let raf = 0;
    let last = 0;
    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = ts;
      const dt = clamp((ts - last) / 1000, 0, 0.05);
      last = ts;

      gameTime += dt;
      earthAngle += dt * 0.05;
      moonAngle += dt * 0.16;
      shake = Math.max(0, shake - dt * 26);

      if (!overRef.current) {
        // 분사
        if (joy.active && gas > 0) {
          const dx = joy.kx - joy.ox;
          const dy = joy.ky - joy.oy;
          const dist = Math.hypot(dx, dy);
          const mag = clamp(dist / JOY_RADIUS, 0, 1);
          if (mag > 0.06) {
            const nx = dx / dist;
            const ny = dy / dist;
            pet.vx += nx * THRUST_ACCEL * mag * dt;
            pet.vy += ny * THRUST_ACCEL * mag * dt;
            gas = Math.max(0, gas - GAS_BURN_PER_SEC * mag * dt);
            // 분출량에 따라 색: 약=청록, 중=호박, 강=주황
            const col = mag > 0.72 ? "#ff9a5a" : mag > 0.42 ? "#ffd27a" : "#8fd3ff";
            const n = 1 + Math.floor(mag * 2.5);
            for (let i = 0; i < n; i++)
              parts.push({
                x: pet.x - nx * PET_RADIUS,
                y: pet.y - ny * PET_RADIUS,
                vx: -nx * (120 + mag * 90) + (Math.random() - 0.5) * 60,
                vy: -ny * (120 + mag * 90) + (Math.random() - 0.5) * 60,
                life: 0.5,
                max: 0.5,
                c: col,
                sz: 1.6 + mag * 1.8,
              });
          }
        }
        // 관성 감쇠
        const damp = 1 - SPACE_DRAG * dt;
        pet.vx *= damp;
        pet.vy *= damp;
        pet.x += pet.vx * dt;
        pet.y += pet.vy * dt;
        if (pet.x < PET_RADIUS) {
          pet.x = PET_RADIUS;
          pet.vx = Math.abs(pet.vx) * 0.4;
        } else if (pet.x > W - PET_RADIUS) {
          pet.x = W - PET_RADIUS;
          pet.vx = -Math.abs(pet.vx) * 0.4;
        }
        if (pet.y < PET_RADIUS) {
          pet.y = PET_RADIUS;
          pet.vy = Math.abs(pet.vy) * 0.4;
        } else if (pet.y > H - PET_RADIUS) {
          pet.y = H - PET_RADIUS;
          pet.vy = -Math.abs(pet.vy) * 0.4;
        }

        // 스폰 타이머
        debrisTimer += dt * 1000;
        if (debrisTimer >= DEBRIS_SPAWN_MS) {
          debrisTimer = 0;
          spawnDebris();
        }
        hazardTimer += dt * 1000;
        if (hazardTimer >= HAZARD_SPAWN_MS) {
          hazardTimer = 0;
          spawnHazard();
        }
        satTimer += dt * 1000;
        if (satTimer >= SAT_SPAWN_MS) {
          satTimer = 0;
          spawnSat();
        }

        if (gas <= 0) {
          overRef.current = true;
          const kg = collectedRef.current.reduce((s, x) => s + MASS[x], 0);
          setSummary({
            count: collectedRef.current.length,
            kg: Math.round(kg * 10) / 10,
            mood: Math.round(moodGainRef.current),
          });
        }
      }

      // 쓰레기/위험물 업데이트 + 충돌
      for (let i = debris.length - 1; i >= 0; i--) {
        const d = debris[i];
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.rot += d.vr * dt;
        if (d.x < -60 || d.x > W + 60 || d.y < -60 || d.y > H + 60) {
          debris.splice(i, 1);
          continue;
        }
        if (overRef.current) continue;
        const hit = Math.hypot(d.x - pet.x, d.y - pet.y) < PET_RADIUS + d.r;
        if (!hit) continue;
        if (d.hazard) {
          gas = Math.max(0, gas - GAS_HAZARD_PENALTY);
          shake = Math.max(shake, 9);
          burst(d.x, d.y, 12, "#ff7a4a", 200, 0.5);
        } else if (d.id) {
          collectedRef.current.push(d.id);
          burst(d.x, d.y, 6, "#cfe9ff", 140, 0.4);
        } else {
          moodGainRef.current += MOOD_ITEM_GAIN;
          burst(d.x, d.y, 6, "#f9c6e4", 140, 0.4);
        }
        debris.splice(i, 1);
      }

      // 위성 업데이트 + 근접 충전/웅장 효과
      for (let i = sats.length - 1; i >= 0; i--) {
        const s = sats[i];
        s.t += s.speed * dt;
        if (s.t > 1.08) {
          sats.splice(i, 1);
          continue;
        }
        if (s.t < 0 || s.t > 1) continue;
        const { x: sx, y: sy } = satAt(s);
        const scale = satScale(s);
        if (!overRef.current && !s.gassed && Math.hypot(sx - pet.x, sy - pet.y) < PET_RADIUS + s.def.r * scale * 0.55) {
          s.gassed = true;
          gas = Math.min(GAS_MAX, gas + SAT_REFUEL);
          burst(sx, sy, 16, "#8affd0", 190, 0.6);
        }
        if (s.kind === "front" && !s.boomed && scale > 1.3) {
          s.boomed = true;
          shake = Math.max(shake, 13);
          playWoong();
        }
      }

      // 파티클
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= dt;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      const shx = shake > 0.3 ? (Math.random() * 2 - 1) * shake : 0;
      const shy = shake > 0.3 ? (Math.random() * 2 - 1) * shake : 0;
      draw(ctx, W, H, {
        earthAngle,
        moonAngle,
        sats,
        debris,
        parts,
        joy,
        sprites: spritesRef.current,
        time: gameTime,
        shx,
        shy,
      });

      // 펫 DOM 갱신 (+ 흔들림)
      if (petRef.current) {
        const tilt = clamp(pet.vx * 0.05, -22, 22);
        petRef.current.style.transform = `translate(${pet.x - 34 + shx}px, ${pet.y - 34 + shy}px) rotate(${tilt}deg)`;
      }
      if (gasFillRef.current) gasFillRef.current.style.width = `${(gas / GAS_MAX) * 100}%`;
      if (gasNumRef.current) gasNumRef.current.textContent = String(Math.ceil(gas));
      if (moodFillRef.current) moodFillRef.current.style.width = `${clamp(moodGainRef.current, 0, 100)}%`;
      if (countRef.current) countRef.current.textContent = String(collectedRef.current.length);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      touch.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      try {
        void audio?.close();
      } catch {
        /* 무시 */
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-center bg-space-900">
      <div ref={wrapRef} className="relative h-full w-full max-w-[430px] overflow-hidden space-bg">
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* 펫 (DOM 오버레이) */}
        <div
          ref={petRef}
          className="pointer-events-none absolute left-0 top-0 h-[68px] w-[68px] will-change-transform"
        >
          <PetSvg color={color} suit={suit} expression="excited" />
        </div>

        {/* 터치 레이어 (조이스틱 입력) */}
        <div data-touch className="absolute inset-0 z-20 touch-none" />

        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-4 pt-6">
          <div className="flex items-start justify-between gap-3">
            <button
              onClick={exit}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="닫기"
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-lg text-white/85 transition active:scale-90"
            >
              ✕
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/80">
                <span>🔥 분사 가스</span>
                <span ref={gasNumRef} className="tabular-nums text-star">
                  {GAS_MAX}
                </span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/12">
                <div
                  ref={gasFillRef}
                  className="h-full rounded-full bg-gradient-to-r from-[#ffd27a] to-[#ff8a80]"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div ref={moodFillRef} className="h-full rounded-full bg-mint" style={{ width: "0%" }} />
              </div>
            </div>
            <div className="rounded-xl bg-black/25 px-2.5 py-1 text-center">
              <p className="text-sm font-bold tabular-nums text-white">
                🗑️ <span ref={countRef}>0</span>
              </p>
              <p className="text-[10px] text-white/55">수거</p>
            </div>
          </div>
        </div>

        {/* 하단 안내 */}
        {!summary && (
          <p className="pointer-events-none absolute inset-x-0 bottom-6 z-30 text-center text-xs text-white/70">
            화면을 끌어 유영 · 위성과 만나면 가스 충전 · 붉은 파편은 피해요 ☄️
          </p>
        )}

        {/* 게임오버 정산 */}
        {summary && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-space-900/70 px-8">
            <div className="anim-pop w-full max-w-[300px] rounded-3xl bg-space-700 p-6 text-center">
              <p className="text-3xl">🧑‍🚀</p>
              <p className="mt-2 text-lg font-bold">유영 종료!</p>
              <p className="mt-1 text-xs text-white/60">분사 가스를 다 썼어요</p>
              <div className="mt-4 space-y-1 text-sm">
                <p>
                  🗑️ 우주쓰레기 <b className="text-mint">{summary.count}</b>개 · {summary.kg}kg
                </p>
                {summary.mood > 0 && (
                  <p>
                    💖 기분 <b className="text-mint">+{summary.mood}</b>
                  </p>
                )}
              </div>
              <button
                onClick={exit}
                className="mt-5 w-full rounded-xl bg-mint py-3 text-sm font-bold text-space-900 transition active:scale-95"
              >
                도감에 담기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ── 캔버스 렌더 ──────────────────────────────────────────────────────
function draw(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  s: {
    earthAngle: number;
    moonAngle: number;
    sats: Sat[];
    debris: Debris[];
    parts: Particle[];
    joy: { active: boolean; ox: number; oy: number; kx: number; ky: number };
    sprites: Partial<Record<DebrisId, CanvasImageSource>>;
    time: number;
    shx: number;
    shy: number;
  }
) {
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(s.shx, s.shy);

  const bigR = W * 0.95;
  const cx = W / 2;
  const cy = H + bigR - H * 0.2;

  // 달 (지구 뒤에서 뜨고 짐)
  const mx = cx + Math.cos(s.moonAngle) * W * 0.62;
  const my = cy - Math.sin(s.moonAngle) * bigR * 1.02 * 0.5;
  ctx.fillStyle = "#d8dae0";
  ctx.beginPath();
  ctx.arc(mx, my, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(150,155,165,0.6)";
  ctx.beginPath();
  ctx.arc(mx - 5, my - 4, 3, 0, Math.PI * 2);
  ctx.arc(mx + 4, my + 3, 4, 0, Math.PI * 2);
  ctx.arc(mx + 6, my - 5, 2, 0, Math.PI * 2);
  ctx.fill();

  // 위성 (지구 뒤에서 나오도록 지구보다 먼저) — 플라이바이 + 본체 영어 라벨
  for (const sat of s.sats) {
    if (sat.t < 0 || sat.t > 1) continue;
    const { x, y } = satAt(sat);
    const nxt = satAt(sat, Math.min(1, sat.t + 0.02));
    const scale = satScale(sat);
    const ang = Math.atan2(nxt.y - y, nxt.x - x);
    ctx.save();
    ctx.translate(x, y);
    ctx.save();
    ctx.globalAlpha = clamp(scale * 1.4, 0.25, 1);
    ctx.rotate(ang);
    ctx.scale(scale, scale);
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 6;
    drawSatellite(ctx, sat.def);
    ctx.restore();
    if (sat.def.label && scale > 0.6) {
      const fs = clamp(9 * scale, 8, 20);
      ctx.globalAlpha = clamp((scale - 0.6) * 1.6, 0, 0.92);
      ctx.font = `700 ${fs}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = fs * 0.3;
      ctx.strokeStyle = "rgba(10,14,26,0.72)";
      ctx.strokeText(sat.def.label, 0, 0);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(sat.def.label, 0, 0);
    }
    ctx.restore();
  }

  // 지구 (대기권 글로우 + 자전 대륙)
  ctx.save();
  ctx.fillStyle = "rgba(124,199,255,0.13)";
  ctx.beginPath();
  ctx.arc(cx, cy, bigR + 10, 0, Math.PI * 2);
  ctx.fill();
  const g = ctx.createRadialGradient(cx, cy - bigR * 0.5, bigR * 0.1, cx, cy, bigR);
  g.addColorStop(0, "#a5ddff");
  g.addColorStop(0.45, "#5da4ec");
  g.addColorStop(1, "#2a5cb8");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, bigR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, bigR, 0, Math.PI * 2);
  ctx.clip();
  ctx.translate(cx, cy);
  ctx.rotate(s.earthAngle);
  ctx.fillStyle = "rgba(121,217,143,0.9)";
  const blob = (bx: number, by: number, rx: number, ry: number, rot: number) => {
    ctx.save();
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  blob(-bigR * 0.3, -bigR * 0.6, bigR * 0.22, bigR * 0.12, 0.2);
  blob(bigR * 0.35, -bigR * 0.5, bigR * 0.28, bigR * 0.16, -0.1);
  blob(bigR * 0.05, -bigR * 0.78, bigR * 0.16, bigR * 0.08, 0.5);
  blob(-bigR * 0.55, -bigR * 0.35, bigR * 0.18, bigR * 0.1, 0.9);
  ctx.restore();

  // 파티클
  for (const p of s.parts) {
    const a = p.life / p.max;
    ctx.globalAlpha = a;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.sz + a * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 쓰레기(SVG 스프라이트) · 기분 아이템(이모지) · 위험물(고온 파편)
  for (const d of s.debris) {
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rot);
    if (d.hazard) {
      drawHazard(ctx, d.r, s.time);
    } else {
      const spr = d.id ? s.sprites[d.id] : undefined;
      if (spr) {
        const sz = d.r * 2.7;
        ctx.shadowColor = "rgba(0,0,0,0.45)";
        ctx.shadowBlur = 5;
        ctx.drawImage(spr, -sz / 2, -sz / 2, sz, sz);
      } else {
        ctx.font = "26px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(249,168,212,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillText(d.icon, 0, 0);
      }
    }
    ctx.restore();
  }

  ctx.restore(); // shake

  // 조이스틱 (흔들림 미적용, 화면 고정)
  if (s.joy.active) {
    const dx = s.joy.kx - s.joy.ox;
    const dy = s.joy.ky - s.joy.oy;
    const dist = Math.hypot(dx, dy);
    const k = dist > JOY_RADIUS ? JOY_RADIUS / dist : 1;
    const kx = s.joy.ox + dx * k;
    const ky = s.joy.oy + dy * k;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s.joy.ox, s.joy.oy, JOY_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(125,232,195,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(s.joy.ox, s.joy.oy, JOY_RADIUS * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.moveTo(s.joy.ox, s.joy.oy);
    ctx.lineTo(kx, ky);
    ctx.stroke();
    ctx.fillStyle = "rgba(125,232,195,0.9)";
    ctx.beginPath();
    ctx.arc(kx, ky, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/** 붉은 고온 파편(위험물) — 충돌 금지. 스파이크 실루엣 + 맥동 글로우 */
function drawHazard(ctx: CanvasRenderingContext2D, r: number, time: number) {
  const pulse = 0.82 + 0.18 * Math.sin(time * 6);
  ctx.save();
  ctx.shadowColor = "rgba(255,80,30,0.9)";
  ctx.shadowBlur = 16 * pulse;
  const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
  g.addColorStop(0, "#fff2c8");
  g.addColorStop(0.4, "#ff7a2c");
  g.addColorStop(1, "#a11d12");
  ctx.fillStyle = g;
  ctx.beginPath();
  const spikes = 7;
  for (let i = 0; i < spikes * 2; i++) {
    const a = (Math.PI / spikes) * i;
    const rr = i % 2 ? r * 0.58 : r;
    const px = Math.cos(a) * rr;
    const py = Math.sin(a) * rr;
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,244,205,0.92)";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PetSvg from "@/components/PetSvg";
import {
  DEBRIS_DEFS,
  DEBRIS_MAX_ON_SCREEN,
  DEBRIS_SPAWN_MS,
  GAS_BURN_PER_SEC,
  GAS_MAX,
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
import { rollDebris } from "@/lib/game";
import { drawSatellite, SAT_DEFS, STARLINK_DEF, type SatelliteDef } from "@/lib/satellites";
import type { DebrisId, PetColor, SuitColor } from "@/lib/types";

const ICON = Object.fromEntries(DEBRIS_DEFS.map((d) => [d.id, d.icon])) as Record<DebrisId, string>;
const MASS = Object.fromEntries(
  DEBRIS_DEFS.map((d) => [d.id, RARITY_MASS_KG[d.rarity]])
) as Record<DebrisId, number>;
const MOOD_ICONS = ["💖", "🍬", "🩵"];

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
  id: DebrisId | null; // null = 기분 아이템 (도감 미반영)
  r: number;
}
interface Sat {
  def: SatelliteDef;
  t: number;
  speed: number;
  p0: [number, number];
  p1: [number, number];
  p2: [number, number];
  gassed: boolean;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const bez = (a: number, b: number, c: number, t: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

/**
 * 함께 수거하기 — 우주유영 아케이드 게임.
 * 화면을 끌어 가상 조이스틱으로 분사 이동, 사방의 우주쓰레기를 수거하고 위성과 만나 가스를
 * 충전한다. 분사 가스가 0이 되면 종료. 캔버스 rAF 루프(물리 기반 — 이 앱의 CSS 애니메이션
 * 규약의 의도된 예외)로 구동.
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

  useEffect(() => setMounted(true), []);

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

    // ── 게임 상태 ──
    const pet = { x: W / 2, y: H * 0.42, vx: 0, vy: 0 };
    let gas = GAS_MAX;
    const debris: Debris[] = [];
    const sats: Sat[] = [];
    const parts: Particle[] = [];
    const joy = { active: false, ox: 0, oy: 0, kx: 0, ky: 0 };
    let earthAngle = 0;
    let moonAngle = -0.6;
    let debrisTimer = 0;
    let satTimer = 1500;

    // ── 조이스틱 입력 ──
    const localXY = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onDown = (e: PointerEvent) => {
      if (overRef.current) return;
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
    const spawnDebris = () => {
      if (debris.length >= DEBRIS_MAX_ON_SCREEN) return;
      const side = Math.floor(Math.random() * 4);
      const m = 40;
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
      // 화면 안쪽(펫 근처 랜덤 지점)으로 표류
      const tx = W * (0.3 + Math.random() * 0.4);
      const ty = H * (0.25 + Math.random() * 0.4);
      const dx = tx - x;
      const dy = ty - y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = 26 + Math.random() * 30;
      const isMood = Math.random() < MOOD_ITEM_CHANCE;
      const id = isMood ? null : rollDebris();
      debris.push({
        x,
        y,
        vx: (dx / d) * sp,
        vy: (dy / d) * sp,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 1.4,
        icon: isMood ? MOOD_ICONS[Math.floor(Math.random() * MOOD_ICONS.length)] : ICON[id!],
        id,
        r: isMood ? 15 : 16,
      });
    };

    const pushSat = (def: SatelliteDef, reverse: boolean, t0: number) => {
      const behind: [number, number] = [W * (0.25 + Math.random() * 0.5), H * 0.9];
      const exit: [number, number] = [W * (Math.random() * 1.2 - 0.1), -70];
      const p0 = reverse ? exit : behind;
      const p2 = reverse ? behind : exit;
      const p1: [number, number] = [
        (p0[0] + p2[0]) / 2 + (Math.random() - 0.5) * W * 0.5,
        H * (0.05 + Math.random() * 0.16),
      ];
      sats.push({ def, t: t0, speed: 1 / (5 + Math.random() * 3), p0, p1, p2, gassed: false });
    };
    const spawnSat = () => {
      const reverse = Math.random() < 0.3;
      if (Math.random() < 0.4) {
        // 스타링크 트레인 — 같은 경로로 줄지어
        for (let i = 0; i < STARLINK_TRAIN; i++) pushSat(STARLINK_DEF, reverse, -i * 0.12);
      } else {
        const pool = SAT_DEFS.filter((s) => s.id !== "starlink");
        pushSat(pool[Math.floor(Math.random() * pool.length)], reverse, 0);
      }
    };

    // ── 루프 ──
    let raf = 0;
    let last = 0;
    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = ts;
      const dt = clamp((ts - last) / 1000, 0, 0.05);
      last = ts;

      earthAngle += dt * 0.05;
      moonAngle += dt * 0.16;

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
            // 분사 가스 파티클 (진행 반대쪽)
            for (let i = 0; i < 2; i++) {
              parts.push({
                x: pet.x - nx * PET_RADIUS,
                y: pet.y - ny * PET_RADIUS,
                vx: -nx * 120 + (Math.random() - 0.5) * 60,
                vy: -ny * 120 + (Math.random() - 0.5) * 60,
                life: 0.5,
                max: 0.5,
              });
            }
          }
        }
        // 관성 감쇠
        const damp = 1 - SPACE_DRAG * dt;
        pet.vx *= damp;
        pet.vy *= damp;
        pet.x += pet.vx * dt;
        pet.y += pet.vy * dt;
        // 경계 (살짝 바운스)
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
        satTimer += dt * 1000;
        if (satTimer >= SAT_SPAWN_MS) {
          satTimer = 0;
          spawnSat();
        }

        // 가스 소진 → 종료
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

      // 쓰레기 업데이트 + 충돌
      for (let i = debris.length - 1; i >= 0; i--) {
        const d = debris[i];
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.rot += d.vr * dt;
        if (d.x < -60 || d.x > W + 60 || d.y < -60 || d.y > H + 60) {
          debris.splice(i, 1);
          continue;
        }
        if (!overRef.current && Math.hypot(d.x - pet.x, d.y - pet.y) < PET_RADIUS + d.r) {
          if (d.id) collectedRef.current.push(d.id);
          else moodGainRef.current += MOOD_ITEM_GAIN;
          // 수거 팝 파티클
          for (let k = 0; k < 6; k++)
            parts.push({
              x: d.x,
              y: d.y,
              vx: (Math.random() - 0.5) * 140,
              vy: (Math.random() - 0.5) * 140,
              life: 0.4,
              max: 0.4,
            });
          debris.splice(i, 1);
        }
      }

      // 위성 업데이트 + 충돌
      for (let i = sats.length - 1; i >= 0; i--) {
        const s = sats[i];
        s.t += s.speed * dt;
        if (s.t > 1.05) {
          sats.splice(i, 1);
          continue;
        }
        if (s.t < 0 || s.t > 1) continue;
        const sx = bez(s.p0[0], s.p1[0], s.p2[0], s.t);
        const sy = bez(s.p0[1], s.p1[1], s.p2[1], s.t);
        const scale = 0.4 + Math.sin(Math.PI * s.t);
        if (
          !overRef.current &&
          !s.gassed &&
          Math.hypot(sx - pet.x, sy - pet.y) < PET_RADIUS + s.def.r * scale * 0.6
        ) {
          s.gassed = true;
          gas = Math.min(GAS_MAX, gas + SAT_REFUEL);
          for (let k = 0; k < 14; k++)
            parts.push({
              x: sx,
              y: sy,
              vx: (Math.random() - 0.5) * 180,
              vy: (Math.random() - 0.5) * 180,
              life: 0.6,
              max: 0.6,
            });
        }
      }

      // 파티클 업데이트
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

      draw(ctx, W, H, {
        earthAngle,
        moonAngle,
        sats,
        debris,
        parts,
        joy,
        petGassed: sats.some((s) => s.gassed),
      });

      // 펫 DOM 갱신
      if (petRef.current) {
        const tilt = clamp(pet.vx * 0.05, -22, 22);
        petRef.current.style.transform = `translate(${pet.x - 34}px, ${pet.y - 34}px) rotate(${tilt}deg)`;
      }
      // HUD 갱신
      if (gasFillRef.current) gasFillRef.current.style.width = `${(gas / GAS_MAX) * 100}%`;
      if (gasNumRef.current) gasNumRef.current.textContent = String(Math.ceil(gas));
      if (moodFillRef.current)
        moodFillRef.current.style.width = `${clamp(moodGainRef.current, 0, 100)}%`;
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
              {/* 분사 가스 */}
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
              {/* 기분 충전 */}
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
            화면을 끌어 유영해요 · 위성과 만나면 가스 충전 🛰️
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
    petGassed: boolean;
  }
) {
  ctx.clearRect(0, 0, W, H);

  const bigR = W * 0.95;
  const cx = W / 2;
  const cy = H + bigR - H * 0.2; // 상단 약 20%만 보이도록

  // 달 (지구 뒤에서 뜨고 짐 — 지구보다 먼저 그려 지평선 뒤로 가려짐)
  const moonR = bigR * 1.02;
  const mx = cx + Math.cos(s.moonAngle) * W * 0.62;
  const my = cy - Math.sin(s.moonAngle) * moonR * 0.5;
  {
    ctx.save();
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
    ctx.restore();
  }

  // 위성 (지구 뒤에서 나오도록 지구보다 먼저)
  for (const sat of s.sats) {
    if (sat.t < 0 || sat.t > 1) continue;
    const x = bez(sat.p0[0], sat.p1[0], sat.p2[0], sat.t);
    const y = bez(sat.p0[1], sat.p1[1], sat.p2[1], sat.t);
    const scale = 0.4 + Math.sin(Math.PI * sat.t);
    const dx = bez(sat.p0[0], sat.p1[0], sat.p2[0], sat.t + 0.01) - x;
    const dy = bez(sat.p0[1], sat.p1[1], sat.p2[1], sat.t + 0.01) - y;
    const ang = Math.atan2(dy, dx);
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = clamp(scale, 0.3, 1);
    ctx.rotate(ang);
    ctx.scale(scale, scale);
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 6;
    drawSatellite(ctx, sat.def);
    ctx.restore();
    // 이름 라벨 (원근 크게 보일 때만, 화면 좌표)
    if (scale > 0.85) {
      ctx.save();
      ctx.globalAlpha = clamp((scale - 0.85) * 3, 0, 0.8);
      ctx.fillStyle = "#ffffff";
      ctx.font = "600 10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(sat.def.name, x, y + sat.def.r * scale + 12);
      ctx.restore();
    }
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
  // 대륙 (클립 후 회전)
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

  // 파티클 (분사 가스 · 수거 팝)
  for (const p of s.parts) {
    const a = p.life / p.max;
    ctx.globalAlpha = a;
    ctx.fillStyle = "#bfe9ff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2 + a * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 쓰레기 (이모지)
  for (const d of s.debris) {
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rot);
    ctx.font = "26px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (!d.id) {
      ctx.shadowColor = "rgba(249,168,212,0.9)";
      ctx.shadowBlur = 10;
    }
    ctx.fillText(d.icon, 0, 0);
    ctx.restore();
  }

  // 조이스틱 (3원)
  if (s.joy.active) {
    const dx = s.joy.kx - s.joy.ox;
    const dy = s.joy.ky - s.joy.oy;
    const dist = Math.hypot(dx, dy);
    const k = dist > JOY_RADIUS ? JOY_RADIUS / dist : 1;
    const kx = s.joy.ox + dx * k;
    const ky = s.joy.oy + dy * k;
    ctx.save();
    // 1) 바깥 베이스 원
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s.joy.ox, s.joy.oy, JOY_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    // 2) 중간 링
    ctx.strokeStyle = "rgba(125,232,195,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(s.joy.ox, s.joy.oy, JOY_RADIUS * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    // 방향선
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.moveTo(s.joy.ox, s.joy.oy);
    ctx.lineTo(kx, ky);
    ctx.stroke();
    // 3) 노브
    ctx.fillStyle = "rgba(125,232,195,0.9)";
    ctx.beginPath();
    ctx.arc(kx, ky, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

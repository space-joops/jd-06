"use client";

import { useRef, useState } from "react";

export interface HeartParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

/** 탭 위치에서 떠오르는 하트/이모지 파티클 */
export function useHearts() {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const nextId = useRef(0);

  const spawn = (x: number, y: number, emoji = "💗") => {
    const id = nextId.current++;
    setHearts((hs) => [...hs, { id, x, y, emoji }]);
    setTimeout(() => {
      setHearts((hs) => hs.filter((h) => h.id !== id));
    }, 1200);
  };

  return { hearts, spawn };
}

export function Hearts({ items }: { items: HeartParticle[] }) {
  return (
    <>
      {items.map((h) => (
        <span
          key={h.id}
          className="anim-heart pointer-events-none absolute z-20 text-2xl"
          style={{ left: h.x - 12, top: h.y - 12 }}
        >
          {h.emoji}
        </span>
      ))}
    </>
  );
}

"use client";

import { DEBRIS_DEFS, RARITY_COLOR, RARITY_LABEL } from "@/lib/constants";
import { DEBRIS_DATAURL } from "@/lib/debris";
import type { DebrisId } from "@/lib/types";

export default function DebrisPanel({
  debris,
  total,
}: {
  debris: Record<DebrisId, number>;
  total: number;
}) {
  return (
    <div>
      <div className="mb-4 rounded-2xl bg-white/5 px-4 py-3 text-center">
        <p className="text-2xl font-bold tabular-nums">
          {total.toLocaleString()}
          <span className="ml-1 text-sm font-normal text-white/60">개 수거</span>
        </p>
        <p className="mt-1 text-xs text-white/55">
          그만큼 지구 궤도가 깨끗해졌어요 🌍
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {DEBRIS_DEFS.map((d) => {
          const count = debris[d.id];
          const found = count > 0;
          return (
            <li
              key={d.id}
              className={`flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ${
                found ? "" : "opacity-45"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DEBRIS_DATAURL[d.id]}
                alt={d.name}
                className={`h-10 w-10 shrink-0 object-contain ${
                  found ? "" : "opacity-25 grayscale"
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {found ? d.name : "???"}
                  </span>
                  <span
                    className="rounded-full px-1.5 py-px text-[10px] font-bold text-space-900"
                    style={{ background: RARITY_COLOR[d.rarity] }}
                  >
                    {RARITY_LABEL[d.rarity]}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-snug text-white/55">
                  {found ? d.desc : "아직 발견하지 못했어요."}
                </p>
              </div>
              <span className="shrink-0 text-sm tabular-nums text-white/80">
                ×{count}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

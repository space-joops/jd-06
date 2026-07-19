"use client";

import { formatAway } from "@/lib/game";
import type { SettleReport } from "@/lib/types";

export default function SettleModal({
  report,
  petName,
  onClose,
}: {
  report: SettleReport;
  petName: string;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center px-8">
      <div className="absolute inset-0 bg-black/65" />
      <div className="anim-pop relative w-full rounded-3xl bg-space-700 p-6 text-center">
        <span className="text-4xl">💫</span>
        <h2 className="mt-2 text-xl font-bold">다시 만났어요!</h2>
        <p className="mt-1 text-sm text-white/60">
          {formatAway(report.awayMs)} 동안 {petName}는
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <div className="rounded-2xl bg-white/5 py-3 text-sm">
            🗑️ 우주쓰레기{" "}
            <b className="tabular-nums">{report.debrisGained.toLocaleString()}개</b>를
            수거했어요
          </div>
          {report.lettersGained > 0 && (
            <div className="rounded-2xl bg-white/5 py-3 text-sm">
              💌 편지 <b>{report.lettersGained}통</b>이 도착해 있어요
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-mint py-3.5 font-bold text-space-900 transition active:scale-95"
        >
          반가워! 💗
        </button>
      </div>
    </div>
  );
}

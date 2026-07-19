"use client";

import { useState } from "react";
import type { Letter } from "@/lib/types";

function formatDate(at: number): string {
  const d = new Date(at);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function LettersPanel({
  letters,
  petName,
  onRead,
}: {
  letters: Letter[];
  petName: string;
  onRead: (id: string) => void;
}) {
  const [selected, setSelected] = useState<Letter | null>(null);
  const sorted = [...letters].sort((a, b) => b.at - a.at);

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-white/60 transition active:scale-95"
        >
          ← 목록으로
        </button>
        <div className="mt-3 rounded-2xl bg-white/5 p-5">
          <span className="text-3xl">{selected.icon}</span>
          <h3 className="mt-2 text-lg font-bold">{selected.title}</h3>
          <p className="mt-0.5 text-xs text-white/45">{formatDate(selected.at)}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/90">
            {selected.body}
          </p>
          <p className="mt-5 text-right text-sm text-white/70">
            — {petName} 올림 💫
          </p>
        </div>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-white/50">
        아직 도착한 편지가 없어요.
        <br />
        {petName}가 우주를 돌며 소식을 보내올 거예요.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((l) => (
        <li key={l.id}>
          <button
            onClick={() => {
              onRead(l.id);
              setSelected(l);
            }}
            className="flex w-full items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-left transition active:scale-[0.98]"
          >
            <span className="text-2xl">{l.icon}</span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{l.title}</span>
              <span className="block text-xs text-white/45">
                {formatDate(l.at)}
              </span>
            </span>
            {!l.read && (
              <span className="h-2.5 w-2.5 rounded-full bg-pinkish" aria-label="안 읽음" />
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

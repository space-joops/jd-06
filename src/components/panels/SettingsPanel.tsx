"use client";

import { useState } from "react";

export default function SettingsPanel({ onReset }: { onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-relaxed text-white/55">
        게임 데이터는 이 브라우저에만 저장돼요. 계정 저장과 알림은 다음
        업데이트에서 찾아올 예정이에요.
      </p>

      {confirming ? (
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm font-semibold">정말 처음부터 시작할까요?</p>
          <p className="mt-1 text-xs text-white/55">
            펫과 쌓은 추억(편지, 도감)이 모두 사라져요.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm transition active:scale-95"
            >
              취소
            </button>
            <button
              onClick={onReset}
              className="flex-1 rounded-xl bg-[#ff8a80] py-2.5 text-sm font-bold text-space-900 transition active:scale-95"
            >
              초기화
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="rounded-2xl bg-white/5 py-3 text-sm text-white/70 transition active:scale-95"
        >
          처음부터 다시 시작하기
        </button>
      )}
    </div>
  );
}

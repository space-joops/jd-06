"use client";

import { useRef } from "react";

/**
 * 쓰다듬기 반응 — ref 요소에 1회성 스퀴시/바운스(Web Animations API)를 재생하고
 * 지원 기기에선 짧게 진동(Vibration API)한다. 탭마다 새로 재생되며 리렌더가 없다.
 * iOS Safari 등 진동 미지원 환경에선 무해한 no-op.
 */
export function usePetReaction() {
  const ref = useRef<HTMLDivElement>(null);

  const react = () => {
    const el = ref.current;
    if (el && typeof el.animate === "function") {
      el.animate(
        [
          { transform: "scale(1, 1)" },
          { transform: "scale(1.14, 0.88)" },
          { transform: "scale(0.92, 1.1)" },
          { transform: "scale(1.03, 0.98)" },
          { transform: "scale(1, 1)" },
        ],
        { duration: 460, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
      );
    }
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(12);
    }
  };

  return { ref, react };
}

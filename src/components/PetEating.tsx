"use client";

import PetSvg from "@/components/PetSvg";
import { DEBRIS_DATAURL } from "@/lib/debris";
import type { DebrisId, PetColor, SuitColor } from "@/lib/types";

// 반대편에서 먹는 파편 3종(순환). 도감 SVG 재사용.
const FOODS: DebrisId[] = ["paint", "bolt", "solar"];

/** 재회 윈도우 밖에서 펫이 우주쓰레기를 열심히 먹는 연출 (CSS만) */
export default function PetEating({
  color,
  suit,
}: {
  color: PetColor;
  suit: SuitColor | null;
}) {
  return (
    <div className="relative h-44 w-44">
      <div className="anim-chomp absolute inset-0">
        <PetSvg color={color} suit={suit} expression="eating" bob={false} className="w-full" />
      </div>
      {FOODS.map((id, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={id}
          src={DEBRIS_DATAURL[id]}
          alt=""
          aria-hidden
          className="anim-munch absolute left-1/2 top-1/2 -ml-[18px] -mt-[18px] h-9 w-9"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </div>
  );
}

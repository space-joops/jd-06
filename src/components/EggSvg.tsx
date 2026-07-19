import { PET_COLORS } from "@/lib/constants";
import type { PetColor } from "@/lib/types";

const SPECKLES: Array<[number, number, number]> = [
  [82, 84, 5],
  [116, 72, 4],
  [128, 108, 6],
  [72, 118, 4.5],
  [100, 138, 5],
  [124, 140, 3.5],
  [88, 60, 3.5],
];

interface EggSvgProps {
  color: PetColor;
  /** 0: 온전함, 1: 금 감, 2: 크게 갈라짐 */
  crack?: 0 | 1 | 2;
  className?: string;
  shaking?: boolean;
  wobbleKey?: number;
}

/** 분양소의 아스트로펫 알 — 펫 색상의 얼룩무늬 */
export default function EggSvg({
  color,
  crack = 0,
  className,
  shaking = false,
  wobbleKey,
}: EggSvgProps) {
  const c = PET_COLORS[color];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <g
        key={wobbleKey}
        className={shaking ? "anim-shake" : wobbleKey !== undefined ? "anim-wobble" : undefined}
      >
        {/* 그림자 */}
        <ellipse cx={100} cy={176} rx={44} ry={9} fill="#000" opacity={0.25} />
        {/* 알 몸체 */}
        <path
          d="M100 28 C134 28 152 74 152 110 C152 148 128 172 100 172 C72 172 48 148 48 110 C48 74 66 28 100 28 Z"
          fill="#fdf6ec"
        />
        <path
          d="M100 28 C134 28 152 74 152 110 C152 148 128 172 100 172 C72 172 48 148 48 110 C48 74 66 28 100 28 Z"
          fill={c.base}
          opacity={0.12}
        />
        {/* 하이라이트 */}
        <ellipse cx={80} cy={62} rx={14} ry={22} fill="#ffffff" opacity={0.6} transform="rotate(-18 80 62)" />
        {/* 얼룩무늬 */}
        {SPECKLES.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={c.base} opacity={0.75} />
        ))}
        {/* 금 */}
        {crack >= 1 && (
          <path
            d="M78 96 L90 106 L82 118 L98 126"
            stroke="#b9a98e"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {crack >= 2 && (
          <path
            d="M120 84 L110 98 L126 108 L114 124 M96 60 L104 74 L92 84"
            stroke="#b9a98e"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </g>
    </svg>
  );
}

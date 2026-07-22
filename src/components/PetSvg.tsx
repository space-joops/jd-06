import { PET_COLORS, SUIT_COLORS } from "@/lib/constants";
import type { Expression, PetColor, SuitColor } from "@/lib/types";

interface PetSvgProps {
  color: PetColor;
  expression?: Expression;
  suit?: SuitColor | null;
  className?: string;
  /** 둥실거리는 대기 애니메이션 */
  bob?: boolean;
}

/** 코드로 그리는 아스트로펫 — 젤리 블롭 + 큰 눈 + 안테나 + (선택) 우주 슈트 */
export default function PetSvg({
  color,
  expression = "neutral",
  suit = null,
  className,
  bob = true,
}: PetSvgProps) {
  const c = PET_COLORS[color];
  const s = suit ? SUIT_COLORS[suit] : null;
  const gradId = `astro-body-${color}`;
  const openEyes =
    expression === "neutral" ||
    expression === "happy" ||
    expression === "excited" ||
    expression === "eating";

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id={gradId} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="70%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>

      <g className={bob ? "anim-bob" : undefined}>
        {/* 배낭 (슈트 착용 시, 몸 뒤) */}
        {s && (
          <g>
            <rect x={40} y={104} width={22} height={52} rx={10} fill={s.base} opacity={0.9} />
            <rect x={138} y={104} width={22} height={52} rx={10} fill={s.base} opacity={0.9} />
            <rect x={46} y={112} width={10} height={30} rx={5} fill="#ffffff" opacity={0.35} />
            <rect x={144} y={112} width={10} height={30} rx={5} fill="#ffffff" opacity={0.35} />
          </g>
        )}

        {/* 발 */}
        <ellipse cx={78} cy={171} rx={13} ry={8} fill={c.dark} />
        <ellipse cx={122} cy={171} rx={13} ry={8} fill={c.dark} />

        {/* 안테나 */}
        <line x1={100} y1={64} x2={100} y2={45} stroke={c.dark} strokeWidth={4} strokeLinecap="round" />
        <circle cx={100} cy={41} r={9} fill="#ffe9a8" opacity={0.35} />
        <circle
          cx={100}
          cy={41}
          r={5.5}
          fill="#ffe9a8"
          className="anim-twinkle"
          style={{ animationDuration: "1.8s" }}
        />

        {/* 몸통 */}
        <ellipse cx={100} cy={118} rx={62} ry={56} fill={`url(#${gradId})`} />
        {/* 하이라이트 */}
        <ellipse cx={76} cy={86} rx={18} ry={11} fill="#ffffff" opacity={0.35} transform="rotate(-24 76 86)" />

        {/* 얼굴 */}
        {openEyes ? (
          <>
            <Eye cx={76} excited={expression === "excited"} />
            <Eye cx={124} excited={expression === "excited"} />
          </>
        ) : expression === "lonely" ? (
          <>
            {/* 반달 처진 눈 + 눈썹 */}
            <path d="M67 105 A 9 9 0 0 0 85 105 Z" fill="#2b2350" />
            <path d="M115 105 A 9 9 0 0 0 133 105 Z" fill="#2b2350" />
            <line x1={66} y1={94} x2={84} y2={99} stroke="#2b2350" strokeWidth={3} strokeLinecap="round" />
            <line x1={134} y1={94} x2={116} y2={99} stroke="#2b2350" strokeWidth={3} strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* sleepy: 감은 눈 */}
            <path d="M67 106 Q76 113 85 106" stroke="#2b2350" strokeWidth={3.5} fill="none" strokeLinecap="round" />
            <path d="M115 106 Q124 113 133 106" stroke="#2b2350" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          </>
        )}

        {/* 볼터치 */}
        <ellipse
          cx={62}
          cy={122}
          rx={8}
          ry={5}
          fill="#ff9eb5"
          opacity={
            expression === "happy" || expression === "excited" || expression === "eating"
              ? 0.65
              : 0.35
          }
        />
        <ellipse
          cx={138}
          cy={122}
          rx={8}
          ry={5}
          fill="#ff9eb5"
          opacity={
            expression === "happy" || expression === "excited" || expression === "eating"
              ? 0.65
              : 0.35
          }
        />

        {/* 입 */}
        {expression === "excited" ? (
          <path d="M91 128 Q100 145 109 128 Z" fill="#7c4864" />
        ) : expression === "eating" ? (
          <>
            {/* 벌린 입 + 혀 (냠냠) */}
            <ellipse cx={100} cy={133} rx={8} ry={6.5} fill="#7c4864" />
            <ellipse cx={100} cy={136.5} rx={4.6} ry={2.6} fill="#ff9eb5" />
          </>
        ) : expression === "happy" ? (
          <path d="M90 128 Q100 141 110 128" stroke="#2b2350" strokeWidth={3} fill="none" strokeLinecap="round" />
        ) : expression === "lonely" ? (
          <path d="M93 135 Q100 128 107 135" stroke="#2b2350" strokeWidth={3} fill="none" strokeLinecap="round" />
        ) : expression === "sleepy" ? (
          <circle cx={100} cy={132} r={3.5} stroke="#2b2350" strokeWidth={2.5} fill="none" />
        ) : (
          <path d="M93 129 Q100 135 107 129" stroke="#2b2350" strokeWidth={3} fill="none" strokeLinecap="round" />
        )}

        {/* 슈트: 헬멧 + 카라 + 가슴 배지 */}
        {s && (
          <g>
            <circle cx={100} cy={104} r={66} fill="rgba(200,230,255,0.10)" stroke="rgba(255,255,255,0.5)" strokeWidth={2.5} />
            <path
              d="M52 78 Q60 52 86 44"
              stroke="#ffffff"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              opacity={0.65}
            />
            <rect x={64} y={163} width={72} height={13} rx={6.5} fill={s.base} />
            <rect x={70} y={166} width={26} height={4} rx={2} fill="#ffffff" opacity={0.5} />
            <circle cx={130} cy={146} r={8} fill={s.base} />
            <circle cx={130} cy={146} r={4} fill="#ffffff" opacity={0.85} />
          </g>
        )}
      </g>
    </svg>
  );
}

function Eye({ cx, excited }: { cx: number; excited: boolean }) {
  return (
    <g className="pet-eye" style={{ animationDelay: `${(cx % 7) * 0.13}s` }}>
      <circle cx={cx} cy={105} r={excited ? 10.5 : 9.5} fill="#2b2350" />
      <circle cx={cx + 3.2} cy={101.5} r={3.4} fill="#ffffff" />
      {excited && <circle cx={cx - 3.6} cy={108} r={1.9} fill="#ffffff" opacity={0.9} />}
    </g>
  );
}

import { PET_COLORS } from "@/lib/constants";
import type { PetColor } from "@/lib/types";

interface OrbitViewProps {
  /** 궤도 진행률 0~1. 0 = 우리 집 상공 */
  phase: number;
  inWindow: boolean;
  color: PetColor;
}

const CX = 180;
const CY = 330;
const EARTH_R = 150;
const ORBIT_R = 210;

/** 지구 + 궤도 + 펫 위치 시각화. 펫은 상공 부근에서만 보이고 반대편에선 지구 뒤로 숨는다 */
export default function OrbitView({ phase, inWindow, color }: OrbitViewProps) {
  const c = PET_COLORS[color];
  const a = phase * Math.PI * 2;
  const x = CX + ORBIT_R * Math.sin(a);
  const y = CY - ORBIT_R * Math.cos(a);
  const visible = y < 252;

  return (
    <svg viewBox="0 0 360 240" className="w-full" aria-hidden>
      <defs>
        <radialGradient id="earth-g" cx="50%" cy="18%" r="90%">
          <stop offset="0%" stopColor="#a5ddff" />
          <stop offset="45%" stopColor="#5da4ec" />
          <stop offset="100%" stopColor="#2a5cb8" />
        </radialGradient>
        <clipPath id="earth-clip">
          <circle cx={CX} cy={CY} r={EARTH_R} />
        </clipPath>
      </defs>

      {/* 궤도선 */}
      <circle
        cx={CX}
        cy={CY}
        r={ORBIT_R}
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={1.5}
        strokeDasharray="3 7"
      />

      {/* 대기권 글로우 + 지구 */}
      <circle cx={CX} cy={CY} r={EARTH_R + 9} fill="rgba(124,199,255,0.15)" />
      <circle cx={CX} cy={CY} r={EARTH_R} fill="url(#earth-g)" />
      <g clipPath="url(#earth-clip)">
        <ellipse cx={132} cy={215} rx={36} ry={16} fill="#79d98f" opacity={0.85} transform="rotate(-14 132 215)" />
        <ellipse cx={238} cy={242} rx={46} ry={22} fill="#79d98f" opacity={0.8} />
        <ellipse cx={205} cy={196} rx={16} ry={7} fill="#ffffff" opacity={0.5} />
        <ellipse cx={128} cy={188} rx={22} ry={6} fill="#ffffff" opacity={0.4} />
        <ellipse cx={262} cy={210} rx={20} ry={6} fill="#ffffff" opacity={0.45} />
      </g>

      {/* 우리 집 마커 (궤도 phase 0 지점 바로 아래) */}
      <g>
        <circle cx={CX} cy={CY - EARTH_R} r={10} fill="none" stroke="#ffe9a8" strokeWidth={1.5} className="anim-ring" />
        <circle cx={CX} cy={CY - EARTH_R} r={4} fill="#ffe9a8" />
        <text
          x={CX}
          y={CY - EARTH_R + 22}
          textAnchor="middle"
          fontSize={11}
          fill="rgba(255,255,255,0.85)"
        >
          우리 집
        </text>
      </g>

      {/* 펫 마커 */}
      {visible && (
        <g transform={`translate(${x} ${y})`}>
          {inWindow && (
            <circle r={15} fill="none" stroke={c.base} strokeWidth={2} className="anim-ring" />
          )}
          <circle r={8} fill={c.base} stroke="#ffffff" strokeWidth={1.5} />
          <circle cx={2.4} cy={-2.4} r={2.2} fill="#ffffff" opacity={0.9} />
          {/* 이동 방향 꼬리 */}
          <circle cx={-Math.cos(a) * 14} cy={-Math.sin(a) * 14} r={2.5} fill={c.base} opacity={0.5} />
          <circle cx={-Math.cos(a) * 22} cy={-Math.sin(a) * 22} r={1.6} fill={c.base} opacity={0.25} />
        </g>
      )}
    </svg>
  );
}

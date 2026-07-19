const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: (i * 73.7 + 11) % 100,
  y: (i * 41.3 + 7) % 100,
  r: 0.7 + ((i * 7) % 9) / 7,
  delay: (i % 8) * 0.45,
  color: i % 11 === 0 ? "#f9a8d4" : i % 7 === 0 ? "#7de8c3" : "#ffffff",
}));

/** 모든 화면 뒤에 깔리는 반짝이는 별 배경 */
export default function Stars() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.r}
          fill={s.color}
          className="anim-twinkle"
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}
    </svg>
  );
}

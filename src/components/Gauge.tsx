interface GaugeProps {
  label: string;
  value: number;
  color: string;
}

export default function Gauge({ label, value, color }: GaugeProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-11 shrink-0 text-xs text-white/70">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.round(value)}%`, background: color }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs tabular-nums text-white/80">
        {Math.round(value)}
      </span>
    </div>
  );
}

export function moodColor(mood: number): string {
  if (mood >= 70) return "#7de8c3";
  if (mood >= 40) return "#ffe9a8";
  return "#ff8a80";
}

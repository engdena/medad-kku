export const RiskGauge = ({ value, band }: { value: number; band: string }) => {
  // value 0-100. Convert to semicircle stroke offset.
  const r = 70;
  const circ = Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value < 33 ? "hsl(var(--success))" : value < 66 ? "hsl(var(--warning))" : "hsl(var(--danger))";

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 180 100" className="w-40 h-24">
        <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke="hsl(var(--primary-foreground) / 0.18)" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div>
        <div className="font-display text-3xl font-bold">{value}<span className="text-sm font-normal text-primary-foreground/70">/100</span></div>
        <div className="text-xs uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: `${color}33`, color }}>
          {band} risk
        </div>
        <div className="text-xs text-primary-foreground/70 mt-1.5">Predicted by KKU-AI v2.4</div>
      </div>
    </div>
  );
};
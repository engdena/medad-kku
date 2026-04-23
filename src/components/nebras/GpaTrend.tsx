export const GpaTrend = ({ data, labels }: { data: number[]; labels: string[] }) => {
  const w = 280, h = 90, pad = 8;
  const min = Math.min(...data) - 0.2;
  const max = Math.max(...data) + 0.2;
  const x = (i: number) => pad + (i * (w - pad * 2)) / (data.length - 1);
  const y = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const area = `${path} L ${x(data.length - 1)} ${h - pad} L ${x(0)} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <defs>
        <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.55" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#gpaGrad)" />
      <path d={path} fill="none" stroke="hsl(var(--accent))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === data.length - 1 ? 4 : 2.5} fill="hsl(var(--accent))" />
      ))}
      {labels.map((l, i) => (
        <text key={l} x={x(i)} y={h - 1} fontSize="8" fill="hsl(var(--primary-foreground) / 0.6)" textAnchor="middle">{l}</text>
      ))}
    </svg>
  );
};
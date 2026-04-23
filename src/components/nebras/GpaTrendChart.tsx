import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const GpaTrendChart = ({ data, labels }: { data: number[]; labels: string[] }) => {
  const series = data.map((v, i) => ({ name: labels[i], gpa: v }));
  return (
    <div className="w-full h-28">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 6, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="gpaArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.65} />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="hsl(var(--primary-foreground) / 0.5)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={["dataMin - 0.2", "dataMax + 0.2"]} hide />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card) / 0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              color: "hsl(var(--foreground))",
              fontSize: 12,
            }}
            formatter={(v: number) => [v.toFixed(2), "GPA"]}
          />
          <Area
            type="monotone"
            dataKey="gpa"
            stroke="hsl(var(--accent))"
            strokeWidth={2.5}
            fill="url(#gpaArea)"
            dot={{ r: 3, fill: "hsl(var(--accent))" }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
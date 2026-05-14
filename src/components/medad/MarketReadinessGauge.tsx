import { useI18n } from "@/i18n/I18nContext";
import { Target } from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

export const MarketReadinessGauge = ({ value }: { value: number }) => {
  const { t } = useI18n();
  const v = Math.min(100, Math.max(0, value || 0));
  return (
    <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.readiness.sub}</div>
          <h2 className="font-display text-2xl font-bold mt-1">{t.readiness.title}</h2>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-primary/10 grid place-items-center text-primary"><Target className="w-5 h-5" /></div>
      </div>
      <div className="relative h-56 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="68%" outerRadius="96%" barSize={18}
            data={[{ value: v, fill: "hsl(var(--primary))" }]} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: "hsl(var(--muted))" }} dataKey="value" cornerRadius={30} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-display text-5xl font-bold leading-none text-primary">{v}%</div>
            <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{t.readiness.gap}: {100 - v}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
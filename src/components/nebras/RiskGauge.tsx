import { useI18n } from "@/i18n/I18nContext";
import { motion } from "framer-motion";
import { RadialBar, RadialBarChart, ResponsiveContainer, PolarAngleAxis } from "recharts";

export const RiskGauge = ({ value, band }: { value: number; band: string }) => {
  const { t } = useI18n();
  const color = value < 33 ? "hsl(var(--success))" : value < 66 ? "hsl(var(--warning))" : "hsl(var(--danger))";
  const data = [{ name: "risk", value, fill: color }];

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-36 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="80%"
            innerRadius="80%"
            outerRadius="130%"
            barSize={14}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: "hsl(0 0% 100% / 0.18)" }} dataKey="value" cornerRadius={20} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-display text-3xl font-bold"
        >
          {value}
          <span className="text-sm font-normal text-primary-foreground/70">/100</span>
        </motion.div>
        <div
          className="text-xs uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full inline-block font-semibold"
          style={{ background: `${color}33`, color }}
        >
          {t.hero.band[band] || band}
        </div>
        <div className="text-[11px] text-primary-foreground/70 mt-1.5">{t.hero.predictedBy}</div>
      </div>
    </div>
  );
};
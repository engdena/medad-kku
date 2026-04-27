import { calculateDistinction, annualDistinctionTarget, type StudentActivity } from "@/data/mockData";
import { useI18n } from "@/i18n/I18nContext";
import { Award, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

const getLevelKey = (percentage: number) =>
  percentage <= 30 ? "initiator" : percentage <= 70 ? "distinguished" : "leader";

export const DistinctionGauge = ({ activities }: { activities: StudentActivity[] }) => {
  const { t } = useI18n();
  const { points, percentage } = calculateDistinction(activities);
  const level = getLevelKey(percentage);
  const data = [{ name: t.distinction.title, value: percentage, fill: "hsl(var(--accent))" }];

  return (
    <motion.aside
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary-foreground/70">{t.distinction.sub}</div>
          <h2 className="font-display text-2xl font-bold mt-1">{t.distinction.title}</h2>
        </div>
        <div className="w-10 h-10 rounded-2xl glass-dark grid place-items-center">
          <Award className="w-5 h-5 text-accent" />
        </div>
      </div>

      <div className="relative h-56 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="68%" outerRadius="96%" barSize={18} data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: "hsl(0 0% 100% / 0.16)" }} dataKey="value" cornerRadius={30} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-display text-5xl font-bold leading-none">{percentage}%</div>
            <div className="mt-2 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              {t.distinction.labels[level]}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl glass-dark p-3">
          <div className="text-primary-foreground/65 text-xs">{t.distinction.target}</div>
          <div className="font-display font-bold mt-1">{t.distinction.points(points)}</div>
        </div>
        <div className="rounded-2xl glass-dark p-3">
          <div className="text-primary-foreground/65 text-xs">{t.portfolio.title}</div>
          <div className="font-display font-bold mt-1">{activities.length}/{annualDistinctionTarget / 5}</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl glass-dark p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-accent">
          <Lightbulb className="w-4 h-4" /> {t.distinction.insightTitle}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-primary-foreground/82">{t.distinction.insight}</p>
      </div>
    </motion.aside>
  );
};
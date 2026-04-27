import { courses, gradeScale } from "@/data/mockData";
import { ArrowUpRight, ArrowDownRight, Minus, Volume2, BarChart3 } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useI18n } from "@/i18n/I18nContext";
import { motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const riskClass = (r: string) =>
  r === "high"
    ? "bg-danger/15 text-danger ring-1 ring-danger/30"
    : r === "medium"
    ? "bg-warning/15 text-warning ring-1 ring-warning/30"
    : "bg-success/15 text-success ring-1 ring-success/30";

const riskColor = (r: string) =>
  r === "high" ? "hsl(var(--danger))" : r === "medium" ? "hsl(var(--warning))" : "hsl(var(--success))";

export const CoursesTable = () => {
  const { speak, ttsEnabled } = useAccessibility();
  const { t, lang } = useI18n();

  const chartData = courses.map((c) => ({
    name: lang === "ar" ? c.nameAr : c.name,
    perf: c.performance,
    risk: c.risk,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl glass shadow-soft overflow-hidden"
    >
      <div className="p-5 md:p-6 flex items-center justify-between border-b border-border/60">
        <div>
          <h2 className="font-display font-bold text-xl">{t.courses.title}</h2>
          <p className="text-sm text-muted-foreground">{t.courses.sub}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>{t.courses.scale}</span>
            {gradeScale.map((grade) => (
              <span key={grade} className="rounded-full bg-secondary px-2 py-0.5 font-bold text-secondary-foreground">
                {grade}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ttsEnabled && (
            <button
              onClick={() => speak(t.courses.title)}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Read aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
          <BarChart3 className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Recharts: Academic Risk Levels */}
      <div className="px-3 md:px-5 pt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
              contentStyle={{
                background: "hsl(var(--card) / 0.95)",
                backdropFilter: "blur(8px)",
                border: "1px solid hsl(var(--border))",
                borderRadius: 14,
                fontSize: 12,
              }}
              formatter={(v: number) => [`${v}%`, t.courses.perf]}
            />
            <Bar dataKey="perf" radius={[10, 10, 4, 4]}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={riskColor(d.risk)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="divide-y divide-border/60">
        {courses.map((c, idx) => {
          const Icon = c.trend === "up" ? ArrowUpRight : c.trend === "down" ? ArrowDownRight : Minus;
          const trendColor =
            c.trend === "up" ? "text-success" : c.trend === "down" ? "text-danger" : "text-muted-foreground";
          return (
            <motion.div
              key={c.code}
              initial={{ opacity: 0, x: lang === "ar" ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="grid grid-cols-12 items-center gap-3 px-5 md:px-6 py-3.5 hover:bg-secondary/40 transition-colors"
            >
              <div className="col-span-6 md:col-span-5">
                <div className="font-semibold">{lang === "ar" ? c.nameAr : c.name}</div>
                <div className="text-xs text-muted-foreground">{c.code}</div>
              </div>
              <div className="col-span-2 font-display font-bold text-lg">{c.grade}</div>
              <div className="col-span-3 md:col-span-3">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.performance}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-gradient-primary"
                  />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{c.performance}%</div>
              </div>
              <div className={`col-span-1 ${trendColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="col-span-12 md:col-span-1 flex md:justify-end">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold ${riskClass(c.risk)}`}>
                  {t.courses.risk[c.risk]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
import { courses, gradeScale } from "@/data/mockData";
import { ArrowUpRight, ArrowDownRight, Minus, Volume2, Sparkles, AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useI18n } from "@/i18n/I18nContext";
import { motion } from "framer-motion";

type Risk = "low" | "medium" | "high";

const riskFromGrade = (grade: string): Risk => {
  const g = grade.toUpperCase();
  if (g === "A" || g === "A+") return "low";
  if (g === "B" || g === "B+") return "medium";
  return "high"; // C+, C, D+, D, F
};

const badgeClass = (r: Risk) =>
  r === "high"
    ? "bg-danger text-white ring-1 ring-danger/40 shadow-[0_0_0_3px_hsl(var(--danger)/0.15)]"
    : r === "medium"
    ? "bg-warning text-white ring-1 ring-warning/40 shadow-[0_0_0_3px_hsl(var(--warning)/0.15)]"
    : "bg-success text-white ring-1 ring-success/40 shadow-[0_0_0_3px_hsl(var(--success)/0.15)]";

const barClass = (r: Risk) =>
  r === "high" ? "bg-danger" : r === "medium" ? "bg-warning" : "bg-success";

const insightFor = (r: Risk) =>
  r === "high"
    ? "Predictive Model suggests intervention needed to avoid GPA impact."
    : r === "medium"
    ? "At risk of dropping to 3.5 GPA if finals aren't optimized."
    : null;

export const CoursesTable = () => {
  const { speak, ttsEnabled } = useAccessibility();
  const { t, lang } = useI18n();

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
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* AI Prediction Summary */}
      <div className="mx-5 md:mx-6 mt-5 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 flex items-start gap-3">
        <div className="rounded-xl bg-primary/15 text-primary p-2">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="text-sm leading-relaxed">
          <div className="text-[10px] uppercase tracking-widest font-bold text-primary">AI Prediction Summary</div>
          <p className="text-foreground mt-0.5">
            Based on current performance, your <span className="font-bold">Predicted Semester GPA is 4.82</span>.
            Maintain <span className="font-semibold text-success">Low Risk</span> in IE430 to secure this target.
          </p>
        </div>
      </div>

      <div className="divide-y divide-border/60 mt-4">
        {courses.map((c, idx) => {
          const risk = riskFromGrade(c.grade);
          const Icon = c.trend === "up" ? ArrowUpRight : c.trend === "down" ? ArrowDownRight : Minus;
          const trendColor =
            risk === "low" ? "text-success" : risk === "medium" ? "text-warning" : "text-danger";
          const insight = insightFor(risk);
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
                <div className="font-bold text-foreground leading-snug break-words">{lang === "ar" ? c.nameAr : c.name}</div>
                <div className="text-xs font-semibold text-primary">{c.code}</div>
              </div>
              <div className="col-span-2 font-display font-bold text-lg">{c.grade}</div>
              <div className="col-span-3 md:col-span-3">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.performance}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full ${barClass(risk)}`}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{c.performance}%</div>
                {insight && (
                  <div className={`mt-1 flex items-start gap-1 text-[10px] leading-snug ${risk === "high" ? "text-danger" : "text-warning"}`}>
                    {risk === "high" ? <AlertTriangle className="w-3 h-3 mt-px shrink-0" /> : <ShieldCheck className="w-3 h-3 mt-px shrink-0" />}
                    <span>{insight}</span>
                  </div>
                )}
              </div>
              <div className={`col-span-1 ${trendColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="col-span-12 md:col-span-1 flex md:justify-end">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold ${badgeClass(risk)}`}>
                  {t.courses.risk[risk]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
import { student, insights } from "@/data/mockData";
import { TrendingUp, Award, Sparkles } from "lucide-react";
import { RiskGauge } from "./RiskGauge";
import { GpaTrendChart } from "./GpaTrendChart";
import { useI18n } from "@/i18n/I18nContext";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const HeroDashboard = () => {
  const { t, lang } = useI18n();
  const firstName = lang === "ar" ? student.arabicName.split(" ")[0] : student.name.split(" ")[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 md:p-10 text-primary-foreground shadow-elegant"
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/30 blur-3xl animate-float" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-glow/30 blur-3xl animate-float" style={{ animationDelay: "1.2s" }} />

      <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
        <div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-dark text-xs uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" /> {t.hero.badge}
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-4 font-display text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight"
          >
            {t.hero.welcome}, {firstName}.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-3 text-base md:text-lg text-primary-foreground/85 max-w-xl"
          >
            {t.hero.summary("3.58")}
          </motion.p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {insights.map((i, idx) => (
              <motion.div
                key={i.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + idx * 0.08 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="rounded-2xl glass-dark p-3.5 transition-shadow hover:shadow-glow"
              >
                <div className="text-[11px] uppercase tracking-wider text-primary-foreground/70">
                  {t.hero.insights[i.label] || i.label}
                </div>
                <div className="font-display font-bold text-2xl mt-1">{t.hero.insights[i.value] || i.value}</div>
                <div className="text-xs text-accent flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> {i.trend}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl glass-dark p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase tracking-widest text-primary-foreground/75">{t.hero.risk}</div>
              <Award className="w-4 h-4 text-accent" />
            </div>
            <RiskGauge value={student.riskScore} band={student.riskBand} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="rounded-2xl glass-dark p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs uppercase tracking-widest text-primary-foreground/75">{t.hero.gpa}</div>
                <div className="font-display font-bold text-2xl">
                  {student.gpa.toFixed(2)} <span className="text-sm font-normal text-primary-foreground/60">/ {student.gpaScale}</span>
                </div>
              </div>
              <div className="text-xs text-accent">{t.hero.gpaDelta}</div>
            </div>
            <GpaTrendChart data={student.trend} labels={student.semesters} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
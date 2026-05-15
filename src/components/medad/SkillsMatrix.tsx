import { useI18n } from "@/i18n/I18nContext";
import { Cpu, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { usePortfolioBreakdown } from "@/hooks/usePortfolioBreakdown";

export const SkillsMatrix = () => {
  const { t, lang } = useI18n();
  const ar = lang === "ar";
  const L = (en: string, arS: string) => (ar ? arS : en);
  const { entries } = usePortfolioBreakdown();

  const hardSkills = entries.filter((e) => e.category === "technical");

  return (
    <section className="space-y-5">
      <div>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
          <Cpu className="w-3.5 h-3.5" /> {t.skillsMatrix.chip}
        </div>
        <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">{t.skillsMatrix.title}</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mt-1">
          {L(
            "View-only summary of every Hard Skill you've logged via Add Entry.",
            "عرض فقط لكل المهارات التقنية التي سجّلتها عبر إضافة إدخال."
          )}
        </p>
      </div>

      <div className="rounded-3xl glass p-5">
        <div className="flex items-center justify-between">
          <div className="font-display font-bold text-lg flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            {L("Hard Skills", "المهارات التقنية")}
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Lock className="w-3 h-3" /> {L("Read-only", "عرض فقط")}
            <span className="ms-2 text-primary">{hardSkills.length}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {hardSkills.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {L("No hard skills yet. Use Add Entry above.", "لا توجد مهارات تقنية بعد. استخدم إضافة إدخال أعلاه.")}
            </p>
          )}
          {hardSkills.map((s, i) => (
            <motion.span
              key={s.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-soft"
            >
              {s.title} · +10
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};
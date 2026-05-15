import { useI18n } from "@/i18n/I18nContext";
import { Award, Cpu, FlaskConical, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { usePortfolioBreakdown } from "@/hooks/usePortfolioBreakdown";

export const SkillsMatrix = () => {
  const { t, lang } = useI18n();
  const ar = lang === "ar";
  const L = (en: string, arS: string) => (ar ? arS : en);
  const { entries } = usePortfolioBreakdown();

  const groups = [
    {
      key: "technical" as const,
      title: L("Technical Expertise", "الخبرة التقنية"),
      icon: Cpu,
      tone: "bg-primary text-primary-foreground",
      points: 10,
    },
    {
      key: "certification" as const,
      title: L("Verified Certifications", "الشهادات المعتمدة"),
      icon: Award,
      tone: "bg-accent text-accent-foreground",
      points: 10,
    },
    {
      key: "innovation" as const,
      title: L("Research & Innovation", "البحث والابتكار"),
      icon: FlaskConical,
      tone: "bg-foreground text-background",
      points: 15,
    },
  ];

  const byCat = (cat: string) => entries.filter((e) => e.category === cat);
  const totalCount = groups.reduce((n, g) => n + byCat(g.key).length, 0);

  return (
    <section className="space-y-5">
      <div>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
          <Cpu className="w-3.5 h-3.5" /> {t.skillsMatrix.chip}
        </div>
        <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">{t.skillsMatrix.title}</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mt-1">
          {L(
            "View-only summary of every Hard Skill and competency you've logged via Add Entry.",
            "عرض فقط لكل مهارة وكفاءة سجّلتها عبر إضافة إدخال."
          )}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <Lock className="w-3 h-3" /> {L("Read-only", "عرض فقط")}
        </span>
        <span className="text-xs text-muted-foreground">
          {totalCount} {L("competencies", "كفاءة")}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {groups.map((g) => {
          const items = byCat(g.key);
          const Icon = g.icon;
          return (
            <div key={g.key} className="rounded-3xl glass p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="font-display font-bold text-base flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  {g.title}
                </div>
                <span className="text-xs font-bold text-primary">{items.length}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {items.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {L("No entries yet.", "لا توجد إدخالات بعد.")}
                  </p>
                )}
                {items.map((s, i) => (
                  <motion.span
                    key={s.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-soft ${g.tone}`}
                    title={s.description ?? undefined}
                  >
                    {s.title} · +{g.points}
                  </motion.span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
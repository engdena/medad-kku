import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Lightbulb, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/i18n/I18nContext";
import { industryProjects } from "@/data/mockData";
import { Link } from "react-router-dom";
import {
  distinctionLevel,
  PORTFOLIO_ANNUAL_TARGET,
  usePortfolioBreakdown,
} from "@/hooks/usePortfolioBreakdown";

type Props = { onOpenRoadmap: () => void };

export const InsightWidgets = ({ onOpenRoadmap }: Props) => {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const L = (en: string, arS: string) => (ar ? arS : en);
  const { total, percentage } = usePortfolioBreakdown();
  const level = distinctionLevel(percentage);

  const tipText =
    level === "initiator"
      ? L(
          "Add a Professional Certification (+10) and a Research entry (+15) to unlock 'Distinguished'.",
          "أضف شهادة احترافية (+10) وإدخالاً بحثياً (+15) للوصول إلى مستوى 'متميز'."
        )
      : level === "distinguished"
      ? L(
          "Lead a project or capstone to bridge to 'Future Leader'. A high-impact research entry adds +15.",
          "قُد مشروعاً لمد الجسر إلى مستوى 'قائد المستقبل'. الإدخال البحثي عالي الأثر يضيف +15."
        )
      : L(
          "Maintain Future Leader status — share your portfolio with sponsors via Talent Search.",
          "حافظ على مستوى قائد المستقبل — شارك ملفك مع الراعين عبر منصة المواهب."
        );

  const milestones = [
    { pct: 30, label: L("Initiator", "مبادر") },
    { pct: 70, label: L("Distinguished", "متميز") },
    { pct: 100, label: L("Future Leader", "قائد المستقبل") },
  ];
  const next = milestones.find((m) => percentage <= m.pct) ?? milestones[milestones.length - 1];
  const pointsToNext = Math.max(
    0,
    Math.ceil((next.pct / 100) * PORTFOLIO_ANNUAL_TARGET) - total
  );

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-border bg-card p-5 shadow-soft"
      >
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent font-semibold">
          <Lightbulb className="w-3.5 h-3.5" /> {L("Smart Career Insight", "تلميح مهني ذكي")}
        </div>
        <h3 className="font-display font-bold text-lg mt-1">
          {L("Your next strategic move", "خطوتك الاستراتيجية القادمة")}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{tipText}</p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-3xl border border-border bg-card p-5 shadow-soft"
      >
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-primary font-semibold">
          <MapPin className="w-3.5 h-3.5" /> {L("Next Roadmap Milestone", "المعلم التالي في الخارطة")}
        </div>
        <h3 className="font-display font-bold text-lg mt-1">{next.label}</h3>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{percentage}%</span>
          <span>{next.pct}%</span>
        </div>
        <Progress value={percentage} className="mt-1 h-2" />

        <div className="mt-3 flex items-center gap-2 text-sm">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-foreground font-medium">
            {pointsToNext > 0
              ? L(`${pointsToNext} points to next tier`, `${pointsToNext} نقطة للمستوى التالي`)
              : L("Tier reached", "تم الوصول إلى المستوى")}
          </span>
        </div>

      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-3xl border border-border bg-card p-5 shadow-soft"
      >
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-primary font-semibold">
          <Briefcase className="w-3.5 h-3.5" /> {L("Top Opportunities", "أبرز الفرص")}
        </div>
        <h3 className="font-display font-bold text-lg mt-1">
          {L("Sponsored projects", "مشاريع ممَوَّلة")}
        </h3>
        <ul className="mt-3 space-y-2">
          {industryProjects.slice(0, 3).map((p) => {
            const company = ar ? p.companyAr : p.company;
            const sector = ar ? p.sectorAr : p.sector;
            return (
              <li
                key={p.company}
                className="flex items-center justify-between gap-2 rounded-xl bg-muted/40 border border-border/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="font-bold text-xs truncate">{company}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{sector}</div>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  {p.match}%
                </span>
              </li>
            );
          })}
        </ul>
        <Link to="/roadmap">
          <Button variant="outline" size="sm" className="rounded-xl w-full mt-4 justify-center">
            {L("View all opportunities", "عرض كل الفرص")}
            <ArrowRight className={`w-4 h-4 ms-1 ${ar ? "flip-rtl" : ""}`} />
          </Button>
        </Link>
      </motion.section>
    </div>
  );
};

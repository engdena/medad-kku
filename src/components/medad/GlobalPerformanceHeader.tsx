import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import {
  Award,
  FlaskConical,
  GraduationCap,
  HandHeart,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Wrench,
} from "lucide-react";
import { Briefcase, Gauge, Users } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import {
  distinctionGaugeColor,
  distinctionLevel,
  PORTFOLIO_ANNUAL_TARGET,
  PORTFOLIO_CATEGORY_POINTS,
  usePortfolioBreakdown,
  type PortfolioCategory,
} from "@/hooks/usePortfolioBreakdown";
import { student } from "@/data/mockData";
import { Network } from "lucide-react";

type Props = {
  marketReadiness: number;
};

const TRACKER_GROUPS: Array<{
  key: "research" | "skills" | "leadership" | "volunteering";
  cats: PortfolioCategory[];
  Icon: typeof FlaskConical;
}> = [
  { key: "research", cats: ["innovation"], Icon: FlaskConical },
  { key: "skills", cats: ["certification", "technical", "skill"], Icon: Wrench },
  { key: "leadership", cats: ["leadership"], Icon: GraduationCap },
  { key: "volunteering", cats: ["volunteering"], Icon: HandHeart },
];

export const GlobalPerformanceHeader = ({ marketReadiness }: Props) => {
  const { t, lang } = useI18n();
  const ar = lang === "ar";
  const L = (en: string, arS: string) => (ar ? arS : en);
  const firstName = ar ? student.arabicName.split(" ")[0] : student.name.split(" ")[0];
  const { byCat, total, percentage } = usePortfolioBreakdown();
  const level = distinctionLevel(percentage);
  const gaugeColor = distinctionGaugeColor(percentage);

  const trackerData = useMemo(
    () =>
      TRACKER_GROUPS.map((g) => {
        const points = g.cats.reduce((sum, c) => sum + byCat[c].points, 0);
        const count = g.cats.reduce((sum, c) => sum + byCat[c].count, 0);
        return { ...g, points, count };
      }),
    [byCat]
  );

  // Smart insight: distance to next tier
  const nextTier =
    percentage <= 30
      ? { tierLabel: t.distinction.labels.distinguished, target: 31, hint: L("Add a Professional Certification (+10) or a Research entry (+15).", "أضف شهادة احترافية (+10) أو إنجاز بحثي (+15).") }
      : percentage <= 70
      ? { tierLabel: t.distinction.labels.leader, target: 71, hint: L("Try adding a Professional Certification or a Research project.", "جرّب إضافة شهادة احترافية أو مشروع بحثي.") }
      : null;
  const pointsToNext = nextTier
    ? Math.max(0, Math.ceil((nextTier.target / 100) * PORTFOLIO_ANNUAL_TARGET) - total)
    : 0;

  const data = [{ name: "distinction", value: percentage, fill: gaugeColor }];

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl bg-gradient-hero p-5 md:p-7 text-primary-foreground shadow-elegant"
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-glow/25 blur-3xl pointer-events-none" />

      <div className="relative mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-dark text-[11px] uppercase tracking-widest">
          <Network className="w-3.5 h-3.5" /> {t.hero.badge}
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-[1.05] tracking-tight">
          {t.hero.welcome}, {firstName}.
        </h1>
        <p className="mt-2 text-sm md:text-base text-primary-foreground/85 max-w-2xl">
          {t.hero.summary(student.gpa.toFixed(2))}
        </p>
      </div>

      <div className="relative grid lg:grid-cols-[minmax(0,360px)_1fr] gap-6 items-center">
        {/* LEFT: Distinction Gauge */}
        <div className="glass-dark rounded-3xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-primary-foreground/70">
                {t.distinction.sub}
              </div>
              <h2 className="font-display text-xl font-bold mt-1">
                {t.distinction.title}
              </h2>
            </div>
            <div className="w-9 h-9 rounded-2xl glass-dark grid place-items-center">
              <Trophy className="w-4 h-4 text-accent" />
            </div>
          </div>

          <div className="relative h-52 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={16}
                data={data}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background={{ fill: "hsl(0 0% 100% / 0.15)" }}
                  dataKey="value"
                  cornerRadius={30}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="font-display text-5xl font-bold leading-none">
                  {percentage}
                  <span className="text-2xl">%</span>
                </div>
                <div className="mt-2 inline-flex rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-foreground">
                  {t.distinction.labels[level]}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 rounded-2xl glass-dark p-3 text-sm">
            <div className="flex items-center gap-2 text-accent font-bold">
              <Lightbulb className="w-4 h-4" />
              {L("Smart Insight", "تلميح ذكي")}
            </div>
            <p className="mt-1 leading-relaxed text-primary-foreground/85">
              {nextTier
                ? L(
                    `You are ${pointsToNext} points away from "${nextTier.tierLabel}". `,
                    `تبعد ${pointsToNext} نقطة عن مستوى "${nextTier.tierLabel}". `
                  ) + nextTier.hint
                : L(
                    "You've reached Future Leader status. Maintain momentum with new high-impact entries.",
                    "وصلت إلى مستوى قائد المستقبل. حافظ على الزخم بإضافات جديدة عالية الأثر."
                  )}
            </p>
          </div>
        </div>

        {/* RIGHT: Mini cards + tracker */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <MiniCard
              icon={<GraduationCap className="w-4 h-4 text-accent" />}
              label={L("Academic GPA", "المعدل الأكاديمي")}
              value={
                <>
                  {student.gpa.toFixed(2)}
                  <span className="text-sm font-normal text-primary-foreground/70">
                    /{student.gpaScale.toFixed(1)}
                  </span>
                </>
              }
              hint={
                <span className="inline-flex items-center gap-1 text-accent">
                  <TrendingUp className="w-3 h-3" /> {t.hero.gpaDelta}
                </span>
              }
            />
            <MiniCard
              icon={<Briefcase className="w-4 h-4 text-accent" />}
              label={L("Employability", "قابلية التوظيف")}
              value={<>78<span className="text-sm font-normal text-primary-foreground/70">%</span></>}
              hint={
                <span className="inline-flex items-center gap-1 text-accent">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              }
            />
            <MiniCard
              icon={<Gauge className="w-4 h-4 text-accent" />}
              label={L("Skills Gap", "فجوة المهارات")}
              value={
                <>
                  4
                  <span className="text-sm font-normal text-primary-foreground/70 ms-1">
                    {L("skills", "مهارات")}
                  </span>
                </>
              }
              hint={
                <span className="inline-flex items-center gap-1 text-accent">
                  <TrendingUp className="w-3 h-3" /> −1
                </span>
              }
            />
            <MiniCard
              icon={<Users className="w-4 h-4 text-accent" />}
              label={L("Peer Percentile", "الترتيب بين الأقران")}
              value={<>{L("Top 22%", "أعلى 22٪")}</>}
              hint={
                <span className="inline-flex items-center gap-1 text-accent">
                  <TrendingUp className="w-3 h-3" /> +5%
                </span>
              }
            />
            <MiniCard
              icon={<Award className="w-4 h-4 text-accent" />}
              label={L("Total Points", "إجمالي النقاط")}
              value={
                <>
                  {total}
                  <span className="text-sm font-normal text-primary-foreground/70">
                    /{PORTFOLIO_ANNUAL_TARGET}
                  </span>
                </>
              }
              hint={
                <span className="text-primary-foreground/75">
                  15 · 10 · 5 {L("breakdown", "موزعة")}
                </span>
              }
            />
            <MiniCard
              icon={<Target className="w-4 h-4 text-accent" />}
              label={L("Market Readiness", "جاهزية السوق")}
              value={
                <>
                  {marketReadiness}
                  <span className="text-sm font-normal text-primary-foreground/70">%</span>
                </>
              }
              hint={
                <span className="text-primary-foreground/75">
                  {L("IE skill alignment", "توافق مهارات IE")}
                </span>
              }
            />
          </div>

          {/* Live Points Tracker */}
          <div className="glass-dark rounded-2xl p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-primary-foreground/70 mb-2">
              <Sparkles className="w-3 h-3 text-accent" />
              {L("Live Points Feed", "تتبع النقاط المباشر")}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {trackerData.map(({ key, Icon, points, count }) => (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-xl bg-primary-foreground/8 hover:bg-primary-foreground/12 transition-colors px-3 py-2"
                  style={{ background: "hsl(0 0% 100% / 0.08)" }}
                >
                  <div className="w-8 h-8 rounded-lg grid place-items-center bg-accent/20 text-accent shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-primary-foreground/70 truncate">
                      {trackerLabel(key, L)}
                    </div>
                    <div className="font-display font-bold text-sm leading-tight">
                      {points}
                      <span className="text-[10px] font-normal text-primary-foreground/70 ms-1">
                        {L("pts", "نقطة")} · {count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const trackerLabel = (
  key: "research" | "skills" | "leadership" | "volunteering",
  L: (en: string, ar: string) => string
) => {
  switch (key) {
    case "research":
      return L("Research", "بحث وابتكار");
    case "skills":
      return L("Hard Skills", "مهارات تقنية");
    case "leadership":
      return L("Leadership", "قيادة");
    case "volunteering":
      return L("Volunteering", "تطوع");
  }
};

const MiniCard = ({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
}) => (
  <div className="glass-dark rounded-2xl p-3">
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-primary-foreground/70">
      {icon}
      {label}
    </div>
    <div className="font-display font-bold text-2xl mt-1 leading-tight">
      {value}
    </div>
    {hint && <div className="text-xs mt-0.5">{hint}</div>}
  </div>
);

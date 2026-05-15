import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateDistinction, recommendedSkills, industryProjects } from "@/data/mockData";
import { useStudentActivities } from "@/hooks/useStudentActivities";
import { useI18n } from "@/i18n/I18nContext";
import {
  ArrowLeft,
  Award,
  Briefcase,
  CheckCircle2,
  Factory,
  Lightbulb,
  Network,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

type PathMode = "skills" | "projects";

const PHASES = [
  {
    id: 1,
    key: "foundations",
    title: "Strategic Foundations",
    sub: "Skill acquisition & certifications",
    icon: Zap,
  },
  {
    id: 2,
    key: "distinction",
    title: "Professional Distinction",
    sub: "Research, leadership & specialization",
    icon: Award,
  },
  {
    id: 3,
    key: "integration",
    title: "Industry Integration",
    sub: "Sponsored projects & corporate alignment",
    icon: Briefcase,
  },
] as const;

export const StrategicRoadmap = () => {
  const { activities } = useStudentActivities();
  const { t, lang } = useI18n();
  const distinction = calculateDistinction(activities);
  const readiness = Math.min(100, Math.round((distinction.percentage + 78) / 2));
  const [mode, setMode] = useState<PathMode>("skills");

  const skillsPhase1 = recommendedSkills.slice(0, 2);
  const skillsPhase2 = recommendedSkills.slice(2, 4);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 md:py-8 space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link to="/">
            <Button variant="outline" className="rounded-2xl gap-2">
              <ArrowLeft className={`w-4 h-4 ${lang === "ar" ? "flip-rtl" : ""}`} /> {t.roadmap.back}
            </Button>
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-primary/20">
            <Network className="w-3.5 h-3.5" /> {t.skills.chip}
          </div>
        </div>

        {/* Compact header: title + readiness + smart insight in one row */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[1.4fr_1fr_1fr] gap-3"
        >
          <div className="rounded-3xl glass p-4 shadow-soft flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Factory className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight leading-tight">
                {t.roadmap.title}
              </h1>
              <p className="text-xs text-muted-foreground line-clamp-2">{t.roadmap.sub}</p>
            </div>
          </div>

          <div className="rounded-3xl glass p-4 shadow-soft">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="inline-flex items-center gap-1.5 uppercase tracking-widest text-muted-foreground">
                <Target className="w-3.5 h-3.5 text-primary" /> {t.roadmap.readiness}
              </span>
              <span className="text-primary text-base">{readiness}%</span>
            </div>
            <Progress value={readiness} className="mt-2 h-2" />
            <div className="mt-1.5 text-[11px] text-muted-foreground">
              {t.roadmap.gap}: {100 - readiness}%
            </div>
          </div>

          <div className="rounded-3xl glass p-4 shadow-soft border border-accent/30">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-accent font-bold">
                  Smart Career Insight
                </div>
                <p className="text-xs font-medium text-foreground mt-1 line-clamp-3">
                  {t.roadmap.smartTip}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Segmented control */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl glass shadow-soft">
            <SegButton active={mode === "skills"} onClick={() => setMode("skills")}>
              <Sparkles className="w-3.5 h-3.5" /> Skill Path
            </SegButton>
            <SegButton active={mode === "projects"} onClick={() => setMode("projects")}>
              <Rocket className="w-3.5 h-3.5" /> Project Path
            </SegButton>
          </div>
        </div>

        {/* Success path connector + 3 phases */}
        <section className="relative">
          {/* horizontal success line */}
          <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/30 via-primary to-accent/60 rounded-full" />
          <div className="grid lg:grid-cols-3 gap-4">
            {PHASES.map((phase, idx) => {
              const Icon = phase.icon;
              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-3xl glass shadow-soft p-4 flex flex-col"
                >
                  {/* phase header with marker */}
                  <div className="flex items-center gap-3 relative">
                    <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-elegant ring-4 ring-background">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-primary font-bold">
                        Phase {phase.id}
                      </div>
                      <div className="font-display font-bold text-base leading-tight">
                        {phase.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{phase.sub}</div>
                    </div>
                  </div>

                  {/* phase content */}
                  <div className="mt-4 space-y-2 flex-1">
                    {mode === "skills" && phase.id === 1 &&
                      skillsPhase1.map((s) => <CompactSkillCard key={s.title} skill={s} lang={lang} />)}
                    {mode === "skills" && phase.id === 2 &&
                      skillsPhase2.map((s) => <CompactSkillCard key={s.title} skill={s} lang={lang} />)}
                    {mode === "skills" && phase.id === 3 && (
                      <ProjectList projects={industryProjects} lang={lang} />
                    )}

                    {mode === "projects" && phase.id === 1 && (
                      <ReadinessChecklist items={t.roadmap.goalsList.slice(0, 2)} />
                    )}
                    {mode === "projects" && phase.id === 2 && (
                      <ReadinessChecklist items={t.roadmap.goalsList.slice(2)} />
                    )}
                    {mode === "projects" && phase.id === 3 && (
                      <ProjectList projects={industryProjects} lang={lang} expanded />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

const SegButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
      active
        ? "bg-primary text-primary-foreground shadow-soft"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

const CompactSkillCard = ({
  skill,
  lang,
}: {
  skill: (typeof recommendedSkills)[number];
  lang: string;
}) => {
  const title = lang === "ar" ? skill.titleAr : skill.title;
  return (
    <div className="rounded-2xl bg-card/70 border border-border p-3 backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <div className="font-display font-bold text-sm leading-tight">{title}</div>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
          {skill.match}%
        </span>
      </div>
      <Button
        size="sm"
        className="mt-2 w-full h-7 rounded-xl text-[11px] bg-gradient-primary text-primary-foreground"
      >
        Quick Enroll
      </Button>
    </div>
  );
};

const ProjectList = ({
  projects,
  lang,
  expanded = false,
}: {
  projects: typeof industryProjects;
  lang: string;
  expanded?: boolean;
}) => (
  <ul className="space-y-1.5">
    {projects.map((p) => {
      const company = lang === "ar" ? p.companyAr : p.company;
      const sector = lang === "ar" ? p.sectorAr : p.sector;
      return (
        <li
          key={p.company}
          className="flex items-center justify-between gap-2 rounded-xl bg-card/70 border border-border px-3 py-2"
        >
          <div className="min-w-0">
            <div className="font-bold text-xs truncate">{company}</div>
            <div className="text-[10px] text-muted-foreground truncate">{sector}</div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary">
              <TrendingUp className="w-3 h-3" /> {p.match}%
            </span>
            {expanded && (
              <Button size="sm" className="h-6 px-2 rounded-lg text-[10px]">
                Apply
              </Button>
            )}
          </div>
        </li>
      );
    })}
  </ul>
);

const ReadinessChecklist = ({ items }: { items: string[] }) => (
  <ul className="space-y-1.5">
    {items.map((g) => (
      <li
        key={g}
        className="flex items-center gap-2 rounded-xl bg-card/70 border border-border px-3 py-2 text-xs font-bold"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> {g}
      </li>
    ))}
  </ul>
);

export default StrategicRoadmap;
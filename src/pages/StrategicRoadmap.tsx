import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateDistinction } from "@/data/mockData";
import { useStudentActivities } from "@/hooks/useStudentActivities";
import { useI18n } from "@/i18n/I18nContext";
import { ArrowLeft, BadgeCheck, BrainCircuit, CheckCircle2, Lightbulb, Target } from "lucide-react";
import { motion } from "framer-motion";

export const StrategicRoadmap = () => {
  const { activities } = useStudentActivities();
  const { t, lang } = useI18n();
  const distinction = calculateDistinction(activities);
  const readiness = Math.min(100, Math.round((distinction.percentage + 78) / 2));

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-6 md:py-10 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/">
            <Button variant="outline" className="rounded-2xl gap-2">
              <ArrowLeft className={`w-4 h-4 ${lang === "ar" ? "flip-rtl" : ""}`} /> {t.roadmap.back}
            </Button>
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-primary/20">
            <BrainCircuit className="w-3.5 h-3.5" /> {t.skills.chip}
          </div>
        </div>

        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">{t.roadmap.title}</h1>
              <p className="mt-3 text-muted-foreground max-w-2xl">{t.roadmap.sub}</p>
            </div>
            <div className="rounded-3xl bg-secondary/60 p-5">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>{t.roadmap.readiness}</span>
                <span className="text-primary">{readiness}%</span>
              </div>
              <Progress value={readiness} className="mt-3 h-3" />
              <div className="mt-2 text-xs text-muted-foreground">{t.roadmap.gap}: {100 - readiness}%</div>
            </div>
          </div>
        </motion.section>

        <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-4 items-start">
          <div className="rounded-3xl glass p-5 shadow-soft">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
              <Target className="w-3.5 h-3.5" /> {t.roadmap.nextSteps}
            </div>
            <div className="mt-4 space-y-3">
              {t.roadmap.steps.map((step, index) => (
                <div key={step.title} className="flex gap-3 rounded-2xl bg-secondary/50 p-3">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</div>
                  <div>
                    <div className="font-display font-bold text-foreground">{step.title}</div>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl glass p-5 shadow-soft">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
                <BadgeCheck className="w-3.5 h-3.5" /> {t.roadmap.goals}
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {t.roadmap.goalsList.map((goal) => (
                  <div key={goal} className="flex items-center gap-2 rounded-2xl bg-card border border-border p-3 font-bold text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {goal}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl glass p-5 shadow-soft">
              <h2 className="font-display font-bold text-2xl">{t.roadmap.successPath}</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {t.roadmap.steps.map((step, index) => (
                  <div key={step.title} className="rounded-2xl bg-secondary/50 p-3">
                    <div className="text-xs font-bold text-primary">{25 * (index + 1)}% {t.roadmap.readiness}</div>
                    <div className="font-display font-bold mt-1">{step.title}</div>
                    <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="rounded-3xl bg-accent/18 border border-accent/40 p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="font-bold text-foreground">{t.roadmap.smartTip}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StrategicRoadmap;
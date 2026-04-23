import { student, insights } from "@/data/mockData";
import { TrendingUp, Award, Sparkles } from "lucide-react";
import { RiskGauge } from "./RiskGauge";
import { GpaTrend } from "./GpaTrend";

export const HeroDashboard = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 md:p-10 text-primary-foreground shadow-elegant">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-glow/30 blur-3xl" />

      <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> AI Academic Intelligence
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
            Welcome back, {student.name.split(" ")[0]}.
          </h1>
          <p className="mt-3 text-base md:text-lg text-primary-foreground/85 max-w-xl">
            Your predictive model is updated. You're trending toward a{" "}
            <span className="font-semibold text-accent">3.58 GPA</span> with a clear path to closing
            the Saudi labor-market gap.
          </p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {insights.map((i) => (
              <div key={i.label} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5">
                <div className="text-[11px] uppercase tracking-wider text-primary-foreground/70">{i.label}</div>
                <div className="font-display font-bold text-2xl mt-1">{i.value}</div>
                <div className="text-xs text-accent flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> {i.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase tracking-widest text-primary-foreground/75">Risk of Academic Struggle</div>
              <Award className="w-4 h-4 text-accent" />
            </div>
            <RiskGauge value={student.riskScore} band={student.riskBand} />
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs uppercase tracking-widest text-primary-foreground/75">GPA trajectory</div>
                <div className="font-display font-bold text-2xl">{student.gpa.toFixed(2)} <span className="text-sm font-normal text-primary-foreground/60">/ {student.gpaScale}</span></div>
              </div>
              <div className="text-xs text-accent">+0.32 this year</div>
            </div>
            <GpaTrend data={student.trend} labels={student.semesters} />
          </div>
        </div>
      </div>
    </section>
  );
};
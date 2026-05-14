import { useAuth } from "@/hooks/useAuth";
import { useStudentData } from "@/hooks/useStudentData";
import { useI18n } from "@/i18n/I18nContext";
import { GraduationCap, Flag, CircleDot, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const CURRICULUM = [
  { code: "IE 200", title: "Engineering Economy", desc: "Cost analysis, NPV, IRR — financial backbone for ops decisions." },
  { code: "IE 311", title: "Operations Research I", desc: "Linear programming, simplex, sensitivity analysis." },
  { code: "IE 332", title: "Probability & Statistics", desc: "Statistical inference for quality and reliability." },
  { code: "IE 351", title: "Production Planning", desc: "MRP, scheduling, capacity planning." },
  { code: "IE 412", title: "Quality Control (Six Sigma)", desc: "SPC, DMAIC, Lean Six Sigma Green Belt foundations." },
  { code: "IE 433", title: "Supply Chain & Logistics", desc: "Inventory models, network design, distribution." },
  { code: "IE 461", title: "Simulation & Systems", desc: "Discrete-event simulation with Arena/SimPy." },
  { code: "IE 490", title: "Senior Capstone Project", desc: "Industry-sponsored project demonstrating full IE toolkit." },
];

export const CurriculumRoadmap = () => {
  const { user } = useAuth();
  const { data } = useStudentData(user?.id);
  const { t } = useI18n();
  const goal = data?.career_goals || "Strategy & Operations Consulting";

  return (
    <section className="space-y-5">
      <div>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> {t.tabs.roadmap}
        </div>
        <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">From Curriculum to Career</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mt-1">
          A step-by-step IE success path leading to your goal.
        </p>
      </div>

      <div className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant flex items-center gap-3">
        <Flag className="w-5 h-5 text-accent" />
        <div>
          <div className="text-xs uppercase tracking-widest text-primary-foreground/70">Final Milestone</div>
          <div className="font-display font-bold text-xl">{goal}</div>
        </div>
      </div>

      <ol className="relative border-s-2 border-primary/30 ms-3 space-y-4">
        {CURRICULUM.map((c, i) => (
          <motion.li
            key={c.code}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="ms-6"
          >
            <span className="absolute -start-3 grid place-items-center w-6 h-6 rounded-full bg-card border-2 border-primary text-primary">
              {i < 4 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleDot className="w-3.5 h-3.5" />}
            </span>
            <div className="rounded-2xl bg-card border border-border p-4 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div className="font-display font-bold">{c.title}</div>
                <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-bold">{c.code}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            </div>
          </motion.li>
        ))}
        <li className="ms-6">
          <span className="absolute -start-3 grid place-items-center w-6 h-6 rounded-full bg-accent text-accent-foreground">
            <Flag className="w-3.5 h-3.5" />
          </span>
          <div className="rounded-2xl bg-primary text-primary-foreground p-4 shadow-elegant">
            <div className="text-xs uppercase tracking-widest opacity-80">Goal</div>
            <div className="font-display font-bold text-lg">{goal}</div>
          </div>
        </li>
      </ol>
    </section>
  );
};

export default CurriculumRoadmap;
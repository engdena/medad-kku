import { recommendedSkills } from "@/data/mockData";
import { Compass, Clock, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SkillRoadmap = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
            <Compass className="w-3.5 h-3.5" /> Personalized Roadmap
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">Skills the Saudi market wants you to master</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mt-1">
            Recommendations cross-reference your transcript, Vision 2030 priorities, and live demand from MISA-registered employers.
          </p>
        </div>
        <Button variant="outline">View full roadmap <ArrowRight className="w-4 h-4" /></Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {recommendedSkills.map((s) => (
          <article key={s.title} className="group relative rounded-2xl border border-border bg-card p-5 hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute top-5 right-5 text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Match</div>
              <div className="font-display font-bold text-2xl text-gradient">{s.match}%</div>
            </div>
            <div className="pr-16">
              <div className="text-xs text-muted-foreground">{s.provider}</div>
              <h3 className="font-display font-bold text-lg mt-0.5">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.reason}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {s.tags.map((t) => (
                <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">{t}</span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border text-sm">
              <Stat icon={<Clock className="w-3.5 h-3.5" />} label={s.duration} />
              <Stat icon={<TrendingUp className="w-3.5 h-3.5" />} label={`${s.demand}% demand`} />
              <Stat icon={<Wallet className="w-3.5 h-3.5" />} label={s.salary} />
            </div>
            <Button className="mt-4 w-full bg-gradient-primary text-primary-foreground hover:opacity-95">Enroll in pathway</Button>
          </article>
        ))}
      </div>
    </section>
  );
};

const Stat = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">{icon}<span className="font-medium text-foreground">{label}</span></div>
);
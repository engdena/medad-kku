import { industryProjects } from "@/data/mockData";
import { Briefcase, MapPin, Calendar, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CareerMarketplace = () => {
  return (
    <section className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
          <Briefcase className="w-3.5 h-3.5" /> Career Alignment
        </div>
        <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">From graduation project to industry impact</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mt-1">
          Real challenges from Saudi employers — pick a sponsored project as your senior capstone.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {industryProjects.map((p) => (
          <article key={p.title} className="rounded-2xl bg-card border border-border p-5 hover:shadow-elegant transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <div className="text-xs text-muted-foreground">{p.company} · {p.sector}</div>
                    <h3 className="font-display font-bold text-lg leading-tight">{p.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Match</div>
                    <div className="font-display font-bold text-xl text-gradient">{p.match}%</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.skills.map((s) => (
                    <span key={s} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">{s}</span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-muted-foreground">
                  <Meta icon={<MapPin className="w-3 h-3" />} label={p.location} />
                  <Meta icon={<Calendar className="w-3 h-3" />} label={p.deadline} />
                  <Meta icon={<Users className="w-3 h-3" />} label={`${p.seats} seats`} />
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="text-sm font-semibold">{p.budget}</div>
                  <Button size="sm" className="bg-foreground text-background hover:opacity-90">Apply</Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const Meta = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-1.5"><span className="text-primary">{icon}</span>{label}</div>
);
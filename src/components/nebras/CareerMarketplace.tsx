import { industryProjects } from "@/data/mockData";
import { Briefcase, MapPin, Calendar, Users, Building2, Bookmark, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nContext";
import { motion } from "framer-motion";

export const CareerMarketplace = () => {
  const { t, lang } = useI18n();

  return (
    <section className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
          <Briefcase className="w-3.5 h-3.5" /> {t.career.chip}
        </div>
        <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">{t.career.title}</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mt-1">{t.career.sub}</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4">
        {industryProjects.map((p, idx) => {
          const company = lang === "ar" ? p.companyAr : p.company;
          const sector = lang === "ar" ? p.sectorAr : p.sector;
          const title = lang === "ar" ? p.titleAr : p.title;
          const budget = lang === "ar" ? p.budgetAr : p.budget;
          const location = lang === "ar" ? p.locationAr : p.location;
          const deadline = lang === "ar" ? p.deadlineAr : p.deadline;

          return (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl glass p-0 hover:shadow-elegant transition-shadow overflow-hidden"
            >
              {/* Banner */}
              <div className="h-16 bg-gradient-primary relative">
                <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
                  backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--accent)) 0%, transparent 40%)",
                }} />
              </div>

              <div className="px-5 pb-5 -mt-7">
                  <div className="flex items-start gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-card border-4 border-card text-primary grid place-items-center shrink-0 shadow-soft">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div className="flex-1 pt-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="min-w-0">
                        <div className="font-bold text-base text-foreground leading-snug break-words">{company}</div>
                        <div className="text-xs font-medium text-muted-foreground break-words">{sector} · {location}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-success/15 text-success font-bold ring-1 ring-success/30">
                          <CheckCircle2 className="w-3 h-3" /> {t.career.posted}
                        </span>
                        <button className="text-muted-foreground hover:text-primary transition-colors" aria-label={t.career.save}>
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-lg leading-tight mt-3 break-words">{title}</h3>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.skills.map((s) => (
                        <span key={s} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs font-medium text-muted-foreground">
                      <Meta icon={<MapPin className="w-3.5 h-3.5" />} label={location} />
                      <Meta icon={<Calendar className="w-3.5 h-3.5" />} label={deadline} />
                      <Meta icon={<Users className="w-3.5 h-3.5" />} label={t.career.seats(p.seats)} />
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.career.match}</div>
                        <div className="font-display font-bold text-xl text-gradient leading-none">{p.match}%</div>
                      </div>
                      <div className={lang === "ar" ? "text-left" : "text-right"}>
                        <div className="text-xs font-semibold mb-1">{budget}</div>
                        <Button size="sm" className="rounded-2xl bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-soft">
                          {t.career.apply}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

const Meta = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-primary">{icon}</span>
    {label}
  </div>
);
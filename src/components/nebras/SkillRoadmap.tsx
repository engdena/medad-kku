import { recommendedSkills } from "@/data/mockData";
import { Network, Clock, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useI18n } from "@/i18n/I18nContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const SkillRoadmap = () => {
  const { t, lang } = useI18n();

  return (
    <section className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between gap-4 flex-wrap"
      >
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
            <Network className="w-3.5 h-3.5" /> {t.skills.chip}
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">{t.skills.title}</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mt-1">{t.skills.sub}</p>
        </div>
        <Link to="/roadmap">
          <Button variant="outline" className="rounded-2xl gap-2">
            {t.skills.full} <ArrowRight className={`w-4 h-4 ${lang === "ar" ? "flip-rtl" : ""}`} />
          </Button>
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {recommendedSkills.map((s, idx) => {
          const title = lang === "ar" ? s.titleAr : s.title;
          const provider = lang === "ar" ? s.providerAr : s.provider;
          const reason = lang === "ar" ? s.reasonAr : s.reason;
          const tags = lang === "ar" ? s.tagsAr : s.tags;
          const salary = lang === "ar" ? s.salaryAr : s.salary;

          return (
            <HoverCard key={s.title} openDelay={120}>
              <HoverCardTrigger asChild>
                <motion.article
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-3xl glass p-5 hover:shadow-elegant transition-shadow cursor-pointer"
                >
                  <div className={`absolute top-5 ${lang === "ar" ? "left-5" : "right-5"} text-${lang === "ar" ? "left" : "right"}`}>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.skills.match}</div>
                    <div className="font-display font-bold text-2xl text-gradient">{s.match}%</div>
                  </div>
                  <div className={lang === "ar" ? "pl-16" : "pr-16"}>
                    <div className="text-xs text-muted-foreground">{provider}</div>
                    <h3 className="font-display font-bold text-lg mt-0.5">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{reason}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/60 text-sm">
                    <Stat icon={<Clock className="w-3.5 h-3.5" />} label={t.skills.duration(s.duration)} />
                    <Stat icon={<TrendingUp className="w-3.5 h-3.5" />} label={t.skills.demand(s.demand)} />
                    <Stat icon={<Wallet className="w-3.5 h-3.5" />} label={salary} />
                  </div>
                  <Button className="mt-4 w-full rounded-2xl bg-gradient-primary text-primary-foreground hover:opacity-95">
                    {t.skills.enroll}
                  </Button>
                </motion.article>
              </HoverCardTrigger>
              <HoverCardContent className="w-72 glass-strong rounded-2xl">
                <div className="space-y-1.5">
                  <div className="text-xs uppercase tracking-widest text-primary font-semibold">{provider}</div>
                  <div className="font-display font-bold">{title}</div>
                  <p className="text-xs text-muted-foreground">{reason}</p>
                  <div className="text-xs pt-2 border-t border-border/60 mt-2">
                    {t.skills.match}: <span className="font-bold text-primary">{s.match}%</span> · {t.skills.demand(s.demand)}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    </section>
  );
};

const Stat = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
    {icon}
    <span className="font-medium text-foreground">{label}</span>
  </div>
);
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/I18nContext";
import { TopBar } from "@/components/nebras/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingAIButton } from "@/components/medad/FloatingAIButton";
import { talentPool } from "@/data/talentPool";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AIConsultant } from "@/components/nebras/AIConsultant";

const ReadinessRing = ({ value }: { value: number }) => {
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="hsl(var(--muted))" strokeWidth="7" fill="none" />
        <circle
          cx="40" cy="40" r={r}
          stroke="hsl(var(--primary))" strokeWidth="7" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center font-display font-bold text-lg">
        {value}%
      </div>
    </div>
  );
};

export default function CompanyView() {
  const { signOut } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onOpenAI={() => setAiOpen(true)} />
      <AIConsultant open={aiOpen} onOpenChange={setAiOpen} />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">{t.companyView.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t.companyView.sub}</p>
          </div>
          <Button variant="outline" onClick={signOut}>{t.app.signOut}</Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {talentPool.map((p) => (
            <article key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-glow transition-all">
              <header className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">
                    {lang === "ar" ? p.nameAr : p.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "ar" ? p.titleAr : p.title}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mt-1">{p.id}</p>
                </div>
                <ReadinessRing value={p.marketReadiness} />
              </header>

              <section className="mb-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  {t.companyView.technical}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.technicalSkills.map((s) => (
                    <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
                  ))}
                </div>
              </section>

              <section className="mb-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  {t.companyView.soft}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(lang === "ar" ? p.softSkillsAr : p.softSkills).map((s) => (
                    <Badge key={s} variant="outline" className="rounded-full">{s}</Badge>
                  ))}
                </div>
              </section>

              <Button
                className="w-full rounded-xl bg-gradient-primary text-primary-foreground"
                onClick={() => navigate(`/profile/${p.profileSlug}`)}
              >
                {t.companyView.viewPortfolio}
              </Button>
            </article>
          ))}
          {talentPool.length === 0 && (
            <p className="text-muted-foreground">{t.companyView.empty}</p>
          )}
        </div>
      </main>

      <FloatingAIButton />
    </div>
  );
}
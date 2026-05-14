import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/I18nContext";
import { TopBar } from "@/components/nebras/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock, Unlock, FileText } from "lucide-react";
import { toast } from "sonner";
import { FloatingAIButton } from "@/components/medad/FloatingAIButton";
import { supabase } from "@/integrations/supabase/client";
import {
  mapStudentPerformanceRows,
  STUDENT_PERFORMANCE_TABLE,
  type StudentPerformanceClient,
  type StudentPerformanceRecord,
} from "@/lib/studentPerformance";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const [focusStudent, setFocusStudent] = useState<StudentPerformanceRecord | null>(null);
  const [students, setStudents] = useState<StudentPerformanceRecord[]>(() => mapStudentPerformanceRows([]));
  const [transcriptAccess, setTranscriptAccess] = useState<Record<string, "locked" | "requested" | "granted">>({});

  const requestTranscript = (id: string) => {
    setTranscriptAccess((prev) => ({ ...prev, [id]: "requested" }));
    toast.success(t.companyView.requestSent);
    // Demo: auto-grant after a short delay so the workflow is visible
    setTimeout(() => {
      setTranscriptAccess((prev) => ({ ...prev, [id]: "granted" }));
    }, 1800);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const { data, error } = await (supabase as unknown as StudentPerformanceClient)
        .from(STUDENT_PERFORMANCE_TABLE)
        .select("*");

      if (error) {
        console.error("Unable to load student performance readiness data", error);
      }

      if (mounted) {
        setStudents(mapStudentPerformanceRows(error ? [] : data));
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onOpenAI={() => setAiOpen(true)} />
      <AIConsultant
        open={aiOpen}
        onOpenChange={(v) => { setAiOpen(v); if (!v) setFocusStudent(null); }}
        focusStudent={focusStudent}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">{t.companyView.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t.companyView.sub}</p>
          </div>
          <Button variant="outline" onClick={signOut}>{t.app.signOut}</Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {students.map((p, idx) => (
            <article key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-glow transition-all">
              <header className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight flex items-center gap-2 flex-wrap">
                    {lang === "ar" ? p.nameAr : p.name}
                    {idx === 0 && p.name.toLowerCase().startsWith("faisal") && (
                      <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/10">
                        {lang === "ar" ? "الأفضل أداءً" : "Top Performer"}
                      </Badge>
                    )}
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
                  {p.softSkills.map((s) => (
                    <Badge key={s} variant="outline" className="rounded-full">{s}</Badge>
                  ))}
                </div>
              </section>

              <div className="flex flex-col gap-2">
                <Button
                  className="w-full rounded-xl bg-gradient-primary text-primary-foreground"
                  onClick={() => navigate(`/profile/${p.profileSlug}`)}
                >
                  {t.companyView.viewPortfolio}
                </Button>
                {(() => {
                  const state = transcriptAccess[p.id] ?? "locked";
                  if (state === "granted") {
                    return (
                      <Button
                        variant="secondary"
                        className="w-full rounded-xl gap-1.5"
                        onClick={() => navigate(`/profile/${p.profileSlug}`)}
                      >
                        <Unlock className="w-4 h-4" />
                        {t.companyView.transcript}
                        <Badge className="ms-1 bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100">
                          {t.companyView.granted}
                        </Badge>
                      </Button>
                    );
                  }
                  return (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl gap-1.5"
                      disabled={state === "requested"}
                      onClick={() => requestTranscript(p.id)}
                    >
                      <Lock className="w-4 h-4" />
                      {state === "requested"
                        ? t.companyView.requestSent
                        : `${t.companyView.locked} · ${t.companyView.request}`}
                      <FileText className="w-3.5 h-3.5 opacity-60" />
                    </Button>
                  );
                })()}
                <Button
                  variant="outline"
                  className="w-full rounded-xl gap-1.5"
                  onClick={() => { setFocusStudent(p); setAiOpen(true); }}
                >
                  <Sparkles className="w-4 h-4" />
                  {lang === "ar" ? "تحليل الذكاء الاصطناعي" : "AI Fit Analysis"}
                </Button>
              </div>
            </article>
          ))}
          {students.length === 0 && (
            <p className="text-muted-foreground">{t.companyView.empty}</p>
          )}
        </div>
      </main>

      <FloatingAIButton />
    </div>
  );
}
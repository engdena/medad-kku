import { useAuth } from "@/hooks/useAuth";
import { useStudentData, distinctionFromData } from "@/hooks/useStudentData";
import { useI18n } from "@/i18n/I18nContext";
import { MarketReadinessGauge } from "@/components/medad/MarketReadinessGauge";
import { Award, BookOpen, Sparkles } from "lucide-react";

const Ring = ({ value, label, sub, accent = "primary" }: { value: number; label: string; sub: string; accent?: "primary" | "accent" }) => {
  const v = Math.min(100, Math.max(0, value));
  const r = 52, c = 2 * Math.PI * r, off = c - (v / 100) * c;
  const stroke = accent === "primary" ? "hsl(var(--primary))" : "hsl(var(--accent))";
  return (
    <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{sub}</div>
      <h3 className="font-display font-bold text-2xl mt-1">{label}</h3>
      <div className="relative w-44 h-44 mx-auto mt-4">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
          <circle cx="60" cy="60" r={r} stroke={stroke} strokeWidth="10" fill="none"
            strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
            className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-display text-4xl font-bold leading-none" style={{ color: stroke }}>{v}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">/ 100</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudentDashboardTab = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data } = useStudentData(user?.id);

  const readiness = data?.market_readiness_score ?? 0;
  const distinction = distinctionFromData(data);
  const hours = data?.self_learning_hours ?? 0;
  const certs = data?.certifications ?? 0;

  return (
    <section className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-5">
        <MarketReadinessGauge value={readiness} />
        <Ring
          value={distinction}
          label={t.distinction.title}
          sub={t.distinction.sub}
          accent="accent"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={<BookOpen className="w-4 h-4 text-primary" />} label={t.skillsMatrix.selfLearning} value={`${hours} h`} />
        <Stat icon={<Award className="w-4 h-4 text-accent" />} label={t.skillsMatrix.certifications} value={String(certs)} />
        <Stat icon={<Sparkles className="w-4 h-4 text-primary" />} label="GPA" value={data?.university_gpa ? `${Number(data.university_gpa).toFixed(2)} / 5.0` : "—"} />
      </div>
    </section>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl bg-card border border-border p-4 shadow-soft flex items-center justify-between">
    <div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display font-bold text-2xl mt-0.5">{value}</div>
    </div>
    <div className="w-10 h-10 rounded-2xl bg-secondary grid place-items-center">{icon}</div>
  </div>
);

export default StudentDashboardTab;

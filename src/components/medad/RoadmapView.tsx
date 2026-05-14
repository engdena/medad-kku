import { useAuth } from "@/hooks/useAuth";
import { useStudentData } from "@/hooks/useStudentData";
import { useI18n } from "@/i18n/I18nContext";
import { Compass, Target, CheckCircle2, Circle } from "lucide-react";

type Step = { code: string; title: string; titleAr: string; focus: string; focusAr: string };

const IE_CURRICULUM: Step[] = [
  { code: "IE 200", title: "Engineering Economy", titleAr: "الاقتصاد الهندسي", focus: "Cash flow, NPV, IRR, capital budgeting", focusAr: "التدفقات النقدية، صافي القيمة الحالية، معدل العائد الداخلي" },
  { code: "IE 310", title: "Operations Research", titleAr: "بحوث العمليات", focus: "LP, optimization, network models", focusAr: "البرمجة الخطية والنماذج الشبكية" },
  { code: "IE 320", title: "Statistical Quality Control", titleAr: "ضبط الجودة الإحصائي", focus: "SPC, Six Sigma, Minitab", focusAr: "ضبط العمليات الإحصائي وستة سيجما" },
  { code: "IE 350", title: "Production & Manufacturing Systems", titleAr: "نظم الإنتاج والتصنيع", focus: "Lean, Kanban, scheduling", focusAr: "التصنيع الرشيق والجدولة" },
  { code: "IE 410", title: "Supply Chain & Logistics", titleAr: "سلاسل الإمداد واللوجستيات", focus: "Inventory, demand planning, SAP", focusAr: "إدارة المخزون والتخطيط للطلب" },
  { code: "IE 460", title: "Facilities Planning & Simulation", titleAr: "تخطيط المنشآت والمحاكاة", focus: "Layout, capacity, Arena/Simio", focusAr: "تخطيط الموقع والمحاكاة" },
  { code: "IE 490", title: "Senior Capstone Project", titleAr: "مشروع التخرج", focus: "End-to-end industry consulting case", focusAr: "حالة استشارية صناعية متكاملة" },
];

export const RoadmapView = () => {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { data } = useStudentData(user?.id);

  const goal = (data?.career_goals && data.career_goals.trim())
    ? data.career_goals
    : "Strategy & Operations Consulting (MBB-track) aligned with Saudi Vision 2030";

  // Heuristic progress from self-learning hours
  const hours = data?.self_learning_hours ?? 0;
  const completedCount = Math.min(IE_CURRICULUM.length, Math.floor(hours / 25));

  return (
    <section className="space-y-5">
      <div>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
          <Compass className="w-3.5 h-3.5" /> {t.tabs.roadmap}
        </div>
        <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">
          {lang === "ar" ? "خارطة طريق هندسة صناعية إلى هدفك" : "Industrial Engineering path to your goal"}
        </h2>
      </div>

      <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-5 shadow-glow">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-foreground/15 grid place-items-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest opacity-80">
              {lang === "ar" ? "الهدف النهائي" : "Final Milestone"}
            </div>
            <div className="font-display font-bold text-lg leading-snug mt-0.5">{goal}</div>
          </div>
        </div>
      </div>

      <ol className="relative border-s-2 border-border ms-4 space-y-4">
        {IE_CURRICULUM.map((s, i) => {
          const done = i < completedCount;
          const active = i === completedCount;
          return (
            <li key={s.code} className="ms-6">
              <span className={`absolute -start-3 grid place-items-center w-6 h-6 rounded-full ${
                done ? "bg-primary text-primary-foreground" : active ? "bg-accent text-accent-foreground" : "bg-card border border-border text-muted-foreground"
              }`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
              </span>
              <div className={`rounded-2xl border p-4 ${active ? "border-primary/60 bg-primary/5" : "border-border bg-card"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-display font-bold">
                    {s.code} · {lang === "ar" ? s.titleAr : s.title}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full ${
                    done ? "bg-primary/15 text-primary" : active ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {done ? (lang === "ar" ? "مكتمل" : "Completed") : active ? (lang === "ar" ? "الحالي" : "In Progress") : (lang === "ar" ? "قادم" : "Upcoming")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? s.focusAr : s.focus}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default RoadmapView;

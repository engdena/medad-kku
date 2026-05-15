import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateDistinction, industryProjects } from "@/data/mockData";
import { useStudentActivities } from "@/hooks/useStudentActivities";
import { useI18n } from "@/i18n/I18nContext";
import { CommandTopBar } from "@/components/medad/CommandTopBar";
import type { SectionKey } from "@/components/medad/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  BarChart3,
  FileSpreadsheet,
  TrendingUp,
  Truck,
  Languages,
  ClipboardList,
  MapPin,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  { id: 1, title: "Foundations", titleAr: "التأسيس", icon: Zap, points: "+5" },
  { id: 2, title: "Specialization", titleAr: "التخصص", icon: Award, points: "+10" },
  { id: 3, title: "Industry Impact", titleAr: "الأثر الصناعي", icon: Briefcase, points: "+15" },
] as const;

const CERTIFICATIONS = [
  {
    title: "Certified Associate in Project Management (CAPM)",
    titleAr: "شهادة المساعد المعتمد في إدارة المشاريع (CAPM)",
    icon: ClipboardList,
    tags: ["Students", "Graduates", "Engineering", "Administration"],
    tagsAr: ["طلاب", "خريجون", "هندسة", "إدارة"],
    price: "850 SAR",
    priceAr: "850 ر.س",
    provider: "PMI",
    providerAr: "PMI",
    demandBoost: 28,
    link: "https://www.pmi.org/certifications/certified-associate-capm",
  },
  {
    title: "Google Data Analytics Professional Certificate",
    titleAr: "شهادة جوجل المهنية في تحليل البيانات",
    icon: BarChart3,
    tags: ["Tech", "Administration", "Data Analysis"],
    tagsAr: ["تقنية", "إدارة", "تحليل بيانات"],
    price: "190 SAR / month",
    priceAr: "190 ر.س / شهر",
    provider: "Coursera",
    providerAr: "كورسيرا",
    demandBoost: 35,
    link: "https://www.coursera.org/professional-certificates/google-data-analytics",
  },
  {
    title: "Microsoft Power BI Data Analyst Associate (PL-300)",
    titleAr: "محلل بيانات Power BI من مايكروسوفت (PL-300)",
    icon: TrendingUp,
    tags: ["Data Analysis", "Engineering", "Statistics"],
    tagsAr: ["تحليل بيانات", "هندسة", "إحصاء"],
    price: "620 SAR",
    priceAr: "620 ر.س",
    provider: "Microsoft",
    providerAr: "مايكروسوفت",
    demandBoost: 32,
    link: "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/",
  },
  {
    title: "Microsoft Office Specialist: Excel Expert (MO-211)",
    titleAr: "أخصائي مايكروسوفت أوفيس: خبير إكسل (MO-211)",
    icon: FileSpreadsheet,
    tags: ["All Majors", "Core Skill"],
    tagsAr: ["جميع التخصصات", "مهارة أساسية"],
    price: "375 SAR",
    priceAr: "375 ر.س",
    provider: "Microsoft",
    providerAr: "مايكروسوفت",
    demandBoost: 18,
    link: "https://learn.microsoft.com/en-us/credentials/certifications/mos-excel-expert-2019/",
  },
  {
    title: "Lean Six Sigma Green Belt (ICGB)",
    titleAr: "الحزام الأخضر في لين سيكس سيغما (ICGB)",
    icon: Award,
    tags: ["Industrial Engineering", "Quality Management"],
    tagsAr: ["هندسة صناعية", "إدارة الجودة"],
    price: "1,500 SAR",
    priceAr: "1,500 ر.س",
    provider: "Hadaf",
    providerAr: "هدف",
    demandBoost: 40,
    link: "https://iassc.org/six-sigma-certification/green-belt-certification/",
  },
  {
    title: "Certified Supply Chain Professional (CSCP)",
    titleAr: "المحترف المعتمد في سلاسل الإمداد (CSCP)",
    icon: Truck,
    tags: ["Logistics", "Industrial Engineering"],
    tagsAr: ["لوجستيات", "هندسة صناعية"],
    price: "14,000 SAR",
    priceAr: "14,000 ر.س",
    provider: "ASCM",
    providerAr: "ASCM",
    demandBoost: 45,
    link: "https://www.ascm.org/learning-development/certifications-credentials/cscp/",
  },
  {
    title: "IELTS Preparation — Doroob Platform",
    titleAr: "التحضير لاختبار آيلتس — منصة دروب",
    icon: Languages,
    tags: ["English Language Development"],
    tagsAr: ["تطوير اللغة الإنجليزية"],
    price: "Free (Supported by HADAF)",
    priceAr: "مجاني (بدعم من هدف)",
    provider: "Doroob",
    providerAr: "دروب",
    demandBoost: 22,
    link: "https://doroob.sa/ar/",
  },
] as const;

export const StrategicRoadmap = () => {
  const { activities } = useStudentActivities();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  useEffect(() => {
    if (lang !== "ar") setLang("ar");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const distinction = calculateDistinction(activities);
  const readiness = Math.min(100, Math.round((distinction.percentage + 78) / 2));

  // Determine current step from readiness
  const currentStep = readiness < 40 ? 1 : readiness < 75 ? 2 : 3;

  const handleNavSelect = (s: SectionKey) => {
    if (s === "roadmap") return;
    if (s === "mentor") navigate("/mentor");
    else navigate("/");
  };

  return (
    <SidebarProvider defaultOpen={false}>
    <div className="min-h-screen w-full bg-gradient-subtle" dir={dir} style={{ fontFamily: isAr ? "'Cairo', 'Inter', system-ui, sans-serif" : undefined }}>
      <CommandTopBar active="roadmap" onSelect={handleNavSelect} />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 md:py-8 space-y-6">

        {/* Header + readiness */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass p-5 shadow-soft flex items-center justify-between gap-4 flex-wrap"
        >
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight leading-tight">
              {t.roadmap.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">{t.roadmap.sub}</p>
          </div>
          <div className="min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="inline-flex items-center gap-1.5 uppercase tracking-widest text-muted-foreground">
                <Target className="w-3.5 h-3.5 text-primary" /> {t.roadmap.readiness}
              </span>
              <span className="text-primary text-base">{readiness}%</span>
            </div>
            <Progress value={readiness} className="mt-2 h-2" />
          </div>
        </motion.section>

        {/* Horizontal Stepper */}
        <section className="rounded-3xl glass p-6 shadow-soft">
          <div className="relative">
            {/* progress line */}
            <div className="absolute top-7 left-[10%] right-[10%] h-1 bg-border rounded-full" />
            <div
              className={`absolute top-7 h-1 bg-gradient-to-r from-primary to-accent rounded-full transition-all ${isAr ? "right-[10%]" : "left-[10%]"}`}
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 80}%` }}
            />
            <div className="grid grid-cols-3 relative">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = s.id <= currentStep;
                const title = isAr ? s.titleAr : s.title;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex flex-col items-center text-center gap-2"
                  >
                    <div
                      className={`relative z-10 grid h-14 w-14 place-items-center rounded-2xl ring-4 ring-background shadow-elegant transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground border border-border"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="font-display font-bold text-sm md:text-base">{title}</div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {s.points} {isAr ? "نقطة" : "pts"}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Industry Opportunities — horizontal */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
                <Briefcase className="w-3.5 h-3.5" /> {isAr ? "الفرص الصناعية" : "Industry Opportunities"}
              </div>
              <h2 className="font-display font-bold text-xl md:text-2xl mt-1">
                {isAr ? `مشاريع مموَّلة · ${industryProjects.length} متاحة` : `Sponsored projects · ${industryProjects.length} live`}
              </h2>
            </div>
            <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">
              {isAr ? "+15 نقطة عند الإكمال" : "+15 pts on completion"}
            </span>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-thin">
            <div className="flex gap-4 min-w-max">
              {industryProjects.map((p, idx) => {
                const company = isAr ? p.companyAr : p.company;
                const sector = isAr ? p.sectorAr : p.sector;
                const title = isAr ? p.titleAr : p.title;
                const location = isAr ? p.locationAr : p.location;
                const deadline = isAr ? p.deadlineAr : p.deadline;
                return (
                  <motion.article
                    key={p.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="w-[280px] shrink-0 rounded-3xl glass p-4 shadow-soft border border-border/70 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-card border border-border text-primary shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="inline-flex items-center text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full ring-1 ring-primary/20">
                        {p.match}% {isAr ? "توافق" : "Match"}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="font-bold text-sm text-foreground leading-snug">{company}</div>
                      <div className="text-[11px] text-muted-foreground">{sector}</div>
                    </div>
                    <h3 className="font-display font-bold text-sm leading-tight mt-2 line-clamp-2">
                      {title}
                    </h3>
                    <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {deadline}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="mt-4 w-full rounded-2xl bg-gradient-primary text-primary-foreground hover:opacity-95"
                    >
                      {isAr ? "تقدّم" : "Apply"}
                    </Button>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recommended Certifications */}
        <section className="space-y-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> {isAr ? "إجراءات موصى بها" : "Recommended Actions"}
            </div>
            <h2 className="font-display font-bold text-xl md:text-2xl mt-1">
              {isAr ? "عزز مؤشر التميز عبر شهادات احترافية" : "Boost your Distinction Index"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isAr
                ? "شهادات مختارة لتسريع جاهزيتك المهنية. سجّل مباشرة من الجهة المانحة."
                : "Curated professional certifications to accelerate your readiness. Enroll directly with the issuing provider."}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {CERTIFICATIONS.map((c, idx) => {
              const Icon = c.icon;
              const title = isAr ? c.titleAr : c.title;
              const tags = isAr ? c.tagsAr : c.tags;
              const price = isAr ? c.priceAr : c.price;
              const provider = isAr ? c.providerAr : c.provider;
              return (
                <motion.div
                  key={c.link}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl glass p-4 shadow-soft flex flex-col border border-border/70"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      {price}
                    </span>
                  </div>
                  <div className="font-display font-bold text-sm mt-3 leading-tight line-clamp-2 min-h-[2.5rem]">
                    {title}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                      <div className="grid h-5 w-5 place-items-center rounded-md bg-muted border border-border/70 text-[8px] font-black text-foreground">
                        {provider.charAt(0)}
                      </div>
                      <span>{isAr ? `عبر ${provider}` : `via ${provider}`}</span>
                    </div>
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full whitespace-nowrap ring-1 ring-primary/20">
                      {isAr ? `+${c.demandBoost}٪ طلب` : `+${c.demandBoost}% demand`}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-muted-foreground bg-muted/60 border border-border/60 px-1.5 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-3"
                  >
                    <Button
                      size="sm"
                      className="w-full rounded-xl text-[11px] bg-gradient-primary text-primary-foreground gap-1.5"
                    >
                      {isAr ? `سجّل عبر ${provider}` : `Enroll via ${provider}`}
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
    </SidebarProvider>
  );
};

export default StrategicRoadmap;

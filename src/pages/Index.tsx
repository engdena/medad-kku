import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar, type SectionKey } from "@/components/medad/AppSidebar";
import { CommandTopBar } from "@/components/medad/CommandTopBar";
import { GlobalPerformanceHeader } from "@/components/medad/GlobalPerformanceHeader";
import { CoursesTable } from "@/components/nebras/CoursesTable";
import { SkillRoadmap } from "@/components/nebras/SkillRoadmap";
import { CareerMarketplace } from "@/components/nebras/CareerMarketplace";
import { AIConsultant } from "@/components/nebras/AIConsultant";
import { GpaTrendChart } from "@/components/nebras/GpaTrendChart";
import { MarketReadinessGauge } from "@/components/medad/MarketReadinessGauge";
import { SkillsMatrix } from "@/components/medad/SkillsMatrix";
import { CurriculumRoadmap } from "@/components/medad/CurriculumRoadmap";
import { MentorChat } from "@/components/medad/MentorChat";
import { FloatingAIButton } from "@/components/medad/FloatingAIButton";
import { PortfolioAchievements } from "@/components/medad/PortfolioAchievements";
import { RecentAchievementsFeed } from "@/components/medad/RecentAchievementsFeed";
import { InsightWidgets } from "@/components/medad/InsightWidgets";
import { useI18n } from "@/i18n/I18nContext";
import { useStudentData } from "@/hooks/useStudentData";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { student } from "@/data/mockData";
import { TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const [section, setSection] = useState<SectionKey>("dashboard");
  const { user } = useAuth();
  const { data } = useStudentData(user?.id);
  const isMobile = useIsMobile();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const ar = lang === "ar";
  const L = (en: string, arS: string) => (ar ? arS : en);

  const goPortfolioAndAdd = () => {
    setSection("portfolio");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("medad:open-portfolio-dialog"));
    }, 50);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-24 w-[34rem] h-[34rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -right-24 w-[30rem] h-[30rem] rounded-full bg-accent/10 blur-3xl" />
        </div>

        {isMobile && <AppSidebar active={section} onSelect={setSection} />}

        <SidebarInset className="bg-transparent">
          <CommandTopBar active={section} onSelect={setSection} />

          <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-6 md:py-10 transition-all duration-300">
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {section === "dashboard" && (
                  <div className="space-y-6">
                    <GlobalPerformanceHeader marketReadiness={data?.market_readiness_score ?? 0} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      <div className="lg:col-span-8 space-y-5">
                        <RecentAchievementsFeed
                          onAdd={goPortfolioAndAdd}
                          onViewAll={() => setSection("portfolio")}
                        />
                        <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                                {t.hero.gpa}
                              </div>
                              <div className="font-display font-bold text-2xl text-foreground">
                                {student.gpa.toFixed(2)}
                                <span className="text-sm font-normal text-muted-foreground">
                                  {" "}
                                  / {student.gpaScale}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-primary inline-flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> {t.hero.gpaDelta}
                            </div>
                          </div>
                          <GpaTrendChart data={student.trend} labels={student.semesters} />
                        </div>
                      </div>
                      <div className="lg:col-span-4">
                        <InsightWidgets onOpenRoadmap={() => setSection("roadmap")} />
                      </div>
                    </div>
                  </div>
                )}

                {section === "portfolio" && (
                  <div className="space-y-8">
                    <SectionHeader
                      title={L("Portfolio & Skills", "الملف والمهارات")}
                      sub={L(
                        "Log every skill, certification, and achievement that contributes to your Distinction Index.",
                        "سجّل كل مهارة وشهادة وإنجاز يساهم في نسبة التميز."
                      )}
                    />
                    <PortfolioAchievements />
                    <SkillsMatrix />
                    <CoursesTable />
                  </div>
                )}

                {section === "roadmap" && (
                  <div className="space-y-8">
                    <SectionHeader
                      title={L("Strategic Roadmap", "الخارطة الاستراتيجية")}
                      sub={L(
                        "A guided path from coursework to industry impact, aligned with Vision 2030.",
                        "خارطة موجّهة من المقررات الأكاديمية إلى الأثر الصناعي بما يتوافق مع رؤية 2030."
                      )}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
                      <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">
                          {t.readiness.title}
                        </div>
                        <div className="mt-2">
                          <MarketReadinessGauge value={data?.market_readiness_score ?? 0} />
                        </div>
                      </div>
                      <InsightWidgets onOpenRoadmap={() => navigate("/roadmap")} />
                    </div>
                    <CurriculumRoadmap />
                    <SkillRoadmap />
                    <CareerMarketplace />
                  </div>
                )}

                {section === "mentor" && (
                  <div className="space-y-6">
                    <SectionHeader
                      title={L("Mentorship", "الإرشاد الأكاديمي")}
                      sub={L(
                        "Direct, secured messaging with your assigned academic advisor.",
                        "تواصل مباشر وآمن مع المرشد الأكاديمي المخصص لك."
                      )}
                    />
                    <MentorChat />
                  </div>
                )}

                {section === "settings" && (
                  <div className="space-y-6">
                    <SectionHeader
                      title={L("Settings", "الإعدادات")}
                      sub={L(
                        "Manage your account, language, and accessibility preferences from the top bar.",
                        "إدارة الحساب واللغة وخيارات الوصول من شريط القيادة في الأعلى."
                      )}
                    />
                    <div className="rounded-3xl bg-card border border-border p-8 text-center text-sm text-muted-foreground">
                      {L(
                        "Additional settings will appear here as new modules launch.",
                        "ستظهر إعدادات إضافية هنا مع إطلاق الوحدات الجديدة."
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <footer className="pt-10 mt-10 pb-6 border-t border-border/60 text-center text-xs text-muted-foreground">
              {t.footer}
            </footer>
          </div>
        </SidebarInset>

        <AIConsultant open={aiOpen} onOpenChange={setAiOpen} />
        <FloatingAIButton />
      </div>
    </SidebarProvider>
  );
};

const SectionHeader = ({ title, sub }: { title: string; sub: string }) => (
  <div>
    <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
    <p className="mt-1 text-sm md:text-base text-muted-foreground max-w-2xl">{sub}</p>
  </div>
);

export default Index;

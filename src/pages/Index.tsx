import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar, type SectionKey } from "@/components/medad/AppSidebar";
import { CommandTopBar } from "@/components/medad/CommandTopBar";
import { GlobalPerformanceHeader } from "@/components/medad/GlobalPerformanceHeader";
import { CoursesTable } from "@/components/nebras/CoursesTable";
import { AIConsultant } from "@/components/nebras/AIConsultant";
import { GpaTrendChart } from "@/components/nebras/GpaTrendChart";
import { SkillsMatrix } from "@/components/medad/SkillsMatrix";
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
import { TrendingUp, Languages, Sun, Moon, Eye, Volume2, Type } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const [section, setSection] = useState<SectionKey>("dashboard");
  const { user } = useAuth();
  const { data } = useStudentData(user?.id);
  const isMobile = useIsMobile();
  const { t, lang, setLang } = useI18n();
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  const {
    highContrast,
    toggleHighContrast,
    ttsEnabled,
    toggleTts,
    largeText,
    toggleLargeText,
  } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();
  const ar = lang === "ar";
  const L = (en: string, arS: string) => (ar ? arS : en);

  useEffect(() => {
    const s = (location.state as { section?: SectionKey } | null)?.section;
    if (s) setSection(s);
  }, [location.state]);

  const goPortfolioAndAdd = () => {
    setSection("portfolio");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("medad:open-portfolio-dialog"));
    }, 50);
  };

  // The "Strategic Roadmap" tab is the single entry point for the roadmap.
  // Selecting it always routes to the dedicated /roadmap page (single source of truth).
  const handleSelect = (key: SectionKey) => {
    if (key === "roadmap") {
      navigate("/roadmap");
      return;
    }
    setSection(key);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-24 w-[34rem] h-[34rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -right-24 w-[30rem] h-[30rem] rounded-full bg-accent/10 blur-3xl" />
        </div>

        {isMobile && <AppSidebar active={section} onSelect={handleSelect} />}

        <SidebarInset className="bg-transparent">
          <CommandTopBar active={section} onSelect={handleSelect} />

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
                        "Manage your language, theme, and accessibility preferences.",
                        "إدارة اللغة والمظهر وخيارات إمكانية الوصول."
                      )}
                    />

                    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                          <Languages className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{L("Language", "اللغة")}</div>
                          <div className="text-sm text-muted-foreground">
                            {L("Choose your interface language.", "اختر لغة الواجهة.")}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={lang === "en" ? "default" : "outline"}
                            className="rounded-xl"
                            onClick={() => setLang("en")}
                          >
                            English
                          </Button>
                          <Button
                            size="sm"
                            variant={lang === "ar" ? "default" : "outline"}
                            className="rounded-xl"
                            onClick={() => setLang("ar")}
                          >
                            العربية
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                          {dark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{L("Dark mode", "الوضع الداكن")}</div>
                          <div className="text-sm text-muted-foreground">
                            {L("Switch between light and dark themes.", "التبديل بين الوضع الفاتح والداكن.")}
                          </div>
                        </div>
                        <Switch checked={dark} onCheckedChange={setDark} />
                      </div>
                    </div>

                    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
                      <div className="font-display font-bold text-lg">
                        {L("Accessibility", "إمكانية الوصول")}
                      </div>
                      <SettingRow
                        icon={<Eye className="w-5 h-5" />}
                        title={t.a11y.hc.t}
                        desc={t.a11y.hc.d}
                        checked={highContrast}
                        onChange={toggleHighContrast}
                      />
                      <SettingRow
                        icon={<Volume2 className="w-5 h-5" />}
                        title={t.a11y.tts.t}
                        desc={t.a11y.tts.d}
                        checked={ttsEnabled}
                        onChange={toggleTts}
                      />
                      <SettingRow
                        icon={<Type className="w-5 h-5" />}
                        title={t.a11y.large.t}
                        desc={t.a11y.large.d}
                        checked={largeText}
                        onChange={toggleLargeText}
                      />
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

const SettingRow = ({
  icon,
  title,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="flex items-start gap-3 p-4 rounded-2xl border border-border/60 bg-card/60">
    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">{icon}</div>
    <div className="flex-1">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default Index;

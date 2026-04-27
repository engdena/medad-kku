import { useState } from "react";
import { TopBar } from "@/components/nebras/TopBar";
import { HeroDashboard } from "@/components/nebras/HeroDashboard";
import { CoursesTable } from "@/components/nebras/CoursesTable";
import { SkillRoadmap } from "@/components/nebras/SkillRoadmap";
import { CareerMarketplace } from "@/components/nebras/CareerMarketplace";
import { AIConsultant } from "@/components/nebras/AIConsultant";
import { ActivityPortfolio } from "@/components/nebras/ActivityPortfolio";
import { DistinctionGauge } from "@/components/nebras/DistinctionGauge";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { useI18n } from "@/i18n/I18nContext";
import { useStudentActivities } from "@/hooks/useStudentActivities";

const Index = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const { activities, setActivities } = useStudentActivities();
  const { t } = useI18n();

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gradient-subtle">
        {/* Decorative background blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-24 w-[34rem] h-[34rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 -right-24 w-[30rem] h-[30rem] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <TopBar onOpenAI={() => setAiOpen(true)} />

        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 md:py-10 space-y-10 md:space-y-14">
          <HeroDashboard />
          <CoursesTable />
          <div className="grid lg:grid-cols-[1fr_390px] gap-4 items-start">
            <ActivityPortfolio activities={activities} setActivities={setActivities} />
            <DistinctionGauge activities={activities} />
          </div>
          <SkillRoadmap />
          <CareerMarketplace />

          <footer className="pt-10 pb-6 border-t border-border/60 text-center text-xs text-muted-foreground">
            {t.footer}
          </footer>
        </main>

        <AIConsultant open={aiOpen} onOpenChange={setAiOpen} />
      </div>
    </AccessibilityProvider>
  );
};

export default Index;
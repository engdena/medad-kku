import { useState } from "react";
import { TopBar } from "@/components/nebras/TopBar";
import { HeroDashboard } from "@/components/nebras/HeroDashboard";
import { CoursesTable } from "@/components/nebras/CoursesTable";
import { SkillRoadmap } from "@/components/nebras/SkillRoadmap";
import { CareerMarketplace } from "@/components/nebras/CareerMarketplace";
import { AIConsultant } from "@/components/nebras/AIConsultant";
import { ActivityPortfolio } from "@/components/nebras/ActivityPortfolio";
import { DistinctionGauge } from "@/components/nebras/DistinctionGauge";
import { MarketReadinessGauge } from "@/components/medad/MarketReadinessGauge";
import { SkillsMatrix } from "@/components/medad/SkillsMatrix";
import { CurriculumRoadmap } from "@/components/medad/CurriculumRoadmap";
import { MentorChat } from "@/components/medad/MentorChat";
import { FloatingAIButton } from "@/components/medad/FloatingAIButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/i18n/I18nContext";
import { useStudentActivities } from "@/hooks/useStudentActivities";
import { useStudentData } from "@/hooks/useStudentData";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const { activities, setActivities } = useStudentActivities();
  const { user } = useAuth();
  const { data } = useStudentData(user?.id);
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-[34rem] h-[34rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 -right-24 w-[30rem] h-[30rem] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <TopBar onOpenAI={() => setAiOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 md:py-10">
        <HeroDashboard />

        <Tabs defaultValue="dashboard" className="mt-8">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-card border border-border rounded-2xl p-1">
            <TabsTrigger value="dashboard" className="rounded-xl">{t.tabs.dashboard}</TabsTrigger>
            <TabsTrigger value="skills" className="rounded-xl">{t.tabs.skills}</TabsTrigger>
            <TabsTrigger value="roadmap" className="rounded-xl">{t.tabs.roadmap}</TabsTrigger>
            <TabsTrigger value="mentor" className="rounded-xl">{t.tabs.mentor}</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 mt-6">
            <div className="grid md:grid-cols-2 gap-5">
              <MarketReadinessGauge value={data?.market_readiness_score ?? 0} />
              <DistinctionGauge activities={activities} />
            </div>
            <CoursesTable />
            <CareerMarketplace />
            <ActivityPortfolio activities={activities} setActivities={setActivities} />
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <SkillsMatrix />
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-10 mt-6">
            <CurriculumRoadmap />
            <SkillRoadmap />
          </TabsContent>

          <TabsContent value="mentor" className="mt-6">
            <MentorChat />
          </TabsContent>
        </Tabs>

        <footer className="pt-10 mt-10 pb-6 border-t border-border/60 text-center text-xs text-muted-foreground">
          {t.footer}
        </footer>
      </main>

      <AIConsultant open={aiOpen} onOpenChange={setAiOpen} />
      <FloatingAIButton />
    </div>
  );
};

export default Index;
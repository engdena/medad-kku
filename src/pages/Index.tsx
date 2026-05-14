import { useState } from "react";
import { TopBar } from "@/components/nebras/TopBar";
import { HeroDashboard } from "@/components/nebras/HeroDashboard";
import { CoursesTable } from "@/components/nebras/CoursesTable";
import { SkillRoadmap } from "@/components/nebras/SkillRoadmap";
import { CareerMarketplace } from "@/components/nebras/CareerMarketplace";
import { AIConsultant } from "@/components/nebras/AIConsultant";
import { DistinctionGauge } from "@/components/nebras/DistinctionGauge";
import { GpaTrendChart } from "@/components/nebras/GpaTrendChart";
import { MarketReadinessGauge } from "@/components/medad/MarketReadinessGauge";
import { SkillsMatrix } from "@/components/medad/SkillsMatrix";
import { CurriculumRoadmap } from "@/components/medad/CurriculumRoadmap";
import { MentorChat } from "@/components/medad/MentorChat";
import { FloatingAIButton } from "@/components/medad/FloatingAIButton";
import { PortfolioAchievements } from "@/components/medad/PortfolioAchievements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/i18n/I18nContext";
import { useStudentActivities } from "@/hooks/useStudentActivities";
import { useStudentData } from "@/hooks/useStudentData";
import { useAuth } from "@/hooks/useAuth";
import { student } from "@/data/mockData";
import { TrendingUp } from "lucide-react";

const Index = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const { activities } = useStudentActivities();
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

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-card border border-border rounded-2xl p-1">
            <TabsTrigger value="overview" className="rounded-xl">{t.tabs.overview}</TabsTrigger>
            <TabsTrigger value="skills" className="rounded-xl">{t.tabs.skillsCourses}</TabsTrigger>
            <TabsTrigger value="portfolio" className="rounded-xl">{t.tabs.portfolio}</TabsTrigger>
            <TabsTrigger value="projects" className="rounded-xl">{t.tabs.projects}</TabsTrigger>
            <TabsTrigger value="roadmap" className="rounded-xl">{t.tabs.roadmap}</TabsTrigger>
            <TabsTrigger value="mentor" className="rounded-xl">{t.tabs.mentor}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-5 items-start">
              <DistinctionGauge activities={activities} />
              <div className="grid gap-5">
                <MarketReadinessGauge value={data?.market_readiness_score ?? 0} />
                <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.hero.gpa}</div>
                      <div className="font-display font-bold text-2xl text-foreground">
                        {student.gpa.toFixed(2)}
                        <span className="text-sm font-normal text-muted-foreground"> / {student.gpaScale}</span>
                      </div>
                    </div>
                    <div className="text-xs text-primary inline-flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {t.hero.gpaDelta}
                    </div>
                  </div>
                  <GpaTrendChart data={student.trend} labels={student.semesters} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-8 mt-6">
            <SkillsMatrix />
            <CoursesTable />
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <PortfolioAchievements />
          </TabsContent>

          <TabsContent value="projects" className="space-y-8 mt-6">
            <CareerMarketplace />
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
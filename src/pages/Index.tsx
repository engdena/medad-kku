import { useState } from "react";
import { TopBar } from "@/components/nebras/TopBar";
import { AIConsultant } from "@/components/nebras/AIConsultant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/hooks/useAuth";
import { useStudentData, distinctionFromData } from "@/hooks/useStudentData";
import { StudentDashboardTab } from "@/components/medad/StudentDashboardTab";
import { SkillsMatrix } from "@/components/medad/SkillsMatrix";
import { RoadmapView } from "@/components/medad/RoadmapView";
import { MentorChat } from "@/components/medad/MentorChat";
import { LayoutDashboard, Cpu, Compass, MessageCircle } from "lucide-react";
import { FAISAL_FALLBACK, type StudentPerformanceRecord } from "@/lib/studentPerformance";

const Index = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const { t } = useI18n();
  const { user } = useAuth();
  const { data } = useStudentData(user?.id);

  // Build a focusStudent record from the logged-in student's own data so the
  // AI Consultant ONLY answers within their skills and career goals context.
  const focus: StudentPerformanceRecord = data
    ? {
        id: user?.id ?? FAISAL_FALLBACK.id,
        name: user?.user_metadata?.full_name ?? FAISAL_FALLBACK.name,
        nameAr: FAISAL_FALLBACK.nameAr,
        title: data.field_of_study ?? FAISAL_FALLBACK.title,
        titleAr: FAISAL_FALLBACK.titleAr,
        gpa: Number(data.university_gpa ?? FAISAL_FALLBACK.gpa),
        selfLearningHours: data.self_learning_hours ?? 0,
        marketReadiness: data.market_readiness_score ?? distinctionFromData(data),
        technicalSkills: data.technical_skills ?? FAISAL_FALLBACK.technicalSkills,
        softSkills: data.soft_skills ?? FAISAL_FALLBACK.softSkills,
        profileSlug: FAISAL_FALLBACK.profileSlug,
      }
    : FAISAL_FALLBACK;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-[34rem] h-[34rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 -right-24 w-[30rem] h-[30rem] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <TopBar onOpenAI={() => setAiOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-6 md:py-10">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="rounded-2xl bg-card border border-border p-1.5 h-auto flex flex-wrap gap-1">
            <TabsTrigger value="dashboard" className="rounded-xl gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <LayoutDashboard className="w-4 h-4" /> {t.tabs.dashboard}
            </TabsTrigger>
            <TabsTrigger value="skills" className="rounded-xl gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <Cpu className="w-4 h-4" /> {t.tabs.skills}
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="rounded-xl gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <Compass className="w-4 h-4" /> {t.tabs.roadmap}
            </TabsTrigger>
            <TabsTrigger value="mentor" className="rounded-xl gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <MessageCircle className="w-4 h-4" /> {t.tabs.mentor}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard"><StudentDashboardTab /></TabsContent>
          <TabsContent value="skills"><SkillsMatrix /></TabsContent>
          <TabsContent value="roadmap"><RoadmapView /></TabsContent>
          <TabsContent value="mentor"><MentorChat /></TabsContent>
        </Tabs>

        <footer className="pt-10 pb-6 mt-10 border-t border-border/60 text-center text-xs text-muted-foreground">
          {t.footer}
        </footer>
      </main>

      <AIConsultant open={aiOpen} onOpenChange={setAiOpen} focusStudent={focus} />
    </div>
  );
};

export default Index;

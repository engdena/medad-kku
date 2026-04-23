import { useState } from "react";
import { TopBar } from "@/components/nebras/TopBar";
import { HeroDashboard } from "@/components/nebras/HeroDashboard";
import { CoursesTable } from "@/components/nebras/CoursesTable";
import { SkillRoadmap } from "@/components/nebras/SkillRoadmap";
import { CareerMarketplace } from "@/components/nebras/CareerMarketplace";
import { AIConsultant } from "@/components/nebras/AIConsultant";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

const Index = () => {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gradient-subtle">
        <TopBar onOpenAI={() => setAiOpen(true)} />

        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 md:py-10 space-y-10 md:space-y-14">
          <HeroDashboard />
          <CoursesTable />
          <SkillRoadmap />
          <CareerMarketplace />

          <footer className="pt-10 pb-6 border-t border-border text-center text-xs text-muted-foreground">
            Nebras · Strategic Intellect Platform · King Khalid University · Powered by AI aligned with Saudi Vision 2030
          </footer>
        </main>

        <AIConsultant open={aiOpen} onOpenChange={setAiOpen} />
      </div>
    </AccessibilityProvider>
  );
};

export default Index;

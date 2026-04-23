import { Sparkles, Sun, Moon, Accessibility, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { AccessibilityPanel } from "./AccessibilityPanel";

export const TopBar = ({ onOpenAI }: { onOpenAI: () => void }) => {
  const [dark, setDark] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/75 border-b border-border">
      <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-lg tracking-tight">Nebras</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground -mt-0.5">King Khalid University</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 mx-6 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search courses, skills, projects…" className="pl-9 bg-secondary/50 border-secondary" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={() => setA11yOpen(true)} aria-label="Accessibility">
            <Accessibility className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDark((v) => !v)} aria-label="Theme">
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </Button>
          <Button onClick={onOpenAI} className="bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-soft">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Consultant</span>
          </Button>
        </div>
      </div>
      <AccessibilityPanel open={a11yOpen} onOpenChange={setA11yOpen} />
    </header>
  );
};
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Eye, Volume2, Type } from "lucide-react";

export const AccessibilityPanel = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const { highContrast, toggleHighContrast, ttsEnabled, toggleTts, largeText, toggleLargeText, speak } = useAccessibility();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Digital Inclusion</SheetTitle>
          <SheetDescription>Tools to make Nebras work for every student.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          <Row
            icon={<Eye className="w-5 h-5" />}
            title="High-contrast mode"
            desc="Maximum readability for low-vision users."
            checked={highContrast}
            onChange={toggleHighContrast}
          />
          <Row
            icon={<Volume2 className="w-5 h-5" />}
            title="Text-to-Speech"
            desc="Read content aloud. Click any card's speaker icon."
            checked={ttsEnabled}
            onChange={() => {
              toggleTts();
              if (!ttsEnabled) setTimeout(() => speak("Text to speech is now active."), 200);
            }}
          />
          <Row
            icon={<Type className="w-5 h-5" />}
            title="Larger text"
            desc="Increases base font size across the app."
            checked={largeText}
            onChange={toggleLargeText}
          />
        </div>

        <div className="mt-8 p-4 rounded-xl bg-secondary/60 border border-border text-sm text-muted-foreground">
          Nebras follows WCAG 2.2 AA. Need more support? The AI Consultant can read any section aloud on request.
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Row = ({
  icon, title, desc, checked, onChange,
}: { icon: React.ReactNode; title: string; desc: string; checked: boolean; onChange: () => void }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">{icon}</div>
    <div className="flex-1">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);
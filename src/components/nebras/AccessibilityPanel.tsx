import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Eye, Volume2, Type, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { motion } from "framer-motion";

export const AccessibilityPanel = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const { highContrast, toggleHighContrast, ttsEnabled, toggleTts, largeText, toggleLargeText, speak } = useAccessibility();
  const { t, lang } = useI18n();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={lang === "ar" ? "left" : "right"} className="w-full sm:max-w-md glass-strong">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground">
              <ShieldCheck className="w-4 h-4" />
            </span>
            {t.a11y.title}
          </SheetTitle>
          <SheetDescription>{t.a11y.sub}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          <Row idx={0} icon={<Eye className="w-5 h-5" />} title={t.a11y.hc.t} desc={t.a11y.hc.d} checked={highContrast} onChange={toggleHighContrast} />
          <Row
            idx={1}
            icon={<Volume2 className="w-5 h-5" />}
            title={t.a11y.tts.t}
            desc={t.a11y.tts.d}
            checked={ttsEnabled}
            onChange={() => {
              toggleTts();
              if (!ttsEnabled) setTimeout(() => speak(t.a11y.tts.t), 200);
            }}
          />
          <Row idx={2} icon={<Type className="w-5 h-5" />} title={t.a11y.large.t} desc={t.a11y.large.d} checked={largeText} onChange={toggleLargeText} />
        </div>

        <div className="mt-8 p-4 rounded-2xl glass border border-border/60 text-sm text-muted-foreground">
          {t.a11y.note}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Row = ({ idx, icon, title, desc, checked, onChange }: { idx: number; icon: React.ReactNode; title: string; desc: string; checked: boolean; onChange: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: 0.05 + idx * 0.06 }}
    className="flex items-start gap-3 p-4 rounded-2xl border border-border/60 bg-card/60 hover:bg-secondary/40 transition-colors"
  >
    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">{icon}</div>
    <div className="flex-1">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </motion.div>
);
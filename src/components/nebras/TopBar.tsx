import { Sparkles, Sun, Moon, Accessibility, Bell, Search, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { AccessibilityPanel } from "./AccessibilityPanel";
import { useI18n } from "@/i18n/I18nContext";
import { motion } from "framer-motion";

export const TopBar = ({ onOpenAI }: { onOpenAI: () => void }) => {
  const [dark, setDark] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const { t, lang, toggleLang } = useI18n();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border/60">
      <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className={`leading-tight ${lang === "ar" ? "text-right" : ""}`}>
            <div className="font-display font-bold text-lg tracking-tight">{t.brand.name}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground -mt-0.5">{t.brand.sub}</div>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-2 mx-6 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-muted-foreground ${lang === "ar" ? "right-3" : "left-3"}`} />
            <Input
              placeholder={t.nav.search}
              className={`bg-secondary/50 border-secondary/80 rounded-2xl ${lang === "ar" ? "pr-9 text-right" : "pl-9"}`}
            />
          </div>
        </div>

        <div className="ms-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="rounded-xl gap-1.5 font-semibold"
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4" />
            <span className="text-xs">{t.nav.language}</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setA11yOpen(true)} aria-label={t.nav.accessibility}>
            <Accessibility className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setDark((v) => !v)} aria-label={t.nav.theme}>
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl" aria-label={t.nav.notifications}>
            <Bell className="w-5 h-5" />
          </Button>
          <Button onClick={onOpenAI} className="rounded-2xl bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-soft">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.aiConsultant}</span>
          </Button>
        </div>
      </div>
      <AccessibilityPanel open={a11yOpen} onOpenChange={setA11yOpen} />
    </header>
  );
};
import { useState } from "react";
import { Network } from "lucide-react";
import { AIConsultant } from "@/components/nebras/AIConsultant";
import { useI18n } from "@/i18n/I18nContext";

export const FloatingAIButton = () => {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t.nav.aiConsultant}
        className="fixed bottom-6 end-6 z-40 rounded-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 w-14 h-14 grid place-items-center transition"
      >
        <Network className="w-6 h-6" />
      </button>
      <AIConsultant open={open} onOpenChange={setOpen} />
    </>
  );
};

export default FloatingAIButton;
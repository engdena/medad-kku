import { useAuth, exitDemoMode } from "@/hooks/useAuth";
import { Sparkles, X } from "lucide-react";

export const DemoBanner = () => {
  const { isDemo, role } = useAuth();
  if (!isDemo) return null;
  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-accent/90 via-primary/90 to-accent/90 text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-3 text-xs font-bold tracking-wide">
        <Sparkles className="w-3.5 h-3.5" />
        <span className="uppercase">Demo Mode Active</span>
        <span className="opacity-80 normal-case font-medium">— viewing as {role}. Data is illustrative.</span>
        <button onClick={exitDemoMode}
          className="ml-2 inline-flex items-center gap-1 rounded-full bg-background/20 hover:bg-background/30 px-2 py-0.5 transition">
          <X className="w-3 h-3" /> Exit
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;
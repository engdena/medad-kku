import { courses } from "@/data/mockData";
import { ArrowUpRight, ArrowDownRight, Minus, Volume2 } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const riskClass = (r: string) =>
  r === "high" ? "bg-danger/15 text-danger" : r === "medium" ? "bg-warning/15 text-warning" : "bg-success/15 text-success";

export const CoursesTable = () => {
  const { speak, ttsEnabled } = useAccessibility();
  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
      <div className="p-5 md:p-6 flex items-center justify-between border-b border-border">
        <div>
          <h2 className="font-display font-bold text-xl">Course performance</h2>
          <p className="text-sm text-muted-foreground">AI-flagged risk per course this semester</p>
        </div>
        {ttsEnabled && (
          <button onClick={() => speak("Your course performance overview. Distributed Systems is at high risk. Linear Algebra is your strongest course.")} className="text-muted-foreground hover:text-primary">
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="divide-y divide-border">
        {courses.map((c) => {
          const Icon = c.trend === "up" ? ArrowUpRight : c.trend === "down" ? ArrowDownRight : Minus;
          const trendColor = c.trend === "up" ? "text-success" : c.trend === "down" ? "text-danger" : "text-muted-foreground";
          return (
            <div key={c.code} className="grid grid-cols-12 items-center gap-3 px-5 md:px-6 py-3.5 hover:bg-secondary/40 transition-colors">
              <div className="col-span-6 md:col-span-5">
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.code}</div>
              </div>
              <div className="col-span-2 font-display font-bold text-lg">{c.grade}</div>
              <div className="col-span-3 md:col-span-3">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${c.performance}%` }} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{c.performance}%</div>
              </div>
              <div className={`col-span-1 ${trendColor}`}><Icon className="w-4 h-4" /></div>
              <div className="col-span-12 md:col-span-1 flex md:justify-end">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold ${riskClass(c.risk)}`}>{c.risk}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
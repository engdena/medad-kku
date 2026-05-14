import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/I18nContext";
import { TopBar } from "@/components/nebras/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FloatingAIButton } from "@/components/medad/FloatingAIButton";
import { talentPool, isAtRisk } from "@/data/talentPool";
import { useState } from "react";
import { AIConsultant } from "@/components/nebras/AIConsultant";

export default function MentorView() {
  const { signOut } = useAuth();
  const { t, lang } = useI18n();
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onOpenAI={() => setAiOpen(true)} />
      <AIConsultant open={aiOpen} onOpenChange={setAiOpen} />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">{t.mentorView.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t.mentorView.sub}</p>
          </div>
          <Button variant="outline" onClick={signOut}>{t.app.signOut}</Button>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.mentorView.student}</TableHead>
                <TableHead>{t.mentorView.gpa}</TableHead>
                <TableHead>{t.mentorView.selfHours}</TableHead>
                <TableHead>{t.mentorView.readiness}</TableHead>
                <TableHead>{t.mentorView.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {talentPool.map((s) => {
                const risk = isAtRisk(s);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      <div>{lang === "ar" ? s.nameAr : s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.id}</div>
                    </TableCell>
                    <TableCell>{s.gpa.toFixed(2)} / 5.0</TableCell>
                    <TableCell>{s.selfLearningHours} h</TableCell>
                    <TableCell>
                      <span className={risk ? "text-amber-600 font-semibold" : "text-emerald-600 font-semibold"}>
                        {s.marketReadiness}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {risk ? (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100">
                          {t.mentorView.atRisk}
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100">
                          {t.mentorView.highPotential}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {talentPool.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">{t.mentorView.empty}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <FloatingAIButton />
    </div>
  );
}
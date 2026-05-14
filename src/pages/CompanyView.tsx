import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Talent = {
  user_id: string;
  student_code: string | null;
  field_of_study: string | null;
  market_readiness_score: number | null;
  technical_skills: string[] | null;
};

export default function CompanyView() {
  const { user, signOut } = useAuth();
  const [talents, setTalents] = useState<Talent[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("medad_student_data")
        .select("user_id, student_code, field_of_study, market_readiness_score, technical_skills");
      setTalents((data ?? []) as Talent[]);
    })();
  }, []);

  const requestAccess = async (studentId: string) => {
    if (!user) return;
    await supabase.from("transcript_access_grants").insert([
      { student_id: studentId, company_id: user.id },
    ]);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Talent Search</h1>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {talents.map((t) => (
          <div key={t.user_id} className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-medium">{t.student_code ?? "Student"}</h3>
              <span className="text-sm text-muted-foreground">{t.market_readiness_score ?? 0}%</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{t.field_of_study ?? "—"}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {(t.technical_skills ?? []).slice(0, 6).map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={() => requestAccess(t.user_id)}>
              Request transcript access
            </Button>
          </div>
        ))}
        {talents.length === 0 && (
          <p className="text-muted-foreground">No talent profiles available.</p>
        )}
      </div>
    </div>
  );
}
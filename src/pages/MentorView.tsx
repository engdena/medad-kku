import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type Student = {
  user_id: string;
  full_name: string | null;
  university_gpa: number | null;
  market_readiness_score: number | null;
};

export default function MentorView() {
  const { signOut } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("medad_student_data")
        .select("user_id, full_name, university_gpa, market_readiness_score");
      setStudents((data as Student[]) ?? []);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Mentor Dashboard</h1>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Student</th>
              <th className="text-left p-3">GPA</th>
              <th className="text-left p-3">Market Readiness</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const mr = s.market_readiness_score ?? 0;
              return (
                <tr key={s.user_id} className="border-t border-border">
                  <td className="p-3">{s.full_name ?? "—"}</td>
                  <td className="p-3">{s.university_gpa ?? "—"}</td>
                  <td className="p-3">{mr}%</td>
                  <td className="p-3">
                    {mr < 50 ? (
                      <span className="text-destructive">At risk</span>
                    ) : (
                      <span className="text-primary">On track</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {students.length === 0 && (
              <tr><td className="p-3 text-muted-foreground" colSpan={4}>No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
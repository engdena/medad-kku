import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type StudentData = Database["public"]["Tables"]["medad_student_data"]["Row"];
export type StudentUpdate = Database["public"]["Tables"]["medad_student_data"]["Update"];

export const useStudentData = (userId?: string | null) => {
  const [data, setData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) { setData(null); setLoading(false); return; }
    setLoading(true);
    const { data: row } = await supabase
      .from("medad_student_data")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    setData(row ?? null);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const update = useCallback(async (patch: StudentUpdate) => {
    if (!userId) return;
    const { data: row, error } = await supabase
      .from("medad_student_data")
      .update(patch)
      .eq("user_id", userId)
      .select()
      .single();
    if (!error && row) setData(row);
    return { row, error };
  }, [userId]);

  return { data, loading, reload: load, update };
};

export const distinctionFromData = (d: Pick<StudentData, "self_learning_hours" | "certifications"> | null) => {
  if (!d) return 0;
  const sl = (d.self_learning_hours ?? 0) * 0.5; // 0.5 pts per hour
  const cert = (d.certifications ?? 0) * 12;     // 12 pts per cert
  return Math.min(100, Math.round(sl + cert));
};
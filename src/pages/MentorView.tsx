import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/I18nContext";
import { TopBar } from "@/components/nebras/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import {
  mapStudentPerformanceRows,
  STUDENT_PERFORMANCE_TABLE,
  type StudentPerformanceClient,
  type StudentPerformanceRecord,
} from "@/lib/studentPerformance";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const isAtRisk = (student: Pick<StudentPerformanceRecord, "gpa" | "marketReadiness">) =>
  student.gpa < 3.75 || student.marketReadiness < 70;

export default function MentorView() {
  const { signOut } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentPerformanceRecord[]>(() => mapStudentPerformanceRows([]));
  const [query, setQuery] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const { data, error } = await (supabase as unknown as StudentPerformanceClient)
        .from(STUDENT_PERFORMANCE_TABLE)
        .select("*");

      if (error) {
        console.error("Unable to load student performance readiness data", error);
      }

      if (mounted) {
        setStudents(mapStudentPerformanceRows(error ? [] : data));
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const visibleStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? students.filter((s) =>
          [s.name, s.nameAr, s.title, s.titleAr, ...s.technicalSkills]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : students;
    // Pin Faisal as Top Performer; sort the rest by GPA.
    const faisal = filtered.find((s) => s.name.toLowerCase().startsWith("faisal"));
    const rest = filtered.filter((s) => s !== faisal).sort((a, b) => (sortDesc ? b.gpa - a.gpa : a.gpa - b.gpa));
    return faisal ? [faisal, ...rest] : rest;
  }, [students, query, sortDesc]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">{t.mentorView.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t.mentorView.sub}</p>
          </div>
          <Button variant="outline" onClick={signOut}>{t.app.signOut}</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "ar" ? "ابحث بالاسم أو المهارة…" : "Search by name, track, or skill…"}
            className="rounded-xl bg-card max-w-md"
          />
          <Button
            variant="outline"
            className="rounded-xl gap-2"
            onClick={() => setSortDesc((v) => !v)}
          >
            <ArrowDownUp className="w-4 h-4" />
            {lang === "ar"
              ? `ترتيب حسب المعدل (${sortDesc ? "تنازلي" : "تصاعدي"})`
              : `Sort by GPA (${sortDesc ? "High → Low" : "Low → High"})`}
          </Button>
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
                <TableHead className="text-end">{lang === "ar" ? "الملف" : "Profile"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleStudents.map((s, idx) => {
                const risk = isAtRisk(s);
                const isTop = idx === 0 && (s.name.toLowerCase().startsWith("faisal"));
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/profile/${s.profileSlug}`)}
                          className="hover:underline text-foreground font-semibold text-start"
                        >
                          {lang === "ar" ? s.nameAr : s.name}
                        </button>
                        {isTop && (
                          <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/10">
                            {lang === "ar" ? "الأفضل أداءً" : "Top Performer"}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{s.id}</div>
                      <div className="text-[11px] text-muted-foreground/80">{lang === "ar" ? s.titleAr : s.title}</div>
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
                    <TableCell className="text-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl gap-1.5"
                        onClick={() => navigate(`/profile/${s.profileSlug}`)}
                      >
                        {lang === "ar" ? "عرض الملف" : "View Profile"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {visibleStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">{t.mentorView.empty}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
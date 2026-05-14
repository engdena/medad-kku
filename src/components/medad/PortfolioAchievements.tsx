import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/I18nContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, ExternalLink, Lightbulb, Pencil, Plus, Sparkles, Trash2, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { dispatchPortfolioChanged } from "@/hooks/usePortfolioBreakdown";

type EntryType = "skill" | "achievement";
type Category = "innovation" | "certification" | "leadership" | "volunteering" | "technical" | "skill";

type Entry = {
  id: string;
  user_id: string;
  entry_type: EntryType;
  title: string;
  category: Category;
  evidence_url: string | null;
  description: string | null;
  created_at: string;
};

const CATEGORY_POINTS: Record<Category, number> = {
  innovation: 15,
  certification: 10,
  leadership: 10,
  volunteering: 5,
  technical: 5,
  skill: 5,
};

const CATEGORIES_FOR: Record<EntryType, Category[]> = {
  achievement: ["innovation", "certification", "leadership", "volunteering"],
  skill: ["technical", "skill"],
};

const ANNUAL_TARGET = 100;

const STORAGE_KEY = "medad-portfolio-entries-fallback";

type Draft = { entry_type: EntryType; title: string; category: Category; evidence_url: string; description: string };
const blankDraft: Draft = { entry_type: "achievement", title: "", category: "innovation", evidence_url: "", description: "" };

export const PortfolioAchievements = () => {
  const { user } = useAuth();
  const { lang } = useI18n();
  const ar = lang === "ar";
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !user;

  const L = (en: string, arS: string) => (ar ? arS : en);

  const CAT_LABEL: Record<Category, string> = {
    innovation: L("Innovation / Research", "ابتكار / بحث"),
    certification: L("Certification", "شهادة احترافية"),
    leadership: L("Leadership", "قيادة"),
    volunteering: L("Volunteering", "تطوع"),
    technical: L("Technical Skill", "مهارة تقنية"),
    skill: L("Soft Skill", "مهارة شخصية"),
  };

  const load = async () => {
    setLoading(true);
    if (isDemo) {
      try {
        const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
        setEntries(raw ? (JSON.parse(raw) as Entry[]) : []);
      } catch { setEntries([]); }
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("student_portfolio_entries")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (error) toast.error(L("Failed to load entries", "تعذّر تحميل الإدخالات"));
    setEntries((data as Entry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const persistDemo = (next: Entry[]) => {
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    dispatchPortfolioChanged();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    if (isDemo) {
      const now = new Date().toISOString();
      if (editingId) {
        const next = entries.map((it) => it.id === editingId ? { ...it, ...draft } as Entry : it);
        setEntries(next); persistDemo(next);
      } else {
        const newEntry: Entry = {
          id: crypto.randomUUID(),
          user_id: "demo",
          entry_type: draft.entry_type,
          title: draft.title.trim(),
          category: draft.category,
          evidence_url: draft.evidence_url || null,
          description: draft.description || null,
          created_at: now,
        };
        const next = [newEntry, ...entries];
        setEntries(next); persistDemo(next);
      }
      toast.success(L("Saved", "تم الحفظ"));
      reset();
      dispatchPortfolioChanged();
      return;
    }
    if (editingId) {
      const { error } = await supabase
        .from("student_portfolio_entries")
        .update({
          entry_type: draft.entry_type,
          title: draft.title.trim(),
          category: draft.category,
          evidence_url: draft.evidence_url || null,
          description: draft.description || null,
        })
        .eq("id", editingId);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("student_portfolio_entries").insert({
        user_id: user!.id,
        entry_type: draft.entry_type,
        title: draft.title.trim(),
        category: draft.category,
        evidence_url: draft.evidence_url || null,
        description: draft.description || null,
      });
      if (error) return toast.error(error.message);
    }
    toast.success(L("Saved", "تم الحفظ"));
    reset();
    load();
    dispatchPortfolioChanged();
  };

  const reset = () => { setDraft(blankDraft); setEditingId(null); setOpen(false); };

  const startEdit = (entry: Entry) => {
    setEditingId(entry.id);
    setDraft({
      entry_type: entry.entry_type,
      title: entry.title,
      category: entry.category,
      evidence_url: entry.evidence_url ?? "",
      description: entry.description ?? "",
    });
    setOpen(true);
  };

  const remove = async (id: string) => {
    if (isDemo) {
      const next = entries.filter((it) => it.id !== id);
      setEntries(next); persistDemo(next);
      return toast.success(L("Deleted", "تم الحذف"));
    }
    const { error } = await supabase.from("student_portfolio_entries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(L("Deleted", "تم الحذف"));
    load();
    dispatchPortfolioChanged();
  };

  const breakdown = useMemo(() => {
    const byCat: Record<Category, { count: number; points: number }> = {
      innovation: { count: 0, points: 0 },
      certification: { count: 0, points: 0 },
      leadership: { count: 0, points: 0 },
      volunteering: { count: 0, points: 0 },
      technical: { count: 0, points: 0 },
      skill: { count: 0, points: 0 },
    };
    let total = 0;
    for (const e of entries) {
      const pts = CATEGORY_POINTS[e.category];
      byCat[e.category].count += 1;
      byCat[e.category].points += pts;
      total += pts;
    }
    return { byCat, total, percentage: Math.min(100, Math.round((total / ANNUAL_TARGET) * 100)) };
  }, [entries]);

  const onTypeChange = (type: EntryType) => {
    setDraft((d) => ({ ...d, entry_type: type, category: CATEGORIES_FOR[type][0] }));
  };

  return (
    <section className="space-y-5">
      <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
              <Trophy className="w-3.5 h-3.5" /> {L("My Portfolio & Achievements", "ملفي الشخصي وإنجازاتي")}
            </div>
            <h2 className="font-display font-bold text-2xl mt-1">
              {L("Skills & Achievements Hub", "مركز المهارات والإنجازات")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {L(
                "One place to log every skill and achievement. Each entry feeds your Distinction Index automatically.",
                "مكان واحد لتسجيل كل مهارة وإنجاز. كل إدخال يضيف تلقائياً إلى نسبة التميز."
              )}
            </p>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl bg-gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 me-1" /> {L("Add Entry", "إضافة إدخال")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-3xl">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingId ? L("Edit Entry", "تعديل الإدخال") : L("New Entry", "إدخال جديد")}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={submit} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">{L("Type", "النوع")}</label>
                    <Select value={draft.entry_type} onValueChange={(v) => onTypeChange(v as EntryType)}>
                      <SelectTrigger className="rounded-2xl mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="achievement">{L("Achievement", "إنجاز")}</SelectItem>
                        <SelectItem value="skill">{L("Skill", "مهارة")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">{L("Category", "التصنيف")}</label>
                    <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v as Category })}>
                      <SelectTrigger className="rounded-2xl mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES_FOR[draft.entry_type].map((c) => (
                          <SelectItem key={c} value={c}>
                            {CAT_LABEL[c]} · +{CATEGORY_POINTS[c]} {L("pts", "نقطة")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">{L("Title", "العنوان")}</label>
                  <Input
                    required
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder={draft.entry_type === "skill" ? L("e.g., Lean Six Sigma", "مثال: لين ستة سيجما") : L("e.g., Aramco Internship", "مثال: تدريب أرامكو")}
                    maxLength={140}
                    className="rounded-2xl mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">{L("Description (optional)", "وصف (اختياري)")}</label>
                  <Textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    maxLength={500}
                    className="rounded-2xl mt-1 min-h-20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">{L("Evidence Link", "رابط الإثبات")}</label>
                  <Input
                    value={draft.evidence_url}
                    onChange={(e) => setDraft({ ...draft, evidence_url: e.target.value })}
                    placeholder="https://"
                    maxLength={500}
                    className="rounded-2xl mt-1"
                  />
                </div>
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" className="rounded-2xl" onClick={reset}>
                    {L("Cancel", "إلغاء")}
                  </Button>
                  <Button type="submit" className="rounded-2xl bg-gradient-primary text-primary-foreground">
                    {editingId ? L("Update", "تحديث") : L("Save", "حفظ")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
        <div className="space-y-3">
          {loading && (
            <div className="rounded-3xl bg-card border border-border p-6 text-sm text-muted-foreground">
              {L("Loading…", "جارٍ التحميل…")}
            </div>
          )}
          {!loading && entries.length === 0 && (
            <div className="rounded-3xl bg-card border border-dashed border-border p-8 text-center">
              <Sparkles className="w-6 h-6 mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-2">
                {L("No entries yet. Add your first skill or achievement.", "لا توجد إدخالات بعد. أضف أول مهارة أو إنجاز.")}
              </p>
            </div>
          )}
          {entries.map((entry, idx) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              className="rounded-3xl bg-card border border-border p-4 hover:shadow-soft transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={entry.entry_type === "skill" ? "secondary" : "default"} className="rounded-full">
                      {entry.entry_type === "skill" ? L("Skill", "مهارة") : L("Achievement", "إنجاز")}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                      <Award className="w-3 h-3" /> +{CATEGORY_POINTS[entry.category]} {L("pts", "نقطة")}
                    </span>
                    <span className="text-xs text-muted-foreground">{CAT_LABEL[entry.category]}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mt-2 truncate">{entry.title}</h3>
                  {entry.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{entry.description}</p>
                  )}
                  {entry.evidence_url && (
                    <a
                      href={entry.evidence_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> {L("Evidence", "الإثبات")}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => startEdit(entry)} aria-label={L("Edit", "تعديل")}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl text-danger hover:text-danger" onClick={() => remove(entry.id)} aria-label={L("Delete", "حذف")}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <aside className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant sticky top-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary-foreground/70">
                {L("Live Points Breakdown", "تفاصيل النقاط المباشرة")}
              </div>
              <h3 className="font-display text-xl font-bold mt-1">
                {L("Distinction Contribution", "مساهمة نسبة التميز")}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl glass-dark grid place-items-center">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
          </div>

          <div className="mt-4 rounded-2xl glass-dark p-4 text-center">
            <div className="font-display text-5xl font-bold leading-none">{breakdown.total}</div>
            <div className="text-xs text-primary-foreground/70 mt-1">
              {L("of", "من")} {ANNUAL_TARGET} {L("annual points", "نقطة سنوياً")}
            </div>
            <div className="mt-3 h-2 rounded-full bg-primary-foreground/15 overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${breakdown.percentage}%` }}
              />
            </div>
            <div className="text-xs text-primary-foreground/80 mt-2 font-bold">
              {breakdown.percentage}% {L("Distinction Index", "نسبة التميز")}
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-sm">
            {(Object.keys(CATEGORY_POINTS) as Category[]).map((c) => (
              <li key={c} className="flex items-center justify-between rounded-xl glass-dark px-3 py-2">
                <span className="text-primary-foreground/85">{CAT_LABEL[c]}</span>
                <span className="font-bold">
                  {breakdown.byCat[c].count} × {CATEGORY_POINTS[c]} = {breakdown.byCat[c].points}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-2xl glass-dark p-3 text-xs text-primary-foreground/85 flex gap-2">
            <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span>
              {L(
                "Add a Research/Innovation entry (+15) for the biggest jump.",
                "أضف إدخالاً بحثياً/ابتكارياً (+15) لأكبر قفزة في النقاط."
              )}
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
};

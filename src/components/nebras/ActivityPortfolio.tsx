import { FormEvent, useState, type Dispatch, type SetStateAction } from "react";
import { activityCategoryPoints, type ActivityCategory, type StudentActivity } from "@/data/mockData";
import { useI18n } from "@/i18n/I18nContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Calendar, ExternalLink, FilePlus2, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

type Draft = Omit<StudentActivity, "id" | "titleAr" | "descriptionAr">;

const emptyDraft: Draft = { title: "", category: "research", date: "", description: "", evidence: "" };
const categories: ActivityCategory[] = ["research", "leadership", "volunteering"];

export const ActivityPortfolio = ({
  activities,
  setActivities,
}: {
  activities: StudentActivity[];
  setActivities: Dispatch<SetStateAction<StudentActivity[]>>;
}) => {
  const { t, lang } = useI18n();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...draft,
      titleAr: draft.title,
      descriptionAr: draft.description,
      date: draft.date || new Date().toISOString().slice(0, 10),
    };
    if (editingId) {
      setActivities((items) => items.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
    } else {
      setActivities((items) => [{ id: crypto.randomUUID(), ...payload }, ...items]);
    }
    setDraft(emptyDraft);
    setEditingId(null);
  };

  const edit = (activity: StudentActivity) => {
    setEditingId(activity.id);
    setDraft({
      title: lang === "ar" ? activity.titleAr : activity.title,
      category: activity.category,
      date: activity.date,
      description: lang === "ar" ? activity.descriptionAr : activity.description,
      evidence: activity.evidence,
    });
  };

  return (
    <section className="grid xl:grid-cols-[0.85fr_1.15fr] gap-4 items-start">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl glass p-5 space-y-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
            <FilePlus2 className="w-3.5 h-3.5" /> {t.portfolio.chip}
          </div>
          <h2 className="font-display font-bold text-2xl mt-1">{t.portfolio.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t.portfolio.sub}</p>
        </div>

        <Input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder={t.portfolio.placeholders.title} aria-label={t.portfolio.titleField} className="rounded-2xl" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Select value={draft.category} onValueChange={(value) => setDraft({ ...draft, category: value as ActivityCategory })}>
            <SelectTrigger className="rounded-2xl"><SelectValue placeholder={t.portfolio.category} /></SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{t.portfolio.categories[category]} · {t.portfolio.points(activityCategoryPoints[category])}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input required type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} aria-label={t.portfolio.date} className="rounded-2xl" />
        </div>
        <Textarea required value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder={t.portfolio.placeholders.description} aria-label={t.portfolio.description} className="min-h-28 rounded-2xl" />
        <Input value={draft.evidence} onChange={(e) => setDraft({ ...draft, evidence: e.target.value })} placeholder={t.portfolio.placeholders.evidence} aria-label={t.portfolio.evidence} className="rounded-2xl" />
        <div className="flex gap-2">
          <Button className="rounded-2xl bg-gradient-primary text-primary-foreground">{editingId ? t.portfolio.update : t.portfolio.save}</Button>
          {editingId && <Button type="button" variant="outline" className="rounded-2xl" onClick={() => { setEditingId(null); setDraft(emptyDraft); }}>{t.portfolio.cancel}</Button>}
        </div>
      </motion.form>

      <div className="space-y-3">
        {activities.length === 0 && <div className="rounded-3xl glass p-6 text-sm text-muted-foreground">{t.portfolio.empty}</div>}
        {activities.map((activity, idx) => (
          <motion.article key={activity.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.04 }} className="rounded-3xl glass p-4 hover:shadow-soft transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 font-bold text-primary"><Award className="w-3 h-3" /> {t.portfolio.points(activityCategoryPoints[activity.category])}</span>
                  <span>{t.portfolio.categories[activity.category]}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {activity.date}</span>
                </div>
                <h3 className="font-display font-bold text-lg mt-2">{lang === "ar" ? activity.titleAr : activity.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? activity.descriptionAr : activity.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button type="button" variant="ghost" size="icon" className="rounded-xl" onClick={() => edit(activity)} aria-label={t.portfolio.edit}><Pencil className="w-4 h-4" /></Button>
                <Button type="button" variant="ghost" size="icon" className="rounded-xl text-danger hover:text-danger" onClick={() => setActivities((items) => items.filter((item) => item.id !== activity.id))} aria-label={t.portfolio.delete}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            {activity.evidence && <a href={activity.evidence} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"><ExternalLink className="w-3 h-3" /> {t.portfolio.evidenceShort}</a>}
          </motion.article>
        ))}
      </div>
    </section>
  );
};
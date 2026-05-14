import { useState } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { useStudentData } from "@/hooks/useStudentData";
import { useAuth } from "@/hooks/useAuth";
import { Award, BookOpen, Cpu, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const SkillsMatrix = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data, update } = useStudentData(user?.id);
  const [hours, setHours] = useState("");
  const [cert, setCert] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const tech = data?.technical_skills ?? [];
  const soft = data?.soft_skills ?? [];

  const addLearning = async () => {
    const n = parseInt(hours, 10);
    if (!n || n < 1) return;
    await update({ self_learning_hours: (data?.self_learning_hours ?? 0) + n });
    setHours(""); toast.success("Hours logged");
  };
  const addCert = async () => {
    if (!cert.trim()) return;
    await update({ certifications: (data?.certifications ?? 0) + 1 });
    setCert(""); toast.success("Certification logged");
  };
  const addTech = async () => {
    if (!newSkill.trim()) return;
    await update({ technical_skills: [...tech, newSkill.trim()] });
    setNewSkill("");
  };

  return (
    <section className="space-y-5">
      <div>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
          <Cpu className="w-3.5 h-3.5" /> {t.skillsMatrix.chip}
        </div>
        <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">{t.skillsMatrix.title}</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mt-1">{t.skillsMatrix.sub}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl glass p-5">
          <div className="flex items-center justify-between">
            <div className="font-display font-bold text-lg flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" />{t.skillsMatrix.technical}</div>
            <span className="text-xs font-bold text-primary">{tech.length}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {tech.length === 0 && <p className="text-sm text-muted-foreground">{t.skillsMatrix.empty}</p>}
            {tech.map((s, i) => (
              <motion.span key={s + i} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-soft">{s}</motion.span>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a technical skill" className="rounded-2xl" />
            <Button onClick={addTech} className="rounded-2xl shrink-0" size="icon"><Plus className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="rounded-3xl glass p-5">
          <div className="flex items-center justify-between">
            <div className="font-display font-bold text-lg flex items-center gap-2"><Heart className="w-4 h-4 text-accent" />{t.skillsMatrix.soft}</div>
            <span className="text-xs font-bold text-accent">{soft.length}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {soft.length === 0 && <p className="text-sm text-muted-foreground">{t.skillsMatrix.empty}</p>}
            {soft.map((s, i) => (
              <motion.span key={s + i} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                className="px-3 py-1.5 rounded-full bg-card border-2 border-accent/40 text-foreground text-xs font-bold">{s}</motion.span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="font-display font-bold flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" />{t.skillsMatrix.selfLearning}</div>
            <div className="font-display font-bold text-3xl text-primary">{data?.self_learning_hours ?? 0}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <Input type="number" min={1} value={hours} onChange={e => setHours(e.target.value)} placeholder="hours" className="rounded-2xl" />
            <Button onClick={addLearning} className="rounded-2xl shrink-0">{t.skillsMatrix.addHours}</Button>
          </div>
        </div>
        <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="font-display font-bold flex items-center gap-2"><Award className="w-4 h-4 text-accent" />{t.skillsMatrix.certifications}</div>
            <div className="font-display font-bold text-3xl text-accent">{data?.certifications ?? 0}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <Input value={cert} onChange={e => setCert(e.target.value)} placeholder="certification name" className="rounded-2xl" />
            <Button onClick={addCert} className="rounded-2xl shrink-0">{t.skillsMatrix.addCert}</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
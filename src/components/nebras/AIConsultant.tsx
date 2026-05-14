import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2, Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { student, courses } from "@/data/mockData";
import { toast } from "sonner";
import { useI18n } from "@/i18n/I18nContext";
import { AnimatePresence, motion } from "framer-motion";
import type { StudentPerformanceRecord } from "@/lib/studentPerformance";

type Msg = { role: "user" | "assistant"; content: string };

const buildSystem = (lang: "en" | "ar", focus?: StudentPerformanceRecord | null) => `You are Medad AI Consultant for King Khalid University. Be concise, warm, strategic.
Student: ${student.name} (${student.arabicName}), ${student.major}, GPA ${student.gpa}/${student.gpaScale}, risk ${student.riskScore}/100 (${student.riskBand}).
Courses: ${courses.map(c => `${c.name}(${c.grade},risk:${c.risk})`).join(", ")}.
Use the grade scale A+, A, B+, B, C+, C, D+, D, F when discussing grades.
Anchor advice to Industrial Engineering, operational excellence, supply chain optimization, reliability engineering, MBB-style consulting, Saudi Vision 2030, and the Saudi labor market. Use markdown.
${focus ? `\nFOCUS STUDENT (the stakeholder is currently reviewing this profile — tailor every answer to them, name their skill gaps, and propose specific next actions):
- Name: ${focus.name} (${focus.nameAr})
- Track: ${focus.title}
- GPA: ${focus.gpa.toFixed(2)} / 5.0
- Self-learning hours: ${focus.selfLearningHours}
- Market readiness: ${focus.marketReadiness}%
- Technical skills: ${focus.technicalSkills.join(", ")}
- Soft skills: ${focus.softSkills.join(", ")}
- Status: ${focus.gpa < 3.75 || focus.marketReadiness < 70 ? "AT RISK — prioritize a remediation plan" : "HIGH POTENTIAL — propose stretch opportunities"}` : ""}
IMPORTANT: Reply ONLY in ${lang === "ar" ? "Arabic (العربية)" : "English"}.`;

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-consultant`;

export const AIConsultant = ({
  open,
  onOpenChange,
  focusStudent,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  focusStudent?: StudentPerformanceRecord | null;
}) => {
  const { t, lang } = useI18n();
  const firstName = focusStudent
    ? (lang === "ar" ? focusStudent.nameAr.split(" ")[0] : focusStudent.name.split(" ")[0])
    : (lang === "ar" ? student.arabicName.split(" ")[0] : student.name.split(" ")[0]);

  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: t.ai.welcome(firstName) },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset welcome message when language or focus changes
  useEffect(() => {
    setMessages([{ role: "assistant", content: t.ai.welcome(firstName) }]);
  }, [lang, firstName, t, focusStudent?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "system", content: buildSystem(lang, focusStudent) }, ...next.map(m => ({ role: m.role, content: m.content }))],
        }),
      });
      if (resp.status === 429) { toast.error("Rate limit reached. Please try again shortly."); setLoading(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted."); setLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("stream failed");

      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(j);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              setMessages((m) => m.map((x, i) => i === m.length - 1 ? { ...x, content: x.content + delta } : x));
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Couldn't reach the AI Consultant.");
    } finally {
      setLoading(false);
    }
  };

  const lastIsEmptyAssistant = messages.length > 0 && messages[messages.length - 1].role === "assistant" && messages[messages.length - 1].content === "";
  const showTyping = loading && lastIsEmptyAssistant;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={lang === "ar" ? "left" : "right"} className="w-full sm:max-w-lg flex flex-col p-0 glass-strong">
        <SheetHeader className="p-6 pb-3 border-b border-border/60">
          <SheetTitle className="font-display text-xl flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
              <Sparkles className="w-4 h-4" />
            </span>
            <div className="text-start">
              <div>{t.ai.title}</div>
              <p className="text-[11px] font-normal text-muted-foreground">{t.ai.sub}</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center shrink-0 mb-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed shadow-soft ${
                    m.role === "user"
                      ? "bg-gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-card text-card-foreground border border-border/60 rounded-bl-md"
                  }`}
                >
                  {m.content || (showTyping && i === messages.length - 1 ? <TypingDots label={t.ai.typing} /> : "")}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-secondary text-secondary-foreground grid place-items-center shrink-0 mb-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && !lastIsEmptyAssistant && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="rounded-2xl px-4 py-2.5 bg-card border border-border/60">
                <TypingDots label={t.ai.typing} />
              </div>
            </div>
          )}
        </div>

        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {t.ai.quick.map((q) => (
            <button
              key={q}
              onClick={() => !loading && send(q)}
              disabled={loading}
              className="text-[11px] px-2.5 py-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          className="p-4 border-t border-border/60 flex items-center gap-2"
          onSubmit={(e) => { e.preventDefault(); if (input.trim() && !loading) send(input.trim()); }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.ai.placeholder}
            disabled={loading}
            className="rounded-2xl bg-secondary/50"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-2xl bg-gradient-primary text-primary-foreground shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

const TypingDots = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1.5 text-muted-foreground">
    <span className="text-xs">{label}</span>
    <span className="flex gap-1">
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary inline-block" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary inline-block" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-primary inline-block" />
    </span>
  </div>
);
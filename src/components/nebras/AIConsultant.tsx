import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { student, courses } from "@/data/mockData";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK = [
  "Why is my Distributed Systems risk high?",
  "Which skill should I learn next?",
  "Find me a graduation project at Aramco",
  "How can I raise my predicted GPA?",
];

const SYSTEM = `You are Nebras AI Consultant for King Khalid University. Be concise, warm, and strategic.
Student profile: ${student.name}, ${student.major}, GPA ${student.gpa}/${student.gpaScale}, risk ${student.riskScore}/100 (${student.riskBand}).
Courses: ${courses.map(c => `${c.name}(${c.grade},risk:${c.risk})`).join(", ")}.
Always anchor advice to Saudi Vision 2030 and the Saudi labor market. Use markdown.`;

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-consultant`;

export const AIConsultant = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: `Hi ${student.name.split(" ")[0]} — I'm your Nebras AI Consultant. Ask about your performance, the labor market, or graduation projects.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
          messages: [{ role: "system", content: SYSTEM }, ...next.map(m => ({ role: m.role, content: m.content }))],
        }),
      });
      if (resp.status === 429) { toast.error("Rate limit reached. Please try again shortly."); setLoading(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted. Add credits in Settings → Workspace → Usage."); setLoading(false); return; }
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-3 border-b border-border">
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground"><Sparkles className="w-4 h-4" /></span>
            Nebras AI Consultant
          </SheetTitle>
          <p className="text-xs text-muted-foreground">Career & academic advice grounded in your data.</p>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${m.role === "user" ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {m.content || (loading && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : "")}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {QUICK.map((q) => (
            <button key={q} onClick={() => send(q)} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">{q}</button>
          ))}
        </div>

        <form
          className="p-4 border-t border-border flex items-center gap-2"
          onSubmit={(e) => { e.preventDefault(); if (input.trim() && !loading) send(input.trim()); }}
        >
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything…" disabled={loading} />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} className="bg-gradient-primary text-primary-foreground">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/I18nContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";

// Demo mentor recipient (matches DEMO_IDS.mentor in useAuth)
const DEMO_MENTOR_ID = "00000000-0000-0000-0000-00000000ed12";

type Msg = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
};

export const MentorChat = () => {
  const { t } = useI18n();
  const { user, isDemo } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mentorId = DEMO_MENTOR_ID;

  useEffect(() => {
    if (!user || isDemo) return;
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("mentor_messages")
        .select("*")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: true });
      if (mounted && data) setMessages(data as Msg[]);
    };
    load();
    const ch = supabase
      .channel(`mentor-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mentor_messages" }, (p) => {
        const m = p.new as Msg;
        if (m.sender_id === user.id || m.recipient_id === user.id) {
          setMessages((prev) => [...prev, m]);
        }
      })
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, [user, isDemo]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !user) return;
    setSending(true);
    if (isDemo) {
      // Simulated thread for demo accounts (no DB writes possible)
      const now = new Date().toISOString();
      setMessages((m) => [
        ...m,
        { id: `local-${m.length}`, sender_id: user.id, recipient_id: mentorId, body: text, created_at: now },
        {
          id: `local-${m.length + 1}`,
          sender_id: mentorId,
          recipient_id: user.id,
          body: "Got it — let's review your readiness gap in our next session. Keep logging self-learning hours.",
          created_at: now,
        },
      ]);
      setInput("");
      setSending(false);
      return;
    }
    const { error } = await supabase.from("mentor_messages").insert({
      sender_id: user.id,
      recipient_id: mentorId,
      body: text,
    });
    if (error) toast.error(error.message);
    else setInput("");
    setSending(false);
  };

  return (
    <section className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden flex flex-col h-[520px]">
      <header className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold">{t.mentor.title}</h3>
          <p className="text-xs text-muted-foreground">{t.mentor.sub}</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">{t.mentor.noMessages}</p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-soft ${
                  mine
                    ? "bg-gradient-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                }`}
              >
                {m.body}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={send} className="p-3 border-t border-border/60 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.mentor.placeholder}
          disabled={sending}
          className="rounded-2xl bg-secondary/50"
        />
        <Button type="submit" size="icon" disabled={sending || !input.trim()} className="rounded-2xl bg-gradient-primary text-primary-foreground shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </section>
  );
};

export default MentorChat;

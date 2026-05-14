import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/I18nContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";

type Msg = { id: string; sender_id: string; recipient_id: string; body: string; created_at: string };

export const MentorChat = () => {
  const { user, isDemo } = useAuth();
  const { t } = useI18n();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [mentorId, setMentorId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pick a mentor: first user with mentor role
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("user_roles").select("user_id").eq("role", "mentor").limit(1).maybeSingle();
      setMentorId(data?.user_id ?? null);
    })();
  }, []);

  useEffect(() => {
    if (!user?.id || isDemo) return;
    (async () => {
      const { data } = await supabase
        .from("mentor_messages")
        .select("*")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: true });
      setMsgs((data as Msg[]) ?? []);
    })();

    const ch = supabase
      .channel("mentor_messages_" + user.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mentor_messages" }, (p) => {
        const m = p.new as Msg;
        if (m.sender_id === user.id || m.recipient_id === user.id) setMsgs((prev) => [...prev, m]);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user?.id, isDemo]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length]);

  const send = async () => {
    const body = text.trim();
    if (!body || !user?.id) return;
    setText("");
    if (isDemo || !mentorId) {
      // local echo for demo
      const local: Msg = {
        id: crypto.randomUUID(), sender_id: user.id,
        recipient_id: mentorId ?? "demo-mentor", body, created_at: new Date().toISOString(),
      };
      setMsgs((p) => [...p, local]);
      return;
    }
    await supabase.from("mentor_messages").insert({ sender_id: user.id, recipient_id: mentorId, body });
  };

  return (
    <section className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
          <MessageSquare className="w-3.5 h-3.5" /> {t.mentor.chip}
        </div>
        <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">{t.mentor.title}</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mt-1">{t.mentor.sub}</p>
      </div>

      <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
        <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-2 bg-gradient-subtle">
          {msgs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center mt-24">{t.mentor.noMessages}</p>
          )}
          {msgs.map((m) => {
            const mine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-soft ${mine ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                  {m.body}
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-border p-3 flex gap-2 bg-card">
          <Input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t.mentor.placeholder} className="rounded-2xl" />
          <Button onClick={send} className="rounded-2xl gap-2"><Send className="w-4 h-4" />{t.mentor.send}</Button>
        </div>
      </div>
    </section>
  );
};

export default MentorChat;
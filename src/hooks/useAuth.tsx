import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "student" | "mentor" | "company" | "admin";

const DEMO_KEY = "medad_demo_role";
const DEMO_IDS: Record<AppRole, string> = {
  student: "00000000-0000-0000-0000-0000000f1541", // Faisal
  mentor: "00000000-0000-0000-0000-00000000ed12",
  company: "00000000-0000-0000-0000-0000000c0123",
  admin: "00000000-0000-0000-0000-00000000ad11",
};
const DEMO_EMAIL: Record<AppRole, string> = {
  student: "faisal@demo.medad.app",
  mentor: "mentor@demo.medad.app",
  company: "recruiter@demo.medad.app",
  admin: "admin@demo.medad.app",
};

const buildDemoSession = (r: AppRole): { session: Session; user: User } => {
  const user = {
    id: DEMO_IDS[r],
    email: DEMO_EMAIL[r],
    aud: "authenticated",
    role: "authenticated",
    app_metadata: { provider: "demo" },
    user_metadata: { full_name: r === "student" ? "Faisal (Demo)" : `${r[0].toUpperCase() + r.slice(1)} (Demo)`, demo: true },
    created_at: new Date().toISOString(),
  } as unknown as User;
  const session = {
    access_token: "demo", refresh_token: "demo", token_type: "bearer",
    expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user,
  } as unknown as Session;
  return { session, user };
};

export const enterDemoMode = (r: AppRole) => {
  localStorage.setItem(DEMO_KEY, r);
  window.dispatchEvent(new Event("medad:demo-changed"));
};
export const exitDemoMode = () => {
  localStorage.removeItem(DEMO_KEY);
  window.dispatchEvent(new Event("medad:demo-changed"));
};
export const getDemoRole = (): AppRole | null =>
  (typeof window !== "undefined" ? (localStorage.getItem(DEMO_KEY) as AppRole | null) : null);

type AuthCtx = {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  isDemo: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoRole, setDemoRole] = useState<AppRole | null>(getDemoRole());

  useEffect(() => {
    const onDemo = () => setDemoRole(getDemoRole());
    window.addEventListener("medad:demo-changed", onDemo);
    window.addEventListener("storage", onDemo);
    if (getDemoRole()) { setLoading(false); return () => {
      window.removeEventListener("medad:demo-changed", onDemo);
      window.removeEventListener("storage", onDemo);
    }; }
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        // defer role fetch
        setTimeout(() => fetchRole(s.user.id), 0);
      } else {
        setRole(null);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) fetchRole(data.session.user.id);
      else setLoading(false);
    });
    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("medad:demo-changed", onDemo);
      window.removeEventListener("storage", onDemo);
    };
  }, []);

  const fetchRole = async (uid: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).limit(1).maybeSingle();
    setRole((data?.role as AppRole) ?? "student");
    setLoading(false);
  };

  const demo = demoRole ? buildDemoSession(demoRole) : null;
  const effectiveSession = demo?.session ?? session;
  const effectiveUser = demo?.user ?? session?.user ?? null;
  const effectiveRole: AppRole | null = demoRole ?? role;

  return (
    <Ctx.Provider value={{
      session: effectiveSession, user: effectiveUser, role: effectiveRole,
      loading: demoRole ? false : loading,
      isDemo: !!demoRole,
      signOut: async () => {
        if (demoRole) { exitDemoMode(); return; }
        await supabase.auth.signOut();
      }
    }}>{children}</Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
};
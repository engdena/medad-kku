import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth, enterDemoMode, type AppRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cog, GraduationCap, Building2, Users } from "lucide-react";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "mentor", label: "Mentor / Advisor", icon: Users },
  { value: "company", label: "Company / Recruiter", icon: Building2 },
] as const;

const Auth = () => {
  const { session, role, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signupRole, setSignupRole] = useState<"student" | "mentor" | "company">("student");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading || !session) return;
    if (role === "mentor") nav("/mentor", { replace: true });
    else if (role === "company") nav("/company", { replace: true });
    else nav("/", { replace: true });
  }, [session, role, loading, nav]);

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  };

  const signUp = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: name, role: signupRole },
      },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Account created. You can sign in.");
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error(String((r.error as any)?.message ?? r.error));
  };

  const enterDemo = (r: AppRole) => {
    enterDemoMode(r);
    toast.success(`Entered demo as ${r}`);
    if (r === "mentor") nav("/mentor", { replace: true });
    else if (r === "company") nav("/company", { replace: true });
    else nav("/", { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-subtle p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <Cog className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-2xl">Medad · مِداد</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">King Khalid University</div>
          </div>
        </div>

        <Card className="rounded-3xl shadow-elegant">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to access your strategic intellect dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-3 mt-4">
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button onClick={signIn} disabled={busy} className="w-full rounded-2xl bg-gradient-primary text-primary-foreground">Sign In</Button>
                <Button onClick={google} variant="outline" className="w-full rounded-2xl">Continue with Google</Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-3 mt-4">
                <div className="space-y-1.5"><Label>I am a</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLE_OPTIONS.map(r => (
                      <button key={r.value} type="button" onClick={() => setSignupRole(r.value)}
                        className={`rounded-2xl p-3 border text-xs font-bold flex flex-col items-center gap-1 ${signupRole === r.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/40 text-foreground"}`}>
                        <r.icon className="w-4 h-4" />{r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button onClick={signUp} disabled={busy} className="w-full rounded-2xl bg-gradient-primary text-primary-foreground">Create account</Button>
                <Button onClick={google} variant="outline" className="w-full rounded-2xl">Continue with Google</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="rounded-3xl mt-4 border-dashed border-accent/60 bg-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
              Demo Access
            </CardTitle>
            <CardDescription>Skip authentication and explore each role.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button onClick={() => enterDemo("student")} variant="outline"
              className="w-full rounded-2xl justify-start gap-3 border-primary/40 hover:bg-primary/10">
              <GraduationCap className="w-4 h-4 text-primary" />
              Enter as Student (Faisal)
            </Button>
            <Button onClick={() => enterDemo("mentor")} variant="outline"
              className="w-full rounded-2xl justify-start gap-3 border-accent/40 hover:bg-accent/10">
              <Users className="w-4 h-4 text-accent" />
              Enter as Academic Mentor
            </Button>
            <Button onClick={() => enterDemo("company")} variant="outline"
              className="w-full rounded-2xl justify-start gap-3 border-secondary-foreground/30 hover:bg-secondary/60">
              <Building2 className="w-4 h-4" />
              Enter as Company
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground mt-4">
          <Link to="/" className="hover:underline">Back to home</Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
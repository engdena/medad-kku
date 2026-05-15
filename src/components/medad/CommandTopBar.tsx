import { useEffect, useState } from "react";
import { Languages, Accessibility, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { SectionKey } from "@/components/medad/AppSidebar";
import { LayoutDashboard, Trophy, Map, MessagesSquare, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccessibilityPanel } from "@/components/nebras/AccessibilityPanel";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { student } from "@/data/mockData";

type Props = {
  active?: SectionKey;
  onSelect?: (s: SectionKey) => void;
};

export const CommandTopBar = ({ active, onSelect }: Props = {}) => {
  const { t, lang, toggleLang } = useI18n();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const ar = lang === "ar";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const displayName = (user?.user_metadata as { full_name?: string } | undefined)?.full_name
    ?? (ar ? student.arabicName : student.name);
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p: string) => p[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center gap-2 px-3 lg:px-5 border-b border-border/60 bg-background/60 backdrop-blur-xl">
      <SidebarTrigger className="rounded-xl md:hidden" />
      {active && onSelect && <TopNavTabs active={active} onSelect={onSelect} ar={ar} />}
      <div className="ms-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLang}
          className="rounded-xl gap-1.5 font-semibold"
          aria-label="Toggle language"
        >
          <Languages className="w-4 h-4" />
          <span className="text-xs">{t.nav.language}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={() => setA11yOpen(true)}
          aria-label={t.nav.accessibility}
        >
          <Accessibility className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={() => setDark((v) => !v)}
          aria-label={t.nav.theme}
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-xl gap-2 ps-1.5 pe-3 h-9">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">
                  {initials || "FQ"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-semibold max-w-[140px] truncate">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl">
            <DropdownMenuLabel className="font-display">{displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile/" + student.profileSlug)}>
              {t.nav.publicProfile}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => { await signOut(); navigate("/auth"); }}
              className="text-danger focus:text-danger"
            >
              <LogOut className="w-4 h-4 me-2" /> {t.app.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AccessibilityPanel open={a11yOpen} onOpenChange={setA11yOpen} />
    </header>
  );
};

const TopNavTabs = ({
  active,
  onSelect,
  ar,
}: {
  active: SectionKey;
  onSelect: (s: SectionKey) => void;
  ar: boolean;
}) => {
  const L = (en: string, arS: string) => (ar ? arS : en);
  const items: Array<{ key: SectionKey; label: string; Icon: typeof LayoutDashboard }> = [
    { key: "dashboard", label: L("Dashboard", "لوحة القيادة"), Icon: LayoutDashboard },
    { key: "portfolio", label: L("Portfolio", "الملف"), Icon: Trophy },
    { key: "roadmap", label: L("Roadmap", "الخارطة"), Icon: Map },
    { key: "mentor", label: L("Mentor", "الإرشاد"), Icon: MessagesSquare },
    { key: "settings", label: L("Settings", "الإعدادات"), Icon: Settings },
  ];
  return (
    <nav className="hidden md:flex items-center gap-1 ms-2">
      {items.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              "relative inline-flex items-center gap-1.5 px-3 h-9 rounded-xl text-sm font-medium transition-all",
              isActive
                ? "text-foreground bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {isActive && (
              <span className="absolute left-2 right-2 -bottom-[9px] h-0.5 rounded-full bg-gradient-primary" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

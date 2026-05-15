import { LayoutDashboard, Trophy, Map, MessagesSquare, Settings, Cog, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export type SectionKey = "dashboard" | "portfolio" | "roadmap" | "mentor" | "settings";

type Props = {
  active: SectionKey;
  onSelect: (s: SectionKey) => void;
};

export const AppSidebar = ({ active, onSelect }: Props) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { t, lang } = useI18n();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const ar = lang === "ar";
  const L = (en: string, arS: string) => (ar ? arS : en);

  const items: Array<{ key: SectionKey; label: string; Icon: typeof LayoutDashboard }> = [
    { key: "dashboard", label: L("Dashboard", "لوحة القيادة"), Icon: LayoutDashboard },
    { key: "portfolio", label: L("Portfolio & Skills", "الملف والمهارات"), Icon: Trophy },
    { key: "roadmap", label: L("Strategic Roadmap", "الخارطة الاستراتيجية"), Icon: Map },
    { key: "mentor", label: L("Mentorship", "الإرشاد"), Icon: MessagesSquare },
    { key: "settings", label: L("Settings", "الإعدادات"), Icon: Settings },
  ];

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
            <Cog className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="leading-tight min-w-0">
              <div className="font-display font-bold text-lg tracking-tight text-sidebar-foreground truncate">
                {t.brand.name}
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60 -mt-0.5 truncate">
                {t.brand.sub}
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ key, label, Icon }) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    isActive={active === key}
                    tooltip={label}
                    onClick={() => onSelect(key)}
                    className="rounded-xl transition-all"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="font-medium">{label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={L("Sign out", "تسجيل الخروج")}
              onClick={async () => { await signOut(); navigate("/auth"); }}
              className="rounded-xl text-sidebar-foreground/85 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>{L("Sign out", "تسجيل الخروج")}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

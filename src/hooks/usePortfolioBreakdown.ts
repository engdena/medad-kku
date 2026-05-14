import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type PortfolioCategory =
  | "innovation"
  | "certification"
  | "leadership"
  | "volunteering"
  | "technical"
  | "skill";

export type PortfolioEntry = {
  id: string;
  user_id: string;
  entry_type: "skill" | "achievement";
  title: string;
  category: PortfolioCategory;
  evidence_url: string | null;
  description: string | null;
  created_at: string;
};

export const PORTFOLIO_CATEGORY_POINTS: Record<PortfolioCategory, number> = {
  innovation: 15,
  certification: 10,
  leadership: 10,
  volunteering: 5,
  technical: 5,
  skill: 5,
};

export const PORTFOLIO_ANNUAL_TARGET = 100;
export const PORTFOLIO_STORAGE_KEY = "medad-portfolio-entries-fallback";
export const PORTFOLIO_EVENT = "medad:portfolio-changed";

export const dispatchPortfolioChanged = () => {
  if (typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent(PORTFOLIO_EVENT));
};

export const usePortfolioBreakdown = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const isDemo = !user;

  const load = useCallback(async () => {
    setLoading(true);
    if (isDemo) {
      try {
        const raw =
          typeof window !== "undefined"
            ? window.localStorage.getItem(PORTFOLIO_STORAGE_KEY)
            : null;
        setEntries(raw ? (JSON.parse(raw) as PortfolioEntry[]) : []);
      } catch {
        setEntries([]);
      }
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("student_portfolio_entries")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setEntries((data as PortfolioEntry[]) ?? []);
    setLoading(false);
  }, [isDemo, user]);

  useEffect(() => {
    load();
  }, [load]);

  // Live updates: cross-component event + storage event for demo mode
  useEffect(() => {
    const handler = () => load();
    if (typeof window !== "undefined") {
      window.addEventListener(PORTFOLIO_EVENT, handler);
      window.addEventListener("storage", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(PORTFOLIO_EVENT, handler);
        window.removeEventListener("storage", handler);
      }
    };
  }, [load]);

  // Supabase realtime for authed users
  useEffect(() => {
    if (isDemo || !user) return;
    const channel = supabase
      .channel(`portfolio-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "student_portfolio_entries",
          filter: `user_id=eq.${user.id}`,
        },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isDemo, user, load]);

  const breakdown = useMemo(() => {
    const byCat: Record<PortfolioCategory, { count: number; points: number }> = {
      innovation: { count: 0, points: 0 },
      certification: { count: 0, points: 0 },
      leadership: { count: 0, points: 0 },
      volunteering: { count: 0, points: 0 },
      technical: { count: 0, points: 0 },
      skill: { count: 0, points: 0 },
    };
    let total = 0;
    for (const e of entries) {
      const pts = PORTFOLIO_CATEGORY_POINTS[e.category] ?? 0;
      byCat[e.category].count += 1;
      byCat[e.category].points += pts;
      total += pts;
    }
    const percentage = Math.min(
      100,
      Math.round((total / PORTFOLIO_ANNUAL_TARGET) * 100)
    );
    return { byCat, total, percentage };
  }, [entries]);

  return { entries, loading, reload: load, ...breakdown };
};

export const distinctionLevel = (percentage: number) =>
  percentage <= 30 ? "initiator" : percentage <= 70 ? "distinguished" : "leader";

// Lerp gauge color from KKU light green -> deep green as score rises.
// Returns an HSL color string suitable for chart fills / inline styles.
export const distinctionGaugeColor = (percentage: number) => {
  const p = Math.max(0, Math.min(100, percentage)) / 100;
  // Light green (h=150,s=55%,l=55%) -> Deep green (h=152,s=70%,l=22%)
  const h = 150 + (152 - 150) * p;
  const s = 55 + (70 - 55) * p;
  const l = 55 + (22 - 55) * p;
  return `hsl(${h.toFixed(0)} ${s.toFixed(0)}% ${l.toFixed(0)}%)`;
};

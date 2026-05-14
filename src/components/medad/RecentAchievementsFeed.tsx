import { motion } from "framer-motion";
import { Award, ArrowRight, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PORTFOLIO_CATEGORY_POINTS,
  usePortfolioBreakdown,
} from "@/hooks/usePortfolioBreakdown";
import { useI18n } from "@/i18n/I18nContext";

type Props = { onAdd: () => void; onViewAll: () => void };

export const RecentAchievementsFeed = ({ onAdd, onViewAll }: Props) => {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const L = (en: string, arS: string) => (ar ? arS : en);
  const { entries, loading } = usePortfolioBreakdown();
  const recent = entries.slice(0, 5);

  return (
    <section className="rounded-3xl bg-card border border-border p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-primary font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> {L("Recent Activity", "النشاط الأخير")}
          </div>
          <h3 className="font-display font-bold text-xl mt-1">
            {L("Recent Achievements", "الإنجازات الأخيرة")}
          </h3>
        </div>
        <Button
          onClick={onAdd}
          size="sm"
          className="rounded-2xl bg-gradient-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4 me-1" /> {L("Add New", "إضافة")}
        </Button>
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground">{L("Loading…", "جارٍ التحميل…")}</div>
      )}

      {!loading && recent.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center">
          <Sparkles className="w-6 h-6 mx-auto text-primary" />
          <p className="text-sm text-muted-foreground mt-2">
            {L(
              "No achievements yet — add your first milestone.",
              "لا توجد إنجازات بعد — أضف أول إنجاز لك."
            )}
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {recent.map((entry, idx) => (
          <motion.li
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className="flex items-center gap-3 rounded-2xl border border-border/60 hover:border-primary/40 hover:shadow-soft transition-all p-3 bg-background/40"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-primary/10 grid place-items-center shrink-0">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm truncate">{entry.title}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0">
                  {entry.category}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(entry.created_at).toLocaleDateString(ar ? "ar-SA" : "en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 rounded-full px-2 py-1 shrink-0">
              +{PORTFOLIO_CATEGORY_POINTS[entry.category]} {L("pts", "نقطة")}
            </span>
          </motion.li>
        ))}
      </ul>

      {recent.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="rounded-xl mt-3 w-full justify-center text-primary hover:text-primary"
        >
          {L("View full portfolio", "عرض الملف الكامل")}
          <ArrowRight className={`w-4 h-4 ms-1 ${ar ? "flip-rtl" : ""}`} />
        </Button>
      )}
    </section>
  );
};

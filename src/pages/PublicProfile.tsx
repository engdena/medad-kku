import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { courses, student, calculateDistinction, activityCategoryPoints } from "@/data/mockData";
import { useStudentActivities } from "@/hooks/useStudentActivities";
import { useI18n } from "@/i18n/I18nContext";
import { ArrowLeft, Award, BriefcaseBusiness, GraduationCap, ShieldCheck } from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

const levelKey = (percentage: number) => percentage <= 30 ? "initiator" : percentage <= 70 ? "distinguished" : "leader";

export const PublicProfile = () => {
  const { activities } = useStudentActivities();
  const { t, lang } = useI18n();
  const distinction = calculateDistinction(activities);
  const level = levelKey(distinction.percentage);
  const studentName = lang === "ar" ? student.arabicName : student.name;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-6 md:py-10 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/">
            <Button variant="outline" className="rounded-2xl gap-2">
              <ArrowLeft className={`w-4 h-4 ${lang === "ar" ? "flip-rtl" : ""}`} /> {t.profile.back}
            </Button>
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success ring-1 ring-success/20">
            <ShieldCheck className="w-3.5 h-3.5" /> {t.profile.badge}
          </div>
        </div>

        <section className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
          <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-center">
            <div>
              <div className="text-sm text-muted-foreground">{student.id} · {lang === "ar" ? student.college : student.college}</div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">{studentName}</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">{t.profile.sub}</p>
              <div className="grid sm:grid-cols-3 gap-3 mt-6">
                <Metric icon={<GraduationCap className="w-4 h-4" />} label="GPA" value={`${student.gpa}/${student.gpaScale}`} />
                <Metric icon={<BriefcaseBusiness className="w-4 h-4" />} label={t.hero.insights["Employability score"]} value="78%" />
                <Metric icon={<Award className="w-4 h-4" />} label={t.profile.distinction} value={`${distinction.percentage}%`} />
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground">
              <div className="text-xs uppercase tracking-widest text-primary-foreground/70">{t.profile.distinction}</div>
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="68%" outerRadius="96%" barSize={16} data={[{ value: distinction.percentage, fill: "hsl(var(--accent))" }]} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background={{ fill: "hsl(0 0% 100% / 0.16)" }} dataKey="value" cornerRadius={30} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div className="font-display text-4xl font-bold">{distinction.percentage}%</div>
                </div>
              </div>
              <div className="text-center rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">{t.distinction.labels[level]}</div>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
            <h2 className="font-display font-bold text-2xl mb-4">{t.profile.grades}</h2>
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.code} className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/50 p-3">
                  <div>
                    <div className="font-semibold">{lang === "ar" ? course.nameAr : course.name}</div>
                    <div className="text-xs text-muted-foreground">{course.code}</div>
                  </div>
                  <div className="font-display text-xl font-bold text-primary">{course.grade}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
            <h2 className="font-display font-bold text-2xl mb-4">{t.profile.activities}</h2>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="rounded-2xl bg-secondary/50 p-3">
                  <div className="flex justify-between gap-3 text-xs text-muted-foreground">
                    <span>{t.portfolio.categories[activity.category]} · {t.portfolio.points(activityCategoryPoints[activity.category])}</span>
                    <span>{activity.date}</span>
                  </div>
                  <div className="font-semibold mt-1">{lang === "ar" ? activity.titleAr : activity.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? activity.descriptionAr : activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const Metric = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl bg-secondary/60 p-3">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
    <div className="font-display font-bold text-2xl mt-1">{value}</div>
  </div>
);

export default PublicProfile;
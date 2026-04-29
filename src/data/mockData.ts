export const student = {
  id: "S-44218",
  name: "Faisal Al-Qahtani",
  arabicName: "فيصل القحطاني",
  major: "Industrial Engineering",
  college: "College of Engineering",
  level: "Level 7 of 8",
  gpa: 3.42,
  gpaScale: 5.0,
  attendance: 91,
  riskScore: 38, // 0-100, lower = safer
  riskBand: "Moderate",
  trend: [3.1, 3.25, 3.18, 3.3, 3.42, 3.42],
  semesters: ["S1", "S2", "S3", "S4", "S5", "S6"],
  avatar: "FQ",
  profileSlug: "faisal-al-qahtani",
};

export const gradeScale = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"] as const;

export const courses = [
  { code: "IE301", name: "Engineering Economy", nameAr: "الاقتصاد الهندسي", grade: "A", performance: 91, trend: "up", risk: "low" },
  { code: "IE412", name: "Reliability and Maintenance Planning", nameAr: "الموثوقية وتخطيط الصيانة", grade: "B+", performance: 86, trend: "up", risk: "low" },
  { code: "STAT320", name: "Applied Statistics", nameAr: "الإحصاء التطبيقي", grade: "B", performance: 80, trend: "flat", risk: "medium" },
  { code: "IE405", name: "Operations Research", nameAr: "بحوث العمليات", grade: "B+", performance: 84, trend: "up", risk: "low" },
  { code: "IE430", name: "Supply Chain Management", nameAr: "إدارة سلاسل الإمداد", grade: "A", performance: 92, trend: "up", risk: "low" },
  { code: "IE421", name: "Facilities Planning", nameAr: "تخطيط المرافق", grade: "B", performance: 78, trend: "flat", risk: "medium" },
  { code: "IE333", name: "Work Design & Ergonomics", nameAr: "تصميم العمل والعوامل البشرية", grade: "C+", performance: 74, trend: "down", risk: "medium" },
  { code: "IE410", name: "Quality Control", nameAr: "ضبط الجودة", grade: "B+", performance: 85, trend: "up", risk: "low" },
];

export type ActivityCategory = "research" | "leadership" | "volunteering";

export type StudentActivity = {
  id: string;
  title: string;
  titleAr: string;
  category: ActivityCategory;
  date: string;
  description: string;
  descriptionAr: string;
  evidence: string;
};

export const activityCategoryPoints: Record<ActivityCategory, number> = {
  research: 15,
  leadership: 10,
  volunteering: 5,
};

export const annualDistinctionTarget = 100;

export const defaultActivities: StudentActivity[] = [
  {
    id: "act-1",
    title: "Sustainability & Operations Project",
    titleAr: "مشروع الاستدامة والعمليات",
    category: "research",
    date: "2025-02-18",
    description: "A strategic optimization study for Soudah Development focused on environmental sustainability and operational efficiency in high-altitude logistics.",
    descriptionAr: "دراسة تحسين استراتيجية لشركة السودة للتطوير ركزت على الاستدامة البيئية والكفاءة التشغيلية في لوجستيات المناطق المرتفعة.",
    evidence: "https://example.com/soudah-operations",
  },
  {
    id: "act-2",
    title: "Consulting Experience by BCG",
    titleAr: "تجربة استشارية بإشراف BCG",
    category: "leadership",
    date: "2025-01-10",
    description: "A simulated strategic transformation project following MBB methodologies, MECE frameworks, and hypothesis-driven problem-solving.",
    descriptionAr: "مشروع محاكاة للتحول الاستراتيجي وفق منهجيات MBB وأطر MECE وحل المشكلات القائم على الفرضيات.",
    evidence: "https://example.com/bcg-consulting",
  },
  {
    id: "act-3",
    title: "Industrial Internship at Saudi Aramco",
    titleAr: "تدريب صناعي في أرامكو السعودية",
    category: "leadership",
    date: "2024-12-04",
    description: "An operational excellence project involving process optimization and reliability engineering within a refinery or distribution hub.",
    descriptionAr: "مشروع تميز تشغيلي تضمن تحسين العمليات وهندسة الموثوقية داخل مصفاة أو مركز توزيع.",
    evidence: "https://example.com/aramco-internship",
  },
  {
    id: "act-4",
    title: "Supply Chain Project for Maaden",
    titleAr: "مشروع سلسلة إمداد لشركة معادن",
    category: "research",
    date: "2024-11-16",
    description: "An end-to-end supply chain optimization model for Maaden using Python and SQL for demand forecasting.",
    descriptionAr: "نموذج شامل لتحسين سلسلة الإمداد لشركة معادن باستخدام Python وSQL للتنبؤ بالطلب.",
    evidence: "https://example.com/maaden-supply-chain",
  },
];

export const calculateDistinction = (activities: Pick<StudentActivity, "category">[]) => {
  const points = activities.reduce((sum, activity) => sum + activityCategoryPoints[activity.category], 0);
  return {
    points,
    percentage: Math.min(100, Math.round((points / annualDistinctionTarget) * 100)),
  };
};

export const recommendedSkills = [
  {
    title: "Generative AI Engineering",
    titleAr: "هندسة الذكاء الاصطناعي التوليدي",
    provider: "Doroob × KKU",
    providerAr: "دروب × جامعة الملك خالد",
    duration: "6 weeks",
    demand: 96,
    salary: "18,500 SAR",
    salaryAr: "18,500 ريال",
    match: 94,
    tags: ["Vision 2030", "AI", "High demand"],
    tagsAr: ["رؤية 2030", "ذكاء اصطناعي", "طلب مرتفع"],
    reason: "Bridges your ML strength with the #1 emerging skill in Riyadh & Jeddah.",
    reasonAr: "يربط قوتك في تعلّم الآلة بأكثر مهارة طلباً في الرياض وجدة.",
  },
  {
    title: "Cloud Architecture (AWS / Azure)",
    titleAr: "هندسة الحوسبة السحابية (AWS / Azure)",
    provider: "SDAIA Academy",
    providerAr: "أكاديمية سدايا",
    duration: "8 weeks",
    demand: 88,
    salary: "16,200 SAR",
    salaryAr: "16,200 ريال",
    match: 87,
    tags: ["Cloud", "Saudi Labor Market"],
    tagsAr: ["سحابي", "سوق العمل السعودي"],
    reason: "Closes the Distributed Systems gap and matches NEOM hiring trends.",
    reasonAr: "يسد فجوة النظم الموزعة ويتوافق مع توظيف نيوم.",
  },
  {
    title: "Cybersecurity Fundamentals",
    titleAr: "أساسيات الأمن السيبراني",
    provider: "NCA × Tuwaiq",
    providerAr: "الهيئة الوطنية للأمن السيبراني × طويق",
    duration: "5 weeks",
    demand: 82,
    salary: "15,000 SAR",
    salaryAr: "15,000 ريال",
    match: 76,
    tags: ["Security", "Vision 2030"],
    tagsAr: ["أمن", "رؤية 2030"],
    reason: "Strategic for the Kingdom's digital transformation programs.",
    reasonAr: "استراتيجية لبرامج التحوّل الرقمي في المملكة.",
  },
  {
    title: "Arabic NLP & LLM Fine-tuning",
    titleAr: "معالجة اللغة العربية وضبط النماذج اللغوية",
    provider: "KKU Research Lab",
    providerAr: "مختبر أبحاث جامعة الملك خالد",
    duration: "4 weeks",
    demand: 79,
    salary: "17,000 SAR",
    salaryAr: "17,000 ريال",
    match: 89,
    tags: ["Research", "Arabic AI"],
    tagsAr: ["بحث", "ذكاء اصطناعي عربي"],
    reason: "Aligns with your graduation project domain.",
    reasonAr: "يتوافق مع مجال مشروع تخرجك.",
  },
];

export const industryProjects = [
  {
    company: "Aramco Digital",
    companyAr: "أرامكو الرقمية",
    sector: "Energy / AI",
    sectorAr: "طاقة / ذكاء اصطناعي",
    title: "Predictive maintenance for refinery sensors",
    titleAr: "صيانة تنبؤية لمستشعرات المصافي",
    budget: "Sponsored",
    budgetAr: "ممَوَّل بالكامل",
    location: "Dhahran",
    locationAr: "الظهران",
    skills: ["Python", "Time-series", "ML"],
    deadline: "May 2025",
    deadlineAr: "مايو 2025",
    match: 92,
    seats: 3,
  },
  {
    company: "STC Solutions",
    companyAr: "حلول stc",
    sector: "Telecom",
    sectorAr: "اتصالات",
    title: "Arabic chatbot for customer onboarding",
    titleAr: "روبوت محادثة عربي لاستقبال العملاء",
    budget: "12,000 SAR",
    budgetAr: "12,000 ريال",
    location: "Riyadh / Remote",
    locationAr: "الرياض / عن بُعد",
    skills: ["NLP", "React", "LLM"],
    deadline: "Apr 2025",
    deadlineAr: "أبريل 2025",
    match: 88,
    seats: 2,
  },
  {
    company: "NEOM Tech",
    companyAr: "نيوم تك",
    sector: "Smart Cities",
    sectorAr: "مدن ذكية",
    title: "Edge-AI traffic flow optimization",
    titleAr: "تحسين تدفق المرور بالذكاء الطرفي",
    budget: "Sponsored + Internship",
    budgetAr: "ممَوَّل + تدريب",
    location: "NEOM",
    locationAr: "نيوم",
    skills: ["Computer Vision", "IoT"],
    deadline: "Jun 2025",
    deadlineAr: "يونيو 2025",
    match: 81,
    seats: 4,
  },
  {
    company: "Ministry of Health",
    companyAr: "وزارة الصحة",
    sector: "HealthTech",
    sectorAr: "تقنية صحية",
    title: "Risk-stratification dashboard for clinics",
    titleAr: "لوحة تصنيف المخاطر للعيادات",
    budget: "Sponsored",
    budgetAr: "ممَوَّل",
    location: "Abha / Riyadh",
    locationAr: "أبها / الرياض",
    skills: ["Data viz", "React", "Stats"],
    deadline: "May 2025",
    deadlineAr: "مايو 2025",
    match: 84,
    seats: 2,
  },
];

export const insights = [
  { label: "Predicted final GPA", value: "3.58", trend: "+0.16", positive: true },
  { label: "Employability score", value: "78%", trend: "+12%", positive: true },
  { label: "Skill-market gap", value: "2 skills", trend: "−1", positive: true },
  { label: "Peer percentile", value: "Top 22%", trend: "+5%", positive: true },
];
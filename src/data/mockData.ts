export const student = {
  id: "S-44218",
  name: "Faisal Al-Qahtani",
  arabicName: "فيصل القحطاني",
  major: "Computer Science",
  college: "College of Computer Science",
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
  { code: "CS401", name: "Machine Learning", nameAr: "تعلّم الآلة", grade: "B+", performance: 84, trend: "up", risk: "low" },
  { code: "CS402", name: "Distributed Systems", nameAr: "النظم الموزعة", grade: "C", performance: 68, trend: "down", risk: "high" },
  { code: "CS411", name: "Data Engineering", nameAr: "هندسة البيانات", grade: "B", performance: 78, trend: "flat", risk: "medium" },
  { code: "MATH320", name: "Linear Algebra II", nameAr: "الجبر الخطي 2", grade: "A", performance: 91, trend: "up", risk: "low" },
  { code: "ENG250", name: "Technical Writing", nameAr: "الكتابة التقنية", grade: "C+", performance: 73, trend: "down", risk: "medium" },
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
    title: "Published Arabic NLP research poster",
    titleAr: "ملصق بحثي منشور في معالجة اللغة العربية",
    category: "research",
    date: "2025-02-18",
    description: "Presented a research poster on fine-tuning Arabic language models for student services.",
    descriptionAr: "قدّم ملصقاً بحثياً عن ضبط النماذج اللغوية العربية لخدمات الطلاب.",
    evidence: "https://example.com/research-poster",
  },
  {
    id: "act-2",
    title: "AI Club technical lead",
    titleAr: "قائد تقني في نادي الذكاء الاصطناعي",
    category: "leadership",
    date: "2025-01-10",
    description: "Led weekly bootcamp sessions for applied machine learning projects.",
    descriptionAr: "قاد جلسات معسكر أسبوعية لمشاريع تعلم الآلة التطبيقية.",
    evidence: "https://example.com/ai-club",
  },
  {
    id: "act-3",
    title: "Community data-skills workshop",
    titleAr: "ورشة مجتمعية لمهارات البيانات",
    category: "volunteering",
    date: "2024-12-04",
    description: "Delivered a short workshop introducing data visualization to high-school students.",
    descriptionAr: "قدّم ورشة قصيرة لتعريف طلاب المرحلة الثانوية بتصور البيانات.",
    evidence: "https://example.com/workshop",
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
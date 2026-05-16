export const student = {
  id: "S-44218",
  name: "Faisal Al-Qahtani",
  arabicName: "فيصل القحطاني",
  major: "Industrial Engineering",
  majorAr: "الهندسة الصناعية",
  college: "College of Engineering",
  collegeAr: "كلية الهندسة",
  level: "Level 7 of 8",
  gpa: 4.87,
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
    title: "Financial Modeling (FMVA Standards)",
    titleAr: "النمذجة المالية وفق معايير FMVA",
    provider: "CFI × KKU Business Clinic",
    providerAr: "CFI × عيادة الأعمال بجامعة الملك خالد",
    duration: "5 weeks",
    demand: 91,
    salary: "17,500 SAR",
    salaryAr: "17,500 ريال",
    match: 94,
    tags: ["Technical", "FMVA", "Consulting"],
    tagsAr: ["تقنية", "FMVA", "استشارات"],
    reason: "Builds investment-case fluency for engineering economy, cost modeling, and strategic transformation work.",
    reasonAr: "يبني طلاقة إعداد دراسات الجدوى للنمذجة الاقتصادية والتكاليف ومشاريع التحول الاستراتيجي.",
  },
  {
    title: "Data Analytics (Power BI, SQL, Python)",
    titleAr: "تحليل البيانات (Power BI وSQL وPython)",
    provider: "Tuwaiq × Industrial Analytics Lab",
    providerAr: "طويق × مختبر التحليلات الصناعية",
    duration: "6 weeks",
    demand: 93,
    salary: "16,800 SAR",
    salaryAr: "16,800 ريال",
    match: 87,
    tags: ["Technical", "Power BI", "Python"],
    tagsAr: ["تقنية", "Power BI", "Python"],
    reason: "Converts operations data into executive dashboards for reliability, logistics, and demand forecasting.",
    reasonAr: "يحوّل بيانات العمليات إلى لوحات تنفيذية للموثوقية واللوجستيات والتنبؤ بالطلب.",
  },
  {
    title: "Optimization Modeling (Gurobi / CPLEX)",
    titleAr: "نمذجة التحسين (Gurobi / CPLEX)",
    provider: "KKU Operations Research Studio",
    providerAr: "استوديو بحوث العمليات بجامعة الملك خالد",
    duration: "7 weeks",
    demand: 86,
    salary: "18,200 SAR",
    salaryAr: "18,200 ريال",
    match: 89,
    tags: ["Technical", "OR", "Supply Chain"],
    tagsAr: ["تقنية", "بحوث عمليات", "سلاسل الإمداد"],
    reason: "Strengthens linear programming and network-flow modeling for facilities, logistics, and capacity planning.",
    reasonAr: "يعزز البرمجة الخطية ونمذجة الشبكات لتخطيط المرافق واللوجستيات والطاقة الاستيعابية.",
  },
  {
    title: "Lean Six Sigma & Strategic Problem Solving",
    titleAr: "لين ستة سيجما وحل المشكلات الاستراتيجية",
    provider: "Saudi Quality Council × BCG Case Lab",
    providerAr: "المجلس السعودي للجودة × مختبر حالات BCG",
    duration: "6 weeks",
    demand: 90,
    salary: "17,900 SAR",
    salaryAr: "17,900 ريال",
    match: 92,
    tags: ["Lean", "MBB", "Soft Skills"],
    tagsAr: ["لين", "MBB", "مهارات ناعمة"],
    reason: "Combines Lean Six Sigma with strategic thinking, case interviewing, stakeholder management, and complex problem solving.",
    reasonAr: "يجمع بين لين ستة سيجما والتفكير الاستراتيجي ومقابلات الحالات وإدارة أصحاب المصلحة وحل المشكلات المعقدة.",
  },
];

export const industryProjects = [
  {
    company: "Soudah Development",
    companyAr: "السودة للتطوير",
    sector: "Sustainability / Operations",
    sectorAr: "استدامة / عمليات",
    title: "Sustainability & Operations Project",
    titleAr: "مشروع الاستدامة والعمليات",
    description: "A strategic optimization study for Soudah Development focusing on environmental sustainability and operational efficiency in high-altitude logistics.",
    descriptionAr: "دراسة تحسين استراتيجية لشركة السودة للتطوير تركز على الاستدامة البيئية والكفاءة التشغيلية في لوجستيات المناطق المرتفعة.",
    budget: "Sponsored",
    budgetAr: "ممَوَّل",
    location: "Abha Highlands",
    locationAr: "مرتفعات أبها",
    skills: ["Sustainability", "Logistics", "Optimization"],
    deadline: "May 2025",
    deadlineAr: "مايو 2025",
    match: 94,
    seats: 3,
  },
  {
    company: "BCG Case Lab",
    companyAr: "مختبر حالات BCG",
    sector: "Strategy Consulting",
    sectorAr: "استشارات استراتيجية",
    title: "MBB-style Strategic Transformation Simulation",
    titleAr: "محاكاة تحول استراتيجي بمنهجية MBB",
    description: "A simulated strategic transformation project by BCG using MBB methodologies, MECE frameworks, and hypothesis-driven problem-solving.",
    descriptionAr: "مشروع محاكاة للتحول الاستراتيجي بإشراف BCG باستخدام منهجيات MBB وأطر MECE وحل المشكلات القائم على الفرضيات.",
    budget: "Mentored",
    budgetAr: "بإرشاد مهني",
    location: "Riyadh / Hybrid",
    locationAr: "الرياض / هجين",
    skills: ["MECE", "Hypotheses", "Case Interviewing"],
    deadline: "Apr 2025",
    deadlineAr: "أبريل 2025",
    match: 91,
    seats: 2,
  },
  {
    company: "Saudi Aramco",
    companyAr: "أرامكو السعودية",
    sector: "Operational Excellence",
    sectorAr: "التميز التشغيلي",
    title: "Industrial Internship in Reliability Engineering",
    titleAr: "تدريب صناعي في هندسة الموثوقية",
    description: "An operational excellence project at Saudi Aramco involving process optimization and reliability engineering within a refinery or distribution hub.",
    descriptionAr: "مشروع تميز تشغيلي في أرامكو السعودية يتضمن تحسين العمليات وهندسة الموثوقية داخل مصفاة أو مركز توزيع.",
    budget: "Internship",
    budgetAr: "تدريب",
    location: "Dhahran / Distribution Hub",
    locationAr: "الظهران / مركز توزيع",
    skills: ["Reliability", "Process Optimization", "Lean"],
    deadline: "Jun 2025",
    deadlineAr: "يونيو 2025",
    match: 90,
    seats: 4,
  },
  {
    company: "Maaden Logistics",
    companyAr: "معادن للخدمات اللوجستية",
    sector: "Supply Chain Analytics",
    sectorAr: "تحليلات سلاسل الإمداد",
    title: "End-to-end Supply Chain Optimization Model",
    titleAr: "نموذج شامل لتحسين سلسلة الإمداد",
    description: "A supply chain optimization model developed for Maaden using Python and SQL for demand forecasting.",
    descriptionAr: "نموذج تحسين لسلسلة الإمداد لشركة معادن باستخدام Python وSQL للتنبؤ بالطلب.",
    budget: "Sponsored",
    budgetAr: "ممَوَّل",
    location: "Ras Al-Khair / Riyadh",
    locationAr: "رأس الخير / الرياض",
    skills: ["Python", "SQL", "Forecasting"],
    deadline: "May 2025",
    deadlineAr: "مايو 2025",
    match: 88,
    seats: 2,
  },
];

export const insights = [
  { label: "Predicted final GPA", value: "3.58", trend: "+0.16", positive: true },
  { label: "Employability score", value: "78%", trend: "+12%", positive: true },
  { label: "Skill-market gap", value: "4 skills", trend: "−1", positive: true },
  { label: "Peer percentile", value: "Top 22%", trend: "+5%", positive: true },
];
export type TalentRecord = {
  id: string;
  name: string;
  nameAr: string;
  major: string;
  majorAr: string;
  title: string;
  titleAr: string;
  gpa: number;
  selfLearningHours: number;
  marketReadiness: number;
  technicalSkills: string[];
  softSkills: string[];
  softSkillsAr: string[];
  profileSlug: string;
};

export const talentPool: TalentRecord[] = [
  {
    id: "S-44218",
    name: "Faisal Al-Qahtani",
    nameAr: "فيصل القحطاني",
    major: "Industrial Engineering",
    majorAr: "الهندسة الصناعية",
    title: "Industrial Engineer",
    titleAr: "مهندس صناعي",
    gpa: 4.87,
    selfLearningHours: 142,
    marketReadiness: 92,
    technicalSkills: ["Financial Modeling", "Power BI", "SQL", "Lean Six Sigma"],
    softSkills: ["Strategic Thinking", "Stakeholder Management", "Problem Solving"],
    softSkillsAr: ["التفكير الاستراتيجي", "إدارة أصحاب المصلحة", "حل المشكلات"],
    profileSlug: "faisal-al-qahtani",
  },
  {
    id: "S-44102",
    name: "Lina Al-Harthi",
    nameAr: "لينا الحارثي",
    major: "Industrial Engineering",
    majorAr: "الهندسة الصناعية",
    title: "Industrial Engineer",
    titleAr: "مهندسة صناعية",
    gpa: 4.62,
    selfLearningHours: 98,
    marketReadiness: 84,
    technicalSkills: ["Operations Research", "Python", "Tableau", "Process Mapping"],
    softSkills: ["Communication", "Leadership", "Analytical Thinking"],
    softSkillsAr: ["التواصل", "القيادة", "التفكير التحليلي"],
    profileSlug: "lina-al-harthi",
  },
  {
    id: "S-44307",
    name: "Abdullah Al-Mutairi",
    nameAr: "عبدالله المطيري",
    major: "Industrial Engineering",
    majorAr: "الهندسة الصناعية",
    title: "Industrial Engineer",
    titleAr: "مهندس صناعي",
    gpa: 3.91,
    selfLearningHours: 76,
    marketReadiness: 78,
    technicalSkills: ["Supply Chain", "SAP", "Excel Modeling", "Six Sigma"],
    softSkills: ["Teamwork", "Negotiation", "Time Management"],
    softSkillsAr: ["العمل الجماعي", "التفاوض", "إدارة الوقت"],
    profileSlug: "abdullah-al-mutairi",
  },
  {
    id: "S-44511",
    name: "Noura Al-Subaie",
    nameAr: "نورة السبيعي",
    major: "Industrial Engineering",
    majorAr: "الهندسة الصناعية",
    title: "Industrial Engineer",
    titleAr: "مهندسة صناعية",
    gpa: 3.58,
    selfLearningHours: 41,
    marketReadiness: 64,
    technicalSkills: ["Quality Control", "Minitab", "AutoCAD"],
    softSkills: ["Adaptability", "Critical Thinking"],
    softSkillsAr: ["المرونة", "التفكير النقدي"],
    profileSlug: "noura-al-subaie",
  },
  {
    id: "S-44623",
    name: "Yousef Al-Ghamdi",
    nameAr: "يوسف الغامدي",
    major: "Industrial Engineering",
    majorAr: "الهندسة الصناعية",
    title: "Industrial Engineer",
    titleAr: "مهندس صناعي",
    gpa: 3.21,
    selfLearningHours: 22,
    marketReadiness: 52,
    technicalSkills: ["Excel", "Project Management"],
    softSkills: ["Collaboration", "Resilience"],
    softSkillsAr: ["التعاون", "الإصرار"],
    profileSlug: "yousef-al-ghamdi",
  },
];

export const isAtRisk = (t: Pick<TalentRecord, "gpa" | "marketReadiness">) =>
  t.gpa < 3.75 || t.marketReadiness < 70;
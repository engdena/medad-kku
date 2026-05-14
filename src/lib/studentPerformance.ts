export type StudentPerformanceSource = Record<string, unknown>;

export type StudentPerformanceRecord = {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  gpa: number;
  selfLearningHours: number;
  marketReadiness: number;
  technicalSkills: string[];
  softSkills: string[];
  profileSlug: string;
};

export type StudentPerformanceClient = {
  from: (table: string) => {
    select: (columns: string) => PromiseLike<{
      data: StudentPerformanceSource[] | null;
      error: { message?: string } | null;
    }>;
  };
};

export const STUDENT_PERFORMANCE_TABLE = "student_performance_market_readiness";

export const FAISAL_FALLBACK: StudentPerformanceRecord = {
  id: "faisal-demo",
  name: "Faisal",
  nameAr: "فيصل",
  title: "Industrial Engineer",
  titleAr: "مهندس صناعي",
  gpa: 4.87,
  selfLearningHours: 120,
  marketReadiness: 92,
  technicalSkills: ["Financial Modeling", "Power BI", "SQL", "Lean Six Sigma"],
  softSkills: ["Strategic Thinking", "Problem Solving", "Stakeholder Management"],
  profileSlug: "faisal-al-qahtani",
};

export const TALENT_POOL_FALLBACK: StudentPerformanceRecord[] = [
  FAISAL_FALLBACK,
  {
    id: "ie-student-002",
    name: "Sara Al-Otaibi",
    nameAr: "سارة العتيبي",
    title: "Supply Chain Engineer",
    titleAr: "مهندسة سلاسل إمداد",
    gpa: 4.10,
    selfLearningHours: 84,
    marketReadiness: 75,
    technicalSkills: ["SAP MM", "Demand Forecasting", "Inventory Optimization", "Power BI"],
    softSkills: ["Negotiation", "Cross-functional Collaboration", "Analytical Thinking"],
    profileSlug: "sara-al-otaibi",
  },
  {
    id: "ie-student-003",
    name: "Khalid Al-Harbi",
    nameAr: "خالد الحربي",
    title: "Quality Control Engineer",
    titleAr: "مهندس ضبط جودة",
    gpa: 3.65,
    selfLearningHours: 42,
    marketReadiness: 60,
    technicalSkills: ["Statistical Process Control", "Minitab", "ISO 9001", "Root Cause Analysis"],
    softSkills: ["Attention to Detail", "Reporting", "Discipline"],
    profileSlug: "khalid-al-harbi",
  },
  {
    id: "ie-student-004",
    name: "Noura Al-Ghamdi",
    nameAr: "نورة الغامدي",
    title: "Lean Manufacturing Engineer",
    titleAr: "مهندسة تصنيع رشيق",
    gpa: 4.50,
    selfLearningHours: 110,
    marketReadiness: 88,
    technicalSkills: ["Value Stream Mapping", "Kaizen", "5S", "Lean Six Sigma"],
    softSkills: ["Continuous Improvement", "Coaching", "Change Management"],
    profileSlug: "noura-al-ghamdi",
  },
  {
    id: "ie-student-005",
    name: "Abdullah Al-Zahrani",
    nameAr: "عبدالله الزهراني",
    title: "Facilities Planning Engineer",
    titleAr: "مهندس تخطيط منشآت",
    gpa: 3.90,
    selfLearningHours: 70,
    marketReadiness: 70,
    technicalSkills: ["AutoCAD", "Facility Layout", "Capacity Planning", "Simulation (Arena)"],
    softSkills: ["Spatial Reasoning", "Project Coordination", "Communication"],
    profileSlug: "abdullah-al-zahrani",
  },
  {
    id: "ie-student-006",
    name: "Lama Al-Shehri",
    nameAr: "لمى الشهري",
    title: "Sustainability Engineer",
    titleAr: "مهندسة استدامة",
    gpa: 4.25,
    selfLearningHours: 95,
    marketReadiness: 82,
    technicalSkills: ["Life Cycle Assessment", "ESG Reporting", "Energy Modeling", "ISO 14001"],
    softSkills: ["Systems Thinking", "Stakeholder Engagement", "Storytelling"],
    profileSlug: "lama-al-shehri",
  },
];

const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, "");

const getValue = (row: StudentPerformanceSource, keys: string[]) => {
  const normalized = new Map(Object.entries(row).map(([key, value]) => [normalizeKey(key), value]));
  return keys.map(normalizeKey).map((key) => normalized.get(key)).find((value) => value !== undefined && value !== null && value !== "");
};

const toNumber = (value: unknown, fallback: number) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace("%", ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const toText = (value: unknown, fallback: string) => {
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
};

export const toSkillList = (value: unknown, fallback: string[]) => {
  if (Array.isArray(value)) {
    const list = value.map((skill) => String(skill).trim()).filter(Boolean);
    return list.length ? list : fallback;
  }
  if (typeof value === "string") {
    const list = value.split(/[,;|\n]/).map((skill) => skill.trim()).filter(Boolean);
    return list.length ? list : fallback;
  }
  return fallback;
};

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || FAISAL_FALLBACK.profileSlug;

export const mapStudentPerformanceRows = (rows: StudentPerformanceSource[] | null | undefined) => {
  const mapped = (rows ?? []).map((row, index): StudentPerformanceRecord => {
    const name = toText(getValue(row, ["student_name", "student name", "name", "full_name", "full name"]), FAISAL_FALLBACK.name);
    const id = toText(getValue(row, ["id", "student_id", "student id", "student_code", "student code"]), `${slugify(name)}-${index}`);

    return {
      id,
      name,
      nameAr: toText(getValue(row, ["name_ar", "arabic_name", "student_name_ar"]), name),
      title: toText(getValue(row, ["title", "major", "field_of_study", "field of study"]), FAISAL_FALLBACK.title),
      titleAr: FAISAL_FALLBACK.titleAr,
      gpa: toNumber(getValue(row, ["gpa", "university_gpa", "university gpa", "student_gpa"]), FAISAL_FALLBACK.gpa),
      selfLearningHours: toNumber(getValue(row, ["self_learning", "self learning", "self_learning_hours", "self learning hours"]), FAISAL_FALLBACK.selfLearningHours),
      marketReadiness: toNumber(getValue(row, ["market_readiness", "market readiness", "market_readiness_score", "market readiness score", "readiness"]), FAISAL_FALLBACK.marketReadiness),
      technicalSkills: toSkillList(getValue(row, ["technical_skills", "technical skills", "tech_skills", "skills"]), FAISAL_FALLBACK.technicalSkills),
      softSkills: toSkillList(getValue(row, ["soft_skills", "soft skills", "behavioral_skills"]), FAISAL_FALLBACK.softSkills),
      profileSlug: slugify(name),
    };
  });

  if (!mapped.length) return TALENT_POOL_FALLBACK;
  const faisal = mapped.find((s) => s.id === FAISAL_FALLBACK.id || s.profileSlug === FAISAL_FALLBACK.profileSlug);
  const rest = mapped.filter((s) => s !== faisal).sort((a, b) => b.gpa - a.gpa);
  return faisal ? [faisal, ...rest] : mapped.sort((a, b) => b.gpa - a.gpa);
};
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

  return mapped.length ? mapped.sort((a, b) => b.marketReadiness - a.marketReadiness) : [FAISAL_FALLBACK];
};
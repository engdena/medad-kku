import { useEffect, useState } from "react";
import { defaultActivities, type StudentActivity } from "@/data/mockData";

const STORAGE_KEY = "medad-student-activities";
const STORAGE_VERSION_KEY = "medad-student-activities-version";
const CURRENT_VERSION = "industrial-engineering-v1";

export const useStudentActivities = () => {
  const [activities, setActivities] = useState<StudentActivity[]>(() => {
    if (typeof window === "undefined") return defaultActivities;
    if (window.localStorage.getItem(STORAGE_VERSION_KEY) !== CURRENT_VERSION) {
      window.localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultActivities));
      return defaultActivities;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultActivities;
    try {
      return JSON.parse(saved) as StudentActivity[];
    } catch {
      return defaultActivities;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  return { activities, setActivities };
};
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { en } from "./en";
import { ar } from "./ar";

export type Lang = "en" | "ar";
type Dict = typeof en;

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Dict;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

const I18nContext = createContext<Ctx | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("medad-lang") as Lang) || (localStorage.getItem("nebras-lang") as Lang) || "en";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.documentElement.classList.toggle("font-arabic", lang === "ar");
    localStorage.setItem("medad-lang", lang);
  }, [lang, dir]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      dir,
      t: lang === "ar" ? ar : en,
      setLang,
      toggleLang: () => setLang((l) => (l === "en" ? "ar" : "en")),
    }),
    [lang, dir]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
};
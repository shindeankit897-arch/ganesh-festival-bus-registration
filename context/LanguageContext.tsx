"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import en from "@/locales/en/translation.json";
import mr from "@/locales/mr/translation.json";

type Language = "en" | "mr";

type Translation = typeof en;

type LanguageContextType = {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: Translation;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = useMemo(() => {
    return language === "en" ? en : mr;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider."
    );
  }

  return context;
}
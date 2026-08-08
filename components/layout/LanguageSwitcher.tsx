"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">

      <Languages size={20} />

      <button
        onClick={() => changeLanguage("en")}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
          language === "en"
            ? "bg-white text-orange-600"
            : "bg-orange-500 text-white hover:bg-orange-400"
        }`}
      >
        English
      </button>

      <button
        onClick={() => changeLanguage("mr")}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
          language === "mr"
            ? "bg-white text-orange-600"
            : "bg-orange-500 text-white hover:bg-orange-400"
        }`}
      >
        मराठी
      </button>

    </div>
  );
}
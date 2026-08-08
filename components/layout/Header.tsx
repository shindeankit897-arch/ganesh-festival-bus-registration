"use client";

import { BusFront } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="bg-orange-600 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <div className="flex items-center gap-3">
          <BusFront size={36} />

          <div>
            <h1 className="text-2xl font-bold">
              {t.title}
            </h1>

            <p className="text-sm text-orange-100">
              {t.subtitle}
            </p>
          </div>
        </div>

        <LanguageSwitcher />

      </div>
    </header>
  );
}
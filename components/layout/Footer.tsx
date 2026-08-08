"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-white mt-12">

      <div className="mx-auto max-w-7xl py-6 text-center">

        <p className="text-gray-700">
          © 2026 Ganesh Festival Bus Management System
        </p>

        <p className="text-sm text-gray-500 mt-2">
          {t.footer}
        </p>

      </div>

    </footer>
  );
}
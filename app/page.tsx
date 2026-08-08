"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PassengerForm from "@/components/form/PassengerForm";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-orange-50 py-10 px-4">

        <div className="mx-auto max-w-5xl">

          <div className="rounded-2xl bg-white shadow-xl p-8 md:p-10">

            <h2 className="text-3xl font-bold text-center text-orange-600">
              {t.subtitle}
            </h2>

            <p className="text-center text-gray-500 mt-2">
              {t.title}
            </p>

            <div className="mt-10">
              <PassengerForm />
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
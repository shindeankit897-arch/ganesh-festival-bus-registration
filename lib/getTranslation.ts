import en from "@/locales/en/translation.json";
import mr from "@/locales/mr/translation.json";

export function getTranslations(language: "en" | "mr") {
  return language === "mr" ? mr : en;
}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translations from "../locales/i18n.json";

// JSON 파일을 i18next 형식으로 변환
const resources = {
  ko: {
    translation: Object.fromEntries(
      Object.entries(translations).map(([key, value]) => [key, value.ko])
    ),
  },
  en: {
    translation: Object.fromEntries(
      Object.entries(translations).map(([key, value]) => [key, value.en])
    ),
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ko",
    debug: false,

    interpolation: {
      escapeValue: false, // React는 이미 XSS를 방지하므로
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;

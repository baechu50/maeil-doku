import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ko from "../locales/ko.json";
import en from "../locales/en.json";

const resources = {
  ko: { translation: ko },
  en: { translation: en },
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

    react: {
      useSuspense: true,
    },
  });

export default i18n;

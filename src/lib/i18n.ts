import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "ko",
    fallbackLng: "ko",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/translation.json`,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;

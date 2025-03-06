import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: { welcome: "Welcome" } },
  fr: { translation: { welcome: "Bienvenue" } },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: { escapeValue: false },
});

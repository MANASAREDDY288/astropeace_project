import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import JSON translation files
import enUS from "./locales/en-US.json";
import teIN from "./locales/te-IN.json";
import hiIN from "./locales/hi-IN.json";
import taIN from "./locales/ta-IN.json";
import knIN from "./locales/kn-IN.json";
import mlIN from "./locales/ml-IN.json";

import AppStorage, { DIR, LANG, TRANS } from "@/utils/services/app.storage";
import { RtlDir, SessionLang } from "@/utils/services/app.event";

let SessionTrans: Record<string, string> = {};

export const languages = [
  {
    code: "en-US",
    name: "English",
    locale: "English",
    dir: "ltr",
  },
  {
    code: "te-IN",
    name: "Telugu",
    locale: "తెలుగు",
    dir: "ltr",
  },
  {
    code: "hi-IN",
    name: "Hindi",
    locale: "हिन्दी",
    dir: "ltr",
  },
  {
    code: "kn-IN",
    name: "Kannada",
    locale: "ಕನ್ನಡ",
    dir: "ltr",
  },
  {
    code: "ml-IN",
    name: "Malayalam",
    locale: "മലയാളം",
    dir: "ltr",
  },
  {
    code: "ta-IN",
    name: "Tamil",
    locale: "தமிழ்",
    dir: "ltr",
  },
] as const;

type ResourceKey = (typeof languages)[number]["code"];

export const langDirection = (lang: string) => {
  return languages.find((l) => l.code === lang)?.dir ?? "ltr";
};

export const resources: any = {
  "en-US": {
    translation: enUS,
  },
  "te-IN": {
    translation: teIN,
  },
  "hi-IN": {
    translation: hiIN,
  },
  "ta-IN": {
    translation: taIN,
  },
  "kn-IN": {
    translation: knIN,
  },
  "ml-IN": {
    translation: mlIN,
  },
} as const;

// Initialize with stored language if available
const storedLang = AppStorage.getData(LANG) || "en-US";

i18n.use(initReactI18next).init({
  resources,
  lng: storedLang,
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Language change listener
i18n.on("languageChanged", (lng: string) => {
  try {
    const dir = langDirection(lng);

    AppStorage.setData(DIR, dir);
    AppStorage.setData(LANG, lng);
    RtlDir.value = dir !== "ltr";
    SessionLang.value = lng;
    if (lng in resources) {
      AppStorage.setData(TRANS, resources[lng as ResourceKey].translation);
      SessionTrans = resources[lng as ResourceKey].translation;
    }
  } catch (error) {
    throw error;
  }
});

export default i18n;

export const trans = (
  nameLang?: Record<string, string>,
  defaultName?: string,
) => {
  let val = nameLang ? nameLang[SessionLang.value] : defaultName;

  return val === undefined || val === null || val.trim() === ""
    ? defaultName
    : val;
};
export const t = (key: string) => {
  return SessionTrans[key] || key;
};

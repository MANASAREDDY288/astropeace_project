import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { LANG } from "../services/app.storage";
import AppStorage from "../services/app.storage";

import TypeIcon from "@/types/type.icon";
import TypeDropDown from "@/types/type.dropdown";
import { languages } from "@/i18n";

type Language = (typeof languages)[number];

export const AppLang = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);

  useEffect(() => {
    callLanguage(AppStorage.getData(LANG) || "en-US");
  }, []);

  const languageOptions = languages.map((lang) => ({
    label: (
      <div className="flex items-center gap-2">
        <TypeIcon name={"Languages"} size={16} />
        <span className="text-sm">{lang.locale}</span>
      </div>
    ),
    value: lang.code,
  }));

  const handleLanguageChange = (value: string) => {
    callLanguage(value);
    // i18n.changeLanguage(value);
  };

  const callLanguage = (value: string) => {
    const foundLang =
      languages.find((lang) => lang.code === value) || languages[0];

    i18n.changeLanguage(value);
    setCurrentLang(foundLang);
    document.documentElement.dir = foundLang.dir;
    document.documentElement.lang = value;
  };

  return (
    <div className="flex items-center gap-2">
      <TypeDropDown
        className="min-w-[150px] flex items-center gap-2"
        items={languageOptions}
        placeholder={
          <div className="flex items-center gap-2">
            <TypeIcon name={"Languages"} size={16} />
            <span className="text-sm">{currentLang.locale}</span>
          </div>
        }
        onSelect={handleLanguageChange}
      />
    </div>
  );
};

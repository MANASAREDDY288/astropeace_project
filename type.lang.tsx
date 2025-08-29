import { useState } from "react";
import { Controller } from "react-hook-form";
import { Input, Textarea } from "@heroui/react";
import { useSignals } from "@preact/signals-react/runtime";
import { LangText } from "dff-util";

import TypeIcon from "./type.icon";

import {
  SupportedLanguagesType,
  TranslationType,
} from "@/utils/services/app.types";
import { SessionLang } from "@/utils/services/app.event";
import { languages, t } from "@/i18n";

export type LangTypeProps = "text" | "textarea" | "time";

type TypeLangProps = {
  control: any;
  name: string;
  label?: string;
  rules?: any;
  error?: any;
  className?: string;
  disabled?: boolean;
  radius?: "full" | "none" | "sm" | "md" | "lg";
  type?: LangTypeProps;
  onChange?: (value: TranslationType) => void;
};

export const TypeLang = ({
  control,
  name,
  label,
  rules = {},
  error,
  className = "flex flex-col w-full",
  disabled = false,
  radius = "full",
  type = "text",
  onChange,
}: TypeLangProps) => {
  useSignals(); // Reactivity with SessionLang

  const [langValues, setLangValues] = useState<TranslationType>({} as any);
  const [translatingLang, setTranslatingLang] =
    useState<SupportedLanguagesType | null>(null);

  const currentLang = SessionLang.value;

  const supportedLanguages: SupportedLanguagesType[] = languages.map(
    (lang) => lang.code as SupportedLanguagesType,
  );

  const getLanguageName = (code: SupportedLanguagesType) =>
    languages.find((lang) => lang.code === code)?.locale || code;

  const otherLanguages = supportedLanguages.filter(
    (lang) => lang !== currentLang,
  );

  const getLangValue = (lang: SupportedLanguagesType) =>
    control?._formValues?.[name]?.[lang] ?? langValues?.[lang] ?? "";

  const handleTranslate = async (
    targetLang: SupportedLanguagesType,
    currentValue: string,
    updateField: (value: string) => void,
  ) => {
    if (!currentValue.trim()) return;

    setTranslatingLang(targetLang);
    try {
      const translatedText = await LangText(
        currentValue,
        currentLang,
        targetLang,
      );

      setLangValues((prev) => ({
        ...prev,
        [targetLang]: translatedText,
      }));

      updateField(translatedText);
      onChange?.({
        ...langValues,
        [targetLang]: translatedText,
      });
    } finally {
      setTranslatingLang(null);
    }
  };

  return (
    <section className={className}>
      {label && (
        <label className="text-sm font-medium p-2">
          {label} {rules.required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        style={{
          height: type === "textarea" ? 500 : 250,
          overflow: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        {/* Current Language Input */}
        <div className="mb-4">
          <div className="flex items-center gap-2 p-2">
            <span className="text-xs">
              {getLanguageName(currentLang as SupportedLanguagesType)}
            </span>
          </div>
          <Controller
            key={`${name}-${currentLang}`}
            control={control}
            name={`${name}.${currentLang}`}
            render={({ field }) =>
              type === "textarea" ? (
                <Textarea
                  {...field}
                  className="w-full"
                  disabled={disabled}
                  radius={radius}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    field.onChange(newValue);
                    setLangValues((prev) => ({
                      ...prev,
                      [currentLang]: newValue,
                    }));
                    onChange?.({
                      ...langValues,
                      [currentLang]: newValue,
                    });
                  }}
                />
              ) : (
                <Input
                  {...field}
                  className="w-full"
                  disabled={disabled}
                  radius={radius}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    field.onChange(newValue);
                    setLangValues((prev) => ({
                      ...prev,
                      [currentLang]: newValue,
                    }));
                    onChange?.({
                      ...langValues,
                      [currentLang]: newValue,
                    });
                  }}
                />
              )
            }
            rules={{
              ...(rules.required
                ? {
                    validate: () => {
                      const values = control?._formValues?.[name] || {};
                      const filled = Object.values(values).some(
                        (val) => typeof val === "string" && val.trim() !== "",
                      );

                      return (
                        filled ||
                        t(rules?.message || "At least one language is required")
                      );
                    },
                  }
                : {}),
            }}
          />
        </div>

        {/* Other Languages */}
        {otherLanguages.map((lang) => (
          <div key={lang} className="mb-4">
            <Controller
              control={control}
              name={`${name}.${lang}`}
              render={({ field }) => (
                <>
                  <span className="flex flex-row gap-2 text-xs p-2">
                    {getLanguageName(lang)}
                    <TypeIcon
                      name="Languages"
                      size={16}
                      onClick={() =>
                        handleTranslate(
                          lang,
                          getLangValue(currentLang as SupportedLanguagesType),
                          field.onChange,
                        )
                      }
                    />
                    {translatingLang === lang && (
                      <span className="text-xs text-blue-500">
                        Translating...
                      </span>
                    )}
                  </span>
                  {type === "textarea" ? (
                    <Textarea
                      {...field}
                      className="w-full"
                      disabled={disabled || translatingLang === lang}
                      radius={radius}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const newValue = e.target.value;

                        field.onChange(newValue);
                        setLangValues((prev) => ({
                          ...prev,
                          [lang]: newValue,
                        }));
                        onChange?.({
                          ...langValues,
                          [lang]: newValue,
                        });
                      }}
                    />
                  ) : (
                    <Input
                      {...field}
                      className="w-full"
                      disabled={disabled || translatingLang === lang}
                      radius={radius}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const newValue = e.target.value;

                        field.onChange(newValue);
                        setLangValues((prev) => ({
                          ...prev,
                          [lang]: newValue,
                        }));
                        onChange?.({
                          ...langValues,
                          [lang]: newValue,
                        });
                      }}
                    />
                  )}
                </>
              )}
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {typeof error?.message === "string"
            ? t(error.message)
            : t("Required")}
        </p>
      )}
    </section>
  );
};

export default TypeLang;

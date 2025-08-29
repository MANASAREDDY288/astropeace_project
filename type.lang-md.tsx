import { useState } from "react";
import { Controller, useFormState } from "react-hook-form";
import { useSignals } from "@preact/signals-react/runtime";
import MDEditor from "@uiw/react-md-editor";
import { LangText } from "dff-util";

import { SessionLang } from "@/utils/services/app.event";
import {
  SupportedLanguagesType,
  TranslationType,
} from "@/utils/services/app.types";
import { languages, t } from "@/i18n";
import TypeIcon from "@/types/type.icon";

type TypeMarkdownLangProps = {
  control: any;
  name: string;
  label?: string;
  rules?: any;
  className?: string;
  disabled?: boolean;
  height?: number;
  onChange?: (value: TranslationType) => void;
};

export const TypeLangMd = ({
  control,
  name,
  label,
  rules = {},
  className = "flex flex-col w-full",
  disabled = false,
  height = 250,
  onChange,
}: TypeMarkdownLangProps) => {
  useSignals();

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

  // Get only final error to show once at bottom
  const { errors } = useFormState({ control });
  const fieldError = (errors as any)?.[name]?.[currentLang]?.message;

  return (
    <section className={className}>
      {label && (
        <label className="text-sm font-medium p-2">
          {label} {rules?.required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        {/* Current Language */}
        <div className="mb-4">
          <div className="flex items-center gap-2 p-2 text-xs">
            {getLanguageName(currentLang as SupportedLanguagesType)}
          </div>
          <Controller
            key={`${name}-${currentLang}`}
            control={control}
            name={`${name}.${currentLang}`}
            render={({ field }) => (
              <MDEditor
                height={height}
                preview="edit"
                textareaProps={{ disabled }}
                value={field.value ?? ""}
                visibleDragbar={false}
                onChange={(val = "") => {
                  field.onChange(val);
                  setLangValues((prev) => ({
                    ...prev,
                    [currentLang]: val,
                  }));
                  onChange?.({
                    ...langValues,
                    [currentLang]: val,
                  });
                }}
              />
            )}
            rules={{
              ...(rules.required && {
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
              }),
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
                  <div className="flex gap-2 text-xs p-2 items-center">
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
                  </div>
                  <MDEditor
                    height={height}
                    preview="edit"
                    textareaProps={{
                      disabled: disabled || translatingLang === lang,
                    }}
                    value={field.value ?? ""}
                    visibleDragbar={false}
                    onChange={(val = "") => {
                      field.onChange(val);
                      setLangValues((prev) => ({
                        ...prev,
                        [lang]: val,
                      }));
                      onChange?.({
                        ...langValues,
                        [lang]: val,
                      });
                    }}
                  />
                </>
              )}
            />
          </div>
        ))}
      </div>
      <p className="text-red-500 text-sm mt-2">{fieldError && t("Required")}</p>
    </section>
  );
};

export default TypeLangMd;

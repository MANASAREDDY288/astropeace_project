export type RolesType = "USER" | "PRACTITIONER" | "ADMIN";

export type CurrencyCodeType = "INR" | "USD" | "JPY";

export type ScreenAccessType = {
  name: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
};

export type LanguageType = {
  lang: string;
  name: string;
  dir: "ltr" | "rtl";
  locale: string;
};
export type AllLanguageCodesType =
  | "en-US"
  | "kn-IN"
  | "ta-IN"
  | "hi-IN"
  | "te-IN"
  | "ml-IN";

export type SupportedLanguagesType = Extract<
  AllLanguageCodesType,
  "en-US" | "te-IN" | "kn-IN" | "ta-IN" | "hi-IN" | "ml-IN"
>;

export type TranslationType = Record<SupportedLanguagesType, string>;

export interface SearchType {
  query: string | number;
}

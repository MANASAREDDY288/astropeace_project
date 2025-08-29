import { signal } from "@preact/signals-react";

import { langDirection } from "../../i18n";

import AppStorage, {
  SESSION_INFO,
  TOKEN,
  GOOGLE_ACCESS_TOKEN,
  LANG,
  DIR,
  THEME,
} from "./app.storage";
import { AppRouter } from "./app.router";
import { ScreenAccessType } from "./app.types";
import { screenAccessInit } from "./app.util";
export const ScreenAccess = signal<ScreenAccessType>({} as ScreenAccessType);
screenAccessInit();

export const SessionToken = signal(AppStorage.getData(TOKEN) || null);
export const SessionLang = signal<string>(AppStorage.getData(LANG) || "en-US");
export const ThemeMode = signal(AppStorage.getData(THEME) || "light");

export const RtlDir = signal<boolean>(
  langDirection(AppStorage.getData(DIR) || "en-US") !== "ltr",
);

type RouterType = {
  pathname: string;
  query?: Record<string, string>;
};

/**
 *  routerEffect
 */
export const RouterEvent = signal({} as RouterType);
export const RouterChange = (
  pathname: string,
  query?: Record<string, string>,
) => {
  RouterEvent.value = { pathname, query };
  if (pathname == AppRouter.LOGIN) {
    AppStorage.removeData(TOKEN);
    AppStorage.removeData(SESSION_INFO);
    AppStorage.removeData(GOOGLE_ACCESS_TOKEN, true);
    CheckSession();
  }
};

type ToastType = {
  show: boolean;
  message: string;
  type:
    | "success"
    | "default"
    | "foreground"
    | "primary"
    | "secondary"
    | "warning"
    | "danger";
};

export const ToastMessage = signal({
  show: false,
  message: "",
  type: "success",
  title: "success",
  placement: "top-center",
  variant: "flat",
  duration: 5000,
} as ToastType);

export const ShowToast = (
  message: string,
  type:
    | "success"
    | "default"
    | "foreground"
    | "primary"
    | "secondary"
    | "warning"
    | "danger" = "warning",
) => {
  ToastMessage.value = {
    show: true,
    message,
    type,
  };
};

export const CheckSession = () => {
  SessionToken.value = AppStorage.getData(TOKEN) || null;
};

export const ProgressBar = signal<boolean>(false);

export const ShowProgress = (show: boolean) => {
  ProgressBar.value = show;
};

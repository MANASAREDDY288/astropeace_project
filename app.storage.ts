const APP_ID = "AS";

export const TOKEN = "TOKEN";
export const SESSION_INFO = "SESSION_INFO";
export const SCREEN_ACCESS = "SCREEN_ACCESS";
export const GOOGLE_ACCESS_TOKEN = "GOOGLE_ACCESS_TOKEN";
export const NAV = "NAV";
export const REMEMBER_ME = "remember-me";
export const TRANS = "TRANS";
export const DIR = "DIR";
export const LANG = "LANG";
export const THEME = "THEME";

const setData = (setName: string, setObject: any, isLocal = false) => {
  setName = APP_ID + "-" + setName;
  if (setObject) {
    setObject =
      typeof setObject === "string" ? setObject : JSON.stringify(setObject);
  }
  if (isLocal) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(setName, setObject);
    }
  } else {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(setName, setObject);
    }
  }
};

const getData = (getName: string, isLocal = false) => {
  getName = APP_ID + "-" + getName;
  let data = null;

  if (isLocal) {
    if (typeof window !== "undefined") {
      data = window.localStorage.getItem(getName);
    }
  } else {
    if (typeof window !== "undefined") {
      data = window.sessionStorage.getItem(getName);
    }
  }
  if (data) {
    data =
      data.indexOf("{") > -1 || data.indexOf("[") > -1
        ? JSON.parse(data)
        : data;
  }

  return data;
};

const removeData = (key: string, isLocal = false) => {
  key = APP_ID + "-" + key;
  if (isLocal) {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  } else {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(key);
    }
  }
};

const clearData = () => {
  const user = getData(REMEMBER_ME, true);

  if (typeof window !== "undefined") {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
  if (user != null) {
    setData(REMEMBER_ME, user, true);
  }

  return;
};

const AppStorage = {
  getData,
  setData,
  removeData,
  clearData,
};

export default AppStorage;

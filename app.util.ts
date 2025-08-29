import { ScreenAccess } from "./app.event";
import AppStorage, { SCREEN_ACCESS, TOKEN } from "./app.storage";
import { ScreenAccessType } from "./app.types";

import { SiteConfig } from "@/config/site-config";

// for getting Date in format of '12 Jun 2003 11:45 AM'
export const formatDateTime = (
  timestamp: Date,
  showDate: boolean = true,
  showTime?: boolean,
): string => {
  const newDate = new Date(timestamp);
  const months = monthNames();
  const day = String(newDate.getDate()).padStart(2, "0");
  const month = months[newDate.getMonth()];
  const year = newDate.getFullYear();
  let hours = newDate.getHours();
  const minutes = String(newDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  const date = showDate ? `${day} ${month} ${year}` : "";
  const time = showTime ? `${hours}:${minutes} ${ampm}` : "";

  return `${date} ${time}`;
};

export const convertTo24HourFormat = (time: string) => {
  const [timeStr, modifier] = time.split(" ");
  let [hours, minutes] = timeStr.split(":").map(Number);

  if (modifier === "AM") {
    if (hours === 12) hours = 0;
  } else if (modifier === "PM") {
    if (hours !== 12) hours += 12;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
};

export const combineDateAndTime = (
  dateString: string,
  timeString: string,
): Date | null => {
  if (!dateString) return null;
  const validTimeString = timeString || "00:00:00";
  const combined = new Date(`${dateString}T${validTimeString}Z`);

  return isNaN(combined.getTime()) ? null : combined;
};

export const timeAgo = (date: Date): string => {
  const now = new Date().getTime();
  const diff = now - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 1) return `${days} days ago`;
  if (days === 1) return "1 day ago";
  if (hours > 1) return `${hours} hours ago`;
  if (hours === 1) return "1 hour ago";
  if (minutes > 1) return `${minutes} minutes ago`;
  if (minutes === 1) return "1 minute ago";

  return "Just now";
};

export const monthNames = (): string[] => [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const capitalizeFirstLetter = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const truncateString = (input: string, maxLength: number): string => {
  if (input?.length > maxLength) {
    return input.substring(0, maxLength) + "...";
  }

  return input;
};

export const debounce = (
  func: (...args: any[]) => void,
  wait: number,
): ((...args: any[]) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
export const checkLoginUser = () => {
  const decoded = AppStorage.getData(TOKEN, true);

  // const current_time = new Date().getTime() / 1000;
  // || current_time > decoded.exp
  if (!decoded) {
    return false;
  } else {
    return true;
  }
};

let accessList: Record<string, ScreenAccessType> = {};

export const screenAccessInit = () => {
  accessList = {};

  SiteConfig.forEach((item) => {
    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        if (child.href) {
          accessList[child.href] = {
            name: child.name,
            read: child.permissions?.read ?? false,
            create: child.permissions?.create ?? false,
            update: child.permissions?.update ?? false,
            delete: child.permissions?.delete ?? false,
          };
        }
      });
    } else if (item.href) {
      accessList[item.href] = {
        name: item.name,
        read: item.permissions?.read ?? false,
        create: item.permissions?.create ?? false,
        update: item.permissions?.update ?? false,
        delete: item.permissions?.delete ?? false,
      };
    }
  });

  screenAccessCall(window.location.pathname);
};

export const screenAccessCall = (key: string) => {
  const access = accessList[key] || {
    name: "none",
    read: false,
    create: false,
    update: false,
    delete: false,
  };

  ScreenAccess.value = access;
  AppStorage.setData(SCREEN_ACCESS, ScreenAccess.value);
};

import { useEffect, useState } from "react";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import React from "react";
import { effect, signal } from "@preact/signals";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSignals } from "@preact/signals-react/runtime";
import { Divider } from "@heroui/react";

import { trans } from "@/i18n";
import { ThemeMode, RouterChange } from "@/utils/services/app.event";
import { AppRouter } from "@/utils/services/app.router";
import TypeButton from "@/types/type.button";
import TypeIcon, { IconName } from "@/types/type.icon";
import { SiteConfig } from "@/config/site-config";
import { SkeletonMenu } from "@/skeleton/skeleton-menu";

type Theme = "light" | "dark";

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type RoleMenuAccessType = {
  id?: string;
  menuId?: string;
  name: string; // Default name (English)
  nameLang: Record<string, string>;
  href?: string;
  icon?: IconName;
  permissions?: {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  children?: RoleMenuAccessType[];
  priority?: number;
  type?: string;
  active?: boolean;
};

export const menuAccessIsLoading = signal<boolean>(false);
export const menuAccessData = signal<RoleMenuAccessType[]>([]);
export const menuAccessCall = async () => {
  try {
    menuAccessIsLoading.value = true;
    // const url = AppHttp.MsUrl.main + "/";
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const resp = await Promise.resolve(SiteConfig);

    menuAccessData.value = resp;
  } finally {
    menuAccessIsLoading.value = false;
  }
};

export const Sidebar = ({
  isOpen = false,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => {
  useSignals();
  const [theme, setTheme] = React.useState<Theme>("dark");
  const [toggled, setToggled] = useState(isOpen);
  const location = useLocation();

  useEffect(() => {
    setToggled(isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    setToggled(!toggled);
    onToggle();
  };

  useEffect(() => {
    effect(() => setTheme(ThemeMode.value === "light" ? "light" : "dark"));
    menuAccessCall();
  }, []);

  function handleMenu(href: string | undefined): void {
    handleToggle();
    if (!href) return;
    RouterChange(href, {});
  }

  // Define menu item styles based on the current theme
  const menuItemStyles = {
    // Styles for the button element within MenuItem/SubMenu
    button: ({
      active,
      disabled,
    }: {
      level: number;
      active: boolean;
      disabled: boolean;
    }) => {
      // Determine base background color for the item based on theme
      const baseBackgroundColor = themes[theme].menu.menuContent; // Use menuContent for item background

      return {
        color: disabled
          ? themes[theme].menu.disabled.color
          : themes[theme].menu.color,
        // Apply hover background, active background, or base background
        backgroundColor: active
          ? themes[theme].menu.hover.backgroundColor
          : baseBackgroundColor,
        "&:hover": {
          backgroundColor: themes[theme].menu.hover.backgroundColor,
          color: themes[theme].menu.hover.color,
        },
      };
    },
    // Styles for the expanded submenu content area - This should also use the menuContent background
    subMenuContent: {
      // Wrap the style properties in an object
      backgroundColor: themes[theme].menu.menuContent,
    },
    // Styles for the icon - Using a function here allows dynamic color based on item state if needed
    icon: ({ disabled }: { active: boolean; disabled: boolean }) => ({
      color: disabled
        ? themes[theme].menu.disabled.color
        : themes[theme].menu.icon, // Use disabled color if needed
    }),
    // Styles for the label
    // label: ({ open }: { open: boolean }) => ({}),
    // Styles for prefix and suffix can also be added here if needed
    // prefix: () => ({}),
    // suffix: () => ({}),
  };

  return (
    <ProSidebar
      backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 0.5)}
      breakPoint="xl"
      className="h-[calc(100vh-88px)] overflow-y-auto"
      rootStyles={{
        color: themes[theme].sidebar.color,
        backgroundColor: themes[theme].sidebar.backgroundColor,
        border: "0px solid #99a1af",
        borderRadius: "0 rem",
      }}
      toggled={isOpen}
      onBackdropClick={handleToggle}
    >
      <SidebarHeader />
      <Menu
        menuItemStyles={menuItemStyles} // Apply the defined styles
      >
        {menuAccessIsLoading.value && <SkeletonMenu />}
        {menuAccessData.value.map((item, index) => {
          // Check if the current user has read permission for this top-level item
          const canReadParent = item.permissions?.read ?? true; // Default to true if permissions are not defined

          // If the parent item cannot be read, don't render it or its children
          if (!canReadParent) {
            return null;
          }

          // Determine if a top-level item or any of its children are active
          const isParentActive = item.children
            ? item.children.some(
                (child) =>
                  location.pathname === child.href &&
                  (child.permissions?.read ?? true),
              ) || // Check child active only if readable
              location.pathname === item.href
            : location.pathname === item.href;

          // Render SubMenu for items with children, otherwise MenuItem
          return item.children ? (
            <section key={`${item.name}-${index}`}>
              <SubMenu
                key={`${item.name}-${index}`}
                active={isParentActive} // Mark the submenu as active if parent or child is active
                defaultOpen={isParentActive} // Optionally open the submenu if a child is active
                icon={
                  item.icon ? (
                    <TypeIcon color="#1890ff" name={item.icon} />
                  ) : undefined
                } // Pass icon to SubMenu
                label={trans(item.nameLang, item.name)}
              >
                {item.children.map((child, childIndex) => {
                  // Check if the current user has read permission for this child item
                  const canReadChild = child.permissions?.read ?? true; // Default to true if permissions are not defined

                  // If the child item cannot be read, don't render it
                  if (!canReadChild) {
                    return null;
                  }

                  return (
                    <section key={`${child.name}-${childIndex}`}>
                      <MenuItem
                        key={`${child.name}-${childIndex}`}
                        active={location.pathname === child.href} // Mark child as active if its href matches current path
                        icon={
                          child.icon ? (
                            <TypeIcon color="#1890ff" name={child.icon} />
                          ) : undefined
                        } // Pass icon to child MenuItem
                        onClick={() => handleMenu(child.href)}
                      >
                        {trans(child.nameLang, child.name)}
                      </MenuItem>
                    </section>
                  );
                })}
              </SubMenu>
              <Divider />
            </section>
          ) : (
            <section key={`${item.name}-${index}`}>
              <Divider />
              <MenuItem
                key={`${item.name}-${index}`}
                active={location.pathname === item.href} // Mark item as active if its href matches current path
                icon={
                  item.icon ? (
                    <TypeIcon color="#1890ff" name={item.icon} />
                  ) : undefined
                } // Pass icon to MenuItem
                onClick={() => handleMenu(item.href)}
              >
                {trans(item.nameLang, item.name)}
              </MenuItem>
            </section>
          );
        })}
      </Menu>
    </ProSidebar>
  );
};

function SidebarHeader() {
  const { t } = useTranslation();

  return (
    <aside className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
      <div className="sticky top-0 flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">{t("welcome")}</h2>
        <div className="-m-6">
          <TypeButton
            action="default"
            label=""
            name="LogOut"
            variant="light"
            onPress={() => RouterChange(AppRouter.LOGIN)}
          />
        </div>
      </div>
    </aside>
  );
}

const themes = {
  light: {
    sidebar: {
      backgroundColor: "#F8FAFC",
      color: "#607489",
    },
    menu: {
      fontSize: "small",
      menuContent: "#fbfcfd",
      color: "#607489",
      icon: "#0098e5",
      hover: {
        backgroundColor: "#c5e4ff",
        color: "#44596e",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: "#000000",
      color: "#8ba1b7",
    },
    menu: {
      fontSize: "small",
      menuContent: "#000000",
      color: "#8ba1b7",
      icon: "#59d0ff",
      hover: {
        backgroundColor: "#00458b",
        color: "#b6c8d9",
      },
      disabled: {
        color: "#3e5e7e",
      },
    },
  },
};

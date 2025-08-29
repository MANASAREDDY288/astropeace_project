import { useSignals } from "@preact/signals-react/runtime";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { columnDefs, getDataSource, gridOptions } from "./common/grid";
import {
  editModeUpdate,
  OnUpdateSelectedPooja,
  poojaIsEditMode,
  poojaIsPopupOpen,
  poojaListIsLoading,
  poojaSelectedId,
  poojaStatusCall,
} from "./common/service";
import { PoojaType } from "./common/types";

import { ArticleLayout } from "@/layouts/article-layout";
import { FloatLayout } from "@/layouts/float-layout";
import { GridLayout } from "@/layouts/grid-layout";
import { darkGridTheme, lightGridTheme } from "@/styles/ag.theme";
import TypeButton from "@/types/type.button";
import TypeSearch from "@/types/type.search";
import TypeSwitch from "@/types/type.switch";
import { ScreenAccess, ThemeMode } from "@/utils/services/app.event";

export function PoojaList() {
  useSignals();
  const { t } = useTranslation();
  const gridRef = useRef<AgGridReact>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("true");
  const lastProcessedStatusRef = useRef("true");
  const isProcessingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { control, watch } = useForm({
    defaultValues: {
      poojaStatus: activeStatus === "true",
    },
  });

  // Handle status change
  const handleStatusChange = useCallback((newStatus: string) => {
    isProcessingRef.current = true;
    setIsLoading(true);
    setActiveStatus(newStatus);
    lastProcessedStatusRef.current = newStatus;
    setIsLoading(false);
    isProcessingRef.current = false;
  }, []);

  // Watch poojaStatus changes
  const poojaStatus = watch("poojaStatus");

  useEffect(() => {
    const newStatus = poojaStatus ? "true" : "false";

    if (
      newStatus !== lastProcessedStatusRef.current &&
      !isProcessingRef.current
    ) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        handleStatusChange(newStatus);
      }, 500);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [poojaStatus, handleStatusChange]);

  const handleAction = useCallback(
    async (data: any, action: "edit" | "status") => {
      if (action === "edit") {
        OnUpdateSelectedPooja(data);
        poojaSelectedId.value = data;
        poojaIsEditMode.value = false;
        poojaIsPopupOpen.value = true;
      } else if (action === "status") {
        const resp = await poojaStatusCall({
          id: data.id,
          active: data.active,
        });

        if (resp && gridRef.current && gridRef.current.api) {
          gridRef.current.api.purgeInfiniteCache();
        }
      }
    },
    [],
  );

  const memoizedColumnDefs = useMemo(
    () => columnDefs(t, handleAction),
    [t, handleAction],
  );

  const dataSource = useMemo(() => {
    return getDataSource(searchTerm, activeStatus);
  }, [searchTerm, activeStatus]);

  const gridTheme = useMemo(
    () => (ThemeMode.value === "dark" ? darkGridTheme : lightGridTheme),
    [ThemeMode.value],
  );

  useEffect(() => {
    editModeUpdate(undefined, "edit");
  }, []);

  const handleReload = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.purgeInfiniteCache();
    }
  }, []);

  const onAdd = () => {
    OnUpdateSelectedPooja({} as PoojaType);
    editModeUpdate(undefined, "add");
    handleReload();
  };

  const searchProps = useMemo(
    () => ({
      className: "w-48",
      label: t("search"),
      value: searchTerm,
      variant: "underlined" as const,
      onChange: (value: string) => setSearchTerm(value),
    }),
    [t, searchTerm],
  );

  const addButtonProps = useMemo(
    () => ({
      action: "success" as const,
      disabled: !ScreenAccess.value.create,
      label: t("add"),
      name: "Plus" as const,
      onPress: onAdd,
    }),
    [t, onAdd, ScreenAccess.value.create],
  );

  const reloadButtonProps = useMemo(
    () => ({
      action: "primary" as const,
      label: "",
      name: "RotateCcw" as const,
      onPress: handleReload,
    }),
    [handleReload],
  );

  const poojaStatusProps = useMemo(
    () => ({
      className: "w-[25%] flex justify-center gap-2",
      control,
      name: "poojaStatus",
      disabled: isLoading || poojaListIsLoading.value,
    }),
    [control, t, isLoading],
  );

  return (
    <>
      <ArticleLayout>
        <aside className="flex justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold">{t("Poojas")}</h2>
          </div>
          <div className="flex gap-2 items-center">
            <TypeSearch {...searchProps} />
            <TypeSwitch {...poojaStatusProps} />
            <TypeButton {...addButtonProps} />
          </div>
        </aside>
      </ArticleLayout>
      <GridLayout>
        <AgGridReact
          ref={gridRef}
          columnDefs={memoizedColumnDefs}
          datasource={dataSource}
          gridOptions={gridOptions}
          theme={gridTheme}
        />
      </GridLayout>
      <FloatLayout>
        <TypeButton {...reloadButtonProps} />
      </FloatLayout>
    </>
  );
}

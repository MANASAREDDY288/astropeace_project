import { useTranslation } from "react-i18next";
import { AgGridReact } from "ag-grid-react";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { useForm } from "react-hook-form";

import { columnDefs, getDataSource, gridOptions } from "./common/grid";
import {
  editModeUpdate,
  mantraIsPopupOpen,
  mantraSelectedId,
  mantraIsEditMode,
  OnUpdateSelectedMantra,
  mantraListIsLoading,
  shouldReloadGrid,
} from "./common/service";
import { MantraType } from "./common/types";

import { ArticleLayout } from "@/layouts/article-layout";
import { FloatLayout } from "@/layouts/float-layout";
import TypeButton from "@/types/type.button";
import { ScreenAccess, ThemeMode } from "@/utils/services/app.event";
import TypeSearch from "@/types/type.search";
import { darkGridTheme, lightGridTheme } from "@/styles/ag.theme";
import { GridLayout } from "@/layouts/grid-layout";
import TypeSwitch from "@/types/type.switch";

export function MantraList() {
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
      mantraStatus: activeStatus === "true",
    },
  });

  const handleStatusChange = useCallback((newStatus: string) => {
    isProcessingRef.current = true;
    setIsLoading(true);
    setActiveStatus(newStatus);
    lastProcessedStatusRef.current = newStatus;
    setIsLoading(false);
    isProcessingRef.current = false;
  }, []);

  const mantraStatus = watch("mantraStatus");

  useEffect(() => {
    const newStatus = mantraStatus ? "true" : "false";

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
  }, [mantraStatus, handleStatusChange]);

  const handleAction = useMemo(
    () => (data: any, action: "edit" | "status") => {
      if (action === "edit") {
        OnUpdateSelectedMantra(data);
        mantraSelectedId.value = data;
        mantraIsEditMode.value = false;
        mantraIsPopupOpen.value = true;
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

  useEffect(() => {
    const stop = shouldReloadGrid.subscribe(() => {
      handleReload();
    });

    return () => stop();
  }, []);

  const handleReload = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.purgeInfiniteCache();
    }
  }, []);

  const onAdd = () => {
    OnUpdateSelectedMantra({} as MantraType);
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
    [t, onAdd],
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

  const mantraStatusProps = useMemo(
    () => ({
      className: "w-[25%] flex justify-center gap-2",
      control,
      name: "mantraStatus",
      disabled: isLoading || mantraListIsLoading.value,
    }),
    [control, t, isLoading],
  );

  return (
    <>
      <ArticleLayout>
        <aside className="flex justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold">{t("mantras")}</h2>
          </div>
          <div className="flex gap-2">
            <TypeSearch {...searchProps} />
            <TypeSwitch {...mantraStatusProps} />
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

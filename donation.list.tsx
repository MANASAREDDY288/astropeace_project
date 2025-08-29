import { useTranslation } from "react-i18next";
import { AgGridReact } from "ag-grid-react";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { useForm } from "react-hook-form";

import { columnDefs, getDataSource, gridOptions } from "./common/grid";
import {
  editModeUpdate,
  donationIsPopupOpen,
  donationSelectedId,
  donationIsEditMode,
  OnUpdateSelectedDonation,
  DonationStatus,
  donationListIsLoading,
} from "./common/service";
import { DonationType } from "./common/types";

import { ArticleLayout } from "@/layouts/article-layout";
import { FloatLayout } from "@/layouts/float-layout";
import TypeButton from "@/types/type.button";
import { ScreenAccess, ThemeMode } from "@/utils/services/app.event";
import TypeSearch from "@/types/type.search";
import { darkGridTheme, lightGridTheme } from "@/styles/ag.theme";
import { GridLayout } from "@/layouts/grid-layout";
import TypeSwitch from "@/types/type.switch";

export function DonationList() {
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
      donationStatus: activeStatus === "true",
    },
  });

  // Handle status change
  const handleStatusChange = useCallback(
    (newStatus: string) => {
      if (isProcessingRef.current) {
        return;
      }
      isProcessingRef.current = true;
      setIsLoading(true);
      setActiveStatus(newStatus);
      lastProcessedStatusRef.current = newStatus;
      DonationStatus.value = newStatus;
      setIsLoading(false);
      isProcessingRef.current = false;
    },
    [gridRef],
  );

  // Watch donationStatus changes
  const donationStatus = watch("donationStatus");

  useEffect(() => {
    const newStatus = donationStatus ? "true" : "false";

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
  }, [donationStatus, handleStatusChange]);

  const handleAction = useCallback(
    async (data: any, action: "edit" | "status") => {
      if (action === "edit") {
        OnUpdateSelectedDonation(data);
        donationSelectedId.value = data.id;
        donationIsEditMode.value = false;
        donationIsPopupOpen.value = true;
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
    OnUpdateSelectedDonation({} as DonationType);
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
    [t],
  );

  const reloadButtonProps = useMemo(
    () => ({
      action: "primary" as const,
      label: "",
      name: "RotateCcw" as const,
      onPress: handleReload,
    }),
    [],
  );

  const donationStatusProps = useMemo(
    () => ({
      className: "w-[25%] flex justify-center gap-2",
      control,
      name: "donationStatus",
      disabled: isLoading || donationListIsLoading.value,
    }),
    [control, t, isLoading],
  );

  return (
    <>
      <ArticleLayout>
        <aside className="flex justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold">{t("Donations")}</h2>
          </div>
          <div className="flex gap-2 items-center">
            <TypeSearch {...searchProps} />
            <TypeSwitch {...donationStatusProps} />
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

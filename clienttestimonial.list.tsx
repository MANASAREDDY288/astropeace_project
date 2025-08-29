import { useTranslation } from "react-i18next";
import { AgGridReact } from "ag-grid-react";
import { useRef, useState, useMemo, useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";

import { columnDefs, getDataSource, gridOptions } from "./common/grid";
import {
  editModeUpdate,
  clienttestimonialIsPopupOpen,
  clienttestimonialSelectedId,
  clienttestimonialIsEditMode,
  clienttestimonialStatusCall,
  OnUpdateSelectedClienttestimonial,
  shouldReloadGrid,
} from "./common/service";
import { ClienttestimonialType } from "./common/types";

import { ArticleLayout } from "@/layouts/article-layout";
import { FloatLayout } from "@/layouts/float-layout";
import TypeButton from "@/types/type.button";
import { ScreenAccess, ThemeMode } from "@/utils/services/app.event";
import TypeSearch from "@/types/type.search";
import { darkGridTheme, lightGridTheme } from "@/styles/ag.theme";
import { GridLayout } from "@/layouts/grid-layout";

export function ClienttestimonialList() {
  useSignals();
  const { t } = useTranslation();
  const gridRef = useRef<AgGridReact>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dataSource = useMemo(() => getDataSource(searchTerm), [searchTerm]);

  // Refresh grid when search term changes

  useEffect(() => {
    editModeUpdate(undefined, "edit");
  }, []);

  useEffect(() => {
    const stop = shouldReloadGrid.subscribe(() => {
      handleReload();
    });

    return () => stop();
  }, []);

  const handleAction = async (data: any, action: "edit" | "status") => {
    if (action === "edit") {
      OnUpdateSelectedClienttestimonial(data);
      clienttestimonialSelectedId.value = data.id;
      clienttestimonialIsEditMode.value = false;
      clienttestimonialIsPopupOpen.value = true;
    } else if (action === "status") {
      const resp = await clienttestimonialStatusCall({
        id: data.id,
        active: data.active,
      });

      if (resp) {
        handleReload();
      }
    }
  };

  const handleReload = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.purgeInfiniteCache();
      gridRef.current.api.refreshInfiniteCache();
    }
  };

  const onAdd = () => {
    OnUpdateSelectedClienttestimonial({} as ClienttestimonialType);
    editModeUpdate(undefined, "add");
  };

  return (
    <>
      <ArticleLayout>
        <aside className="flex justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold">{t("Client Testimonials")}</h2>
          </div>
          <div className="flex gap-2">
            <TypeSearch
              className="w-48"
              label={t("search")}
              value={searchTerm}
              variant="underlined"
              onChange={(value) => setSearchTerm(value)}
            />
            <TypeButton
              action="success"
              disabled={!ScreenAccess.value.create}
              label={t("add")}
              name="Plus"
              onPress={onAdd}
            />
          </div>
        </aside>
      </ArticleLayout>
      <GridLayout>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs(t, handleAction)}
          datasource={dataSource}
          gridOptions={gridOptions}
          theme={ThemeMode.value === "dark" ? darkGridTheme : lightGridTheme}
        />
      </GridLayout>
      <FloatLayout>
        <div className="float-left-align">
          <TypeButton
            action="primary"
            label=""
            name="RotateCcw"
            onPress={handleReload}
          />
        </div>
      </FloatLayout>
    </>
  );
}

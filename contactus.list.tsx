import { useTranslation } from "react-i18next";
import { AgGridReact } from "ag-grid-react";
import { useRef, useState, useMemo, useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";

import { columnDefs, getDataSource, gridOptions } from "./common/grid";
import { editModeUpdate } from "./common/service";

import { ArticleLayout } from "@/layouts/article-layout";
import { FloatLayout } from "@/layouts/float-layout";
import TypeButton from "@/types/type.button";
import { ScreenAccess, ThemeMode } from "@/utils/services/app.event";
import TypeSearch from "@/types/type.search";
import { darkGridTheme, lightGridTheme } from "@/styles/ag.theme";
import { GridLayout } from "@/layouts/grid-layout";

export function ContactusList() {
  useSignals();
  const { t } = useTranslation();
  const gridRef = useRef<AgGridReact>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dataSource = useMemo(() => getDataSource(searchTerm), [searchTerm]);

  useEffect(() => {
    editModeUpdate(undefined, "edit");
  }, []);

  // const handleAction = async (data: any, action: "edit" | "status") => {
  //   if (action === "edit") {
  //     contactusSelectedId.value = data.id;
  //     contactusIsEditMode.value = false;
  //     contactusIsPopupOpen.value = true;
  //   } else if (action === "status") {
  //     const resp = await contactusStatusCall({
  //       id: data.id,
  //       active: data.active,
  //     });
  //     if (resp) {
  //       handleReload();
  //     }
  //   }
  // };

  const handleReload = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.purgeInfiniteCache();
    }
  };

  const onAdd = () => {
    editModeUpdate(undefined, "add");
  };

  return (
    <>
      <ArticleLayout>
        <aside className="flex justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold">{t("Contact Us")}</h2>
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
          columnDefs={columnDefs(t)}
          datasource={dataSource}
          gridOptions={gridOptions}
          theme={ThemeMode.value === "dark" ? darkGridTheme : lightGridTheme}
        />
      </GridLayout>
      <FloatLayout>
        <TypeButton
          action="primary"
          label=""
          name="RotateCcw"
          onPress={handleReload}
        />
      </FloatLayout>
    </>
  );
}

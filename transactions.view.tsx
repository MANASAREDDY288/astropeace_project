import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@heroui/react";

import {
  editModeUpdate,
  transactionsSelectedId,
  transactionsEntityCall,
  transactionsEntityIsLoading,
} from "./common/service";
import { TransactionsType, transactionsInitValues } from "./common/types";

import TypeButton from "@/types/type.button";
import { ContentLayout } from "@/layouts/content-layout";
import { ArticleLayout } from "@/layouts/article-layout";
import { ScreenAccess } from "@/utils/services/app.event";

export default function TransactionsView() {
  useSignals();
  const { t } = useTranslation();
  const transactions = useSignal<TransactionsType>({
    ...transactionsInitValues,
  });

  React.useEffect(() => {
    onReloadTransactions();
  }, []);

  const onCancelTransactions = () => {
    editModeUpdate(undefined);
  };

  const editActionTransactions = () => {
    editModeUpdate(transactionsSelectedId.value, "edit");
  };

  const onReloadTransactions = async () => {
    if (transactionsSelectedId.value) {
      const params = { id: transactionsSelectedId.value };
      const resp = await transactionsEntityCall(params);

      if (resp) {
        transactions.value = resp;
      }
    }
  };

  const editActionProps = useMemo(
    () => ({
      action: "primary" as const,
      label: t("edit"),
      name: "Pencil" as const,
      onPress: editActionTransactions,
      disabled: !ScreenAccess.value.update,
    }),
    [t],
  );

  const cancelProps = useMemo(
    () => ({
      action: "secondary" as const,
      label: t("cancel"),
      name: "CircleX" as const,
      onPress: onCancelTransactions,
    }),
    [t],
  );

  return (
    <section className="w-full">
      <ArticleLayout>
        <div className="flex flex-row justify-between gap-4">
          <h3>Transactions View</h3>
          <div className="flex flex-row gap-4">
            <TypeButton {...cancelProps} />
            {ScreenAccess.value.update && <TypeButton {...editActionProps} />}
          </div>
        </div>
      </ArticleLayout>
      <ContentLayout>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-4">
            <Skeleton
              className="rounded-lg"
              isLoaded={!transactionsEntityIsLoading.value}
            >
              {transactions.value.active ? t("active") : t("inActive")}
            </Skeleton>
          </div>
        </div>
      </ContentLayout>
    </section>
  );
}

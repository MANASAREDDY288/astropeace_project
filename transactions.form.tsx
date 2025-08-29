import { useForm } from "react-hook-form";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ConstKeys } from "dff-util";
import { Skeleton } from "@heroui/react";

import { transactionsInitValues, TransactionsType } from "./common/types";
import {
  editModeUpdate,
  transactionsSelectedId,
  transactionsSaveIsLoading,
  transactionsEntityCall,
  transactionsSaveCall,
  transactionsEntityIsLoading,
} from "./common/service";

import { ArticleLayout } from "@/layouts/article-layout";
import TypeButton from "@/types/type.button";
import { ContentLayout } from "@/layouts/content-layout";
import TypeSwitch from "@/types/type.switch";
import { ShowToast } from "@/utils/services/app.event";

export default function TransactionsForm() {
  useSignals();
  const { t } = useTranslation();
  const transactions = useSignal<TransactionsType>({
    ...transactionsInitValues,
  });

  React.useEffect(() => {
    onReloadTransactions();
  }, []);

  const {
    handleSubmit,
    control,
    reset,
    formState: {},
  } = useForm<TransactionsType>({});

  const onResetTransactions = () => {
    reset({ ...transactions.value });
  };

  const onSubmitTransactions = async (data: TransactionsType) => {
    transactions.value = data;
    const resp = await transactionsSaveCall(transactions.value);

    if (resp) {
      ShowToast(t(ConstKeys.SAVED_SUCCESSFULLY), "success");
      editModeUpdate(undefined);
    }
  };

  const onCancelTransactions = () => {
    onResetTransactions();
    editModeUpdate(undefined);
  };

  const onReloadTransactions = async () => {
    if (transactionsSelectedId.value) {
      const params = { id: transactionsSelectedId.value };
      const resp = await transactionsEntityCall(params);

      if (resp) {
        transactions.value = resp;
        onResetTransactions();
      }
    }
  };

  const submitProps = useMemo(
    () => ({
      isLoading: transactionsSaveIsLoading.value,
      label: t("submit"),
      name: "SendHorizontal" as const,
      onPress: handleSubmit(onSubmitTransactions),
    }),
    [t, transactionsSaveIsLoading.value],
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

  const activeProps = useMemo(
    () => ({
      control,
      label: t("active"),
      name: "active",
      disabled: false,
    }),
    [t],
  );

  return (
    <section className="w-full">
      <ArticleLayout>
        <div className="flex flex-row justify-between gap-4">
          <h3>Transactions Form</h3>
          <div className="flex flex-row gap-4">
            <TypeButton {...cancelProps} />
            <TypeButton {...submitProps} />
          </div>
        </div>
      </ArticleLayout>
      <ContentLayout>
        <form>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-4">
              <Skeleton
                className="rounded-lg"
                isLoaded={!transactionsEntityIsLoading.value}
              >
                <TypeSwitch {...activeProps} />
              </Skeleton>
            </div>
          </div>
        </form>
      </ContentLayout>
    </section>
  );
}

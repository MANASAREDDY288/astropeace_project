import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@heroui/react";

import {
  editModeUpdate,
  contactusSelectedId,
  contactusEntityCall,
  contactusEntityIsLoading,
} from "./common/service";
import { contactusType, contactusInitValues } from "./common/types";

import TypeButton from "@/types/type.button";
import { ContentLayout } from "@/layouts/content-layout";
import { ArticleLayout } from "@/layouts/article-layout";
import { ScreenAccess } from "@/utils/services/app.event";

export default function ContactusView() {
  useSignals();
  const { t } = useTranslation();
  const contactus = useSignal<contactusType>({ ...contactusInitValues });

  React.useEffect(() => {
    onReloadcontactus();
  }, []);

  const onCancelcontactus = () => {
    editModeUpdate(undefined);
  };

  const editActioncontactus = () => {
    editModeUpdate(contactusSelectedId.value, "edit");
  };

  const onReloadcontactus = async () => {
    if (contactusSelectedId.value) {
      const params = { id: contactusSelectedId.value };
      const resp = await contactusEntityCall(params);

      if (resp) {
        contactus.value = resp;
      }
    }
  };

  const editActionProps = useMemo(
    () => ({
      action: "primary" as const,
      label: t("edit"),
      name: "Pencil" as const,
      onPress: editActioncontactus,
      disabled: !ScreenAccess.value.update,
    }),
    [t],
  );

  const cancelProps = useMemo(
    () => ({
      action: "secondary" as const,
      label: t("cancel"),
      name: "CircleX" as const,
      onPress: onCancelcontactus,
    }),
    [t],
  );

  return (
    <section className="w-full">
      <ArticleLayout>
        <div className="flex flex-row justify-between gap-4">
          <h3>contactus View</h3>
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
              isLoaded={!contactusEntityIsLoading.value}
            >
              {/* {contactus.value.active ? t("active") : t("inActive")} */}
            </Skeleton>
          </div>
        </div>
      </ContentLayout>
    </section>
  );
}

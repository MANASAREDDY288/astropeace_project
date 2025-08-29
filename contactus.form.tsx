import { useForm } from "react-hook-form";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ConstKeys } from "dff-util";
import { Skeleton } from "@heroui/react";

import { contactusInitValues, contactusType } from "./common/types";
import { contactusValidation } from "./common/validation";
import {
  editModeUpdate,
  contactusSelectedId,
  contactusSaveIsLoading,
  contactusEntityCall,
  contactusSaveCall,
  contactusEntityIsLoading,
} from "./common/service";

import { ArticleLayout } from "@/layouts/article-layout";
import TypeButton from "@/types/type.button";
import { ContentLayout } from "@/layouts/content-layout";
import { ShowToast } from "@/utils/services/app.event";
import TypeInput from "@/types/type.input";
import TypeSwitch from "@/types/type.switch";

export default function ContactusForm() {
  useSignals();
  const { t } = useTranslation();
  const contactus = useSignal<contactusType>({ ...contactusInitValues });
  const contactusRule = contactusValidation;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<contactusType>({
    defaultValues: contactusInitValues, // Ensure default values include `active`
  });

  React.useEffect(() => {
    onReloadcontactus();
  }, []);

  const onResetcontactus = () => {
    reset({ ...contactus.value });
  };

  const onSubmitcontactus = async (data: contactusType) => {
    contactus.value = data;

    const resp = await contactusSaveCall(contactus.value);

    if (resp) {
      ShowToast(t(ConstKeys.SAVED_SUCCESSFULLY), "success");
      editModeUpdate(undefined);
    }
  };

  const onCancelcontactus = () => {
    onResetcontactus();
    editModeUpdate(undefined);
  };

  const onReloadcontactus = async () => {
    if (contactusSelectedId.value) {
      const params = { id: contactusSelectedId.value };
      const resp = await contactusEntityCall(params);

      if (resp) {
        contactus.value = resp;
        reset(resp); // Reset form with fetched data
      }
    }
  };

  const submitProps = useMemo(
    () => ({
      isLoading: contactusSaveIsLoading.value,
      label: t("submit"),
      name: "SendHorizontal" as const,
      onPress: handleSubmit(onSubmitcontactus),
    }),
    [t, contactusSaveIsLoading.value, handleSubmit],
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

  const nameProps = useMemo(
    () => ({
      control,
      disabled: false,
      error: errors.name,
      label: t("name"),
      name: "name",
      rules: contactusRule?.name,
    }),
    [control, errors.name, t, contactusRule?.name],
  );

  const emailProps = useMemo(
    () => ({
      control,
      disabled: false,
      error: errors.email,
      label: t("email"),
      name: "email",
      rules: contactusRule?.email,
    }),
    [control, errors.email, t, contactusRule?.email],
  );

  const descriptionProps = useMemo(
    () => ({
      control,
      disabled: false,
      error: errors.summary,
      label: t("Summary"),
      name: "summary",
      rules: contactusRule?.summary,
    }),
    [control, errors.summary, t, contactusRule?.summary],
  );

  const activeProps = useMemo(
    () => ({
      control,
      label: t("active"),
      name: "active",
      disabled: false,
      className: "w-[30%] align-center flex",
    }),
    [control, t],
  );

  const phoneNumberProps = useMemo(
    () => ({
      control,
      disabled: false,
      error: errors.phone,
      label: t("phone number"),
      name: "phone",
      rules: contactusRule?.phone,
    }),
    [control, errors.phone, t, contactusRule?.phone],
  );

  return (
    <section className="w-full">
      <ArticleLayout>
        <div className="flex flex-row justify-between gap-4">
          <h3>Contact Us</h3>
          <div className="flex flex-row gap-4">
            <TypeSwitch {...activeProps} />
            <TypeButton {...cancelProps} />
            <TypeButton {...submitProps} />
          </div>
        </div>
      </ArticleLayout>
      <ContentLayout>
        <form onSubmit={handleSubmit(onSubmitcontactus)}>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-4">
              <Skeleton
                className="rounded-lg"
                isLoaded={!contactusEntityIsLoading.value}
              >
                <TypeInput {...nameProps} />
                <TypeInput {...emailProps} />
                <TypeInput {...phoneNumberProps} />
                <TypeInput {...descriptionProps} />
              </Skeleton>
            </div>
          </div>
        </form>
      </ContentLayout>
    </section>
  );
}

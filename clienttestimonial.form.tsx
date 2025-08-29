import { useForm } from "react-hook-form";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ConstKeys, ConstMessages, FileType } from "dff-util";
import { Skeleton, Image } from "@heroui/react";
import { Input } from "@heroui/input";

import {
  clienttestimonialInitValues,
  ClienttestimonialType,
} from "./common/types";
import { clienttestimonialValidation } from "./common/validation";
import {
  editModeUpdate,
  clienttestimonialSelectedId,
  clienttestimonialSaveIsLoading,
  clienttestimonialEntityCall,
  clienttestimonialSaveCall,
  clienttestimonialEntityIsLoading,
  uploadFile,
  SelectedClienttestimonial,
  shouldReloadGrid,
} from "./common/service";

import { ArticleLayout } from "@/layouts/article-layout";
import TypeButton from "@/types/type.button";
import { ContentLayout } from "@/layouts/content-layout";
import TypeSwitch from "@/types/type.switch";
import { ShowToast } from "@/utils/services/app.event";
import TypeInput from "@/types/type.input";

export default function ClienttestimonialForm() {
  useSignals();
  const { t } = useTranslation();
  const clienttestimonial = useSignal<ClienttestimonialType>({
    ...clienttestimonialInitValues,
  });
  const clienttestimonialRule = clienttestimonialValidation;

  const fileRef = useRef<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClienttestimonialType>({
    defaultValues: { ...clienttestimonialInitValues },
  });

  useEffect(() => {
    onReloadClienttestimonial();
  }, [clienttestimonialSelectedId.value]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    fileRef.current = file;
    setImageError(null);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async () => {
    if (fileRef.current) {
      try {
        const uploaded = await uploadFile(fileRef.current);

        return uploaded;
      } catch (error: any) {
        const message = error?.error?.message || ConstMessages.WENT_WRONG;

        ShowToast(message, "warning");

        return undefined;
      }
    }

    return undefined;
  };

  const onSubmitClienttestimonial = async (data: ClienttestimonialType) => {
    let imageFile: FileType | undefined;

    if (fileRef.current) {
      const uploaded = await handleFileUpload();

      if (!uploaded) {
        setImageError(t("Image upload failed") || "Image upload failed");

        return;
      }
      imageFile = {
        url: uploaded?.url,
        filename: uploaded?.filename,
        mimetype: uploaded?.mimetype,
      };
    } else if (clienttestimonial.value.image?.url) {
      imageFile = clienttestimonial.value.image;
    } else if (data.image?.url) {
      imageFile = data.image;
    } else {
      setImageError(t("Image is required") || "Image is required");

      return;
    }

    data.image = imageFile;
    setValue("image", fileRef.current ? imageFile : data.image);

    clienttestimonial.value = data;
    const resp = await clienttestimonialSaveCall(clienttestimonial.value);

    if (resp) {
      ShowToast(t(ConstKeys.SAVED_SUCCESSFULLY), "success");
      editModeUpdate(undefined);
      fileRef.current = null;
      setImagePreview(null);
      shouldReloadGrid.value = true;
    }
  };

  const onCancelClienttestimonial = () => {
    reset(clienttestimonial.value);
    fileRef.current = null;
    setImagePreview(null);
    setImageError(null);
    editModeUpdate(undefined);
  };

  const onReloadClienttestimonial = async () => {
    if (clienttestimonialSelectedId.value) {
      const params = { id: clienttestimonialSelectedId.value };
      const resp = await clienttestimonialEntityCall(params);
      const data = resp?.data;

      if (data) {
        clienttestimonial.value = data;
        reset(data);
        if (data.image?.url) {
          setImagePreview(data.image.url);
        }
      }
    }
  };

  const submitProps = useMemo(
    () => ({
      isLoading: clienttestimonialSaveIsLoading.value,
      label: t("submit"),
      name: "SendHorizontal" as const,
      onPress: handleSubmit(onSubmitClienttestimonial),
      type: "submit",
    }),
    [t, clienttestimonialSaveIsLoading.value, handleSubmit],
  );

  const cancelProps = useMemo(
    () => ({
      action: "secondary" as const,
      label: t("cancel"),
      name: "CircleX" as const,
      onPress: onCancelClienttestimonial,
    }),
    [t],
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

  const nameProps = useMemo(
    () => ({
      control,
      disabled: false,
      error: errors.name,
      label: t("name"),
      name: "name",
      rules: clienttestimonialRule?.name,
      type: "text" as const,
    }),
    [control, errors.name, t, clienttestimonialRule?.name],
  );

  const placeProps = useMemo(
    () => ({
      control,
      disabled: false,
      error: errors.place,
      label: t("Place"),
      name: "place",
      rules: clienttestimonialRule?.place,
      type: "text" as const,
    }),
    [control, errors.place, t, clienttestimonialRule?.place],
  );

  const contentProps = useMemo(
    () => ({
      control,
      disabled: false,
      error: errors.content,
      label: t("Content"),
      name: "content",
      rules: clienttestimonialRule?.content,
      type: "textarea" as const,
    }),
    [control, errors.content, t, clienttestimonialRule?.content],
  );

  const isEditMode =
    !!clienttestimonialSelectedId.value ||
    !!SelectedClienttestimonial.value?._id;
  const formTitle = isEditMode
    ? t("Edit Client Testimonial")
    : t("Add Client Testimonial");

  return (
    <section className="w-full">
      <ArticleLayout>
        <div className="flex flex-row justify-between gap-4">
          <h3 className="text-lg font-semibold flex items-center">
            {formTitle}
          </h3>
          <div className="flex flex-row gap-4">
            <TypeSwitch {...activeProps} />
            <TypeButton {...cancelProps} />
            <TypeButton {...submitProps} />
          </div>
        </div>
      </ArticleLayout>
      <ContentLayout>
        <form onSubmit={handleSubmit(onSubmitClienttestimonial)}>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-4">
              {clienttestimonialEntityIsLoading.value ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <TypeInput {...nameProps} />
              )}
              {clienttestimonialEntityIsLoading.value ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <TypeInput {...placeProps} />
              )}
              {clienttestimonialEntityIsLoading.value ? (
                <Skeleton className="h-20 w-full rounded-lg" />
              ) : (
                <TypeInput {...contentProps} />
              )}
              {clienttestimonialEntityIsLoading.value ? (
                <Skeleton className="h-32 w-full rounded-lg" />
              ) : (
                <div className="mb-4 w-full">
                  <span>{t("attachment") || "Attachment"}</span>
                  {imagePreview && (
                    <div className="my-4">
                      <Image
                        alt="Preview"
                        className="object-cover mt-2 h-[25%] w-[80%]"
                        src={imagePreview}
                      />
                    </div>
                  )}
                  <label
                    className="flex items-center justify-center border border-dashed border-gray-300 px-4 py-2 rounded-full cursor-pointer text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50"
                    htmlFor="file-upload"
                  >
                    <Input
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      id="file-upload"
                      type="file"
                      onChange={handleFileSelect}
                    />
                    {t("browse an image file")}
                  </label>
                  {fileRef.current && (
                    <div className="text-xs text-gray-600 mt-1">
                      {fileRef.current.name}
                    </div>
                  )}
                  {imageError && (
                    <div className="text-xs text-red-600 mt-1">
                      {imageError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </ContentLayout>
    </section>
  );
}

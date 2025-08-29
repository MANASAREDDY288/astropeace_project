import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Skeleton, Image } from "@heroui/react";

import {
  editModeUpdate,
  clienttestimonialSelectedId,
  clienttestimonialEntityCall,
  clienttestimonialEntityIsLoading,
  SelectedClienttestimonial,
  clienttestimonialIsEditMode,
  clienttestimonialIsPopupOpen,
  OnUpdateSelectedClienttestimonial,
} from "./common/service";
import ClienttestimonialForm from "./clienttestimonial.form";

import TypeButton from "@/types/type.button";
import { ContentLayout } from "@/layouts/content-layout";
import { ArticleLayout } from "@/layouts/article-layout";
import { ScreenAccess, ThemeMode } from "@/utils/services/app.event";

export default function ClienttestimonialView() {
  useSignals();
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  React.useEffect(() => {
    setImageUrl(SelectedClienttestimonial.value?.image?.url || null);
    setImageName(SelectedClienttestimonial.value?.image?.filename || null);
  }, [SelectedClienttestimonial.value]);

  const onCancelClienttestimonial = () => {
    editModeUpdate(undefined);
  };

  const editActionClienttestimonial = async () => {
    const id =
      SelectedClienttestimonial.value._id || clienttestimonialSelectedId.value;

    if (id) {
      const resp = await clienttestimonialEntityCall({ id: id });

      if (resp?.data) {
        const entity = resp.data;

        OnUpdateSelectedClienttestimonial(entity);
        clienttestimonialSelectedId.value = id;
        editModeUpdate(id, "edit");
      }
    }
  };

  const editActionProps = useMemo(
    () => ({
      action: "primary" as const,
      label: t("edit"),
      name: "Pencil" as const,
      onPress: editActionClienttestimonial,
      disabled: !ScreenAccess.value.update,
    }),
    [t, SelectedClienttestimonial.value._id],
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

  return (
    <section className="w-full">
      <ArticleLayout>
        <div className="flex flex-row justify-between gap-4">
          <h3 className="text-lg font-semibold flex items-center">
            {t("View Client Testimonial")}
          </h3>
          <div className="flex flex-row gap-4">
            <TypeButton {...cancelProps} />
            {ScreenAccess.value.update && <TypeButton {...editActionProps} />}
          </div>
        </div>
      </ArticleLayout>
      <ContentLayout>
        <div className="flex flex-col gap-4 w-full">
          <Skeleton
            className="rounded-lg"
            isLoaded={!clienttestimonialEntityIsLoading.value}
          >
            {clienttestimonialIsPopupOpen.value &&
            clienttestimonialIsEditMode.value ? (
              <ClienttestimonialForm />
            ) : (
              <>
                <Card className="p-4 rounded-lg">
                  <Skeleton
                    className="rounded-lg"
                    isLoaded={!clienttestimonialEntityIsLoading.value}
                  >
                    <p className="text-sm my-2">
                      <span className="font-extrabold">{t("name")} : </span>
                      <span className="font-light">
                        {SelectedClienttestimonial.value.name}
                      </span>
                    </p>
                  </Skeleton>
                  <Skeleton
                    className="rounded-lg"
                    isLoaded={!clienttestimonialEntityIsLoading.value}
                  >
                    <p className="text-sm my-2">
                      <span className="font-extrabold">{t("Place")} : </span>
                      <span className="font-light text-wrap">
                        {SelectedClienttestimonial.value.place}
                      </span>
                    </p>
                  </Skeleton>
                  <Skeleton
                    className="rounded-lg"
                    isLoaded={!clienttestimonialEntityIsLoading.value}
                  >
                    <p className="text-sm my-2">
                      <span className="font-extrabold">{t("Content")} : </span>
                      <span className="font-light">
                        {SelectedClienttestimonial.value.content}
                      </span>
                    </p>
                  </Skeleton>
                  <Skeleton
                    className="rounded-lg"
                    isLoaded={!clienttestimonialEntityIsLoading.value}
                  >
                    <p className="text-sm my-2">
                      <span className="font-extrabold">{t("status")} : </span>
                      <span className="font-light text-wrap">
                        {SelectedClienttestimonial.value.active
                          ? t("active")
                          : t("inactive")}
                      </span>
                    </p>
                  </Skeleton>
                </Card>
                <Skeleton
                  className="rounded-lg"
                  isLoaded={!clienttestimonialEntityIsLoading.value}
                >
                  <div className="w-full mt-4">
                    <h5 className="text-md font-medium text-gray-700 mb-2">
                      {ThemeMode.value === "dark" ? (
                        <>
                          {imageUrl && (
                            <div className="text-white">
                              {" "}
                              {t("attachment")}{" "}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {imageUrl && (
                            <div className="text-black">
                              {" "}
                              {t("attachment")}{" "}
                            </div>
                          )}
                        </>
                      )}
                    </h5>
                    <Card className="p-4 rounded-lg">
                      <div className="w-full flex justify-between">
                        <div className="w-[50%]">
                          {imageUrl && (
                            <>
                              <p className="text-sm font-medium">
                                {t("thumbnailImage")}:
                              </p>
                              <Image
                                alt="Thumbnail Preview"
                                className="object-cover mx-auto mt-2"
                                height={160}
                                src={imageUrl}
                              />
                              <p className="text-sm mt-1">{imageName}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                </Skeleton>
              </>
            )}
          </Skeleton>
        </div>
      </ContentLayout>
    </section>
  );
}

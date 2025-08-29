import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton, Image, Card } from "@heroui/react";

import {
  editModeUpdate,
  poojaEntityIsLoading,
  SelectedPooja,
  poojaIsEditMode,
} from "./common/service";

import { ArticleLayout } from "@/layouts/article-layout";
import TypeButton from "@/types/type.button";
import { ContentLayout } from "@/layouts/content-layout";
import { ScreenAccess, ThemeMode } from "@/utils/services/app.event";

export default function SelectedPoojaView() {
  useSignals();
  const { t } = useTranslation();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(SelectedPooja.value?.thumbnail?.url || null);
    setImageName(SelectedPooja.value?.thumbnail?.filename || null);
    setVideoUrl(SelectedPooja.value?.video?.url || null);
    setVideoName(SelectedPooja.value?.video?.filename || null);
  }, [SelectedPooja.value]);

  const editActionProps = useMemo(
    () => ({
      label: t("edit"),
      name: "Pencil" as const,
      onPress: () => {
        poojaIsEditMode.value = true;
      },
    }),
    [t],
  );

  const cancelProps = useMemo(
    () => ({
      action: "secondary" as const,
      label: t("cancel"),
      name: "CircleX" as const,
      onPress: () => editModeUpdate(undefined),
    }),
    [t],
  );

  return (
    <section className="w-full">
      <ArticleLayout>
        <div className="flex flex-row justify-between gap-4 items-center">
          <h3 className="text-lg font-semibold">{t("Selected Pooja View")}</h3>
          <div className="flex flex-row gap-4">
            <TypeButton {...cancelProps} />
            {ScreenAccess.value.update && <TypeButton {...editActionProps} />}
          </div>
        </div>
      </ArticleLayout>
      <ContentLayout>
        <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
          <div className="flex flex-col gap-4">
            <Card className="p-4 rounded-lg">
              <Skeleton
                className="rounded-lg"
                isLoaded={!poojaEntityIsLoading.value}
              >
                <p className="text-sm my-2">
                  <span className="font-extrabold">{t("active")} : </span>
                  <span className="font-light">
                    {(SelectedPooja.value?.active ?? true)
                      ? t("Active")
                      : t("Inactive")}
                  </span>
                </p>
              </Skeleton>
              <Skeleton
                className="rounded-lg"
                isLoaded={!poojaEntityIsLoading.value}
              >
                <p className="text-sm font-medium my-2">
                  <span className="font-extrabold">{t("repeat")} : </span>
                  <span className="font-light">
                    {SelectedPooja.value?.repeat ?? 1}
                  </span>
                </p>
              </Skeleton>
              <Skeleton
                className="rounded-lg"
                isLoaded={!poojaEntityIsLoading.value}
              >
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("name")} : </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold py-10">
                    {t("english")} :{" "}
                  </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.nameLang?.["en-US"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("telugu")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.nameLang?.["te-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("hindi")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.nameLang?.["hi-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("kannada")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.nameLang?.["kn-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("tamil")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.nameLang?.["ta-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("malayalam")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.nameLang?.["ml-IN"]}
                  </span>
                </p>
              </Skeleton>
            </Card>
            <Skeleton
              className="rounded-lg"
              isLoaded={!poojaEntityIsLoading.value}
            >
              <Card className="p-4 rounded-lg">
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("shortSummary")} : </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold py-10">
                    {t("english")} :{" "}
                  </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.shortSummary?.["en-US"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("telugu")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.shortSummary?.["te-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("hindi")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.shortSummary?.["hi-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("kannada")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.shortSummary?.["kn-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("tamil")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.shortSummary?.["ta-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("malayalam")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.shortSummary?.["ml-IN"]}
                  </span>
                </p>
              </Card>
            </Skeleton>
            <Skeleton
              className="rounded-lg"
              isLoaded={!poojaEntityIsLoading.value}
            >
              <Card className="p-4 rounded-lg">
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("summary")} : </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold py-10">
                    {t("english")} :{" "}
                  </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.summary?.["en-US"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("telugu")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.summary?.["te-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("hindi")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.summary?.["hi-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("kannada")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.summary?.["kn-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("tamil")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.summary?.["ta-IN"]}
                  </span>
                </p>
                <p className="text-sm  py-2">
                  <span className="font-extrabold">{t("malayalam")} : </span>
                  <span className="text-wrap font-light">
                    {SelectedPooja.value?.summary?.["ml-IN"]}
                  </span>
                </p>
              </Card>
            </Skeleton>
            <Skeleton
              className="rounded-lg"
              isLoaded={!poojaEntityIsLoading.value}
            >
              <h5 className="text-md font-medium text-gray-700 mb-2">
                {ThemeMode.value === "dark" ? (
                  <>
                    {imageUrl && (
                      <div className="text-white"> {t("attachment")} </div>
                    )}
                  </>
                ) : (
                  <>
                    {imageUrl && (
                      <div className="text-black"> {t("attachment")} </div>
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
                  <div className="w-[50%]">
                    {videoUrl && (
                      <>
                        <p className="text-sm font-medium">
                          {t("videoPreview")}:
                        </p>
                        <video controls className="w-full max-w-[88%] mt-2">
                          <source src={videoUrl} type="video/mp4" />
                          <track
                            default
                            kind="captions"
                            label="English captions"
                            src="/path-to-captions.vtt"
                            srcLang="en-US"
                          />
                        </video>
                        <p className="text-sm mt-1">{videoName}</p>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </Skeleton>
          </div>
        </div>
      </ContentLayout>
    </section>
  );
}

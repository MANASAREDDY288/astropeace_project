import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton, Image, Card } from "@heroui/react";

import {
  editModeUpdate,
  donationEntityIsLoading,
  SelectedDonation,
  donationIsEditMode,
} from "./common/service";

import { ArticleLayout } from "@/layouts/article-layout";
import TypeButton from "@/types/type.button";
import { ContentLayout } from "@/layouts/content-layout";
import { ThemeMode } from "@/utils/services/app.event";

export default function SelectedDonationForm() {
  useSignals();
  const { t } = useTranslation();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(SelectedDonation.value?.thumbnail?.url || null);
    setImageName(SelectedDonation.value?.thumbnail?.filename || null);
    setVideoUrl(SelectedDonation.value?.video?.url || null);
    setVideoName(SelectedDonation.value?.video?.filename || null);
  }, [SelectedDonation.value]);

  const editActionProps = useMemo(
    () => ({
      label: t("edit"),
      name: "Pencil" as const,
      onPress: () => {
        donationIsEditMode.value = true;
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
        <div className="flex flex-row justify-between gap-4">
          <h3 className="text-lg font-semibold">{t("viewDonation")}</h3>
          <div className="flex flex-row gap-4">
            <TypeButton {...cancelProps} />
            <TypeButton {...editActionProps} />
          </div>
        </div>
      </ArticleLayout>
      <ContentLayout>
        <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
          <div className="flex flex-col gap-4">
            <Card className="p-4 rounded-lg">
              <Skeleton
                className="rounded-lg"
                isLoaded={!donationEntityIsLoading.value}
              >
                <p className="text-sm my-2">
                  <span className="font-extrabold">{t("active")} : </span>
                  <span className="font-light">
                    {SelectedDonation.value.active
                      ? t("Active")
                      : t("Inactive")}
                  </span>
                </p>
              </Skeleton>
              <Skeleton
                className="rounded-lg"
                isLoaded={!donationEntityIsLoading.value}
              >
                <p className="text-sm my-2">
                  <span className="font-extrabold">{t("name")} : </span>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold py-10">
                      {t("english")} :{" "}
                    </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.nameLang?.["en-US"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("telugu")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.nameLang?.["te-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("hindi")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.nameLang?.["hi-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("kanada")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.nameLang?.["kn-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("tamil")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.nameLang?.["ta-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("malayalam")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.nameLang?.["ml-IN"]}
                    </span>
                  </p>
                </p>
              </Skeleton>
            </Card>
            <Skeleton
              className="rounded-lg"
              isLoaded={!donationEntityIsLoading.value}
            >
              <Card className="p-4 rounded-lg">
                <p className="text-sm">
                  <span className="font-extrabold">{t("shortSummary")} : </span>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold py-10">
                      {t("english")} :{" "}
                    </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.shortSummary?.["en-US"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("telugu")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.shortSummary?.["te-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("hindi")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.shortSummary?.["hi-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("kanada")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.shortSummary?.["kn-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("tamil")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.shortSummary?.["ta-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("malayalam")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.shortSummary?.["ml-IN"]}
                    </span>
                  </p>
                </p>
              </Card>
            </Skeleton>
            <Skeleton
              className="rounded-lg"
              isLoaded={!donationEntityIsLoading.value}
            >
              <Card className="p-4 rounded-lg">
                <p className="text-sm">
                  <span className="font-extrabold">{t("summary")} : </span>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold py-10">
                      {t("english")} :{" "}
                    </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.summary?.["en-US"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("telugu")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.summary?.["te-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("hindi")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.summary?.["hi-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("kanada")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.summary?.["kn-IN"]}
                    </span>
                  </p>
                  <p className="text-sm  py-2">
                    <span className="font-extrabold">{t("tamil")} : </span>
                    <span className="text-wrap font-light">
                      {SelectedDonation.value.summary?.["ta-IN"]}
                    </span>
                  </p>
                </p>
              </Card>
            </Skeleton>
            <Skeleton
              className="rounded-lg"
              isLoaded={!donationEntityIsLoading.value}
            >
              <div className="w-full mt-4">
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
                              srcLang="en"
                            />
                            Your browser does not support the video tag.
                          </video>
                          <p className="text-sm mt-1">{videoName}</p>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </Skeleton>
          </div>
        </div>
      </ContentLayout>
    </section>
  );
}

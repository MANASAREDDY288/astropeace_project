import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { ConstKeys, FileType } from "dff-util";
import { Button, Skeleton, Image } from "@heroui/react";
import { PlayCircle, Upload } from "lucide-react";

import { donationInitValues, DonationType } from "./common/types";
import { DonationValidation } from "./common/validation";
import {
  editModeUpdate,
  donationSelectedId,
  donationSaveIsLoading,
  donationSaveCall,
  SelectedDonation,
  OnUpdateSelectedDonation,
  uploadFile,
  donationEntityIsLoading,
} from "./common/service";

import { ArticleLayout } from "@/layouts/article-layout";
import TypeButton from "@/types/type.button";
import { ContentLayout } from "@/layouts/content-layout";
import TypeSwitch from "@/types/type.switch";
import { ShowToast } from "@/utils/services/app.event";
import TypeLang from "@/types/type.lang";
import TypeLangMd from "@/types/type.lang-md";
import { TranslationType } from "@/utils/services/app.types";

export default function DonationForm() {
  useSignals();
  const { t } = useTranslation();
  const donation = useSignal<DonationType>({ ...donationInitValues });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    onReloadDonation();

    return () => {
      if (!donationSelectedId.value) {
        reset(donationInitValues);
      }
    };
  }, [donationSelectedId.value]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DonationType>({
    defaultValues: donation.value,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const onResetDonation = () => {
    reset({ ...donation.value });
  };

  useEffect(() => {
    if (SelectedDonation.value) {
      if (SelectedDonation.value.video?.url) {
        setVideoUrl(SelectedDonation.value.video.url);
        setVideoName(SelectedDonation.value.video.filename);
      } else {
        setVideoUrl(null);
        setVideoName(null);
      }

      if (SelectedDonation.value.thumbnail?.url) {
        setImageUrl(SelectedDonation.value.thumbnail.url);
        setImageName(SelectedDonation.value.thumbnail.filename);
      } else {
        setImageUrl(null);
        setImageName(null);
      }

      const donationData = { ...SelectedDonation.value };

      if (!donationData.title && donationData.nameLang?.["en-US"]) {
        donationData.title = donationData.nameLang["en-US"];
      }

      reset(donationData);
      donation.value = donationData;
    }
  }, [reset, SelectedDonation.value]);

  const onSubmitDonation = async (data: DonationType) => {
    data.title = data.nameLang?.["en-US"] || data.title || "";
    const [thumbnailResponse, videoResponse] = await handleFileUpload();

    if (thumbnailResponse) {
      data.thumbnail = {
        url: thumbnailResponse.url,
        filename: thumbnailResponse.filename,
        mimetype: thumbnailResponse.mimetype,
      };
    } else if (fileInputRef.current?.files?.[0]) {
      data.thumbnail = undefined;
    } else {
      data.thumbnail =
        donation.value.thumbnail || SelectedDonation.value?.thumbnail;
    }

    if (videoResponse) {
      data.video = {
        url: videoResponse.url,
        filename: videoResponse.filename,
        mimetype: videoResponse.mimetype,
      };
    } else if (videoInputRef.current?.files?.[0]) {
      data.video = undefined;
    } else {
      data.video = donation.value.video || SelectedDonation.value?.video;
    }
    const filteredData = filterLanguageCodes(data);

    donation.value = filteredData;
    data._id = SelectedDonation.value?._id;
    OnUpdateSelectedDonation(filteredData);
    const resp = await donationSaveCall(filteredData);

    if (resp) {
      ShowToast(t(ConstKeys.SAVED_SUCCESSFULLY), "success");
      editModeUpdate(undefined);
    }
    OnUpdateSelectedDonation({} as DonationType);
    setImageUrl(null);
    setVideoUrl(null);
  };

  const onCancelDonation = () => {
    onResetDonation();
    editModeUpdate(undefined);
    setImageUrl(null);
    setVideoUrl(null);
  };

  const onReloadDonation = () => {
    if (SelectedDonation.value) {
      const filteredDonation = filterLanguageCodes(SelectedDonation.value);

      donation.value = filteredDonation;
      setImageUrl(filteredDonation.thumbnail?.url || null);
      setImageName(filteredDonation.thumbnail?.filename || null);
      setVideoUrl(filteredDonation.video?.url || null);
      setVideoName(filteredDonation.video?.filename || null);

      onResetDonation();
    }
  };

  const filterLanguageCodes = (data: DonationType): DonationType => {
    const validLangs = [
      "en-US",
      "te-IN",
      "hi-IN",
      "kn-IN",
      "ml-IN",
      "ta-IN",
    ] as const;

    const filterTranslation = (
      translation: Record<string, string> | undefined,
    ): TranslationType => {
      const filtered: Partial<TranslationType> = {};

      validLangs.forEach((lang) => {
        filtered[lang] = translation?.[lang] || "";
      });

      return filtered as TranslationType;
    };

    return {
      ...data,
      nameLang: filterTranslation(data.nameLang || {}),
      shortSummary: filterTranslation(data.shortSummary || {}),
      summary: filterTranslation(data.summary || {}),
    };
  };

  const handleUploadClick = (type: "image" | "video") => {
    if (type === "image" && fileInputRef.current) {
      fileInputRef.current.click();
    }
    if (type === "video" && videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video",
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (type === "image") {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageName(file.name);
      setImageError(null);
    }

    if (type === "video") {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      const newVideoUrl = URL.createObjectURL(file);

      setVideoUrl(newVideoUrl);
      setVideoName(file.name);
      setVideoError(null);
    }
  };

  const handleFileUpload = async () => {
    let thumbnailResponse = donation.value.thumbnail as FileType | undefined;
    let videoResponse = donation.value.video as FileType | undefined;

    if (fileInputRef.current?.files?.[0]) {
      thumbnailResponse = await uploadFile(fileInputRef.current.files[0]);
    }
    if (videoInputRef.current?.files?.[0]) {
      videoResponse = await uploadFile(videoInputRef.current.files[0]);
    }

    return [thumbnailResponse, videoResponse];
  };

  const isEditButtonMode =
    !!donationSelectedId.value || !!SelectedDonation.value?._id;
  const buttonText = isEditButtonMode ? t("update") : t("submit");

  const submitProps = useMemo(
    () => ({
      isLoading: donationSaveIsLoading.value,
      label: buttonText,
      name: "SendHorizontal" as const,
      onPress: handleSubmit(onSubmitDonation),
    }),
    [t, donationSaveIsLoading.value, handleSubmit, onSubmitDonation],
  );

  const cancelProps = useMemo(
    () => ({
      action: "secondary" as const,
      label: t("cancel"),
      name: "CircleX" as const,
      onPress: onCancelDonation,
    }),
    [t, onCancelDonation],
  );

  const activeProps = useMemo(
    () => ({
      control,
      label: t("active"),
      name: "active",
      disabled: false,
      value: donation.value.active ?? true,
      className: "w-[30%] align-center flex",
    }),
    [control, t, donation.value.active],
  );

  const nameLangProps = useMemo(
    () => ({
      control,
      name: "nameLang",
      label: t("name"),
      rules: DonationValidation.nameLang,
      error: errors.nameLang,
      className: "w-full",
      disabled: false,
      radius: "full" as const,
      type: "text" as const,
      value: SelectedDonation.value?.nameLang ?? "",
    }),
    [control, t, errors.nameLang, SelectedDonation.value?.nameLang],
  );

  const shortSummaryLangProps = useMemo(
    () => ({
      control,
      name: "shortSummary",
      label: t("shortDescription"),
      rules: DonationValidation.shortSummary,
      error: errors.shortSummary,
      className: "w-full",
      disabled: false,
      radius: "full" as const,
      type: "textarea" as const,
      value: SelectedDonation.value?.shortSummary ?? "",
    }),
    [control, t, errors.shortSummary, SelectedDonation.value?.shortSummary],
  );

  const summaryMdProps = useMemo(
    () => ({
      control,
      disabled: false,
      error: errors.summary,
      label: t("description"),
      name: "summary",
      value: SelectedDonation.value?.summary ?? "",
      rules: DonationValidation.summary,
    }),
    [t, errors.summary, DonationValidation.summary],
  );

  const isEditMode =
    !!donationSelectedId.value || !!SelectedDonation.value?._id;
  const formTitle = isEditMode ? t("editDonation") : t("addDonation");

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
        <form onSubmit={handleSubmit(onSubmitDonation)}>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-4">
              <Skeleton
                className="rounded-lg"
                isLoaded={!donationEntityIsLoading.value}
              >
                <div>
                  <TypeLang {...nameLangProps} />
                </div>
              </Skeleton>
              <Skeleton
                className="rounded-lg"
                isLoaded={!donationEntityIsLoading.value}
              >
                <div>
                  <TypeLang {...shortSummaryLangProps} />
                </div>
              </Skeleton>
              <Skeleton
                className="rounded-lg"
                isLoaded={!donationEntityIsLoading.value}
              >
                <div>
                  <TypeLangMd {...summaryMdProps} />
                </div>
              </Skeleton>
              <Skeleton
                className="rounded-lg"
                isLoaded={!donationEntityIsLoading.value}
              >
                <h5>{t("Attachment")}</h5>
                <div className="w-full flex justify-between">
                  <div className="w-[50%]">
                    {imageUrl && (
                      <div className="mt-2">
                        <p>{t("imagePreview")}:</p>
                        <Image
                          alt="Preview"
                          className="object-cover mt-2 h-[25%] w-[80%]"
                          src={imageUrl}
                        />
                        <p>{imageName}</p>
                      </div>
                    )}
                    <div className="flex mb-2">{t("thumbnailImage")}</div>
                    <Button
                      className="w-[80%] mt-2"
                      endContent={<Upload />}
                      onClick={() => handleUploadClick("image")}
                    >
                      {t("Browseordrag&dropanimagefile")}
                    </Button>
                    <input
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      type="file"
                      onChange={(e) => handleFileSelect(e, "image")}
                    />
                    {imageError && (
                      <p className="text-red-500 text-sm mt-2">{imageError}</p>
                    )}
                  </div>
                  <div className="w-[50%]">
                    {videoUrl && (
                      <div className="mt-2">
                        <p>{t("videoPreview")}:</p>
                        <video key={videoUrl} controls className="w-[70%] mt-2">
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
                        <p>{videoName}</p>
                      </div>
                    )}
                    <span>{t("video")}</span>
                    <br />
                    <Button
                      className="w-[86%] mt-2"
                      endContent={<PlayCircle />}
                      onClick={() => handleUploadClick("video")}
                    >
                      {t("Browseordrag&dropavideofile")}
                    </Button>
                    <input
                      ref={videoInputRef}
                      accept="video/*"
                      style={{ display: "none" }}
                      type="file"
                      onChange={(e) => handleFileSelect(e, "video")}
                    />
                    {videoError && (
                      <p className="text-red-500 text-sm mt-2">{videoError}</p>
                    )}
                  </div>
                </div>
              </Skeleton>
            </div>
          </div>
        </form>
      </ContentLayout>
    </section>
  );
}

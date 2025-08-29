/* eslint-disable padding-line-between-statements */
import { useForm } from "react-hook-form";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConstKeys, FileType } from "dff-util";
import { Button, Skeleton, Image } from "@heroui/react";
import { PlayCircle, Upload } from "lucide-react";

import { mantraInitValues, MantraType } from "./common/types";
import { MantraValidation } from "./common/validation";
import {
  editModeUpdate,
  mantraSelectedId,
  mantraSaveIsLoading,
  mantraSaveCall,
  mantraEntityIsLoading,
  uploadFile,
  SelectedMantra,
  OnUpdateSelectedMantra,
  selectedThumbnail,
  selectedVideo,
  shouldReloadGrid,
} from "./common/service";

import { ArticleLayout } from "@/layouts/article-layout";
import TypeButton from "@/types/type.button";
import { ContentLayout } from "@/layouts/content-layout";
import TypeSwitch from "@/types/type.switch";
import { ShowToast } from "@/utils/services/app.event";
import TypeLang from "@/types/type.lang";
import TypeLangMd from "@/types/type.lang-md";

export default function MantraForm() {
  useSignals();
  const { t } = useTranslation();
  const mantra = useSignal<MantraType>({ ...mantraInitValues });

  const [imageUrl, setImageUrl] = useState<string | null>(
    SelectedMantra.value?.thumbnail?.url || mantra.value.thumbnail?.url || null,
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(
    SelectedMantra.value?.video?.url || mantra.value.video?.url || null,
  );
  const [videoName, setVideoName] = useState<string | null>(
    SelectedMantra.value?.video?.filename ||
      mantra.value.video?.filename ||
      null,
  );
  const [imageName, setImageName] = useState<string | null>(
    SelectedMantra.value?.thumbnail?.filename ||
      mantra.value.thumbnail?.filename ||
      null,
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    onReloadMantra();
    // Cleanup when component unmounts
    return () => {
      // Reset the form when closing
      if (!mantraSelectedId.value) {
        reset(mantraInitValues);
      }
    };
  }, [mantraSelectedId.value]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MantraType>({
    defaultValues: mantra.value,
  });

  const onResetMantra = () => {
    reset({ ...mantra.value });
  };

  useEffect(() => {
    if (SelectedMantra.value?.video?.url) {
      setVideoUrl(SelectedMantra.value.video.url);
      setVideoName(SelectedMantra.value.video.filename);
    }
    if (SelectedMantra.value?.thumbnail?.url) {
      setImageUrl(SelectedMantra.value.thumbnail.url);
      setImageName(SelectedMantra.value.thumbnail.filename);
    }
    reset({ ...SelectedMantra.value });
  }, [reset]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
      selectedThumbnail.value = file;
    }

    if (type === "video") {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      const newVideoUrl = URL.createObjectURL(file);
      setVideoUrl(newVideoUrl);
      setVideoName(file.name);
      setVideoError(null);
      selectedVideo.value = file;

      const videoElement = document.getElementById(
        "video-preview",
      ) as HTMLVideoElement;
      if (videoElement) {
        videoElement.load();
      }
    }
  };

  const handleFileUpload = async () => {
    let thumbnailResponse = SelectedMantra.value?.thumbnail as FileType;
    let videoResponse = SelectedMantra.value?.video as FileType;

    if (selectedThumbnail.value) {
      thumbnailResponse = await uploadFile(selectedThumbnail.value as File);
    }
    if (selectedVideo.value) {
      videoResponse = await uploadFile(selectedVideo.value as File);
    }

    return [thumbnailResponse, videoResponse];
  };

  const onSubmitMantra = async (data: MantraType) => {
    const hasThumbnail =
      fileInputRef.current?.files?.[0] ||
      SelectedMantra.value?.thumbnail?.url ||
      mantra.value.thumbnail?.url;
    const hasVideo =
      videoInputRef.current?.files?.[0] ||
      SelectedMantra.value?.video?.url ||
      mantra.value.video?.url;
    if (!hasThumbnail) {
      setImageError(t("thumbnailImageRequired"));
    } else {
      setImageError(null);
    }

    if (!hasVideo) {
      setVideoError(t("videoRequired"));
    } else {
      setVideoError(null);
    }

    if (!hasThumbnail || !hasVideo) {
      return;
    }

    const [thumbnailResponse, videoResponse] = await handleFileUpload();
    data.thumbnail = thumbnailResponse
      ? {
          url: thumbnailResponse.url,
          filename: thumbnailResponse.filename,
          mimetype: thumbnailResponse.mimetype,
        }
      : mantra.value.thumbnail || SelectedMantra.value?.thumbnail;
    data.video = videoResponse
      ? {
          url: videoResponse.url,
          filename: videoResponse.filename,
          mimetype: videoResponse.mimetype,
        }
      : mantra.value.video || SelectedMantra.value?.video;

    // Update display only with new uploads, otherwise retain current state
    if (thumbnailResponse) {
      setImageUrl(thumbnailResponse.url);
      setImageName(thumbnailResponse.filename);
    }
    if (videoResponse) {
      setVideoUrl(videoResponse.url);
      setVideoName(videoResponse.filename);
    }

    mantra.value = data;
    data._id = SelectedMantra.value?._id;
    OnUpdateSelectedMantra(data);
    try {
      const resp = await mantraSaveCall(data);
      if (resp) {
        ShowToast(t(ConstKeys.SAVED_SUCCESSFULLY), "success");

        // Reset the signal first, then set it to true to trigger the subscription
        shouldReloadGrid.value = false;
        setTimeout(() => {
          shouldReloadGrid.value = true;
          editModeUpdate(undefined);
        }, 100);
      }
    } catch (error) {
      throw error;
    }
    OnUpdateSelectedMantra({} as MantraType);
  };

  const onCancelMantra = () => {
    onResetMantra();
    editModeUpdate(undefined);
    // Restore to initial state on cancel
    if (SelectedMantra.value?.thumbnail?.url) {
      setImageUrl(SelectedMantra.value.thumbnail.url);
      setImageName(SelectedMantra.value.thumbnail.filename);
    }
    if (SelectedMantra.value?.video?.url) {
      setVideoUrl(SelectedMantra.value.video.url);
      setVideoName(SelectedMantra.value.video.filename);
    }
  };

  const onReloadMantra = () => {
    if (SelectedMantra.value) {
      const mantraData = { ...SelectedMantra.value };

      // Update local state
      mantra.value = mantraData;
      setImageUrl(mantraData.thumbnail?.url || null);
      setImageName(mantraData.thumbnail?.filename || null);
      setVideoUrl(mantraData.video?.url || null);
      setVideoName(mantraData.video?.filename || null);

      // Reset the form with the current data
      onResetMantra();
    }
  };

  const isEditButtonMode =
    !!mantraSelectedId.value || !!SelectedMantra.value?._id;
  const buttonText = isEditButtonMode ? t("update") : t("submit");

  const submitProps = useMemo(
    () => ({
      isLoading: mantraSaveIsLoading.value,
      label: buttonText,
      name: "SendHorizontal" as const,
      onPress: handleSubmit(onSubmitMantra),
    }),
    [t, mantraSaveIsLoading.value, handleSubmit, onSubmitMantra],
  );

  const cancelProps = useMemo(
    () => ({
      action: "secondary" as const,
      label: t("cancel"),
      name: "CircleX" as const,
      onPress: onCancelMantra,
    }),
    [t, onCancelMantra],
  );

  const activeProps = useMemo(
    () => ({
      control,
      label: t("active"),
      name: "active",
      disabled: false,
      value: mantra.value.active ?? true,
      className: "w-[30%] align-center flex",
    }),
    [control, t, mantra.value.active],
  );

  const nameLangProps = useMemo(
    () => ({
      control,
      name: "name",
      label: t("name"),
      rules: MantraValidation.name,
      error: errors.name,
      className: "w-full",
      disabled: false,
      radius: "full" as const,
      type: "text" as const,
      value: SelectedMantra.value?.name ?? {},
    }),
    [control, t, errors.name, SelectedMantra.value?.name],
  );

  const shortSummaryLangProps = useMemo(
    () => ({
      control,
      name: "shortSummary",
      label: t("shortDescription"),
      rules: MantraValidation.shortSummary,
      error: errors.shortSummary,
      className: "w-full",
      disabled: false,
      radius: "full" as const,
      type: "textarea" as const,
      value: SelectedMantra.value?.shortSummary ?? {},
    }),
    [control, t, errors.shortSummary, SelectedMantra.value?.shortSummary],
  );

  const summaryMdProps = useMemo(
    () => ({
      control,
      disabled: false,
      error: errors.summary,
      label: t("description"),
      name: "summary",
      value: SelectedMantra.value?.summary ?? {},
      rules: MantraValidation.summary,
    }),
    [t, errors.summary, MantraValidation.summary],
  );

  const isEditMode = !!mantraSelectedId.value || !!SelectedMantra.value?._id;
  const formTitle = isEditMode ? t("Edit Mantra") : t("Add Mantra");

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
        <form onSubmit={handleSubmit(onSubmitMantra)}>
          <div className="flex flex-col gap-4 w-full">
            <Skeleton
              className="rounded-lg"
              isLoaded={!mantraEntityIsLoading.value}
            >
              <TypeLang {...nameLangProps} />
            </Skeleton>

            <Skeleton
              className="rounded-lg"
              isLoaded={!mantraEntityIsLoading.value}
            >
              <TypeLang {...shortSummaryLangProps} />
            </Skeleton>

            <Skeleton
              className="rounded-lg"
              isLoaded={!mantraEntityIsLoading.value}
            >
              <TypeLangMd {...summaryMdProps} />
            </Skeleton>

            <Skeleton
              className="rounded-lg"
              isLoaded={!mantraEntityIsLoading.value}
            >
              <h5>{t("Attachment")}</h5>
              <div className="w-full flex justify-between">
                <div className="w-[50%]">
                  {imageUrl && (
                    <div className="mt-2">
                      <p>{t("imagePreview")}:</p>
                      <Image
                        key={imageUrl} // Force re-render on URL change
                        alt="Preview"
                        className="object-cover mx-auto mt-2 h-[25%]"
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
                      <p>{t("Video Preview")}:</p>
                      <video
                        key={videoUrl} // Force re-render on URL change
                        controls
                        className="w-[70%] h-[100%] mt-2"
                      >
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
        </form>
      </ContentLayout>
    </section>
  );
}

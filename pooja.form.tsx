import { Button, Image, Skeleton } from "@heroui/react";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { ConstKeys, FileType } from "dff-util";
import { PlayCircle, Upload } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  editModeUpdate,
  OnUpdateSelectedPooja,
  poojaListIsLoading,
  poojaSaveCall,
  poojaSaveIsLoading,
  poojaSelectedId,
  SelectedPooja,
  uploadFile,
} from "./common/service";
import { poojaInitValues, PoojaType } from "./common/types";
import { PoojaValidation } from "./common/validation";

import { ArticleLayout } from "@/layouts/article-layout";
import { ContentLayout } from "@/layouts/content-layout";
import TypeButton from "@/types/type.button";
import TypeLang from "@/types/type.lang";
import TypeLangMd from "@/types/type.lang-md";
import TypeSwitch from "@/types/type.switch";
import { ShowToast } from "@/utils/services/app.event";

export default function PoojaForm() {
  useSignals();
  const { t } = useTranslation();
  const pooja = useSignal<PoojaType>({ ...poojaInitValues });
  const [imageUrl, setImageUrl] = useState<string | null>(
    SelectedPooja.value?.thumbnail?.url || pooja.value.thumbnail?.url || null,
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(
    SelectedPooja.value?.video?.url || pooja.value.video?.url || null,
  );
  const [videoName, setVideoName] = useState<string | null>(
    SelectedPooja.value?.video?.filename || pooja.value.video?.filename || null,
  );
  const [imageName, setImageName] = useState<string | null>(
    SelectedPooja.value?.thumbnail?.filename ||
      pooja.value.thumbnail?.filename ||
      null,
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    onReloadPooja();

    return () => {
      if (!poojaSelectedId.value) {
        reset(poojaInitValues);
      }
    };
  }, [poojaSelectedId.value]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PoojaType>({
    defaultValues: pooja.value,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const onResetPooja = () => {
    reset({ ...pooja.value });
  };

  useEffect(() => {
    if (SelectedPooja.value) {
      if (SelectedPooja.value.video?.url) {
        setVideoUrl(SelectedPooja.value.video.url);
        setVideoName(SelectedPooja.value.video.filename);
      }
      if (SelectedPooja.value.thumbnail?.url) {
        setImageUrl(SelectedPooja.value.thumbnail.url);
        setImageName(SelectedPooja.value.thumbnail.filename);
      }

      const poojaData = { ...SelectedPooja.value };

      if (!poojaData.title && poojaData.nameLang?.["en-US"]) {
        poojaData.title = poojaData.nameLang["en-US"];
      }

      reset(poojaData);
    }
  }, [reset, SelectedPooja.value]);

  const onSubmitPooja = async (data: PoojaType) => {
    const [thumbnailResponse, videoResponse] = await handleFileUpload();

    // Set title from nameLang if available, otherwise use existing title
    data.title = data.nameLang?.["en-US"] || data.title || "";

    data.thumbnail = thumbnailResponse
      ? {
          url: thumbnailResponse.url,
          filename: thumbnailResponse.filename,
          mimetype: thumbnailResponse.mimetype,
        }
      : pooja.value.thumbnail || SelectedPooja.value?.thumbnail;
    data.video = videoResponse
      ? {
          url: videoResponse.url,
          filename: videoResponse.filename,
          mimetype: videoResponse.mimetype,
        }
      : pooja.value.video || SelectedPooja.value?.video;

    // Update display only with new uploads, otherwise retain current state
    if (thumbnailResponse) {
      setImageUrl(thumbnailResponse.url);
      setImageName(thumbnailResponse.filename);
      data.thumbnail = {
        url: thumbnailResponse.url,
        filename: thumbnailResponse.filename,
        mimetype: thumbnailResponse.mimetype,
      };
    } else if (fileInputRef.current?.files?.[0]) {
      // If user tried to upload a new file but it failed
      setImageUrl(null);
      setImageName(null);
      data.thumbnail = undefined;
    }

    if (videoResponse) {
      setVideoUrl(videoResponse.url);
      setVideoName(videoResponse.filename);
      data.video = {
        url: videoResponse.url,
        filename: videoResponse.filename,
        mimetype: videoResponse.mimetype,
      };
    } else if (videoInputRef.current?.files?.[0]) {
      setVideoUrl(null);
      setVideoName(null);
      data.video = undefined;
    }

    pooja.value = data;
    data.id = SelectedPooja.value?.id;
    OnUpdateSelectedPooja(data);
    try {
      const resp = await poojaSaveCall(data);

      if (resp) {
        ShowToast(t(ConstKeys.SAVED_SUCCESSFULLY), "success");
        editModeUpdate(undefined);
      }
    } catch (error) {
      throw error;
    }
    OnUpdateSelectedPooja({} as PoojaType);
  };

  const onCancelPooja = () => {
    onResetPooja();
    editModeUpdate(undefined);
    setImageUrl(null);
    setVideoUrl(null);
  };

  const onReloadPooja = () => {
    if (SelectedPooja.value) {
      const poojaData = { ...SelectedPooja.value };

      if (!poojaData.title && poojaData.nameLang?.["en-US"]) {
        poojaData.title = poojaData.nameLang["en-US"];
      }

      pooja.value = poojaData;
      setImageUrl(poojaData.thumbnail?.url || null);
      setImageName(poojaData.thumbnail?.filename || null);
      setVideoUrl(poojaData.video?.url || null);
      setVideoName(poojaData.video?.filename || null);
      reset(poojaData);
    }
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
    let thumbnailResponse: FileType | undefined;
    let videoResponse: FileType | undefined;

    try {
      if (fileInputRef.current?.files?.[0]) {
        thumbnailResponse = await uploadFile(fileInputRef.current.files[0]);
      }
    } catch (error) {
      setImageError("Failed to upload image. Please try again.");
      throw error;
    }

    try {
      if (videoInputRef.current?.files?.[0]) {
        videoResponse = await uploadFile(videoInputRef.current.files[0]);
      }
    } catch (error) {
      setVideoError("Failed to upload video. Please try again.");
      throw error;
    }

    return [thumbnailResponse, videoResponse];
  };

  const isEditButtonMode = !!poojaSelectedId.value || !!SelectedPooja.value?.id;
  const buttonText = isEditButtonMode ? t("update") : t("submit");

  const submitProps = useMemo(
    () => ({
      isLoading: poojaSaveIsLoading.value,
      label: buttonText,
      name: "SendHorizontal" as const,
      onPress: handleSubmit(onSubmitPooja),
    }),
    [t, poojaSaveIsLoading.value, handleSubmit, onSubmitPooja],
  );

  const cancelProps = useMemo(
    () => ({
      action: "secondary" as const,
      label: t("cancel"),
      name: "CircleX" as const,
      onPress: onCancelPooja,
    }),
    [t, onCancelPooja],
  );

  const activeProps = useMemo(
    () => ({
      control,
      label: t("active"),
      name: "active",
      disabled: false,
      value: pooja.value.active ?? true,
      className: "w-[30%] align-center flex",
    }),
    [control, t, pooja.value.active],
  );

  const nameLangProps = useMemo(
    () => ({
      control,
      name: "nameLang",
      label: t("name"),
      rules: PoojaValidation.nameLang,
      error: errors.nameLang,
      className: "w-full",
      disabled: false,
      radius: "full" as const,
      type: "text" as const,
      value: SelectedPooja.value?.nameLang ?? "",
    }),
    [
      control,
      t,
      errors.nameLang,
      SelectedPooja.value?.nameLang,
      PoojaValidation,
    ],
  );

  const shortSummaryLangProps = useMemo(
    () => ({
      control,
      name: "shortSummary",
      label: t("shortDescription"),
      rules: PoojaValidation.shortSummary,
      error: errors.shortSummary,
      className: "w-full",
      disabled: false,
      radius: "full" as const,
      type: "textarea" as const,
      value: SelectedPooja.value?.shortSummary ?? "",
    }),
    [
      control,
      t,
      errors.shortSummary,
      SelectedPooja.value?.shortSummary,
      PoojaValidation,
    ],
  );

  const summaryMdProps = useMemo(
    () => ({
      control,
      disabled: false,
      error: errors.summary,
      label: t("description"),
      name: "summary",
      value: SelectedPooja.value?.summary ?? "",
      rules: PoojaValidation.summary,
    }),
    [t, errors.summary, PoojaValidation.summary],
  );

  const isEditMode = !!poojaSelectedId.value || !!SelectedPooja.value?.id;
  const formTitle = isEditMode ? t("Edit Pooja") : t("Add Pooja");

  return (
    <>
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
          <form onSubmit={handleSubmit(onSubmitPooja)}>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-4">
                <Skeleton
                  className="rounded-lg"
                  isLoaded={!poojaListIsLoading.value}
                >
                  <TypeLang {...nameLangProps} />
                </Skeleton>
                <Skeleton
                  className="rounded-lg"
                  isLoaded={!poojaListIsLoading.value}
                >
                  <TypeLang {...shortSummaryLangProps} />
                </Skeleton>
                {/* {data.value.map((item, index) => (
                                <Skeleton className="rounded-lg" isLoaded={!poojaEntityIsLoading.value}>
                                    <TypeMdxEditor {...getSummaryLangProps(item, index)} />
                                </Skeleton>
                            ))} */}
                <Skeleton
                  className="rounded-lg"
                  isLoaded={!poojaListIsLoading.value}
                >
                  <TypeLangMd {...summaryMdProps} />
                </Skeleton>
                <Skeleton
                  className="rounded-lg"
                  isLoaded={!poojaListIsLoading.value}
                >
                  <h5>{t("Attachment")}</h5>
                  <div className="w-full flex justify-between">
                    <div className="w-[50%]">
                      {imageUrl ? (
                        <div className="mt-2">
                          <p>{t("imagePreview")}:</p>
                          <Image
                            alt="Preview"
                            className="object-cover mx-auto mt-2"
                            height={160}
                            src={imageUrl}
                            width={240}
                          />
                          <p>{imageName}</p>
                        </div>
                      ) : (
                        <div className="mt-2 text-gray-400">
                          {t("No image available")}
                        </div>
                      )}
                      <div className="flex mb-2">{t("thumbnailImage")}</div>
                      <Button
                        className="w-[80%]"
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
                        <p className="text-red-500 text-sm mt-2">
                          {imageError}
                        </p>
                      )}
                    </div>
                    <div className="w-[50%]">
                      {videoUrl ? (
                        <div className="mt-2">
                          <p>{t("videoPreview")}:</p>
                          <video
                            key={videoUrl}
                            controls
                            className="w-full max-w-[320px] h-[180px] mt-2"
                          >
                            <source src={videoUrl} type="video/mp4" />
                            <track
                              default
                              kind="captions"
                              label="English captions"
                              src="/path-to-captions.vtt"
                              srcLang="en"
                            />
                            {t("Your browser does not support the video tag.")}
                          </video>
                          <p>{videoName}</p>
                        </div>
                      ) : (
                        <div className="mt-2 text-gray-400">
                          {t("No video available")}
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
                        <p className="text-red-500 text-sm mt-2">
                          {videoError}
                        </p>
                      )}
                    </div>
                  </div>
                </Skeleton>
              </div>
            </div>
          </form>
        </ContentLayout>
      </section>
    </>
  );
}

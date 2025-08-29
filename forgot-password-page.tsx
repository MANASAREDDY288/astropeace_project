import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InputOtp } from "@heroui/react";

import { ForgotPasswordValidate } from "./common/validate";

import { checkLoginUser } from "@/utils/services/app.util";
import { RouterChange } from "@/utils/services/app.event";
import { AppRouter } from "@/utils/services/app.router";
import TypeInput from "@/types/type.input";
import TypeButton from "@/types/type.button";
import { AuthLayout } from "@/layouts/auth-layout";

// Forgot Password Email Form Component
const ForgotPassword = ({
  control,
  errors,
  onCancel,
  onSubmitEmail,
  handleSubmit,
}: {
  control: any;
  errors: any;
  onCancel: () => void;
  onSubmitEmail: (data: any) => void;
  handleSubmit: any;
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit(onSubmitEmail)}>
      <div className="flex flex-col gap-4">
        <TypeInput
          control={control}
          error={errors.email}
          label={t("userid")}
          name="email"
          rules={ForgotPasswordValidate.email}
          type="text"
        />
        <div className="flex justify-between gap-4">
          <TypeButton
            action="danger"
            label={t("backToLogin")}
            name="CornerUpLeft"
            onPress={onCancel}
          />
          <TypeButton
            label={t("submit")}
            onPress={handleSubmit(onSubmitEmail)}
          />
        </div>
      </div>
    </form>
  );
};

// Forgot Password OTP Form Component
const ForgotPasswordOtp = ({
  otpValue,
  setOtpValue,
  otpError,
  onCancelOtp,
  onSubmitOtp,
}: {
  otpValue: string;
  setOtpValue: (val: string) => void;
  otpError: string;
  onCancelOtp: () => void;
  onSubmitOtp: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <p className="text-lg text-gray-700">{t("otpSentSuccess")}</p>

      <div className="flex flex-col items-center mt-4">
        <div className="flex justify-center">
          <InputOtp
            description={t("enterOtp")}
            length={6}
            value={otpValue}
            onValueChange={(value: string) => {
              setOtpValue(value);
              if (value.length === 6) {
                // Clear error once OTP length is 6
                // This clearing is done outside (in parent)
              }
            }}
          />
        </div>

        {/* Reserve space for error to avoid layout shift */}
        <p className="text-sm text-red-600 mt-2 min-h-[20px]">
          {otpError ? otpError : ""}
        </p>
      </div>

      <div className="flex justify-between mt-4 space-x-4">
        <TypeButton
          action="danger"
          label={t("backToLogin")}
          name="CornerUpLeft"
          onPress={onCancelOtp}
        />
        <TypeButton
          className={
            otpValue.length === 6
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-200 text-white cursor-not-allowed"
          }
          disabled={otpValue.length < 6}
          label={t("submit")}
          onPress={onSubmitOtp}
        />
      </div>
    </div>
  );
};

export default function ForgotPasswordPage() {
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const isLogin = checkLoginUser();

    if (isLogin) {
      RouterChange(AppRouter.HOME);
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitEmail = () => {
    setIsEmailSubmitted(true);
  };

  const onSubmitOtp = () => {
    if (otpValue.length < 6) {
      setOtpError(t("otpLengthError"));

      return;
    }

    setOtpError("");
    RouterChange(AppRouter.ACCOUNT);
  };

  const onCancelOtp = () => {
    setOtpValue("");
    setOtpError("");
    setIsEmailSubmitted(false);
  };

  const onCancel = () => {
    RouterChange(AppRouter.LOGIN);
  };

  // Clear error when otpValue changes and length == 6
  useEffect(() => {
    if (otpValue.length === 6) {
      setOtpError("");
    }
  }, [otpValue]);

  const RenderSection = () => {
    return (
      <>
        <div className="flex flex-col items-center justify-center p-4">
          <section className="w-full">
            <h2 className="text-2xl font-semibold text-center mb-6">
              {t("forgotPassword")}
            </h2>

            {!isEmailSubmitted ? (
              <ForgotPassword
                control={control}
                errors={errors}
                handleSubmit={handleSubmit}
                onCancel={onCancel}
                onSubmitEmail={onSubmitEmail}
              />
            ) : (
              <ForgotPasswordOtp
                otpError={otpError}
                otpValue={otpValue}
                setOtpValue={setOtpValue}
                onCancelOtp={onCancelOtp}
                onSubmitOtp={onSubmitOtp}
              />
            )}
          </section>
        </div>
      </>
    );
  };

  return (
    <>
      <AuthLayout>{RenderSection()}</AuthLayout>
    </>
  );
}

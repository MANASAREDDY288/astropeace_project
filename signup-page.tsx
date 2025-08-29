import { useEffect, useState } from "react";
import { InputOtp } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ConstMessages } from "dff-util";

import { SignUpValidate } from "./common/validate";
import { verifySignUp } from "./common/services";

import { checkLoginUser } from "@/utils/services/app.util";
import { RouterChange, ShowToast } from "@/utils/services/app.event";
import { AppRouter } from "@/utils/services/app.router";
import TypeInput from "@/types/type.input";
import TypeButton from "@/types/type.button";
import { AuthLayout } from "@/layouts/auth-layout";

export default function SignUpPage() {
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
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

  const onSubmit = () => {
    setIsEmailSubmitted(true); // Set submitted state
  };

  const onCancelOtp = () => {
    setIsEmailSubmitted(false); // ✅ Return to sign-up form
  };

  const handleOtp = async (otp: number) => {
    try {
      // Call the verifySignUp function with the OTP
      const response = await verifySignUp(otp, "dummy_id");

      const message = response?.error?.message || ConstMessages.WENT_WRONG;

      ShowToast(message, "warning");
      // Handle the response accordingly
    } catch (error: any) {
      const message = error?.error?.message || ConstMessages.WENT_WRONG;

      ShowToast(message, "warning");
    }
  };

  const onCancel = () => {
    RouterChange(AppRouter.LOGIN);
  };

  return (
    <>
      <AuthLayout>
        <div className="flex flex-col items-center justify-center p-4">
          <section className="w-full p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">
              {t("signUp")}
            </h2>
            {!isEmailSubmitted ? (
              <form>
                <div className="flex flex-col gap-4">
                  <TypeInput
                    control={control}
                    error={errors.email}
                    label={t("fullName")}
                    name="name"
                    rules={SignUpValidate.name}
                  />
                  <TypeInput
                    control={control}
                    error={errors.email}
                    label={t("email")}
                    name="email"
                    rules={SignUpValidate.email}
                  />
                  <TypeInput
                    control={control}
                    error={errors.mobile}
                    label={t("mobileNumber")}
                    name="mobileNumber"
                    rules={SignUpValidate.phone}
                  />
                  <TypeInput
                    control={control}
                    error={errors.password}
                    label={t("password")}
                    name="password"
                    rules={SignUpValidate.password}
                  />

                  <div className="flex justify-between gap-4">
                    <TypeButton
                      action="danger"
                      label={t("backToLogin")}
                      name="CornerUpLeft"
                      onPress={onCancel}
                    />
                    {/* Submit Button */}
                    <TypeButton
                      label={t("submit")}
                      onPress={() => handleSubmit(onSubmit)()}
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-lg text-gray-700">{t("otpSentSuccess")}</p>

                {/* ✅ OTP Input Field */}
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4 ml-1 mt-4 items-center justify-center">
                  <InputOtp
                    description={t("enterOtp")}
                    length={6}
                    onChange={(event) => {
                      const target = event.target as HTMLInputElement;

                      if (target.value.length === 6) {
                        handleOtp(Number(target.value));
                      }
                    }}
                  />
                </div>

                {/* ✅ OTP Buttons */}
                <div className="flex justify-between mt-4 space-x-4">
                  <TypeButton
                    action="danger"
                    label={t("cancel")}
                    name="CircleX"
                    onPress={onCancelOtp}
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      </AuthLayout>
    </>
  );
}

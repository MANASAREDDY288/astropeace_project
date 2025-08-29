import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ConstKeys, JwtDecode } from "dff-util";

import { LoginValidate } from "./common/validate";
import { isSinginLoading, onSingin } from "./common/services";

import { checkLoginUser } from "@/utils/services/app.util";
import {
  CheckSession,
  RouterChange,
  ShowToast,
} from "@/utils/services/app.event";
import { AppRouter } from "@/utils/services/app.router";
import TypeInput from "@/types/type.input";
import TypeButton from "@/types/type.button";
import AppStorage, { SESSION_INFO, TOKEN } from "@/utils/services/app.storage";
import { AuthLayout } from "@/layouts/auth-layout";

export function LoginPage() {
  // const [isLoading, setIsLoading] = useState(false);
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
  } = useForm({
    defaultValues: {
      email: "admin@astropeace.org",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    const requestData = {
      userid: data.email,
      password: btoa(data.password),
      type: "admin",
      provider: "email",
    };

    const resp = await onSingin(requestData);

    if (resp) {
      AppStorage.setData(TOKEN, resp?.token);
      AppStorage.setData(SESSION_INFO, JwtDecode(resp?.token));
      CheckSession();
      RouterChange(AppRouter.DASHBOARD);
    } else {
      ShowToast(ConstKeys.ACCESS_DENIED, "danger");
    }
  };

  return (
    <>
      <AuthLayout>
        <div className="flex flex-col items-center justify-center p-4">
          <section className="w-full p-2">
            <h2 className="text-2xl font-semibold text-center mb-6">
              {t("signIn")}
            </h2>
            <form>
              <div className="flex flex-col gap-4">
                <TypeInput
                  control={control}
                  error={errors.email}
                  label={t("email")}
                  name="email"
                  rules={LoginValidate.email}
                  type="text"
                />

                <TypeInput
                  control={control}
                  error={errors.password}
                  label={t("password")}
                  name="password"
                  rules={LoginValidate.password}
                  type="password"
                />

                {/* Submit Button */}
                <div className="flex justify-between">
                  <TypeButton
                    action="primary"
                    label={t("forgotPassword")}
                    variant="light"
                    onPress={() => RouterChange(AppRouter.FORGOT_PASSWORD)}
                  />
                  <TypeButton
                    action="primary"
                    disabled={isSinginLoading.value}
                    isLoading={isSinginLoading.value}
                    label={isSinginLoading.value ? t("loading") : t("login")}
                    variant="solid"
                    onPress={handleSubmit(onSubmit)}
                  />
                </div>
              </div>
            </form>
            <div className="mt-4 text-center flex justify-center flex-col lg:flex-row md:flex-row">
              <p className="text-sm text-gray-600">
                {t("noAccount")}&nbsp;
                <TypeButton
                  action="primary"
                  className="p-0"
                  label={t("signUp")}
                  variant="light"
                  onPress={() => RouterChange(AppRouter.SIGN_UP)}
                />
                {/* <TypeDatePicker className="w-full" isDateTimeEnabled={true} /> */}
              </p>
            </div>
          </section>
        </div>
      </AuthLayout>
    </>
  );
}

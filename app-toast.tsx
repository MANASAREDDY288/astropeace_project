"use client";

import { useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { addToast, ToastProvider } from "@heroui/toast";

import { ToastMessage } from "@/utils/services/app.event";

const AppToast = () => {
  useSignals();

  useEffect(() => {
    if (ToastMessage.value.show) {
      addToast({
        description: ToastMessage.value.message,
        color: ToastMessage.value?.type || "success",
        variant: "flat", // "success", "error", "info"
      });

      // Hide toast after triggering
      ToastMessage.value = { ...ToastMessage.value, show: false };
    }
  }, [ToastMessage.value.show]);

  return <ToastProvider placement={"top-right"} />;
};

export default AppToast;

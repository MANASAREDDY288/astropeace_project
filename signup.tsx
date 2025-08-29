import { Suspense } from "react";

import { SkeletonLoginForm } from "@/skeleton/skeleton-login-form";
import { AuthLayout } from "@/layouts/auth-layout";
import SignUpPage from "@/modules/auth/signup-page";

export default function SignUp() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <SignUpPage />
    </Suspense>
  );
}

function SkeletonPage() {
  return (
    <AuthLayout>
      <SkeletonLoginForm />
    </AuthLayout>
  );
}

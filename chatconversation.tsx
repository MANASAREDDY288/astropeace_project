import { Suspense } from "react";

import { ArticleLayout } from "@/layouts/article-layout";
import { ContentLayout } from "@/layouts/content-layout";
import { FloatLayout } from "@/layouts/float-layout";
import { SkeletonFloat } from "@/skeleton/skeleton-float";
import { SkeletonArticle } from "@/skeleton/skeleton-article";
import { SkeletonAccountForm } from "@/skeleton/skeleton-account-form";
import ChatConversationPage from "@/modules/chatconversation/chatconversation.page";
import { ScreenAccess } from "@/utils/services/app.event";
import PermissionDenied from "@/components/permission-denied";
export default function Chatconversation() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      {ScreenAccess.value.read ? (
        <ChatConversationPage />
      ) : (
        <PermissionDenied />
      )}
    </Suspense>
  );
}

function SkeletonPage() {
  return (
    <>
      <ArticleLayout>
        <SkeletonArticle />
      </ArticleLayout>
      <ContentLayout>
        <SkeletonAccountForm />
      </ContentLayout>
      <FloatLayout>
        <SkeletonFloat />
      </FloatLayout>
    </>
  );
}

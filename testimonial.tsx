import { Suspense } from "react";

import { ArticleLayout } from "@/layouts/article-layout";
import { ContentLayout } from "@/layouts/content-layout";
import { FloatLayout } from "@/layouts/float-layout";
import { SkeletonFloat } from "@/skeleton/skeleton-float";
import { SkeletonArticle } from "@/skeleton/skeleton-article";
import { ClienttestimonialPage } from "@/modules/clientTestimonial/clienttestimonial.page";
import { SkeletonTable } from "@/skeleton/skeleton-table";
import { ScreenAccess } from "@/utils/services/app.event";
import PermissionDenied from "@/components/permission-denied";

export default function Clienttestimonial() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      {ScreenAccess.value.read ? (
        <ClienttestimonialPage />
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
        <SkeletonTable />
      </ContentLayout>
      <FloatLayout>
        <SkeletonFloat />
      </FloatLayout>
    </>
  );
}

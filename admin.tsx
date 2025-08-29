import { Suspense } from "react";

import { PageLayout } from "@/layouts/page-layout";
import { ArticleLayout } from "@/layouts/article-layout";
import { ContentLayout } from "@/layouts/content-layout";
import { SkeletonArticle } from "@/skeleton/skeleton-article";
import { SkeletonTable } from "@/skeleton/skeleton-table";
import { ScreenAccess } from "@/utils/services/app.event";
import PermissionDenied from "@/components/permission-denied";
import ComingSoonScreen from "@/modules/coming-soon/ComingSoon";

export default function AdminScreen() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      {ScreenAccess.value.read ? <ComingSoonScreen /> : <PermissionDenied />}
    </Suspense>
  );
}

function SkeletonPage() {
  return (
    <PageLayout>
      <ArticleLayout>
        <SkeletonArticle />
      </ArticleLayout>
      <ContentLayout>
        <SkeletonTable />
      </ContentLayout>
    </PageLayout>
  );
}

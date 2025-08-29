import { Suspense } from "react";

import { PageLayout } from "@/layouts/page-layout";
import { ArticleLayout } from "@/layouts/article-layout";
import { ContentLayout } from "@/layouts/content-layout";
import { SkeletonArticle } from "@/skeleton/skeleton-article";
import { SkeletonTable } from "@/skeleton/skeleton-table";
import { ScreenAccess } from "@/utils/services/app.event";
import PermissionDenied from "@/components/permission-denied";
import { SubscriptionPlanPage } from "@/modules/settings/subscriptionplans/subscriptionplans.page";

export default function SubscriptionPlans() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      {ScreenAccess.value.read ? (
        <SubscriptionPlanPage />
      ) : (
        <PermissionDenied />
      )}
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

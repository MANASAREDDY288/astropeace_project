import { useEffect, Suspense } from "react";
import { useSignals } from "@preact/signals-react/runtime";

import { ArticleLayout } from "@/layouts/article-layout";
import { ContentLayout } from "@/layouts/content-layout";
import { FloatLayout } from "@/layouts/float-layout";
import { SkeletonArticle } from "@/skeleton/skeleton-article";
import { SkeletonFloat } from "@/skeleton/skeleton-float";
import { SkeletonTable } from "@/skeleton/skeleton-table";
import { ScreenAccess } from "@/utils/services/app.event";
import DashboardPage from "@/modules/home/dashboard/page";
import PermissionDenied from "@/components/permission-denied";
export default function Dashboard() {
  useSignals();

  useEffect(() => {}, []);

  return (
    <Suspense fallback={<SkeletonPage />}>
      {ScreenAccess.value.read ? <DashboardPage /> : <PermissionDenied />}
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

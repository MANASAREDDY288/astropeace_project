import { Suspense } from "react";

import { ArticleLayout } from "@/layouts/article-layout";
import { ContentLayout } from "@/layouts/content-layout";
import { FloatLayout } from "@/layouts/float-layout";
import { SkeletonFloat } from "@/skeleton/skeleton-float";
import { SkeletonArticle } from "@/skeleton/skeleton-article";
import { AccountPage } from "@/modules/account/page";
import { SkeletonAccountForm } from "@/skeleton/skeleton-account-form";
import { PageLayout } from "@/layouts/page-layout";

export default function Account() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <AccountPage />
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
        <SkeletonAccountForm />
      </ContentLayout>
      <FloatLayout>
        <SkeletonFloat />
      </FloatLayout>
    </PageLayout>
  );
}

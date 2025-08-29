import { Suspense } from "react";

import { SiteInfoPage } from "@/modules/siteinfo/siteinfo.page";

// import { ArticleLayout } from "@/layouts/article-layout";
// import { ContentLayout } from "@/layouts/content-layout";
// import { FloatLayout } from "@/layouts/float-layout";
// import { SkeletonFloat } from "@/skeleton/skeletion-float";
// import { SkeletonArticle } from "@/skeleton/skeleton-article";
// import { SkeletonAccountForm } from "@/skeleton/skeleton-account-form";

export default function Site() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <SiteInfoPage />
    </Suspense>
  );
}

function SkeletonPage() {
  return (
    <>
      {/* <ArticleLayout>
        <SkeletonArticle />
      </ArticleLayout>
      <ContentLayout>
        <SkeletonAccountForm />
      </ContentLayout>
      <FloatLayout>
        <SkeletonFloat />
      </FloatLayout> */}
    </>
  );
}

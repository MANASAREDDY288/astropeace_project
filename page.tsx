import { useTranslation } from "react-i18next";

import { ArticleLayout } from "@/layouts/article-layout";
import { ContentLayout } from "@/layouts/content-layout";
import { FloatLayout } from "@/layouts/float-layout";
import { SkeletonAccountForm } from "@/skeleton/skeleton-account-form";
import TypeButton from "@/types/type.button";

export function AccountPage() {
  const { t } = useTranslation();
  const onAdd = () => {};

  const RenderArticle = () => {
    return (
      <aside className="flex justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">{t("account")}</h2>
        </div>
        <div className="flex gap-2">
          <TypeButton
            action="success"
            label={t("submit")}
            name="SendHorizontal"
            onPress={onAdd}
          />
        </div>
      </aside>
    );
  };
  const RenderSection = () => {
    return (
      <aside>
        <SkeletonAccountForm />
      </aside>
    );
  };

  const RenderFloat = () => {
    return (
      <TypeButton action="primary" label="" name="RotateCcw" onPress={onAdd} />
    );
  };

  return (
    <>
      <ArticleLayout>
        <RenderArticle />
      </ArticleLayout>
      <ContentLayout>
        <RenderSection />
      </ContentLayout>
      <FloatLayout>
        <RenderFloat />
      </FloatLayout>
    </>
  );
}

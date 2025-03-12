import { getEventCategoryByName } from "@/features/event_categories/queries/get_event_category_by_name";
import { getCategoriesWithEventCounts } from "@/features/event_categories/server/event_categories.service";
import { getUserByExternalId } from "@/features/users/server/user.service";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import DashboardPage from "../../page";
import { DashboardPageContent } from "@/app/components/dashboard_page_content";
import { CategoryPageContent } from "./category_page_content";

interface CategoryPageProps {
  params: Promise<{
    name: string | string[] | undefined;
  }>;
}

const CategoryPage = async ({ params: paramsPromise }: CategoryPageProps) => {
  const params = await paramsPromise;
  if (typeof params.name === "undefined") {
    return notFound();
  }

  const auth = await currentUser();
  if (!auth) {
    return notFound();
  }

  const user = await getUserByExternalId(auth.id);

  if (!user) {
    return notFound();
  }

  const category = await getEventCategoryByName(
    [params.name].flat()[0],
    user.id,
  );

  if (!category) {
    return notFound();
  }

  const [{ event_count }] = await getCategoriesWithEventCounts(
    [category.id],
    {},
  );

  const hasEvents = event_count > 0;

  return (
    <DashboardPageContent title={`${category.emoji} ${category.name} events`}>
      <CategoryPageContent category={category} hasEvents={hasEvents} />
    </DashboardPageContent>
  );
};

export default CategoryPage;

"use client";

import { useCategoryHasEvents } from "@/features/event_categories/api/queries/use_category_has_events";
import { EventCategory } from "@/server/__internals/db/schemas";
import { useQuery } from "@tanstack/react-query";
import { EmptyCategoryState } from "./empty_category_state";

interface CategoryPageContentProps {
  hasEvents: boolean;
  category: EventCategory;
}

export const CategoryPageContent = ({
  hasEvents,
  category,
}: CategoryPageContentProps) => {
  const { data: pollingData } = useCategoryHasEvents(category.name, hasEvents);

  console.log({ pollingData });
  if (!pollingData?.hasEvents) {
    return <EmptyCategoryState categoryName={category.name} />;
  }

  return (
    <div>
      <h1>Category Page Content</h1>
    </div>
  );
};

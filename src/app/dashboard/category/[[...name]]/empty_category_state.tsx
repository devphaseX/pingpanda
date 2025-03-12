"use client";

import { Card } from "@/app/components/card";
import { useCategoryHasEvents } from "@/features/event_categories/api/queries/use_category_has_events";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface EmptyCategoryStateProps {
  categoryName: string;
}

export const EmptyCategoryState = ({
  categoryName,
}: EmptyCategoryStateProps) => {
  const router = useRouter();
  const { data, isPending } = useCategoryHasEvents(categoryName);

  useEffect(() => {
    if (data?.hasEvents) {
      router.refresh();
    }
  }, [data?.hasEvents]);

  return (
    <Card
      contentClassName="max-w-2xl w-full flex flex-col items-center p-6"
      className="flex-1 flex items-center justify-center"
    >
      <h2 className="text-xl/8 font-medium text-center tracking-tight text-gray-950">
        Create your first {categoryName} event
      </h2>
    </Card>
  );
};

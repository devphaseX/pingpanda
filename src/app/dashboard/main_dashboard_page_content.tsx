"use client";

import { format, formatDistanceToNow } from "date-fns";
import { useGetEventCategories } from "@/features/event_categories/api/queries/use_get_event_categories";
import { LoadingSpinner } from "../components/loading_spinner";
import { ArrowRight, BarChart2, Clock, Database, Trash } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../components/ui/button";
import { Modal } from "../components/ui/modal";
import { useState } from "react";
import { useDeleteEventCategory } from "@/features/event_categories/api/mutations/use_delete_event_category";

const MainDashboardPageContent = () => {
  const { data: categories, isPending: isEventCategoriesPending } =
    useGetEventCategories();

  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const {
    mutateAsync: deleteEventCategory,
    isPending: isDeleteEventCategoryPending,
  } = useDeleteEventCategory();

  if (isEventCategoriesPending) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <p>No categories found.</p>
      </div>
    );
  }

  console.log({ deletingCategory });

  return (
    <>
      <ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category) => (
          <li
            key={category.id}
            className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="absolute z-0 inset-px rounded-lg bg-white" />
            <div
              className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm
            transition-all duration-200 group-hover:shadow-md ring-1 ring-black/5"
            />
            <div className="relative p-6 z-10">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="size-12 rounded-full"
                  style={{
                    backgroundColor: category.colour
                      ? `#${category.colour.toString(16).padStart(6, "0")}`
                      : "#f3f4f6",
                  }}
                />

                <div>
                  <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
                    {category.emoji ?? "📂️"} {category.name}
                  </h3>
                  <p className="text-sm/6 text-gray-600">
                    {format(category.created_at!, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <Clock className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium">Last Ping:</span>
                  <span className="ml-1">
                    {category.last_event_created_at
                      ? formatDistanceToNow(category.last_event_created_at) +
                        " ago"
                      : "Never"}
                  </span>
                </div>
                <div className="flex items-center text-sm/5 text-gray-600">
                  <Database className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium">Unqiue fields:</span>
                  <span className="ml-1">{category.tracking_field_counts}</span>
                </div>
                <div className="flex items-center text-sm/5 text-gray-600">
                  <BarChart2 className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium">Events this month:</span>
                  <span className="ml-1">{category.event_count}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Link
                  href={`/dashboard/category/${encodeURI(category.name)}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "flex items-center gap-2 text-sm",
                  })}
                >
                  <ArrowRight className="size-4" /> View All
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  aria-label={`Delete ${category.name} category`}
                  onClick={() => setDeletingCategory(category.name)}
                >
                  <Trash className="size-5" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        showModal={!!deletingCategory}
        setShowModal={() => setDeletingCategory(null)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Delete Category
            </h2>
            <p className="text-sm/6 text-gray-600">
              Are you sure you want to delete this category "{deletingCategory}
              "? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setDeletingCategory(null)}
              disabled={isDeleteEventCategoryPending}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={isDeleteEventCategoryPending}
              onClick={() =>
                deleteEventCategory(deletingCategory!, {
                  onSuccess: () => setDeletingCategory(null),
                })
              }
            >
              {isDeleteEventCategoryPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export { MainDashboardPageContent };

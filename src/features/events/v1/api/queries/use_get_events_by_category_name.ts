import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { GetEventsByCategoryNameQuery } from "../../schemas/get_events_by_category_name_schema";
import { client } from "@/lib/client";

export const useGetEventsByCategoryName = (
  categoryName: string,
  initialQuery: Omit<GetEventsByCategoryNameQuery, "category_name">,
) => {
  return useInfiniteQuery({
    queryKey: ["events_by_category_name", initialQuery],
    queryFn: async ({ pageParam }) => {
      const response = await client.api.v1.events.$get({
        query: {
          page: String(pageParam),
          perPage: initialQuery.perPage
            ? String(initialQuery.perPage)
            : undefined,
          period: initialQuery.period,
          category_name: categoryName,
        },
      });

      const payload = await response.json();

      if (!payload.success) {
        throw new Error(payload.message ?? "failed to get events");
      }

      return payload;
    },

    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      return lastPage.metdata.nextPage ?? undefined;
    },
    initialPageParam: initialQuery.page ?? 1,
    staleTime: 1000 * 60 * 5,
  });
};

import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useEffect } from "react";

type ResponseType = InferResponseType<
  (typeof client.api)["event-categories"]["poll"]["$get"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["event-categories"]["poll"]["$get"]
>;

export const useCategoryHasEvents = (
  categoryName: string,
  initialHasEventCheck?: boolean,
) => {
  const query = useQuery({
    queryKey: ["category", categoryName, "hasEvents"],
    queryFn: async () => {
      const response = await client.api["event-categories"]["poll"].$get({
        query: { category_name: categoryName },
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
      return data.data;
    },

    refetchInterval: (query) => {
      return query?.state?.data?.hasEvents ? false : 5000;
    },

    initialData: { hasEvents: initialHasEventCheck ?? false },
  });

  return query;
};

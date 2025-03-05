import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";

export const useGetEventCategories = () => {
  return useQuery({
    queryKey: ["event_categories"],
    queryFn: async () => {
      const response = await client.api["event-categories"].$get();
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message ?? "Failed to fetch event categories");
      }

      return data.categories;
    },
  });
};

import { client } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteEventCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryName: string) => {
      const response = await client.api["event-categories"][
        ":categoryName"
      ].$delete({ param: { categoryName } });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data;
    },
    mutationKey: ["deleteEventCategory"],

    onSettled: async (res) => {
      const eventCategoryId = res?.id;

      if (eventCategoryId) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["event_categories"] }),
          queryClient.invalidateQueries({
            queryKey: ["event_category", eventCategoryId],
          }),
        ]);
      }
    },
  });
};

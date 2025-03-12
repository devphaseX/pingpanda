import { client } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSetupQuickStartEventCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["bulk_create_event_categories"],
    mutationFn: async () => {
      const response =
        await client.api["event-categories"]["quick-start"].$post();

      const payload = await response.json();

      if (!payload.success) {
        throw new Error(payload.message);
      }

      return payload.data.eventCategories;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["event_categories"] });
    },
  });
};

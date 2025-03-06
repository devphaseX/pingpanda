import { client } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateEventCategoryInput } from "../../schemas/create_event_categories";

export const useCreateEventCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create_event_category"],
    mutationFn: async (data: CreateEventCategoryInput) => {
      const response = await client.api["event-categories"].$post({
        json: data,
      });

      const payload = await response.json();

      if (!payload.success) {
        throw new Error(payload.message);
      }

      return payload.eventCategory;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["event_categories"] });
    },
  });
};

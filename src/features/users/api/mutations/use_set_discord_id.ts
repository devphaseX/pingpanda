import { client } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { useGetCurrentUser } from "../queries/use_get_current_user";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api)["users"]["discord"]["$patch"]
>;

export const useSetDiscordId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["setDiscordId"],
    mutationFn: async (data: RequestType) => {
      const response = await client.api.users.discord.$patch(data);

      const payload = await response.json();

      if (!payload.success) {
        throw new Error(payload.message);
      }

      return payload.data;
    },

    onSuccess: async () => {
      toast.success("Discord ID set successfully!");
      await queryClient.invalidateQueries({ queryKey: ["current_user"] });
    },
  });
};

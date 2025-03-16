import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["current_user"],
    queryFn: async () => {
      const response = await client.api.users.current.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch current user");
      }

      const payload = await response.json();
      if (!payload.success) {
        throw new Error(payload.message ?? "Failed to fetch current user");
      }

      return payload.user;
    },
  });
};

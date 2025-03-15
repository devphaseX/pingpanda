import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetUsage = () => {
  return useQuery({
    queryKey: ["product_usage"],
    queryFn: async () => {
      const response = await client.api.quotas.usage.$get();

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return data.data;
    },
  });
};

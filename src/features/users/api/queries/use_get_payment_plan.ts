import { client } from "@/lib/client";
import { Plan } from "@/server/__internals/constants/enums";
import { useQuery } from "@tanstack/react-query";

export const useGetPaymentPlan = () => {
  return useQuery({
    queryKey: ["payment_plan"],
    queryFn: async () => {
      const response = await client.api.users.plan.$get();

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      return data.plan;
    },

    refetchInterval: (query) => {
      if (query.state.data === Plan.PRO) {
        return false;
      }
      return 1000;
    },
  });
};

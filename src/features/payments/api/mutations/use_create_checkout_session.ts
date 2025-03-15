import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";

export const useCheckoutSession = () => {
  return useMutation({
    mutationKey: ["checkout_session"],
    mutationFn: async () => {
      const response = await client.api.payments.checkout.$post();

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message ?? "Failed to create checkout session");
      }

      return data;
    },
  });
};

"use client";

import { format } from "date-fns";
import { Card } from "@/app/components/card";
import { useCheckoutSession } from "@/features/payments/api/mutations/use_create_checkout_session";
import { useGetUsage } from "@/features/quotas/api/queries/use_get_usuage";
import { Plan } from "@/server/__internals/constants/enums";
import { BarChart } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradePageContentProps {
  plan: Plan;
}

export const UpgradePageContent = ({ plan }: UpgradePageContentProps) => {
  const router = useRouter();
  const { mutate } = useCheckoutSession();

  function createCheckoutSession() {
    mutate(undefined, {
      onSuccess: ({ url }) => {
        if (url) {
          router.push(url);
        }
      },
    });
  }

  const { data: planUsage } = useGetUsage();

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      <div>
        <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
          {plan === Plan.PRO ? "Plan: Pro" : "Plan: Free"}
        </h1>
        <p className="text-sm/6 text-gray-600 max-w-prose">
          {plan === Plan.PRO
            ? "Thank you for supporting PingPanda. Find your increased usage limits below."
            : "Get access to more events, categories and premium support."}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-brand-700">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Total Events</p>

            <BarChart className="size-4 text-muted-foreground" />

            <div>
              <p className="text-2xl font-bold">
                {planUsage?.events_used ?? 0} of{" "}
                {planUsage?.events_limit.toLocaleString() ?? 100}
              </p>

              <p className="text-xs/5 text-muted-foreground">
                Events this period
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Event Categories</p>

            <BarChart className="size-4 text-muted-foreground" />

            <div>
              <p className="text-2xl font-bold">
                {planUsage?.categories_used ?? 0} of{" "}
                {planUsage?.categories_limit.toLocaleString() ?? 10}
              </p>

              <p className="text-xs/5 text-muted-foreground">
                Active categories
              </p>
            </div>
          </div>
        </Card>
      </div>

      <p className="text-sm text-gray-500">
        Usage will reset{" "}
        {planUsage?.reset_date ? (
          format(planUsage.reset_date, "MMMM d, yyyy")
        ) : (
          <span className="animate-pulse w-8 h-4 bg-gray-200 "></span>
        )}
        {plan !== Plan.PRO ? (
          <p
            className="inline cursor-pointer underline text-brand-600"
            onClick={() => {
              createCheckoutSession();
            }}
          >
            {" "}
            or upgrade now to increase your limit &rarr;
          </p>
        ) : null}
      </p>
    </div>
  );
};

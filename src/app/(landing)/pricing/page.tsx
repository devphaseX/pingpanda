"use client";

import { Heading } from "@/app/components/heading";
import { MaxWidthWrapper } from "@/app/components/max_width_wrapper";
import { Button } from "@/app/components/ui/button";
import { useCheckoutSession } from "@/features/payments/api/mutations/use_create_checkout_session";
import { useUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const PricingPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const INCLUDED_FEATURES = [
    "10,000 real-time events per month",
    "10 event categories",
    "Advanced analytics and insights",
    "Priority support",
  ];

  const { mutate } = useCheckoutSession();

  function createCheckoutSession() {
    if (!user) {
      router.push("/sign-in?intent=upgrade");
      return;
    }

    mutate(undefined, { onSuccess: ({ url }) => url && router.push(url) });
  }

  return (
    <div className="bg-brand-25 py-24 sm:py-32">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-2xl sm:text-center">
          <Heading>Simple no-tricts pricing</Heading>
          <p className="mt-6 text-base/7 text-gray-600 max-w-prose text-center text-pretty">
            We hate subscriptions. And chances are, you do too. That's why we
            offer lifetime access to PingPanda for one-time payments.
          </p>
        </div>

        <div className="bg-white mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-3xl font-heading font-semibold tracking-tight text-gray-900">
              Lifetime access
            </h3>

            <p className="mt-6 text-base/7 text-gray-600">
              Invest once in PingPanda and transform how you monitor your SaaS
              forever. Get instant alerts, track critical metrics and never miss
              a beat in your business growth
            </p>

            <p className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-brand-600">
                What's included?
              </h4>

              <div className="h-px flex-auto bg-gray-100" />
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6">
              {INCLUDED_FEATURES.map((feat, i) => (
                <li key={i} className="flex gap-3">
                  <CheckIcon className="h-6 w-5 flex-none text-brand-700" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs py-8">
                <p className="text-base font-semibold text-gray-600">
                  Pay once, own forever
                </p>

                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    $49
                  </span>

                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    USD
                  </span>
                </p>

                <Button onClick={createCheckoutSession} className="mt-6 px-20">
                  Get PingPanda
                </Button>

                <p className="mt-6 text-xs leading-5 text-gray-600">
                  Secure payments. Start monitoriing in minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
export default PricingPage;

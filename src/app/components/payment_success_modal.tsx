"use client";

import { useGetPaymentPlan } from "@/features/users/api/queries/use_get_payment_plan";
import { Plan } from "@/server/__internals/constants/enums";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "./ui/modal";
import { LoadingSpinner } from "./loading_spinner";
import { Button } from "./ui/button";
import { CheckIcon } from "lucide-react";

export const PaymentSuccessModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const { data: plan, isPending } = useGetPaymentPlan();

  const handleClose = () => {
    setIsOpen(false);
    router.push("/dashboard");
  };

  const isPaymentCompleted = true;

  return (
    <Modal
      showModal={isOpen}
      setShowModal={setIsOpen}
      onClose={handleClose}
      className="px-6 pt-6"
      preventDefaultClose={!isPaymentCompleted}
    >
      <div className="flex flex-col items-center">
        {isPending || !isPaymentCompleted ? (
          <div className="flex flex-col items-center justify-center h-64">
            <LoadingSpinner className="mb-4" />
            <p className="text-lg/7 font-medium text-gray-900">
              Upgrading your account...
            </p>

            <p className="text-gray-600 text-sm/6 mt-3 text-center text-pretty">
              Please wait while we process your upgrade. This may take a moment.
            </p>
          </div>
        ) : (
          <>
            <div className="relative aspect-video border border-gray-200 w-full overflow-hidden rounded-lg bg-gray-50 h-full">
              <img
                src="/brand-asset-heart.png"
                className="h-full w-full object-cover"
                alt="Payment Success"
              />

              <div className="mt-6 flex flex-col items-center gap-1 text-center">
                <p className="text-lg/7 tracking-tight font-medium text-pretty">
                  Upgrade Successful!
                </p>

                <p className="text-gray-600 text-sm/6 text-pretty">
                  Thank your for upgrading to Pro and supporting PingPanda. Your
                  account has been upgraded successfully.
                </p>

                <div className="mt-8 w-full">
                  <Button onClick={handleClose} className="h-12 w-full">
                    <CheckIcon className="mr-2 size-5" />
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

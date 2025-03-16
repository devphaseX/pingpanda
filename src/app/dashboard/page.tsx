import { getUserByExternalId } from "@/features/users/server/user.service";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardPageContent } from "../components/dashboard_page_content";
import { MainDashboardPageContent } from "./main_dashboard_page_content";
import { CreateEventCategoryModal } from "../components/create_event_category_modal";
import { Button } from "../components/ui/button";
import { PlusIcon } from "lucide-react";
import { createCheckoutSession } from "@/lib/stripe";
import { getEnv } from "@/server/__internals/env";
import { PaymentSuccessModal } from "../components/payment_success_modal";

interface DashboardPageProps {
  searchParams: Promise<{ intent?: "upgrade"; success?: boolean }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const auth = await currentUser();

  if (!auth) {
    return redirect("/sign-in");
  }

  const { intent, success } = await searchParams;
  const user = await getUserByExternalId(auth.id);

  if (!user) {
    return redirect("/sign-in");
  }

  if (intent === "upgrade") {
    const successUrl = `${getEnv("NEXT_PUBLIC_APP_URL")}/dashboard?success=true`;
    const cancelUrl = `${getEnv("NEXT_PUBLIC_APP_URL")}/pricing`;
    const session = await createCheckoutSession({
      userId: user.id,
      successUrl,
      cancelUrl,
      userEmail: user.email,
    });

    if (session.url) {
      return redirect(session.url);
    }
  }

  return (
    <>
      {success ? <PaymentSuccessModal /> : null}
      <DashboardPageContent
        cta={
          <CreateEventCategoryModal>
            <Button className="w-full sm:w-fit">
              <PlusIcon className="size-4 mr-2" /> Add Category
            </Button>
          </CreateEventCategoryModal>
        }
        title="Dashboard"
      >
        <MainDashboardPageContent></MainDashboardPageContent>
      </DashboardPageContent>
    </>
  );
};

export default DashboardPage;

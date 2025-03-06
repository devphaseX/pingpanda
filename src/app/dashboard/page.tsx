import { getUserByExternalId } from "@/features/users/server/user.service";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardPageContent } from "../components/dashboard_page_content";
import { MainDashboardPageContent } from "./main_dashboard_page_content";
import { CreateEventCategoryModal } from "../components/create_event_category_modal";
import { Button } from "../components/ui/button";
import { PlusIcon } from "lucide-react";

const DashboardPage = async () => {
  const auth = await currentUser();

  if (!auth) {
    return redirect("/sign-in");
  }

  const user = await getUserByExternalId(auth.id);

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <DashboardPageContent
      cta={
        <CreateEventCategoryModal>
          <Button>
            <PlusIcon className="size-4 mr-2" /> Add Category
          </Button>
        </CreateEventCategoryModal>
      }
      title="Dashboard"
    >
      <MainDashboardPageContent></MainDashboardPageContent>
    </DashboardPageContent>
  );
};

export default DashboardPage;
